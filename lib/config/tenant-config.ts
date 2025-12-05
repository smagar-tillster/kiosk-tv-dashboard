/**
 * Tenant Configuration
 * All sensitive data (account IDs, API keys) are read from environment variables
 * Configure these in .env.local for local development
 * Configure in AWS Lambda environment variables for production
 */

export interface TenantConfig {
  name: string;
  accountId: string;
  apiKey: string;
}

export const TENANT_CONFIG = {
  BKUS: {
    name: 'BK-US',
    accountId: process.env.NEWRELIC_ACCOUNT_ID_BKUS || '',
    apiKey: process.env.NEWRELIC_API_KEY_BKUS || '',
  },
  PLKUS: {
    name: 'PLK-US',
    accountId: process.env.NEWRELIC_ACCOUNT_ID_PLKUS || '',
    apiKey: process.env.NEWRELIC_API_KEY_PLKUS || '',
  },
} as const;

export type TenantCode = keyof typeof TENANT_CONFIG;
