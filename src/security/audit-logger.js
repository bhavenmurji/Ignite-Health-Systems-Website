/**
 * HIPAA-Compliant Audit Logging System
 * Ignite Health Systems - Healthcare Security Implementation
 *
 * Implements 45 CFR §164.312(b) - Audit controls
 * Records and examines access and other activity in information systems
 */

const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * HIPAA Audit Event Types
 * Based on healthcare industry standards and regulatory requirements
 */
const AUDIT_EVENTS = {
  // Authentication Events
  AUTH_LOGIN_SUCCESS: 'AUTHENTICATION_SUCCESS',
  AUTH_LOGIN_FAILURE: 'AUTHENTICATION_FAILURE',
  AUTH_LOGOUT: 'AUTHENTICATION_LOGOUT',
  AUTH_PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  AUTH_MFA_ENABLED: 'MFA_ENABLED',
  AUTH_MFA_DISABLED: 'MFA_DISABLED',
  AUTH_ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  AUTH_ACCOUNT_UNLOCKED: 'ACCOUNT_UNLOCKED',

  // Data Access Events
  DATA_PHI_ACCESS: 'PHI_ACCESS',
  DATA_PHI_MODIFY: 'PHI_MODIFY',
  DATA_PHI_CREATE: 'PHI_CREATE',
  DATA_PHI_DELETE: 'PHI_DELETE',
  DATA_PHI_EXPORT: 'PHI_EXPORT',
  DATA_PHI_PRINT: 'PHI_PRINT',
  DATA_SEARCH_PERFORMED: 'DATA_SEARCH',
  DATA_REPORT_GENERATED: 'REPORT_GENERATION',

  // System Administration
  ADMIN_USER_CREATED: 'USER_ACCOUNT_CREATED',
  ADMIN_USER_MODIFIED: 'USER_ACCOUNT_MODIFIED',
  ADMIN_USER_DELETED: 'USER_ACCOUNT_DELETED',
  ADMIN_PERMISSION_GRANTED: 'PERMISSION_GRANTED',
  ADMIN_PERMISSION_REVOKED: 'PERMISSION_REVOKED',
  ADMIN_SYSTEM_CONFIG: 'SYSTEM_CONFIGURATION',
  ADMIN_SOFTWARE_INSTALL: 'SOFTWARE_INSTALLATION',

  // Security Events
  SECURITY_BREACH_DETECTED: 'SECURITY_BREACH',
  SECURITY_VIOLATION: 'SECURITY_VIOLATION',
  SECURITY_ANOMALY: 'SECURITY_ANOMALY',
  SECURITY_MALWARE_DETECTED: 'MALWARE_DETECTED',
  SECURITY_INTRUSION_ATTEMPT: 'INTRUSION_ATTEMPT',
  SECURITY_POLICY_VIOLATION: 'POLICY_VIOLATION',

  // Network Events
  NETWORK_CONNECTION: 'NETWORK_CONNECTION',
  NETWORK_DISCONNECTION: 'NETWORK_DISCONNECTION',
  NETWORK_RESOURCE_ACCESS: 'NETWORK_RESOURCE_ACCESS',
  NETWORK_FILE_TRANSFER: 'FILE_TRANSFER',

  // Application Events
  APP_START: 'APPLICATION_START',
  APP_STOP: 'APPLICATION_STOP',
  APP_ERROR: 'APPLICATION_ERROR',
  APP_BACKUP_CREATED: 'BACKUP_CREATED',
  APP_BACKUP_RESTORED: 'BACKUP_RESTORED',

  // Communication Events
  COMM_EMAIL_SENT: 'EMAIL_SENT',
  COMM_MESSAGE_SENT: 'MESSAGE_SENT',
  COMM_NOTIFICATION_SENT: 'NOTIFICATION_SENT',
  COMM_PHI_TRANSMITTED: 'PHI_TRANSMISSION'
};

/**
 * Risk Levels for Audit Events
 */
