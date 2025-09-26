# Secret Scanning Setup Guide

## Overview
This guide provides comprehensive setup instructions for implementing secret scanning tools to prevent credential leaks in the Ignite Health Systems project. Multiple scanning approaches ensure complete coverage.

## 🛡️ Multi-Layered Secret Protection

### Layer 1: Pre-commit Scanning
Prevents secrets from being committed

### Layer 2: Repository Scanning
Scans entire codebase regularly

### Layer 3: CI/CD Pipeline Integration
Automated scanning on every build

### Layer 4: Real-time Monitoring
Monitors for secrets in real-time

## 🔧 Tool Installation & Setup

### 1. GitGuardian CLI

#### Installation
```bash
# Using pip
pip install ggshield

# Using Homebrew (macOS)
brew install gitguardian/tap/ggshield

# Using npm
npm install -g @gitguardian/ggshield

# Verify installation
ggshield --version
```

#### Configuration
```bash
# Create GitGuardian account and get API key
# Visit: https://dashboard.gitguardian.com/

# Set API key (choose one method)
export GITGUARDIAN_API_KEY="your-api-key-here"

# Or create config file
ggshield config set-api-key "your-api-key-here"

# Test configuration
ggshield api-status
```

#### Basic Usage
```bash
# Scan current directory
ggshield secret scan path .

# Scan specific files
ggshield secret scan path src/config.js

# Scan git commits
ggshield secret scan commit-range HEAD~10..HEAD

# Scan with custom policies
ggshield secret scan path . --json --output secrets-report.json
```

### 2. TruffleHog

#### Installation
```bash
# Using Go
go install github.com/trufflesecurity/trufflehog/v3@latest

# Using Homebrew
brew install trufflesecurity/trufflehog/trufflehog

# Using Docker
docker pull trufflesecurity/trufflehog:latest

# Verify installation
trufflehog --version
```

#### Basic Usage
```bash
# Scan git repository
trufflehog git file://. --only-verified

# Scan specific directory
trufflehog filesystem ./src --only-verified

# Scan with JSON output
trufflehog git file://. --json > trufflehog-results.json

# Scan GitHub repository
trufflehog github --repo https://github.com/username/repo
```

### 3. detect-secrets

#### Installation
```bash
# Using pip
pip install detect-secrets

# Verify installation
detect-secrets --version
```

#### Setup Baseline
```bash
# Create initial baseline
detect-secrets scan --all-files --baseline .secrets.baseline

# Update baseline (after reviewing findings)
detect-secrets scan --baseline .secrets.baseline --update

# Audit findings interactively
detect-secrets audit .secrets.baseline
```

#### Usage
```bash
# Scan for new secrets
detect-secrets scan --baseline .secrets.baseline

# Scan specific files
detect-secrets scan --string 'your-secret-here'

# Generate detailed report
detect-secrets scan --all-files --output secrets-detailed.json
```

### 4. GitHub Secret Scanning

#### Enable Repository Scanning
1. Go to repository Settings → Security & analysis
2. Enable "Secret scanning"
3. Enable "Push protection"
4. Configure custom patterns if needed

#### GitHub Actions Integration
```yaml
# .github/workflows/secret-scan.yml
name: Secret Scanning
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  secret-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: GitGuardian scan
        uses: GitGuardian/ggshield/actions/secret@v1.25.0
        env:
          GITHUB_PUSH_BEFORE_SHA: ${{ github.event.before }}
          GITHUB_PUSH_BASE_SHA: ${{ github.event.base }}
          GITHUB_PULL_BASE_SHA: ${{ github.event.pull_request.base.sha }}
          GITHUB_DEFAULT_BRANCH: ${{ github.event.repository.default_branch }}
          GITGUARDIAN_API_KEY: ${{ secrets.GITGUARDIAN_API_KEY }}

      - name: TruffleHog OSS
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main
          head: HEAD
          extra_args: --debug --only-verified
```

## 🎯 Custom Secret Patterns

### GitGuardian Custom Detectors
```yaml
# .gitguardian.yml
version: 2

paths-ignore:
  - "**/node_modules/**"
  - "**/vendor/**"
  - "**/*.min.js"
  - "**/package-lock.json"
  - "**/.secrets.baseline"

detectors:
  - name: "Custom API Key Pattern"
    regex: "ignite[_-]api[_-]key[_-][a-zA-Z0-9]{32}"
    description: "Ignite Health Systems API Key"

  - name: "Database Connection String"
    regex: "postgresql://[^\\s]+:[^\\s]+@[^\\s]+/[^\\s]+"
    description: "PostgreSQL connection string"

secret-scan-preference: all
```

