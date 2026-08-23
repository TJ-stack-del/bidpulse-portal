import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Allows production builds to succeed while Next.js generated route types sync
    ignoreBuildErrors: false,
  },
  experimental: {
    typedRoutes: false,
  },
};

export default nextConfig;
