/**
 * Investor Notification Module
 * Manages investor alerts, updates, and engagement workflows
 */

import MailchimpClient from '../integrations/MailchimpClient.js';
import { EventEmitter } from 'events';

class InvestorNotification extends EventEmitter {
  constructor(config) {
    super();
    this.mailchimp = new MailchimpClient(config.mailchimpApiKey, config.serverPrefix);
    this.investorListId = config.investorListId;
    this.config = config;

    // Investor-specific templates
    this.templates = {
      welcome: 'investor_welcome_template',
      monthlyReport: 'monthly_investor_report',
      quarterlyUpdate: 'quarterly_financial_update',
      milestoneAlert: 'milestone_achievement_alert',
      fundingUpdate: 'funding_round_update',
      studyResults: 'study_results_summary',
      marketUpdate: 'market_analysis_update',
      riskAlert: 'risk_assessment_alert'
    };

    this.automationWorkflows = {
      onboarding: config.investorOnboardingWorkflowId,
      monthlyReports: config.monthlyReportsWorkflowId,
      alertsWorkflow: config.investorAlertsWorkflowId
    };

    this.investorTypes = {
      angel: { minInvestment: 25000, reportingFreq: 'monthly', riskTolerance: 'high' },
      venture_capital: { minInvestment: 500000, reportingFreq: 'quarterly', riskTolerance: 'medium' },
      institutional: { minInvestment: 1000000, reportingFreq: 'monthly', riskTolerance: 'low' },
      strategic: { minInvestment: 100000, reportingFreq: 'monthly', riskTolerance: 'medium' },
      family_office: { minInvestment: 250000, reportingFreq: 'quarterly', riskTolerance: 'medium' }
    };

    this.alertPriorities = ['low', 'medium', 'high', 'critical'];
  }

