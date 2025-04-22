const { findUser } = require("../userStore");
const { v4: uuidv4 } = require("uuid");
const sessions = require("../sessionStore");

const login = (req, res) => {
  let body = "";
  req.on("data", (chunk) => (body += chunk.toString()));
  req.on("end", () => {
    const { username, password } = JSON.parse(body);
    const user = findUser(username);

    if (user && user.password === password) {
      const sessionId = uuidv4();
      sessions[sessionId] = { username };

      res.writeHead(200, {
        "Set-Cookie": `sessionId=${sessionId}; HttpOnly`,
        "Content-Type": "text/plain",
      });
      res.end("Login successful");
    } else {
      res.writeHead(401, { "Content-Type": "text/plain" });
      res.end("Invalid credentials");
    }
  });
};

module.exports = login;
