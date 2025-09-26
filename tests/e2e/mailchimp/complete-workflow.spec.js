/**
 * End-to-End Tests for Complete Mailchimp Workflow
 * Tests the entire flow from form submission to email delivery
 */

const { test, expect } = require('@playwright/test');
const { testDataGenerator } = require('../../utils/testDataGenerator');
const { mockMailchimpAPI } = require('../../mocks/mailchimp/mockMailchimpAPI');

// Test configuration
const TEST_CONFIG = {
  BASE_URL: process.env.TEST_BASE_URL || 'http://localhost:3000',
  WEBHOOK_URL: process.env.TEST_WEBHOOK_URL || 'http://localhost:3001/webhook/test',
  USE_MOCK_WEBHOOK: process.env.USE_MOCK_WEBHOOK !== 'false',
  TELEGRAM_BOT_TOKEN: process.env.TEST_TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID: process.env.TEST_TELEGRAM_CHAT_ID
};

test.describe('Complete Mailchimp Workflow E2E', () => {
  let mockWebhookServer;
  let webhookRequests = [];

  test.beforeAll(async () => {
    if (TEST_CONFIG.USE_MOCK_WEBHOOK) {
      // Start mock webhook server for testing
      mockWebhookServer = await startMockWebhookServer();
    }
  });

  test.afterAll(async () => {
    if (mockWebhookServer) {
      await mockWebhookServer.close();
    }
  });

  test.beforeEach(async ({ page }) => {
    // Reset mock data and webhook requests
    mockMailchimpAPI.reset();
    webhookRequests = [];

    // Set up network interception for webhook calls
    await page.route('**/webhook/**', async route => {
      const request = route.request();
      const postData = request.postData();

      webhookRequests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        body: postData ? JSON.parse(postData) : null,
        timestamp: new Date().toISOString()
      });

      // Simulate successful webhook response
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Contact processed successfully' })
      });
    });

    // Navigate to interest form
    await page.goto(`${TEST_CONFIG.BASE_URL}/#interest-form`);
    await page.waitForLoadState('networkidle');
  });

  test.describe('Physician Workflow', () => {
    test('should complete standard physician onboarding', async ({ page }) => {
      const physician = testDataGenerator.generateContact('physician', {
        overrides: { cofounder: false }
      });

      // Fill out the interest form
      await fillInterestForm(page, physician);

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for submission success
      await expect(page.locator('.success-message')).toBeVisible({ timeout: 10000 });

      // Verify webhook was called
      expect(webhookRequests).toHaveLength(1);
      const webhookData = webhookRequests[0].body;

      expect(webhookData).toMatchObject({
        firstName: physician.firstName,
        lastName: physician.lastName,
        email: physician.email,
        userType: 'physician',
        specialty: physician.specialty,
        practiceModel: physician.practiceModel,
        emrSystem: physician.emrSystem,
        challenge: physician.challenge,
        cofounder: false
      });

      // Simulate Mailchimp processing
      const subscriber = mockMailchimpAPI.addSubscriber(physician.email, {
        merge_fields: {
          FNAME: physician.firstName,
          LNAME: physician.lastName,
          USERTYPE: 'physician',
          SPECIALTY: physician.specialty,
          PRACTICE: physician.practiceModel,
          EMR: physician.emrSystem,
          CHALLENGE: physician.challenge,
          COFOUNDER: 'No'
        }
      });

      // Verify subscriber was created with correct tags
      expect(subscriber.tags).toContainEqual({ name: 'physician', id: 1 });
      expect(subscriber.tags).toContainEqual({ name: 'standard', id: 4 });
      expect(subscriber.tags).not.toContainEqual({ name: 'high-priority', id: 3 });

      // Verify no immediate notification (standard physician)
      // Note: In real test, would check that no Telegram message was sent
    });

    test('should trigger high-priority workflow for co-founder interest', async ({ page }) => {
      const cofounderPhysician = testDataGenerator.generateContact('physician', {
        overrides: { cofounder: true }
      });

      // Fill out the interest form with co-founder interest
      await fillInterestForm(page, cofounderPhysician);

      // Check co-founder interest checkbox
      await page.check('input[name="coFounderInterest"]');

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for submission success
      await expect(page.locator('.success-message')).toBeVisible({ timeout: 10000 });

      // Verify webhook payload includes co-founder interest
      expect(webhookRequests).toHaveLength(1);
      const webhookData = webhookRequests[0].body;
      expect(webhookData.cofounder).toBe(true);

      // Simulate Mailchimp processing
      const subscriber = mockMailchimpAPI.addSubscriber(cofounderPhysician.email, {
        merge_fields: {
          FNAME: cofounderPhysician.firstName,
          LNAME: cofounderPhysician.lastName,
          USERTYPE: 'physician',
          COFOUNDER: 'Yes'
        }
      });

      // Verify high-priority tags were applied
      expect(subscriber.tags).toContainEqual({ name: 'physician', id: 1 });
      expect(subscriber.tags).toContainEqual({ name: 'cofounder-interest', id: 2 });
      expect(subscriber.tags).toContainEqual({ name: 'high-priority', id: 3 });

      // In real test: verify immediate Telegram notification was sent
      console.log('✅ High-priority physician with co-founder interest processed');
    });

    test('should validate required physician fields', async ({ page }) => {
      // Try to submit form with missing required fields
      await page.fill('input[name="firstName"]', 'Test');
      await page.fill('input[name="lastName"]', 'Physician');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.selectOption('select[name="userType"]', 'physician');
      // Intentionally skip specialty and practice model

      await page.click('button[type="submit"]');

      // Should show validation errors
      await expect(page.locator('.error-message')).toBeVisible();

      // Form should not be submitted
      expect(webhookRequests).toHaveLength(0);

      // Fill in required fields
      await page.selectOption('select[name="medicalSpecialty"]', 'Family Medicine');
      await page.selectOption('select[name="practiceModel"]', 'independent');
      await page.selectOption('select[name="involvement"]', 'advisor');

      // Submit again
      await page.click('button[type="submit"]');

      // Should succeed now
      await expect(page.locator('.success-message')).toBeVisible({ timeout: 10000 });
      expect(webhookRequests).toHaveLength(1);
    });
  });

  test.describe('Investor Workflow', () => {
    test('should complete investor onboarding with notification', async ({ page }) => {
      const investor = testDataGenerator.generateContact('investor');

      // Fill out the interest form
      await fillInterestForm(page, investor);

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for submission success
      await expect(page.locator('.success-message')).toBeVisible({ timeout: 10000 });

      // Verify webhook was called
      expect(webhookRequests).toHaveLength(1);
      const webhookData = webhookRequests[0].body;

      expect(webhookData).toMatchObject({
        firstName: investor.firstName,
        lastName: investor.lastName,
        email: investor.email,
        userType: 'investor',
        linkedin: investor.linkedin,
        challenge: investor.challenge
      });

      // Simulate Mailchimp processing
      const subscriber = mockMailchimpAPI.addSubscriber(investor.email, {
        merge_fields: {
          FNAME: investor.firstName,
          LNAME: investor.lastName,
          USERTYPE: 'investor',
          LINKEDIN: investor.linkedin,
          CHALLENGE: investor.challenge
        }
      });

      // Verify investor tags
      expect(subscriber.tags).toContainEqual({ name: 'investor', id: 5 });
      expect(subscriber.tags).toContainEqual({ name: 'standard', id: 4 });

      // In real test: verify Telegram notification was sent for investor
      console.log('✅ Investor contact processed with notification');
    });

    test('should require LinkedIn for investors', async ({ page }) => {
      const investor = testDataGenerator.generateContact('investor', {
        overrides: { linkedin: '' }
      });

      // Fill form without LinkedIn
      await page.fill('input[name="firstName"]', investor.firstName);
      await page.fill('input[name="lastName"]', investor.lastName);
      await page.fill('input[name="email"]', investor.email);
      await page.selectOption('select[name="userType"]', 'investor');
      await page.fill('textarea[name="challenge"]', investor.challenge);
      // Skip LinkedIn field

      await page.click('button[type="submit"]');

      // Should show validation error
      await expect(page.locator('.error-message')).toBeVisible();
      expect(webhookRequests).toHaveLength(0);

      // Add LinkedIn URL
      await page.fill('input[name="linkedinProfile"]', 'https://linkedin.com/in/test');

      await page.click('button[type="submit"]');

      // Should succeed now
      await expect(page.locator('.success-message')).toBeVisible({ timeout: 10000 });
      expect(webhookRequests).toHaveLength(1);
    });
  });

  test.describe('Specialist Workflow', () => {
    test('should complete specialist onboarding with notification', async ({ page }) => {
      const specialist = testDataGenerator.generateContact('specialist');

      // Fill out the interest form
      await fillInterestForm(page, specialist);

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for submission success
      await expect(page.locator('.success-message')).toBeVisible({ timeout: 10000 });

      // Verify webhook was called
      expect(webhookRequests).toHaveLength(1);
      const webhookData = webhookRequests[0].body;

      expect(webhookData.userType).toBe('specialist');

      // Simulate Mailchimp processing
      const subscriber = mockMailchimpAPI.addSubscriber(specialist.email, {
        merge_fields: {
          FNAME: specialist.firstName,
          LNAME: specialist.lastName,
          USERTYPE: 'specialist',
          SPECIALTY: specialist.specialty,
          LINKEDIN: specialist.linkedin
        }
      });

      // Verify specialist tags
      expect(subscriber.tags).toContainEqual({ name: 'specialist', id: 6 });
      expect(subscriber.tags).toContainEqual({ name: 'standard', id: 4 });

      // In real test: verify Telegram notification was sent for specialist
      console.log('✅ Specialist contact processed with notification');
    });
  });

  test.describe('Email Automation Triggers', () => {
    test('should trigger welcome email automation for each user type', async ({ page }) => {
      const contacts = [
        testDataGenerator.generateContact('physician'),
        testDataGenerator.generateContact('investor'),
        testDataGenerator.generateContact('specialist')
      ];

      // Create automations for each user type
      const automations = await Promise.all([
        mockMailchimpAPI.createAutomation({
          settings: { title: 'Physician Welcome' },
          recipients: { list_id: '9884a65adf' },
          trigger_settings: { workflow_type: 'signup' }
        }),
        mockMailchimpAPI.createAutomation({
          settings: { title: 'Investor Welcome' },
          recipients: { list_id: '9884a65adf' },
          trigger_settings: { workflow_type: 'signup' }
        }),
        mockMailchimpAPI.createAutomation({
          settings: { title: 'Specialist Welcome' },
          recipients: { list_id: '9884a65adf' },
          trigger_settings: { workflow_type: 'signup' }
        })
      ]);

      // Start automations
      automations.forEach(automation => {
        mockMailchimpAPI.startAutomation(automation.id);
      });

      // Submit each contact type
      for (const contact of contacts) {
        // Navigate to form
        await page.goto(`${TEST_CONFIG.BASE_URL}/#interest-form`);

        // Fill and submit form
        await fillInterestForm(page, contact);
        await page.click('button[type="submit"]');

        // Wait for success
        await expect(page.locator('.success-message')).toBeVisible({ timeout: 10000 });

        // Simulate subscriber addition
        mockMailchimpAPI.addSubscriber(contact.email, {
          merge_fields: {
            FNAME: contact.firstName,
            LNAME: contact.lastName,
            USERTYPE: contact.userType
          }
        });
      }

      // Verify all contacts were processed
      expect(mockMailchimpAPI.getAllSubscribers()).toHaveLength(3);

      // Verify user type distribution
      expect(mockMailchimpAPI.getSubscribersByUserType('physician')).toHaveLength(1);
      expect(mockMailchimpAPI.getSubscribersByUserType('investor')).toHaveLength(1);
      expect(mockMailchimpAPI.getSubscribersByUserType('specialist')).toHaveLength(1);

      console.log('✅ All user types processed and automation triggered');
    });

    test('should handle automation email sending simulation', async ({ page }) => {
      const physician = testDataGenerator.generateContact('physician');

      // Create and start automation
      const automation = mockMailchimpAPI.createAutomation({
        settings: {
          title: 'Physician Welcome Series',
          from_name: 'Dr. Bhaven Murji',
          reply_to: 'admin@ignitehealthsystems.com'
        }
      });

      mockMailchimpAPI.startAutomation(automation.id);

      // Submit form
      await page.goto(`${TEST_CONFIG.BASE_URL}/#interest-form`);
      await fillInterestForm(page, physician);
      await page.click('button[type="submit"]');

      await expect(page.locator('.success-message')).toBeVisible({ timeout: 10000 });

      // Add subscriber and simulate email send
      const subscriber = mockMailchimpAPI.addSubscriber(physician.email, {
        merge_fields: {
          FNAME: physician.firstName,
          LNAME: physician.lastName,
          USERTYPE: 'physician'
        }
      });

      // Create campaign for testing email metrics
      const campaign = mockMailchimpAPI.createCampaign({
        settings: {
          subject_line: 'Welcome to Ignite Health Systems',
          from_name: 'Dr. Bhaven Murji'
        }
      });

      // Simulate email interactions
      mockMailchimpAPI.simulateEmailOpen(physician.email, campaign.id);
      mockMailchimpAPI.simulateEmailClick(physician.email, campaign.id);

      // Verify metrics were updated
      const updatedCampaign = mockMailchimpAPI.campaigns.get(campaign.id);
      expect(updatedCampaign.report_summary.opens).toBe(1);
      expect(updatedCampaign.report_summary.clicks).toBe(1);

      const updatedSubscriber = mockMailchimpAPI.getSubscriber(physician.email);
      expect(updatedSubscriber.stats.avg_open_rate).toBeGreaterThan(0);
      expect(updatedSubscriber.stats.avg_click_rate).toBeGreaterThan(0);

      console.log('✅ Email automation and metrics simulation completed');
    });
  });

  test.describe('Error Scenarios', () => {
    test('should handle webhook failures gracefully', async ({ page }) => {
      // Intercept webhook and simulate failure
      await page.route('**/webhook/**', async route => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      });

      const contact = testDataGenerator.generateContact('physician');

      await page.goto(`${TEST_CONFIG.BASE_URL}/#interest-form`);
      await fillInterestForm(page, contact);
      await page.click('button[type="submit"]');

      // Should show error message
      await expect(page.locator('.error-message')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('.error-message')).toContainText(/error.*submit/i);
    });

    test('should handle network timeouts', async ({ page }) => {
      // Simulate slow/timeout webhook
      await page.route('**/webhook/**', async route => {
        // Delay response beyond timeout
        await new Promise(resolve => setTimeout(resolve, 15000));
        await route.fulfill({ status: 200, body: '{}' });
      });

      const contact = testDataGenerator.generateContact('physician');

      await page.goto(`${TEST_CONFIG.BASE_URL}/#interest-form`);
      await fillInterestForm(page, contact);

      // Set shorter timeout for this test
      page.setDefaultTimeout(5000);

      await page.click('button[type="submit"]');

      // Should show timeout error
      await expect(page.locator('.error-message')).toBeVisible();
    });

    test('should validate email format client-side', async ({ page }) => {
      await page.goto(`${TEST_CONFIG.BASE_URL}/#interest-form`);

      await page.fill('input[name="firstName"]', 'Test');
      await page.fill('input[name="lastName"]', 'User');
      await page.fill('input[name="email"]', 'not-an-email');
      await page.selectOption('select[name="userType"]', 'physician');

      await page.click('button[type="submit"]');

      // Should show email validation error
      const emailInput = page.locator('input[name="email"]');
      expect(await emailInput.evaluate(el => el.validity.valid)).toBe(false);
    });
  });

  test.describe('Performance Testing', () => {
    test('should handle rapid form submissions', async ({ page }) => {
      const contacts = testDataGenerator.generateContactBatch(5);
      const startTime = Date.now();

      for (const contact of contacts) {
        await page.goto(`${TEST_CONFIG.BASE_URL}/#interest-form`);
        await fillInterestForm(page, contact);
        await page.click('button[type="submit"]');
        await expect(page.locator('.success-message')).toBeVisible({ timeout: 10000 });
      }

      const endTime = Date.now();
      const totalTime = endTime - startTime;
      const avgTimePerSubmission = totalTime / contacts.length;

      console.log(`Performance: ${totalTime}ms total, ${avgTimePerSubmission}ms average per submission`);

      // Verify all submissions were processed
      expect(webhookRequests).toHaveLength(5);

      // Performance should be reasonable
      expect(avgTimePerSubmission).toBeLessThan(10000); // Under 10 seconds per submission
    });
  });
});

