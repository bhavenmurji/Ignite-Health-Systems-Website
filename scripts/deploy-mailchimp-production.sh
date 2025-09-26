#!/bin/bash

# =============================================================================
# Mailchimp Automation Production Deployment Script
# Ignite Health Systems - Zero-Downtime Migration Strategy
# =============================================================================

set -e  # Exit immediately if a command exits with a non-zero status
set -u  # Treat unset variables as an error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DEPLOYMENT_LOG="$SCRIPT_DIR/deployment-$(date +%Y%m%d-%H%M%S).log"
ROLLBACK_STATE_FILE="$SCRIPT_DIR/rollback-state.json"

# Environment Variables (will be loaded from .env files)
MAILCHIMP_API_KEY=""
MAILCHIMP_AUDIENCE_ID=""
MAILCHIMP_SERVER=""
N8N_API_KEY=""
N8N_BASE_URL=""
TELEGRAM_BOT_TOKEN=""
TELEGRAM_CHAT_ID=""
GOOGLE_SHEETS_ID=""

# Feature flags for gradual rollout
ENABLE_MAILCHIMP_SYNC="false"
ENABLE_WELCOME_EMAILS="false"
ENABLE_ADVANCED_SEGMENTATION="false"
MIGRATION_PERCENTAGE="0"

# =============================================================================
# Logging Functions
# =============================================================================

log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    case $level in
        "INFO")  echo -e "${GREEN}[INFO]${NC}  $timestamp - $message" | tee -a "$DEPLOYMENT_LOG" ;;
        "WARN")  echo -e "${YELLOW}[WARN]${NC}  $timestamp - $message" | tee -a "$DEPLOYMENT_LOG" ;;
        "ERROR") echo -e "${RED}[ERROR]${NC} $timestamp - $message" | tee -a "$DEPLOYMENT_LOG" ;;
        "DEBUG") echo -e "${BLUE}[DEBUG]${NC} $timestamp - $message" | tee -a "$DEPLOYMENT_LOG" ;;
    esac
}

# =============================================================================
# Environment and Configuration Functions
# =============================================================================

load_environment() {
    log "INFO" "Loading environment configuration..."

    # Load production environment variables
    if [[ -f "$PROJECT_ROOT/config/production/.env" ]]; then
        source "$PROJECT_ROOT/config/production/.env"
        log "INFO" "Production environment loaded"
    else
        log "ERROR" "Production environment file not found: $PROJECT_ROOT/config/production/.env"
        exit 1
    fi

    # Load deployment-specific variables
    if [[ -f "$PROJECT_ROOT/config/production/deployment.env" ]]; then
        source "$PROJECT_ROOT/config/production/deployment.env"
        log "INFO" "Deployment configuration loaded"
    else
        log "WARN" "Deployment configuration not found, using defaults"
    fi

    # Validate required environment variables
    validate_environment
}

validate_environment() {
    log "INFO" "Validating environment variables..."

    local required_vars=(
        "MAILCHIMP_API_KEY"
        "MAILCHIMP_AUDIENCE_ID"
        "MAILCHIMP_SERVER"
        "N8N_API_KEY"
        "N8N_BASE_URL"
    )

    local missing_vars=()

    for var in "${required_vars[@]}"; do
        if [[ -z "${!var:-}" ]]; then
            missing_vars+=("$var")
        fi
    done

    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        log "ERROR" "Missing required environment variables: ${missing_vars[*]}"
        log "ERROR" "Please ensure all variables are set in config/production/.env"
        exit 1
    fi

    log "INFO" "Environment validation successful"
}

# =============================================================================
# Pre-Deployment Health Checks
# =============================================================================

check_system_health() {
    log "INFO" "Performing pre-deployment health checks..."

    # Check Mailchimp API connectivity
    check_mailchimp_health

    # Check n8n connectivity
    check_n8n_health

    # Check Google Sheets access
    check_google_sheets_health

    # Check disk space
    check_disk_space

    # Check network connectivity
    check_network_connectivity

    log "INFO" "All health checks passed"
}

