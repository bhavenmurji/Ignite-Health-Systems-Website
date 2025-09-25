/**
 * HIPAA-Compliant Security Headers Configuration
 * Ignite Health Systems - Healthcare Security Implementation
 */

const crypto = require('crypto');

/**
 * Security Headers Middleware for Healthcare Compliance
 * Implements HIPAA Technical Safeguards and OWASP recommendations
 */
class SecurityHeaders {
  constructor(options = {}) {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.domain = process.env.NEXT_PUBLIC_SITE_URL || 'https://ignitehealthsystems.com';
    this.hipaaCompliant = process.env.NEXT_PUBLIC_HIPAA_COMPLIANT === 'true';
    this.cspNonce = crypto.randomBytes(16).toString('base64');

    // Configure CSP for healthcare applications
    this.cspDirectives = this.buildCSPDirectives(options.csp || {});
  }

  /**
   * Build Content Security Policy for healthcare applications
   * Stricter than standard web apps due to PHI protection requirements
   */
  buildCSPDirectives(customCSP = {}) {
    const baseDirectives = {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        `'nonce-${this.cspNonce}'`,
        // Only allow specific trusted CDNs for healthcare
        'https://cdnjs.cloudflare.com',
        'https://cdn.jsdelivr.net',
        // N8N webhook endpoint (healthcare automation)
        'https://bhavenmurji.app.n8n.cloud'
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'", // Required for Tailwind CSS
        'https://fonts.googleapis.com'
      ],
      'img-src': [
        "'self'",
        'data:',
        'https:', // Allow HTTPS images
        // Cloudflare image optimization
        'https://imagedelivery.net'
      ],
      'font-src': [
        "'self'",
        'https://fonts.gstatic.com'
      ],
      'connect-src': [
        "'self'",
        // Healthcare API endpoints
        'https://api.ignitehealthsystems.com',
        'https://bhavenmurji.app.n8n.cloud',
        // Analytics (privacy-compliant only)
        'https://analytics.google.com'
      ],
      'media-src': [
        "'self'",
        'data:'
      ],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': [
        "'self'",
        // N8N webhook for secure form submissions
        'https://bhavenmurji.app.n8n.cloud'
      ],
      'frame-ancestors': ["'none'"], // Prevent clickjacking
      'upgrade-insecure-requests': []
    };

    // Development environment adjustments
    if (this.isDevelopment) {
      baseDirectives['script-src'].push("'unsafe-eval'");
      baseDirectives['connect-src'].push('ws://localhost:*', 'http://localhost:*');
    }

    // Merge with custom CSP directives
    return Object.keys(baseDirectives).reduce((acc, directive) => {
      acc[directive] = [
        ...baseDirectives[directive],
        ...(customCSP[directive] || [])
      ];
      return acc;
    }, {});
  }

  /**
   * Generate CSP header string
   */
  getCSPHeader() {
    return Object.entries(this.cspDirectives)
      .map(([directive, sources]) => {
        const sourceList = sources.join(' ');
        return `${directive} ${sourceList}`;
      })
      .join('; ');
  }

  /**
   * HIPAA-compliant security headers
   * Based on OWASP Secure Headers Project and healthcare best practices
   */
  getSecurityHeaders() {
    const headers = {
      // Content Security Policy - Critical for PHI protection
      'Content-Security-Policy': this.getCSPHeader(),

      // Prevent MIME type confusion attacks
      'X-Content-Type-Options': 'nosniff',

      // XSS Protection (legacy but still useful)
      'X-XSS-Protection': '1; mode=block',

      // Prevent clickjacking attacks (critical for healthcare forms)
      'X-Frame-Options': 'DENY',

      // Control referrer information (protect patient privacy)
      'Referrer-Policy': 'strict-origin-when-cross-origin',

      // HTTPS Transport Security (1 year, include subdomains)
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

      // Permissions Policy (restrict powerful browser APIs)
      'Permissions-Policy': [
        'camera=(),',
        'microphone=(),',
        'geolocation=(),',
        'payment=(),',
        'usb=(),',
        'bluetooth=(),',
        'magnetometer=(),',
        'gyroscope=(),',
        'accelerometer=(),',
        'ambient-light-sensor=(),',
        'autoplay=()',
      ].join(' '),

      // Remove server information
      'Server': '',
      'X-Powered-By': '',

      // Cache control for sensitive pages
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',

      // Additional healthcare-specific headers
      'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet, notranslate, noimageindex',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin',

      // Custom healthcare compliance header
      'X-Healthcare-Mode': this.hipaaCompliant ? 'enabled' : 'disabled',
      'X-HIPAA-Compliant': this.hipaaCompliant ? 'true' : 'false'
    };

    // Additional development headers
    if (this.isDevelopment) {
      headers['X-Development-Mode'] = 'true';
      // Relax some restrictions for development
      headers['Cache-Control'] = 'no-cache';
    }

    return headers;
  }

  /**
   * Express.js middleware function
   */
  middleware() {
    return (req, res, next) => {
      const headers = this.getSecurityHeaders();

      // Apply all security headers
      Object.entries(headers).forEach(([name, value]) => {
        if (value) {
          res.setHeader(name, value);
        }
      });

      // Add CSP nonce to response locals for template access
      res.locals.cspNonce = this.cspNonce;

      next();
    };
  }

  /**
   * Next.js headers configuration
   */
  getNextJSHeaders() {
    const headers = this.getSecurityHeaders();

    return Object.entries(headers)
      .filter(([name, value]) => value) // Remove empty values
      .map(([name, value]) => ({
        key: name,
        value: value.toString()
      }));
  }

  /**
   * Validate request against security policy
   */
  validateRequest(req) {
    const violations = [];

    // Check for required headers
    const requiredHeaders = ['user-agent', 'accept'];
    requiredHeaders.forEach(header => {
      if (!req.headers[header]) {
        violations.push(`Missing required header: ${header}`);
      }
    });

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /(<script|javascript:|vbscript:|onload=)/i,
      /(union\s+select|drop\s+table|exec\s*\()/i,
      /(\.\.\/|\.\.\\|%2e%2e%2f)/i
    ];

    const userAgent = req.headers['user-agent'] || '';
    const referer = req.headers['referer'] || '';
    const queryString = req.url.split('?')[1] || '';

    suspiciousPatterns.forEach((pattern, index) => {
      if (pattern.test(userAgent) || pattern.test(referer) || pattern.test(queryString)) {
        violations.push(`Suspicious pattern detected: ${index + 1}`);
      }
    });

    // Rate limiting check (basic)
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (this.isRateLimited(clientIP)) {
      violations.push('Rate limit exceeded');
    }

    return {
      isValid: violations.length === 0,
      violations: violations
    };
  }

  /**
   * Basic rate limiting (in production, use Redis or similar)
   */
  isRateLimited(ip) {
    // In production, implement proper rate limiting
    // This is a placeholder implementation
    return false;
  }

  /**
   * Audit log security events
   */
  async logSecurityEvent(event, details) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: event,
      details: details,
      severity: this.getEventSeverity(event)
    };

    // In production, send to proper logging system
    if (logEntry.severity === 'HIGH' || logEntry.severity === 'CRITICAL') {
      console.error('SECURITY EVENT:', JSON.stringify(logEntry, null, 2));

      // Trigger alerts for critical events
      if (logEntry.severity === 'CRITICAL') {
        await this.triggerSecurityAlert(logEntry);
      }
    } else {
      console.info('Security Event:', JSON.stringify(logEntry, null, 2));
    }
  }

  getEventSeverity(event) {
    const severityMap = {
      'CSP_VIOLATION': 'MEDIUM',
      'SUSPICIOUS_REQUEST': 'HIGH',
      'RATE_LIMIT_EXCEEDED': 'MEDIUM',
      'AUTHENTICATION_FAILURE': 'HIGH',
      'UNAUTHORIZED_ACCESS': 'CRITICAL',
      'DATA_BREACH_DETECTED': 'CRITICAL'
    };

    return severityMap[event] || 'LOW';
  }

  async triggerSecurityAlert(logEntry) {
    // In production, integrate with incident response system
    console.error('🚨 CRITICAL SECURITY ALERT:', {
      event: logEntry.event,
      timestamp: logEntry.timestamp,
      severity: logEntry.severity
    });

    // Send to monitoring system (e.g., PagerDuty, Slack, etc.)
    // await this.sendAlert(logEntry);
  }
}

