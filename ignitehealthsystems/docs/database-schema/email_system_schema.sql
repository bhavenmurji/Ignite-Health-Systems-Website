-- Email System Database Schema for Ignite Health Systems
-- This schema supports the complete email automation architecture

-- Users table - Core user information and subscription status
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('physician', 'investor')),
  note TEXT,
  subscription_status VARCHAR(50) DEFAULT 'active' CHECK (subscription_status IN ('active', 'welcome', 'newsletter', 'unsubscribed', 'bounced')),
  newsletter_subscribed BOOLEAN DEFAULT TRUE,
  welcome_email_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_email_sent TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT,
  source VARCHAR(100) DEFAULT 'website_signup',

  -- Indexes for performance
  CONSTRAINT users_email_key UNIQUE (email)
);

-- Create indexes for common queries
CREATE INDEX idx_users_subscription_status ON users(subscription_status);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_newsletter_subscribed ON users(newsletter_subscribed);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_last_email_sent ON users(last_email_sent);

-- Email campaigns table - Track different email campaigns
CREATE TABLE email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL CHECK (type IN ('welcome', 'newsletter', 'announcement', 'reactivation')),
  subject VARCHAR(255) NOT NULL,
  content TEXT,
  template_version VARCHAR(50),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scheduled_for TIMESTAMP WITH TIME ZONE,
  recipient_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  bounced_count INTEGER DEFAULT 0,
  unsubscribed_count INTEGER DEFAULT 0,
  open_rate DECIMAL(5,2) DEFAULT 0.00,
  click_rate DECIMAL(5,2) DEFAULT 0.00,
  bounce_rate DECIMAL(5,2) DEFAULT 0.00,
  unsubscribe_rate DECIMAL(5,2) DEFAULT 0.00,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255),

  -- AI content generation metadata
  ai_generated_content JSONB,
  personalization_data JSONB
);

-- Create indexes for campaign queries
CREATE INDEX idx_email_campaigns_type ON email_campaigns(type);
CREATE INDEX idx_email_campaigns_sent_at ON email_campaigns(sent_at);
CREATE INDEX idx_email_campaigns_status ON email_campaigns(status);

-- Email deliveries table - Track individual email deliveries
CREATE TABLE email_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES email_campaigns(id) ON DELETE CASCADE,
  email_address VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'unsubscribed')),
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  bounced_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  tracking_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,

  -- Personalization tracking
  personalized_content JSONB,
  ai_generated_intro TEXT,

  CONSTRAINT fk_email_deliveries_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_email_deliveries_campaign FOREIGN KEY (campaign_id) REFERENCES email_campaigns(id)
);

-- Create indexes for delivery tracking
CREATE INDEX idx_email_deliveries_user_id ON email_deliveries(user_id);
CREATE INDEX idx_email_deliveries_campaign_id ON email_deliveries(campaign_id);
CREATE INDEX idx_email_deliveries_status ON email_deliveries(status);
CREATE INDEX idx_email_deliveries_sent_at ON email_deliveries(sent_at);
CREATE INDEX idx_email_deliveries_tracking_id ON email_deliveries(tracking_id);

-- Email templates table - Store email templates and versions
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('welcome_physician', 'welcome_investor', 'newsletter', 'reactivation', 'unsubscribe_confirmation')),
  version VARCHAR(50) NOT NULL,
  subject_template TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255),

  -- Template variables and configuration
  template_variables JSONB,
  ai_sections JSONB, -- Define which sections use AI generation

  CONSTRAINT unique_active_template UNIQUE (type, is_active) DEFERRABLE INITIALLY DEFERRED
);

-- Create indexes for template queries
CREATE INDEX idx_email_templates_type ON email_templates(type);
CREATE INDEX idx_email_templates_is_active ON email_templates(is_active);

