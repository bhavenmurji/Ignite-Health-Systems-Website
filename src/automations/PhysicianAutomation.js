/**
 * Physician Automation Module
 * Handles physician onboarding, engagement, and notification workflows
 */

import MailchimpClient from '../integrations/MailchimpClient.js';
import { EventEmitter } from 'events';

class PhysicianAutomation extends EventEmitter {
  constructor(config) {
    super();
    this.mailchimp = new MailchimpClient(config.mailchimpApiKey, config.serverPrefix);
    this.physicianListId = config.physicianListId;
    this.config = config;

    // Physician-specific templates and workflows
    this.templates = {
      welcome: 'physician_welcome_template',
      onboarding: 'physician_onboarding_series',
      studyAlert: 'new_study_alert',
      monthlyUpdate: 'physician_monthly_update',
      cmeOpportunity: 'cme_opportunity_alert',
      researchInvitation: 'research_invitation'
    };

    this.automationWorkflows = {
      onboarding: config.onboardingWorkflowId,
      engagement: config.engagementWorkflowId,
      retention: config.retentionWorkflowId
    };

    this.segments = {
      specialties: ['cardiology', 'oncology', 'neurology', 'pediatrics', 'surgery', 'emergency'],
      experience: ['resident', 'early_career', 'mid_career', 'senior', 'department_head'],
      research_interest: ['clinical_trials', 'observational', 'basic_research', 'quality_improvement']
    };
  }

