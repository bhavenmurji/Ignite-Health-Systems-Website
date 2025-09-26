# Google OAuth Setup Guide for Ignite Health Systems

## Google Cloud Console Configuration

### Step 1: Create OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click **+ CREATE CREDENTIALS** → **OAuth client ID**

### Step 2: Configure OAuth Client

**Application type:** Web application

**Name:** Ignite Health Systems Production

### Step 3: Add Authorized JavaScript Origins

For production deployment on Cloudflare Pages, add these origins:
```
https://ignitehealthsystems.com
https://www.ignitehealthsystems.com
```

For local development (optional):
```
http://localhost:3000
```

### Step 4: Add Authorized Redirect URIs

For standard OAuth flow:
```
https://ignitehealthsystems.com/api/auth/callback/google
https://www.ignitehealthsystems.com/api/auth/callback/google
```

For NextAuth.js (if using):
```
https://ignitehealthsystems.com/api/auth/callback/google
https://www.ignitehealthsystems.com/api/auth/callback/google
```

For local development:
```
http://localhost:3000/api/auth/callback/google
```

### Step 5: Additional URIs (if needed)

If using Google Sign-In JavaScript library:
```
https://ignitehealthsystems.com/auth/google/callback
https://www.ignitehealthsystems.com/auth/google/callback
```

## Environment Variables

Your current configuration in `.env.production`:
```env
GOOGLE_CLIENT_ID=1081537218623-vd49amlhge4as748isvhp878e46ue3js.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

## Common Issues & Solutions

### Issue 1: Redirect URI Mismatch
**Error:** "The redirect URI in the request does not match the authorized redirect URIs"
**Solution:** Ensure the exact URI (including protocol, domain, and path) matches what's configured in Google Console

### Issue 2: Origin Not Allowed
**Error:** "Not a valid origin for the client"
**Solution:** Add the domain to Authorized JavaScript origins

### Issue 3: 5-minute to Few Hours Delay
**Note:** Google mentions changes may take 5 minutes to a few hours to take effect. Be patient after making changes.

## Testing Checklist

- [ ] Verify domain is listed in OAuth consent screen authorized domains
- [ ] Check that redirect URIs match exactly (no trailing slashes)
- [ ] Ensure HTTPS is used for production URIs
- [ ] Test from an incognito window to avoid cache issues
- [ ] Verify environment variables are properly set in Cloudflare Pages

## OAuth Consent Screen Requirements

1. **Application name:** Ignite Health Systems
2. **User support email:** [Your email]
3. **Authorized domains:**
   - ignitehealthsystems.com
4. **Developer contact:** [Your email]

## Security Notes

- Never commit credentials to version control
- Use environment variables for all sensitive data
- Regularly rotate client secrets
- Monitor OAuth usage in Google Cloud Console