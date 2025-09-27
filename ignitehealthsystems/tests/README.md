# Ignite Health Systems Email Testing Suite

Comprehensive Playwright test suite for email signup functionality with auto-spawn capabilities.

## Features

- **Auto-spawn parallel testing** across multiple browsers
- **Email delivery verification** with Gmail/iCloud integration
- **AI personalization validation** for different user roles
- **N8N workflow testing** with webhook simulation
- **Complete signup flow testing** from form to inbox
- **Responsive design testing** across devices
- **Error handling and edge case testing**

## Test Structure

```
tests/
├── e2e/
│   ├── email-signup.spec.ts      # Core signup functionality tests
│   └── email-workflow.spec.ts    # Complete email workflow tests
├── fixtures/
│   └── user-data.ts              # Test user data and configurations
├── utils/
│   ├── email-utils.ts            # Email testing utilities
│   ├── global-setup.ts           # Global test setup
│   └── global-teardown.ts        # Global test cleanup
└── reports/                      # Test execution reports
```

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   npm run test:setup
   ```

2. **Configure email credentials:**
   ```bash
   cp .env.example .env
   # Edit .env with your email credentials
   ```

3. **Run all tests:**
   ```bash
   npm test
   ```

4. **Run specific test suites:**
   ```bash
   npm run test:email       # Email signup tests
   npm run test:workflow    # Complete workflow tests
   npm run test:physician   # Physician-specific tests
   npm run test:investor    # Investor-specific tests
   ```

## Email Configuration

### Gmail Setup (bhavenmurji@gmail.com)
1. Enable 2-factor authentication
2. Generate app-specific password
3. Set `GMAIL_APP_PASSWORD` in `.env`

### iCloud Setup (bhavenmurji@icloud.com)
1. Enable 2-factor authentication
2. Generate app-specific password
3. Set `ICLOUD_PASSWORD` in `.env`

### N8N Integration
1. Set up N8N webhook endpoint
2. Configure `N8N_WEBHOOK_URL` in `.env`
3. Tests will simulate webhook calls

## Test Categories

### 1. Form Validation Tests
- Required field validation
- Email format validation
- Role selection validation
- Input length limits

### 2. Signup Flow Tests
- Physician signup with bhavenmurji@gmail.com
- Investor signup with bhavenmurji@icloud.com
- Form submission handling
- Success state verification

### 3. Email Workflow Tests
- Welcome email delivery
- Newsletter email structure
- AI personalization validation
- Email content verification

### 4. Edge Case Tests
- Duplicate signup handling
- Network error scenarios
- Large input validation
- Rapid submission handling

### 5. Responsive Design Tests
- Mobile device compatibility
- Tablet device compatibility
- Cross-browser functionality

## Parallel Execution

Tests run in parallel across multiple browsers:
- Chrome Desktop (1920x1080)
- Firefox Desktop (1920x1080)
- Safari Desktop (1920x1080)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

```bash
npm run test:parallel    # Run with 4 parallel workers
npm run test:headed      # Run with browser UI visible
npm run test:debug       # Run in debug mode
```

## Email Testing Features

### Welcome Email Validation
- Subject line verification
- Sender verification
- Content personalization check
- Role-specific messaging validation

### AI Personalization Testing
```typescript
// Validates role-specific content
emailUtils.validateAIPersonalization(email, 'physician');
emailUtils.validateAIPersonalization(email, 'investor');
```

### Newsletter Testing
- Unsubscribe link validation
- Content structure verification
- Monthly delivery simulation

## Cleanup and Unsubscribe

Tests automatically handle cleanup:
```typescript
// Before each test
await emailUtils.cleanupTestEmails(user.email);

// After test completion
await emailUtils.cleanupTestEmails(user.email);
```

## Reports and Monitoring

Test results are saved in multiple formats:
- HTML report: `tests/reports/html/index.html`
- JSON results: `tests/reports/results.json`
- JUnit XML: `tests/reports/junit.xml`

View reports:
```bash
npm run test:report
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GMAIL_APP_PASSWORD` | Gmail app-specific password | For Gmail testing |
| `ICLOUD_PASSWORD` | iCloud app-specific password | For iCloud testing |
| `N8N_WEBHOOK_URL` | N8N webhook endpoint | For N8N testing |
| `NODE_ENV` | Environment (test/development) | No |
| `CI` | CI environment flag | No |

## Troubleshooting

### Email Tests Skipping
If email tests are skipped, check:
1. Email credentials in `.env` file
2. App-specific passwords are generated
3. IMAP access is enabled
4. Network connectivity

### Form Not Found
If signup form tests fail:
1. Verify site is accessible
2. Check if form selectors match actual HTML
3. Ensure JavaScript is enabled
4. Check for loading delays

### N8N Integration Issues
If N8N tests fail:
1. Verify N8N is running
2. Check webhook URL configuration
3. Validate API endpoints
4. Review N8N workflow setup

## Performance Expectations

- **Form submission**: < 10 seconds
- **Email delivery**: < 3 minutes
- **Test suite completion**: < 15 minutes
- **Parallel execution**: 2.8-4.4x speed improvement

## Support

For issues with this test suite:
1. Check test reports in `tests/reports/`
2. Review console output for error details
3. Verify environment configuration
4. Test individual components in isolation

## Advanced Features

### Auto-spawn Testing
Tests automatically spawn across multiple browser contexts for comprehensive coverage.

### Email Monitoring
Real-time email delivery monitoring with configurable timeouts.

### AI Content Validation
Automated validation of AI-generated email personalization.

### Cross-platform Testing
Comprehensive testing across desktop and mobile platforms.