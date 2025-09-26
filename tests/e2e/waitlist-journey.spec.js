/**
 * @test Waitlist Journey E2E Tests
 * @description Complete end-to-end testing of the physician waitlist signup flow
 * @prerequisites Live server running on localhost:3000
 */

const { test, expect } = require('@playwright/test');

test.describe('Physician Waitlist Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should complete full waitlist signup journey from homepage', async ({ page }) => {
    // 1. Homepage loads correctly
    await expect(page).toHaveTitle(/Ignite Health Systems/);
    await expect(page.locator('h1')).toContainText('Before vs After: The Independence Crisis');

    // 2. Navigate to waitlist from hero CTA
    await page.click('text=Join the Revolution');
    await page.waitForURL('**/join.html');

    // 3. Fill out waitlist form with valid physician data
    await page.fill('[name="name"]', 'Dr. Sarah Chen, MD');
    await page.fill('[name="email"]', 'sarah.chen@familyclinic.com');
    await page.fill('[name="phone"]', '(555) 123-4567');
    await page.selectOption('[name="practice_type"]', 'family_medicine');
    await page.fill('[name="message"]', 'I am interested in reducing my EHR burden and improving patient care efficiency.');

    // 4. Submit form
    await page.click('button[type="submit"]');

    // 5. Verify success message or confirmation
    await expect(page.locator('.success-message, .confirmation')).toBeVisible({ timeout: 10000 });

    // 6. Check for email confirmation mention
    await expect(page.locator('text=confirmation email')).toBeVisible();
  });

  test('should validate required fields on waitlist form', async ({ page }) => {
    await page.goto('/join.html');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Check for validation messages
    const nameField = page.locator('[name="name"]');
    const emailField = page.locator('[name="email"]');
    const practiceField = page.locator('[name="practice_type"]');

    await expect(nameField).toHaveAttribute('required');
    await expect(emailField).toHaveAttribute('required');
    await expect(practiceField).toHaveAttribute('required');

    // Check if browser validation triggers
    const nameValidationMessage = await nameField.evaluate(el => el.validationMessage);
    const emailValidationMessage = await emailField.evaluate(el => el.validationMessage);

    expect(nameValidationMessage).toBeTruthy();
    expect(emailValidationMessage).toBeTruthy();
  });

  test('should handle invalid email formats gracefully', async ({ page }) => {
    await page.goto('/join.html');

    // Test invalid email formats
    const invalidEmails = ['invalid-email', 'test@', '@clinic.com'];

    for (const email of invalidEmails) {
      await page.fill('[name="name"]', 'Dr. Test Physician');
      await page.fill('[name="email"]', email);
      await page.selectOption('[name="practice_type"]', 'internal_medicine');

      await page.click('button[type="submit"]');

      // Should show validation error
      const emailField = page.locator('[name="email"]');
      const validationMessage = await emailField.evaluate(el => el.validationMessage);
      expect(validationMessage).toBeTruthy();

      await page.reload();
    }
  });

  test('should track user interactions with analytics', async ({ page }) => {
    // Enable request interception to verify analytics calls
    await page.route('**/*analytics*', route => route.continue());
    await page.route('**/*gtag*', route => route.continue());

    // Navigation tracking
    await page.click('text=Join the Revolution');
    await page.waitForURL('**/join.html');

    // Form interaction tracking
    await page.fill('[name="name"]', 'Dr. Analytics Test');
    await page.fill('[name="email"]', 'analytics@test.com');

    // Check if analytics events are fired (this would depend on actual implementation)
    const analyticsScripts = await page.locator('script[src*="analytics"], script[src*="gtag"]').count();
    expect(analyticsScripts).toBeGreaterThan(0);
  });
});

test.describe('ROI Calculator Journey', () => {
  test('should calculate physician time savings accurately', async ({ page }) => {
    await page.goto('/');

    // Navigate to ROI calculator section
    await page.locator('#roi-calculator, .roi-calculator').scrollIntoViewIfNeeded();

    // Test default values
    const currentTimeText = await page.locator('#current-time').textContent();
    const timeSavedText = await page.locator('#time-saved').textContent();
    const monthlyValueText = await page.locator('#monthly-value').textContent();

    expect(currentTimeText).toContain('hours/week');
    expect(timeSavedText).toContain('hours/week');
    expect(monthlyValueText).toContain('$');

    // Change input values and verify calculations
    await page.fill('#patients-per-day', '30');
    await page.fill('#minutes-per-note', '20');
    await page.fill('#working-days', '6');

    // Wait for calculation update
    await page.waitForTimeout(500);

    // Verify updated calculations
    const newCurrentTime = await page.locator('#current-time').textContent();
    const newTimeSaved = await page.locator('#time-saved').textContent();
    const newMonthlyValue = await page.locator('#monthly-value').textContent();

    // Values should be different from defaults
    expect(newCurrentTime).not.toBe(currentTimeText);
    expect(newTimeSaved).not.toBe(timeSavedText);
    expect(newMonthlyValue).not.toBe(monthlyValueText);

    // Extract numbers for validation
    const currentHours = parseFloat(newCurrentTime.match(/(\d+\.?\d*)/)[1]);
    const savedHours = parseFloat(newTimeSaved.match(/(\d+\.?\d*)/)[1]);

    // Verify calculation logic: 30 patients * 20 minutes * 6 days = 3600 minutes = 60 hours
    expect(currentHours).toBe(60);
    expect(savedHours).toBe(24); // 40% of 60 hours
  });

  test('should handle edge cases in calculator inputs', async ({ page }) => {
    await page.goto('/');
    await page.locator('.roi-calculator').scrollIntoViewIfNeeded();

    // Test minimum values
    await page.fill('#patients-per-day', '1');
    await page.fill('#minutes-per-note', '1');
    await page.fill('#working-days', '1');

    await page.waitForTimeout(300);

    const minResult = await page.locator('#current-time').textContent();
    expect(minResult).toContain('0.0');

    // Test maximum reasonable values
    await page.fill('#patients-per-day', '50');
    await page.fill('#minutes-per-note', '30');
    await page.fill('#working-days', '7');

    await page.waitForTimeout(300);

    const maxResult = await page.locator('#current-time').textContent();
    const maxHours = parseFloat(maxResult.match(/(\d+\.?\d*)/)[1]);
    expect(maxHours).toBe(175); // 50 * 30 * 7 / 60 = 175 hours
  });
});

