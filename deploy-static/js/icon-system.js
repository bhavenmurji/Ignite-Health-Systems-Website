// Professional Icon System for Ignite Health Systems
// Replaces all emojis with SVG icons from assets/Icons

const iconMappings = {
    // Fire and flame icons
    'fire': '/assets/Icons/healthicons/svg/filled/body/fire.svg',
    'flame': '/assets/Icons/Boxicons/svg/basic/bx-fire.svg',
    
    // Medical professional icons
    'doctor': '/assets/Icons/healthicons/svg/filled/people/doctor.svg',
    'doctor_male': '/assets/Icons/healthicons/svg/filled/people/doctor_male.svg',
    'doctor_female': '/assets/Icons/healthicons/svg/filled/people/doctor_female.svg',
    'health_worker': '/assets/Icons/healthicons/svg/filled/people/health_worker.svg',
    'nurse': '/assets/Icons/healthicons/svg/filled/people/nurse.svg',
    
    // Technology and innovation
    'rocket': '/assets/Icons/Boxicons/svg/basic/bx-rocket.svg',
    'lightning': '/assets/Icons/Boxicons/svg/basic/bx-bolt.svg',
    'ai': '/assets/Icons/healthicons/svg/filled/symbols/artificial_intelligence.svg',
    'tech': '/assets/Icons/Boxicons/svg/basic/bx-chip.svg',
    
    // Medical symbols
    'health': '/assets/Icons/healthicons/svg/filled/symbols/health.svg',
    'heart': '/assets/Icons/healthicons/svg/filled/symbols/heart.svg',
    'stethoscope': '/assets/Icons/healthicons/svg/filled/devices/stethoscope.svg',
    'hospital': '/assets/Icons/healthicons/svg/filled/places/hospital.svg',
    
    // Business and partnership
    'handshake': '/assets/Icons/Boxicons/svg/basic/bx-handshake.svg',
    'partnership': '/assets/Icons/healthicons/svg/filled/people/male_and_female.svg',
    'team': '/assets/Icons/healthicons/svg/filled/people/group_discussion_meeting.svg',
    
    // Data and analytics
    'chart': '/assets/Icons/healthicons/svg/filled/graphs/chart_line.svg',
    'analytics': '/assets/Icons/Boxicons/svg/basic/bx-bar-chart.svg',
    'database': '/assets/Icons/healthicons/svg/filled/symbols/database.svg',
    
    // Communication
    'megaphone': '/assets/Icons/healthicons/svg/filled/objects/megaphone.svg',
    'communication': '/assets/Icons/healthicons/svg/filled/symbols/communication.svg',
    
    // Success and awards
    'trophy': '/assets/Icons/healthicons/svg/filled/objects/award_trophy.svg',
    'star': '/assets/Icons/healthicons/svg/filled/shapes/star_large.svg',
    'badge': '/assets/Icons/Boxicons/svg/basic/bx-badge-check.svg',
    
    // Education
    'education': '/assets/Icons/Boxicons/svg/basic/bx-education.svg',
    'research': '/assets/Icons/Boxicons/svg/basic/bx-microscope.svg',
    'book': '/assets/Icons/healthicons/svg/filled/objects/book.svg',
    
    // Alert and information
    'info': '/assets/Icons/healthicons/svg/filled/symbols/info.svg',
    'alert': '/assets/Icons/healthicons/svg/filled/symbols/alert.svg',
    'warning': '/assets/Icons/healthicons/svg/filled/symbols/alert_triangle.svg',
    
    // Time and calendar
    'calendar': '/assets/Icons/healthicons/svg/filled/objects/calendar.svg',
    'clock': '/assets/Icons/Boxicons/svg/basic/bx-time.svg',
    
    // Security
    'lock': '/assets/Icons/Boxicons/svg/basic/bx-lock.svg',
    'shield': '/assets/Icons/Boxicons/svg/basic/bx-shield.svg',
    
    // Target and goals
    'target': '/assets/Icons/Boxicons/svg/basic/bx-target-lock.svg',
    'bullseye': '/assets/Icons/Boxicons/svg/basic/bx-bullseye.svg',
    
    // Ideas and innovation
    'lightbulb': '/assets/Icons/Boxicons/svg/basic/bx-bulb.svg',
    'idea': '/assets/Icons/Boxicons/svg/basic/bx-bulb.svg',
    
    // Check and validation
    'check': '/assets/Icons/Boxicons/svg/basic/bx-check.svg',
    'checkCircle': '/assets/Icons/Boxicons/svg/basic/bx-check-circle.svg',
    
    // Navigation
    'arrow_right': '/assets/Icons/Boxicons/svg/basic/bx-arrow-right.svg',
    'chevron_right': '/assets/Icons/Boxicons/svg/basic/bx-chevron-right.svg'
};