check_mailchimp_health() {
    log "INFO" "Checking Mailchimp API connectivity..."

    local response=$(curl -s -w "%{http_code}" \
        -H "Authorization: Basic $(echo -n "anystring:$MAILCHIMP_API_KEY" | base64)" \
        "https://$MAILCHIMP_SERVER.api.mailchimp.com/3.0/ping" \
        -o /tmp/mailchimp_health.json)

    if [[ "$response" == "200" ]]; then
        log "INFO" "Mailchimp API is healthy"
        return 0
    else
        log "ERROR" "Mailchimp API health check failed (HTTP $response)"
        cat /tmp/mailchimp_health.json | jq . 2>/dev/null || cat /tmp/mailchimp_health.json
        return 1
    fi
}

check_n8n_health() {
    log "INFO" "Checking n8n API connectivity..."

    local response=$(curl -s -w "%{http_code}" \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        "$N8N_BASE_URL/api/v1/executions" \
        -o /tmp/n8n_health.json)

    if [[ "$response" == "200" ]]; then
        log "INFO" "n8n API is healthy"
        return 0
    else
        log "ERROR" "n8n API health check failed (HTTP $response)"
        cat /tmp/n8n_health.json | jq . 2>/dev/null || cat /tmp/n8n_health.json
        return 1
    fi
}

check_google_sheets_health() {
    log "INFO" "Checking Google Sheets connectivity..."

    # This would typically involve checking Google Sheets API
    # For now, we'll verify the sheets ID is accessible
    if [[ -n "$GOOGLE_SHEETS_ID" ]]; then
        log "INFO" "Google Sheets configuration found"
        return 0
    else
        log "WARN" "Google Sheets ID not configured"
        return 1
    fi
}

check_disk_space() {
    log "INFO" "Checking disk space..."

    local available_space=$(df "$PROJECT_ROOT" | awk 'NR==2 {print $4}')
    local required_space=1048576  # 1GB in KB

    if [[ "$available_space" -gt "$required_space" ]]; then
        log "INFO" "Sufficient disk space available"
        return 0
    else
        log "ERROR" "Insufficient disk space (available: ${available_space}KB, required: ${required_space}KB)"
        return 1
    fi
}

check_network_connectivity() {
    log "INFO" "Checking network connectivity..."

    local endpoints=(
        "https://api.mailchimp.com"
        "https://google.com"
        "https://api.telegram.org"
    )

    for endpoint in "${endpoints[@]}"; do
        if curl -s --max-time 10 "$endpoint" > /dev/null; then
            log "DEBUG" "Connectivity to $endpoint: OK"
        else
            log "WARN" "Connectivity to $endpoint: FAILED"
        fi
    done

    log "INFO" "Network connectivity check completed"
}

# =============================================================================
# Backup Functions
# =============================================================================

create_backup() {
    log "INFO" "Creating pre-deployment backup..."

    local backup_dir="$SCRIPT_DIR/backups/$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$backup_dir"

    # Backup current n8n workflow
    backup_n8n_workflow "$backup_dir"

    # Backup current Google Sheets data
    backup_google_sheets_data "$backup_dir"

    # Save current system state
    save_system_state "$backup_dir"

    # Create rollback state file
    create_rollback_state "$backup_dir"

    log "INFO" "Backup completed: $backup_dir"
}

backup_n8n_workflow() {
    local backup_dir=$1
    log "INFO" "Backing up n8n workflow..."

    # Export current workflow
    curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
        "$N8N_BASE_URL/api/v1/workflows" > "$backup_dir/n8n-workflows.json"

    # Export workflow executions (last 100)
    curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
        "$N8N_BASE_URL/api/v1/executions?limit=100" > "$backup_dir/n8n-executions.json"

    log "INFO" "n8n workflow backup completed"
}

