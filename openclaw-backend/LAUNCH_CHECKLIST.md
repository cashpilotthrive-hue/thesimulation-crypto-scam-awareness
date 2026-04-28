# 🚀 OpenClaw Launch Checklist

## Pre-Launch (Day Before)

- [ ] **Domain**: Purchase openclaw.io
- [ ] **GitHub**: Repository is public and complete
- [ ] **Code**: All files pushed to main branch
- [ ] **Testing**: API endpoints tested locally

## Day 1: Deployment

### Step 1: Deploy Backend to Vercel
```bash
npm install -g vercel
vercel login
cd openclaw-backend
vercel --prod
```

### Step 2: Configure Environment
- [ ] JWT_SECRET set
- [ ] DATABASE_PATH configured
- [ ] FRONTEND_URL set

### Step 3: Test API
- [ ] Health check: `GET /health`
- [ ] Register: `POST /api/auth/register`
- [ ] Login: `POST /api/auth/login`
- [ ] Create bot: `POST /api/bots`

## Day 2: Domain & SSL

### Step 4: Configure DNS
Add at domain registrar:

| Type | Host | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

### Step 5: Add Domain to Vercel
```bash
vercel domains add openclaw.io
```

### Step 6: Verify SSL
- [ ] HTTPS working
- [ ] Auto-redirect HTTP → HTTPS

## Day 3: Production Ready

### Step 7: Landing Page
- [ ] GitHub Pages deployed
- [ ] Custom domain connected
- [ ] All links working

### Step 8: Documentation
- [ ] API docs accessible
- [ ] README complete
- [ ] Deployment guides ready

### Step 9: Payment (Optional)
- [ ] Stripe configured
- [ ] PayPal configured
- [ ] Crypto wallets set

### Step 10: Launch!
- [ ] Announce on social media
- [ ] Share on GitHub
- [ ] Tell friends! 🎉

---

## Quick Commands

```bash
# Deploy to Vercel
vercel --prod

# Check status
curl https://openclaw.io/health

# View logs
vercel logs openclaw-backend

# Add domain
vercel domains add openclaw.io
```