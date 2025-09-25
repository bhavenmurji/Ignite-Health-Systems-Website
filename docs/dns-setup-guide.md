# DNS Configuration Guide for Cloudflare Pages

## Overview
This guide provides detailed DNS setup instructions to resolve the Error 522 connection timeout and properly configure your domain for Cloudflare Pages.

## Current Problem Analysis

### Issue: Conflicting DNS Records
Your domain `ignitehealthsystems.com` currently has conflicting DNS configurations:
- Some records point to GitHub Pages (`bhavenmurji.github.io`)
- Others point to Cloudflare Pages (`ignite-health-systems-website.pages.dev`)

This creates routing conflicts causing Error 522 (Connection Timed Out).

## Step-by-Step DNS Fix

### Step 1: Access Cloudflare DNS Management

1. **Login to Cloudflare**
   - Go to: https://dash.cloudflare.com
   - Login with your account credentials

2. **Navigate to DNS Settings**
   - Select your domain: `ignitehealthsystems.com`
   - Click "DNS" in the left sidebar
   - Click "Records" tab

### Step 2: Remove Conflicting Records

**Delete the following record types that point to GitHub Pages:**

1. **CNAME Records to Remove:**
   ```
   Name: www
   Target: bhavenmurji.github.io
   ```

2. **A Records to Remove (if present):**
   ```
   Name: @
   Target: 185.199.108.153
   ```
   ```
   Name: @
   Target: 185.199.109.153
   ```
   ```
   Name: @
   Target: 185.199.110.153
   ```
   ```
   Name: @
   Target: 185.199.111.153
   ```

3. **AAAA Records to Remove (if present):**
   ```
   Name: @
   Target: 2606:50c0:8000::153
   ```
   ```
   Name: @
   Target: 2606:50c0:8001::153
   ```
   ```
   Name: @
   Target: 2606:50c0:8002::153
   ```
   ```
   Name: @
   Target: 2606:50c0:8003::153
   ```

### Step 3: Add Correct Cloudflare Pages Records

**Add these DNS records for Cloudflare Pages:**

1. **Root Domain Record**
   ```
   Type: CNAME
   Name: @ (or leave blank for root)
   Target: ignite-health-systems-website.pages.dev
   Proxy status: Proxied (orange cloud icon)
   TTL: Auto
   ```

2. **WWW Subdomain Record**
   ```
   Type: CNAME
   Name: www
   Target: ignite-health-systems-website.pages.dev
   Proxy status: Proxied (orange cloud icon)
   TTL: Auto
   ```

### Step 4: Verify Configuration

After making changes, your DNS records should look like this:

| Type | Name | Content | Proxy | TTL |
|------|------|---------|-------|-----|
| CNAME | @ | ignite-health-systems-website.pages.dev | ✅ Proxied | Auto |
| CNAME | www | ignite-health-systems-website.pages.dev | ✅ Proxied | Auto |

**Important Notes:**
- Ensure both records have the **orange cloud** (Proxied) enabled
- Remove any conflicting records
- Wait 5-10 minutes for DNS propagation

## DNS Propagation Testing

### Method 1: Online DNS Checker
1. Go to: https://dnschecker.org
2. Enter: `ignitehealthsystems.com`
3. Check that all locations show your Cloudflare Pages domain

### Method 2: Command Line Tools

**For macOS/Linux:**
```bash
# Test root domain
dig ignitehealthsystems.com

# Test www subdomain
dig www.ignitehealthsystems.com

# Test with specific DNS server
dig @8.8.8.8 ignitehealthsystems.com
```

**For Windows:**
```cmd
# Test root domain
nslookup ignitehealthsystems.com

# Test www subdomain
nslookup www.ignitehealthsystems.com
```

### Method 3: Browser Testing
1. Open incognito/private browser window
2. Visit: https://ignitehealthsystems.com
3. Visit: https://www.ignitehealthsystems.com
4. Both should load without Error 522

## Common DNS Issues and Solutions

### Issue: Still Getting Error 522
**Solutions:**
1. **Check proxy status**: Ensure orange cloud is enabled
2. **Wait longer**: DNS changes can take up to 24 hours globally
3. **Clear browser cache**: Hard refresh with Ctrl+F5 (PC) or Cmd+Shift+R (Mac)
4. **Test from different network**: Try mobile data vs WiFi

### Issue: Site Not Loading at All
**Solutions:**
1. **Verify Cloudflare Pages deployment**: Check deployment status
2. **Check custom domain**: Ensure domain is added to Cloudflare Pages project
3. **Review DNS propagation**: Use multiple DNS checkers

### Issue: WWW Not Working but Root Domain Works
**Solutions:**
1. **Add www CNAME record**: Follow Step 3 above
2. **Enable proxy on www record**: Orange cloud must be on
3. **Check redirect settings**: In Cloudflare Pages settings

## Advanced Configuration

### SSL/TLS Settings
1. **Go to SSL/TLS tab** in Cloudflare
2. **Set encryption mode** to "Full (strict)" for best security
3. **Enable "Always Use HTTPS"** in Edge Certificates

### Page Rules (Optional)
Create page rules for SEO:
```
URL: www.ignitehealthsystems.com/*
Setting: Forwarding URL (301 - Permanent Redirect)
Destination: https://ignitehealthsystems.com/$1
```

### Custom Domain in Cloudflare Pages
1. **Go to your Cloudflare Pages project**
2. **Click "Custom domains" tab**
3. **Add custom domain**: `ignitehealthsystems.com`
4. **Add another domain**: `www.ignitehealthsystems.com`

## Verification Checklist

- [ ] All GitHub Pages DNS records removed
- [ ] Root domain CNAME added and proxied
- [ ] WWW subdomain CNAME added and proxied
- [ ] DNS propagation complete (test with dnschecker.org)
- [ ] Both https://ignitehealthsystems.com and https://www.ignitehealthsystems.com work
- [ ] No Error 522 or connection timeout errors
- [ ] SSL certificate active (green lock icon in browser)
- [ ] Contact form functional on deployed site

## Monitoring and Maintenance

### Regular Checks
- **Monthly DNS verification** using online tools
- **SSL certificate renewal** (automatic with Cloudflare)
- **Performance monitoring** through Cloudflare Analytics

### Backup Information
Keep record of your DNS configuration:
```
Domain: ignitehealthsystems.com
Cloudflare Pages URL: ignite-health-systems-website.pages.dev
Root CNAME: @ → ignite-health-systems-website.pages.dev
WWW CNAME: www → ignite-health-systems-website.pages.dev
```

This DNS configuration will provide optimal performance, security, and reliability for your Ignite Health Systems website.