  /**
   * Register new investor
   */
  async registerInvestor(investorData) {
    try {
      const {
        email,
        firstName,
        lastName,
        company,
        investorType,
        investmentAmount,
        interests,
        accreditationStatus,
        riskTolerance,
        preferredContact
      } = investorData;

      // Validate input
      if (!this.mailchimp.validateEmail(email)) {
        throw new Error('Invalid email address');
      }

      if (!this.investorTypes[investorType]) {
        throw new Error('Invalid investor type');
      }

      // Prepare member data with investor-specific fields
      const memberData = {
        email,
        mergeFields: {
          FNAME: firstName,
          LNAME: lastName,
          COMPANY: company,
          INV_TYPE: investorType,
          INVESTMENT: investmentAmount,
          ACCREDITED: accreditationStatus ? 'yes' : 'no',
          RISK_TOL: riskTolerance,
          PREF_CONTACT: preferredContact,
          REG_DATE: new Date().toISOString().split('T')[0],
          STATUS: 'active',
          TIER: this.calculateInvestorTier(investmentAmount)
        },
        tags: [
          'investor',
          `type_${investorType}`,
          `tier_${this.calculateInvestorTier(investmentAmount)}`,
          `risk_${riskTolerance}`,
          'new_registration'
        ],
        interests: this.getInvestorInterests(investorType, interests)
      };

      // Add to Mailchimp list
      const member = await this.mailchimp.addMember(this.investorListId, memberData);

      // Trigger onboarding workflow
      await this.triggerInvestorOnboarding(email, investorData);

      // Log registration event
      this.emit('investor_registered', {
        email,
        investorType,
        company,
        investmentAmount,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        member,
        message: 'Investor registered successfully and onboarding initiated'
      };

    } catch (error) {
      this.emit('investor_registration_error', { email: investorData.email, error: error.message });
      throw new Error(`Investor registration failed: ${error.message}`);
    }
  }

  /**
   * Trigger investor onboarding workflow
   */
  async triggerInvestorOnboarding(email, investorData) {
    try {
      // Add to onboarding automation
      await this.mailchimp.addSubscriberToAutomation(this.automationWorkflows.onboarding, email);

      // Send personalized welcome package
      await this.sendInvestorWelcomePackage(email, investorData);

      // Set up reporting schedule based on investor type
      await this.setupReportingSchedule(email, investorData.investorType);

      this.emit('investor_onboarding_triggered', { email, investorType: investorData.investorType });

    } catch (error) {
      throw new Error(`Investor onboarding failed: ${error.message}`);
    }
  }

  /**
   * Send welcome package with investor-specific materials
   */
  async sendInvestorWelcomePackage(email, investorData) {
    const tier = this.calculateInvestorTier(investorData.investmentAmount);
    const welcomeContent = this.generateInvestorWelcomeContent(investorData, tier);

    const campaignData = {
      type: 'regular',
      recipients: {
        list_id: this.investorListId,
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
        subject_line: `Welcome to Ignite Health Systems - ${tier.toUpperCase()} Investor Package`,
        from_name: 'Ignite Investment Relations',
        reply_to: this.config.investorRelationsEmail,
        template_id: this.templates.welcome
      }
    };

    try {
      const campaign = await this.mailchimp.createCampaign(campaignData);
      await this.mailchimp.sendCampaign(campaign.id);

      this.emit('investor_welcome_sent', { email, tier, campaignId: campaign.id });
    } catch (error) {
      throw new Error(`Investor welcome package failed: ${error.message}`);
    }
  }

  /**
   * Send milestone achievement alerts
   */
  async sendMilestoneAlert(milestoneData) {
    try {
      const { milestoneId, title, description, impact, financialImplications, nextSteps } = milestoneData;

      // Determine which investor segments should receive this alert
      const targetSegments = this.getMilestoneTargetSegments(milestoneData);

      for (const segment of targetSegments) {
        const campaignData = {
          type: 'regular',
          recipients: {
            list_id: this.investorListId,
            segment_opts: segment
          },
          settings: {
            subject_line: `🎯 Milestone Achieved: ${title}`,
            from_name: 'Ignite Leadership Team',
            reply_to: this.config.investorRelationsEmail,
            template_id: this.templates.milestoneAlert
          }
        };

        const campaign = await this.mailchimp.createCampaign(campaignData);
        await this.mailchimp.sendCampaign(campaign.id);

        this.emit('milestone_alert_sent', {
          milestoneId,
          segment: segment.segment_text,
          campaignId: campaign.id
        });
      }

      return { success: true, alertsSent: targetSegments.length };

    } catch (error) {
      this.emit('milestone_alert_error', { milestoneId: milestoneData.milestoneId, error: error.message });
      throw new Error(`Milestone alert failed: ${error.message}`);
    }
  }

  /**
   * Send monthly investor reports
   */
  async sendMonthlyReport(reportData) {
    try {
      const { month, year, financials, kpis, studyUpdates, marketAnalysis, risks } = reportData;

      // Create different reports for different investor tiers
      const tiers = ['bronze', 'silver', 'gold', 'platinum'];

      for (const tier of tiers) {
        const tierSegment = {
          match: 'all',
          conditions: [
            {
              condition_type: 'MergeField',
              field: 'TIER',
              op: 'is',
              value: tier
            },
            {
              condition_type: 'MergeField',
              field: 'STATUS',
              op: 'is',
              value: 'active'
            }
          ]
        };

        const reportContent = this.generateTierSpecificReport(reportData, tier);

        const campaignData = {
          type: 'regular',
          recipients: {
            list_id: this.investorListId,
            segment_opts: tierSegment
          },
          settings: {
            subject_line: `Monthly Investor Report - ${month}/${year} (${tier.toUpperCase()} Tier)`,
            from_name: 'Ignite Investment Relations',
            reply_to: this.config.investorRelationsEmail,
            template_id: this.templates.monthlyReport
          }
        };

        const campaign = await this.mailchimp.createCampaign(campaignData);
        await this.mailchimp.sendCampaign(campaign.id);

        this.emit('monthly_report_sent', {
          month,
          year,
          tier,
          campaignId: campaign.id
        });
      }

      return { success: true, reportsSent: tiers.length };

    } catch (error) {
      throw new Error(`Monthly report failed: ${error.message}`);
    }
  }

  /**
   * Send funding round updates
   */
  async sendFundingUpdate(fundingData) {
    try {
      const { roundType, amountRaised, targetAmount, investors, timeline, useOfFunds } = fundingData;

      // Target all active investors for funding updates
      const allInvestors = {
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
          list_id: this.investorListId,
          segment_opts: allInvestors
        },
        settings: {
          subject_line: `${roundType} Funding Update: $${(amountRaised / 1000000).toFixed(1)}M Raised`,
          from_name: 'Ignite Executive Team',
          reply_to: this.config.ceoEmail,
          template_id: this.templates.fundingUpdate
        }
      };

      const campaign = await this.mailchimp.createCampaign(campaignData);
      await this.mailchimp.sendCampaign(campaign.id);

      this.emit('funding_update_sent', {
        roundType,
        amountRaised,
        campaignId: campaign.id
      });

      return { success: true, campaignId: campaign.id };

    } catch (error) {
      throw new Error(`Funding update failed: ${error.message}`);
    }
  }

