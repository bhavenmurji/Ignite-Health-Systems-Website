/**
 * Subscriber Data Management Module for n8n
 * Handles subscriber CRUD operations and data synchronization
 * Use this in n8n Function nodes for subscriber management
 */

class SubscriberDataManager {
    constructor(dbConnection, mailchimpAPI) {
        this.db = dbConnection;
        this.mailchimp = mailchimpAPI;
        this.audienceId = process.env.MAILCHIMP_AUDIENCE_ID || '9884a65adf';
    }

    /**
     * Add or update subscriber with validation and deduplication
     * @param {Object} subscriberData - Subscriber information
     * @returns {Object} - Result with subscriber ID and status
     */
    async addOrUpdateSubscriber(subscriberData) {
        try {
            const {
                email,
                firstName,
                lastName,
                userType,
                specialty,
                practiceModel,
                emrSystem,
                involvement,
                challenge,
                cofounderInterest,
                linkedinUrl,
                source = 'n8n_workflow'
            } = subscriberData;

            // Validate required fields
            if (!email || !userType) {
                throw new Error('Email and userType are required fields');
            }

            // Check if subscriber exists
            const existingSubscriber = await this.db.query(
                'SELECT id, status FROM subscribers WHERE email = $1',
                [email.toLowerCase()]
            );

            let subscriberId;
            let isNew = false;

            if (existingSubscriber.rows.length > 0) {
                // Update existing subscriber
                subscriberId = existingSubscriber.rows[0].id;

                await this.db.query(`
                    UPDATE subscribers SET
                        first_name = $2,
                        last_name = $3,
                        user_type = $4,
                        specialty = $5,
                        practice_model = $6,
                        emr_system = $7,
                        involvement = $8,
                        challenge = $9,
                        cofounder_interest = $10,
                        linkedin_url = $11,
                        status = CASE WHEN status = 'unsubscribed' THEN 'active' ELSE status END,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = $1
                `, [
                    subscriberId, firstName, lastName, userType,
                    specialty, practiceModel, emrSystem, involvement,
                    challenge, cofounderInterest, linkedinUrl
                ]);

            } else {
                // Insert new subscriber
                const insertResult = await this.db.query(`
                    INSERT INTO subscribers (
                        email, first_name, last_name, user_type, specialty,
                        practice_model, emr_system, involvement, challenge,
                        cofounder_interest, linkedin_url, subscription_source
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                    RETURNING id
                `, [
                    email.toLowerCase(), firstName, lastName, userType,
                    specialty, practiceModel, emrSystem, involvement,
                    challenge, cofounderInterest, linkedinUrl, source
                ]);

                subscriberId = insertResult.rows[0].id;
                isNew = true;
            }

            // Add to appropriate segments
            await this.updateSegmentMemberships(subscriberId, userType, cofounderInterest);

            // Sync with Mailchimp
            await this.syncToMailchimp(subscriberData);

            return {
                success: true,
                subscriberId,
                isNew,
                email,
                userType,
                segments: await this.getSubscriberSegments(subscriberId)
            };

        } catch (error) {
            console.error('Error managing subscriber:', error);
            return {
                success: false,
                error: error.message,
                email: subscriberData.email
            };
        }
    }

    /**
     * Update segment memberships based on subscriber attributes
     * @param {number} subscriberId - Subscriber ID
     * @param {string} userType - User type
     * @param {boolean} cofounderInterest - Co-founder interest flag
     */
    async updateSegmentMemberships(subscriberId, userType, cofounderInterest) {
        // Get relevant segment IDs
        const segments = await this.db.query(`
            SELECT id, name FROM subscriber_segments
            WHERE name IN ('physicians', 'investors', 'specialists', 'cofounder_interest')
        `);

        const segmentMap = {};
        segments.rows.forEach(seg => {
            segmentMap[seg.name] = seg.id;
        });

        // Remove existing memberships to update them
        await this.db.query(
            'DELETE FROM subscriber_segment_memberships WHERE subscriber_id = $1',
            [subscriberId]
        );

        // Add to user type segment
        if (segmentMap[userType + 's']) {
            await this.db.query(`
                INSERT INTO subscriber_segment_memberships (subscriber_id, segment_id)
                VALUES ($1, $2) ON CONFLICT DO NOTHING
            `, [subscriberId, segmentMap[userType + 's']]);
        }

        // Add to co-founder interest segment if applicable
        if (cofounderInterest && segmentMap['cofounder_interest']) {
            await this.db.query(`
                INSERT INTO subscriber_segment_memberships (subscriber_id, segment_id)
                VALUES ($1, $2) ON CONFLICT DO NOTHING
            `, [subscriberId, segmentMap['cofounder_interest']]);
        }
    }

