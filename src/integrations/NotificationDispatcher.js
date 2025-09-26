/**
 * Event-Driven Notification Dispatcher
 * Coordinates notifications across all audience types and manages event routing
 */

import { EventEmitter } from 'events';
import PhysicianAutomation from '../automations/PhysicianAutomation.js';
import InvestorNotification from '../automations/InvestorNotification.js';
import InvestigatorWorkflow from '../automations/InvestigatorWorkflow.js';

class NotificationDispatcher extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;

    // Initialize automation modules
    this.physicianAutomation = new PhysicianAutomation(config.physician);
    this.investorNotification = new InvestorNotification(config.investor);
    this.investigatorWorkflow = new InvestigatorWorkflow(config.investigator);

    // Event routing configuration
    this.eventRoutes = {
      // User registration events
      'user.physician.registered': ['physician'],
      'user.investor.registered': ['investor'],
      'user.investigator.registered': ['investigator'],

      // Study events
      'study.created': ['physician', 'investigator'],
      'study.enrollment.opened': ['physician', 'investigator'],
      'study.milestone.reached': ['investor', 'investigator'],
      'study.completed': ['investor', 'investigator'],
      'study.results.available': ['investor', 'physician'],

      // Clinical events
      'protocol.updated': ['investigator'],
      'safety.alert': ['investigator', 'physician'],
      'recruitment.milestone': ['investigator'],
      'adverse.event': ['investigator'],

      // Business events
      'funding.round.completed': ['investor'],
      'company.milestone': ['investor'],
      'financial.report': ['investor'],
      'risk.alert': ['investor'],

      // Engagement events
      'email.opened': ['all'],
      'email.clicked': ['all'],
      'unsubscribe.requested': ['all']
    };

    // Priority levels for different event types
    this.eventPriorities = {
      'safety.alert': 'critical',
      'adverse.event': 'critical',
      'risk.alert': 'high',
      'protocol.updated': 'high',
      'study.enrollment.opened': 'medium',
      'funding.round.completed': 'medium',
      'email.engagement': 'low'
    };

    this.setupEventListeners();
    this.initializeMetrics();
  }

  /**
   * Setup event listeners for all automation modules
   */
  setupEventListeners() {
    // Physician automation events
    this.physicianAutomation.on('physician_registered', (data) => {
      this.trackEvent('physician.registered', data);
    });

    this.physicianAutomation.on('study_notification_sent', (data) => {
      this.trackEvent('physician.study_notification', data);
    });

    this.physicianAutomation.on('engagement_tracked', (data) => {
      this.trackEvent('physician.engagement', data);
    });

    // Investor notification events
    this.investorNotification.on('investor_registered', (data) => {
      this.trackEvent('investor.registered', data);
    });

    this.investorNotification.on('milestone_alert_sent', (data) => {
      this.trackEvent('investor.milestone_alert', data);
    });

    this.investorNotification.on('monthly_report_sent', (data) => {
      this.trackEvent('investor.monthly_report', data);
    });

    // Investigator workflow events
    this.investigatorWorkflow.on('investigator_registered', (data) => {
      this.trackEvent('investigator.registered', data);
    });

    this.investigatorWorkflow.on('study_invitation_sent', (data) => {
      this.trackEvent('investigator.study_invitation', data);
    });

    this.investigatorWorkflow.on('safety_update_sent', (data) => {
      this.trackEvent('investigator.safety_update', data);
    });
  }

  /**
   * Initialize metrics tracking
   */
  initializeMetrics() {
    this.metrics = {
      eventsProcessed: 0,
      notificationsSent: 0,
      errors: 0,
      averageProcessingTime: 0,
      eventsByType: {},
      audienceEngagement: {
        physician: { sent: 0, opened: 0, clicked: 0 },
        investor: { sent: 0, opened: 0, clicked: 0 },
        investigator: { sent: 0, opened: 0, clicked: 0 }
      }
    };
  }

  /**
   * Main event dispatcher method
   */
  async dispatchEvent(eventType, eventData, options = {}) {
    const startTime = Date.now();

    try {
      // Validate event
      this.validateEvent(eventType, eventData);

      // Get target audiences for this event type
      const targetAudiences = this.getTargetAudiences(eventType, options.audiences);

      // Determine priority
      const priority = this.getEventPriority(eventType, options.priority);

      // Process event for each target audience
      const results = await Promise.allSettled(
        targetAudiences.map(audience =>
          this.processEventForAudience(eventType, eventData, audience, priority)
        )
      );

      // Track success/failure rates
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      // Update metrics
      this.updateMetrics(eventType, successful, failed, Date.now() - startTime);

      // Emit completion event
      this.emit('event.processed', {
        eventType,
        targetAudiences,
        successful,
        failed,
        processingTime: Date.now() - startTime
      });

      return {
        success: true,
        eventType,
        targetAudiences,
        results: results.map((r, i) => ({
          audience: targetAudiences[i],
          status: r.status,
          result: r.status === 'fulfilled' ? r.value : r.reason
        }))
      };

    } catch (error) {
      this.metrics.errors++;
      this.emit('event.error', { eventType, error: error.message });
      throw new Error(`Event dispatch failed: ${error.message}`);
    }
  }

  /**
   * Process event for specific audience
   */
  async processEventForAudience(eventType, eventData, audience, priority) {
    const processingStartTime = Date.now();

    try {
      let result;

      switch (audience) {
        case 'physician':
          result = await this.handlePhysicianEvent(eventType, eventData);
          break;
        case 'investor':
          result = await this.handleInvestorEvent(eventType, eventData);
          break;
        case 'investigator':
          result = await this.handleInvestigatorEvent(eventType, eventData);
          break;
        default:
          throw new Error(`Unknown audience: ${audience}`);
      }

      // Track audience-specific metrics
      this.metrics.audienceEngagement[audience].sent++;

      this.emit('audience.notification.sent', {
        audience,
        eventType,
        result,
        processingTime: Date.now() - processingStartTime
      });

      return result;

    } catch (error) {
      this.emit('audience.notification.error', {
        audience,
        eventType,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Handle physician-specific events
   */
  async handlePhysicianEvent(eventType, eventData) {
    switch (eventType) {
      case 'user.physician.registered':
        return await this.physicianAutomation.registerPhysician(eventData);

      case 'study.created':
      case 'study.enrollment.opened':
        return await this.physicianAutomation.notifyPhysiciansOfNewStudy(eventData);

      case 'study.results.available':
        return await this.physicianAutomation.sendMonthlyUpdate();

      case 'safety.alert':
        return await this.physicianAutomation.trackEngagement(
          eventData.email, 'safety_alert', eventData
        );

      case 'email.opened':
        return await this.physicianAutomation.trackEngagement(
          eventData.email, 'email_opened', eventData
        );

      case 'email.clicked':
        return await this.physicianAutomation.trackEngagement(
          eventData.email, 'email_clicked', eventData
        );

      default:
        throw new Error(`Unhandled physician event: ${eventType}`);
    }
  }

  /**
   * Handle investor-specific events
   */
  async handleInvestorEvent(eventType, eventData) {
    switch (eventType) {
      case 'user.investor.registered':
        return await this.investorNotification.registerInvestor(eventData);

      case 'study.milestone.reached':
      case 'company.milestone':
        return await this.investorNotification.sendMilestoneAlert(eventData);

      case 'funding.round.completed':
        return await this.investorNotification.sendFundingUpdate(eventData);

      case 'study.results.available':
        return await this.investorNotification.sendStudyResults(eventData);

      case 'financial.report':
        return await this.investorNotification.sendMonthlyReport(eventData);

      case 'risk.alert':
        return await this.investorNotification.sendRiskAlert(eventData);

      default:
        throw new Error(`Unhandled investor event: ${eventType}`);
    }
  }

  /**
   * Handle investigator-specific events
   */
  async handleInvestigatorEvent(eventType, eventData) {
    switch (eventType) {
      case 'user.investigator.registered':
        return await this.investigatorWorkflow.registerInvestigator(eventData);

      case 'study.created':
      case 'study.enrollment.opened':
        return await this.investigatorWorkflow.sendStudyInvitation(
          eventData, eventData.investigatorCriteria
        );

      case 'protocol.updated':
        return await this.investigatorWorkflow.sendProtocolUpdate(eventData);

      case 'safety.alert':
      case 'adverse.event':
        return await this.investigatorWorkflow.sendSafetyUpdate(eventData);

      case 'recruitment.milestone':
        return await this.investigatorWorkflow.sendRecruitmentAlert(eventData);

      case 'study.milestone.reached':
        return await this.investigatorWorkflow.updateInvestigatorStudyStatus(
          eventData.investigatorEmail, eventData.studyId, 'milestone_reached'
        );

      default:
        throw new Error(`Unhandled investigator event: ${eventType}`);
    }
  }

  /**
   * Validate event structure
   */
  validateEvent(eventType, eventData) {
    if (!eventType || typeof eventType !== 'string') {
      throw new Error('Event type is required and must be a string');
    }

    if (!eventData || typeof eventData !== 'object') {
      throw new Error('Event data is required and must be an object');
    }

    // Event-specific validation
    const requiredFields = this.getRequiredFields(eventType);
    for (const field of requiredFields) {
      if (!(field in eventData)) {
        throw new Error(`Required field '${field}' missing for event type '${eventType}'`);
      }
    }
  }

  /**
   * Get required fields for event type
   */
  getRequiredFields(eventType) {
    const fieldMap = {
      'user.physician.registered': ['email', 'firstName', 'lastName', 'specialty'],
      'user.investor.registered': ['email', 'firstName', 'lastName', 'investorType'],
      'user.investigator.registered': ['email', 'firstName', 'lastName', 'investigatorType'],
      'study.created': ['studyId', 'title', 'specialty'],
      'study.milestone.reached': ['studyId', 'milestoneId', 'title'],
      'funding.round.completed': ['roundType', 'amountRaised'],
      'safety.alert': ['studyId', 'severity', 'description'],
      'protocol.updated': ['studyId', 'protocolVersion', 'changes']
    };

    return fieldMap[eventType] || [];
  }

  /**
   * Get target audiences for event type
   */
  getTargetAudiences(eventType, customAudiences) {
    if (customAudiences && Array.isArray(customAudiences)) {
      return customAudiences;
    }

    const audiences = this.eventRoutes[eventType];
    if (!audiences) {
      throw new Error(`No routing configuration found for event type: ${eventType}`);
    }

    return audiences.includes('all') ? ['physician', 'investor', 'investigator'] : audiences;
  }

  /**
   * Get event priority
   */
  getEventPriority(eventType, customPriority) {
    if (customPriority) {
      return customPriority;
    }

    return this.eventPriorities[eventType] || 'medium';
  }

  /**
   * Update metrics
   */
  updateMetrics(eventType, successful, failed, processingTime) {
    this.metrics.eventsProcessed++;
    this.metrics.notificationsSent += successful;
    this.metrics.errors += failed;

    // Update average processing time
    const totalEvents = this.metrics.eventsProcessed;
    this.metrics.averageProcessingTime =
      ((this.metrics.averageProcessingTime * (totalEvents - 1)) + processingTime) / totalEvents;

    // Update events by type
    this.metrics.eventsByType[eventType] = (this.metrics.eventsByType[eventType] || 0) + 1;
  }

  /**
   * Track event for analytics
   */
  trackEvent(eventName, eventData) {
    this.emit('analytics.track', {
      event: eventName,
      data: eventData,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Batch process multiple events
   */
  async batchDispatch(events, options = {}) {
    const batchSize = options.batchSize || 10;
    const results = [];

    for (let i = 0; i < events.length; i += batchSize) {
      const batch = events.slice(i, i + batchSize);

      const batchResults = await Promise.allSettled(
        batch.map(event =>
          this.dispatchEvent(event.type, event.data, event.options)
        )
      );

      results.push(...batchResults);

      // Add delay between batches to prevent rate limiting
      if (i + batchSize < events.length) {
        await new Promise(resolve => setTimeout(resolve, options.batchDelay || 1000));
      }
    }

    this.emit('batch.completed', {
      totalEvents: events.length,
      successful: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length
    });

    return results;
  }

  /**
   * Get current metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Register webhook endpoint for external events
   */
  registerWebhookHandler(eventType, handler) {
    this.on(`webhook.${eventType}`, async (data) => {
      try {
        const processedData = await handler(data);
        await this.dispatchEvent(eventType, processedData);
      } catch (error) {
        this.emit('webhook.error', { eventType, error: error.message });
      }
    });
  }

  /**
   * Process webhook payload
   */
  async processWebhook(eventType, payload, signature) {
    // Verify webhook signature if provided
    if (signature && this.config.webhookSecret) {
      this.verifyWebhookSignature(payload, signature);
    }

    this.emit(`webhook.${eventType}`, payload);

    return { success: true, eventType, timestamp: new Date().toISOString() };
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload, signature) {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', this.config.webhookSecret)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (signature !== expectedSignature) {
      throw new Error('Invalid webhook signature');
    }
  }
}

export default NotificationDispatcher;