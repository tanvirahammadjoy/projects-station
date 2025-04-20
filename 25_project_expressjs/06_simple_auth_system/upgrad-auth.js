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
let blacklistedTokens = []; // Store blacklisted tokens in memory (for simplicity)

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

  console.log("Received token:", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  jwt.verify(token, "my-secret-key", (err, user) => {
    if (err) {
      console.log("JWT verification error:", err);
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    req.user = user; // Token is valid, save user info in request
    next(); // Continue to next middleware or route
  });
};

// Middleware to role-check the user
const checkRole = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    console.log("User role is: ", req.user.role);
    next();
  };
};

// register a user with hashed password
app.post("/register", (req, res) => {
  const { fullName, username, password, confirmPassword, role, email } =
    req.body;

  // check if the user already exists
  const userExists = users.find((u) => u.username === username);
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // check if all fields are provided
  if (!fullName || !username || !password || !confirmPassword || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // check if the password and confirm password match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // hash the password
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    const user = {
      fullName,
      username,
      password: hash,
      role: role || "user",
      email,
    }; // default role is user
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
      const token = jwt.sign(
        { fullName: user.fullName, username, role: user.role },
        "my-secret-key",
        {
          expiresIn: "1h",
        }
      );
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
  blacklistedTokens.push(token); // Add the token to the blacklist
  res.clearCookie("token"); // Clear the cookie (if used)
  res.json({ message: "Logged out successfully" });
});

// Add a /profile route that returns the username from token data
app.get("/profile", authenticateToken, checkRole("user"), (req, res) => {
  res.json({ username: req.user.username });
});

// Add a /dashboard route that requires authentication
app.get("/dashboard", authenticateToken, checkRole("user"), (req, res) => {
  res.json({
    message: "Welcome to the dashboard",
    username: req.user.username,
  });
});

// Add a /admin route that requires admin role
app.get(
  "/admin",
  authenticateToken,
  checkRole("admin", "superadmin"),
  (req, res) => {
    res.json({ message: "Welcome to the admin panel" });
  }
);

app.get(
  "/superadmin",
  authenticateToken,
  checkRole("admin", "superadmin"),
  (req, res) => {
    res.json({ message: "Welcome to the super admin panel" });
  }
);

app.get("/user", authenticateToken, checkRole("user"), (req, res) => {
  res.json({ message: "Welcome to the user panel" });
});

app.get("/guest", authenticateToken, checkRole("guest"), (req, res) => {
  res.json({ message: "Welcome to the guest panel" });
});

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
  console.log("Use Postman to test the API endpoints");
  console.log("Server started successfully at " + new Date().toISOString());
  console.log("Visit http://localhost:3000 to access the server");
  console.log("Nodemon is being used for automatic server restarts.");
});

// 5. Auth Controllers
//  Register
//  Login
//  Logout
//  blacklist token
//  Token Refresh
//  Get Me (profile)

// 🚀 Next Challenges:
// 1. Implement password reset functionality using email verification.
// 2. Add a /reset-password route that allows users to reset their password.
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
// 13. Add unit tests and integration tests to ensure the API works as expected.
