# Rollback and Recovery Procedures for Mailchimp Automation Workflow

## 🚨 Emergency Response Overview

This document provides comprehensive rollback and recovery procedures for the Ignite Health Systems interest form automation workflow, ensuring business continuity in case of system failures or issues.

## ⚡ Immediate Response Protocol

### 1. Issue Classification

#### Critical Issues (Immediate Action Required)
- **Complete workflow failure**: No leads being processed
- **Data corruption**: Incorrect or missing lead information
- **Security breach**: Unauthorized access or data exposure
- **Co-founder leads missed**: High-priority leads not receiving immediate attention
- **Mass email failures**: Welcome emails not being sent

#### High Priority Issues (Action Required Within 1 Hour)
- **Partial workflow failure**: Some components working, others failing
- **Performance degradation**: Processing times >60 seconds
- **API rate limiting**: Services temporarily unavailable
- **Email formatting issues**: Emails sent but poorly formatted

#### Medium Priority Issues (Action Required Within 4 Hours)
- **Monitoring alerts**: System health warnings
- **Data sync delays**: Information eventually consistent but delayed
- **Non-critical integrations**: Telegram notifications delayed

### 2. Emergency Contact Protocol

```yaml
Incident Response Team:
  Primary: Dr. Bhaven Murji (Founder/CEO)
    - Phone: [PRIMARY_PHONE]
    - Email: admin@ignitehealthsystems.com
    - Telegram: @bhaven_murji

  Technical Lead: [If applicable]
    - Phone: [TECH_PHONE]
    - Email: tech@ignitehealthsystems.com

  Backup: [Secondary contact]
    - Phone: [BACKUP_PHONE]
    - Email: backup@ignitehealthsystems.com

Communication Channels:
  - Primary: Telegram alerts
  - Secondary: SMS/Phone for critical issues
  - Documentation: Email for incident reports
```

## 🔄 Rollback Procedures

### Scenario 1: Complete n8n Workflow Failure

#### Immediate Actions (0-5 minutes)
```bash
# 1. Verify workflow status
curl -X GET "https://your-n8n-instance.com/api/v1/workflows/active" \
  -H "Authorization: Bearer $N8N_API_KEY"

# 2. Check recent executions
curl -X GET "https://your-n8n-instance.com/api/v1/executions?limit=10" \
  -H "Authorization: Bearer $N8N_API_KEY"

# 3. Activate manual lead processing
echo "CRITICAL: Workflow down. Activating manual procedures." | \
  curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
  -d "chat_id=$TELEGRAM_CHAT_ID" \
  -d "text=@channel $(cat -)"
```

#### Manual Processing Activation
```javascript
// Activate backup webhook endpoint
const manualProcessor = {
  endpoint: "https://your-backup-server.com/manual-lead-handler",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer BACKUP_TOKEN"
  }
};

// Redirect website form to backup processor
// Update form action: document.getElementById('interest-form').action = manualProcessor.endpoint;
```

#### Rollback Steps
1. **Disable current workflow**: Prevent further failed executions
2. **Enable backup processing**: Activate manual or simplified automation
3. **Communicate status**: Notify team and stakeholders
4. **Begin diagnosis**: Identify root cause while backup systems handle leads

### Scenario 2: Google Sheets API Failure

#### Immediate Rollback (0-10 minutes)
```javascript
// Temporary local storage backup
const leadBackup = [];

function backupLead(leadData) {
  leadBackup.push({
    timestamp: new Date().toISOString(),
    data: leadData,
    status: 'sheets_api_failed'
  });

  // Store in browser localStorage as emergency backup
  localStorage.setItem('ignite_lead_backup', JSON.stringify(leadBackup));

  // Send to backup email
  sendBackupEmail(leadData);
}

function sendBackupEmail(lead) {
  // Use alternative email service or manual notification
  const backupMessage = `
EMERGENCY LEAD BACKUP - Google Sheets Failed

