# Mailchimp Email Automation Setup Guide - Visual Instructions

## Prerequisites Checklist

- [ ] Mailchimp account with Standard plan or higher (required for automations)
- [ ] Domain verification completed
- [ ] Contact list created and imported
- [ ] Tag system configured for: `physician`, `investor`, `specialist`, `cofounder-interest`

---

## 🔧 **AUTOMATION 1: Physician Welcome Series**

### Step 1: Create New Automation
1. **Navigate**: Log into Mailchimp → Click `Automations` in left sidebar
2. **Create**: Click orange `Create` button (top right)
3. **Choose Type**: Select `Email` → Click `Customer journey`
4. **Template**: Choose `Welcome new subscribers` → Click `Use this workflow`

### Step 2: Configure Automation Settings
1. **Automation Name**: Enter "Physician Welcome - Ignite Health"
2. **From Name**: Enter "Dr. Bhaven Murji, Ignite Health Systems"
3. **From Email**: Use verified domain email (e.g., bhaven@ignitehealthsystems.com)
4. **Reply-to**: Same as from email
5. **Click**: `Begin` button

### Step 3: Set Up Trigger Conditions
1. **Trigger Screen**: You'll see "Subscriber is added to audience"
2. **Click**: `Edit` next to trigger settings
3. **Trigger Type**: Select `Signup form` → `Add or update subscriber`
4. **Conditions**: Click `+ Add condition`
5. **Condition Setup**:
   - Field: `Tags`
   - Condition: `contains`
   - Value: `physician`
6. **Save**: Click `Save` button

### Step 4: Design Welcome Email
1. **Email Block**: Click on the email icon in workflow
2. **Email Settings**:
   - Subject: "Welcome to the Future of Healthcare, Dr. *|FNAME|*"
   - Preview: "Your journey with Ignite Health Systems begins now"
3. **Design Email**: Click `Design Email`
4. **Template**: Choose `Simple Text` or `Ignite branded template`

### Step 5: Email Content Configuration
```
Subject Line: Welcome to the Future of Healthcare, Dr. *|FNAME|*

Email Body Template:
---
Dear Dr. *|FNAME|* *|LNAME|*,

Welcome to Ignite Health Systems! As a fellow physician, I'm excited to share our revolutionary approach to healthcare delivery.

🔹 **What's Next for You:**
- Exclusive physician network access
- Early preview of our AI-powered tools
- Direct line to our medical advisory board
- Invitation to monthly physician roundtables

**Your Physician Portal**: [Link to physician dashboard]
**Schedule 1:1 Call**: [Calendly link for physician consultations]

Let's transform healthcare together.

Best regards,
Dr. Bhaven Murji
Founder & CEO, Ignite Health Systems

P.S. Check your email tomorrow for your exclusive physician resource guide.
---
```

