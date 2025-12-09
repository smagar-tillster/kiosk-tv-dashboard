/**
 * Bar Chart DTO
 */

import { CategoricalDataPoint } from './base';

export interface BarChartDataPoint extends CategoricalDataPoint {
  type: string;
  count: number;
}

export interface BarChartData {
  data: BarChartDataPoint[];
  orientation?: 'horizontal' | 'vertical';
  metadata?: {
    total?: number;
  };
}
