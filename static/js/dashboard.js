const ctx = document.getElementById("progressChart");
if (ctx) {
  new Chart(ctx, {
    type: "line",
    data: {
      labels: window.progressLabels.length ? window.progressLabels : ["No quiz yet"],
      datasets: [{
        label: "Quiz score %",
        data: window.progressScores.length ? window.progressScores : [0],
        borderColor: "#1769aa",
        backgroundColor: "rgba(21, 154, 143, 0.16)",
        fill: true,
        tension: 0.35
      }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true, max: 100 } } }
  });
}
