# 📧 Mailchimp Email Automation Setup - Complete Guide

## ✅ Current Status

### What's Working:
1. **n8n Webhook**: Active at `https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form`
2. **Form Configuration**: Website form configured with webhook URL
3. **Field Mapping**: Form fields properly mapped to Mailchimp expectations

### What's Needed:
1. Create 4 automations in Mailchimp UI
2. Test the complete flow

---

## 🚀 Quick Setup Instructions

### Step 1: Log into Mailchimp
- URL: https://us18.admin.mailchimp.com
- Audience ID: `9884a65adf`

### Step 2: Create Physician Automation
1. **Automations** → **Create** → **Custom Journey**
2. Name: "Physician Welcome Series"
3. Trigger: **Tag added** → `physician`
4. Email Subject: `🔥 Reclaim Your Medical Practice`
5. Timing: **Immediately**
6. **Start Sending**

### Step 3: Create Investor Automation
1. **Automations** → **Create** → **Custom Journey**
2. Name: "Investor Welcome Series"
3. Trigger: **Tag added** → `investor`
4. Email Subject: `💰 Healthcare's $50B Opportunity`
5. Timing: **Immediately**
6. **Start Sending**

### Step 4: Create Specialist Automation
1. **Automations** → **Create** → **Custom Journey**
2. Name: "Specialist Welcome Series"
3. Trigger: **Tag added** → `specialist`
4. Email Subject: `🚀 Join the Healthcare Revolution`
5. Timing: **Immediately**
6. **Start Sending**

### Step 5: Create Co-founder Alert
1. **Automations** → **Create** → **Custom Journey**
2. Name: "Co-founder Priority Alert"
3. Trigger: **Tag added** → `cofounder-interest`
4. Action: **Send Notification** to admin
5. **Start Sending**

---

## 🧪 Test the Complete Flow

### Test Command:
```bash
curl -X POST "https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "Physician",
    "email": "your-email@example.com",
    "userType": "physician",
    "specialty": "Family Medicine",
    "practiceModel": "independent",
    "emrSystem": "Epic",
    "challenge": "Documentation burden",
    "cofounder": false
  }'
```

### Expected Results:
1. ✅ Entry in Google Sheets
2. ✅ Contact in Mailchimp with tags
3. ✅ Automated email within 5 minutes
4. ✅ Telegram notification (if investor/specialist)

---

## 📋 Merge Tags Reference

Use these in your email templates:

- `*|FNAME|*` - First name
- `*|LNAME|*` - Last name
- `*|USERTYPE|*` - User type
- `*|SPECIALTY|*` - Medical specialty
- `*|PRACTICE|*` - Practice model
- `*|EMR|*` - EMR system
- `*|CHALLENGE|*` - Main challenge
- `*|COFOUNDER|*` - Co-founder interest
- `*|LINKEDIN|*` - LinkedIn URL

---

## 🔧 Troubleshooting

### If automations don't trigger:
1. Check automation is "Active" not "Paused"
2. Verify tag spelling (case-sensitive)
3. Ensure contact status is "Subscribed"

### If webhook fails:
1. Check n8n workflow is active
2. Verify webhook URL in `.env.local`
3. Test with curl command above

---

## 📊 Success Metrics

- **Email Delivery**: >95%
- **Open Rate**: 40%+ physicians, 30%+ investors
- **Click Rate**: 15%+ all segments
- **Response Time**: <24hr for co-founders

---

*Your system is ready! Just create the automations in Mailchimp and test.*