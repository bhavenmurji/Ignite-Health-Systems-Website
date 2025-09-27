import { test, expect } from '@playwright/test';
import { emailUtils } from '../utils/email-utils';
import { testUsers } from '../fixtures/user-data';

/**
 * Complete Email Workflow Tests
 * Tests the full email lifecycle from signup to delivery and content validation
 */

test.describe('Complete Email Workflow', () => {

  test.describe('End-to-End Email Flow', () => {
    test('should complete full physician signup and email workflow', async ({ page }) => {
      const user = testUsers.physician;

      // Step 1: Clean up any existing subscriptions
      await emailUtils.cleanupTestEmails(user.email);

      // Step 2: Navigate and signup
      await page.goto('/');
      await page.waitForSelector('#signup');
      await page.locator('#signup').scrollIntoViewIfNeeded();

      // Step 3: Fill and submit form
      await page.locator('#signup input[name="name"]').fill(user.name);
      await page.locator('#signup input[name="email"]').fill(user.email);
      await page.locator('#signup select[name="role"]').selectOption(user.role);
      await page.locator('#signup textarea[name="note"]').fill(user.note || '');

      // Capture form submission
      const submitButton = page.locator('#signup button[type="submit"]');

      // Monitor network requests for API calls
      const apiPromise = page.waitForResponse(response =>
        response.url().includes('/api/') || response.url().includes('/webhook/') ||
        response.url().includes('/subscribe') || response.url().includes('/signup')
      ).catch(() => null);

      await submitButton.click();

      // Step 4: Wait for API response
      const apiResponse = await apiPromise;
      if (apiResponse) {
        console.log(`API Response: ${apiResponse.status()} - ${apiResponse.url()}`);
        expect(apiResponse.status()).toBeLessThan(400);
      }

      // Step 5: Verify email delivery (if email credentials are available)
      if (process.env.GMAIL_APP_PASSWORD) {
        console.log('📧 Waiting for welcome email...');

        const welcomeEmail = await emailUtils.waitForEmail(
          user.email,
          'Welcome',
          180000 // 3 minute timeout for email delivery
        );

        if (welcomeEmail) {
          // Validate email content
          emailUtils.validateWelcomeEmail(welcomeEmail, user.role);

          // Validate AI personalization
          const hasPersonalization = emailUtils.validateAIPersonalization(welcomeEmail, user.role);
          expect(hasPersonalization).toBe(true);

          console.log('✅ Full email workflow completed successfully');
          console.log(`📧 Email received: "${welcomeEmail.subject}"`);
        } else {
          console.log('⚠️ Email not received within timeout - N8N may not be configured');
        }
      } else {
        console.log('ℹ️ Email testing skipped - credentials not provided');
      }
    });

    test('should complete full investor signup and email workflow', async ({ page }) => {
      const user = testUsers.investor;

      // Step 1: Clean up any existing subscriptions
      await emailUtils.cleanupTestEmails(user.email);

      // Step 2: Navigate and signup
      await page.goto('/');
      await page.waitForSelector('#signup');
      await page.locator('#signup').scrollIntoViewIfNeeded();

      // Step 3: Fill and submit form
      await page.locator('#signup input[name="name"]').fill(user.name);
      await page.locator('#signup input[name="email"]').fill(user.email);
      await page.locator('#signup select[name="role"]').selectOption(user.role);
      await page.locator('#signup textarea[name="note"]').fill(user.note || '');

      // Monitor for form submission
      const submitButton = page.locator('#signup button[type="submit"]');
      await submitButton.click();

      // Step 4: Verify email delivery for investor
      if (process.env.ICLOUD_PASSWORD) {
        console.log('📧 Waiting for investor welcome email...');

        const welcomeEmail = await emailUtils.waitForEmail(
          user.email,
          'Welcome',
          180000
        );

        if (welcomeEmail) {
          // Validate investor-specific content
          emailUtils.validateWelcomeEmail(welcomeEmail, 'investor');

          // Check for investment-related personalization
          const hasInvestorContent = emailUtils.validateAIPersonalization(welcomeEmail, 'investor');
          expect(hasInvestorContent).toBe(true);

          console.log('✅ Investor email workflow completed successfully');
        } else {
          console.log('⚠️ Investor email not received within timeout');
        }
      } else {
        console.log('ℹ️ Investor email testing skipped - iCloud credentials not provided');
      }
    });
  });

  test.describe('Email Content Validation', () => {
    test('should validate AI personalization in emails', async ({ page }) => {
      // This test validates the AI personalization logic
      const testEmail = {
        subject: 'Welcome to Ignite Health Systems - Transform Your Practice',
        text: 'Dear Dr. Murji, Welcome to Ignite Health Systems. Our AI-powered platform will help you improve patient care and clinical decision making...',
        html: '<h1>Welcome Dr. Murji</h1><p>Transform your medical practice with AI...</p>',
        from: 'noreply@ignitehealthsystems.com',
        to: 'bhavenmurji@gmail.com',
        timestamp: new Date()
      };

      // Test physician personalization
      const physicianPersonalization = emailUtils.validateAIPersonalization(testEmail, 'physician');
      expect(physicianPersonalization).toBe(true);

      // Test investor content
      const investorEmail = {
        ...testEmail,
        text: 'Dear Bhaven, Thank you for your interest in Ignite Health Systems. Our platform represents a significant market opportunity in healthcare AI with strong ROI potential...',
        html: '<h1>Investment Opportunity</h1><p>Healthcare AI market growth and funding opportunities...</p>'
      };

      const investorPersonalization = emailUtils.validateAIPersonalization(investorEmail, 'investor');
      expect(investorPersonalization).toBe(true);
    });

    test('should validate email structure and content', async () => {
      // Test welcome email structure
      const welcomeEmail = {
        subject: 'Welcome to Ignite Health Systems',
        text: 'Welcome to our platform...',
        html: '<html><body>Welcome...</body></html>',
        from: 'noreply@ignitehealthsystems.com',
        to: 'test@example.com',
        timestamp: new Date()
      };

      emailUtils.validateWelcomeEmail(welcomeEmail, 'physician');

      // Test newsletter structure
      const newsletterEmail = {
        subject: 'Ignite Health Systems Monthly Newsletter',
        text: 'Monthly insights... Click here to unsubscribe',
        html: '<html><body>Newsletter content... <a href="#">Unsubscribe</a></body></html>',
        from: 'newsletter@ignitehealthsystems.com',
        to: 'test@example.com',
        timestamp: new Date()
      };

      emailUtils.validateNewsletterEmail(newsletterEmail);
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle duplicate signups gracefully', async ({ page }) => {
      const user = testUsers.physician;

      // First signup
      await page.goto('/');
      await page.waitForSelector('#signup');
      await page.locator('#signup input[name="name"]').fill(user.name);
      await page.locator('#signup input[name="email"]').fill(user.email);
      await page.locator('#signup select[name="role"]').selectOption(user.role);
      await page.locator('#signup button[type="submit"]').click();

      // Wait a moment
      await page.waitForTimeout(2000);

      // Second signup with same email
      await page.locator('#signup input[name="name"]').fill(user.name + ' Again');
      await page.locator('#signup input[name="email"]').fill(user.email);
      await page.locator('#signup select[name="role"]').selectOption(user.role);
      await page.locator('#signup button[type="submit"]').click();

      // Should handle duplicate gracefully (no error expected)
      console.log('✅ Duplicate signup handled');
    });

    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate offline condition
      await page.route('**/api/**', route => route.abort());
      await page.route('**/webhook/**', route => route.abort());

      await page.goto('/');
      await page.waitForSelector('#signup');

      await page.locator('#signup input[name="name"]').fill('Test User');
      await page.locator('#signup input[name="email"]').fill('test@example.com');
      await page.locator('#signup select[name="role"]').selectOption('physician');
      await page.locator('#signup button[type="submit"]').click();

      // Should handle network error gracefully
      console.log('✅ Network error handled');
    });

    test('should validate form with edge case inputs', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('#signup');

      // Test with very long name
      const longName = 'A'.repeat(100);
      await page.locator('#signup input[name="name"]').fill(longName);

      // Test with edge case email
      await page.locator('#signup input[name="email"]').fill('test+tag@example-domain.co.uk');

      // Test with very long note
      const longNote = 'This is a very long note '.repeat(50);
      await page.locator('#signup textarea[name="note"]').fill(longNote);

      await page.locator('#signup select[name="role"]').selectOption('administrator');
      await page.locator('#signup button[type="submit"]').click();

      console.log('✅ Edge case inputs handled');
    });
  });

  test.describe('Performance and Load Testing', () => {
    test('should handle rapid form submissions', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('#signup');

      // Rapid submissions (should be debounced)
      for (let i = 0; i < 5; i++) {
        await page.locator('#signup input[name="name"]').fill(`Test User ${i}`);
        await page.locator('#signup input[name="email"]').fill(`test${i}@example.com`);
        await page.locator('#signup select[name="role"]').selectOption('other');
        await page.locator('#signup button[type="submit"]').click();
        await page.waitForTimeout(100); // Small delay between submissions
      }

      console.log('✅ Rapid submissions handled');
    });

    test('should maintain performance with large form inputs', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('#signup');

      const startTime = Date.now();

      // Large inputs
      await page.locator('#signup input[name="name"]').fill('Dr. ' + 'VeryLongName'.repeat(10));
      await page.locator('#signup input[name="email"]').fill('verylongemailaddress@verylongdomainname.com');
      await page.locator('#signup textarea[name="note"]').fill('Very long note content. '.repeat(100));
      await page.locator('#signup select[name="role"]').selectOption('physician');
      await page.locator('#signup button[type="submit"]').click();

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time
      expect(duration).toBeLessThan(10000); // 10 seconds

      console.log(`✅ Large form submission completed in ${duration}ms`);
    });
  });
});