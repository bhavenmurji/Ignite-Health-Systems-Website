// Mobile Navigation JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    const body = document.body;

    // Toggle mobile menu
    function toggleMobileMenu() {
        const isOpen = mobileMenuToggle.classList.contains('active');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    // Open mobile menu
    function openMobileMenu() {
        mobileMenuToggle.classList.add('active');
        mobileNavMenu.classList.add('active');
        mobileNavOverlay.classList.add('active');
        body.style.overflow = 'hidden'; // Prevent body scroll when menu is open
        
        // Animate menu items
        animateMenuItems('in');
    }

    // Close mobile menu
    function closeMobileMenu() {
        mobileMenuToggle.classList.remove('active');
        mobileNavMenu.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        body.style.overflow = ''; // Restore body scroll
        
        // Animate menu items
        animateMenuItems('out');
    }

    // Animate menu items
    function animateMenuItems(direction) {
        const items = mobileNavMenu.querySelectorAll('.mobile-nav-links li');
        
        items.forEach((item, index) => {
            if (direction === 'in') {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, index * 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateX(20px)';
            }
        });
    }

    // Set active link based on current page
    function setActiveLink() {
        const currentPath = window.location.pathname;
        
        mobileNavLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            
            if (currentPath === linkPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Smooth scroll to section
    function smoothScrollTo(targetId) {
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = document.querySelector('#header')?.offsetHeight || 0;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Event Listeners
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', closeMobileMenu);
    }

    // Handle navigation link clicks
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Check if it's an anchor link on the same page
            if (href.startsWith('#')) {
                e.preventDefault();
                closeMobileMenu();
                smoothScrollTo(href);
            } else {
                // For regular links, close menu after a small delay
                setTimeout(closeMobileMenu, 100);
            }
        });
    });

    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenuToggle.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Close mobile menu if window is resized to desktop size
            if (window.innerWidth > 768 && mobileMenuToggle.classList.contains('active')) {
                closeMobileMenu();
            }
        }, 250);
    });

    // Set active link on page load
    setActiveLink();

    // Handle swipe gestures for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        // Swipe left to open menu (when swiping from right edge)
        if (swipeDistance < -swipeThreshold && touchStartX > window.innerWidth - 50) {
            openMobileMenu();
        }
        
        // Swipe right to close menu (when menu is open)
        if (swipeDistance > swipeThreshold && mobileMenuToggle.classList.contains('active')) {
            closeMobileMenu();
        }
    }

    // Touch event listeners for swipe
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    // Accessibility: Focus trap when menu is open
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    }

    // Apply focus trap when menu is open
    if (mobileNavMenu) {
        trapFocus(mobileNavMenu);
    }

    // Initialize menu items style
    const menuItems = mobileNavMenu?.querySelectorAll('.mobile-nav-links li');
    if (menuItems) {
        menuItems.forEach(item => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity = '0';
            item.style.transform = 'translateX(20px)';
        });
    }
});

// Export functions for use in other modules
window.mobileNav = {
    open: function() {
        const event = new Event('openMobileMenu');
        document.dispatchEvent(event);
    },
    close: function() {
        const event = new Event('closeMobileMenu');
        document.dispatchEvent(event);
    },
    toggle: function() {
        const event = new Event('toggleMobileMenu');
        document.dispatchEvent(event);
    }
};