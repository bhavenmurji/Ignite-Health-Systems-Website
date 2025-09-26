/**
 * Contact List Management Utilities
 * Handles contact list operations, segmentation, and management
 */

import EmailUtils from './EmailUtils.js';

class ContactListManager {
  constructor(mailchimpClient) {
    this.mailchimp = mailchimpClient;
    this.segmentCache = new Map();
    this.listCache = new Map();
  }

  /**
   * Create and manage dynamic segments
   */
  async createDynamicSegment(listId, segmentName, conditions, options = {}) {
    try {
      const segmentData = {
        name: segmentName,
        static_segment: [],
        options: {
          match: options.match || 'all',
          conditions: this.formatSegmentConditions(conditions)
        }
      };

      const response = await this.mailchimp.client.post(`/lists/${listId}/segments`, segmentData);

      // Cache the segment
      this.segmentCache.set(`${listId}:${segmentName}`, {
        id: response.data.id,
        conditions,
        createdAt: new Date(),
        ...response.data
      });

      return response.data;

    } catch (error) {
      throw new Error(`Failed to create segment: ${error.message}`);
    }
  }

  /**
   * Update existing segment conditions
   */
  async updateSegment(listId, segmentId, newConditions, options = {}) {
    try {
      const updateData = {
        options: {
          match: options.match || 'all',
          conditions: this.formatSegmentConditions(newConditions)
        }
      };

      if (options.name) {
        updateData.name = options.name;
      }

      const response = await this.mailchimp.client.patch(
        `/lists/${listId}/segments/${segmentId}`,
        updateData
      );

      // Update cache
      const cacheKey = `${listId}:${segmentId}`;
      if (this.segmentCache.has(cacheKey)) {
        const cached = this.segmentCache.get(cacheKey);
        this.segmentCache.set(cacheKey, { ...cached, ...response.data });
      }

      return response.data;

    } catch (error) {
      throw new Error(`Failed to update segment: ${error.message}`);
    }
  }

  /**
   * Get segment members with pagination
   */
  async getSegmentMembers(listId, segmentId, options = {}) {
    try {
      const params = {
        count: options.count || 1000,
        offset: options.offset || 0,
        fields: options.fields || 'members.email_address,members.merge_fields,members.status'
      };

      const response = await this.mailchimp.client.get(
        `/lists/${listId}/segments/${segmentId}/members`,
        { params }
      );

      return {
        members: response.data.members,
        totalItems: response.data.total_items,
        hasMore: (options.offset || 0) + response.data.members.length < response.data.total_items
      };

    } catch (error) {
      throw new Error(`Failed to get segment members: ${error.message}`);
    }
  }

  /**
   * Batch add members to static segment
   */
  async addMembersToStaticSegment(listId, segmentId, emails) {
    const batchSize = 500;
    const results = [];

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);

