# Credential Rotation Process

## Overview
This document details the step-by-step process for rotating credentials in the Ignite Health Systems project. Regular credential rotation is a critical security practice that limits the impact of potential breaches.

## 🗓️ Rotation Schedule

### Standard Rotation Intervals
| Credential Type | Rotation Frequency | Lead Time | Owner |
|---|---|---|---|
| API Keys (External) | 90 days | 7 days | DevOps Team |
| Database Passwords | 60 days | 3 days | Database Admin |
| JWT Secrets | 30 days | 1 day | Backend Team |
| SSH Keys | 180 days | 14 days | Infrastructure Team |
| SSL/TLS Certificates | Before expiry | 30 days | DevOps Team |
| Service Account Keys | 90 days | 7 days | Security Team |

### Automated Reminders
Set up calendar reminders or use tools like:
- GitHub Issues with due dates
- Slack scheduled reminders
- Infrastructure monitoring alerts

## 🔄 Rotation Procedures

### 1. API Key Rotation

#### Anthropic API Keys
```bash
# Step 1: Generate new key in Anthropic Console
# Step 2: Update environment variables
export ANTHROPIC_API_KEY_NEW="sk-ant-api03-new-key-here"

# Step 3: Test new key
curl -H "x-api-key: $ANTHROPIC_API_KEY_NEW" \
  https://api.anthropic.com/v1/complete \
  -d '{"prompt": "Test", "model": "claude-3-sonnet-20240229", "max_tokens_to_sample": 10}'

# Step 4: Deploy to all environments
kubectl set env deployment/api ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY_NEW

# Step 5: Verify deployment
kubectl rollout status deployment/api

# Step 6: Revoke old key in Anthropic Console
```

#### Third-party API Keys (Generic)
1. **Generate**: Create new key in provider console
2. **Test**: Verify new key works in staging
3. **Update**: Deploy to all environments
4. **Monitor**: Check for any failures
5. **Revoke**: Remove old key from provider

### 2. Database Password Rotation

#### PostgreSQL Example
```bash
# Step 1: Connect as admin
psql -h localhost -U postgres

# Step 2: Generate new password
NEW_PASSWORD=$(openssl rand -base64 32)

# Step 3: Update user password
ALTER USER app_user PASSWORD '$NEW_PASSWORD';

# Step 4: Update connection strings
export DATABASE_URL="postgresql://app_user:$NEW_PASSWORD@localhost/app_db"

# Step 5: Test connection
psql $DATABASE_URL -c "SELECT 1;"

# Step 6: Update all application configs
```

### 3. JWT Secret Rotation

```javascript
// Step 1: Generate new secret
const crypto = require('crypto');
const newSecret = crypto.randomBytes(64).toString('hex');

// Step 2: Implement dual-secret verification (transition period)
const verifyToken = (token) => {
  try {
    // Try new secret first
    return jwt.verify(token, process.env.JWT_SECRET_NEW);
  } catch (err) {
    // Fall back to old secret during transition
    return jwt.verify(token, process.env.JWT_SECRET_OLD);
  }
};

// Step 3: Sign new tokens with new secret
const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_NEW);
};

// Step 4: After transition period, remove old secret support
```

### 4. SSH Key Rotation

```bash
# Step 1: Generate new key pair
ssh-keygen -t ed25519 -C "ignite-health-$(date +%Y%m%d)" -f ~/.ssh/ignite_new

# Step 2: Add public key to authorized servers
ssh-copy-id -i ~/.ssh/ignite_new.pub user@server.com

# Step 3: Test new key
ssh -i ~/.ssh/ignite_new user@server.com "echo 'New key works'"

# Step 4: Update SSH config
cat >> ~/.ssh/config << EOF
Host ignite-servers
  IdentityFile ~/.ssh/ignite_new
  IdentitiesOnly yes
EOF

# Step 5: Remove old key from authorized_keys on servers
```

## 🚨 Emergency Rotation

### When to Perform Emergency Rotation
- Credential found in public repository
- Suspected unauthorized access
- Former employee had access
- Security audit findings
- Third-party breach notification

