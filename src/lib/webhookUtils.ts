// Enhanced webhook utilities with retry logic and fallback handling
// /src/lib/webhookUtils.ts

interface WebhookSubmissionData {
  [key: string]: any
  timestamp?: string
  source?: string
  attempt?: number
}

interface WebhookResponse {
  success: boolean
  message: string
  data?: any
}

interface RetryOptions {
  maxRetries: number
  baseDelay: number
  maxDelay: number
  backoffFactor: number
}

interface WebhookEndpoint {
  url: string
  name: string
  priority: number
  timeout: number
}

export class WebhookManager {
  private static instance: WebhookManager
  private endpoints: WebhookEndpoint[]
  private retryOptions: RetryOptions
  private healthCheckCache: Map<string, { healthy: boolean; lastChecked: number }>

  constructor() {
    this.endpoints = [
      {
        url: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '',
        name: 'primary',
        priority: 1,
        timeout: 10000
      },
      {
        url: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL_BACKUP || '',
        name: 'backup',
        priority: 2,
        timeout: 15000
      }
    ].filter(endpoint => endpoint.url) // Remove empty URLs

    this.retryOptions = {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffFactor: 2
    }

    this.healthCheckCache = new Map()
  }

  static getInstance(): WebhookManager {
    if (!WebhookManager.instance) {
      WebhookManager.instance = new WebhookManager()
    }
    return WebhookManager.instance
  }

  /**
   * Submit data with automatic retry and fallback logic
   */
  async submitWithFallback(
    data: WebhookSubmissionData,
    options?: Partial<RetryOptions>
  ): Promise<WebhookResponse> {
    const opts = { ...this.retryOptions, ...options }
    const enhancedData = {
      ...data,
      timestamp: data.timestamp || new Date().toISOString(),
      source: data.source || 'ignite-health-systems-website',
      attempt: 1
    }

    // Try each endpoint in priority order
    for (const endpoint of this.getHealthyEndpoints()) {
      try {
        const result = await this.submitToEndpointWithRetry(
          endpoint,
          enhancedData,
          opts
        )

        // Mark endpoint as healthy on success
        this.updateHealthStatus(endpoint.url, true)

        return result
      } catch (error) {
        console.warn(`Endpoint ${endpoint.name} failed:`, error)

        // Mark endpoint as unhealthy
        this.updateHealthStatus(endpoint.url, false)

        // Continue to next endpoint
        continue
      }
    }

    // All endpoints failed - queue for later retry
    await this.queueForRetry(enhancedData)

    throw new Error('All webhook endpoints failed. Your submission has been queued for retry.')
  }