Name: ${lead.firstName} ${lead.lastName}
Email: ${lead.email}
Type: ${lead.userType}
Co-founder Interest: ${lead.cofounder ? 'YES - PRIORITY' : 'No'}
Challenge: ${lead.challenge}
Timestamp: ${new Date().toISOString()}

ACTION REQUIRED: Manually add to Google Sheets when service restored.
  `;

  // Send via backup email service or direct notification
  sendTelegramAlert('SHEETS API DOWN', backupMessage);
}
```

#### Recovery Process
1. **Switch to backup logging**: Use local storage or alternative database
2. **Continue workflow**: Allow other components to function
3. **Manual data entry**: Add leads to Google Sheets manually when restored
4. **Data reconciliation**: Sync backup data once service restored

### Scenario 3: Mailchimp API Failure

#### Temporary Workaround
```javascript
// Store contacts for later Mailchimp sync
const mailchimpBackup = [];

function backupMailchimpContact(contactData) {
  const backup = {
    timestamp: new Date().toISOString(),
    email: contactData.email,
    firstName: contactData.firstName,
    lastName: contactData.lastName,
    userType: contactData.userType,
    mergeFields: contactData.mergeFields,
    tags: contactData.tags,
    status: 'mailchimp_api_failed'
  };

  mailchimpBackup.push(backup);

  // Send backup notification
  sendTelegramAlert('MAILCHIMP API DOWN', `
Lead: ${contactData.firstName} ${contactData.lastName}
Email: ${contactData.email}
Type: ${contactData.userType}
Status: Stored for manual Mailchimp sync
  `);
}

// Bulk sync function for when API restored
function syncBackupToMailchimp() {
  mailchimpBackup.forEach(async (contact) => {
    try {
      await addToMailchimp(contact);
      contact.status = 'synced';
    } catch (error) {
      console.error(`Failed to sync ${contact.email}:`, error);
    }
  });
}
```

#### Recovery Process
1. **Continue email sending**: Use Gmail API directly
2. **Store contact data**: Backup for later Mailchimp sync
3. **Manual segmentation**: Temporarily use other methods for lead categorization
4. **Bulk import**: Sync all backup contacts when API restored

### Scenario 4: Gmail API Failure / Email Delivery Issues

#### Alternative Email Delivery
```javascript
// Backup email service configuration
const backupEmailService = {
  service: 'SendGrid', // or Mailgun, AWS SES
  apiKey: process.env.BACKUP_EMAIL_API_KEY,
  fromEmail: 'noreply@ignitehealthsystems.com',
  fromName: 'Dr. Bhaven Murji'
};

async function sendViaBackupService(emailData) {
  const message = {
    to: emailData.recipient,
    from: {
      email: backupEmailService.fromEmail,
      name: backupEmailService.fromName
    },
    subject: emailData.subject,
    html: emailData.htmlContent
  };

  try {
    await sendWithBackupService(message);
    return { success: true, service: 'backup' };
  } catch (error) {
    // Last resort: Store email for manual sending
    storeForManualSending(emailData);
    return { success: false, stored: true };
  }
}

function storeForManualSending(emailData) {
  const emailBackup = {
    timestamp: new Date().toISOString(),
    recipient: emailData.recipient,
    subject: emailData.subject,
    content: emailData.htmlContent,
    priority: emailData.cofounderInterest ? 'HIGH' : 'NORMAL',
    status: 'manual_send_required'
  };

  // Store in local database or file
  appendToFile('email_backup.json', JSON.stringify(emailBackup));

  // Alert for manual intervention
  sendTelegramAlert('EMAIL DELIVERY FAILED', `
Recipient: ${emailData.recipient}
Subject: ${emailData.subject}
Priority: ${emailData.cofounderInterest ? 'HIGH - CO-FOUNDER INTEREST' : 'Normal'}
Action: Manual email send required
  `);
}
```

### Scenario 5: Data Corruption / Integrity Issues