### TruffleHog Custom Rules
```yaml
# trufflehog-config.yml
detectors:
  - name: ignite-api-key
    keywords:
      - ignite
      - api
      - key
    regex:
      ignite-api-key: 'ignite[_-]?api[_-]?key[_-]?[a-zA-Z0-9]{32,}'
    verify:
      - endpoint: 'https://api.ignitehealthsystems.com/verify'
        unsafe: false
        headers:
          - 'Authorization: Bearer {token}'
        successCodes:
          - 200
        bodyRegex: '"valid":\s*true'
```

### detect-secrets Custom Plugins
```python
# .secrets.custom-plugins.py
import re
from typing import Generator, NamedTuple

class PotentialSecret(NamedTuple):
    type: str
    filename: str
    secret: str
    line_number: int

def detect_ignite_secrets(string: str) -> Generator[PotentialSecret, None, None]:
    """Custom detector for Ignite Health Systems secrets."""

    patterns = {
        'ignite_api_key': r'ignite[_-]?api[_-]?key[_-]?[a-zA-Z0-9]{32,}',
        'ignite_db_password': r'ignite[_-]?db[_-]?pass[_-]?[a-zA-Z0-9!@#$%^&*()]{12,}',
        'ignite_jwt_secret': r'ignite[_-]?jwt[_-]?secret[_-]?[a-zA-Z0-9+/=]{40,}',
    }

    for secret_type, pattern in patterns.items():
        for match in re.finditer(pattern, string, re.IGNORECASE):
            yield PotentialSecret(
                type=secret_type,
                filename='',  # Will be filled by framework
                secret=match.group(),
                line_number=0  # Will be calculated by framework
            )
```

## 🚀 Automation Scripts

### Complete Scan Script
```bash
#!/bin/bash
# scripts/security-scan.sh

set -e

echo "🔍 Starting comprehensive secret scan..."
echo "======================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SCAN_FAILED=0

# Create reports directory
mkdir -p security-reports/$(date +%Y-%m-%d)
REPORT_DIR="security-reports/$(date +%Y-%m-%d)"

echo "📊 Reports will be saved to: $REPORT_DIR"

# 1. GitGuardian scan
echo ""
echo "🛡️ Running GitGuardian scan..."
if ggshield secret scan path . --json --output "$REPORT_DIR/gitguardian-report.json"; then
    echo -e "${GREEN}✅ GitGuardian scan completed${NC}"
else
    echo -e "${RED}❌ GitGuardian scan found secrets${NC}"
    SCAN_FAILED=1
fi

# 2. TruffleHog scan
echo ""
echo "🐷 Running TruffleHog scan..."
if trufflehog git file://. --json > "$REPORT_DIR/trufflehog-report.json" 2>&1; then
    echo -e "${GREEN}✅ TruffleHog scan completed${NC}"
else
    echo -e "${RED}❌ TruffleHog scan found secrets${NC}"
    SCAN_FAILED=1
fi

# 3. detect-secrets scan
echo ""
echo "🔍 Running detect-secrets scan..."
if detect-secrets scan --all-files > "$REPORT_DIR/detect-secrets-report.json"; then
    echo -e "${GREEN}✅ detect-secrets scan completed${NC}"
else
    echo -e "${RED}❌ detect-secrets scan found secrets${NC}"
    SCAN_FAILED=1
fi

# 4. Custom patterns scan
echo ""
echo "🎯 Running custom pattern scan..."
if grep -r -n -E "(password|secret|key|token).*=.*['\"][^'\"]{8,}['\"]" . \
   --exclude-dir=node_modules \
   --exclude-dir=.git \
   --exclude="*.log" \
   --exclude="package-lock.json" > "$REPORT_DIR/custom-patterns.txt" 2>/dev/null; then
    echo -e "${YELLOW}⚠️ Custom pattern scan found potential secrets${NC}"
    SCAN_FAILED=1
else
    echo -e "${GREEN}✅ Custom pattern scan completed${NC}"
fi

# Generate summary report
echo ""
echo "📋 Generating summary report..."
cat > "$REPORT_DIR/scan-summary.md" << EOF
# Security Scan Report - $(date)

## Scan Results
- GitGuardian: $(if [ -s "$REPORT_DIR/gitguardian-report.json" ]; then echo "Issues found"; else echo "Clean"; fi)
- TruffleHog: $(if [ -s "$REPORT_DIR/trufflehog-report.json" ]; then echo "Issues found"; else echo "Clean"; fi)
- detect-secrets: $(if [ -s "$REPORT_DIR/detect-secrets-report.json" ]; then echo "Issues found"; else echo "Clean"; fi)
- Custom patterns: $(if [ -s "$REPORT_DIR/custom-patterns.txt" ]; then echo "Issues found"; else echo "Clean"; fi)

## Files Scanned
- Total files: $(find . -type f -not -path "./.git/*" -not -path "./node_modules/*" | wc -l)
- Scan duration: $(date)

## Next Steps
$(if [ $SCAN_FAILED -eq 1 ]; then
    echo "❌ SECRETS DETECTED - Review reports and remediate immediately"
    echo "1. Review all report files in $REPORT_DIR"
    echo "2. Remove or secure any identified secrets"
    echo "3. Rotate any exposed credentials"
    echo "4. Update .gitignore and security policies"
else
    echo "✅ No secrets detected - Repository is clean"
fi)
EOF

# Display results
echo ""
echo "======================================="
if [ $SCAN_FAILED -eq 1 ]; then
    echo -e "${RED}❌ SECURITY SCAN FAILED${NC}"
    echo "Secrets were detected in the repository!"
    echo "Check reports in: $REPORT_DIR"
    exit 1
else
    echo -e "${GREEN}✅ SECURITY SCAN PASSED${NC}"
    echo "No secrets detected in repository"
fi
```

