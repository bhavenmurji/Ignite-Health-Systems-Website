/**
 * Mock Mailchimp API for comprehensive testing
 * Simulates all Mailchimp API endpoints used by the automation
 */

class MockMailchimpAPI {
  constructor() {
    this.subscribers = new Map();
    this.automations = new Map();
    this.segments = new Map();
    this.mergeFields = new Map();
    this.tags = new Map();
    this.campaigns = new Map();
    this.webhooks = new Map();

    // Initialize default merge fields
    this.initializeDefaultMergeFields();
  }

  initializeDefaultMergeFields() {
    const defaultFields = [
      { tag: 'FNAME', name: 'First Name', type: 'text' },
      { tag: 'LNAME', name: 'Last Name', type: 'text' },
      { tag: 'USERTYPE', name: 'User Type', type: 'text' },
      { tag: 'SPECIALTY', name: 'Specialty', type: 'text' },
      { tag: 'PRACTICE', name: 'Practice Model', type: 'text' },
      { tag: 'EMR', name: 'EMR System', type: 'text' },
      { tag: 'CHALLENGE', name: 'Main Challenge', type: 'text' },
      { tag: 'COFOUNDER', name: 'Co-founder Interest', type: 'text' },
      { tag: 'LINKEDIN', name: 'LinkedIn URL', type: 'text' }
    ];

    defaultFields.forEach(field => {
      this.mergeFields.set(field.tag, field);
    });
  }

  // Subscriber Management
  addSubscriber(email, data = {}) {
    const emailHash = this.createEmailHash(email);
    const subscriber = {
      id: emailHash,
      email_address: email.toLowerCase(),
      status: data.status || 'subscribed',
      merge_fields: data.merge_fields || {},
      tags: data.tags || [],
      timestamp_signup: new Date().toISOString(),
      timestamp_opt: new Date().toISOString(),
      ip_signup: '127.0.0.1',
      ip_opt: '127.0.0.1',
      location: {
        latitude: 0,
        longitude: 0,
        gmtoff: 0,
        dstoff: 0,
        country_code: 'US',
        timezone: 'America/New_York'
      },
      stats: {
        avg_open_rate: 0,
        avg_click_rate: 0,
        ecommerce_data: {
          total_revenue: 0,
          number_of_orders: 0,
          currency_code: 'USD'
        }
      },
      list_id: '9884a65adf'
    };

    this.subscribers.set(emailHash, subscriber);

    // Simulate auto-tagging based on user type
    this.autoTagSubscriber(subscriber);

    return subscriber;
  }

  autoTagSubscriber(subscriber) {
    const userType = subscriber.merge_fields.USERTYPE;
    const cofounder = subscriber.merge_fields.COFOUNDER;

    if (userType === 'physician') {
      subscriber.tags.push({ name: 'physician', id: 1 });
      if (cofounder === 'Yes') {
        subscriber.tags.push({ name: 'cofounder-interest', id: 2 });
        subscriber.tags.push({ name: 'high-priority', id: 3 });
      } else {
        subscriber.tags.push({ name: 'standard', id: 4 });
      }
    } else if (userType === 'investor') {
      subscriber.tags.push({ name: 'investor', id: 5 });
      subscriber.tags.push({ name: 'standard', id: 4 });
    } else if (userType === 'specialist') {
      subscriber.tags.push({ name: 'specialist', id: 6 });
      subscriber.tags.push({ name: 'standard', id: 4 });
    }
  }

  getSubscriber(email) {
    const emailHash = this.createEmailHash(email);
    return this.subscribers.get(emailHash);
  }

  updateSubscriber(email, updates) {
    const subscriber = this.getSubscriber(email);
    if (subscriber) {
      Object.assign(subscriber, updates);
      return subscriber;
    }
    return null;
  }

  deleteSubscriber(email) {
    const emailHash = this.createEmailHash(email);
    return this.subscribers.delete(emailHash);
  }

  // Automation Management
  createAutomation(automationData) {
    const automation = {
      id: this.generateId(),
      status: 'save',
      emails: [],
      settings: automationData.settings || {},
      trigger_settings: automationData.trigger_settings || {},
      recipients: automationData.recipients || {},
      report_summary: {
        emails_sent: 0,
        opens: 0,
        clicks: 0,
        unsubscribes: 0
      },
      create_time: new Date().toISOString(),
      start_time: null
    };

    this.automations.set(automation.id, automation);
    return automation;
  }

  startAutomation(automationId) {
    const automation = this.automations.get(automationId);
    if (automation) {
      automation.status = 'sending';
      automation.start_time = new Date().toISOString();
      return automation;
    }
    return null;
  }

