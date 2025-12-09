/**
 * Heatmap Chart Configuration
 */

import { BaseChartConfig } from './base.config';

export interface HeatmapChartConfig extends BaseChartConfig {
  chartType: 'heatmap';
  
  // Heatmap specific
  colorScale?: string[];
  minColor?: string;
  maxColor?: string;
  emptyColor?: string;
  
  // Cell styling
  cellSize?: number;
  cellBorderRadius?: number;
  cellBorderWidth?: number;
  cellBorderColor?: string;
  
  // Labels
  showCellLabels?: boolean;
  cellLabelFontSize?: number;
  showXAxisLabels?: boolean;
  showYAxisLabels?: boolean;
  xAxisLabelFontSize?: number;
  yAxisLabelFontSize?: number;
  
  // Layout
  xAxisHeight?: number;
  yAxisWidth?: number;
}

export const DEFAULT_HEATMAP_CHART_CONFIG: Partial<HeatmapChartConfig> = {
  chartType: 'heatmap',
  responsive: true,
  showTooltip: true,
  colorScale: ['#eef2ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1'],
  emptyColor: '#f3f4f6',
  cellBorderRadius: 2,
  cellBorderWidth: 1,
  cellBorderColor: '#ffffff',
  showCellLabels: true,
  cellLabelFontSize: 11,
  showXAxisLabels: true,
  showYAxisLabels: true,
  xAxisLabelFontSize: 11,
  yAxisLabelFontSize: 13,
};
