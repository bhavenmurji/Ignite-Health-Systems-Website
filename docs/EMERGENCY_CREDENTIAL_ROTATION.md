# 🚨 EMERGENCY CREDENTIAL ROTATION PROTOCOL
**Ignite Health Systems - Immediate Security Response**

**Status:** 🔴 **ACTIVE INCIDENT**
**Priority:** P1 - Critical
**Date Initiated:** September 24, 2025
**Estimated Completion:** 24 hours

---

## 🎯 EXECUTIVE SUMMARY

**CRITICAL SECURITY BREACH DETECTED**: Multiple production API credentials and secrets have been exposed in the codebase and are publicly visible. This poses immediate risk of:

- Unauthorized access to healthcare systems
- HIPAA compliance violations
- Financial liability from API abuse
- Domain/DNS takeover potential
- Data breach and patient privacy violations

**IMMEDIATE ACTION REQUIRED**: All exposed credentials must be rotated within 24 hours.

---

## 🔥 EXPOSED CREDENTIALS REQUIRING ROTATION

### 1. N8N Automation Platform
**Status:** 🔴 CRITICAL
**Current Token:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NjUzYzczZi1lMTU4LTQwOTYtOGYzNy1kMjk5MDg5ZWI0NmMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU4NzM4Mzk2fQ.u3B46RxbsABDxnB2J81GZg8WNc8loHjHVW7z3dc7RJY`
**Risk:** Full workflow access, webhook manipulation, data extraction
**Action:** Generate new JWT token immediately

### 2. Cloudflare API Management
**Status:** 🔴 CRITICAL
**Current Token:** `SAj_Sl6MybJm6xjNzNOkDR-DfRTtJKK4VLxkbaYP`
**Risk:** DNS hijacking, SSL manipulation, domain takeover
**Action:** Revoke and regenerate scoped token

### 3. Google OAuth & Gemini AI
**Status:** 🔴 CRITICAL
**Client Secret:** `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`
**Gemini Key:** `AIzaSyCf55l7otROJ6YbFurgxMEOi5b3HpZQ6oU`
**Risk:** OAuth flow manipulation, AI API abuse charges
**Action:** Regenerate both credentials

### 4. Communication Channels
**Status:** 🔴 CRITICAL
**Mailchimp Key:** `4a9b4b106d058262743bad53cdee7016-us18`
**Telegram Token:** `8319012498:AAHJBliXmeVdH9JM_YTdcdmtlUjXmwCmLzU`
**Risk:** Unauthorized email campaigns, bot takeover
**Action:** Revoke and regenerate

### 5. GitHub Integration
**Status:** 🔴 CRITICAL
**Token:** `github_pat_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
**Risk:** Repository access, code manipulation
**Action:** Revoke and create new scoped token

---

## 🛠️ ROTATION CHECKLIST (Execute in Order)

### Phase 1: Immediate Credential Revocation (0-2 hours)

#### ✅ N8N Platform
- [ ] Login to https://bhavenmurji.app.n8n.cloud
- [ ] Navigate to Settings → API Keys
- [ ] Revoke existing JWT token
- [ ] Generate new token with same permissions
- [ ] Update production environment variables
- [ ] Test webhook functionality

#### ✅ Cloudflare Security
- [ ] Login to https://dash.cloudflare.com/profile/api-tokens
- [ ] Locate token `SAj_Sl6MybJm6xjNzNOkDR-DfRTtJKK4VLxkbaYP`
- [ ] Click "Delete" to revoke immediately
- [ ] Create new custom token with permissions:
  - Zone:Zone Settings:Edit
  - Zone:Zone:Edit
  - Zone:DNS:Edit
  - Zone:Page Rules:Edit
- [ ] Scope to ignitehealthsystems.com only
- [ ] Update deployment scripts and environment

#### ✅ Google Cloud Console
- [ ] Navigate to https://console.cloud.google.com/apis/credentials
- [ ] Project: ignite-website-473011
- [ ] Find OAuth 2.0 client ID: `1081537218623-vd49amlhge4as748isvhp878e46ue3js`
- [ ] Regenerate client secret
- [ ] Update Gemini API key in AI/ML APIs section
- [ ] Test OAuth flow and API access

#### ✅ Mailchimp Marketing
- [ ] Login to https://admin.mailchimp.com/account/api/
- [ ] Revoke API key `4a9b4b106d058262743bad53cdee7016-us18`
- [ ] Generate new key with same permissions
- [ ] Update audience integration settings
- [ ] Test email campaign functionality

#### ✅ Telegram Bot Management
- [ ] Message @BotFather on Telegram
- [ ] Use /revoke command for bot token `8319012498:AAHJBliXmeVdH9JM_YTdcdmtlUjXmwCmLzU`
- [ ] Generate new token with /newtoken
- [ ] Update bot webhook URLs
- [ ] Test message delivery to chat ID `5407628621`