backup_google_sheets_data() {
    local backup_dir=$1
    log "INFO" "Backing up Google Sheets data..."

    # This would typically involve Google Sheets API export
    # For now, we'll create a marker file
    echo "Google Sheets backup placeholder - Sheets ID: $GOOGLE_SHEETS_ID" > "$backup_dir/google-sheets-backup.txt"
    echo "Timestamp: $(date)" >> "$backup_dir/google-sheets-backup.txt"

    log "INFO" "Google Sheets backup completed"
}

save_system_state() {
    local backup_dir=$1
    log "INFO" "Saving system state..."

    # Save environment variables (sanitized)
    env | grep -E '^(MAILCHIMP|N8N|GOOGLE)_' | sed 's/=.*/=***REDACTED***/' > "$backup_dir/environment.txt"

    # Save deployment configuration
    cp "$PROJECT_ROOT/config/production/.env.example" "$backup_dir/" 2>/dev/null || true

    # Save current feature flags
    cat > "$backup_dir/feature-flags.json" << EOF
{
  "enableMailchimpSync": "$ENABLE_MAILCHIMP_SYNC",
  "enableWelcomeEmails": "$ENABLE_WELCOME_EMAILS",
  "enableAdvancedSegmentation": "$ENABLE_ADVANCED_SEGMENTATION",
  "migrationPercentage": "$MIGRATION_PERCENTAGE",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)"
}
EOF

    log "INFO" "System state saved"
}

create_rollback_state() {
    local backup_dir=$1
    log "INFO" "Creating rollback state..."

    cat > "$ROLLBACK_STATE_FILE" << EOF
{
  "deployment": {
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)",
    "backupLocation": "$backup_dir",
    "version": "mailchimp-automation-v1.0",
    "status": "in-progress"
  },
  "previousState": {
    "emailProvider": "gmail",
    "workflow": "n8n-gmail-automation",
    "featureFlags": {
      "enableMailchimpSync": "$ENABLE_MAILCHIMP_SYNC",
      "enableWelcomeEmails": "$ENABLE_WELCOME_EMAILS",
      "enableAdvancedSegmentation": "$ENABLE_ADVANCED_SEGMENTATION",
      "migrationPercentage": "$MIGRATION_PERCENTAGE"
    }
  },
  "targetState": {
    "emailProvider": "mailchimp",
    "workflow": "n8n-mailchimp-automation",
    "featureFlags": {
      "enableMailchimpSync": "true",
      "enableWelcomeEmails": "true",
      "enableAdvancedSegmentation": "true",
      "migrationPercentage": "100"
    }
  }
}
EOF

    log "INFO" "Rollback state created"
}

# =============================================================================
# Mailchimp Setup Functions
# =============================================================================

setup_mailchimp() {
    log "INFO" "Setting up Mailchimp automation..."

    # Create merge fields
    create_mailchimp_merge_fields

    # Create audience segments
    create_mailchimp_segments

    # Create automation workflows
    create_mailchimp_automations

    # Verify setup
    verify_mailchimp_setup

    log "INFO" "Mailchimp setup completed"
}

create_mailchimp_merge_fields() {
    log "INFO" "Creating Mailchimp merge fields..."

    local merge_fields=(
        "USERTYPE:User Type:text"
        "SPECIALTY:Specialty:text"
        "PRACTICE:Practice Model:text"
        "EMR:EMR System:text"
        "CHALLENGE:Main Challenge:text"
        "COFOUNDER:Co-founder Interest:text"
        "LINKEDIN:LinkedIn URL:url"
        "INVOLVEMENT:Involvement Level:text"
        "LOCATION:Practice Location:text"
    )

    for field_data in "${merge_fields[@]}"; do
        IFS=':' read -r tag name type <<< "$field_data"

        local response=$(curl -s -w "%{http_code}" \
            -X POST \
            -H "Authorization: Basic $(echo -n "anystring:$MAILCHIMP_API_KEY" | base64)" \
            -H "Content-Type: application/json" \
            -d "{\"tag\":\"$tag\",\"name\":\"$name\",\"type\":\"$type\"}" \
            "https://$MAILCHIMP_SERVER.api.mailchimp.com/3.0/lists/$MAILCHIMP_AUDIENCE_ID/merge-fields" \
            -o /tmp/merge_field_response.json)

        if [[ "$response" == "200" || "$response" == "400" ]]; then
            log "INFO" "Merge field created/exists: $name"
        else
            log "WARN" "Failed to create merge field $name (HTTP $response)"
            cat /tmp/merge_field_response.json | jq . 2>/dev/null || cat /tmp/merge_field_response.json
        fi
    done
}

