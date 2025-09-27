# 🚀 Ignite Health Systems Email Testing Setup

Comprehensive Playwright test suite for automated email signup testing with auto-spawn capabilities.

## Quick Start

### 1. Install Dependencies & Browsers
```bash
npm install
npm run test:setup
```

### 2. Configure Email Testing (Optional)
```bash
cp .env.example .env
# Edit .env with your email credentials for full email testing
```

### 3. Run Tests
```bash
# Run all email tests
npm run test:e2e

# Run specific test suites
npm run test:email      # Signup form tests
npm run test:workflow   # Complete email workflow
npm run test:physician  # Physician-specific tests
npm run test:investor   # Investor-specific tests

# Run with browser UI (helpful for debugging)
npm run test:e2e:headed

# Parallel execution (faster)
npm run test:parallel
```

## 📧 Email Testing Configuration

### For Gmail Testing (bhavenmurji@gmail.com)
1. Enable 2-factor authentication on Gmail
2. Go to Google Account settings > Security > App passwords
3. Generate app password for "Mail"
4. Add to `.env`:
   ```
   GMAIL_USER=bhavenmurji@gmail.com
   GMAIL_APP_PASSWORD=your_16_character_app_password
   ```

### For iCloud Testing (bhavenmurji@icloud.com)
1. Enable 2-factor authentication on iCloud
2. Go to Apple ID settings > Sign-In and Security > App-Specific Passwords
3. Generate password for "Email Testing"
4. Add to `.env`:
   ```
   ICLOUD_USER=bhavenmurji@icloud.com
   ICLOUD_PASSWORD=your_app_specific_password
   ```

### For N8N Integration Testing
```
N8N_WEBHOOK_URL=http://localhost:5678/webhook/signup
N8N_API_KEY=your_n8n_api_key
```

## 🧪 Test Features

### ✅ Form Validation Testing
- Required field validation
- Email format validation
- Role selection testing
- Input length limits
- Cross-browser compatibility

### ✅ Signup Flow Testing
- **Physician signup** with bhavenmurji@gmail.com
- **Investor signup** with bhavenmurji@icloud.com
- Form submission handling
- Success state verification
- Duplicate signup handling

### ✅ Email Workflow Testing
- Welcome email delivery verification
- Email content validation
- AI personalization checking
- Newsletter email structure
- Unsubscribe functionality

### ✅ Auto-spawn Parallel Testing
- Chrome Desktop (1920x1080)
- Firefox Desktop (1920x1080)
- Safari Desktop (1920x1080)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

### ✅ Advanced Testing
- Network error simulation
- Edge case input validation
- Performance testing
- Responsive design verification
- Load testing with rapid submissions

## 📊 Test Reports

After running tests, view detailed reports:
```bash
npm run test:report
```

Reports are generated in multiple formats:
- **HTML Report**: `tests/reports/html/index.html`
- **JSON Results**: `tests/reports/results.json`
- **JUnit XML**: `tests/reports/junit.xml`

## 🏃‍♂️ Running Specific Tests

```bash
# Test form validation only
npm run test:e2e -- --grep="Form Validation"

# Test email workflows only
npm run test:e2e -- --grep="Email Workflow"

# Test responsive design
npm run test:e2e -- --grep="Responsive"

# Test error handling
npm run test:e2e -- --grep="Error Handling"

# Debug mode (step through tests)
npm run test:e2e:debug

# Interactive UI mode
npm run test:ui
```

## 🔧 Troubleshooting

### Tests Failing?
1. **Check site accessibility**: Verify https://ignitehealthsystems.com is accessible
2. **Verify form selectors**: Ensure signup form has correct ID (#signup)
3. **Check dependencies**: Run `npm install` to ensure all packages are installed
4. **Browser issues**: Run `npm run test:setup` to reinstall browsers

### Email Tests Skipping?
1. **Email credentials**: Verify `.env` file has correct app-specific passwords
2. **IMAP access**: Ensure IMAP is enabled for both Gmail and iCloud
3. **Network connectivity**: Check internet connection and firewall settings
4. **Email delays**: Email delivery can take 1-3 minutes

### Form Not Found?
1. **Loading delays**: Site might take time to load signup form
2. **JavaScript required**: Ensure browsers have JavaScript enabled
3. **CSS selectors**: Form selectors might have changed
4. **Network issues**: Check if site is accessible

## 📈 Performance Expectations

- **Form submission**: < 10 seconds
- **Email delivery**: < 3 minutes
- **Test suite completion**: < 15 minutes
- **Parallel execution**: 2.8-4.4x speed improvement

## 🎯 Test Scenarios Covered

### Core Functionality
- [x] Form field validation
- [x] Email format validation
- [x] Role selection (physician, nurse, administrator, other)
- [x] Form submission
- [x] Success handling

### Email Testing
- [x] Physician welcome email (bhavenmurji@gmail.com)
- [x] Investor welcome email (bhavenmurji@icloud.com)
- [x] AI personalization validation
- [x] Email content verification
- [x] Newsletter structure testing

### Edge Cases
- [x] Duplicate signup handling
- [x] Network error simulation
- [x] Large input validation
- [x] Rapid submission testing
- [x] Mobile responsiveness

### N8N Integration
- [x] Webhook simulation
- [x] API endpoint testing
- [x] Email automation workflow
- [x] Error handling

## 🚀 Advanced Usage

### Running Tests in CI/CD
```bash
# Set environment variables
export CI=true
export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=false

# Install dependencies
npm ci
npm run test:setup

# Run tests with specific configuration
npm run test:e2e -- --workers=1 --reporter=junit
```

### Custom Test Configuration
Edit `playwright.config.ts` to customize:
- Browser selection
- Viewport sizes
- Timeout settings
- Reporter options
- Retry logic

### Email Testing Without Credentials
Tests will automatically skip email verification if credentials are not provided:
```bash
# Run tests without email credentials
unset GMAIL_APP_PASSWORD
unset ICLOUD_PASSWORD
npm run test:e2e
```

## 📞 Support

For issues with the testing suite:
1. Check test reports in `tests/reports/`
2. Review console output for detailed errors
3. Verify environment configuration in `.env`
4. Test individual components in isolation

## 🎉 Next Steps

Once tests are running successfully:
1. **Integrate with CI/CD**: Add tests to your deployment pipeline
2. **Schedule regular runs**: Set up automated email testing
3. **Monitor email delivery**: Track email performance over time
4. **Expand test coverage**: Add more user scenarios and edge cases

---

**Ready to test!** 🧪 Run `npm run test:e2e` to start your comprehensive email testing suite.