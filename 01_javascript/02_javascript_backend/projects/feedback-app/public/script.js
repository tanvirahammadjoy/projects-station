
// public/script.js
const form = document.getElementById("feedback-form");
const messageInput = document.getElementById("message");
const list = document.getElementById("feedback-list");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;

  const response = await fetch("/api/feedbacks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await response.json();

  if (response.status === 201 && data.success) {
    alert("✅ Feedback submitted successfully!");
    messageInput.value = "";
    loadFeedbacks();
  } else {
    alert("❌ Error submitting feedback: " + data.error);
  }
});

async function loadFeedbacks() {
  const res = await fetch("/api/feedbacks");
  const data = await res.json();
  list.innerHTML = "";
  data.forEach((fb) => {
    const li = document.createElement("li");
    li.textContent = `${fb.message} (${new Date(fb.date).toLocaleString()})`;
    list.appendChild(li);
  });
}

loadFeedbacks();