### Automated Remediation Script
```bash
#!/bin/bash
# scripts/secret-remediation.sh

echo "🔧 Starting secret remediation process..."

# Backup current state
git stash push -m "Pre-remediation backup $(date)"

# Common secret patterns to remove/replace
declare -A SECRET_PATTERNS=(
    ["hardcoded_passwords"]="password\s*=\s*['\"][^'\"]+['\"]"
    ["api_keys"]="(api[_-]?key|secret[_-]?key)\s*=\s*['\"][^'\"]+['\"]"
    ["database_urls"]="database[_-]?url\s*=\s*['\"]postgresql://[^'\"]+['\"]"
    ["jwt_secrets"]="jwt[_-]?secret\s*=\s*['\"][^'\"]+['\"]"
)

for pattern_name in "${!SECRET_PATTERNS[@]}"; do
    pattern="${SECRET_PATTERNS[$pattern_name]}"

    echo "🔍 Searching for: $pattern_name"

    # Find files with pattern
    if grep -r -l -E "$pattern" . --exclude-dir=node_modules --exclude-dir=.git; then
        echo "⚠️ Found $pattern_name in files above"
        echo "Please review and replace with environment variables"

        # Suggest replacement
        case $pattern_name in
            "hardcoded_passwords")
                echo "💡 Replace with: process.env.DATABASE_PASSWORD"
                ;;
            "api_keys")
                echo "💡 Replace with: process.env.API_KEY"
                ;;
            "database_urls")
                echo "💡 Replace with: process.env.DATABASE_URL"
                ;;
            "jwt_secrets")
                echo "💡 Replace with: process.env.JWT_SECRET"
                ;;
        esac
    fi
done

echo "✅ Remediation suggestions complete"
echo "Remember to:"
echo "1. Replace hardcoded secrets with environment variables"
echo "2. Add secrets to .env files (and .gitignore)"
echo "3. Update deployment configurations"
echo "4. Rotate any exposed credentials"
```

## 📊 Monitoring and Reporting

### Dashboard Setup
```javascript
// scripts/security-dashboard.js
const fs = require('fs');
const path = require('path');

class SecurityDashboard {
    constructor() {
        this.reportDir = 'security-reports';
        this.metrics = {
            scans: 0,
            secrets_found: 0,
            false_positives: 0,
            remediated: 0
        };
    }

    generateDashboard() {
        const reports = this.getRecentReports();
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Security Dashboard</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .metric { padding: 20px; margin: 10px; border: 1px solid #ddd; }
                .clean { background-color: #d4edda; }
                .warning { background-color: #fff3cd; }
                .danger { background-color: #f8d7da; }
            </style>
        </head>
        <body>
            <h1>🛡️ Security Scanning Dashboard</h1>
            <div class="metrics">
                <div class="metric clean">
                    <h3>Total Scans: ${this.metrics.scans}</h3>
                </div>
                <div class="metric ${this.metrics.secrets_found > 0 ? 'danger' : 'clean'}">
                    <h3>Secrets Found: ${this.metrics.secrets_found}</h3>
                </div>
                <div class="metric warning">
                    <h3>False Positives: ${this.metrics.false_positives}</h3>
                </div>
                <div class="metric clean">
                    <h3>Remediated: ${this.metrics.remediated}</h3>
                </div>
            </div>
            <h2>Recent Reports</h2>
            ${reports.map(report => `<div>${report}</div>`).join('')}
        </body>
        </html>
        `;

        fs.writeFileSync('security-dashboard.html', html);
        console.log('📊 Dashboard generated: security-dashboard.html');
    }

    getRecentReports() {
        // Implementation to read recent reports
        return [];
    }
}