    /**
     * Sync subscriber data to Mailchimp
     * @param {Object} subscriberData - Subscriber information
     */
    async syncToMailchimp(subscriberData) {
        try {
            const mergeFields = {
                FNAME: subscriberData.firstName || '',
                LNAME: subscriberData.lastName || '',
                USERTYPE: subscriberData.userType || '',
                SPECIALTY: subscriberData.specialty || '',
                PRACTICE: subscriberData.practiceModel || '',
                EMR: subscriberData.emrSystem || '',
                CHALLENGE: subscriberData.challenge || '',
                COFOUNDER: subscriberData.cofounderInterest ? 'Yes' : 'No',
                LINKEDIN: subscriberData.linkedinUrl || ''
            };

            const tags = [
                subscriberData.userType,
                subscriberData.cofounderInterest ? 'cofounder-interest' : 'standard'
            ];

            const memberData = {
                email_address: subscriberData.email.toLowerCase(),
                status: 'subscribed',
                merge_fields: mergeFields,
                tags: tags.filter(tag => tag)
            };

            // Use Mailchimp API (this would be configured in n8n)
            const response = await this.mailchimp.request({
                method: 'POST',
                path: `/lists/${this.audienceId}/members`,
                body: memberData
            });

            return response;

        } catch (error) {
            // Handle Mailchimp errors gracefully
            if (error.status === 400 && error.detail.includes('already a list member')) {
                // Update existing member
                return await this.updateMailchimpMember(subscriberData);
            }
            throw error;
        }
    }

    /**
     * Update existing Mailchimp member
     * @param {Object} subscriberData - Subscriber information
     */
    async updateMailchimpMember(subscriberData) {
        const subscriberHash = this.md5(subscriberData.email.toLowerCase());

        const mergeFields = {
            FNAME: subscriberData.firstName || '',
            LNAME: subscriberData.lastName || '',
            USERTYPE: subscriberData.userType || '',
            SPECIALTY: subscriberData.specialty || '',
            PRACTICE: subscriberData.practiceModel || '',
            EMR: subscriberData.emrSystem || '',
            CHALLENGE: subscriberData.challenge || '',
            COFOUNDER: subscriberData.cofounderInterest ? 'Yes' : 'No',
            LINKEDIN: subscriberData.linkedinUrl || ''
        };

        return await this.mailchimp.request({
            method: 'PATCH',
            path: `/lists/${this.audienceId}/members/${subscriberHash}`,
            body: {
                merge_fields: mergeFields,
                status: 'subscribed'
            }
        });
    }

    /**
     * Get subscriber segments
     * @param {number} subscriberId - Subscriber ID
     * @returns {Array} - List of segment names
     */
    async getSubscriberSegments(subscriberId) {
        const result = await this.db.query(`
            SELECT s.name
            FROM subscriber_segments s
            JOIN subscriber_segment_memberships m ON s.id = m.segment_id
            WHERE m.subscriber_id = $1
        `, [subscriberId]);

        return result.rows.map(row => row.name);
    }

    /**
     * Get subscribers for distribution based on segments
     * @param {Array} segments - Target segments
     * @param {number} limit - Batch size limit
     * @param {number} offset - Offset for pagination
     * @returns {Array} - List of subscribers
     */
    async getSubscribersForDistribution(segments, limit = 100, offset = 0) {
        const query = `
            SELECT DISTINCT s.id, s.email, s.first_name, s.last_name, s.user_type,
                   s.email_frequency, s.html_preference, s.last_email_sent
            FROM subscribers s
            JOIN subscriber_segment_memberships m ON s.id = m.subscriber_id
            JOIN subscriber_segments seg ON m.segment_id = seg.id
            WHERE s.status = 'active'
              AND seg.name = ANY($1)
            ORDER BY s.subscription_date DESC
            LIMIT $2 OFFSET $3
        `;

        const result = await this.db.query(query, [segments, limit, offset]);
        return result.rows;
    }

