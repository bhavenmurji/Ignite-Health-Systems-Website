# Merge Tag Implementation Guide
## Ignite Health Systems - Email Personalization System

### Overview
This document provides comprehensive documentation for implementing personalized merge tags in email templates, including data mapping, transformation functions, and conditional content logic.

---

## 🏷️ Core Merge Tags

### **Personal Information Tags**
```html
{{FNAME}}           <!-- First name extracted from full-name field -->
{{LNAME}}           <!-- Last name extracted from full-name field -->
{{FULL_NAME}}       <!-- Complete name as submitted -->
{{EMAIL}}           <!-- Email address for contact and tracking -->
{{FNAME_INITIAL}}   <!-- First letter of first name (uppercase) -->
{{LNAME_INITIAL}}   <!-- First letter of last name (uppercase) -->
```

**Implementation Example:**
```html
<div class="greeting">Hello Dr. {{FNAME}},</div>
<div class="profile-avatar">{{FNAME_INITIAL}}{{LNAME_INITIAL}}</div>
<p>Welcome to Ignite Health Systems, {{FULL_NAME}}.</p>
```

### **Professional Information Tags**
```html
{{SPECIALTY}}           <!-- Medical specialty as entered -->
{{PRACTICE_NAME}}       <!-- Practice name extracted from practice field -->
{{PRACTICE_LOCATION}}   <!-- Location extracted from practice field -->
{{PRACTICE_MODEL}}      <!-- Capitalized practice model -->
{{CHALLENGE}}           <!-- Complete challenge description -->
```

**Implementation Example:**
```html
<div class="specialty-highlight">
    <div class="specialty-title">{{SPECIALTY}}-Optimized Intelligence</div>
    <p>Built specifically for {{SPECIALTY}} practice at {{PRACTICE_NAME}}</p>
</div>
```

### **Engagement & Behavioral Tags**
```html
{{COUNCIL_INTEREST}}    <!-- Boolean: true if interested in Clinical Innovation Council -->
{{CV_STATUS}}           <!-- "Uploaded" or "Not Uploaded" -->
{{CV_DOWNLOAD_LINK}}    <!-- Secure download URL for uploaded CV -->
{{SUBMISSION_TIME}}     <!-- Formatted timestamp of form submission -->
{{CURRENT_TIMESTAMP}}   <!-- Current datetime when email is sent -->
```

---

## 🔧 Data Transformation Functions

### **Name Processing Functions**

#### `extract_first_name`
```javascript
// Input: "Dr. Sarah Johnson"
// Output: "Sarah"
function extractFirstName(fullName) {
    return fullName
        .replace(/^(Dr\.|Doctor|Mr\.|Mrs\.|Ms\.)\s+/i, '') // Remove titles
        .split(' ')[0]
        .trim();
}
```

#### `extract_last_name`
```javascript
// Input: "Dr. Sarah Johnson-Smith"
// Output: "Johnson-Smith"
function extractLastName(fullName) {
    return fullName
        .replace(/^(Dr\.|Doctor|Mr\.|Mrs\.|Ms\.)\s+/i, '') // Remove titles
        .split(' ')
        .slice(-1)[0]
        .trim();
}
```

#### `first_char`
```javascript
// Input: "Sarah"
// Output: "S"
function firstChar(name) {
    return name.charAt(0).toUpperCase();
}
```

### **Practice Information Functions**

#### `extract_practice_name`
```javascript
// Input: "Johnson Family Medicine, Austin, TX 78701"
// Output: "Johnson Family Medicine"
function extractPracticeName(practiceField) {
    return practiceField
        .split(',')[0]
        .trim()
        .replace(/\b(LLC|PC|PA|Inc|Corp|Associates|Group|Clinic|Medical Center)\.?$/i, '')
        .trim();
}
```

