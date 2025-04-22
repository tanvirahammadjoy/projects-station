const { addUser, findUser } = require("../userStore");
const querystring = require("querystring"); // Importing querystring to parse URL-encoded data

const register = (req, res) => {
  let body = "";
  req.on("data", (chunk) => (body += chunk.toString()));
  req.on("end", () => {
    // Parse the body as JSON
    // const { username, password } = JSON.parse(body);
    // Alternatively, if you want to parse URL-encoded data, use the following line instead:
    // const { username, password } = querystring.parse(body);

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
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Registered successfully");
  });
};

module.exports = register;
