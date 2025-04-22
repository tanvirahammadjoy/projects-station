// routes/register.js
const { addUser, findUser } = require("../userStore");
const querystring = require("querystring");

const register = (req, res) => {
  if (req.method === "GET") {
    // Show register form (from server)
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <h1>Register</h1>
      <form method="POST" action="/register">
        <input type="text" name="username" placeholder="Username" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
    `);
    return;
  }

  if (req.method === "POST") {
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

      if (!username || !password) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        return res.end("Username and password are required");
      }

      if (findUser(username)) {
        res.writeHead(409, { "Content-Type": "text/plain" });
        return res.end("User already exists");
      }

      addUser(username, password);

      // ✅ Redirect to /login after successful registration
      res.writeHead(302, { Location: "/login" });
      res.end();
    });
  }
};

module.exports = register;
