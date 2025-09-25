/**
 * Security Middleware for Ignite Health Systems API
 * Implements rate limiting, CORS, security headers, and input validation
 */

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');
const DOMPurify = require('isomorphic-dompurify');

// Rate limiting configurations
const rateLimitConfigs = {
  general: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: {
      success: false,
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.',
      retryAfter: 60
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        message: 'Too many requests from this IP. Please try again later.',
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
      });
    }
  }),

  newsletter: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 newsletter subscriptions per hour
    keyGenerator: (req) => req.ip,
    message: {
      success: false,
      error: 'Rate limit exceeded',
      message: 'Too many newsletter subscription attempts. Please try again later.',
      retryAfter: 3600
    }
  }),

  formSubmission: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 form submissions per hour
    keyGenerator: (req) => req.ip,
    message: {
      success: false,
      error: 'Rate limit exceeded',
      message: 'Too many form submissions. Please try again later.',
      retryAfter: 3600
    }
  }),

  apiStats: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute for admin endpoints
    keyGenerator: (req) => req.ip,
    message: {
      success: false,
      error: 'Rate limit exceeded',
      message: 'Too many admin API requests. Please try again later.',
      retryAfter: 60
    }
  })
};

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://ignitehealthsystems.com',
      'https://www.ignitehealthsystems.com',
      'https://staging.ignitehealthsystems.com',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000'
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-API-Key'
  ],
  exposedHeaders: [
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset'
  ]
};

// Security headers configuration
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.mailchimp.com", "https://n8n.ruv.io"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
};

// Input sanitization functions
const sanitizeInput = {
  email: (email) => {
    if (!email || typeof email !== 'string') return '';
    const cleaned = email.toLowerCase().trim();
    return validator.isEmail(cleaned) ? cleaned : '';
  },

  name: (name) => {
    if (!name || typeof name !== 'string') return '';
    // Remove HTML tags and dangerous characters
    let cleaned = DOMPurify.sanitize(name.trim());
    // Remove special characters except spaces, hyphens, apostrophes
    cleaned = cleaned.replace(/[^a-zA-Z\s\-'\.]/g, '');
    return cleaned.substring(0, 100);
  },

  text: (text, maxLength = 1000) => {
    if (!text || typeof text !== 'string') return '';
    let cleaned = DOMPurify.sanitize(text.trim());
    return cleaned.substring(0, maxLength);
  },

  practiceModel: (model) => {
    const validModels = [
      'Solo Practice',
      'Group Practice',
      'Hospital Employment',
      'Academic Medical Center',
      'Locum Tenens',
      'Telemedicine',
      'Other'
    ];
    return validModels.includes(model) ? model : '';
  },

  boolean: (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'yes' || value.toLowerCase() === 'true';
    }
    return false;
  }
};

// Input validation middleware
const validateSubmission = (req, res, next) => {
  const errors = [];

  // Required field validation
  const requiredFields = ['fullName', 'email', 'specialty', 'practice', 'practiceModel', 'challenge'];

  requiredFields.forEach(field => {
    if (!req.body[field] || req.body[field].trim() === '') {
      errors.push({
        field,
        message: `${field} is required`
      });
    }
  });

  // Email validation
  if (req.body.email && !validator.isEmail(req.body.email)) {
    errors.push({
      field: 'email',
      message: 'Invalid email address format'
    });
  }

  // Challenge text length validation
  if (req.body.challenge && req.body.challenge.length < 10) {
    errors.push({
      field: 'challenge',
      message: 'Challenge description must be at least 10 characters'
    });
  }

  // Practice model validation
  if (req.body.practiceModel && !sanitizeInput.practiceModel(req.body.practiceModel)) {
    errors.push({
      field: 'practiceModel',
      message: 'Invalid practice model selected'
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Please correct the following errors',
      errors
    });
  }

  // Sanitize all inputs
  if (req.body.fullName) req.body.fullName = sanitizeInput.name(req.body.fullName);
  if (req.body.email) req.body.email = sanitizeInput.email(req.body.email);
  if (req.body.specialty) req.body.specialty = sanitizeInput.name(req.body.specialty);
  if (req.body.practice) req.body.practice = sanitizeInput.text(req.body.practice, 200);
  if (req.body.practiceModel) req.body.practiceModel = sanitizeInput.practiceModel(req.body.practiceModel);
  if (req.body.challenge) req.body.challenge = sanitizeInput.text(req.body.challenge, 1000);
  if (req.body.council) req.body.council = sanitizeInput.boolean(req.body.council);

  next();
};

// Newsletter validation middleware
const validateNewsletter = (req, res, next) => {
  const errors = [];

  // Required fields
  if (!req.body.email) {
    errors.push({
      field: 'email',
      message: 'Email is required'
    });
  }

  if (req.body.consent !== true) {
    errors.push({
      field: 'consent',
      message: 'GDPR consent is required for newsletter subscription'
    });
  }

  // Email validation
  if (req.body.email && !validator.isEmail(req.body.email)) {
    errors.push({
      field: 'email',
      message: 'Invalid email address format'
    });
  }

  // Check for suspicious email patterns
  if (req.body.email) {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /onload=/i,
      /onerror=/i
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(req.body.email))) {
      errors.push({
        field: 'email',
        message: 'Invalid email format'
      });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Please correct the following errors',
      errors
    });
  }

  // Sanitize inputs
  if (req.body.email) req.body.email = sanitizeInput.email(req.body.email);
  if (req.body.firstName) req.body.firstName = sanitizeInput.name(req.body.firstName);
  if (req.body.lastName) req.body.lastName = sanitizeInput.name(req.body.lastName);

  next();
};

// API key authentication middleware
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  const validApiKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'API key is required for this endpoint'
    });
  }

  if (!validApiKeys.includes(apiKey)) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'Invalid API key'
    });
  }

  next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      status: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('content-length')
    };

    // Log to console (replace with proper logging service in production)
    console.log(JSON.stringify(logData));
  });

  next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('API Error:', {
    timestamp: new Date().toISOString(),
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // Don't expose error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: 'An unexpected error occurred. Please try again later.',
    ...(isDevelopment && { details: err.message })
  });
};

module.exports = {
  rateLimitConfigs,
  corsOptions,
  helmetConfig,
  sanitizeInput,
  validateSubmission,
  validateNewsletter,
  authenticateApiKey,
  requestLogger,
  errorHandler
};