#### Data Validation and Rollback
```javascript
// Data integrity checks
function validateLeadData(lead) {
  const issues = [];

  if (!lead.firstName || lead.firstName.length < 1) {
    issues.push('Missing or invalid first name');
  }

  if (!lead.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    issues.push('Missing or invalid email address');
  }

  if (!['physician', 'investor', 'specialist'].includes(lead.userType)) {
    issues.push('Invalid user type');
  }

  if (lead.cofounder !== true && lead.cofounder !== false) {
    issues.push('Invalid co-founder flag');
  }

  return {
    valid: issues.length === 0,
    issues: issues
  };
}

// Quarantine corrupted data
function quarantineCorruptedData(data, issues) {
  const quarantine = {
    timestamp: new Date().toISOString(),
    originalData: data,
    validationIssues: issues,
    status: 'quarantined'
  };

  // Store in quarantine folder/database
  appendToFile('data_quarantine.json', JSON.stringify(quarantine));

  // Alert for manual review
  sendTelegramAlert('DATA CORRUPTION DETECTED', `
Issues: ${issues.join(', ')}
Data quarantined for manual review
Original data stored safely
Manual intervention required
  `);
}

// Data recovery from backup
function recoverFromBackup(timestamp) {
  // Restore from Google Sheets backup
  // Restore from Mailchimp export
  // Restore from email logs
  // Validate recovered data
}
```

## 🔧 Recovery Procedures

### 1. Service Restoration Checklist

#### n8n Workflow Recovery
```yaml
Pre-Recovery Checks:
  - [ ] Verify all API credentials are valid
  - [ ] Check n8n instance health and resources
  - [ ] Confirm all required environment variables
  - [ ] Test webhook endpoint accessibility
  - [ ] Validate workflow configuration

Recovery Steps:
  1. Restart n8n service/instance
  2. Activate workflow
  3. Test with sample data
  4. Monitor initial executions
  5. Gradually increase traffic
  6. Verify all integrations working

Post-Recovery Validation:
  - [ ] Submit test lead through website form
  - [ ] Verify Google Sheets logging
  - [ ] Check Mailchimp contact creation
  - [ ] Confirm email delivery
  - [ ] Test Telegram notifications
  - [ ] Monitor performance metrics
```

#### API Service Recovery
```yaml
Google Sheets Recovery:
  1. Verify OAuth token refresh
  2. Test API connectivity
  3. Check spreadsheet permissions
  4. Validate data schema
  5. Sync any backup data

Mailchimp Recovery:
  1. Verify API key validity
  2. Check audience accessibility
  3. Validate merge fields
  4. Test automation triggers
  5. Bulk import backup contacts

Gmail Recovery:
  1. Refresh OAuth tokens
  2. Check API quotas
  3. Test email sending
  4. Verify deliverability
  5. Send queued emails

Telegram Recovery:
  1. Verify bot token
  2. Test chat accessibility
  3. Check notification permissions
  4. Validate message formatting
```

### 2. Data Recovery and Sync

#### Backup Data Sources
```javascript
const backupSources = {
  // Primary backup: Google Sheets export
  googleSheets: {
    exportUrl: "https://docs.google.com/spreadsheets/d/1kPYgthwKzREJYKjAnE4h1YFMRxg5ulynrbDYNRxb8Lo/export?format=csv",
    lastBackup: "daily 2:00 AM UTC",
    retention: "30 days"
  },

  // Secondary backup: Mailchimp audience export
  mailchimp: {
    exportEndpoint: "/lists/9884a65adf/members",
    lastBackup: "weekly",
    retention: "90 days"
  },

  // Emergency backup: Local storage/files
  localStorage: {
    location: "browser localStorage",
    key: "ignite_lead_backup",
    retention: "until manual clear"
  },

  // Audit logs: n8n execution history
  n8nLogs: {
    endpoint: "/api/v1/executions",
    retention: "30 days",
    includes: "full execution data"
  }
};

// Data recovery function
async function recoverData(fromDate, toDate) {
  const recoveredLeads = [];

  try {
    // 1. Recover from Google Sheets
    const sheetsData = await exportGoogleSheets(fromDate, toDate);
    recoveredLeads.push(...sheetsData);

    // 2. Cross-reference with Mailchimp
    const mailchimpData = await exportMailchimpContacts(fromDate, toDate);

    // 3. Reconcile data discrepancies
    const reconciled = reconcileData(sheetsData, mailchimpData);

    // 4. Restore missing entries
    await restoreMissingEntries(reconciled);

    return {
      success: true,
      recovered: recoveredLeads.length,
      reconciled: reconciled.length
    };
  } catch (error) {
    console.error('Data recovery failed:', error);
    return { success: false, error: error.message };
  }
}
```

