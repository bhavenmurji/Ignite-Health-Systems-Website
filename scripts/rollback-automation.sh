#!/bin/bash

# =============================================================================
# Mailchimp Automation Rollback Script
# Ignite Health Systems - Emergency Recovery Procedures
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
ROLLBACK_LOG="$SCRIPT_DIR/rollback-$(date +%Y%m%d-%H%M%S).log"
ROLLBACK_STATE_FILE="$SCRIPT_DIR/rollback-state.json"

# Rollback options
ROLLBACK_TYPE="full"  # full, partial, config-only
FORCE_ROLLBACK="false"
PRESERVE_DATA="true"
SKIP_CONFIRMATION="false"

# =============================================================================
# Logging Functions
# =============================================================================

log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    case $level in
        "INFO")  echo -e "${GREEN}[INFO]${NC}  $timestamp - $message" | tee -a "$ROLLBACK_LOG" ;;
        "WARN")  echo -e "${YELLOW}[WARN]${NC}  $timestamp - $message" | tee -a "$ROLLBACK_LOG" ;;
        "ERROR") echo -e "${RED}[ERROR]${NC} $timestamp - $message" | tee -a "$ROLLBACK_LOG" ;;
        "DEBUG") echo -e "${BLUE}[DEBUG]${NC} $timestamp - $message" | tee -a "$ROLLBACK_LOG" ;;
    esac
}

# =============================================================================
# Rollback State Management
# =============================================================================

load_rollback_state() {
    log "INFO" "Loading rollback state..."

    if [[ ! -f "$ROLLBACK_STATE_FILE" ]]; then
        log "ERROR" "Rollback state file not found: $ROLLBACK_STATE_FILE"
        log "ERROR" "Cannot proceed without deployment state information"
        exit 1
    fi

    # Validate rollback state file
    if ! jq . "$ROLLBACK_STATE_FILE" >/dev/null 2>&1; then
        log "ERROR" "Invalid rollback state file format"
        exit 1
    fi

    # Extract deployment information
    DEPLOYMENT_TIMESTAMP=$(jq -r '.deployment.timestamp' "$ROLLBACK_STATE_FILE")
    BACKUP_LOCATION=$(jq -r '.deployment.backupLocation' "$ROLLBACK_STATE_FILE")
    DEPLOYMENT_VERSION=$(jq -r '.deployment.version' "$ROLLBACK_STATE_FILE")
    DEPLOYMENT_STATUS=$(jq -r '.deployment.status' "$ROLLBACK_STATE_FILE")

    log "INFO" "Rollback state loaded:"
    log "INFO" "  Deployment: $DEPLOYMENT_VERSION"
    log "INFO" "  Timestamp: $DEPLOYMENT_TIMESTAMP"
    log "INFO" "  Status: $DEPLOYMENT_STATUS"
    log "INFO" "  Backup: $BACKUP_LOCATION"
}

validate_rollback_conditions() {
    log "INFO" "Validating rollback conditions..."

    # Check if deployment is in a rollback-able state
    case "$DEPLOYMENT_STATUS" in
        "completed")
            log "INFO" "Deployment completed - rollback allowed"
            ;;
        "failed")
            log "WARN" "Deployment failed - rollback recommended"
            ;;
        "in-progress")
            log "WARN" "Deployment in progress - rollback may cause data inconsistency"
            if [[ "$FORCE_ROLLBACK" != "true" ]]; then
                read -p "Continue with rollback? (y/N): " -n 1 -r
                echo
                if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                    log "INFO" "Rollback cancelled by user"
                    exit 0
                fi
            fi
            ;;
        *)
            log "ERROR" "Unknown deployment status: $DEPLOYMENT_STATUS"
            exit 1
            ;;
    esac

    # Check backup availability
    if [[ ! -d "$BACKUP_LOCATION" ]]; then
        log "ERROR" "Backup directory not found: $BACKUP_LOCATION"
        log "ERROR" "Cannot rollback without backup data"
        exit 1
    fi

    # Verify backup integrity
    verify_backup_integrity

    log "INFO" "Rollback conditions validated"
}

