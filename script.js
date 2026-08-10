const modules = [
  {
    title: "What is Artificial Intelligence?",
    tag: "Foundation",
    summary: "Understand AI as systems that perform tasks requiring human-like intelligence.",
    body: "Artificial intelligence is the field of building computer systems that can reason, learn, predict, classify, generate, or make decisions from data. AI does not think like a human, but it can detect useful patterns and apply them to new situations.",
    example: "A shopping app recommending products uses AI to compare your behavior with previous purchases and similar users.",
    flash: "AI is a broad field. Machine learning is one common method used to build AI systems.",
    key: "ai"
  },
  {
    title: "Machine Learning",
    tag: "Core concept",
    summary: "Learn how models improve from examples instead of fixed instructions.",
    body: "Machine learning trains a model on data so it can discover patterns. Instead of writing every rule manually, developers provide examples, features, labels, and an algorithm that learns a relationship between inputs and outputs.",
    example: "A placement prediction model can learn from student scores, projects, and interview performance to estimate placement chances.",
    flash: "Training data teaches the model; testing data checks how well it generalizes.",
    key: "ml"
  },
  {
    title: "Supervised Learning",
    tag: "Learning type",
    summary: "Explore prediction tasks where examples include correct answers.",
    body: "Supervised learning uses labeled data. The model receives inputs and known outputs during training, then learns to predict outputs for new inputs. Classification predicts categories, while regression predicts numbers.",
    example: "Email spam detection is classification because each training email is labeled spam or not spam.",
    flash: "Classification predicts a class; regression predicts a numeric value.",
    key: "supervised"
  },
  {
    title: "Neural Networks",
    tag: "Deep learning",
    summary: "See how layered models transform inputs into useful outputs.",
    body: "A neural network is made of layers of connected units. Each layer transforms the information it receives, allowing the model to learn complex patterns from images, text, audio, or tabular data.",
    example: "A handwritten digit recognizer uses early layers to detect strokes and later layers to identify full numbers.",
    flash: "Deep learning usually means neural networks with many layers.",
    key: "nn"
  },
  {
    title: "Responsible AI",
    tag: "Ethics",
    summary: "Review fairness, privacy, transparency, and human oversight.",
    body: "Responsible AI focuses on building systems that are fair, explainable, secure, and respectful of privacy. Developers should check data quality, document limitations, and keep humans in control for high-impact decisions.",
    example: "A loan approval system should be audited so it does not unfairly reject applicants from a particular group.",
    flash: "Good AI projects consider accuracy and impact, not just technical performance.",
    key: "ethics"
  }
];

const quiz = [
  {
    question: "Which statement best describes artificial intelligence?",
    options: ["Systems that perform human-like intelligent tasks", "Only physical robots", "A spreadsheet formula", "A database table"],
    answer: 0
  },
  {
    question: "What does supervised learning require?",
    options: ["Labeled examples", "No data", "Only random numbers", "Manual answers for every future case"],
    answer: 0
  },
  {
    question: "Predicting pass or fail is usually a:",
    options: ["Classification problem", "Regression problem", "Storage problem", "Networking problem"],
    answer: 0
  },
  {
    question: "Why do we use test data?",
    options: ["To evaluate the model on unseen examples", "To delete training data", "To make the website colorful", "To avoid measuring accuracy"],
    answer: 0
  },
  {
    question: "Responsible AI includes:",
    options: ["Fairness, privacy, transparency, and oversight", "Ignoring biased data", "Keeping all decisions secret", "Removing human review"],
    answer: 0
  },
  {
    question: "Deep learning commonly uses:",
    options: ["Neural networks with multiple layers", "Only handwritten rules", "No algorithms", "Static HTML only"],
    answer: 0
  }
];

const glossary = [
  ["Algorithm", "A step-by-step method used to solve a problem or perform a calculation."],
  ["Dataset", "A collection of examples used to train, test, or evaluate an AI model."],
  ["Feature", "An input value used by a model, such as attendance, marks, or project count."],
  ["Label", "The known answer in supervised learning, such as placed or not placed."],
  ["Model", "A trained system that uses learned patterns to make predictions or decisions."],
  ["Accuracy", "A metric showing how many predictions were correct out of the total predictions."],
  ["Bias", "A systematic error that can lead to unfair or incorrect results."],
  ["Overfitting", "When a model memorizes training data and performs poorly on new data."],
  ["Inference", "The process of using a trained model to produce an output for new input."]
];

const state = JSON.parse(localStorage.getItem("aiLearningState") || "{}");
state.completed = state.completed || [];
state.bestScore = state.bestScore || 0;
state.selectedModule = state.selectedModule || 0;
state.notes = state.notes || "";

const ids = {};
document.querySelectorAll("[id]").forEach((node) => {
  ids[node.id] = node;
});

function saveState() {
  localStorage.setItem("aiLearningState", JSON.stringify(state));
  renderStats();
}

