/**
 * Ignite Health Systems - Form Optimization & Conversion Enhancement
 * Advanced form handling with real-time validation and conversion tracking
 */

(function() {
    'use strict';

    // Configuration
    const config = {
        autoSaveInterval: 5000, // Auto-save every 5 seconds
        progressThreshold: 25, // Show progress after 25% completion
        validationDelay: 500, // Delay before showing validation
        successRedirectDelay: 3000,
        animations: true
    };

    // Form state management
    const FormState = {
        data: {},
        progress: 0,
        startTime: null,
        interactions: 0,
        fieldsFocused: new Set(),
        errors: new Map(),
        isSubmitting: false
    };

    /**
     * Initialize form optimization
     */
    function init() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            optimizeForm(form);
        });
    }

    /**
     * Optimize individual form
     */
    function optimizeForm(form) {
        // Add progress indicator
        addProgressIndicator(form);
        
        // Add field enhancements
        enhanceFormFields(form);
        
        // Add real-time validation
        addRealTimeValidation(form);
        
        // Add auto-save functionality
        initAutoSave(form);
        
        // Add conversion tracking
        addConversionTracking(form);
        
        // Add smart submit handling
        enhanceSubmitButton(form);
        
        // Add field assistance
        addFieldAssistance(form);
        
        // Track form start time
        FormState.startTime = Date.now();
    }

    /**
     * Add visual progress indicator
     */
    function addProgressIndicator(form) {
        const progressBar = document.createElement('div');
        progressBar.className = 'form-progress-bar';
        progressBar.innerHTML = `
            <div class="progress-track">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
            <div class="progress-text">
                <span class="progress-percentage">0%</span> Complete
            </div>
        `;
        
        form.insertBefore(progressBar, form.firstChild);
        
        // Update progress on field change
        form.addEventListener('input', () => {
            updateProgress(form);
        });
    }

    /**
     * Calculate and update form progress
     */
    function updateProgress(form) {
        const requiredFields = form.querySelectorAll('[required]');
        const filledFields = Array.from(requiredFields).filter(field => {
            if (field.type === 'checkbox' || field.type === 'radio') {
                return field.checked;
            }
            return field.value.trim() !== '';
        });
        
        const progress = Math.round((filledFields.length / requiredFields.length) * 100);
        FormState.progress = progress;
        
        const progressFill = form.querySelector('.progress-fill');
        const progressText = form.querySelector('.progress-percentage');
        
        if (progressFill && progressText) {
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${progress}%`;
            
            // Add completion animation
            if (progress === 100 && config.animations) {
                progressFill.classList.add('complete');
                setTimeout(() => {
                    progressFill.classList.remove('complete');
                }, 1000);
            }
        }
        
        // Show encouraging messages at milestones
        showProgressMessage(progress);
    }

    /**
     * Show encouraging messages at progress milestones
     */
    function showProgressMessage(progress) {
        const messages = {
            25: "Great start! You're making progress.",
            50: "Halfway there! Keep going.",
            75: "Almost done! Just a few more fields.",
            100: "Perfect! Your form is complete."
        };
        
        if (messages[progress] && !FormState.progressMessageShown?.[progress]) {
            showToast(messages[progress], 'success');
            FormState.progressMessageShown = FormState.progressMessageShown || {};
            FormState.progressMessageShown[progress] = true;
        }
    }

    /**
     * Enhance form fields with better UX
     */
    function enhanceFormFields(form) {
        const fields = form.querySelectorAll('input, textarea, select');
        
        fields.forEach(field => {
            // Add floating labels
            addFloatingLabel(field);
            
            // Add input formatting
            addInputFormatting(field);
            
            // Add field focus tracking
            field.addEventListener('focus', () => {
                FormState.fieldsFocused.add(field.name);
                FormState.interactions++;
                field.parentElement.classList.add('focused');
            });
            
            field.addEventListener('blur', () => {
                field.parentElement.classList.remove('focused');
                if (field.value) {
                    field.parentElement.classList.add('filled');
                }
            });
            
            // Add smooth transitions
            field.style.transition = 'all 0.3s ease';
        });
    }

    /**
     * Add floating label effect
     */
    function addFloatingLabel(field) {
        const label = field.parentElement.querySelector('label');
        if (!label) return;
        
        // Check if field has value on load
        if (field.value) {
            field.parentElement.classList.add('filled');
        }
        
        // Add floating class to parent
        field.parentElement.classList.add('floating-label-group');
    }

    /**
     * Add input formatting for specific field types
     */
    function addInputFormatting(field) {
        // Phone number formatting
        if (field.type === 'tel' || field.name.includes('phone')) {
            field.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value.length <= 3) {
                        value = `(${value}`;
                    } else if (value.length <= 6) {
                        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                    } else {
                        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                    }
                }
                e.target.value = value;
            });
        }
        
        // Email validation with suggestions
        if (field.type === 'email') {
            addEmailSuggestions(field);
        }
    }

    /**
     * Add email domain suggestions
     */
    function addEmailSuggestions(field) {
        const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
        const suggestionList = document.createElement('div');
        suggestionList.className = 'email-suggestions';
        field.parentElement.appendChild(suggestionList);
        
        field.addEventListener('input', (e) => {
            const value = e.target.value;
            const atIndex = value.indexOf('@');
            
            if (atIndex > 0 && value.length > atIndex + 1) {
                const domain = value.substring(atIndex + 1);
                const suggestions = commonDomains.filter(d => 
                    d.startsWith(domain) && d !== domain
                );
                
                if (suggestions.length > 0) {
                    suggestionList.innerHTML = suggestions.map(s => 
                        `<div class="suggestion" data-domain="${s}">
                            ${value.substring(0, atIndex + 1)}${s}
                        </div>`
                    ).join('');
                    suggestionList.style.display = 'block';
                    
                    // Add click handlers
                    suggestionList.querySelectorAll('.suggestion').forEach(sug => {
                        sug.addEventListener('click', () => {
                            field.value = sug.textContent.trim();
                            suggestionList.style.display = 'none';
                            field.focus();
                        });
                    });
                } else {
                    suggestionList.style.display = 'none';
                }
            } else {
                suggestionList.style.display = 'none';
            }
        });
    }

    /**
     * Add real-time validation
     */
    function addRealTimeValidation(form) {
        const fields = form.querySelectorAll('[required]');
        
        fields.forEach(field => {
            let validationTimer;
            
            field.addEventListener('input', () => {
                clearTimeout(validationTimer);
                validationTimer = setTimeout(() => {
                    validateField(field);
                }, config.validationDelay);
            });
            
            field.addEventListener('blur', () => {
                validateField(field, true);
            });
        });
    }

    /**
     * Validate individual field
     */
    function validateField(field, showError = false) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Phone validation
        if ((field.type === 'tel' || field.name.includes('phone')) && value) {
            const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
            if (!phoneRegex.test(value.replace(/\D/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        
        // Update field state
        if (isValid) {
            field.classList.remove('error');
            field.classList.add('valid');
            FormState.errors.delete(field.name);
            hideFieldError(field);
        } else if (showError) {
            field.classList.add('error');
            field.classList.remove('valid');
            FormState.errors.set(field.name, errorMessage);
            showFieldError(field, errorMessage);
        }
        
        return isValid;
    }

    /**
     * Show field error message
     */
    function showFieldError(field, message) {
        let errorElement = field.parentElement.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentElement.appendChild(errorElement);
        }
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    /**
     * Hide field error message
     */
    function hideFieldError(field) {
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    /**
     * Initialize auto-save functionality
     */
    function initAutoSave(form) {
        // Load saved data
        loadSavedData(form);
        
        // Save on input
        form.addEventListener('input', () => {
            saveFormData(form);
        });
        
        // Periodic auto-save
        setInterval(() => {
            if (FormState.interactions > 0) {
                saveFormData(form);
                showToast('Progress saved', 'info', 1000);
            }
        }, config.autoSaveInterval);
    }

    /**
     * Save form data to localStorage
     */
    function saveFormData(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        FormState.data = data;
        localStorage.setItem(`ignite_form_${form.id}`, JSON.stringify(data));
    }

    /**
     * Load saved form data
     */
    function loadSavedData(form) {
        const savedData = localStorage.getItem(`ignite_form_${form.id}`);
        if (!savedData) return;
        
        try {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field) {
                    field.value = data[key];
                    if (field.value) {
                        field.parentElement.classList.add('filled');
                    }
                }
            });
            
            updateProgress(form);
            showToast('Your progress has been restored', 'success');
        } catch (e) {
            console.error('Error loading saved data:', e);
        }
    }

    /**
     * Add conversion tracking
     */
    function addConversionTracking(form) {
        // Track form abandonment
        window.addEventListener('beforeunload', (e) => {
            if (FormState.progress > 0 && FormState.progress < 100 && !FormState.isSubmitting) {
                // Track abandonment
                trackEvent('form_abandoned', {
                    progress: FormState.progress,
                    timeSpent: Date.now() - FormState.startTime,
                    fieldsCompleted: FormState.fieldsFocused.size
                });
            }
        });
        
        // Track field interactions
        form.addEventListener('focus', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                trackEvent('field_focused', {
                    fieldName: e.target.name,
                    fieldType: e.target.type
                });
            }
        }, true);
    }

    /**
     * Enhance submit button
     */
    function enhanceSubmitButton(form) {
        const submitBtn = form.querySelector('[type="submit"]');
        if (!submitBtn) return;
        
        // Add ripple effect on click
        submitBtn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            this.appendChild(ripple);
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            setTimeout(() => ripple.remove(), 600);
        });
        
        // Handle form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!validateForm(form)) {
                showToast('Please complete all required fields', 'error');
                return;
            }
            
            await submitForm(form, submitBtn);
        });
    }

    /**
     * Validate entire form
     */
    function validateForm(form) {
        const fields = form.querySelectorAll('[required]');
        let isValid = true;
        
        fields.forEach(field => {
            if (!validateField(field, true)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    /**
     * Submit form with enhanced UX
     */
    async function submitForm(form, submitBtn) {
        FormState.isSubmitting = true;
        
        // Update button state
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';
        submitBtn.classList.add('submitting');
        
        // Simulate API call (replace with actual submission)
        try {
            await simulateApiCall();
            
            // Success handling
            handleSubmitSuccess(form, submitBtn);
            
            // Clear saved data
            localStorage.removeItem(`ignite_form_${form.id}`);
            
            // Track conversion
            trackEvent('form_submitted', {
                timeToComplete: Date.now() - FormState.startTime,
                interactions: FormState.interactions
            });
            
        } catch (error) {
            // Error handling
            handleSubmitError(form, submitBtn, originalText, error);
        }
    }

    /**
     * Simulate API call (replace with actual implementation)
     */
    function simulateApiCall() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });
    }

    /**
     * Handle successful form submission
     */
    function handleSubmitSuccess(form, submitBtn) {
        submitBtn.innerHTML = '<span class="checkmark">✓</span> Success!';
        submitBtn.classList.remove('submitting');
        submitBtn.classList.add('success');
        
        // Show success message
        showSuccessMessage(form);
        
        // Optional: Redirect after delay
        if (form.dataset.redirectUrl) {
            setTimeout(() => {
                window.location.href = form.dataset.redirectUrl;
            }, config.successRedirectDelay);
        }
    }

    /**
     * Handle form submission error
     */
    function handleSubmitError(form, submitBtn, originalText, error) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('submitting');
        
        showToast('Something went wrong. Please try again.', 'error');
        console.error('Form submission error:', error);
        
        FormState.isSubmitting = false;
    }

    /**
     * Show success message
     */
    function showSuccessMessage(form) {
        const successElement = document.createElement('div');
        successElement.className = 'form-success-message';
        successElement.innerHTML = `
            <div class="success-icon">
                <svg viewBox="0 0 52 52">
                    <circle cx="26" cy="26" r="25" fill="none"/>
                    <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
            </div>
            <h3>Thank You!</h3>
            <p>Your application has been received. We'll be in touch within 24 hours.</p>
        `;
        
        form.style.display = 'none';
        form.parentElement.appendChild(successElement);
        
        // Animate success message
        setTimeout(() => {
            successElement.classList.add('show');
        }, 100);
    }

    /**
     * Add field assistance (tooltips, help text)
     */
    function addFieldAssistance(form) {
        const helpTriggers = form.querySelectorAll('[data-help]');
        
        helpTriggers.forEach(trigger => {
            const helpText = trigger.dataset.help;
            const tooltip = document.createElement('div');
            tooltip.className = 'field-tooltip';
            tooltip.textContent = helpText;
            
            trigger.addEventListener('mouseenter', () => {
                document.body.appendChild(tooltip);
                positionTooltip(trigger, tooltip);
                tooltip.classList.add('show');
            });
            
            trigger.addEventListener('mouseleave', () => {
                tooltip.classList.remove('show');
                setTimeout(() => tooltip.remove(), 300);
            });
        });
    }

    /**
     * Position tooltip relative to element
     */
    function positionTooltip(element, tooltip) {
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.bottom + 5) + 'px';
    }

    /**
     * Show toast notification
     */
    function showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    /**
     * Track analytics event
     */
    function trackEvent(eventName, data = {}) {
        // Implement your analytics tracking here
        console.log('Track event:', eventName, data);
        
        // Example: Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
    }

    /**
     * Add CSS styles for form enhancements
     */
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Form Progress Bar */
            .form-progress-bar {
                margin-bottom: 30px;
                padding: 20px;
                background: rgba(255, 107, 53, 0.05);
                border-radius: 8px;
            }
            
            .progress-track {
                height: 8px;
                background: rgba(255, 107, 53, 0.1);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 10px;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #ff6b35, #ff4500);
                border-radius: 4px;
                transition: width 0.5s ease;
            }
            
            .progress-fill.complete {
                animation: pulse 0.5s ease;
            }
            
            .progress-text {
                font-size: 14px;
                color: #666;
                text-align: center;
            }
            
            .progress-percentage {
                font-weight: bold;
                color: #ff6b35;
            }
            
            /* Floating Labels */
            .floating-label-group {
                position: relative;
                margin-bottom: 25px;
            }
            
            .floating-label-group label {
                position: absolute;
                top: 50%;
                left: 15px;
                transform: translateY(-50%);
                transition: all 0.3s ease;
                pointer-events: none;
                color: #999;
            }
            
            .floating-label-group.focused label,
            .floating-label-group.filled label {
                top: -10px;
                left: 10px;
                font-size: 12px;
                color: #ff6b35;
                background: white;
                padding: 0 5px;
            }
            
            /* Field Validation States */
            input.valid,
            textarea.valid {
                border-color: #4caf50 !important;
            }
            
            input.error,
            textarea.error {
                border-color: #f44336 !important;
            }
            
            .field-error {
                color: #f44336;
                font-size: 12px;
                margin-top: 5px;
                display: none;
            }
            
            /* Email Suggestions */
            .email-suggestions {
                position: absolute;
                background: white;
                border: 1px solid #ddd;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                z-index: 1000;
                display: none;
                margin-top: 5px;
            }
            
            .email-suggestions .suggestion {
                padding: 10px 15px;
                cursor: pointer;
                transition: background 0.2s ease;
            }
            
            .email-suggestions .suggestion:hover {
                background: #f5f5f5;
            }
            
            /* Submit Button Enhancements */
            .btn[type="submit"] {
                position: relative;
                overflow: hidden;
            }
            
            .btn[type="submit"] .spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid #fff;
                border-top-color: transparent;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            }
            
            .btn[type="submit"].submitting {
                background: #ff8a65;
                cursor: not-allowed;
            }
            
            .btn[type="submit"].success {
                background: #4caf50;
            }
            
            .checkmark {
                display: inline-block;
                animation: checkmark 0.3s ease;
            }
            
            @keyframes checkmark {
                0% { transform: scale(0); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
            
            /* Ripple Effect */
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            }
            
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            /* Success Message */
            .form-success-message {
                text-align: center;
                padding: 40px;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.5s ease;
            }
            
            .form-success-message.show {
                opacity: 1;
                transform: translateY(0);
            }
            
            .success-icon svg {
                width: 52px;
                height: 52px;
            }
            
            .success-icon circle {
                stroke: #4caf50;
                stroke-width: 2;
                stroke-dasharray: 166;
                stroke-dashoffset: 166;
                animation: circle 0.6s ease-in-out forwards;
            }
            
            .success-icon path {
                stroke: #4caf50;
                stroke-width: 3;
                stroke-dasharray: 48;
                stroke-dashoffset: 48;
                animation: checkPath 0.3s ease-in-out 0.3s forwards;
            }
            
            @keyframes circle {
                to {
                    stroke-dashoffset: 0;
                }
            }
            
            @keyframes checkPath {
                to {
                    stroke-dashoffset: 0;
                }
            }
            
            /* Toast Notifications */
            .toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 15px 20px;
                background: #333;
                color: white;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease;
                z-index: 10000;
            }
            
            .toast.show {
                opacity: 1;
                transform: translateY(0);
            }
            
            .toast-success {
                background: #4caf50;
            }
            
            .toast-error {
                background: #f44336;
            }
            
            .toast-info {
                background: #2196f3;
            }
            
            /* Field Tooltips */
            .field-tooltip {
                position: absolute;
                background: #333;
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 1000;
                opacity: 0;
                transform: translateY(-5px);
                transition: all 0.3s ease;
                pointer-events: none;
            }
            
            .field-tooltip.show {
                opacity: 1;
                transform: translateY(0);
            }
            
            .field-tooltip::before {
                content: '';
                position: absolute;
                top: -5px;
                left: 20px;
                width: 0;
                height: 0;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-bottom: 5px solid #333;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            injectStyles();
            init();
        });
    } else {
        injectStyles();
        init();
    }

    // Expose API for external use
    window.IgniteFormOptimizer = {
        init,
        validateForm,
        saveFormData,
        loadSavedData,
        trackEvent
    };
})();