#### `extract_location`
```javascript
// Input: "Johnson Family Medicine, Austin, TX 78701"
// Output: "Austin, TX"
function extractLocation(practiceField) {
    const parts = practiceField.split(',');
    if (parts.length > 1) {
        return parts.slice(1)
            .join(',')
            .trim()
            .replace(/\s+\d{5}(-\d{4})?$/, '') // Remove ZIP codes
            .trim();
    }
    return '';
}
```

### **Text Formatting Functions**

#### `capitalize`
```javascript
// Input: "direct-primary-care"
// Output: "Direct-Primary-Care"
function capitalize(text) {
    return text
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .replace(/-/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
```

#### `format_datetime`
```javascript
// Input: ISO timestamp
// Output: "January 15, 2025 at 2:30 PM CST"
function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        timeZone: 'America/Chicago',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
    });
}
```

---

## 🎯 Conditional Content Logic

### **Handlebars Template Syntax**

#### **Basic Conditional Display**
```html
{{#if COUNCIL_INTEREST}}
<div class="highlight-box">
    <div class="highlight-title">🏆 Clinical Innovation Council Invitation</div>
    <p>Thank you for your interest in shaping the future of healthcare technology...</p>
</div>
{{/if}}
```

#### **Multiple Conditions**
```html
{{#if COUNCIL_INTEREST}}
    {{#if CV_STATUS_UPLOADED}}
        <p>We'll review your CV and reach out within 48 hours.</p>
    {{else}}
        <p>Please <a href="{{CV_UPLOAD_LINK}}">upload your CV</a> to complete your application.</p>
    {{/if}}
{{/if}}
```

#### **Practice Model Specific Content**
```html
{{#switch PRACTICE_MODEL}}
    {{#case "direct-primary-care"}}
        <li><strong>Cash-Pay Optimization:</strong> Maximize DPC revenue streams</li>
    {{/case}}
    {{#case "concierge"}}
        <li><strong>Premium Service Tools:</strong> Enhanced patient experience features</li>
    {{/case}}
    {{#default}}
        <li><strong>Revenue Optimization:</strong> Smart billing and insurance management</li>
    {{/default}}
{{/switch}}
```

### **Specialty-Specific Customization**
```html
<!-- Dynamic specialty icons and messaging -->
{{#specialty_mapping SPECIALTY}}
    <span class="specialty-icon">{{icon}}</span>
    <div class="specialty-focus">
        <h4>{{SPECIALTY}} Focus Areas:</h4>
        <ul>
            {{#each focus_areas}}
                <li>{{this}}</li>
            {{/each}}
        </ul>
    </div>
{{/specialty_mapping}}
```

---

## 📋 Template Implementation Examples

