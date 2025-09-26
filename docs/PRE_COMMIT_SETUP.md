# Pre-commit Hook Setup Guide

## Overview
Pre-commit hooks are essential for preventing security vulnerabilities and maintaining code quality. This guide provides step-by-step instructions for setting up comprehensive pre-commit hooks for the Ignite Health Systems project.

## 🚀 Quick Setup

### 1. Install Pre-commit Framework
```bash
# Using pip (recommended)
pip install pre-commit

# Using npm (alternative)
npm install -g pre-commit

# Using brew (macOS)
brew install pre-commit

# Verify installation
pre-commit --version
```

### 2. Create Configuration File
Create `.pre-commit-config.yaml` in your project root:

```yaml
# .pre-commit-config.yaml
repos:
  # Basic file checks
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-json
      - id: check-toml
      - id: check-xml
      - id: check-added-large-files
        args: ['--maxkb=500']
      - id: check-case-conflict
      - id: check-merge-conflict
      - id: check-symlinks
      - id: check-executables-have-shebangs
      - id: detect-private-key
      - id: mixed-line-ending

  # Secret detection
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
        exclude: package.lock.json

  # GitGuardian secret scanning
  - repo: https://github.com/gitguardian/ggshield
    rev: v1.25.0
    hooks:
      - id: ggshield
        language: python
        stages: [commit]

  # JavaScript/TypeScript linting
  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v8.44.0
    hooks:
      - id: eslint
        files: \.(js|ts|jsx|tsx)$
        types: [file]
        additional_dependencies:
          - eslint@8.44.0
          - eslint-plugin-security@1.7.1

  # Python security scanning
  - repo: https://github.com/PyCQA/bandit
    rev: 1.7.5
    hooks:
      - id: bandit
        args: ['-r', '.', '-f', 'json', '-o', 'bandit-report.json']
        files: \.py$

  # Dependency vulnerability scanning
  - repo: https://github.com/Lucas-C/pre-commit-hooks-safety
    rev: v1.3.2
    hooks:
      - id: python-safety-dependencies-check

  # Docker security
  - repo: https://github.com/hadolint/hadolint
    rev: v2.12.0
    hooks:
      - id: hadolint-docker
        args: ['--ignore', 'DL3008', '--ignore', 'DL3009']

  # Custom security checks
  - repo: local
    hooks:
      - id: check-env-files
        name: Check for .env files
        entry: sh -c 'if git diff --cached --name-only | grep -E "\.env"; then echo "❌ .env files should not be committed"; exit 1; fi'
        language: system
        pass_filenames: false

      - id: check-api-keys
        name: Check for API keys
        entry: sh -c 'if git diff --cached | grep -iE "(api[_-]?key|secret[_-]?key|private[_-]?key)" | grep -v "API_KEY_HERE\|YOUR_KEY_HERE\|REPLACE_WITH"; then echo "❌ Potential API keys found in commit"; exit 1; fi'
        language: system
        pass_filenames: false

      - id: security-test
        name: Run security tests
        entry: npm run test:security
        language: system
        pass_filenames: false
        files: \.(js|ts|jsx|tsx)$
```

### 3. Install Git Hook Scripts
```bash
# Install the git hook scripts
pre-commit install

# Install for commit-msg hook (optional)
pre-commit install --hook-type commit-msg

# Install for pre-push hook (optional)
pre-commit install --hook-type pre-push
```

## 🔧 Advanced Configuration

### Custom Hook Scripts
Create custom hooks in `.git/hooks/` directory:

```bash
#!/bin/sh
# .git/hooks/pre-commit-custom
set -e

echo "🔍 Running custom security checks..."

# Check for TODO/FIXME in security-critical files
if git diff --cached --name-only | xargs grep -l "TODO\|FIXME" | grep -E "(auth|security|crypto|password)" > /dev/null; then
    echo "❌ TODO/FIXME found in security-critical files"
    exit 1
fi

# Check for console.log in production files
if git diff --cached --name-only | grep -v test | xargs grep -l "console\.log" > /dev/null 2>&1; then
    echo "⚠️ console.log statements found in non-test files"
    echo "Consider using proper logging instead"
fi

# Check for hardcoded localhost URLs
if git diff --cached | grep -E "http://localhost|https://localhost" > /dev/null; then
    echo "❌ Hardcoded localhost URLs found"
    exit 1
fi

echo "✅ Custom security checks passed"
```

### Environment-Specific Hooks
```yaml
# .pre-commit-config-production.yaml
repos:
  - repo: local
    hooks:
      - id: production-checks
        name: Production deployment checks
        entry: sh -c '
          echo "🚀 Running production checks..." &&
          npm run build &&
          npm run test:integration &&
          npm run security:scan &&
          echo "✅ Production checks passed"
        '
        language: system
        pass_filenames: false
```

## 🛡️ Security-Focused Hooks

### 1. Secret Detection Setup
```bash
# Initialize secrets baseline
detect-secrets scan --all-files --baseline .secrets.baseline

# Update baseline when adding legitimate secrets
detect-secrets scan --baseline .secrets.baseline --update
```

### 2. GitGuardian Configuration
```bash
# Install GitGuardian CLI
pip install detect-secrets gitguardian

# Configure GitGuardian (requires API key)
export GITGUARDIAN_API_KEY="your-api-key-here"
```

### 3. TruffleHog Integration
```yaml
# Add to .pre-commit-config.yaml
- repo: https://github.com/trufflesecurity/trufflehog
  rev: v3.45.3
  hooks:
    - id: trufflehog
      args: [
        '--max_dept=50',
        '--source-metadata',
        'filesystem'
      ]
```