  /**
   * Send study results to interested investors
   */
  async sendStudyResults(studyData) {
    try {
      const { studyId, title, primaryEndpoint, results, clinicalSignificance, commercialImplications } = studyData;

      // Target investors interested in clinical results
      const clinicalInterested = {
        match: 'any',
        conditions: [
          {
            condition_type: 'Interests',
            field: 'interests-clinical_results',
            op: 'interestcontains',
            value: 'clinical_results'
          },
          {
            condition_type: 'MergeField',
            field: 'TIER',
            op: 'is_one_of',
            value: ['gold', 'platinum']
          }
        ]
      };

      const campaignData = {
        type: 'regular',
        recipients: {
          list_id: this.investorListId,
          segment_opts: clinicalInterested
        },
        settings: {
          subject_line: `Study Results: ${title} - ${results.outcome}`,
          from_name: 'Ignite Clinical Team',
          reply_to: this.config.clinicalEmail,
          template_id: this.templates.studyResults
        }
      };

      const campaign = await this.mailchimp.createCampaign(campaignData);
      await this.mailchimp.sendCampaign(campaign.id);

      this.emit('study_results_sent', {
        studyId,
        outcome: results.outcome,
        campaignId: campaign.id
      });

      return { success: true, campaignId: campaign.id };

    } catch (error) {
      throw new Error(`Study results notification failed: ${error.message}`);
    }
  }

  /**
   * Send risk alerts to investors
   */
  async sendRiskAlert(riskData) {
    try {
      const { riskId, type, severity, description, mitigation, timeline, impact } = riskData;

      // Determine target audience based on risk severity and investor preferences
      const riskSegment = this.getRiskAlertSegment(severity, type);

      const campaignData = {
        type: 'regular',
        recipients: {
          list_id: this.investorListId,
          segment_opts: riskSegment
        },
        settings: {
          subject_line: `${severity.toUpperCase()} Risk Alert: ${type}`,
          from_name: 'Ignite Risk Management',
          reply_to: this.config.riskEmail,
          template_id: this.templates.riskAlert
        }
      };

      const campaign = await this.mailchimp.createCampaign(campaignData);
      await this.mailchimp.sendCampaign(campaign.id);

      this.emit('risk_alert_sent', {
        riskId,
        severity,
        type,
        campaignId: campaign.id
      });

      return { success: true, campaignId: campaign.id };

    } catch (error) {
      throw new Error(`Risk alert failed: ${error.message}`);
    }
  }

  /**
   * Calculate investor tier based on investment amount
   */
  calculateInvestorTier(amount) {
    if (amount >= 1000000) return 'platinum';
    if (amount >= 500000) return 'gold';
    if (amount >= 100000) return 'silver';
    return 'bronze';
  }

  /**
   * Generate investor interests based on type and preferences
   */
  getInvestorInterests(investorType, customInterests = []) {
    const baseInterests = {
      monthly_reports: true,
      milestone_alerts: true,
      funding_updates: true
    };

    const typeSpecificInterests = {
      angel: { early_stage_updates: true, founder_updates: true },
      venture_capital: { growth_metrics: true, market_analysis: true },
      institutional: { financial_reports: true, risk_assessments: true },
      strategic: { partnership_opportunities: true, technology_updates: true },
      family_office: { quarterly_reviews: true, conservative_updates: true }
    };

    const customInterestMap = customInterests.reduce((acc, interest) => {
      acc[interest] = true;
      return acc;
    }, {});

    return {
      ...baseInterests,
      ...typeSpecificInterests[investorType],
      ...customInterestMap
    };
  }

