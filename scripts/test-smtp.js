#!/usr/bin/env node

const nodemailer = require('nodemailer');

// Test configurations
const configs = [
  {
    name: 'Port 587 with STARTTLS',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'noreply@ignitehealthsystems.com',
      pass: 'kmtuxweacfkdckuo'
    }
  },
  {
    name: 'Port 465 with SSL',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'noreply@ignitehealthsystems.com',
      pass: 'kmtuxweacfkdckuo'
    }
  },
  {
    name: 'Port 25 with STARTTLS',
    host: 'smtp.gmail.com',
    port: 25,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'noreply@ignitehealthsystems.com',
      pass: 'kmtuxweacfkdckuo'
    }
  }
];

async function testSMTP(config) {
  console.log(`\nTesting: ${config.name}`);
  console.log('=' . repeat(40));
  
  try {
    const transporter = nodemailer.createTransport(config);
    
    // Verify connection
    await transporter.verify();
    console.log('✅ Connection successful!');
    
    // Try sending a test email
    const info = await transporter.sendMail({
      from: '"Ignite Health Systems" <noreply@ignitehealthsystems.com>',
      to: 'test@example.com',
      subject: 'SMTP Test',
      text: 'This is a test email to verify SMTP configuration.'
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    return true;
  } catch (error) {
    console.log('❌ Connection failed!');
    console.log('Error:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\nAuthentication issue detected. Please check:');
      console.log('1. App password is correct (no spaces)');
      console.log('2. 2-factor authentication is enabled for the account');
      console.log('3. The app password was generated for the correct account');
    }
    
    return false;
  }
}

async function runTests() {
  console.log('SMTP Connection Test for Ignite Health Systems');
  console.log('='.repeat(50));
  
  let workingConfig = null;
  
  for (const config of configs) {
    const success = await testSMTP(config);
    if (success && !workingConfig) {
      workingConfig = config;
    }
  }
  
  if (workingConfig) {
    console.log('\n' + '='.repeat(50));
    console.log('✅ WORKING CONFIGURATION FOUND!');
    console.log('Use these settings in n8n:');
    console.log(`Host: ${workingConfig.host}`);
    console.log(`Port: ${workingConfig.port}`);
    console.log(`SSL/TLS: ${workingConfig.secure ? 'Enabled' : 'Disabled'}`);
    console.log(`STARTTLS: ${workingConfig.requireTLS ? 'Enabled' : 'Disabled'}`);
    console.log(`User: ${workingConfig.auth.user}`);
    console.log(`Password: [Your app password without spaces]`);
  } else {
    console.log('\n' + '='.repeat(50));
    console.log('❌ No working configuration found.');
    console.log('\nTroubleshooting steps:');
    console.log('1. Verify app password is correct');
    console.log('2. Check if 2-factor authentication is enabled');
    console.log('3. Ensure less secure app access is allowed (if needed)');
    console.log('4. Try generating a new app password');
  }
}

// Check if nodemailer is installed
try {
  require.resolve('nodemailer');
  runTests();
} catch(e) {
  console.log('Installing nodemailer...');
  require('child_process').execSync('npm install nodemailer', {stdio: 'inherit'});
  console.log('Please run this script again: node scripts/test-smtp.js');
}