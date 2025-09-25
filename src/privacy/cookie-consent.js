/**
 * GDPR & HIPAA Compliant Cookie Consent Management
 * Ignite Health Systems - Healthcare Privacy Implementation
 *
 * Implements:
 * - GDPR Article 7: Conditions for consent
 * - GDPR Article 21: Right to object
 * - HIPAA Privacy Rule: Individual rights and authorizations
 * - CCPA: Right to opt-out of sale of personal information
 */

/**
 * Cookie Categories for Healthcare Applications
 */
const COOKIE_CATEGORIES = {
  STRICTLY_NECESSARY: {
    id: 'strictly-necessary',
    name: 'Strictly Necessary',
    description: 'Essential for website functionality and security. Cannot be disabled.',
    required: true,
    legal_basis: 'legitimate_interest',
    examples: ['Session management', 'Security tokens', 'Load balancing']
  },

  FUNCTIONAL: {
    id: 'functional',
    name: 'Functional',
    description: 'Enable personalized features and remember your preferences.',
    required: false,
    legal_basis: 'consent',
    examples: ['Language preferences', 'Accessibility settings', 'Form data']
  },

  ANALYTICS: {
    id: 'analytics',
    name: 'Analytics',
    description: 'Help us understand how our website is used to improve user experience.',
    required: false,
    legal_basis: 'consent',
    examples: ['Google Analytics', 'Performance monitoring', 'Usage statistics']
  },

  MARKETING: {
    id: 'marketing',
    name: 'Marketing',
    description: 'Used for personalized content and targeted communications.',
    required: false,
    legal_basis: 'consent',
    examples: ['Email campaigns', 'Personalized content', 'Social media integration']
  },

  HEALTHCARE: {
    id: 'healthcare',
    name: 'Healthcare Services',
    description: 'Support healthcare-specific functionality and secure patient communications.',
    required: false,
    legal_basis: 'consent',
    examples: ['Patient portal access', 'Appointment scheduling', 'Clinical integrations']
  }
};

/**
 * Privacy Regulations Configuration
 */
const PRIVACY_REGULATIONS = {
  GDPR: {
    applies_to: ['EU', 'EEA'],
    consent_requirements: ['explicit', 'informed', 'freely_given', 'specific'],
    withdrawal_rights: true,
    data_portability: true
  },

  CCPA: {
    applies_to: ['California'],
    opt_out_rights: true,
    do_not_sell: true,
    disclosure_requirements: true
  },

  HIPAA: {
    applies_to: ['Healthcare'],
    authorization_required: true,
    minimum_necessary: true,
    right_to_revoke: true
  }
};

/**
 * Healthcare Cookie Consent Manager
 */
class HealthcareCookieConsent {
  constructor(options = {}) {
    this.domain = options.domain || window.location.hostname;
    this.cookieName = options.cookieName || '_ighs_consent';
    this.consentDuration = options.consentDuration || 365; // days
    this.showBanner = options.showBanner !== false;
    this.hipaaMode = options.hipaaMode || process.env.NEXT_PUBLIC_HIPAA_COMPLIANT === 'true';

    // Initialize consent state
    this.consentState = this.loadConsentState();

    // Event handlers
    this.onConsentChange = options.onConsentChange || (() => {});
    this.onRegulatoryCompliance = options.onRegulatoryCompliance || (() => {});

    // Initialize UI if not already shown
    if (this.showBanner && !this.hasValidConsent()) {
      this.initializeUI();
    }

    // Apply current consent
    this.applyConsent();

    // Check for regulatory compliance
    this.checkRegulatoryCompliance();
  }

  /**
   * Initialize cookie consent UI
   */
  initializeUI() {
    if (document.getElementById('cookie-consent-banner')) {
      return; // Already initialized
    }

    const banner = this.createConsentBanner();
    document.body.appendChild(banner);

    // Add modal for detailed settings
    const modal = this.createConsentModal();
    document.body.appendChild(modal);

    // Add required CSS
    this.injectStyles();
  }

