const http = require("http");
const register = require("./routes/register");
const login = require("./routes/login");
const logout = require("./routes/logout");
const sessions = require("./sessionStore");

const parseCookies = (req) => {
  const header = req.headers.cookie || "";
  const cookies = {};
  header.split(";").forEach((cookie) => {
    const [name, ...rest] = cookie.split("=");
    cookies[name.trim()] = decodeURIComponent(rest.join("="));
  });
  return cookies;
};

const server = http.createServer((req, res) => {
  req.cookies = parseCookies(req);
  const sessionId = req.cookies.sessionId;
  req.session = sessions[sessionId] || null;

  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`<h1>Welcome ${req.session?.username || "Guest"}!</h1>`);
  } else if (req.method === "POST" && req.url === "/register") {
    register(req, res);
  } else if (req.method === "POST" && req.url === "/login") {
    login(req, res);
  } else if (req.method === "GET" && req.url === "/logout") {
    logout(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
