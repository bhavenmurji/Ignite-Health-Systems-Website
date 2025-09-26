/**
 * Integration Tests for Mailchimp API
 * Tests real API interactions with mock environment safeguards
 */

const https = require('https');
const { mockMailchimpAPI } = require('../../mocks/mailchimp/mockMailchimpAPI');
const { testDataGenerator } = require('../../utils/testDataGenerator');

// Test environment configuration
const TEST_CONFIG = {
  MAILCHIMP_API_KEY: process.env.MAILCHIMP_TEST_API_KEY || 'test-key',
  MAILCHIMP_AUDIENCE_ID: process.env.MAILCHIMP_TEST_AUDIENCE_ID || 'test-audience',
  MAILCHIMP_SERVER: process.env.MAILCHIMP_TEST_SERVER || 'us18',
  USE_MOCK_API: process.env.USE_MOCK_MAILCHIMP !== 'false', // Default to mock
  WEBHOOK_URL: process.env.TEST_WEBHOOK_URL || 'https://test-webhook.example.com'
};

describe('Mailchimp API Integration', () => {
  let apiClient;
  let testContacts;

  beforeAll(() => {
    // Initialize API client (mock or real based on environment)
    if (TEST_CONFIG.USE_MOCK_API) {
      apiClient = new MockMailchimpAPIClient();
      console.log('Using Mock Mailchimp API for testing');
    } else {
      apiClient = new RealMailchimpAPIClient();
      console.log('Using Real Mailchimp API for testing');
    }

    // Generate test data
    testContacts = testDataGenerator.generateScenarioContacts();
  });

  beforeEach(async () => {
    if (TEST_CONFIG.USE_MOCK_API) {
      mockMailchimpAPI.reset();
    }

    // Clean up any test data from previous runs
    await apiClient.cleanup();
  });

  afterEach(async () => {
    // Clean up test data after each test
    await apiClient.cleanup();
  });

  describe('Subscriber Operations', () => {
    test('should add physician subscriber successfully', async () => {
      const physician = testContacts.standardPhysician;

      const response = await apiClient.addSubscriber(physician.email, {
        status: 'subscribed',
        merge_fields: {
          FNAME: physician.firstName,
          LNAME: physician.lastName,
          USERTYPE: physician.userType,
          SPECIALTY: physician.specialty,
          PRACTICE: physician.practiceModel,
          EMR: physician.emrSystem,
          CHALLENGE: physician.challenge,
          COFOUNDER: physician.cofounder ? 'Yes' : 'No',
          LINKEDIN: physician.linkedin
        }
      });

      expect(response.status).toBe('subscribed');
      expect(response.email_address).toBe(physician.email.toLowerCase());
      expect(response.merge_fields.USERTYPE).toBe('physician');
      expect(response.merge_fields.SPECIALTY).toBe(physician.specialty);
    });

    test('should handle duplicate email gracefully', async () => {
      const contact = testContacts.standardPhysician;

      // Add subscriber first time
      await apiClient.addSubscriber(contact.email, {
        status: 'subscribed',
        merge_fields: {
          FNAME: contact.firstName,
          LNAME: contact.lastName,
          USERTYPE: contact.userType
        }
      });

      // Try to add same email again
      const secondResponse = await apiClient.addSubscriber(contact.email, {
        status: 'subscribed',
        merge_fields: {
          FNAME: 'Updated',
          LNAME: contact.lastName,
          USERTYPE: contact.userType
        }
      });

      // Should update existing subscriber
      expect(secondResponse.merge_fields.FNAME).toBe('Updated');
    });

    test('should retrieve subscriber by email', async () => {
      const contact = testContacts.angelInvestor;

      // Add subscriber
      await apiClient.addSubscriber(contact.email, {
        status: 'subscribed',
        merge_fields: {
          FNAME: contact.firstName,
          LNAME: contact.lastName,
          USERTYPE: contact.userType
        }
      });

      // Retrieve subscriber
      const retrieved = await apiClient.getSubscriber(contact.email);
      expect(retrieved.email_address).toBe(contact.email.toLowerCase());
      expect(retrieved.merge_fields.USERTYPE).toBe('investor');
    });

    test('should update subscriber information', async () => {
      const contact = testContacts.techSpecialist;

      // Add subscriber
      await apiClient.addSubscriber(contact.email, {
        status: 'subscribed',
        merge_fields: {
          FNAME: contact.firstName,
          LNAME: contact.lastName,
          USERTYPE: contact.userType,
          SPECIALTY: 'Original Specialty'
        }
      });

      // Update subscriber
      const updated = await apiClient.updateSubscriber(contact.email, {
        merge_fields: {
          SPECIALTY: 'Updated Specialty',
          COFOUNDER: 'Yes'
        }
      });

      expect(updated.merge_fields.SPECIALTY).toBe('Updated Specialty');
      expect(updated.merge_fields.COFOUNDER).toBe('Yes');
    });

    test('should handle invalid email addresses', async () => {
      const invalidContact = testContacts.invalidEmail;

      await expect(apiClient.addSubscriber(invalidContact.email, {
        status: 'subscribed',
        merge_fields: {
          FNAME: invalidContact.firstName,
          LNAME: invalidContact.lastName
        }
      })).rejects.toThrow(/invalid.*email/i);
    });
  });

  describe('Batch Operations', () => {
    test('should handle batch subscriber addition', async () => {
      const contacts = testDataGenerator.generateContactBatch(10);
      const operations = contacts.map(contact => ({
        method: 'POST',
        path: `/lists/${TEST_CONFIG.MAILCHIMP_AUDIENCE_ID}/members`,
        body: JSON.stringify({
          email_address: contact.email,
          status: 'subscribed',
          merge_fields: {
            FNAME: contact.firstName,
            LNAME: contact.lastName,
            USERTYPE: contact.userType,
            SPECIALTY: contact.specialty || '',
            CHALLENGE: contact.challenge || ''
          }
        })
      }));

      const batchResponse = await apiClient.batchOperation(operations);

      expect(batchResponse.total_operations).toBe(10);
      expect(batchResponse.finished_operations).toBe(10);

      // Verify all contacts were added
      for (const contact of contacts) {
        const subscriber = await apiClient.getSubscriber(contact.email);
        expect(subscriber).toBeDefined();
        expect(subscriber.merge_fields.USERTYPE).toBe(contact.userType);
      }
    });

    test('should handle partial batch failures gracefully', async () => {
      const validContact = testContacts.standardPhysician;
      const invalidContact = { ...testContacts.invalidEmail };

      const operations = [
        {
          method: 'POST',
          path: `/lists/${TEST_CONFIG.MAILCHIMP_AUDIENCE_ID}/members`,
          body: JSON.stringify({
            email_address: validContact.email,
            status: 'subscribed',
            merge_fields: {
              FNAME: validContact.firstName,
              LNAME: validContact.lastName,
              USERTYPE: validContact.userType
            }
          })
        },
        {
          method: 'POST',
          path: `/lists/${TEST_CONFIG.MAILCHIMP_AUDIENCE_ID}/members`,
          body: JSON.stringify({
            email_address: invalidContact.email,
            status: 'subscribed',
            merge_fields: {
              FNAME: invalidContact.firstName,
              LNAME: invalidContact.lastName
            }
          })
        }
      ];

      const batchResponse = await apiClient.batchOperation(operations);

      expect(batchResponse.total_operations).toBe(2);
      expect(batchResponse.errored_operations).toBeGreaterThan(0);

      // Valid contact should be added
      const validSubscriber = await apiClient.getSubscriber(validContact.email);
      expect(validSubscriber).toBeDefined();
    });
  });

  describe('Tagging Operations', () => {
    test('should add tags to subscribers', async () => {
      const contact = testContacts.highValuePhysician;

      // Add subscriber
      const subscriber = await apiClient.addSubscriber(contact.email, {
        status: 'subscribed',
        merge_fields: {
          FNAME: contact.firstName,
          LNAME: contact.lastName,
          USERTYPE: contact.userType,
          COFOUNDER: contact.cofounder ? 'Yes' : 'No'
        }
      });

      // Add tags
      await apiClient.addTags(contact.email, ['high-priority', 'cofounder-interest']);

      const updated = await apiClient.getSubscriber(contact.email);
      const tagNames = updated.tags.map(tag => tag.name);

      expect(tagNames).toContain('high-priority');
      expect(tagNames).toContain('cofounder-interest');
    });

    test('should remove tags from subscribers', async () => {
      const contact = testContacts.standardPhysician;

      // Add subscriber with tags
      await apiClient.addSubscriber(contact.email, {
        status: 'subscribed',
        merge_fields: {
          FNAME: contact.firstName,
          LNAME: contact.lastName,
          USERTYPE: contact.userType
        }
      });

      await apiClient.addTags(contact.email, ['temporary-tag', 'physician']);

      // Remove specific tag
      await apiClient.removeTags(contact.email, ['temporary-tag']);

      const updated = await apiClient.getSubscriber(contact.email);
      const tagNames = updated.tags.map(tag => tag.name);

      expect(tagNames).not.toContain('temporary-tag');
      expect(tagNames).toContain('physician');
    });
  });

  describe('Segment Operations', () => {
    test('should create audience segments', async () => {
      const segment = await apiClient.createSegment({
        name: 'Test Physicians Segment',
        options: {
          match: 'all',
          conditions: [{
            condition_type: 'TextMerge',
            field: 'USERTYPE',
            op: 'is',
            value: 'physician'
          }]
        }
      });

      expect(segment.name).toBe('Test Physicians Segment');
      expect(segment).toHaveProperty('id');
      expect(segment.list_id).toBe(TEST_CONFIG.MAILCHIMP_AUDIENCE_ID);
    });

    test('should update segment member count correctly', async () => {
      // Add test physicians
      const physicians = testDataGenerator.generateContactBatch(3, { physician: 1 });

      for (const physician of physicians) {
        await apiClient.addSubscriber(physician.email, {
          status: 'subscribed',
          merge_fields: {
            FNAME: physician.firstName,
            LNAME: physician.lastName,
            USERTYPE: physician.userType
          }
        });
      }

      // Create segment
      const segment = await apiClient.createSegment({
        name: 'Physician Count Test',
        options: {
          match: 'all',
          conditions: [{
            condition_type: 'TextMerge',
            field: 'USERTYPE',
            op: 'is',
            value: 'physician'
          }]
        }
      });

      // Wait for segment to update (may take time in real API)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const updatedSegment = await apiClient.getSegment(segment.id);
      expect(updatedSegment.member_count).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Automation Operations', () => {
    test('should create automation workflow', async () => {
      const automation = await apiClient.createAutomation({
        recipients: {
          list_id: TEST_CONFIG.MAILCHIMP_AUDIENCE_ID,
          segment_opts: {
            match: 'all',
            conditions: [{
              condition_type: 'TextMerge',
              field: 'USERTYPE',
              op: 'is',
              value: 'physician'
            }]
          }
        },
        settings: {
          title: 'Test Physician Welcome',
          from_name: 'Test Sender',
          reply_to: 'test@example.com'
        },
        trigger_settings: {
          workflow_type: 'signup'
        }
      });

      expect(automation.settings.title).toBe('Test Physician Welcome');
      expect(automation.status).toBe('save');
      expect(automation).toHaveProperty('id');
    });

    test('should add email to automation workflow', async () => {
      // Create automation first
      const automation = await apiClient.createAutomation({
        settings: {
          title: 'Test Email Automation',
          from_name: 'Test Sender',
          reply_to: 'test@example.com'
        },
        recipients: {
          list_id: TEST_CONFIG.MAILCHIMP_AUDIENCE_ID
        }
      });

      // Add email to automation
      const email = await apiClient.addAutomationEmail(automation.id, {
        settings: {
          subject_line: 'Welcome to Ignite Health Systems',
          from_name: 'Dr. Bhaven Murji',
          reply_to: 'admin@ignitehealthsystems.com'
        },
        delay: {
          amount: 0,
          type: 'immediate'
        }
      });

      expect(email.settings.subject_line).toBe('Welcome to Ignite Health Systems');
      expect(email).toHaveProperty('id');
    });
  });

  describe('Error Handling', () => {
    test('should handle API rate limits gracefully', async () => {
      // Simulate rapid requests to trigger rate limiting
      const promises = [];
      for (let i = 0; i < 20; i++) {
        const contact = testDataGenerator.generateContact('physician');
        promises.push(apiClient.addSubscriber(contact.email, {
          status: 'subscribed',
          merge_fields: {
            FNAME: contact.firstName,
            LNAME: contact.lastName,
            USERTYPE: contact.userType
          }
        }));
      }

      // Should either succeed or handle rate limits gracefully
      const results = await Promise.allSettled(promises);
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      const errorCount = results.filter(r => r.status === 'rejected').length;

      // At least some should succeed, and errors should be rate limit related
      expect(successCount).toBeGreaterThan(0);
      if (errorCount > 0) {
        const errors = results
          .filter(r => r.status === 'rejected')
          .map(r => r.reason.message);

        errors.forEach(error => {
          expect(error).toMatch(/rate limit|too many requests/i);
        });
      }
    });

    test('should handle network timeouts', async () => {
      // Set short timeout for this test
      const originalTimeout = apiClient.timeout;
      apiClient.timeout = 100; // 100ms timeout

      const contact = testContacts.standardPhysician;

      try {
        await apiClient.addSubscriber(contact.email, {
          status: 'subscribed',
          merge_fields: {
            FNAME: contact.firstName,
            LNAME: contact.lastName
          }
        });
      } catch (error) {
        expect(error.message).toMatch(/timeout|ETIMEDOUT/i);
      } finally {
        apiClient.timeout = originalTimeout;
      }
    });

    test('should handle invalid API credentials', async () => {
      if (!TEST_CONFIG.USE_MOCK_API) {
        const invalidClient = new RealMailchimpAPIClient('invalid-api-key', 'us18');

        await expect(invalidClient.getAudiences()).rejects.toThrow(/unauthorized|invalid.*key/i);
      }
    });
  });

  describe('Performance Metrics', () => {
    test('should measure API response times', async () => {
      const contact = testContacts.standardPhysician;

      const startTime = Date.now();
      await apiClient.addSubscriber(contact.email, {
        status: 'subscribed',
        merge_fields: {
          FNAME: contact.firstName,
          LNAME: contact.lastName,
          USERTYPE: contact.userType
        }
      });
      const endTime = Date.now();

      const responseTime = endTime - startTime;

      // API response should be reasonable (under 5 seconds)
      expect(responseTime).toBeLessThan(5000);

      console.log(`API Response Time: ${responseTime}ms`);
    });

    test('should handle concurrent operations efficiently', async () => {
      const contacts = testDataGenerator.generateContactBatch(10);

      const startTime = Date.now();
      const promises = contacts.map(contact =>
        apiClient.addSubscriber(contact.email, {
          status: 'subscribed',
          merge_fields: {
            FNAME: contact.firstName,
            LNAME: contact.lastName,
            USERTYPE: contact.userType
          }
        })
      );

      await Promise.all(promises);
      const endTime = Date.now();

      const totalTime = endTime - startTime;
      const avgTimePerRequest = totalTime / contacts.length;

      console.log(`Concurrent Operations: ${totalTime}ms total, ${avgTimePerRequest}ms average`);

      // Should be more efficient than sequential operations
      expect(avgTimePerRequest).toBeLessThan(2000);
    });
  });
});

// Mock API Client for testing
class MockMailchimpAPIClient {
  constructor() {
    this.mockAPI = mockMailchimpAPI;
    this.timeout = 5000;
  }

  async addSubscriber(email, data) {
    return this.mockAPI.addSubscriber(email, data);
  }

  async getSubscriber(email) {
    return this.mockAPI.getSubscriber(email);
  }

  async updateSubscriber(email, updates) {
    return this.mockAPI.updateSubscriber(email, updates);
  }

  async deleteSubscriber(email) {
    this.mockAPI.deleteSubscriber(email);
    return { status: 'deleted' };
  }

  async batchOperation(operations) {
    let successful = 0;
    let errored = 0;

    for (const op of operations) {
      try {
        const body = JSON.parse(op.body);
        if (body.email_address && body.email_address.includes('@')) {
          this.mockAPI.addSubscriber(body.email_address, {
            status: body.status,
            merge_fields: body.merge_fields
          });
          successful++;
        } else {
          errored++;
        }
      } catch (error) {
        errored++;
      }
    }

    return {
      total_operations: operations.length,
      finished_operations: successful + errored,
      errored_operations: errored
    };
  }

  async addTags(email, tags) {
    const subscriber = this.mockAPI.getSubscriber(email);
    if (subscriber) {
      tags.forEach(tagName => {
        if (!subscriber.tags.some(tag => tag.name === tagName)) {
          subscriber.tags.push({ name: tagName, id: Math.random() });
        }
      });
    }
    return subscriber;
  }

  async removeTags(email, tags) {
    const subscriber = this.mockAPI.getSubscriber(email);
    if (subscriber) {
      subscriber.tags = subscriber.tags.filter(tag => !tags.includes(tag.name));
    }
    return subscriber;
  }

  async createSegment(segmentData) {
    return this.mockAPI.createSegment(segmentData);
  }

  async getSegment(segmentId) {
    return this.mockAPI.segments.get(segmentId);
  }

  async createAutomation(automationData) {
    return this.mockAPI.createAutomation(automationData);
  }

  async addAutomationEmail(automationId, emailData) {
    return {
      id: 'test-email-id',
      settings: emailData.settings,
      delay: emailData.delay
    };
  }

  async getAudiences() {
    return [{ id: TEST_CONFIG.MAILCHIMP_AUDIENCE_ID, name: 'Test Audience' }];
  }

  async cleanup() {
    this.mockAPI.reset();
  }
}

// Real API Client for integration testing
class RealMailchimpAPIClient {
  constructor(apiKey = TEST_CONFIG.MAILCHIMP_API_KEY, server = TEST_CONFIG.MAILCHIMP_SERVER) {
    this.apiKey = apiKey;
    this.server = server;
    this.baseURL = `https://${server}.api.mailchimp.com/3.0`;
    this.timeout = 10000;
    this.testEmails = new Set(); // Track test emails for cleanup
  }

  async makeRequest(method, endpoint, data = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(this.baseURL + endpoint);
      const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: method,
        headers: {
          'Authorization': `Basic ${Buffer.from(`anystring:${this.apiKey}`).toString('base64')}`,
          'Content-Type': 'application/json'
        },
        timeout: this.timeout
      };

      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', chunk => responseData += chunk);
        res.on('end', () => {
          try {
            const json = responseData ? JSON.parse(responseData) : {};
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(json);
            } else {
              reject(new Error(`API Error: ${res.statusCode} ${json.detail || json.title || responseData}`));
            }
          } catch (e) {
            reject(new Error(`Parse Error: ${e.message}`));
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      if (data) {
        req.write(JSON.stringify(data));
      }
      req.end();
    });
  }

  async addSubscriber(email, data) {
    this.testEmails.add(email);
    const emailHash = require('crypto').createHash('md5').update(email.toLowerCase()).digest('hex');

    try {
      return await this.makeRequest('PUT', `/lists/${TEST_CONFIG.MAILCHIMP_AUDIENCE_ID}/members/${emailHash}`, {
        email_address: email,
        status_if_new: data.status || 'subscribed',
        merge_fields: data.merge_fields || {}
      });
    } catch (error) {
      throw new Error(`Failed to add subscriber: ${error.message}`);
    }
  }

  async getSubscriber(email) {
    const emailHash = require('crypto').createHash('md5').update(email.toLowerCase()).digest('hex');

    try {
      return await this.makeRequest('GET', `/lists/${TEST_CONFIG.MAILCHIMP_AUDIENCE_ID}/members/${emailHash}`);
    } catch (error) {
      if (error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async updateSubscriber(email, updates) {
    const emailHash = require('crypto').createHash('md5').update(email.toLowerCase()).digest('hex');
    return await this.makeRequest('PATCH', `/lists/${TEST_CONFIG.MAILCHIMP_AUDIENCE_ID}/members/${emailHash}`, updates);
  }

  async deleteSubscriber(email) {
    const emailHash = require('crypto').createHash('md5').update(email.toLowerCase()).digest('hex');
    await this.makeRequest('DELETE', `/lists/${TEST_CONFIG.MAILCHIMP_AUDIENCE_ID}/members/${emailHash}`);
    this.testEmails.delete(email);
    return { status: 'deleted' };
  }

  async batchOperation(operations) {
    return await this.makeRequest('POST', '/batches', { operations });
  }

  async addTags(email, tags) {
    const emailHash = require('crypto').createHash('md5').update(email.toLowerCase()).digest('hex');
    const tagObjects = tags.map(name => ({ name, status: 'active' }));

    return await this.makeRequest('POST', `/lists/${TEST_CONFIG.MAILCHIMP_AUDIENCE_ID}/members/${emailHash}/tags`, {
      tags: tagObjects
    });
  }

  async removeTags(email, tags) {
    const emailHash = require('crypto').createHash('md5').update(email.toLowerCase()).digest('hex');
    const tagObjects = tags.map(name => ({ name, status: 'inactive' }));

    return await this.makeRequest('POST', `/lists/${TEST_CONFIG.MAILCHIMP_AUDIENCE_ID}/members/${emailHash}/tags`, {
      tags: tagObjects
    });
  }

  async createSegment(segmentData) {
    return await this.makeRequest('POST', `/lists/${TEST_CONFIG.MAILCHIMP_AUDIENCE_ID}/segments`, segmentData);
  }

  async getSegment(segmentId) {
    return await this.makeRequest('GET', `/lists/${TEST_CONFIG.MAILCHIMP_AUDIENCE_ID}/segments/${segmentId}`);
  }

  async createAutomation(automationData) {
    return await this.makeRequest('POST', '/automations', automationData);
  }

  async addAutomationEmail(automationId, emailData) {
    return await this.makeRequest('POST', `/automations/${automationId}/emails`, emailData);
  }

  async getAudiences() {
    const response = await this.makeRequest('GET', '/lists');
    return response.lists;
  }

  async cleanup() {
    // Clean up test subscribers
    const deletePromises = Array.from(this.testEmails).map(email =>
      this.deleteSubscriber(email).catch(() => {}) // Ignore errors during cleanup
    );

    await Promise.all(deletePromises);
    this.testEmails.clear();
  }
}