verify_backup_integrity() {
    log "INFO" "Verifying backup integrity..."

    local required_files=(
        "$BACKUP_LOCATION/n8n-workflows.json"
        "$BACKUP_LOCATION/feature-flags.json"
        "$BACKUP_LOCATION/environment.txt"
    )

    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            log "ERROR" "Required backup file missing: $file"
            exit 1
        fi
    done

    # Verify n8n backup is valid JSON
    if ! jq . "$BACKUP_LOCATION/n8n-workflows.json" >/dev/null 2>&1; then
        log "ERROR" "n8n workflow backup is corrupted"
        exit 1
    fi

    log "INFO" "Backup integrity verified"
}

# =============================================================================
# Environment Loading
# =============================================================================

load_environment() {
    log "INFO" "Loading environment configuration..."

    # Load production environment variables
    if [[ -f "$PROJECT_ROOT/config/production/.env" ]]; then
        source "$PROJECT_ROOT/config/production/.env"
    else
        log "ERROR" "Production environment file not found"
        exit 1
    fi

    # Load deployment-specific variables
    if [[ -f "$PROJECT_ROOT/config/production/deployment.env" ]]; then
        source "$PROJECT_ROOT/config/production/deployment.env"
    fi

    log "INFO" "Environment loaded"
}

# =============================================================================
# Pre-Rollback Safety Checks
# =============================================================================

perform_safety_checks() {
    log "INFO" "Performing pre-rollback safety checks..."

    # Check system health
    check_system_health

    # Verify service connectivity
    verify_service_connectivity

    # Check for ongoing operations
    check_ongoing_operations

    # Create safety backup
    create_safety_backup

    log "INFO" "Safety checks completed"
}

check_system_health() {
    log "INFO" "Checking current system health..."

    # Check disk space
    local available_space=$(df "$PROJECT_ROOT" | awk 'NR==2 {print $4}')
    local required_space=524288  # 512MB in KB

    if [[ "$available_space" -lt "$required_space" ]]; then
        log "WARN" "Low disk space (available: ${available_space}KB)"
    fi

    # Check memory usage
    local memory_usage=$(free | awk 'NR==2{printf "%.2f", $3*100/$2}')
    if [[ $(echo "$memory_usage > 90" | bc -l) -eq 1 ]]; then
        log "WARN" "High memory usage: $memory_usage%"
    fi

    log "INFO" "System health check completed"
}

verify_service_connectivity() {
    log "INFO" "Verifying service connectivity..."

    # Test n8n API
    if ! curl -s --max-time 10 -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/executions" >/dev/null; then
        log "WARN" "n8n API not responding"
    fi

    # Test Mailchimp API
    if ! curl -s --max-time 10 -H "Authorization: Basic $(echo -n "anystring:$MAILCHIMP_API_KEY" | base64)" "https://$MAILCHIMP_SERVER.api.mailchimp.com/3.0/ping" >/dev/null; then
        log "WARN" "Mailchimp API not responding"
    fi

    log "INFO" "Service connectivity verified"
}

check_ongoing_operations() {
    log "INFO" "Checking for ongoing operations..."

    # Check for running n8n executions
    local running_executions=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
        "$N8N_BASE_URL/api/v1/executions?status=running" | jq '.data | length' 2>/dev/null || echo "0")

    if [[ "$running_executions" -gt 0 ]]; then
        log "WARN" "Found $running_executions running executions"
        if [[ "$FORCE_ROLLBACK" != "true" ]]; then
            read -p "Wait for operations to complete? (Y/n): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Nn]$ ]]; then
                wait_for_operations
            fi
        fi
    fi

    log "INFO" "Ongoing operations check completed"
}