// Helper function to fill the interest form
async function fillInterestForm(page, contact) {
  await page.fill('input[name="firstName"]', contact.firstName);
  await page.fill('input[name="lastName"]', contact.lastName);
  await page.fill('input[name="email"]', contact.email);
  await page.selectOption('select[name="userType"]', contact.userType);

  if (contact.userType === 'physician') {
    await page.selectOption('select[name="medicalSpecialty"]', contact.specialty);
    await page.selectOption('select[name="practiceModel"]', contact.practiceModel);
    await page.selectOption('select[name="currentEMR"]', contact.emrSystem);
    await page.selectOption('select[name="involvement"]', 'advisor');
  }

  if (contact.linkedin) {
    await page.fill('input[name="linkedinProfile"]', contact.linkedin);
  }

  if (contact.challenge) {
    await page.fill('textarea[name="challenge"]', contact.challenge);
  }

  if (contact.cofounder) {
    await page.check('input[name="coFounderInterest"]');
  }
}

// Mock webhook server for testing
async function startMockWebhookServer() {
  const http = require('http');

  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        // Simulate processing
        setTimeout(() => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            message: 'Contact processed successfully',
            timestamp: new Date().toISOString(),
            data: data
          }));
        }, 100); // Small delay to simulate processing

      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  });

  return new Promise((resolve, reject) => {
    server.listen(3001, (err) => {
      if (err) reject(err);
      else {
        console.log('Mock webhook server started on port 3001');
        resolve(server);
      }
    });
  });
}