const dashboard = new SecurityDashboard();
dashboard.generateDashboard();
```

### Slack Integration
```bash
#!/bin/bash
# scripts/notify-slack.sh

WEBHOOK_URL="${SLACK_WEBHOOK_URL}"
REPORT_FILE="$1"
STATUS="$2"

if [ -z "$WEBHOOK_URL" ]; then
    echo "SLACK_WEBHOOK_URL not set"
    exit 0
fi

if [ "$STATUS" = "FAILED" ]; then
    COLOR="#ff0000"
    EMOJI="🚨"
    TITLE="Security Scan Failed"
    MESSAGE="Secrets detected in repository! Check security reports immediately."
else
    COLOR="#00ff00"
    EMOJI="✅"
    TITLE="Security Scan Passed"
    MESSAGE="No secrets detected in repository scan."
fi

curl -X POST -H 'Content-type: application/json' \
    --data "{
        \"attachments\": [{
            \"color\": \"$COLOR\",
            \"title\": \"$EMOJI $TITLE\",
            \"text\": \"$MESSAGE\",
            \"fields\": [{
                \"title\": \"Repository\",
                \"value\": \"$(basename $(git rev-parse --show-toplevel))\",
                \"short\": true
            }, {
                \"title\": \"Branch\",
                \"value\": \"$(git rev-parse --abbrev-ref HEAD)\",
                \"short\": true
            }, {
                \"title\": \"Commit\",
                \"value\": \"$(git rev-parse --short HEAD)\",
                \"short\": true
            }]
        }]
    }" \
    $WEBHOOK_URL
```

## 🔄 Continuous Monitoring

### Scheduled Scanning
```yaml
# .github/workflows/scheduled-security-scan.yml
name: Scheduled Security Scan
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  workflow_dispatch:

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Run comprehensive security scan
        run: |
          chmod +x scripts/security-scan.sh
          ./scripts/security-scan.sh

      - name: Upload scan reports
        uses: actions/upload-artifact@v3
        with:
          name: security-reports
          path: security-reports/
          retention-days: 30

      - name: Notify team if secrets found
        if: failure()
        run: |
          chmod +x scripts/notify-slack.sh
          ./scripts/notify-slack.sh security-reports FAILED
```

### Real-time Monitoring with Webhooks
```javascript
// webhook-monitor.js
const express = require('express');
const { execSync } = require('child_process');
const app = express();

app.use(express.json());

app.post('/webhook/github', (req, res) => {
    const { action, repository } = req.body;

    if (action === 'opened' || action === 'synchronize') {
        console.log('🔍 Running security scan on PR...');

        try {
            execSync('./scripts/security-scan.sh', { stdio: 'inherit' });
            res.json({ status: 'scan_completed', secrets_found: false });
        } catch (error) {
            console.error('❌ Security scan failed');
            res.status(400).json({ status: 'scan_failed', secrets_found: true });
        }
    } else {
        res.json({ status: 'ignored' });
    }
});

app.listen(3000, () => {
    console.log('🚀 Webhook monitor listening on port 3000');
});
```

## 📚 Best Practices

### 1. Baseline Management
- Regularly review and update baselines
- Document approved exceptions
- Use audit mode for manual review
- Version control baseline files

### 2. False Positive Handling
- Create allow-lists for legitimate patterns
- Use ignore comments for specific lines
- Document why certain patterns are safe
- Regular review of ignored patterns

### 3. Team Training
- Regular training on secret detection tools
- Incident response procedures
- Secure coding practices
- Tool-specific best practices

### 4. Integration Strategy
- Start with basic scanning
- Gradually add more sophisticated tools
- Integrate with existing workflows
- Monitor performance impact

## 📞 Support and Resources

### Documentation Links
- [GitGuardian Docs](https://docs.gitguardian.com/)
- [TruffleHog Docs](https://github.com/trufflesecurity/trufflehog)
- [detect-secrets Docs](https://github.com/Yelp/detect-secrets)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)

### Emergency Contacts
- Security Team: security@ignitehealthsystems.com
- DevOps Team: devops@ignitehealthsystems.com
- On-call Engineer: See PagerDuty

---

**Remember**: Secret scanning is most effective when implemented as part of a comprehensive security strategy. Regular scans, proper configuration, and team training are key to success!