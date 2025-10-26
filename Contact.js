const form = document.getElementById("contactForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    msg.textContent = "⚠️ Please fill all fields.";
    msg.style.color = "red";
    return;
  }

  // Show success message without backend
  msg.textContent = "✅ Message sent successfully!";
  msg.style.color = "green";
  form.reset();
});
