/**
 * Map Chart Configuration
 */

import { BaseChartConfig } from './base.config';

export interface MapChartConfig extends BaseChartConfig {
  chartType: 'map';
  
  // Map specific
  mapType?: 'us-states' | 'world' | 'custom';
  projection?: string;
  centerCoordinates?: [number, number];
  zoom?: number;
  
  // Styling
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  hoverColor?: string;
  
  // Data visualization
  colorScale?: string[];
  showLabels?: boolean;
  labelFontSize?: number;
  
  // Interaction
  enableZoom?: boolean;
  enablePan?: boolean;
  clickable?: boolean;
}

export const DEFAULT_MAP_CHART_CONFIG: Partial<MapChartConfig> = {
  chartType: 'map',
  responsive: true,
  showTooltip: true,
  mapType: 'us-states',
  centerCoordinates: [-98.5795, 39.8283],
  zoom: 1,
  fillColor: '#d1d5db',
  strokeColor: '#ffffff',
  strokeWidth: 1,
  hoverColor: '#9ca3af',
  showLabels: true,
  labelFontSize: 8,
  enableZoom: false,
  enablePan: false,
  clickable: false,
};
