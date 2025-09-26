/**
 * Webhook Simulation Tools for Testing
 * Provides utilities to simulate webhook calls and responses
 */

const http = require('http');
const https = require('https');
const EventEmitter = require('events');

class WebhookSimulator extends EventEmitter {
  constructor(options = {}) {
    super();
    this.port = options.port || 3001;
    this.host = options.host || 'localhost';
    this.server = null;
    this.requests = [];
    this.responses = new Map();
    this.middleware = [];
    this.isRunning = false;

    // Default response templates
    this.responseTemplates = {
      success: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: { success: true, message: 'Webhook processed successfully' }
      },
      error: {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: { success: false, error: 'Internal server error' }
      },
      timeout: {
        delay: 30000, // 30 second delay to simulate timeout
        status: 408,
        headers: { 'Content-Type': 'application/json' },
        body: { success: false, error: 'Request timeout' }
      },
      validation: {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
        body: { success: false, error: 'Validation failed', details: [] }
      }
    };
  }

  // Start the mock webhook server
  async start() {
    if (this.isRunning) {
      throw new Error('Webhook simulator is already running');
    }

    return new Promise((resolve, reject) => {
      this.server = http.createServer(this.handleRequest.bind(this));

      this.server.listen(this.port, this.host, (err) => {
        if (err) {
          reject(err);
        } else {
          this.isRunning = true;
          console.log(`🔗 Webhook simulator started at http://${this.host}:${this.port}`);
          this.emit('started', { host: this.host, port: this.port });
          resolve({ host: this.host, port: this.port });
        }
      });

      this.server.on('error', (err) => {
        this.emit('error', err);
        reject(err);
      });
    });
  }

  // Stop the mock webhook server
  async stop() {
    if (!this.isRunning || !this.server) {
      return;
    }

    return new Promise((resolve) => {
      this.server.close(() => {
        this.isRunning = false;
        console.log('🔗 Webhook simulator stopped');
        this.emit('stopped');
        resolve();
      });
    });
  }

  // Handle incoming webhook requests
  async handleRequest(req, res) {
    const requestId = this.generateRequestId();
    const timestamp = new Date().toISOString();

    // Parse request body
    let body = '';
    req.on('data', chunk => body += chunk);

    req.on('end', async () => {
      const request = {
        id: requestId,
        timestamp,
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: this.parseBody(body, req.headers['content-type']),
        rawBody: body
      };

      this.requests.push(request);
      this.emit('request', request);

      try {
        // Apply middleware
        for (const middleware of this.middleware) {
          await middleware(request, res);
        }

        // Get response configuration
        const responseConfig = this.getResponseConfig(request);

        // Apply delay if specified
        if (responseConfig.delay) {
          await new Promise(resolve => setTimeout(resolve, responseConfig.delay));
        }

        // Send response
        res.writeHead(responseConfig.status, responseConfig.headers);
        res.end(JSON.stringify(responseConfig.body));

        this.emit('response', { request, response: responseConfig });

      } catch (error) {
        console.error('Error handling webhook request:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));

        this.emit('error', { request, error });
      }
    });
  }

  // Parse request body based on content type
  parseBody(body, contentType) {
    if (!body) return null;

    try {
      if (contentType && contentType.includes('application/json')) {
        return JSON.parse(body);
      } else if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
        const params = new URLSearchParams(body);
        const result = {};
        for (const [key, value] of params) {
          result[key] = value;
        }
        return result;
      }
    } catch (error) {
      console.warn('Failed to parse request body:', error.message);
    }

    return body;
  }

  // Get response configuration for a request
  getResponseConfig(request) {
    // Check for specific response configured for this request
    const pathResponse = this.responses.get(request.url);
    if (pathResponse) {
      return pathResponse;
    }

    // Check for wildcard responses
    for (const [pattern, response] of this.responses) {
      if (pattern.includes('*') && this.matchesPattern(request.url, pattern)) {
        return response;
      }
    }

    // Default successful response
    return this.responseTemplates.success;
  }

  // Check if URL matches a pattern
  matchesPattern(url, pattern) {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return regex.test(url);
  }

  // Configure response for specific path
  configureResponse(path, responseConfig) {
    this.responses.set(path, responseConfig);
  }

  // Configure response template
  configureTemplate(templateName, responseConfig) {
    this.responseTemplates[templateName] = responseConfig;
  }

  // Add middleware
  use(middleware) {
    this.middleware.push(middleware);
  }

  // Get all recorded requests
  getRequests() {
    return [...this.requests];
  }

  // Get requests matching criteria
  getRequestsWhere(criteria) {
    return this.requests.filter(request => {
      for (const [key, value] of Object.entries(criteria)) {
        if (request[key] !== value) {
          return false;
        }
      }
      return true;
    });
  }

  // Clear recorded requests
  clearRequests() {
    this.requests = [];
  }

  // Generate unique request ID
  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Simulation presets for common scenarios
  simulateMailchimpWebhook() {
    this.configureResponse('/webhook/mailchimp', {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: {
        success: true,
        subscriber_hash: '5d41402abc4b2a76b9719d911017c592',
        message: 'Subscriber added to audience'
      }
    });
  }

  simulateN8nWebhook() {
    this.configureResponse('/webhook/n8n/*', {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: {
        success: true,
        execution_id: 'exec_' + Math.random().toString(36).substr(2, 10),
        message: 'Workflow executed successfully'
      }
    });
  }

  simulateTelegramWebhook() {
    this.configureResponse('/webhook/telegram', {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: {
        ok: true,
        result: {
          message_id: Math.floor(Math.random() * 1000000),
          chat: { id: -123456789, type: 'group' },
          date: Math.floor(Date.now() / 1000),
          text: 'Notification sent successfully'
        }
      }
    });
  }

  // Simulate failure scenarios
  simulateFailures() {
    // 50% chance of various failures
    this.use(async (request, res) => {
      const rand = Math.random();

      if (rand < 0.1) { // 10% server errors
        throw new Error('Simulated server error');
      } else if (rand < 0.15) { // 5% validation errors
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Validation failed',
          details: ['Invalid email format', 'Missing required field: userType']
        }));
        return;
      } else if (rand < 0.18) { // 3% timeouts
        await new Promise(resolve => setTimeout(resolve, 35000)); // Longer than typical timeout
      }
    });
  }

  // Simulate rate limiting
  simulateRateLimit(requestsPerMinute = 60) {
    const requests = new Map();

    this.use(async (request, res) => {
      const now = Date.now();
      const minute = Math.floor(now / 60000);
      const key = `${request.headers['x-forwarded-for'] || 'unknown'}_${minute}`;

      const count = requests.get(key) || 0;
      if (count >= requestsPerMinute) {
        res.writeHead(429, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Rate limit exceeded',
          retry_after: 60
        }));
        return;
      }

      requests.set(key, count + 1);

      // Clean up old entries
      if (Math.random() < 0.1) {
        for (const [k] of requests) {
          const [, m] = k.split('_');
          if (parseInt(m) < minute - 2) {
            requests.delete(k);
          }
        }
      }
    });
  }

  // Test helper methods
  async waitForRequest(timeout = 5000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Timeout waiting for webhook request'));
      }, timeout);

      this.once('request', (request) => {
        clearTimeout(timer);
        resolve(request);
      });
    });
  }

  async waitForRequests(count, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Timeout waiting for ${count} webhook requests`));
      }, timeout);

      const checkCount = () => {
        if (this.requests.length >= count) {
          clearTimeout(timer);
          resolve(this.requests.slice(-count));
        }
      };

      this.on('request', checkCount);
      checkCount(); // Check immediately in case requests already exist
    });
  }

  // Validation helpers
  validateMailchimpWebhook(request) {
    const requiredFields = ['email', 'userType', 'firstName', 'lastName'];
    const errors = [];

    if (!request.body) {
      errors.push('Request body is required');
      return { valid: false, errors };
    }

    for (const field of requiredFields) {
      if (!request.body[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    if (request.body.email && !this.isValidEmail(request.body.email)) {
      errors.push('Invalid email format');
    }

    if (request.body.userType && !['physician', 'investor', 'specialist'].includes(request.body.userType)) {
      errors.push('Invalid userType. Must be: physician, investor, or specialist');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Performance monitoring
  getPerformanceStats() {
    const requests = this.getRequests();
    const responseTimes = requests.map(req => {
      const responseEvent = this.listenerCount('response') > 0 ?
        this.listeners('response').find(l => l.request && l.request.id === req.id) : null;

      return responseEvent ?
        new Date(responseEvent.timestamp) - new Date(req.timestamp) : 0;
    }).filter(time => time > 0);

    return {
      totalRequests: requests.length,
      averageResponseTime: responseTimes.length > 0 ?
        responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0,
      minResponseTime: responseTimes.length > 0 ? Math.min(...responseTimes) : 0,
      maxResponseTime: responseTimes.length > 0 ? Math.max(...responseTimes) : 0,
      requestsPerSecond: requests.length > 0 ?
        requests.length / ((Date.now() - new Date(requests[0].timestamp)) / 1000) : 0
    };
  }
}

// Webhook client for making requests
class WebhookClient {
  constructor(baseUrl = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
    this.timeout = 10000;
  }

  async post(path, data, options = {}) {
    const url = new URL(path, this.baseUrl);
    const postData = JSON.stringify(data);

    const requestOptions = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...options.headers
      },
      timeout: options.timeout || this.timeout
    };

    return new Promise((resolve, reject) => {
      const protocol = url.protocol === 'https:' ? https : http;
      const req = protocol.request(requestOptions, (res) => {
        let responseData = '';
        res.on('data', chunk => responseData += chunk);
        res.on('end', () => {
          try {
            const response = {
              status: res.statusCode,
              headers: res.headers,
              body: responseData ? JSON.parse(responseData) : null,
              rawBody: responseData
            };
            resolve(response);
          } catch (error) {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              body: null,
              rawBody: responseData
            });
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.write(postData);
      req.end();
    });
  }

  async get(path, options = {}) {
    const url = new URL(path, this.baseUrl);

    const requestOptions = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: 'GET',
      headers: options.headers || {},
      timeout: options.timeout || this.timeout
    };

    return new Promise((resolve, reject) => {
      const protocol = url.protocol === 'https:' ? https : http;
      const req = protocol.request(requestOptions, (res) => {
        let responseData = '';
        res.on('data', chunk => responseData += chunk);
        res.on('end', () => {
          try {
            const response = {
              status: res.statusCode,
              headers: res.headers,
              body: responseData ? JSON.parse(responseData) : null,
              rawBody: responseData
            };
            resolve(response);
          } catch (error) {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              body: null,
              rawBody: responseData
            });
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }
}

// Export classes
module.exports = {
  WebhookSimulator,
  WebhookClient
};