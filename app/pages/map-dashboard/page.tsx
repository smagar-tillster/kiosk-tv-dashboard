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
    <div className="h-screen w-screen flex flex-col bg-gray-900">
      {/* Floating Refresh Button */}
      {DASHBOARD_CONFIG.showRefreshButton && (
        <button
          onClick={fetchData}
          disabled={refreshing}
          className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg border border-gray-700"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      )}

      {/* Title at Top */}
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-white text-center">US Kiosk Status Map</h1>
      </div>

      {/* Full Page Map */}
      <div className="flex-1 px-4 pb-4">
        <div className="h-full w-full bg-gray-800 rounded-lg shadow relative">
          <KioskLocationMap data={combinedKioskData} />
          
          {/* Bottom Left Info Card - US Kiosk Status Map */}
          <div className="absolute bottom-6 left-6 max-w-xs">
            <div className="bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-700">
              <h2 className="text-sm font-bold text-white mb-2">US Kiosk Status Map</h2>
              <p className="text-xs text-gray-300 mb-2">Combined data for BK-US & PLK-US</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-300">Total Kiosks:</span>
                  <span className="font-semibold text-white">{totalCount}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-300">Online:</span>
                  <span className="font-semibold text-green-400">{onlineCount}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-300">Offline:</span>
                  <span className="font-semibold text-red-400">{offlineCount}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Right Legends Card */}
          <div className="absolute bottom-6 right-6 max-w-xs">
            <div className="bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-700">
              {/* Kiosk Status Section */}
              <h3 className="text-xs font-bold text-white mb-2">Kiosk Status</h3>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-gray-800"></div>
                    <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-gray-800"></div>
                  </div>
                  <span className="text-xs text-gray-300"><strong className="text-white">Mixed:</strong> Online & Offline</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-300"><strong className="text-white">Green:</strong> All Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs text-gray-300"><strong className="text-white">Red:</strong> All Offline</span>
                </div>
              </div>
              
              {/* State Health Section */}
              <h3 className="text-xs font-bold text-white mb-1.5 mt-3">State Health</h3>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#dcfce7' }}></div>
                  <span className="text-xs text-gray-300"><strong className="text-white">Green:</strong> &lt; 5% offline</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fed7aa' }}></div>
                  <span className="text-xs text-gray-300"><strong className="text-white">Amber:</strong> 5-10% offline</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fecaca' }}></div>
                  <span className="text-xs text-gray-300"><strong className="text-white">Red:</strong> &gt; 10% offline</span>
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
