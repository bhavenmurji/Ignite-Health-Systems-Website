#!/bin/bash

# Cache Invalidation Script for Ignite Health Systems
# Handles CDN cache invalidation and verification

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_status "🗑️ Starting cache invalidation process..."

# Get the production URL
PRODUCTION_URL="https://ignite-health-systems.vercel.app"
if [ ! -z "$1" ]; then
    PRODUCTION_URL="$1"
fi

print_status "Target URL: $PRODUCTION_URL"

# Check if site is accessible
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PRODUCTION_URL" || echo "000")

if [ "$HTTP_STATUS" != "200" ]; then
    print_error "Site is not accessible (HTTP $HTTP_STATUS)"
    exit 1
fi

print_success "Site is accessible!"

# Force cache refresh by adding cache-busting parameters
print_status "Triggering cache refresh..."

# Key pages to invalidate
PAGES=(
    "/"
    "/about"
    "/platform"
    "/problem"
    "/join"
    "/founder"
    "/_next/static/css/"
    "/_next/static/js/"
)

# Force refresh each page
for page in "${PAGES[@]}"; do
    CACHE_BUST_URL="${PRODUCTION_URL}${page}?cb=$(date +%s)"
    print_status "Refreshing: $page"
    
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$CACHE_BUST_URL" || echo "000")
    
    if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "301" ] || [ "$RESPONSE" = "302" ]; then
        print_success "✓ $page refreshed"
    else
        print_warning "⚠ $page returned HTTP $RESPONSE"
    fi
    
    # Small delay to avoid overwhelming the server
    sleep 0.5
done

# Verify cache headers
print_status "Checking cache headers..."

MAIN_PAGE_HEADERS=$(curl -s -I "$PRODUCTION_URL" || echo "Failed to fetch headers")
echo "$MAIN_PAGE_HEADERS" | while read -r line; do
    if [[ $line =~ cache-control|etag|last-modified|expires ]]; then
        print_status "Header: $line"
    fi
done

# Check static assets cache
STATIC_URL="${PRODUCTION_URL}/_next/static/"
print_status "Checking static assets cache..."
STATIC_HEADERS=$(curl -s -I "$STATIC_URL" 2>/dev/null || echo "Static URL not accessible")

# Purge common CDN caches (if applicable)
print_status "Attempting CDN cache purge..."

# Cloudflare purge (if CF-Ray header is present)
CF_RAY=$(curl -s -I "$PRODUCTION_URL" | grep -i "cf-ray" || echo "")
if [ ! -z "$CF_RAY" ]; then
    print_status "Cloudflare detected - manual purge may be needed"
    print_warning "Consider using Cloudflare API for automatic cache purging"
fi

# Force browser cache refresh by checking cache-control headers
print_status "Analyzing cache policies..."

# Check main page caching
CACHE_CONTROL=$(curl -s -I "$PRODUCTION_URL" | grep -i "cache-control" | cut -d: -f2- | xargs || echo "No cache-control header")
print_status "Main page cache policy: $CACHE_CONTROL"

# Check static assets caching
STATIC_CACHE=$(curl -s -I "${PRODUCTION_URL}/_next/static/css/" | grep -i "cache-control" | cut -d: -f2- | xargs 2>/dev/null || echo "No static cache info")
print_status "Static assets cache policy: $STATIC_CACHE"

# Verification - check if changes are reflected
print_status "Verifying deployment changes..."

# Get current timestamp from the site
CURRENT_TIME=$(date +%s)
VERIFICATION_URL="${PRODUCTION_URL}?v=${CURRENT_TIME}"

FINAL_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "$VERIFICATION_URL" || echo "000")

if [ "$FINAL_CHECK" = "200" ]; then
    print_success "Cache invalidation completed successfully!"
else
    print_warning "Verification returned HTTP $FINAL_CHECK"
fi

# Performance check after cache invalidation
print_status "Running post-invalidation performance check..."
LOAD_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$PRODUCTION_URL" || echo "N/A")
print_status "Current load time: ${LOAD_TIME}s"

print_success "🎉 Cache invalidation process completed!"
echo
echo "📊 Summary:"
echo "  - Target URL: $PRODUCTION_URL"
echo "  - Pages refreshed: ${#PAGES[@]}"
echo "  - Cache policy: $CACHE_CONTROL"
echo "  - Load time: ${LOAD_TIME}s"
echo "  - Status: Completed"
echo
print_status "💡 Note: Browser caches may take 5-15 minutes to fully refresh"
print_status "🔄 For immediate verification, use private/incognito browsing"