const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'example.com' },
      { hostname: 'avatars.githubusercontent.com' }
    ]
  },
  output: 'standalone',
  experimental: {
    // 禁用 Turbopack 相关的默认行为
  }
}

module.exports = nextConfig
