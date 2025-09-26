# Ignite Health Systems - Testing Runbook

## Overview

This runbook provides comprehensive guidance for testing the Ignite Health Systems website and its integrated automation workflows. It covers integration testing, load testing, synthetic monitoring, and regression testing procedures.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Test Suite Architecture](#test-suite-architecture)
3. [Integration Testing](#integration-testing)
4. [Load Testing](#load-testing)
5. [Synthetic Monitoring](#synthetic-monitoring)
6. [Regression Testing](#regression-testing)
7. [CI/CD Integration](#cicd-integration)
8. [Troubleshooting](#troubleshooting)
9. [Alert Response](#alert-response)
10. [Maintenance](#maintenance)

## Quick Start

### Prerequisites

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your actual values

# Install k6 for load testing
brew install k6  # macOS
# or
sudo apt-get install k6  # Ubuntu
```

### Environment Variables

```bash
# Required for testing
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/ignite-interest-form
MAILCHIMP_TEST_API_KEY=your-test-api-key
MAILCHIMP_TEST_AUDIENCE_ID=your-test-audience-id
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id

# Optional monitoring
MONITORING_WEBHOOK_URL=https://your-monitoring-webhook.com
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
```

### Run Tests

```bash
# Run all integration tests
npm run test:integration

# Run load tests
npm run test:load

# Start synthetic monitoring
npm run test:monitor

# Run complete test suite
npm run test:all
```

## Test Suite Architecture

### Directory Structure

```
tests/
├── integration/              # Integration test suites
│   ├── full-workflow.test.js # Complete workflow testing
│   └── form-submission.test.js # Form-specific tests
├── load/                     # Load testing configuration
│   ├── stress-test-config.json # K6 configuration
│   └── stress-test-script.js   # K6 test script
├── synthetic/                # Monitoring tests
│   └── monitoring-tests.js   # Continuous monitoring
├── unit/                     # Unit tests
├── e2e/                      # End-to-end tests
└── setup/                    # Test configuration
    └── jest.setup.js
```

### Test Categories

| Test Type | Purpose | Frequency | Duration |
|-----------|---------|-----------|----------|
| Unit | Code logic validation | On commit | < 30s |
| Integration | System component interaction | Pre-deployment | 2-5 min |
| Load | Performance under load | Weekly | 10-60 min |
| E2E | Complete user workflows | Daily | 5-15 min |
| Synthetic | Continuous monitoring | Real-time | Ongoing |

## Integration Testing

### Full Workflow Tests

Location: `tests/integration/full-workflow.test.js`

#### Test Scenarios

1. **100+ Concurrent Form Submissions**
   - Tests system resilience under high load
   - Validates data integrity across concurrent operations
   - Expected: 95% success rate, <5s average response time

2. **Network Failure Recovery**
   - Simulates various network failure scenarios
   - Tests retry mechanisms and exponential backoff
   - Expected: Successful recovery in 75% of scenarios

3. **API Rate Limit Handling**
   - Validates graceful degradation under rate limits
   - Tests backoff strategies
   - Expected: 80% success rate with proper backoff

4. **Data Consistency Validation**
   - Ensures data integrity across all integrated systems
   - Validates Mailchimp, n8n, and Telegram synchronization
   - Expected: 100% data consistency

5. **Cross-System Synchronization**
   - Tests data updates propagation
   - Validates tag and status synchronization
   - Expected: Complete synchronization within 15 seconds

6. **Email Delivery Verification**
   - Validates email automation triggers
   - Tests content accuracy and personalization
   - Expected: 100% delivery rate, correct content

### Running Integration Tests

```bash
# Run specific test suite
npm test -- tests/integration/full-workflow.test.js

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run with specific environment
TEST_ENV=staging npm test
```

### Test Data Management

```bash
# Clean up test data
node scripts/cleanup-test-data.js

# Generate test data
node scripts/generate-test-data.js --count 100

# Verify test environment
node scripts/verify-test-environment.js
```

## Load Testing

### Configuration

Location: `tests/load/stress-test-config.json`

### Test Scenarios

| Scenario | VUs | Duration | Purpose |
|----------|-----|----------|----------|
| Baseline | 10 | 5m | Establish performance baseline |
| Normal Load | 50 | 10m | Expected production traffic |
| Peak Load | 100 | 15m | Peak usage simulation |
| Stress Test | 200 | 20m | Find breaking point |
| Spike Test | 10→200→10 | 9m | Traffic spike handling |
| Volume Test | 75 | 60m | Large data volume |
| Endurance | 30 | 120m | Extended stability |

### Running Load Tests

```bash
# Install k6
brew install k6

# Run specific scenario
k6 run -e TEST_SCENARIO=baseline tests/load/stress-test-script.js

# Run with custom configuration
k6 run -e TEST_ENV=staging -e VUS=50 tests/load/stress-test-script.js

# Generate HTML report
k6 run --out json=results.json tests/load/stress-test-script.js
node scripts/generate-load-report.js results.json
```

### Performance Thresholds

```javascript
// Response time thresholds
const thresholds = {
  'http_req_duration': ['p(95)<2000'],  // 95% under 2s
  'http_req_failed': ['rate<0.05'],     // Error rate < 5%
  'http_reqs': ['rate>20']              // Min 20 RPS
};
```

### Load Test Metrics

- **Response Time**: P50, P90, P95, P99 percentiles
- **Throughput**: Requests per second
- **Error Rate**: Failed requests percentage
- **Virtual Users**: Concurrent user simulation
- **Data Transfer**: Bytes sent/received

## Synthetic Monitoring

### Continuous Monitoring

Location: `tests/synthetic/monitoring-tests.js`

### Monitoring Components

1. **Uptime Monitoring**
   - Frequency: Every 1 minute
   - Endpoints: Homepage, API, webhook
   - Threshold: 99.9% uptime

2. **Performance Monitoring**
   - Frequency: Every 5 minutes
   - Metrics: Response time, throughput
   - Thresholds: <2s response time

3. **End-to-End Testing**
   - Frequency: Every 15 minutes
   - Test: Complete form submission workflow
   - Threshold: 100% success rate

4. **Integration Health**
   - Frequency: Every 30 minutes
   - Systems: Mailchimp, n8n, Telegram
   - Threshold: All integrations healthy

### Starting Monitoring

```bash
# Start production monitoring
node tests/synthetic/monitoring-tests.js production 3600000

# Start staging monitoring
node tests/synthetic/monitoring-tests.js staging

# Monitor with alerts
MONITORING_WEBHOOK_URL=https://alerts.example.com \
node tests/synthetic/monitoring-tests.js production
```

### Monitoring Dashboard

```bash
# Generate monitoring report
node scripts/generate-monitoring-report.js

# Start monitoring dashboard
npm run start:dashboard
```

## Regression Testing

### Automated Regression Suite

```bash
# Run regression tests
npm run test:regression

# Compare against baseline
npm run test:regression -- --baseline=./baselines/v1.0.0.json

# Generate regression report
npm run test:regression -- --report
```

### Visual Regression Testing

```bash
# Take baseline screenshots
npm run test:visual -- --update-baseline

# Run visual comparison
npm run test:visual

# Review visual differences
npm run test:visual -- --review
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run integration tests
        run: npm run test:integration
      - name: Run load tests
        run: npm run test:load
        env:
          TEST_ENV: staging
```

### Pre-deployment Checklist

- [ ] All unit tests passing
- [ ] Integration tests passing (>95% success)
- [ ] Load tests within thresholds
- [ ] Visual regression tests approved
- [ ] Security tests passing
- [ ] Performance benchmarks met

### Post-deployment Verification

```bash
# Verify deployment
node scripts/verify-deployment.js production

# Run smoke tests
npm run test:smoke

# Check monitoring health
node scripts/check-monitoring-health.js
```

## Troubleshooting

### Common Issues

#### Test Failures

1. **Network Timeouts**
   ```bash
   # Increase timeout values
   TEST_TIMEOUT=60000 npm test
   ```

2. **Rate Limiting**
   ```bash
   # Reduce concurrent requests
   CONCURRENT_REQUESTS=5 npm test
   ```

3. **Environment Issues**
   ```bash
   # Verify environment configuration
   node scripts/verify-test-environment.js
   ```

#### Load Test Issues

1. **High Error Rates**
   - Check server capacity
   - Verify rate limiting configuration
   - Review error logs

2. **Poor Performance**
   - Monitor server resources
   - Check database performance
   - Review CDN configuration

#### Monitoring Issues

1. **False Alerts**
   - Adjust alert thresholds
   - Review monitoring frequency
   - Check network connectivity

2. **Missing Alerts**
   - Verify webhook configuration
   - Check alert channel settings
   - Review notification logic

### Debugging Commands

```bash
# Debug test execution
DEBUG=* npm test

# Verbose logging
LOG_LEVEL=debug npm test

# Test specific components
npm test -- --grep "form submission"

# Run single test file
npm test tests/integration/form-submission.test.js
```

### Log Analysis

```bash
# View test logs
tail -f logs/test-execution.log

# Analyze error patterns
grep ERROR logs/test-execution.log | sort | uniq -c

# Monitor performance metrics
grep "response_time" logs/test-execution.log | awk '{print $3}'
```

## Alert Response

### Alert Levels

| Level | Response Time | Actions |
|-------|---------------|----------|
| INFO | 24 hours | Review and document |
| WARNING | 4 hours | Investigate and monitor |
| CRITICAL | 1 hour | Immediate investigation |
| EMERGENCY | 15 minutes | All hands response |

### Response Procedures

#### Performance Degradation

1. **Immediate Actions**
   - Check server health
   - Review recent deployments
   - Monitor error rates

2. **Investigation**
   - Analyze performance metrics
   - Check database performance
   - Review application logs

3. **Resolution**
   - Scale resources if needed
   - Rollback if necessary
   - Apply performance fixes

#### Integration Failures

1. **Immediate Actions**
   - Check integration health
   - Verify API credentials
   - Test connectivity

2. **Investigation**
   - Review integration logs
   - Check rate limiting
   - Verify configuration

3. **Resolution**
   - Restart failed services
   - Update configuration
   - Implement fallback procedures

### Escalation Matrix

| Issue Type | Primary | Secondary | Manager |
|------------|---------|-----------|----------|
| Performance | DevOps Team | Backend Team | Tech Lead |
| Integration | Integration Team | DevOps Team | Product Manager |
| Security | Security Team | DevOps Team | CTO |
| Data Loss | Data Team | Backend Team | CTO |

## Maintenance

### Regular Tasks

#### Daily
- [ ] Review monitoring alerts
- [ ] Check test execution results
- [ ] Monitor performance metrics
- [ ] Verify backup completion

#### Weekly
- [ ] Run comprehensive load tests
- [ ] Update test data
- [ ] Review test coverage
- [ ] Clean up test environments

#### Monthly
- [ ] Review and update test thresholds
- [ ] Analyze performance trends
- [ ] Update test documentation
- [ ] Conduct test environment audit

### Test Environment Maintenance

```bash
# Clean up test data
node scripts/cleanup-test-environments.js

# Update test fixtures
node scripts/update-test-fixtures.js

# Refresh test credentials
node scripts/refresh-test-credentials.js

# Verify test environment health
node scripts/verify-test-environments.js
```

### Performance Baseline Updates

```bash
# Capture new baseline
node scripts/capture-performance-baseline.js

# Compare with previous baseline
node scripts/compare-performance-baseline.js

# Update baseline thresholds
node scripts/update-performance-thresholds.js
```

## Best Practices

### Test Design

1. **Test Independence**: Each test should be able to run independently
2. **Data Isolation**: Use unique test data to avoid conflicts
3. **Clear Assertions**: Test outcomes should be clearly defined
4. **Comprehensive Coverage**: Cover happy path, edge cases, and error scenarios

### Performance Testing

1. **Realistic Load Patterns**: Model actual user behavior
2. **Gradual Ramp-up**: Avoid sudden load spikes in tests
3. **Resource Monitoring**: Monitor system resources during tests
4. **Baseline Comparison**: Compare results against established baselines

### Monitoring

1. **Meaningful Alerts**: Alert on actionable issues only
2. **Appropriate Thresholds**: Set realistic but sensitive thresholds
3. **Alert Fatigue Prevention**: Avoid too many false positives
4. **Comprehensive Coverage**: Monitor all critical system components

## Security Considerations

### Test Data Security

- Use synthetic data for testing
- Avoid production data in test environments
- Implement data masking for sensitive information
- Regular cleanup of test data

### Credential Management

- Use separate credentials for testing
- Rotate test credentials regularly
- Store credentials securely
- Limit test credential permissions

### Network Security

- Test in isolated environments
- Use VPN for accessing test systems
- Implement firewall rules
- Monitor test traffic

## Documentation

### Test Documentation

- Maintain test case documentation
- Document test data requirements
- Keep troubleshooting guides updated
- Document known issues and workarounds

### Runbook Updates

- Review quarterly
- Update after major system changes
- Incorporate lessons learned
- Validate procedures regularly

---

## Support

For questions or issues with this testing runbook:

- **Technical Issues**: Create GitHub issue
- **Urgent Alerts**: Contact on-call engineer
- **Process Questions**: Reach out to QA team
- **Documentation Updates**: Submit pull request

**Last Updated**: 2024-09-26  
**Version**: 1.0.0  
**Maintained by**: Ignite Health Systems QA Team
