// logout handler file
const sessions = require("../sessionStore");

const logout = (req, res) => {
  const cookies = req.cookies;
  const sessionId = cookies.sessionId;

  if (sessionId && sessions[sessionId]) {
    delete sessions[sessionId];
  }

  res.writeHead(200, {
    "Set-Cookie": "sessionId=; HttpOnly; Max-Age=0",
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify({ message: "Logged out successfully" }));
};

module.exports = logout;
