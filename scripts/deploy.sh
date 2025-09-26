#!/bin/bash

# Ignite Health Systems - Deploy to Cloudflare Pages
echo "🚀 Starting deployment to Cloudflare Pages..."

# Build the Next.js application for static export
echo "📦 Building Next.js application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful! Static files generated in dist/ folder"

    echo ""
    echo "🎯 Next steps for deployment:"
    echo ""
    echo "1. Go to https://dash.cloudflare.com/pages"
    echo "2. Click 'Create a project'"
    echo "3. Connect to your GitHub repository"
    echo "4. Set these build settings:"
    echo "   - Framework preset: Next.js (Static HTML Export)"
    echo "   - Build command: npm run build"
    echo "   - Build output directory: dist"
    echo "5. Add environment variables from .env.local"
    echo ""
    echo "📁 Files are ready in: $(pwd)/dist/"
    echo "🌐 Domain will be: ignitehealthsystems.com"
    echo ""
    echo "✨ Deployment ready!"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi