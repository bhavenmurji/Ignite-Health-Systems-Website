/**
 * Email Delivery Validator for Testing
 * Validates email content, delivery status, and engagement metrics
 */

const crypto = require('crypto');

class EmailValidator {
  constructor() {
    this.deliveredEmails = new Map();
    this.templates = new Map();
    this.engagementMetrics = new Map();
    this.deliveryRules = new Map();

    // Initialize default templates
    this.initializeDefaultTemplates();
  }

  initializeDefaultTemplates() {
    this.templates.set('physician-welcome', {
      subject: 'Welcome to Ignite Health Systems - Liberate Your Practice',
      requiredContent: [
        'EMR liberation',
        'documentation burden',
        'patient care',
        'burnout reduction',
        'Dr. Bhaven Murji'
      ],
      personalization: ['{{firstName}}', '{{specialty}}', '{{practiceModel}}'],
      cta: 'Schedule a Demo',
      tone: 'professional',
      maxLength: 2000
    });

    this.templates.set('investor-welcome', {
      subject: 'Healthcare Disruption Opportunity - Ignite Health Systems',
      requiredContent: [
        'market opportunity',
        'healthcare disruption',
        'ROI potential',
        'technology platform',
        'investment opportunity'
      ],
      personalization: ['{{firstName}}', '{{lastName}}'],
      cta: 'View Investment Details',
      tone: 'business',
      maxLength: 1500
    });

    this.templates.set('specialist-welcome', {
      subject: 'Collaborate with Ignite Health Systems',
      requiredContent: [
        'technology enhancement',
        'collaboration',
        'AI solutions',
        'healthcare innovation',
        'partnership'
      ],
      personalization: ['{{firstName}}', '{{specialty}}'],
      cta: 'Explore Partnership',
      tone: 'collaborative',
      maxLength: 1800
    });

    this.templates.set('cofounder-priority', {
      subject: 'Co-founder Opportunity - Ignite Health Systems',
      requiredContent: [
        'co-founder',
        'equity opportunity',
        'healthcare revolution',
        'immediate call',
        'leadership role'
      ],
      personalization: ['{{firstName}}', '{{specialty}}', '{{challenge}}'],
      cta: 'Schedule Immediate Call',
      tone: 'urgent',
      maxLength: 1200,
      priority: 'high'
    });
  }

  // Simulate email delivery
  simulateEmailDelivery(emailData) {
    const emailId = this.generateEmailId();
    const deliveryTimestamp = new Date().toISOString();

    const email = {
      id: emailId,
      to: emailData.to,
      from: emailData.from || 'admin@ignitehealthsystems.com',
      subject: emailData.subject,
      content: emailData.content,
      template: emailData.template,
      userType: emailData.userType,
      deliveryStatus: 'delivered',
      deliveryTimestamp,
      opens: 0,
      clicks: 0,
      bounced: false,
      unsubscribed: false,
      metadata: emailData.metadata || {}
    };

    // Apply delivery rules
    const deliveryRule = this.getDeliveryRule(emailData.to);
    if (deliveryRule) {
      email.deliveryStatus = deliveryRule.status;
      email.bounced = deliveryRule.bounce || false;
      email.deliveryDelay = deliveryRule.delay || 0;
    }

    this.deliveredEmails.set(emailId, email);
    return email;
  }

