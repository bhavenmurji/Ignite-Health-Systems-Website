# Cloudflare Pages Deployment Troubleshooting Guide

## Quick Reference: Common Error Solutions

| Error | Quick Fix |
|-------|----------|
| Error 522 (Connection Timeout) | Fix DNS records - remove GitHub Pages, add Cloudflare Pages CNAMEs |
| Build Failed | Check Node.js version (18.17.0), build command (`npm run build`), output directory (`out`) |
| Form Not Working | Add environment variable `NEXT_PUBLIC_N8N_WEBHOOK_URL` |
| CSS/Assets Missing | Verify `output: 'export'` and `images: { unoptimized: true }` in next.config.js |
| 404 on Routes | Ensure `trailingSlash: true` in next.config.js for static export |

---

## Error 522: Connection Timed Out

### Symptoms
- Site shows "Error 522" message
- Browser can't connect to the server
- Both www and non-www versions affected

### Root Cause Analysis
DNS records pointing to conflicting services (GitHub Pages + Cloudflare Pages)

### Solution Steps

1. **Verify Current DNS Records**
   ```bash
   dig ignitehealthsystems.com
   dig www.ignitehealthsystems.com
   ```

2. **Access Cloudflare DNS**
   - Dashboard → Domain → DNS → Records

3. **Remove Conflicting Records**
   Delete any records pointing to:
   - `bhavenmurji.github.io`
   - GitHub Pages IP addresses (185.199.108.x)

4. **Add Correct Records**
   ```
   Type: CNAME, Name: @, Content: ignite-health-systems-website.pages.dev, Proxy: ON
   Type: CNAME, Name: www, Content: ignite-health-systems-website.pages.dev, Proxy: ON
   ```

5. **Wait and Test**
   - Wait 5-10 minutes for DNS propagation
   - Test both URLs in incognito browser

### Verification
- [ ] Both URLs load without Error 522
- [ ] SSL certificate shows as valid (green lock)
- [ ] DNS propagation complete globally

---

## Build Failures on Cloudflare Pages

### Common Build Errors

#### Error: "Command not found: npm"
**Solution:**
- Set Node.js version to 18.17.0 in build settings
- Use `npm ci` instead of `npm install` if package-lock.json exists

#### Error: "Build directory not found"
**Current Issue:** Build output directory mismatch

**Solution:**
1. Check `next.config.js`:
   ```javascript
   const nextConfig = {
     output: 'export',
     distDir: 'out',  // Must match Cloudflare Pages setting
   };
   ```

2. In Cloudflare Pages build settings:
   ```
   Build output directory: out
   Build command: npm run build
   ```

#### Error: "Module not found" or "Cannot resolve"
**Solution:**
1. Verify all dependencies in `package.json`
2. Check for case-sensitive import issues
3. Ensure file extensions are correct (.tsx, .ts, .js)

#### Error: TypeScript Build Errors
**Current Configuration:**
```javascript
typescript: {
  ignoreBuildErrors: true,  // Allows deployment despite TS errors
},
```

**Better Solution (if time allows):**
1. Fix TypeScript errors properly
2. Remove `ignoreBuildErrors: true`
3. Ensure type safety

### Build Log Analysis

**Access Build Logs:**
1. Cloudflare Pages project → Deployments
2. Click on failed deployment
3. Scroll to build output

**Common Log Patterns:**

```
✓ Success pattern:
Creating an optimized production build
Compiled successfully

✗ Failure patterns:
Error: Cannot find module
TypeError: Cannot read property
Build failed with exit code 1
```

---

## Deployment Performance Issues

### Slow Build Times

**Current Build Time:** ~2-3 minutes (normal for Next.js)

**Optimization Strategies:**
1. **Enable Build Caching** (automatic in Cloudflare Pages)
2. **Reduce Bundle Size:**
   ```javascript
   experimental: {
     optimizePackageImports: ["lucide-react"],  // Already configured
   },
   ```

3. **Minimize Dependencies:**
   - Review package.json for unused packages
   - Use dynamic imports for large components

### Memory Issues During Build

**Symptoms:**
- Build fails with "out of memory" errors
- Build hangs indefinitely

**Solutions:**
1. **Increase Memory Limit** (automatic in Cloudflare Pages)
2. **Optimize Images** (already configured):
   ```javascript
   images: {
     unoptimized: true,  // Prevents large image processing
   },
   ```

---

## Runtime Errors After Deployment

### Form Submission Not Working

**Symptoms:**
- Form shows no response after submit
- JavaScript errors in browser console
- 404 errors to N8N webhook

**Diagnostic Steps:**
1. **Check Environment Variables:**
   ```javascript
   console.log(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL);
   ```

2. **Test Webhook Directly:**
   ```bash
   curl -X POST "https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form" \
        -H "Content-Type: application/json" \
        -d '{"test": "true"}'
   ```

3. **Check Network Tab** in browser dev tools

**Solutions:**
1. **Add Missing Environment Variable** in Cloudflare Pages
2. **Verify N8N Workflow** is active and published
3. **Check CORS Settings** if cross-origin issues

### Static Assets Not Loading

**Symptoms:**
- Images broken
- CSS not applying
- JavaScript files 404

**Solutions:**
1. **Verify Next.js Config:**
   ```javascript
   output: 'export',  // Required for static deployment
   images: { unoptimized: true },  // Required for static images
   ```

2. **Check Asset Paths:**
   - Use relative paths: `./image.png` not `/image.png`
   - Verify public folder structure
   - Test asset URLs directly

### Navigation Issues (404s)

**Symptoms:**
- Direct URL access shows 404
- Refresh breaks the page
- Deep links don't work

