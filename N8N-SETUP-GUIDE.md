# 🚀 N8N SETUP GUIDE - IGNITE HEALTH SYSTEMS

## Your n8n Instance: https://bhavenmurji.app.n8n.cloud

## ✅ What You Have Configured:
- Google Sheets OAuth ✅ (credential ID: yFyCTZ00zZlR9X8F)
- Google Gemini API ✅ (credential ID: weWBsxoDFKJMvoMl)
- Telegram Bot ✅ (credential ID: LiDIXl97CJSudS2F)
- Mailchimp OAuth ✅ (credential ID: mD3c9ewb75w4RmDw)
- Google Sheet ID: `1kPYgthwKzREJYKjAnE4h1YFMRxg5ulynrbDYNRxb8Lo`

## 🆕 What You Need to Add:
- **Google Docs OAuth** - For creating article documents

## 📋 Setup Instructions

### 1️⃣ Add Google Docs Credential (2 minutes)
1. Go to n8n → Credentials → Add Credential
2. Search for "Google Docs OAuth2"
3. Use same OAuth as your Sheets:
   - Client ID: `1081537218623-vd49amlhge4as748isvhp878e46ue3js.apps.googleusercontent.com`
   - Client Secret: `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`
4. Complete OAuth flow
5. Note the credential ID

### 2️⃣ Import Article Workflow (3 minutes)
1. Go to your n8n workflows
2. Create new workflow
3. Click menu → Import from File
4. Import: `/n8n-workflows/article-workflow-with-docs.json`
5. **Update Google Docs credential ID** in the "Create Google Doc" node
6. Save and activate

### 3️⃣ Import Form Handler Workflow (3 minutes)
1. Go to workflow: https://bhavenmurji.app.n8n.cloud/workflow/RlrkEXOPAyeowkJ5
2. Click menu → Import from File (this will replace current nodes)
3. Import: `/n8n-workflows/form-handler-fixed.json`
4. Save and activate
5. Click Webhook node → Copy production URL

**Your Webhook URL**: `https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form`

### 4️⃣ Update Website Environment (2 minutes)

#### For Cloudflare Pages:
```env
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form
```

#### For Local Testing:
Create `.env.local`:
```env
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form
```

## 📊 How The Workflows Work

### Interest Form Handler Flow:
```
Form Submission → Log to Sheets → Route by User Type
                                  ↓
    Physician → Add to Mailchimp → Merge → Send Response
    Investor/Specialist → Telegram Notify → Merge → Send Response
```

### Monthly Article Flow:
```
Monthly Trigger → Research (Gemini) → Generate Article (Gemini)
                → Create Google Doc → Log to Sheets → Telegram Approval
```

## 🧪 Test Commands

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
    "challenge": "Documentation burden is killing me"
  }'
```

### Test Investor Notification:
```bash
curl -X POST https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form \
  -H "Content-Type: application/json" \
  -d '{
    "userType": "investor",
    "firstName": "John",
    "lastName": "Investor",
    "email": "investor@example.com",
    "linkedin": "linkedin.com/in/johninvestor",
    "cofounder": true,
    "challenge": "Looking to invest in healthcare AI"
  }'
```

## ✅ What The Article Workflow Does:

1. **Monthly Trigger**: Runs on 1st of each month at 9 AM
2. **Research Phase**: Gemini researches latest healthcare AI developments
3. **Article Generation**: Gemini writes 750-word newsletter article
4. **Google Doc Creation**: Creates editable document in your Google Drive
5. **Tracking**: Logs to Google Sheets with Doc URL
6. **Approval Request**: Sends Telegram message with:
   - Direct link to Google Doc for editing
   - Article preview
   - Approve/reject options

## 🎯 Benefits of Google Docs Output:

- ✏️ **Easy Editing**: Make changes directly in Google Docs
- 🔗 **Shareable Link**: Send to team for review
- 📝 **Version History**: Track all edits
- 💾 **Auto-Save**: Never lose your work
- 🎨 **Formatting**: Add images, links, formatting
- ✅ **Final Version**: Copy edited version to Mailchimp

## 📈 Google Sheets Structure

Your sheet at `1kPYgthwKzREJYKjAnE4h1YFMRxg5ulynrbDYNRxb8Lo` needs:

**Tab: "Leads"** (for form submissions)
- Timestamp | User Type | First Name | Last Name | Email | Specialty | Practice Model | EMR System | LinkedIn | Involvement | Challenge | Co-Founder Interest

**Tab: "Articles"** (for content tracking)
- Date | Status | Article Title | Google Doc URL | Doc ID | Research Summary | Word Count | Approved Date | Campaign ID

## 🔍 Troubleshooting

### Gemini Not Working?
- Check API quota at https://console.cloud.google.com
- Verify model name is `models/gemini-1.5-flash`
- Check temperature settings (0.3 for research, 0.4 for writing)

### Google Docs Not Creating?
- Re-authorize Google Docs OAuth
- Check folder permissions
- Verify credential ID is updated

### Form Not Submitting?
- Check webhook URL matches in website
- Verify CORS is set to `*`
- Check browser console for errors

## 🚨 Important Notes

1. **Webhook URL**: Must match exactly in website environment
2. **Google Docs**: Will create in your root Google Drive folder
3. **Telegram**: You'll get instant notifications for approvals
4. **Mailchimp**: Only physicians are added automatically
5. **Monthly Run**: Article generation is automated monthly

Your workflows are now set up to:
- Capture leads effectively
- Generate AI articles monthly
- Output to Google Docs for easy editing
- Track everything in Google Sheets
- Get Telegram notifications instantly