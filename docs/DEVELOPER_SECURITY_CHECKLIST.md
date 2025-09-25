# Developer Security Checklist

## Overview
This checklist ensures all developers follow security best practices when working on the Ignite Health Systems project. Use this as a daily reference and before every commit/deploy.

## 🏁 Onboarding Security Checklist

### New Developer Setup
- [ ] Complete security training
- [ ] Install required security tools (see Tools section)
- [ ] Configure IDE with security plugins
- [ ] Set up pre-commit hooks
- [ ] Review and acknowledge security policies
- [ ] Get access to security communication channels
- [ ] Receive security contact information

### Development Environment Setup
- [ ] Install and configure git secrets scanner
- [ ] Set up environment variables correctly
- [ ] Configure IDE to show sensitive file warnings
- [ ] Install browser security extensions
- [ ] Set up VPN for remote work
- [ ] Configure 2FA on all accounts

## 📝 Daily Development Checklist

### Before Starting Work
- [ ] Pull latest changes from main branch
- [ ] Check for security advisories in dependencies
- [ ] Review any security incidents from previous day
- [ ] Ensure development environment is updated

### During Development
- [ ] Use environment variables for all sensitive data
- [ ] Never hardcode credentials or secrets
- [ ] Follow secure coding patterns
- [ ] Sanitize all user inputs
- [ ] Use parameterized queries for database operations
- [ ] Implement proper error handling (don't leak sensitive info)

### Before Every Commit
- [ ] **Run pre-commit security scan**
- [ ] **Check no .env files are staged**
- [ ] **Verify no API keys in code**
- [ ] **Review diff for sensitive data**
- [ ] **Run security tests**
- [ ] **Update .gitignore if needed**

## 🔍 Pre-Commit Security Scan

### Quick Command Check
```bash
# Run this before EVERY commit
npm run security:pre-commit

# Manual checks if automated tools fail
git diff --cached | grep -i "password\|secret\|key\|token" || echo "✅ No obvious secrets found"
git status --porcelain | grep -E "\.(env|key|pem|p12)$" || echo "✅ No credential files staged"
```

### What to Look For
- [ ] API keys (sk-*, pk-*, key-, token-)
- [ ] Passwords or secrets
- [ ] Database connection strings
- [ ] Private keys (.pem, .key files)
- [ ] Environment files (.env, .env.local)
- [ ] Configuration with sensitive data

## 🛡️ Code Security Checklist

### Input Validation
- [ ] All user inputs are validated and sanitized
- [ ] File uploads have proper type and size restrictions
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (output encoding)
- [ ] CSRF protection implemented

### Authentication & Authorization
- [ ] Proper password hashing (bcrypt, scrypt, or Argon2)
- [ ] Secure session management
- [ ] JWT tokens properly validated
- [ ] Role-based access control implemented
- [ ] Rate limiting on authentication endpoints

### Data Protection
- [ ] Sensitive data encrypted at rest
- [ ] Secure communication (HTTPS/TLS)
- [ ] Personal data handling complies with privacy laws
- [ ] Proper data retention policies followed
- [ ] Secure backup and recovery procedures

### Error Handling
- [ ] No sensitive information in error messages
- [ ] Proper logging without sensitive data
- [ ] Graceful failure handling
- [ ] Security events are logged
- [ ] Error responses don't reveal system information

## 🔧 Required Security Tools

### IDE/Editor Plugins
```bash
# VS Code Security Extensions
code --install-extension ms-vscode.vscode-json
code --install-extension streetsidesoftware.code-spell-checker
code --install-extension ms-python.python
code --install-extension ms-vscode.security-extension

# Vim/Neovim plugins
# Add security-focused plugins to your config
```

### Command Line Tools
```bash
# Install required security tools
npm install -g @gitguardian/ggshield
npm install --save-dev detect-secrets
pip install bandit safety
brew install git-secrets trufflesecurity/trufflehog/trufflehog

# Configure git secrets
git secrets --register-aws
git secrets --install
```

### Pre-commit Configuration
Create `.pre-commit-config.yaml`:
```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: check-added-large-files
      - id: check-merge-conflict
      - id: check-yaml
      - id: detect-private-key
      - id: end-of-file-fixer
      - id: trailing-whitespace

  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']

  - repo: https://github.com/gitguardian/ggshield
    rev: v1.25.0
    hooks:
      - id: ggshield
        language: python
        stages: [commit]
```

## 🚨 Red Flags - Stop Immediately

### Code Red Situations
If you see any of these, **STOP** and alert the security team:
- [ ] Hardcoded API keys or passwords in code
- [ ] Sensitive data being logged
- [ ] Database credentials in configuration files
- [ ] Private keys committed to repository
- [ ] Environment files (.env) in version control
- [ ] Suspicious network requests or connections

### Immediate Actions
1. **Don't commit** the problematic code
2. **Remove** sensitive data immediately
3. **Alert** security team via Slack #security-alerts
4. **Document** what happened for investigation
5. **Review** recent commits for similar issues

## 📋 Code Review Security Checklist

### As a Reviewer
- [ ] Check for hardcoded secrets
- [ ] Verify input validation is present
- [ ] Ensure error handling doesn't leak info
- [ ] Confirm authentication/authorization logic
- [ ] Review dependency updates for security
- [ ] Check for SQL injection vulnerabilities
- [ ] Verify proper logging practices

### Security-Focused Questions
- "Could this input be manipulated maliciously?"
- "Are we properly validating user permissions?"
- "Could this error message reveal sensitive information?"
- "Are we following the principle of least privilege?"
- "Is this data properly encrypted/protected?"

## 🌐 Web Security Checklist

### Frontend Security
- [ ] Content Security Policy (CSP) implemented
- [ ] HTTPS enforced (HSTS headers)
- [ ] Secure cookies (httpOnly, secure, sameSite)
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] No sensitive data in client-side code

