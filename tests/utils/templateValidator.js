/**
 * Template Rendering Verification for Email Testing
 * Validates email template rendering, personalization, and content accuracy
 */

class TemplateValidator {
  constructor() {
    this.templates = new Map();
    this.renderingRules = new Map();
    this.validationRules = new Map();

    this.initializeTemplates();
    this.initializeRenderingRules();
  }

  initializeTemplates() {
    // Physician welcome template
    this.templates.set('physician-welcome', {
      name: 'Physician Welcome Email',
      subject: 'Welcome to Ignite Health Systems - Liberate Your Practice',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8f9fa;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #2c5aa0; margin-bottom: 20px;">Welcome, Dr. {{firstName}} {{lastName}}!</h1>

              <p>Thank you for your interest in Ignite Health Systems. As a {{specialty}} practitioner in {{practiceModel}} practice, we understand your unique challenges with EMR documentation and administrative burden.</p>

              <h2 style="color: #34495e;">Your EMR Liberation Journey Starts Here</h2>

              <p><strong>Current Challenge:</strong> {{challenge}}</p>

              <p>Our AI-powered platform is specifically designed to:</p>
              <ul>
                <li>Reduce documentation time by 60-80%</li>
                <li>Eliminate repetitive EMR tasks</li>
                <li>Return focus to patient care</li>
                <li>Reduce physician burnout</li>
              </ul>

              <div style="background-color: #e8f4f8; padding: 20px; margin: 20px 0; border-radius: 5px;">
                <h3 style="color: #2c5aa0; margin-top: 0;">Specialized for {{emrSystem}} Users</h3>
                <p>We've optimized our platform specifically for {{emrSystem}} integration, ensuring seamless workflow enhancement without disrupting your current practice.</p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://ignitehealthsystems.com/demo?source=email&user={{email}}"
                   style="background-color: #3498db; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Schedule Your Personal Demo
                </a>
              </div>

              <p><em>Ready to liberate your practice and return to what you love most - caring for patients?</em></p>

              <p>Best regards,<br>
              Dr. Bhaven Murji<br>
              Founder, Ignite Health Systems</p>

              <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
              <p style="font-size: 12px; color: #666;">
                You're receiving this because you expressed interest in Ignite Health Systems.
                <a href="{{unsubscribeUrl}}">Unsubscribe</a> |
                <a href="https://ignitehealthsystems.com">Visit our website</a>
              </p>
            </div>
          </body>
        </html>
      `,
      text: `
Welcome, Dr. {{firstName}} {{lastName}}!

Thank you for your interest in Ignite Health Systems. As a {{specialty}} practitioner in {{practiceModel}} practice, we understand your unique challenges with EMR documentation and administrative burden.

Your EMR Liberation Journey Starts Here

Current Challenge: {{challenge}}

Our AI-powered platform is specifically designed to:
- Reduce documentation time by 60-80%
- Eliminate repetitive EMR tasks
- Return focus to patient care
- Reduce physician burnout

Specialized for {{emrSystem}} Users
We've optimized our platform specifically for {{emrSystem}} integration, ensuring seamless workflow enhancement without disrupting your current practice.

Schedule Your Personal Demo: https://ignitehealthsystems.com/demo?source=email&user={{email}}

Ready to liberate your practice and return to what you love most - caring for patients?

Best regards,
Dr. Bhaven Murji
Founder, Ignite Health Systems

You're receiving this because you expressed interest in Ignite Health Systems.
Unsubscribe: {{unsubscribeUrl}} | Visit our website: https://ignitehealthsystems.com
      `.trim(),
      requiredTokens: ['firstName', 'lastName', 'specialty', 'practiceModel', 'challenge', 'emrSystem', 'email', 'unsubscribeUrl'],
      optionalTokens: [],
      userType: 'physician'
    });

    // Investor welcome template
    this.templates.set('investor-welcome', {
      name: 'Investor Welcome Email',
      subject: 'Healthcare Disruption Opportunity - Ignite Health Systems',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8f9fa;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #2c5aa0; margin-bottom: 20px;">Welcome, {{firstName}}!</h1>

              <p>Thank you for your interest in Ignite Health Systems. We're excited to share this transformative healthcare technology opportunity with you.</p>

              <h2 style="color: #34495e;">Market Opportunity</h2>

              <p><strong>Your Investment Focus:</strong> {{challenge}}</p>

              <div style="background-color: #f0f8ff; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #3498db;">
                <h3 style="color: #2c5aa0; margin-top: 0;">The $3.8 Trillion Healthcare Problem</h3>
                <ul>
                  <li><strong>$600B</strong> annual cost of physician burnout</li>
                  <li><strong>70%</strong> of physicians report EMR-related burnout</li>
                  <li><strong>4+ hours</strong> daily spent on documentation vs patient care</li>
                  <li><strong>$200K+</strong> average cost to replace a burned-out physician</li>
                </ul>
              </div>

              <h3 style="color: #34495e;">Our Solution</h3>
              <p>Ignite Health Systems addresses this massive market inefficiency with AI-powered EMR liberation technology that:</p>
              <ul>
                <li>Reduces documentation burden by 60-80%</li>
                <li>Improves physician satisfaction and retention</li>
                <li>Enhances patient care quality</li>
                <li>Generates measurable ROI for healthcare systems</li>
              </ul>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://ignitehealthsystems.com/investors?source=email&investor={{email}}"
                   style="background-color: #27ae60; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  View Investment Opportunity
                </a>
              </div>

              <p><em>Ready to disrupt healthcare and generate exceptional returns while improving physician and patient outcomes?</em></p>

              <p>Best regards,<br>
              Dr. Bhaven Murji<br>
              Founder & CEO, Ignite Health Systems</p>

              <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
              <p style="font-size: 12px; color: #666;">
                You're receiving this because you expressed interest in Ignite Health Systems investment opportunities.
                <a href="{{unsubscribeUrl}}">Unsubscribe</a> |
                <a href="https://ignitehealthsystems.com">Visit our website</a>
              </p>
            </div>
          </body>
        </html>
      `,
      text: `
Welcome, {{firstName}}!

Thank you for your interest in Ignite Health Systems. We're excited to share this transformative healthcare technology opportunity with you.

Market Opportunity

Your Investment Focus: {{challenge}}

The $3.8 Trillion Healthcare Problem
- $600B annual cost of physician burnout
- 70% of physicians report EMR-related burnout
- 4+ hours daily spent on documentation vs patient care
- $200K+ average cost to replace a burned-out physician

Our Solution
Ignite Health Systems addresses this massive market inefficiency with AI-powered EMR liberation technology that:
- Reduces documentation burden by 60-80%
- Improves physician satisfaction and retention
- Enhances patient care quality
- Generates measurable ROI for healthcare systems

View Investment Opportunity: https://ignitehealthsystems.com/investors?source=email&investor={{email}}

Ready to disrupt healthcare and generate exceptional returns while improving physician and patient outcomes?

Best regards,
Dr. Bhaven Murji
Founder & CEO, Ignite Health Systems

You're receiving this because you expressed interest in Ignite Health Systems investment opportunities.
Unsubscribe: {{unsubscribeUrl}} | Visit our website: https://ignitehealthsystems.com
      `.trim(),
      requiredTokens: ['firstName', 'challenge', 'email', 'unsubscribeUrl'],
      optionalTokens: ['lastName'],
      userType: 'investor'
    });

    // Specialist welcome template
    this.templates.set('specialist-welcome', {
      name: 'Specialist Welcome Email',
      subject: 'Collaborate with Ignite Health Systems',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8f9fa;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #2c5aa0; margin-bottom: 20px;">Welcome, {{firstName}}!</h1>

              <p>Thank you for your interest in collaborating with Ignite Health Systems. Your expertise in {{specialty}} aligns perfectly with our mission to transform healthcare technology.</p>

              <h2 style="color: #34495e;">Collaboration Opportunity</h2>

              <p><strong>Your Focus Area:</strong> {{challenge}}</p>

              <div style="background-color: #f8f5ff; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #9b59b6;">
                <h3 style="color: #2c5aa0; margin-top: 0;">How We Can Work Together</h3>
                <ul>
                  <li><strong>Technology Partnership:</strong> Integrate your solutions with our platform</li>
                  <li><strong>Research Collaboration:</strong> Joint studies and publications</li>
                  <li><strong>Advisory Role:</strong> Guide our technology development</li>
                  <li><strong>Co-innovation:</strong> Develop new solutions together</li>
                </ul>
              </div>

              <h3 style="color: #34495e;">Current Projects</h3>
              <ul>
                <li>AI-powered clinical decision support</li>
                <li>Natural language processing for medical records</li>
                <li>Predictive analytics for patient outcomes</li>
                <li>Workflow automation and optimization</li>
              </ul>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://ignitehealthsystems.com/partnerships?source=email&specialist={{email}}"
                   style="background-color: #9b59b6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Explore Partnership Opportunities
                </a>
              </div>

              <p><em>Ready to collaborate on the future of healthcare technology?</em></p>

              <p>Best regards,<br>
              Dr. Bhaven Murji<br>
              Founder, Ignite Health Systems</p>

              <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
              <p style="font-size: 12px; color: #666;">
                You're receiving this because you expressed interest in collaborating with Ignite Health Systems.
                <a href="{{unsubscribeUrl}}">Unsubscribe</a> |
                <a href="https://ignitehealthsystems.com">Visit our website</a>
              </p>
            </div>
          </body>
        </html>
      `,
      text: `
Welcome, {{firstName}}!

Thank you for your interest in collaborating with Ignite Health Systems. Your expertise in {{specialty}} aligns perfectly with our mission to transform healthcare technology.

Collaboration Opportunity

Your Focus Area: {{challenge}}

How We Can Work Together
- Technology Partnership: Integrate your solutions with our platform
- Research Collaboration: Joint studies and publications
- Advisory Role: Guide our technology development
- Co-innovation: Develop new solutions together

Current Projects
- AI-powered clinical decision support
- Natural language processing for medical records
- Predictive analytics for patient outcomes
- Workflow automation and optimization

Explore Partnership Opportunities: https://ignitehealthsystems.com/partnerships?source=email&specialist={{email}}

Ready to collaborate on the future of healthcare technology?

Best regards,
Dr. Bhaven Murji
Founder, Ignite Health Systems

You're receiving this because you expressed interested in collaborating with Ignite Health Systems.
Unsubscribe: {{unsubscribeUrl}} | Visit our website: https://ignitehealthsystems.com
      `.trim(),
      requiredTokens: ['firstName', 'specialty', 'challenge', 'email', 'unsubscribeUrl'],
      optionalTokens: ['lastName'],
      userType: 'specialist'
    });

    // High-priority co-founder template
    this.templates.set('cofounder-priority', {
      name: 'Co-founder Priority Email',
      subject: 'Co-founder Opportunity - Ignite Health Systems [PRIORITY]',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #fff3cd;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); border-top: 5px solid #f39c12;">
              <div style="background-color: #f39c12; color: white; padding: 10px; margin: -30px -30px 20px -30px; border-radius: 10px 10px 0 0; text-align: center;">
                <strong>🚀 PRIORITY: CO-FOUNDER OPPORTUNITY</strong>
              </div>

              <h1 style="color: #d35400; margin-bottom: 20px;">{{firstName}}, Let's Build the Future of Healthcare Together!</h1>

              <p><strong>Your Challenge:</strong> {{challenge}}</p>

              <p>Your expertise in {{specialty}} and passion for healthcare transformation makes you an ideal co-founder candidate for Ignite Health Systems.</p>

              <div style="background-color: #fef9e7; padding: 20px; margin: 20px 0; border-radius: 5px; border: 2px solid #f39c12;">
                <h3 style="color: #d35400; margin-top: 0;">Co-founder Benefits</h3>
                <ul>
                  <li><strong>Equity Partnership:</strong> Significant ownership stake</li>
                  <li><strong>Leadership Role:</strong> Shape company direction and strategy</li>
                  <li><strong>Industry Impact:</strong> Transform healthcare for millions</li>
                  <li><strong>Financial Upside:</strong> Participate in company growth and success</li>
                </ul>
              </div>

              <div style="background-color: #e74c3c; color: white; padding: 15px; margin: 25px 0; border-radius: 5px; text-align: center;">
                <h3 style="margin: 0; color: white;">⏰ Limited Opportunity - Response Required Within 48 Hours</h3>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://ignitehealthsystems.com/cofounder-call?priority=true&contact={{email}}"
                   style="background-color: #e74c3c; color: white; padding: 20px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px;">
                  Schedule Immediate Call
                </a>
              </div>

              <p style="text-align: center;"><em>This is your opportunity to be part of something revolutionary. Let's discuss how we can build the future of healthcare together.</em></p>

              <p>Urgently yours,<br>
              Dr. Bhaven Murji<br>
              Founder, Ignite Health Systems<br>
              📱 Direct: Available for immediate call<br>
              📧 Priority Email: bhaven@ignitehealthsystems.com</p>

              <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
              <p style="font-size: 12px; color: #666;">
                This is a priority communication regarding co-founder opportunities.
                <a href="{{unsubscribeUrl}}">Unsubscribe</a> |
                <a href="https://ignitehealthsystems.com">Visit our website</a>
              </p>
            </div>
          </body>
        </html>
      `,
      text: `
🚀 PRIORITY: CO-FOUNDER OPPORTUNITY

{{firstName}}, Let's Build the Future of Healthcare Together!

Your Challenge: {{challenge}}

Your expertise in {{specialty}} and passion for healthcare transformation makes you an ideal co-founder candidate for Ignite Health Systems.

Co-founder Benefits:
- Equity Partnership: Significant ownership stake
- Leadership Role: Shape company direction and strategy
- Industry Impact: Transform healthcare for millions
- Financial Upside: Participate in company growth and success

⏰ LIMITED OPPORTUNITY - RESPONSE REQUIRED WITHIN 48 HOURS

Schedule Immediate Call: https://ignitehealthsystems.com/cofounder-call?priority=true&contact={{email}}

This is your opportunity to be part of something revolutionary. Let's discuss how we can build the future of healthcare together.

Urgently yours,
Dr. Bhaven Murji
Founder, Ignite Health Systems
📱 Direct: Available for immediate call
📧 Priority Email: bhaven@ignitehealthsystems.com

This is a priority communication regarding co-founder opportunities.
Unsubscribe: {{unsubscribeUrl}} | Visit our website: https://ignitehealthsystems.com
      `.trim(),
      requiredTokens: ['firstName', 'specialty', 'challenge', 'email', 'unsubscribeUrl'],
      optionalTokens: [],
      userType: 'any',
      priority: 'high'
    });
  }