### **Physician Welcome Template**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Welcome Dr. {{FNAME}} - Ignite Health Systems</title>
</head>
<body>
    <div class="email-container">
        <div class="greeting">Hello Dr. {{FNAME}},</div>

        <p>Thank you for joining the movement to transform {{SPECIALTY}} practice.</p>

        <div class="challenge-section">
            <h3>Addressing Your Challenge:</h3>
            <blockquote>"{{CHALLENGE}}"</blockquote>
            <p>This is exactly what our Clinical Co-Pilot is designed to solve.</p>
        </div>

        {{#if COUNCIL_INTEREST}}
            <div class="council-invitation">
                <h3>🏆 Clinical Innovation Council</h3>
                <p>Thank you for your interest in our Clinical Innovation Council.</p>
                {{#if CV_STATUS_UPLOADED}}
                    <p>We'll review your CV and reach out within 48 hours.</p>
                {{else}}
                    <p>Please upload your CV to complete your application.</p>
                {{/if}}
            </div>
        {{/if}}

        <div class="cta-section">
            <a href="{{DEMO_LINK}}?specialty={{SPECIALTY}}&name={{FNAME}}">
                Schedule Your {{SPECIALTY}} Demo
            </a>
        </div>
    </div>
</body>
</html>
```

### **Co-founder Alert Template**
```html
<div class="candidate-profile">
    <div class="profile-header">
        <div class="profile-avatar">{{FNAME_INITIAL}}{{LNAME_INITIAL}}</div>
        <div class="profile-info">
            <h2>{{FULL_NAME}}</h2>
            <p>{{SPECIALTY}} Specialist</p>
            <p>📍 {{PRACTICE_LOCATION}}</p>
        </div>
    </div>

    <div class="profile-details">
        <div class="detail-item">
            <label>Email:</label>
            <span>{{EMAIL}}</span>
        </div>
        <div class="detail-item">
            <label>Practice:</label>
            <span>{{PRACTICE_NAME}}</span>
        </div>
        <div class="detail-item">
            <label>Model:</label>
            <span>{{PRACTICE_MODEL}}</span>
        </div>
        <div class="detail-item">
            <label>CV Status:</label>
            <span>{{CV_STATUS}}</span>
        </div>
    </div>

    <div class="challenge-quote">
        <h4>Primary Challenge:</h4>
        <p>"{{CHALLENGE}}"</p>
    </div>

    <div class="action-items">
        <a href="{{CV_DOWNLOAD_LINK}}" class="btn-primary">Download CV</a>
        <a href="mailto:{{EMAIL}}" class="btn-secondary">Contact Directly</a>
    </div>
</div>
```

---

## 🔄 Data Mapping Configuration

### **Form Field to Merge Tag Mapping**
```json
{
  "field_mappings": {
    "full-name": {
      "merge_tags": ["FULL_NAME", "FNAME", "LNAME", "FNAME_INITIAL", "LNAME_INITIAL"],
      "transformations": {
        "FNAME": "extractFirstName(value)",
        "LNAME": "extractLastName(value)",
        "FNAME_INITIAL": "firstChar(extractFirstName(value))",
        "LNAME_INITIAL": "firstChar(extractLastName(value))"
      }
    },
    "email": {
      "merge_tags": ["EMAIL"],
      "validation": "validateEmail(value)",
      "transformations": {
        "EMAIL": "value.toLowerCase().trim()"
      }
    },
    "specialty": {
      "merge_tags": ["SPECIALTY"],
      "transformations": {
        "SPECIALTY": "capitalize(value)"
      },
      "conditional_routing": {
        "specialist_keywords": ["Cardiology", "Dermatology", "Neurology", "Orthopedics"],
        "route_to": "specialist_welcome_sequence"
      }
    },
    "practice": {
      "merge_tags": ["PRACTICE_NAME", "PRACTICE_LOCATION"],
      "transformations": {
        "PRACTICE_NAME": "extractPracticeName(value)",
        "PRACTICE_LOCATION": "extractLocation(value)"
      }
    },
    "practice-model": {
      "merge_tags": ["PRACTICE_MODEL"],
      "transformations": {
        "PRACTICE_MODEL": "capitalize(value.replace('-', ' '))"
      }
    },
    "council": {
      "merge_tags": ["COUNCIL_INTEREST"],
      "transformations": {
        "COUNCIL_INTEREST": "value === 'yes'"
      },
      "conditional_content": {
        "show_council_section": "value === 'yes'"
      }
    },
    "challenge": {
      "merge_tags": ["CHALLENGE"],
      "transformations": {
        "CHALLENGE": "value.trim()"
      },
      "analysis": {
        "keywords_extraction": true,
        "sentiment_analysis": true,
        "priority_scoring": true
      }
    },
    "cv": {
      "merge_tags": ["CV_STATUS", "CV_DOWNLOAD_LINK"],
      "transformations": {
        "CV_STATUS": "value && value.size > 0 ? 'Uploaded' : 'Not Uploaded'",
        "CV_DOWNLOAD_LINK": "generateSecureDownloadLink(value)"
      },
      "file_handling": {
        "max_size": "10MB",
        "allowed_types": ["application/pdf"],
        "virus_scan": true,
        "secure_storage": true
      }
    }
  }
}
```

### **Dynamic Content Rules**
```json
{
  "content_rules": [
    {
      "condition": "SPECIALTY in ['Cardiology', 'Neurology', 'Orthopedics']",
      "action": "use_specialist_template",
      "merge_tag_overrides": {
        "TEMPLATE_TYPE": "specialist",
        "DEMO_LINK": "https://calendar.app/ignite-specialist-demo"
      }
    },
    {
      "condition": "PRACTICE_MODEL === 'direct-primary-care'",
      "action": "add_dpc_content",
      "content_blocks": ["dpc_benefits", "cash_pay_optimization"]
    },
    {
      "condition": "COUNCIL_INTEREST === true && CV_STATUS === 'Uploaded'",
      "action": "trigger_cofounder_alert",
      "priority": "high",
      "recipients": ["bhaven@ignitehealthsystems.com"]
    }
  ]
}
```

---

## 🧪 Testing & Validation

### **Merge Tag Testing Protocol**
```javascript
// Test data sets for validation
const testData = {
  physician_primary: {
    "full-name": "Dr. Sarah Elizabeth Johnson-Smith",
    "email": "sarah.johnson@familymed.com",
    "specialty": "Family Medicine",
    "practice": "Johnson Family Medicine, Austin, TX 78701",
    "practice-model": "direct-primary-care",
    "council": "yes",
    "challenge": "EHR documentation takes 25+ minutes per patient visit."
  },
  specialist_cardiology: {
    "full-name": "Michael Chen",
    "email": "m.chen@cardiocare.com",
    "specialty": "Cardiology",
    "practice": "Austin Cardiology Associates, Austin, TX",
    "practice-model": "fee-for-service",
    "council": "no",
    "challenge": "Complex procedure documentation consumes 3+ hours daily."
  }
};

// Expected merge tag outputs
const expectedOutputs = {
  physician_primary: {
    FNAME: "Sarah",
    LNAME: "Johnson-Smith",
    FNAME_INITIAL: "S",
    LNAME_INITIAL: "J",
    PRACTICE_NAME: "Johnson Family Medicine",
    PRACTICE_LOCATION: "Austin, TX",
    PRACTICE_MODEL: "Direct-Primary-Care",
    COUNCIL_INTEREST: true
  }
};
```

### **Validation Checklist**
- [ ] All merge tags render correctly with test data
- [ ] Conditional content appears/hides appropriately
- [ ] Name extraction handles titles, hyphens, and multiple names
- [ ] Practice information parsing works with various formats
- [ ] File upload status detection functions correctly
- [ ] Timestamp formatting displays in correct timezone
- [ ] Special characters and unicode names handled properly
- [ ] Empty/null values have appropriate fallbacks

### **Error Handling**
```html
<!-- Fallback for missing data -->
{{FNAME || "Valued Healthcare Professional"}}

<!-- Safe file status check -->
{{#if CV_DOWNLOAD_LINK}}
    <a href="{{CV_DOWNLOAD_LINK}}">Download CV</a>
{{else}}
    <span>CV not available</span>
{{/if}}

<!-- Practice name with fallback -->
<p>Thank you for your interest from {{PRACTICE_NAME || "your practice"}}.</p>
```

---

## 🚀 Implementation Steps

### **Phase 1: Core Merge Tags (Week 1)**
1. Implement basic personal information tags (FNAME, LNAME, EMAIL)
2. Add professional information tags (SPECIALTY, PRACTICE_MODEL)
3. Test with sample data from existing form submissions

### **Phase 2: Advanced Functions (Week 2)**
1. Implement text transformation functions
2. Add conditional content logic
3. Test specialty-specific routing and content

### **Phase 3: File Handling (Week 3)**
1. Implement CV upload status detection
2. Add secure file download link generation
3. Test co-founder alert trigger functionality

### **Phase 4: Optimization (Week 4)**
1. Performance testing with large datasets
2. A/B test different personalization levels
3. Monitor engagement metrics and optimize accordingly

This comprehensive merge tag system enables highly personalized email communications that adapt to each recipient's professional background, interests, and engagement level while maintaining data security and professional presentation standards.