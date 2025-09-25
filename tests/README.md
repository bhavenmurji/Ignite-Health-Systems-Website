# Ignite Health Systems - Comprehensive Testing Suite

## Overview

This testing suite provides comprehensive quality assurance for the Ignite Health Systems website, ensuring optimal performance, accessibility, and user experience for healthcare professionals.

## Testing Architecture

```
tests/
├── unit/                    # Unit tests for JavaScript utilities
├── integration/             # Integration tests for API and forms
├── e2e/                     # End-to-end user journey tests
├── accessibility/           # WCAG 2.1 AA compliance tests
├── visual-regression/       # Screenshot comparison tests
├── performance/             # Lighthouse and Core Web Vitals
├── reports/                 # Generated test reports
├── setup/                   # Test configuration files
├── mocks/                   # Mock files and data
└── README.md               # This documentation
```

## Quick Start

### Prerequisites

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests

```bash
# Run all tests
npm run test:all

# Individual test suites
npm run test                 # Unit tests
npm run test:e2e            # End-to-end tests
npm run test:performance    # Performance audits
npm run test:accessibility  # Accessibility tests
npm run test:visual         # Visual regression tests

# Development modes
npm run test:watch          # Watch mode for unit tests
npm run test:e2e:headed     # E2E tests with browser UI
npm run test:coverage       # Generate coverage report
```

## Test Categories

### 1. Unit Tests (`/tests/unit/`)

**Purpose**: Test individual JavaScript functions and utilities in isolation.

**Coverage**:
- ROI Calculator logic and edge cases
- Form validation functions
- Healthcare-specific calculations
- Error handling utilities

**Example**:
```javascript
// Testing ROI calculator with medical practice scenarios
test('should calculate realistic physician time savings', () => {
  const result = calculateROI(25, 12, 5); // 25 patients, 12 min/note, 5 days
  expect(result.savedHours).toBe(10); // 40% of 25 hours
  expect(result.monthlySavings).toBe(8000); // At $200/hour
});
```

### 2. Integration Tests (`/tests/integration/`)

**Purpose**: Test component interactions and API integrations.

**Coverage**:
- Form submission workflows
- ROI calculator updates
- Email notification triggers
- Analytics tracking
- Server error handling

**Healthcare Focus**:
- Practice type validation
- Medical credential handling
- HIPAA-compliant data transmission

### 3. End-to-End Tests (`/tests/e2e/`)

**Purpose**: Test complete user journeys from a physician's perspective.

**Key Scenarios**:
- **Waitlist Registration**: Complete physician onboarding flow
- **ROI Calculator**: Time savings calculation for different practice sizes
- **Mobile Navigation**: Responsive experience on all devices
- **Performance**: Core Web Vitals and loading times

**Healthcare-Specific Tests**:
```javascript
test('physician should complete waitlist signup with medical credentials', async ({ page }) => {
  await page.fill('[name="name"]', 'Dr. Sarah Chen, MD');
  await page.selectOption('[name="practice_type"]', 'family_medicine');
  // ... complete workflow validation
});
```

### 4. Accessibility Tests (`/tests/accessibility/`)

**Purpose**: Ensure WCAG 2.1 AA compliance for healthcare accessibility.

**Focus Areas**:
- Screen reader compatibility
- Keyboard navigation
- Color contrast ratios
- Form accessibility
- Medical information accessibility

**Healthcare Considerations**:
- Alternative formats for medical data
- High contrast mode support
- Voice navigation compatibility
- Disability-friendly form design

### 5. Visual Regression Tests (`/tests/visual-regression/`)

**Purpose**: Prevent UI regressions across different devices and browsers.

**Coverage**:
- Homepage consistency
- Form layouts
- Mobile responsiveness
- Dark mode support
- Print styles

**Responsive Testing**:
- Mobile (375x667) - iPhone SE
- Tablet (768x1024) - iPad
- Desktop (1440x900) - Standard
- Large Desktop (1920x1080) - HD

### 6. Performance Tests (`/tests/performance/`)

**Purpose**: Ensure optimal performance for healthcare professionals on various connections.

**Metrics Tracked**:
- First Contentful Paint (FCP): < 3s
- Largest Contentful Paint (LCP): < 4s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 300ms

**Healthcare-Specific Audits**:
- HIPAA security compliance
- Low-bandwidth optimization (rural areas)
- Mobile performance (busy clinical environments)

## Quality Thresholds

### Coverage Requirements
- **Unit Tests**: 80% statement coverage
- **Integration Tests**: 75% branch coverage
- **E2E Tests**: 100% critical path coverage