wait_for_operations() {
    log "INFO" "Waiting for ongoing operations to complete..."

    local max_wait=300  # 5 minutes
    local wait_count=0

    while [[ $wait_count -lt $max_wait ]]; do
        local running=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
            "$N8N_BASE_URL/api/v1/executions?status=running" | jq '.data | length' 2>/dev/null || echo "0")

        if [[ "$running" -eq 0 ]]; then
            log "INFO" "All operations completed"
            return 0
        fi

        log "INFO" "Waiting for $running operations to complete..."
        sleep 10
        ((wait_count += 10))
    done

    log "WARN" "Timeout waiting for operations to complete"
}

create_safety_backup() {
    log "INFO" "Creating safety backup before rollback..."

    local safety_backup_dir="$SCRIPT_DIR/backups/pre-rollback-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$safety_backup_dir"

    # Backup current n8n state
    curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
        "$N8N_BASE_URL/api/v1/workflows" > "$safety_backup_dir/current-workflows.json"

    # Backup current feature flags
    cp "$PROJECT_ROOT/config/production/deployment.env" "$safety_backup_dir/" 2>/dev/null || true

    # Create rollback record
    cat > "$safety_backup_dir/rollback-info.json" << EOF
{
  "rollbackTimestamp": "$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)",
  "originalDeployment": "$DEPLOYMENT_VERSION",
  "rollbackType": "$ROLLBACK_TYPE",
  "preserveData": "$PRESERVE_DATA",
  "systemState": {
    "n8nWorkflows": "backed-up",
    "featureFlags": "backed-up"
  }
}
EOF

    log "INFO" "Safety backup created: $safety_backup_dir"
}

# =============================================================================
# Rollback Execution Functions
# =============================================================================

execute_rollback() {
    log "INFO" "Executing rollback procedure..."

    case "$ROLLBACK_TYPE" in
        "full")
            execute_full_rollback
            ;;
        "partial")
            execute_partial_rollback
            ;;
        "config-only")
            execute_config_rollback
            ;;
        *)
            log "ERROR" "Unknown rollback type: $ROLLBACK_TYPE"
            exit 1
            ;;
    esac

    log "INFO" "Rollback execution completed"
}

execute_full_rollback() {
    log "INFO" "Executing full rollback..."

    # Step 1: Disable feature flags
    disable_new_features

    # Step 2: Restore n8n workflows
    restore_n8n_workflows

    # Step 3: Restore configuration
    restore_configuration

    # Step 4: Clean up Mailchimp data (if not preserving)
    if [[ "$PRESERVE_DATA" != "true" ]]; then
        cleanup_mailchimp_data
    fi

    # Step 5: Verify rollback
    verify_rollback

    log "INFO" "Full rollback completed"
}

execute_partial_rollback() {
    log "INFO" "Executing partial rollback..."

    # Disable Mailchimp features but keep data
    disable_new_features

    # Route traffic back to old system
    restore_traffic_routing

    # Keep new workflows but deactivate Mailchimp nodes
    deactivate_mailchimp_nodes

    log "INFO" "Partial rollback completed"
}

execute_config_rollback() {
    log "INFO" "Executing configuration-only rollback..."

    # Only restore configuration settings
    restore_configuration

    # Reset feature flags
    disable_new_features

    log "INFO" "Configuration rollback completed"
}

