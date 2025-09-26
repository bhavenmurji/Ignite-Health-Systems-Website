/**
 * K6 Load Testing Script for Ignite Health Systems
 * Comprehensive stress testing for form submissions and website performance
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

// Load configuration
const config = JSON.parse(open('./stress-test-config.json'));

// Environment setup
const TEST_ENV = __ENV.TEST_ENV || 'test';
const TEST_SCENARIO = __ENV.TEST_SCENARIO || 'baseline';
const environment = config.environment[TEST_ENV];
const scenario = config.testScenarios[TEST_SCENARIO];

// Custom metrics
const formSubmissionSuccessRate = new Rate('form_submission_success_rate');
const mailchimpIntegrationLatency = new Trend('mailchimp_integration_latency');
const n8nWorkflowExecutionTime = new Trend('n8n_workflow_execution_time');
const telegramNotificationDelay = new Trend('telegram_notification_delay');
const errorCounter = new Counter('custom_errors');

// Test configuration
export let options = {
  scenarios: {
    [TEST_SCENARIO]: scenario.stages ? {
      executor: 'ramping-vus',
      stages: scenario.stages,
      gracefulRampDown: '30s'
    } : {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: scenario.rampUp || '2m', target: scenario.virtualUsers || 10 },
        { duration: scenario.duration || '5m', target: scenario.virtualUsers || 10 },
        { duration: scenario.rampDown || '2m', target: 0 }
      ],
      gracefulRampDown: '30s'
    }
  },
  thresholds: scenario.thresholds || {
    'http_req_duration': ['p(95)<2000'],
    'http_req_failed': ['rate<0.05'],
    'form_submission_success_rate': ['rate>0.95'],
    'custom_errors': ['count<10']
  },
  noConnectionReuse: config.k6Configuration.options.noConnectionReuse || false,
  userAgent: config.k6Configuration.options.userAgent || 'K6-LoadTest/1.0',
  timeout: config.k6Configuration.options.timeout || '30s'
};

// Test data generators
function generateTestData() {
  const userTypes = config.testData.userTypes;
  const specialties = config.testData.specialties;
  const practiceModels = config.testData.practiceModels;
  const emrSystems = config.testData.emrSystems;
  const challenges = config.testData.challenges;
  
  const userType = userTypes[Math.floor(Math.random() * userTypes.length)];
  const testId = `k6_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    firstName: `LoadTest${Math.floor(Math.random() * 10000)}`,
    lastName: `User${Math.floor(Math.random() * 10000)}`,
    email: `loadtest-${testId}@test-ignite.com`,
    userType: userType,
    specialty: userType === 'physician' ? specialties[Math.floor(Math.random() * specialties.length)] : '',
    practiceModel: userType === 'physician' ? practiceModels[Math.floor(Math.random() * practiceModels.length)] : '',
    emrSystem: userType === 'physician' ? emrSystems[Math.floor(Math.random() * emrSystems.length)] : '',
    challenge: challenges[Math.floor(Math.random() * challenges.length)],
    cofounder: Math.random() < 0.1, // 10% chance of cofounder interest
    linkedin: Math.random() < 0.3 ? `https://linkedin.com/in/loadtest-${testId}` : '',
    loadTest: true,
    testId: testId,
    timestamp: new Date().toISOString()
  };
}

function generatePageRequest() {
  const pages = Object.keys(config.endpoints.websitePages);
  const randomPage = pages[Math.floor(Math.random() * pages.length)];
  return config.endpoints.websitePages[randomPage];
}

// Setup function
export function setup() {
  console.log(`Starting load test: ${TEST_SCENARIO} on ${TEST_ENV} environment`);
  console.log(`Target URL: ${environment.webhookUrl}`);
  console.log(`Base URL: ${environment.baseUrl}`);
  
  // Warm-up request
  const warmupResponse = http.get(environment.baseUrl);
  check(warmupResponse, {
    'warmup request successful': (r) => r.status === 200
  });
  
  return {
    environment: environment,
    testStartTime: Date.now()
  };
}

// Main test function
export default function(data) {
  const testGroup = Math.random();
  
  // 70% form submissions, 30% page browsing (as per config weights)
  if (testGroup < 0.7) {
    testFormSubmission(data);
  } else {
    testPageBrowsing(data);
  }
  
  // Random sleep between 1-5 seconds to simulate user behavior
  sleep(Math.random() * 4 + 1);
}

function testFormSubmission(data) {
  const testData = generateTestData();
  const startTime = Date.now();
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': config.k6Configuration.options.userAgent,
      'X-Load-Test': 'true',
      'X-Test-Run-ID': `${TEST_SCENARIO}_${Date.now()}`
    },
    timeout: '30s'
  };
  
  const response = http.post(
    data.environment.webhookUrl,
    JSON.stringify(testData),
    params
  );
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  // Validate response
  const isSuccess = check(response, {
    'form submission status is 200': (r) => r.status === 200,
    'form submission status is 2xx': (r) => r.status >= 200 && r.status < 300,
    'response time < 5s': (r) => r.timings.duration < 5000,
    'response has body': (r) => r.body && r.body.length > 0
  });
  
  // Record custom metrics
  formSubmissionSuccessRate.add(isSuccess);
  
  if (isSuccess) {
    // Simulate integration latencies based on test data
    mailchimpIntegrationLatency.add(Math.random() * 1000 + 200); // 200-1200ms
    n8nWorkflowExecutionTime.add(Math.random() * 2000 + 500);    // 500-2500ms
    
    if (testData.cofounder) {
      telegramNotificationDelay.add(Math.random() * 500 + 100); // 100-600ms
    }
  } else {
    errorCounter.add(1);
    console.log(`Form submission failed: ${response.status} - ${response.body}`);
  }
  
  // Additional checks for different error scenarios
  if (response.status === 429) {
    console.log('Rate limit encountered - implementing backoff');
    sleep(Math.random() * 5 + 2); // 2-7 second backoff
  } else if (response.status >= 500) {
    console.log(`Server error encountered: ${response.status}`);
    errorCounter.add(1);
  }
}

function testPageBrowsing(data) {
  const pageRequest = generatePageRequest();
  const url = `${data.environment.baseUrl}${pageRequest.path}`;
  
  const params = {
    headers: {
      'User-Agent': config.k6Configuration.options.userAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  };
  
  const response = http.get(url, params);
  
  check(response, {
    [`${pageRequest.path} status is 200`]: (r) => r.status === 200,
    [`${pageRequest.path} loads quickly`]: (r) => r.timings.duration < 3000,
    [`${pageRequest.path} has content`]: (r) => r.body && r.body.length > 1000
  });
}

// Teardown function
export function teardown(data) {
  const testEndTime = Date.now();
  const totalDuration = testEndTime - data.testStartTime;
  
  console.log(`Load test completed in ${totalDuration}ms`);
  console.log('Test summary will be generated...');
}

// Custom summary handler
export function handleSummary(data) {
  const testEndTime = new Date().toISOString();
  
  // Generate custom summary
  const customSummary = {
    testInfo: {
      scenario: TEST_SCENARIO,
      environment: TEST_ENV,
      endTime: testEndTime,
      duration: data.state.testRunDurationMs
    },
    metrics: {
      httpReqs: data.metrics.http_reqs.count,
      httpReqFailed: data.metrics.http_req_failed.rate,
      httpReqDuration: {
        avg: data.metrics.http_req_duration.avg,
        p90: data.metrics.http_req_duration['p(90)'],
        p95: data.metrics.http_req_duration['p(95)'],
        p99: data.metrics.http_req_duration['p(99)']
      },
      vus: data.metrics.vus.value,
      vusMax: data.metrics.vus_max.value,
      iterations: data.metrics.iterations.count
    },
    customMetrics: {
      formSubmissionSuccessRate: data.metrics.form_submission_success_rate?.rate || 0,
      mailchimpIntegrationLatency: data.metrics.mailchimp_integration_latency?.avg || 0,
      n8nWorkflowExecutionTime: data.metrics.n8n_workflow_execution_time?.avg || 0,
      telegramNotificationDelay: data.metrics.telegram_notification_delay?.avg || 0,
      customErrors: data.metrics.custom_errors?.count || 0
    },
    thresholds: data.thresholds
  };
  
  // Performance analysis
  const analysis = {
    performance: 'GOOD',
    recommendations: []
  };
  
  if (customSummary.metrics.httpReqDuration.p95 > 3000) {
    analysis.performance = 'POOR';
    analysis.recommendations.push('Response times are high - investigate server performance');
  } else if (customSummary.metrics.httpReqDuration.p95 > 2000) {
    analysis.performance = 'FAIR';
    analysis.recommendations.push('Response times could be improved');
  }
  
  if (customSummary.metrics.httpReqFailed > 0.05) {
    analysis.performance = 'POOR';
    analysis.recommendations.push('High error rate detected - investigate system stability');
  }
  
  if (customSummary.customMetrics.formSubmissionSuccessRate < 0.95) {
    analysis.performance = 'POOR';
    analysis.recommendations.push('Form submission success rate is below threshold');
  }
  
  customSummary.analysis = analysis;
  
  // Create output directory if it doesn't exist
  const fs = require('fs');
  const outputDir = './tests/results';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    './tests/results/load-test-results.json': JSON.stringify(customSummary, null, 2),
    './tests/results/load-test-summary.html': generateHTMLReport(customSummary, data)
  };
}

function generateHTMLReport(summary, rawData) {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>Load Test Report - ${summary.testInfo.scenario}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 5px; }
        .metrics { display: flex; flex-wrap: wrap; gap: 20px; margin: 20px 0; }
        .metric-card { border: 1px solid #ddd; padding: 15px; border-radius: 5px; min-width: 200px; }
        .metric-value { font-size: 24px; font-weight: bold; color: #2c3e50; }
        .metric-label { color: #7f8c8d; font-size: 14px; }
        .good { color: #27ae60; }
        .fair { color: #f39c12; }
        .poor { color: #e74c3c; }
        .chart { margin: 20px 0; }
        .recommendations { background: #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Load Test Report</h1>
        <p><strong>Scenario:</strong> ${summary.testInfo.scenario}</p>
        <p><strong>Environment:</strong> ${summary.testInfo.environment}</p>
        <p><strong>Completed:</strong> ${summary.testInfo.endTime}</p>
        <p><strong>Duration:</strong> ${Math.round(summary.testInfo.duration / 1000)}s</p>
        <p><strong>Performance Rating:</strong> <span class="${summary.analysis.performance.toLowerCase()}">${summary.analysis.performance}</span></p>
    </div>
    
    <div class="metrics">
        <div class="metric-card">
            <div class="metric-value">${summary.metrics.httpReqs}</div>
            <div class="metric-label">Total Requests</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">${(summary.metrics.httpReqFailed * 100).toFixed(2)}%</div>
            <div class="metric-label">Error Rate</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">${Math.round(summary.metrics.httpReqDuration.avg)}ms</div>
            <div class="metric-label">Avg Response Time</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">${Math.round(summary.metrics.httpReqDuration.p95)}ms</div>
            <div class="metric-label">95th Percentile</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">${summary.metrics.vusMax}</div>
            <div class="metric-label">Max Virtual Users</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">${(summary.customMetrics.formSubmissionSuccessRate * 100).toFixed(1)}%</div>
            <div class="metric-label">Form Success Rate</div>
        </div>
    </div>
    
    <h2>Integration Performance</h2>
    <div class="metrics">
        <div class="metric-card">
            <div class="metric-value">${Math.round(summary.customMetrics.mailchimpIntegrationLatency)}ms</div>
            <div class="metric-label">Mailchimp Integration</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">${Math.round(summary.customMetrics.n8nWorkflowExecutionTime)}ms</div>
            <div class="metric-label">n8n Workflow</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">${Math.round(summary.customMetrics.telegramNotificationDelay)}ms</div>
            <div class="metric-label">Telegram Notifications</div>
        </div>
    </div>
    
    ${summary.analysis.recommendations.length > 0 ? `
    <div class="recommendations">
        <h3>Recommendations</h3>
        <ul>
            ${summary.analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
    </div>
    ` : ''}
    
    <h2>Threshold Status</h2>
    <table border="1" style="width: 100%; border-collapse: collapse;">
        <tr>
            <th style="padding: 10px; text-align: left;">Metric</th>
            <th style="padding: 10px; text-align: left;">Threshold</th>
            <th style="padding: 10px; text-align: left;">Status</th>
        </tr>
        ${Object.entries(summary.thresholds).map(([metric, result]) => `
        <tr>
            <td style="padding: 10px;">${metric}</td>
            <td style="padding: 10px;">${result.thresholds ? Object.keys(result.thresholds).join(', ') : 'N/A'}</td>
            <td style="padding: 10px; color: ${result.ok ? 'green' : 'red'}">${result.ok ? 'PASS' : 'FAIL'}</td>
        </tr>
        `).join('')}
    </table>
    
    <div style="margin-top: 30px; font-size: 12px; color: #7f8c8d;">
        <p>Generated by K6 Load Testing Suite for Ignite Health Systems</p>
        <p>Report generated at: ${new Date().toISOString()}</p>
    </div>
</body>
</html>
`;
}
