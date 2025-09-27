# Email Automation Implementation Guide - Ignite Health Systems

## Phase 1: Foundation Setup (Week 1-2)

### 1.1 Environment Configuration

#### N8N Setup
1. **Access N8N Instance**
   ```bash
   # Access your N8N instance at https://bhavenmurji.app.n8n.cloud
   # Login with your credentials
   ```

2. **Configure Environment Variables in N8N**
   ```javascript
   // Add these environment variables in N8N settings
   N8N_WEBHOOK_URL=https://bhavenmurji.app.n8n.cloud/webhook/ignite-contact-form
   OPENAI_API_KEY=your_openai_api_key
   SMTP_HOST=smtp.gmail.com (or your email provider)
   SMTP_PORT=587
   SMTP_USER=your_email@domain.com
   SMTP_PASS=your_app_password
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

3. **Import Workflows**
   ```bash
   # Import the provided JSON workflow files into N8N:
   # - welcome-email-workflow.json
   # - monthly-newsletter-workflow.json
   # - subscription-management-workflow.json
   ```

### 1.2 Database Setup

1. **Create Database Schema**
   ```sql
   -- Execute the provided schema file
   psql -d your_database -f docs/database-schema/email_system_schema.sql
   ```

2. **Verify Schema Installation**
   ```sql
   -- Check that all tables are created
   \dt

   -- Verify indexes
   \di

   -- Test with sample data
   INSERT INTO users (email, name, role) VALUES
   ('bhavenmurji@gmail.com', 'Dr. Bhaven Murji', 'physician'),
   ('bhavenmurji@icloud.com', 'Bhaven Murji', 'investor');
   ```

### 1.3 API Route Updates

1. **Update Environment Variable**
   ```bash
   # In your .env.local file
   N8N_WEBHOOK_URL=https://bhavenmurji.app.n8n.cloud/webhook/ignite-contact-form
   ```

2. **Test API Integration**
   ```bash
   # Test the signup API
   curl -X POST http://localhost:3000/api/subscribe \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "role": "physician",
       "note": "Test signup"
     }'
   ```

## Phase 2: AI Integration (Week 3-4)

### 2.1 OpenAI Configuration

1. **Set up OpenAI API Key in N8N**
   ```javascript
   // In N8N, create OpenAI credential
   {
     "apiKey": "your_openai_api_key"
   }
   ```

2. **Test AI Content Generation**
   ```javascript
   // Test prompt for physician welcome
   const physicianPrompt = `Generate a personalized welcome message for Dr. ${name}, a healthcare professional interested in medical innovation. Focus on:
   - Clinical applications and patient outcomes
   - Evidence-based research and studies
   - Professional development opportunities
   - Integration with existing practice workflows
   Keep tone professional, scientific, and respectful of medical expertise. Maximum 2 paragraphs.`;
   ```

### 2.2 Content Templates

1. **Configure AI Prompt Templates**
   ```sql
   -- Insert AI prompt templates into database
   INSERT INTO ai_content_cache (content_key, user_role, prompt_hash, generated_content)
   VALUES ('welcome_physician_template', 'physician', 'hash123', 'template content');
   ```

2. **Test Personalization Engine**
   ```bash
   # Create test workflow execution in N8N
   # Verify AI content generation works for both roles
   ```

## Phase 3: Newsletter Automation (Week 5-6)

### 3.1 Monthly Trigger Setup

1. **Configure Cron Schedule**
   ```javascript
   // N8N Cron expression for 1st of month at 9:00 AM
   0 9 1 * *
   ```

2. **Content Generation Workflow**
   ```javascript
   // AI prompt for newsletter content
   const newsletterPrompt = `Create a comprehensive monthly newsletter for ${currentMonth} (Issue #${issueNumber}) for Ignite Health Systems. Include:

   1. Featured Article: A significant healthcare innovation (300-400 words)
   2. Podcast Highlights: 2-3 episodes with summaries (150 words each)
   3. Industry Updates: 3-4 brief news items (75 words each)
   4. Investment Spotlight: Promising healthcare startup (200 words)
   5. Clinical Research Highlight: Recent study (200 words)

   Format as JSON with keys: featuredArticle, podcastHighlights, industryUpdates, investmentSpotlight, clinicalResearch.`;
   ```

### 3.2 Subscriber Management

1. **Query Active Subscribers**
   ```sql
   SELECT * FROM users
   WHERE subscription_status IN ('active', 'newsletter')
   AND newsletter_subscribed = true;
   ```

2. **Batch Email Processing**
   ```javascript
   // Configure batch size in N8N Split node
   batchSize: 10  // Send 10 emails per batch with 2-second delays
   ```

## Phase 4: Advanced Features (Week 7-8)

### 4.1 Subscription Management

1. **Unsubscribe Token Generation**
   ```sql
   -- Create secure unsubscribe tokens
   INSERT INTO unsubscribe_tokens (user_id, token, expires_at)
   VALUES ($1, $2, NOW() + INTERVAL '30 days');
   ```

2. **Preference Center Setup**
   ```html
   <!-- Implement preference center form -->
   <form action="/api/update-preferences" method="POST">
     <!-- User preference controls -->
   </form>
   ```

### 4.2 Analytics Implementation

1. **Email Tracking Setup**
   ```sql
   -- Track email deliveries
   INSERT INTO email_deliveries (user_id, campaign_id, status, sent_at)
   VALUES ($1, $2, 'sent', NOW());
   ```

2. **Performance Monitoring**
   ```sql
   -- Campaign performance view
   SELECT * FROM campaign_performance_summary
   WHERE sent_at >= DATE_TRUNC('month', NOW());
   ```

## Testing Protocols

### Test Email Addresses
- **Physician Role**: bhavenmurji@gmail.com
- **Investor Role**: bhavenmurji@icloud.com

### Test Scenarios

#### 1. Welcome Email Flow
```bash
# Test physician signup
curl -X POST https://your-domain.com/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Test Physician",
    "email": "bhavenmurji@gmail.com",
    "role": "physician",
    "note": "Test physician signup"
  }'

