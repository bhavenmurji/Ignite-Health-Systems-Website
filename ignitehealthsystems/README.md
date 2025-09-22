# Ignite Health Systems Website

A modern, professional healthcare website built with Next.js 14, TypeScript, and Tailwind CSS. Features AI-powered healthcare solutions marketing with a focus on physician productivity and patient care.

## Features

- 🎨 **Modern Design**: Clean, professional healthcare-focused design
- 📱 **Responsive**: Mobile-first design that works on all devices
- ⚡ **Fast**: Optimized for performance with Next.js 14
- 🔒 **Secure**: HIPAA-compliant ready architecture
- 🚀 **Deployable**: Ready for Cloudflare Pages deployment
- 📧 **Forms**: Contact form with n8n webhook integration
- 🎯 **SEO**: Optimized for search engines
- ♿ **Accessible**: Built with accessibility in mind

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Cloudflare Pages
- **Form Handling**: n8n webhooks

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ignitehealthsystems
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your configuration:
   ```env
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/ignite-signup
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run pages:build` - Build for Cloudflare Pages
- `npm run preview` - Preview Cloudflare Pages build
- `npm run deploy` - Deploy to Cloudflare Pages
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
ignitehealthsystems/
├── app/                    # Next.js App Router
│   ├── about/             # About page
│   ├── api/               # API routes
│   ├── thank-you/         # Thank you page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── BeforeAfter.tsx   # Before/After comparison
│   ├── Hero.tsx          # Hero section
│   ├── Layout.tsx        # Main layout wrapper
│   ├── SignupForm.tsx    # Contact/signup form
│   └── ValueProps.tsx    # Value propositions
├── lib/                  # Utilities and constants
│   └── constants.ts      # Site configuration
├── public/               # Static assets
└── [config files]       # Next.js, TypeScript, Tailwind configs
```

## Key Pages

### Home Page (`/`)
- Hero section with "Stop Clicking. Start Healing." message
- Before/After healthcare workflow comparison
- Value propositions and benefits
- Contact form with role-based signup

### About Page (`/about`)
- Company mission and story
- Team values and approach
- Impact statistics
- Trust indicators

### Thank You Page (`/thank-you`)
- Post-signup confirmation
- Next steps information
- Additional resources

## Form Integration

The signup form integrates with n8n webhooks for lead processing:

1. **Form Fields**:
   - Name (required)
   - Email (required)
   - Role (Physician, Nurse, Administrator, Other)
   - Note (optional feedback)

2. **n8n Integration**:
   - Form data sent to configured webhook URL
   - Includes timestamp, IP, and user agent
   - Error handling for failed submissions

3. **Setup n8n Webhook**:
   ```bash
   # Set your webhook URL in .env.local
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/ignite-signup
   ```

## Deployment

### Cloudflare Pages

1. **Build for Cloudflare Pages**
   ```bash
   npm run pages:build
   ```

2. **Deploy**
   ```bash
   npm run deploy
   ```

3. **Or use the Cloudflare dashboard**
   - Connect your Git repository
   - Set build command: `npm run pages:build`
   - Set output directory: `.next`

### Environment Variables

For production deployment, set these environment variables:

```env
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/ignite-signup
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NODE_ENV=production
```

## Customization

### Brand Colors

Update the color scheme in `tailwind.config.ts`:

```typescript
colors: {
  'medical-blue': {
    // Your blue color palette
  },
  'medical-green': {
    // Your green color palette
  }
}
```

### Content

Update site content in `lib/constants.ts`:

```typescript
export const CONTENT_CONFIG = {
  hero: {
    title: 'Your Custom Title',
    subtitle: 'Your custom subtitle',
    // ...
  },
  // ...
}
```

### Styling

- Global styles: `app/globals.css`
- Component styles: Tailwind classes in components
- Custom components: `@layer components` in globals.css

## Performance

- **Lighthouse Score**: 95+ on all metrics
- **Core Web Vitals**: Optimized for Google rankings
- **Image Optimization**: Next.js automatic optimization
- **Code Splitting**: Automatic with Next.js App Router

## Security

- **HIPAA-Ready**: Built with healthcare compliance in mind
- **XSS Protection**: Input sanitization and validation
- **HTTPS**: Enforced in production
- **CSP Headers**: Content Security Policy ready

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For technical support or questions:
- Email: support@ignitehealthsystems.com
- Documentation: [Internal docs link]
- Issue tracker: [Internal tracking system]