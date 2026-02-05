/**
 * Page Configuration System
 * Define dashboard pages with their charts and layouts
 */

/**
 * Base configuration for all chart types
 */
export interface BaseChartConfig {
  // Display
  title?: string;
  description?: string;
  responsive?: boolean;
  
  // Colors
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
    grid?: string;
  };
  
  // Interactions
  showTooltip?: boolean;
  showLegend?: boolean;
  animation?: boolean;
  
  // Dimensions
  width?: string | number;
  height?: string | number;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

/**
 * Axis configuration for charts
 */
export interface ChartAxisConfig {
  show?: boolean;
  showGrid?: boolean;
  label?: string;
  fontSize?: number;
  fontWeight?: string | number;
  color?: string;
  tickCount?: number;
  tickFormat?: string;
  angle?: number;
  width?: number;
  dataKey?: string;
}

export interface PageStyleConfig {
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  padding?: string | number;
  maxWidth?: string | number;
}

export interface ChartLayoutItem {
  chartId: string;
  config: any; // Can be LineChartConfig, BarChartConfig, MapChartConfig, etc.
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
