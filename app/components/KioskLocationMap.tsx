'use client';

import { useMemo, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { getCityCoordinates, stateAbbrToName } from '@/app/config/city-coordinates';

interface KioskLocationMapProps {
  data: any[];
}

interface KioskData {
  city: string;
  state: string;
  storeName: string;
  kioskName: string;
  status: string;
  lat: number;
  lng: number;
}

export function KioskLocationMap({ data }: KioskLocationMapProps) {
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

  const { stateData, onlineScatterData, offlineScatterData } = useMemo(() => {
    const stateMap = new Map<string, { onlineCount: number; offlineCount: number; lat: number; lng: number }>();
    
    data.forEach((item: any) => {
      const state = item.state;
      const statusText = item.status || 'OFFLINE';
      
      if (state) {
        const stateUpper = state.toUpperCase();
        const stateFull = stateAbbrToName[stateUpper] || state;
        
        // Get state center coordinates
        const coords = getCityCoordinates('', stateFull);
        if (!coords) return;
        
        const existing = stateMap.get(stateFull);
        const isOnline = statusText === 'ONLINE';
        
        if (existing) {
          if (isOnline) {
            existing.onlineCount++;
          } else {
            existing.offlineCount++;
          }
        } else {
          stateMap.set(stateFull, {
            onlineCount: isOnline ? 1 : 0,
            offlineCount: isOnline ? 0 : 1,
            lat: coords.lat,
            lng: coords.lng
          });
        }
      }
    });
    
    // Calculate state colors based on offline percentage
    const stateDataArray = Array.from(stateMap.entries()).map(([state, data]) => {
      const total = data.onlineCount + data.offlineCount;
      const offlinePercent = (data.offlineCount / total) * 100;
      
      let color;
      if (data.offlineCount === 0) {
        color = '#dcfce7'; // Light green - all online
      } else if (offlinePercent > 10) {
        color = '#fecaca'; // Light red - >10% offline
      } else if (offlinePercent > 5) {
        color = '#fed7aa'; // Light amber - >5% offline
      } else {
        color = '#dcfce7'; // Light green - <5% offline
      }
      
      return {
        name: state,
        value: total,
        itemStyle: { areaColor: color }
      };
    });
    
    // Create scatter data for online counts
    const onlineScatter = Array.from(stateMap.entries())
      .filter(([_, data]) => data.onlineCount > 0)
      .map(([state, data]) => ({
        name: state,
        value: [data.lng - 1.5, data.lat, data.onlineCount], // Offset left
        total: data.onlineCount + data.offlineCount
      }));
    
    // Create scatter data for offline counts
    const offlineScatter = Array.from(stateMap.entries())
      .filter(([_, data]) => data.offlineCount > 0)
      .map(([state, data]) => ({
        name: state,
        value: [data.lng + 1.5, data.lat, data.offlineCount], // Offset right
        total: data.onlineCount + data.offlineCount
      }));
    
    console.log('=== State Summary ===');
    console.log('States processed:', stateMap.size);
    console.log('Total online kiosks:', Array.from(stateMap.values()).reduce((sum, s) => sum + s.onlineCount, 0));
    console.log('Total offline kiosks:', Array.from(stateMap.values()).reduce((sum, s) => sum + s.offlineCount, 0));
    
    return { 
      stateData: stateDataArray, 
      onlineScatterData: onlineScatter,
      offlineScatterData: offlineScatter 
    };
  }, [data]);

  const getOption = () => ({
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        if (!params || !params.name) return '';
        if (params.componentSubType === 'effectScatter' && params.value && params.value[2]) {
          const count = params.value[2];
          const status = params.seriesName;
          const color = status === 'Online Kiosks' ? '#22c55e' : '#ef4444';
          return `
            <div style="font-size: 13px;">
              <strong>${params.name}</strong><br/>
              <span style="color: ${color};">● ${status}:</span> ${count}
            </div>
          `;
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
    legend: {
      orient: 'vertical',
      right: 20,
      top: 20,
      data: ['Online Kiosks', 'Offline Kiosks'],
      textStyle: {
        fontSize: 12,
        color: '#333'
      }
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
        show: true,
        fontSize: 11,
        color: '#000',
        fontWeight: 'bold'
      },
      itemStyle: {
        areaColor: '#f3f4f6',
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
          areaColor: '#e5e7eb'
        }
      },
      regions: stateData.map(state => ({
        name: state.name,
        itemStyle: {
          areaColor: state.itemStyle.areaColor
        }
      }))
    },
    series: [
      {
        name: 'Online Kiosks',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: onlineScatterData,
        symbolSize: (val: any) => {
          const count = val[2];
          // Size based on count
          return Math.min(15 + Math.sqrt(count) * 2, 45);
        },
        showEffectOn: 'render',
        rippleEffect: {
          period: 5,
          scale: 3,
          brushType: 'stroke',
          color: 'rgba(34, 197, 94, 0.4)'
        },
        itemStyle: {
          color: '#22c55e',
          borderColor: '#fff',
          borderWidth: 2,
          shadowBlur: 12,
          shadowColor: 'rgba(34, 197, 94, 0.6)'
        },
        label: {
          show: true,
          position: 'inside',
          formatter: (params: any) => `${params.value[2]}`,
          fontSize: 12,
          fontWeight: 'bold',
          color: '#fff'
        },
        emphasis: {
          symbolSize: (val: any) => {
            const count = val[2];
            return Math.min(20 + Math.sqrt(count) * 2, 50);
          },
          itemStyle: {
            color: '#16a34a',
            borderWidth: 2,
            shadowBlur: 18
          }
        },
        z: 10
      },
      {
        name: 'Offline Kiosks',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: offlineScatterData,
        symbolSize: (val: any) => {
          const count = val[2];
          return Math.min(15 + Math.sqrt(count) * 2, 45);
        },
        showEffectOn: 'render',
        rippleEffect: {
          period: 4,
          scale: 4,
          brushType: 'stroke',
          color: 'rgba(239, 68, 68, 0.5)'
        },
        itemStyle: {
          color: '#ef4444',
          borderColor: '#fff',
          borderWidth: 2,
          shadowBlur: 18,
          shadowColor: 'rgba(239, 68, 68, 0.9)'
        },
        label: {
          show: true,
          position: 'inside',
          formatter: (params: any) => `${params.value[2]}`,
          fontSize: 12,
          fontWeight: 'bold',
          color: '#fff'
        },
        emphasis: {
          symbolSize: (val: any) => {
            const count = val[2];
            return Math.min(20 + Math.sqrt(count) * 2, 50);
          },
          itemStyle: {
            color: '#dc2626',
            borderWidth: 2,
            shadowBlur: 25
          }
        },
        z: 11
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
