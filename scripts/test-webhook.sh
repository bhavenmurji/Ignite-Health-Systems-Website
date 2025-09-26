#!/bin/bash

# Test script for n8n webhook
# Replace the URL with your actual n8n webhook URL

WEBHOOK_URL="https://your-n8n-domain.com/webhook/ignite-interest-form"

echo "Testing Physician Submission..."
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "Physician",
    "email": "test-physician@example.com",
    "userType": "physician",
    "practiceModel": "independent",
    "emrSystem": "Epic",
    "challenge": "Spending too much time on documentation",
    "cofounder": false
  }'

echo -e "\n\nTesting Investor with Co-founder Interest..."
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "Investor",
    "email": "test-investor@example.com",
    "userType": "investor",
    "challenge": "Looking for healthcare investment opportunities",
    "cofounder": true
  }'

echo -e "\n\nDone! Check:"
echo "1. Google Sheets for new entries"
echo "2. Mailchimp for new contacts with tags"
echo "3. Telegram for notifications"
echo "4. Email inbox for automated emails (after creating Mailchimp automations)"