/**
 * Rate Limiting Middleware for Healthcare APIs
 */
class HealthcareRateLimit {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes
    this.max = options.max || 100; // requests per window
    this.skipSuccessfulRequests = options.skipSuccessfulRequests || false;
    this.skipFailedRequests = options.skipFailedRequests || false;
  }

  middleware() {
    // In production, use proper rate limiting store (Redis, etc.)
    const store = new Map();

    return (req, res, next) => {
      const key = this.generateKey(req);
      const now = Date.now();
      const windowStart = now - this.windowMs;

      // Clean old entries
      this.cleanupStore(store, windowStart);

      // Get current count
      const current = store.get(key) || { count: 0, resetTime: now + this.windowMs };

      if (current.count >= this.max) {
        // Rate limit exceeded
        const remainingTime = Math.ceil((current.resetTime - now) / 1000);

        res.status(429).json({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded for healthcare API',
          retryAfter: remainingTime
        });

        // Log rate limiting event
        console.warn('Rate limit exceeded:', {
          ip: this.getClientIP(req),
          endpoint: req.path,
          userAgent: req.headers['user-agent']
        });

        return;
      }

      // Increment counter
      current.count++;
      store.set(key, current);

      // Add rate limit headers
      res.setHeader('X-RateLimit-Limit', this.max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, this.max - current.count));
      res.setHeader('X-RateLimit-Reset', new Date(current.resetTime).toISOString());

      next();
    };
  }

  generateKey(req) {
    const ip = this.getClientIP(req);
    const userAgent = req.headers['user-agent'] || 'unknown';
    return `${ip}:${userAgent.substring(0, 50)}`; // Limit UA length
  }

  getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] ||
           req.headers['x-real-ip'] ||
           req.connection.remoteAddress ||
           'unknown';
  }

  cleanupStore(store, windowStart) {
    for (const [key, value] of store.entries()) {
      if (value.resetTime < windowStart) {
        store.delete(key);
      }
    }
  }
}