test.describe('Navigation and User Experience', () => {
  test('should navigate through all main pages successfully', async ({ page }) => {
    const pages = [
      { path: '/', title: 'Ignite Health Systems' },
      { path: '/problem.html', title: /Problem|Challenge/ },
      { path: '/platform.html', title: /Platform|Solution/ },
      { path: '/approach.html', title: /Approach|Method/ },
      { path: '/founder.html', title: /Founder|About/ },
      { path: '/join.html', title: /Join|Waitlist/ }
    ];

    for (const pageInfo of pages) {
      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');

      if (typeof pageInfo.title === 'string') {
        await expect(page).toHaveTitle(new RegExp(pageInfo.title, 'i'));
      } else {
        await expect(page).toHaveTitle(pageInfo.title);
      }

      // Verify page loads without major errors
      const errorMessages = await page.locator('.error, [role="alert"]').count();
      expect(errorMessages).toBe(0);
    }
  });

  test('should have working mobile navigation', async ({ page }) => {
    // Use mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Mobile menu should be hidden initially
    const mobileMenu = page.locator('.nav-menu');
    await expect(mobileMenu).not.toHaveClass(/active/);

    // Click mobile menu toggle
    const menuToggle = page.locator('.mobile-menu-toggle');
    await expect(menuToggle).toBeVisible();
    await menuToggle.click();

    // Menu should be visible
    await expect(mobileMenu).toHaveClass(/active/);

    // Test menu link
    await page.click('.nav-menu a[href="join.html"]');
    await page.waitForURL('**/join.html');

    // Verify navigation worked
    await expect(page).toHaveURL(/join\.html$/);
  });

  test('should maintain performance standards', async ({ page }) => {
    await page.goto('/');

    // Measure key performance metrics
    const performanceMetrics = await page.evaluate(() => {
      return {
        // First Contentful Paint
        fcp: performance.getEntriesByType('paint')
          .find(entry => entry.name === 'first-contentful-paint')?.startTime,
        // Largest Contentful Paint (approximation)
        domContentLoaded: performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd,
        // Total load time
        loadComplete: performance.getEntriesByType('navigation')[0]?.loadEventEnd
      };
    });

    // Performance assertions (adjust thresholds as needed)
    if (performanceMetrics.fcp) {
      expect(performanceMetrics.fcp).toBeLessThan(3000); // FCP < 3s
    }

    if (performanceMetrics.domContentLoaded) {
      expect(performanceMetrics.domContentLoaded).toBeLessThan(5000); // DOM ready < 5s
    }

    if (performanceMetrics.loadComplete) {
      expect(performanceMetrics.loadComplete).toBeLessThan(10000); // Total load < 10s
    }
  });
});

test.describe('Accessibility Testing', () => {
  test('should meet basic accessibility requirements', async ({ page }) => {
    await page.goto('/');

    // Check for proper heading structure
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // Check for alt text on images
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt.length).toBeGreaterThan(0);
    }

    // Check for form labels
    await page.goto('/join.html');
    const inputs = await page.locator('input, select, textarea').all();
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const ariaLabel = await input.getAttribute('aria-label');
        const placeholder = await input.getAttribute('placeholder');

        // Should have either a label, aria-label, or meaningful placeholder
        const hasLabel = await label.count() > 0;
        const isAccessible = hasLabel || ariaLabel || placeholder;
        expect(isAccessible).toBeTruthy();
      }
    }

    // Check for keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(['A', 'BUTTON', 'INPUT', 'SELECT'].includes(focusedElement)).toBeTruthy();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');

    // Tab through interactive elements
    const interactiveElements = [];
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => ({
        tag: document.activeElement.tagName,
        type: document.activeElement.type || null,
        text: document.activeElement.textContent?.slice(0, 20)
      }));
      interactiveElements.push(focusedElement);
    }

    // Should have navigated through multiple interactive elements
    const uniqueTags = new Set(interactiveElements.map(el => el.tag));
    expect(uniqueTags.size).toBeGreaterThan(1);

    // Test Enter key on buttons
    await page.goto('/join.html');
    await page.focus('button[type="submit"]');
    await page.keyboard.press('Enter');

    // Should trigger form validation
    const nameField = page.locator('[name="name"]');
    const validationMessage = await nameField.evaluate(el => el.validationMessage);
    expect(validationMessage).toBeTruthy();
  });
});