  // Validate email template content
  validateEmailTemplate(templateName, content, userType) {
    const template = this.templates.get(templateName);
    if (!template) {
      return {
        valid: false,
        errors: [`Template '${templateName}' not found`]
      };
    }

    const errors = [];
    const warnings = [];

    // Check required content
    for (const requiredText of template.requiredContent) {
      if (!content.toLowerCase().includes(requiredText.toLowerCase())) {
        errors.push(`Missing required content: "${requiredText}"`);
      }
    }

    // Check personalization tokens
    for (const token of template.personalization) {
      if (!content.includes(token)) {
        warnings.push(`Missing personalization token: "${token}"`);
      }
    }

    // Check CTA presence
    if (template.cta && !content.toLowerCase().includes(template.cta.toLowerCase())) {
      errors.push(`Missing call-to-action: "${template.cta}"`);
    }

    // Check length
    if (content.length > template.maxLength) {
      warnings.push(`Content exceeds recommended length: ${content.length}/${template.maxLength} characters`);
    }

    // Check tone appropriateness
    const toneCheck = this.validateTone(content, template.tone, userType);
    if (!toneCheck.appropriate) {
      warnings.push(`Tone mismatch: ${toneCheck.reason}`);
    }

    // Check for spam triggers
    const spamCheck = this.checkSpamTriggers(content);
    if (spamCheck.score > 0.7) {
      errors.push(`High spam score: ${spamCheck.score}. Triggers: ${spamCheck.triggers.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      spamScore: spamCheck.score,
      toneScore: toneCheck.score
    };
  }

  // Validate tone appropriateness
  validateTone(content, expectedTone, userType) {
    const toneKeywords = {
      professional: ['professional', 'practice', 'clinical', 'medical', 'healthcare', 'expertise'],
      business: ['opportunity', 'investment', 'market', 'ROI', 'business', 'revenue'],
      collaborative: ['partnership', 'collaboration', 'together', 'innovation', 'shared'],
      urgent: ['immediate', 'urgent', 'priority', 'exclusive', 'limited', 'now']
    };

    const contentLower = content.toLowerCase();
    const expectedKeywords = toneKeywords[expectedTone] || [];

    let score = 0;
    let matchedKeywords = 0;

    for (const keyword of expectedKeywords) {
      if (contentLower.includes(keyword)) {
        matchedKeywords++;
        score += 1;
      }
    }

    score = matchedKeywords / expectedKeywords.length;

    // User type specific adjustments
    if (userType === 'physician' && expectedTone === 'professional') {
      if (contentLower.includes('emr') || contentLower.includes('documentation')) {
        score += 0.2;
      }
    }

    if (userType === 'investor' && expectedTone === 'business') {
      if (contentLower.includes('disruption') || contentLower.includes('market opportunity')) {
        score += 0.2;
      }
    }

    return {
      appropriate: score >= 0.6,
      score: Math.min(score, 1.0),
      reason: score < 0.6 ? `Low tone match score: ${score.toFixed(2)}` : 'Appropriate tone'
    };
  }

  // Check for spam triggers
  checkSpamTriggers(content) {
    const spamTriggers = [
      'free money', 'guaranteed income', 'make money fast', 'no obligation',
      'urgent action required', 'limited time', 'act now', 'click here now',
      'amazing opportunity', 'incredible deal', 'once in a lifetime',
      'congratulations', 'you have won', 'claim your prize',
      'work from home', 'earn extra cash', 'financial freedom'
    ];

    const contentLower = content.toLowerCase();
    const foundTriggers = [];
    let score = 0;

    for (const trigger of spamTriggers) {
      if (contentLower.includes(trigger)) {
        foundTriggers.push(trigger);
        score += 0.1;
      }
    }

    // Additional checks
    const exclamationCount = (content.match(/!/g) || []).length;
    if (exclamationCount > 3) {
      foundTriggers.push('excessive exclamation marks');
      score += 0.2;
    }

    const capsCount = (content.match(/[A-Z]/g) || []).length;
    const totalChars = content.length;
    if (capsCount / totalChars > 0.3) {
      foundTriggers.push('excessive capital letters');
      score += 0.3;
    }

    return {
      score: Math.min(score, 1.0),
      triggers: foundTriggers
    };
  }

  // Validate email personalization
  validatePersonalization(content, userData) {
    const errors = [];
    const replacements = new Map();

    // Expected personalization tokens
    const tokens = {
      '{{firstName}}': userData.firstName,
      '{{lastName}}': userData.lastName,
      '{{email}}': userData.email,
      '{{userType}}': userData.userType,
      '{{specialty}}': userData.specialty || userData.medicalSpecialty,
      '{{practiceModel}}': userData.practiceModel,
      '{{emrSystem}}': userData.emrSystem || userData.currentEMR,
      '{{challenge}}': userData.challenge,
      '{{linkedin}}': userData.linkedin || userData.linkedinProfile
    };

    // Check for unreplaced tokens
    for (const [token, value] of Object.entries(tokens)) {
      if (content.includes(token)) {
        if (!value) {
          errors.push(`Token ${token} found but no data available`);
        } else {
          replacements.set(token, value);
        }
      }
    }

    // Replace tokens with actual values
    let personalizedContent = content;
    for (const [token, value] of replacements) {
      personalizedContent = personalizedContent.replace(new RegExp(token, 'g'), value);
    }

    // Check for generic greetings
    if (personalizedContent.includes('Dear Customer') ||
        personalizedContent.includes('Hello there') ||
        personalizedContent.includes('Dear Friend')) {
      errors.push('Generic greeting detected - should be personalized');
    }

    return {
      valid: errors.length === 0,
      errors,
      personalizedContent,
      tokensReplaced: replacements.size
    };
  }

  // Simulate email engagement
  simulateEmailEngagement(emailId, engagementType) {
    const email = this.deliveredEmails.get(emailId);
    if (!email) {
      throw new Error(`Email ${emailId} not found`);
    }

    const timestamp = new Date().toISOString();

    switch (engagementType) {
      case 'open':
        email.opens++;
        email.firstOpenTime = email.firstOpenTime || timestamp;
        email.lastOpenTime = timestamp;
        break;

      case 'click':
        email.clicks++;
        email.firstClickTime = email.firstClickTime || timestamp;
        email.lastClickTime = timestamp;
        break;

      case 'unsubscribe':
        email.unsubscribed = true;
        email.unsubscribeTime = timestamp;
        break;

      case 'bounce':
        email.bounced = true;
        email.bounceTime = timestamp;
        email.deliveryStatus = 'bounced';
        break;

      case 'spam':
        email.markedSpam = true;
        email.spamTime = timestamp;
        break;
    }

    // Update engagement metrics
    this.updateEngagementMetrics(email.userType, engagementType);

    return email;
  }

  // Update engagement metrics by user type
  updateEngagementMetrics(userType, engagementType) {
    if (!this.engagementMetrics.has(userType)) {
      this.engagementMetrics.set(userType, {
        opens: 0,
        clicks: 0,
        unsubscribes: 0,
        bounces: 0,
        spam: 0,
        delivered: 0
      });
    }

    const metrics = this.engagementMetrics.get(userType);

    if (engagementType === 'open') metrics.opens++;
    else if (engagementType === 'click') metrics.clicks++;
    else if (engagementType === 'unsubscribe') metrics.unsubscribes++;
    else if (engagementType === 'bounce') metrics.bounces++;
    else if (engagementType === 'spam') metrics.spam++;
    else if (engagementType === 'delivered') metrics.delivered++;
  }

  // Get engagement statistics
  getEngagementStats(userType = null) {
    if (userType) {
      const metrics = this.engagementMetrics.get(userType);
      if (!metrics) return null;

      return {
        userType,
        openRate: metrics.delivered > 0 ? metrics.opens / metrics.delivered : 0,
        clickRate: metrics.delivered > 0 ? metrics.clicks / metrics.delivered : 0,
        unsubscribeRate: metrics.delivered > 0 ? metrics.unsubscribes / metrics.delivered : 0,
        bounceRate: metrics.delivered > 0 ? metrics.bounces / metrics.delivered : 0,
        spamRate: metrics.delivered > 0 ? metrics.spam / metrics.delivered : 0,
        ...metrics
      };
    }

    // Return aggregated stats for all user types
    const aggregate = { opens: 0, clicks: 0, unsubscribes: 0, bounces: 0, spam: 0, delivered: 0 };

    for (const metrics of this.engagementMetrics.values()) {
      aggregate.opens += metrics.opens;
      aggregate.clicks += metrics.clicks;
      aggregate.unsubscribes += metrics.unsubscribes;
      aggregate.bounces += metrics.bounces;
      aggregate.spam += metrics.spam;
      aggregate.delivered += metrics.delivered;
    }

    return {
      userType: 'all',
      openRate: aggregate.delivered > 0 ? aggregate.opens / aggregate.delivered : 0,
      clickRate: aggregate.delivered > 0 ? aggregate.clicks / aggregate.delivered : 0,
      unsubscribeRate: aggregate.delivered > 0 ? aggregate.unsubscribes / aggregate.delivered : 0,
      bounceRate: aggregate.delivered > 0 ? aggregate.bounces / aggregate.delivered : 0,
      spamRate: aggregate.delivered > 0 ? aggregate.spam / aggregate.delivered : 0,
      ...aggregate
    };
  }

  // Validate email deliverability
  validateDeliverability(emailData) {
    const issues = [];
    const recommendations = [];

    // Check sender reputation
    if (!emailData.from.includes('ignitehealthsystems.com')) {
      issues.push('Sender domain mismatch - should use official domain');
    }

    // Check subject line
    if (!emailData.subject || emailData.subject.length === 0) {
      issues.push('Missing subject line');
    } else if (emailData.subject.length > 50) {
      recommendations.push('Subject line is long - consider shortening for mobile display');
    }

    // Check content-to-image ratio
    const imageCount = (emailData.content.match(/<img/g) || []).length;
    const textLength = emailData.content.replace(/<[^>]*>/g, '').length;

    if (imageCount > 0 && textLength / imageCount < 100) {
      issues.push('High image-to-text ratio may trigger spam filters');
    }

    // Check for authentication headers
    if (!emailData.headers || !emailData.headers['DKIM-Signature']) {
      recommendations.push('Add DKIM signature for better deliverability');
    }

    // Check unsubscribe link
    if (!emailData.content.toLowerCase().includes('unsubscribe')) {
      issues.push('Missing unsubscribe link - required by law');
    }

    return {
      deliverable: issues.length === 0,
      issues,
      recommendations,
      score: Math.max(0, 1 - (issues.length * 0.2) - (recommendations.length * 0.1))
    };
  }

  // Set delivery rules for testing
  setDeliveryRule(emailPattern, rule) {
    this.deliveryRules.set(emailPattern, rule);
  }

  getDeliveryRule(email) {
    for (const [pattern, rule] of this.deliveryRules) {
      if (email.includes(pattern) || pattern === '*') {
        return rule;
      }
    }
    return null;
  }

  // Get all delivered emails
  getDeliveredEmails(filter = {}) {
    const emails = Array.from(this.deliveredEmails.values());

    return emails.filter(email => {
      for (const [key, value] of Object.entries(filter)) {
        if (email[key] !== value) {
          return false;
        }
      }
      return true;
    });
  }

  // Clear all data
  reset() {
    this.deliveredEmails.clear();
    this.engagementMetrics.clear();
    this.deliveryRules.clear();
  }

  // Generate unique email ID
  generateEmailId() {
    return crypto.randomBytes(16).toString('hex');
  }

  // Validation summary for multiple emails
  validateEmailBatch(emails) {
    const results = {
      total: emails.length,
      valid: 0,
      invalid: 0,
      warnings: 0,
      errors: [],
      summary: {}
    };

    for (const email of emails) {
      const validation = this.validateEmailTemplate(
        email.template,
        email.content,
        email.userType
      );

      if (validation.valid) {
        results.valid++;
      } else {
        results.invalid++;
        results.errors.push(...validation.errors);
      }

      if (validation.warnings && validation.warnings.length > 0) {
        results.warnings++;
      }

      // Track by template
      if (!results.summary[email.template]) {
        results.summary[email.template] = { valid: 0, invalid: 0, total: 0 };
      }
      results.summary[email.template].total++;
      if (validation.valid) {
        results.summary[email.template].valid++;
      } else {
        results.summary[email.template].invalid++;
      }
    }

    return results;
  }
}

// Export
module.exports = {
  EmailValidator
};