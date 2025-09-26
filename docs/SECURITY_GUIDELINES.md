# Security Guidelines

## Overview
This document outlines security best practices for the Ignite Health Systems project, with specific focus on credential management, secret protection, and secure development workflows.

## 🔐 Credential Management

### Never Commit Secrets
**CRITICAL**: Never commit any of the following to the repository:
- API keys (Anthropic, OpenAI, etc.)
- Database passwords
- JWT secrets
- Private keys
- OAuth client secrets
- Environment-specific configuration

### Environment Variables
All sensitive data must be stored in environment variables:

```bash
# ✅ CORRECT - Use environment variables
ANTHROPIC_API_KEY=your_key_here
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret

# ❌ WRONG - Never hardcode in source
const apiKey = "sk-ant-api03-..."; // DON'T DO THIS
```

### Environment File Structure
```
project-root/
├── .env.example          # Template with dummy values
├── .env.local           # Local development (gitignored)
├── .env.production      # Production secrets (never committed)
└── .env.staging         # Staging secrets (never committed)
```

## 🛡️ Secret Protection Layers

### 1. .gitignore Configuration
Ensure these patterns are in your `.gitignore`:
```
# Environment files
.env
.env.local
.env.production
.env.staging
.env.*.local

# API keys and secrets
*.key
*.pem
secrets.json
config/secrets.json

# IDE and editor files
.vscode/settings.json
.idea/

# OS files
.DS_Store
Thumbs.db
```

### 2. Pre-commit Hooks
Install and configure pre-commit hooks to prevent secret commits:

```bash
# Install pre-commit
npm install --save-dev @commitlint/cli @commitlint/config-conventional
pip install pre-commit

# Create .pre-commit-config.yaml (see separate file)
pre-commit install
```

### 3. Secret Scanning Tools

#### GitGuardian (Recommended)
```bash
# Install GitGuardian CLI
pip install detect-secrets

# Scan repository
detect-secrets scan --all-files
```

#### TruffleHog
```bash
# Install TruffleHog
brew install trufflesecurity/trufflehog/trufflehog

# Scan repository
trufflehog git file://. --only-verified
```

#### GitHub Secret Scanning
Enable GitHub's built-in secret scanning:
1. Go to repository Settings → Security & analysis
2. Enable "Secret scanning"
3. Enable "Push protection"

## 🔄 Credential Rotation Process

### Regular Rotation Schedule
- **API Keys**: Every 90 days
- **Database Passwords**: Every 60 days
- **JWT Secrets**: Every 30 days
- **SSH Keys**: Every 180 days

### Rotation Checklist
- [ ] Generate new credential
- [ ] Update all environments (dev, staging, prod)
- [ ] Update CI/CD pipeline variables
- [ ] Verify all services are working
- [ ] Revoke old credential
- [ ] Document rotation in security log

### Emergency Rotation
If a credential is compromised:
1. **Immediately** revoke the compromised credential
2. Generate and deploy new credential
3. Investigate the scope of exposure
4. Update incident response log
5. Review and improve security measures

## 🏗️ Secure Development Practices

### Code Review Requirements
All code changes must be reviewed for:
- Hardcoded secrets or credentials
- Proper environment variable usage
- Security vulnerabilities
- Compliance with security guidelines

### Testing with Secrets
```javascript
// ✅ CORRECT - Mock secrets in tests
const mockApiKey = 'test-key-123';
jest.mock('../config', () => ({
  apiKey: mockApiKey
}));

// ❌ WRONG - Using real secrets in tests
const realApiKey = process.env.ANTHROPIC_API_KEY; // Don't do this
```

### Logging Security
Never log sensitive information:
```javascript
// ✅ CORRECT - Redact sensitive data
console.log('API call successful', {
  endpoint: '/api/users',
  status: 200,
  apiKey: '[REDACTED]'
});

// ❌ WRONG - Logging sensitive data
console.log('API call', { apiKey: process.env.API_KEY }); // Don't do this
```

## 📋 Security Checklist

### Before Every Commit
- [ ] No hardcoded secrets in code
- [ ] Environment variables used for all sensitive data
- [ ] .env files not staged for commit
- [ ] Pre-commit hooks passing
- [ ] Security tests passing

### Before Every Deploy
- [ ] All environment variables set correctly
- [ ] Secrets rotated if scheduled
- [ ] Security scans completed
- [ ] Access permissions reviewed
- [ ] Backup and recovery tested

### Monthly Security Review
- [ ] Review all active credentials
- [ ] Check for unused or expired keys
- [ ] Update security dependencies
- [ ] Review access logs
- [ ] Update security documentation

## 🚨 Incident Response

### If Secrets Are Compromised
1. **Stop**: Don't panic, but act quickly
2. **Assess**: Determine which secrets were exposed
3. **Revoke**: Immediately revoke compromised credentials
4. **Replace**: Generate and deploy new credentials
5. **Monitor**: Watch for unauthorized access
6. **Document**: Record incident and lessons learned

### Emergency Contacts
- Security Team: security@ignitehealthsystems.com
- DevOps Lead: devops@ignitehealthsystems.com
- CTO: cto@ignitehealthsystems.com

## 🔍 Secret Scanning Integration

### GitHub Actions
Add to `.github/workflows/security.yml`:
```yaml
name: Security Scan
on: [push, pull_request]
jobs:
  secret-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run TruffleHog
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main
          head: HEAD
```

### Local Development
Add to package.json scripts:
```json
{
  "scripts": {
    "security:scan": "trufflehog git file://. --only-verified",
    "security:check": "detect-secrets scan --all-files",
    "pre-commit": "npm run security:scan && npm run test"
  }
}
```

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [GitGuardian Best Practices](https://docs.gitguardian.com/secrets-detection/detectors/generics)
- [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)
- [Azure Key Vault](https://azure.microsoft.com/en-us/services/key-vault/)

## 📞 Support

For security questions or incidents:
- Create an issue with label `security`
- Email: security@ignitehealthsystems.com
- Slack: #security-alerts

---

**Remember**: Security is everyone's responsibility. When in doubt, ask for help rather than assume it's safe.