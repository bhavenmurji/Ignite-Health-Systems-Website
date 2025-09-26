# Atmospheric Audio System Setup

## Overview

The atmospheric audio system provides subtle, section-aware ambient sound that enhances the user experience without being intrusive. The system is designed to be:

- **Subtle and unobtrusive** - Audio fades in/out smoothly
- **Context-aware** - Different tracks for different sections
- **Accessible** - Respects user preferences and motion sensitivity
- **Performance-optimized** - Lazy loading and efficient memory management

## Quick Start

The system is already integrated into your layout. The audio will:

1. **Wait for user interaction** before enabling
2. **Show a subtle indicator** when audio state changes
3. **Automatically switch tracks** based on scroll position
4. **Respect user preferences** (reduced motion, etc.)

## Audio Files

You need to add audio files to `/public/audio/`:

### Required Files for Healthcare Preset:
- `ambient-welcome.mp3` - Welcoming sound for hero section
- `ambient-focus.mp3` - Focus-enhancing sound for platform section  
- `ambient-calm.mp3` - Calming sound for approach section
- `ambient-personal.mp3` - Warm sound for founder section
- `ambient-inspiring.mp3` - Uplifting sound for CTA section

### Required Files for Minimal Preset:
- `ambient-minimal.mp3` - Single subtle track

## Audio Requirements

**Format**: MP3 (widely supported)
**Quality**: 128kbps recommended for web
**Length**: 2-5 minutes (tracks loop automatically)
**Volume**: Normalized to -6dB peak
**Style**: Ambient, non-distracting, instrumental

### Recommended Audio Characteristics:
- **No lyrics or speech**
- **Minimal percussion or sharp sounds**
- **Consistent volume throughout**
- **Seamless loop points**
- **Low-frequency emphasis** (easier on ears)

## Configuration Options

### Changing Presets

In `/app/layout.tsx`, you can switch between presets:

```tsx
// Current: Healthcare preset
<HealthcareAtmosphericAudio>

// Alternatives:
<MinimalAtmosphericAudio>          // Single subtle track
<ProgressiveAtmosphericAudio>      // Builds energy
<SilentAtmosphericAudio>          // No audio, just context
```

### Custom Configuration

```tsx
<AtmosphericAudio
  preset="custom"
  customSections={[
    {
      sectionId: 'hero',
      trackUrl: '/audio/my-track.mp3',
      volume: 0.3,
      delay: 1000
    }
  ]}
  indicator={{
    position: 'top-right',
    variant: 'minimal'
  }}
  context={{
    defaultVolume: 0.2,
    autoEnable: false
  }}
>
  {children}
</AtmosphericAudio>
```

### Audio Indicator Customization

```tsx
// Position options
position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

// Style variants  
variant: 'minimal' | 'glass' | 'floating'

// Behavior
showOnStateChange: true    // Show when audio state changes
autoHideDelay: 3000       // Hide after 3 seconds
enabled: true             // Show indicator at all
```

## User Controls

### Audio Indicator
- **Appears briefly** when audio state changes
- **Always visible on hover** in bottom-right corner
- **Click main button** to enable/disable audio
- **Volume slider** appears on hover
- **Quick mute button** for temporary silence

### Keyboard Accessibility
- **Tab navigation** through controls
- **Enter/Space** to toggle audio
- **Arrow keys** for volume control (when focused)

### Automatic Behavior
- **Waits for user interaction** before starting
- **Fades between sections** smoothly
- **Remembers preferences** in localStorage
- **Stops on page leave** to save bandwidth

## Technical Details

### Performance
- **Lazy loading** - Audio loads only when needed
- **Memory management** - Cleans up unused audio elements  
- **Efficient crossfades** - Smooth transitions without overlap
- **Intersection observers** - Efficient scroll detection

### Browser Support
- **Chrome/Edge**: Full support
- **Firefox**: Full support  
- **Safari**: Full support
- **Mobile browsers**: Supported with user interaction requirement

### File Organization
```
/public/audio/
├── ambient-welcome.mp3      # Hero section
├── ambient-focus.mp3        # Platform section
├── ambient-calm.mp3         # Approach section
├── ambient-personal.mp3     # Founder section
├── ambient-inspiring.mp3    # CTA section
└── ambient-minimal.mp3      # Minimal preset
```

## Audio Asset Sources

### Free Resources:
- **Freesound.org** - Creative Commons ambient sounds
- **Zapsplat** - Free with account
- **Adobe Stock Audio** - Subscription service
- **Epidemic Sound** - Subscription service

### Search Terms:
- "ambient background"
- "healthcare ambient"
- "professional atmosphere"
- "subtle texture"
- "calm workspace"

### Recommended Artists/Tags:
- Brian Eno style ambient
- Medical/healthcare ambience
- Office/workspace ambient
- Minimal ambient textures

## Customization Examples

### Disable Auto-Play
```tsx
<MinimalAtmosphericAudio
  context={{ autoEnable: false }}
>
```

### Longer Crossfades
```tsx
<HealthcareAtmosphericAudio
  sectionAudio={{ crossfadeDuration: 4000 }}
>
```

### Hidden Indicator
```tsx
<AtmosphericAudio
  indicator={{ enabled: false }}
>
```

### Custom Volume Levels
```tsx
<AtmosphericAudio
  preset="custom"
  customSections={[
    { sectionId: 'hero', trackUrl: '/audio/soft.mp3', volume: 0.1 },
    { sectionId: 'cta', trackUrl: '/audio/energetic.mp3', volume: 0.4 }
  ]}
>
```

## Troubleshooting

### Audio Not Playing
1. **Check browser console** for error messages
2. **Verify file paths** are correct
3. **Test files directly** by visiting URL
4. **Check file formats** (MP3 recommended)
5. **Ensure user interaction** occurred first

### Performance Issues  
1. **Reduce file sizes** (shorter loops, lower bitrate)
2. **Set preloadAll: false** to lazy load
3. **Use fewer simultaneous tracks**
4. **Check for memory leaks** in browser dev tools

### Accessibility Concerns
1. **Reduce default volume** if too prominent  
2. **Increase auto-hide delay** for easier control
3. **Test with screen readers**
4. **Ensure keyboard navigation works**

## Implementation Notes

The audio system uses:
- **Web Audio Context** for volume control
- **Intersection Observer** for section detection  
- **CSS transitions** for smooth UI animations
- **localStorage** for preference persistence
- **Event delegation** for efficient memory usage

All components are designed to be:
- **Tree-shakeable** - Import only what you need
- **Type-safe** - Full TypeScript support
- **Accessible** - WCAG compliant
- **Performance-conscious** - Minimal bundle impact