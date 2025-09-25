#!/bin/bash

# Mobile Responsiveness Testing Script for Ignite Health Systems
# Tests the new mobile responsiveness fixes across different scenarios

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

print_status "🧪 Starting Mobile Responsiveness Testing..."

# Check if required files exist
FILES_TO_CHECK=(
    "css/mobile-responsiveness-fixes.css"
    "js/mobile-navigation.js"
    "js/mobile-performance.js"
    "index.html"
)

print_status "Checking required files..."
for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        print_success "Found: $file"
    else
        print_error "Missing: $file"
        exit 1
    fi
done

# Verify CSS file size and content
CSS_FILE="css/mobile-responsiveness-fixes.css"
CSS_SIZE=$(wc -l < "$CSS_FILE")
print_status "CSS file size: $CSS_SIZE lines"

if [ "$CSS_SIZE" -gt 500 ]; then
    print_success "CSS file has comprehensive content (${CSS_SIZE} lines)"
else
    print_warning "CSS file seems small (${CSS_SIZE} lines) - may be incomplete"
fi

# Check for critical CSS patterns
print_status "Verifying critical CSS patterns..."

CRITICAL_PATTERNS=(
    "--z-navbar:"
    "--z-mobile-toggle:"
    "--mobile-vh:"
    "@media.*375px"
    "@media.*768px"
    "touch-action:"
    "will-change:"
    "transform3d"
)

for pattern in "${CRITICAL_PATTERNS[@]}"; do
    if grep -q "$pattern" "$CSS_FILE"; then
        print_success "Found pattern: $pattern"
    else
        print_warning "Missing pattern: $pattern"
    fi
done

# Verify JavaScript file content
JS_NAV_FILE="js/mobile-navigation.js"
JS_PERF_FILE="js/mobile-performance.js"

print_status "Checking JavaScript files..."

if grep -q "class MobileNavigationController" "$JS_NAV_FILE"; then
    print_success "Mobile navigation controller found"
else
    print_error "Mobile navigation controller missing"
fi

if grep -q "class MobilePerformanceOptimizer" "$JS_PERF_FILE"; then
    print_success "Mobile performance optimizer found"
else
    print_error "Mobile performance optimizer missing"
fi

# Check index.html integration
print_status "Verifying HTML integration..."

if grep -q "mobile-responsiveness-fixes.css" "index.html"; then
    print_success "CSS file linked in HTML"
else
    print_error "CSS file not linked in HTML"
fi

if grep -q "mobile-navigation.js" "index.html"; then
    print_success "Navigation JS linked in HTML"
else
    print_error "Navigation JS not linked in HTML"
fi

if grep -q "mobile-performance.js" "index.html"; then
    print_success "Performance JS linked in HTML"
else
    print_error "Performance JS not linked in HTML"
fi

# Check for initialization code
if grep -q "MobileNavigationController" "index.html"; then
    print_success "Mobile navigation initialization found"
else
    print_warning "Mobile navigation initialization may be missing"
fi

# Validate viewport meta tag
if grep -q 'viewport.*width=device-width.*initial-scale=1.0' "index.html"; then
    print_success "Proper viewport meta tag found"
else
    print_warning "Viewport meta tag may need optimization"
fi

# Check for mobile-friendly button sizes
print_status "Analyzing touch target optimization..."

if grep -q "min-height.*48px" "$CSS_FILE"; then
    print_success "Touch-friendly button sizing implemented"
else
    print_warning "Touch target sizes may need adjustment"
fi

# Performance optimization checks
print_status "Verifying performance optimizations..."

PERFORMANCE_PATTERNS=(
    "hardware-acceleration"
    "transform: translateZ"
    "will-change"
    "contain:"
    "content-visibility"
)

perf_found=0
for pattern in "${PERFORMANCE_PATTERNS[@]}"; do
    if grep -q "$pattern" "$CSS_FILE"; then
        print_success "Performance optimization: $pattern"
        ((perf_found++))
    fi
done

if [ "$perf_found" -ge 3 ]; then
    print_success "Good performance optimization coverage"
else
    print_warning "May need more performance optimizations"
fi

# Final validation
print_status "Running final validation..."

# Count total CSS rules for mobile
MOBILE_RULES=$(grep -c "@media\|max-width\|min-width" "$CSS_FILE" || echo "0")
print_status "Mobile-specific CSS rules: $MOBILE_RULES"

# Check z-index hierarchy
Z_INDEX_RULES=$(grep -c "z-index\|--z-" "$CSS_FILE" || echo "0")
print_status "Z-index hierarchy rules: $Z_INDEX_RULES"

# Responsive breakpoints
BREAKPOINTS=$(grep -o "@media.*max-width: [0-9]*px" "$CSS_FILE" | wc -l || echo "0")
print_status "Responsive breakpoints: $BREAKPOINTS"

print_success "🎉 Mobile Responsiveness Testing Completed!"
echo
echo "📊 Summary:"
echo "  - CSS file size: $CSS_SIZE lines"
echo "  - Mobile rules: $MOBILE_RULES"
echo "  - Z-index rules: $Z_INDEX_RULES"
echo "  - Breakpoints: $BREAKPOINTS"
echo "  - Performance optimizations: $perf_found/5"
echo
print_status "💡 Next steps:"
print_status "1. Test on actual mobile devices"
print_status "2. Validate with browser dev tools"
print_status "3. Check Core Web Vitals scores"
print_status "4. Verify accessibility compliance"
print_status "5. Monitor real-user metrics"
echo