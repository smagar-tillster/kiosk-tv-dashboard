/**
 * Heatmap Chart DTO
 */

import { HeatmapDataPoint } from './base';

export interface HeatmapChartDataPoint extends HeatmapDataPoint {
  date: string;
  hour: number;
  alerts: number;
}

export interface HeatmapChartData {
  data: HeatmapChartDataPoint[];
  xAxisLabels?: string[];
  yAxisLabels?: string[];
  metadata?: {
    maxValue?: number;
    minValue?: number;
  };
}
