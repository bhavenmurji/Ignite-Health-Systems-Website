#!/usr/bin/env node

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
    content = content.replace(/CLOUDFLARE_API_TOKEN=.*/g, `CLOUDFLARE_API_TOKEN=${newToken}`);
    content = content.replace(/CLOUDFLARE_API_KEY=.*/g, `CLOUDFLARE_API_KEY=${newToken}`);
    fs.writeFileSync(file, content);
    console.log(`✅ Updated ${file}`);
  }
});

console.log('🎉 Token replacement complete! Run test script to verify.');
