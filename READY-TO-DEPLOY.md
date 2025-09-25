# ✅ READY TO DEPLOY - IGNITE HEALTH SYSTEMS

Your Google Sheet ID is confirmed: `1kPYgthwKzREJYKjAnE4h1YFMRxg5ulynrbDYNRxb8Lo`
Sheet URL: https://docs.google.com/spreadsheets/d/1kPYgthwKzREJYKjAnE4h1YFMRxg5ulynrbDYNRxb8Lo/edit

## 🎯 QUICK SETUP (20 minutes total)

### Step 1: n8n Setup (10 min)
1. Open n8n dashboard
2. **Add Credentials:**
   - Google Sheets OAuth2:
     - Client ID: `1081537218623-vd49amlhge4as748isvhp878e46ue3js.apps.googleusercontent.com`
     - Client Secret: `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`
   - Mailchimp API:
     - API Key: `4a9b4b106d058262743bad53cdee7016-us18`
   - Telegram API:
     - Access Token: `8319012498:AAHJBliXmeVdH9JM_YTdcdmtlUjXmwCmLzU`

3. **Import Workflows:**
   - Import `/n8n-workflows/1-interest-form-handler.json`
   - Import `/n8n-workflows/2-monthly-content-pipeline.json`
   - Update credential IDs in each workflow
   - Activate both workflows
   - Copy the webhook URL from workflow 1

### Step 2: Cloudflare Pages (5 min)
1. Go to https://dash.cloudflare.com → Pages
2. Add environment variable:
   - `NEXT_PUBLIC_N8N_WEBHOOK_URL` = [Your webhook URL]
3. Trigger new deployment

### Step 3: Update DNS (5 min)
1. Go to Cloudflare DNS
2. **Delete** these A records:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
3. **Add** CNAME record:
   - Name: `@`
   - Target: `ignite-health-systems-website.pages.dev`
   - Proxy: ON

## ✨ Everything is configured with your credentials:
- ✅ Google Sheet ID: `1kPYgthwKzREJYKjAnE4h1YFMRxg5ulynrbDYNRxb8Lo`
- ✅ Gemini API Key: Already in workflows
- ✅ Mailchimp Audience: `9884a65adf`
- ✅ Telegram Chat ID: `5407628621`
- ✅ All OAuth credentials ready

## 🔥 Your website will be live at https://ignitehealthsystems.com after DNS updates!