### Step 6: Timing & Delivery Settings
1. **Send Time**: Immediately after trigger
2. **Send Days**: All days checked
3. **Send Time**: 9:00 AM (recipient's timezone)
4. **Click**: `Save and Continue`

### Step 7: Add Follow-up Email (Day 3)
1. **Add Step**: Click `+` after first email
2. **Choose**: `Email` → `Send Email`
3. **Delay**: Set to `3 days after previous step`
4. **Subject**: "Your Physician Resource Guide - Ignite Health"
5. **Content**: Resource downloads, case studies, ROI calculator

---

## 💼 **AUTOMATION 2: Investor Welcome Series**

### Step 1-2: Create Automation (Same as Physician)
- **Name**: "Investor Welcome - Ignite Health"
- **From**: "Bhaven Murji, CEO - Ignite Health Systems"

### Step 3: Trigger Setup for Investors
1. **Condition**: Tags contains `investor`
2. **Additional Conditions** (Optional):
   - Add `Interest Level` equals `High` for priority routing

### Step 4: Investor-Specific Email Design
```
Subject: Investment Opportunity: $50M Healthcare Market Disruption

Dear *|FNAME|*,

Thank you for your interest in Ignite Health Systems' Series A funding round.

📊 **Key Investment Highlights:**
- $50M addressable market opportunity
- 340% revenue growth (last 18 months)
- Strategic partnerships with 3 major health systems
- Patent-pending AI technology stack

🎯 **Next Steps:**
1. Download our investor deck: [Secure Link]
2. Review our financial projections: [Link]
3. Schedule investor meeting: [Calendly - Investor Track]

**Exclusive Investor Portal**: [Link with credentials]

The healthcare revolution starts with your investment.

Bhaven Murji
CEO & Founder
Direct: [Phone] | Email: [Direct Email]

CONFIDENTIAL - For Accredited Investors Only
```

### Step 5: Investor Follow-up Sequence
1. **Day 2**: Due diligence packet
2. **Day 5**: Market analysis and competitive landscape
3. **Day 7**: Team introductions and advisory board profiles
4. **Day 10**: Reference calls and investor testimonials

---

## 🧬 **AUTOMATION 3: Specialist Welcome Series**

### Trigger Configuration
- **Condition**: Tags contains `specialist`
- **Additional**: Professional field (if collected)

### Specialist Email Template
```
Subject: Join the Technical Innovation at Ignite Health

Hello *|FNAME|*,

Welcome to Ignite Health Systems' specialist network!

🔬 **Your Expertise Needed:**
- AI model development and validation
- Healthcare data architecture
- Regulatory compliance (HIPAA/FDA)
- Clinical workflow optimization

💡 **Collaboration Opportunities:**
- Research partnerships
- Technology advisory roles
- Speaking engagements
- Product development consulting

**Specialist Portal**: [Technical documentation access]
**GitHub Repository**: [If applicable - private access]
**Slack Channel**: #specialists-innovation

Let's build the future of healthcare technology together.

Best,
The Ignite Innovation Team

Technical Contact: [CTO Email]
Partnership Inquiries: [Business Development Email]
```

---

## 🚨 **AUTOMATION 4: Co-founder Priority Alert**

### Step 1: Create Internal Alert Automation
1. **Type**: Choose `Send a one-time email`
2. **Name**: "URGENT: Co-founder Interest Alert"

### Step 2: Trigger Setup
1. **Condition**: Tags contains `cofounder-interest`
2. **Immediate Trigger**: No delay

### Step 3: Internal Alert Email
```
TO: bhaven@ignitehealthsystems.com, team@ignitehealthsystems.com

Subject: 🚨 URGENT: Co-founder Interest - *|FNAME|* *|LNAME|*

IMMEDIATE ACTION REQUIRED

New co-founder inquiry received:
- Name: *|FNAME|* *|LNAME|*
- Email: *|EMAIL|*
- Phone: *|PHONE|*
- Timestamp: *|DATE|*

**Contact within 24 hours**

Lead Profile: [Link to full contact record]
Follow-up Actions: [Internal task system link]
```

### Step 4: Auto-Response to Prospect
```
Subject: Thank You for Your Co-founder Interest - Next Steps

Dear *|FNAME|*,

Thank you for expressing interest in co-founding opportunities with Ignite Health Systems.

I've personally received your inquiry and will contact you within 24 hours to discuss:

✓ Co-founder role opportunities
✓ Equity and compensation structure
✓ Your background and expertise fit
✓ Our current funding and growth stage

**Immediate Next Steps:**
1. I'll call you at *|PHONE|* within 24 hours
2. Please review our company overview: [Link]
3. Prepare to discuss your vision for healthcare transformation

This is the beginning of something transformational.

Dr. Bhaven Murji
Founder & CEO
Direct: [Phone] | Email: [Direct Email]

P.S. I'm excited to learn about your background and explore how we can build the future of healthcare together.
```

---

## 🔧 **Testing & Troubleshooting**

### Pre-Launch Testing Checklist

#### Test Each Automation:
1. **Create Test Contact**:
   - Go to `Audience` → `Add contacts` → `Add a subscriber`
   - Use your personal email with `+test` (e.g., your+test@email.com)
   - Add appropriate tag (`physician`, `investor`, etc.)

2. **Verify Trigger**:
   - Check automation dashboard shows "1 person currently in this journey"
   - Confirm email sends within expected timeframe

3. **Content Review**:
   - [ ] Merge tags populate correctly (*|FNAME|*, *|EMAIL|*)
   - [ ] Links work and lead to correct destinations
   - [ ] Mobile formatting looks professional
   - [ ] Images load properly

#### Common Issues & Solutions:

**❌ Automation Not Triggering**
- Solution: Check tag spelling (case-sensitive)
- Verify audience has contacts with correct tags
- Ensure automation is "On" (toggle in automation dashboard)

**❌ Merge Tags Not Populating**
- Solution: Ensure contact has data in those fields
- Use default values: `*|FNAME:there|*` instead of `*|FNAME|*`

**❌ Emails Going to Spam**
- Solution: Authenticate domain (SPF, DKIM records)
- Warm up sending reputation gradually
- Ask recipients to whitelist sender

**❌ Wrong Timing/Delays**
- Solution: Check timezone settings in account preferences
- Verify delay settings between emails
- Consider business days only for B2B communications

### Monitoring & Optimization

#### Weekly Review Tasks:
1. **Performance Metrics**:
   - Open rates (target: >25% for healthcare B2B)
   - Click rates (target: >3%)
   - Unsubscribe rates (keep <1%)

2. **A/B Testing**:
   - Test subject lines monthly
   - Try different send times
   - Experiment with content length

3. **List Hygiene**:
   - Remove bounced emails
   - Update suppression lists
   - Clean inactive subscribers (>6 months)

---

## 📋 **Go-Live Checklist**

### Final Pre-Launch Steps:
- [ ] All 4 automations created and configured
- [ ] Test emails sent and reviewed
- [ ] Team trained on monitoring dashboard
- [ ] Backup contacts exported
- [ ] Legal compliance verified (CAN-SPAM, GDPR)
- [ ] Analytics tracking configured
- [ ] Customer service team briefed on new communications

### Launch Day:
- [ ] Turn on all automations simultaneously
- [ ] Monitor for first 2 hours
- [ ] Check automation dashboard every 4 hours first day
- [ ] Respond to any immediate replies within same day

### Post-Launch (Week 1):
- [ ] Daily monitoring of metrics
- [ ] Address any delivery issues immediately
- [ ] Collect feedback from first recipients
- [ ] Document any needed improvements
- [ ] Plan first optimization cycle

---

**🎯 Success Metrics to Track:**
- Physician engagement: >30% open rate, >5% click rate
- Investor response: >40% open rate, >8% click rate
- Specialist activation: >25% portal login within 7 days
- Co-founder urgency: <24 hour response time, >90% contact rate

This systematic approach ensures professional, compliant, and effective email automation that supports Ignite Health Systems' growth across all stakeholder segments.