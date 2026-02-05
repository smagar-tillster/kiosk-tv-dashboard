import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use 'export' for static hosting (GitHub Pages), 'standalone' for Docker
  // output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : 'export',
  
  // For nginx subpath deployment
  basePath: '/nr-tv-dashboard',
  assetPrefix: '/nr-tv-dashboard',
  images: {
    unoptimized: true,
  },
  // For local development, environment variables are read from .env.local
  // For production (GitHub Pages), use NEXT_PUBLIC_API_ENDPOINT to point to AWS Lambda
  // For Docker, API endpoint is set via environment variable
  // Expose environment variables to the client in all modes (dev, Docker, and local production)
  env: {
    NEWRELIC_TENANT_BKUS: process.env.NEWRELIC_TENANT_BKUS,
    NEWRELIC_ACCOUNT_ID_BKUS: process.env.NEWRELIC_ACCOUNT_ID_BKUS,
    NEWRELIC_API_KEY_BKUS: process.env.NEWRELIC_API_KEY_BKUS,
    NEWRELIC_TENANT_PLKUS: process.env.NEWRELIC_TENANT_PLKUS,
    NEWRELIC_ACCOUNT_ID_PLKUS: process.env.NEWRELIC_ACCOUNT_ID_PLKUS,
    NEWRELIC_API_KEY_PLKUS: process.env.NEWRELIC_API_KEY_PLKUS,
  },
};

export default nextConfig;