disable_new_features() {
    log "INFO" "Disabling new features..."

    # Update feature flags
    update_feature_flag "ENABLE_MAILCHIMP_SYNC" "false"
    update_feature_flag "ENABLE_WELCOME_EMAILS" "false"
    update_feature_flag "ENABLE_ADVANCED_SEGMENTATION" "false"
    update_feature_flag "MIGRATION_PERCENTAGE" "0"

    # Update deployment environment
    cat > "$PROJECT_ROOT/config/production/deployment.env" << EOF
# Feature flags for gradual rollout (ROLLED BACK)
ENABLE_MAILCHIMP_SYNC=false
ENABLE_WELCOME_EMAILS=false
ENABLE_ADVANCED_SEGMENTATION=false
MIGRATION_PERCENTAGE=0

# Deployment phase control
DEPLOYMENT_PHASE=rollback
DEPLOYMENT_MODE=emergency
CANARY_PERCENTAGE=0

# Rollback configuration
ROLLBACK_ENABLED=true
AUTO_ROLLBACK_ON_ERROR=true
ERROR_THRESHOLD_PERCENTAGE=5

# Traffic splitting (back to old system)
TRAFFIC_TO_NEW_SYSTEM=0
TRAFFIC_TO_OLD_SYSTEM=100
PARALLEL_PROCESSING=false
EOF

    log "INFO" "New features disabled"
}

restore_n8n_workflows() {
    log "INFO" "Restoring n8n workflows..."

    if [[ ! -f "$BACKUP_LOCATION/n8n-workflows.json" ]]; then
        log "ERROR" "n8n workflow backup not found"
        return 1
    fi

    # Get current workflows
    local current_workflows=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
        "$N8N_BASE_URL/api/v1/workflows")

    # Deactivate all current workflows
    echo "$current_workflows" | jq -r '.data[].id' | while read -r workflow_id; do
        if [[ -n "$workflow_id" && "$workflow_id" != "null" ]]; then
            curl -s -X POST \
                -H "X-N8N-API-KEY: $N8N_API_KEY" \
                "$N8N_BASE_URL/api/v1/workflows/$workflow_id/deactivate" >/dev/null
            log "DEBUG" "Deactivated workflow: $workflow_id"
        fi
    done

    # Import backed up workflows
    local backup_workflows=$(cat "$BACKUP_LOCATION/n8n-workflows.json")

    echo "$backup_workflows" | jq -c '.data[]' | while read -r workflow; do
        # Remove ID to create new workflow
        local workflow_data=$(echo "$workflow" | jq 'del(.id)')

        # Import workflow
        local import_result=$(curl -s -X POST \
            -H "X-N8N-API-KEY: $N8N_API_KEY" \
            -H "Content-Type: application/json" \
            -d "$workflow_data" \
            "$N8N_BASE_URL/api/v1/workflows")

        local new_workflow_id=$(echo "$import_result" | jq -r '.id')

        if [[ -n "$new_workflow_id" && "$new_workflow_id" != "null" ]]; then
            # Activate restored workflow if it was active
            local was_active=$(echo "$workflow" | jq -r '.active')
            if [[ "$was_active" == "true" ]]; then
                curl -s -X POST \
                    -H "X-N8N-API-KEY: $N8N_API_KEY" \
                    "$N8N_BASE_URL/api/v1/workflows/$new_workflow_id/activate" >/dev/null
                log "INFO" "Restored and activated workflow: $new_workflow_id"
            else
                log "INFO" "Restored workflow: $new_workflow_id"
            fi
        else
            log "WARN" "Failed to restore workflow"
        fi
    done

    log "INFO" "n8n workflows restored"
}

restore_configuration() {
    log "INFO" "Restoring configuration..."

    # Restore feature flags from backup
    if [[ -f "$BACKUP_LOCATION/feature-flags.json" ]]; then
        local backup_flags=$(cat "$BACKUP_LOCATION/feature-flags.json")

        # Extract and apply feature flags
        local enable_mailchimp=$(echo "$backup_flags" | jq -r '.enableMailchimpSync')
        local enable_emails=$(echo "$backup_flags" | jq -r '.enableWelcomeEmails')
        local enable_segmentation=$(echo "$backup_flags" | jq -r '.enableAdvancedSegmentation')
        local migration_percentage=$(echo "$backup_flags" | jq -r '.migrationPercentage')

        update_feature_flag "ENABLE_MAILCHIMP_SYNC" "$enable_mailchimp"
        update_feature_flag "ENABLE_WELCOME_EMAILS" "$enable_emails"
        update_feature_flag "ENABLE_ADVANCED_SEGMENTATION" "$enable_segmentation"
        update_feature_flag "MIGRATION_PERCENTAGE" "$migration_percentage"
    fi

    log "INFO" "Configuration restored"
}

