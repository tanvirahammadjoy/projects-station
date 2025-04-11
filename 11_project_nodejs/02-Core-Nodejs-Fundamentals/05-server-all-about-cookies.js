const http = require("http");
const crypto = require("crypto");
const url = require("url");

// In-memory session store
const sessions = {};

// Helper functions
const generateSessionId = () => crypto.randomBytes(16).toString("hex");
const parseCookies = (cookieHeader = "") => {
  return cookieHeader.split(";").reduce((cookies, cookie) => {
    const [key, val] = cookie.trim().split("=");
    if (key) cookies[key] = val;
    return cookies;
  }, {});
};

const setCookie = (res, name, value, options = {}) => {
  const cookieOptions = [
    `${name}=${value}`,
    options.path ? `Path=${options.path}` : "Path=/",
    options.maxAge ? `Max-Age=${options.maxAge}` : "",
    options.expires ? `Expires=${options.expires.toUTCString()}` : "",
    options.httpOnly ? "HttpOnly" : "",
    options.secure ? "Secure" : "",
    options.sameSite ? `SameSite=${options.sameSite}` : "SameSite=Strict",
  ]
    .filter(Boolean)
    .join("; ");

  res.setHeader("Set-Cookie", cookieOptions);
};

const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);
  const cookies = parseCookies(req.headers.cookie);

  // Security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Content-Security-Policy", "default-src 'self'");

  // Routes
  if (pathname === "/login" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <h1>Login</h1>
      <form action="/login" method="POST">
        <input type="text" name="username" placeholder="Username" required>
        <input type="password" name="password" placeholder="Password" required>
        <button type="submit">Login</button>
      </form>
    `);
  } else if (pathname === "/login" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
      const params = new URLSearchParams(body);
      const username = params.get("username");
      const password = params.get("password");

      // In a real app, use proper password hashing and database lookup
      if (username === "admin" && password === "password123") {
        const sessionId = generateSessionId();
        sessions[sessionId] = {
          username,
          createdAt: Date.now(),
          expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        };

        setCookie(res, "sessionId", sessionId, {
          httpOnly: true,
          secure: true, // Should be true in production (requires HTTPS)
          sameSite: "Strict",
          maxAge: 24 * 60 * 60, // 24 hours in seconds
        });

        res.writeHead(302, { Location: "/dashboard" });
        res.end();
      } else {
        res.writeHead(401, { "Content-Type": "text/html" });
        res.end('<h1>Invalid credentials</h1><a href="/login">Try again</a>');
      }
    });
  } else if (pathname === "/dashboard") {
    const sessionId = cookies.sessionId;
    const session = sessions[sessionId];

    if (!sessionId || !session) {
      res.writeHead(302, { Location: "/login" });
      return res.end();
    }

    if (session.expiresAt < Date.now()) {
      delete sessions[sessionId];
      setCookie(res, "sessionId", "", { maxAge: 0 });
      res.writeHead(302, { Location: "/login" });
      return res.end();
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <h1>Welcome ${session.username}!</h1>
      <form action="/transfer" method="POST">
        <input type="hidden" name="_csrf" value="${generateSessionId()}">
        <input type="text" name="amount" placeholder="Amount">
        <input type="text" name="to" placeholder="Recipient">
        <button type="submit">Transfer</button>
      </form>
      <form action="/logout" method="POST">
        <button type="submit">Logout</button>
      </form>
    `);
  } else if (pathname === "/logout" && req.method === "POST") {
    const sessionId = cookies.sessionId;
    if (sessionId) delete sessions[sessionId];

    setCookie(res, "sessionId", "", { maxAge: 0 });
    res.writeHead(302, { Location: "/login" });
    res.end();
  } else if (pathname === "/transfer" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
      // In a real app, validate CSRF token here
      const params = new URLSearchParams(body);
      const amount = params.get("amount");
      const to = params.get("to");

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(
        `<h1>Transferred ${amount} to ${to}</h1><a href="/dashboard">Back to dashboard</a>`
      );
    });
  } else {
    res.writeHead(302, { Location: "/login" });
    res.end();
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
  console.log("Try accessing:");
  console.log("  - http://localhost:3000/login");
  console.log("  - Login with admin/password123");
});
