'use client';

import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface StateMapData {
  state: string;
  stateCode: string;
  count: number;
}

export interface USStateMapProps {
  title?: string;
  description?: string;
  data: StateMapData[];
  height?: number;
}

// US states GeoJSON URL
const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

/**
 * US State Map visualization showing alert counts by state
 * Proper choropleth map with actual state boundaries
 */
export function USStateMap({
  title,
  description,
  data,
  height = 500,
}: USStateMapProps) {
  const [tooltipContent, setTooltipContent] = useState('');

  // Create a map of state names to data
  const stateDataMap = new Map(
    data.map(d => [d.state.toLowerCase(), d])
  );

  // Find max count for color scaling
  const maxCount = Math.max(...data.map(d => d.count), 1);

  // Get fill color based on count
  const getFillColor = (count: number) => {
    if (count === 0) return '#e5e7eb'; // gray-200
    const intensity = count / maxCount;
    if (intensity < 0.25) return '#86efac'; // green-300
    if (intensity < 0.5) return '#fde047'; // yellow-300
    if (intensity < 0.75) return '#fb923c'; // orange-400
    return '#ef4444'; // red-500
  };

  // State name mapping (Geography name to our data)
  const getStateData = (geoName: string) => {
    const normalized = geoName.toLowerCase();
    return stateDataMap.get(normalized);
  };

  return (
    <Card>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <div style={{ height: `${height}px` }} className="relative">
          <ComposableMap
            projection="geoAlbersUsa"
            projectionConfig={{
              scale: 1000,
            }}
            className="w-full h-full"
          >
            <ZoomableGroup>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const stateName = geo.properties.name;
                    const stateData = getStateData(stateName);
                    const count = stateData?.count || 0;
                    const fillColor = getFillColor(count);

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fillColor}
                        stroke="#ffffff"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: 'none' },
                          hover: {
                            fill: '#3b82f6',
                            outline: 'none',
                            cursor: 'pointer',
                          },
                          pressed: { outline: 'none' },
                        }}
                        onMouseEnter={() => {
                          setTooltipContent(
                            `${stateName}: ${count} alerts`
                          );
                        }}
                        onMouseLeave={() => {
                          setTooltipContent('');
                        }}
                      />
                    );
                  })
                }
              </Geographies>
              
              {/* Add markers for state labels with counts */}
              {data.filter(d => d.count > 0).map((state) => {
                // Approximate state center coordinates (you can adjust these)
                const coordinates = getStateCoordinates(state.stateCode);
                if (!coordinates) return null;
                
                return (
                  <Marker key={state.stateCode} coordinates={coordinates}>
                    <text
                      textAnchor="middle"
                      className="text-xs font-bold pointer-events-none"
                      style={{ fill: '#1f2937', fontSize: '8px' }}
                    >
                      {state.count}
                    </text>
                  </Marker>
                );
              })}
            </ZoomableGroup>
          </ComposableMap>
          
          {/* Tooltip */}
          {tooltipContent && (
            <div className="absolute top-4 left-4 bg-card border border-border rounded px-3 py-2 text-sm shadow-lg">
              {tooltipContent}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ background: '#86efac' }}></div>
            <span className="text-muted-foreground">Low (0-25%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ background: '#fde047' }}></div>
            <span className="text-muted-foreground">Medium (25-50%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ background: '#fb923c' }}></div>
            <span className="text-muted-foreground">High (50-75%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ background: '#ef4444' }}></div>
            <span className="text-muted-foreground">Critical (75-100%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to get approximate state center coordinates
function getStateCoordinates(stateCode: string): [number, number] | null {
  const coords: Record<string, [number, number]> = {
    CA: [-119.4, 36.7],
    TX: [-99.9, 31.9],
    FL: [-81.5, 27.8],
    NY: [-74.2, 43.0],
    PA: [-77.2, 40.9],
    IL: [-89.4, 40.4],
    OH: [-82.9, 40.4],
    GA: [-83.5, 32.9],
    NC: [-79.8, 35.8],
    MI: [-85.6, 44.3],
    NJ: [-74.5, 40.3],
    VA: [-78.2, 37.8],
    WA: [-121.5, 47.4],
    AZ: [-111.7, 34.0],
    MA: [-71.5, 42.2],
    TN: [-86.7, 35.7],
    IN: [-86.3, 40.0],
    MO: [-92.6, 38.4],
    MD: [-76.6, 39.0],
    WI: [-89.6, 44.3],
    CO: [-105.8, 39.0],
    MN: [-94.6, 46.4],
    SC: [-80.9, 34.0],
    AL: [-86.9, 32.8],
    LA: [-92.0, 31.2],
    KY: [-84.9, 37.8],
    OR: [-120.5, 43.8],
    OK: [-97.1, 35.5],
    CT: [-72.7, 41.6],
    IA: [-93.1, 42.0],
    MS: [-89.7, 32.7],
    AR: [-92.4, 34.9],
    KS: [-98.4, 38.5],
    UT: [-111.9, 39.3],
    NV: [-117.0, 38.3],
    NM: [-106.2, 34.8],
    WV: [-80.5, 38.5],
    NE: [-99.9, 41.5],
    ID: [-114.7, 44.0],
    HI: [-157.5, 21.1],
    NH: [-71.5, 43.4],
    ME: [-69.4, 45.4],
    RI: [-71.5, 41.7],
    MT: [-110.0, 47.0],
    DE: [-75.5, 39.0],
    SD: [-100.3, 44.3],
    ND: [-100.5, 47.5],
    AK: [-152.0, 64.0],
    VT: [-72.7, 44.0],
    WY: [-107.3, 43.0],
  };
  
  return coords[stateCode] || null;
}
