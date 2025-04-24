// handlers/register.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { PrismaClient } = require("../generated/prisma");
const { createToken } = require("../token");

const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        token: uuidv4(),
      },
    });

    const token = createToken(user);

    res.status(201).json({ message: "User registered", token });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
