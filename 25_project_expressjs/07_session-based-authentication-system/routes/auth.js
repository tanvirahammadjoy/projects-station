const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET: Home
router.get("/", (req, res) => {
  console.log("Session:", req.session);
  res.render("home", { user: req.session.user });
});

// GET: Register
router.get("/register", (req, res) => {
  res.render("register");
});

// POST: Register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 👇 Check if user already exists
    const existing = await User.findOne({ username });
    if (existing) {
      return res.send("Username already taken.");
    }

    // 👇 Create and save user
    const newUser = new User({ username, password });
    await newUser.save(); // password will be hashed automatically

    // 👇 Store in session
    req.session.user = {
      id: newUser._id,
      username: newUser.username,
    };

    res.redirect("/dashboard");
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).send("Internal server error.");
  }
});


// GET: Login
router.get("/login", (req, res) => {
  res.render("login");
});

// POST: Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return res.send("Invalid credentials");
  }
  req.session.user = user;
  res.redirect("/dashboard");
});

// GET: Dashboard (Protected)
router.get("/dashboard", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("dashboard", { user: req.session.user });
});

// GET: Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
