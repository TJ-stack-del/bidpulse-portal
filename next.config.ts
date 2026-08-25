import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000', 
        '*.app.github.dev',
        'orange-guide-r7p4vp67wg9v2xrr9-3000.app.github.dev'
      ],
    },
  },
};

export default nextConfig;