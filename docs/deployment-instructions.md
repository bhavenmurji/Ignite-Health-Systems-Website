# 🚀 Deployment Instructions - Ignite Health Systems

## Quick Deploy Options

### Option 1: Vercel (Recommended - Next.js Native)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# Follow prompts:
# - Connect to Git repository
# - Select team/personal account  
# - Configure domain (ignitehealthsystems.com)
```

**Benefits:**
- Zero-config Next.js deployment
- Automatic HTTPS
- Global CDN
- Built-in analytics
- Perfect for healthcare landing pages

### Option 2: Netlify (Static Export)
```bash
# Add export script to package.json
npm run build

# Deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=.next
```

**Benefits:**
- Static hosting
- Form handling built-in
- Branch previews
- Cost-effective

### Option 3: AWS (Enterprise Healthcare)
```bash
# Build for production
npm run build

# Deploy with AWS CLI
aws s3 sync .next/static s3://ignite-health-bucket/static
aws cloudfront create-invalidation --distribution-id E1234567890 --paths "/*"
```

**Benefits:**
- HIPAA compliance ready
- Enterprise security
- Custom configurations
- Healthcare industry standard

## Environment Configuration

### Production Environment Variables
```bash
# .env.production
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://ignitehealthsystems.com
NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_TELEMETRY_DISABLED=1

# Healthcare-specific
NEXT_PUBLIC_HIPAA_COMPLIANT=true
NEXT_PUBLIC_HEALTHCARE_MODE=true
```

### Build Configuration
```javascript
// next.config.mjs - Production optimization
const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  
  // Production optimizations
  swcMinify: true,
  compress: true,
  
  // Healthcare security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Audio file handling
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp3|wav|ogg|flac)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/sounds/',
          outputPath: 'static/sounds/',
        },
      },
    });
    return config;
  },
};
```

## Server Setup (Self-Hosted)

### Option 1: Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t ignite-health .
docker run -p 3000:3000 ignite-health
```

### Option 2: PM2 Process Manager
```bash
# Install PM2
npm install -g pm2

# Create ecosystem file
# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'ignite-health',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}

# Deploy
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Healthcare-Specific Configurations

### HIPAA Compliance Setup
```nginx
# nginx.conf - Healthcare security
server {
    listen 443 ssl http2;
    server_name ignitehealthsystems.com;
    
    # SSL/TLS Configuration
    ssl_certificate /etc/ssl/certs/ignite-health.crt;
    ssl_certificate_key /etc/ssl/private/ignite-health.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # Security Headers for Healthcare
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';" always;
    
    # Main application
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Static assets with long cache
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Service worker - no cache
    location /sw.js {
        expires off;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name ignitehealthsystems.com;
    return 301 https://$server_name$request_uri;
}
```

### Form Handling Backend
```javascript
// api/contact.js - Healthcare lead processing
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, organization, role, interest } = req.body;
  
  // Healthcare-specific validation
  const isValidHealthcareEmail = email.includes('@') && 
    (email.includes('hospital') || email.includes('clinic') || 
     email.includes('health') || email.includes('medical'));
  
  // Process healthcare lead
  try {
    // Save to healthcare CRM
    await saveToHealthcareCRM({
      name,
      email,
      organization,
      role,
      interest,
      source: 'website',
      industry: 'healthcare',
      timestamp: new Date().toISOString()
    });
    
    // Send notification to healthcare team
    await notifyHealthcareTeam({
      lead: { name, email, organization, role },
      priority: isValidHealthcareEmail ? 'high' : 'medium'
    });
    
    res.status(200).json({ 
      message: 'Thank you for your interest in transforming healthcare IT!' 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error processing your healthcare inquiry' 
    });
  }
}
```

## Analytics & Monitoring

### Google Analytics 4 Setup
```javascript
// lib/analytics.js
export const GA_TRACKING_ID = 'G-XXXXXXXXXX'

// Track healthcare-specific events
export const trackHealthcareEvent = (action, category, label, value) => {
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    custom_parameter_1: 'healthcare_industry'
  })
}

// Healthcare conversion events
export const trackHealthcareConversion = (conversionType) => {
  gtag('event', 'conversion', {
    event_category: 'healthcare_lead',
    event_label: conversionType,
    send_to: GA_TRACKING_ID
  })
}
```

### Health Check Endpoint
```javascript
// api/health.js - Production monitoring
export default function handler(req, res) {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'Ignite Health Systems - OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    status: 'healthy'
  };
  
  res.status(200).json(healthcheck);
}
```

## Domain & DNS Configuration

### Domain Setup
```bash
# DNS Records for ignitehealthsystems.com
A     @               192.168.1.100
A     www             192.168.1.100
CNAME api             api.ignitehealthsystems.com
MX    @               10 mail.ignitehealthsystems.com

# For Vercel deployment
CNAME @               cname.vercel-dns.com
CNAME www             cname.vercel-dns.com
```

### SSL Certificate
```bash
# Let's Encrypt SSL
sudo certbot --nginx -d ignitehealthsystems.com -d www.ignitehealthsystems.com

# Or upload purchased SSL certificate
sudo cp ignite-health.crt /etc/ssl/certs/
sudo cp ignite-health.key /etc/ssl/private/
```

## Go-Live Checklist

### Pre-Launch (24 hours before)
- [ ] Final production build test
- [ ] SSL certificate validated
- [ ] DNS propagation verified
- [ ] Backup strategy confirmed
- [ ] Monitoring alerts configured
- [ ] Healthcare team notified

### Launch Day
- [ ] Deploy to production
- [ ] Verify all pages load correctly
- [ ] Test form submissions
- [ ] Check mobile responsiveness
- [ ] Validate analytics tracking
- [ ] Monitor error logs
- [ ] Test audio playback
- [ ] Verify service worker caching

### Post-Launch (First 48 hours)
- [ ] Monitor Core Web Vitals
- [ ] Track conversion rates
- [ ] Review error reports
- [ ] Check uptime status
- [ ] Validate healthcare lead quality
- [ ] Monitor server performance
- [ ] Test backup procedures

## Support & Maintenance

### Regular Maintenance
```bash
# Weekly maintenance
npm audit && npm update
pm2 flush # Clear logs
certbot renew # Renew SSL

# Monthly maintenance
npm outdated # Check dependencies
lighthouse https://ignitehealthsystems.com # Performance audit
```

### Emergency Procedures
1. **Site Down:** Check server status, restart PM2
2. **Form Issues:** Verify API endpoints and database
3. **SSL Problems:** Check certificate expiration
4. **Performance Issues:** Review Core Web Vitals

## Cost Estimates

| Platform | Monthly Cost | Features |
|----------|-------------|----------|
| Vercel Pro | $20 | Perfect for healthcare startups |
| Netlify Pro | $19 | Good for static sites |
| AWS/DigitalOcean | $25-50 | Full control, HIPAA ready |
| Self-hosted | $10-30 | Maximum customization |

## Conclusion

The Ignite Health Systems website is production-ready with multiple deployment options. Choose based on your healthcare organization's compliance requirements, budget, and technical expertise.

**Recommended:** Start with Vercel for immediate deployment, then migrate to AWS for enterprise healthcare compliance if needed.

---

*Last Updated: September 11, 2025*
*Healthcare IT Deployment Guide v1.0*