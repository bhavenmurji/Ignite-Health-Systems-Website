# Environment Configuration Guide

This guide explains how to set up environment variables for the Ignite Health Systems website. Environment variables store sensitive configuration data and API keys that should never be committed to version control.

## 📋 Quick Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file** with your actual values
3. **Restart your development server** for changes to take effect

## 🔐 Security Best Practices

- **NEVER commit `.env` files** - they contain sensitive information
- Use strong, unique passwords and API keys
- Rotate API keys regularly
- Use different keys for development, staging, and production
- Enable 2FA on all service accounts

## 📚 Environment Variables Reference

### Core Application Settings

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NODE_ENV` | Runtime environment | ✅ | `development`, `production`, `test` |
| `PORT` | API server port | ✅ | `3001` |

### 🌩️ Cloudflare Configuration

Required for deployment and CDN functionality.

#### CLOUDFLARE_API_TOKEN ⭐ **CRITICAL**
- **Purpose**: Authenticates with Cloudflare API for deployment
- **Required**: Yes (for Cloudflare Pages deployment)
- **How to get**:
  1. Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
  2. Click "Create Token"
  3. Use "Zone:Zone:Read" + "Zone:Page Rule:Edit" template
  4. Select your domain
- **Example**: `SAj_Sl6MybJm6xjNzNOkDR-DfRTtJKK4VLxkbaYP`

#### CLOUDFLARE_ACCOUNT_ID ⭐ **CRITICAL**
- **Purpose**: Identifies your Cloudflare account
- **Required**: Yes (for Cloudflare Pages)
- **How to get**: Right sidebar on any Cloudflare dashboard page
- **Example**: `b9c488907659edd5db3b39c0151a26b8`

#### CLOUDFLARE_ZONE_ID ⭐ **CRITICAL**
- **Purpose**: Identifies your domain zone
- **Required**: Yes (for domain management)
- **How to get**: Overview tab → right sidebar
- **Example**: `1adc1ca38d5f6c213fa65cd14e5753e9`

### 🔄 N8N Workflow Automation

Powers form submissions and email automation.

#### NEXT_PUBLIC_N8N_WEBHOOK_URL ⭐ **CRITICAL**
- **Purpose**: Receives form submissions from website
- **Required**: Yes (for contact forms)
- **Client-side**: Yes (accessible in browser)
- **Example**: `https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form`
- **Security**: ✅ Safe to expose (designed for public webhook access)

#### N8N_API_KEY
- **Purpose**: Server-side N8N API access
- **Required**: No (optional workflow features)
- **How to get**: N8N Settings → API → Generate Token
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### N8N_WEBHOOK_URL
- **Purpose**: Server-side webhook for newsletter subscriptions
- **Required**: No (optional feature)
- **Client-side**: No (server-side only)
- **Example**: `https://your-n8n-instance.com/webhook/ignite-signup`

### 📧 Email Configuration

For transactional emails and notifications.

#### EMAIL_USER & EMAIL_PASS
- **Purpose**: SMTP credentials for sending emails
- **Required**: No (forms work without email)
- **Gmail Setup**:
  1. Enable 2-factor authentication
  2. Generate App Password
  3. Use your email + app password
- **Example**:
  - `EMAIL_USER=your-email@gmail.com`
  - `EMAIL_PASS=abcd efgh ijkl mnop` (app password)

#### ADMIN_EMAIL
- **Purpose**: Where to send form submissions
- **Required**: No (defaults to EMAIL_USER)
- **Example**: `admin@ignitehealthsystems.com`

### 🔍 Analytics & Tracking

Optional services for user analytics.

#### NEXT_PUBLIC_GA_ID
- **Purpose**: Google Analytics tracking
- **Required**: No (analytics optional)
- **Client-side**: Yes
- **Example**: `G-XXXXXXXXXX`

#### NEXT_PUBLIC_FB_PIXEL_ID
- **Purpose**: Facebook Pixel tracking
- **Required**: No
- **Example**: `123456789012345`

