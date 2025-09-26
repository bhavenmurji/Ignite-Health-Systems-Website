# 🚀 Ignite Health Systems - Quick Start Deployment Guide

## ⚡ 5-Minute Setup Checklist

### Prerequisites (2 minutes)
- [ ] Git repository cloned locally
- [ ] Node.js 18+ installed
- [ ] npm or yarn package manager
- [ ] Text editor ready

### Critical Configuration (3 minutes)

#### 1. Environment Setup (1 minute)
```bash
# Copy environment template
cp .env.example .env

# Edit with your credentials
nano .env  # or your preferred editor
```

#### 2. Required Environment Variables (2 minutes)
**MINIMUM REQUIRED - Add these to your `.env` file:**

```bash
# N8N Automation (CRITICAL)
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/ignite-interest-form
N8N_API_KEY=your_n8n_api_key

# Email & Notifications
MAILCHIMP_API_KEY=your_mailchimp_api_key
MAILCHIMP_AUDIENCE_ID=your_audience_id
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# Google Services
GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_google_client_secret
GEMINI_API_KEY=your_gemini_api_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
ADMIN_EMAIL=your_admin@email.com
```

#### 3. Quick Installation & Deployment
```bash
# Install dependencies
npm install

# Validate environment
npm run validate-env

# Build for production
npm run build

# Deploy (choose one)
npm run deploy              # Automated deployment
# OR manual deployment to your hosting platform
```

## ⚠️ Critical Configuration Steps

### Step 1: Activate N8N Workflow (URGENT)
1. **Login to N8N**: https://your-n8n-instance.com
2. **Navigate to**: "Interest Form Handler" workflow
3. **Activate**: Click the toggle switch (top-right)
4. **Test**: Submit a test form immediately

### Step 2: Verify Google Sheets Integration
1. **Check Sheet**: [Your Google Sheet ID from config]
2. **Verify Permissions**: Ensure service account has edit access
3. **Test Logging**: Submit form and check data appears

### Step 3: Test Email Automation
1. **Mailchimp Setup**: Verify audience list exists
2. **Welcome Emails**: Test automation triggers
3. **Telegram Alerts**: Check co-founder notifications

## 🔥 Common Pitfalls to Avoid

### ❌ **Critical Error #1**: Inactive N8N Webhook
**Problem**: Form submissions fail with "connection error"
**Solution**: Activate the workflow in N8N dashboard FIRST

### ❌ **Critical Error #2**: Wrong Environment Variables
**Problem**: `NEXT_PUBLIC_N8N_WEBHOOK_URL` doesn't match actual N8N endpoint
**Solution**: Use exact webhook URL from N8N workflow

### ❌ **Critical Error #3**: Google OAuth Scope Issues
**Problem**: Sheets integration fails with permission errors
**Solution**: Ensure Google OAuth includes Sheets and Drive scopes

### ❌ **Critical Error #4**: Missing Mailchimp Audience
**Problem**: Email automation doesn't trigger
**Solution**: Create audience in Mailchimp with ID matching config

## ✅ Success Verification

### Quick Health Check (30 seconds)
```bash
# Run automated health check
node scripts/health-check.js

# Check all endpoints
curl -X POST $NEXT_PUBLIC_N8N_WEBHOOK_URL -H "Content-Type: application/json" -d '{"test": true}'
```

### End-to-End Test (2 minutes)
1. **Fill Form**: Submit interest form on website
2. **Check N8N**: Verify execution in workflow dashboard
3. **Check Google Sheets**: Confirm data logged
4. **Check Mailchimp**: Verify contact added
5. **Check Telegram**: Confirm notification sent (if applicable)

## 🆘 Emergency Contacts & Resources

### If Something Goes Wrong
- **Documentation**: `/docs/TROUBLESHOOTING_GUIDE.md`
- **Health Check**: `npm run test:workflow`
- **Support**: admin@ignitehealthsystems.com

### Quick Reference URLs
- **N8N Dashboard**: https://your-n8n-instance.com
- **Google Sheets**: https://docs.google.com/spreadsheets/d/[SHEET_ID]
- **Mailchimp Dashboard**: https://us18.admin.mailchimp.com
- **Site Monitoring**: https://yourdomain.com/health

---

**⏱️ Total Setup Time**: 5-7 minutes
**Next Step**: Read the [Complete Integration Manual](./DEPLOYMENT_GUIDE_COMPLETE.md) for advanced configuration