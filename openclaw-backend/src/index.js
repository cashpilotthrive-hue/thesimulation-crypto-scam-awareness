/**
 * OpenClaw Backend - Main Entry Point
 * Telegram Bot Deployment Platform
 * FREE FOR ALL - Under Ownership Model
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { initDatabase } = require('./database/init');
const authRoutes = require('./routes/auth');
const botRoutes = require('./routes/bots');
const deployRoutes = require('./routes/deploy');
const analyticsRoutes = require('./routes/analytics');
const apiRoutes = require('./routes/api');
const webhookRoutes = require('./routes/webhooks');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));

// Rate limiting - generous for free access
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000,
    message: { error: 'Too many requests' }
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'OpenClaw Backend',
        version: '1.0.0',
        uptime: process.uptime(),
        mode: 'FREE_FOR_ALL'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bots', botRoutes);
app.use('/api/deploy', deployRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api', apiRoutes);
app.use('/api/webhooks', webhookRoutes);

// Bot runtime
const { BotManager } = require('./services/botManager');
const botManager = new BotManager();
app.set('botManager', botManager);

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

async function startServer() {
    try {
        await initDatabase();
        console.log('✅ Database initialized');
        
        app.listen(PORT, () => {
            console.log(`
╔═══════════════════════════════════════════════════════════╗
║   🦀 OPENCLAW BACKEND - RUNNING                          ║
║   Server: http://localhost:${PORT}                         ║
║   Mode: FREE FOR ALL (Unlimited Access)                   ║
╚═══════════════════════════════════════════════════════════╝
            `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
module.exports = app;