#### NEXT_PUBLIC_HOTJAR_ID
- **Purpose**: Hotjar user behavior tracking
- **Required**: No
- **Example**: `1234567`

### 🔗 Third-Party Services

#### Mailchimp Integration
- `MAILCHIMP_API_KEY`: For email marketing
- `MAILCHIMP_AUDIENCE_ID`: Target audience for signups

#### Google OAuth
- `GOOGLE_OAUTH_CLIENT_ID`: Google sign-in
- `GOOGLE_OAUTH_CLIENT_SECRET`: Google authentication

#### AI Services
- `GEMINI_API_KEY`: Google Gemini AI
- `OPENAI_API_KEY`: OpenAI GPT models
- `ANTHROPIC_API_KEY`: Claude AI models

## 🚨 Environment-Specific Configuration

### Development Environment (.env.local)
```bash
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-dev-n8n.com/webhook/test
DEBUG=ignite:*
```

### Production Environment
```bash
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://ignitehealthsystems.com
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n.com/webhook/ignite-interest-form
```

## 🔧 Environment Variable Types

### Public Variables (`NEXT_PUBLIC_*`)
- **Exposed to browser**: Yes
- **Use for**: URLs, public configuration, analytics IDs
- **Security**: Only use for non-sensitive data
- **Examples**: API endpoints, domain names, tracking IDs

### Private Variables
- **Exposed to browser**: No (server-side only)
- **Use for**: API keys, secrets, database credentials
- **Security**: Keep these secret
- **Examples**: Database passwords, API keys, encryption keys

## 🧪 Testing Your Configuration

### 1. Check Environment Loading
```bash
# Start development server and check logs
npm run dev

# Look for environment variable logs in console
```

### 2. Test Form Submission
1. Fill out the interest form on localhost:3000
2. Check browser network tab for webhook call
3. Verify N8N receives the data

### 3. Verify Cloudflare Connection
```bash
# Test API token
curl -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

## ❌ Common Issues & Solutions

### Issue: Form not submitting
**Cause**: Missing `NEXT_PUBLIC_N8N_WEBHOOK_URL`
**Solution**: Add the webhook URL to your `.env` file with `NEXT_PUBLIC_` prefix

### Issue: Cloudflare deployment fails
**Cause**: Missing Cloudflare credentials
**Solution**: Add all three Cloudflare variables:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_ZONE_ID`

### Issue: Environment variables not loading
**Cause**: Server not restarted after changes
**Solution**: Restart your development server (`npm run dev`)

### Issue: "Process is not defined" error
**Cause**: Using server-side variables in client-side code
**Solution**: Add `NEXT_PUBLIC_` prefix for client-side access

## 📖 Advanced Configuration

### Environment File Priority
Next.js loads environment files in this order:
1. `.env.local` (highest priority, always ignored by git)
2. `.env.production`, `.env.development`, `.env.test` (environment-specific)
3. `.env` (lowest priority)

### Custom Environment Variables
Add your own variables following these patterns:
- **Server-side**: `YOUR_VARIABLE_NAME`
- **Client-side**: `NEXT_PUBLIC_YOUR_VARIABLE_NAME`

### Conditional Loading
```javascript
const isDevelopment = process.env.NODE_ENV === 'development'
const webhookUrl = isDevelopment
  ? 'http://localhost:5678/webhook/test'
  : process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL
```

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] All required environment variables set
- [ ] Production URLs configured (not localhost)
- [ ] API keys are production-ready (not test keys)
- [ ] Sensitive data is not in `NEXT_PUBLIC_*` variables
- [ ] `.env` files are not committed to git
- [ ] Cloudflare tokens have correct permissions

## 📞 Need Help?

If you encounter issues with environment configuration:

1. **Check the logs**: Look for specific error messages
2. **Verify API keys**: Test them independently
3. **Compare with .env.example**: Ensure all required variables are set
4. **Check service status**: Verify third-party services are operational

For additional support, refer to the deployment troubleshooting guide or reach out to the development team.