const subjectSelect = document.getElementById("subjectSelect");
const questionInput = document.getElementById("questionInput");
const chatHistory = document.getElementById("chatHistory");

function addMessage(text, type) {
  chatHistory.querySelector(".empty-chat")?.remove();
  const node = document.createElement("div");
  node.className = `chat-msg ${type}`;
  node.textContent = text;
  chatHistory.appendChild(node);
  chatHistory.scrollTop = chatHistory.scrollHeight;
  return node;
}

document.getElementById("askTutor")?.addEventListener("click", async (event) => {
  const button = event.currentTarget;
  const question = questionInput.value.trim();
  if (!question) return;
  addMessage(question, "user");
  questionInput.value = "";
  button.disabled = true;
  const loading = addMessage("Thinking...", "ai");
  try {
    const response = await fetch("/api/tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: subjectSelect.value, question })
    });
    const data = await response.json();
    const answer = data?.answer || "Sorry, the tutor did not respond. Please try again.";
    loading.textContent = data?.using_fallback
      ? `Gemini did not respond, so this is a local explanation:\n\n${answer}`
      : answer;
    if (!response.ok) {
      loading.classList.add("error");
    }
  } catch (error) {
    loading.textContent = "Sorry, the tutor service is unavailable right now.";
    loading.classList.add("error");
    console.error("Tutor request failed:", error);
  } finally {
    button.disabled = false;
  }
});