#### ✅ GitHub Token Management
- [ ] Navigate to https://github.com/settings/tokens
- [ ] Revoke token starting with `github_pat_11A7SFP3A`
- [ ] Generate new fine-grained personal access token
- [ ] Scope to repository: ignitehealthsystems only
- [ ] Permissions: Contents (read/write), Actions (read), Metadata (read)
- [ ] Update CI/CD pipelines

### Phase 2: Secure Environment Setup (2-8 hours)

#### 🔒 Environment Variable Securitization
```bash
# Remove all .env files from git tracking
git rm --cached .env .env.production .env.local .env.cloudflare
git add .gitignore
git commit -m "🔒 Remove exposed environment files from tracking"

# Create secure .env.example template (no real values)
cat > .env.example << 'EOF'
# =============================================================================
# IGNITE HEALTH SYSTEMS - ENVIRONMENT TEMPLATE
# =============================================================================
# Copy to .env and fill in actual values - NEVER commit .env files to git

# Core Application
NODE_ENV=development
PORT=3001

# Cloudflare (Get from: https://dash.cloudflare.com/profile/api-tokens)
CLOUDFLARE_API_TOKEN=your_scoped_token_here
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_ZONE_ID=your_zone_id_here

# N8N Automation (Get from: https://app.n8n.cloud/settings/api)
N8N_API_KEY=your_jwt_token_here
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://yourn8n.app.n8n.cloud/webhook/endpoint

# Google Services (Get from: https://console.cloud.google.com/apis/credentials)
GOOGLE_OAUTH_CLIENT_ID=your_client_id_here
GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret_here
GEMINI_API_KEY=your_gemini_key_here

# Communication Channels
MAILCHIMP_API_KEY=your_mailchimp_key_here
MAILCHIMP_AUDIENCE_ID=your_audience_id_here
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# GitHub Integration
GITHUB_TOKEN=your_github_pat_here

# Application Configuration
NEXT_PUBLIC_SITE_URL=https://ignitehealthsystems.com
NEXT_PUBLIC_HIPAA_COMPLIANT=true
NEXT_PUBLIC_HEALTHCARE_MODE=true
EOF
```

#### 🌐 Cloudflare Pages Environment Setup
- [ ] Navigate to Cloudflare Pages dashboard
- [ ] Select ignitehealthsystems.com project
- [ ] Go to Settings → Environment Variables
- [ ] Add all new rotated credentials as encrypted variables
- [ ] Remove any hardcoded values from build settings

#### 📋 Vercel Environment Configuration
- [ ] Login to Vercel dashboard
- [ ] Navigate to project settings
- [ ] Update Environment Variables section
- [ ] Add all new credentials as encrypted values
- [ ] Redeploy to apply new variables

### Phase 3: Codebase Cleanup (8-24 hours)

#### 🗂️ File Removal and Cleanup
```bash
# Remove files containing hardcoded secrets
rm -f scripts/fix_cloudflare_simple.py
rm -f N8N-MISSING-CREDENTIALS.md
rm -f N8N-SETUP-INSTRUCTIONS.md
rm -f .env.production
rm -f .env.local
rm -f .env.cloudflare

# Update .gitignore to prevent future exposure
cat >> .gitignore << 'EOF'

# Environment variables and secrets
.env
.env.*
!.env.example
**/credentials.json
**/secrets.json
**/*credentials*
**/*secrets*
**/config/production.js
**/.secrets/
EOF
```

#### 🧹 Git History Sanitization
```bash
# WARNING: This rewrites git history - coordinate with team
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch \
    .env.production \
    .env.local \
    .env.cloudflare \
    N8N-MISSING-CREDENTIALS.md \
    N8N-SETUP-INSTRUCTIONS.md \
    scripts/fix_cloudflare_simple.py' \
  --prune-empty --tag-name-filter cat -- --all

# Push cleaned history (requires team coordination)
# git push --force --all --tags
```

---

## 🔧 SECURE DEPLOYMENT CONFIGURATION

### Cloudflare Pages Build Settings
```yaml
# Environment Variables (Set in Cloudflare Dashboard)
NODE_ENV: production
CLOUDFLARE_API_TOKEN: [NEW_ROTATED_TOKEN]
N8N_API_KEY: [NEW_JWT_TOKEN]
GOOGLE_OAUTH_CLIENT_SECRET: [NEW_CLIENT_SECRET]
GEMINI_API_KEY: [NEW_GEMINI_KEY]
MAILCHIMP_API_KEY: [NEW_MAILCHIMP_KEY]
TELEGRAM_BOT_TOKEN: [NEW_BOT_TOKEN]
GITHUB_TOKEN: [NEW_GITHUB_PAT]

# Build Command
npm run build

# Root Directory
/

# Framework Preset
Next.js
```

