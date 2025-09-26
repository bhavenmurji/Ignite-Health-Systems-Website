/**
 * Investigator Workflow Module
 * Handles investigator notifications, study assignments, and communication workflows
 */

import MailchimpClient from '../integrations/MailchimpClient.js';
import { EventEmitter } from 'events';

class InvestigatorWorkflow extends EventEmitter {
  constructor(config) {
    super();
    this.mailchimp = new MailchimpClient(config.mailchimpApiKey, config.serverPrefix);
    this.investigatorListId = config.investigatorListId;
    this.config = config;

    // Investigator-specific templates
    this.templates = {
      welcome: 'investigator_welcome_template',
      studyInvitation: 'study_invitation_template',
      studyAssignment: 'study_assignment_confirmation',
      protocolUpdate: 'protocol_update_notification',
      recruitmentAlert: 'recruitment_milestone_alert',
      safetyUpdate: 'safety_update_notification',
      studyCompletion: 'study_completion_summary',
      performanceReport: 'investigator_performance_report',
      trainingReminder: 'training_requirement_reminder',
      auditNotification: 'audit_notification_template'
    };

    this.automationWorkflows = {
      onboarding: config.investigatorOnboardingWorkflowId,
      studyLifecycle: config.studyLifecycleWorkflowId,
      complianceReminders: config.complianceRemindersWorkflowId,
      performanceTracking: config.performanceTrackingWorkflowId
    };

    this.investigatorTypes = {
      principal: {
        responsibilities: ['protocol_oversight', 'team_management', 'regulatory_compliance'],
        notificationPriority: 'high',
        reportingFrequency: 'weekly'
      },
      sub: {
        responsibilities: ['patient_care', 'data_collection', 'adverse_event_reporting'],
        notificationPriority: 'medium',
        reportingFrequency: 'biweekly'
      },
      coordinator: {
        responsibilities: ['scheduling', 'patient_coordination', 'documentation'],
        notificationPriority: 'medium',
        reportingFrequency: 'weekly'
      },
      research_nurse: {
        responsibilities: ['patient_assessments', 'sample_collection', 'follow_up'],
        notificationPriority: 'high',
        reportingFrequency: 'daily'
      }
    };

    this.studyPhases = ['screening', 'enrollment', 'treatment', 'follow_up', 'completion'];
    this.urgencyLevels = ['routine', 'urgent', 'critical', 'emergency'];
  }

