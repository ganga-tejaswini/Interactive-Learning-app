import json
import os
import sqlite3
from datetime import date, datetime, timedelta
from functools import wraps

from dotenv import load_dotenv

from flask import (
    Flask,
    flash,
    g,
    jsonify,
    redirect,
    render_template,
    request,
    session,
    url_for,
)
from werkzeug.security import check_password_hash, generate_password_hash

try:
    from google import genai as google_genai
except ImportError:
    google_genai = None


load_dotenv(override=True)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.path.join(BASE_DIR, "database.db")
SUBJECTS = ["Physics", "Chemistry", "Biology", "Mathematics", "Computer Science"]

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-change-this-secret")


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(_error):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    db = get_db()
    db.executescript(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS quiz_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            subject TEXT NOT NULL,
            topic TEXT NOT NULL,
            score INTEGER NOT NULL,
            total INTEGER NOT NULL,
            questions_json TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );

        CREATE TABLE IF NOT EXISTS learning_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            subject TEXT NOT NULL,
            topic TEXT NOT NULL,
            activity_type TEXT NOT NULL,
            detail TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );

        CREATE TABLE IF NOT EXISTS notes_summaries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            subject TEXT NOT NULL,
            title TEXT NOT NULL,
            original_notes TEXT NOT NULL,
            summary TEXT NOT NULL,
            key_points TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );
        """
    )
    db.commit()


with app.app_context():
    init_db()


def current_user():
    user_id = session.get("user_id")
    if not user_id:
        return None
    return get_db().execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()


@app.before_request
def load_logged_in_user():
    g.user = current_user()


def login_required(view):
    @wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            flash("Please log in to continue.", "warning")
            return redirect(url_for("login"))
        return view(**kwargs)

    return wrapped_view


def add_history(subject, topic, activity_type, detail=""):
    if not g.user:
        return
    get_db().execute(
        """
        INSERT INTO learning_history (user_id, subject, topic, activity_type, detail, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (g.user["id"], subject, topic, activity_type, detail, datetime.utcnow().isoformat()),
    )
    get_db().commit()


def gemini_text(prompt):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        app.logger.error("GEMINI_API_KEY not found in environment")
        return {"error": "API key is missing."}
    model = os.environ.get("GEMINI_MODEL", "models/gemini-flash-lite-latest")
    app.logger.info("Sending tutor prompt to Gemini model: %s", model)
    try:
        if google_genai is not None:
            client = google_genai.Client(api_key=api_key)
            response = client.models.generate_content(
                model=model,
                contents=prompt,
            )
            return response.text.strip()
        app.logger.error("google.genai module not available")
        return {"error": "AI client library is not installed."}
    except Exception as exc:
        error_text = str(exc)
        app.logger.error("Gemini request failed: %s", error_text)
        return {"error": error_text}


def fallback_explanation(subject, question):
    return (
        f"Here is a simplified {subject} explanation: {question} connects to a core idea, "
        "so start with the definition, identify the variables involved, and test the idea with "
        "a small real example. In practice, learners should draw the process, solve one numeric "
        "or conceptual example, and explain where the idea appears in daily life or technology."
    )


def parse_json_response(text, fallback):
    if not text:
        return fallback
    cleaned = text.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return fallback


