const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { body, validationResult } = require("express-validator");
const { PrismaClient } = require("./generated/prisma");
const prisma = new PrismaClient();
const session = require("express-session");
const dotenv = require("dotenv").config();

const registerRouter = require("./handlers/register"); // Import the register router
const loginRouter = require("./handlers/login"); // Import the login router
const logoutRouter = require("./handlers/logout"); // Import the logout router
const dashboardRouter = require("./handlers/dashboard"); // Import the dashboard router
const { createUser, getUserByEmail } = require("./handlers/user"); // Import user functions
const refreshRouter = require("./handlers/refresh");

const app = express();

const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000
const hostname = "localhost"; // Hostname for the server
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Replace with your own secret key
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1000ms"; // Token expiration time
const JWT_ISSUER = process.env.JWT_ISSUER || "your_jwt_issuer"; // Token issuer
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "your_jwt_audience"; // Token audience
const JWT_ALGORITHM = process.env.JWT_ALGORITHM || "HS256"; // Token algorithm

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the public directory
app.use(express.static(path.join(__dirname, "views")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("trust proxy", 1); // Trust first proxy (for secure cookies in production)

app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
app.use(
  session({
    secret: "your_secret_key", // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// let's write the authorization
// app.use((req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).send("Access denied. No token provided.");

//   jwt.verify(token, JWT_SECRET, { algorithms: [JWT_ALGORITHM] }, (err, decoded) => {
//     if (err) return res.status(403).send("Invalid token.");
//     req.user = decoded;
//     next();
//   });
// });

// auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Access denied. No token provided.");

  jwt.verify(
    token,
    JWT_SECRET,
    { algorithms: [JWT_ALGORITHM] },
    (err, decoded) => {
      if (err) return res.status(403).send("Invalid token.");
      req.user = decoded;
      next();
    }
  );
};

app.use("/register", registerRouter); // Use the register router for /register endpoint
app.use("/login", loginRouter); // Use the login router for /login endpoint
app.use("/logout", logoutRouter); // Use the logout router for /logout endpoint
app.use("/dashboard", authMiddleware, dashboardRouter); // Use the dashboard router for /dashboard endpoint
app.use("/refresh", refreshRouter);

app.listen(PORT, hostname, () => {
  console.log(`Server running at http://${hostname}:${PORT}/`);
});