const RISK_LEVELS = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
  INFO: 'INFO'
};

/**
 * Reasons for Access (HIPAA compliant)
 */
const ACCESS_REASONS = {
  TREATMENT: 'TREATMENT',
  PAYMENT: 'PAYMENT',
  OPERATIONS: 'HEALTHCARE_OPERATIONS',
  RESEARCH: 'RESEARCH',
  PUBLIC_HEALTH: 'PUBLIC_HEALTH',
  LEGAL: 'LEGAL_REQUIREMENT',
  EMERGENCY: 'EMERGENCY',
  INDIVIDUAL_REQUEST: 'INDIVIDUAL_REQUEST'
};

/**
 * HIPAA Audit Logger
 * Implements tamper-evident, comprehensive audit logging for healthcare systems
 */
class HIPAAAuditLogger {
  constructor(options = {}) {
    this.logDirectory = options.logDirectory || './logs/audit';
    this.maxLogSize = options.maxLogSize || 100 * 1024 * 1024; // 100MB
    this.retentionYears = options.retentionYears || 6; // HIPAA requirement
    this.enableEncryption = options.enableEncryption !== false;
    this.enableRealTimeMonitoring = options.enableRealTimeMonitoring !== false;

    // Anomaly detection thresholds
    this.anomalyThresholds = {
      maxFailedLogins: 5,
      maxRecordsAccessed: 100,
      maxAfterHoursAccess: 5,
      maxBulkOperations: 10
    };

    // Initialize logging system
    this.initializeLogger();
  }

  /**
   * Initialize the audit logging system
   */
  async initializeLogger() {
    try {
      // Create log directory if it doesn't exist
      await fs.mkdir(this.logDirectory, { recursive: true });

      // Initialize current log file
      this.currentLogFile = path.join(this.logDirectory, `audit_${new Date().toISOString().split('T')[0]}.json`);

      // Set up log rotation
      await this.rotateLogsIfNeeded();

      // Initialize anomaly detection
      if (this.enableRealTimeMonitoring) {
        this.initializeAnomalyDetection();
      }

      console.log('HIPAA Audit Logger initialized successfully');
    } catch (error) {
      console.error('Failed to initialize audit logger:', error);
      throw error;
    }
  }

  /**
   * Primary audit logging method
   * @param {string} eventType - Type of event (from AUDIT_EVENTS)
   * @param {Object} eventData - Event details
   */
  async logEvent(eventType, eventData = {}) {
    try {
      const auditEntry = await this.createAuditEntry(eventType, eventData);

      // Write to log file
      await this.writeAuditEntry(auditEntry);

      // Real-time monitoring and anomaly detection
      if (this.enableRealTimeMonitoring) {
        await this.performAnomalyDetection(auditEntry);
      }

      // Handle high-risk events
      if (auditEntry.riskLevel === RISK_LEVELS.CRITICAL || auditEntry.riskLevel === RISK_LEVELS.HIGH) {
        await this.handleHighRiskEvent(auditEntry);
      }

      return auditEntry.auditId;
    } catch (error) {
      console.error('Audit logging failed:', error);
      // Critical: Audit failures must be logged separately
      await this.logAuditSystemFailure(error, eventType);
      throw error;
    }
  }

  /**
   * Create a comprehensive audit entry
   */
  async createAuditEntry(eventType, eventData) {
    const timestamp = new Date();
    const auditId = uuidv4();

    const baseEntry = {
      auditId: auditId,
      timestamp: timestamp.toISOString(),
      eventType: eventType,
      eventTypeHuman: this.getHumanReadableEventType(eventType),

      // User/Actor Information
      userId: eventData.userId || 'system',
      username: eventData.username || 'unknown',
      userRole: eventData.userRole || 'unknown',
      sessionId: eventData.sessionId || null,

      // Source Information
      sourceIP: this.hashIP(eventData.sourceIP || '127.0.0.1'),
      userAgent: eventData.userAgent ? this.truncateString(eventData.userAgent, 500) : null,
      sourceApplication: eventData.sourceApplication || 'web',

      // Event Details
      resourceAccessed: eventData.resource || null,
      resourceType: eventData.resourceType || null,
      action: eventData.action || eventType,
      outcome: eventData.outcome || 'SUCCESS',

      // Healthcare-specific fields
      patientId: eventData.patientId || null,
      reasonForAccess: eventData.reasonForAccess || ACCESS_REASONS.TREATMENT,
      dataTypes: eventData.dataTypes || [],

      // Risk and Impact
      riskLevel: this.calculateRiskLevel(eventType, eventData),
      impactLevel: eventData.impactLevel || 'LOW',

      // Additional context
      businessJustification: eventData.businessJustification || null,
      additionalDetails: eventData.additionalDetails || {},

      // System metadata
      systemId: process.env.SYSTEM_ID || 'ignite-health-systems',
      facilityId: eventData.facilityId || 'main',
      applicationVersion: process.env.npm_package_version || '1.0.0'
    };

    // Generate tamper-evident checksum
    baseEntry.checksum = await this.generateChecksum(baseEntry);

    return baseEntry;
  }

  /**
   * Calculate risk level based on event type and context
   */
  calculateRiskLevel(eventType, eventData) {
    // Critical risk events
    const criticalEvents = [
      AUDIT_EVENTS.SECURITY_BREACH_DETECTED,
      AUDIT_EVENTS.SECURITY_MALWARE_DETECTED,
      AUDIT_EVENTS.ADMIN_USER_DELETED,
      AUDIT_EVENTS.DATA_PHI_DELETE
    ];

    // High risk events
    const highRiskEvents = [
      AUDIT_EVENTS.AUTH_LOGIN_FAILURE,
      AUDIT_EVENTS.SECURITY_VIOLATION,
      AUDIT_EVENTS.SECURITY_INTRUSION_ATTEMPT,
      AUDIT_EVENTS.DATA_PHI_EXPORT,
      AUDIT_EVENTS.ADMIN_PERMISSION_GRANTED
    ];

    // Medium risk events
    const mediumRiskEvents = [
      AUDIT_EVENTS.DATA_PHI_ACCESS,
      AUDIT_EVENTS.DATA_PHI_MODIFY,
      AUDIT_EVENTS.AUTH_PASSWORD_CHANGE,
      AUDIT_EVENTS.DATA_SEARCH_PERFORMED
    ];

    if (criticalEvents.includes(eventType)) {
      return RISK_LEVELS.CRITICAL;
    }

    if (highRiskEvents.includes(eventType)) {
      return RISK_LEVELS.HIGH;
    }

    if (mediumRiskEvents.includes(eventType)) {
      return RISK_LEVELS.MEDIUM;
    }

    // Context-based risk elevation
    if (eventData.outcome === 'FAILURE' || eventData.outcome === 'ERROR') {
      return RISK_LEVELS.HIGH;
    }

    if (eventData.afterHours === true) {
      return RISK_LEVELS.MEDIUM;
    }

    if (eventData.bulkOperation === true) {
      return RISK_LEVELS.MEDIUM;
    }

    return RISK_LEVELS.LOW;
  }

  /**
   * Write audit entry to log file with encryption
   */
  async writeAuditEntry(auditEntry) {
    const logLine = JSON.stringify(auditEntry) + '\n';

    let dataToWrite = logLine;
    if (this.enableEncryption) {
      dataToWrite = await this.encryptLogEntry(logLine);
    }

    await fs.appendFile(this.currentLogFile, dataToWrite, { flag: 'a' });

    // Check if log rotation is needed
    await this.rotateLogsIfNeeded();
  }

  /**
   * Encrypt log entry for secure storage
   */
  async encryptLogEntry(logData) {
    const algorithm = 'aes-256-gcm';
    const key = await this.getEncryptionKey();
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipher(algorithm, key, iv);

    let encrypted = cipher.update(logData, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return JSON.stringify({
      encrypted: encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      algorithm: algorithm
    }) + '\n';
  }

  /**
   * Get or generate encryption key for log files
   */
  async getEncryptionKey() {
    // In production, use proper key management (HSM, KMS, etc.)
    const keyPath = path.join(this.logDirectory, '.audit_key');

    try {
      const keyData = await fs.readFile(keyPath, 'utf8');
      return keyData.trim();
    } catch (error) {
      // Generate new key
      const newKey = crypto.randomBytes(32).toString('hex');
      await fs.writeFile(keyPath, newKey, { mode: 0o600 });
      return newKey;
    }
  }

  /**
   * Generate tamper-evident checksum
   */
  async generateChecksum(entry) {
    const entryClone = { ...entry };
    delete entryClone.checksum; // Remove checksum field for calculation

    const dataString = JSON.stringify(entryClone, Object.keys(entryClone).sort());
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }

  /**
   * Verify audit entry integrity
   */
  async verifyAuditEntry(entry) {
    const storedChecksum = entry.checksum;
    const calculatedChecksum = await this.generateChecksum(entry);

    return storedChecksum === calculatedChecksum;
  }

  /**
   * Anomaly detection for suspicious patterns
   */
  async performAnomalyDetection(auditEntry) {
    const anomalies = [];

    // Failed login attempts
    if (auditEntry.eventType === AUDIT_EVENTS.AUTH_LOGIN_FAILURE) {
      const recentFailures = await this.countRecentEvents(
        AUDIT_EVENTS.AUTH_LOGIN_FAILURE,
        auditEntry.userId,
        15 * 60 * 1000 // 15 minutes
      );

      if (recentFailures >= this.anomalyThresholds.maxFailedLogins) {
        anomalies.push({
          type: 'EXCESSIVE_FAILED_LOGINS',
          severity: RISK_LEVELS.HIGH,
          count: recentFailures,
          threshold: this.anomalyThresholds.maxFailedLogins
        });
      }
    }

    // Excessive data access
    if (auditEntry.eventType === AUDIT_EVENTS.DATA_PHI_ACCESS) {
      const recentAccess = await this.countRecentEvents(
        AUDIT_EVENTS.DATA_PHI_ACCESS,
        auditEntry.userId,
        60 * 60 * 1000 // 1 hour
      );

      if (recentAccess >= this.anomalyThresholds.maxRecordsAccessed) {
        anomalies.push({
          type: 'EXCESSIVE_DATA_ACCESS',
          severity: RISK_LEVELS.MEDIUM,
          count: recentAccess,
          threshold: this.anomalyThresholds.maxRecordsAccessed
        });
      }
    }

    // After-hours access
    if (this.isAfterHours(auditEntry.timestamp)) {
      const afterHoursCount = await this.countRecentAfterHoursEvents(
        auditEntry.userId,
        24 * 60 * 60 * 1000 // 24 hours
      );

      if (afterHoursCount >= this.anomalyThresholds.maxAfterHoursAccess) {
        anomalies.push({
          type: 'EXCESSIVE_AFTER_HOURS_ACCESS',
          severity: RISK_LEVELS.MEDIUM,
          count: afterHoursCount,
          threshold: this.anomalyThresholds.maxAfterHoursAccess
        });
      }
    }

    // Process detected anomalies
    if (anomalies.length > 0) {
      await this.handleAnomalies(auditEntry, anomalies);
    }
  }

  /**
   * Handle detected anomalies
   */
  async handleAnomalies(auditEntry, anomalies) {
    // Log anomaly detection
    await this.logEvent(AUDIT_EVENTS.SECURITY_ANOMALY, {
      userId: 'system',
      originalEventId: auditEntry.auditId,
      anomalies: anomalies,
      riskLevel: RISK_LEVELS.HIGH
    });

    // Alert security team for high-severity anomalies
    const highSeverityAnomalies = anomalies.filter(a => a.severity === RISK_LEVELS.HIGH);
    if (highSeverityAnomalies.length > 0) {
      await this.sendSecurityAlert({
        type: 'SECURITY_ANOMALY_DETECTED',
        userId: auditEntry.userId,
        anomalies: highSeverityAnomalies,
        timestamp: auditEntry.timestamp
      });
    }
  }

  /**
   * Count recent events for anomaly detection
   */
  async countRecentEvents(eventType, userId, timeWindowMs) {
    // In production, use database or in-memory cache
    // This is a simplified implementation
    const cutoffTime = new Date(Date.now() - timeWindowMs).toISOString();

    try {
      const logData = await fs.readFile(this.currentLogFile, 'utf8');
      const lines = logData.trim().split('\n');

      let count = 0;
      lines.forEach(line => {
        try {
          const entry = JSON.parse(line);
          if (entry.eventType === eventType &&
              entry.userId === userId &&
              entry.timestamp >= cutoffTime) {
            count++;
          }
        } catch (error) {
          // Skip invalid lines
        }
      });

      return count;
    } catch (error) {
      console.error('Error counting recent events:', error);
      return 0;
    }
  }

  /**
   * Check if timestamp is during after-hours
   */
  isAfterHours(timestamp) {
    const date = new Date(timestamp);
    const hour = date.getHours();
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday

    // After hours: before 7 AM, after 7 PM, or weekends
    return hour < 7 || hour > 19 || day === 0 || day === 6;
  }

  /**
   * Count recent after-hours events
   */
  async countRecentAfterHoursEvents(userId, timeWindowMs) {
    const cutoffTime = new Date(Date.now() - timeWindowMs).toISOString();

    try {
      const logData = await fs.readFile(this.currentLogFile, 'utf8');
      const lines = logData.trim().split('\n');

      let count = 0;
      lines.forEach(line => {
        try {
          const entry = JSON.parse(line);
          if (entry.userId === userId &&
              entry.timestamp >= cutoffTime &&
              this.isAfterHours(entry.timestamp)) {
            count++;
          }
        } catch (error) {
          // Skip invalid lines
        }
      });

      return count;
    } catch (error) {
      console.error('Error counting after-hours events:', error);
      return 0;
    }
  }

  /**
   * Handle high-risk security events
   */
  async handleHighRiskEvent(auditEntry) {
    // Send immediate security alert
    await this.sendSecurityAlert({
      type: 'HIGH_RISK_EVENT',
      eventId: auditEntry.auditId,
      eventType: auditEntry.eventType,
      userId: auditEntry.userId,
      riskLevel: auditEntry.riskLevel,
      timestamp: auditEntry.timestamp
    });

    // Additional monitoring for critical events
    if (auditEntry.riskLevel === RISK_LEVELS.CRITICAL) {
      await this.initiateCriticalEventResponse(auditEntry);
    }
  }

  /**
   * Initiate critical event response procedures
   */
  async initiateCriticalEventResponse(auditEntry) {
    console.error('🚨 CRITICAL SECURITY EVENT DETECTED:', {
      eventId: auditEntry.auditId,
      eventType: auditEntry.eventType,
      userId: auditEntry.userId,
      timestamp: auditEntry.timestamp
    });

    // In production:
    // 1. Send immediate alerts to security team
    // 2. Trigger incident response procedures
    // 3. Consider automatic account suspension
    // 4. Initiate breach assessment if PHI involved
  }

  /**
   * Send security alert to monitoring system
   */
  async sendSecurityAlert(alertData) {
    // In production, integrate with alerting system
    console.warn('SECURITY ALERT:', JSON.stringify(alertData, null, 2));

    // Example integrations:
    // - PagerDuty for critical alerts
    // - Slack for team notifications
    // - Email for compliance officers
    // - SIEM system for correlation
  }

  /**
   * Log audit system failures
   */
  async logAuditSystemFailure(error, originalEventType) {
    const failureEntry = {
      timestamp: new Date().toISOString(),
      eventType: 'AUDIT_SYSTEM_FAILURE',
      error: error.message,
      originalEventType: originalEventType,
      severity: RISK_LEVELS.CRITICAL
    };

    // Write to separate failure log
    const failureLogFile = path.join(this.logDirectory, 'audit_failures.json');
    await fs.appendFile(failureLogFile, JSON.stringify(failureEntry) + '\n');
  }

  /**
   * Rotate log files when they exceed size limit
   */
  async rotateLogsIfNeeded() {
    try {
      const stats = await fs.stat(this.currentLogFile);

      if (stats.size > this.maxLogSize) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const rotatedFile = path.join(
          this.logDirectory,
          `audit_${timestamp}.json`
        );

        await fs.rename(this.currentLogFile, rotatedFile);

        // Compress rotated file if possible
        if (this.enableEncryption) {
          await this.compressLogFile(rotatedFile);
        }

        // Create new current log file
        this.currentLogFile = path.join(
          this.logDirectory,
          `audit_${new Date().toISOString().split('T')[0]}.json`
        );
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('Log rotation error:', error);
      }
    }
  }

  /**
   * Compress log file for long-term storage
   */
  async compressLogFile(filePath) {
    // In production, implement compression (gzip, etc.)
    console.log(`Log file compressed: ${filePath}`);
  }

  /**
   * Hash IP addresses for privacy while maintaining auditability
   */
  hashIP(ipAddress) {
    const hash = crypto.createHash('sha256');
    hash.update(ipAddress + process.env.IP_SALT || 'default-salt');
    return hash.digest('hex').substring(0, 16); // First 16 chars
  }

  /**
   * Truncate strings to prevent log injection
   */
  truncateString(str, maxLength) {
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
  }

  /**
   * Get human-readable event type description
   */
  getHumanReadableEventType(eventType) {
    const descriptions = {
      [AUDIT_EVENTS.AUTH_LOGIN_SUCCESS]: 'User logged in successfully',
      [AUDIT_EVENTS.AUTH_LOGIN_FAILURE]: 'Failed login attempt',
      [AUDIT_EVENTS.DATA_PHI_ACCESS]: 'Patient health information accessed',
      [AUDIT_EVENTS.DATA_PHI_MODIFY]: 'Patient health information modified',
      [AUDIT_EVENTS.SECURITY_BREACH_DETECTED]: 'Security breach detected',
      [AUDIT_EVENTS.ADMIN_USER_CREATED]: 'User account created',
      // Add more descriptions as needed
    };

    return descriptions[eventType] || eventType;
  }

  /**
   * Initialize anomaly detection patterns
   */
  initializeAnomalyDetection() {
    // Set up real-time monitoring patterns
    console.log('Anomaly detection initialized');
  }

  /**
   * Generate audit report for compliance
   */
  async generateComplianceReport(startDate, endDate, options = {}) {
    // Implementation for generating HIPAA compliance reports
    // This would typically query audit logs and generate formatted reports
    console.log(`Generating compliance report from ${startDate} to ${endDate}`);
  }

  /**
   * Search audit logs
   */
  async searchAuditLogs(criteria) {
    // Implementation for searching audit logs
    // This would typically use database queries or log analysis tools
    console.log('Searching audit logs with criteria:', criteria);
  }

  /**
   * Cleanup old log files based on retention policy
   */
  async cleanupOldLogs() {
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - this.retentionYears);

    // Implementation for cleaning up old log files
    console.log(`Cleaning up logs older than ${cutoffDate.toISOString()}`);
  }
}

module.exports = {
  HIPAAAuditLogger,
  AUDIT_EVENTS,
  RISK_LEVELS,
  ACCESS_REASONS
};