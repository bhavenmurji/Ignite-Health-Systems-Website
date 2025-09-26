#!/bin/bash

# DNS Status Verification Script for ignitehealthsystems.com
DOMAIN="ignitehealthsystems.com"
WWW_DOMAIN="www.ignitehealthsystems.com"
PAGES_DOMAIN="ignite-health-systems-website.pages.dev"

echo "🌐 DNS Status Check for Ignite Health Systems"
echo "=============================================="
echo "Domain: $DOMAIN"
echo "Target: $PAGES_DOMAIN"
echo "Time: $(date)"
echo ""

# Function to check DNS record
check_dns() {
    local domain=$1
    echo "🔍 Checking DNS for $domain:"
    result=$(dig +short $domain 2>/dev/null)
    if [ -z "$result" ]; then
        echo "❌ No DNS record found for $domain"
        return 1
    else
        echo "✅ DNS record found: $result"
        return 0
    fi
}

# Function to check website accessibility
check_website() {
    local url=$1
    echo "🌍 Testing website accessibility: $url"
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" --connect-timeout 10)
    case $status_code in
        200)
            echo "✅ Website is accessible (HTTP $status_code)"
            return 0
            ;;
        000)
            echo "❌ Cannot connect to website (DNS/Network issue)"
            return 1
            ;;
        *)
            echo "⚠️ Website returned HTTP $status_code"
            return 1
            ;;
    esac
}

echo "🔍 STEP 1: DNS Records Check"
echo "----------------------------"
check_dns $DOMAIN
check_dns $WWW_DOMAIN
echo ""

echo "🔍 STEP 2: Website Accessibility"
echo "--------------------------------"
check_website "https://$DOMAIN"
check_website "https://$WWW_DOMAIN"
echo ""

# Summary
echo "📋 SUMMARY"
echo "=========="
if dig +short $DOMAIN > /dev/null 2>&1; then
    echo "✅ Domain DNS is configured"
else
    echo "❌ Domain DNS is NOT configured"
fi

if curl -s -o /dev/null "https://$DOMAIN" --connect-timeout 10; then
    echo "✅ Website is accessible"
    echo "🌐 Visit: https://$DOMAIN"
else
    echo "❌ Website is NOT accessible"
    echo ""
    echo "🚨 RECOMMENDED ACTIONS:"
    echo "1. Run DNS fix script: python3 scripts/fix_dns_immediately.py"
    echo "2. Wait 5-10 minutes for DNS propagation"
fi

echo ""
echo "⏰ DNS changes can take 5-10 minutes to propagate globally"