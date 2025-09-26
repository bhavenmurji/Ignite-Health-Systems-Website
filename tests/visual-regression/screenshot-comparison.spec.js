/**
 * @test Visual Regression Testing
 * @description Screenshot comparison testing for UI consistency
 * @prerequisites Playwright with screenshot comparison capabilities
 */

const { test, expect } = require('@playwright/test');

test.describe('Visual Regression Tests', () => {
  test.describe('Homepage Visual Consistency', () => {
    test('homepage should match visual baseline', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Wait for animations to complete
      await page.waitForTimeout(2000);

      // Hide dynamic content that changes
      await page.evaluate(() => {
        // Hide current time/date displays
        const timeElements = document.querySelectorAll('.current-time, .timestamp');
        timeElements.forEach(el => el.style.visibility = 'hidden');

        // Disable animations for consistent screenshots
        const style = document.createElement('style');
        style.textContent = `
          *, *::before, *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
          }
        `;
        document.head.appendChild(style);
      });

      // Take full page screenshot
      await expect(page).toHaveScreenshot('homepage-full.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('hero section should be visually consistent', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const heroSection = page.locator('.hero');
      await expect(heroSection).toHaveScreenshot('hero-section.png');
    });

    test('navigation should be visually consistent', async ({ page }) => {
      await page.goto('/');
      const navigation = page.locator('.navbar');
      await expect(navigation).toHaveScreenshot('navigation.png');
    });

    test('problem statement section should match baseline', async ({ page }) => {
      await page.goto('/');
      const problemSection = page.locator('.problem-statement');
      await problemSection.scrollIntoViewIfNeeded();
      await expect(problemSection).toHaveScreenshot('problem-statement.png');
    });

    test('ROI calculator should be visually consistent', async ({ page }) => {
      await page.goto('/');
      const roiCalculator = page.locator('.roi-calculator');
      await roiCalculator.scrollIntoViewIfNeeded();

      // Set consistent values for screenshot
      await page.fill('#patients-per-day', '25');
      await page.fill('#minutes-per-note', '15');
      await page.fill('#working-days', '5');
      await page.waitForTimeout(500);

      await expect(roiCalculator).toHaveScreenshot('roi-calculator.png');
    });
  });

  test.describe('Form Visual Consistency', () => {
    test('waitlist form should match visual baseline', async ({ page }) => {
      await page.goto('/join.html');
      await page.waitForLoadState('networkidle');

      const form = page.locator('#waitlist-form, .waitlist-form');
      await expect(form).toHaveScreenshot('waitlist-form.png');
    });

    test('form validation states should be consistent', async ({ page }) => {
      await page.goto('/join.html');

      // Trigger validation by submitting empty form
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);

      const form = page.locator('#waitlist-form, .waitlist-form');
      await expect(form).toHaveScreenshot('form-validation-errors.png');
    });

    test('filled form should match baseline', async ({ page }) => {
      await page.goto('/join.html');

      // Fill form with consistent test data
      await page.fill('[name="name"]', 'Dr. Test Physician, MD');
      await page.fill('[name="email"]', 'test@example.com');
      await page.fill('[name="phone"]', '(555) 123-4567');
      await page.selectOption('[name="practice_type"]', 'family_medicine');
      await page.fill('[name="message"]', 'Test message for visual regression testing.');

      const form = page.locator('#waitlist-form, .waitlist-form');
      await expect(form).toHaveScreenshot('form-filled.png');
    });
  });

  test.describe('Responsive Design Visual Tests', () => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1440, height: 900 },
      { name: 'large-desktop', width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      test(`homepage should be consistent on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`, {
          fullPage: true,
          animations: 'disabled'
        });
      });

      test(`navigation should work on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/');

        if (viewport.width <= 768) {
          // Test mobile menu
          const mobileToggle = page.locator('.mobile-menu-toggle');
          if (await mobileToggle.isVisible()) {
            await mobileToggle.click();
            await page.waitForTimeout(300);
            await expect(page).toHaveScreenshot(`mobile-menu-open-${viewport.name}.png`);
          }
        }

        const navigation = page.locator('.navbar');
        await expect(navigation).toHaveScreenshot(`navigation-${viewport.name}.png`);
      });

      test(`waitlist form should be responsive on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/join.html');
        await page.waitForLoadState('networkidle');

        const form = page.locator('#waitlist-form, .waitlist-form');
        await expect(form).toHaveScreenshot(`waitlist-form-${viewport.name}.png`);
      });
    }
  });

  test.describe('Interactive Elements Visual Tests', () => {
    test('buttons should have consistent hover states', async ({ page }) => {
      await page.goto('/');

      // Test primary button hover
      const primaryButton = page.locator('.btn-primary').first();
      await primaryButton.hover();
      await expect(primaryButton).toHaveScreenshot('button-primary-hover.png');

      // Test secondary button hover
      const secondaryButton = page.locator('.btn-secondary').first();
      await secondaryButton.hover();
      await expect(secondaryButton).toHaveScreenshot('button-secondary-hover.png');
    });

    test('form fields should have consistent focus states', async ({ page }) => {
      await page.goto('/join.html');

      // Test input focus
      const nameInput = page.locator('[name="name"]');
      await nameInput.focus();
      await expect(nameInput).toHaveScreenshot('input-focus.png');

      // Test select focus
      const selectField = page.locator('[name="practice_type"]');
      await selectField.focus();
      await expect(selectField).toHaveScreenshot('select-focus.png');
    });

    test('ROI calculator should handle input changes visually', async ({ page }) => {
      await page.goto('/');
      const calculator = page.locator('.roi-calculator');
      await calculator.scrollIntoViewIfNeeded();

      // Test extreme values
      await page.fill('#patients-per-day', '50');
      await page.fill('#minutes-per-note', '30');
      await page.fill('#working-days', '7');
      await page.waitForTimeout(500);

      await expect(calculator).toHaveScreenshot('calculator-max-values.png');

      // Test minimum values
      await page.fill('#patients-per-day', '1');
      await page.fill('#minutes-per-note', '1');
      await page.fill('#working-days', '1');
      await page.waitForTimeout(500);

      await expect(calculator).toHaveScreenshot('calculator-min-values.png');
    });
  });

  test.describe('Dark Mode and Theme Tests', () => {
    test('should handle dark mode preferences', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('homepage-dark-mode.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should handle high contrast mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' });
      await page.addInitScript(() => {
        // Simulate high contrast mode
        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: jest.fn().mockImplementation(query => ({
            matches: query === '(prefers-contrast: high)',
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
          })),
        });
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('homepage-high-contrast.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });
  });

  test.describe('Print Styles Visual Tests', () => {
    test('should have appropriate print styles', async ({ page }) => {
      await page.goto('/');
      await page.emulateMedia({ media: 'print' });
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('homepage-print.png', {
        fullPage: true
      });
    });

    test('waitlist form should be printable', async ({ page }) => {
      await page.goto('/join.html');
      await page.emulateMedia({ media: 'print' });

      const form = page.locator('#waitlist-form, .waitlist-form');
      await expect(form).toHaveScreenshot('waitlist-form-print.png');
    });
  });

  test.describe('Animation and Loading States', () => {
    test('loading states should be consistent', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });

      // Capture loading state before full load
      const loadingElements = page.locator('.loading, .skeleton, .spinner');
      if (await loadingElements.count() > 0) {
        await expect(page).toHaveScreenshot('loading-state.png');
      }

      await page.waitForLoadState('networkidle');
    });

    test('intro animation should be consistent', async ({ page }) => {
      await page.goto('/');

      // Check if intro overlay exists
      const introOverlay = page.locator('#intro-overlay, .intro-overlay');
      if (await introOverlay.isVisible()) {
        await expect(introOverlay).toHaveScreenshot('intro-overlay.png');

        // Wait for intro to complete
        await page.waitForSelector('#intro-overlay', { state: 'hidden', timeout: 10000 });
      }
    });
  });

  test.describe('Error States Visual Tests', () => {
    test('404 page should be consistent', async ({ page }) => {
      const response = await page.goto('/non-existent-page.html');

      if (response && response.status() === 404) {
        await expect(page).toHaveScreenshot('404-page.png');
      }
    });

    test('form error states should be visually consistent', async ({ page }) => {
      await page.goto('/join.html');

      // Fill form with invalid data
      await page.fill('[name="name"]', '');
      await page.fill('[name="email"]', 'invalid-email');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);

      const form = page.locator('#waitlist-form, .waitlist-form');
      await expect(form).toHaveScreenshot('form-errors.png');
    });
  });
});

// Helper function to mask dynamic content
async function maskDynamicContent(page) {
  await page.evaluate(() => {
    // Mask timestamps
    document.querySelectorAll('.timestamp, .date, .time').forEach(el => {
      el.textContent = 'MASKED_TIME';
    });

    // Mask random IDs
    document.querySelectorAll('[data-random], [data-uuid]').forEach(el => {
      el.textContent = 'MASKED_ID';
    });

    // Mask analytics IDs
    document.querySelectorAll('[data-analytics-id]').forEach(el => {
      el.setAttribute('data-analytics-id', 'MASKED_ANALYTICS_ID');
    });
  });
}