### API Security
- [ ] Proper authentication on all endpoints
- [ ] Rate limiting implemented
- [ ] Input validation and sanitization
- [ ] Proper HTTP status codes
- [ ] CORS configured correctly
- [ ] API versioning implemented

## 🗃️ Database Security Checklist

### Database Operations
- [ ] Use parameterized queries (no string concatenation)
- [ ] Principle of least privilege for database users
- [ ] Regular database updates and patches
- [ ] Proper backup encryption
- [ ] Database connection encryption (TLS)
- [ ] SQL injection testing completed

### Example: Secure Database Query
```javascript
// ✅ CORRECT - Parameterized query
const user = await db.query(
  'SELECT * FROM users WHERE id = $1 AND active = $2',
  [userId, true]
);

// ❌ WRONG - String concatenation (SQL injection risk)
const user = await db.query(
  `SELECT * FROM users WHERE id = ${userId} AND active = true`
);
```

## 📦 Dependency Security Checklist

### Before Adding Dependencies
- [ ] Check package reputation and maintainer
- [ ] Review package permissions and scope
- [ ] Verify package is actively maintained
- [ ] Check for known vulnerabilities
- [ ] Use exact version pinning for production

### Regular Maintenance
- [ ] Run `npm audit` weekly
- [ ] Update dependencies monthly
- [ ] Monitor security advisories
- [ ] Use tools like Dependabot or Renovate
- [ ] Test updates thoroughly before production

```bash
# Weekly security check
npm audit --audit-level=moderate
npm outdated
npx ncu -u  # Check for updates
```

## 🚀 Deployment Security Checklist

### Pre-deployment
- [ ] All secrets moved to environment variables
- [ ] Security tests passing
- [ ] Dependencies updated and audited
- [ ] No debug code or comments in production
- [ ] Access controls properly configured
- [ ] Monitoring and alerting configured

### Production Environment
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Firewall rules properly set
- [ ] Log monitoring active
- [ ] Backup and recovery tested
- [ ] Incident response plan updated

## 🔄 Weekly Security Tasks

### Every Monday
- [ ] Review security alerts and advisories
- [ ] Check for dependency vulnerabilities
- [ ] Review access logs for anomalies
- [ ] Update security tools and definitions
- [ ] Check credential rotation schedule

### Monthly Security Review
- [ ] Review and update security policies
- [ ] Audit user access and permissions
- [ ] Test incident response procedures
- [ ] Review security metrics and trends
- [ ] Update security training materials

## 📞 Security Contacts

### Immediate Security Issues
- **Slack**: #security-alerts
- **Email**: security@ignitehealthsystems.com
- **Emergency**: Call on-call engineer

### Non-urgent Security Questions
- **Slack**: #security-help
- **Email**: security-help@ignitehealthsystems.com
- **Documentation**: Internal security wiki

## 🎓 Security Training Resources

### Required Reading
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)
- [Web Security Fundamentals](https://web.dev/security/)

### Recommended Courses
- OWASP WebGoat (hands-on practice)
- Security+ certification materials
- Company-specific security training modules

### Regular Practice
- Participate in security code reviews
- Attend security brown-bag sessions
- Practice with security challenges (HackTheBox, etc.)
- Stay updated with security news and blogs

## ✅ Quick Daily Checklist

Print this and keep it at your desk:

```
🔐 DAILY SECURITY CHECK
□ Pre-commit scan completed
□ No secrets in code
□ Environment variables used
□ Input validation added
□ Error handling secure
□ Dependencies updated
□ Security tests passing
□ Code review completed
```

---

**Remember**: Security is not optional. When in doubt, ask for help!

**Emergency**: If you discover a security vulnerability, immediately contact the security team. Don't wait!