**Solutions:**
1. **Enable Trailing Slash:**
   ```javascript
   trailingSlash: true,  // Already configured
   ```

2. **Add Redirect Rules** (if needed):
   ```javascript
   // In next.config.js
   async redirects() {
     return [
       {
         source: '/old-path',
         destination: '/new-path/',
         permanent: true,
       },
     ];
   }
   ```

---

## SSL/HTTPS Issues

### Mixed Content Warnings

**Symptoms:**
- Browser shows "not fully secure"
- Some assets load over HTTP

**Solutions:**
1. **Force HTTPS in Cloudflare:**
   - SSL/TLS → Edge Certificates → Always Use HTTPS: ON

2. **Update Asset URLs:**
   - Change `http://` to `https://`
   - Use protocol-relative URLs: `//example.com/asset.js`

### SSL Certificate Issues

**Symptoms:**
- "Your connection is not private" error
- Certificate warnings

**Solutions:**
1. **Check SSL Mode:**
   - Cloudflare SSL/TLS → Overview
   - Set to "Full (strict)" for best security

2. **Verify Domain in Cloudflare Pages:**
   - Project → Custom domains
   - Ensure domain is properly added

---

## Performance Optimization

### Lighthouse Score Improvements

**Current Performance Issues:**
1. Large bundle size
2. Unused CSS
3. Image optimization

**Solutions:**

1. **Bundle Analysis:**
   ```bash
   npm install --save-dev @next/bundle-analyzer
   ```

2. **Image Optimization:**
   ```javascript
   // Use next/image component properly
   import Image from 'next/image';
   <Image src="/image.jpg" alt="Description" width={800} height={600} />
   ```

3. **CSS Optimization:**
   ```javascript
   // Remove unused Tailwind classes
   // Use purge configuration in tailwind.config.js
   ```

### Loading Speed Optimization

**Current Metrics Target:**
- First Contentful Paint: < 2s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

**Optimization Strategies:**
1. **Enable Cloudflare Caching:**
   - Page Rules → Cache Everything
   - Browser Cache TTL: 1 month

2. **Optimize Critical Path:**
   ```javascript
   // Preload critical resources
   <link rel="preload" href="/critical.css" as="style" />
   <link rel="preload" href="/hero-image.jpg" as="image" />
   ```

---

## Monitoring and Maintenance

### Health Check Procedures

**Daily Checks:**
- [ ] Site loads without errors
- [ ] Form submissions work
- [ ] SSL certificate valid

**Weekly Checks:**
- [ ] Build deployments successful
- [ ] Performance metrics stable
- [ ] No 4xx/5xx errors in logs

**Monthly Checks:**
- [ ] DNS records correct
- [ ] Environment variables current
- [ ] Dependencies up to date
- [ ] Security headers configured

### Emergency Response Plan

**If Site Goes Down:**

1. **Immediate Response (0-5 minutes):**
   - Check Cloudflare status: https://www.cloudflarestatus.com/
   - Verify DNS records unchanged
   - Test from multiple locations

2. **Investigation (5-15 minutes):**
   - Check recent deployments
   - Review build logs
   - Test environment variables

3. **Resolution (15-30 minutes):**
   - Rollback to last working deployment if needed
   - Fix identified issues
   - Redeploy and test

### Monitoring Tools Setup

**Recommended Tools:**
1. **Uptime Monitoring:**
   - UptimeRobot (free)
   - Pingdom
   - Cloudflare Analytics

2. **Performance Monitoring:**
   - Google PageSpeed Insights
   - GTmetrix
   - WebPageTest

3. **Error Tracking:**
   - Sentry (for JavaScript errors)
   - Cloudflare Logs (for server errors)

---

## Contact Form Specific Troubleshooting

### N8N Webhook Issues

**Test N8N Connection:**
```bash
curl -X POST "https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form" \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "Test",
       "lastName": "User",
       "email": "test@example.com",
       "company": "Test Company",
       "title": "Test Title",
       "interest": "platform-demo"
     }'
```

**Expected Response:**
- Status: 200 OK
- Response: Confirmation message or success indicator

**Common Issues:**
1. **Webhook URL Changed** - Update environment variable
2. **N8N Workflow Inactive** - Check N8N dashboard
3. **CORS Issues** - Verify N8N allows your domain

### Form Validation Errors

**Client-Side Validation:**
- Check browser console for JavaScript errors
- Verify form fields match expected names
- Test with various input combinations

**Server-Side Issues:**
- N8N workflow expects specific field names
- Email validation format
- Required field checking

---

## Prevention Strategies

### Automated Testing

**Setup GitHub Actions** (optional):
```yaml
name: Test Deployment
on:
  pull_request:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18.17.0'
      - run: npm ci
      - run: npm run build
```

### Configuration Backup

**Keep backups of:**
- DNS record configurations
- Environment variables
- Build settings
- Custom domain configurations

### Documentation Updates

**When to update this guide:**
- New errors encountered and resolved
- Configuration changes made
- New features deployed
- Performance optimizations applied

---

## Support Resources

**Cloudflare Pages Documentation:**
- https://developers.cloudflare.com/pages/

**Next.js Static Export Guide:**
- https://nextjs.org/docs/app/building-your-application/deploying/static-exports

**Community Support:**
- Cloudflare Discord: https://discord.gg/cloudflaredev
- Next.js GitHub Discussions: https://github.com/vercel/next.js/discussions

**Emergency Contacts:**
- Cloudflare Support (Pro/Business plans)
- N8N Community Forum for webhook issues

This troubleshooting guide covers the most common issues you'll encounter. Keep it updated as you discover new issues and solutions!