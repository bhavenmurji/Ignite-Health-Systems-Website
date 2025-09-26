#!/bin/bash

# Test script for your n8n webhook
# This tests both the test and production endpoints

echo "==================================="
echo "Testing n8n Webhook for Ignite Health Systems"
echo "==================================="

# Test URL (for development)
TEST_URL="https://bhavenmurji.app.n8n.cloud/webhook-test/ignite-interest-form"

# Production URL (for live website)
PROD_URL="https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form"

echo -e "\n📧 Testing Physician Submission to TEST URL..."
curl -X POST "$TEST_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "TestPhysician",
    "email": "john.physician@testclinic.com",
    "userType": "physician",
    "practiceModel": "independent",
    "emrSystem": "Epic",
    "specialty": "Family Medicine",
    "challenge": "Spending 4+ hours daily on documentation",
    "cofounder": false,
    "linkedin": "https://linkedin.com/in/johntestphysician"
  }' \
  && echo " ✅ Sent" || echo " ❌ Failed"

sleep 2

echo -e "\n💰 Testing Investor with Co-founder Interest to TEST URL..."
curl -X POST "$TEST_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Sarah",
    "lastName": "TestInvestor",
    "email": "sarah.investor@testventure.com",
    "userType": "investor",
    "challenge": "Looking for healthcare disruption opportunities",
    "cofounder": true,
    "linkedin": "https://linkedin.com/in/sarahtestinvestor"
  }' \
  && echo " ✅ Sent" || echo " ❌ Failed"

sleep 2

echo -e "\n🔬 Testing Specialist to TEST URL..."
curl -X POST "$TEST_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Mike",
    "lastName": "TestSpecialist",
    "email": "mike.specialist@testtech.com",
    "userType": "specialist",
    "specialty": "Healthcare AI",
    "challenge": "Building AI solutions for clinical decision support",
    "cofounder": false
  }' \
  && echo " ✅ Sent" || echo " ❌ Failed"

echo -e "\n==================================="
echo "✅ Test Complete! Now check:"
echo "==================================="
echo "1. ✓ n8n Executions: https://bhavenmurji.app.n8n.cloud"
echo "2. ✓ Google Sheets: Look for 3 new test entries"
echo "3. ✓ Mailchimp: Check for 3 new contacts with tags"
echo "4. ✓ Telegram: Should have notifications for investor & specialist"
echo ""
echo "📝 For production, update your website form to use:"
echo "   $PROD_URL"
echo "===================================="