# 🚨 CLOUDFLARE PAGES DEPLOYMENT FIX GUIDE

## Current Status: SITE DOWN (Error 522)

**Issue**: DNS has conflicting configurations mixing GitHub Pages and Cloudflare Pages, causing connection timeouts.

---

## 🎯 IMMEDIATE ACTION PLAN (15 minutes to fix)

### Phase 1: Cloudflare Pages Setup (5 minutes)

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com
   - Click "Workers & Pages" in the sidebar
   - Click "Create application" → "Pages"

2. **Connect Repository**
   - Click "Connect to Git" → "GitHub"
   - Select repository: `Ignite-Health-Systems-Website`
   - Click "Begin setup"

3. **Configure Build Settings**
   ```
   Framework preset: Next.js
   Build command: npm run build
   Build output directory: out
   Root directory: / (leave empty)
   Node.js version: 18.17.0
   ```

4. **Environment Variables**
   Click "Environment variables" and add:
   ```
   Variable name: NEXT_PUBLIC_N8N_WEBHOOK_URL
   Value: https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form
   ```

5. **Deploy**
   - Click "Save and Deploy"
   - Wait for deployment to complete (2-3 minutes)

### Phase 2: DNS Configuration Fix (5 minutes)

**CRITICAL**: After deployment completes, you'll get a URL like `ignite-health-systems-website.pages.dev`

1. **Go to Cloudflare DNS**
   - Click "DNS" → "Records"
   - Find your domain: `ignitehealthsystems.com`

2. **Delete Conflicting Records**
   - **DELETE** any CNAME record for `www` pointing to `bhavenmurji.github.io`
   - **DELETE** any A records pointing to GitHub Pages IPs (185.199.108.153, etc.)

3. **Add Correct Records**
   - **Root domain (ignitehealthsystems.com)**:
     ```
     Type: CNAME
     Name: @
     Target: ignite-health-systems-website.pages.dev
     Proxy: ON (orange cloud)
     ```

   - **WWW subdomain**:
     ```
     Type: CNAME
     Name: www
     Target: ignite-health-systems-website.pages.dev
     Proxy: ON (orange cloud)
     ```

### Phase 3: Verification (5 minutes)

1. **Wait 2-3 minutes** for DNS propagation
2. **Test URLs**:
   - https://ignitehealthsystems.com
   - https://www.ignitehealthsystems.com
   - Both should show your site without Error 522

---

## 🔧 ALTERNATIVE: If Cloudflare Pages Project Already Exists

If you already have a Cloudflare Pages project:

1. **Update Build Settings**
   - Go to your project → "Settings" → "Builds and deployments"
   - Change "Build output directory" to: `out`
   - Change "Build command" to: `npm run build`

2. **Add Environment Variables**
   - Settings → "Environment variables" → "Add variable"
   - Name: `NEXT_PUBLIC_N8N_WEBHOOK_URL`
   - Value: `https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form`
   - Click "Save"

3. **Redeploy**
   - Go to "Deployments" tab
   - Click "Retry deployment" on the latest deployment
   - Or push a new commit to trigger deployment

4. **Fix DNS** (follow Phase 2 above)

---

## 🛠 TECHNICAL CHANGES MADE

### Next.js Configuration Updated
- Fixed conflicting `next.config.js` files
- Changed output directory from `dist` to `out` (Cloudflare Pages standard)
- Unified configuration with webpack loader for audio files
- Maintained static export settings for proper deployment

### Package.json Scripts Cleaned
- Removed custom `cf-build` script causing confusion
- Simplified to standard Next.js build process
- Removed unnecessary file copying operations

### Environment Variables
- Confirmed `.env.local` contains correct N8N webhook URL
- Environment variable properly prefixed with `NEXT_PUBLIC_` for client-side access

---

## 🔍 TROUBLESHOOTING

### If Site Still Shows Error 522:
1. **Check DNS propagation**: Use https://dnschecker.org
2. **Verify Cloudflare Pages deployment status**
3. **Ensure proxy (orange cloud) is ON for both records**
4. **Clear browser cache** (Ctrl+F5 or Cmd+Shift+R)

### If Build Fails on Cloudflare:
1. **Check Node.js version** is set to 18.17.0
2. **Verify build command** is exactly `npm run build`
3. **Check build logs** for specific error messages
4. **Ensure all dependencies** are in package.json, not just devDependencies

### If Form Submissions Don't Work:
1. **Verify environment variable** is set in Cloudflare Pages
2. **Check N8N webhook** is accessible: https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form
3. **Test form** in incognito browser window

---

## ✅ SUCCESS CHECKLIST

- [ ] Cloudflare Pages project created and deployed successfully
- [ ] Build output directory set to `out`
- [ ] Environment variable `NEXT_PUBLIC_N8N_WEBHOOK_URL` added
- [ ] DNS records updated (root and www CNAMEs)
- [ ] Old GitHub Pages DNS records removed
- [ ] Site accessible at https://ignitehealthsystems.com
- [ ] Site accessible at https://www.ignitehealthsystems.com
- [ ] Contact form functional and submitting to N8N
- [ ] No Error 522 or other connection issues

---

## 📞 SUPPORT

If you encounter issues:
1. **Check Cloudflare Pages deployment logs** for specific errors
2. **Use browser developer tools** to check for JavaScript errors
3. **Test DNS resolution** with dig or nslookup tools
4. **Verify form submission** in browser network tab

**Estimated total fix time: 10-15 minutes**

Your site should be live and fully functional after completing these steps!