# Test investor signup
curl -X POST https://your-domain.com/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Investor",
    "email": "bhavenmurji@icloud.com",
    "role": "investor",
    "note": "Test investor signup"
  }'
```

#### 2. Newsletter Automation
```sql
-- Trigger manual newsletter test
UPDATE email_campaigns
SET scheduled_for = NOW() + INTERVAL '1 minute'
WHERE type = 'newsletter' AND status = 'draft';
```

#### 3. Unsubscribe Flow
```bash
# Test unsubscribe link
curl "https://bhavenmurji.app.n8n.cloud/webhook/unsubscribe?token=user123-timestamp"

# Test preferences page
curl "https://bhavenmurji.app.n8n.cloud/webhook/preferences?token=user123-timestamp"
```

#### 4. Resubscribe Flow
```bash
# Test resubscribe
curl -X POST "https://bhavenmurji.app.n8n.cloud/webhook/resubscribe" \
  -H "Content-Type: application/json" \
  -d '{"email": "bhavenmurji@gmail.com"}'
```

### Expected Results

#### Welcome Email Verification
- [ ] Physician receives personalized clinical-focused welcome
- [ ] Investor receives personalized business-focused welcome
- [ ] Both emails include role-specific CTAs
- [ ] Unsubscribe links work correctly
- [ ] Database records updated properly

#### Newsletter Verification
- [ ] Monthly automation triggers correctly
- [ ] AI generates relevant content
- [ ] Role-specific content included
- [ ] Batch processing works without errors
- [ ] Analytics tracking functions properly

#### Subscription Management Verification
- [ ] Unsubscribe links process correctly
- [ ] Preference center displays user data
- [ ] Resubscribe functionality works
- [ ] Database updates reflect changes

## Performance Optimization

### 1. Database Indexing
```sql
-- Verify essential indexes exist
\d+ users
\d+ email_deliveries
\d+ email_campaigns

