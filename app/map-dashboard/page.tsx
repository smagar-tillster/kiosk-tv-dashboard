'use client';

import { useState, useEffect } from 'react';
import { AlertHeatmap } from '@/app/components';
import { DashboardDataService } from '@/app/services/dashboard-data-service';
import { TENANT_CONFIG } from '@/app/config/tenant-config';
import { RefreshCw } from 'lucide-react';

export default function MapDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [combinedMapData, setCombinedMapData] = useState<unknown[]>([]);

  const fetchData = async () => {
    setRefreshing(true);
    
    try {
      // Create services for both tenants
      const bkService = new DashboardDataService(
        TENANT_CONFIG.BKUS.accountId,
        TENANT_CONFIG.BKUS.apiKey,
        'BKUS'
      );
      
      const plkService = new DashboardDataService(
        TENANT_CONFIG.PLKUS.accountId,
        TENANT_CONFIG.PLKUS.apiKey,
        'PLKUS'
      );

      // Fetch chart data for both tenants in parallel
      const [bkChartData, plkChartData] = await Promise.all([
        bkService.fetchChartData('BKUS'),
        plkService.fetchChartData('PLKUS'),
      ]);

      console.log('BK-US alertHeatmap data:', bkChartData.alertHeatmap);
      console.log('PLK-US alertHeatmap data:', plkChartData.alertHeatmap);

      // Combine both tenant data arrays directly for AlertHeatmap
      const combinedData = [
        ...bkChartData.alertHeatmap,
        ...plkChartData.alertHeatmap
      ];
      
      console.log('Combined alert data for map:', combinedData);
      setCombinedMapData(combinedData);
      
    } catch (error) {
      console.error('Error fetching map data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalAlerts = combinedMapData.reduce((sum: number, item: unknown) => {
    const alertItem = item as { Alerts?: number; count?: number };
    return sum + (alertItem.Alerts || alertItem.count || 0);
  }, 0);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* Single Line Header */}
      <div className="flex justify-between items-center px-6 py-3 bg-white border-b">
        <h1 className="text-lg font-bold" style={{ color: '#f97316' }}>
          US Alert Distribution - Combined BK-US & PLK-US ({combinedMapData.length} locations, {totalAlerts} total alerts)
        </h1>
        
        <button
          onClick={fetchData}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Full Page Map */}
      <div className="flex-1 p-4">
        <div className="h-full w-full bg-white rounded-lg shadow">
          <AlertHeatmap data={combinedMapData} />
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-700 font-semibold">Loading map data...</p>
          </div>
        </div>
      )}
    </div>
  );
}
