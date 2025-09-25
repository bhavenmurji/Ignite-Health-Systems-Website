#!/usr/bin/env node

const https = require('https');

console.log('🔍 Checking Cloudflare Pages Deployment Status...\n');

// Check various possible URLs
const urls = [
  'https://ignitehealthsystems.com',
  'https://www.ignitehealthsystems.com',
  'https://ignite-health-systems-website.pages.dev',
  'https://ignite-health-systems-website.bhavenmurji.workers.dev'
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      console.log(`${url}:`);
      console.log(`  Status: ${res.statusCode}`);
      console.log(`  Headers: ${JSON.stringify(res.headers['cf-ray'] ? 'Cloudflare Active' : 'No Cloudflare')}`);
      resolve(res.statusCode);
    }).on('error', (err) => {
      console.log(`${url}:`);
      console.log(`  Error: ${err.message}`);
      resolve(0);
    });
  });
}

async function main() {
  console.log('Testing all possible deployment URLs:\n');

  for (const url of urls) {
    await checkUrl(url);
    console.log('');
  }

  console.log('\n📋 Deployment Instructions:\n');
  console.log('1. Go to Cloudflare Dashboard: https://dash.cloudflare.com');
  console.log('2. Navigate to Workers & Pages > ignite-health-systems-website');
  console.log('3. Check the "Deployments" tab for build status');
  console.log('4. If no deployments, click "Create deployment" and connect GitHub repo');
  console.log('5. Ensure build command is: npm install && npm run build');
  console.log('6. Ensure output directory is: out');
  console.log('7. Check Custom Domains tab and add: ignitehealthsystems.com');
  console.log('\n✅ The code is ready and pushed to GitHub.');
  console.log('⚠️  Cloudflare Pages needs to be manually triggered or configured.\n');
}

main();