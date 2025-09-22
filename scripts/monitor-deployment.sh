#!/bin/bash

# Deployment Monitoring Script for Ignite Health Systems
# Monitors site health, performance, and deployment status

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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

print_info() {
    echo -e "${PURPLE}ℹ️${NC} $1"
}

# Configuration
PRODUCTION_URL="https://ignite-health-systems.vercel.app"
HEALTH_CHECK_INTERVAL=30
MAX_CHECKS=10

print_status "🔍 Starting deployment monitoring for Ignite Health Systems"
print_info "Production URL: $PRODUCTION_URL"
print_info "Check interval: ${HEALTH_CHECK_INTERVAL}s"
print_info "Max checks: $MAX_CHECKS"
echo

# Function to check site health
check_site_health() {
    local url="$1"
    local check_num="$2"
    
    print_status "Health check #$check_num"
    
    # HTTP Status Check
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
    
    if [ "$HTTP_STATUS" = "200" ]; then
        print_success "HTTP Status: $HTTP_STATUS (OK)"
    else
        print_error "HTTP Status: $HTTP_STATUS (ERROR)"
        return 1
    fi
    
    # Response Time Check
    RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$url" || echo "N/A")
    print_info "Response time: ${RESPONSE_TIME}s"
    
    # Check if response time is acceptable (< 3 seconds)
    if (( $(echo "$RESPONSE_TIME < 3.0" | bc -l 2>/dev/null || echo "0") )); then
        print_success "Response time: GOOD"
    else
        print_warning "Response time: SLOW (>${RESPONSE_TIME}s)"
    fi
    
    # Content Check - look for key elements
    CONTENT_CHECK=$(curl -s "$url" | grep -c "Ignite Health Systems" || echo "0")
    if [ "$CONTENT_CHECK" -gt "0" ]; then
        print_success "Content check: PASSED"
    else
        print_error "Content check: FAILED"
        return 1
    fi
    
    # SSL Certificate Check
    SSL_EXPIRY=$(echo | openssl s_client -servername $(echo "$url" | sed 's|https://||' | cut -d'/' -f1) -connect $(echo "$url" | sed 's|https://||' | cut -d'/' -f1):443 2>/dev/null | openssl x509 -noout -dates | grep "notAfter" | cut -d'=' -f2 || echo "Unknown")
    print_info "SSL expires: $SSL_EXPIRY"
    
    echo "  ---"
    return 0
}

# Function to check deployment status on Vercel
check_vercel_status() {
    print_status "Checking Vercel deployment status..."
    
    if command -v vercel &> /dev/null; then
        # Get deployment list
        DEPLOYMENTS=$(vercel ls 2>/dev/null || echo "Unable to fetch deployments")
        print_info "Recent deployments:"
        echo "$DEPLOYMENTS" | head -5
    else
        print_warning "Vercel CLI not available for deployment status check"
    fi
    
    echo "  ---"
}

# Function to check site performance
check_performance() {
    print_status "Running performance analysis..."
    
    # Page load speed test
    FULL_LOAD_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$PRODUCTION_URL")
    print_info "Full page load: ${FULL_LOAD_TIME}s"
    
    # DNS resolution time
    DNS_TIME=$(curl -s -o /dev/null -w "%{time_namelookup}" "$PRODUCTION_URL")
    print_info "DNS resolution: ${DNS_TIME}s"
    
    # Connection time
    CONNECT_TIME=$(curl -s -o /dev/null -w "%{time_connect}" "$PRODUCTION_URL")
    print_info "Connection time: ${CONNECT_TIME}s"
    
    # First byte time
    TTFB=$(curl -s -o /dev/null -w "%{time_starttransfer}" "$PRODUCTION_URL")
    print_info "Time to first byte: ${TTFB}s"
    
    # Content size
    CONTENT_SIZE=$(curl -s -w "%{size_download}" -o /dev/null "$PRODUCTION_URL")
    print_info "Content size: ${CONTENT_SIZE} bytes"
    
    echo "  ---"
}

# Function to check critical pages
check_critical_pages() {
    print_status "Checking critical pages..."
    
    PAGES=("/" "/about" "/platform" "/problem" "/join" "/founder")
    
    for page in "${PAGES[@]}"; do
        PAGE_URL="${PRODUCTION_URL}${page}"
        PAGE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PAGE_URL" || echo "000")
        
        if [ "$PAGE_STATUS" = "200" ]; then
            print_success "$page: OK ($PAGE_STATUS)"
        else
            print_error "$page: ERROR ($PAGE_STATUS)"
        fi
    done
    
    echo "  ---"
}

# Function to check for common issues
check_common_issues() {
    print_status "Checking for common issues..."
    
    # Check for 404 errors on common assets
    FAVICON_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${PRODUCTION_URL}/favicon.ico" || echo "000")
    if [ "$FAVICON_STATUS" = "200" ]; then
        print_success "Favicon: Available"
    else
        print_warning "Favicon: Missing or error ($FAVICON_STATUS)"
    fi
    
    # Check robots.txt
    ROBOTS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${PRODUCTION_URL}/robots.txt" || echo "000")
    if [ "$ROBOTS_STATUS" = "200" ]; then
        print_success "Robots.txt: Available"
    else
        print_info "Robots.txt: Not found ($ROBOTS_STATUS)"
    fi
    
    # Check for mixed content (HTTP resources on HTTPS site)
    MIXED_CONTENT=$(curl -s "$PRODUCTION_URL" | grep -c "http://" || echo "0")
    if [ "$MIXED_CONTENT" = "0" ]; then
        print_success "Mixed content: None detected"
    else
        print_warning "Mixed content: $MIXED_CONTENT HTTP resources found"
    fi
    
    echo "  ---"
}

# Main monitoring loop
print_status "Starting continuous monitoring..."
echo

# Initial checks
check_vercel_status
check_performance
check_critical_pages
check_common_issues

# Continuous health monitoring
for i in $(seq 1 $MAX_CHECKS); do
    if check_site_health "$PRODUCTION_URL" "$i"; then
        if [ $i -eq $MAX_CHECKS ]; then
            print_success "🎉 All health checks passed! Site is stable."
            break
        fi
        
        if [ $i -lt $MAX_CHECKS ]; then
            print_info "Waiting ${HEALTH_CHECK_INTERVAL}s for next check..."
            sleep $HEALTH_CHECK_INTERVAL
        fi
    else
        print_error "Health check failed! Investigating..."
        
        # Run additional diagnostics on failure
        print_status "Running diagnostic checks..."
        check_critical_pages
        check_common_issues
        
        # Wait before retry
        print_info "Retrying in ${HEALTH_CHECK_INTERVAL}s..."
        sleep $HEALTH_CHECK_INTERVAL
    fi
done

# Final summary
echo
print_status "📊 Monitoring Summary"
echo "===================="
print_info "URL: $PRODUCTION_URL"
print_info "Checks completed: $MAX_CHECKS"
print_info "Monitoring duration: $((MAX_CHECKS * HEALTH_CHECK_INTERVAL / 60)) minutes"

# Final performance check
FINAL_RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$PRODUCTION_URL")
print_info "Final response time: ${FINAL_RESPONSE_TIME}s"

print_success "✨ Monitoring completed successfully!"
echo
print_info "🔄 To continue monitoring, run this script again"
print_info "📈 For detailed analytics, check Vercel dashboard"