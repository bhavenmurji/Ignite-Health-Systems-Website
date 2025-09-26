#!/bin/bash

# Cloudflare Pages Manual Deployment Trigger
# This script helps trigger a deployment when automatic builds aren't working

echo "🚀 Cloudflare Pages Manual Deployment Helper"
echo "============================================"
echo ""
echo "Since all commits show 'No deployment available', you need to:"
echo ""
echo "OPTION 1: Re-enable GitHub Integration (Recommended)"
echo "------------------------------------------------------"
echo "1. Go to: https://dash.cloudflare.com"
echo "2. Navigate to: Workers & Pages > ignite-health-systems-website > Settings"
echo "3. Scroll to 'Build configuration'"
echo "4. Click 'Manage' next to your GitHub repository"
echo "5. Toggle 'Automatic deployments' OFF then ON again"
echo "6. Click 'Save'"
echo ""
echo "OPTION 2: Manual Deployment via Dashboard"
echo "-----------------------------------------"
echo "1. Go to: Workers & Pages > ignite-health-systems-website"
echo "2. Click the 'Create deployment' button"
echo "3. Select 'Deploy from GitHub' "
echo "4. Choose branch: main"
echo "5. Verify these settings:"
echo "   - Build command: npm install && npm run build"
echo "   - Build output: out"
echo "   - Node version: 18 or higher"
echo "6. Click 'Deploy'"
echo ""
echo "OPTION 3: Direct Upload (Quick Fix)"
echo "------------------------------------"
echo "1. Build locally first:"
echo "   npm run build"
echo ""
echo "2. Go to Cloudflare dashboard"
echo "3. Click 'Create deployment'"
echo "4. Choose 'Upload assets'"
echo "5. Upload the 'out' folder"
echo "6. Deploy"
echo ""
echo "Current Status:"
echo "--------------"
echo "✅ GitHub repository is connected"
echo "✅ Build configuration is set"
echo "❌ Automatic builds are not triggering"
echo ""
echo "This usually happens when:"
echo "- The GitHub App permissions need refresh"
echo "- The webhook from GitHub to Cloudflare is broken"
echo "- The production branch setting doesn't match"
echo ""

# Check if we can reach the site
echo "Checking current site status..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://ignitehealthsystems.com)
echo "Current HTTP Status: $STATUS"

if [ "$STATUS" == "522" ]; then
    echo "❌ Site is not deployed (Error 522)"
elif [ "$STATUS" == "200" ]; then
    echo "✅ Site is live!"
else
    echo "⚠️  Unexpected status: $STATUS"
fi

echo ""
echo "Need the deployment to work NOW?"
echo "--------------------------------"
echo "Run this to build and prepare for manual upload:"
echo "npm run build && cd out && zip -r ../cloudflare-upload.zip . && cd .."
echo "Then upload cloudflare-upload.zip in Cloudflare dashboard"