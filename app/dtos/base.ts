/**
 * Base DTO types for all charts
 */

/**
 * Base chart data point interface
 */
export interface ChartDataPoint {
  [key: string]: any;
}

/**
 * Time series data point
 */
export interface TimeSeriesDataPoint extends ChartDataPoint {
  timestamp: number;
  date: string;
  value: number;
}

/**
 * Categorical data point
 */
export interface CategoricalDataPoint extends ChartDataPoint {
  category: string;
  value: number;
  label?: string;
}

/**
 * Geographic data point
 */
export interface GeoDataPoint extends ChartDataPoint {
  state?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  value: number;
}

/**
 * Heatmap data point
 */
export interface HeatmapDataPoint extends ChartDataPoint {
  x: string | number;
  y: string | number;
  value: number;
}