### 3. Manual Processing Procedures

#### Emergency Manual Lead Processing
```yaml
When Automation Completely Fails:

Step 1: Immediate Lead Capture
  - Monitor email for form submissions (if backup email configured)
  - Check website form submissions manually
  - Review any automated notifications that still work

Step 2: Manual Data Entry
  - Add leads to Google Sheets manually
  - Create Mailchimp contacts manually
  - Send welcome emails using templates

Step 3: Priority Processing
  - Identify co-founder interested leads immediately
  - Send personal follow-up within 1 hour
  - Ensure high-priority leads receive immediate attention

Step 4: Communication
  - Notify team of manual processing mode
  - Set expectations for response times
  - Document all manual actions for later automation sync
```

#### Manual Processing Templates

**Email Template for Manual Sending**:
```html
Subject: Welcome to Ignite Health Systems - {USER_TYPE_SPECIFIC}

Dear {FIRST_NAME},

Thank you for your interest in Ignite Health Systems.

[Manual customization based on user type and details]

This email was sent manually due to a temporary system maintenance.
We apologize for any delay in our response.

Best regards,
Dr. Bhaven Murji
Founder & CEO, Ignite Health Systems

---
Sent manually on {DATE} due to system maintenance
```

**Manual Data Entry Checklist**:
```yaml
For Each Lead:
  - [ ] Add to Google Sheets with all available data
  - [ ] Create Mailchimp contact with appropriate tags
  - [ ] Send personalized welcome email
  - [ ] If co-founder interest: Send immediate personal follow-up
  - [ ] Log action taken and timestamp
  - [ ] Mark for automation sync when system restored
```

## 🔍 Post-Incident Procedures

### 1. Incident Analysis

#### Root Cause Analysis Template
```yaml
Incident Report: [INCIDENT_ID]
Date: [DATE]
Duration: [START_TIME] to [END_TIME]
Severity: Critical/High/Medium/Low

Affected Systems:
  - [ ] n8n Workflow
  - [ ] Google Sheets Integration
  - [ ] Mailchimp Integration
  - [ ] Gmail Integration
  - [ ] Telegram Notifications
  - [ ] Website Form

Impact:
  - Leads affected: [NUMBER]
  - Emails not sent: [NUMBER]
  - Co-founder leads missed: [NUMBER]
  - Business impact: [DESCRIPTION]

Root Cause:
  [Detailed analysis of what caused the issue]

Contributing Factors:
  - [List any contributing factors]

Resolution:
  [What was done to fix the issue]

Prevention Measures:
  - [Steps to prevent recurrence]
  - [Monitoring improvements]
  - [Process changes]

Lessons Learned:
  - [Key takeaways]
  - [Process improvements needed]
```

### 2. System Validation Post-Recovery

