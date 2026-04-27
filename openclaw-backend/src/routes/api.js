/**
 * Public API Routes
 */
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const { requireAuth } = require('../middleware/auth');

router.get('/docs', (req, res) => {
    res.json({
        name: 'OpenClaw API',
        version: '1.0.0',
        mode: 'FREE_FOR_ALL',
        endpoints: {
            auth: ['POST /api/auth/register', 'POST /api/auth/login', 'GET /api/auth/me'],
            bots: ['GET /api/bots', 'POST /api/bots', 'GET /api/bots/:id', 'PUT /api/bots/:id', 'DELETE /api/bots/:id'],
            deploy: ['POST /api/deploy/:id', 'DELETE /api/deploy/:id'],
            analytics: ['GET /api/analytics/bot/:id', 'GET /api/analytics/summary']
        }
    });
});

router.post('/keys', requireAuth, (req, res) => {
    const db = global.db;
    const key = 'oc_' + uuidv4().replace(/-/g, '');
    db.run('INSERT INTO api_keys (user_id, key, name) VALUES (?, ?, ?)', [req.user.id, key, req.body.name || 'My Key'], function(err) {
        if (err) return res.status(500).json({ error: 'Failed to create key' });
        res.json({ key, name: req.body.name || 'My Key' });
    });
});

router.post('/bot/:id/send', async (req, res) => {
    const { chat_id, text } = req.body;
    const botId = req.params.id;
    const apiKey = req.headers['x-api-key'];
    
    if (!chat_id || !text) return res.status(400).json({ error: 'chat_id and text required' });
    
    const db = global.db;
    db.get('SELECT token FROM bots b JOIN api_keys k ON b.user_id = k.user_id WHERE k.key = ? AND b.id = ?', 
        [apiKey, botId], async (err, bot) => {
            if (err || !bot) return res.status(401).json({ error: 'Invalid API key' });
            try {
                const r = await axios.post(`https://api.telegram.org/bot${bot.token}/sendMessage`, { chat_id, text });
                res.json({ success: true, message_id: r.data.result.message_id });
            } catch (e) {
                res.status(400).json({ error: e.message });
            }
        }
    );
});

module.exports = router;