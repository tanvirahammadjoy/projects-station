// 🚀 Next Challenges:
const express = require("express");
const app = express();
// const cors = require('cors');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
// const path = require('path');
// const fs = require('fs');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const { v4: uuidv4 } = require('uuid'); // for generating unique tokens

// Store tokens in an array (to simulate session tracking)
let tokens = []; // Store tokens in memory (for simplicity)
let users = []; // Store users in memory (for simplicity)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({ secret: "your-secret-key", resave: false, saveUninitialized: true })
);

// Make tokens dynamic (e.g. generate random strings) / not used in this example becoause we are using jwt
// const generateToken = () => Math.random().toString(36).substr(2, 9); // Generate a random string of 9 characters
// const generateToken = () => Math.random().toString(36).substr(2);
// const generateToken = () => uuidv4(); // Generate a unique token using uuid
const authenticateToken = (req, res, next) => {
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];
  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, "my-secret-key", (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    next();
  });
};

// register a user with hashed password
app.post("/register", (req, res) => {
  const { fullName, username, password } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    const user = { fullName, username, password: hash };
    users.push(user);
    res.status(201).json({ message: "User registered successfully", username });
  });
});

// login a user and return a token
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  bcrypt.compare(password, user.password, (err, result) => {
    if (err) throw err;
    if (result) {
      const token = jwt.sign({ username }, "my-secret-key", {
        expiresIn: "1h",
      });
      tokens.push(token); // Store the token in memory
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
});

// Add a /logout route that invalidates the token (optional logic)
app.get("/logout", (req, res) => {
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];
  tokens = tokens.filter((t) => t !== token); // Remove the token from memory
  res.json({ message: "Logged out successfully" });
});

// Add a /profile route that returns the username from token data
app.get("/profile", authenticateToken, (req, res) => {
  res.json({ username: req.user.username });
});
// Add a /dashboard route that requires authentication
app.get("/dashboard", authenticateToken, (req, res) => {
  res.json({
    message: "Welcome to the dashboard",
    username: req.user.username,
  });
});

// Add a /admin route that requires admin role
app.get("/admin", authenticateToken, (req, res) => {
  if (req.user.role === "admin") {
    res.json({ message: "Welcome to the admin panel" });
  } else {
    res.status(403).json({ message: "Forbidden" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
  console.log("Use Postman to test the API endpoints");
  console.log("Server started successfully at " + new Date().toISOString());
  console.log("Visit http://localhost:3000 to access the server");
  console.log("Nodemon is being used for automatic server restarts.");
});

// 🚀 Next Challenges:
// 1. Implement password reset functionality using email verification.
// 2. Add role-based access control (RBAC) to restrict certain routes to specific user roles.
// 3. Use a database (like MongoDB or PostgreSQL) to store user data instead of in-memory arrays.
// 4. Implement token expiration and refresh token functionality for better security.
// 5. Add logging and monitoring to track user activity and API usage.
// 6. Implement rate limiting to prevent abuse of the API.
// 7. Use environment variables to store sensitive information like secret keys and database credentials.
// 8. Add unit tests and integration tests to ensure the API works as expected.
// 9. Implement CORS (Cross-Origin Resource Sharing) to allow requests from different origins.
// 10. Add input validation and sanitization to prevent SQL injection and XSS attacks.
// 11. Create a front-end application (using React, Vue, or Angular) to interact with the API.
// 12. Implement user roles and permissions to restrict access to certain routes.
// 13. Add logging and monitoring to track user activity and API usage.
// 14. Implement rate limiting to prevent abuse of the API.
// 15. Use environment variables to store sensitive information like secret keys and database credentials.
// 16. Add unit tests and integration tests to ensure the API works as expected.
