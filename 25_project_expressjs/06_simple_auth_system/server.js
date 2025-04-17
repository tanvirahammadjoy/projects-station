// Simple Auth System
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const checkToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === '123456') {
    next();
  } else {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Accepts username/password, returns token
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    res.json({ token: '123456' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Protected route, requires token
// app.get('/dashboard', (req, res) => {
//   const token = req.headers.authorization;
//   if (token === '123456') {
//     res.json({ message: 'Access granted' });
//   } else {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// });

app.get('/dashboard', checkToken, (req, res) => {
  res.json({ message: 'Access granted' });
});

// "Logs out" the user (just sends a message)
app.get('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
