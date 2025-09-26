#!/usr/bin/env node

/**
 * Comprehensive Test Runner for Mailchimp Automation Testing
 * Orchestrates all test suites with reporting and CI/CD integration
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class TestRunner {
  constructor() {
    this.testSuites = [
      {
        name: 'Unit Tests',
        command: 'jest tests/unit --config=tests/jest.config.js',
        timeout: 300000, // 5 minutes
        critical: true
      },
      {
        name: 'Integration Tests',
        command: 'jest tests/integration --config=tests/jest.config.js',
        timeout: 600000, // 10 minutes
        critical: true
      },
      {
        name: 'E2E Tests',
        command: 'jest tests/e2e --config=tests/jest.config.js',
        timeout: 900000, // 15 minutes
        critical: true
      },
      {
        name: 'Scenario Tests',
        command: 'jest tests/scenarios --config=tests/jest.config.js',
        timeout: 600000, // 10 minutes
        critical: true
      },
      {
        name: 'Performance Tests',
        command: 'jest tests/performance --config=tests/jest.config.js',
        timeout: 1200000, // 20 minutes
        critical: false
      },
      {
        name: 'Security Tests',
        command: 'jest tests/security --config=tests/jest.config.js',
        timeout: 900000, // 15 minutes
        critical: true
      }
    ];

    this.results = {
      totalSuites: this.testSuites.length,
      passed: 0,
      failed: 0,
      skipped: 0,
      startTime: null,
      endTime: null,
      duration: 0,
      suiteResults: []
    };

    this.config = {
      continueOnFailure: process.env.CONTINUE_ON_FAILURE === 'true',
      parallel: process.env.RUN_PARALLEL === 'true',
      skipNonCritical: process.env.SKIP_NON_CRITICAL === 'true',
      generateReport: process.env.GENERATE_REPORT !== 'false',
      reportPath: process.env.REPORT_PATH || './test-reports',
      ciMode: process.env.CI === 'true'
    };
  }

  async run() {
    console.log('🚀 Starting Mailchimp Automation Test Suite');
    console.log('=' .repeat(60));

    this.results.startTime = new Date();

    try {
      // Setup test environment
      await this.setupEnvironment();

      // Run test suites
      if (this.config.parallel) {
        await this.runParallel();
      } else {
        await this.runSequential();
      }

      // Generate reports
      if (this.config.generateReport) {
        await this.generateReports();
      }

      // Display results
      this.displayResults();

      // Exit with appropriate code
      process.exit(this.results.failed > 0 ? 1 : 0);

    } catch (error) {
      console.error('❌ Test runner failed:', error.message);
      process.exit(1);
    } finally {
      this.results.endTime = new Date();
      this.results.duration = this.results.endTime - this.results.startTime;

      // Cleanup
      await this.cleanup();
    }
  }

  async setupEnvironment() {
    console.log('🔧 Setting up test environment...');

    // Create test directories
    const testDirs = [
      './test-reports',
      './test-reports/coverage',
      './test-reports/junit',
      './test-reports/screenshots'
    ];

    testDirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Set test environment variables
    process.env.NODE_ENV = 'test';
    process.env.USE_MOCK_MAILCHIMP = 'true';
    process.env.USE_MOCK_WEBHOOK = 'true';

    // Validate required dependencies
    await this.validateDependencies();

    console.log('✅ Test environment ready');
  }

  async validateDependencies() {
    const requiredDeps = [
      'jest',
      '@playwright/test',
      'faker'
    ];

    for (const dep of requiredDeps) {
      try {
        require.resolve(dep);
      } catch (error) {
        throw new Error(`Missing required dependency: ${dep}`);
      }
    }
  }

  async runSequential() {
    console.log('📋 Running test suites sequentially...\n');

    for (const suite of this.testSuites) {
      if (this.config.skipNonCritical && !suite.critical) {
        console.log(`⏭️ Skipping non-critical suite: ${suite.name}`);
        this.results.skipped++;
        continue;
      }

      const result = await this.runSuite(suite);

      if (!result.success && suite.critical && !this.config.continueOnFailure) {
        console.log(`💥 Critical test suite failed: ${suite.name}`);
        console.log('Stopping execution due to critical failure');
        break;
      }
    }
  }

  async runParallel() {
    console.log('⚡ Running test suites in parallel...\n');

    // Filter suites based on configuration
    const suitesToRun = this.testSuites.filter(suite =>
      !this.config.skipNonCritical || suite.critical
    );

    const promises = suitesToRun.map(suite => this.runSuite(suite));
    const results = await Promise.allSettled(promises);

    // Process results
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`❌ Suite ${suitesToRun[index].name} failed with error:`, result.reason);
      }
    });
  }

  async runSuite(suite) {
    const startTime = new Date();

    console.log(`🧪 Running: ${suite.name}`);
    console.log(`   Command: ${suite.command}`);
    console.log(`   Timeout: ${suite.timeout / 1000}s`);

    const result = {
      name: suite.name,
      command: suite.command,
      critical: suite.critical,
      startTime,
      endTime: null,
      duration: 0,
      success: false,
      exitCode: null,
      stdout: '',
      stderr: '',
      coverage: null
    };

    try {
      const output = await this.executeCommand(suite.command, suite.timeout);

      result.success = output.exitCode === 0;
      result.exitCode = output.exitCode;
      result.stdout = output.stdout;
      result.stderr = output.stderr;

      if (result.success) {
        console.log(`✅ ${suite.name} passed`);
        this.results.passed++;
      } else {
        console.log(`❌ ${suite.name} failed (exit code: ${output.exitCode})`);
        this.results.failed++;

        if (output.stderr) {
          console.log(`   Error: ${output.stderr.slice(0, 200)}...`);
        }
      }

    } catch (error) {
      console.log(`💥 ${suite.name} crashed: ${error.message}`);
      result.success = false;
      result.stderr = error.message;
      this.results.failed++;
    } finally {
      result.endTime = new Date();
      result.duration = result.endTime - startTime;
      this.results.suiteResults.push(result);
    }

    console.log(`   Duration: ${(result.duration / 1000).toFixed(2)}s\n`);

    return result;
  }

  executeCommand(command, timeout) {
    return new Promise((resolve, reject) => {
      const child = spawn('npx', command.split(' ').slice(1), {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      const timer = setTimeout(() => {
        child.kill('SIGKILL');
        reject(new Error(`Command timed out after ${timeout / 1000}s`));
      }, timeout);

      child.on('close', (code) => {
        clearTimeout(timer);
        resolve({
          exitCode: code,
          stdout,
          stderr
        });
      });

      child.on('error', (error) => {
        clearTimeout(timer);
        reject(error);
      });
    });
  }

  async generateReports() {
    console.log('📊 Generating test reports...');

    // Generate JSON report
    const jsonReport = {
      summary: this.results,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        timestamp: new Date().toISOString(),
        ciMode: this.config.ciMode
      },
      suites: this.results.suiteResults
    };

    fs.writeFileSync(
      path.join(this.config.reportPath, 'test-results.json'),
      JSON.stringify(jsonReport, null, 2)
    );

    // Generate HTML report
    await this.generateHtmlReport(jsonReport);

    // Generate JUnit XML (for CI integration)
    await this.generateJunitReport(jsonReport);

    // Generate coverage report
    await this.generateCoverageReport();

    console.log('✅ Reports generated');
  }

  async generateHtmlReport(data) {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Mailchimp Automation Test Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #eee;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .metric {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border-left: 4px solid #007bff;
        }
        .metric.passed { border-left-color: #28a745; }
        .metric.failed { border-left-color: #dc3545; }
        .metric.skipped { border-left-color: #ffc107; }
        .metric h3 { margin: 0; font-size: 2em; }
        .metric p { margin: 10px 0 0 0; color: #666; }
        .suite {
            margin-bottom: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
        }
        .suite-header {
            background: #f8f9fa;
            padding: 15px;
            border-bottom: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .suite-name { font-weight: bold; font-size: 1.1em; }
        .suite-status {
            padding: 5px 10px;
            border-radius: 4px;
            color: white;
            font-weight: bold;
        }
        .suite-status.passed { background: #28a745; }
        .suite-status.failed { background: #dc3545; }
        .suite-details { padding: 15px; }
        .suite-command {
            background: #f1f3f4;
            padding: 10px;
            border-radius: 4px;
            font-family: monospace;
            margin: 10px 0;
        }
        .duration { color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Mailchimp Automation Test Report</h1>
            <p>Generated on ${new Date().toLocaleString()}</p>
            <p>Duration: ${(data.summary.duration / 1000 / 60).toFixed(2)} minutes</p>
        </div>

        <div class="summary">
            <div class="metric">
                <h3>${data.summary.totalSuites}</h3>
                <p>Total Suites</p>
            </div>
            <div class="metric passed">
                <h3>${data.summary.passed}</h3>
                <p>Passed</p>
            </div>
            <div class="metric failed">
                <h3>${data.summary.failed}</h3>
                <p>Failed</p>
            </div>
            <div class="metric skipped">
                <h3>${data.summary.skipped}</h3>
                <p>Skipped</p>
            </div>
        </div>

        <h2>Test Suite Results</h2>
        ${data.suites.map(suite => `
            <div class="suite">
                <div class="suite-header">
                    <span class="suite-name">${suite.name}</span>
                    <span class="suite-status ${suite.success ? 'passed' : 'failed'}">
                        ${suite.success ? 'PASSED' : 'FAILED'}
                    </span>
                </div>
                <div class="suite-details">
                    <div class="suite-command">${suite.command}</div>
                    <p><strong>Duration:</strong> <span class="duration">${(suite.duration / 1000).toFixed(2)}s</span></p>
                    <p><strong>Critical:</strong> ${suite.critical ? 'Yes' : 'No'}</p>
                    ${suite.stderr ? `<p><strong>Error:</strong> <pre style="background: #f8d7da; padding: 10px; border-radius: 4px;">${suite.stderr}</pre></p>` : ''}
                </div>
            </div>
        `).join('')}

        <div style="margin-top: 40px; text-align: center; color: #666; border-top: 1px solid #eee; padding-top: 20px;">
            <p>Generated by Mailchimp Automation Test Runner</p>
        </div>
    </div>
</body>
</html>
    `;

    fs.writeFileSync(
      path.join(this.config.reportPath, 'test-report.html'),
      html
    );
  }

  async generateJunitReport(data) {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<testsuites
  name="MailchimpAutomationTests"
  tests="${data.summary.totalSuites}"
  failures="${data.summary.failed}"
  skipped="${data.summary.skipped}"
  time="${(data.summary.duration / 1000).toFixed(3)}">
  ${data.suites.map(suite => `
  <testsuite
    name="${suite.name}"
    tests="1"
    failures="${suite.success ? 0 : 1}"
    time="${(suite.duration / 1000).toFixed(3)}">
    <testcase
      classname="MailchimpAutomation"
      name="${suite.name}"
      time="${(suite.duration / 1000).toFixed(3)}">
      ${!suite.success ? `
      <failure message="Test suite failed">
        <![CDATA[${suite.stderr || 'Test suite failed'}]]>
      </failure>
      ` : ''}
    </testcase>
  </testsuite>
  `).join('')}
</testsuites>`;

    fs.writeFileSync(
      path.join(this.config.reportPath, 'junit.xml'),
      xml
    );
  }

  async generateCoverageReport() {
    try {
      // Run coverage collection
      execSync('npx jest --coverage --coverageDirectory=./test-reports/coverage', {
        stdio: 'pipe'
      });

      console.log('✅ Coverage report generated');
    } catch (error) {
      console.log('⚠️ Coverage report generation failed:', error.message);
    }
  }

  displayResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📋 TEST EXECUTION SUMMARY');
    console.log('='.repeat(60));

    console.log(`🧪 Total Suites: ${this.results.totalSuites}`);
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⏭️ Skipped: ${this.results.skipped}`);
    console.log(`⏱️ Duration: ${(this.results.duration / 1000 / 60).toFixed(2)} minutes`);

    const successRate = ((this.results.passed / (this.results.totalSuites - this.results.skipped)) * 100).toFixed(1);
    console.log(`📊 Success Rate: ${successRate}%`);

    if (this.results.failed > 0) {
      console.log('\n❌ FAILED SUITES:');
      this.results.suiteResults
        .filter(suite => !suite.success)
        .forEach(suite => {
          console.log(`   • ${suite.name}`);
          if (suite.stderr) {
            console.log(`     Error: ${suite.stderr.slice(0, 100)}...`);
          }
        });
    }

    if (this.config.generateReport) {
      console.log(`\n📊 Reports generated in: ${this.config.reportPath}`);
      console.log(`   • HTML Report: test-report.html`);
      console.log(`   • JSON Report: test-results.json`);
      console.log(`   • JUnit XML: junit.xml`);
      console.log(`   • Coverage: coverage/index.html`);
    }

    console.log('='.repeat(60));

    if (this.results.failed === 0) {
      console.log('🎉 ALL TESTS PASSED! 🎉');
    } else {
      console.log('💥 SOME TESTS FAILED 💥');
    }
  }

  async cleanup() {
    console.log('🧹 Cleaning up test environment...');

    // Kill any remaining processes
    try {
      execSync('pkill -f "jest|playwright" || true', { stdio: 'ignore' });
    } catch (error) {
      // Ignore cleanup errors
    }

    // Clean up temporary files
    const tempDirs = ['./temp', './.temp'];
    tempDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    });

    console.log('✅ Cleanup completed');
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  // Parse command line arguments
  const options = {};
  args.forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      options[key] = value || true;
    }
  });

  // Apply options to environment
  if (options.parallel) process.env.RUN_PARALLEL = 'true';
  if (options.continue) process.env.CONTINUE_ON_FAILURE = 'true';
  if (options['skip-non-critical']) process.env.SKIP_NON_CRITICAL = 'true';
  if (options['no-report']) process.env.GENERATE_REPORT = 'false';
  if (options.output) process.env.REPORT_PATH = options.output;

  // Show help
  if (options.help) {
    console.log(`
Mailchimp Automation Test Runner

Usage: node test-runner.js [options]

Options:
  --parallel              Run test suites in parallel
  --continue              Continue execution after critical failures
  --skip-non-critical     Skip non-critical test suites
  --no-report             Skip report generation
  --output=<path>         Specify report output directory
  --help                  Show this help message

Environment Variables:
  CI=true                 Enable CI mode
  USE_MOCK_MAILCHIMP=true Use mock Mailchimp API
  USE_MOCK_WEBHOOK=true   Use mock webhook server

Examples:
  node test-runner.js --parallel --continue
  node test-runner.js --skip-non-critical --output=./reports
  CI=true node test-runner.js --parallel
    `);
    process.exit(0);
  }

  // Run tests
  const runner = new TestRunner();
  runner.run().catch(error => {
    console.error('Test runner crashed:', error);
    process.exit(1);
  });
}

module.exports = TestRunner;