### Emergency Procedure
```bash
#!/bin/bash
# emergency_rotate.sh

echo "🚨 EMERGENCY CREDENTIAL ROTATION 🚨"
echo "Timestamp: $(date)"

# 1. Immediately revoke compromised credential
echo "Step 1: Revoking compromised credential..."
# [Provider-specific revocation command]

# 2. Generate new credential
echo "Step 2: Generating new credential..."
NEW_CRED=$(generate_new_credential)

# 3. Update all environments ASAP
echo "Step 3: Updating production..."
kubectl set env deployment/api API_KEY=$NEW_CRED

echo "Step 4: Updating staging..."
kubectl set env deployment/api-staging API_KEY=$NEW_CRED -n staging

# 4. Verify services are running
echo "Step 5: Verifying deployments..."
kubectl rollout status deployment/api
kubectl rollout status deployment/api-staging -n staging

# 5. Alert team
echo "Step 6: Alerting team..."
slack_notify "#alerts" "Emergency credential rotation completed for API_KEY"

echo "✅ Emergency rotation completed"
```

## 📊 Tracking and Auditing

### Rotation Log Template
```yaml
# rotation_log.yml
rotations:
  - date: "2024-03-15"
    credential_type: "anthropic_api_key"
    old_key_id: "sk-ant-api03-***-abc123"
    new_key_id: "sk-ant-api03-***-def456"
    rotated_by: "john.doe@company.com"
    reason: "scheduled_rotation"
    environments_updated:
      - production
      - staging
      - development
    verification_completed: true
    old_key_revoked: true
    notes: "Smooth rotation, no downtime"
```

### Audit Trail
Maintain records of:
- Who performed the rotation
- When it was performed
- Which credential was rotated
- Reason for rotation
- Verification steps completed
- Any issues encountered

## 🔧 Automation Tools

### Rotation Scripts
Create environment-specific scripts:

```bash
# scripts/rotate_api_keys.sh
#!/bin/bash
set -e

ENVIRONMENT=$1
if [[ -z "$ENVIRONMENT" ]]; then
  echo "Usage: $0 <environment>"
  exit 1
fi

echo "Rotating API keys for environment: $ENVIRONMENT"

# Load environment-specific configuration
source "config/${ENVIRONMENT}.env"

# Rotate each API key
for KEY_NAME in "${API_KEYS[@]}"; do
  echo "Rotating $KEY_NAME..."
  rotate_key "$KEY_NAME" "$ENVIRONMENT"
done

echo "✅ All API keys rotated successfully"
```

### Monitoring Integration
```bash
# Add to monitoring system
curl -X POST https://monitoring.company.com/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "credential_rotation",
    "environment": "production",
    "credential_type": "api_key",
    "status": "completed",
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
  }'
```

## ✅ Post-Rotation Checklist

### Immediate Verification (0-15 minutes)
- [ ] New credential works in all environments
- [ ] Applications are running without errors
- [ ] Health checks are passing
- [ ] No authentication errors in logs

### Short-term Monitoring (1-24 hours)
- [ ] Monitor application performance
- [ ] Check error rates and logs
- [ ] Verify user authentication flows
- [ ] Confirm third-party integrations work

### Documentation Updates (1-3 days)
- [ ] Update rotation log
- [ ] Update team documentation
- [ ] Update incident response procedures
- [ ] Schedule next rotation

## 🔍 Testing Rotated Credentials

### Automated Testing
```javascript
// test/credential-rotation.test.js
describe('Credential Rotation', () => {
  test('API key authentication', async () => {
    const response = await api.get('/health', {
      headers: { 'Authorization': `Bearer ${process.env.API_KEY}` }
    });
    expect(response.status).toBe(200);
  });

  test('Database connection', async () => {
    const connection = await db.connect();
    const result = await connection.query('SELECT 1');
    expect(result.rows[0]).toBeDefined();
    await connection.end();
  });
});
```

### Manual Testing Checklist
- [ ] Login functionality
- [ ] API endpoints responding
- [ ] Database queries executing
- [ ] File uploads/downloads
- [ ] Third-party integrations
- [ ] Scheduled jobs running

## 📞 Escalation Process

### If Rotation Fails
1. **Don't panic** - Most issues are recoverable
2. **Rollback** to previous credential if possible
3. **Alert team** via Slack/email
4. **Investigate** root cause
5. **Document** lessons learned

### Escalation Contacts
- **Level 1**: DevOps Team Lead
- **Level 2**: Security Team
- **Level 3**: CTO/CISO
- **Emergency**: On-call engineer

## 📚 Resources

- [HashiCorp Vault](https://www.vaultproject.io/) - Secret management
- [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/) - Cloud secret rotation
- [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/) - Container secret management
- [NIST Guidelines](https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/final) - Key management practices

---

**Remember**: Regular rotation is much easier than emergency rotation. Stay proactive!