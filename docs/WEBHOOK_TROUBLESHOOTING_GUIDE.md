# 🔧 WEBHOOK TROUBLESHOOTING GUIDE - IGNITE HEALTH SYSTEMS

## 🚨 QUICK DIAGNOSTIC CHECKLIST

### 1. Immediate Health Check
```bash
# Test webhook endpoint connectivity
curl -X POST https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Expected Response: JSON with success: true
# Error Response: 404 "webhook not registered"
```

### 2. Environment Variable Verification
```bash
# Check if webhook URL is configured
echo $NEXT_PUBLIC_N8N_WEBHOOK_URL

# Should output: https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form
```

### 3. N8N Dashboard Access
- URL: https://bhavenmurji.app.n8n.cloud
- Check workflow status: Should show "ACTIVE" toggle
- Verify webhook registration in workflow nodes

## 🔍 COMMON ISSUES & SOLUTIONS

### Issue 1: "Webhook URL not configured" Error

**Symptoms:**
- Form shows error message immediately on submit
- Browser console shows: `Webhook URL not configured`
- No network request visible in DevTools

**Root Cause:** Missing or incorrectly set environment variable

**Solutions:**
```bash
# For Cloudflare Pages deployment
# Add environment variable in Cloudflare dashboard:
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form

# For local development (.env.local)
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form

# Verify in browser console:
console.log(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL)
```

**Prevention:**
- Always use `NEXT_PUBLIC_` prefix for client-side variables
- Double-check environment variable spelling
- Test in both development and production environments

---

### Issue 2: "The requested webhook is not registered" (404 Error)

**Symptoms:**
- Form submits but returns 404 error
- Network request visible but fails
- N8N responds with webhook not found

**Root Cause:** N8N workflow is inactive or webhook path incorrect

**Solutions:**

#### Step 1: Activate N8N Workflow
1. Go to https://bhavenmurji.app.n8n.cloud
2. Navigate to "Interest Form Handler" workflow
3. Click the toggle switch in top-right corner to **ACTIVATE**
4. Verify status changes from "Inactive" to "Active"

#### Step 2: Verify Webhook Path
1. In N8N workflow, click the "Webhook" node
2. Check "Path" field matches: `ignite-interest-form`
3. Check "HTTP Method" is set to `POST`
4. Verify "Response Mode" is "Response Node"

#### Step 3: Test Activation
```bash
# Re-test after activation
curl -X POST https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form \
  -H "Content-Type: application/json" \
  -d '{"userType": "test", "firstName": "Test", "lastName": "User", "email": "test@example.com"}'

# Expected: {"success": true, "message": "Thank you for joining..."}
```

---

### Issue 3: Network Connectivity Issues

**Symptoms:**
- Request timeout
- "Failed to fetch" error
- CORS errors in browser console

**Diagnosis:**
```bash
# Test basic connectivity
ping bhavenmurji.app.n8n.cloud

# Test HTTPS connectivity
curl -I https://bhavenmurji.app.n8n.cloud

# Test webhook specifically with verbose output
curl -v -X POST https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

**Solutions:**
1. **DNS Issues:** Verify domain resolution
2. **SSL Issues:** Check certificate validity
3. **Firewall Issues:** Ensure port 443 is accessible
4. **CORS Issues:** Verify N8N CORS settings allow your domain

---

### Issue 4: Form Validation Errors

**Symptoms:**
- Form doesn't submit at all
- Required field errors persist
- User type selection not triggering form fields

**Solutions:**

#### Check Required Fields by User Type:
```javascript
// Physician - Required fields:
- userType: "physician"
- firstName: string (not empty)
- lastName: string (not empty)
- email: valid email format
- medicalSpecialty: string (not empty)
- practiceModel: selected option
- involvement: radio button selection

// Investor - Required fields:
- userType: "investor"
- firstName: string (not empty)
- lastName: string (not empty)
- email: valid email format
- linkedinProfile: valid URL format

