/**
 * Configuration Library - All configs in one place
 */

// Chart Configs
export * from './base.config';
export * from './line-chart.config';
export * from './bar-chart.config';
export * from './map.config';
export * from './heatmap.config';

// Page Configs
export * from './main-dashboard.config';
export * from './map-dashboard.config';

// App Configs
export * from './tenant-config';
export * from './dashboard-config';
export * from './city-coordinates';

// Registry of all pages
export const PAGE_REGISTRY = {
  'main-dashboard': () => import('./main-dashboard.config').then(m => m.MAIN_DASHBOARD_CONFIG),
  'map-dashboard': () => import('./map-dashboard.config').then(m => m.MAP_DASHBOARD_CONFIG),
};
