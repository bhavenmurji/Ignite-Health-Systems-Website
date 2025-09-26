# Fix n8n Google OAuth Redirect URI Mismatch

## The Issue
Error: `400: redirect_uri_mismatch` when trying to connect Google services in n8n

## Solution Steps

### 1. Find Your Exact n8n Redirect URI

In n8n:
1. Go to **Credentials**
2. Click **Add Credential** → **Google OAuth2 API**
3. Look for the **OAuth Redirect URL** field - it will show something like:
   - `https://n8n.ruv.io/rest/oauth2-credential/callback`
   - OR it might be: `https://app.n8n.cloud/[workspace-id]/oauth2-credential/callback`
   - OR: `https://[your-instance].n8n.cloud/rest/oauth2-credential/callback`

**IMPORTANT**: Copy this EXACT URL - every character matters!

### 2. Add the Redirect URI to Google Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID (the one with ID: `200853541855-k01d8t5k5schtfo0vrrg99k738apteti`)
5. In **Authorized redirect URIs**, add the EXACT URL from n8n
6. Click **SAVE**

### 3. Common n8n Redirect URI Patterns

Depending on your n8n setup, the redirect URI could be:

**Self-hosted n8n:**
```
https://n8n.ruv.io/rest/oauth2-credential/callback
```

**n8n Cloud (new format):**
```
https://app.n8n.cloud/[workspace-id]/rest/oauth2-credential/callback
```

**n8n Cloud (alternative):**
```
https://[instance-name].app.n8n.cloud/rest/oauth2-credential/callback
```

### 4. Check Error Details

When you get the error, click "error details" - it will show:
- The redirect URI that n8n tried to use
- This is the EXACT URI you need to add to Google Console

### 5. Multiple Redirect URIs

You can add multiple redirect URIs in Google Console. Add ALL of these if unsure:
```
https://n8n.ruv.io/rest/oauth2-credential/callback
https://app.n8n.cloud/rest/oauth2-credential/callback
https://n8n.ruv.io/oauth2-credential/callback
https://app.n8n.cloud/oauth2-credential/callback
```

### 6. Wait for Propagation

After saving in Google Console:
- Changes can take 5 minutes to several hours to propagate
- Try in an incognito window to avoid cache issues

## Verification Checklist

- [ ] Copied exact redirect URI from n8n credentials page
- [ ] Added to Google Console Authorized redirect URIs
- [ ] No trailing slashes or extra spaces
- [ ] Used HTTPS (not HTTP)
- [ ] Saved changes in Google Console
- [ ] Waited 5-10 minutes for propagation
- [ ] Tested in incognito window

## If Still Not Working

1. **Check n8n instance URL**: Make sure you're accessing n8n from the same URL configured in Google
2. **OAuth Consent Screen**: Ensure it's configured and not in "Testing" mode
3. **Check workspace**: If using n8n Cloud, verify your workspace ID
4. **Clear browser cache**: Try a different browser or incognito mode

## Getting the Exact URI from Error

When you see the error page:
1. Click "error details" or look at the URL parameters
2. Find `redirect_uri=` in the URL
3. Copy everything after `redirect_uri=` until the next `&` or end of URL
4. URL decode it if needed (replace %2F with /, etc.)
5. This is the EXACT URI to add to Google Console