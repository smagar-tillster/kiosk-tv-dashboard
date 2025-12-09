/**
 * Map Chart DTO
 */

import { GeoDataPoint } from './base';

export interface MapDataPoint extends GeoDataPoint {
  state: string;
  alerts: number;
}

export interface MapChartData {
  data: MapDataPoint[];
  centerCoordinates?: [number, number];
  zoom?: number;
  metadata?: {
    totalAlerts?: number;
    affectedStates?: number;
  };
}
