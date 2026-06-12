document.getElementById("summarizeBtn")?.addEventListener("click", async () => {
  const notes = document.getElementById("notesInput").value.trim();
  if (!notes) return;
  const btn = document.getElementById("summarizeBtn");
  btn.disabled = true;
  btn.textContent = "Summarizing...";
  const response = await fetch("/api/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subject: document.getElementById("summarySubject").value,
      title: document.getElementById("summaryTitle").value,
      notes
    })
  });
  const data = await response.json();
  document.getElementById("summaryText").textContent = data.summary;
  document.getElementById("keyPoints").innerHTML = data.key_points.map((point) => `<li>${point}</li>`).join("");
  btn.disabled = false;
  btn.textContent = "Summarize";
});
