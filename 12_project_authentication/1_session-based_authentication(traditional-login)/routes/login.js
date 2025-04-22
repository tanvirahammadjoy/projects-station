// routes/login.js
const { findUser } = require("../userStore");
const { v4: uuidv4 } = require("uuid");
const sessions = require("../sessionStore");
const querystring = require("querystring");

const login = (req, res) => {
  if (req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <h1>Login</h1>
      <form method="POST" action="/login">
        <input type="text" name="username" placeholder="Username" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    `);
    return;
  }

  let body = "";
  req.on("data", (chunk) => (body += chunk.toString()));
  req.on("end", () => {
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
      res.writeHead(302, {
        "Set-Cookie": `sessionId=${sessionId}; HttpOnly`,
        Location: "/dashboard",
      });
      res.end();
    } else {
      res.writeHead(401, { "Content-Type": "text/plain" });
      res.end("Invalid credentials");
    }
  });
};

module.exports = login;