### Performance Standards
- **Lighthouse Performance**: ≥90
- **Lighthouse Accessibility**: ≥95
- **Lighthouse SEO**: ≥95
- **Lighthouse Best Practices**: ≥90

### Accessibility Standards
- **WCAG 2.1 AA**: 100% compliance
- **Keyboard Navigation**: Full support
- **Screen Reader**: Complete compatibility
- **Color Contrast**: 4.5:1 minimum ratio

## Healthcare-Specific Testing

### Medical Form Validation
```javascript
// Validate medical license formats
test('should validate medical license numbers', () => {
  const validLicenses = ['MD123456', 'DO-789012', 'NP.456789'];
  validLicenses.forEach(license => {
    expect(validateMedicalLicense(license)).toBe(true);
  });
});
```

### Practice Type Testing
- Family Medicine workflows
- Internal Medicine scenarios
- Pediatrics-specific features
- Direct Primary Care (DPC) flows
- Emergency Medicine requirements

### HIPAA Compliance Testing
- Data encryption verification
- Secure transmission protocols
- Privacy policy compliance
- Audit trail validation

## Continuous Integration

### GitHub Actions Workflow
```yaml
# .github/workflows/qa-testing.yml
name: QA Testing Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:ci
      - run: npm run test:e2e
      - run: npm run test:performance
```

### Quality Gates
- All tests must pass before merge
- Coverage thresholds must be met
- Performance benchmarks must pass
- Accessibility violations block deployment

## Test Data Management

### Mock Data
```javascript
// Healthcare-specific test data
const mockPhysicianData = {
  name: 'Dr. Sarah Chen, MD',
  email: 'sarah.chen@familyclinic.com',
  practice_type: 'family_medicine',
  patients_per_day: 25,
  current_ehr: 'Epic'
};
```

### Environment Configuration
- **Development**: Mock APIs, test data
- **Staging**: Real APIs, sanitized data
- **Production**: Read-only monitoring

## Reporting and Metrics

### Test Reports Generated
- **Jest HTML Report**: Unit and integration test results
- **Playwright Report**: E2E test results with screenshots
- **Lighthouse Report**: Performance and accessibility metrics
- **Coverage Report**: Code coverage analysis

### Quality Dashboard
- Test execution trends
- Performance metrics over time
- Accessibility compliance scores
- Browser compatibility matrix

## Debugging and Troubleshooting

### Common Issues

**Test Failures**:
```bash
# Debug failed tests
npm run test:e2e:headed  # Run E2E with browser UI
npm run test:watch       # Watch mode for unit tests
```

**Performance Issues**:
```bash
# Lighthouse debugging
npm run test:performance -- --help
# Check specific page
node tests/performance/lighthouse-audit.js --url=/specific-page
```

**Visual Regressions**:
```bash
# Update screenshots
npm run test:visual -- --update-snapshots
```

## Contributing to Tests

### Adding New Tests

1. **Unit Tests**: Add to `/tests/unit/`
2. **E2E Tests**: Add to `/tests/e2e/`
3. **Update Documentation**: Update this README

### Test Guidelines

```javascript
/**
 * @test Feature Name
 * @description Clear description of what is being tested
 * @prerequisites What setup is required
 */
describe('Feature Name', () => {
  // Healthcare-specific test scenarios
  it('should handle physician workflow correctly', () => {
    // Test implementation
  });
});
```

### Healthcare Testing Best Practices

1. **Real-World Scenarios**: Test actual physician workflows
2. **Edge Cases**: Handle unusual but possible medical scenarios
3. **Accessibility First**: Ensure all features work with assistive technologies
4. **Performance**: Consider slow network conditions in rural areas
5. **Security**: Always test with HIPAA compliance in mind

## Monitoring and Alerts

### Production Monitoring
- Real User Monitoring (RUM)
- Core Web Vitals tracking
- Error rate monitoring
- Accessibility compliance monitoring

### Alert Thresholds
- Performance degradation > 20%
- Error rate > 1%
- Accessibility violations detected
- Security vulnerability found

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Jest Testing Framework](https://jestjs.io/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/)
- [Healthcare Accessibility Standards](https://www.hhs.gov/civil-rights/for-individuals/disability/index.html)

---

## Support

For questions about the testing suite or to report issues:

- **QA Lead**: Claude Code Testing Agent
- **Documentation**: See individual test files for detailed examples
- **Issues**: Create GitHub issue with `qa-testing` label