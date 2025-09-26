# 🔧 Google Docs API Setup Checklist for n8n

## Quick Setup Path (Easiest)

Since you already have Google credentials working in n8n (for Sheets), you can:

### Option 1: Use Existing Google Account Credential
1. In n8n, go to your **Google Docs node**
2. Click the **Credential to connect with** dropdown
3. Look for **"Google Sheets account"** (you already have this!)
4. Select it - it should work for Docs too!

### Option 2: Quick OAuth Setup
If Option 1 doesn't work:

1. **In n8n:**
   - Click **Credentials** → **+ Add Credential**
   - Search for **"Google"**
   - Choose **"Google OAuth2 API"**
   - Name it: `Google Docs & Drive`

2. **Use your existing credentials:**
   ```
   Client ID: 1081537218623-vd49amlhge4as748isvhp878e46ue3js.apps.googleusercontent.com
   Client Secret: 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
   ```

3. **Set the OAuth Redirect URL:**
   ```
   https://bhavenmurji.app.n8n.cloud/rest/oauth2-credential/callback
   ```

4. **Connect:**
   - Click **"Connect my account"**
   - Authorize access to Google Docs & Drive
   - Save

## What's Still Missing in Your Workflow

### In the Google Docs Node:
1. **Add the Content field:**
   - Look for "Add Option" button at bottom
   - Add **"Text Content"** or **"Content"**
   - Set value: `{{ $json.output }}`

2. **Fix the Title field:**
   - Remove any `"title":` prefix
   - Just use: `{{ $now.format('yyyy-MM-dd') }} - Ignite Newsletter`

### Fix Node References:
Replace all instances of:
- `$node['Gemini - Research Phase']` → `$node['Research']`
- `$node['Gemini - Article Generation']` → `$node['Research']`

## Test Your Setup

1. In the Google Docs node, click **"Execute node"**
2. If it works, you'll see a new document created
3. If not, check the error message

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Insufficient permissions" | Re-authorize with Google, ensure Docs/Drive scopes selected |
| "Cannot read property 'output'" | The Gemini node isn't outputting data correctly |
| "Invalid credentials" | Use the OAuth method, not Service Account |
| "Folder not found" | Try using just "My Drive" without folder |

## Already Working Credentials
You have these working already:
- ✅ Google Sheets OAuth2 (ID: yFyCTZ00zZlR9X8F)
- ✅ Mailchimp OAuth2 (ID: mD3c9ewb75w4RmDw)
- ✅ Telegram API (ID: LiDIXl97CJSudS2F)
- ✅ Google Gemini API (ID: weWBsxoDFKJMvoMl)

Just reuse the Google Sheets credential for Docs!