  /**
   * Setup reporting schedule based on investor type
   */
  async setupReportingSchedule(email, investorType) {
    const config = this.investorTypes[investorType];
    const reportingTags = [`reporting_${config.reportingFreq}`, `risk_${config.riskTolerance}`];

    await this.mailchimp.addTags(this.investorListId, email, reportingTags);

    if (config.reportingFreq === 'monthly') {
      await this.mailchimp.addSubscriberToAutomation(this.automationWorkflows.monthlyReports, email);
    }

    this.emit('reporting_schedule_setup', { email, investorType, frequency: config.reportingFreq });
  }

  /**
   * Generate milestone target segments
   */
  getMilestoneTargetSegments(milestoneData) {
    const segments = [];

    // High-tier investors get all milestones
    segments.push({
      match: 'any',
      conditions: [
        {
          condition_type: 'MergeField',
          field: 'TIER',
          op: 'is_one_of',
          value: ['gold', 'platinum']
        }
      ],
      segment_text: 'High-tier investors'
    });

    // Type-specific segments based on milestone type
    if (milestoneData.type === 'clinical') {
      segments.push({
        match: 'all',
        conditions: [
          {
            condition_type: 'Interests',
            field: 'interests-clinical_results',
            op: 'interestcontains',
            value: 'clinical_results'
          }
        ],
        segment_text: 'Clinical-interested investors'
      });
    }

    return segments;
  }

  /**
   * Generate risk alert segment based on severity
   */
  getRiskAlertSegment(severity, type) {
    const conditions = [
      {
        condition_type: 'MergeField',
        field: 'STATUS',
        op: 'is',
        value: 'active'
      }
    ];

    // Critical and high risks go to all investors
    if (severity === 'critical' || severity === 'high') {
      return { match: 'all', conditions };
    }

    // Medium risks go to medium and low risk tolerance investors
    if (severity === 'medium') {
      conditions.push({
        condition_type: 'MergeField',
        field: 'RISK_TOL',
        op: 'is_one_of',
        value: ['low', 'medium']
      });
    }

    // Low risks only go to low risk tolerance investors
    if (severity === 'low') {
      conditions.push({
        condition_type: 'MergeField',
        field: 'RISK_TOL',
        op: 'is',
        value: 'low'
      });
    }

    return { match: 'all', conditions };
  }

  /**
   * Generate tier-specific report content
   */
  generateTierSpecificReport(reportData, tier) {
    const tierConfig = {
      bronze: { detailLevel: 'summary', sections: ['overview', 'kpis'] },
      silver: { detailLevel: 'standard', sections: ['overview', 'kpis', 'financials'] },
      gold: { detailLevel: 'detailed', sections: ['overview', 'kpis', 'financials', 'studies', 'market'] },
      platinum: { detailLevel: 'comprehensive', sections: ['overview', 'kpis', 'financials', 'studies', 'market', 'risks'] }
    };

    const config = tierConfig[tier];
    const content = {};

    config.sections.forEach(section => {
      content[section] = reportData[section];
    });

    content.detailLevel = config.detailLevel;
    return content;
  }

  /**
   * Generate investor welcome content
   */
  generateInvestorWelcomeContent(investorData, tier) {
    return {
      greeting: `Dear ${investorData.firstName}`,
      tier_benefits: this.getTierBenefits(tier),
      company_overview: `Thank you for your ${investorData.investmentAmount.toLocaleString()} investment in Ignite Health Systems.`,
      next_steps: 'Your investor portal access will be provided within 24 hours.',
      contact_info: 'Your dedicated investor relations contact will reach out within 48 hours.'
    };
  }

  /**
   * Get tier-specific benefits
   */
  getTierBenefits(tier) {
    const benefits = {
      bronze: ['Monthly email updates', 'Annual investor call'],
      silver: ['Monthly reports', 'Quarterly calls', 'Access to investor portal'],
      gold: ['Detailed monthly reports', 'Monthly calls', 'Priority access to new rounds', 'Advisory board nomination'],
      platinum: ['Comprehensive reports', 'Weekly updates', 'Board observer rights', 'Direct CEO access']
    };

    return benefits[tier] || benefits.bronze;
  }
}

export default InvestorNotification;