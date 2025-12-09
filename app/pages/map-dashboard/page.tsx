'use client';

import { useState, useEffect } from 'react';
import { KioskLocationMap } from '@/app/components';
import { DashboardDataService } from '@/app/services/dashboard-data-service';
import { TENANT_CONFIG, DASHBOARD_CONFIG } from '@/app/config/tenant-config';
import { RefreshCw } from 'lucide-react';

export default function MapDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [combinedKioskData, setCombinedKioskData] = useState<unknown[]>([]);

  const fetchData = async () => {
    setRefreshing(true);
    const startTime = new Date();
    console.log(`[Map Dashboard Refresh] Started at ${startTime.toLocaleTimeString()}`);
    
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

      // Fetch kiosk location data for both tenants in parallel
      const [bkKioskData, plkKioskData] = await Promise.all([
        bkService.fetchKioskLocations('BKUS'),
        plkService.fetchKioskLocations('PLKUS'),
      ]);

      console.log('BK-US kiosk locations:', bkKioskData);
      console.log('PLK-US kiosk locations:', plkKioskData);

      // Combine both tenant data arrays
      const combinedData = [
        ...bkKioskData,
        ...plkKioskData
      ];
      
      console.log('Combined kiosk location data for map:', combinedData);
      setCombinedKioskData(combinedData);
      
      const endTime = new Date();
      const duration = ((endTime.getTime() - startTime.getTime()) / 1000).toFixed(2);
      const online = combinedData.filter((item: any) => item.status === 'ONLINE').length;
      const offline = combinedData.filter((item: any) => item.status === 'OFFLINE').length;
      console.log(`[Map Dashboard Refresh] Completed at ${endTime.toLocaleTimeString()} (took ${duration}s)`);
      console.log(`[Map Dashboard Stats] Total kiosks: ${combinedData.length}, Online: ${online}, Offline: ${offline}`);
      
    } catch (error) {
      console.error('[Map Dashboard Refresh] Failed:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up auto-refresh if refresh button is disabled
    if (!DASHBOARD_CONFIG.showRefreshButton) {
      const intervalMs = DASHBOARD_CONFIG.autoRefreshMinutes * 60 * 1000;
      const interval = setInterval(() => {
        fetchData();
      }, intervalMs);

      return () => clearInterval(interval);
    }
  }, []);

  const onlineCount = combinedKioskData.filter((item: any) => item.status === 'ONLINE').length;
  const offlineCount = combinedKioskData.filter((item: any) => item.status === 'OFFLINE').length;
  const totalCount = combinedKioskData.length;

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* Floating Refresh Button */}
      {DASHBOARD_CONFIG.showRefreshButton && (
        <button
          onClick={fetchData}
          disabled={refreshing}
          className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg border border-gray-200"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      )}

      {/* Title at Top */}
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-gray-800 text-center">US Kiosk Status Map</h1>
      </div>

      {/* Full Page Map */}
      <div className="flex-1 px-4 pb-4">
        <div className="h-full w-full bg-white rounded-lg shadow relative">
          <KioskLocationMap data={combinedKioskData} />
          
          {/* Bottom Left Info Cards */}
          <div className="absolute bottom-6 left-6 flex gap-4">
            {/* Kiosk Info Card */}
            <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
              <h2 className="text-base font-bold text-gray-800 mb-3">US Kiosk Status Map</h2>
              <p className="text-sm text-gray-700 mb-2">Combined data for BK-US & PLK-US</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Total Kiosks:</span>
                  <span className="font-semibold text-gray-800">{totalCount}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Online:</span>
                  <span className="font-semibold text-green-600">{onlineCount}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Offline:</span>
                  <span className="font-semibold text-red-600">{offlineCount}</span>
                </div>
              </div>
            </div>
            
            {/* Legends Card */}
            <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
              {/* State Health Section */}
              <h3 className="text-sm font-bold text-gray-700 mb-2">State Health</h3>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: '#dcfce7' }}></div>
                  <span className="text-sm text-gray-700"><strong>Green:</strong> &lt; 5% offline</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: '#fed7aa' }}></div>
                  <span className="text-sm text-gray-700"><strong>Amber:</strong> 5-10% offline</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: '#fecaca' }}></div>
                  <span className="text-sm text-gray-700"><strong>Red:</strong> &gt; 10% offline</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-700 font-semibold">Loading map data...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
