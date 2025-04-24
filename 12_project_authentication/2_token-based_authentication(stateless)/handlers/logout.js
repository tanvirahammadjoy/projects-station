const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

router.post("/", async (req, res) => {
  try {
    // 1. Extract token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.log("No token found in header.");
      return res.status(401).send("Access denied. No token provided.");
    }

    // 2. Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token:", decoded);

    // 3. Find the user in the database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      console.log("User not found with ID:", decoded.id);
      return res.status(401).send("Access denied. User not found.");
    }

    // 4. Check for refresh token
    const refreshToken = await prisma.refreshToken.findFirst({
      where: { userId: user.id },
    });

    if (!refreshToken) {
      console.log("Refresh token not found for user:", user.id);
      return res.status(401).send("Access denied. Refresh token not found.");
    }

    // 5. Delete all refresh tokens for this user
    await prisma.refreshToken.deleteMany({
      where: { userId: user.id },
    });

    console.log(`Refresh tokens deleted for user ID ${user.id}`);

    // 6. Respond success
    res.status(200).send("User logged out successfully.");
  } catch (error) {
    console.error("Error logging out user:", error.message);
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
