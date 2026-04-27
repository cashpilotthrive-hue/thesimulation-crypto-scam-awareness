/**
 * Analytics Routes
 */
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

router.get('/bot/:id', requireAuth, (req, res) => {
    const db = global.db;
    db.get('SELECT name, status, messages_count, created_at, last_active FROM bots WHERE id = ? AND user_id = ?', 
        [req.params.id, req.user.id], (err, bot) => {
            if (err || !bot) return res.status(404).json({ error: 'Bot not found' });
            res.json({ bot });
        }
    );
});

router.get('/summary', requireAuth, (req, res) => {
    const db = global.db;
    db.get(`SELECT 
        COUNT(*) as total_bots,
        SUM(CASE WHEN status = 'running' THEN 1 ELSE 0 END) as running_bots,
        SUM(messages_count) as total_messages
        FROM bots WHERE user_id = ?`, [req.user.id], (err, stats) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(stats);
        }
    );
});

module.exports = router;