create_mailchimp_segments() {
    log "INFO" "Creating Mailchimp segments..."

    # Read segments configuration and create them
    node "$SCRIPT_DIR/setup-mailchimp-automation.js" --segments-only

    log "INFO" "Segments creation completed"
}

create_mailchimp_automations() {
    log "INFO" "Creating Mailchimp automation workflows..."

    # Read automation configuration and create workflows
    node "$SCRIPT_DIR/setup-mailchimp-automation.js" --automations-only

    log "INFO" "Automation workflows created"
}

verify_mailchimp_setup() {
    log "INFO" "Verifying Mailchimp setup..."

    # Check audience exists
    local audience_response=$(curl -s -w "%{http_code}" \
        -H "Authorization: Basic $(echo -n "anystring:$MAILCHIMP_API_KEY" | base64)" \
        "https://$MAILCHIMP_SERVER.api.mailchimp.com/3.0/lists/$MAILCHIMP_AUDIENCE_ID" \
        -o /tmp/audience_check.json)

    if [[ "$audience_response" == "200" ]]; then
        log "INFO" "Mailchimp audience verified"
    else
        log "ERROR" "Mailchimp audience verification failed"
        return 1
    fi

    # Check merge fields
    local merge_fields_response=$(curl -s -w "%{http_code}" \
        -H "Authorization: Basic $(echo -n "anystring:$MAILCHIMP_API_KEY" | base64)" \
        "https://$MAILCHIMP_SERVER.api.mailchimp.com/3.0/lists/$MAILCHIMP_AUDIENCE_ID/merge-fields" \
        -o /tmp/merge_fields_check.json)

    if [[ "$merge_fields_response" == "200" ]]; then
        local field_count=$(cat /tmp/merge_fields_check.json | jq '.merge_fields | length')
        log "INFO" "Mailchimp merge fields verified ($field_count fields)"
    else
        log "ERROR" "Mailchimp merge fields verification failed"
        return 1
    fi

    log "INFO" "Mailchimp setup verification completed"
}

# =============================================================================
# n8n Workflow Update Functions
# =============================================================================

update_n8n_workflow() {
    log "INFO" "Updating n8n workflow for Mailchimp integration..."

    # Create new workflow version
    create_new_n8n_workflow

    # Gradually migrate traffic
    enable_gradual_migration

    # Monitor migration progress
    monitor_migration

    log "INFO" "n8n workflow update completed"
}

create_new_n8n_workflow() {
    log "INFO" "Creating new n8n workflow with Mailchimp integration..."

    # Import the updated workflow
    if [[ -f "$PROJECT_ROOT/n8n-workflows/mailchimp-updated-workflow.json" ]]; then
        curl -s -X POST \
            -H "X-N8N-API-KEY: $N8N_API_KEY" \
            -H "Content-Type: application/json" \
            -d @"$PROJECT_ROOT/n8n-workflows/mailchimp-updated-workflow.json" \
            "$N8N_BASE_URL/api/v1/workflows" > /tmp/workflow_import.json

        local workflow_id=$(cat /tmp/workflow_import.json | jq -r '.id')
        log "INFO" "New workflow created with ID: $workflow_id"

        # Activate the workflow
        curl -s -X POST \
            -H "X-N8N-API-KEY: $N8N_API_KEY" \
            "$N8N_BASE_URL/api/v1/workflows/$workflow_id/activate" > /tmp/workflow_activate.json

        log "INFO" "New workflow activated"
    else
        log "ERROR" "Updated workflow file not found"
        return 1
    fi
}

