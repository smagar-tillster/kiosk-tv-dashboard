'use client';

import { useMemo, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { getCityCoordinates, stateAbbrToName } from '@/lib/config/city-coordinates';

interface AlertHeatmapProps {
  data: any[];
}

export function AlertHeatmap({ data }: AlertHeatmapProps) {
  const [mapReady, setMapReady] = useState(false);

  // Load US map GeoJSON
  useEffect(() => {
    const loadMap = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json');
        const geoJson = await response.json();
        
        // Filter out Alaska, Hawaii, and territories to show only contiguous USA
        const filteredFeatures = geoJson.features.filter((feature: any) => {
          const stateName = feature.properties.name;
          return stateName !== 'Alaska' && 
                 stateName !== 'Hawaii' && 
                 stateName !== 'Puerto Rico';
        });
        
        const continentalUSA = {
          ...geoJson,
          features: filteredFeatures
        };
        
        echarts.registerMap('USA', continentalUSA);
        setMapReady(true);
      } catch (error) {
        console.error('Error loading US map:', error);
        setMapReady(true); // Show component anyway
      }
    };
    
    loadMap();
  }, []);

  const { stateData, scatterData } = useMemo(() => {
    const stateMap = new Map<string, { count: number; lat: number; lng: number }>();
    
    data.forEach((item: any) => {
      const cityName = item.facet?.[0] || item.city;
      const stateInput = item.facet?.[1] || item.state;
      const alerts = item.Alerts || item['count(*)'] || 0;
      
      if (cityName && stateInput && alerts > 0) {
        let stateName = stateAbbrToName[stateInput.toUpperCase()] || stateInput;
        stateName = stateName.charAt(0).toUpperCase() + stateName.slice(1).toLowerCase();
        
        const coords = getCityCoordinates(cityName, stateName);
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
  }, [data]);

  const maxAlerts = Math.max(...stateData.map(d => d.value), 100);

  const getOption = () => ({
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        if (params.seriesType === 'scatter' && params.value && params.value[2]) {
          return `<strong>${params.name}</strong><br/>Alerts: ${params.value[2]}`;
        }
        if (params.seriesType === 'map') {
          return `<strong>${params.name}</strong><br/>Alerts: ${params.value || 0}`;
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
      orient: 'horizontal',
      inRange: {
        color: ['#e0f3e0', '#FFE5E5', '#FFB3B3', '#FF6666', '#FF0000']
      },
      textStyle: {
        fontSize: 11,
        color: '#333'
      },
      left: 'center',
      bottom: 10,
      itemWidth: 15,
      itemHeight: 120
    },
    geo: {
      map: 'USA',
      roam: true,
      scaleLimit: {
        min: 0.8,
        max: 3
      },
      aspectScale: 0.75,
      zoom: 1.2,
      center: [-96, 37.5],
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
        name: 'State Alerts',
        type: 'map',
        geoIndex: 0,
        data: stateData,
        emphasis: {
          label: {
            show: true
          }
        },
        z: 1
      },
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
