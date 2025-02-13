const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key'; 

const users = [
  { id: 1, username: 'test', password: 'password' } // Example user
];

const transactions = [
  { id: 1, date: '2025-02-13', amount: 50, description: 'Groceries' },
  { id: 2, date: '2025-02-12', amount: 20, description: 'Coffee' }
];

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get token from "Authorization" header
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token.' });
    req.user = user; // Attach user data to request
    next();
  });
};

// Login Route - Generates JWT Token
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Protect the transactions route
app.get('/transactions', authenticateToken, (req, res) => {
  res.json(transactions);
});

// Protected Route to Add Transaction
app.post('/transactions', authenticateToken, (req, res) => {
  const { date, amount, description } = req.body;
  const newTransaction = { id: transactions.length + 1, date, amount, description };
  transactions.push(newTransaction);
  res.json({ success: true, transaction: newTransaction });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