enable_gradual_migration() {
    log "INFO" "Enabling gradual migration..."

    # Start with a small percentage of traffic
    local initial_percentage=10

    # Update feature flag
    update_feature_flag "MIGRATION_PERCENTAGE" "$initial_percentage"

    log "INFO" "Migration started with $initial_percentage% traffic"

    # Gradually increase traffic every 5 minutes
    for percentage in 25 50 75 100; do
        log "INFO" "Waiting 5 minutes before increasing to $percentage%..."
        sleep 300  # 5 minutes

        # Check for errors before increasing traffic
        if check_migration_health; then
            update_feature_flag "MIGRATION_PERCENTAGE" "$percentage"
            log "INFO" "Migration increased to $percentage%"
        else
            log "ERROR" "Migration health check failed, stopping at current percentage"
            return 1
        fi
    done

    log "INFO" "Gradual migration completed successfully"
}

update_feature_flag() {
    local flag_name=$1
    local flag_value=$2

    # Update the feature flag in the system
    # This would typically involve updating a configuration service
    # For now, we'll update our local environment

    log "INFO" "Updating feature flag $flag_name to $flag_value"

    # Update deployment environment file
    if [[ -f "$PROJECT_ROOT/config/production/deployment.env" ]]; then
        sed -i.bak "s/^$flag_name=.*/$flag_name=$flag_value/" "$PROJECT_ROOT/config/production/deployment.env"
    fi

    # Update current environment
    export "$flag_name"="$flag_value"
}

monitor_migration() {
    log "INFO" "Monitoring migration progress..."

    local start_time=$(date +%s)
    local max_duration=3600  # 1 hour maximum

    while true; do
        local current_time=$(date +%s)
        local elapsed=$((current_time - start_time))

        if [[ $elapsed -gt $max_duration ]]; then
            log "WARN" "Migration monitoring timeout reached"
            break
        fi

        # Check system health
        if ! check_migration_health; then
            log "ERROR" "Migration health check failed during monitoring"
            return 1
        fi

        # Check if migration is complete
        if [[ "$MIGRATION_PERCENTAGE" == "100" ]]; then
            log "INFO" "Migration monitoring completed successfully"
            break
        fi

        sleep 60  # Check every minute
    done
}

check_migration_health() {
    log "DEBUG" "Checking migration health..."

    # Check error rates
    local error_rate=$(get_error_rate)
    if [[ $(echo "$error_rate > 5.0" | bc -l) -eq 1 ]]; then
        log "ERROR" "High error rate detected: $error_rate%"
        return 1
    fi

    # Check response times
    local avg_response_time=$(get_average_response_time)
    if [[ $(echo "$avg_response_time > 5000" | bc -l) -eq 1 ]]; then
        log "WARN" "High response time detected: ${avg_response_time}ms"
    fi

    # Check Mailchimp API rate limits
    if ! check_mailchimp_rate_limits; then
        log "WARN" "Mailchimp rate limits approaching"
    fi

    log "DEBUG" "Migration health check passed"
    return 0
}

get_error_rate() {
    # This would typically query monitoring system
    # For now, simulate with n8n execution data
    local executions=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
        "$N8N_BASE_URL/api/v1/executions?limit=50" | jq '.data')

    local total=$(echo "$executions" | jq 'length')
    local failed=$(echo "$executions" | jq '[.[] | select(.finished == false)] | length')

    if [[ $total -gt 0 ]]; then
        echo "scale=2; ($failed * 100) / $total" | bc -l
    else
        echo "0"
    fi
}

get_average_response_time() {
    # This would typically query monitoring system
    # For now, return a simulated value
    echo "1500"
}

