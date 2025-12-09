/**
 * Dashboard Configuration
 */

export interface DashboardConfig {
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
}

/**
 * Default dashboard configuration
 */
export const DASHBOARD_CONFIG: DashboardConfig = {
  // Set to true to show manual refresh button (no auto-refresh)
  // Set to false to hide button and enable auto-refresh
  showRefreshButton: true,
  
  // Auto-refresh interval (only used when showRefreshButton is false)
  autoRefreshMinutes: 30,
};