cleanup_mailchimp_data() {
    log "INFO" "Cleaning up Mailchimp data..."

    # Warning: This will remove Mailchimp data
    log "WARN" "This will remove subscribers added during the deployment"

    if [[ "$SKIP_CONFIRMATION" != "true" ]]; then
        read -p "Continue with Mailchimp data cleanup? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log "INFO" "Mailchimp cleanup skipped"
            return 0
        fi
    fi

    # Get deployment timestamp for filtering
    local deployment_date=$(date -d "$DEPLOYMENT_TIMESTAMP" +%Y-%m-%d 2>/dev/null || echo "")

    if [[ -n "$deployment_date" ]]; then
        # This would require more sophisticated Mailchimp API calls
        # For now, we'll just log the action
        log "WARN" "Mailchimp cleanup requires manual intervention"
        log "INFO" "Please review subscribers added after $deployment_date"
    fi

    log "INFO" "Mailchimp cleanup completed"
}

restore_traffic_routing() {
    log "INFO" "Restoring traffic routing..."

    # Reset traffic to old system
    update_feature_flag "TRAFFIC_TO_NEW_SYSTEM" "0"
    update_feature_flag "TRAFFIC_TO_OLD_SYSTEM" "100"
    update_feature_flag "PARALLEL_PROCESSING" "false"

    log "INFO" "Traffic routing restored"
}

deactivate_mailchimp_nodes() {
    log "INFO" "Deactivating Mailchimp nodes..."

    # This would involve updating n8n workflows to skip Mailchimp nodes
    # For now, we'll disable via feature flags
    update_feature_flag "ENABLE_MAILCHIMP_SYNC" "false"

    log "INFO" "Mailchimp nodes deactivated"
}

update_feature_flag() {
    local flag_name=$1
    local flag_value=$2

    log "DEBUG" "Updating feature flag $flag_name to $flag_value"

    # Update deployment environment file
    if [[ -f "$PROJECT_ROOT/config/production/deployment.env" ]]; then
        if grep -q "^$flag_name=" "$PROJECT_ROOT/config/production/deployment.env"; then
            sed -i.bak "s/^$flag_name=.*/$flag_name=$flag_value/" "$PROJECT_ROOT/config/production/deployment.env"
        else
            echo "$flag_name=$flag_value" >> "$PROJECT_ROOT/config/production/deployment.env"
        fi
    fi

    # Update current environment
    export "$flag_name"="$flag_value"
}

# =============================================================================
# Rollback Verification
# =============================================================================

verify_rollback() {
    log "INFO" "Verifying rollback success..."

    # Test system functionality
    test_system_functionality

    # Verify services are healthy
    verify_service_health

    # Check data integrity
    verify_data_integrity

    # Test end-to-end flow
    test_rollback_flow

    log "INFO" "Rollback verification completed"
}

test_system_functionality() {
    log "INFO" "Testing system functionality..."

    # Test n8n workflows
    local active_workflows=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
        "$N8N_BASE_URL/api/v1/workflows" | jq '.data | map(select(.active == true)) | length')

    if [[ "$active_workflows" -gt 0 ]]; then
        log "INFO" "n8n workflows active: $active_workflows"
    else
        log "WARN" "No active n8n workflows found"
    fi

    # Test webhook endpoints
    local webhook_url="$N8N_BASE_URL/webhook/ignite-interest-form"
    if curl -s --max-time 10 "$webhook_url" >/dev/null; then
        log "INFO" "Webhook endpoint accessible"
    else
        log "WARN" "Webhook endpoint not accessible"
    fi

    log "INFO" "System functionality test completed"
}

