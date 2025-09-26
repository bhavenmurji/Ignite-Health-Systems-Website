/**
 * Newsletter API Integration Tests
 * Tests the Mailchimp integration with GDPR compliance and rate limiting
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { POST, GET, DELETE, OPTIONS } from '../../src/app/api/newsletter/route'
import { NextRequest } from 'next/server'

// Mock environment variables
const mockEnv = {
  MAILCHIMP_API_KEY: 'test-api-key',
  MAILCHIMP_AUDIENCE_ID: 'test-audience-id',
  MAILCHIMP_SERVER_PREFIX: 'us6'
}

// Mock fetch globally
global.fetch = jest.fn()

describe('/api/newsletter', () => {
  beforeEach(() => {
    // Reset environment variables
    Object.keys(mockEnv).forEach(key => {
      process.env[key] = mockEnv[key as keyof typeof mockEnv]
    })
    
    // Clear all mocks
    jest.clearAllMocks()
    
    // Mock successful Mailchimp response
    ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        id: 'test-member-id',
        email_address: 'test@example.com',
        status: 'subscribed'
      })
    } as Response)
  })

  describe('POST /api/newsletter', () => {
    it('should successfully subscribe a valid email with consent', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          firstName: 'John',
          consent: true,
          source: 'test'
        }),
        headers: {
          'content-type': 'application/json',
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.message).toContain('Successfully subscribed')
      expect(data.data.email).toBe('test@example.com')
    })

    it('should reject subscription without GDPR consent', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          firstName: 'John',
          consent: false
        }),
        headers: {
          'content-type': 'application/json',
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
      expect(data.message).toContain('GDPR consent is required')
    })

    it('should reject invalid email addresses', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email',
          consent: true
        }),
        headers: {
          'content-type': 'application/json',
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
      expect(data.message).toContain('Invalid email address')
    })

    it('should handle already subscribed emails', async () => {
      // Mock Mailchimp API response for existing member
      ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          title: 'Member Exists',
          detail: 'test@example.com is already a list member.'
        })
      } as Response)

      const request = new NextRequest('http://localhost:3000/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          consent: true
        }),
        headers: {
          'content-type': 'application/json',
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Already subscribed')
    })

    it('should implement rate limiting', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          consent: true
        }),
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': '192.168.1.1'
        }
      })

      // Make 6 requests from the same IP (limit is 5)
      for (let i = 0; i < 6; i++) {
        const response = await POST(request)
        
        if (i < 5) {
          expect(response.status).toBe(201)
        } else {
          // 6th request should be rate limited
          expect(response.status).toBe(429)
          const data = await response.json()
          expect(data.error).toBe('Rate limit exceeded')
        }
      }
    })

    it('should handle Mailchimp API failures gracefully', async () => {
      // Mock Mailchimp API failure
      ;(fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(
        new Error('Network error')
      )

      const request = new NextRequest('http://localhost:3000/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          consent: true
        }),
        headers: {
          'content-type': 'application/json',
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.error).toBe('Subscription failed')
    })
  })

  describe('GET /api/newsletter', () => {
    it('should return health status', async () => {
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('healthy')
      expect(data.service).toBe('newsletter-api')
      expect(data.mailchimp.configured).toBe(true)
      expect(data.mailchimp.url).toContain('eepurl.com')
    })
  })

  describe('DELETE /api/newsletter', () => {
    it('should successfully unsubscribe an email', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter?email=test@example.com', {
        method: 'DELETE'
      })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.email).toBe('test@example.com')
    })

    it('should require email parameter for unsubscribe', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter', {
        method: 'DELETE'
      })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Missing email')
    })
  })

  describe('OPTIONS /api/newsletter', () => {
    it('should handle CORS preflight requests', async () => {
      const response = await OPTIONS()

      expect(response.status).toBe(200)
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST')
    })
  })

  describe('Mailchimp Integration', () => {
    it('should format API request correctly', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          firstName: 'John',
          consent: true,
          source: 'test-source'
        }),
        headers: {
          'content-type': 'application/json',
        }
      })

      await POST(request)

      expect(fetch).toHaveBeenCalledWith(
        'https://us6.api.mailchimp.com/3.0/lists/test-audience-id/members',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'apikey test-api-key',
            'Content-Type': 'application/json',
          }),
          body: expect.stringContaining('test@example.com')
        })
      )
    })

    it('should fall back to direct integration when API keys not configured', async () => {
      // Remove API configuration
      delete process.env.MAILCHIMP_API_KEY
      delete process.env.MAILCHIMP_AUDIENCE_ID

      const request = new NextRequest('http://localhost:3000/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          consent: true
        }),
        headers: {
          'content-type': 'application/json',
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.data.method).toBe('direct')
    })
  })

  describe('Security Features', () => {
    it('should sanitize email input', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test+script<script>alert("xss")</script>@example.com',
          consent: true
        }),
        headers: {
          'content-type': 'application/json',
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid email')
    })

    it('should include security headers', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          consent: true
        }),
        headers: {
          'content-type': 'application/json',
        }
      })

      const response = await POST(request)

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe('POST')
      expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type')
    })
  })

  describe('Mobile Optimization', () => {
    it('should handle mobile user agents', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({
          email: 'mobile@example.com',
          consent: true
        }),
        headers: {
          'content-type': 'application/json',
          'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
    })

    it('should handle touch-friendly error responses', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email',
          consent: true
        }),
        headers: {
          'content-type': 'application/json',
          'user-agent': 'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toBeTruthy()
      expect(data.field).toBe('email')
    })
  })
})