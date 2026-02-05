/**
 * Map Dashboard Page Configuration
 * A dedicated page showing only US maps for both tenants
 */

import { PageConfig } from './base.config';
import { DEFAULT_MAP_CHART_CONFIG } from './map.config';

export const MAP_DASHBOARD_CONFIG: PageConfig = {
  id: 'map-dashboard',
  path: '/map-dashboard',
  title: 'US Alert Map Dashboard',
  description: 'Geographic distribution of alerts across the United States',
  
  style: {
    backgroundColor: '#ffffff',
    padding: '2rem',
  },
  
  layout: {
    type: 'grid',
    columns: 2,
    gap: '2rem',
  },
  
  charts: [
    {
      chartId: 'bkus-map-large',
      config: {
        ...DEFAULT_MAP_CHART_CONFIG,
        id: 'bkus-map-large',
        title: 'BK-US Alert Distribution',
        style: {
          height: '600px',
        },
        colors: {
          primary: '#22c55e',
        },
        showLabels: true,
        labelFontSize: 10,
      },
      dataSource: {
        connector: 'newrelic',
        query: 'alertHeatmap',
        tenant: 'BKUS',
      },
    },
    {
      chartId: 'plkus-map-large',
      config: {
        ...DEFAULT_MAP_CHART_CONFIG,
        id: 'plkus-map-large',
        title: 'PLK-US Alert Distribution',
        style: {
          height: '600px',
        },
        colors: {
          primary: '#f97316',
        },
        showLabels: true,
        labelFontSize: 10,
      },
      dataSource: {
        connector: 'newrelic',
        query: 'alertHeatmap',
        tenant: 'PLKUS',
      },
    },
  ],
  
  showRefreshButton: false,
  autoRefresh: true,
  refreshInterval: 15, // Auto-refresh every 15 minutes
};
