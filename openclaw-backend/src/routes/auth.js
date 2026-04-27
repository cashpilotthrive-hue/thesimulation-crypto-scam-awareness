/**
 * Authentication Routes
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields required' });
        }

        const db = global.db;
        db.get('SELECT id FROM users WHERE email = ? OR username = ?', [email, username], async (err, user) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (user) return res.status(400).json({ error: 'User exists' });

            const passwordHash = await bcrypt.hash(password, 10);
            db.run('INSERT INTO users (username, email, password_hash, plan) VALUES (?, ?, ?, ?)',
                [username, email, passwordHash, 'free'],
                function(err) {
                    if (err) return res.status(500).json({ error: 'Failed to create user' });

                    const token = jwt.sign(
                        { id: this.lastID, username, plan: 'free' },
                        process.env.JWT_SECRET || 'secret',
                        { expiresIn: '30d' }
                    );

                    res.status(201).json({
                        message: 'User created',
                        token,
                        user: { id: this.lastID, username, email, plan: 'free' }
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = global.db;

        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });

            const valid = await bcrypt.compare(password, user.password_hash);
            if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

            const token = jwt.sign(
                { id: user.id, username: user.username, plan: user.plan },
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '30d' }
            );

            res.json({ message: 'Login successful', token, user: { id: user.id, username: user.username, email: user.email, plan: user.plan } });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/me', requireAuth, (req, res) => {
    const db = global.db;
    db.get('SELECT id, username, email, plan, created_at FROM users WHERE id = ?', [req.user.id], (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ user });
    });
});

const { requireAuth } = require('../middleware/auth');
module.exports = router;