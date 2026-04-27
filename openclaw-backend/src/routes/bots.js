/**
 * Bot Management Routes
 */
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, (req, res) => {
    const db = global.db;
    db.all('SELECT id, name, description, status, messages_count, created_at FROM bots WHERE user_id = ? ORDER BY created_at DESC', 
        [req.user.id], (err, bots) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ bots });
        }
    );
});

router.post('/', requireAuth, (req, res) => {
    const { name, description, token, code } = req.body;
    const db = global.db;

    if (!name || !token) return res.status(400).json({ error: 'Name and token required' });

    db.run('INSERT INTO bots (user_id, name, description, token, code) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, name, description || '', token, code || ''],
        function(err) {
            if (err) return res.status(500).json({ error: 'Failed to create bot' });
            res.status(201).json({ message: 'Bot created', bot: { id: this.lastID, name, status: 'stopped' } });
        }
    );
});

router.get('/:id', requireAuth, (req, res) => {
    const db = global.db;
    db.get('SELECT * FROM bots WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], (err, bot) => {
        if (err || !bot) return res.status(404).json({ error: 'Bot not found' });
        res.json({ bot });
    });
});

router.put('/:id', requireAuth, (req, res) => {
    const { name, description, code } = req.body;
    const db = global.db;
    db.run('UPDATE bots SET name = ?, description = ?, code = ? WHERE id = ? AND user_id = ?',
        [name, description, code, req.params.id, req.user.id],
        function(err) {
            if (err) return res.status(500).json({ error: 'Failed to update' });
            res.json({ message: 'Bot updated' });
        }
    );
});

router.delete('/:id', requireAuth, (req, res) => {
    const db = global.db;
    db.run('DELETE FROM bots WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], function(err) {
        if (err) return res.status(500).json({ error: 'Failed to delete' });
        res.json({ message: 'Bot deleted' });
    });
});

module.exports = router;