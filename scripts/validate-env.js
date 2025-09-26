#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 *
 * This script validates that all required environment variables are set
 * and provides helpful feedback for missing or misconfigured variables.
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bright: '\x1b[1m'
};

// Required environment variables for different environments
const requiredVars = {
  development: [
    'NODE_ENV',
    'NEXT_PUBLIC_N8N_WEBHOOK_URL'
  ],
  production: [
    'NODE_ENV',
    'CLOUDFLARE_API_TOKEN',
    'CLOUDFLARE_ACCOUNT_ID',
    'CLOUDFLARE_ZONE_ID',
    'NEXT_PUBLIC_N8N_WEBHOOK_URL',
    'NEXT_PUBLIC_SITE_URL'
  ],
  all: [
    'NODE_ENV'
  ]
};

// Optional but recommended variables
const recommendedVars = [
  'EMAIL_USER',
  'EMAIL_PASS',
  'ADMIN_EMAIL',
  'N8N_API_KEY',
  'NEXT_PUBLIC_GA_ID'
];

// Variables that should be kept secret (never logged)
const secretVars = [
  'CLOUDFLARE_API_TOKEN',
  'CLOUDFLARE_API_KEY',
  'N8N_API_KEY',
  'EMAIL_PASS',
  'JWT_SECRET',
  'SESSION_SECRET',
  'ENCRYPTION_KEY',
  'GITHUB_TOKEN',
  'GOOGLE_OAUTH_CLIENT_SECRET',
  'MAILCHIMP_API_KEY',
  'TELEGRAM_BOT_TOKEN'
];

// URL validation patterns
const urlPatterns = {
  'NEXT_PUBLIC_N8N_WEBHOOK_URL': /^https?:\/\/.+\/webhook\/.+$/,
  'NEXT_PUBLIC_SITE_URL': /^https?:\/\/.+$/,
  'N8N_WEBHOOK_URL': /^https?:\/\/.+\/webhook\/.+$/
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logBright(message, color = 'bright') {
  console.log(`${colors[color]}${colors.bright}${message}${colors.reset}`);
}

function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  const envExamplePath = path.join(process.cwd(), '.env.example');

  logBright('\n🔍 Environment Configuration Validator', 'cyan');
  log('=====================================', 'cyan');

  // Check if .env file exists
  if (!fs.existsSync(envPath)) {
    log('\n❌ Error: .env file not found!', 'red');

    if (fs.existsSync(envExamplePath)) {
      log('\n💡 Quick fix:', 'yellow');
      log('   cp .env.example .env', 'cyan');
      log('   # Then edit .env with your actual values', 'cyan');
    }
    process.exit(1);
  }

  // Load environment variables
  require('dotenv').config();
  const env = process.env.NODE_ENV || 'development';

  log(`\n📊 Validation Report for: ${env}`, 'blue');
  log('================================', 'blue');

  let errors = [];
  let warnings = [];
  let passed = [];

  // Check required variables
  const required = [...requiredVars.all, ...(requiredVars[env] || [])];

  log('\n✅ Required Variables:', 'green');
  required.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      errors.push(`Missing required variable: ${varName}`);
      log(`   ❌ ${varName}: NOT SET`, 'red');
    } else {
      // Validate URL format if applicable
      if (urlPatterns[varName] && !urlPatterns[varName].test(value)) {
        warnings.push(`${varName} may have invalid format`);
        log(`   ⚠️  ${varName}: INVALID FORMAT`, 'yellow');
      } else {
        passed.push(varName);
        // Don't log secret values
        if (secretVars.includes(varName)) {
          log(`   ✅ ${varName}: SET (hidden)`, 'green');
        } else {
          log(`   ✅ ${varName}: ${value}`, 'green');
        }
      }
    }
  });

  // Check recommended variables
  log('\n💡 Recommended Variables:', 'yellow');
  recommendedVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      warnings.push(`Recommended variable not set: ${varName}`);
      log(`   ⚠️  ${varName}: NOT SET`, 'yellow');
    } else {
      passed.push(varName);
      if (secretVars.includes(varName)) {
        log(`   ✅ ${varName}: SET (hidden)`, 'green');
      } else {
        log(`   ✅ ${varName}: ${value}`, 'green');
      }
    }
  });

  // Security checks
  log('\n🔐 Security Validation:', 'magenta');

  // Check for localhost URLs in production
  if (env === 'production') {
    ['NEXT_PUBLIC_SITE_URL', 'NEXT_PUBLIC_N8N_WEBHOOK_URL'].forEach(varName => {
      const value = process.env[varName];
      if (value && (value.includes('localhost') || value.includes('127.0.0.1'))) {
        errors.push(`Production environment should not use localhost URLs: ${varName}`);
        log(`   ❌ ${varName}: Contains localhost in production`, 'red');
      }
    });
  }

  // Check for NEXT_PUBLIC_ variables with sensitive content
  Object.keys(process.env).forEach(key => {
    if (key.startsWith('NEXT_PUBLIC_')) {
      const value = process.env[key];
      if (value && (value.includes('password') || value.includes('secret') || value.includes('key'))) {
        if (!key.includes('URL') && !key.includes('ID')) {
          warnings.push(`NEXT_PUBLIC_ variable may contain sensitive data: ${key}`);
          log(`   ⚠️  ${key}: May contain sensitive data`, 'yellow');
        }
      }
    }
  });

  // Summary
  log('\n📋 Validation Summary:', 'bright');
  log('===================', 'bright');
  log(`✅ Passed: ${passed.length}`, 'green');
  log(`⚠️  Warnings: ${warnings.length}`, 'yellow');
  log(`❌ Errors: ${errors.length}`, 'red');

  if (errors.length > 0) {
    log('\n🚨 Critical Issues:', 'red');
    errors.forEach(error => log(`   • ${error}`, 'red'));
  }

  if (warnings.length > 0) {
    log('\n⚠️  Warnings:', 'yellow');
    warnings.forEach(warning => log(`   • ${warning}`, 'yellow'));
  }

  // Environment-specific guidance
  if (env === 'development') {
    log('\n🛠️  Development Tips:', 'cyan');
    log('   • Use localhost URLs for testing', 'cyan');
    log('   • Set DEBUG=ignite:* for detailed logs', 'cyan');
    log('   • Use test API keys when possible', 'cyan');
  } else if (env === 'production') {
    log('\n🚀 Production Checklist:', 'cyan');
    log('   • All URLs use HTTPS', 'cyan');
    log('   • API keys are production-ready', 'cyan');
    log('   • Sensitive data not in NEXT_PUBLIC_* variables', 'cyan');
    log('   • Environment variables set in deployment platform', 'cyan');
  }

  log('\n📚 For help: docs/ENVIRONMENT_SETUP.md\n', 'cyan');

  // Exit with error code if there are critical issues
  if (errors.length > 0) {
    process.exit(1);
  }
}

// Install dotenv if not available
try {
  require('dotenv');
} catch (e) {
  log('Installing dotenv dependency...', 'yellow');
  require('child_process').execSync('npm install dotenv', { stdio: 'inherit' });
  require('dotenv');
}

checkEnvFile();