-- Email preferences table - Store detailed user preferences
CREATE TABLE email_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  newsletter_frequency VARCHAR(50) DEFAULT 'monthly' CHECK (newsletter_frequency IN ('never', 'weekly', 'monthly', 'quarterly')),
  welcome_emails BOOLEAN DEFAULT TRUE,
  announcement_emails BOOLEAN DEFAULT TRUE,
  marketing_emails BOOLEAN DEFAULT TRUE,
  preferred_content_type VARCHAR(50) DEFAULT 'both' CHECK (preferred_content_type IN ('html', 'text', 'both')),
  timezone VARCHAR(100) DEFAULT 'UTC',
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT fk_email_preferences_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT unique_user_preferences UNIQUE (user_id)
);

-- Unsubscribe tokens table - Manage secure unsubscribe links
CREATE TABLE unsubscribe_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,

  CONSTRAINT fk_unsubscribe_tokens_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for token management
CREATE INDEX idx_unsubscribe_tokens_token ON unsubscribe_tokens(token);
CREATE INDEX idx_unsubscribe_tokens_expires_at ON unsubscribe_tokens(expires_at);
CREATE INDEX idx_unsubscribe_tokens_user_id ON unsubscribe_tokens(user_id);

-- Email analytics table - Store aggregated analytics data
CREATE TABLE email_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  campaign_type VARCHAR(50),
  user_role VARCHAR(50),
  total_sent INTEGER DEFAULT 0,
  total_delivered INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  total_bounced INTEGER DEFAULT 0,
  total_unsubscribed INTEGER DEFAULT 0,
  avg_open_rate DECIMAL(5,2) DEFAULT 0.00,
  avg_click_rate DECIMAL(5,2) DEFAULT 0.00,
  avg_bounce_rate DECIMAL(5,2) DEFAULT 0.00,
  avg_unsubscribe_rate DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_daily_analytics UNIQUE (date, campaign_type, user_role)
);

-- Create indexes for analytics queries
CREATE INDEX idx_email_analytics_date ON email_analytics(date);
CREATE INDEX idx_email_analytics_campaign_type ON email_analytics(campaign_type);
CREATE INDEX idx_email_analytics_user_role ON email_analytics(user_role);

-- AI content cache table - Cache AI-generated content for reuse
CREATE TABLE ai_content_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key VARCHAR(255) UNIQUE NOT NULL,
  user_role VARCHAR(50) NOT NULL,
  prompt_hash VARCHAR(64) NOT NULL,
  generated_content TEXT NOT NULL,
  metadata JSONB,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,

  -- Index for efficient lookups
  CONSTRAINT unique_content_key UNIQUE (content_key)
);

-- Create indexes for AI content cache
CREATE INDEX idx_ai_content_cache_content_key ON ai_content_cache(content_key);
CREATE INDEX idx_ai_content_cache_user_role ON ai_content_cache(user_role);
CREATE INDEX idx_ai_content_cache_expires_at ON ai_content_cache(expires_at);

-- Email bounce handling table - Track and manage bounced emails
CREATE TABLE email_bounces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_address VARCHAR(255) NOT NULL,
  bounce_type VARCHAR(50) NOT NULL CHECK (bounce_type IN ('hard', 'soft', 'complaint')),
  bounce_reason TEXT,
  first_bounce_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_bounce_at TIMESTAMP WITH TIME ZONE NOT NULL,
  bounce_count INTEGER DEFAULT 1,
  is_suppressed BOOLEAN DEFAULT FALSE,
  suppressed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_email_bounce UNIQUE (email_address)
);

-- Create indexes for bounce management
CREATE INDEX idx_email_bounces_email_address ON email_bounces(email_address);
CREATE INDEX idx_email_bounces_bounce_type ON email_bounces(bounce_type);
CREATE INDEX idx_email_bounces_is_suppressed ON email_bounces(is_suppressed);

-- Webhook logs table - Track all webhook events from email service
CREATE TABLE webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_type VARCHAR(50) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processing_status VARCHAR(50) DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processed', 'failed', 'ignored')),
  error_message TEXT,

  -- Email tracking fields
  email_address VARCHAR(255),
  delivery_id UUID,
  campaign_id UUID,

  CONSTRAINT fk_webhook_logs_delivery FOREIGN KEY (delivery_id) REFERENCES email_deliveries(id),
  CONSTRAINT fk_webhook_logs_campaign FOREIGN KEY (campaign_id) REFERENCES email_campaigns(id)
);

