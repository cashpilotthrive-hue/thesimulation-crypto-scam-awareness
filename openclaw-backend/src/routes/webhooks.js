/**
 * Webhook Routes
 */
const express = require('express');
const router = express.Router();

router.post('/telegram/:botId', async (req, res) => {
    const botId = req.params.botId;
    const update = req.body;
    const db = global.db;

    db.run('INSERT INTO analytics (bot_id, event_type, event_data) VALUES (?, ?, ?)',
        [botId, 'webhook', JSON.stringify(update)]);

    if (update.message) {
        db.run('UPDATE bots SET messages_count = messages_count + 1, last_active = CURRENT_TIMESTAMP WHERE id = ?', [botId]);
    }

    res.json({ ok: true });
});

module.exports = router;