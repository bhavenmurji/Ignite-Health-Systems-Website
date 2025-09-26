# Ignite Health Systems API Integration Guide

## Overview

This guide provides comprehensive information for integrating with the Ignite Health Systems API, including authentication, endpoints, security considerations, and best practices.

## Quick Start

### 1. Base URLs

- **Production**: `https://api.ignitehealthsystems.com`
- **Staging**: `https://staging-api.ignitehealthsystems.com`
- **Development**: `http://localhost:3001`

### 2. Authentication

Most endpoints are public, but administrative endpoints require API key authentication:

```javascript
// Include API key in headers for admin endpoints
const headers = {
  'Content-Type': 'application/json',
  'X-API-Key': 'your_api_key_here'
};
```

### 3. Rate Limits

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| General API | 100 requests | 1 minute |
| Newsletter | 5 requests | 1 hour |
| Form Submission | 10 requests | 1 hour |
| Admin Stats | 10 requests | 1 minute |

## API Endpoints

### Health Check

Check API status and health metrics.

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00Z",
  "version": "1.0.0",
  "uptime": 86400,
  "services": {
    "database": "healthy",
    "email": "healthy",
    "storage": "healthy"
  }
}
```

### Healthcare Professional Registration

Submit applications for healthcare professionals.

```http
POST /api/submit
Content-Type: multipart/form-data
```

**Required Fields:**
- `fullName` (string): Healthcare professional's full name
- `email` (string): Professional email address
- `specialty` (string): Medical specialty
- `practice` (string): Practice or healthcare organization name
- `practiceModel` (string): Type of practice model
- `challenge` (string): Primary healthcare challenge (min 10 chars)

**Optional Fields:**
- `council` (string): "yes" or "no" for Clinical Innovation Council interest
- `cv` (file): PDF CV/resume upload (max 10MB)

**Example (JavaScript):**
```javascript
const formData = new FormData();
formData.append('fullName', 'Dr. Sarah Johnson');
formData.append('email', 'sarah.johnson@example.com');
formData.append('specialty', 'Cardiology');
formData.append('practice', 'City Medical Center');
formData.append('practiceModel', 'Group Practice');
formData.append('council', 'yes');
formData.append('challenge', 'Electronic health records take too much time away from patient care');
// Optional: formData.append('cv', fileInput.files[0]);

const response = await fetch('/api/submit', {
  method: 'POST',
  body: formData
});

const result = await response.json();
```

**Success Response:**
```json
{
  "success": true,
  "message": "Thank you for joining the 10-Minute Revolution!",
  "submissionId": "1642176000000",
  "nextSteps": [
    "Check your email for confirmation details",
    "Expect follow-up within 24-48 hours",
    "Join our community updates for the latest news"
  ]
}
```

### Newsletter Management

#### Subscribe to Newsletter

```http
POST /api/newsletter
Content-Type: application/json
```

**Required Fields:**
- `email` (string): Subscriber's email address
- `consent` (boolean): GDPR consent (must be true)

**Optional Fields:**
- `firstName` (string): Subscriber's first name
- `lastName` (string): Subscriber's last name
- `role` (string): Professional role
- `source` (string): Subscription source
- `interests` (array): Areas of interest

**Example:**
```javascript
const response = await fetch('/api/newsletter', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'doctor@example.com',
    firstName: 'Sarah',
    role: 'physician',
    consent: true,
    source: 'website_footer',
    interests: ['AI_updates', 'case_studies']
  })
});
```

#### Unsubscribe from Newsletter

```http
DELETE /api/newsletter?email=doctor@example.com
```

#### Get Newsletter Status

```http
GET /api/newsletter
```

### Administrative Endpoints

#### Get Application Statistics

```http
GET /api/stats
X-API-Key: your_api_key
```

**Response:**
```json
{
  "total": 1250,
  "councilInterest": 750,
  "recentWeek": 45,
  "practiceModels": {
    "Group Practice": 450,
    "Hospital Employment": 320,
    "Solo Practice": 280
  },
  "specialties": {
    "Internal Medicine": 180,
    "Family Medicine": 150,
    "Cardiology": 120
  },
  "trends": {
    "conversionRate": "60.0",
    "avgChallengeLength": 245,
    "withCV": 890
  }
}
```

## Third-Party Integrations

### Available Integrations

1. **Mailchimp** - Newsletter management
2. **N8N Automation** - Workflow automation
3. **Google OAuth** - Authentication (planned)
4. **Gemini AI** - Chatbot functionality
5. **Telegram Bot** - Notifications

### Configuration

Set these environment variables for third-party integrations:

```bash
# Mailchimp
MAILCHIMP_API_KEY=your_mailchimp_api_key
MAILCHIMP_AUDIENCE_ID=your_audience_id