def fallback_quiz(subject, topic):
    return {
        "questions": [
            {
                "question": f"What is the main purpose of learning {topic} in {subject}?",
                "options": ["To understand concepts and solve problems", "To memorize unrelated facts", "To avoid examples", "To skip practice"],
                "answer": 0,
                "explanation": "Learning works best when concepts are connected to problem solving and examples.",
            },
            {
                "question": "Which habit improves long-term understanding?",
                "options": ["Active recall and spaced practice", "Reading once quickly", "Ignoring mistakes", "Guessing without review"],
                "answer": 0,
                "explanation": "Active recall and spaced practice strengthen memory and reveal gaps.",
            },
            {
                "question": "What should you do after getting a quiz answer wrong?",
                "options": ["Review the explanation and retry", "Delete the topic", "Stop studying", "Ignore feedback"],
                "answer": 0,
                "explanation": "Mistakes are useful signals for targeted revision.",
            },
            {
                "question": "A practical application helps because it:",
                "options": ["Connects theory to real use", "Makes concepts less meaningful", "Removes context", "Prevents transfer"],
                "answer": 0,
                "explanation": "Applications make abstract ideas easier to remember and apply.",
            },
            {
                "question": "Which output is most useful from an AI tutor?",
                "options": ["Simple steps, examples, and checks", "Only a final answer", "Unrelated trivia", "No explanation"],
                "answer": 0,
                "explanation": "Good tutoring explains the reasoning, not just the answer.",
            },
        ]
    }


def calculate_streak(user_id):
    rows = get_db().execute(
        "SELECT DISTINCT date(created_at) AS day FROM learning_history WHERE user_id = ? ORDER BY day DESC",
        (user_id,),
    ).fetchall()
    days = {row["day"] for row in rows}
    streak = 0
    cursor = date.today()
    while cursor.isoformat() in days:
        streak += 1
        cursor -= timedelta(days=1)
    return streak


@app.route("/")
def index():
    return render_template("index.html", subjects=SUBJECTS)


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name = request.form["name"].strip()
        email = request.form["email"].strip().lower()
        password = request.form["password"]
        if len(password) < 6:
            flash("Password must be at least 6 characters.", "danger")
            return render_template("register.html")
        try:
            db = get_db()
            cursor = db.execute(
                "INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
                (name, email, generate_password_hash(password), datetime.utcnow().isoformat()),
            )
            db.commit()
            session.clear()
            session["user_id"] = cursor.lastrowid
            return redirect(url_for("dashboard"))
        except sqlite3.IntegrityError:
            flash("An account with that email already exists.", "danger")
    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"].strip().lower()
        password = request.form["password"]
        user = get_db().execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
        if user and check_password_hash(user["password_hash"], password):
            session.clear()
            session["user_id"] = user["id"]
            return redirect(url_for("dashboard"))
        flash("Invalid email or password.", "danger")
    return render_template("login.html")


@app.route("/logout")
def logout():
    session.clear()
    flash("You have been logged out.", "info")
    return redirect(url_for("index"))


@app.route("/dashboard")
@login_required
def dashboard():
    db = get_db()
    quiz_rows = db.execute(
        "SELECT * FROM quiz_results WHERE user_id = ? ORDER BY created_at DESC", (g.user["id"],)
    ).fetchall()
    histories = db.execute(
        "SELECT * FROM learning_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 10", (g.user["id"],)
    ).fetchall()
    summaries = db.execute(
        "SELECT * FROM notes_summaries WHERE user_id = ? ORDER BY created_at DESC LIMIT 5", (g.user["id"],)
    ).fetchall()
    topics = sorted({row["topic"] for row in histories})
    chart_labels = [row["topic"][:20] for row in reversed(quiz_rows[-8:])]
    chart_scores = [round((row["score"] / row["total"]) * 100) for row in reversed(quiz_rows[-8:])]
    recommendations = ["Review quiz mistakes", "Try a visualization lab", "Summarize today notes"]
    if topics:
        recommendations.insert(0, f"Continue learning {topics[-1]}")
    return render_template(
        "dashboard.html",
        quiz_rows=quiz_rows,
        histories=histories,
        summaries=summaries,
        topics=topics,
        streak=calculate_streak(g.user["id"]),
        recommendations=recommendations[:4],
        chart_labels=chart_labels,
        chart_scores=chart_scores,
    )


@app.route("/ai-tutor")
@login_required
def ai_tutor():
    return render_template("ai_tutor.html", subjects=SUBJECTS)


