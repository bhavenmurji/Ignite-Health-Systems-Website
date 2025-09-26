/**
 * Email Utility Functions
 * Provides validation, formatting, and helper functions for email operations
 */

import crypto from 'crypto';

class EmailUtils {
  /**
   * Validate email address format
   */
  static validateEmail(email) {
    if (!email || typeof email !== 'string') {
      return false;
    }

    // Comprehensive email regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    return emailRegex.test(email.toLowerCase());
  }

  /**
   * Normalize email address
   */
  static normalizeEmail(email) {
    if (!this.validateEmail(email)) {
      throw new Error('Invalid email address');
    }

    return email.toLowerCase().trim();
  }

  /**
   * Generate subscriber hash for Mailchimp
   */
  static getSubscriberHash(email) {
    const normalizedEmail = this.normalizeEmail(email);
    return crypto.createHash('md5').update(normalizedEmail).digest('hex');
  }

  /**
   * Extract domain from email
   */
  static extractDomain(email) {
    const normalized = this.normalizeEmail(email);
    return normalized.split('@')[1];
  }

  /**
   * Check if email is from a disposable email provider
   */
  static isDisposableEmail(email) {
    const domain = this.extractDomain(email);

    // Common disposable email domains
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com',
      'temp-mail.org', 'throwaway.email', 'getnada.com', 'trashmail.com',
      'yopmail.com', 'maildrop.cc', 'mailnesia.com', 'sharklasers.com'
    ];

