const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("../generated/prisma");
const dotenv = require("dotenv").config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

router.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).send("Access denied. No token provided.");

    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).send("Access denied. User not found.");

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
