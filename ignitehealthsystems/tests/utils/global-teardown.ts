import { FullConfig } from '@playwright/test';
import { emailUtils } from './email-utils';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown for Ignite Health Systems email tests...');

  // Clean up test subscriptions
  console.log('🗑️  Cleaning up test subscriptions...');
  await emailUtils.cleanupTestEmails('bhavenmurji@gmail.com');
  await emailUtils.cleanupTestEmails('bhavenmurji@icloud.com');

  console.log('✅ Global teardown completed successfully');
}

export default globalTeardown;