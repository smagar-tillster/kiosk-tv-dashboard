'use client';

import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import { MapChartConfig, DEFAULT_MAP_CHART_CONFIG } from '@/app/config';
import { MapChartData, MapDataPoint } from '@/app/dtos';

interface ConfigurableMapChartProps {
  data: MapChartData | unknown[];
  config: Partial<MapChartConfig>;
}

const US_GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

export function ConfigurableMapChart({ data, config }: ConfigurableMapChartProps) {
  const [tooltipContent, setTooltipContent] = useState('');
  
  // Merge with default config
  const chartConfig = { ...DEFAULT_MAP_CHART_CONFIG, ...config };
  
  // Transform data to DTO format
  let chartData: MapDataPoint[] = [];
  
  if (Array.isArray(data)) {
    // Check if data has 'state' and 'alerts' properties (CombinedMapData DTO)
    const firstItem = data[0] as any;
    if (data.length > 0 && firstItem && 'state' in firstItem && 'alerts' in firstItem) {
      console.log('ConfigurableMapChart - Processing CombinedMapData DTO:', data);
      chartData = data.map((item: any) => ({
        state: String(item.state || ''),
        alerts: Number(item.alerts || 0),
        value: Number(item.alerts || 0),
        city: '',
      }));
    } else {
      // Original format - transform from raw NewRelic data
      console.log('ConfigurableMapChart - Processing raw NewRelic data:', data);
      chartData = transformNewRelicData(data);
    }
  } else if ((data as any).data) {
    chartData = (data as any).data;
  }

  console.log('ConfigurableMapChart - Final chart data:', chartData);

  // Create a map of state names to data
  const stateDataMap = new Map(
    chartData.map(d => {
      const stateName = typeof d.state === 'string' ? d.state : String(d.state || '');
      return [stateName.toLowerCase(), d];
    })
  );

  // Find max count for color scaling
  const maxAlerts = Math.max(...chartData.map(d => d.alerts || d.value), 1);

  // Get fill color based on count
  const getFillColor = (count: number) => {
    if (count === 0) return chartConfig.fillColor || '#e5e7eb';
    
    if (chartConfig.colorScale && chartConfig.colorScale.length > 0) {
      const intensity = count / maxAlerts;
      const index = Math.min(
        Math.floor(intensity * chartConfig.colorScale.length),
        chartConfig.colorScale.length - 1
      );
      return chartConfig.colorScale[index];
    }
    
    // Default color gradient
    const intensity = count / maxAlerts;
    if (intensity < 0.25) return '#86efac';
    if (intensity < 0.5) return '#fde047';
    if (intensity < 0.75) return '#fb923c';
    return '#ef4444';
  };

  const getStateData = (geoName: string) => {
    const normalized = geoName.toLowerCase();
    return stateDataMap.get(normalized);
  };

  const height = typeof chartConfig.height === 'number' 
    ? chartConfig.height
    : 500;  return (
    <div 
      style={{ 
        height: `${height}px`,
        width: chartConfig.width || '100%',
      }} 
      className="relative bg-white rounded-lg shadow"
    >
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{
          scale: (chartConfig.zoom || 1) * 1000,
        }}
        className="w-full h-full"
      >
        <ZoomableGroup 
          center={chartConfig.centerCoordinates || [-98.5795, 39.8283]} 
          zoom={chartConfig.zoom || 1}
        >
          <Geographies geography={US_GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateData = getStateData(geo.properties.name);
                const count = stateData?.alerts || stateData?.value || 0;
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getFillColor(count)}
                    stroke={chartConfig.strokeColor || '#ffffff'}
                    strokeWidth={chartConfig.strokeWidth || 1}
                    onMouseEnter={() => {
                      if (chartConfig.showTooltip !== false) {
                        setTooltipContent(`${geo.properties.name}: ${count} alerts`);
                      }
                    }}
                    onMouseLeave={() => {
                      setTooltipContent('');
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      
      {tooltipContent && chartConfig.showTooltip !== false && (
        <div 
          className="absolute top-4 left-4 bg-white px-3 py-2 rounded shadow-lg border text-sm font-semibold"
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
}

// Helper function to transform NewRelic data to DTO format
function transformNewRelicData(rawData: unknown[]): MapDataPoint[] {
  return (rawData as Array<Record<string, unknown>>).map((item) => {
    // Handle state from various formats
    let stateName = '';
    let cityName = '';
    
    // NewRelic FACET returns array: [city, state] when using "FACET city, state"
    if (Array.isArray(item.facet)) {
      if (item.facet.length >= 2) {
        cityName = String(item.facet[0] || '');
        stateName = String(item.facet[1] || '');
      } else if (item.facet.length === 1) {
        stateName = String(item.facet[0] || '');
      }
    } else if (typeof item.state === 'string') {
      stateName = item.state;
      cityName = String(item.city || '');
    } else if (typeof item.facet === 'string') {
      stateName = item.facet;
    }
    
    const alertCount = (item['Alerts'] || item.count || 0) as number;
    
    return {
      state: stateName,
      alerts: alertCount,
      value: alertCount,
      city: cityName || undefined,
    };
  });
}