  /**
   * Create consent banner HTML
   */
  createConsentBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.className = 'cookie-consent-banner';

    const isHealthcare = this.hipaaMode;

    banner.innerHTML = `
      <div class="cookie-banner-container">
        <div class="cookie-banner-content">
          <div class="cookie-banner-icon">
            ${isHealthcare ? '🏥' : '🍪'}
          </div>

          <div class="cookie-banner-text">
            <h3>${isHealthcare ? 'Healthcare Privacy Notice' : 'Cookie Consent'}</h3>
            <p>
              ${isHealthcare
                ? 'This healthcare website uses cookies to provide secure, personalized services while protecting your medical information privacy. We comply with HIPAA and other healthcare regulations.'
                : 'This website uses cookies to enhance your experience, provide personalized content, and analyze our traffic.'
              }
            </p>

            ${isHealthcare ? `
              <div class="healthcare-notice">
                <strong>Important:</strong> By using this site, you acknowledge our
                <a href="/privacy-policy" target="_blank">Healthcare Privacy Policy</a> and
                <a href="/hipaa-notice" target="_blank">HIPAA Notice of Privacy Practices</a>.
              </div>
            ` : ''}
          </div>
        </div>

        <div class="cookie-banner-actions">
          <button class="btn btn-secondary" onclick="window.cookieConsent.showSettings()">
            Customize Settings
          </button>
          <button class="btn btn-outline" onclick="window.cookieConsent.rejectAll()">
            ${isHealthcare ? 'Decline Optional' : 'Reject All'}
          </button>
          <button class="btn btn-primary" onclick="window.cookieConsent.acceptAll()">
            ${isHealthcare ? 'Accept & Continue' : 'Accept All'}
          </button>
        </div>
      </div>
    `;