  initializeRenderingRules() {
    // Global rendering rules
    this.renderingRules.set('global', {
      maxSubjectLength: 78,
      maxPreheaderLength: 90,
      minTextVersion: true,
      requireUnsubscribe: true,
      maxHtmlSize: 102400, // 100KB
      maxTextSize: 25600,  // 25KB
      allowedDomains: ['ignitehealthsystems.com', 'localhost'],
      requiredAltText: true
    });

    // User type specific rules
    this.renderingRules.set('physician', {
      tone: 'professional',
      personalityTokens: ['firstName', 'lastName', 'specialty', 'practiceModel'],
      ctaStyle: 'primary',
      maxEmailsPerDay: 2
    });

    this.renderingRules.set('investor', {
      tone: 'business',
      personalityTokens: ['firstName', 'lastName'],
      ctaStyle: 'success',
      maxEmailsPerDay: 1
    });

    this.renderingRules.set('specialist', {
      tone: 'collaborative',
      personalityTokens: ['firstName', 'specialty'],
      ctaStyle: 'info',
      maxEmailsPerDay: 3
    });
  }

  // Render template with user data
  renderTemplate(templateId, userData, options = {}) {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template '${templateId}' not found`);
    }

    // Validate user data contains required tokens
    const missingTokens = this.validateRequiredTokens(template, userData);
    if (missingTokens.length > 0) {
      throw new Error(`Missing required tokens: ${missingTokens.join(', ')}`);
    }

    // Prepare token replacements
    const tokens = this.prepareTokens(userData, options);

    // Render HTML version
    const htmlContent = this.replaceTokens(template.html, tokens);

    // Render text version
    const textContent = this.replaceTokens(template.text, tokens);

    // Render subject
    const subject = this.replaceTokens(template.subject, tokens);

    return {
      templateId,
      subject,
      html: htmlContent,
      text: textContent,
      metadata: {
        userType: userData.userType,
        renderTime: new Date().toISOString(),
        tokensUsed: Object.keys(tokens),
        templateName: template.name
      }
    };
  }

  // Validate rendered template
  validateRenderedTemplate(renderedTemplate, userData) {
    const errors = [];
    const warnings = [];
    const template = this.templates.get(renderedTemplate.templateId);

    if (!template) {
      errors.push('Template not found for validation');
      return { valid: false, errors, warnings };
    }

    // Check global rules
    const globalRules = this.renderingRules.get('global');

    // Subject length check
    if (renderedTemplate.subject.length > globalRules.maxSubjectLength) {
      warnings.push(`Subject line too long: ${renderedTemplate.subject.length}/${globalRules.maxSubjectLength} characters`);
    }

    // HTML size check
    if (renderedTemplate.html.length > globalRules.maxHtmlSize) {
      errors.push(`HTML content too large: ${renderedTemplate.html.length}/${globalRules.maxHtmlSize} bytes`);
    }

    // Text size check
    if (renderedTemplate.text.length > globalRules.maxTextSize) {
      errors.push(`Text content too large: ${renderedTemplate.text.length}/${globalRules.maxTextSize} bytes`);
    }

    // Check for unreplaced tokens
    const unReplacedTokens = this.findUnreplacedTokens(renderedTemplate.html);
    if (unReplacedTokens.length > 0) {
      errors.push(`Unreplaced tokens found: ${unReplacedTokens.join(', ')}`);
    }

    // Check unsubscribe link
    if (!renderedTemplate.html.toLowerCase().includes('unsubscribe') &&
        !renderedTemplate.text.toLowerCase().includes('unsubscribe')) {
      errors.push('Unsubscribe link missing from email');
    }

    // Check for broken links
    const brokenLinks = this.findBrokenLinks(renderedTemplate.html);
    if (brokenLinks.length > 0) {
      warnings.push(`Potentially broken links: ${brokenLinks.join(', ')}`);
    }

    // Check user type specific rules
    const userTypeRules = this.renderingRules.get(userData.userType);
    if (userTypeRules) {
      const toneCheck = this.validateTone(renderedTemplate.html, userTypeRules.tone);
      if (!toneCheck.valid) {
        warnings.push(`Tone validation: ${toneCheck.message}`);
      }
    }

    // Check accessibility
    const accessibilityIssues = this.checkAccessibility(renderedTemplate.html);
    if (accessibilityIssues.length > 0) {
      warnings.push(...accessibilityIssues);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      score: this.calculateValidationScore(errors, warnings)
    };
  }

  // Prepare tokens for replacement
  prepareTokens(userData, options = {}) {
    const tokens = {
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      userType: userData.userType || '',
      specialty: userData.specialty || userData.medicalSpecialty || '',
      practiceModel: userData.practiceModel || '',
      emrSystem: userData.emrSystem || userData.currentEMR || '',
      challenge: userData.challenge || '',
      linkedin: userData.linkedin || userData.linkedinProfile || '',
      unsubscribeUrl: options.unsubscribeUrl || `https://ignitehealthsystems.com/unsubscribe?email=${encodeURIComponent(userData.email || '')}`,
      baseUrl: options.baseUrl || 'https://ignitehealthsystems.com',
      timestamp: new Date().toISOString(),
      year: new Date().getFullYear().toString()
    };

