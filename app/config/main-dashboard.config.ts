/**
 * Main Dashboard Page Configuration
 */

import { PageConfig } from './base.config';
import { DEFAULT_LINE_CHART_CONFIG } from './line-chart.config';
import { DEFAULT_BAR_CHART_CONFIG } from './bar-chart.config';
import { DEFAULT_MAP_CHART_CONFIG } from './map.config';
import { DEFAULT_HEATMAP_CHART_CONFIG } from './heatmap.config';

export const MAIN_DASHBOARD_CONFIG: PageConfig = {
  id: 'main-dashboard',
  path: '/',
  title: 'Tillster Proactive Monitoring Dashboard',
  description: 'Real-time monitoring of kiosk operations across all locations',
  
  style: {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
  },
  
  layout: {
    type: 'grid',
    columns: 2,
    gap: '1.5rem',
  },
  
  charts: [
    {
      chartId: 'bkus-order-failure-trend',
      config: {
        ...DEFAULT_LINE_CHART_CONFIG,
        id: 'bkus-order-failure-trend',
        title: 'BK-US Order Failure Trend',
        colors: {
          primary: '#22c55e',
        },
      },
      dataSource: {
        connector: 'newrelic',
        query: 'orderFailureTrend',
        tenant: 'BKUS',
      },
    },
    {
      chartId: 'plkus-order-failure-trend',
      config: {
        ...DEFAULT_LINE_CHART_CONFIG,
        id: 'plkus-order-failure-trend',
        title: 'PLK-US Order Failure Trend',
        colors: {
          primary: '#f97316',
        },
      },
      dataSource: {
        connector: 'newrelic',
        query: 'orderFailureTrend',
        tenant: 'PLKUS',
      },
    },
    {
      chartId: 'bkus-failure-types',
      config: {
        ...DEFAULT_BAR_CHART_CONFIG,
        id: 'bkus-failure-types',
        title: 'BK-US Order Failure Types',
        colors: {
          primary: '#22c55e',
        },
      },
      dataSource: {
        connector: 'newrelic',
        query: 'orderFailureTypes',
        tenant: 'BKUS',
      },
    },
    {
      chartId: 'plkus-failure-types',
      config: {
        ...DEFAULT_BAR_CHART_CONFIG,
        id: 'plkus-failure-types',
        title: 'PLK-US Order Failure Types',
        colors: {
          primary: '#f97316',
        },
      },
      dataSource: {
        connector: 'newrelic',
        query: 'orderFailureTypes',
        tenant: 'PLKUS',
      },
    },
    {
      chartId: 'bkus-us-map',
      config: {
        ...DEFAULT_MAP_CHART_CONFIG,
        id: 'bkus-us-map',
        title: 'BK-US Alert Heatmap',
      },
      dataSource: {
        connector: 'newrelic',
        query: 'alertHeatmap',
        tenant: 'BKUS',
      },
    },
    {
      chartId: 'plkus-us-map',
      config: {
        ...DEFAULT_MAP_CHART_CONFIG,
        id: 'plkus-us-map',
        title: 'PLK-US Alert Heatmap',
      },
      dataSource: {
        connector: 'newrelic',
        query: 'alertHeatmap',
        tenant: 'PLKUS',
      },
    },
  ],
  
  showRefreshButton: true,
  autoRefresh: false,
  refreshInterval: 30,
};