-- Check query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE subscription_status = 'active';
```

### 2. Email Delivery Optimization
```javascript
// N8N batch configuration
{
  batchSize: 10,        // Process 10 emails per batch
  batchInterval: 2000   // 2-second delay between batches
}
```

### 3. AI Content Caching
```sql
-- Implement content caching
INSERT INTO ai_content_cache (content_key, user_role, generated_content, expires_at)
VALUES ('welcome_physician_generic', 'physician', 'cached content', NOW() + INTERVAL '7 days');
```

## Security Considerations

### 1. Token Security
```javascript
// Generate secure unsubscribe tokens
const token = crypto.randomBytes(32).toString('hex');
const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
```

### 2. Email Validation
```javascript
// Implement strict email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValid = emailRegex.test(email);
```

### 3. Rate Limiting
```javascript
// Implement rate limiting in N8N workflows
{
  maxExecutions: 100,  // Maximum executions per hour
  throttle: true
}
```

## Monitoring and Alerts

### 1. Email Delivery Monitoring
```sql
-- Daily delivery rate check
SELECT
  DATE(sent_at) as date,
  COUNT(*) as total_sent,
  COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered,
  ROUND(COUNT(CASE WHEN status = 'delivered' THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL * 100, 2) as delivery_rate
FROM email_deliveries
WHERE sent_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(sent_at)
ORDER BY date DESC;
```

### 2. Bounce Rate Monitoring
```sql
-- Check bounce rates
SELECT
  DATE(created_at) as date,
  bounce_type,
  COUNT(*) as bounce_count
FROM email_bounces
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), bounce_type
ORDER BY date DESC;
```

### 3. Performance Alerts
```javascript
// Set up N8N monitoring webhooks
{
  webhook: "https://your-monitoring-service.com/alert",
  triggers: {
    bounceRate: "> 5%",
    deliveryRate: "< 95%",
    openRate: "< 15%"
  }
}
```

## Troubleshooting

### Common Issues

#### 1. Webhook Not Triggering
```bash
# Check N8N webhook URL
curl -X POST https://bhavenmurji.app.n8n.cloud/webhook/ignite-contact-form \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# Verify webhook ID matches in workflow
```

#### 2. AI Content Generation Fails
```javascript
// Check OpenAI API quota and key
// Verify prompt length < 4000 characters
// Check for rate limiting
```

#### 3. Email Delivery Issues
```sql
-- Check email delivery status
SELECT status, COUNT(*)
FROM email_deliveries
WHERE sent_at >= NOW() - INTERVAL '24 hours'
GROUP BY status;

-- Check for bounced emails
SELECT * FROM email_bounces WHERE created_at >= NOW() - INTERVAL '24 hours';
```

#### 4. Database Connection Issues
```sql
-- Test database connectivity
SELECT NOW();

-- Check connection pooling
SHOW max_connections;
```

## Maintenance Schedule

### Daily
- [ ] Monitor email delivery rates
- [ ] Check for bounced emails
- [ ] Review error logs

### Weekly
- [ ] Analyze campaign performance
- [ ] Update AI content templates
- [ ] Clean up old webhook logs

### Monthly
- [ ] Review subscription metrics
- [ ] Update newsletter templates
- [ ] Performance optimization review
- [ ] Security audit

### Quarterly
- [ ] Database maintenance
- [ ] Content strategy review
- [ ] Technology stack updates
- [ ] Compliance review

## Success Metrics

### Key Performance Indicators
- **Delivery Rate**: > 95%
- **Open Rate**: > 20% (welcome), > 15% (newsletter)
- **Click Rate**: > 5%
- **Unsubscribe Rate**: < 2%
- **Bounce Rate**: < 3%

### Business Metrics
- **Subscriber Growth**: Track monthly growth rate
- **Engagement Trends**: Monitor open/click trends over time
- **Conversion Rates**: Track from email to website actions
- **Content Performance**: Compare AI vs manual content performance

This implementation guide provides a complete roadmap for deploying the Ignite Health Systems email automation architecture. Follow each phase systematically and verify each component before proceeding to the next phase.