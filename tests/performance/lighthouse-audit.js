/**
 * @test Lighthouse Performance Audit
 * @description Automated performance, SEO, and accessibility testing
 * @prerequisites Chrome/Chromium browser, lighthouse CLI
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs').promises;
const path = require('path');

class LighthouseAuditor {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || 'http://localhost:3000';
    this.outputDir = options.outputDir || './tests/reports/lighthouse';
    this.thresholds = {
      performance: 90,
      accessibility: 95,
      'best-practices': 90,
      seo: 95,
      pwa: 70
    };
  }

  async runAudit(url, options = {}) {
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const flags = {
      logLevel: 'info',
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
      port: chrome.port,
      ...options
    };

    try {
      const runnerResult = await lighthouse(url, flags);
      await chrome.kill();
      return runnerResult;
    } catch (error) {
      await chrome.kill();
      throw error;
    }
  }

  async auditMultiplePages() {
    const pages = [
      { url: `${this.baseUrl}/`, name: 'homepage' },
      { url: `${this.baseUrl}/join.html`, name: 'waitlist' },
      { url: `${this.baseUrl}/platform.html`, name: 'platform' },
      { url: `${this.baseUrl}/approach.html`, name: 'approach' },
      { url: `${this.baseUrl}/founder.html`, name: 'founder' }
    ];

    const results = [];

    for (const page of pages) {
      console.log(`\n🔍 Auditing ${page.name}: ${page.url}`);

      try {
        const result = await this.runAudit(page.url);
        const scores = this.extractScores(result.report);

        results.push({
          page: page.name,
          url: page.url,
          scores,
          timestamp: new Date().toISOString(),
          passed: this.checkThresholds(scores)
        });

        // Save detailed report
        await this.saveReport(result.report, `${page.name}-lighthouse-report.json`);

        console.log(`✅ ${page.name} completed`);
        this.logScores(scores);

      } catch (error) {
        console.error(`❌ Failed to audit ${page.name}:`, error.message);
        results.push({
          page: page.name,
          url: page.url,
          error: error.message,
          timestamp: new Date().toISOString(),
          passed: false
        });
      }
    }

    return results;
  }

  extractScores(report) {
    const reportData = JSON.parse(report);
    const categories = reportData.categories;

    return {
      performance: Math.round(categories.performance?.score * 100) || 0,
      accessibility: Math.round(categories.accessibility?.score * 100) || 0,
      'best-practices': Math.round(categories['best-practices']?.score * 100) || 0,
      seo: Math.round(categories.seo?.score * 100) || 0,
      pwa: Math.round(categories.pwa?.score * 100) || 0
    };
  }

  checkThresholds(scores) {
    return Object.entries(this.thresholds).every(([category, threshold]) => {
      return scores[category] >= threshold;
    });
  }

  logScores(scores) {
    Object.entries(scores).forEach(([category, score]) => {
      const threshold = this.thresholds[category];
      const status = score >= threshold ? '✅' : '❌';
      console.log(`  ${status} ${category}: ${score}/100 (threshold: ${threshold})`);
    });
  }

  async saveReport(report, filename) {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
      const filePath = path.join(this.outputDir, filename);
      await fs.writeFile(filePath, report);
      console.log(`📄 Report saved: ${filePath}`);
    } catch (error) {
      console.error(`Failed to save report:`, error.message);
    }
  }

  async generateSummaryReport(results) {
    const summary = {
      timestamp: new Date().toISOString(),
      totalPages: results.length,
      passedPages: results.filter(r => r.passed).length,
      failedPages: results.filter(r => !r.passed).length,
      averageScores: this.calculateAverageScores(results),
      detailedResults: results,
      thresholds: this.thresholds
    };

    await this.saveReport(JSON.stringify(summary, null, 2), 'summary-report.json');
    return summary;
  }

  calculateAverageScores(results) {
    const validResults = results.filter(r => r.scores && !r.error);
    if (validResults.length === 0) return {};

    const categories = ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'];
    const averages = {};

    categories.forEach(category => {
      const scores = validResults.map(r => r.scores[category]).filter(s => s > 0);
      averages[category] = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;
    });

    return averages;
  }

  async runHealthcareSpecificAudits(url) {
    const result = await this.runAudit(url);
    const reportData = JSON.parse(result.report);
    const audits = reportData.audits;

    // Healthcare-specific performance checks
    const healthcareChecks = {
      // HIPAA-related security checks
      security: {
        'is-on-https': audits['is-on-https']?.score === 1,
        'mixed-content': audits['mixed-content']?.score === 1,
        'external-anchors-use-rel-noopener': audits['external-anchors-use-rel-noopener']?.score === 1
      },

      // Accessibility for patients with disabilities
      accessibility: {
        'color-contrast': audits['color-contrast']?.score === 1,
        'aria-allowed-attr': audits['aria-allowed-attr']?.score === 1,
        'aria-required-attr': audits['aria-required-attr']?.score === 1,
        'form-field-multiple-labels': audits['form-field-multiple-labels']?.score === 1,
        'label': audits['label']?.score === 1
      },

      // Performance for low-bandwidth areas (rural healthcare)
      performance: {
        'first-contentful-paint': parseFloat(audits['first-contentful-paint']?.displayValue) < 3000,
        'largest-contentful-paint': parseFloat(audits['largest-contentful-paint']?.displayValue) < 4000,
        'cumulative-layout-shift': parseFloat(audits['cumulative-layout-shift']?.displayValue) < 0.1,
        'total-blocking-time': parseFloat(audits['total-blocking-time']?.displayValue) < 300
      },

      // SEO for healthcare information findability
      seo: {
        'meta-description': audits['meta-description']?.score === 1,
        'document-title': audits['document-title']?.score === 1,
        'structured-data': audits['structured-data']?.score === 1,
        'canonical': audits['canonical']?.score === 1
      }
    };

    return healthcareChecks;
  }
}

// Usage for testing
async function runLighthouseTests() {
  const auditor = new LighthouseAuditor({
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    outputDir: './tests/reports/lighthouse'
  });

  console.log('🚀 Starting Lighthouse audits for Ignite Health Systems...\n');

  try {
    // Run standard audits
    const results = await auditor.auditMultiplePages();
    const summary = await auditor.generateSummaryReport(results);

    console.log('\n📊 AUDIT SUMMARY:');
    console.log(`Total pages: ${summary.totalPages}`);
    console.log(`Passed: ${summary.passedPages}`);
    console.log(`Failed: ${summary.failedPages}`);

    console.log('\n🎯 AVERAGE SCORES:');
    Object.entries(summary.averageScores).forEach(([category, score]) => {
      const threshold = auditor.thresholds[category];
      const status = score >= threshold ? '✅' : '❌';
      console.log(`${status} ${category}: ${score}/100`);
    });

    // Run healthcare-specific audits on homepage
    console.log('\n🏥 HEALTHCARE-SPECIFIC AUDITS:');
    const healthcareChecks = await auditor.runHealthcareSpecificAudits(`${auditor.baseUrl}/`);

    Object.entries(healthcareChecks).forEach(([category, checks]) => {
      console.log(`\n${category.toUpperCase()}:`);
      Object.entries(checks).forEach(([check, passed]) => {
        const status = passed ? '✅' : '❌';
        console.log(`  ${status} ${check}`);
      });
    });

    // Exit with appropriate code
    const overallPassed = summary.passedPages === summary.totalPages;
    process.exit(overallPassed ? 0 : 1);

  } catch (error) {
    console.error('❌ Lighthouse audit failed:', error.message);
    process.exit(1);
  }
}

// Export for use in other tests
module.exports = LighthouseAuditor;

// Run if called directly
if (require.main === module) {
  runLighthouseTests();
}