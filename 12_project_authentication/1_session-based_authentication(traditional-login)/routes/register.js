const { addUser, findUser } = require("../userStore");

const register = (req, res) => {
  let body = "";
  req.on("data", (chunk) => (body += chunk.toString()));
  req.on("end", () => {
    const { username, password } = JSON.parse(body);

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
