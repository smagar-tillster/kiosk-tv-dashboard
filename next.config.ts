import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/kiosk-tv-dashboard' : '', // Only use basePath for production build
  images: {
    unoptimized: true,
  },
  // For local development, environment variables are read from .env.local
  // For production (GitHub Pages), use NEXT_PUBLIC_API_ENDPOINT to point to AWS Lambda
  // DO NOT include sensitive keys in the env block - they will be exposed in the client bundle!
  env: process.env.NODE_ENV === 'development' ? {
    NEWRELIC_TENANT_BKUS: process.env.NEWRELIC_TENANT_BKUS,
    NEWRELIC_ACCOUNT_ID_BKUS: process.env.NEWRELIC_ACCOUNT_ID_BKUS,
    NEWRELIC_API_KEY_BKUS: process.env.NEWRELIC_API_KEY_BKUS,
    NEWRELIC_TENANT_PLKUS: process.env.NEWRELIC_TENANT_PLKUS,
    NEWRELIC_ACCOUNT_ID_PLKUS: process.env.NEWRELIC_ACCOUNT_ID_PLKUS,
    NEWRELIC_API_KEY_PLKUS: process.env.NEWRELIC_API_KEY_PLKUS,
  } : {},
};

export default nextConfig;