#### Complete System Test
```bash
#!/bin/bash
# post-recovery-validation.sh

echo "Starting post-recovery system validation..."

# Test 1: Submit test lead
test_lead_data='{
  "firstName": "Recovery",
  "lastName": "Test",
  "email": "recovery-test-'$(date +%s)'@example.com",
  "userType": "physician",
  "specialty": "Test Medicine",
  "practiceModel": "independent",
  "emrSystem": "Epic",
  "challenge": "Post-recovery validation test",
  "cofounder": false,
  "_test": true
}'

echo "Submitting test lead..."
response=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "$test_lead_data")

if [[ $? -eq 0 ]]; then
  echo "✅ Test lead submitted successfully"
else
  echo "❌ Test lead submission failed"
  exit 1
fi

# Test 2: Wait and verify processing
echo "Waiting 60 seconds for processing..."
sleep 60

# Test 3: Verify Google Sheets entry
echo "Verifying Google Sheets entry..."
# [Add Google Sheets verification logic]

# Test 4: Verify Mailchimp contact
echo "Verifying Mailchimp contact creation..."
# [Add Mailchimp verification logic]

# Test 5: Check email delivery
echo "Checking email delivery..."
# [Add email verification logic]

echo "Post-recovery validation completed successfully"
```

### 3. Data Reconciliation

#### Sync Backup Data
```javascript
async function reconcileDataPostRecovery() {
  console.log('Starting data reconciliation...');

  // 1. Identify data gaps during downtime
  const downtimeStart = '2024-01-15T10:00:00Z';
  const downtimeEnd = '2024-01-15T10:30:00Z';

  // 2. Recover from backup sources
  const backupLeads = await getBackupLeads(downtimeStart, downtimeEnd);

  // 3. Process each backup lead
  for (const lead of backupLeads) {
    try {
      // Add to Google Sheets if missing
      await ensureInGoogleSheets(lead);

      // Add to Mailchimp if missing
      await ensureInMailchimp(lead);

      // Send welcome email if not sent
      if (!lead.emailSent) {
        await sendWelcomeEmail(lead);
      }

      // Handle co-founder leads specially
      if (lead.cofounder && !lead.notificationSent) {
        await sendCofounderNotification(lead);
      }

      console.log(`Reconciled lead: ${lead.email}`);
    } catch (error) {
      console.error(`Failed to reconcile ${lead.email}:`, error);
    }
  }

  console.log('Data reconciliation completed');
}
```

## 📋 Emergency Contact Information

### Key Personnel
```yaml
Immediate Response Team:
  - Primary: Dr. Bhaven Murji
    Role: Founder/CEO & Technical Decision Maker
    Phone: [PRIMARY]
    Email: admin@ignitehealthsystems.com
    Telegram: @bhaven_murji
    Availability: 24/7 for critical issues

  - Secondary: [Technical Support]
    Role: Technical Implementation
    Phone: [SECONDARY]
    Email: tech@ignitehealthsystems.com
    Availability: Business hours

External Support:
  - n8n Support: support@n8n.io
  - Mailchimp Support: Technical support portal
  - Google Workspace Support: Google Support case system
  - Gmail API Support: Google Developer Console
```

### Service Provider Contacts
```yaml
Infrastructure:
  - n8n Cloud: support@n8n.io
  - Hosting Provider: [HOSTING_SUPPORT]
  - Domain/DNS: [DNS_PROVIDER_SUPPORT]

APIs:
  - Google APIs: Google Developer Console
  - Mailchimp: support@mailchimp.com
  - Telegram: No direct support (community forums)

Monitoring:
  - Uptime Monitoring: [MONITORING_SERVICE]
  - Error Tracking: [ERROR_TRACKING_SERVICE]
```

## 🎯 Prevention and Improvement

### Proactive Measures
1. **Redundancy**: Implement backup systems for critical components
2. **Monitoring**: Enhanced alerting and health checks
3. **Testing**: Regular disaster recovery testing
4. **Documentation**: Keep procedures updated
5. **Training**: Ensure team knows emergency procedures

### Continuous Improvement
1. **Post-incident reviews**: Learn from every incident
2. **Automation improvements**: Reduce manual intervention needs
3. **Monitoring enhancement**: Better early warning systems
4. **Process refinement**: Streamline recovery procedures
5. **Capacity planning**: Prevent resource-related failures

This comprehensive rollback and recovery plan ensures that the Ignite Health Systems automation workflow can handle any disruption while maintaining business continuity and data integrity.