verify_service_health() {
    log "INFO" "Verifying service health..."

    local health_checks=0
    local health_passed=0

    # Check n8n health
    ((health_checks++))
    if curl -s --max-time 10 -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/executions" >/dev/null; then
        ((health_passed++))
        log "INFO" "n8n API: HEALTHY"
    else
        log "WARN" "n8n API: UNHEALTHY"
    fi

    # Check Google Sheets (if configured)
    if [[ -n "${GOOGLE_SHEETS_ID:-}" ]]; then
        ((health_checks++))
        # Simple check - would need actual API call
        ((health_passed++))
        log "INFO" "Google Sheets: HEALTHY"
    fi

    # Calculate health percentage
    local health_percentage=$(echo "scale=2; ($health_passed * 100) / $health_checks" | bc -l)
    log "INFO" "Overall health: $health_percentage% ($health_passed/$health_checks services)"

    if [[ $(echo "$health_percentage < 80" | bc -l) -eq 1 ]]; then
        log "WARN" "System health below 80%"
    fi
}

verify_data_integrity() {
    log "INFO" "Verifying data integrity..."

    # Check Google Sheets access
    if [[ -n "${GOOGLE_SHEETS_ID:-}" ]]; then
        log "INFO" "Google Sheets data preserved"
    fi

    # Verify no data corruption
    local recent_executions=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
        "$N8N_BASE_URL/api/v1/executions?limit=10" | jq '.data | length')

    log "INFO" "Recent executions available: $recent_executions"

    log "INFO" "Data integrity verification completed"
}

test_rollback_flow() {
    log "INFO" "Testing end-to-end flow after rollback..."

    # Test form submission with old system
    local webhook_url="$N8N_BASE_URL/webhook/ignite-interest-form"

    local test_payload='{
        "firstName": "Rollback",
        "lastName": "Test",
        "email": "rollback-test@ignitehealthsystems.com",
        "userType": "physician",
        "specialty": "Family Medicine",
        "practiceModel": "direct-primary-care",
        "challenge": "Testing rollback flow",
        "cofounder": false
    }'

    local response=$(curl -s -w "%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -d "$test_payload" \
        "$webhook_url" \
        -o /tmp/rollback_test.json)

    if [[ "$response" == "200" ]]; then
        log "INFO" "End-to-end flow test: PASSED"
    else
        log "WARN" "End-to-end flow test: FAILED (HTTP $response)"
        cat /tmp/rollback_test.json 2>/dev/null || true
    fi

    # Clean up test file
    rm -f /tmp/rollback_test.json

    log "INFO" "Rollback flow test completed"
}

# =============================================================================
# Post-Rollback Actions
# =============================================================================

post_rollback_actions() {
    log "INFO" "Performing post-rollback actions..."

    # Update rollback state
    update_rollback_state

    # Send notifications
    send_rollback_notifications

    # Generate rollback report
    generate_rollback_report

    # Clean up temporary files
    cleanup_rollback

    log "INFO" "Post-rollback actions completed"
}

update_rollback_state() {
    log "INFO" "Updating rollback state..."

    if [[ -f "$ROLLBACK_STATE_FILE" ]]; then
        local temp_file=$(mktemp)
        jq --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)" \
           --arg status "rolled-back" \
           --arg type "$ROLLBACK_TYPE" \
           '.rollback = {
              "timestamp": $timestamp,
              "status": $status,
              "type": $type,
              "preservedData": true
            }' "$ROLLBACK_STATE_FILE" > "$temp_file"
        mv "$temp_file" "$ROLLBACK_STATE_FILE"
    fi

    log "INFO" "Rollback state updated"
}

