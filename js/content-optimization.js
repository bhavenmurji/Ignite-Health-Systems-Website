/**
 * Content Optimization JavaScript
 * Enhances user engagement through micro-interactions and progressive disclosure
 */

class ContentOptimizer {
    constructor() {
        this.isInitialized = false;
        this.observersActive = false;
        this.scrollProgressBar = null;
        this.readingProgress = {
            sections: [],
            currentSection: 0
        };
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        document.addEventListener('DOMContentLoaded', () => {
            this.setupScrollProgress();
            this.setupReadingProgress();
            this.setupSmartTooltips();
            this.setupProgressiveDisclosure();
            this.setupMicroInteractions();
            this.setupContentAnalytics();
            this.setupA11yEnhancements();
            this.isInitialized = true;
        });
    }

    // Scroll Progress Indicator
    setupScrollProgress() {
        // Create scroll progress bar
        this.scrollProgressBar = document.createElement('div');
        this.scrollProgressBar.className = 'scroll-progress-bar';
        this.scrollProgressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--primary), var(--gold));
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(this.scrollProgressBar);

        let ticking = false;
        const updateProgress = () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            
            this.scrollProgressBar.style.width = Math.min(100, Math.max(0, scrolled)) + '%';
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateProgress);
                ticking = true;
            }
        }, { passive: true });
    }

    // Reading Progress Tracking
    setupReadingProgress() {
        const sections = document.querySelectorAll('section[class]');
        this.readingProgress.sections = Array.from(sections).map(section => ({
            element: section,
            id: section.className,
            read: false,
            timeSpent: 0,
            lastEnterTime: 0
        }));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const sectionData = this.readingProgress.sections.find(s => s.element === entry.target);
                if (!sectionData) return;

                if (entry.isIntersecting) {
                    sectionData.lastEnterTime = Date.now();
                    sectionData.read = true;
                    this.updateReadingIndicator(sectionData);
                } else if (sectionData.lastEnterTime > 0) {
                    sectionData.timeSpent += Date.now() - sectionData.lastEnterTime;
                    sectionData.lastEnterTime = 0;
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-20% 0px -20% 0px'
        });

        this.readingProgress.sections.forEach(section => {
            observer.observe(section.element);
        });
    }

    updateReadingIndicator(sectionData) {
        // Visual feedback for section completion
        const sectionElement = sectionData.element;
        if (!sectionElement.querySelector('.section-completion-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'section-completion-indicator';
            indicator.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: var(--primary);
                opacity: 0;
                transform: scale(0);
                transition: all 0.3s ease;
                z-index: 10;
            `;
            sectionElement.style.position = 'relative';
            sectionElement.appendChild(indicator);
        }

        const indicator = sectionElement.querySelector('.section-completion-indicator');
        setTimeout(() => {
            indicator.style.opacity = '1';
            indicator.style.transform = 'scale(1)';
        }, 500);
    }

    // Smart Tooltips with Context
    setupSmartTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip], .tooltip');
        
        tooltipElements.forEach(element => {
            let tooltip = null;
            let showTimeout = null;
            let hideTimeout = null;

            const showTooltip = (e) => {
                clearTimeout(hideTimeout);
                showTimeout = setTimeout(() => {
                    const tooltipText = element.getAttribute('data-tooltip') || 
                                     element.querySelector('.tooltiptext')?.textContent ||
                                     element.getAttribute('title');
                    
                    if (!tooltipText) return;

                    tooltip = document.createElement('div');
                    tooltip.className = 'smart-tooltip';
                    tooltip.textContent = tooltipText;
                    tooltip.style.cssText = `
                        position: absolute;
                        background: var(--card-background);
                        color: var(--text-primary);
                        padding: 8px 12px;
                        border-radius: 6px;
                        font-size: 14px;
                        border: 1px solid var(--border-light);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                        z-index: 10000;
                        opacity: 0;
                        transform: translateY(10px);
                        transition: all 0.2s ease;
                        pointer-events: none;
                        max-width: 200px;
                        white-space: normal;
                    `;

                    document.body.appendChild(tooltip);

                    // Position tooltip
                    const rect = element.getBoundingClientRect();
                    const tooltipRect = tooltip.getBoundingClientRect();
                    
                    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                    let top = rect.top - tooltipRect.height - 10;

                    // Adjust if tooltip goes off screen
                    if (left < 10) left = 10;
                    if (left + tooltipRect.width > window.innerWidth - 10) {
                        left = window.innerWidth - tooltipRect.width - 10;
                    }
                    if (top < 10) {
                        top = rect.bottom + 10;
                    }

                    tooltip.style.left = left + 'px';
                    tooltip.style.top = top + 'px';

                    // Animate in
                    requestAnimationFrame(() => {
                        tooltip.style.opacity = '1';
                        tooltip.style.transform = 'translateY(0)';
                    });
                }, 300);
            };

            const hideTooltip = () => {
                clearTimeout(showTimeout);
                if (tooltip) {
                    hideTimeout = setTimeout(() => {
                        tooltip.style.opacity = '0';
                        tooltip.style.transform = 'translateY(10px)';
                        setTimeout(() => {
                            if (tooltip && tooltip.parentNode) {
                                tooltip.parentNode.removeChild(tooltip);
                            }
                            tooltip = null;
                        }, 200);
                    }, 100);
                }
            };

            element.addEventListener('mouseenter', showTooltip);
            element.addEventListener('mouseleave', hideTooltip);
            element.addEventListener('focus', showTooltip);
            element.addEventListener('blur', hideTooltip);
        });
    }

    // Progressive Disclosure Management
    setupProgressiveDisclosure() {
        const disclosureButtons = document.querySelectorAll('.expand-toggle');
        
        disclosureButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleDisclosure(button);
            });
        });

        // Auto-expand based on user behavior
        this.setupSmartExpansion();
    }

    handleDisclosure(button) {
        const targetId = button.getAttribute('data-target') || 
                        button.parentElement.querySelector('.expandable-content')?.id;
        
        if (!targetId) return;

        const content = document.getElementById(targetId) || 
                       button.parentElement.querySelector('.expandable-content');
        const icon = button.querySelector('i');
        const text = button.querySelector('span');

        if (!content) return;

        const isExpanded = content.classList.contains('expanded');
        
        // Animate transition
        if (isExpanded) {
            content.style.maxHeight = content.scrollHeight + 'px';
            requestAnimationFrame(() => {
                content.classList.remove('expanded');
                content.classList.add('collapsed');
                content.style.maxHeight = '200px';
                if (text) text.textContent = 'Show Details';
                button.classList.remove('expanded');
            });
        } else {
            content.classList.remove('collapsed');
            content.classList.add('expanded');
            content.style.maxHeight = content.scrollHeight + 'px';
            if (text) text.textContent = 'Show Less';
            button.classList.add('expanded');
            
            // Reset height after animation
            setTimeout(() => {
                content.style.maxHeight = 'none';
            }, 300);
        }

        // Track engagement
        this.trackEngagement('disclosure_toggle', {
            section: targetId,
            action: isExpanded ? 'collapse' : 'expand'
        });
    }

    setupSmartExpansion() {
        // Auto-expand sections based on time spent
        const expandableElements = document.querySelectorAll('.expandable-content.collapsed');
        
        expandableElements.forEach(element => {
            let hoverTime = 0;
            let hoverStart = 0;

            element.addEventListener('mouseenter', () => {
                hoverStart = Date.now();
            });

            element.addEventListener('mouseleave', () => {
                if (hoverStart > 0) {
                    hoverTime += Date.now() - hoverStart;
                    hoverStart = 0;

                    // Auto-expand if user has shown interest (3+ seconds of hover)
                    if (hoverTime > 3000 && element.classList.contains('collapsed')) {
                        const button = element.parentElement.querySelector('.expand-toggle');
                        if (button) {
                            this.handleDisclosure(button);
                        }
                    }
                }
            });
        });
    }

    // Micro-interactions for Enhanced UX
    setupMicroInteractions() {
        // Button hover effects
        this.setupButtonInteractions();
        
        // Card hover animations
        this.setupCardInteractions();
        
        // Input focus enhancements
        this.setupInputInteractions();
        
        // Scroll-triggered animations
        this.setupScrollAnimations();
    }

    setupButtonInteractions() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .expand-toggle');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                const ripple = document.createElement('span');
                ripple.className = 'button-ripple';
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;

                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
                ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);

                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.parentNode.removeChild(ripple);
                    }
                }, 600);
            });
        });

        // Add ripple animation to CSS if not exists
        if (!document.querySelector('#ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupCardInteractions() {
        const cards = document.querySelectorAll('.problem-card, .feature-card, .testimonial-card, .result-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
                card.style.boxShadow = '0 20px 40px rgba(255, 107, 53, 0.2)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });
        });
    }

    setupInputInteractions() {
        const inputs = document.querySelectorAll('input[type="number"], input[type="text"], textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.transform = 'scale(1.02)';
                input.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
            });

            input.addEventListener('blur', () => {
                input.style.transform = '';
                input.style.boxShadow = '';
            });

            // Value change animation
            input.addEventListener('input', () => {
                input.style.backgroundColor = 'rgba(255, 107, 53, 0.05)';
                setTimeout(() => {
                    input.style.backgroundColor = '';
                }, 300);
            });
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        };

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Stagger child animations
                    const children = entry.target.querySelectorAll('.animate-on-scroll');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate-in');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            animationObserver.observe(el);
        });
    }

    // Content Analytics and Optimization
    setupContentAnalytics() {
        this.analyticsData = {
            pageLoadTime: Date.now(),
            sectionsViewed: new Set(),
            interactions: [],
            timeSpent: {},
            scrollDepth: 0
        };

        // Track scroll depth
        let maxScrollDepth = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            maxScrollDepth = Math.max(maxScrollDepth, scrollPercent);
            this.analyticsData.scrollDepth = Math.min(100, maxScrollDepth);
        }, { passive: true });

        // Track time spent on page
        window.addEventListener('beforeunload', () => {
            this.analyticsData.totalTimeSpent = Date.now() - this.analyticsData.pageLoadTime;
            this.sendAnalytics();
        });
    }

    trackEngagement(action, data = {}) {
        this.analyticsData.interactions.push({
            action,
            timestamp: Date.now(),
            data
        });

        // Send analytics if buffer is full
        if (this.analyticsData.interactions.length >= 10) {
            this.sendAnalytics();
        }
    }

    sendAnalytics() {
        // In a real implementation, this would send to your analytics service
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'content_engagement', {
                scroll_depth: this.analyticsData.scrollDepth,
                sections_viewed: this.analyticsData.sectionsViewed.size,
                interactions: this.analyticsData.interactions.length
            });
        }
        
        console.log('Analytics Data:', this.analyticsData);
        
        // Reset interactions after sending
        this.analyticsData.interactions = [];
    }

    // Accessibility Enhancements
    setupA11yEnhancements() {
        // Enhanced keyboard navigation
        this.setupKeyboardNavigation();
        
        // Screen reader optimizations
        this.setupScreenReaderSupport();
        
        // High contrast mode detection
        this.setupHighContrastSupport();
        
        // Motion preferences
        this.setupMotionPreferences();
    }

    setupKeyboardNavigation() {
        // Add skip links
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.2s ease;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Enhanced focus management
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupScreenReaderSupport() {
        // Add live region for dynamic content updates
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.style.cssText = `
            position: absolute !important;
            width: 1px !important;
            height: 1px !important;
            padding: 0 !important;
            margin: -1px !important;
            overflow: hidden !important;
            clip: rect(0, 0, 0, 0) !important;
            white-space: nowrap !important;
            border: 0 !important;
        `;
        document.body.appendChild(liveRegion);
        this.liveRegion = liveRegion;

        // Announce ROI calculator updates
        const calculatorInputs = document.querySelectorAll('#patients-per-day, #minutes-per-note, #working-days');
        calculatorInputs.forEach(input => {
            input.addEventListener('change', () => {
                setTimeout(() => {
                    const currentTime = document.getElementById('current-time')?.textContent;
                    const timeSaved = document.getElementById('time-saved')?.textContent;
                    const monthlyValue = document.getElementById('monthly-value')?.textContent;
                    
                    this.liveRegion.textContent = `Calculator updated: Current time ${currentTime}, Time saved ${timeSaved}, Monthly value ${monthlyValue}`;
                }, 500);
            });
        });
    }

    setupHighContrastSupport() {
        // Detect high contrast mode
        const isHighContrast = window.matchMedia('(prefers-contrast: high)').matches ||
                              window.matchMedia('(-ms-high-contrast: active)').matches;
        
        if (isHighContrast) {
            document.body.classList.add('high-contrast');
            
            // Add high contrast styles
            const style = document.createElement('style');
            style.textContent = `
                .high-contrast .problem-card,
                .high-contrast .feature-card,
                .high-contrast .result-card {
                    border: 2px solid currentColor !important;
                }
                
                .high-contrast .btn-primary,
                .high-contrast .btn-secondary {
                    border: 2px solid currentColor !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupMotionPreferences() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            document.body.classList.add('reduced-motion');
            
            // Override animations for users who prefer reduced motion
            const style = document.createElement('style');
            style.textContent = `
                .reduced-motion * {
                    animation-duration: 0.01s !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01s !important;
                }
                
                .reduced-motion .animate-on-scroll {
                    opacity: 1 !important;
                    transform: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Public methods for external use
    announceToScreenReader(message) {
        if (this.liveRegion) {
            this.liveRegion.textContent = message;
        }
    }

    updateProgress(sectionId, progress) {
        const section = this.readingProgress.sections.find(s => s.id === sectionId);
        if (section) {
            section.progress = progress;
            this.updateReadingIndicator(section);
        }
    }

    getAnalytics() {
        return this.analyticsData;
    }
}

// Initialize the content optimizer
const contentOptimizer = new ContentOptimizer();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentOptimizer;
} else {
    window.ContentOptimizer = ContentOptimizer;
    window.contentOptimizer = contentOptimizer;
}

// Additional utility functions for content optimization
const ContentUtils = {
    // Smooth scroll to element with offset
    smoothScrollTo(targetId, offset = 80) {
        const target = document.getElementById(targetId) || document.querySelector(targetId);
        if (target) {
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    },

    // Format numbers with animation
    animateNumber(element, targetValue, duration = 1000, prefix = '', suffix = '') {
        const startValue = parseFloat(element.textContent.replace(/[^\d.-]/g, '')) || 0;
        const increment = (targetValue - startValue) / (duration / 16);
        let currentValue = startValue;

        const animate = () => {
            currentValue += increment;
            if ((increment > 0 && currentValue >= targetValue) || 
                (increment < 0 && currentValue <= targetValue)) {
                currentValue = targetValue;
                element.textContent = prefix + Math.round(currentValue).toLocaleString() + suffix;
                return;
            }
            element.textContent = prefix + Math.round(currentValue).toLocaleString() + suffix;
            requestAnimationFrame(animate);
        };

        animate();
    },

    // Debounce function for performance
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport(element, threshold = 0.1) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        const elementHeight = rect.height;
        const elementWidth = rect.width;
        
        return (
            rect.top <= windowHeight - (elementHeight * threshold) &&
            rect.left <= windowWidth - (elementWidth * threshold) &&
            rect.bottom >= (elementHeight * threshold) &&
            rect.right >= (elementWidth * threshold)
        );
    }
};

// Make utilities available globally
window.ContentUtils = ContentUtils;