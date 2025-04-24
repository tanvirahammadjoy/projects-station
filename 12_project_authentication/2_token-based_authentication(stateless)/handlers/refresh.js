const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRATION = "1h";

router.post("/", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const storedToken = await prisma.refreshToken.findFirst({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || !storedToken.user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Optionally delete the old refresh token (rotation)
    await prisma.refreshToken.delete({
      where: { id: storedToken.id },
    });

    // Create new tokens
    const accessToken = jwt.sign(
      { id: storedToken.user.id, username: storedToken.user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );
    const newRefreshToken = uuidv4();

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: storedToken.user.id,
      },
    });

    res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error("Error refreshing token:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
