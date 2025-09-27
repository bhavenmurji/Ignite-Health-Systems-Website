import { expect } from '@playwright/test';
import * as nodemailer from 'nodemailer';
import Imap from 'imap';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
}

export interface EmailContent {
  subject: string;
  from: string;
  to: string;
  text: string;
  html: string;
  timestamp: Date;
}

export class EmailTestUtils {
  private imapConfig: any;
  private smtpConfig: any;

  constructor() {
    // Gmail IMAP configuration for testing
    this.imapConfig = {
      gmail: {
        host: 'imap.gmail.com',
        port: 993,
        secure: true,
        user: process.env.GMAIL_USER || 'bhavenmurji@gmail.com',
        password: process.env.GMAIL_APP_PASSWORD || '', // App-specific password
      },
      icloud: {
        host: 'imap.mail.me.com',
        port: 993,
        secure: true,
        user: process.env.ICLOUD_USER || 'bhavenmurji@icloud.com',
        password: process.env.ICLOUD_PASSWORD || '',
      }
    };
  }

  /**
   * Wait for email delivery with timeout
   */
  async waitForEmail(
    emailAddress: string,
    subject: string,
    timeoutMs: number = 60000
  ): Promise<EmailContent | null> {
    const startTime = Date.now();
    const provider = emailAddress.includes('@gmail.com') ? 'gmail' : 'icloud';

    while (Date.now() - startTime < timeoutMs) {
      const email = await this.checkForEmail(provider, subject);
      if (email) {
        return email;
      }
      await this.sleep(5000); // Check every 5 seconds
    }

    return null;
  }

  /**
   * Check for specific email in inbox
   */
  private async checkForEmail(provider: string, subject: string): Promise<EmailContent | null> {
    return new Promise((resolve, reject) => {
      const config = this.imapConfig[provider];
      const imap = new Imap({
        user: config.user,
        password: config.password,
        host: config.host,
        port: config.port,
        tls: config.secure,
        authTimeout: 10000,
        connTimeout: 10000,
      });

      imap.once('ready', () => {
        imap.openBox('INBOX', false, (err, box) => {
          if (err) {
            reject(err);
            return;
          }

          // Search for emails from the last hour with matching subject
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          imap.search([
            ['SINCE', yesterday],
            ['SUBJECT', subject]
          ], (err, results) => {
            if (err) {
              reject(err);
              return;
            }

            if (!results || results.length === 0) {
              imap.end();
              resolve(null);
              return;
            }

            // Get the most recent email
            const fetch = imap.fetch(results[results.length - 1], {
              bodies: ['HEADER', 'TEXT'],
              struct: true
            });

            let emailContent: EmailContent | null = null;

            fetch.on('message', (msg) => {
              let header = '';
              let body = '';

              msg.on('body', (stream, info) => {
                let buffer = '';
                stream.on('data', (chunk) => {
                  buffer += chunk.toString('utf8');
                });
                stream.once('end', () => {
                  if (info.which === 'HEADER') {
                    header = buffer;
                  } else {
                    body = buffer;
                  }
                });
              });

              msg.once('end', () => {
                const headerLines = header.split('\n');
                const subjectLine = headerLines.find(line => line.toLowerCase().startsWith('subject:'));
                const fromLine = headerLines.find(line => line.toLowerCase().startsWith('from:'));
                const toLine = headerLines.find(line => line.toLowerCase().startsWith('to:'));

                emailContent = {
                  subject: subjectLine ? subjectLine.substring(8).trim() : '',
                  from: fromLine ? fromLine.substring(5).trim() : '',
                  to: toLine ? toLine.substring(3).trim() : '',
                  text: body,
                  html: body,
                  timestamp: new Date()
                };
              });
            });

            fetch.once('end', () => {
              imap.end();
              resolve(emailContent);
            });

            fetch.once('error', (err: any) => {
              imap.end();
              reject(err);
            });
          });
        });
      });

      imap.once('error', (err: any) => {
        reject(err);
      });

      imap.connect();

      // Timeout after 30 seconds
      setTimeout(() => {
        imap.end();
        resolve(null);
      }, 30000);
    });
  }

  /**
   * Validate email content for AI personalization
   */
  validateAIPersonalization(email: EmailContent, role: string): boolean {
    const content = email.text.toLowerCase() + email.html.toLowerCase();

    // Check for role-specific content
    const roleKeywords = {
      physician: ['doctor', 'physician', 'patient care', 'clinical', 'medical practice'],
      nurse: ['nurse', 'patient care', 'healthcare', 'nursing'],
      administrator: ['administrator', 'management', 'operations', 'healthcare admin'],
      investor: ['investor', 'investment', 'roi', 'market', 'funding', 'opportunity']
    };

    const keywords = roleKeywords[role.toLowerCase() as keyof typeof roleKeywords] || [];
    return keywords.some(keyword => content.includes(keyword));
  }

  /**
   * Validate welcome email structure
   */
  validateWelcomeEmail(email: EmailContent, expectedRole: string): void {
    expect(email.subject).toContain('Welcome');
    expect(email.text || email.html).toContain('Ignite Health Systems');

    // Check for personalization
    expect(this.validateAIPersonalization(email, expectedRole)).toBe(true);
  }

  /**
   * Validate newsletter email structure
   */
  validateNewsletterEmail(email: EmailContent): void {
    expect(email.subject).toMatch(/newsletter|update|insights/i);
    expect(email.text || email.html).toContain('Ignite Health Systems');
    expect(email.text || email.html).toMatch(/unsubscribe|opt.out/i);
  }

  /**
   * Simulate N8N webhook call for testing
   */
  async simulateN8NWebhook(endpoint: string, payload: any): Promise<boolean> {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      return response.ok;
    } catch (error) {
      console.error('N8N webhook simulation failed:', error);
      return false;
    }
  }

  /**
   * Clean up test emails (for unsubscribe scenarios)
   */
  async cleanupTestEmails(emailAddress: string): Promise<void> {
    // This would typically call an unsubscribe API or clean up test data
    console.log(`Cleaning up test emails for ${emailAddress}`);

    // Simulate API call to remove email from lists
    try {
      const unsubscribeUrl = `https://ignitehealthsystems.com/api/unsubscribe`;
      await fetch(unsubscribeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailAddress }),
      });
    } catch (error) {
      console.log('Cleanup API not available, continuing with tests');
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const emailUtils = new EmailTestUtils();