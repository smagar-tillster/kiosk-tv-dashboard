/**
 * Line Chart DTO
 */

import { TimeSeriesDataPoint } from './base';

export interface LineChartDataPoint extends TimeSeriesDataPoint {
  count: number;
}

export interface LineChartData {
  data: LineChartDataPoint[];
  metadata?: {
    total?: number;
    average?: number;
    min?: number;
    max?: number;
  };
}