    return disposableDomains.includes(domain);
  }

  /**
   * Check if email is from an academic institution
   */
  static isAcademicEmail(email) {
    const domain = this.extractDomain(email);

    // Academic TLDs and common academic domains
    const academicPatterns = [
      /\.edu$/,
      /\.ac\./,
      /university\..*$/,
      /college\..*$/,
      /\.school$/,
      /hospital\..*$/,
      /research\..*$/
    ];

    return academicPatterns.some(pattern => pattern.test(domain));
  }

  /**
   * Format name for email personalization
   */
  static formatName(firstName, lastName) {
    const first = (firstName || '').trim();
    const last = (lastName || '').trim();

    if (!first && !last) {
      return 'there';
    }

    if (!last) {
      return this.capitalize(first);
    }

    if (!first) {
      return this.capitalize(last);
    }

    return `${this.capitalize(first)} ${this.capitalize(last)}`;
  }

  /**
   * Capitalize first letter of a string
   */
  static capitalize(str) {
    if (!str || typeof str !== 'string') {
      return '';
    }

    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Generate email subject line with personalization
   */
  static generateSubjectLine(template, data) {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  /**
   * Sanitize email content
   */
  static sanitizeContent(content) {
    if (!content || typeof content !== 'string') {
      return '';
    }

    // Remove potentially harmful HTML tags
    const dangerousTags = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    const iframeTags = /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi;
    const formTags = /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi;

    return content
      .replace(dangerousTags, '')
      .replace(iframeTags, '')
      .replace(formTags, '');
  }

  /**
   * Extract email addresses from text
   */
  static extractEmails(text) {
    if (!text || typeof text !== 'string') {
      return [];
    }

    const emailRegex = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g;
    const matches = text.match(emailRegex) || [];

    return matches
      .map(email => this.normalizeEmail(email))
      .filter((email, index, array) => array.indexOf(email) === index); // Remove duplicates
  }

  /**
   * Validate bulk email list
   */
  static validateEmailList(emails) {
    const results = {
      valid: [],
      invalid: [],
      duplicates: [],
      disposable: []
    };

    const seen = new Set();

    for (const email of emails) {
      try {
        const normalized = this.normalizeEmail(email);

        if (seen.has(normalized)) {
          results.duplicates.push(email);
          continue;
        }

        seen.add(normalized);

        if (!this.validateEmail(email)) {
          results.invalid.push(email);
          continue;
        }

        if (this.isDisposableEmail(email)) {
          results.disposable.push(email);
          continue;
        }

        results.valid.push(normalized);

      } catch (error) {
        results.invalid.push(email);
      }
    }

    return results;
  }

  /**
   * Format merge fields for Mailchimp
   */
  static formatMergeFields(data) {
    const mergeFields = {};

    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        // Convert key to uppercase (Mailchimp convention)
        const fieldName = key.toUpperCase();

        // Format different data types appropriately
        if (typeof data[key] === 'string') {
          mergeFields[fieldName] = data[key].trim();
        } else if (typeof data[key] === 'number') {
          mergeFields[fieldName] = data[key].toString();
        } else if (data[key] instanceof Date) {
          mergeFields[fieldName] = data[key].toISOString().split('T')[0];
        } else if (typeof data[key] === 'boolean') {
          mergeFields[fieldName] = data[key] ? 'yes' : 'no';
        } else {
          mergeFields[fieldName] = JSON.stringify(data[key]);
        }
      }
    });

    return mergeFields;
  }

  /**
   * Generate unsubscribe URL
   */
  static generateUnsubscribeUrl(email, listId, baseUrl) {
    const hash = crypto
      .createHash('sha256')
      .update(`${email}:${listId}:${process.env.UNSUBSCRIBE_SECRET || 'default-secret'}`)
      .digest('hex');

    const encodedEmail = encodeURIComponent(email);
    return `${baseUrl}/unsubscribe?email=${encodedEmail}&list=${listId}&hash=${hash}`;
  }

  /**
   * Verify unsubscribe URL
   */
  static verifyUnsubscribeUrl(email, listId, hash) {
    const expectedHash = crypto
      .createHash('sha256')
      .update(`${email}:${listId}:${process.env.UNSUBSCRIBE_SECRET || 'default-secret'}`)
      .digest('hex');

    return hash === expectedHash;
  }

  /**
   * Create email template variables
   */
  static createTemplateVariables(userData, companyData = {}) {
    const defaultCompany = {
      name: 'Ignite Health Systems',
      address: '123 Medical Center Dr, Suite 100',
      city: 'Boston',
      state: 'MA',
      zip: '02101',
      phone: '(555) 123-4567',
      website: 'https://ignitehealthsystems.com',
      ...companyData
    };

    return {
      // User variables
      first_name: userData.firstName || '',
      last_name: userData.lastName || '',
      full_name: this.formatName(userData.firstName, userData.lastName),
      email: userData.email || '',

      // Company variables
      company_name: defaultCompany.name,
      company_address: defaultCompany.address,
      company_city: defaultCompany.city,
      company_state: defaultCompany.state,
      company_zip: defaultCompany.zip,
      company_phone: defaultCompany.phone,
      company_website: defaultCompany.website,

      // Date variables
      current_date: new Date().toLocaleDateString(),
      current_year: new Date().getFullYear(),
      current_month: new Date().toLocaleDateString('en-US', { month: 'long' }),

      // Custom variables from userData
      ...userData
    };
  }

  /**
   * Format phone number
   */
  static formatPhoneNumber(phone) {
    if (!phone) return '';

    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');

    // Format US phone numbers
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

    if (digits.length === 11 && digits[0] === '1') {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }

    return phone; // Return original if can't format
  }

  /**
   * Create segmentation tags based on user data
   */
  static generateSegmentationTags(userData) {
    const tags = [];

    // Role-based tags
    if (userData.role) {
      tags.push(`role_${userData.role.toLowerCase().replace(/\s+/g, '_')}`);
    }

    // Specialty tags (for physicians)
    if (userData.specialty) {
      tags.push(`specialty_${userData.specialty.toLowerCase().replace(/\s+/g, '_')}`);
    }

    // Experience level tags
    if (userData.experienceYears !== undefined) {
      if (userData.experienceYears < 2) tags.push('experience_junior');
      else if (userData.experienceYears < 5) tags.push('experience_mid');
      else if (userData.experienceYears < 10) tags.push('experience_senior');
      else tags.push('experience_expert');
    }

    // Institution type tags
    if (userData.institution) {
      if (this.isAcademicEmail(userData.email)) {
        tags.push('institution_academic');
      } else {
        tags.push('institution_private');
      }
    }

    // Geographic tags
    if (userData.state) {
      tags.push(`state_${userData.state.toLowerCase()}`);
    }

    if (userData.country) {
      tags.push(`country_${userData.country.toLowerCase().replace(/\s+/g, '_')}`);
    }

    // Engagement tags
    tags.push('new_signup');
    tags.push(`signup_${new Date().getFullYear()}`);
    tags.push(`signup_${new Date().getFullYear()}_${String(new Date().getMonth() + 1).padStart(2, '0')}`);

    return tags;
  }

  /**
   * Calculate email engagement score
   */
  static calculateEngagementScore(emailStats) {
    const {
      opens = 0,
      clicks = 0,
      emailsSent = 1,
      unsubscribes = 0,
      bounces = 0
    } = emailStats;

    // Prevent division by zero
    if (emailsSent === 0) return 0;

    const openRate = opens / emailsSent;
    const clickRate = clicks / emailsSent;
    const unsubscribeRate = unsubscribes / emailsSent;
    const bounceRate = bounces / emailsSent;

    // Weighted engagement score (0-100)
    const score = Math.round(
      (openRate * 40) +
      (clickRate * 50) -
      (unsubscribeRate * 30) -
      (bounceRate * 20)
    );

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generate email preview text
   */
  static generatePreviewText(content, maxLength = 150) {
    if (!content) return '';

    // Remove HTML tags
    const textContent = content.replace(/<[^>]*>/g, ' ');

    // Remove extra whitespace
    const cleanText = textContent.replace(/\s+/g, ' ').trim();

    if (cleanText.length <= maxLength) {
      return cleanText;
    }

    // Truncate at word boundary
    const truncated = cleanText.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastSpace > maxLength * 0.8) {
      return truncated.substring(0, lastSpace) + '...';
    }

    return truncated + '...';
  }

  /**
   * Check email deliverability
   */
  static async checkDeliverability(email) {
    const results = {
      valid: false,
      disposable: false,
      role: false,
      domain: null,
      suggestions: []
    };

    try {
      results.valid = this.validateEmail(email);
      results.domain = this.extractDomain(email);
      results.disposable = this.isDisposableEmail(email);

      // Check for role-based emails
      const localPart = email.split('@')[0].toLowerCase();
      const roleKeywords = ['admin', 'info', 'support', 'noreply', 'sales', 'marketing', 'help'];
      results.role = roleKeywords.some(keyword => localPart.includes(keyword));

      // Generate domain suggestions for common typos
      results.suggestions = this.generateDomainSuggestions(results.domain);

    } catch (error) {
      // Handle error silently, return invalid result
    }

    return results;
  }

  /**
   * Generate domain suggestions for common typos
   */
  static generateDomainSuggestions(domain) {
    if (!domain) return [];

    const commonDomains = {
      'gmail.co': 'gmail.com',
      'gmial.com': 'gmail.com',
      'gmai.com': 'gmail.com',
      'yahoo.co': 'yahoo.com',
      'yahooo.com': 'yahoo.com',
      'hotmai.com': 'hotmail.com',
      'hotmial.com': 'hotmail.com',
      'outlok.com': 'outlook.com',
      'outloo.com': 'outlook.com'
    };

    const suggestions = [];

    if (commonDomains[domain]) {
      suggestions.push(commonDomains[domain]);
    }

    return suggestions;
  }
}

export default EmailUtils;