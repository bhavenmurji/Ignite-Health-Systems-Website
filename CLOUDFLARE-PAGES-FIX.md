# 🚨 IMMEDIATE FIX NEEDED - Site is Down (Error 522)

## The Problem
Your DNS has conflicting configurations mixing GitHub Pages and Cloudflare Pages.

## Quick Fix (Do This Now)

### Step 1: Go to Cloudflare Pages
1. Go to https://dash.cloudflare.com
2. Click "Workers & Pages" in sidebar
3. Click "Create application" → "Pages"
4. Connect to Git → Select GitHub
5. Select repository: `Ignite-Health-Systems-Website`

### Step 2: Configure Build Settings
```
Framework preset: Next.js
Build command: npm run build
Build output directory: .next
Root directory: /
Node.js version: 18.17.0
```

### Step 3: Add Environment Variable
Click "Environment variables" and add:
```
NEXT_PUBLIC_N8N_WEBHOOK_URL = https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form
```

### Step 4: Deploy
Click "Save and Deploy"

### Step 5: Fix DNS (After Deploy Completes)
Go to Cloudflare DNS and:

1. **DELETE** the www CNAME pointing to `bhavenmurji.github.io`
2. **KEEP** the root CNAME pointing to `ignite-health-systems-website.pages.dev`
3. **ADD** new CNAME:
   - Name: `www`
   - Target: `ignite-health-systems-website.pages.dev`
   - Proxy: ON (orange cloud)

## Alternative: If Cloudflare Pages Already Exists

1. Go to your Cloudflare Pages project
2. Settings → Environment variables
3. Add: `NEXT_PUBLIC_N8N_WEBHOOK_URL = https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form`
4. Go to Deployments → Retry deployment
5. Fix the DNS as shown above

## Your site will be live in 5 minutes after these steps!