import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignore ESLint errors during the build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during the build
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  // Your other config options can remain here
};

export default nextConfig;