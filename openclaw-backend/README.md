# 🦀 OpenClaw Backend

**100% Free Telegram Bot Deployment Platform**

## Features

- ✅ Unlimited Bots
- ✅ Unlimited Messages
- ✅ Instant Deployment
- ✅ Full REST API
- ✅ Analytics
- ✅ Webhooks
- ✅ API Keys

## Quick Start

```bash
# Install
cd openclaw-backend
npm install

# Configure
cp .env.example .env

# Run
npm start
```

## API Base: http://localhost:3000/api

### Auth
- POST /api/auth/register
- POST /api/auth/login  
- GET /api/auth/me

### Bots
- GET /api/bots - List bots
- POST /api/bots - Create bot
- GET /api/bots/:id - Get bot
- PUT /api/bots/:id - Update bot
- DELETE /api/bots/:id - Delete bot

### Deploy
- POST /api/deploy/:id - Deploy bot
- DELETE /api/deploy/:id - Stop bot

### Analytics
- GET /api/analytics/bot/:id
- GET /api/analytics/summary

---
**FREE FOR ALL** - Under Ownership Model