  /**
   * Submit to a specific endpoint with retry logic
   */
  private async submitToEndpointWithRetry(
    endpoint: WebhookEndpoint,
    data: WebhookSubmissionData,
    options: RetryOptions
  ): Promise<WebhookResponse> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= options.maxRetries; attempt++) {
      try {
        const response = await this.makeRequest(endpoint, {
          ...data,
          attempt
        })

        if (response.ok) {
          const result = await response.json()
          return {
            success: true,
            message: result.message || 'Submission successful',
            data: result
          }
        } else {
          // Handle specific HTTP status codes
          const errorText = await response.text()

          if (response.status === 429) {
            // Rate limited - wait longer before retry
            const delay = Math.min(
              options.baseDelay * Math.pow(options.backoffFactor, attempt) * 2,
              options.maxDelay
            )
            await this.sleep(delay)
            continue
          } else if (response.status >= 500) {
            // Server error - retry
            throw new Error(`Server error: ${response.status} - ${errorText}`)
          } else {
            // Client error - don't retry
            throw new Error(`Client error: ${response.status} - ${errorText}`)
          }
        }
      } catch (error) {
        lastError = error as Error

        // Don't retry for certain error types
        if (this.isNonRetryableError(error)) {
          throw error
        }

        // Calculate delay with exponential backoff
        if (attempt < options.maxRetries) {
          const delay = Math.min(
            options.baseDelay * Math.pow(options.backoffFactor, attempt - 1),
            options.maxDelay
          )
          await this.sleep(delay)
        }
      }
    }

    throw lastError || new Error('Max retries exceeded')
  }

  /**
   * Make HTTP request with timeout
   */
  private async makeRequest(
    endpoint: WebhookEndpoint,
    data: WebhookSubmissionData
  ): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), endpoint.timeout)

    try {
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal
      })

      return response
    } finally {
      clearTimeout(timeoutId)
    }
  }

  /**
   * Get endpoints sorted by health and priority
   */
  private getHealthyEndpoints(): WebhookEndpoint[] {
    return this.endpoints
      .filter(endpoint => this.isEndpointHealthy(endpoint.url))
      .sort((a, b) => a.priority - b.priority)
  }

  /**
   * Check if endpoint is considered healthy
   */
  private isEndpointHealthy(url: string): boolean {
    const cached = this.healthCheckCache.get(url)
    if (!cached) return true // Assume healthy if never checked

    const cacheAge = Date.now() - cached.lastChecked
    const cacheExpiry = 5 * 60 * 1000 // 5 minutes

    if (cacheAge > cacheExpiry) {
      // Cache expired, assume healthy and let it be tested
      return true
    }

    return cached.healthy
  }

  /**
   * Update health status for an endpoint
   */
  private updateHealthStatus(url: string, healthy: boolean): void {
    this.healthCheckCache.set(url, {
      healthy,
      lastChecked: Date.now()
    })
  }

  /**
   * Queue failed submission for later retry
   */
  private async queueForRetry(data: WebhookSubmissionData): Promise<void> {
    try {
      const queueData = {
        data,
        timestamp: Date.now(),
        retryCount: 0,
        nextRetry: Date.now() + 60000 // Retry in 1 minute
      }

      // Store in localStorage for persistence across page reloads
      const existingQueue = this.getRetryQueue()
      existingQueue.push(queueData)

      localStorage.setItem('webhook_retry_queue', JSON.stringify(existingQueue))

      // Schedule background retry
      this.scheduleBackgroundRetry()

    } catch (error) {
      console.error('Failed to queue submission for retry:', error)
    }
  }

  /**
   * Get queued submissions from localStorage
   */
  private getRetryQueue(): any[] {
    try {
      const queueData = localStorage.getItem('webhook_retry_queue')
      return queueData ? JSON.parse(queueData) : []
    } catch {
      return []
    }
  }

  /**
   * Schedule background retry of queued submissions
   */
  private scheduleBackgroundRetry(): void {
    if (typeof window === 'undefined') return

    setTimeout(async () => {
      await this.processRetryQueue()
    }, 60000) // Process queue in 1 minute
  }

  /**
   * Process queued submissions
   */
  private async processRetryQueue(): Promise<void> {
    const queue = this.getRetryQueue()
    const now = Date.now()
    const remaining: any[] = []

    for (const item of queue) {
      if (now >= item.nextRetry && item.retryCount < 5) {
        try {
          await this.submitWithFallback(item.data)
          // Success - don't add back to queue
          console.log('Queued submission processed successfully')
        } catch (error) {
          // Failed - increment retry count and reschedule
          item.retryCount++
          item.nextRetry = now + (Math.pow(2, item.retryCount) * 60000) // Exponential backoff
          remaining.push(item)
        }
      } else if (item.retryCount < 5) {
        // Not time to retry yet
        remaining.push(item)
      }
      // Items with retryCount >= 5 are discarded
    }

    // Update localStorage with remaining items
    localStorage.setItem('webhook_retry_queue', JSON.stringify(remaining))

    // Schedule next processing if items remain
    if (remaining.length > 0) {
      this.scheduleBackgroundRetry()
    }
  }

  /**
   * Check if error should not be retried
   */
  private isNonRetryableError(error: any): boolean {
    if (error.name === 'AbortError') return false // Timeout - should retry
    if (error.message?.includes('Failed to fetch')) return false // Network - should retry
    if (error.message?.includes('Client error: 4')) return true // 4xx errors - don't retry
    return false
  }

  /**
   * Utility sleep function
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Health check for all endpoints
   */
  async healthCheck(): Promise<{ [endpoint: string]: boolean }> {
    const results: { [endpoint: string]: boolean } = {}

    await Promise.allSettled(
      this.endpoints.map(async endpoint => {
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000)

          const response = await fetch(endpoint.url, {
            method: 'HEAD',
            signal: controller.signal
          })

          clearTimeout(timeoutId)

          const healthy = response.status < 500
          results[endpoint.name] = healthy
          this.updateHealthStatus(endpoint.url, healthy)

        } catch (error) {
          results[endpoint.name] = false
          this.updateHealthStatus(endpoint.url, false)
        }
      })
    )

    return results
  }

  /**
   * Get health status summary
   */
  getHealthSummary(): {
    total: number
    healthy: number
    unhealthy: number
    endpoints: { name: string; healthy: boolean; url: string }[]
  } {
    const endpoints = this.endpoints.map(endpoint => ({
      name: endpoint.name,
      healthy: this.isEndpointHealthy(endpoint.url),
      url: endpoint.url
    }))

    return {
      total: endpoints.length,
      healthy: endpoints.filter(e => e.healthy).length,
      unhealthy: endpoints.filter(e => !e.healthy).length,
      endpoints
    }
  }
}

// Convenience functions for form components
export const webhookManager = WebhookManager.getInstance()

export async function submitFormData(
  data: WebhookSubmissionData
): Promise<WebhookResponse> {
  return webhookManager.submitWithFallback(data)
}

export async function performHealthCheck(): Promise<{ [endpoint: string]: boolean }> {
  return webhookManager.healthCheck()
}

export function getWebhookHealth() {
  return webhookManager.getHealthSummary()
}