/**
 * Deployment Routes
 */
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { requireAuth } = require('../middleware/auth');

router.post('/:id', requireAuth, async (req, res) => {
    const db = global.db;
    const botId = req.params.id;

    db.get('SELECT * FROM bots WHERE id = ? AND user_id = ?', [botId, req.user.id], async (err, bot) => {
        if (err || !bot) return res.status(404).json({ error: 'Bot not found' });

        try {
            await axios.get(`https://api.telegram.org/bot${bot.token}/getMe`);
            
            db.run('UPDATE bots SET status = ?, deployed_at = CURRENT_TIMESTAMP WHERE id = ?', ['running', botId]);
            
            res.json({ message: 'Bot deployed successfully', status: 'running' });
        } catch (e) {
            res.status(400).json({ error: 'Invalid bot token' });
        }
    });
});

router.delete('/:id', requireAuth, (req, res) => {
    const db = global.db;
    db.run('UPDATE bots SET status = ? WHERE id = ? AND user_id = ?', ['stopped', req.params.id, req.user.id], function(err) {
        if (err) return res.status(500).json({ error: 'Failed to stop' });
        res.json({ message: 'Bot stopped', status: 'stopped' });
    });
});

module.exports = router;