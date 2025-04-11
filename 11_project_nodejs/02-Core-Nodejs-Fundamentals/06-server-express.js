const express = require("express");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

const app = express();
const PORT = 3000;

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Generate random session ID
const generateSessionId = () => crypto.randomBytes(16).toString("hex");

// In-memory "database" for demo purposes
const users = {
  admin: { password: "securepassword123", role: "admin" },
  user1: { password: "password123", role: "user" },
};

const sessions = {};

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).send('Username and password required');
  }

  const user = users[username];
  
  if (!user || user.password !== password) {
    return res.status(401).send('Invalid credentials');
  }

  // Create session
  const sessionId = generateSessionId();
  sessions[sessionId] = {
    username,
    role: user.role,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  };

  // Set secure cookie
  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    secure: true, // Requires HTTPS
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/',
  });

  res.redirect('/dashboard');
});

// Protected dashboard route
app.get('/dashboard', (req, res) => {
  const sessionId = req.cookies.sessionId;
  
  if (!sessionId || !sessions[sessionId]) {
    return res.status(401).send('Unauthorized - Please login');
  }

  const session = sessions[sessionId];
  
  // Check if session expired
  if (session.expiresAt < Date.now()) {
    delete sessions[sessionId];
    res.clearCookie('sessionId');
    return res.status(401).send('Session expired');
  }

  res.send(`
    <h1>Welcome ${session.username}!</h1>
    <p>Your role: ${session.role}</p>
    <form action="/logout" method="POST">
      <button type="submit">Logout</button>
    </form>
  `);
});

// Logout route
app.post('/logout', (req, res) => {
  const sessionId = req.cookies.sessionId;
  
  if (sessionId && sessions[sessionId]) {
    delete sessions[sessionId];
  }

  res.clearCookie('sessionId', {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });
  
  res.redirect('/login');
});

// Login form
app.get('/login', (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form action="/login" method="POST">
      <input type="text" name="username" placeholder="Username" required>
      <input type="password" name="password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
  `);
});

// Generate and store CSRF tokens
const csrfTokens = {};

// Middleware to check CSRF token
const csrfProtection = (req, res, next) => {
  if (req.method === 'GET') {
    const csrfToken = crypto.randomBytes(16).toString('hex');
    const sessionId = req.cookies.sessionId;
    
    if (sessionId) {
      csrfTokens[sessionId] = csrfToken;
      res.locals.csrfToken = csrfToken;
    }
    return next();
  }

  const sessionId = req.cookies.sessionId;
  const csrfToken = req.body._csrf;
  
  if (!sessionId || !csrfToken || csrfTokens[sessionId] !== csrfToken) {
    return res.status(403).send('Invalid CSRF token');
  }
  
  delete csrfTokens[sessionId];
  next();
};

// Protected form with CSRF token
app.get('/transfer', (req, res) => {
  const sessionId = req.cookies.sessionId;
  
  if (!sessionId || !sessions[sessionId]) {
    return res.redirect('/login');
  }

  res.send(`
    <h1>Money Transfer</h1>
    <form action="/transfer" method="POST">
      <input type="hidden" name="_csrf" value="${res.locals.csrfToken || ''}">
      <input type="text" name="amount" placeholder="Amount">
      <input type="text" name="to" placeholder="Recipient">
      <button type="submit">Transfer</button>
    </form>
  `);
});

app.post('/transfer', csrfProtection, (req, res) => {
  // Process the transfer
  res.send('Transfer successful!');
});

// Add security headers
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Content-Security-Policy': "default-src 'self'",
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  });
  next();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});
