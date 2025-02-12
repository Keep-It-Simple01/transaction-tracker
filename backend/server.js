const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let transactions = []; // In-memory storage

// Login API
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'test' && password === 'password') {
        return res.json({ success: true, message: 'Login successful' });
    }
    res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// Get Transactions
app.get('/transactions', (req, res) => {
    res.json(transactions);
});

// Add Transaction
app.post('/transactions', (req, res) => {
    const { date, amount, description } = req.body;
    if (!date || !amount || !description) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const newTransaction = { id: transactions.length + 1, date, amount, description };
    transactions.push(newTransaction);
    res.json({ success: true, transaction: newTransaction });
});

app.listen(5000, () => console.log('Server running on port 5000'));