// Function to create inline SVG icon
function createIcon(iconName, className = '', size = 24) {
    const iconPath = iconMappings[iconName];
    if (!iconPath) {
        console.warn(`Icon "${iconName}" not found in mappings`);
        return '';
    }
    
    return `<img src="${iconPath}" alt="${iconName}" class="icon ${className}" style="width: ${size}px; height: ${size}px; display: inline-block; vertical-align: middle;">`;
}

// Function to replace emoji text with icons
function replaceEmojiWithIcon(text, iconName, className = '') {
    const icon = createIcon(iconName, className);
    return icon + ' ' + text;
}

// Auto-replace emojis in the DOM
function autoReplaceEmojis() {
    const emojiMap = {
        '🔥': 'fire',
        '⚡': 'lightning',
        '🚀': 'rocket',
        '💡': 'lightbulb',
        '🎯': 'target',
        '🏥': 'hospital',
        '👨‍⚕️': 'doctor',
        '🩺': 'stethoscope',
        '💊': 'health',
        '📊': 'chart',
        '🤝': 'handshake',
        '⭐': 'star',
        '🏆': 'trophy',
        '🎓': 'education',
        '🔬': 'research',
        '📱': 'tech',
        '🔒': 'lock',
        '⏰': 'clock',
        '📅': 'calendar',
        '✅': 'check',
        '❌': 'alert',
        '⚠️': 'warning',
        'ℹ️': 'info',
        '💀': 'warning',
        '🌟': 'star',
        '✨': 'star',
        '💪': 'health',
        '🧠': 'ai',
        '❤️': 'heart',
        '👥': 'team',
        '📈': 'analytics',
        '🎉': 'trophy',
        '🌈': 'health',
        '🆘': 'alert',
        '🫀': 'heart',
        '🫁': 'health',
        '🔥': 'fire'
    };
    
    // Function to replace text content
    function replaceInTextNode(node) {
        let text = node.textContent;
        let hasEmoji = false;
        
        for (const [emoji, iconName] of Object.entries(emojiMap)) {
            if (text.includes(emoji)) {
                hasEmoji = true;
                break;
            }
        }
        
        if (hasEmoji) {
            // Create a span to hold the new content
            const span = document.createElement('span');
            let html = text;
            
            for (const [emoji, iconName] of Object.entries(emojiMap)) {
                const icon = createIcon(iconName, 'emoji-replacement', 20);
                html = html.replace(new RegExp(emoji, 'g'), icon);
            }
            
            span.innerHTML = html;
            node.parentNode.replaceChild(span, node);
        }
    }
    
    // Walk through all text nodes
    function walkTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            replaceInTextNode(node);
        } else {
            for (let child of Array.from(node.childNodes)) {
                walkTextNodes(child);
            }
        }
    }
    
    // Process the entire document
    walkTextNodes(document.body);
}

// Initialize icon system when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS for icons
    const style = document.createElement('style');
    style.textContent = `
        .icon {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            filter: brightness(0) saturate(100%) invert(50%) sepia(85%) saturate(2000%) hue-rotate(350deg) brightness(105%) contrast(101%);
            transition: all 0.3s ease;
        }
        
        .icon:hover {
            transform: scale(1.1);
            filter: brightness(0) saturate(100%) invert(30%) sepia(95%) saturate(3000%) hue-rotate(355deg) brightness(110%) contrast(105%);
        }
        
        .icon.emoji-replacement {
            margin: 0 2px;
        }
        
        .icon-white {
            filter: brightness(0) saturate(100%) invert(100%);
        }
        
        .icon-primary {
            filter: brightness(0) saturate(100%) invert(50%) sepia(85%) saturate(2000%) hue-rotate(350deg) brightness(105%) contrast(101%);
        }
        
        .icon-large {
            width: 32px !important;
            height: 32px !important;
        }
        
        .icon-small {
            width: 16px !important;
            height: 16px !important;
        }
    `;
    document.head.appendChild(style);
    
    // Auto-replace emojis
    autoReplaceEmojis();
});

// Export for use in other scripts
window.IconSystem = {
    createIcon,
    replaceEmojiWithIcon,
    autoReplaceEmojis,
    iconMappings
};