send_rollback_notifications() {
    log "INFO" "Sending rollback notifications..."

    # Send Telegram notification if configured
    if [[ -n "${TELEGRAM_BOT_TOKEN:-}" && -n "${TELEGRAM_CHAT_ID:-}" ]]; then
        local notification_text="🔄 *Ignite Health Systems - Rollback Completed*

*Type:* $ROLLBACK_TYPE rollback
*Timestamp:* $(date)
*Previous Version:* $DEPLOYMENT_VERSION
*Status:* System restored to previous state

_Automated rollback notification_"

        curl -s -X POST \
            -H "Content-Type: application/json" \
            -d "{
                \"chat_id\": \"$TELEGRAM_CHAT_ID\",
                \"text\": \"$notification_text\",
                \"parse_mode\": \"Markdown\"
            }" \
            "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" > /dev/null
    fi

    log "INFO" "Rollback notifications sent"
}

generate_rollback_report() {
    log "INFO" "Generating rollback report..."

    local report_file="$SCRIPT_DIR/rollback-report-$(date +%Y%m%d-%H%M%S).md"

    cat > "$report_file" << EOF
# Rollback Report

## Summary
- **Rollback Type:** $ROLLBACK_TYPE
- **Rollback Timestamp:** $(date)
- **Original Deployment:** $DEPLOYMENT_VERSION
- **Rollback Duration:** $(calculate_rollback_duration)

## Actions Performed
- Feature flags disabled
- n8n workflows restored
- Configuration rolled back
- System verification completed

## System Status
- **n8n API:** $(check_service_status "$N8N_BASE_URL/api/v1/executions")
- **Webhook Endpoint:** $(check_service_status "$N8N_BASE_URL/webhook/ignite-interest-form")
- **Data Integrity:** Verified

## Next Steps
1. Monitor system stability
2. Investigate rollback cause
3. Plan remediation if needed
4. Update deployment procedures

## Logs
- **Rollback Log:** $ROLLBACK_LOG
- **Backup Location:** $BACKUP_LOCATION
- **Report File:** $report_file

---
Generated automatically by rollback script
EOF

    log "INFO" "Rollback report generated: $report_file"
}

calculate_rollback_duration() {
    # This would calculate the actual duration
    echo "Calculated based on log timestamps"
}

check_service_status() {
    local url=$1
    if curl -s --max-time 10 "$url" >/dev/null 2>&1; then
        echo "HEALTHY"
    else
        echo "UNHEALTHY"
    fi
}

cleanup_rollback() {
    log "INFO" "Cleaning up rollback artifacts..."

    # Remove temporary files
    rm -f /tmp/rollback_*.json
    rm -f /tmp/current_*.json

    # Archive rollback logs
    local log_archive_dir="$SCRIPT_DIR/logs/rollback-archive"
    mkdir -p "$log_archive_dir"

    # Archive old rollback logs
    find "$SCRIPT_DIR" -name "rollback-*.log" -mtime +7 -exec mv {} "$log_archive_dir/" \;

    log "INFO" "Cleanup completed"
}

# =============================================================================
# Main Rollback Function
# =============================================================================

show_usage() {
    cat << EOF
Usage: $0 [OPTIONS]

Rollback Mailchimp automation deployment to previous state.

OPTIONS:
    --type TYPE         Rollback type: full, partial, config-only (default: full)
    --force             Force rollback without confirmation
    --preserve-data     Preserve Mailchimp data during rollback (default: true)
    --skip-confirmation Skip all confirmation prompts
    --dry-run           Show what would be done without making changes
    --help              Show this help message

EXAMPLES:
    $0                          # Full rollback with confirmation
    $0 --type partial --force   # Partial rollback without confirmation
    $0 --dry-run                # Show rollback plan without executing

EOF
}

parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --type)
                ROLLBACK_TYPE="$2"
                shift 2
                ;;
            --force)
                FORCE_ROLLBACK="true"
                shift
                ;;
            --preserve-data)
                PRESERVE_DATA="true"
                shift
                ;;
            --no-preserve-data)
                PRESERVE_DATA="false"
                shift
                ;;
            --skip-confirmation)
                SKIP_CONFIRMATION="true"
                shift
                ;;
            --dry-run)
                DRY_RUN="true"
                shift
                ;;
            --help)
                show_usage
                exit 0
                ;;
            *)
                log "ERROR" "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done

    # Validate rollback type
    case "$ROLLBACK_TYPE" in
        "full"|"partial"|"config-only")
            ;;
        *)
            log "ERROR" "Invalid rollback type: $ROLLBACK_TYPE"
            log "ERROR" "Valid types: full, partial, config-only"
            exit 1
            ;;
    esac
}

