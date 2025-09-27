import { chromium, FullConfig } from '@playwright/test';
import { emailUtils } from './email-utils';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for Ignite Health Systems email tests...');

  // Clean up any existing test subscriptions
  console.log('🧹 Cleaning up previous test subscriptions...');
  await emailUtils.cleanupTestEmails('bhavenmurji@gmail.com');
  await emailUtils.cleanupTestEmails('bhavenmurji@icloud.com');

  // Verify site is accessible
  console.log('🌐 Verifying site accessibility...');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto('https://ignitehealthsystems.com');
    await page.waitForSelector('#signup', { timeout: 30000 });
    console.log('✅ Site is accessible and signup form is present');
  } catch (error) {
    console.error('❌ Site accessibility check failed:', error);
    throw error;
  } finally {
    await browser.close();
  }

  console.log('✅ Global setup completed successfully');
}

export default globalSetup;