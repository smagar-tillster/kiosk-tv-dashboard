/**
 * Page Configuration System
 * Define dashboard pages with their charts and layouts
 */

import { ChartConfig } from './line-chart.config';

export interface PageStyleConfig {
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  padding?: string | number;
  maxWidth?: string | number;
}

export interface ChartLayoutItem {
  chartId: string;
  config: ChartConfig;
  gridArea?: string;
  className?: string;
  dataSource?: {
    connector: string;
    query: string;
    tenant?: string;
    transform?: (data: any) => any;
  };
}

export interface PageConfig {
  // Page identification
  id: string;
  path: string;
  title: string;
  description?: string;
  
  // Styling
  style?: PageStyleConfig;
  
  // Layout
  layout: {
    type: 'grid' | 'flex' | 'custom';
    columns?: number;
    gap?: string | number;
    areas?: string[];
  };
  
  // Charts
  charts: ChartLayoutItem[];
  
  // Behavior
  refreshInterval?: number; // minutes
  showRefreshButton?: boolean;
  autoRefresh?: boolean;
}