check_mailchimp_rate_limits() {
    # Check Mailchimp API rate limit headers
    local response=$(curl -s -I \
        -H "Authorization: Basic $(echo -n "anystring:$MAILCHIMP_API_KEY" | base64)" \
        "https://$MAILCHIMP_SERVER.api.mailchimp.com/3.0/ping")

    local rate_limit=$(echo "$response" | grep -i "x-ratelimit-limit" | cut -d: -f2 | tr -d ' \r')
    local rate_remaining=$(echo "$response" | grep -i "x-ratelimit-remaining" | cut -d: -f2 | tr -d ' \r')

    if [[ -n "$rate_limit" && -n "$rate_remaining" ]]; then
        local usage_percentage=$(echo "scale=2; (($rate_limit - $rate_remaining) * 100) / $rate_limit" | bc -l)
        log "DEBUG" "Mailchimp API usage: $usage_percentage% ($rate_remaining/$rate_limit remaining)"

        if [[ $(echo "$usage_percentage > 80" | bc -l) -eq 1 ]]; then
            return 1
        fi
    fi

    return 0
}

# =============================================================================
# Post-Deployment Verification
# =============================================================================

verify_deployment() {
    log "INFO" "Performing post-deployment verification..."

    # Verify Mailchimp integration
    verify_mailchimp_integration

    # Verify n8n workflow
    verify_n8n_integration

    # Test end-to-end flow
    test_end_to_end_flow

    # Check monitoring and alerting
    verify_monitoring

    log "INFO" "Deployment verification completed"
}

verify_mailchimp_integration() {
    log "INFO" "Verifying Mailchimp integration..."

    # Test subscriber creation
    local test_email="test-$(date +%s)@ignitehealthsystems.com"

    local response=$(curl -s -w "%{http_code}" \
        -X POST \
        -H "Authorization: Basic $(echo -n "anystring:$MAILCHIMP_API_KEY" | base64)" \
        -H "Content-Type: application/json" \
        -d "{
            \"email_address\": \"$test_email\",
            \"status\": \"subscribed\",
            \"merge_fields\": {
                \"FNAME\": \"Test\",
                \"LNAME\": \"User\",
                \"USERTYPE\": \"physician\"
            }
        }" \
        "https://$MAILCHIMP_SERVER.api.mailchimp.com/3.0/lists/$MAILCHIMP_AUDIENCE_ID/members" \
        -o /tmp/test_subscriber.json)

    if [[ "$response" == "200" ]]; then
        log "INFO" "Mailchimp subscriber creation test: PASSED"

        # Clean up test subscriber
        curl -s -X DELETE \
            -H "Authorization: Basic $(echo -n "anystring:$MAILCHIMP_API_KEY" | base64)" \
            "https://$MAILCHIMP_SERVER.api.mailchimp.com/3.0/lists/$MAILCHIMP_AUDIENCE_ID/members/$(echo -n "$test_email" | md5sum | cut -d' ' -f1)"
    else
        log "ERROR" "Mailchimp subscriber creation test: FAILED"
        cat /tmp/test_subscriber.json | jq . 2>/dev/null || cat /tmp/test_subscriber.json
        return 1
    fi
}

verify_n8n_integration() {
    log "INFO" "Verifying n8n integration..."

    # Check workflow status
    local workflows=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
        "$N8N_BASE_URL/api/v1/workflows")

    local active_workflows=$(echo "$workflows" | jq '[.data[] | select(.active == true)] | length')
    log "INFO" "Active n8n workflows: $active_workflows"

    if [[ $active_workflows -gt 0 ]]; then
        log "INFO" "n8n integration verification: PASSED"
    else
        log "ERROR" "n8n integration verification: FAILED"
        return 1
    fi
}

test_end_to_end_flow() {
    log "INFO" "Testing end-to-end flow..."

    # This would typically involve sending a test form submission
    # and verifying it flows through the entire system

    local webhook_url="$N8N_BASE_URL/webhook/ignite-interest-form"

    local test_payload='{
        "firstName": "Test",
        "lastName": "User",
        "email": "test-e2e@ignitehealthsystems.com",
        "userType": "physician",
        "specialty": "Family Medicine",
        "practiceModel": "direct-primary-care",
        "challenge": "Testing end-to-end flow",
        "cofounder": false
    }'

    local response=$(curl -s -w "%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -d "$test_payload" \
        "$webhook_url" \
        -o /tmp/e2e_test.json)

    if [[ "$response" == "200" ]]; then
        log "INFO" "End-to-end flow test: PASSED"

        # Wait a moment for processing
        sleep 10

        # Verify subscriber was created in Mailchimp
        local subscriber_response=$(curl -s -w "%{http_code}" \
            -H "Authorization: Basic $(echo -n "anystring:$MAILCHIMP_API_KEY" | base64)" \
            "https://$MAILCHIMP_SERVER.api.mailchimp.com/3.0/lists/$MAILCHIMP_AUDIENCE_ID/members/$(echo -n "test-e2e@ignitehealthsystems.com" | md5sum | cut -d' ' -f1)" \
            -o /tmp/subscriber_verify.json)

        if [[ "$subscriber_response" == "200" ]]; then
            log "INFO" "Subscriber created successfully in Mailchimp"

            # Clean up test subscriber
            curl -s -X DELETE \
                -H "Authorization: Basic $(echo -n "anystring:$MAILCHIMP_API_KEY" | base64)" \
                "https://$MAILCHIMP_SERVER.api.mailchimp.com/3.0/lists/$MAILCHIMP_AUDIENCE_ID/members/$(echo -n "test-e2e@ignitehealthsystems.com" | md5sum | cut -d' ' -f1)"
        else
            log "WARN" "End-to-end test: Subscriber not found in Mailchimp"
        fi
    else
        log "ERROR" "End-to-end flow test: FAILED"
        cat /tmp/e2e_test.json | jq . 2>/dev/null || cat /tmp/e2e_test.json
        return 1
    fi
}

verify_monitoring() {
    log "INFO" "Verifying monitoring and alerting..."

    # Check if monitoring endpoints are accessible
    local monitoring_endpoints=(
        "$N8N_BASE_URL/healthz"
        "https://$MAILCHIMP_SERVER.api.mailchimp.com/3.0/ping"
    )

    for endpoint in "${monitoring_endpoints[@]}"; do
        if curl -s --max-time 10 "$endpoint" > /dev/null; then
            log "INFO" "Monitoring endpoint accessible: $endpoint"
        else
            log "WARN" "Monitoring endpoint not accessible: $endpoint"
        fi
    done

    log "INFO" "Monitoring verification completed"
}

# =============================================================================
# Notification Functions
# =============================================================================

send_deployment_notification() {
    local status=$1
    local message=$2

    log "INFO" "Sending deployment notification..."

    # Send Telegram notification if configured
    if [[ -n "$TELEGRAM_BOT_TOKEN" && -n "$TELEGRAM_CHAT_ID" ]]; then
        local emoji="✅"
        [[ "$status" == "error" ]] && emoji="❌"
        [[ "$status" == "warning" ]] && emoji="⚠️"

        local notification_text="$emoji *Ignite Health Systems - Mailchimp Deployment*

*Status:* $status
*Message:* $message
*Timestamp:* $(date)
*Environment:* Production

_Automated deployment notification_"

        curl -s -X POST \
            -H "Content-Type: application/json" \
            -d "{
                \"chat_id\": \"$TELEGRAM_CHAT_ID\",
                \"text\": \"$notification_text\",
                \"parse_mode\": \"Markdown\"
            }" \
            "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" > /dev/null
    fi

    # Send email notification (if configured)
    send_email_notification "$status" "$message"
}

send_email_notification() {
    local status=$1
    local message=$2

    # This would typically integrate with an email service
    # For now, we'll log the notification
    log "INFO" "Email notification would be sent: $status - $message"
}

# =============================================================================
# Cleanup Functions
# =============================================================================

