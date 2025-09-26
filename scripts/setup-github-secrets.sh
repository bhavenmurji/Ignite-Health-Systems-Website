#!/bin/bash

# GitHub Secrets Setup Script for Ignite Health Systems
# This script automates the setup of GitHub repository secrets

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

# Check if GitHub CLI is installed
check_gh_cli() {
    if ! command -v gh &> /dev/null; then
        print_error "GitHub CLI (gh) is not installed"
        print_info "Install with: brew install gh (macOS) or sudo apt install gh (Ubuntu)"
        exit 1
    fi

    # Check if authenticated
    if ! gh auth status &> /dev/null; then
        print_error "GitHub CLI is not authenticated"
        print_info "Run: gh auth login"
        exit 1
    fi

    print_status "GitHub CLI is installed and authenticated"
}

# Check if required files exist
check_env_files() {
    if [ ! -f ".env" ]; then
        print_error ".env file not found"
        print_info "Run: npm run setup-env"
        exit 1
    fi

    if [ ! -f ".env.cloudflare" ]; then
        print_error ".env.cloudflare file not found"
        print_info "Create .env.cloudflare with your Cloudflare credentials"
        exit 1
    fi

    print_status "Environment files found"
}

# Extract value from env file
extract_env_value() {
    local file="$1"
    local key="$2"
    grep "^${key}=" "$file" | cut -d'=' -f2- | tr -d '"'
}

# Set a GitHub secret
set_github_secret() {
    local secret_name="$1"
    local secret_value="$2"

    if [ -z "$secret_value" ]; then
        print_warning "Skipping $secret_name - no value found"
        return 1
    fi

    if echo "$secret_value" | gh secret set "$secret_name"; then
        print_status "Set secret: $secret_name"
        return 0
    else
        print_error "Failed to set secret: $secret_name"
        return 1
    fi
}

# Main setup function
setup_secrets() {
    print_info "Setting up GitHub repository secrets..."

    local success_count=0
    local total_count=0

    # Cloudflare secrets
    print_info "📋 Setting Cloudflare secrets..."

    CLOUDFLARE_API_TOKEN=$(extract_env_value ".env.cloudflare" "CLOUDFLARE_API_TOKEN")
    CLOUDFLARE_ACCOUNT_ID=$(extract_env_value ".env.cloudflare" "CLOUDFLARE_ACCOUNT_ID")
    CLOUDFLARE_ZONE_ID=$(extract_env_value ".env.cloudflare" "CLOUDFLARE_ZONE_ID")

    ((total_count++))
    if set_github_secret "CLOUDFLARE_API_TOKEN" "$CLOUDFLARE_API_TOKEN"; then
        ((success_count++))
    fi

    ((total_count++))
    if set_github_secret "CLOUDFLARE_ACCOUNT_ID" "$CLOUDFLARE_ACCOUNT_ID"; then
        ((success_count++))
    fi

    ((total_count++))
    if set_github_secret "CLOUDFLARE_ZONE_ID" "$CLOUDFLARE_ZONE_ID"; then
        ((success_count++))
    fi

    # Application secrets
    print_info "📋 Setting application secrets..."

    NEXT_PUBLIC_N8N_WEBHOOK_URL=$(extract_env_value ".env" "NEXT_PUBLIC_N8N_WEBHOOK_URL")
    NEXT_PUBLIC_SITE_URL="https://ignitehealthsystems.com"

    ((total_count++))
    if set_github_secret "NEXT_PUBLIC_N8N_WEBHOOK_URL" "$NEXT_PUBLIC_N8N_WEBHOOK_URL"; then
        ((success_count++))
    fi

    ((total_count++))
    if set_github_secret "NEXT_PUBLIC_SITE_URL" "$NEXT_PUBLIC_SITE_URL"; then
        ((success_count++))
    fi

    print_info "📊 Summary: $success_count/$total_count secrets set successfully"

    if [ $success_count -eq $total_count ]; then
        print_status "All secrets configured successfully! 🎉"
    else
        print_warning "Some secrets failed to set. Check the output above."
    fi
}

# Verify secrets
verify_secrets() {
    print_info "📋 Verifying secrets..."
    gh secret list
}

# Test the pipeline
test_pipeline() {
    print_info "Would you like to trigger a test deployment? (y/N)"
    read -r response

    if [[ "$response" =~ ^[Yy]$ ]]; then
        print_info "Creating test commit..."
        echo "$(date): Test deployment trigger" >> test-deployment.log
        git add test-deployment.log
        git commit -m "🚀 Test CI/CD pipeline deployment"
        git push origin main

        print_status "Test deployment triggered!"
        print_info "Check GitHub Actions tab to monitor progress: https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/actions"
    fi
}

# Main execution
main() {
    echo -e "${BLUE}🚀 GitHub Secrets Setup for Ignite Health Systems${NC}"
    echo -e "${BLUE}=================================================${NC}"

    check_gh_cli
    check_env_files
    setup_secrets
    verify_secrets

    print_status "Setup complete!"
    print_info "Next steps:"
    echo -e "  1. Check GitHub repository settings → Secrets and variables → Actions"
    echo -e "  2. Review the CI/CD pipeline in .github/workflows/"
    echo -e "  3. Push changes to main branch to trigger deployment"

    test_pipeline
}

# Run main function
main "$@"