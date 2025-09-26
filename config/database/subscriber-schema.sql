-- Subscriber Management Database Schema for n8n Article Distribution
-- This schema supports subscriber segmentation, preferences, and distribution tracking

-- Main subscribers table
CREATE TABLE subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('physician', 'investor', 'specialist', 'general')),
    subscription_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subscription_source VARCHAR(100) DEFAULT 'website_form',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'bounced', 'unsubscribed')),

    -- Professional details
    specialty VARCHAR(100),
    practice_model VARCHAR(100),
    emr_system VARCHAR(100),
    involvement VARCHAR(200),
    challenge TEXT,
    cofounder_interest BOOLEAN DEFAULT FALSE,
    linkedin_url VARCHAR(255),

    -- Email preferences
    email_frequency VARCHAR(20) DEFAULT 'weekly' CHECK (email_frequency IN ('daily', 'weekly', 'monthly')),
    html_preference BOOLEAN DEFAULT TRUE,

    -- Tracking fields
    last_email_sent TIMESTAMP,
    total_emails_sent INTEGER DEFAULT 0,
    last_opened TIMESTAMP,
    total_opens INTEGER DEFAULT 0,
    last_clicked TIMESTAMP,
    total_clicks INTEGER DEFAULT 0,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Mailchimp integration
    mailchimp_id VARCHAR(100),
    mailchimp_status VARCHAR(20)
);

-- Subscriber preferences for content categories
CREATE TABLE subscriber_preferences (
    id SERIAL PRIMARY KEY,
    subscriber_id INTEGER REFERENCES subscribers(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    interested BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(subscriber_id, category)
);

-- Email campaigns table
CREATE TABLE email_campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content_type VARCHAR(20) DEFAULT 'article' CHECK (content_type IN ('article', 'newsletter', 'announcement', 'welcome')),
    template_id VARCHAR(100),

    -- Targeting
    target_segments TEXT[], -- Array of segments: ['physician', 'high-value']
    send_date TIMESTAMP,

    -- Content
    html_content TEXT,
    plain_content TEXT,

    -- Tracking
    total_recipients INTEGER DEFAULT 0,
    total_sent INTEGER DEFAULT 0,
    total_delivered INTEGER DEFAULT 0,
    total_opens INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    total_unsubscribes INTEGER DEFAULT 0,
    total_bounces INTEGER DEFAULT 0,

    -- Status
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email distribution log
CREATE TABLE email_distribution_log (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES email_campaigns(id) ON DELETE CASCADE,
    subscriber_id INTEGER REFERENCES subscribers(id) ON DELETE CASCADE,

    -- Distribution details
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_status VARCHAR(20) DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'bounced', 'failed')),

    -- Tracking
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    unsubscribed_at TIMESTAMP,

    -- Error handling
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    last_retry_at TIMESTAMP,

    -- External IDs
    mailchimp_campaign_id VARCHAR(100),
    message_id VARCHAR(255),

    UNIQUE(campaign_id, subscriber_id)
);

-- Subscriber segments for targeted distribution
CREATE TABLE subscriber_segments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    criteria JSONB, -- Store complex filtering criteria
    auto_update BOOLEAN DEFAULT TRUE, -- Whether segment updates automatically
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Junction table for subscriber-segment relationships
CREATE TABLE subscriber_segment_memberships (
    id SERIAL PRIMARY KEY,
    subscriber_id INTEGER REFERENCES subscribers(id) ON DELETE CASCADE,
    segment_id INTEGER REFERENCES subscriber_segments(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(subscriber_id, segment_id)
);

-- Unsubscribe tracking
CREATE TABLE unsubscribe_log (
    id SERIAL PRIMARY KEY,
    subscriber_id INTEGER REFERENCES subscribers(id) ON DELETE CASCADE,
    campaign_id INTEGER REFERENCES email_campaigns(id),
    unsubscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason VARCHAR(100),
    feedback TEXT
);

-- Indexes for performance
CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_status ON subscribers(status);
CREATE INDEX idx_subscribers_user_type ON subscribers(user_type);
CREATE INDEX idx_subscribers_subscription_date ON subscribers(subscription_date);
CREATE INDEX idx_email_distribution_log_campaign ON email_distribution_log(campaign_id);
CREATE INDEX idx_email_distribution_log_subscriber ON email_distribution_log(subscriber_id);
CREATE INDEX idx_email_distribution_log_sent_at ON email_distribution_log(sent_at);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscribers_updated_at BEFORE UPDATE ON subscribers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON email_campaigns FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_segments_updated_at BEFORE UPDATE ON subscriber_segments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert default segments
INSERT INTO subscriber_segments (name, description, criteria) VALUES
('physicians', 'All physicians', '{"user_type": "physician"}'),
('investors', 'All investors', '{"user_type": "investor"}'),
('specialists', 'All specialists', '{"user_type": "specialist"}'),
('cofounder_interest', 'Subscribers interested in co-founding', '{"cofounder_interest": true}'),
('high_engagement', 'High engagement subscribers', '{"total_opens": {"$gte": 5}, "total_clicks": {"$gte": 2}}'),
('new_subscribers', 'Recent subscribers (last 30 days)', '{"subscription_date": {"$gte": "30 days ago"}}');

-- Insert default preferences categories
INSERT INTO subscriber_preferences (subscriber_id, category, interested)
SELECT id, 'healthcare_technology', true FROM subscribers WHERE user_type = 'specialist'
ON CONFLICT DO NOTHING;

INSERT INTO subscriber_preferences (subscriber_id, category, interested)
SELECT id, 'practice_management', true FROM subscribers WHERE user_type = 'physician'
ON CONFLICT DO NOTHING;

INSERT INTO subscriber_preferences (subscriber_id, category, interested)
SELECT id, 'investment_opportunities', true FROM subscribers WHERE user_type = 'investor'
ON CONFLICT DO NOTHING;