### GitHub Actions Security
```yaml
# .github/workflows/deploy.yml
name: Secure Deployment
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy with Secrets
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          # All other secrets from GitHub Secrets store
        run: npm run deploy
```

---

## 🚨 INCIDENT MONITORING

### Immediate Monitoring Setup
- [ ] **Cloudflare Analytics**: Monitor unusual DNS queries or traffic spikes
- [ ] **N8N Activity Logs**: Watch for unauthorized workflow executions
- [ ] **Google Cloud Audit**: Review API usage for anomalies
- [ ] **Mailchimp Reports**: Check for unauthorized email campaigns
- [ ] **GitHub Security**: Review repository access logs
- [ ] **Telegram Bot Logs**: Monitor for message interception

### Security Alerts Configuration
```yaml
# Example monitoring alerts
- API_USAGE_SPIKE: >300% normal usage
- GEOGRAPHIC_ANOMALY: Access from non-US locations
- TIME_ANOMALY: API calls outside business hours
- VOLUME_ANOMALY: Bulk operations (>1000 requests/hour)
- AUTHENTICATION_FAILURES: >5 failed attempts/minute
```

---

## ⚖️ COMPLIANCE REQUIREMENTS

### HIPAA Security Rule Compliance
- [ ] **Administrative Safeguards**: Updated incident response procedures
- [ ] **Physical Safeguards**: Secure credential storage implemented
- [ ] **Technical Safeguards**: Encryption and access controls verified
- [ ] **Audit Controls**: Logging enabled for all credential usage

### GDPR Article 32 Compliance
- [ ] **Encryption**: All secrets stored encrypted at rest
- [ ] **Pseudonymisation**: Remove personal identifiers from logs
- [ ] **Resilience**: Backup credential recovery procedures
- [ ] **Regular Testing**: Automated security scanning enabled

### Documentation Requirements
- [ ] **Breach Timeline**: Document discovery, containment, resolution
- [ ] **Impact Assessment**: Evaluate potential data exposure risk
- [ ] **Notification Decisions**: Determine if breach notification required
- [ ] **Lessons Learned**: Update security procedures based on incident

---

## 📊 VALIDATION CHECKLIST

### Post-Rotation Verification
- [ ] **N8N Workflows**: Test all automated processes function correctly
- [ ] **Cloudflare DNS**: Verify domain resolution and SSL certificates
- [ ] **Google OAuth**: Test user authentication flow end-to-end
- [ ] **Email Integration**: Send test campaign through Mailchimp
- [ ] **Telegram Notifications**: Verify bot messaging capability
- [ ] **GitHub Actions**: Test CI/CD pipeline with new token
- [ ] **Website Functionality**: Complete user journey testing

### Security Posture Verification
- [ ] **No Secrets in Code**: Scan entire codebase for hardcoded values
- [ ] **Environment Isolation**: Verify prod/dev/test environment separation
- [ ] **Access Logging**: Confirm audit trails are capturing all API usage
- [ ] **Backup Security**: Test credential recovery procedures
- [ ] **Team Training**: Brief team on secure credential management

---

## 🎯 SUCCESS CRITERIA

**Rotation Complete When:**
✅ All exposed credentials revoked and regenerated
✅ New credentials deployed to production environments
✅ Website fully functional with new credentials
✅ No secrets remaining in codebase or git history
✅ Security monitoring active and alerting configured
✅ Team trained on secure credential management practices

---

## 📞 ESCALATION CONTACTS

**Primary Incident Commander:** Development Security Lead
**Business Stakeholder:** Dr. Bhaven Murji
**Technical Escalation:** Cloudflare Support, Google Cloud Security
**Legal/Compliance:** Healthcare Compliance Officer
**Emergency Contact:** [24/7 Security Hotline]

---

## ⏰ TIMELINE TRACKING

| Phase | Start Time | Duration | Status |
|-------|------------|----------|---------|
| Discovery | 2025-09-24 16:00 | 1 hour | ✅ Complete |
| Assessment | 2025-09-24 17:00 | 2 hours | ✅ Complete |
| Credential Rotation | 2025-09-24 19:00 | 6 hours | 🔄 In Progress |
| Environment Security | 2025-09-25 01:00 | 8 hours | ⏳ Pending |
| Validation & Testing | 2025-09-25 09:00 | 4 hours | ⏳ Pending |
| Documentation | 2025-09-25 13:00 | 2 hours | ⏳ Pending |

**Target Completion:** September 25, 2025 15:00 UTC
**Status Updates:** Every 2 hours during active rotation

---

**🚨 CRITICAL REMINDER**: Until rotation is complete, assume all exposed credentials are actively compromised. Monitor for anomalous activity and be prepared for immediate response to any unauthorized usage detected.