# N8N Automation
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/ignite-signup
N8N_API_KEY=your_n8n_api_key

# Google OAuth (planned)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Telegram
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

## Security & Best Practices

### Security Features

- **Rate Limiting**: Prevents abuse and ensures fair usage
- **Input Validation**: All inputs are validated and sanitized
- **CORS Protection**: Configured for specific allowed origins
- **Security Headers**: Helmet.js provides comprehensive security headers
- **File Upload Security**: PDF-only uploads with size limits
- **XSS Prevention**: DOMPurify sanitization
- **SQL Injection Protection**: Parameterized queries and input validation

### Best Practices

#### 1. Error Handling

Always handle errors gracefully:

```javascript
try {
  const response = await fetch('/api/submit', options);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Request failed');
  }

  const result = await response.json();
  // Handle success
} catch (error) {
  console.error('API Error:', error.message);
  // Show user-friendly error message
}
```

#### 2. Rate Limit Handling

Check for rate limit headers:

```javascript
const response = await fetch('/api/submit', options);

if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After');
  console.log(`Rate limited. Retry after ${retryAfter} seconds`);
}
```

#### 3. File Upload Validation

Validate files on the client side before upload:

```javascript
function validateFile(file) {
  // Check file type
  if (file.type !== 'application/pdf') {
    throw new Error('Only PDF files are allowed');
  }

  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size must be under 10MB');
  }

  return true;
}
```

#### 4. Input Sanitization

Sanitize user inputs:

```javascript
function sanitizeInput(input) {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .substring(0, 1000); // Limit length
}
```

## Testing

### Using Postman

1. Import the collection: `/docs/api-testing-collection.json`
2. Set environment variables:
   - `base_url`: API base URL
   - `api_key`: Your API key for admin endpoints
   - `test_email`: Email for testing

### Running Tests

```bash
# Install dependencies
npm install

# Run API tests
npm test

# Load testing
npm run load-test
```

### Test Scenarios

1. **Happy Path Testing**
   - Valid form submissions
   - Newsletter subscriptions
   - File uploads

2. **Error Handling**
   - Invalid inputs
   - Missing required fields
   - Rate limiting
   - Authentication failures

3. **Security Testing**
   - XSS attempts
   - SQL injection attempts
   - File upload validation
   - CORS violations

4. **Performance Testing**
   - Load testing
   - Concurrent requests
   - Large payload handling

## Monitoring & Logging

### Health Monitoring

Monitor the `/health` endpoint for:
- Service availability
- Response times
- Error rates
- Resource usage

### Logging

API requests are logged with:
- Timestamp
- HTTP method and URL
- IP address
- User agent
- Response status
- Duration

### Metrics to Monitor

1. **Request Metrics**
   - Total requests per minute
   - Success/error rates
   - Average response time

2. **Business Metrics**
   - Form submissions per day
   - Newsletter subscription rate
   - Council interest percentage

3. **System Metrics**
   - Memory usage
   - CPU utilization
   - Disk space
   - Error frequency

## Troubleshooting

### Common Issues

#### 1. CORS Errors
```
Access to fetch at 'API_URL' from origin 'ORIGIN' has been blocked by CORS policy
```

**Solution**: Ensure your domain is added to the CORS allowlist in the server configuration.

#### 2. Rate Limiting
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again later."
}
```

**Solution**: Implement exponential backoff and respect the `Retry-After` header.

#### 3. File Upload Errors
```json
{
  "error": "Only PDF files are allowed"
}
```

**Solution**: Validate file type and size on the client side before upload.

#### 4. Email Delivery Issues

Check environment variables:
- `EMAIL_USER` and `EMAIL_PASS` are set
- SMTP configuration is correct
- Email service is not blocking requests

### Debug Mode

Enable debug mode in development:

```bash
NODE_ENV=development DEBUG=ignite:* npm start
```

## Support

For API support and questions:

- **Email**: api-support@ignitehealthsystems.com
- **Documentation**: https://ignitehealthsystems.com/docs
- **Status Page**: https://status.ignitehealthsystems.com

## Changelog

### Version 1.0.0
- Initial API release
- Healthcare professional registration
- Newsletter management
- Administrative statistics
- Enhanced security middleware
- Comprehensive testing suite

---

*Last updated: January 15, 2025*