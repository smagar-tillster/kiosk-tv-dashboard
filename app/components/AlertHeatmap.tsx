'use client';

import { useMemo, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { getCityCoordinates, stateAbbrToName } from '@/app/config/city-coordinates';
import { getGuatemalaCoordinates, guatemalaDepartmentAbbr } from '@/app/config/guatemala-coordinates';
import { getMexicoCoordinates, mexicoStateAbbr } from '@/app/config/mexico-coordinates';

interface AlertHeatmapProps {
  data: any[];
  mapType?: 'USA' | 'GUATEMALA' | 'MEXICO';
}

export function AlertHeatmap({ data, mapType = 'USA' }: AlertHeatmapProps) {
  const [mapReady, setMapReady] = useState(false);

  // Load map GeoJSON based on mapType
  useEffect(() => {
    const loadMap = async () => {
      try {
        let response, geoJson, mapName;
        
        if (mapType === 'GUATEMALA') {
          // Guatemala departments GeoJSON (local file to avoid CORS issues)
          response = await fetch('/nr-tv-dashboard/guatemala-departments.geojson');
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Guatemala GeoJSON fetch failed:', response.status, errorText);
            throw new Error(`Failed to fetch Guatemala map: ${response.status}`);
          }
          const responseText = await response.text();
          console.log('Guatemala GeoJSON loaded successfully (first 200 chars):', responseText.substring(0, 200));
          geoJson = JSON.parse(responseText);
          mapName = 'GUATEMALA';
        } else if (mapType === 'MEXICO') {
          // Mexico states GeoJSON
          response = await fetch('https://raw.githubusercontent.com/angelnmara/geojson/master/mexicoHigh.json');
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Mexico GeoJSON fetch failed:', response.status, errorText);
            throw new Error(`Failed to fetch Mexico map: ${response.status}`);
          }
          const responseText = await response.text();
          console.log('Mexico GeoJSON response (first 200 chars):', responseText.substring(0, 200));
          geoJson = JSON.parse(responseText);
          mapName = 'MEXICO';
        } else {
          // USA map
          response = await fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json');
          if (!response.ok) {
            const errorText = await response.text();
            console.error('USA GeoJSON fetch failed:', response.status, errorText);
            throw new Error(`Failed to fetch USA map: ${response.status}`);
          }
          geoJson = await response.json();
          
          // Filter out Alaska, Hawaii, and territories to show only contiguous USA
          const filteredFeatures = geoJson.features.filter((feature: any) => {
            const stateName = feature.properties.name;
            return stateName !== 'Alaska' && 
                   stateName !== 'Hawaii' && 
                   stateName !== 'Puerto Rico';
          });
          
          geoJson = {
            ...geoJson,
            features: filteredFeatures
          };
          mapName = 'USA';
        }
        
        echarts.registerMap(mapName, geoJson);
        setMapReady(true);
      } catch (error) {
        console.error('Error loading map:', error);
        setMapReady(true); // Show component anyway
      }
    };
    
    loadMap();
  }, [mapType]);

  const { stateData, scatterData } = useMemo(() => {
    const stateMap = new Map<string, { count: number; lat: number; lng: number }>();
    
    console.log(`[AlertHeatmap ${mapType}] Processing data:`, data);
    console.log(`[AlertHeatmap ${mapType}] Data length:`, data.length);
    
    data.forEach((item: any) => {
      const cityName = item.facet?.[0] || item.city;
      const stateInput = item.facet?.[1] || item.state;
      const alerts = item.Alerts || item['count(*)'] || 0;
      
      console.log(`[AlertHeatmap ${mapType}] Processing item:`, { cityName, stateInput, alerts, fullItem: item });
      
      if (stateInput && alerts > 0) {
        let stateName = stateInput;
        let coords: { lat: number; lng: number } | null = null;
        
        if (mapType === 'GUATEMALA') {
          // Handle Guatemala departments
          const deptName = guatemalaDepartmentAbbr[stateInput.toUpperCase()] || stateInput;
          stateName = deptName.charAt(0).toUpperCase() + deptName.slice(1).toLowerCase();
          coords = getGuatemalaCoordinates(cityName, stateName);
        } else if (mapType === 'MEXICO') {
          // Handle Mexico states
          const stateFull = mexicoStateAbbr[stateInput.toUpperCase()] || stateInput;
          stateName = stateFull.charAt(0).toUpperCase() + stateFull.slice(1).toLowerCase();
          coords = getMexicoCoordinates(cityName, stateName);
        } else {
          // Handle USA states
          const stateFull = stateAbbrToName[stateInput.toUpperCase()] || stateInput;
          stateName = stateFull.charAt(0).toUpperCase() + stateFull.slice(1).toLowerCase();
          coords = getCityCoordinates(cityName, stateName);
        }
        
        if (!coords) return;
        
        const { lat, lng } = coords;
        const existing = stateMap.get(stateName);
        
        if (existing) {
          stateMap.set(stateName, {
            count: existing.count + alerts,
            lat: existing.lat,
            lng: existing.lng
          });
        } else {
          stateMap.set(stateName, { count: alerts, lat, lng });
        }
      }
    });
    
    const stateDataArray = Array.from(stateMap.entries()).map(([state, data]) => ({
      name: state,
      value: data.count
    }));
    
    const stateScatterData = Array.from(stateMap.entries()).map(([state, data]) => ({
      name: state,
      value: [data.lng, data.lat, data.count]
    }));
    
    return { stateData: stateDataArray, scatterData: stateScatterData };
  }, [data, mapType]);

  const maxAlerts = Math.max(...stateData.map(d => d.value), 100);

  // Get map configuration based on type
  const getMapConfig = () => {
    if (mapType === 'GUATEMALA') {
      return {
        mapName: 'GUATEMALA',
        zoom: 3.5,
        center: [-90.5, 15.5]
      };
    } else if (mapType === 'MEXICO') {
      return {
        mapName: 'MEXICO',
        zoom: 2.3,
        center: [-102, 23.5]
      };
    } else {
      return {
        mapName: 'USA',
        zoom: 1.2,
        center: [-96, 37.5]
      };
    }
  };

  const mapConfig = getMapConfig();

  const getOption = () => ({
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        if (!params || !params.name) return '';
        if (params.componentSubType === 'effectScatter' && params.value && params.value[2]) {
          return `<strong>${params.name}</strong><br/>Alerts: ${params.value[2]}`;
        }
        if (params.seriesType === 'geo') {
          return `<strong>${params.name}</strong>`;
        }
        return params.name || '';
      },
      textStyle: {
        fontSize: 13
      }
    },
    visualMap: {
      min: 0,
      max: maxAlerts,
      text: ['High', 'Low'],
      realtime: false,
      calculable: false,
      orient: 'vertical',
      inRange: {
        color: ['#e0f3e0', '#FFE5E5', '#FFB3B3', '#FF6666', '#FF0000']
      },
      textStyle: {
        fontSize: 11,
        color: '#d1d5db'
      },
      right: 10,
      top: 'center',
      itemWidth: 20,
      itemHeight: 120
    },
    geo: {
      map: mapConfig.mapName,
      roam: true,
      scaleLimit: {
        min: 0.8,
        max: 5
      },
      aspectScale: 0.75,
      zoom: mapConfig.zoom,
      center: mapConfig.center,
      label: {
        show: false
      },
      itemStyle: {
        areaColor: '#e0f3e0',
        borderColor: '#fff',
        borderWidth: 1.5
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 12,
          color: '#000',
          fontWeight: 'bold'
        },
        itemStyle: {
          areaColor: '#ffd700'
        }
      },
      regions: stateData.map(state => ({
        name: state.name,
        label: {
          show: true,
          fontSize: 11,
          color: '#000',
          fontWeight: 'bold',
          formatter: `${state.name}`
        }
      }))
    },
    series: [
      {
        name: 'State Alerts Display',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: scatterData,
        symbolSize: 35,
        z: 10,
        rippleEffect: {
          brushType: 'fill'
        },
        itemStyle: {
          color: '#FFA500',
          borderColor: '#fff',
          borderWidth: 3,
          shadowBlur: 10,
          shadowColor: 'rgba(255, 165, 0, 0.5)'
        },
        label: {
          show: true,
          position: 'inside',
          formatter: (params: any) => `${params.value[2]}`,
          fontSize: 13,
          fontWeight: 'bold',
          color: '#000'
        }
      }
    ]
  });

  if (!mapReady) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        Loading map...
      </div>
    );
  }

  return (
    <ReactECharts
      option={getOption()}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'canvas' }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
}
