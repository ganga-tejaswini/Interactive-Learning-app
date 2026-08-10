let currentQuiz = [];
let latestScore = null;

function renderQuiz(questions) {
  const area = document.getElementById("quizArea");
  area.innerHTML = "";
  questions.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "question-card";
    card.dataset.index = index;
    card.innerHTML = `
      <h3>Question ${index + 1}</h3>
      <p>${item.question}</p>
      ${item.options.map((option, optionIndex) => `
        <label class="option-row">
          <input type="radio" name="q-${index}" value="${optionIndex}">
          <span>${option}</span>
        </label>
      `).join("")}
      <div class="feedback"></div>
    `;
    area.appendChild(card);
  });
  const submit = document.createElement("button");
  submit.className = "btn btn-primary mt-3";
  submit.textContent = "Submit Quiz";
  submit.addEventListener("click", submitQuiz);
  area.appendChild(submit);
}

document.getElementById("generateQuiz")?.addEventListener("click", async () => {
  const button = document.getElementById("generateQuiz");
  button.disabled = true;
  button.textContent = "Generating...";
  document.getElementById("quizResultBox").classList.add("d-none");
  const response = await fetch("/api/generate-quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subject: document.getElementById("quizSubject").value,
      topic: document.getElementById("quizTopic").value
    })
  });
  const data = await response.json();
  currentQuiz = data.questions || [];
  renderQuiz(currentQuiz);
  button.disabled = false;
  button.textContent = "Generate";
});

async function submitQuiz() {
  let score = 0;
  currentQuiz.forEach((item, index) => {
    const selected = document.querySelector(`input[name="q-${index}"]:checked`);
    const card = document.querySelector(`.question-card[data-index="${index}"]`);
    const feedback = card.querySelector(".feedback");
    const isCorrect = selected && Number(selected.value) === item.answer;
    if (isCorrect) score += 1;
    card.classList.toggle("correct", Boolean(isCorrect));
    card.classList.toggle("wrong", !isCorrect);
    feedback.textContent = `${isCorrect ? "Correct" : "Review"}: ${item.explanation}`;
  });

  latestScore = { score, total: currentQuiz.length };
  document.getElementById("quizResultBox").classList.remove("d-none");
  document.getElementById("quizScoreText").textContent = `Score: ${score}/${currentQuiz.length}`;
  document.getElementById("quizSummaryText").textContent = score === currentQuiz.length
    ? "Excellent work. You answered every question correctly."
    : "Review the highlighted explanations, then generate another quiz for spaced practice.";

  await fetch("/api/save-quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subject: document.getElementById("quizSubject").value,
      topic: document.getElementById("quizTopic").value,
      score,
      total: currentQuiz.length,
      questions: currentQuiz
    })
  });
}

document.getElementById("downloadPdf")?.addEventListener("click", () => {
  if (!latestScore) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const subject = document.getElementById("quizSubject").value;
  const topic = document.getElementById("quizTopic").value;
  doc.setFontSize(18);
  doc.text("Interactive AI Learning App - Quiz Result", 14, 18);
  doc.setFontSize(12);
  doc.text(`Subject: ${subject}`, 14, 32);
  doc.text(`Topic: ${topic}`, 14, 40);
  doc.text(`Score: ${latestScore.score}/${latestScore.total}`, 14, 48);
  let y = 62;
  currentQuiz.forEach((item, index) => {
    const lines = doc.splitTextToSize(`${index + 1}. ${item.question}`, 180);
    doc.text(lines, 14, y);
    y += lines.length * 7;
    doc.text(`Answer: ${item.options[item.answer]}`, 18, y);
    y += 10;
    if (y > 270) {
      doc.addPage();
      y = 18;
    }
  });
  doc.save("quiz-result.pdf");
});
