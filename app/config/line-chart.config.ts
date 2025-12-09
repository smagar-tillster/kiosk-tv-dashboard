/**
 * Line Chart Configuration
 */

import { BaseChartConfig, ChartAxisConfig } from './base.config';

export interface LineChartConfig extends BaseChartConfig {
  chartType: 'line';
  
  // Line specific
  lineWidth?: number;
  showDots?: boolean;
  dotRadius?: number;
  smooth?: boolean;
  showLabels?: boolean;
  
  // Axes
  xAxis?: ChartAxisConfig & {
    dataKey: string;
    label?: string;
  };
  yAxis?: ChartAxisConfig & {
    dataKey: string;
    label?: string;
    width?: number;
  };
  
  // Animation
  animationDuration?: number;
}

export const DEFAULT_LINE_CHART_CONFIG: Partial<LineChartConfig> = {
  chartType: 'line',
  responsive: true,
  showTooltip: true,
  showLegend: false,
  lineWidth: 2,
  showDots: true,
  dotRadius: 3,
  smooth: false,
  showLabels: true,
  xAxis: {
    fontSize: 11,
    fontWeight: 'bold',
    angle: -45,
  },
  yAxis: {
    fontSize: 12,
    fontWeight: 'bold',
    width: 50,
  },
};
