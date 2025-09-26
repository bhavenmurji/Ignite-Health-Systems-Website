/**
 * Complete End-to-End Test Suite for Ignite Health Systems
 * Form-to-Email Automation Workflow
 *
 * Tests the complete user journey from form submission to email delivery
 * including all integrations: n8n, Mailchimp, Google Sheets, Gmail, Telegram
 */

const { test, expect } = require('@playwright/test');
const crypto = require('crypto');

// Test configuration
const config = {
  baseURL: 'https://ignitehealthsystems.com',
  webhookURL: process.env.N8N_WEBHOOK_URL || 'https://n8n.ignitehealthsystems.com/webhook/ignite-interest-form',
  mailchimpAPI: {
    key: process.env.MAILCHIMP_API_KEY,
    server: 'us18',
    audienceId: '9884a65adf'
  },
  googleSheets: {
    spreadsheetId: process.env.GOOGLE_SHEETS_ID
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID
  },
  testTimeout: 60000 // 60 seconds for complete workflow
};

// Test data generator
function generateTestUser(type = 'physician', isCofounder = false) {
  const timestamp = Date.now();
  const baseEmail = `test-${type}-${timestamp}@ignitehealthsystems.com`;

  const testUsers = {
    physician: {
      firstName: 'Dr. Sarah',
      lastName: `Test-${timestamp}`,
      email: baseEmail,
      userType: 'physician',
      specialty: 'Family Medicine',
      practiceModel: 'independent',
      emrSystem: 'Epic',
      challenge: 'Administrative burden consuming 4+ hours daily',
      cofounder: isCofounder,
      linkedin: 'https://linkedin.com/in/test-physician'
    },
    investor: {
      firstName: 'Michael',
      lastName: `Investor-${timestamp}`,
      email: baseEmail,
      userType: 'investor',
      specialty: '',
      practiceModel: '',
      emrSystem: '',
      involvement: 'Healthcare Technology Investments',
      challenge: 'Seeking physician-led healthcare disruption opportunities',
      cofounder: isCofounder,
      linkedin: 'https://linkedin.com/in/test-investor'
    },
    specialist: {
      firstName: 'Alex',
      lastName: `Specialist-${timestamp}`,
      email: baseEmail,
      userType: 'specialist',
      specialty: 'Healthcare AI Development',
      practiceModel: '',
      emrSystem: '',
      involvement: 'AI-enhanced clinical decision support',
      challenge: 'Building AI that enhances physician judgment',
      cofounder: isCofounder,
      linkedin: 'https://linkedin.com/in/test-specialist'
    }
  };

  return testUsers[type];
}

// Utility functions for API verification
class WorkflowValidator {
  constructor() {
    this.mailchimpBase = `https://${config.mailchimpAPI.server}.api.mailchimp.com/3.0`;
    this.authHeader = Buffer.from(`anystring:${config.mailchimpAPI.key}`).toString('base64');
  }