  /**
   * Register new investigator
   */
  async registerInvestigator(investigatorData) {
    try {
      const {
        email,
        firstName,
        lastName,
        institution,
        department,
        investigatorType,
        licenseNumber,
        specialties,
        experienceYears,
        certifications,
        studyInterests
      } = investigatorData;

      // Validate input
      if (!this.mailchimp.validateEmail(email)) {
        throw new Error('Invalid email address');
      }

      if (!this.investigatorTypes[investigatorType]) {
        throw new Error('Invalid investigator type');
      }

      // Prepare member data with investigator-specific fields
      const memberData = {
        email,
        mergeFields: {
          FNAME: firstName,
          LNAME: lastName,
          INSTITUTION: institution,
          DEPARTMENT: department,
          INV_TYPE: investigatorType,
          LICENSE: licenseNumber,
          EXPERIENCE: experienceYears,
          REG_DATE: new Date().toISOString().split('T')[0],
          STATUS: 'active',
          COMPLIANCE: 'pending_verification'
        },
        tags: [
          'investigator',
          `type_${investigatorType}`,
          `experience_${this.categorizeExperience(experienceYears)}`,
          'new_registration',
          ...specialties.map(s => `specialty_${s.toLowerCase().replace(/\s+/g, '_')}`),
          ...certifications.map(c => `cert_${c.toLowerCase().replace(/\s+/g, '_')}`)
        ],
        interests: this.getInvestigatorInterests(investigatorType, specialties, studyInterests)
      };

      // Add to Mailchimp list
      const member = await this.mailchimp.addMember(this.investigatorListId, memberData);

      // Trigger onboarding workflow
      await this.triggerInvestigatorOnboarding(email, investigatorData);

      // Log registration event
      this.emit('investigator_registered', {
        email,
        investigatorType,
        institution,
        department,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        member,
        message: 'Investigator registered successfully and onboarding initiated'
      };

    } catch (error) {
      this.emit('investigator_registration_error', { email: investigatorData.email, error: error.message });
      throw new Error(`Investigator registration failed: ${error.message}`);
    }
  }

  /**
   * Trigger investigator onboarding workflow
   */
  async triggerInvestigatorOnboarding(email, investigatorData) {
    try {
      // Add to onboarding automation
      await this.mailchimp.addSubscriberToAutomation(this.automationWorkflows.onboarding, email);

      // Send personalized welcome package
      await this.sendInvestigatorWelcomePackage(email, investigatorData);

      // Setup compliance tracking
      await this.initializeComplianceTracking(email, investigatorData);

      // Schedule training requirements
      await this.scheduleTrainingRequirements(email, investigatorData.investigatorType);

      this.emit('investigator_onboarding_triggered', {
        email,
        investigatorType: investigatorData.investigatorType
      });

    } catch (error) {
      throw new Error(`Investigator onboarding failed: ${error.message}`);
    }
  }

  /**
   * Send study invitation to qualified investigators
   */
  async sendStudyInvitation(studyData, investigatorCriteria) {
    try {
      const {
        studyId,
        title,
        phase,
        indication,
        duration,
        requiredSpecialties,
        requiredExperience,
        compensationRange,
        timeline
      } = studyData;

      // Build target segment based on criteria
      const targetSegment = this.buildInvestigatorSegment(investigatorCriteria);

      const campaignData = {
        type: 'regular',
        recipients: {
          list_id: this.investigatorListId,
          segment_opts: targetSegment
        },
        settings: {
          subject_line: `Study Invitation: ${title} (Phase ${phase})`,
          from_name: 'Ignite Clinical Operations',
          reply_to: this.config.clinicalOpsEmail,
          template_id: this.templates.studyInvitation
        }
      };

      const campaign = await this.mailchimp.createCampaign(campaignData);
      await this.mailchimp.sendCampaign(campaign.id);

      // Track invitation metrics
      this.emit('study_invitation_sent', {
        studyId,
        indication,
        targetCriteria: investigatorCriteria,
        campaignId: campaign.id,
        timestamp: new Date().toISOString()
      });

      return { success: true, campaignId: campaign.id };

    } catch (error) {
      this.emit('study_invitation_error', { studyId: studyData.studyId, error: error.message });
      throw new Error(`Study invitation failed: ${error.message}`);
    }
  }

  /**
   * Send study assignment confirmation
   */
  async sendStudyAssignment(assignmentData) {
    try {
      const {
        investigatorEmail,
        studyId,
        title,
        role,
        responsibilities,
        timeline,
        contacts,
        protocolVersion,
        requiredTraining
      } = assignmentData;

      const campaignData = {
        type: 'regular',
        recipients: {
          list_id: this.investigatorListId,
          segment_opts: {
            match: 'all',
            conditions: [{
              condition_type: 'EmailAddress',
              field: 'email_address',
              op: 'is',
              value: investigatorEmail
            }]
          }
        },
        settings: {
          subject_line: `Study Assignment Confirmed: ${title} - ${role}`,
          from_name: 'Ignite Study Management',
          reply_to: this.config.studyManagerEmail,
          template_id: this.templates.studyAssignment
        }
      };

      const campaign = await this.mailchimp.createCampaign(campaignData);
      await this.mailchimp.sendCampaign(campaign.id);

      // Update investigator tags and status
      await this.updateInvestigatorStudyStatus(investigatorEmail, studyId, 'assigned');

      this.emit('study_assignment_sent', {
        investigatorEmail,
        studyId,
        role,
        campaignId: campaign.id
      });

      return { success: true, campaignId: campaign.id };

    } catch (error) {
      throw new Error(`Study assignment notification failed: ${error.message}`);
    }
  }

  /**
   * Send protocol updates to study investigators
   */
  async sendProtocolUpdate(updateData) {
    try {
      const {
        studyId,
        protocolVersion,
        updateType,
        changes,
        effectiveDate,
        actionRequired,
        urgency
      } = updateData;

      // Target investigators assigned to this study
      const studyInvestigators = {
        match: 'all',
        conditions: [
          {
            condition_type: 'StaticSegment',
            field: 'static_segment',
            op: 'static_is',
            value: `study_${studyId}`
          },
          {
            condition_type: 'MergeField',
            field: 'STATUS',
            op: 'is',
            value: 'active'
          }
        ]
      };

      const urgencyPrefix = urgency === 'critical' ? '🚨 URGENT: ' :
                           urgency === 'urgent' ? '⚠️ IMPORTANT: ' : '';

      const campaignData = {
        type: 'regular',
        recipients: {
          list_id: this.investigatorListId,
          segment_opts: studyInvestigators
        },
        settings: {
          subject_line: `${urgencyPrefix}Protocol Update - Study ${studyId} (v${protocolVersion})`,
          from_name: 'Ignite Regulatory Affairs',
          reply_to: this.config.regulatoryEmail,
          template_id: this.templates.protocolUpdate
        }
      };

      const campaign = await this.mailchimp.createCampaign(campaignData);
      await this.mailchimp.sendCampaign(campaign.id);

      // Track update acknowledgment
      this.emit('protocol_update_sent', {
        studyId,
        protocolVersion,
        updateType,
        urgency,
        campaignId: campaign.id
      });

      return { success: true, campaignId: campaign.id };

    } catch (error) {
      throw new Error(`Protocol update notification failed: ${error.message}`);
    }
  }

  /**
   * Send recruitment milestone alerts
   */
  async sendRecruitmentAlert(recruitmentData) {
    try {
      const {
        studyId,
        milestone,
        currentEnrollment,
        targetEnrollment,
        percentComplete,
        timeline,
        performance
      } = recruitmentData;

      // Target principal investigators and coordinators for recruitment updates
      const recruitmentTeam = {
        match: 'all',
        conditions: [
          {
            condition_type: 'StaticSegment',
            field: 'static_segment',
            op: 'static_is',
            value: `study_${studyId}`
          },
          {
            condition_type: 'MergeField',
            field: 'INV_TYPE',
            op: 'is_one_of',
            value: ['principal', 'coordinator']
          }
        ]
      };

      const campaignData = {
        type: 'regular',
        recipients: {
          list_id: this.investigatorListId,
          segment_opts: recruitmentTeam
        },
        settings: {
          subject_line: `Recruitment Update: ${milestone} - Study ${studyId} (${percentComplete}% Complete)`,
          from_name: 'Ignite Enrollment Team',
          reply_to: this.config.enrollmentEmail,
          template_id: this.templates.recruitmentAlert
        }
      };

      const campaign = await this.mailchimp.createCampaign(campaignData);
      await this.mailchimp.sendCampaign(campaign.id);

      this.emit('recruitment_alert_sent', {
        studyId,
        milestone,
        percentComplete,
        campaignId: campaign.id
      });

      return { success: true, campaignId: campaign.id };

    } catch (error) {
      throw new Error(`Recruitment alert failed: ${error.message}`);
    }
  }

  /**
   * Send safety updates and adverse event notifications
   */
  async sendSafetyUpdate(safetyData) {
    try {
      const {
        studyId,
        updateType,
        severity,
        description,
        actionRequired,
        timeline,
        contactInfo
      } = safetyData;

      // Safety updates go to all investigators in the study
      const studyInvestigators = {
        match: 'all',
        conditions: [
          {
            condition_type: 'StaticSegment',
            field: 'static_segment',
            op: 'static_is',
            value: `study_${studyId}`
          }
        ]
      };

      const severityPrefix = severity === 'critical' ? '🚨 CRITICAL SAFETY ALERT: ' :
                            severity === 'serious' ? '⚠️ SERIOUS SAFETY UPDATE: ' :
                            '📋 Safety Update: ';

      const campaignData = {
        type: 'regular',
        recipients: {
          list_id: this.investigatorListId,
          segment_opts: studyInvestigators
        },
        settings: {
          subject_line: `${severityPrefix}Study ${studyId} - ${updateType}`,
          from_name: 'Ignite Safety Department',
          reply_to: this.config.safetyEmail,
          template_id: this.templates.safetyUpdate
        }
      };

      const campaign = await this.mailchimp.createCampaign(campaignData);
      await this.mailchimp.sendCampaign(campaign.id);

      // Add safety alert tags
      const safetyTags = [`safety_alert_${severity}`, `study_${studyId}_safety`];

      // Add tags to all investigators in the study
      // Note: This would require getting the list of investigators first
      this.emit('safety_update_sent', {
        studyId,
        updateType,
        severity,
        campaignId: campaign.id
      });

      return { success: true, campaignId: campaign.id };

    } catch (error) {
      throw new Error(`Safety update notification failed: ${error.message}`);
    }
  }

  /**
   * Send training reminders to investigators
   */
  async sendTrainingReminder(trainingData) {
    try {
      const {
        trainingType,
        dueDate,
        description,
        consequences,
        accessInstructions,
        targetInvestigators
      } = trainingData;

      const targetSegment = this.buildInvestigatorSegment(targetInvestigators);

      const daysUntilDue = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
      const urgencyLevel = daysUntilDue <= 3 ? '🚨 URGENT: ' :
                          daysUntilDue <= 7 ? '⚠️ REMINDER: ' : '';

      const campaignData = {
        type: 'regular',
        recipients: {
          list_id: this.investigatorListId,
          segment_opts: targetSegment
        },
        settings: {
          subject_line: `${urgencyLevel}Training Due: ${trainingType} (Due ${dueDate})`,
          from_name: 'Ignite Training Department',
          reply_to: this.config.trainingEmail,
          template_id: this.templates.trainingReminder
        }
      };

      const campaign = await this.mailchimp.createCampaign(campaignData);
      await this.mailchimp.sendCampaign(campaign.id);

      this.emit('training_reminder_sent', {
        trainingType,
        dueDate,
        daysUntilDue,
        campaignId: campaign.id
      });

      return { success: true, campaignId: campaign.id };

    } catch (error) {
      throw new Error(`Training reminder failed: ${error.message}`);
    }
  }

  /**
   * Send investigator performance reports
   */
  async sendPerformanceReport(reportData) {
    try {
      const {
        investigatorEmail,
        reportPeriod,
        metrics,
        achievements,
        areasForImprovement,
        nextSteps
      } = reportData;

      const campaignData = {
        type: 'regular',
        recipients: {
          list_id: this.investigatorListId,
          segment_opts: {
            match: 'all',
            conditions: [{
              condition_type: 'EmailAddress',
              field: 'email_address',
              op: 'is',
              value: investigatorEmail
            }]
          }
        },
        settings: {
          subject_line: `Performance Report - ${reportPeriod}`,
          from_name: 'Ignite Clinical Operations',
          reply_to: this.config.clinicalOpsEmail,
          template_id: this.templates.performanceReport
        }
      };

      const campaign = await this.mailchimp.createCampaign(campaignData);
      await this.mailchimp.sendCampaign(campaign.id);

      // Update investigator performance tags
      await this.updatePerformanceMetrics(investigatorEmail, metrics);

      this.emit('performance_report_sent', {
        investigatorEmail,
        reportPeriod,
        campaignId: campaign.id
      });

      return { success: true, campaignId: campaign.id };

    } catch (error) {
      throw new Error(`Performance report failed: ${error.message}`);
    }
  }

  /**
   * Initialize compliance tracking for new investigator
   */
  async initializeComplianceTracking(email, investigatorData) {
    const complianceTags = [
      'compliance_pending',
      'training_required',
      'documentation_pending'
    ];

    await this.mailchimp.addTags(this.investigatorListId, email, complianceTags);

    // Set up compliance automation
    await this.mailchimp.addSubscriberToAutomation(this.automationWorkflows.complianceReminders, email);

    this.emit('compliance_tracking_initialized', { email, investigatorType: investigatorData.investigatorType });
  }

  /**
   * Update investigator study status
   */
  async updateInvestigatorStudyStatus(email, studyId, status) {
    const statusTags = [`study_${studyId}`, `study_status_${status}`];
    await this.mailchimp.addTags(this.investigatorListId, email, statusTags);

    await this.mailchimp.updateMember(this.investigatorListId, email, {
      mergeFields: {
        CURRENT_STUDY: studyId,
        STUDY_STATUS: status,
        STATUS_UPDATE: new Date().toISOString().split('T')[0]
      }
    });

    this.emit('investigator_study_status_updated', { email, studyId, status });
  }

  /**
   * Update performance metrics
   */
  async updatePerformanceMetrics(email, metrics) {
    const performanceTags = [];

    if (metrics.enrollmentRate >= 90) performanceTags.push('high_performer');
    else if (metrics.enrollmentRate >= 70) performanceTags.push('good_performer');
    else performanceTags.push('needs_improvement');

    if (metrics.protocolDeviations === 0) performanceTags.push('zero_deviations');
    if (metrics.dataQuality >= 95) performanceTags.push('high_quality_data');

    await this.mailchimp.addTags(this.investigatorListId, email, performanceTags);

    await this.mailchimp.updateMember(this.investigatorListId, email, {
      mergeFields: {
        ENROLL_RATE: metrics.enrollmentRate,
        DATA_QUALITY: metrics.dataQuality,
        DEVIATIONS: metrics.protocolDeviations,
        LAST_EVAL: new Date().toISOString().split('T')[0]
      }
    });
  }

  /**
   * Build investigator segment based on criteria
   */
  buildInvestigatorSegment(criteria) {
    const conditions = [
      {
        condition_type: 'MergeField',
        field: 'STATUS',
        op: 'is',
        value: 'active'
      }
    ];

    if (criteria.investigatorTypes) {
      conditions.push({
        condition_type: 'MergeField',
        field: 'INV_TYPE',
        op: 'is_one_of',
        value: criteria.investigatorTypes
      });
    }

    if (criteria.specialties) {
      const specialtyConditions = criteria.specialties.map(specialty => ({
        condition_type: 'StaticSegment',
        field: 'static_segment',
        op: 'static_is',
        value: `specialty_${specialty.toLowerCase().replace(/\s+/g, '_')}`
      }));

      if (specialtyConditions.length > 0) {
        conditions.push({
          condition_type: 'StaticSegment',
          field: 'static_segment',
          op: 'static_is_any',
          value: criteria.specialties.map(s => `specialty_${s.toLowerCase().replace(/\s+/g, '_')}`)
        });
      }
    }

    if (criteria.experience) {
      conditions.push({
        condition_type: 'MergeField',
        field: 'EXPERIENCE',
        op: 'greater',
        value: criteria.experience.toString()
      });
    }

    return { match: 'all', conditions };
  }

  /**
   * Categorize experience level
   */
  categorizeExperience(years) {
    if (years < 2) return 'junior';
    if (years < 5) return 'mid_level';
    if (years < 10) return 'senior';
    return 'expert';
  }

  /**
   * Generate investigator interests
   */
  getInvestigatorInterests(investigatorType, specialties, studyInterests) {
    const baseInterests = {
      protocol_updates: true,
      training_notifications: true,
      study_opportunities: true
    };

    const typeSpecificInterests = {
      principal: { regulatory_updates: true, compliance_alerts: true },
      sub: { clinical_guidance: true, patient_care_updates: true },
      coordinator: { scheduling_alerts: true, administrative_updates: true },
      research_nurse: { safety_updates: true, procedure_updates: true }
    };

    const specialtyInterests = specialties.reduce((acc, specialty) => {
      acc[`${specialty.toLowerCase()}_studies`] = true;
      return acc;
    }, {});

    const customInterests = studyInterests.reduce((acc, interest) => {
      acc[interest] = true;
      return acc;
    }, {});

    return {
      ...baseInterests,
      ...typeSpecificInterests[investigatorType],
      ...specialtyInterests,
      ...customInterests
    };
  }

  /**
   * Schedule training requirements based on investigator type
   */
  async scheduleTrainingRequirements(email, investigatorType) {
    const trainingSchedule = {
      principal: ['gcp_certification', 'protocol_training', 'regulatory_compliance'],
      sub: ['gcp_certification', 'clinical_procedures', 'safety_reporting'],
      coordinator: ['study_coordination', 'scheduling_systems', 'documentation'],
      research_nurse: ['clinical_assessments', 'sample_handling', 'adverse_events']
    };

    const requiredTraining = trainingSchedule[investigatorType] || [];
    const trainingTags = requiredTraining.map(training => `training_required_${training}`);

    await this.mailchimp.addTags(this.investigatorListId, email, trainingTags);

    this.emit('training_requirements_scheduled', { email, investigatorType, requiredTraining });
  }

  /**
   * Send investigator welcome package
   */
  async sendInvestigatorWelcomePackage(email, investigatorData) {
    const welcomeContent = this.generateInvestigatorWelcomeContent(investigatorData);

    const campaignData = {
      type: 'regular',
      recipients: {
        list_id: this.investigatorListId,
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
        subject_line: `Welcome to Ignite Health Systems - ${investigatorData.investigatorType} Investigator`,
        from_name: 'Ignite Clinical Team',
        reply_to: this.config.clinicalOpsEmail,
        template_id: this.templates.welcome
      }
    };

    const campaign = await this.mailchimp.createCampaign(campaignData);
    await this.mailchimp.sendCampaign(campaign.id);

    this.emit('investigator_welcome_sent', { email, campaignId: campaign.id });
  }

  /**
   * Generate investigator welcome content
   */
  generateInvestigatorWelcomeContent(investigatorData) {
    const responsibilities = this.investigatorTypes[investigatorData.investigatorType].responsibilities;

    return {
      greeting: `Dear Dr. ${investigatorData.lastName}`,
      role_description: `As a ${investigatorData.investigatorType} investigator, your key responsibilities include: ${responsibilities.join(', ')}.`,
      institution_acknowledgment: `We're pleased to partner with ${investigatorData.institution} - ${investigatorData.department}.`,
      next_steps: 'You will receive training requirements and compliance documentation within 24 hours.',
      support: 'Your clinical operations contact will reach out within 48 hours to begin onboarding.'
    };
  }
}

export default InvestigatorWorkflow;