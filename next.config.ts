
import type {NextConfig} from 'next';

// Using require for next-pwa as it's commonly used this way in next.config.js
// and next.config.ts gets transpiled.
// Ensure next-pwa is installed: npm install next-pwa
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true, // Register the service worker
  skipWaiting: true, // Activate new service worker as soon as it's ready
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development
  // runtimeCaching: [ ... ] // Add runtime caching strategies if needed
});

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withPWA(nextConfig);
