import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        md: "2rem",
        lg: "2.5rem",
        xl: "3rem",
        "2xl": "4rem",
      },
      screens: {
        sm: "640px",
        md: "768px", 
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          dark: "hsl(var(--primary-dark))",
          light: "hsl(var(--primary-light))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Fire theme colors
        fire: {
          50: "#fefce8",
          100: "#fef3c7",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316", // Main fire orange
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
        ember: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899", // Ember pink
          600: "#db2777",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843",
          950: "#500724",
        },
        flame: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316", // Main flame orange
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "flicker": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "flame": {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(249, 115, 22, 0.5)" },
          "50%": { boxShadow: "0 0 20px rgba(249, 115, 22, 0.8)" },
        },
        // Cinematic fade effects
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-left": {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-right": {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        // Blur transitions
        "blur-in": {
          "0%": { filter: "blur(10px)", opacity: "0" },
          "100%": { filter: "blur(0)", opacity: "1" },
        },
        "blur-out": {
          "0%": { filter: "blur(0)", opacity: "1" },
          "100%": { filter: "blur(10px)", opacity: "0" },
        },
        "focus-in": {
          "0%": { filter: "blur(8px)", transform: "scale(0.95)", opacity: "0" },
          "100%": { filter: "blur(0)", transform: "scale(1)", opacity: "1" },
        },
        // Text reveal animations
        "text-reveal": {
          "0%": { 
            clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
            transform: "translateX(-100%)"
          },
          "100%": { 
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            transform: "translateX(0)"
          },
        },
        "text-reveal-up": {
          "0%": { 
            clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
            transform: "translateY(100%)"
          },
          "100%": { 
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            transform: "translateY(0)"
          },
        },
        "typewriter": {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        // Fire-themed glows and effects
        "fire-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 20px rgba(249, 115, 22, 0.3), 0 0 40px rgba(234, 88, 12, 0.2)",
            transform: "scale(1)"
          },
          "50%": { 
            boxShadow: "0 0 30px rgba(249, 115, 22, 0.6), 0 0 60px rgba(234, 88, 12, 0.4)",
            transform: "scale(1.02)"
          },
        },
        "ember-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 15px rgba(236, 72, 153, 0.4)",
            opacity: "0.8"
          },
          "50%": { 
            boxShadow: "0 0 25px rgba(236, 72, 153, 0.7), 0 0 50px rgba(219, 39, 119, 0.3)",
            opacity: "1"
          },
        },
        "flame-dance": {
          "0%": { transform: "rotate(-2deg) scale(1)" },
          "25%": { transform: "rotate(1deg) scale(1.02)" },
          "50%": { transform: "rotate(2deg) scale(1)" },
          "75%": { transform: "rotate(-1deg) scale(0.98)" },
          "100%": { transform: "rotate(-2deg) scale(1)" },
        },
        // Pulse effects for UI elements
        "pulse-soft": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.01)" },
        },
        "pulse-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 10px rgba(59, 130, 246, 0.3)",
            transform: "scale(1)"
          },
          "50%": { 
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.6), 0 0 30px rgba(147, 197, 253, 0.3)",
            transform: "scale(1.02)"
          },
        },
        "heartbeat": {
          "0%, 50%, 100%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.1)" },
          "75%": { transform: "scale(1.05)" },
        },
        // Cinematic entrance effects
        "slide-in-cinematic": {
          "0%": { 
            transform: "translateX(-100%) skewX(-15deg)",
            opacity: "0"
          },
          "60%": { 
            transform: "translateX(20%) skewX(-5deg)",
            opacity: "0.8"
          },
          "100%": { 
            transform: "translateX(0) skewX(0deg)",
            opacity: "1"
          },
        },
        "zoom-in-cinematic": {
          "0%": { 
            transform: "scale(0.5) rotate(-5deg)",
            opacity: "0",
            filter: "blur(5px)"
          },
          "60%": { 
            transform: "scale(1.1) rotate(1deg)",
            opacity: "0.8",
            filter: "blur(1px)"
          },
          "100%": { 
            transform: "scale(1) rotate(0deg)",
            opacity: "1",
            filter: "blur(0)"
          },
        },
        // Text gradient animations
        "gradient-x": {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        "gradient-y": {
          "0%, 100%": { "background-position": "50% 0%" },
          "50%": { "background-position": "50% 100%" },
        },
        "gradient-xy": {
          "0%, 100%": { "background-position": "0% 0%" },
          "25%": { "background-position": "100% 0%" },
          "50%": { "background-position": "100% 100%" },
          "75%": { "background-position": "0% 100%" },
        },
        // Backdrop effects
        "backdrop-blur-in": {
          "0%": { backdropFilter: "blur(0px)", opacity: "0" },
          "100%": { backdropFilter: "blur(10px)", opacity: "1" },
        },
        "backdrop-blur-out": {
          "0%": { backdropFilter: "blur(10px)", opacity: "1" },
          "100%": { backdropFilter: "blur(0px)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "flicker": "flicker 2s ease-in-out infinite",
        "flame": "flame 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
        // Cinematic fade animations
        "fade-in": "fade-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "fade-in-slow": "fade-in 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "fade-in-fast": "fade-in 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "fade-out": "fade-out 0.6s cubic-bezier(0.55, 0.06, 0.68, 0.19)",
        "fade-in-up": "fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-up-slow": "fade-in-up 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-down": "fade-in-down 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-left": "fade-in-left 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-right": "fade-in-right 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        // Blur transitions
        "blur-in": "blur-in 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "blur-in-slow": "blur-in 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "blur-out": "blur-out 0.8s cubic-bezier(0.55, 0.06, 0.68, 0.19)",
        "focus-in": "focus-in 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        // Text reveal animations
        "text-reveal": "text-reveal 1.2s cubic-bezier(0.77, 0, 0.175, 1)",
        "text-reveal-slow": "text-reveal 2s cubic-bezier(0.77, 0, 0.175, 1)",
        "text-reveal-up": "text-reveal-up 1s cubic-bezier(0.77, 0, 0.175, 1)",
        "typewriter": "typewriter 2s steps(20) forwards",
        "typewriter-fast": "typewriter 1s steps(15) forwards",
        "typewriter-slow": "typewriter 3s steps(30) forwards",
        // Fire-themed animations
        "fire-glow": "fire-glow 3s ease-in-out infinite",
        "fire-glow-fast": "fire-glow 1.5s ease-in-out infinite",
        "ember-pulse": "ember-pulse 2.5s ease-in-out infinite",
        "flame-dance": "flame-dance 4s ease-in-out infinite",
        "flame-dance-fast": "flame-dance 2s ease-in-out infinite",
        // Pulse effects for UI elements
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "pulse-glow-fast": "pulse-glow 1s ease-in-out infinite",
        "heartbeat": "heartbeat 1.5s ease-in-out infinite",
        // Cinematic entrance effects
        "slide-in-cinematic": "slide-in-cinematic 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-cinematic-slow": "slide-in-cinematic 2s cubic-bezier(0.16, 1, 0.3, 1)",
        "zoom-in-cinematic": "zoom-in-cinematic 1.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "zoom-in-cinematic-fast": "zoom-in-cinematic 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        // Text gradient animations
        "gradient-x": "gradient-x 15s ease infinite",
        "gradient-y": "gradient-y 15s ease infinite",
        "gradient-xy": "gradient-xy 20s ease infinite",
        // Backdrop effects
        "backdrop-blur-in": "backdrop-blur-in 0.8s ease-out",
        "backdrop-blur-out": "backdrop-blur-out 0.6s ease-in",
      },
      backgroundImage: {
        "fire-gradient": "linear-gradient(45deg, #f97316, #ea580c, #dc2626)",
        "ember-gradient": "linear-gradient(45deg, #ec4899, #db2777, #be185d)",
        "flame-gradient": "linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)",
        // Cinematic gradients
        "cinematic-fade": "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)",
        "cinematic-overlay": "linear-gradient(45deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
        "hero-gradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "sunset-gradient": "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
        "aurora-gradient": "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        "midnight-gradient": "linear-gradient(135deg, #232526 0%, #414345 100%)",
        "neon-gradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        // Text gradients for animation
        "text-gradient-fire": "linear-gradient(90deg, #f97316, #ea580c, #dc2626, #b91c1c)",
        "text-gradient-ember": "linear-gradient(90deg, #ec4899, #db2777, #be185d, #9d174d)",
        "text-gradient-cinematic": "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b)",
        "text-gradient-gold": "linear-gradient(90deg, #fbbf24, #f59e0b, #d97706, #92400e)",
        // Radial gradients
        "radial-fire": "radial-gradient(circle, #f97316 0%, #ea580c 50%, #dc2626 100%)",
        "radial-glow": "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
        "spotlight": "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 50%)",
      },
      // Custom timing functions for cinematic effects
      transitionTimingFunction: {
        'ease-in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'ease-in-out-expo': 'cubic-bezier(1, 0, 0, 1)',
        'ease-in-circ': 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
        'ease-out-circ': 'cubic-bezier(0.075, 0.82, 0.165, 1)',
        'ease-in-out-circ': 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
        'ease-in-back': 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
        'ease-out-back': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'ease-in-out-back': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'cinematic': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'dramatic': 'cubic-bezier(0.77, 0, 0.175, 1)',
      },
      // Responsive animation scaling
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        // Animation-specific breakpoints
        'motion-safe': { 'raw': '(prefers-reduced-motion: no-preference)' },
        'motion-reduce': { 'raw': '(prefers-reduced-motion: reduce)' },
        // Container query support
        'container-sm': { 'raw': '(min-width: 400px)' },
        'container-md': { 'raw': '(min-width: 600px)' },
        'container-lg': { 'raw': '(min-width: 800px)' },
      },
      // Custom shadow effects for depth
      boxShadow: {
        'fire': '0 0 20px rgba(249, 115, 22, 0.5), 0 0 40px rgba(234, 88, 12, 0.3)',
        'fire-lg': '0 0 30px rgba(249, 115, 22, 0.6), 0 0 60px rgba(234, 88, 12, 0.4)',
        'ember': '0 0 15px rgba(236, 72, 153, 0.5), 0 0 30px rgba(219, 39, 119, 0.3)',
        'glow': '0 0 15px rgba(59, 130, 246, 0.5), 0 0 30px rgba(147, 197, 253, 0.3)',
        'glow-lg': '0 0 25px rgba(59, 130, 246, 0.6), 0 0 50px rgba(147, 197, 253, 0.4)',
        'cinematic': '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'depth': '0 32px 64px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.1)',
        'text-glow': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
      },
      // Backdrop blur utilities
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
        'cinematic': '8px',
      },
      // Custom utilities for responsive animations
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        // Responsive text sizes for cinematic effect
        'hero': ['clamp(2.5rem, 8vw, 8rem)', { lineHeight: '1' }],
        'display': ['clamp(2rem, 6vw, 6rem)', { lineHeight: '1.1' }],
        'title': ['clamp(1.5rem, 4vw, 4rem)', { lineHeight: '1.2' }],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Custom plugin for cinematic utilities
    function({ addUtilities, theme }: any) {
      const newUtilities = {
        // Text gradient utilities
        '.text-gradient': {
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          backgroundSize: '200% 200%',
        },
        '.text-gradient-fire': {
          backgroundImage: theme('backgroundImage.text-gradient-fire'),
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          backgroundSize: '200% 200%',
        },
        '.text-gradient-ember': {
          backgroundImage: theme('backgroundImage.text-gradient-ember'),
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          backgroundSize: '200% 200%',
        },
        '.text-gradient-cinematic': {
          backgroundImage: theme('backgroundImage.text-gradient-cinematic'),
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          backgroundSize: '200% 200%',
        },
        '.text-gradient-animated': {
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          backgroundSize: '200% 200%',
          animation: 'gradient-x 3s ease infinite',
        },
        // Cinematic effects
        '.cinematic-blur': {
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        },
        '.glass-effect': {
          backdropFilter: 'blur(10px) saturate(180%)',
          WebkitBackdropFilter: 'blur(10px) saturate(180%)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          backdropFilter: 'blur(10px) saturate(180%)',
          WebkitBackdropFilter: 'blur(10px) saturate(180%)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        // Fire-themed effects
        '.fire-text-glow': {
          color: '#f97316',
          textShadow: '0 0 10px #f97316, 0 0 20px #ea580c, 0 0 30px #dc2626',
        },
        '.ember-text-glow': {
          color: '#ec4899',
          textShadow: '0 0 10px #ec4899, 0 0 20px #db2777, 0 0 30px #be185d',
        },
        // Framer Motion compatible utilities
        '.will-change-transform': {
          willChange: 'transform',
        },
        '.will-change-opacity': {
          willChange: 'opacity',
        },
        '.will-change-filter': {
          willChange: 'filter',
        },
        '.will-change-auto': {
          willChange: 'auto',
        },
        // Responsive width utilities
        '.w-screen-safe': {
          width: '100vw',
          maxWidth: '100%',
        },
        '.max-w-screen': {
          maxWidth: '100vw',
        },
        '.min-w-0': {
          minWidth: '0',
        },
        // Overflow utilities
        '.overflow-x-clip': {
          overflowX: 'clip',
        },
        '.overflow-y-clip': {
          overflowY: 'clip',
        },
        // Performance optimizations for animations
        '.transform-gpu': {
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        },
        // Responsive animation utilities
        '.animate-on-scroll': {
          opacity: '0',
          transform: 'translateY(50px)',
          transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        },
        '.animate-on-scroll.in-view': {
          opacity: '1',
          transform: 'translateY(0)',
        },
        // Motion-safe preferences
        '@media (prefers-reduced-motion: reduce)': {
          '.animate-fade-in, .animate-fade-in-up, .animate-fade-in-down, .animate-fade-in-left, .animate-fade-in-right': {
            animation: 'none',
            opacity: '1',
            transform: 'none',
          },
          '.animate-blur-in, .animate-focus-in': {
            animation: 'none',
            filter: 'none',
            opacity: '1',
          },
          '.animate-text-reveal, .animate-text-reveal-up, .animate-typewriter': {
            animation: 'none',
            clipPath: 'none',
            width: 'auto',
          },
          '.animate-fire-glow, .animate-ember-pulse, .animate-flame-dance': {
            animation: 'none',
          },
          '.animate-pulse-soft, .animate-pulse-glow, .animate-heartbeat': {
            animation: 'none',
          },
          '.animate-slide-in-cinematic, .animate-zoom-in-cinematic': {
            animation: 'none',
            opacity: '1',
            transform: 'none',
          },
        },
        // Stagger delay utilities for complex animations
        '.delay-100': { animationDelay: '100ms' },
        '.delay-200': { animationDelay: '200ms' },
        '.delay-300': { animationDelay: '300ms' },
        '.delay-500': { animationDelay: '500ms' },
        '.delay-700': { animationDelay: '700ms' },
        '.delay-1000': { animationDelay: '1000ms' },
        // Transform origin utilities for better animations
        '.origin-center-bottom': { transformOrigin: 'center bottom' },
        '.origin-center-top': { transformOrigin: 'center top' },
        '.origin-left-center': { transformOrigin: 'left center' },
        '.origin-right-center': { transformOrigin: 'right center' },
        // Responsive spacing utilities
        '.space-responsive': {
          gap: 'clamp(0.5rem, 2vw, 1.5rem)',
        },
        '.p-responsive': {
          padding: 'clamp(1rem, 4vw, 2rem)',
        },
        '.px-responsive': {
          paddingLeft: 'clamp(1rem, 4vw, 2rem)',
          paddingRight: 'clamp(1rem, 4vw, 2rem)',
        },
        '.py-responsive': {
          paddingTop: 'clamp(1rem, 4vh, 2rem)',
          paddingBottom: 'clamp(1rem, 4vh, 2rem)',
        },
        // Safe area utilities for mobile
        '.pt-safe': {
          paddingTop: 'env(safe-area-inset-top, 1rem)',
        },
        '.pb-safe': {
          paddingBottom: 'env(safe-area-inset-bottom, 1rem)',
        },
        '.pl-safe': {
          paddingLeft: 'env(safe-area-inset-left, 1rem)',
        },
        '.pr-safe': {
          paddingRight: 'env(safe-area-inset-right, 1rem)',
        },
      }
      
      addUtilities(newUtilities)
    }
  ],
} satisfies Config

export default config