// server.js
const express = require("express");
const app = express();
const port = 3000;

const feedbacks = []; // Temporarily store feedback in memory
console.log(feedbacks);

app.use(express.static("public"));
app.use(express.json());

app.get("/api/feedbacks", (req, res) => {
  res.json(feedbacks);
});

app.post("/api/feedbacks", (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message required" });
  feedbacks.push({ message, date: new Date() });
  res.status(201).json({ success: true });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
