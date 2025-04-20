const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const app = express();

// Connect MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/session-auth")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session Config
app.use(
  session({
    secret: "mySuperSecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/session-auth", // 👈 FIXED HERE
    }),
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
    },
    // loging session details to console
    onBeforeSaveSession: (session, callback) => {
      console.log("Session before save:", session);
      callback(null, session);
    },
  })
);

// Routes
const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