    return banner;
  }

  /**
   * Create detailed consent modal
   */
  createConsentModal() {
    const modal = document.createElement('div');
    modal.id = 'cookie-consent-modal';
    modal.className = 'cookie-consent-modal';
    modal.style.display = 'none';

    const categoriesHTML = Object.values(COOKIE_CATEGORIES).map(category => `
      <div class="cookie-category">
        <div class="cookie-category-header">
          <label class="cookie-toggle">
            <input
              type="checkbox"
              id="consent-${category.id}"
              ${category.required ? 'checked disabled' : ''}
              ${this.consentState.categories[category.id] ? 'checked' : ''}
            />
            <span class="cookie-toggle-switch"></span>
            <span class="cookie-category-name">${category.name}</span>
            ${category.required ? '<span class="required-badge">Required</span>' : ''}
          </label>
        </div>

        <div class="cookie-category-description">
          <p>${category.description}</p>

          <div class="cookie-category-details">
            <strong>Legal Basis:</strong> ${this.formatLegalBasis(category.legal_basis)}
            <br>
            <strong>Examples:</strong> ${category.examples.join(', ')}
          </div>

          ${category.id === 'healthcare' ? `
            <div class="healthcare-category-notice">
              <strong>HIPAA Notice:</strong> Healthcare cookies may process Protected Health Information (PHI)
              to provide clinical services. Your authorization can be withdrawn at any time.
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');

    modal.innerHTML = `
      <div class="cookie-modal-backdrop" onclick="window.cookieConsent.hideSettings()"></div>
      <div class="cookie-modal-content">
        <div class="cookie-modal-header">
          <h2>${this.hipaaMode ? 'Healthcare Privacy Settings' : 'Cookie Preferences'}</h2>
          <button class="cookie-modal-close" onclick="window.cookieConsent.hideSettings()">&times;</button>
        </div>

        <div class="cookie-modal-body">
          <div class="privacy-intro">
            ${this.hipaaMode ? `
              <p><strong>Your Healthcare Privacy Rights:</strong></p>
              <ul>
                <li>Right to access and review your information</li>
                <li>Right to request amendments to your records</li>
                <li>Right to withdraw consent at any time</li>
                <li>Right to file privacy complaints</li>
              </ul>
            ` : `
              <p>We respect your privacy and give you control over your data. Choose which cookies you're comfortable with:</p>
            `}
          </div>

          <div class="cookie-categories">
            ${categoriesHTML}
          </div>

          <div class="privacy-links">
            <h4>Additional Information:</h4>
            <ul>
              <li><a href="/privacy-policy" target="_blank">Privacy Policy</a></li>
              ${this.hipaaMode ? '<li><a href="/hipaa-notice" target="_blank">HIPAA Notice of Privacy Practices</a></li>' : ''}
              <li><a href="/cookie-policy" target="_blank">Cookie Policy</a></li>
              <li><a href="/data-retention" target="_blank">Data Retention Policy</a></li>
            </ul>
          </div>
        </div>

        <div class="cookie-modal-footer">
          <div class="consent-timestamp">
            ${this.consentState.timestamp ?
              `Last updated: ${new Date(this.consentState.timestamp).toLocaleString()}` :
              'No consent recorded'
            }
          </div>

          <div class="modal-actions">
            <button class="btn btn-outline" onclick="window.cookieConsent.rejectAll()">
              Reject Optional
            </button>
            <button class="btn btn-secondary" onclick="window.cookieConsent.saveSettings()">
              Save Settings
            </button>
            <button class="btn btn-primary" onclick="window.cookieConsent.acceptAll()">
              Accept All
            </button>
          </div>
        </div>
      </div>
    `;

    return modal;
  }

  /**
   * Format legal basis for display
   */
  formatLegalBasis(basis) {
    const descriptions = {
      'consent': 'Your explicit consent',
      'legitimate_interest': 'Legitimate business interest',
      'contract': 'Necessary for contract performance',
      'legal_obligation': 'Required by law'
    };

    return descriptions[basis] || basis;
  }

  /**
   * Accept all cookies
   */
  acceptAll() {
    const newConsent = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      categories: {},
      userAgent: navigator.userAgent,
      ipHash: this.hashIP(),
      regulations: this.getApplicableRegulations()
    };

    // Set all categories to true
    Object.keys(COOKIE_CATEGORIES).forEach(categoryKey => {
      const category = COOKIE_CATEGORIES[categoryKey];
      newConsent.categories[category.id] = true;
    });

    this.saveConsentState(newConsent);
    this.applyConsent();
    this.hideBanner();
    this.hideSettings();

    // Log consent for audit purposes
    this.logConsentEvent('ACCEPT_ALL', newConsent);
  }

  /**
   * Reject all optional cookies
   */
  rejectAll() {
    const newConsent = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      categories: {},
      userAgent: navigator.userAgent,
      ipHash: this.hashIP(),
      regulations: this.getApplicableRegulations()
    };

    // Only required cookies
    Object.keys(COOKIE_CATEGORIES).forEach(categoryKey => {
      const category = COOKIE_CATEGORIES[categoryKey];
      newConsent.categories[category.id] = category.required;
    });

    this.saveConsentState(newConsent);
    this.applyConsent();
    this.hideBanner();
    this.hideSettings();

    // Log consent for audit purposes
    this.logConsentEvent('REJECT_ALL', newConsent);
  }

  /**
   * Save custom settings from modal
   */
  saveSettings() {
    const newConsent = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      categories: {},
      userAgent: navigator.userAgent,
      ipHash: this.hashIP(),
      regulations: this.getApplicableRegulations()
    };

    // Read checkbox states
    Object.keys(COOKIE_CATEGORIES).forEach(categoryKey => {
      const category = COOKIE_CATEGORIES[categoryKey];
      const checkbox = document.getElementById(`consent-${category.id}`);
      newConsent.categories[category.id] = checkbox ? checkbox.checked : category.required;
    });

    this.saveConsentState(newConsent);
    this.applyConsent();
    this.hideBanner();
    this.hideSettings();

    // Log consent for audit purposes
    this.logConsentEvent('SAVE_SETTINGS', newConsent);
  }

  /**
   * Show settings modal
   */
  showSettings() {
    const modal = document.getElementById('cookie-consent-modal');
    if (modal) {
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  }

  /**
   * Hide settings modal
   */
  hideSettings() {
    const modal = document.getElementById('cookie-consent-modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  /**
   * Hide consent banner
   */
  hideBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.style.display = 'none';
    }
  }

  /**
   * Apply current consent settings
   */
  applyConsent() {
    if (!this.hasValidConsent()) {
      return;
    }

    // Apply analytics consent
    if (this.consentState.categories.analytics) {
      this.enableAnalytics();
    } else {
      this.disableAnalytics();
    }

    // Apply marketing consent
    if (this.consentState.categories.marketing) {
      this.enableMarketing();
    } else {
      this.disableMarketing();
    }

    // Apply healthcare consent
    if (this.consentState.categories.healthcare) {
      this.enableHealthcareServices();
    } else {
      this.disableHealthcareServices();
    }

    // Notify listeners
    this.onConsentChange(this.consentState);
  }

  /**
   * Enable analytics tracking
   */
  enableAnalytics() {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }

    // Set analytics cookie
    this.setCookie('_analytics_enabled', 'true', this.consentDuration);
  }

  /**
   * Disable analytics tracking
   */
  disableAnalytics() {
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }

    // Remove analytics cookies
    this.deleteCookie('_analytics_enabled');
    this.deleteCookiesByPattern(/^_ga/);
  }

  /**
   * Enable marketing features
   */
  enableMarketing() {
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted'
      });
    }

    this.setCookie('_marketing_enabled', 'true', this.consentDuration);
  }

  /**
   * Disable marketing features
   */
  disableMarketing() {
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
    }

    this.deleteCookie('_marketing_enabled');
  }

  /**
   * Enable healthcare-specific services
   */
  enableHealthcareServices() {
    // Enable patient portal features
    this.setCookie('_healthcare_services', 'enabled', this.consentDuration);

    // Initialize healthcare tracking (HIPAA-compliant)
    if (window.healthcareTracker) {
      window.healthcareTracker.enable();
    }
  }

  /**
   * Disable healthcare-specific services
   */
  disableHealthcareServices() {
    this.deleteCookie('_healthcare_services');

    if (window.healthcareTracker) {
      window.healthcareTracker.disable();
    }
  }

  /**
   * Load consent state from storage
   */
  loadConsentState() {
    try {
      const stored = localStorage.getItem(this.cookieName);
      if (stored) {
        const parsed = JSON.parse(stored);

        // Validate consent is still valid
        if (this.isConsentValid(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to load consent state:', error);
    }

    // Return default state
    return {
      version: '1.0',
      timestamp: null,
      categories: {},
      regulations: []
    };
  }

  /**
   * Save consent state to storage
   */
  saveConsentState(consent) {
    try {
      localStorage.setItem(this.cookieName, JSON.stringify(consent));
      this.consentState = consent;

      // Also save to cookie for server-side access
      this.setCookie(this.cookieName, JSON.stringify(consent), this.consentDuration);
    } catch (error) {
      console.error('Failed to save consent state:', error);
    }
  }

  /**
   * Check if current consent is valid
   */
  hasValidConsent() {
    return this.consentState.timestamp && this.isConsentValid(this.consentState);
  }

  /**
   * Validate consent object
   */
  isConsentValid(consent) {
    if (!consent || !consent.timestamp) {
      return false;
    }

    // Check if consent has expired
    const consentDate = new Date(consent.timestamp);
    const expiryDate = new Date(consentDate.getTime() + (this.consentDuration * 24 * 60 * 60 * 1000));

    return new Date() < expiryDate;
  }

  /**
   * Get applicable privacy regulations based on location
   */
  getApplicableRegulations() {
    const regulations = [];

    // Simple geolocation detection (in production, use proper geolocation service)
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language || navigator.userLanguage;

    // GDPR detection
    if (this.isEuropeanUser(timezone, language)) {
      regulations.push('GDPR');
    }

    // CCPA detection
    if (this.isCaliforniaUser(timezone)) {
      regulations.push('CCPA');
    }

    // HIPAA always applies for healthcare sites
    if (this.hipaaMode) {
      regulations.push('HIPAA');
    }

    return regulations;
  }

  /**
   * Detect European users (simplified)
   */
  isEuropeanUser(timezone, language) {
    const europeanTimezones = [
      'Europe/London', 'Europe/Berlin', 'Europe/Paris', 'Europe/Rome',
      'Europe/Madrid', 'Europe/Amsterdam', 'Europe/Vienna', 'Europe/Stockholm'
    ];

    const europeanLanguages = ['de', 'fr', 'es', 'it', 'nl', 'sv', 'da', 'no'];

    return europeanTimezones.some(tz => timezone.includes(tz)) ||
           europeanLanguages.some(lang => language.toLowerCase().startsWith(lang));
  }

  /**
   * Detect California users (simplified)
   */
  isCaliforniaUser(timezone) {
    return timezone.includes('America/Los_Angeles') || timezone.includes('America/Tijuana');
  }

  /**
   * Check regulatory compliance
   */
  checkRegulatoryCompliance() {
    const applicableRegulations = this.getApplicableRegulations();
    const complianceStatus = {};

    applicableRegulations.forEach(regulation => {
      complianceStatus[regulation] = this.checkRegulationCompliance(regulation);
    });

    this.onRegulatoryCompliance(complianceStatus);

    return complianceStatus;
  }

  /**
   * Check compliance with specific regulation
   */
  checkRegulationCompliance(regulation) {
    switch (regulation) {
      case 'GDPR':
        return this.checkGDPRCompliance();
      case 'CCPA':
        return this.checkCCPACompliance();
      case 'HIPAA':
        return this.checkHIPAACompliance();
      default:
        return { compliant: true, issues: [] };
    }
  }

  /**
   * Check GDPR compliance
   */
  checkGDPRCompliance() {
    const issues = [];

    if (!this.hasValidConsent()) {
      issues.push('No valid consent recorded');
    }

    if (!this.consentState.timestamp) {
      issues.push('Consent timestamp missing');
    }

    // Check for required elements
    const requiredElements = ['privacy-policy', 'cookie-policy', 'data-retention'];
    requiredElements.forEach(element => {
      if (!document.querySelector(`a[href*="${element}"]`)) {
        issues.push(`Missing ${element} link`);
      }
    });

    return {
      compliant: issues.length === 0,
      issues: issues,
      regulation: 'GDPR'
    };
  }

  /**
   * Check CCPA compliance
   */
  checkCCPACompliance() {
    const issues = [];

    // Check for "Do Not Sell" option
    if (!document.querySelector('[data-ccpa-opt-out]')) {
      issues.push('Missing "Do Not Sell My Personal Information" option');
    }

    return {
      compliant: issues.length === 0,
      issues: issues,
      regulation: 'CCPA'
    };
  }

  /**
   * Check HIPAA compliance
   */
  checkHIPAACompliance() {
    const issues = [];

    if (this.hipaaMode) {
      // Check for required healthcare notices
      if (!document.querySelector('a[href*="hipaa-notice"]')) {
        issues.push('Missing HIPAA Notice of Privacy Practices');
      }

      if (!document.querySelector('a[href*="healthcare-privacy"]')) {
        issues.push('Missing Healthcare Privacy Policy');
      }
    }

    return {
      compliant: issues.length === 0,
      issues: issues,
      regulation: 'HIPAA'
    };
  }

  /**
   * Log consent events for audit trail
   */
  logConsentEvent(action, consentData) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: action,
      consentVersion: consentData.version,
      categories: consentData.categories,
      userAgent: navigator.userAgent,
      url: window.location.href,
      ipHash: this.hashIP(),
      regulations: consentData.regulations
    };

    // In production, send to audit logging system
    console.log('Consent Event:', logEntry);

    // Send to analytics (if consented)
    if (this.consentState.categories.analytics && typeof gtag !== 'undefined') {
      gtag('event', 'consent_update', {
        consent_action: action,
        consent_categories: Object.keys(consentData.categories).filter(k => consentData.categories[k])
      });
    }
  }

  /**
   * Generate hash of IP address for privacy
   */
  hashIP() {
    // In production, get real IP and hash it securely
    return 'hashed_ip_placeholder';
  }

  /**
   * Withdraw all consent
   */
  withdrawConsent() {
    const withdrawalConsent = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      categories: {},
      withdrawn: true,
      regulations: this.getApplicableRegulations()
    };

    // Only keep required cookies
    Object.keys(COOKIE_CATEGORIES).forEach(categoryKey => {
      const category = COOKIE_CATEGORIES[categoryKey];
      withdrawalConsent.categories[category.id] = category.required;
    });

    this.saveConsentState(withdrawalConsent);
    this.applyConsent();
    this.logConsentEvent('WITHDRAW_CONSENT', withdrawalConsent);

    // Show confirmation message
    this.showWithdrawalConfirmation();
  }

  /**
   * Show consent withdrawal confirmation
   */
  showWithdrawalConfirmation() {
    const notification = document.createElement('div');
    notification.className = 'consent-withdrawal-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <h4>Consent Withdrawn</h4>
        <p>Your consent has been withdrawn. Only essential cookies remain active.</p>
        <button onclick="this.parentElement.parentElement.remove()">OK</button>
      </div>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  /**
   * Utility: Set cookie
   */
  setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));

    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
  }

  /**
   * Utility: Delete cookie
   */
  deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  /**
   * Utility: Delete cookies by pattern
   */
  deleteCookiesByPattern(pattern) {
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      if (pattern.test(name)) {
        this.deleteCookie(name);
      }
    });
  }

  /**
   * Inject required CSS styles
   */
  injectStyles() {
    if (document.getElementById('cookie-consent-styles')) {
      return; // Already injected
    }

    const styles = document.createElement('style');
    styles.id = 'cookie-consent-styles';
    styles.textContent = `
      .cookie-consent-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #fff;
        border-top: 3px solid #e11d48;
        box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .cookie-banner-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 20px;
        flex-wrap: wrap;
      }

      .cookie-banner-content {
        display: flex;
        align-items: flex-start;
        gap: 15px;
        flex: 1;
      }

      .cookie-banner-icon {
        font-size: 2rem;
        flex-shrink: 0;
      }

      .cookie-banner-text h3 {
        margin: 0 0 8px 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: #1f2937;
      }

      .cookie-banner-text p {
        margin: 0;
        color: #6b7280;
        line-height: 1.5;
        font-size: 0.9rem;
      }

      .healthcare-notice {
        margin-top: 8px;
        padding: 8px;
        background: #fef3c7;
        border-left: 3px solid #f59e0b;
        font-size: 0.85rem;
      }

      .healthcare-notice a {
        color: #d97706;
        text-decoration: underline;
      }

      .cookie-banner-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-primary {
        background: #e11d48;
        color: white;
      }

      .btn-primary:hover {
        background: #be185d;
      }

      .btn-secondary {
        background: #f3f4f6;
        color: #374151;
      }

      .btn-secondary:hover {
        background: #e5e7eb;
      }

      .btn-outline {
        background: transparent;
        color: #6b7280;
        border: 1px solid #d1d5db;
      }

      .btn-outline:hover {
        background: #f9fafb;
      }

      .cookie-consent-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10001;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .cookie-modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
      }

      .cookie-modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 8px;
        box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        max-width: 600px;
        width: 90vw;
        max-height: 80vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      .cookie-modal-header {
        padding: 20px;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .cookie-modal-header h2 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: #1f2937;
      }

      .cookie-modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #6b7280;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .cookie-modal-body {
        padding: 20px;
        overflow-y: auto;
        flex: 1;
      }

      .cookie-categories {
        margin: 20px 0;
      }

      .cookie-category {
        margin-bottom: 20px;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        overflow: hidden;
      }

      .cookie-category-header {
        background: #f9fafb;
        padding: 15px;
        border-bottom: 1px solid #e5e7eb;
      }

      .cookie-toggle {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        font-weight: 500;
      }

      .cookie-toggle input[type="checkbox"] {
        display: none;
      }

      .cookie-toggle-switch {
        width: 40px;
        height: 20px;
        background: #d1d5db;
        border-radius: 10px;
        position: relative;
        transition: background 0.2s;
      }

      .cookie-toggle-switch::after {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        width: 16px;
        height: 16px;
        background: white;
        border-radius: 50%;
        transition: transform 0.2s;
      }

      .cookie-toggle input:checked + .cookie-toggle-switch {
        background: #10b981;
      }

      .cookie-toggle input:checked + .cookie-toggle-switch::after {
        transform: translateX(20px);
      }

      .cookie-toggle input:disabled + .cookie-toggle-switch {
        background: #9ca3af;
        cursor: not-allowed;
      }

      .required-badge {
        background: #fbbf24;
        color: #92400e;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 500;
      }

      .cookie-category-description {
        padding: 15px;
      }

      .cookie-category-details {
        margin-top: 10px;
        font-size: 0.85rem;
        color: #6b7280;
      }

      .healthcare-category-notice {
        margin-top: 10px;
        padding: 10px;
        background: #ecfdf5;
        border: 1px solid #a7f3d0;
        border-radius: 4px;
        font-size: 0.85rem;
        color: #047857;
      }

      .cookie-modal-footer {
        padding: 20px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
      }

      .consent-timestamp {
        font-size: 0.8rem;
        color: #6b7280;
      }

      .modal-actions {
        display: flex;
        gap: 10px;
      }

      .consent-withdrawal-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 20px;
        border-radius: 6px;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        z-index: 10002;
      }

      .notification-content h4 {
        margin: 0 0 5px 0;
        font-size: 1rem;
        font-weight: 600;
      }

      .notification-content p {
        margin: 0 0 10px 0;
        font-size: 0.9rem;
      }

      .notification-content button {
        background: rgba(255,255,255,0.2);
        color: white;
        border: 1px solid rgba(255,255,255,0.3);
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
      }

      @media (max-width: 768px) {
        .cookie-banner-container {
          flex-direction: column;
          align-items: stretch;
        }

        .cookie-banner-actions {
          justify-content: stretch;
        }

        .cookie-banner-actions .btn {
          flex: 1;
          text-align: center;
        }

        .cookie-modal-content {
          width: 95vw;
          max-height: 90vh;
        }

        .cookie-modal-footer {
          flex-direction: column;
          align-items: stretch;
        }

        .modal-actions {
          width: 100%;
        }

        .modal-actions .btn {
          flex: 1;
        }
      }
    `;

    document.head.appendChild(styles);
  }
}

// Initialize global instance
window.cookieConsent = null;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.cookieConsent = new HealthcareCookieConsent();
  });
} else {
  window.cookieConsent = new HealthcareCookieConsent();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    HealthcareCookieConsent,
    COOKIE_CATEGORIES,
    PRIVACY_REGULATIONS
  };
}