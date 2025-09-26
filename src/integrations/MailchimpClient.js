/**
 * Mailchimp API Client with authentication and rate limiting
 * Handles all Mailchimp operations with error handling and retry mechanisms
 */

import axios from 'axios';

class MailchimpClient {
  constructor(apiKey, serverPrefix = 'us10') {
    this.apiKey = apiKey;
    this.serverPrefix = serverPrefix;
    this.baseURL = `https://${serverPrefix}.api.mailchimp.com/3.0`;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    // Rate limiting: 10 requests per second max
    this.lastRequestTime = 0;
    this.minRequestInterval = 100; // 100ms between requests
    this.retryDelay = 1000; // 1 second initial retry delay
    this.maxRetries = 3;

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor for rate limiting
    this.client.interceptors.request.use(async (config) => {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;

      if (timeSinceLastRequest < this.minRequestInterval) {
        await this.sleep(this.minRequestInterval - timeSinceLastRequest);
      }

      this.lastRequestTime = Date.now();
      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config;

        // Don't retry if we've already retried max times
        if (!config._retryCount) {
          config._retryCount = 0;
        }

        if (config._retryCount >= this.maxRetries) {
          throw error;
        }

        // Retry on rate limit (429) or server errors (5xx)
        if (error.response?.status === 429 || (error.response?.status >= 500)) {
          config._retryCount++;
          const delay = this.retryDelay * Math.pow(2, config._retryCount - 1); // Exponential backoff

          console.log(`Retrying request in ${delay}ms (attempt ${config._retryCount}/${this.maxRetries})`);
          await this.sleep(delay);

          return this.client(config);
        }

        throw error;
      }
    );
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // List Management
  async getLists() {
    try {
      const response = await this.client.get('/lists');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get lists: ${error.message}`);
    }
  }

  async getList(listId) {
    try {
      const response = await this.client.get(`/lists/${listId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get list ${listId}: ${error.message}`);
    }
  }

  // Member Management
  async addMember(listId, memberData) {
    try {
      const response = await this.client.post(`/lists/${listId}/members`, {
        email_address: memberData.email,
        status: 'subscribed',
        merge_fields: memberData.mergeFields || {},
        tags: memberData.tags || [],
        interests: memberData.interests || {}
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.title === 'Member Exists') {
        // Member already exists, update instead
        return this.updateMember(listId, memberData.email, memberData);
      }
      throw new Error(`Failed to add member: ${error.message}`);
    }
  }

  async updateMember(listId, email, memberData) {
    try {
      const subscriberHash = this.getSubscriberHash(email);
      const response = await this.client.patch(`/lists/${listId}/members/${subscriberHash}`, {
        merge_fields: memberData.mergeFields || {},
        tags: memberData.tags || [],
        interests: memberData.interests || {}
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update member ${email}: ${error.message}`);
    }
  }

  async getMember(listId, email) {
    try {
      const subscriberHash = this.getSubscriberHash(email);
      const response = await this.client.get(`/lists/${listId}/members/${subscriberHash}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get member ${email}: ${error.message}`);
    }
  }

  // Tag Management
  async addTags(listId, email, tags) {
    try {
      const subscriberHash = this.getSubscriberHash(email);
      const response = await this.client.post(`/lists/${listId}/members/${subscriberHash}/tags`, {
        tags: tags.map(tag => ({ name: tag, status: 'active' }))
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to add tags to ${email}: ${error.message}`);
    }
  }

  async removeTags(listId, email, tags) {
    try {
      const subscriberHash = this.getSubscriberHash(email);
      const response = await this.client.post(`/lists/${listId}/members/${subscriberHash}/tags`, {
        tags: tags.map(tag => ({ name: tag, status: 'inactive' }))
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to remove tags from ${email}: ${error.message}`);
    }
  }

  // Campaign Management
  async createCampaign(campaignData) {
    try {
      const response = await this.client.post('/campaigns', campaignData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create campaign: ${error.message}`);
    }
  }

  async sendCampaign(campaignId) {
    try {
      const response = await this.client.post(`/campaigns/${campaignId}/actions/send`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to send campaign ${campaignId}: ${error.message}`);
    }
  }

  // Automation Management
  async getAutomations() {
    try {
      const response = await this.client.get('/automations');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get automations: ${error.message}`);
    }
  }

  async addSubscriberToAutomation(workflowId, email) {
    try {
      const response = await this.client.post(`/automations/${workflowId}/emails/subscribers`, {
        email_address: email
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to add subscriber to automation: ${error.message}`);
    }
  }

  // Utility Methods
  getSubscriberHash(email) {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Batch Operations
  async batchAddMembers(listId, members) {
    const batchSize = 500; // Mailchimp batch limit
    const results = [];

    for (let i = 0; i < members.length; i += batchSize) {
      const batch = members.slice(i, i + batchSize);

      try {
        const response = await this.client.post(`/lists/${listId}`, {
          members: batch.map(member => ({
            email_address: member.email,
            status: 'subscribed',
            merge_fields: member.mergeFields || {},
            tags: member.tags || []
          })),
          update_existing: true
        });

        results.push(response.data);
      } catch (error) {
        console.error(`Batch ${i / batchSize + 1} failed:`, error.message);
        results.push({ error: error.message, batch: i / batchSize + 1 });
      }
    }

    return results;
  }
}

export default MailchimpClient;