#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Environment Configuration Validator
 * Validates environment variables for Ignite Health Systems Website
 */

const colors = {
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  bold: '\x1b[1m',
  reset: '\x1b[0m'
};

const log = {
  info: (msg) => console.log(`${colors.cyan}${msg}${colors.reset}`),
  error: (msg) => console.error(`${colors.red}${msg}${colors.reset}`),
  warn: (msg) => console.warn(`${colors.yellow}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}${msg}${colors.reset}`),
  title: (msg) => console.log(`${colors.cyan}${colors.bold}\n${msg}${colors.reset}`)
};

function validateEnvironment() {
  log.title('🔍 Environment Configuration Validator');
  log.info('=====================================');

  const envPath = path.join(process.cwd(), '.env');
  const envExamplePath = path.join(process.cwd(), '.env.example');

  // Check if .env file exists
  if (!fs.existsSync(envPath)) {
    // In CI/CD, we may not have a .env file - check environment variables directly
    if (process.env.CI || process.env.GITHUB_ACTIONS) {
      log.info('✅ CI/CD environment detected - checking environment variables directly');
      return validateCIEnvironment();
    }

    log.error('\n❌ Error: .env file not found!');

    if (fs.existsSync(envExamplePath)) {
      log.warn('\n💡 Quick fix:');
      log.info('   cp .env.example .env');
      log.info('   # Then edit .env with your actual values');
    }

    process.exit(1);
  }

  // Load and validate .env file
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envVars = parseEnvFile(envContent);

  return validateEnvironmentVariables(envVars);
}

function validateCIEnvironment() {
  log.info('🔧 Validating CI/CD environment variables...');

  const requiredVars = [
    'NODE_ENV'
  ];

  const optionalVars = [
    'NEXT_PUBLIC_N8N_WEBHOOK_URL',
    'NEXT_PUBLIC_SITE_URL'
  ];

  let hasErrors = false;

  // Check required variables
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      log.error(`❌ Missing required environment variable: ${varName}`);
      hasErrors = true;
    } else {
      log.success(`✅ ${varName}: ${process.env[varName]}`);
    }
  }

  // Check optional variables (warn if missing)
  for (const varName of optionalVars) {
    if (!process.env[varName]) {
      log.warn(`⚠️  Optional environment variable not set: ${varName}`);
    } else {
      log.success(`✅ ${varName}: ${process.env[varName]}`);
    }
  }

  if (hasErrors) {
    log.error('\n❌ Environment validation failed in CI/CD');
    process.exit(1);
  }

  log.success('\n✅ CI/CD environment validation passed');
  return true;
}

function parseEnvFile(content) {
  const vars = {};
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        vars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  }

  return vars;
}

function validateEnvironmentVariables(envVars) {
  log.info('🔧 Validating environment variables...');

  const validations = [
    {
      key: 'NODE_ENV',
      required: true,
      validate: (value) => ['development', 'production', 'test'].includes(value),
      message: 'Must be one of: development, production, test'
    },
    {
      key: 'NEXT_PUBLIC_SITE_URL',
      required: false,
      validate: (value) => !value || value.startsWith('http'),
      message: 'Must be a valid HTTP(S) URL'
    },
    {
      key: 'NEXT_PUBLIC_N8N_WEBHOOK_URL',
      required: false,
      validate: (value) => !value || value.startsWith('http'),
      message: 'Must be a valid HTTP(S) URL'
    }
  ];

  let hasErrors = false;
  let hasWarnings = false;

  for (const validation of validations) {
    const value = envVars[validation.key];

    if (validation.required && !value) {
      log.error(`❌ Missing required variable: ${validation.key}`);
      hasErrors = true;
      continue;
    }

    if (!validation.required && !value) {
      log.warn(`⚠️  Optional variable not set: ${validation.key}`);
      hasWarnings = true;
      continue;
    }

    if (value && !validation.validate(value)) {
      log.error(`❌ Invalid value for ${validation.key}: ${validation.message}`);
      hasErrors = true;
      continue;
    }

    log.success(`✅ ${validation.key}: ${value || 'not set (optional)'}`);
  }

  if (hasErrors) {
    log.error('\n❌ Environment validation failed');
    process.exit(1);
  }

  if (hasWarnings) {
    log.warn('\n⚠️  Environment validation completed with warnings');
  } else {
    log.success('\n✅ Environment validation passed');
  }

  return true;
}

// Security check for production
function checkSecurityConfiguration() {
  if (process.env.NODE_ENV === 'production') {
    log.info('\n🔒 Running production security checks...');

    const securityChecks = [
      {
        check: () => process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.startsWith('https://'),
        message: 'HTTPS required in production',
        critical: true
      }
    ];

    let hasSecurityIssues = false;

    for (const check of securityChecks) {
      if (!check.check()) {
        if (check.critical) {
          log.error(`❌ Security issue: ${check.message}`);
          hasSecurityIssues = true;
        } else {
          log.warn(`⚠️  Security warning: ${check.message}`);
        }
      }
    }

    if (hasSecurityIssues) {
      log.error('\n❌ Security validation failed');
      process.exit(1);
    }

    log.success('✅ Security checks passed');
  }
}

// Run validation
try {
  validateEnvironment();
  checkSecurityConfiguration();
  log.success('\n🎉 All validations passed successfully!');
} catch (error) {
  log.error(`\n💥 Validation error: ${error.message}`);
  process.exit(1);
}