/**
 * Input Sanitization for Healthcare Forms
 */
class HealthcareInputSanitizer {
  static sanitizeInput(input, type = 'general') {
    if (!input || typeof input !== 'string') {
      return input;
    }

    let sanitized = input;

    // Remove potential XSS vectors
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=/gi, '');

    // Type-specific sanitization
    switch (type) {
      case 'email':
        sanitized = sanitized.toLowerCase().trim();
        break;
      case 'phone':
        sanitized = sanitized.replace(/[^\d\-\(\)\+\s\.]/g, '');
        break;
      case 'name':
        sanitized = sanitized.replace(/[^\w\s\-\.\']/g, '');
        break;
      case 'medical_id':
        sanitized = sanitized.replace(/[^\w\-]/g, '');
        break;
      case 'general':
      default:
        // Basic HTML entity encoding
        sanitized = sanitized
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;');
        break;
    }

    return sanitized.trim();
  }

  static validateHealthcareInput(input, rules = {}) {
    const errors = [];

    if (rules.required && (!input || input.trim().length === 0)) {
      errors.push('This field is required');
    }

    if (input && rules.maxLength && input.length > rules.maxLength) {
      errors.push(`Maximum length is ${rules.maxLength} characters`);
    }

    if (input && rules.minLength && input.length < rules.minLength) {
      errors.push(`Minimum length is ${rules.minLength} characters`);
    }

    if (input && rules.pattern && !rules.pattern.test(input)) {
      errors.push(rules.patternMessage || 'Invalid format');
    }

    // Healthcare-specific validations
    if (rules.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (input && !emailRegex.test(input)) {
        errors.push('Invalid email format');
      }
    }

    if (rules.type === 'phone') {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanPhone = input.replace(/[^\d\+]/g, '');
      if (input && !phoneRegex.test(cleanPhone)) {
        errors.push('Invalid phone number format');
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
}

module.exports = {
  SecurityHeaders,
  HealthcareRateLimit,
  HealthcareInputSanitizer
};