## 📋 Package.json Scripts

Add security scripts to your `package.json`:

```json
{
  "scripts": {
    "security:pre-commit": "npm run security:scan && npm run security:audit",
    "security:scan": "eslint --ext .js,.ts,.jsx,.tsx --fix . && npm run security:secrets",
    "security:secrets": "detect-secrets scan --all-files",
    "security:audit": "npm audit --audit-level=moderate",
    "security:test": "jest --testPathPattern=security",
    "test:security": "npm run security:scan && npm run security:test",
    "pre-commit": "pre-commit run --all-files"
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run security:pre-commit",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
      "pre-push": "npm run test && npm run security:audit"
    }
  }
}
```

## 🎯 ESLint Security Configuration

### .eslintrc.js Security Rules
```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:security/recommended'
  ],
  plugins: ['security'],
  rules: {
    // Security-focused rules
    'security/detect-object-injection': 'error',
    'security/detect-non-literal-regexp': 'error',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-new-buffer': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-possible-timing-attacks': 'error',
    'security/detect-pseudoRandomBytes': 'error',

    // Additional security rules
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-script-url': 'error',
    'no-alert': 'error'
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js'],
      rules: {
        'no-console': 'off',
        'security/detect-non-literal-regexp': 'off'
      }
    }
  ]
};
```

## 🐳 Docker Security Hooks

### Dockerfile Linting
```yaml
# Add to .pre-commit-config.yaml
- repo: https://github.com/hadolint/hadolint
  rev: v2.12.0
  hooks:
    - id: hadolint-docker
      args: [
        '--ignore', 'DL3008',  # Pin versions in apt-get
        '--ignore', 'DL3009'   # Delete apt-get lists
      ]
```

### Docker Compose Security
```bash
#!/bin/bash
# scripts/docker-security-check.sh

echo "🐳 Checking Docker security..."

# Check for privileged containers
if grep -r "privileged.*true" docker-compose*.yml; then
    echo "❌ Privileged containers found"
    exit 1
fi

# Check for host network mode
if grep -r "network_mode.*host" docker-compose*.yml; then
    echo "❌ Host network mode found"
    exit 1
fi

# Check for bind mounts to sensitive directories
if grep -r ":/etc\|:/root\|:/var/run/docker.sock" docker-compose*.yml; then
    echo "❌ Potentially dangerous bind mounts found"
    exit 1
fi

echo "✅ Docker security check passed"
```

## 🚨 Emergency Bypass

### Temporary Hook Bypass
```bash
# Skip hooks for emergency commits (use sparingly!)
git commit --no-verify -m "Emergency fix"

# Skip specific hook
SKIP=detect-secrets git commit -m "Legitimate commit with false positive"
```

### Hook Debugging
```bash
# Run hooks on all files
pre-commit run --all-files

# Run specific hook
pre-commit run detect-secrets --all-files

# Debug hook issues
pre-commit run --verbose --all-files

# Update hook repositories
pre-commit autoupdate
```

## 📊 Monitoring and Reporting

### Hook Performance Monitoring
```bash
#!/bin/bash
# scripts/hook-performance.sh

echo "📊 Pre-commit hook performance report"
echo "====================================="

time pre-commit run --all-files 2>&1 | tee pre-commit-performance.log

echo ""
echo "Performance summary:"
grep "real\|user\|sys" pre-commit-performance.log
```

### Security Metrics Collection
```javascript
// scripts/collect-security-metrics.js
const fs = require('fs');
const { execSync } = require('child_process');

const metrics = {
  timestamp: new Date().toISOString(),
  hooks: {
    total_runs: 0,
    failures: 0,
    secrets_detected: 0,
    vulnerabilities_found: 0
  }
};

// Collect metrics from various sources
try {
  const auditResult = execSync('npm audit --json').toString();
  const audit = JSON.parse(auditResult);
  metrics.hooks.vulnerabilities_found = audit.metadata.total;
} catch (error) {
  console.warn('Could not collect audit metrics');
}

// Save metrics
fs.writeFileSync(
  '.security-metrics.json',
  JSON.stringify(metrics, null, 2)
);
```

## 🔧 Troubleshooting

### Common Issues
1. **Hook installation fails**:
   ```bash
   # Fix permissions
   chmod +x .git/hooks/*

   # Reinstall hooks
   pre-commit uninstall
   pre-commit install
   ```

2. **Python hooks fail**:
   ```bash
   # Ensure Python environment is correct
   which python3
   pip install --upgrade pre-commit
   ```

3. **Node.js hooks fail**:
   ```bash
   # Update Node.js and npm
   npm install -g npm@latest
   npm install
   ```

### Performance Issues
- Use `--files` flag to run hooks on specific files only
- Consider using `parallel: true` in hook configuration
- Exclude large files or directories that don't need checking

### Integration with CI/CD
```yaml
# .github/workflows/pre-commit.yml
name: Pre-commit checks
on: [push, pull_request]
jobs:
  pre-commit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.x'
      - uses: pre-commit/action@v3.0.0
```

## 📚 Resources

- [Pre-commit Documentation](https://pre-commit.com/)
- [Supported Hooks List](https://pre-commit.com/hooks.html)
- [GitGuardian CLI](https://docs.gitguardian.com/ggshield-docs/getting-started)
- [ESLint Security Plugin](https://github.com/eslint-community/eslint-plugin-security)
- [Bandit Python Security](https://bandit.readthedocs.io/)

---

**Remember**: Pre-commit hooks are your first line of defense. Keep them updated and don't bypass them unless absolutely necessary!