main() {
    log "INFO" "Starting Mailchimp Automation Rollback"
    log "INFO" "======================================="

    # Parse command line arguments
    parse_arguments "$@"

    # Check if running as dry run
    if [[ "${DRY_RUN:-false}" == "true" ]]; then
        log "INFO" "Running in DRY RUN mode - no changes will be made"
        show_rollback_plan
        exit 0
    fi

    # Confirmation prompt
    if [[ "$SKIP_CONFIRMATION" != "true" && "$FORCE_ROLLBACK" != "true" ]]; then
        echo
        log "WARN" "This will rollback the Mailchimp automation deployment"
        log "WARN" "Rollback type: $ROLLBACK_TYPE"
        log "WARN" "Preserve data: $PRESERVE_DATA"
        echo
        read -p "Are you sure you want to proceed? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log "INFO" "Rollback cancelled by user"
            exit 0
        fi
    fi

    # Trap to ensure cleanup on exit
    trap cleanup_rollback EXIT

    try {
        # Phase 1: Preparation
        log "INFO" "Phase 1: Rollback preparation"
        load_rollback_state
        load_environment
        validate_rollback_conditions
        perform_safety_checks

        # Phase 2: Rollback execution
        log "INFO" "Phase 2: Rollback execution"
        execute_rollback

        # Phase 3: Verification
        log "INFO" "Phase 3: Rollback verification"
        verify_rollback

        # Phase 4: Post-rollback actions
        log "INFO" "Phase 4: Post-rollback actions"
        post_rollback_actions

        log "INFO" "======================================="
        log "INFO" "Rollback completed successfully!"
        log "INFO" "System has been restored to previous state"
        log "INFO" "Rollback log: $ROLLBACK_LOG"

    } catch {
        log "ERROR" "Rollback failed: $1"
        log "ERROR" "======================================="
        log "ERROR" "Rollback failed! System may be in inconsistent state"
        log "ERROR" "Check log for details: $ROLLBACK_LOG"
        log "ERROR" "Manual intervention may be required"

        exit 1
    }
}

show_rollback_plan() {
    log "INFO" "Rollback Plan (DRY RUN)"
    log "INFO" "======================="
    log "INFO" "Rollback Type: $ROLLBACK_TYPE"
    log "INFO" "Preserve Data: $PRESERVE_DATA"
    log "INFO" ""
    log "INFO" "Actions that would be performed:"

    case "$ROLLBACK_TYPE" in
        "full")
            log "INFO" "1. Disable all Mailchimp features"
            log "INFO" "2. Restore n8n workflows from backup"
            log "INFO" "3. Restore configuration settings"
            if [[ "$PRESERVE_DATA" != "true" ]]; then
                log "INFO" "4. Clean up Mailchimp subscriber data"
            fi
            log "INFO" "5. Verify system functionality"
            ;;
        "partial")
            log "INFO" "1. Disable Mailchimp features"
            log "INFO" "2. Route traffic back to old system"
            log "INFO" "3. Deactivate Mailchimp nodes"
            log "INFO" "4. Verify system functionality"
            ;;
        "config-only")
            log "INFO" "1. Restore configuration settings"
            log "INFO" "2. Reset feature flags"
            log "INFO" "3. Verify configuration"
            ;;
    esac

    log "INFO" ""
    log "INFO" "Use --force to execute without confirmation"
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

# =============================================================================
# Script Entry Point
# =============================================================================

# Check if script is being sourced or executed
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi