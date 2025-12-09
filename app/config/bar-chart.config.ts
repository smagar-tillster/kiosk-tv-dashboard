/**
 * Bar Chart Configuration
 */

import { BaseChartConfig, ChartAxisConfig } from './base.config';

export interface BarChartConfig extends BaseChartConfig {
  chartType: 'bar';
  
  // Bar specific
  orientation?: 'horizontal' | 'vertical';
  barSize?: number;
  showLabels?: boolean;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right' | 'inside';
  
  // Axes
  xAxis?: ChartAxisConfig & {
    dataKey?: string;
    label?: string;
  };
  yAxis?: ChartAxisConfig & {
    dataKey?: string;
    label?: string;
    width?: number;
  };
  
  // Spacing
  barGap?: number;
  barCategoryGap?: string | number;
}

export const DEFAULT_BAR_CHART_CONFIG: Partial<BarChartConfig> = {
  chartType: 'bar',
  responsive: true,
  showTooltip: true,
  showLegend: false,
  orientation: 'horizontal',
  showLabels: true,
  labelPosition: 'right',
  xAxis: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  yAxis: {
    fontSize: 10,
    fontWeight: 'bold',
    width: 180,
  },
};
