// user handler
const { PrismaClient } = require("../generated/prisma");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Replace with your own secret key
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1000ms"; // Token expiration time
const JWT_ISSUER = process.env.JWT_ISSUER || "your_jwt_issuer"; // Token issuer
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "your_jwt_audience"; // Token audience
const JWT_ALGORITHM = process.env.JWT_ALGORITHM || "HS256"; // Token algorithm

const prisma = new PrismaClient();

const getUserByEmail = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
};

module.exports = { getUserByEmail };
