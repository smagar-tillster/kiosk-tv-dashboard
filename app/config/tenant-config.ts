/**
 * Tenant Configuration
 * All sensitive data (account IDs, API keys) are read from environment variables
 * Configure these in .env.local for local development
 * Configure in AWS Lambda environment variables for production
 */

export interface TenantConfig {
  name: string;
  tenant: 'BKUS' | 'PLKUS';
  accountId: string;
  apiKey: string;
}

export interface DashboardConfig {
  showHeader: boolean;
  showDarkMode: boolean;
  showRefreshButton: boolean;
}

export const DASHBOARD_CONFIG: DashboardConfig = {
  showHeader: process.env.NEXT_PUBLIC_SHOW_HEADER !== 'false',
  showDarkMode: process.env.NEXT_PUBLIC_SHOW_DARK_MODE !== 'false',
  showRefreshButton: process.env.NEXT_PUBLIC_SHOW_REFRESH !== 'false',
};

export const TENANT_CONFIG = {
  BKUS: {
    name: 'BK-US',
    tenant: (process.env.NEWRELIC_TENANT_BKUS || 'BKUS') as 'BKUS' | 'PLKUS',
    accountId: process.env.NEWRELIC_ACCOUNT_ID_BKUS || '',
    apiKey: process.env.NEWRELIC_API_KEY_BKUS || '',
  },
  PLKUS: {
    name: 'PLK-US',
    tenant: (process.env.NEWRELIC_TENANT_PLKUS || 'PLKUS') as 'BKUS' | 'PLKUS',
    accountId: process.env.NEWRELIC_ACCOUNT_ID_PLKUS || '',
    apiKey: process.env.NEWRELIC_API_KEY_PLKUS || '',
  },
} as const;

export type TenantCode = keyof typeof TENANT_CONFIG;