-- Create indexes for webhook processing
CREATE INDEX idx_webhook_logs_webhook_type ON webhook_logs(webhook_type);
CREATE INDEX idx_webhook_logs_event_type ON webhook_logs(event_type);
CREATE INDEX idx_webhook_logs_processed_at ON webhook_logs(processed_at);
CREATE INDEX idx_webhook_logs_processing_status ON webhook_logs(processing_status);
CREATE INDEX idx_webhook_logs_delivery_id ON webhook_logs(delivery_id);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_preferences_updated_at BEFORE UPDATE ON email_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically update campaign metrics
CREATE OR REPLACE FUNCTION update_campaign_metrics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update campaign statistics when delivery status changes
    UPDATE email_campaigns
    SET
        delivered_count = (
            SELECT COUNT(*) FROM email_deliveries
            WHERE campaign_id = NEW.campaign_id AND status IN ('delivered', 'opened', 'clicked')
        ),
        opened_count = (
            SELECT COUNT(*) FROM email_deliveries
            WHERE campaign_id = NEW.campaign_id AND status IN ('opened', 'clicked')
        ),
        clicked_count = (
            SELECT COUNT(*) FROM email_deliveries
            WHERE campaign_id = NEW.campaign_id AND status = 'clicked'
        ),
        bounced_count = (
            SELECT COUNT(*) FROM email_deliveries
            WHERE campaign_id = NEW.campaign_id AND status = 'bounced'
        ),
        unsubscribed_count = (
            SELECT COUNT(*) FROM email_deliveries
            WHERE campaign_id = NEW.campaign_id AND status = 'unsubscribed'
        )
    WHERE id = NEW.campaign_id;

    -- Update calculated rates
    UPDATE email_campaigns
    SET
        open_rate = CASE WHEN delivered_count > 0 THEN (opened_count::DECIMAL / delivered_count::DECIMAL) * 100 ELSE 0 END,
        click_rate = CASE WHEN delivered_count > 0 THEN (clicked_count::DECIMAL / delivered_count::DECIMAL) * 100 ELSE 0 END,
        bounce_rate = CASE WHEN recipient_count > 0 THEN (bounced_count::DECIMAL / recipient_count::DECIMAL) * 100 ELSE 0 END,
        unsubscribe_rate = CASE WHEN delivered_count > 0 THEN (unsubscribed_count::DECIMAL / delivered_count::DECIMAL) * 100 ELSE 0 END
    WHERE id = NEW.campaign_id;

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update campaign metrics
CREATE TRIGGER update_campaign_metrics_trigger
    AFTER INSERT OR UPDATE ON email_deliveries
    FOR EACH ROW EXECUTE FUNCTION update_campaign_metrics();

-- Insert default email templates
INSERT INTO email_templates (name, type, version, subject_template, html_content, is_active, template_variables, ai_sections) VALUES
('Welcome Email - Physician', 'welcome_physician', '1.0', 'Welcome to Ignite Health Systems - {{userName}}',
 '<!-- Template content will be loaded from the HTML files -->',
 TRUE,
 '{"userName": "string", "personalizedIntro": "string", "unsubscribeUrl": "string"}',
 '{"personalizedIntro": {"prompt": "physician_welcome", "required": true}}'
),
('Welcome Email - Investor', 'welcome_investor', '1.0', 'Welcome to Ignite Health Systems - {{userName}}',
 '<!-- Template content will be loaded from the HTML files -->',
 TRUE,
 '{"userName": "string", "personalizedIntro": "string", "unsubscribeUrl": "string"}',
 '{"personalizedIntro": {"prompt": "investor_welcome", "required": true}}'
),
('Monthly Newsletter', 'newsletter', '1.0', 'Healthcare Innovation Insights - {{currentMonth}} (Issue #{{issueNumber}})',
 '<!-- Newsletter template content -->',
 TRUE,
 '{"currentMonth": "string", "issueNumber": "number", "featuredArticle": "object", "roleSpecificContent": "string"}',
 '{"featuredArticle": {"prompt": "newsletter_content", "required": true}, "roleSpecificContent": {"prompt": "role_specific", "required": true}}'
);

