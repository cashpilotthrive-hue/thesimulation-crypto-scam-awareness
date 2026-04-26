/**
 * The Simulation - Backend Server
 * Crypto Scam Awareness VR Experience
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/status', (req, res) => {
    res.json({ status: 'online', version: '1.0.0', timestamp: new Date().toISOString() });
});

app.post('/api/subscribe', (req, res) => {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email' });
    }
    console.log(`New subscriber: ${email}`);
    res.json({ success: true, message: 'Welcome to the awakening!' });
});

app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields required' });
    }
    res.json({ success: true, message: 'Message received.' });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🎮 The Simulation running on port ${PORT}`);
});

module.exports = app;