  // Segment Management
  createSegment(segmentData) {
    const segment = {
      id: this.generateId(),
      name: segmentData.name,
      member_count: 0,
      type: 'static',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      options: segmentData.options || {},
      list_id: '9884a65adf'
    };

    this.segments.set(segment.id, segment);
    this.updateSegmentMemberCount(segment.id);
    return segment;
  }

  updateSegmentMemberCount(segmentId) {
    const segment = this.segments.get(segmentId);
    if (!segment) return;

    let count = 0;
    for (const subscriber of this.subscribers.values()) {
      if (this.subscriberMatchesSegment(subscriber, segment.options)) {
        count++;
      }
    }

    segment.member_count = count;
    segment.updated_at = new Date().toISOString();
  }

  subscriberMatchesSegment(subscriber, options) {
    if (!options.conditions) return false;

    for (const condition of options.conditions) {
      if (condition.condition_type === 'TextMerge') {
        const fieldValue = subscriber.merge_fields[condition.field];
        if (condition.op === 'is' && fieldValue !== condition.value) {
          return false;
        }
      }
    }
    return true;
  }

  // Campaign Management
  createCampaign(campaignData) {
    const campaign = {
      id: this.generateId(),
      type: campaignData.type || 'regular',
      status: 'save',
      settings: campaignData.settings || {},
      recipients: campaignData.recipients || {},
      tracking: {
        opens: true,
        html_clicks: true,
        text_clicks: false,
        goal_tracking: false,
        ecomm360: false,
        google_analytics: '',
        clicktale: ''
      },
      report_summary: {
        opens: 0,
        clicks: 0,
        unsubscribes: 0,
        bounces: 0
      },
      create_time: new Date().toISOString(),
      send_time: null
    };

    this.campaigns.set(campaign.id, campaign);
    return campaign;
  }

  // Webhook Management
  createWebhook(webhookData) {
    const webhook = {
      id: this.generateId(),
      url: webhookData.url,
      events: webhookData.events || {},
      sources: webhookData.sources || {},
      list_id: webhookData.list_id || '9884a65adf'
    };

    this.webhooks.set(webhook.id, webhook);
    return webhook;
  }

  // Utility Methods
  createEmailHash(email) {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
  }

  generateId() {
    return Math.random().toString(36).substr(2, 10);
  }

  // Simulation Methods for Testing
  simulateEmailOpen(subscriberEmail, campaignId) {
    const subscriber = this.getSubscriber(subscriberEmail);
    const campaign = this.campaigns.get(campaignId);

    if (subscriber && campaign) {
      campaign.report_summary.opens++;
      subscriber.stats.avg_open_rate = Math.min(subscriber.stats.avg_open_rate + 0.1, 1.0);
      return true;
    }
    return false;
  }

  simulateEmailClick(subscriberEmail, campaignId) {
    const subscriber = this.getSubscriber(subscriberEmail);
    const campaign = this.campaigns.get(campaignId);

    if (subscriber && campaign) {
      campaign.report_summary.clicks++;
      subscriber.stats.avg_click_rate = Math.min(subscriber.stats.avg_click_rate + 0.05, 1.0);
      return true;
    }
    return false;
  }

  simulateUnsubscribe(subscriberEmail) {
    const subscriber = this.getSubscriber(subscriberEmail);
    if (subscriber) {
      subscriber.status = 'unsubscribed';
      return true;
    }
    return false;
  }

  // Test Helper Methods
  reset() {
    this.subscribers.clear();
    this.automations.clear();
    this.segments.clear();
    this.campaigns.clear();
    this.webhooks.clear();
    this.tags.clear();
    this.initializeDefaultMergeFields();
  }

  getStats() {
    return {
      subscribers: this.subscribers.size,
      automations: this.automations.size,
      segments: this.segments.size,
      campaigns: this.campaigns.size,
      webhooks: this.webhooks.size
    };
  }

  getAllSubscribers() {
    return Array.from(this.subscribers.values());
  }

  getSubscribersByTag(tagName) {
    return this.getAllSubscribers().filter(subscriber =>
      subscriber.tags.some(tag => tag.name === tagName)
    );
  }

  getSubscribersByUserType(userType) {
    return this.getAllSubscribers().filter(subscriber =>
      subscriber.merge_fields.USERTYPE === userType
    );
  }
}

// Export singleton instance for testing
const mockMailchimpAPI = new MockMailchimpAPI();

module.exports = {
  MockMailchimpAPI,
  mockMailchimpAPI
};