// AI Specialist - Required fields:
- userType: "ai-specialist"
- firstName: string (not empty)
- lastName: string (not empty)
- email: valid email format
- linkedinProfile: valid URL format
```

#### Debug Form State:
```javascript
// Add to InterestForm.tsx for debugging
console.log('Form Data:', formData)
console.log('Required fields filled:', {
  hasUserType: !!formData.userType,
  hasFirstName: !!formData.firstName,
  hasLastName: !!formData.lastName,
  hasEmail: !!formData.email
})
```

---

### Issue 5: Telegram Notifications Not Received

**Symptoms:**
- Form submits successfully
- Data appears in Google Sheets
- No Telegram notification received

**Diagnosis in N8N:**
1. Check workflow execution log
2. Verify Telegram node credentials
3. Test Telegram bot token

**Solutions:**
```bash
# Test Telegram bot manually
curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
  -d "chat_id=${CHAT_ID}" \
  -d "text=Test message from troubleshooting"

# Replace ${BOT_TOKEN} and ${CHAT_ID} with actual values
```

**Common Fixes:**
- Re-authorize Telegram credential in N8N
- Verify chat ID is correct (should be: 5407628621)
- Check bot has permission to send messages

---

### Issue 6: Google Sheets Not Updating

**Symptoms:**
- Form submits successfully
- No data appears in Google Sheets
- N8N shows execution success

**Diagnosis:**
1. Check Google Sheets credential authorization
2. Verify Sheet ID: `1kPYgthwKzREJYKjAnE4h1YFMRxg5ulynrbDYNRxb8Lo`
3. Confirm "Leads" tab exists

**Solutions:**
1. **Re-authorize Google Sheets OAuth:**
   - Go to N8N credentials
   - Delete existing Google Sheets credential
   - Create new credential with OAuth flow

2. **Verify Sheet Structure:**
   - Check columns match N8N mapping
   - Ensure "Leads" tab exists
   - Verify write permissions

3. **Test Manually:**
   - Run single N8N workflow execution
   - Check execution log for errors
   - Verify data in Google Sheets

---

### Issue 7: Mailchimp Integration Failures

**Symptoms:**
- Physician submissions don't add to newsletter
- Mailchimp errors in N8N execution log

**Common Fixes:**
1. **API Key Issues:**
   - Verify Mailchimp API key hasn't expired
   - Check API key permissions include list management

2. **Audience ID Issues:**
   - Confirm audience ID: `9884a65adf`
   - Verify audience exists and is active

3. **Email Validation:**
   - Mailchimp rejects invalid email formats
   - Check for duplicate subscriptions

```bash
# Test Mailchimp API manually
curl -X POST "https://us18.api.mailchimp.com/3.0/lists/9884a65adf/members" \
  -u "anystring:${MAILCHIMP_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "email_address": "test@example.com",
    "status": "subscribed",
    "merge_fields": {
      "FNAME": "Test",
      "LNAME": "User"
    }
  }'
```

## 🔄 WORKFLOW EXECUTION DEBUGGING

### N8N Execution Log Analysis

#### Successful Execution Pattern:
```
1. Webhook Trigger ✅ (receives form data)
2. Google Sheets Node ✅ (logs data)
3. IF Physician Node ✅ (routes based on userType)
4. Mailchimp Node ✅ (adds physician to list)
5. Merge Node ✅ (combines paths)
6. Response Node ✅ (sends success response)
```

#### Failed Execution Patterns:
```
❌ Webhook Trigger fails → Check workflow active status
❌ Google Sheets fails → Check OAuth credentials
❌ Mailchimp fails → Check API key and audience ID
❌ Telegram fails → Check bot token and chat ID
```

### Manual Testing Commands

#### Test Complete Form Flow:
```bash
# Test physician submission
curl -X POST https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form \
  -H "Content-Type: application/json" \
  -d '{
    "userType": "physician",
    "firstName": "Dr. Test",
    "lastName": "Physician",
    "email": "test.physician@example.com",
    "medicalSpecialty": "Family Medicine",
    "practiceModel": "Private Practice",
    "involvement": "innovation-council",
    "challenge": "Documentation burden testing"
  }'

