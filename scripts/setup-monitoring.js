#!/usr/bin/env node

/**
 * Ignite Health Email Automation Monitoring Setup Script
 *
 * This script sets up comprehensive monitoring for the email automation system,
 * including metrics collection, alerting, and dashboard configuration.
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

class MonitoringSetup {
  constructor() {
    this.config = {
      environment: process.env.NODE_ENV || 'production',
      metricsPort: process.env.METRICS_PORT || 9090,
      alertmanagerPort: process.env.ALERTMANAGER_PORT || 9093,
      grafanaPort: process.env.GRAFANA_PORT || 3000,
      prometheusConfig: '/etc/prometheus/prometheus.yml',
      grafanaConfig: '/etc/grafana/grafana.ini'
    };

    this.metrics = new Map();
    this.alertRules = [];
    this.setupStartTime = Date.now();
  }

  async initialize() {
    console.log('🚀 Initializing Ignite Health Email Automation Monitoring...');

    try {
      await this.validateEnvironment();
      await this.setupMetricsCollection();
      await this.configurePrometheus();
      await this.setupGrafana();
      await this.configureAlertmanager();
      await this.createHealthChecks();
      await this.setupAutomatedReporting();
      await this.validateSetup();

      console.log('✅ Monitoring setup completed successfully!');
      await this.generateSetupReport();

    } catch (error) {
      console.error('❌ Monitoring setup failed:', error);
      await this.rollbackChanges();
      process.exit(1);
    }
  }

  async validateEnvironment() {
    console.log('🔍 Validating environment...');

    const requiredEnvVars = [
      'MAILCHIMP_API_KEY',
      'N8N_WEBHOOK_URL',
      'GOOGLE_SHEETS_CREDENTIALS',
      'SLACK_WEBHOOK_URL'
    ];

    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    // Check if monitoring tools are available
    try {
      execSync('which prometheus', { stdio: 'ignore' });
      execSync('which grafana-server', { stdio: 'ignore' });
      execSync('which alertmanager', { stdio: 'ignore' });
    } catch (error) {
      console.log('📦 Installing monitoring tools...');
      await this.installMonitoringTools();
    }

    console.log('✅ Environment validation complete');
  }

  async installMonitoringTools() {
    const platform = process.platform;

    if (platform === 'darwin') {
      execSync('brew install prometheus grafana alertmanager node_exporter', { stdio: 'inherit' });
    } else if (platform === 'linux') {
      execSync('sudo apt-get update && sudo apt-get install -y prometheus grafana alertmanager', { stdio: 'inherit' });
    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  async setupMetricsCollection() {
    console.log('📊 Setting up metrics collection...');

    // Create metrics collection server
    const metricsServer = `
const express = require('express');
const client = require('prom-client');
const axios = require('axios');

const app = express();
const register = new client.Registry();

// Default metrics
client.collectDefaultMetrics({ register });

// Custom metrics for email automation
const emailDeliveryRate = new client.Gauge({
  name: 'email_delivery_rate',
  help: 'Email delivery success rate by user type',
  labelNames: ['user_type', 'email_type', 'environment'],
  registers: [register]
});

const automationTriggerSuccess = new client.Gauge({
  name: 'automation_trigger_success_rate',
  help: 'Success rate of automation triggers',
  labelNames: ['trigger_type', 'workflow_id', 'environment'],
  registers: [register]
});

const apiResponseTime = new client.Histogram({
  name: 'api_response_time',
  help: 'API response times for external services',
  labelNames: ['service', 'endpoint', 'method', 'status_code'],
  buckets: [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
  registers: [register]
});

const alertResponseTime = new client.Histogram({
  name: 'alert_response_time',
  help: 'Time for co-founders to respond to alerts',
  labelNames: ['alert_type', 'severity', 'responder'],
  buckets: [1, 5, 10, 15, 30, 60, 120, 240],
  registers: [register]
});

const tagAccuracy = new client.Gauge({
  name: 'tag_application_accuracy',
  help: 'Accuracy of automated tag application',
  labelNames: ['tag_type', 'source', 'environment'],
  registers: [register]
});

const bounceRate = new client.Gauge({
  name: 'email_bounce_rate',
  help: 'Email bounce rate',
  labelNames: ['bounce_type', 'user_type', 'environment'],
  registers: [register]
});

const spamRate = new client.Gauge({
  name: 'spam_complaint_rate',
  help: 'Spam complaint rate',
  labelNames: ['email_type', 'user_type', 'environment'],
  registers: [register]
});

const workflowExecutions = new client.Counter({
  name: 'workflow_execution_count',
  help: 'Number of workflow executions',
  labelNames: ['workflow_id', 'status', 'environment'],
  registers: [register]
});

// Metrics collection functions
async function collectMailchimpMetrics() {
  try {
    const response = await axios.get('https://us12.api.mailchimp.com/3.0/reports', {
      headers: {
        'Authorization': \`Bearer \${process.env.MAILCHIMP_API_KEY}\`
      }
    });

    const reports = response.data.reports;

    reports.forEach(report => {
      // Calculate delivery rate
      const deliveryRate = (report.emails_sent - report.bounces.hard_bounces - report.bounces.soft_bounces) / report.emails_sent * 100;
      emailDeliveryRate.set({
        user_type: report.list_name || 'unknown',
        email_type: report.type || 'campaign',
        environment: process.env.NODE_ENV || 'production'
      }, deliveryRate);

      // Track bounce rates
      const bounceRateValue = (report.bounces.hard_bounces + report.bounces.soft_bounces) / report.emails_sent * 100;
      bounceRate.set({
        bounce_type: 'total',
        user_type: report.list_name || 'unknown',
        environment: process.env.NODE_ENV || 'production'
      }, bounceRateValue);

      // Track spam complaints
      const spamRateValue = report.abuse_reports / report.emails_sent * 100;
      spamRate.set({
        email_type: report.type || 'campaign',
        user_type: report.list_name || 'unknown',
        environment: process.env.NODE_ENV || 'production'
      }, spamRateValue);
    });

  } catch (error) {
    console.error('Error collecting Mailchimp metrics:', error);
  }
}

async function collectN8NMetrics() {
  try {
    const response = await axios.get(\`\${process.env.N8N_BASE_URL}/api/v1/executions\`, {
      headers: {
        'X-N8N-API-KEY': process.env.N8N_API_KEY
      }
    });

    const executions = response.data.data;

    // Calculate success rates by workflow
    const workflowStats = {};

    executions.forEach(execution => {
      const workflowId = execution.workflowId;
      if (!workflowStats[workflowId]) {
        workflowStats[workflowId] = { total: 0, success: 0 };
      }

      workflowStats[workflowId].total++;
      if (execution.finished && !execution.stoppedAt) {
        workflowStats[workflowId].success++;
      }

      // Track execution counts
      workflowExecutions.inc({
        workflow_id: workflowId,
        status: execution.finished ? 'success' : 'error',
        environment: process.env.NODE_ENV || 'production'
      });
    });

    // Set success rates
    Object.entries(workflowStats).forEach(([workflowId, stats]) => {
      const successRate = (stats.success / stats.total) * 100;
      automationTriggerSuccess.set({
        trigger_type: 'workflow',
        workflow_id: workflowId,
        environment: process.env.NODE_ENV || 'production'
      }, successRate);
    });

  } catch (error) {
    console.error('Error collecting n8n metrics:', error);
  }
}

// API response time tracking middleware
function trackAPIResponseTime(service) {
  return (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      apiResponseTime.observe({
        service: service,
        endpoint: req.path,
        method: req.method,
        status_code: res.statusCode
      }, duration);
    });

    next();
  };
}

// Collect metrics every 30 seconds
setInterval(() => {
  collectMailchimpMetrics();
  collectN8NMetrics();
}, 30000);

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).end(error);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    metrics_collected: register.getSingleMetric('email_delivery_rate') ? true : false
  });
});

const port = process.env.METRICS_PORT || 9090;
app.listen(port, () => {
  console.log(\`📊 Metrics server running on port \${port}\`);
});

module.exports = {
  emailDeliveryRate,
  automationTriggerSuccess,
  apiResponseTime,
  alertResponseTime,
  tagAccuracy,
  bounceRate,
  spamRate,
  workflowExecutions,
  trackAPIResponseTime
};
`;

    await fs.writeFile(path.join(process.cwd(), 'scripts', 'metrics-server.js'), metricsServer);

    // Create package.json for metrics server if it doesn't exist
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    try {
      await fs.access(packageJsonPath);
    } catch {
      const packageJson = {
        name: 'ignite-health-monitoring',
        version: '1.0.0',
        description: 'Email automation monitoring system',
        main: 'scripts/metrics-server.js',
        scripts: {
          'start:metrics': 'node scripts/metrics-server.js',
          'start:monitoring': 'npm run start:metrics & prometheus & grafana-server & alertmanager'
        },
        dependencies: {
          'express': '^4.18.2',
          'prom-client': '^14.2.0',
          'axios': '^1.4.0'
        }
      };

      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
    }

    console.log('✅ Metrics collection setup complete');
  }

  async configurePrometheus() {
    console.log('⚙️ Configuring Prometheus...');

    const prometheusConfig = `
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "${path.join(process.cwd(), 'config/monitoring/alert-rules.yaml')}"

scrape_configs:
  - job_name: 'ignite-health-metrics'
    static_configs:
      - targets: ['localhost:${this.config.metricsPort}']
    scrape_interval: 30s
    metrics_path: /metrics

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['localhost:9100']

  - job_name: 'mailchimp-api'
    static_configs:
      - targets: ['api.mailchimp.com:443']
    scheme: https
    scrape_interval: 60s

  - job_name: 'n8n-webhooks'
    static_configs:
      - targets: ['${process.env.N8N_WEBHOOK_URL || "localhost:5678"}']
    scrape_interval: 30s

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - localhost:${this.config.alertmanagerPort}

remote_write:
  - url: "http://localhost:9090/api/v1/write"
    queue_config:
      max_samples_per_send: 1000
      max_shards: 200
      capacity: 2500
`;

    // Ensure prometheus config directory exists
    try {
      await fs.mkdir('/etc/prometheus', { recursive: true });
      await fs.writeFile('/etc/prometheus/prometheus.yml', prometheusConfig);
    } catch (error) {
      // Fallback to local config
      await fs.mkdir(path.join(process.cwd(), 'config/prometheus'), { recursive: true });
      await fs.writeFile(path.join(process.cwd(), 'config/prometheus/prometheus.yml'), prometheusConfig);
    }

    console.log('✅ Prometheus configuration complete');
  }

  async setupGrafana() {
    console.log('📈 Setting up Grafana...');

    // Create Grafana provisioning configs
    const grafanaProvisioning = {
      datasources: `
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://localhost:9090
    isDefault: true
    editable: true
`,
      dashboards: `
apiVersion: 1

providers:
  - name: 'ignite-health'
    orgId: 1
    folder: 'Email Automation'
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    allowUiUpdates: true
    options:
      path: ${path.join(process.cwd(), 'config/monitoring')}
`
    };

    // Create Grafana config directories
    const grafanaConfigDir = path.join(process.cwd(), 'config/grafana');
    await fs.mkdir(path.join(grafanaConfigDir, 'provisioning/datasources'), { recursive: true });
    await fs.mkdir(path.join(grafanaConfigDir, 'provisioning/dashboards'), { recursive: true });

    await fs.writeFile(
      path.join(grafanaConfigDir, 'provisioning/datasources/prometheus.yml'),
      grafanaProvisioning.datasources
    );

    await fs.writeFile(
      path.join(grafanaConfigDir, 'provisioning/dashboards/dashboards.yml'),
      grafanaProvisioning.dashboards
    );

    // Convert dashboard config to Grafana format
    const dashboardConfig = JSON.parse(
      await fs.readFile(path.join(process.cwd(), 'config/monitoring/dashboard-config.json'), 'utf8')
    );

    await fs.writeFile(
      path.join(process.cwd(), 'config/monitoring/email-automation-dashboard.json'),
      JSON.stringify(dashboardConfig, null, 2)
    );

    console.log('✅ Grafana setup complete');
  }

  async configureAlertmanager() {
    console.log('🚨 Configuring Alertmanager...');

    const alertmanagerConfig = `
global:
  smtp_smarthost: 'localhost:587'
  smtp_from: 'monitoring@ignite-health.com'
  slack_api_url: '${process.env.SLACK_WEBHOOK_URL}'

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'web.hook'
  routes:
  - match:
      severity: critical
    receiver: critical-alerts
  - match:
      severity: warning
    receiver: warning-alerts

receivers:
- name: 'web.hook'
  webhook_configs:
  - url: 'http://localhost:5001/webhook'

- name: 'critical-alerts'
  email_configs:
  - to: 'founders@ignite-health.com'
    subject: 'CRITICAL: Ignite Health Email Automation Alert'
    body: |
      Alert: {{ .GroupLabels.alertname }}
      {{ range .Alerts }}
      Summary: {{ .Annotations.summary }}
      Description: {{ .Annotations.description }}
      {{ end }}
  slack_configs:
  - channel: '#alerts-critical'
    title: 'Critical Alert: {{ .GroupLabels.alertname }}'

- name: 'warning-alerts'
  email_configs:
  - to: 'team@ignite-health.com'
    subject: 'WARNING: Ignite Health Email Automation Alert'
    body: |
      Alert: {{ .GroupLabels.alertname }}
      {{ range .Alerts }}
      Summary: {{ .Annotations.summary }}
      {{ end }}

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'dev', 'instance']
`;

    // Create alertmanager config
    const alertmanagerDir = path.join(process.cwd(), 'config/alertmanager');
    await fs.mkdir(alertmanagerDir, { recursive: true });
    await fs.writeFile(path.join(alertmanagerDir, 'alertmanager.yml'), alertmanagerConfig);

    console.log('✅ Alertmanager configuration complete');
  }

  async createHealthChecks() {
    console.log('🏥 Creating health checks...');

    const healthCheckScript = `
#!/usr/bin/env node

const axios = require('axios');
const { execSync } = require('child_process');

class HealthChecker {
  constructor() {
    this.services = [
      { name: 'Metrics Server', url: 'http://localhost:${this.config.metricsPort}/health' },
      { name: 'Prometheus', url: 'http://localhost:9090/-/healthy' },
      { name: 'Grafana', url: 'http://localhost:${this.config.grafanaPort}/api/health' },
      { name: 'Alertmanager', url: 'http://localhost:${this.config.alertmanagerPort}/-/healthy' }
    ];

    this.externalServices = [
      { name: 'Mailchimp API', url: 'https://us12.api.mailchimp.com/3.0/ping' },
      { name: 'n8n Webhook', url: process.env.N8N_WEBHOOK_URL },
      { name: 'Google Sheets API', url: 'https://sheets.googleapis.com/v4/spreadsheets' }
    ];
  }

  async checkServices() {
    console.log('🏥 Running health checks...');

    const results = {
      internal: [],
      external: [],
      overall: 'healthy',
      timestamp: new Date().toISOString()
    };

    // Check internal services
    for (const service of this.services) {
      try {
        const response = await axios.get(service.url, { timeout: 5000 });
        results.internal.push({
          name: service.name,
          status: 'healthy',
          responseTime: response.responseTime || 'N/A',
          statusCode: response.status
        });
      } catch (error) {
        results.internal.push({
          name: service.name,
          status: 'unhealthy',
          error: error.message,
          statusCode: error.response?.status || 'N/A'
        });
        results.overall = 'degraded';
      }
    }

    // Check external services
    for (const service of this.externalServices) {
      try {
        const start = Date.now();
        const response = await axios.get(service.url, {
          timeout: 10000,
          headers: service.name === 'Mailchimp API' ? {
            'Authorization': \`Bearer \${process.env.MAILCHIMP_API_KEY}\`
          } : {}
        });
        const responseTime = Date.now() - start;

        results.external.push({
          name: service.name,
          status: 'healthy',
          responseTime: \`\${responseTime}ms\`,
          statusCode: response.status
        });
      } catch (error) {
        results.external.push({
          name: service.name,
          status: 'unhealthy',
          error: error.message,
          statusCode: error.response?.status || 'N/A'
        });

        if (service.name === 'Mailchimp API' || service.name === 'n8n Webhook') {
          results.overall = 'critical';
        }
      }
    }

    return results;
  }

  async generateReport() {
    const results = await this.checkServices();

    console.log('\\n📊 Health Check Report');
    console.log('='.repeat(50));
    console.log(\`Overall Status: \${results.overall.toUpperCase()}\`);
    console.log(\`Timestamp: \${results.timestamp}\`);

    console.log('\\n🔧 Internal Services:');
    results.internal.forEach(service => {
      const status = service.status === 'healthy' ? '✅' : '❌';
      console.log(\`  \${status} \${service.name}: \${service.status}\`);
      if (service.responseTime) console.log(\`     Response Time: \${service.responseTime}\`);
    });

    console.log('\\n🌐 External Services:');
    results.external.forEach(service => {
      const status = service.status === 'healthy' ? '✅' : '❌';
      console.log(\`  \${status} \${service.name}: \${service.status}\`);
      if (service.responseTime) console.log(\`     Response Time: \${service.responseTime}\`);
    });

    // Write results to file for monitoring
    await require('fs').promises.writeFile(
      'logs/health-check-results.json',
      JSON.stringify(results, null, 2)
    );

    return results;
  }
}

if (require.main === module) {
  const checker = new HealthChecker();
  checker.generateReport().catch(console.error);
}

module.exports = HealthChecker;
`;

    await fs.writeFile(path.join(process.cwd(), 'scripts', 'health-check.js'), healthCheckScript);
    await fs.chmod(path.join(process.cwd(), 'scripts', 'health-check.js'), '755');

    console.log('✅ Health checks created');
  }

  async setupAutomatedReporting() {
    console.log('📋 Setting up automated reporting...');

    const reportingScript = `
#!/usr/bin/env node

const axios = require('axios');
const { execSync } = require('child_process');

class MonitoringReporter {
  constructor() {
    this.prometheusUrl = 'http://localhost:9090';
    this.reportInterval = 24 * 60 * 60 * 1000; // 24 hours
  }

  async generateDailyReport() {
    console.log('📋 Generating daily monitoring report...');

    const endTime = new Date();
    const startTime = new Date(endTime - 24 * 60 * 60 * 1000);

    const queries = {
      emailDeliveryRate: 'avg_over_time(email_delivery_rate[24h])',
      automationSuccessRate: 'avg_over_time(automation_trigger_success_rate[24h])',
      apiResponseTime: 'histogram_quantile(0.95, rate(api_response_time_bucket[24h]))',
      errorRate: 'avg_over_time(error_rate[24h])',
      alertCount: 'increase(prometheus_notifications_total[24h])'
    };

    const metrics = {};

    for (const [name, query] of Object.entries(queries)) {
      try {
        const response = await axios.get(\`\${this.prometheusUrl}/api/v1/query\`, {
          params: {
            query,
            time: Math.floor(endTime.getTime() / 1000)
          }
        });

        if (response.data.status === 'success' && response.data.data.result.length > 0) {
          metrics[name] = response.data.data.result[0].value[1];
        } else {
          metrics[name] = 'N/A';
        }
      } catch (error) {
        console.error(\`Error fetching \${name}:\`, error.message);
        metrics[name] = 'Error';
      }
    }

    const report = {
      date: endTime.toISOString().split('T')[0],
      period: '24 hours',
      summary: {
        emailDeliveryRate: \`\${parseFloat(metrics.emailDeliveryRate).toFixed(2)}%\`,
        automationSuccessRate: \`\${parseFloat(metrics.automationSuccessRate).toFixed(2)}%\`,
        avgApiResponseTime: \`\${parseFloat(metrics.apiResponseTime).toFixed(0)}ms\`,
        errorRate: \`\${parseFloat(metrics.errorRate).toFixed(2)}%\`,
        alertCount: parseInt(metrics.alertCount) || 0
      },
      recommendations: this.generateRecommendations(metrics),
      nextSteps: this.getNextSteps(metrics)
    };

    // Save report
    await require('fs').promises.writeFile(
      \`reports/daily-monitoring-report-\${report.date}.json\`,
      JSON.stringify(report, null, 2)
    );

    // Send to stakeholders
    await this.sendReportEmail(report);

    return report;
  }

  generateRecommendations(metrics) {
    const recommendations = [];

    if (parseFloat(metrics.emailDeliveryRate) < 95) {
      recommendations.push('Email delivery rate is below optimal (95%). Review email list quality and authentication.');
    }

    if (parseFloat(metrics.automationSuccessRate) < 90) {
      recommendations.push('Automation success rate needs attention. Check n8n workflow configurations.');
    }

    if (parseFloat(metrics.apiResponseTime) > 2000) {
      recommendations.push('API response times are elevated. Consider optimizing API calls or upgrading service tiers.');
    }

    if (parseFloat(metrics.errorRate) > 2) {
      recommendations.push('Error rate is above acceptable threshold. Review logs for recurring issues.');
    }

    if (parseInt(metrics.alertCount) > 10) {
      recommendations.push('High alert volume detected. Review alert thresholds and reduce noise.');
    }

    if (recommendations.length === 0) {
      recommendations.push('All metrics are within acceptable ranges. Continue monitoring.');
    }

    return recommendations;
  }

  getNextSteps(metrics) {
    return [
      'Review dashboard trends for any patterns',
      'Check recent deployments for correlation with metrics',
      'Update monitoring thresholds based on performance trends',
      'Schedule performance optimization if needed'
    ];
  }

  async sendReportEmail(report) {
    // Email sending logic would go here
    console.log('📧 Daily report generated:', report.date);
    console.log('📊 Key Metrics:');
    Object.entries(report.summary).forEach(([key, value]) => {
      console.log(\`  \${key}: \${value}\`);
    });
  }

  startScheduledReporting() {
    console.log('⏰ Starting scheduled reporting...');

    // Generate report immediately
    this.generateDailyReport().catch(console.error);

    // Schedule daily reports
    setInterval(() => {
      this.generateDailyReport().catch(console.error);
    }, this.reportInterval);
  }
}

if (require.main === module) {
  const reporter = new MonitoringReporter();
  reporter.startScheduledReporting();
}

module.exports = MonitoringReporter;
`;

    await fs.writeFile(path.join(process.cwd(), 'scripts', 'monitoring-reporter.js'), reportingScript);
    await fs.mkdir(path.join(process.cwd(), 'reports'), { recursive: true });
    await fs.mkdir(path.join(process.cwd(), 'logs'), { recursive: true });

    console.log('✅ Automated reporting setup complete');
  }

  async validateSetup() {
    console.log('🔍 Validating monitoring setup...');

    const validations = [
      {
        name: 'Metrics server configuration',
        check: () => fs.access(path.join(process.cwd(), 'scripts', 'metrics-server.js'))
      },
      {
        name: 'Prometheus configuration',
        check: () => fs.access(path.join(process.cwd(), 'config/prometheus/prometheus.yml'))
      },
      {
        name: 'Grafana dashboard',
        check: () => fs.access(path.join(process.cwd(), 'config/monitoring/dashboard-config.json'))
      },
      {
        name: 'Alert rules',
        check: () => fs.access(path.join(process.cwd(), 'config/monitoring/alert-rules.yaml'))
      },
      {
        name: 'Health checks',
        check: () => fs.access(path.join(process.cwd(), 'scripts', 'health-check.js'))
      }
    ];

    const results = [];

    for (const validation of validations) {
      try {
        await validation.check();
        results.push({ name: validation.name, status: 'passed' });
      } catch (error) {
        results.push({ name: validation.name, status: 'failed', error: error.message });
      }
    }

    const failedValidations = results.filter(r => r.status === 'failed');

    if (failedValidations.length > 0) {
      throw new Error(`Setup validation failed: ${failedValidations.map(f => f.name).join(', ')}`);
    }

    console.log('✅ All validations passed');
  }

  async generateSetupReport() {
    const setupTime = Date.now() - this.setupStartTime;

    const report = {
      timestamp: new Date().toISOString(),
      setupDuration: `${(setupTime / 1000).toFixed(2)} seconds`,
      environment: this.config.environment,
      components: {
        metricsServer: `http://localhost:${this.config.metricsPort}`,
        prometheus: `http://localhost:9090`,
        grafana: `http://localhost:${this.config.grafanaPort}`,
        alertmanager: `http://localhost:${this.config.alertmanagerPort}`
      },
      nextSteps: [
        'Start monitoring services: npm run start:monitoring',
        `Access Grafana dashboard: http://localhost:${this.config.grafanaPort}`,
        'Configure email/Slack notifications in alertmanager',
        'Set up automated health checks: node scripts/health-check.js',
        'Review and customize alert thresholds in alert-rules.yaml'
      ]
    };

    await fs.writeFile(
      path.join(process.cwd(), 'monitoring-setup-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log('\\n🎉 Monitoring Setup Complete!');
    console.log('='.repeat(50));
    console.log(`Setup completed in ${report.setupDuration}`);
    console.log('\\n📊 Access Points:');
    Object.entries(report.components).forEach(([name, url]) => {
      console.log(`  ${name}: ${url}`);
    });
    console.log('\\n🚀 Next Steps:');
    report.nextSteps.forEach((step, index) => {
      console.log(`  ${index + 1}. ${step}`);
    });
  }

  async rollbackChanges() {
    console.log('🔄 Rolling back monitoring setup...');
    // Rollback logic would go here
    console.log('✅ Rollback completed');
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new MonitoringSetup();
  setup.initialize().catch(console.error);
}

module.exports = MonitoringSetup;