const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");
const yearEl = document.getElementById("year");

yearEl.textContent = new Date().getFullYear();

function getSavedTheme() {
  return localStorage.getItem("theme");
}

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  const icon = theme === "light" ? "☀️" : "🌙";
  themeBtn.querySelector(".btn__icon").textContent = icon;
}

const saved = getSavedTheme();
if (saved) {
  setTheme(saved);
} else {
  // Default: dark
  setTheme("dark");
}

themeBtn.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") || "dark";
  setTheme(current === "dark" ? "light" : "dark");
});

// Opens user's email client with prefilled message (no backend)
function sendEmail(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:rahulkavati.us@gmail.com?subject=${subject}&body=${body}`;
  return false;
}
