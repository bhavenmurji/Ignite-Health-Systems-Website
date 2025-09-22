#!/bin/bash

# Deployment Status and Health Check Script
# Comprehensive monitoring for Ignite Health Systems deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

print_header() {
    echo -e "${CYAN}============================================${NC}"
    echo -e "${CYAN}  Ignite Health Systems Deployment Status${NC}"
    echo -e "${CYAN}============================================${NC}"
    echo
}

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

print_header

# Check Vercel CLI availability
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI not found. Installing..."
    npm install -g vercel@latest
fi

print_status "Fetching deployment information..."

# Get latest deployments
DEPLOYMENTS=$(vercel ls 2>/dev/null | head -20)
echo "$DEPLOYMENTS"

echo
print_status "Analyzing deployment status..."

# Get the production URL from deployments
PRODUCTION_URL=$(echo "$DEPLOYMENTS" | grep -E "https://.*vercel\.app" | head -1 | awk '{print $1}' | tr -d ' ')

if [ -z "$PRODUCTION_URL" ]; then
    print_error "No production URL found in deployments"
    exit 1
fi

print_info "Production URL: $PRODUCTION_URL"

# Check deployment status
print_status "Testing deployment accessibility..."

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PRODUCTION_URL" || echo "000")
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$PRODUCTION_URL" || echo "N/A")

if [ "$HTTP_STATUS" = "200" ]; then
    print_success "Deployment is LIVE and accessible!"
    print_info "Response time: ${RESPONSE_TIME}s"
else
    print_warning "Deployment status: HTTP $HTTP_STATUS"
    print_info "Response time: ${RESPONSE_TIME}s"
    
    if [ "$HTTP_STATUS" = "000" ]; then
        print_error "Cannot connect to deployment"
    elif [ "$HTTP_STATUS" = "404" ]; then
        print_warning "Deployment not found - may still be building"
    elif [ "$HTTP_STATUS" = "502" ] || [ "$HTTP_STATUS" = "503" ]; then
        print_error "Deployment has server issues"
    fi
fi

echo
print_status "Checking deployment build status..."

# Get deployment details
DEPLOYMENT_ID=$(echo "$DEPLOYMENTS" | head -2 | tail -1 | awk '{print $1}' | sed 's|https://||' | cut -d'.' -f1 | sed 's|.*-||')

if [ ! -z "$DEPLOYMENT_ID" ]; then
    print_info "Latest deployment ID: $DEPLOYMENT_ID"
    
    # Try to get build logs (may require authentication)
    print_status "Checking build logs..."
    vercel logs "$PRODUCTION_URL" --limit=20 2>/dev/null || print_info "Build logs require authentication"
fi

echo
print_status "Running comprehensive health checks..."

# Performance metrics
if [ "$HTTP_STATUS" = "200" ]; then
    # DNS resolution time
    DNS_TIME=$(curl -s -o /dev/null -w "%{time_namelookup}" "$PRODUCTION_URL" || echo "N/A")
    print_info "DNS resolution: ${DNS_TIME}s"
    
    # Connection time
    CONNECT_TIME=$(curl -s -o /dev/null -w "%{time_connect}" "$PRODUCTION_URL" || echo "N/A")
    print_info "Connection time: ${CONNECT_TIME}s"
    
    # Time to first byte
    TTFB=$(curl -s -o /dev/null -w "%{time_starttransfer}" "$PRODUCTION_URL" || echo "N/A")
    print_info "Time to first byte: ${TTFB}s"
    
    # Content size
    CONTENT_SIZE=$(curl -s -w "%{size_download}" -o /dev/null "$PRODUCTION_URL" || echo "N/A")
    print_info "Content size: ${CONTENT_SIZE} bytes"
    
    # SSL certificate check
    SSL_INFO=$(echo | openssl s_client -servername $(echo "$PRODUCTION_URL" | sed 's|https://||' | cut -d'/' -f1) -connect $(echo "$PRODUCTION_URL" | sed 's|https://||' | cut -d'/' -f1):443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null | grep "notAfter" | cut -d'=' -f2 || echo "SSL check failed")
    print_info "SSL certificate expires: $SSL_INFO"
fi

echo
print_status "Testing critical pages..."

if [ "$HTTP_STATUS" = "200" ]; then
    PAGES=("/" "/about" "/platform" "/problem" "/join" "/founder")
    
    for page in "${PAGES[@]}"; do
        PAGE_URL="${PRODUCTION_URL}${page}"
        PAGE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PAGE_URL" || echo "000")
        PAGE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$PAGE_URL" || echo "N/A")
        
        if [ "$PAGE_STATUS" = "200" ]; then
            print_success "$page: OK (${PAGE_TIME}s)"
        elif [ "$PAGE_STATUS" = "404" ]; then
            print_warning "$page: Not Found"
        else
            print_error "$page: HTTP $PAGE_STATUS"
        fi
    done
fi

echo
print_status "Environment and configuration checks..."

# Check if this is the correct project structure
if [ -d "ignite-health-systems" ]; then
    print_success "Project structure: Correct"
    
    # Check Next.js build
    if [ -d "ignite-health-systems/.next" ]; then
        BUILD_SIZE=$(du -sh ignite-health-systems/.next 2>/dev/null | cut -f1 || echo "Unknown")
        print_info "Build size: $BUILD_SIZE"
    fi
    
    # Check package.json
    if [ -f "ignite-health-systems/package.json" ]; then
        NEXT_VERSION=$(cd ignite-health-systems && npm list next --depth=0 2>/dev/null | grep next@ | sed 's/.*next@//' | cut -d' ' -f1 || echo "Unknown")
        print_info "Next.js version: $NEXT_VERSION"
    fi
else
    print_warning "Project structure: May need adjustment"
fi

# Check vercel.json configuration
if [ -f "vercel.json" ]; then
    print_success "Vercel configuration: Present"
    
    # Validate JSON
    if python3 -m json.tool vercel.json > /dev/null 2>&1; then
        print_success "Vercel configuration: Valid JSON"
    else
        print_error "Vercel configuration: Invalid JSON"
    fi
else
    print_warning "Vercel configuration: Missing vercel.json"
fi

echo
print_status "📊 Summary Report"
echo "=================="
print_info "Production URL: $PRODUCTION_URL"
print_info "HTTP Status: $HTTP_STATUS"
print_info "Response Time: ${RESPONSE_TIME}s"

if [ "$HTTP_STATUS" = "200" ]; then
    print_success "🎉 Deployment is SUCCESSFUL and LIVE!"
    print_info "🌐 Access your site: $PRODUCTION_URL"
    print_info "🔍 Vercel dashboard: https://vercel.com/dashboard"
elif [ "$HTTP_STATUS" = "404" ]; then
    print_warning "⏳ Deployment may still be building..."
    print_info "💡 Wait 2-3 minutes and run this script again"
elif [ "$HTTP_STATUS" = "000" ]; then
    print_error "🚨 Cannot connect to deployment"
    print_info "🔧 Check network connection and deployment status"
else
    print_error "⚠️ Deployment has issues (HTTP $HTTP_STATUS)"
    print_info "🔧 Check Vercel dashboard for build logs"
fi

echo
print_info "🔄 To monitor continuously: ./scripts/monitor-deployment.sh"
print_info "🗑️ To invalidate cache: ./scripts/cache-invalidate.sh"
print_info "🚀 To redeploy: ./scripts/deploy.sh"

echo