    /**
     * Update subscriber email preferences
     * @param {string} email - Subscriber email
     * @param {Object} preferences - Preference updates
     */
    async updatePreferences(email, preferences) {
        const {
            emailFrequency,
            htmlPreference,
            categories
        } = preferences;

        // Update main preferences
        if (emailFrequency || htmlPreference !== undefined) {
            await this.db.query(`
                UPDATE subscribers SET
                    email_frequency = COALESCE($2, email_frequency),
                    html_preference = COALESCE($3, html_preference),
                    updated_at = CURRENT_TIMESTAMP
                WHERE email = $1
            `, [email.toLowerCase(), emailFrequency, htmlPreference]);
        }

        // Update category preferences
        if (categories) {
            const subscriber = await this.db.query(
                'SELECT id FROM subscribers WHERE email = $1',
                [email.toLowerCase()]
            );

            if (subscriber.rows.length > 0) {
                const subscriberId = subscriber.rows[0].id;

                for (const [category, interested] of Object.entries(categories)) {
                    await this.db.query(`
                        INSERT INTO subscriber_preferences (subscriber_id, category, interested)
                        VALUES ($1, $2, $3)
                        ON CONFLICT (subscriber_id, category)
                        DO UPDATE SET interested = $3
                    `, [subscriberId, category, interested]);
                }
            }
        }
    }

    /**
     * Unsubscribe user with reason tracking
     * @param {string} email - Subscriber email
     * @param {string} reason - Unsubscribe reason
     * @param {string} feedback - Optional feedback
     * @param {number} campaignId - Campaign ID if triggered by campaign
     */
    async unsubscribe(email, reason = 'user_request', feedback = null, campaignId = null) {
        const subscriber = await this.db.query(
            'SELECT id FROM subscribers WHERE email = $1',
            [email.toLowerCase()]
        );

        if (subscriber.rows.length > 0) {
            const subscriberId = subscriber.rows[0].id;

            // Update subscriber status
            await this.db.query(
                'UPDATE subscribers SET status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
                [subscriberId, 'unsubscribed']
            );

            // Log unsubscribe
            await this.db.query(`
                INSERT INTO unsubscribe_log (subscriber_id, campaign_id, reason, feedback)
                VALUES ($1, $2, $3, $4)
            `, [subscriberId, campaignId, reason, feedback]);

            // Unsubscribe from Mailchimp
            const subscriberHash = this.md5(email.toLowerCase());
            try {
                await this.mailchimp.request({
                    method: 'PATCH',
                    path: `/lists/${this.audienceId}/members/${subscriberHash}`,
                    body: { status: 'unsubscribed' }
                });
            } catch (error) {
                console.error('Mailchimp unsubscribe error:', error);
            }
        }
    }

    /**
     * Simple MD5 hash for Mailchimp subscriber hash
     * @param {string} str - String to hash
     * @returns {string} - MD5 hash
     */
    md5(str) {
        const crypto = require('crypto');
        return crypto.createHash('md5').update(str).digest('hex');
    }
}

// Export for use in n8n Function nodes
module.exports = SubscriberDataManager;

// Example usage in n8n Function node:
/*
const SubscriberDataManager = require('./subscriber-data-manager.js');

// Initialize with database connection and Mailchimp API
const manager = new SubscriberDataManager($input.database, $input.mailchimp);

// Add subscriber from webhook data
const result = await manager.addOrUpdateSubscriber({
    email: $json.email,
    firstName: $json.firstName,
    lastName: $json.lastName,
    userType: $json.userType,
    specialty: $json.specialty,
    practiceModel: $json.practiceModel,
    emrSystem: $json.emrSystem,
    involvement: $json.involvement,
    challenge: $json.challenge,
    cofounderInterest: $json.cofounder,
    linkedinUrl: $json.linkedin
});

return [{ json: result }];
*/