    // Add computed tokens
    tokens.fullName = `${tokens.firstName} ${tokens.lastName}`.trim();
    tokens.greeting = tokens.firstName ? `${tokens.firstName}` : 'there';

    return tokens;
  }

  // Replace tokens in content
  replaceTokens(content, tokens) {
    let result = content;

    for (const [token, value] of Object.entries(tokens)) {
      const regex = new RegExp(`{{${token}}}`, 'g');
      result = result.replace(regex, value);
    }

    return result;
  }

  // Validate required tokens are present
  validateRequiredTokens(template, userData) {
    const missingTokens = [];

    for (const token of template.requiredTokens) {
      let value = null;

      switch (token) {
        case 'firstName':
          value = userData.firstName;
          break;
        case 'lastName':
          value = userData.lastName;
          break;
        case 'email':
          value = userData.email;
          break;
        case 'specialty':
          value = userData.specialty || userData.medicalSpecialty;
          break;
        case 'practiceModel':
          value = userData.practiceModel;
          break;
        case 'emrSystem':
          value = userData.emrSystem || userData.currentEMR;
          break;
        case 'challenge':
          value = userData.challenge;
          break;
        case 'unsubscribeUrl':
          value = 'auto-generated'; // Always available
          break;
        default:
          value = userData[token];
      }

      if (!value || value.trim() === '') {
        missingTokens.push(token);
      }
    }

    return missingTokens;
  }

  // Find unreplaced tokens in content
  findUnreplacedTokens(content) {
    const tokenRegex = /{{([^}]+)}}/g;
    const matches = [];
    let match;

    while ((match = tokenRegex.exec(content)) !== null) {
      matches.push(match[1]);
    }

    return [...new Set(matches)]; // Remove duplicates
  }

  // Find potentially broken links
  findBrokenLinks(htmlContent) {
    const linkRegex = /href=["']([^"']+)["']/g;
    const brokenLinks = [];
    let match;

    while ((match = linkRegex.exec(htmlContent)) !== null) {
      const url = match[1];

      // Check for obvious issues
      if (url.includes('{{') && url.includes('}}')) {
        brokenLinks.push(`Unreplaced token in URL: ${url}`);
      } else if (!url.startsWith('http') && !url.startsWith('mailto:') && !url.startsWith('#')) {
        brokenLinks.push(`Relative URL may be broken: ${url}`);
      } else if (url.includes('localhost') || url.includes('127.0.0.1')) {
        brokenLinks.push(`Localhost URL in production email: ${url}`);
      }
    }

    return brokenLinks;
  }

  // Validate tone
  validateTone(content, expectedTone) {
    const toneKeywords = {
      professional: ['professional', 'practice', 'clinical', 'medical', 'expertise', 'healthcare'],
      business: ['opportunity', 'investment', 'market', 'ROI', 'business', 'revenue', 'returns'],
      collaborative: ['partnership', 'collaboration', 'together', 'innovation', 'shared', 'work with'],
      urgent: ['immediate', 'urgent', 'priority', 'limited', 'now', 'quickly']
    };

    const contentLower = content.toLowerCase();
    const expectedKeywords = toneKeywords[expectedTone] || [];

    let matchCount = 0;
    for (const keyword of expectedKeywords) {
      if (contentLower.includes(keyword)) {
        matchCount++;
      }
    }

    const score = matchCount / expectedKeywords.length;

    return {
      valid: score >= 0.3, // At least 30% of tone keywords should be present
      score,
      message: score < 0.3 ? `Low tone match for '${expectedTone}': ${(score * 100).toFixed(1)}%` : 'Tone appropriate'
    };
  }

  // Check accessibility
  checkAccessibility(htmlContent) {
    const issues = [];

    // Check for images without alt text
    const imgRegex = /<img[^>]*>/g;
    const images = htmlContent.match(imgRegex) || [];

    for (const img of images) {
      if (!img.includes('alt=')) {
        issues.push('Image missing alt text');
      }
    }

    // Check for color contrast issues (basic check)
    if (htmlContent.includes('color: #fff') && !htmlContent.includes('background')) {
      issues.push('White text may have contrast issues');
    }

    // Check for table-based layouts
    if (htmlContent.includes('<table') && !htmlContent.includes('role=')) {
      issues.push('Table-based layout may have accessibility issues');
    }

    return issues;
  }

  // Calculate validation score
  calculateValidationScore(errors, warnings) {
    let score = 100;

    // Deduct points for errors and warnings
    score -= errors.length * 20; // 20 points per error
    score -= warnings.length * 5; // 5 points per warning

    return Math.max(0, score);
  }

  // Batch template validation
  validateTemplates(templateIds, userData) {
    const results = {};

    for (const templateId of templateIds) {
      try {
        const rendered = this.renderTemplate(templateId, userData);
        const validation = this.validateRenderedTemplate(rendered, userData);

        results[templateId] = {
          rendered,
          validation,
          success: true
        };
      } catch (error) {
        results[templateId] = {
          success: false,
          error: error.message
        };
      }
    }

    return results;
  }

  // Get template by user type
  getTemplateByUserType(userType, priority = 'standard') {
    for (const [templateId, template] of this.templates) {
      if (template.userType === userType || template.userType === 'any') {
        if (priority === 'high' && template.priority === 'high') {
          return templateId;
        } else if (priority === 'standard' && (!template.priority || template.priority === 'standard')) {
          return templateId;
        }
      }
    }

    return null;
  }

  // Preview template with sample data
  previewTemplate(templateId, sampleType = 'realistic') {
    const sampleData = this.generateSampleData(sampleType);
    return this.renderTemplate(templateId, sampleData);
  }

  // Generate sample data for testing
  generateSampleData(type = 'realistic') {
    const samples = {
      realistic: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        userType: 'physician',
        specialty: 'Family Medicine',
        practiceModel: 'independent',
        emrSystem: 'Epic',
        challenge: 'Spending too much time on documentation instead of patient care',
        linkedin: 'https://linkedin.com/in/johnsmith'
      },
      minimal: {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        userType: 'investor'
      },
      complete: {
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@hospital.com',
        userType: 'physician',
        specialty: 'Emergency Medicine',
        practiceModel: 'hospital-employed',
        emrSystem: 'Cerner',
        challenge: 'EMR system slows down patient care and causes burnout',
        linkedin: 'https://linkedin.com/in/sarahjohnsonmd'
      }
    };

    return samples[type] || samples.realistic;
  }

  // Get all available templates
  getAvailableTemplates() {
    return Array.from(this.templates.entries()).map(([id, template]) => ({
      id,
      name: template.name,
      userType: template.userType,
      priority: template.priority || 'standard',
      requiredTokens: template.requiredTokens,
      optionalTokens: template.optionalTokens
    }));
  }

  // Reset validation state
  reset() {
    // Templates and rules are immutable, so no reset needed
  }
}

module.exports = {
  TemplateValidator
};