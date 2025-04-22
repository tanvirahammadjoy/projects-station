const express = require("express");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// In-memory session store (you can replace this with DB later)
const sessions = {};
console.log("Sessions object:", sessions);

// Dummy user for demonstration
const users = [
  {
    id: 1,
    username: "john",
    email: "john@example.com",
    phone: "1234567890",
    password: "password123",
  },
  {
    id: 2,
    username: "alice",
    email: "alice@example.com",
    phone: "0987654321",
    password: "password456",
  },
];

// Login route
app.post("/login", (req, res) => {
  console.log("Sessions object:", sessions);
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (username === user.username && password === user.password) {
    const sessionId = uuidv4(); // generate session ID
    sessions[sessionId] = { userId: user.id, createdAt: Date.now() };
    console.log("Session created:", sessions[sessionId]);
    console.log("Session ID:", sessionId);

    // Set cookie with session ID
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: false, // set to true if using HTTPS
      sameSite: "strict",
    });

    return res.json({ message: "Logged in successfully" });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

// Auth middleware
function requireAuth(req, res, next) {
  const sessionId = req.cookies.sessionId;

  if (!sessionId || !sessions[sessionId]) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = sessions[sessionId]; // Attach session info
  console.log("User session:", req.user);
  next();
}

// Protected route
app.get("/dashboard", requireAuth, (req, res) => {
  const userId = req.user.userId;
  const user = users.find((u) => u.id === userId); // find user by ID

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ message: `Welcome user ${user.username}` });
});

// Logout route
app.post("/logout", (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId) {
    delete sessions[sessionId]; // destroy session
    res.clearCookie("sessionId");
  }
  res.json({ message: "Logged out successfully" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
