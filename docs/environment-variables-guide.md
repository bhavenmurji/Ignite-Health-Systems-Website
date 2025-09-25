# Environment Variables Setup Guide for Cloudflare Pages

## Overview
This guide covers the proper configuration of environment variables for the Ignite Health Systems website deployment on Cloudflare Pages.

## Required Environment Variables

### Production Environment Variables

#### NEXT_PUBLIC_N8N_WEBHOOK_URL
```
Variable Name: NEXT_PUBLIC_N8N_WEBHOOK_URL
Value: https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form
Environment: Production
Description: Webhook URL for contact form submissions to N8N automation platform
```

#### NEXT_PUBLIC_DOMAIN
```
Variable Name: NEXT_PUBLIC_DOMAIN
Value: https://ignitehealthsystems.com
Environment: Production
Description: Primary domain URL for the website (used for canonical URLs, Open Graph, etc.)
```

#### NODE_VERSION (Build Environment)
```
Variable Name: NODE_VERSION
Value: 18.17.0
Environment: Production
Description: Node.js version for consistent builds
```

## Cloudflare Pages Environment Variable Setup

### Step 1: Access Environment Variables

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com
   - Navigate to "Workers & Pages"
   - Select your "ignite-health-systems-website" project

2. **Open Settings**
   - Click on your project name
   - Go to "Settings" tab
   - Click "Environment variables" in the left sidebar

### Step 2: Add Production Variables

**Add each variable:**

1. **Click "Add variable"**

2. **For N8N Webhook:**
   ```
   Variable name: NEXT_PUBLIC_N8N_WEBHOOK_URL
   Value: https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form
   Environment: Production
   ```
   Click "Save"

3. **For Domain:**
   ```
   Variable name: NEXT_PUBLIC_DOMAIN
   Value: https://ignitehealthsystems.com
   Environment: Production
   ```
   Click "Save"

4. **For Node Version (if needed):**
   ```
   Variable name: NODE_VERSION
   Value: 18.17.0
   Environment: Production
   ```
   Click "Save"

### Step 3: Add Preview Environment Variables (Optional)

For preview deployments (branches other than main):

1. **Preview N8N Webhook:**
   ```
   Variable name: NEXT_PUBLIC_N8N_WEBHOOK_URL
   Value: https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form-preview
   Environment: Preview
   ```

2. **Preview Domain:**
   ```
   Variable name: NEXT_PUBLIC_DOMAIN
   Value: https://preview.ignitehealthsystems.com
   Environment: Preview
   ```

## Local Development Setup

### Create .env.local File

Your local `.env.local` file should contain:
```env
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form
NEXT_PUBLIC_DOMAIN=http://localhost:3000
```

**Note**: The `.env.local` file is already gitignored and should not be committed to the repository.

### Environment Variable Hierarchy

Next.js loads environment variables in this order (later ones override earlier):
1. `.env`
2. `.env.local`
3. `.env.production` (when NODE_ENV=production)
4. `.env.production.local`

## Environment Variable Security

### Public vs Private Variables

**NEXT_PUBLIC_** prefix variables:
- ✅ Exposed to the browser (client-side)
- ✅ Safe for URLs, API endpoints that need client access
- ❌ Never use for secrets, API keys, database passwords

**Variables without NEXT_PUBLIC_** prefix:
- ✅ Only available server-side
- ✅ Safe for secrets and sensitive data
- ❌ Not accessible in client components

### Current Variable Security Analysis

| Variable | Security Level | Reasoning |
|----------|----------------|-----------|
| NEXT_PUBLIC_N8N_WEBHOOK_URL | ✅ Safe to expose | Public webhook endpoint designed for form submissions |
| NEXT_PUBLIC_DOMAIN | ✅ Safe to expose | Public domain information |

## Testing Environment Variables

### Verify Variables in Build

After setting environment variables in Cloudflare Pages:

1. **Trigger a new deployment**
   - Go to "Deployments" tab
   - Click "Retry deployment" on latest deployment
   - Or push a new commit to trigger build

2. **Check build logs**
   - Click on the deployment
   - Check logs for any environment variable errors
   - Look for successful variable loading

### Test Form Functionality

1. **Visit deployed site**
   - Go to: https://ignitehealthsystems.com
   - Scroll to contact form

2. **Test form submission**
   - Fill out the form with test data
   - Submit and verify success/error messages
   - Check N8N webhook receives data

### Browser Developer Tools Testing

1. **Open Developer Tools** (F12)
2. **Go to Console tab**
3. **Test environment variables**:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL);
   console.log(process.env.NEXT_PUBLIC_DOMAIN);
   ```

## Common Issues and Solutions

### Issue: Form Not Submitting
**Likely causes:**
- Environment variable not set in Cloudflare Pages
- Typo in webhook URL
- N8N webhook endpoint not active

**Solutions:**
1. Verify environment variables in Cloudflare Pages settings
2. Test webhook URL directly: `curl -X POST https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form`
3. Check N8N workflow is active and published

### Issue: Environment Variable Not Loading
**Likely causes:**
- Missing NEXT_PUBLIC_ prefix for client-side variables
- Not redeployed after adding variables
- Caching issues

**Solutions:**
1. Ensure correct prefix for client-side access
2. Redeploy the site after adding variables
3. Clear browser cache and test in incognito mode

### Issue: Build Failing Due to Missing Variables
**Solutions:**
1. Add all required variables in Cloudflare Pages
2. Make variables optional in code with fallbacks:
   ```javascript
   const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'https://example.com/fallback';
   ```

## Environment Variable Best Practices

### 1. Use Descriptive Names
- ✅ `NEXT_PUBLIC_N8N_WEBHOOK_URL`
- ❌ `WEBHOOK_URL`

### 2. Include Environment Context
- ✅ Production vs Preview environments
- ✅ Different URLs for different stages

### 3. Document All Variables
- Keep this guide updated with new variables
- Include purpose and format for each variable

### 4. Validate Variables
Add validation in your Next.js code:
```javascript
// In your component or API route
if (!process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL) {
  console.error('Missing required environment variable: NEXT_PUBLIC_N8N_WEBHOOK_URL');
}
```

### 5. Use TypeScript for Better Type Safety
Create a type definition file:
```typescript
// types/env.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_N8N_WEBHOOK_URL: string;
      NEXT_PUBLIC_DOMAIN: string;
    }
  }
}
```

## Monitoring Environment Variables

### Regular Checks
- **Monthly**: Verify all variables are still set correctly
- **After deployments**: Test functionality depending on environment variables
- **URL changes**: Update webhook URLs when N8N workflows change

### Backup Configuration
Keep a secure record of your environment variables:
```
Production:
- NEXT_PUBLIC_N8N_WEBHOOK_URL: https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form
- NEXT_PUBLIC_DOMAIN: https://ignitehealthsystems.com

Preview:
- NEXT_PUBLIC_N8N_WEBHOOK_URL: https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form-preview
- NEXT_PUBLIC_DOMAIN: https://preview.ignitehealthsystems.com
```

This configuration ensures your contact form works correctly and your site has proper domain configuration across all environments.