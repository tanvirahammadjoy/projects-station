const { findUser } = require("../userStore");
const { v4: uuidv4 } = require("uuid");
const sessions = require("../sessionStore");
const querystring = require("querystring");

const login = (req, res) => {
  let body = "";
  req.on("data", (chunk) => (body += chunk.toString()));
  req.on("end", () => {
    // const { username, password } = querystring.parse(body);
    // const { username, password } = JSON.parse(body);

    let username, password;
    if (req.headers["content-type"] === "application/json") {
      ({ username, password } = JSON.parse(body));
    } else if (
      req.headers["content-type"] === "application/x-www-form-urlencoded"
    ) {
      ({ username, password } = querystring.parse(body));
    } else {
      res.writeHead(400, { "Content-Type": "text/plain" });
      return res.end("Unsupported content type");
    }

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
