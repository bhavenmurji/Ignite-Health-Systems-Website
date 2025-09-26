#!/usr/bin/env node

/**
 * CLOUDFLARE DEPLOYMENT FIX SCRIPT
 *
 * DIAGNOSIS: The root cause is INVALID API TOKENS
 * - Both CLOUDFLARE_API_TOKEN and CLOUDFLARE_API_KEY are invalid (401 errors)
 * - This prevents any API access to Cloudflare
 * - Without API access, we cannot list, create, or manage Pages projects
 * - Result: "No deployment available" error
 *
 * SOLUTION: Generate new API token with correct permissions
 */

const fs = require('fs');
const path = require('path');

console.log('🚨 CLOUDFLARE DEPLOYMENT EMERGENCY FIX');
console.log('==========================================\n');

console.log('🔍 DIAGNOSIS COMPLETE:');
console.log('✅ Root cause identified: INVALID API TOKENS');
console.log('✅ Both CLOUDFLARE_API_TOKEN and CLOUDFLARE_API_KEY are returning 401 Unauthorized');
console.log('✅ This prevents all API access to Cloudflare Pages');
console.log('✅ Result: "No deployment available" because we cannot connect to API\n');

console.log('🛠️  IMMEDIATE FIX REQUIRED:');
console.log('==========================\n');

console.log('STEP 1: Generate new Cloudflare API Token');
console.log('   1. Go to: https://dash.cloudflare.com/profile/api-tokens');
console.log('   2. Click "Create Token"');
console.log('   3. Use "Custom token" template');
console.log('   4. Set permissions:');
console.log('      - Account: Cloudflare Pages:Edit');
console.log('      - Zone: Zone:Read');
console.log('      - Zone: Page Rules:Edit (optional)');
console.log('   5. Set Account Resources: Include → Your Account');
console.log('   6. Set Zone Resources: Include → All zones (or specific zone)');
console.log('   7. Click "Continue to summary" → "Create Token"');
console.log('   8. COPY THE TOKEN IMMEDIATELY (it won\'t be shown again)\n');

console.log('STEP 2: Update environment files');
console.log('   Replace the token in these files:');
console.log('   - .env.cloudflare');
console.log('   - .env (main file)');
console.log('   Format: CLOUDFLARE_API_TOKEN=your_new_token_here\n');

console.log('STEP 3: Test the new token');
console.log('   Run: node scripts/test_all_tokens.js');
console.log('   Should show: ✅ WORKING TOKEN FOUND!\n');

console.log('STEP 4: Create Cloudflare Pages project (if needed)');
console.log('   1. Go to: https://dash.cloudflare.com/pages');
console.log('   2. Click "Create a project"');
console.log('   3. Connect to GitHub');
console.log('   4. Select your repository');
console.log('   5. Project name: ignite-health-systems-website');
console.log('   6. Build settings:');
console.log('      - Build command: npm run build');
console.log('      - Build output: dist/ (or appropriate output folder)');
console.log('      - Root directory: /');
console.log('   7. Environment variables: Copy from .env.production');
console.log('   8. Click "Save and Deploy"\n');

// Create a backup script for easy token replacement
const tokenReplacementScript = `#!/usr/bin/env node

// Quick token replacement script
// Usage: node replace_token.js YOUR_NEW_TOKEN_HERE

const fs = require('fs');
const newToken = process.argv[2];

if (!newToken) {
  console.log('Usage: node replace_token.js YOUR_NEW_TOKEN_HERE');
  process.exit(1);
}

const files = ['.env', '.env.cloudflare'];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    content = content.replace(/CLOUDFLARE_API_TOKEN=.*/g, \`CLOUDFLARE_API_TOKEN=\${newToken}\`);
    content = content.replace(/CLOUDFLARE_API_KEY=.*/g, \`CLOUDFLARE_API_KEY=\${newToken}\`);
    fs.writeFileSync(file, content);
    console.log(\`✅ Updated \${file}\`);
  }
});

console.log('🎉 Token replacement complete! Run test script to verify.');
`;

fs.writeFileSync(
  path.join(__dirname, 'replace_token.js'),
  tokenReplacementScript
);

console.log('💡 HELPER SCRIPTS CREATED:');
console.log('   - replace_token.js (quick token replacement)');
console.log('   - test_all_tokens.js (verify token works)');
console.log('   - cloudflare_diagnostic.js (full system check)\n');

console.log('⚡ QUICK FIX COMMAND:');
console.log('   1. Get new token from Cloudflare dashboard');
console.log('   2. Run: node scripts/replace_token.js YOUR_NEW_TOKEN');
console.log('   3. Run: node scripts/test_all_tokens.js');
console.log('   4. If successful, deployments will start working!\n');

console.log('🎯 EXPECTED RESULT AFTER FIX:');
console.log('   - API connection will work');
console.log('   - Pages projects will be visible');
console.log('   - Deployments will trigger automatically');
console.log('   - "No deployment available" error will disappear\n');

// Create a verification checklist
const checklist = {
  timestamp: new Date().toISOString(),
  diagnosis: 'Invalid Cloudflare API tokens causing 401 Unauthorized errors',
  rootCause: 'CLOUDFLARE_API_TOKEN and CLOUDFLARE_API_KEY in environment files are invalid or expired',
  impact: 'Complete inability to access Cloudflare API, resulting in "No deployment available" error',
  solution: 'Generate new API token with Cloudflare Pages permissions',
  steps: [
    'Generate new API token at https://dash.cloudflare.com/profile/api-tokens',
    'Replace token in .env and .env.cloudflare files',
    'Test token with test_all_tokens.js script',
    'Verify Pages project exists or create new one',
    'Trigger deployment and verify success'
  ],
  priority: 'CRITICAL - Blocking all deployments',
  estimatedFixTime: '10-15 minutes'
};

fs.writeFileSync(
  path.join(__dirname, 'deployment_fix_checklist.json'),
  JSON.stringify(checklist, null, 2)
);

console.log('📋 CHECKLIST SAVED: deployment_fix_checklist.json');
console.log('\n🚀 READY TO FIX - Get that new API token and let\'s deploy!');