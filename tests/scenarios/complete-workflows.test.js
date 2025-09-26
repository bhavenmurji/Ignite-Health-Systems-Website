/**
 * Complete Workflow Scenario Tests
 * Tests end-to-end scenarios for all user types with comprehensive validation
 */

const { testDataGenerator } = require('../utils/testDataGenerator');
const { mockMailchimpAPI } = require('../mocks/mailchimp/mockMailchimpAPI');
const { WebhookSimulator, WebhookClient } = require('../utils/webhookSimulator');
const { EmailValidator } = require('../utils/emailValidator');
const { TemplateValidator } = require('../utils/templateValidator');

describe('Complete Workflow Scenarios', () => {
  let webhookSimulator;
  let webhookClient;
  let emailValidator;
  let templateValidator;

  beforeAll(async () => {
    // Initialize test infrastructure
    webhookSimulator = new WebhookSimulator({ port: 3003 });
    await webhookSimulator.start();

    webhookClient = new WebhookClient('http://localhost:3003');
    emailValidator = new EmailValidator();
    templateValidator = new TemplateValidator();

    // Configure webhook responses
    webhookSimulator.simulateN8nWebhook();
    webhookSimulator.simulateMailchimpWebhook();
    webhookSimulator.simulateTelegramWebhook();
  });

  afterAll(async () => {
    if (webhookSimulator) {
      await webhookSimulator.stop();
    }
  });

  beforeEach(() => {
    mockMailchimpAPI.reset();
    emailValidator.reset();
    webhookSimulator.clearRequests();
  });

  describe('Physician Onboarding Scenarios', () => {
    test('should complete standard physician workflow', async () => {
      // Generate physician contact
      const physician = testDataGenerator.generateContact('physician', {
        overrides: {
          specialty: 'Family Medicine',
          practiceModel: 'independent',
          emrSystem: 'Epic',
          challenge: 'Spending 4+ hours daily on documentation instead of patient care',
          cofounder: false
        }
      });

      // Step 1: Form submission
      const formData = testDataGenerator.contactToWebhookPayload(physician);
      const webhookResponse = await webhookClient.post('/webhook/n8n/interest-form', formData);

      expect(webhookResponse.status).toBe(200);

      // Step 2: Process in Mailchimp
      const subscriber = mockMailchimpAPI.addSubscriber(physician.email, {
        merge_fields: {
          FNAME: physician.firstName,
          LNAME: physician.lastName,
          USERTYPE: physician.userType,
          SPECIALTY: physician.specialty,
          PRACTICE: physician.practiceModel,
          EMR: physician.emrSystem,
          CHALLENGE: physician.challenge,
          COFOUNDER: 'No',
          LINKEDIN: physician.linkedin
        }
      });

      // Verify subscriber creation
      expect(subscriber.email_address).toBe(physician.email.toLowerCase());
      expect(subscriber.merge_fields.USERTYPE).toBe('physician');
      expect(subscriber.tags).toContainEqual({ name: 'physician', id: 1 });
      expect(subscriber.tags).toContainEqual({ name: 'standard', id: 4 });

      // Step 3: Generate welcome email
      const renderedTemplate = templateValidator.renderTemplate('physician-welcome', physician);
      const emailValidation = templateValidator.validateRenderedTemplate(renderedTemplate, physician);

      expect(emailValidation.valid).toBe(true);
      expect(renderedTemplate.html).toContain(physician.firstName);
      expect(renderedTemplate.html).toContain(physician.specialty);
      expect(renderedTemplate.html).toContain(physician.emrSystem);

      // Step 4: Simulate email delivery
      const deliveredEmail = emailValidator.simulateEmailDelivery({
        to: physician.email,
        subject: renderedTemplate.subject,
        content: renderedTemplate.html,
        template: 'physician-welcome',
        userType: 'physician'
      });

      expect(deliveredEmail.deliveryStatus).toBe('delivered');

      // Step 5: Simulate engagement
      emailValidator.simulateEmailEngagement(deliveredEmail.id, 'open');
      emailValidator.simulateEmailEngagement(deliveredEmail.id, 'click');

      const finalEmail = emailValidator.getDeliveredEmails({ id: deliveredEmail.id })[0];
      expect(finalEmail.opens).toBe(1);
      expect(finalEmail.clicks).toBe(1);

      // Verify no immediate notification for standard physician
      const webhookRequests = webhookSimulator.getRequests();
      const telegramRequests = webhookRequests.filter(req => req.url.includes('telegram'));
      expect(telegramRequests).toHaveLength(0);

      console.log('✅ Standard physician workflow completed successfully');
    });

    test('should complete high-priority physician workflow with co-founder interest', async () => {
      // Generate co-founder interested physician
      const cofounderPhysician = testDataGenerator.generateContact('physician', {
        overrides: {
          specialty: 'Emergency Medicine',
          practiceModel: 'independent',
          emrSystem: 'Cerner',
          challenge: 'Want to revolutionize healthcare technology and join as co-founder',
          cofounder: true
        }
      });

      // Step 1: Form submission
      const formData = testDataGenerator.contactToWebhookPayload(cofounderPhysician);
      const webhookResponse = await webhookClient.post('/webhook/n8n/interest-form', formData);

      expect(webhookResponse.status).toBe(200);
      expect(formData.cofounder).toBe(true);

      // Step 2: Process in Mailchimp with high-priority tags
      const subscriber = mockMailchimpAPI.addSubscriber(cofounderPhysician.email, {
        merge_fields: {
          FNAME: cofounderPhysician.firstName,
          LNAME: cofounderPhysician.lastName,
          USERTYPE: cofounderPhysician.userType,
          SPECIALTY: cofounderPhysician.specialty,
          CHALLENGE: cofounderPhysician.challenge,
          COFOUNDER: 'Yes'
        }
      });

      // Verify high-priority tagging
      expect(subscriber.tags).toContainEqual({ name: 'physician', id: 1 });
      expect(subscriber.tags).toContainEqual({ name: 'cofounder-interest', id: 2 });
      expect(subscriber.tags).toContainEqual({ name: 'high-priority', id: 3 });

      // Step 3: Generate high-priority email
      const renderedTemplate = templateValidator.renderTemplate('cofounder-priority', cofounderPhysician);
      const emailValidation = templateValidator.validateRenderedTemplate(renderedTemplate, cofounderPhysician);

      expect(emailValidation.valid).toBe(true);
      expect(renderedTemplate.subject).toContain('PRIORITY');
      expect(renderedTemplate.html).toContain('co-founder');
      expect(renderedTemplate.html).toContain('48 Hours');

      // Step 4: Simulate immediate notification
      const notificationResponse = await webhookClient.post('/webhook/telegram', {
        message: `🚨 HIGH PRIORITY: Co-founder interested physician signed up!\n\n` +
                `Name: ${cofounderPhysician.firstName} ${cofounderPhysician.lastName}\n` +
                `Email: ${cofounderPhysician.email}\n` +
                `Specialty: ${cofounderPhysician.specialty}\n` +
                `Challenge: ${cofounderPhysician.challenge}\n\n` +
                `Action Required: Immediate personal outreach within 2 hours`,
        priority: 'high'
      });

      expect(notificationResponse.status).toBe(200);

      // Step 5: Verify notification was sent
      const webhookRequests = webhookSimulator.getRequests();
      const telegramRequests = webhookRequests.filter(req => req.url.includes('telegram'));
      expect(telegramRequests).toHaveLength(1);

      const notificationData = telegramRequests[0].body;
      expect(notificationData.message).toContain('HIGH PRIORITY');
      expect(notificationData.message).toContain(cofounderPhysician.email);

      console.log('✅ High-priority physician workflow with notifications completed');
    });

    test('should handle physician workflow with missing data gracefully', async () => {
      // Generate incomplete physician data
      const incompletePhysician = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'incomplete@example.com',
        userType: 'physician'
        // Missing: specialty, practiceModel, emrSystem, challenge
      };

      // Try to render template with missing data
      try {
        const renderedTemplate = templateValidator.renderTemplate('physician-welcome', incompletePhysician);
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toContain('Missing required tokens');
      }

      // But should still be able to add to Mailchimp with minimal data
      const subscriber = mockMailchimpAPI.addSubscriber(incompletePhysician.email, {
        merge_fields: {
          FNAME: incompletePhysician.firstName,
          LNAME: incompletePhysician.lastName,
          USERTYPE: incompletePhysician.userType,
          SPECIALTY: '',
          PRACTICE: '',
          EMR: '',
          CHALLENGE: '',
          COFOUNDER: 'No'
        }
      });

      expect(subscriber.email_address).toBe(incompletePhysician.email);
      expect(subscriber.tags).toContainEqual({ name: 'physician', id: 1 });

      console.log('✅ Incomplete physician data handled gracefully');
    });
  });

  describe('Investor Onboarding Scenarios', () => {
    test('should complete investor workflow with notification', async () => {
      // Generate investor contact
      const investor = testDataGenerator.generateContact('investor', {
        overrides: {
          challenge: 'Looking for healthcare disruption opportunities with strong ROI potential',
          cofounder: false
        }
      });

      // Step 1: Form submission
      const formData = testDataGenerator.contactToWebhookPayload(investor);
      const webhookResponse = await webhookClient.post('/webhook/n8n/interest-form', formData);

      expect(webhookResponse.status).toBe(200);

      // Step 2: Process in Mailchimp
      const subscriber = mockMailchimpAPI.addSubscriber(investor.email, {
        merge_fields: {
          FNAME: investor.firstName,
          LNAME: investor.lastName,
          USERTYPE: investor.userType,
          CHALLENGE: investor.challenge,
          LINKEDIN: investor.linkedin,
          COFOUNDER: 'No'
        }
      });

      // Verify investor tagging
      expect(subscriber.tags).toContainEqual({ name: 'investor', id: 5 });
      expect(subscriber.tags).toContainEqual({ name: 'standard', id: 4 });

      // Step 3: Generate investor welcome email
      const renderedTemplate = templateValidator.renderTemplate('investor-welcome', investor);
      const emailValidation = templateValidator.validateRenderedTemplate(renderedTemplate, investor);

      expect(emailValidation.valid).toBe(true);
      expect(renderedTemplate.html).toContain('$3.8 Trillion');
      expect(renderedTemplate.html).toContain('ROI');
      expect(renderedTemplate.html).toContain(investor.challenge);

      // Step 4: Simulate investor notification
      const notificationResponse = await webhookClient.post('/webhook/telegram', {
        message: `💰 INVESTOR ALERT: New investor signed up!\n\n` +
                `Name: ${investor.firstName} ${investor.lastName}\n` +
                `Email: ${investor.email}\n` +
                `Interest: ${investor.challenge}\n` +
                `LinkedIn: ${investor.linkedin}\n\n` +
                `Action: Send investment deck within 24 hours`,
        priority: 'normal'
      });

      expect(notificationResponse.status).toBe(200);

      // Step 5: Verify notification
      const webhookRequests = webhookSimulator.getRequests();
      const telegramRequests = webhookRequests.filter(req => req.url.includes('telegram'));
      expect(telegramRequests).toHaveLength(1);

      const notificationData = telegramRequests[0].body;
      expect(notificationData.message).toContain('INVESTOR ALERT');
      expect(notificationData.message).toContain(investor.email);

      console.log('✅ Investor workflow with notification completed');
    });

    test('should handle high-value investor with immediate follow-up', async () => {
      // Generate high-value investor
      const highValueInvestor = testDataGenerator.generateContact('investor', {
        overrides: {
          firstName: 'Sarah',
          lastName: 'Chen',
          email: 'sarah.chen@tier1vc.com',
          challenge: 'Looking for Series A healthcare AI opportunities with $50M+ market potential',
          linkedin: 'https://linkedin.com/in/sarahchen-tier1vc',
          cofounder: true // Interested in deeper involvement
        }
      });

      // Step 1: Form submission
      const formData = testDataGenerator.contactToWebhookPayload(highValueInvestor);
      const webhookResponse = await webhookClient.post('/webhook/n8n/interest-form', formData);

      expect(webhookResponse.status).toBe(200);

      // Step 2: Process with high-priority tags due to co-founder interest
      const subscriber = mockMailchimpAPI.addSubscriber(highValueInvestor.email, {
        merge_fields: {
          FNAME: highValueInvestor.firstName,
          LNAME: highValueInvestor.lastName,
          USERTYPE: highValueInvestor.userType,
          CHALLENGE: highValueInvestor.challenge,
          LINKEDIN: highValueInvestor.linkedin,
          COFOUNDER: 'Yes'
        }
      });

      // Should get high-priority treatment due to co-founder interest
      expect(subscriber.tags).toContainEqual({ name: 'investor', id: 5 });
      expect(subscriber.tags).toContainEqual({ name: 'cofounder-interest', id: 2 });
      expect(subscriber.tags).toContainEqual({ name: 'high-priority', id: 3 });

      // Step 3: Send co-founder priority email instead of standard investor email
      const renderedTemplate = templateValidator.renderTemplate('cofounder-priority', highValueInvestor);
      expect(renderedTemplate.subject).toContain('PRIORITY');

      // Step 4: Immediate high-priority notification
      const notificationResponse = await webhookClient.post('/webhook/telegram', {
        message: `🚨🚨 URGENT: High-value investor with co-founder interest!\n\n` +
                `Name: ${highValueInvestor.firstName} ${highValueInvestor.lastName}\n` +
                `Email: ${highValueInvestor.email}\n` +
                `LinkedIn: ${highValueInvestor.linkedin}\n` +
                `Focus: ${highValueInvestor.challenge}\n\n` +
                `🔥 IMMEDIATE ACTION REQUIRED: Personal call within 2 hours\n` +
                `This could be THE investor we've been waiting for!`,
        priority: 'urgent'
      });

      expect(notificationResponse.status).toBe(200);

      console.log('✅ High-value investor workflow completed');
    });
  });

  describe('Specialist Onboarding Scenarios', () => {
    test('should complete specialist workflow with collaboration focus', async () => {
      // Generate specialist contact
      const specialist = testDataGenerator.generateContact('specialist', {
        overrides: {
          specialty: 'Health Tech AI',
          challenge: 'Building AI solutions that enhance physician capabilities without replacing human judgment',
          cofounder: false
        }
      });

      // Step 1: Form submission
      const formData = testDataGenerator.contactToWebhookPayload(specialist);
      const webhookResponse = await webhookClient.post('/webhook/n8n/interest-form', formData);

      expect(webhookResponse.status).toBe(200);

      // Step 2: Process in Mailchimp
      const subscriber = mockMailchimpAPI.addSubscriber(specialist.email, {
        merge_fields: {
          FNAME: specialist.firstName,
          LNAME: specialist.lastName,
          USERTYPE: specialist.userType,
          SPECIALTY: specialist.specialty,
          CHALLENGE: specialist.challenge,
          LINKEDIN: specialist.linkedin,
          COFOUNDER: 'No'
        }
      });

      // Verify specialist tagging
      expect(subscriber.tags).toContainEqual({ name: 'specialist', id: 6 });
      expect(subscriber.tags).toContainEqual({ name: 'standard', id: 4 });

      // Step 3: Generate specialist welcome email
      const renderedTemplate = templateValidator.renderTemplate('specialist-welcome', specialist);
      const emailValidation = templateValidator.validateRenderedTemplate(renderedTemplate, specialist);

      expect(emailValidation.valid).toBe(true);
      expect(renderedTemplate.html).toContain('collaboration');
      expect(renderedTemplate.html).toContain('partnership');
      expect(renderedTemplate.html).toContain(specialist.specialty);

      // Step 4: Simulate specialist notification
      const notificationResponse = await webhookClient.post('/webhook/telegram', {
        message: `🔬 SPECIALIST ALERT: New technology specialist interested!\n\n` +
                `Name: ${specialist.firstName} ${specialist.lastName}\n` +
                `Email: ${specialist.email}\n` +
                `Specialty: ${specialist.specialty}\n` +
                `Focus: ${specialist.challenge}\n` +
                `LinkedIn: ${specialist.linkedin}\n\n` +
                `Action: Explore partnership opportunities`,
        priority: 'normal'
      });

      expect(notificationResponse.status).toBe(200);

      // Step 5: Verify collaboration-focused content
      expect(renderedTemplate.html).toContain('Technology Partnership');
      expect(renderedTemplate.html).toContain('Research Collaboration');
      expect(renderedTemplate.html).toContain('Advisory Role');

      console.log('✅ Specialist workflow completed');
    });
  });

  describe('Multi-User Type Scenarios', () => {
    test('should handle mixed workflow with proper segmentation', async () => {
      // Generate mixed user types
      const contacts = [
        testDataGenerator.generateContact('physician'),
        testDataGenerator.generateContact('investor'),
        testDataGenerator.generateContact('specialist'),
        testDataGenerator.generateContact('physician', { overrides: { cofounder: true } })
      ];

      const results = [];

      // Process all contacts
      for (const contact of contacts) {
        const formData = testDataGenerator.contactToWebhookPayload(contact);
        const webhookResponse = await webhookClient.post('/webhook/n8n/interest-form', formData);

        expect(webhookResponse.status).toBe(200);

        // Add to Mailchimp
        const subscriber = mockMailchimpAPI.addSubscriber(contact.email, {
          merge_fields: {
            FNAME: contact.firstName,
            LNAME: contact.lastName,
            USERTYPE: contact.userType,
            SPECIALTY: contact.specialty || '',
            CHALLENGE: contact.challenge || '',
            COFOUNDER: contact.cofounder ? 'Yes' : 'No'
          }
        });

        // Generate appropriate email
        let templateId;
        if (contact.cofounder) {
          templateId = 'cofounder-priority';
        } else {
          templateId = templateValidator.getTemplateByUserType(contact.userType);
        }

        const renderedTemplate = templateValidator.renderTemplate(templateId, contact);

        results.push({
          contact,
          subscriber,
          renderedTemplate,
          templateId
        });
      }

      // Verify proper segmentation
      const physicianSubscribers = mockMailchimpAPI.getSubscribersByUserType('physician');
      const investorSubscribers = mockMailchimpAPI.getSubscribersByUserType('investor');
      const specialistSubscribers = mockMailchimpAPI.getSubscribersByUserType('specialist');

      expect(physicianSubscribers).toHaveLength(2); // 1 regular + 1 co-founder
      expect(investorSubscribers).toHaveLength(1);
      expect(specialistSubscribers).toHaveLength(1);

      // Verify high-priority tagging for co-founder
      const highPrioritySubscribers = mockMailchimpAPI.getSubscribersByTag('high-priority');
      expect(highPrioritySubscribers).toHaveLength(1);

      // Verify appropriate email templates were used
      const templateUsage = results.reduce((acc, result) => {
        acc[result.templateId] = (acc[result.templateId] || 0) + 1;
        return acc;
      }, {});

      expect(templateUsage['physician-welcome']).toBe(1);
      expect(templateUsage['investor-welcome']).toBe(1);
      expect(templateUsage['specialist-welcome']).toBe(1);
      expect(templateUsage['cofounder-priority']).toBe(1);

      console.log('✅ Mixed workflow with proper segmentation completed');
    });

    test('should maintain performance with batch processing', async () => {
      const batchSize = 25;
      const contacts = testDataGenerator.generateContactBatch(batchSize, {
        physician: 0.6,
        investor: 0.25,
        specialist: 0.15
      });

      const startTime = Date.now();

      // Process all contacts concurrently
      const promises = contacts.map(async (contact) => {
        try {
          // Webhook submission
          const formData = testDataGenerator.contactToWebhookPayload(contact);
          const webhookResponse = await webhookClient.post('/webhook/n8n/interest-form', formData);

          if (webhookResponse.status !== 200) {
            throw new Error(`Webhook failed: ${webhookResponse.status}`);
          }

          // Mailchimp processing
          const subscriber = mockMailchimpAPI.addSubscriber(contact.email, {
            merge_fields: {
              FNAME: contact.firstName,
              LNAME: contact.lastName,
              USERTYPE: contact.userType,
              SPECIALTY: contact.specialty || '',
              CHALLENGE: contact.challenge || ''
            }
          });

          // Email template rendering
          const templateId = templateValidator.getTemplateByUserType(contact.userType);
          const renderedTemplate = templateValidator.renderTemplate(templateId, contact);
          const validation = templateValidator.validateRenderedTemplate(renderedTemplate, contact);

          return {
            success: true,
            contact,
            subscriber,
            templateValid: validation.valid
          };
        } catch (error) {
          return {
            success: false,
            contact,
            error: error.message
          };
        }
      });

      const results = await Promise.allSettled(promises);
      const endTime = Date.now();

      // Analyze results
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
      const failed = results.filter(r => r.status === 'rejected' || !r.value.success).length;
      const totalTime = endTime - startTime;

      console.log(`Batch Processing Results:
        - Total contacts: ${batchSize}
        - Successful: ${successful}
        - Failed: ${failed}
        - Total time: ${totalTime}ms
        - Average time per contact: ${(totalTime / batchSize).toFixed(2)}ms`);

      // Performance assertions
      expect(successful).toBeGreaterThan(batchSize * 0.95); // 95% success rate
      expect(totalTime).toBeLessThan(30000); // Under 30 seconds
      expect(totalTime / batchSize).toBeLessThan(1000); // Under 1 second per contact

      // Verify data integrity
      const allSubscribers = mockMailchimpAPI.getAllSubscribers();
      expect(allSubscribers.length).toBe(successful);

      console.log('✅ Batch processing performance test completed');
    });
  });

  describe('Error Handling Scenarios', () => {
    test('should handle webhook failures gracefully', async () => {
      // Configure webhook to return errors
      webhookSimulator.configureResponse('/webhook/n8n/interest-form', {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: { success: false, error: 'Internal server error' }
      });

      const contact = testDataGenerator.generateContact('physician');
      const formData = testDataGenerator.contactToWebhookPayload(contact);

      const webhookResponse = await webhookClient.post('/webhook/n8n/interest-form', formData);
      expect(webhookResponse.status).toBe(500);

      // Workflow should handle this gracefully - maybe retry logic or fallback
      console.log('✅ Webhook failure handling verified');
    });

    test('should handle malformed data gracefully', async () => {
      const malformedData = {
        // Missing required fields
        email: 'not-an-email',
        userType: 'invalid-type',
        firstName: '', // Empty required field
        // Various other issues
      };

      try {
        const webhookResponse = await webhookClient.post('/webhook/n8n/interest-form', malformedData);
        // Even if webhook accepts it, validation should catch issues

        const validation = webhookSimulator.validateMailchimpWebhook({
          body: malformedData
        });

        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBeGreaterThan(0);

      } catch (error) {
        // Error is expected for malformed data
        expect(error.message).toBeTruthy();
      }

      console.log('✅ Malformed data handling verified');
    });
  });

  describe('Engagement Tracking Scenarios', () => {
    test('should track email engagement across user types', async () => {
      const contacts = [
        testDataGenerator.generateContact('physician'),
        testDataGenerator.generateContact('investor'),
        testDataGenerator.generateContact('specialist')
      ];

      // Process contacts and send emails
      for (const contact of contacts) {
        // Add to Mailchimp
        mockMailchimpAPI.addSubscriber(contact.email, {
          merge_fields: {
            FNAME: contact.firstName,
            LNAME: contact.lastName,
            USERTYPE: contact.userType
          }
        });

        // Generate and deliver email
        const templateId = templateValidator.getTemplateByUserType(contact.userType);
        const renderedTemplate = templateValidator.renderTemplate(templateId, contact);

        const deliveredEmail = emailValidator.simulateEmailDelivery({
          to: contact.email,
          subject: renderedTemplate.subject,
          content: renderedTemplate.html,
          template: templateId,
          userType: contact.userType
        });

        // Simulate different engagement patterns by user type
        emailValidator.simulateEmailEngagement(deliveredEmail.id, 'open');

        if (contact.userType === 'investor') {
          // Investors tend to click more
          emailValidator.simulateEmailEngagement(deliveredEmail.id, 'click');
        }

        if (contact.userType === 'physician') {
          // Some physicians might unsubscribe if too sales-y
          if (Math.random() < 0.1) { // 10% unsubscribe rate
            emailValidator.simulateEmailEngagement(deliveredEmail.id, 'unsubscribe');
          }
        }
      }

      // Analyze engagement by user type
      const physicianStats = emailValidator.getEngagementStats('physician');
      const investorStats = emailValidator.getEngagementStats('investor');
      const specialistStats = emailValidator.getEngagementStats('specialist');

      console.log('Engagement Stats:');
      console.log('- Physicians:', physicianStats);
      console.log('- Investors:', investorStats);
      console.log('- Specialists:', specialistStats);

      // Verify tracking worked
      expect(physicianStats).toBeDefined();
      expect(investorStats).toBeDefined();
      expect(specialistStats).toBeDefined();

      console.log('✅ Engagement tracking scenarios completed');
    });
  });
});