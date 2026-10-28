# Interactive AI Learning App

A complete Flask full-stack educational platform with authentication, SQLite progress tracking, Gemini-powered tutoring and summaries, AI quiz generation, interactive visualizations, Chart.js progress charts, dark mode, learning streaks, topic recommendations, and PDF quiz result downloads.

## Features

- Responsive Bootstrap UI with home page, feature cards, subject selection, navigation, and footer
- User registration, login, logout, password hashing, and session management
- AI tutor for Physics, Chemistry, Biology, Mathematics, and Computer Science
- Notes summarizer with concise summaries and important points
- Quiz generator with MCQs, instant feedback, score saving, and PDF export
- Interactive science models: solar system, human cell, and atom structure
- SQLite tables for users, quiz results, learning history, and notes summaries
- Dashboard with quiz statistics, learning streak, recent activity, recommendations, and Chart.js progress
- Dark mode toggle saved in browser local storage

## Project Structure

```text
Interactive ai learning app/
  app.py
  database.db
  requirements.txt
  README.md
  templates/
    base.html
    index.html
    login.html
    register.html
    dashboard.html
    ai_tutor.html
    quiz.html
    visualization.html
    summary.html
  static/
    css/
      styles.css
    js/
      main.js
      dashboard.js
      tutor.js
      quiz.js
      summary.js
      visualization.js
    images/
      ai-learning-banner.png
  models/
```

## Setup

1. Create and activate a virtual environment.

```bash
python -m venv .venv
.venv\Scripts\activate
```

2. Install dependencies.

```bash
pip install -r requirements.txt
```

3. Add your Gemini API key in a local `.env` file.

```text
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=models/gemini-flash-lite-latest
GEMINI_TIMEOUT_SECONDS=4
SECRET_KEY=replace_this_for_production
```

Keep `.env` private. It is already listed in `.gitignore`.

4. Run the app.

```powershell
python app.py
```

5. Open the local URL shown by Flask, usually `http://127.0.0.1:5000`.

## Troubleshooting

If the site opens but AI answers are fallback responses:

- Make sure your Gemini key is from Google AI Studio.
- Confirm the machine has internet access.
- Increase `GEMINI_TIMEOUT_SECONDS` if your connection is slow.
- Restart Flask after editing `.env`.

If dependencies are missing, run `pip install -r requirements.txt` again inside your virtual environment.

## Notes

The application still works without `GEMINI_API_KEY`; tutor, quiz, and summary routes use local educational fallback content. For production, replace the development `SECRET_KEY`, deploy behind HTTPS, and use a production WSGI server.