function setView(viewName) {
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === viewName));
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === viewName));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderModules(filter = "") {
  ids.moduleList.innerHTML = "";
  modules
    .map((module, index) => ({ ...module, index }))
    .filter((module) => `${module.title} ${module.tag} ${module.summary}`.toLowerCase().includes(filter.toLowerCase()))
    .forEach((module) => {
      const button = document.createElement("button");
      button.className = "module-card";
      button.classList.toggle("active", module.index === state.selectedModule);
      button.classList.toggle("done", state.completed.includes(module.key));
      button.innerHTML = `<strong>${module.title}</strong><p>${module.summary}</p>`;
      button.addEventListener("click", () => selectModule(module.index));
      ids.moduleList.appendChild(button);
    });
}

function selectModule(index) {
  state.selectedModule = index;
  const module = modules[index];
  ids.flashcard.classList.remove("flipped");
  ids.lessonTag.textContent = module.tag;
  ids.lessonTitle.textContent = module.title;
  ids.lessonBody.textContent = module.body;
  ids.lessonExample.textContent = module.example;
  ids.flashcardText.textContent = module.flash;
  ids.completeModule.textContent = state.completed.includes(module.key) ? "Completed" : "Mark Complete";
  renderModules(ids.moduleSearch.value);
  saveState();
}

function renderQuiz() {
  ids.quizGrid.innerHTML = "";
  quiz.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "question-card";
    const options = item.options
      .map((option, optionIndex) => `
        <label class="option">
          <input type="radio" name="question-${index}" value="${optionIndex}">
          <span>${option}</span>
        </label>
      `)
      .join("");
    card.innerHTML = `<strong>Question ${index + 1}</strong><p>${item.question}</p><fieldset>${options}</fieldset>`;
    ids.quizGrid.appendChild(card);
  });
}

function submitQuiz() {
  let score = 0;
  quiz.forEach((item, index) => {
    const selected = document.querySelector(`input[name="question-${index}"]:checked`);
    if (selected && Number(selected.value) === item.answer) {
      score += 1;
    }
  });
  const percent = Math.round((score / quiz.length) * 100);
  state.bestScore = Math.max(state.bestScore, percent);
  ids.quizResult.textContent = `You scored ${score} out of ${quiz.length} (${percent}%).`;
  saveState();
  renderProgress();
}

function renderGlossary() {
  ids.glossaryGrid.innerHTML = "";
  glossary.forEach(([term, definition]) => {
    const card = document.createElement("article");
    card.className = "term-card";
    card.innerHTML = `<strong>${term}</strong><p>${definition}</p>`;
    ids.glossaryGrid.appendChild(card);
  });
}

function renderStats() {
  ids.completedCount.textContent = state.completed.length;
  ids.bestScore.textContent = `${state.bestScore}%`;
  ids.studyMinutes.textContent = state.completed.length * 8;
}

function renderProgress() {
  const modulePercent = Math.round((state.completed.length / modules.length) * 100);
  const overall = Math.round((modulePercent + state.bestScore) / 2);
  ids.progressFill.style.width = `${overall}%`;
  ids.certificateText.textContent = `Completed ${state.completed.length} of ${modules.length} modules. Best quiz score: ${state.bestScore}%. Overall learning progress: ${overall}%.`;
}

ids.startLearning.addEventListener("click", () => setView("learn"));
ids.takeQuiz.addEventListener("click", () => setView("quiz"));
ids.moduleSearch.addEventListener("input", (event) => renderModules(event.target.value));
ids.completeModule.addEventListener("click", () => {
  const key = modules[state.selectedModule].key;
  if (!state.completed.includes(key)) {
    state.completed.push(key);
  }
  selectModule(state.selectedModule);
  renderProgress();
});
ids.flashcard.addEventListener("click", () => {
  ids.flashcard.classList.toggle("flipped");
  ids.flashcardText.textContent = ids.flashcard.classList.contains("flipped")
    ? "Think of one real-world example where this idea is useful."
    : modules[state.selectedModule].flash;
});
ids.flashcard.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    ids.flashcard.click();
  }
});
ids.submitQuiz.addEventListener("click", submitQuiz);
ids.resetQuiz.addEventListener("click", () => {
  renderQuiz();
  ids.quizResult.textContent = "Answer the questions to see your score.";
});
ids.clearProgress.addEventListener("click", () => {
  state.completed = [];
  state.bestScore = 0;
  state.notes = "";
  ids.reflectionNotes.value = "";
  saveState();
  selectModule(0);
  renderProgress();
});
ids.reflectionNotes.addEventListener("input", (event) => {
  state.notes = event.target.value;
  saveState();
});
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => setView(tab.dataset.view));
});

ids.reflectionNotes.value = state.notes;
renderModules();
renderQuiz();
renderGlossary();
selectModule(state.selectedModule);
renderProgress();
