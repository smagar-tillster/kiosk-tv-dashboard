import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/tv-dashboard' : '',
  images: {
    unoptimized: true,
  },
  env: {
    NEWRELIC_ACCOUNT_ID_BKUS: process.env.NEWRELIC_ACCOUNT_ID_BKUS,
    NEWRELIC_API_KEY_BKUS: process.env.NEWRELIC_API_KEY_BKUS,
    NEWRELIC_ACCOUNT_ID_PLKUS: process.env.NEWRELIC_ACCOUNT_ID_PLKUS,
    NEWRELIC_API_KEY_PLKUS: process.env.NEWRELIC_API_KEY_PLKUS,
  },
};

export default nextConfig;

