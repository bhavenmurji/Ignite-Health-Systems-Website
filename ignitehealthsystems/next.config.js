/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  output: 'export',
  distDir: '.next',
  assetPrefix: undefined,
  // Fix workspace detection warnings
  outputFileTracingRoot: __dirname,
  // Optimize for static deployment
  generateEtags: false,
  poweredByHeader: false,
  reactStrictMode: true,
  // Configure for GitHub Pages
  basePath: '',
  // Ensure static export works properly
  experimental: {
    largePageDataBytes: 128 * 1000, // 128KB
  },
}

module.exports = nextConfig