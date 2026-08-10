const root = document.documentElement;
const savedTheme = localStorage.getItem("learningTheme");
if (savedTheme) root.dataset.theme = savedTheme;

document.getElementById("darkModeToggle")?.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("learningTheme", root.dataset.theme);
});
