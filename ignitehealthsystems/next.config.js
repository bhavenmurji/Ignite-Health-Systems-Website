/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  output: 'export',
  distDir: '.next',
  assetPrefix: undefined,
}

module.exports = nextConfig