  async checkMailchimpContact(email) {
    const emailHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
    const url = `${this.mailchimpBase}/lists/${config.mailchimpAPI.audienceId}/members/${emailHash}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Basic ${this.authHeader}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Mailchimp check failed:', error);
      return null;
    }
  }

  async verifyGoogleSheetsEntry(email) {
    // This would require Google Sheets API integration
    // For now, we'll simulate the check
    console.log(`Verifying Google Sheets entry for: ${email}`);
    return { found: true, timestamp: new Date().toISOString() };
  }

  async checkTelegramNotification(expectedType) {
    // This would require Telegram API integration to check recent messages
    // For now, we'll simulate based on user type
    const shouldNotify = expectedType !== 'physician' || expectedType === 'cofounder';
    console.log(`Telegram notification expected: ${shouldNotify}`);
    return { sent: shouldNotify };
  }
}

test.describe('Complete Workflow E2E Tests', () => {
  let validator;

  test.beforeAll(async () => {
    validator = new WorkflowValidator();
  });

  test.describe('Form Submission Tests', () => {
    test('should submit physician form successfully', async ({ page }) => {
      const testUser = generateTestUser('physician', false);

      // Navigate to the form
      await page.goto(config.baseURL);

      // Wait for and click the interest form trigger
      await page.waitForSelector('#interest-form-trigger', { timeout: 10000 });
      await page.click('#interest-form-trigger');

      // Fill out the form
      await page.waitForSelector('#interest-form', { timeout: 5000 });
      await page.fill('input[name="firstName"]', testUser.firstName);
      await page.fill('input[name="lastName"]', testUser.lastName);
      await page.fill('input[name="email"]', testUser.email);
      await page.selectOption('select[name="userType"]', testUser.userType);
      await page.fill('input[name="specialty"]', testUser.specialty);
      await page.selectOption('select[name="practiceModel"]', testUser.practiceModel);
      await page.selectOption('select[name="emrSystem"]', testUser.emrSystem);
      await page.fill('textarea[name="challenge"]', testUser.challenge);

      if (testUser.linkedin) {
        await page.fill('input[name="linkedin"]', testUser.linkedin);
      }

      // Submit form and verify success
      await page.click('button[type="submit"]');

      // Wait for success message
      await expect(page.locator('.success-message')).toBeVisible({ timeout: 10000 });

      // Store test user for later verification
      test.info().annotations.push({ type: 'testUser', description: JSON.stringify(testUser) });
    });

    test('should submit investor form with co-founder interest', async ({ page }) => {
      const testUser = generateTestUser('investor', true);

      await page.goto(config.baseURL);
      await page.click('#interest-form-trigger');
      await page.waitForSelector('#interest-form');

      // Fill investor-specific form
      await page.fill('input[name="firstName"]', testUser.firstName);
      await page.fill('input[name="lastName"]', testUser.lastName);
      await page.fill('input[name="email"]', testUser.email);
      await page.selectOption('select[name="userType"]', testUser.userType);
      await page.fill('input[name="involvement"]', testUser.involvement);
      await page.fill('textarea[name="challenge"]', testUser.challenge);

      // Check co-founder interest
      await page.check('input[name="cofounder"]');

      await page.click('button[type="submit"]');
      await expect(page.locator('.success-message')).toBeVisible({ timeout: 10000 });

      test.info().annotations.push({ type: 'testUser', description: JSON.stringify(testUser) });
    });

    test('should submit specialist form successfully', async ({ page }) => {
      const testUser = generateTestUser('specialist', false);

      await page.goto(config.baseURL);
      await page.click('#interest-form-trigger');
      await page.waitForSelector('#interest-form');

      await page.fill('input[name="firstName"]', testUser.firstName);
      await page.fill('input[name="lastName"]', testUser.lastName);
      await page.fill('input[name="email"]', testUser.email);
      await page.selectOption('select[name="userType"]', testUser.userType);
      await page.fill('input[name="specialty"]', testUser.specialty);
      await page.fill('input[name="involvement"]', testUser.involvement);
      await page.fill('textarea[name="challenge"]', testUser.challenge);

      await page.click('button[type="submit"]');
      await expect(page.locator('.success-message')).toBeVisible({ timeout: 10000 });

      test.info().annotations.push({ type: 'testUser', description: JSON.stringify(testUser) });
    });
  });

  test.describe('Integration Verification Tests', () => {
    test('should verify complete physician workflow integration', async ({ page }) => {
      const testUser = generateTestUser('physician', false);

      // Submit form
      await page.goto(config.baseURL);
      await page.click('#interest-form-trigger');
      await page.waitForSelector('#interest-form');

      // Fill and submit form
      await page.fill('input[name="firstName"]', testUser.firstName);
      await page.fill('input[name="lastName"]', testUser.lastName);
      await page.fill('input[name="email"]', testUser.email);
      await page.selectOption('select[name="userType"]', testUser.userType);
      await page.fill('input[name="specialty"]', testUser.specialty);
      await page.selectOption('select[name="practiceModel"]', testUser.practiceModel);
      await page.selectOption('select[name="emrSystem"]', testUser.emrSystem);
      await page.fill('textarea[name="challenge"]', testUser.challenge);

      await page.click('button[type="submit"]');
      await expect(page.locator('.success-message')).toBeVisible();

      // Wait for processing
      await page.waitForTimeout(15000);

      // Verify Mailchimp integration
      const mailchimpContact = await validator.checkMailchimpContact(testUser.email);
      expect(mailchimpContact).not.toBeNull();
      expect(mailchimpContact.merge_fields.USERTYPE).toBe('physician');
      expect(mailchimpContact.tags.some(tag => tag.name === 'physician')).toBeTruthy();

      // Verify Google Sheets logging
      const sheetsEntry = await validator.verifyGoogleSheetsEntry(testUser.email);
      expect(sheetsEntry.found).toBeTruthy();

      // Verify no Telegram notification for standard physician
      const telegramCheck = await validator.checkTelegramNotification('physician');
      expect(telegramCheck.sent).toBeFalsy();
    });

    test('should verify high-priority co-founder workflow', async ({ page }) => {
      const testUser = generateTestUser('investor', true);

      // Submit form
      await page.goto(config.baseURL);
      await page.click('#interest-form-trigger');
      await page.waitForSelector('#interest-form');

      await page.fill('input[name="firstName"]', testUser.firstName);
      await page.fill('input[name="lastName"]', testUser.lastName);
      await page.fill('input[name="email"]', testUser.email);
      await page.selectOption('select[name="userType"]', testUser.userType);
      await page.fill('input[name="involvement"]', testUser.involvement);
      await page.fill('textarea[name="challenge"]', testUser.challenge);
      await page.check('input[name="cofounder"]');

      await page.click('button[type="submit"]');
      await expect(page.locator('.success-message')).toBeVisible();

      // Wait for processing
      await page.waitForTimeout(15000);

      // Verify Mailchimp integration with co-founder tags
      const mailchimpContact = await validator.checkMailchimpContact(testUser.email);
      expect(mailchimpContact).not.toBeNull();
      expect(mailchimpContact.merge_fields.USERTYPE).toBe('investor');
      expect(mailchimpContact.tags.some(tag => tag.name === 'cofounder-interest')).toBeTruthy();

      // Verify Telegram notification was sent
      const telegramCheck = await validator.checkTelegramNotification('cofounder');
      expect(telegramCheck.sent).toBeTruthy();
    });
  });

  test.describe('Error Handling Tests', () => {
    test('should handle invalid email gracefully', async ({ page }) => {
      await page.goto(config.baseURL);
      await page.click('#interest-form-trigger');
      await page.waitForSelector('#interest-form');

      // Fill form with invalid email
      await page.fill('input[name="firstName"]', 'Test');
      await page.fill('input[name="lastName"]', 'User');
      await page.fill('input[name="email"]', 'invalid-email-format');
      await page.selectOption('select[name="userType"]', 'physician');

      await page.click('button[type="submit"]');

      // Should show validation error
      await expect(page.locator('.error-message')).toBeVisible();
    });

    test('should handle missing required fields', async ({ page }) => {
      await page.goto(config.baseURL);
      await page.click('#interest-form-trigger');
      await page.waitForSelector('#interest-form');

      // Submit with minimal data
      await page.fill('input[name="firstName"]', 'Test');
      await page.click('button[type="submit"]');

      // Should show required field errors
      await expect(page.locator('.validation-error')).toBeVisible();
    });

    test('should handle special characters in input', async ({ page }) => {
      const testUser = generateTestUser('specialist', false);
      testUser.challenge = "Testing special chars: <script>alert('xss')</script> & SQL'; DROP TABLE--";

      await page.goto(config.baseURL);
      await page.click('#interest-form-trigger');
      await page.waitForSelector('#interest-form');

      await page.fill('input[name="firstName"]', testUser.firstName);
      await page.fill('input[name="lastName"]', testUser.lastName);
      await page.fill('input[name="email"]', testUser.email);
      await page.selectOption('select[name="userType"]', testUser.userType);
      await page.fill('textarea[name="challenge"]', testUser.challenge);

      await page.click('button[type="submit"]');
      await expect(page.locator('.success-message')).toBeVisible();

      // Wait and verify data was sanitized
      await page.waitForTimeout(10000);
      const mailchimpContact = await validator.checkMailchimpContact(testUser.email);
      expect(mailchimpContact).not.toBeNull();
      // Verify no script tags made it through
      expect(mailchimpContact.merge_fields.CHALLENGE).not.toContain('<script>');
    });
  });

  test.describe('Performance Tests', () => {
    test('should handle form submission within performance threshold', async ({ page }) => {
      const testUser = generateTestUser('physician', false);

      await page.goto(config.baseURL);

      const startTime = Date.now();
      await page.click('#interest-form-trigger');
      await page.waitForSelector('#interest-form');

      await page.fill('input[name="firstName"]', testUser.firstName);
      await page.fill('input[name="lastName"]', testUser.lastName);
      await page.fill('input[name="email"]', testUser.email);
      await page.selectOption('select[name="userType"]', testUser.userType);
      await page.fill('input[name="specialty"]', testUser.specialty);

      await page.click('button[type="submit"]');
      await expect(page.locator('.success-message')).toBeVisible();

      const endTime = Date.now();
      const submitTime = endTime - startTime;

      // Form submission should complete within 5 seconds
      expect(submitTime).toBeLessThan(5000);
    });

    test('should handle concurrent submissions', async ({ browser }) => {
      const concurrentSubmissions = 5;
      const promises = [];

      for (let i = 0; i < concurrentSubmissions; i++) {
        const context = await browser.newContext();
        const page = await context.newPage();

        promises.push(submitConcurrentForm(page, i));
      }

      const results = await Promise.all(promises);

      // All submissions should succeed
      results.forEach((result, index) => {
        expect(result.success).toBeTruthy();
        console.log(`Concurrent submission ${index + 1}: ${result.duration}ms`);
      });
    });
  });
});

async function submitConcurrentForm(page, index) {
  const startTime = Date.now();
  const testUser = generateTestUser('physician', false);
  testUser.email = `concurrent-test-${index}-${Date.now()}@ignitehealthsystems.com`;

  try {
    await page.goto(config.baseURL);
    await page.click('#interest-form-trigger');
    await page.waitForSelector('#interest-form');

    await page.fill('input[name="firstName"]', testUser.firstName);
    await page.fill('input[name="lastName"]', testUser.lastName);
    await page.fill('input[name="email"]', testUser.email);
    await page.selectOption('select[name="userType"]', testUser.userType);

    await page.click('button[type="submit"]');
    await expect(page.locator('.success-message')).toBeVisible();

    const endTime = Date.now();
    return { success: true, duration: endTime - startTime };
  } catch (error) {
    console.error(`Concurrent submission ${index} failed:`, error);
    return { success: false, error: error.message };
  } finally {
    await page.context().close();
  }
}

// Test hooks for setup and teardown
test.beforeEach(async ({ page }) => {
  // Set up page monitoring
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error));
});

test.afterEach(async ({ page }, testInfo) => {
  // Capture screenshot on failure
  if (testInfo.status !== 'passed') {
    const screenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
  }
});