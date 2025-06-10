/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  compress: true,
  // Allow ngrok and other development domains
  async headers() {
    return [
      {
        // Apply these headers to all routes in development
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'development' 
              ? '*' // Allow all origins in development (including ngrok)
              : 'https://yourdomain.com', // Replace with your production domain
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization',
          },
        ],
      },
    ]
  },
  // Allow ngrok domains in development
  experimental: {
    allowedDevOrigins: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://*.ngrok.io',
      'https://*.ngrok-free.app',
      'https://*.ngrok.app',
      'https://*.exp.direct',
    ],
  },
}

export default nextConfig
