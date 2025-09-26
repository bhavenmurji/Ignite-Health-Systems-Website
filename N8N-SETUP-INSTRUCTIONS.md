# 🚀 N8N SETUP INSTRUCTIONS FOR IGNITE HEALTH SYSTEMS

## ⚡ Quick Overview
You have 2 main workflows that need to be set up in n8n:
1. **Interest Form Handler** - Processes website form submissions
2. **Monthly Content Pipeline** - Generates AI articles monthly

## 📋 Prerequisites

### 1. Google Sheets Setup
Create a Google Sheet named **"Ignite Content Hub"** with 2 tabs:

**Tab 1: "Leads"**
- Timestamp | User Type | First Name | Last Name | Email | Specialty | Practice Model | EMR System | LinkedIn | Involvement | Challenge | Co-Founder Interest

**Tab 2: "Articles"**
- Date | Status | Research | Draft | Approved Date | Campaign ID

### 2. n8n Credentials Setup

You need to create these credentials in n8n:

#### A. Google Sheets OAuth2
1. Go to n8n → Credentials → Add Credential → Google Sheets OAuth2
2. Use these values:
   - Client ID: `1081537218623-vd49amlhge4as748isvhp878e46ue3js.apps.googleusercontent.com`
   - Client Secret: `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`
3. Complete OAuth flow
4. Note the credential ID

#### B. Mailchimp API
1. Go to n8n → Credentials → Add Credential → Mailchimp API
2. API Key: `4a9b4b106d058262743bad53cdee7016-us18`
3. Note the credential ID

#### C. Telegram Bot
1. Go to n8n → Credentials → Add Credential → Telegram API
2. Access Token: `8319012498:AAHJBliXmeVdH9JM_YTdcdmtlUjXmwCmLzU`
3. Note the credential ID

## 🔧 Workflow Setup

### Workflow 1: Interest Form Handler

1. **Import the workflow:**
   - Open n8n
   - Go to Workflows → Import from File
   - Import: `n8n-workflows/1-interest-form-handler.json`

2. **Update these placeholders:**
   - Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your Google Sheet ID
   - Replace `YOUR_GOOGLE_SHEETS_CREDENTIAL_ID` with credential ID from step 2A
   - Replace `YOUR_MAILCHIMP_CREDENTIAL_ID` with credential ID from step 2B
   - Replace `YOUR_TELEGRAM_CREDENTIAL_ID` with credential ID from step 2C

3. **Activate the workflow**

4. **Get your webhook URL:**
   - Click on the Webhook node
   - Copy the Production URL (will look like: `https://your-n8n.com/webhook/interest-form`)

5. **Update website environment variable:**
   - Add to Cloudflare Pages environment variables:
   - `NEXT_PUBLIC_N8N_WEBHOOK_URL=YOUR_WEBHOOK_URL_HERE`

### Workflow 2: Monthly Content Pipeline

1. **Import the workflow:**
   - Import: `n8n-workflows/2-monthly-content-pipeline.json`

2. **Update placeholders:**
   - Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your Google Sheet ID
   - Replace `YOUR_TELEGRAM_CREDENTIAL_ID` with credential ID from step 2C

3. **Activate the workflow**

## 🔄 Approval Workflow (Manual Setup Required)

Create a third workflow for handling approvals:

1. **Create new workflow** named "Article Approval Handler"

2. **Add Telegram Trigger node:**
   - Set to listen for messages
   - Connect your Telegram credential

3. **Add Switch node:**
   - Check if message contains "approve" or "reject"

4. **If "approve" branch:**
   - Add Google Sheets node to update status to "Approved"
   - Add Mailchimp node to create campaign:
     - List ID: `9884a65adf`
     - Use article content from Google Sheets
   - Send confirmation to Telegram

5. **If "reject" branch:**
   - Update Google Sheets status to "Rejected"
   - Send confirmation to Telegram

## 🌐 Cloudflare Pages Configuration

### Update DNS (You already have GitHub Pages IPs, need to change):

1. **Delete current A records** pointing to:
   - 185.199.108.153
   - 185.199.109.153
   - 185.199.110.153
   - 185.199.111.153

2. **Add CNAME record:**
   - Name: `@` (or `ignitehealthsystems.com`)
   - Target: `ignite-health-systems-website.pages.dev`
   - Proxy: ON (orange cloud)

3. **Keep existing www CNAME** if you want www to work

### Deploy Settings in Cloudflare Pages:

1. **Build configuration:**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`

2. **Environment variables to add:**
   ```
   NEXT_PUBLIC_N8N_WEBHOOK_URL=<your-n8n-webhook-url>
   NEXT_PUBLIC_DOMAIN=https://ignitehealthsystems.com
   ```

3. **Node.js version:** 18.17.0

## ✅ Testing Checklist

1. **Test Interest Form:**
   - Go to website and submit form
   - Check Google Sheets for new entry
   - Check Mailchimp for physician subscribers
   - Check Telegram for investor/AI notifications

2. **Test Monthly Pipeline:**
   - Manually execute workflow in n8n
   - Check Telegram for approval request
   - Reply with "approve"
   - Check Mailchimp for campaign creation

## 🚨 Important Notes

1. **Gemini API** is already included in the workflows with your key
2. **Telegram Chat ID** `5407628621` is Dr. Murji's ID
3. **Mailchimp Audience ID** `9884a65adf` is already configured
4. The website form will POST to your n8n webhook URL
5. Monthly content runs on the 1st of each month at 9 AM

## 📞 Troubleshooting

If forms aren't submitting:
- Check browser console for CORS errors
- Ensure webhook URL is HTTPS
- Check n8n webhook is active

If Telegram isn't working:
- Message @IgniteSiteBot with /start first
- Ensure bot token is correct

If Google Sheets isn't working:
- Re-authenticate OAuth2
- Check sheet names match exactly
- Ensure sheet is shared with service account

## 🎯 Next Steps

1. Import and configure both workflows
2. Update Cloudflare DNS to point to Pages (not GitHub)
3. Add environment variables to Cloudflare Pages
4. Test the form submission flow
5. Test the monthly content generation

Your website is now pushed to GitHub and will auto-deploy once you update the DNS!