# Expected: Success response + Mailchimp subscription
```

```bash
# Test investor submission
curl -X POST https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form \
  -H "Content-Type: application/json" \
  -d '{
    "userType": "investor",
    "firstName": "Test",
    "lastName": "Investor",
    "email": "test.investor@example.com",
    "linkedinProfile": "https://linkedin.com/in/testinvestor"
  }'

# Expected: Success response + Telegram notification
```

## 📊 MONITORING & ALERTING

### Health Check Implementation
Create `/api/health/webhooks` endpoint:

```typescript
// pages/api/health/webhooks.ts
export default async function handler(req, res) {
  const healthChecks = {
    n8n_webhook: false,
    timestamp: new Date().toISOString(),
    errors: []
  }

  try {
    const response = await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ health_check: true })
    })

    healthChecks.n8n_webhook = response.status === 200
  } catch (error) {
    healthChecks.errors.push(error.message)
  }

  res.status(healthChecks.n8n_webhook ? 200 : 503).json(healthChecks)
}
```

### Automated Monitoring Script
```bash
#!/bin/bash
# webhook-health-check.sh

WEBHOOK_URL="https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form"
TELEGRAM_ALERT_URL="https://api.telegram.org/bot${BOT_TOKEN}/sendMessage"
CHAT_ID="5407628621"

# Test webhook
RESPONSE=$(curl -s -w "%{http_code}" -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"health_check": true}')

HTTP_CODE="${RESPONSE: -3}"

if [ "$HTTP_CODE" != "200" ]; then
  # Send alert
  curl -X POST "$TELEGRAM_ALERT_URL" \
    -d "chat_id=$CHAT_ID" \
    -d "text=🚨 WEBHOOK ALERT: N8N webhook returning $HTTP_CODE"
fi
```

## 🎯 PREVENTION & BEST PRACTICES

### 1. Environment Management
- Use different webhook URLs for dev/staging/production
- Implement feature flags for testing new workflows
- Version control all N8N workflow exports

### 2. Error Handling Best Practices
```typescript
// Robust form submission with retries
async function submitFormWithRetries(data: FormData, maxRetries = 3): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        timeout: 10000 // 10 second timeout
      })

      if (response.ok) {
        return await response.json()
      } else if (response.status === 429) {
        // Rate limited - exponential backoff
        await new Promise(resolve =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        )
        continue
      } else {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`)
      }
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(`All ${maxRetries} attempts failed: ${error.message}`)
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }
}
```

### 3. Testing Strategy
- Unit tests for form validation
- Integration tests for webhook endpoints
- End-to-end tests for complete user flows
- Regular health checks and monitoring

### 4. Documentation Maintenance
- Keep troubleshooting guide updated
- Document all workflow changes
- Maintain environment variable documentation
- Version control all configurations

## 📞 EMERGENCY PROCEDURES

### Critical Failure Response
1. **Immediate:** Switch to backup webhook endpoint
2. **Short-term:** Queue submissions in local storage
3. **Recovery:** Restore primary endpoint and replay queued submissions

### Contact Information
- **N8N Dashboard:** https://bhavenmurji.app.n8n.cloud
- **Google Sheets:** [Direct Link](https://docs.google.com/spreadsheets/d/1kPYgthwKzREJYKjAnE4h1YFMRxg5ulynrbDYNRxb8Lo)
- **Status Updates:** Monitor Telegram channel for alerts

### Escalation Path
1. **Level 1:** Automated health checks and retries
2. **Level 2:** Telegram alerts to admin
3. **Level 3:** Failover to backup systems
4. **Level 4:** Manual intervention required

This troubleshooting guide should resolve 95% of webhook-related issues. Keep it updated as new issues are discovered and resolved.