-- Create view for user analytics
CREATE VIEW user_engagement_summary AS
SELECT
    u.id,
    u.email,
    u.name,
    u.role,
    u.subscription_status,
    u.created_at,
    u.last_email_sent,
    COUNT(ed.id) as total_emails_received,
    COUNT(CASE WHEN ed.status = 'opened' THEN 1 END) as emails_opened,
    COUNT(CASE WHEN ed.status = 'clicked' THEN 1 END) as emails_clicked,
    CASE
        WHEN COUNT(ed.id) > 0 THEN
            ROUND((COUNT(CASE WHEN ed.status = 'opened' THEN 1 END)::DECIMAL / COUNT(ed.id)::DECIMAL) * 100, 2)
        ELSE 0
    END as open_rate,
    CASE
        WHEN COUNT(ed.id) > 0 THEN
            ROUND((COUNT(CASE WHEN ed.status = 'clicked' THEN 1 END)::DECIMAL / COUNT(ed.id)::DECIMAL) * 100, 2)
        ELSE 0
    END as click_rate
FROM users u
LEFT JOIN email_deliveries ed ON u.id = ed.user_id
GROUP BY u.id, u.email, u.name, u.role, u.subscription_status, u.created_at, u.last_email_sent;

-- Create view for campaign performance
CREATE VIEW campaign_performance_summary AS
SELECT
    ec.id,
    ec.type,
    ec.subject,
    ec.sent_at,
    ec.recipient_count,
    ec.delivered_count,
    ec.opened_count,
    ec.clicked_count,
    ec.bounced_count,
    ec.unsubscribed_count,
    ec.open_rate,
    ec.click_rate,
    ec.bounce_rate,
    ec.unsubscribe_rate,
    CASE
        WHEN ec.delivered_count > 0 THEN
            ROUND((ec.delivered_count::DECIMAL / ec.recipient_count::DECIMAL) * 100, 2)
        ELSE 0
    END as delivery_rate
FROM email_campaigns ec
WHERE ec.status = 'sent'
ORDER BY ec.sent_at DESC;

-- Create cleanup procedures for old data
CREATE OR REPLACE FUNCTION cleanup_old_data(retention_days INTEGER DEFAULT 365)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
    cutoff_date TIMESTAMP WITH TIME ZONE;
BEGIN
    cutoff_date := NOW() - INTERVAL '1 day' * retention_days;

    -- Clean up old webhook logs
    DELETE FROM webhook_logs WHERE processed_at < cutoff_date;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;

    -- Clean up expired unsubscribe tokens
    DELETE FROM unsubscribe_tokens WHERE expires_at < NOW();

    -- Clean up expired AI content cache
    DELETE FROM ai_content_cache WHERE expires_at < NOW();

    RETURN deleted_count;
END;
$$ language 'plpgsql';

-- Add comments for documentation
COMMENT ON TABLE users IS 'Core user information and subscription preferences';
COMMENT ON TABLE email_campaigns IS 'Email campaign definitions and aggregate metrics';
COMMENT ON TABLE email_deliveries IS 'Individual email delivery tracking and status';
COMMENT ON TABLE email_templates IS 'Email template storage with versioning support';
COMMENT ON TABLE email_preferences IS 'Detailed user email preferences and settings';
COMMENT ON TABLE unsubscribe_tokens IS 'Secure token management for unsubscribe links';
COMMENT ON TABLE email_analytics IS 'Aggregated email performance analytics by date';
COMMENT ON TABLE ai_content_cache IS 'Cached AI-generated content for performance optimization';
COMMENT ON TABLE email_bounces IS 'Email bounce tracking and suppression management';
COMMENT ON TABLE webhook_logs IS 'Email service provider webhook event logging';

COMMENT ON FUNCTION update_campaign_metrics() IS 'Automatically updates campaign performance metrics when delivery status changes';
COMMENT ON FUNCTION cleanup_old_data(INTEGER) IS 'Removes old data based on retention policy';

-- Grant appropriate permissions (adjust based on your user setup)
-- GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO email_service_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO email_service_user;