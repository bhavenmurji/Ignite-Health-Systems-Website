#!/bin/bash

# Ignite Health Systems - Automated Deployment Script
# Ensures proper build, optimization, and deployment to Vercel

set -e

echo "🚀 Starting Ignite Health Systems deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="ignite-health-systems"
ROOT_DIR=$(pwd)

# Function to print colored output
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

# Pre-deployment checks
print_status "Running pre-deployment checks..."

# Check if we're in the right directory
if [ ! -d "$PROJECT_DIR" ]; then
    print_error "Project directory '$PROJECT_DIR' not found!"
    print_error "Please run this script from the root of your project."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm and try again."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel@latest
fi

print_success "Pre-deployment checks passed!"

# Navigate to project directory
cd "$PROJECT_DIR"

print_status "Installing dependencies..."
npm ci

print_status "Running type check..."
npx tsc --noEmit || {
    print_error "TypeScript type check failed!"
    exit 1
}

print_success "Type check passed!"

print_status "Building project..."
npm run build

print_success "Build completed successfully!"

# Check build output
BUILD_SIZE=$(du -sh .next | cut -f1)
print_status "Build size: $BUILD_SIZE"

# Static analysis
STATIC_SIZE=$(du -sh .next/static | cut -f1)
print_status "Static files size: $STATIC_SIZE"

# Go back to root for Vercel deployment
cd "$ROOT_DIR"

print_status "Deploying to Vercel..."

# Deploy based on environment
if [ "$1" = "production" ] || [ "$1" = "prod" ]; then
    print_status "Deploying to PRODUCTION..."
    DEPLOY_URL=$(vercel --prod --yes)
else
    print_status "Deploying to PREVIEW..."
    DEPLOY_URL=$(vercel --yes)
fi

print_success "Deployment completed!"
print_status "Deployment URL: $DEPLOY_URL"

# Post-deployment checks
print_status "Running post-deployment checks..."

# Wait for deployment to be ready
sleep 10

# Check if deployment is accessible
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL" || echo "000")

if [ "$HTTP_STATUS" = "200" ]; then
    print_success "Deployment is accessible and responding correctly!"
else
    print_warning "Deployment may not be fully ready yet (HTTP $HTTP_STATUS)"
    print_status "Please check manually: $DEPLOY_URL"
fi

# Performance check
print_status "Running basic performance check..."
LOAD_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$DEPLOY_URL" || echo "N/A")
print_status "Page load time: ${LOAD_TIME}s"

# Cache validation
print_status "Checking cache headers..."
CACHE_CONTROL=$(curl -s -I "$DEPLOY_URL" | grep -i "cache-control" || echo "Not found")
print_status "Cache control: $CACHE_CONTROL"

print_success "Deployment process completed!"
print_status "🌐 Live site: $DEPLOY_URL"

# Optional: Open in browser
if [ "$2" = "open" ]; then
    print_status "Opening in browser..."
    if command -v open &> /dev/null; then
        open "$DEPLOY_URL"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "$DEPLOY_URL"
    else
        print_status "Please open manually: $DEPLOY_URL"
    fi
fi

echo
print_success "🎉 Deployment successful!"
echo "📊 Summary:"
echo "  - Build size: $BUILD_SIZE"
echo "  - Static files: $STATIC_SIZE"
echo "  - Load time: ${LOAD_TIME}s"
echo "  - Status: Ready"
echo "  - URL: $DEPLOY_URL"
echo