  /**
   * Handle new physician registration
   */
  async registerPhysician(physicianData) {
    try {
      const { email, firstName, lastName, specialty, experience, institution, npiNumber } = physicianData;

      // Validate input
      if (!this.mailchimp.validateEmail(email)) {
        throw new Error('Invalid email address');
      }

      // Prepare member data with physician-specific fields
      const memberData = {
        email,
        mergeFields: {
          FNAME: firstName,
          LNAME: lastName,
          SPECIALTY: specialty,
          EXPERIENCE: experience,
          INSTITUTION: institution,
          NPI: npiNumber,
          REG_DATE: new Date().toISOString().split('T')[0],
          STATUS: 'active'
        },
        tags: [
          'physician',
          `specialty_${specialty.toLowerCase().replace(/\s+/g, '_')}`,
          `experience_${experience.toLowerCase().replace(/\s+/g, '_')}`,
          'new_registration'
        ],
        interests: this.getPhysicianInterests(specialty, experience)
      };

      // Add to Mailchimp list
      const member = await this.mailchimp.addMember(this.physicianListId, memberData);

      // Trigger onboarding workflow
      await this.triggerOnboardingWorkflow(email, physicianData);

      // Log registration event
      this.emit('physician_registered', {
        email,
        specialty,
        institution,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        member,
        message: 'Physician registered successfully and onboarding initiated'
      };

    } catch (error) {
      this.emit('registration_error', { email: physicianData.email, error: error.message });
      throw new Error(`Physician registration failed: ${error.message}`);
    }
  }

  /**
   * Trigger onboarding workflow for new physicians
   */
  async triggerOnboardingWorkflow(email, physicianData) {
    try {
      // Add to onboarding automation
      await this.mailchimp.addSubscriberToAutomation(this.automationWorkflows.onboarding, email);

      // Send personalized welcome email
      await this.sendWelcomeEmail(email, physicianData);

      // Schedule follow-up engagement based on specialty
      await this.scheduleSpecialtyEngagement(email, physicianData.specialty);

      this.emit('onboarding_triggered', { email, specialty: physicianData.specialty });

    } catch (error) {
      throw new Error(`Onboarding workflow failed: ${error.message}`);
    }
  }

  /**
   * Send welcome email with specialty-specific content
   */
  async sendWelcomeEmail(email, physicianData) {
    const welcomeContent = this.generateWelcomeContent(physicianData);

    const campaignData = {
      type: 'regular',
      recipients: {
        list_id: this.physicianListId,
        segment_opts: {
          match: 'all',
          conditions: [{
            condition_type: 'EmailAddress',
            field: 'email_address',
            op: 'is',
            value: email
          }]
        }
      },
      settings: {
        subject_line: `Welcome to Ignite Health Systems, Dr. ${physicianData.lastName}`,
        from_name: 'Ignite Health Systems',
        reply_to: this.config.replyToEmail,
        template_id: this.templates.welcome
      }
    };

    try {
      const campaign = await this.mailchimp.createCampaign(campaignData);
      await this.mailchimp.sendCampaign(campaign.id);

      this.emit('welcome_email_sent', { email, campaignId: campaign.id });
    } catch (error) {
      throw new Error(`Welcome email failed: ${error.message}`);
    }
  }

  /**
   * Handle study notifications for physicians
   */
  async notifyPhysiciansOfNewStudy(studyData) {
    try {
      const { studyId, title, specialty, phase, eligibilityCriteria, compensation } = studyData;

      // Find relevant physicians based on specialty and interests
      const targetSegment = {
        match: 'all',
        conditions: [
          {
            condition_type: 'StaticSegment',
            field: 'static_segment',
            op: 'static_is',
            value: `specialty_${specialty.toLowerCase().replace(/\s+/g, '_')}`
          },
          {
            condition_type: 'MergeField',
            field: 'STATUS',
            op: 'is',
            value: 'active'
          }
        ]
      };

      const campaignData = {
        type: 'regular',
        recipients: {
          list_id: this.physicianListId,
          segment_opts: targetSegment
        },
        settings: {
          subject_line: `New ${specialty} Study Opportunity: ${title}`,
          from_name: 'Ignite Research Team',
          reply_to: this.config.replyToEmail,
          template_id: this.templates.studyAlert
        }
      };

      const campaign = await this.mailchimp.createCampaign(campaignData);
      await this.mailchimp.sendCampaign(campaign.id);

      // Track study notification
      this.emit('study_notification_sent', {
        studyId,
        specialty,
        campaignId: campaign.id,
        timestamp: new Date().toISOString()
      });

      return { success: true, campaignId: campaign.id };

    } catch (error) {
      this.emit('study_notification_error', { studyId: studyData.studyId, error: error.message });
      throw new Error(`Study notification failed: ${error.message}`);
    }
  }

  /**
   * Send monthly engagement updates
   */
  async sendMonthlyUpdate() {
    try {
      const activePhysicians = {
        match: 'all',
        conditions: [
          {
            condition_type: 'MergeField',
            field: 'STATUS',
            op: 'is',
            value: 'active'
          }
        ]
      };

      const campaignData = {
        type: 'regular',
        recipients: {
          list_id: this.physicianListId,
          segment_opts: activePhysicians
        },
        settings: {
          subject_line: `Monthly Research Update - ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
          from_name: 'Ignite Health Systems',
          reply_to: this.config.replyToEmail,
          template_id: this.templates.monthlyUpdate
        }
      };

      const campaign = await this.mailchimp.createCampaign(campaignData);
      await this.mailchimp.sendCampaign(campaign.id);

      this.emit('monthly_update_sent', { campaignId: campaign.id });
      return { success: true, campaignId: campaign.id };

    } catch (error) {
      throw new Error(`Monthly update failed: ${error.message}`);
    }
  }

  /**
   * Handle physician engagement tracking
   */
  async trackEngagement(email, engagementType, metadata = {}) {
    try {
      const engagementTags = [`engaged_${engagementType}`, `last_activity_${new Date().getFullYear()}_${new Date().getMonth() + 1}`];

      await this.mailchimp.addTags(this.physicianListId, email, engagementTags);

      // Update last engagement date
      await this.mailchimp.updateMember(this.physicianListId, email, {
        mergeFields: {
          LAST_ENGAGE: new Date().toISOString().split('T')[0],
          ENGAGE_TYPE: engagementType
        }
      });

      this.emit('engagement_tracked', { email, engagementType, metadata });

    } catch (error) {
      throw new Error(`Engagement tracking failed: ${error.message}`);
    }
  }

  /**
   * Schedule specialty-specific engagement
   */
  async scheduleSpecialtyEngagement(email, specialty) {
    const specialtyConfig = {
      cardiology: { followUpDays: 7, cmeTopics: ['interventional', 'heart_failure', 'arrhythmia'] },
      oncology: { followUpDays: 5, cmeTopics: ['immunotherapy', 'precision_medicine', 'palliative_care'] },
      neurology: { followUpDays: 10, cmeTopics: ['alzheimers', 'stroke', 'epilepsy'] },
      pediatrics: { followUpDays: 14, cmeTopics: ['vaccines', 'development', 'rare_diseases'] },
      surgery: { followUpDays: 3, cmeTopics: ['minimally_invasive', 'robotics', 'outcomes'] },
      emergency: { followUpDays: 7, cmeTopics: ['trauma', 'toxicology', 'critical_care'] }
    };

    const config = specialtyConfig[specialty.toLowerCase()] || { followUpDays: 7, cmeTopics: ['general'] };

    // Add specialty-specific interests
    await this.mailchimp.addTags(this.physicianListId, email, config.cmeTopics.map(topic => `cme_${topic}`));

    this.emit('specialty_engagement_scheduled', { email, specialty, config });
  }

  /**
   * Generate physician interests based on specialty and experience
   */
  getPhysicianInterests(specialty, experience) {
    const baseInterests = {
      research_updates: true,
      cme_opportunities: true,
      study_invitations: true
    };

    // Add specialty-specific interests
    const specialtyInterests = {
      [`${specialty.toLowerCase()}_studies`]: true,
      [`${specialty.toLowerCase()}_cme`]: true
    };

    // Add experience-level interests
    const experienceInterests = {
      [`${experience.toLowerCase()}_content`]: true
    };

    return { ...baseInterests, ...specialtyInterests, ...experienceInterests };
  }

  /**
   * Generate personalized welcome content
   */
  generateWelcomeContent(physicianData) {
    return {
      greeting: `Dear Dr. ${physicianData.lastName}`,
      specialty_message: `As a ${physicianData.specialty} specialist, you'll receive relevant research opportunities and CME content.`,
      institution_mention: `We're excited to work with ${physicianData.institution}.`,
      next_steps: 'You can expect your first research opportunity notification within the next week.',
      resources: `Access your physician portal for ${physicianData.specialty}-specific resources.`
    };
  }

  /**
   * Cleanup and unsubscribe physician
   */
  async unsubscribePhysician(email, reason = 'user_request') {
    try {
      await this.mailchimp.updateMember(this.physicianListId, email, {
        mergeFields: {
          STATUS: 'unsubscribed',
          UNSUB_DATE: new Date().toISOString().split('T')[0],
          UNSUB_REASON: reason
        }
      });

      await this.mailchimp.addTags(this.physicianListId, email, ['unsubscribed', `unsub_${reason}`]);

      this.emit('physician_unsubscribed', { email, reason });

    } catch (error) {
      throw new Error(`Unsubscribe failed: ${error.message}`);
    }
  }
}

export default PhysicianAutomation;