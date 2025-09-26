# 🚀 N8N CLOUD SETUP - IGNITE HEALTH SYSTEMS

Your n8n cloud instance: https://bhavenmurji.app.n8n.cloud

## ✅ Already Configured
- Google Sheets OAuth (authorized)
- Mailchimp API (authorized)
- Telegram Bot (authorized)
- Gemini API (authorized)
- Google Sheet ID: `1kPYgthwKzREJYKjAnE4h1YFMRxg5ulynrbDYNRxb8Lo`

## 📋 Import Workflows (5 minutes)

### Workflow 1: Interest Form Handler
1. Go to https://bhavenmurji.app.n8n.cloud/workflow/RlrkEXOPAyeowkJ5
2. Delete existing nodes (if any)
3. Click "..." menu → Import from File
4. Import: `/n8n-workflows/ignite-form-handler-native.json`
5. Save the workflow
6. **Activate** the workflow (toggle on)
7. Click on the Webhook node
8. Copy the **Production URL** (will look like: `https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form`)

**YOUR WEBHOOK URL**: _________________________________

### Workflow 2: Monthly Content Pipeline
1. Create new workflow in n8n
2. Import: `/n8n-workflows/monthly-content-pipeline-native.json`
3. Save and name it "Ignite Monthly Content"
4. **Activate** the workflow

### Optional Workflow 3: Approval Handler
Create a separate workflow to handle Telegram approvals:
1. Create new workflow
2. Add **Telegram Trigger** node (listen for messages)
3. Add **If** node to check for "approve" or "reject"
4. If approved → Update Google Sheets status + Create Mailchimp campaign
5. If rejected → Update Google Sheets status to "Rejected"

## 🌐 Update Website Environment Variable

### Option A: Cloudflare Pages
1. Go to Cloudflare Pages settings
2. Add environment variable:
   ```
   NEXT_PUBLIC_N8N_WEBHOOK_URL=https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form
   ```
3. Redeploy

### Option B: Local Testing
1. Create `.env.local`:
   ```
   NEXT_PUBLIC_N8N_WEBHOOK_URL=https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form
   ```
2. Run `npm run dev`

## 🧪 Test the Integration

### Test Form Submission:
```bash
curl -X POST https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form \
  -H "Content-Type: application/json" \
  -d '{
    "userType": "physician",
    "firstName": "Test",
    "lastName": "Doctor",
    "email": "test@example.com",
    "specialty": "Cardiology",
    "practiceModel": "Private Practice",
    "emrSystem": "Epic",
    "involvement": "innovation-council",
    "challenge": "Burnout from documentation"
  }'
```

### Expected Results:
1. ✅ Entry appears in Google Sheets "Leads" tab
2. ✅ Physician added to Mailchimp audience
3. ✅ For investor/specialist: Telegram notification sent

### Test Monthly Pipeline:
1. Go to workflow in n8n
2. Click "Execute Workflow" button (manual trigger)
3. Check:
   - Google Sheets "Articles" tab for new entry
   - Telegram for approval request

## 📊 Monitoring

### Check Webhook Activity:
- Go to workflow → Executions tab
- See all form submissions and their status

### Check Monthly Pipeline:
- Runs automatically on 1st of each month at 9 AM
- Manual test anytime with "Execute Workflow"

## 🔧 Troubleshooting

### Form not submitting?
- Verify webhook URL in website environment variables
- Check CORS settings in webhook node (should allow *)
- Check browser console for errors

### Google Sheets not updating?
- Verify Sheet ID: `1kPYgthwKzREJYKjAnE4h1YFMRxg5ulynrbDYNRxb8Lo`
- Check column names match exactly
- Re-authorize Google Sheets if needed

### Telegram not working?
- Send `/start` to @IgniteSiteBot first
- Verify chat ID is `5407628621`

### Gemini errors?
- Check API quota limits
- Verify model name is `gemini-1.5-flash`

## 📝 Important URLs
- n8n Dashboard: https://bhavenmurji.app.n8n.cloud
- Your Workflow: https://bhavenmurji.app.n8n.cloud/workflow/RlrkEXOPAyeowkJ5
- Google Sheet: https://docs.google.com/spreadsheets/d/1kPYgthwKzREJYKjAnE4h1YFMRxg5ulynrbDYNRxb8Lo/edit
- Website: https://ignitehealthsystems.com (after DNS update)

## ✨ You're all set! The workflows use native n8n nodes with your pre-authorized credentials.