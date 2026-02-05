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

/**
 * Dashboard Configuration
 * Controls UI features and auto-refresh behavior
 */
export interface DashboardConfig {
  /**
   * Show/hide the header section
   */
  showHeader: boolean;
  
  /**
   * Show/hide dark mode toggle
   */
  showDarkMode: boolean;
  
  /**
   * Enable/disable manual refresh button
   * If false, dashboard will auto-refresh at the interval specified
   */
  showRefreshButton: boolean;
  
  /**
   * Auto-refresh interval in minutes
   * Only applies when showRefreshButton is false
   */
  autoRefreshMinutes: number;
  
  /**
   * Default theme mode
   * 'light' | 'dark'
   */
  defaultTheme: 'light' | 'dark';
}

export const DASHBOARD_CONFIG: DashboardConfig = {
  showHeader: process.env.NEXT_PUBLIC_SHOW_HEADER !== 'false',
  showDarkMode: process.env.NEXT_PUBLIC_SHOW_DARK_MODE !== 'false',
  // Set to true to show manual refresh button (no auto-refresh)
  // Set to false to hide button and enable auto-refresh
  showRefreshButton: false, // Hardcoded: false (auto-refresh enabled)
  // Auto-refresh interval (only used when showRefreshButton is false)
  autoRefreshMinutes: Number(process.env.NEXT_PUBLIC_AUTO_REFRESH_MINUTES) || 15, // Default: 1 minute
  // Default theme: 'light' or 'dark'
  defaultTheme: (process.env.NEXT_PUBLIC_DEFAULT_THEME as 'light' | 'dark') || 'dark',
};

export const TENANT_CONFIG = {
  BKUS: {
    name: 'BK-US',
    tenant: (process.env.NEXT_PUBLIC_NEWRELIC_TENANT_BKUS || process.env.NEWRELIC_TENANT_BKUS || 'BKUS') as 'BKUS' | 'PLKUS',
    accountId: process.env.NEXT_PUBLIC_NEWRELIC_ACCOUNT_ID_BKUS || process.env.NEWRELIC_ACCOUNT_ID_BKUS || '',
    apiKey: process.env.NEXT_PUBLIC_NEWRELIC_API_KEY_BKUS || process.env.NEWRELIC_API_KEY_BKUS || '',
  },
  PLKUS: {
    name: 'PLK-US',
    tenant: (process.env.NEXT_PUBLIC_NEWRELIC_TENANT_PLKUS || process.env.NEWRELIC_TENANT_PLKUS || 'PLKUS') as 'BKUS' | 'PLKUS',
    accountId: process.env.NEXT_PUBLIC_NEWRELIC_ACCOUNT_ID_PLKUS || process.env.NEWRELIC_ACCOUNT_ID_PLKUS || '',
    apiKey: process.env.NEXT_PUBLIC_NEWRELIC_API_KEY_PLKUS || process.env.NEWRELIC_API_KEY_PLKUS || '',
  },
} as const;

export type TenantCode = keyof typeof TENANT_CONFIG;
