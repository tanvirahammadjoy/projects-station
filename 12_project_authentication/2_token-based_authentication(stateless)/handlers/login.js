const express = require("express");
const bcrypt = require("bcrypt");
const { createToken } = require("../token");
const { v4: uuidv4 } = require("uuid");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("Logging in user:", req.body);

    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { username } }); // FIX: use `prisma.user`
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const accessToken = createToken(user);
    const refreshToken = uuidv4();

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
      },
    });

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