@app.route("/api/tutor", methods=["POST"])
@login_required
def api_tutor():
    data = request.get_json(silent=True) or {}
    subject = data.get("subject", "General")
    question = (data.get("question") or "").strip()
    if not question:
        return jsonify({"answer": "Please enter a question so the AI tutor can help."}), 400
    prompt = (
        f"You are an expert {subject} tutor. Explain this student question in simple language: {question}. "
        "Include short steps, one example, and one practical application. Keep it under 220 words."
    )
    ai_result = gemini_text(prompt)
    if isinstance(ai_result, dict) and ai_result.get("error"):
        error_msg = ai_result["error"]
        user_msg = (
            "The AI tutor is unavailable right now. "
            "Please check your Gemini quota or billing settings and try again."
        )
        app.logger.error("Tutor API error returned to user: %s", error_msg)
        return jsonify({"answer": user_msg}), 503
    answer = ai_result or fallback_explanation(subject, question)
    add_history(subject, question[:60] or "AI tutor question", "AI Tutor", answer[:240])
    return jsonify({"answer": answer})


@app.route("/visualization")
@login_required
def visualization():
    add_history("Science", "Interactive 3D visualization", "Visualization", "Opened 3D lab")
    return render_template("visualization.html")


@app.route("/quiz")
@login_required
def quiz():
    return render_template("quiz.html", subjects=SUBJECTS)


@app.route("/api/generate-quiz", methods=["POST"])
@login_required
def generate_quiz():
    data = request.get_json()
    subject = data.get("subject", "Science")
    topic = data.get("topic", "Foundations")
    prompt = (
        f"Create exactly 5 multiple choice questions for {subject}, topic {topic}. "
        'Return only JSON in this schema: {"questions":[{"question":"...","options":["A","B","C","D"],"answer":0,"explanation":"..."}]}.'
    )
    quiz_data = parse_json_response(gemini_text(prompt), fallback_quiz(subject, topic))
    add_history(subject, topic, "Quiz Generated", "Generated practice quiz")
    return jsonify(quiz_data)


@app.route("/api/save-quiz", methods=["POST"])
@login_required
def save_quiz():
    data = request.get_json()
    db = get_db()
    db.execute(
        """
        INSERT INTO quiz_results (user_id, subject, topic, score, total, questions_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            g.user["id"],
            data["subject"],
            data["topic"],
            int(data["score"]),
            int(data["total"]),
            json.dumps(data.get("questions", [])),
            datetime.utcnow().isoformat(),
        ),
    )
    db.commit()
    add_history(data["subject"], data["topic"], "Quiz Attempt", f"Scored {data['score']} of {data['total']}")
    return jsonify({"ok": True})


@app.route("/summary")
@login_required
def summary():
    return render_template("summary.html", subjects=SUBJECTS)


@app.route("/api/summarize", methods=["POST"])
@login_required
def summarize():
    data = request.get_json()
    subject = data.get("subject", "General")
    title = data.get("title", "Study notes").strip() or "Study notes"
    notes = data.get("notes", "").strip()
    prompt = (
        f"Summarize these {subject} notes for a student. Return JSON with keys summary and key_points, "
        f"where key_points is an array of 5 concise strings. Notes: {notes[:6000]}"
    )
    fallback = {
        "summary": "These notes cover the main concept, supporting details, and examples. Review the definitions first, then practice with questions that use the idea in a new situation.",
        "key_points": ["Identify definitions", "Connect formulas or steps", "Review examples", "Mark weak areas", "Practice retrieval"],
    }
    result = parse_json_response(gemini_text(prompt), fallback)
    get_db().execute(
        """
        INSERT INTO notes_summaries (user_id, subject, title, original_notes, summary, key_points, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (g.user["id"], subject, title, notes, result["summary"], json.dumps(result["key_points"]), datetime.utcnow().isoformat()),
    )
    get_db().commit()
    add_history(subject, title, "Notes Summary", result["summary"][:240])
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)