      try {
        const memberData = batch.map(email => ({
          email_address: EmailUtils.normalizeEmail(email)
        }));

        const response = await this.mailchimp.client.post(
          `/lists/${listId}/segments/${segmentId}/members`,
          { members: memberData }
        );

        results.push({
          batch: Math.floor(i / batchSize) + 1,
          added: response.data.members_added,
          errors: response.data.errors || []
        });

      } catch (error) {
        results.push({
          batch: Math.floor(i / batchSize) + 1,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Remove members from static segment
   */
  async removeMembersFromStaticSegment(listId, segmentId, emails) {
    const results = [];

    for (const email of emails) {
      try {
        const subscriberHash = EmailUtils.getSubscriberHash(email);
        await this.mailchimp.client.delete(
          `/lists/${listId}/segments/${segmentId}/members/${subscriberHash}`
        );

        results.push({ email, success: true });

      } catch (error) {
        results.push({ email, success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Create audience-specific segments
   */
  async createAudienceSegments(listId, audienceType) {
    const segments = [];

    switch (audienceType) {
      case 'physician':
        segments.push(
          ...await this.createPhysicianSegments(listId)
        );
        break;

      case 'investor':
        segments.push(
          ...await this.createInvestorSegments(listId)
        );
        break;

      case 'investigator':
        segments.push(
          ...await this.createInvestigatorSegments(listId)
        );
        break;

      default:
        throw new Error(`Unknown audience type: ${audienceType}`);
    }

    return segments;
  }

  /**
   * Create physician-specific segments
   */
  async createPhysicianSegments(listId) {
    const segments = [];

    // By specialty
    const specialties = ['cardiology', 'oncology', 'neurology', 'pediatrics', 'surgery', 'emergency'];
    for (const specialty of specialties) {
      const segment = await this.createDynamicSegment(
        listId,
        `Physicians - ${specialty.charAt(0).toUpperCase() + specialty.slice(1)}`,
        [
          { field: 'SPECIALTY', operator: 'is', value: specialty },
          { field: 'STATUS', operator: 'is', value: 'active' }
        ]
      );
      segments.push(segment);
    }

    // By experience level
    const experienceLevels = [
      { name: 'Junior (0-2 years)', min: 0, max: 2 },
      { name: 'Mid-level (3-7 years)', min: 3, max: 7 },
      { name: 'Senior (8-15 years)', min: 8, max: 15 },
      { name: 'Expert (15+ years)', min: 15, max: 999 }
    ];

    for (const level of experienceLevels) {
      const conditions = [
        { field: 'EXPERIENCE', operator: 'greater', value: level.min - 1 },
        { field: 'STATUS', operator: 'is', value: 'active' }
      ];

      if (level.max < 999) {
        conditions.push({ field: 'EXPERIENCE', operator: 'less', value: level.max + 1 });
      }

      const segment = await this.createDynamicSegment(
        listId,
        `Physicians - ${level.name}`,
        conditions
      );
      segments.push(segment);
    }

    // High engagement physicians
    const highEngagement = await this.createDynamicSegment(
      listId,
      'Physicians - High Engagement',
      [
        { field: 'tags', operator: 'contains', value: 'high_performer' },
        { field: 'STATUS', operator: 'is', value: 'active' }
      ]
    );
    segments.push(highEngagement);

    return segments;
  }

  /**
   * Create investor-specific segments
   */
  async createInvestorSegments(listId) {
    const segments = [];

    // By investor type
    const investorTypes = ['angel', 'venture_capital', 'institutional', 'strategic', 'family_office'];
    for (const type of investorTypes) {
      const segment = await this.createDynamicSegment(
        listId,
        `Investors - ${type.replace('_', ' ').toUpperCase()}`,
        [
          { field: 'INV_TYPE', operator: 'is', value: type },
          { field: 'STATUS', operator: 'is', value: 'active' }
        ]
      );
      segments.push(segment);
    }

    // By investment tier
    const tiers = ['bronze', 'silver', 'gold', 'platinum'];
    for (const tier of tiers) {
      const segment = await this.createDynamicSegment(
        listId,
        `Investors - ${tier.toUpperCase()} Tier`,
        [
          { field: 'TIER', operator: 'is', value: tier },
          { field: 'STATUS', operator: 'is', value: 'active' }
        ]
      );
      segments.push(segment);
    }

    // By risk tolerance
    const riskLevels = ['low', 'medium', 'high'];
    for (const risk of riskLevels) {
      const segment = await this.createDynamicSegment(
        listId,
        `Investors - ${risk.toUpperCase()} Risk`,
        [
          { field: 'RISK_TOL', operator: 'is', value: risk },
          { field: 'STATUS', operator: 'is', value: 'active' }
        ]
      );
      segments.push(segment);
    }

    return segments;
  }

  /**
   * Create investigator-specific segments
   */
  async createInvestigatorSegments(listId) {
    const segments = [];

    // By investigator type
    const investigatorTypes = ['principal', 'sub', 'coordinator', 'research_nurse'];
    for (const type of investigatorTypes) {
      const segment = await this.createDynamicSegment(
        listId,
        `Investigators - ${type.replace('_', ' ').toUpperCase()}`,
        [
          { field: 'INV_TYPE', operator: 'is', value: type },
          { field: 'STATUS', operator: 'is', value: 'active' }
        ]
      );
      segments.push(segment);
    }

    // By compliance status
    const complianceStatuses = ['compliant', 'pending_verification', 'non_compliant'];
    for (const status of complianceStatuses) {
      const segment = await this.createDynamicSegment(
        listId,
        `Investigators - ${status.replace('_', ' ').toUpperCase()}`,
        [
          { field: 'COMPLIANCE', operator: 'is', value: status },
          { field: 'STATUS', operator: 'is', value: 'active' }
        ]
      );
      segments.push(segment);
    }

    // By performance level
    const performanceLevels = ['high_performer', 'good_performer', 'needs_improvement'];
    for (const level of performanceLevels) {
      const segment = await this.createDynamicSegment(
        listId,
        `Investigators - ${level.replace('_', ' ').toUpperCase()}`,
        [
          { field: 'tags', operator: 'contains', value: level },
          { field: 'STATUS', operator: 'is', value: 'active' }
        ]
      );
      segments.push(segment);
    }

    return segments;
  }

  /**
   * Clean and maintain contact lists
   */
  async cleanContactList(listId, options = {}) {
    const cleaningResults = {
      totalMembers: 0,
      cleaned: 0,
      bounced: 0,
      unsubscribed: 0,
      inactive: 0,
      duplicates: 0
    };

    try {
      // Get all members
      const members = await this.getAllListMembers(listId);
      cleaningResults.totalMembers = members.length;

      // Clean bounced emails
      if (options.removeBounced !== false) {
        const bounced = members.filter(member => member.status === 'cleaned');
        for (const member of bounced) {
          await this.removeMemberFromList(listId, member.email_address);
          cleaningResults.bounced++;
        }
      }

      // Remove unsubscribed members older than specified days
      if (options.removeOldUnsubscribed && options.unsubscribedDays) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - options.unsubscribedDays);

        const oldUnsubscribed = members.filter(member =>
          member.status === 'unsubscribed' &&
          new Date(member.timestamp_opt) < cutoffDate
        );

        for (const member of oldUnsubscribed) {
          await this.removeMemberFromList(listId, member.email_address);
          cleaningResults.unsubscribed++;
        }
      }

      // Identify inactive members (no engagement in X days)
      if (options.markInactive && options.inactiveDays) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - options.inactiveDays);

        const inactiveMembers = members.filter(member => {
          const lastChanged = new Date(member.last_changed);
          return member.status === 'subscribed' && lastChanged < cutoffDate;
        });

        for (const member of inactiveMembers) {
          await this.mailchimp.addTags(listId, member.email_address, ['inactive']);
          cleaningResults.inactive++;
        }
      }

      // Find and merge duplicates
      if (options.removeDuplicates !== false) {
        const duplicates = this.findDuplicateMembers(members);
        for (const duplicate of duplicates) {
          await this.mergeDuplicateMembers(listId, duplicate.keep, duplicate.remove);
          cleaningResults.duplicates++;
        }
      }

      cleaningResults.cleaned = cleaningResults.bounced + cleaningResults.unsubscribed + cleaningResults.duplicates;

      return cleaningResults;

    } catch (error) {
      throw new Error(`List cleaning failed: ${error.message}`);
    }
  }

  /**
   * Get all members from a list with pagination
   */
  async getAllListMembers(listId) {
    const allMembers = [];
    let offset = 0;
    const count = 1000;

    while (true) {
      const response = await this.mailchimp.client.get(`/lists/${listId}/members`, {
        params: { count, offset, status: 'subscribed,unsubscribed,cleaned,pending' }
      });

      allMembers.push(...response.data.members);

      if (response.data.members.length < count) {
        break;
      }

      offset += count;
    }

    return allMembers;
  }

  /**
   * Remove member from list
   */
  async removeMemberFromList(listId, email) {
    const subscriberHash = EmailUtils.getSubscriberHash(email);
    await this.mailchimp.client.delete(`/lists/${listId}/members/${subscriberHash}`);
  }

  /**
   * Find duplicate members
   */
  findDuplicateMembers(members) {
    const emailMap = new Map();
    const duplicates = [];

    for (const member of members) {
      const normalizedEmail = EmailUtils.normalizeEmail(member.email_address);

      if (emailMap.has(normalizedEmail)) {
        const existing = emailMap.get(normalizedEmail);

        // Keep the member with more recent activity
        const keepMember = new Date(member.last_changed) > new Date(existing.last_changed) ?
          member : existing;
        const removeMember = keepMember === member ? existing : member;

        duplicates.push({
          keep: keepMember.email_address,
          remove: removeMember.email_address
        });

        emailMap.set(normalizedEmail, keepMember);
      } else {
        emailMap.set(normalizedEmail, member);
      }
    }

    return duplicates;
  }

  /**
   * Merge duplicate members
   */
  async mergeDuplicateMembers(listId, keepEmail, removeEmail) {
    try {
      // Get data from both members
      const keepMember = await this.mailchimp.getMember(listId, keepEmail);
      const removeMember = await this.mailchimp.getMember(listId, removeEmail);

      // Merge tags and interests
      const mergedTags = [...new Set([
        ...keepMember.tags.map(tag => tag.name),
        ...removeMember.tags.map(tag => tag.name)
      ])];

      const mergedInterests = { ...keepMember.interests, ...removeMember.interests };

      // Update the member we're keeping
      await this.mailchimp.updateMember(listId, keepEmail, {
        tags: mergedTags.map(name => ({ name, status: 'active' })),
        interests: mergedInterests
      });

      // Remove the duplicate
      await this.removeMemberFromList(listId, removeEmail);

    } catch (error) {
      throw new Error(`Failed to merge duplicate members: ${error.message}`);
    }
  }

  /**
   * Format segment conditions for Mailchimp API
   */
  formatSegmentConditions(conditions) {
    return conditions.map(condition => {
      if (condition.field === 'tags') {
        return {
          condition_type: 'StaticSegment',
          field: 'static_segment',
          op: condition.operator === 'contains' ? 'static_is' : condition.operator,
          value: condition.value
        };
      }

      return {
        condition_type: 'MergeField',
        field: condition.field,
        op: this.mapOperator(condition.operator),
        value: condition.value
      };
    });
  }

  /**
   * Map custom operators to Mailchimp operators
   */
  mapOperator(operator) {
    const operatorMap = {
      'is': 'is',
      'is_not': 'not',
      'contains': 'contains',
      'not_contains': 'notcontain',
      'starts_with': 'starts',
      'ends_with': 'ends',
      'greater': 'greater',
      'less': 'less',
      'is_one_of': 'is_one_of'
    };

    return operatorMap[operator] || operator;
  }

  /**
   * Export segment data
   */
  async exportSegment(listId, segmentId, format = 'csv') {
    try {
      const members = await this.getSegmentMembers(listId, segmentId, { count: 10000 });

      if (format === 'csv') {
        return this.convertToCSV(members.members);
      } else if (format === 'json') {
        return JSON.stringify(members.members, null, 2);
      } else {
        throw new Error(`Unsupported export format: ${format}`);
      }

    } catch (error) {
      throw new Error(`Export failed: ${error.message}`);
    }
  }

  /**
   * Convert member data to CSV
   */
  convertToCSV(members) {
    if (members.length === 0) return '';

    // Get headers from first member
    const firstMember = members[0];
    const headers = ['email_address', 'status', ...Object.keys(firstMember.merge_fields || {})];

    // Create CSV content
    const csvRows = [headers.join(',')];

    for (const member of members) {
      const row = [
        member.email_address,
        member.status,
        ...headers.slice(2).map(header => member.merge_fields[header] || '')
      ];
      csvRows.push(row.map(field => `"${field}"`).join(','));
    }

    return csvRows.join('\n');
  }

  /**
   * Get list statistics
   */
  async getListStatistics(listId) {
    try {
      const list = await this.mailchimp.getList(listId);
      const segments = await this.mailchimp.client.get(`/lists/${listId}/segments`);

      return {
        totalMembers: list.stats.member_count,
        subscribedMembers: list.stats.member_count,
        unsubscribedMembers: list.stats.unsubscribe_count,
        cleanedMembers: list.stats.cleaned_count,
        averageOpenRate: list.stats.open_rate,
        averageClickRate: list.stats.click_rate,
        totalSegments: segments.data.segments.length,
        createdAt: list.date_created,
        lastActivity: list.stats.last_sub_date
      };

    } catch (error) {
      throw new Error(`Failed to get list statistics: ${error.message}`);
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.segmentCache.clear();
    this.listCache.clear();
  }
}

export default ContactListManager;