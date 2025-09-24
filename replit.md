# Ignite Health Systems - Clinical Co-pilot Platform

## Overview

Ignite Health Systems is a healthcare technology platform designed to revolutionize independent medicine through an AI-native clinical operating system. The platform aims to eliminate the fragmentation crisis in healthcare technology by replacing multiple disconnected tools with a unified intelligence layer. Built around the philosophical mission of moving healthcare "From Extraction to Regeneration," it serves as a clinical co-pilot that restores physicians' focus to patient care by dramatically reducing administrative overhead.

The application is a full-stack web platform featuring a public-facing website with podcast-style content, physician testimonials, platform information, and signup capabilities for an Innovation Council. The platform emphasizes bold, flame-inspired design aesthetics that convey transformative medical innovation and clinical authority.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side routing with file-based page organization
- **Styling**: Tailwind CSS with a custom design system based on shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Theme System**: Custom light/dark theme provider with CSS variables
- **Component Library**: Radix UI primitives with custom styling for accessibility

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Development Setup**: Development server with hot module replacement via Vite integration
- **API Structure**: RESTful endpoints with `/api` prefix routing
- **Storage Interface**: Abstracted storage layer with in-memory implementation (placeholder for database integration)
- **Error Handling**: Centralized error middleware with proper HTTP status codes

### Data Layer
- **ORM**: Drizzle ORM configured for PostgreSQL with type-safe schema definitions
- **Database**: PostgreSQL via Neon serverless configuration
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Connection pooling with WebSocket support for serverless environments

### Design System
- **Brand Colors**: Deep flame red primary (15 85% 45%) with charcoal black secondary (25 20% 12%)
- **Typography**: Inter (primary), Source Serif Pro (testimonials), JetBrains Mono (technical)
- **Component Variants**: Comprehensive design tokens with elevation states and interactive feedback
- **Layout System**: Consistent spacing primitives and responsive grid layouts
- **Accessibility**: ARIA-compliant components with keyboard navigation support

### Content Architecture
- **Static Assets**: Organized asset management with build-time optimization
- **Content Types**: Structured content for episodes, testimonials, platform information, and user profiles
- **Form Handling**: React Hook Form with Zod validation schemas
- **Responsive Design**: Mobile-first approach with breakpoint-based adaptations

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18+ with TypeScript, React DOM, React Router (Wouter)
- **Build Tools**: Vite with TypeScript support, PostCSS, Autoprefixer
- **Development**: Replit-specific plugins for runtime error handling and development banners

### UI and Styling
- **Component Library**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with class-variance-authority for component variants
- **Utilities**: clsx and tailwind-merge for conditional styling
- **Icons**: Lucide React for consistent iconography

### Database and Backend
- **Database**: Neon PostgreSQL with serverless WebSocket connections
- **ORM**: Drizzle ORM with Zod schema validation
- **Server**: Express.js with session management and middleware support
- **Session Storage**: connect-pg-simple for PostgreSQL session storage

### Form and Data Management
- **Forms**: React Hook Form with Hookform Resolvers for validation integration
- **Validation**: Zod for schema validation and type safety
- **State Management**: TanStack React Query for server state and caching
- **Date Handling**: date-fns for date manipulation and formatting

### Development and Deployment
- **TypeScript**: Full TypeScript support with strict configuration
- **Build**: ESBuild for production server bundling
- **Development**: tsx for TypeScript execution in development
- **Environment**: Node.js with ES modules support

The application follows a modern full-stack architecture with strong typing, component reusability, and scalable design patterns suitable for a healthcare technology platform requiring high reliability and user experience standards.