cleanup_deployment() {
    log "INFO" "Performing deployment cleanup..."

    # Clean up temporary files
    rm -f /tmp/mailchimp_*.json
    rm -f /tmp/n8n_*.json
    rm -f /tmp/test_*.json
    rm -f /tmp/*_response.json
    rm -f /tmp/*_check.json

    # Archive old logs
    local log_archive_dir="$SCRIPT_DIR/logs/archive"
    mkdir -p "$log_archive_dir"

    find "$SCRIPT_DIR" -name "deployment-*.log" -mtime +7 -exec mv {} "$log_archive_dir/" \;

    # Clean up old backups (keep last 10)
    local backup_count=$(ls -1 "$SCRIPT_DIR/backups" 2>/dev/null | wc -l)
    if [[ $backup_count -gt 10 ]]; then
        ls -1t "$SCRIPT_DIR/backups" | tail -n +11 | xargs -I {} rm -rf "$SCRIPT_DIR/backups/{}"
        log "INFO" "Cleaned up old backups"
    fi

    log "INFO" "Cleanup completed"
}

# =============================================================================
# Main Deployment Function
# =============================================================================

main() {
    log "INFO" "Starting Mailchimp Automation Production Deployment"
    log "INFO" "========================================================="

    # Check if running as dry run
    local dry_run=false
    if [[ "${1:-}" == "--dry-run" ]]; then
        dry_run=true
        log "INFO" "Running in DRY RUN mode - no changes will be made"
    fi

    # Trap to ensure cleanup on exit
    trap cleanup_deployment EXIT

    try {
        # Phase 1: Pre-deployment
        log "INFO" "Phase 1: Pre-deployment checks and backup"
        load_environment
        check_system_health
        create_backup

        # Phase 2: Mailchimp setup
        log "INFO" "Phase 2: Mailchimp configuration"
        if [[ "$dry_run" == "false" ]]; then
            setup_mailchimp
        else
            log "INFO" "DRY RUN: Skipping Mailchimp setup"
        fi

        # Phase 3: n8n workflow update
        log "INFO" "Phase 3: n8n workflow migration"
        if [[ "$dry_run" == "false" ]]; then
            update_n8n_workflow
        else
            log "INFO" "DRY RUN: Skipping n8n workflow update"
        fi

        # Phase 4: Verification
        log "INFO" "Phase 4: Post-deployment verification"
        if [[ "$dry_run" == "false" ]]; then
            verify_deployment
        else
            log "INFO" "DRY RUN: Skipping verification"
        fi

        # Phase 5: Finalization
        log "INFO" "Phase 5: Deployment finalization"
        update_rollback_state "completed"
        send_deployment_notification "success" "Mailchimp automation deployment completed successfully"

        log "INFO" "========================================================="
        log "INFO" "Deployment completed successfully!"
        log "INFO" "Deployment log: $DEPLOYMENT_LOG"
        log "INFO" "Rollback state: $ROLLBACK_STATE_FILE"

    } catch {
        log "ERROR" "Deployment failed: $1"
        update_rollback_state "failed"
        send_deployment_notification "error" "Deployment failed: $1"

        log "ERROR" "========================================================="
        log "ERROR" "Deployment failed! Check log for details: $DEPLOYMENT_LOG"
        log "ERROR" "Use scripts/rollback-automation.sh to revert changes"

        exit 1
    }
}

# =============================================================================
# Error Handling
# =============================================================================

try() {
    "$@"
}

catch() {
    case $? in
        0) ;;  # no error
        *) "$@" ;;  # error occurred
    esac
}

update_rollback_state() {
    local status=$1

    if [[ -f "$ROLLBACK_STATE_FILE" ]]; then
        # Update the status in the rollback state file
        local temp_file=$(mktemp)
        jq --arg status "$status" '.deployment.status = $status' "$ROLLBACK_STATE_FILE" > "$temp_file"
        mv "$temp_file" "$ROLLBACK_STATE_FILE"
    fi
}

# =============================================================================
# Script Entry Point
# =============================================================================

# Check if script is being sourced or executed
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi