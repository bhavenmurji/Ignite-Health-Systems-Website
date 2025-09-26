// Comprehensive audit logging system for workflow operations
// /src/lib/auditLogger.ts

export interface AuditLogEntry {
  id: string
  timestamp: string
  eventType: AuditEventType
  category: AuditCategory
  userId?: string
  sessionId?: string
  ipAddress?: string
  userAgent?: string
  details: Record<string, any>
  metadata?: {
    formType?: string
    userType?: string
    endpoint?: string
    duration?: number
    success?: boolean
    errorCode?: string
    retryAttempt?: number
  }
}

export enum AuditEventType {
  FORM_SUBMISSION = 'form_submission',
  WEBHOOK_CALL = 'webhook_call',
  API_REQUEST = 'api_request',
  VALIDATION_ERROR = 'validation_error',
  SYSTEM_ERROR = 'system_error',
  AUTHENTICATION = 'authentication',
  HEALTH_CHECK = 'health_check',
  DATA_PROCESSING = 'data_processing',
  NOTIFICATION_SENT = 'notification_sent',
  RETRY_ATTEMPT = 'retry_attempt',
  FALLBACK_TRIGGERED = 'fallback_triggered',
  QUEUE_OPERATION = 'queue_operation'
}

export enum AuditCategory {
  FORM_INTERACTION = 'form_interaction',
  WEBHOOK_MANAGEMENT = 'webhook_management',
  THIRD_PARTY_INTEGRATION = 'third_party_integration',
  ERROR_HANDLING = 'error_handling',
  SYSTEM_MONITORING = 'system_monitoring',
  DATA_VALIDATION = 'data_validation',
  SECURITY = 'security',
  PERFORMANCE = 'performance'
}

export class AuditLogger {
  private static instance: AuditLogger
  private logBuffer: AuditLogEntry[] = []
  private maxBufferSize = 100
  private flushInterval = 30000 // 30 seconds
  private enableConsoleLogging = process.env.NODE_ENV !== 'production'

  constructor() {
    this.startPeriodicFlush()
  }

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger()
    }
    return AuditLogger.instance
  }

  /**
   * Log a form submission attempt
   */
  async logFormSubmission(details: {
    formType: string
    userType: string
    email: string
    success: boolean
    duration: number
    errorMessage?: string
    validationErrors?: string[]
  }): Promise<void> {
    await this.log({
      eventType: AuditEventType.FORM_SUBMISSION,
      category: AuditCategory.FORM_INTERACTION,
      details: {
        formType: details.formType,
        userType: details.userType,
        email: this.hashEmail(details.email),
        errorMessage: details.errorMessage,
        validationErrors: details.validationErrors
      },
      metadata: {
        formType: details.formType,
        userType: details.userType,
        duration: details.duration,
        success: details.success
      }
    })
  }

  /**
   * Log webhook call attempt
   */
  async logWebhookCall(details: {
    endpoint: string
    method: string
    success: boolean
    duration: number
    statusCode: number
    retryAttempt?: number
    errorMessage?: string
    requestSize?: number
    responseSize?: number
  }): Promise<void> {
    await this.log({
      eventType: AuditEventType.WEBHOOK_CALL,
      category: AuditCategory.WEBHOOK_MANAGEMENT,
      details: {
        endpoint: this.sanitizeUrl(details.endpoint),
        method: details.method,
        statusCode: details.statusCode,
        requestSize: details.requestSize,
        responseSize: details.responseSize,
        errorMessage: details.errorMessage
      },
      metadata: {
        endpoint: this.sanitizeUrl(details.endpoint),
        duration: details.duration,
        success: details.success,
        retryAttempt: details.retryAttempt
      }
    })
  }

  /**
   * Log third-party integration events
   */
  async logIntegration(details: {
    service: string
    operation: string
    success: boolean
    duration: number
    errorMessage?: string
    recordsProcessed?: number
  }): Promise<void> {
    await this.log({
      eventType: AuditEventType.DATA_PROCESSING,
      category: AuditCategory.THIRD_PARTY_INTEGRATION,
      details: {
        service: details.service,
        operation: details.operation,
        recordsProcessed: details.recordsProcessed,
        errorMessage: details.errorMessage
      },
      metadata: {
        duration: details.duration,
        success: details.success
      }
    })
  }

  /**
   * Log validation errors
   */
  async logValidationError(details: {
    formType: string
    field: string
    value: any
    rule: string
    message: string
    userType?: string
  }): Promise<void> {
    await this.log({
      eventType: AuditEventType.VALIDATION_ERROR,
      category: AuditCategory.DATA_VALIDATION,
      details: {
        formType: details.formType,
        field: details.field,
        value: this.sanitizeValue(details.value),
        rule: details.rule,
        message: details.message
      },
      metadata: {
        formType: details.formType,
        userType: details.userType
      }
    })
  }

  /**
   * Log system errors
   */
  async logSystemError(details: {
    error: Error
    context: string
    additionalInfo?: Record<string, any>
    severity?: 'low' | 'medium' | 'high' | 'critical'
  }): Promise<void> {
    await this.log({
      eventType: AuditEventType.SYSTEM_ERROR,
      category: AuditCategory.ERROR_HANDLING,
      details: {
        errorName: details.error.name,
        errorMessage: details.error.message,
        errorStack: details.error.stack,
        context: details.context,
        severity: details.severity || 'medium',
        additionalInfo: details.additionalInfo
      }
    })
  }

  /**
   * Log health check results
   */
  async logHealthCheck(details: {
    endpoint: string
    healthy: boolean
    responseTime: number
    errorMessage?: string
  }): Promise<void> {
    await this.log({
      eventType: AuditEventType.HEALTH_CHECK,
      category: AuditCategory.SYSTEM_MONITORING,
      details: {
        endpoint: this.sanitizeUrl(details.endpoint),
        responseTime: details.responseTime,
        errorMessage: details.errorMessage
      },
      metadata: {
        success: details.healthy,
        duration: details.responseTime
      }
    })
  }

  /**
   * Log notification sending
   */
  async logNotification(details: {
    type: string
    recipient: string
    success: boolean
    service: string
    messageId?: string
    errorMessage?: string
  }): Promise<void> {
    await this.log({
      eventType: AuditEventType.NOTIFICATION_SENT,
      category: AuditCategory.THIRD_PARTY_INTEGRATION,
      details: {
        type: details.type,
        recipient: this.hashEmail(details.recipient),
        service: details.service,
        messageId: details.messageId,
        errorMessage: details.errorMessage
      },
      metadata: {
        success: details.success
      }
    })
  }

  /**
   * Log retry attempts
   */
  async logRetryAttempt(details: {
    operation: string
    attempt: number
    maxAttempts: number
    delay: number
    reason: string
  }): Promise<void> {
    await this.log({
      eventType: AuditEventType.RETRY_ATTEMPT,
      category: AuditCategory.ERROR_HANDLING,
      details: {
        operation: details.operation,
        attempt: details.attempt,
        maxAttempts: details.maxAttempts,
        delay: details.delay,
        reason: details.reason
      },
      metadata: {
        retryAttempt: details.attempt
      }
    })
  }

  /**
   * Log fallback system activation
   */
  async logFallback(details: {
    primaryEndpoint: string
    fallbackEndpoint: string
    reason: string
    success: boolean
  }): Promise<void> {
    await this.log({
      eventType: AuditEventType.FALLBACK_TRIGGERED,
      category: AuditCategory.ERROR_HANDLING,
      details: {
        primaryEndpoint: this.sanitizeUrl(details.primaryEndpoint),
        fallbackEndpoint: this.sanitizeUrl(details.fallbackEndpoint),
        reason: details.reason
      },
      metadata: {
        success: details.success
      }
    })
  }

  /**
   * Log queue operations
   */
  async logQueueOperation(details: {
    operation: 'enqueue' | 'dequeue' | 'process' | 'clear'
    queueSize: number
    itemId?: string
    success: boolean
    errorMessage?: string
  }): Promise<void> {
    await this.log({
      eventType: AuditEventType.QUEUE_OPERATION,
      category: AuditCategory.SYSTEM_MONITORING,
      details: {
        operation: details.operation,
        queueSize: details.queueSize,
        itemId: details.itemId,
        errorMessage: details.errorMessage
      },
      metadata: {
        success: details.success
      }
    })
  }

  /**
   * Core logging method
   */
  private async log(entry: Partial<AuditLogEntry>): Promise<void> {
    const fullEntry: AuditLogEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      ipAddress: await this.getClientIP(),
      userAgent: this.getUserAgent(),
      ...entry
    } as AuditLogEntry

    // Add to buffer
    this.logBuffer.push(fullEntry)

    // Console logging for development
    if (this.enableConsoleLogging) {
      console.log('[AUDIT]', fullEntry)
    }

    // Flush if buffer is full
    if (this.logBuffer.length >= this.maxBufferSize) {
      await this.flushLogs()
    }
  }

  /**
   * Flush buffered logs to persistent storage
   */
  private async flushLogs(): Promise<void> {
    if (this.logBuffer.length === 0) return

    const logsToFlush = [...this.logBuffer]
    this.logBuffer = []

    try {
      // Send to analytics/logging service
      await this.sendToLoggingService(logsToFlush)

      // Store locally for backup
      this.storeLogsLocally(logsToFlush)

    } catch (error) {
      console.error('Failed to flush audit logs:', error)
      // Return logs to buffer for retry
      this.logBuffer.unshift(...logsToFlush)
    }
  }

  /**
   * Send logs to external service
   */
  private async sendToLoggingService(logs: AuditLogEntry[]): Promise<void> {
    // In production, send to your logging service (DataDog, LogRocket, etc.)
    // For now, we'll just use console in development

    if (process.env.NODE_ENV === 'development') {
      console.log('[AUDIT FLUSH]', logs.length, 'entries')
      return
    }

    // Example implementation for production logging service
    /*
    const response = await fetch('/api/audit-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ logs })
    })

    if (!response.ok) {
      throw new Error(`Failed to send logs: ${response.statusText}`)
    }
    */
  }

  /**
   * Store logs in localStorage as backup
   */
  private storeLogsLocally(logs: AuditLogEntry[]): void {
    try {
      const existingLogs = this.getLocalLogs()
      const allLogs = [...existingLogs, ...logs]

      // Keep only last 500 entries to prevent localStorage bloat
      const recentLogs = allLogs.slice(-500)

      localStorage.setItem('audit_logs', JSON.stringify(recentLogs))
    } catch (error) {
      console.error('Failed to store audit logs locally:', error)
    }
  }

  /**
   * Get logs from localStorage
   */
  private getLocalLogs(): AuditLogEntry[] {
    try {
      const stored = localStorage.getItem('audit_logs')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  /**
   * Start periodic log flushing
   */
  private startPeriodicFlush(): void {
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.flushLogs()
      }, this.flushInterval)
    }
  }

  /**
   * Utility methods
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private getSessionId(): string {
    if (typeof window === 'undefined') return 'server'

    let sessionId = sessionStorage.getItem('audit_session_id')
    if (!sessionId) {
      sessionId = this.generateId()
      sessionStorage.setItem('audit_session_id', sessionId)
    }
    return sessionId
  }

  private async getClientIP(): Promise<string> {
    try {
      if (typeof window === 'undefined') return 'server'

      // In a real implementation, you might get IP from a service
      return 'client'
    } catch {
      return 'unknown'
    }
  }

  private getUserAgent(): string {
    if (typeof window === 'undefined') return 'server'
    return navigator.userAgent
  }

  private hashEmail(email: string): string {
    // Simple hash for privacy - in production use a proper hash function
    return email.split('@')[0].replace(/./g, '*') + '@' + email.split('@')[1]
  }

  private sanitizeUrl(url: string): string {
    try {
      const urlObj = new URL(url)
      return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`
    } catch {
      return 'invalid-url'
    }
  }

  private sanitizeValue(value: any): any {
    if (typeof value === 'string' && value.includes('@')) {
      return this.hashEmail(value)
    }
    if (typeof value === 'string' && value.length > 100) {
      return value.substr(0, 100) + '...'
    }
    return value
  }

  /**
   * Public method to get audit statistics
   */
  getAuditStats(): {
    totalLogs: number
    recentErrors: number
    avgResponseTime: number
    healthScore: number
  } {
    const logs = this.getLocalLogs()
    const recentLogs = logs.filter(log =>
      Date.now() - new Date(log.timestamp).getTime() < 24 * 60 * 60 * 1000 // Last 24 hours
    )

    const errors = recentLogs.filter(log =>
      log.eventType === AuditEventType.SYSTEM_ERROR ||
      log.eventType === AuditEventType.VALIDATION_ERROR ||
      log.metadata?.success === false
    )

    const avgResponseTime = recentLogs
      .filter(log => log.metadata?.duration)
      .reduce((sum, log) => sum + (log.metadata?.duration || 0), 0) /
      Math.max(1, recentLogs.filter(log => log.metadata?.duration).length)

    const successRate = recentLogs.length > 0 ?
      (recentLogs.filter(log => log.metadata?.success !== false).length / recentLogs.length) : 1

    return {
      totalLogs: logs.length,
      recentErrors: errors.length,
      avgResponseTime: Math.round(avgResponseTime),
      healthScore: Math.round(successRate * 100)
    }
  }

  /**
   * Export logs for analysis
   */
  exportLogs(options?: {
    startDate?: string
    endDate?: string
    eventTypes?: AuditEventType[]
    categories?: AuditCategory[]
  }): AuditLogEntry[] {
    let logs = this.getLocalLogs()

    if (options?.startDate) {
      const start = new Date(options.startDate)
      logs = logs.filter(log => new Date(log.timestamp) >= start)
    }

    if (options?.endDate) {
      const end = new Date(options.endDate)
      logs = logs.filter(log => new Date(log.timestamp) <= end)
    }

    if (options?.eventTypes?.length) {
      logs = logs.filter(log => options.eventTypes!.includes(log.eventType))
    }

    if (options?.categories?.length) {
      logs = logs.filter(log => options.categories!.includes(log.category))
    }

    return logs
  }
}

// Export singleton instance
export const auditLogger = AuditLogger.getInstance()

// Convenience functions
export const logFormSubmission = (details: Parameters<AuditLogger['logFormSubmission']>[0]) =>
  auditLogger.logFormSubmission(details)

export const logWebhookCall = (details: Parameters<AuditLogger['logWebhookCall']>[0]) =>
  auditLogger.logWebhookCall(details)

export const logSystemError = (details: Parameters<AuditLogger['logSystemError']>[0]) =>
  auditLogger.logSystemError(details)

export const logHealthCheck = (details: Parameters<AuditLogger['logHealthCheck']>[0]) =>
  auditLogger.logHealthCheck(details)