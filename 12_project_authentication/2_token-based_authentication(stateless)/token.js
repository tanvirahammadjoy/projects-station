const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_ALGORITHM = process.env.JWT_ALGORITHM || "HS256";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "2m";

function createToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
    expiresIn: JWT_EXPIRATION,
  });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET, { algorithms: [JWT_ALGORITHM] });
}

module.exports = { createToken, verifyToken };
