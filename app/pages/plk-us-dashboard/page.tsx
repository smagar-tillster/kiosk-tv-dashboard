'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ConfigurableLineChart, ConfigurableBarChart, AlertHeatmap, KioskLocationMap } from '@/app/components';
import { DashboardDataService } from '@/app/services/dashboard-data-service';
import { TENANT_CONFIG, DASHBOARD_CONFIG } from '@/app/config/tenant-config';
import { RefreshCw } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  loading: boolean;
}

function StatCard({ title, value, subtitle, loading }: StatCardProps) {
  const bgColor = 'bg-gradient-to-br from-orange-50 to-amber-50';
  const textColor = 'text-orange-700';
  const borderColor = 'border-orange-200';
  const isPercentage = value.includes('%');
  const percentValue = isPercentage ? parseFloat(value.replace('%', '')) : null;
  const isHealthy = percentValue !== null && percentValue >= 90;
  return (
    <div className={`${bgColor} rounded-xl p-4 border-2 ${borderColor} shadow-sm hover:shadow-md transition-shadow min-h-[140px] flex flex-col justify-center`}>
      <div className="flex flex-col items-center justify-center h-full py-2">
        <p className={`text-base font-bold ${textColor} mb-2 uppercase tracking-wide text-center`}>{title}</p>
        {loading ? (
          <div className="h-20 w-24 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            {isPercentage ? (
              <>
                <div className={`
                  flex items-center justify-center
                  px-4 py-2 rounded-full
                  ${isHealthy 
                    ? 'bg-green-500' 
                    : 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50'
                  }
                `}>
                  <span className="text-xl font-extrabold text-white whitespace-nowrap">{value}</span>
                </div>
                {subtitle && (
                  <p className={`text-4xl font-extrabold ${textColor}`}>{subtitle.split(' / ')[0]}</p>
                )}
              </>
            ) : (
              <p className={`text-4xl font-extrabold ${textColor} text-center`}>{value}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface DashboardStats {
  totalStores: number;
  totalKiosks: number;
  onlineStores: number;
  offlineStores: number;
  onlineKiosks: number;
  offlineKiosks: number;
}

interface ChartData {
  orderFailureTrend: unknown[];
  typeOfIssues: unknown[];
  orderFailureTypes: unknown[];
  alertHeatmap: unknown[];
  orderFailureByPOS?: unknown[];
  orderFailureTypesToday?: unknown[];
}

export default function PLKUSDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({ totalStores: 0, totalKiosks: 0, onlineStores: 0, offlineStores: 0, onlineKiosks: 0, offlineKiosks: 0 });
  const [chartData, setChartData] = useState<ChartData>({ orderFailureTrend: [], typeOfIssues: [], orderFailureTypes: [], alertHeatmap: [], orderFailureByPOS: [], orderFailureTypesToday: [] });
  const [plkKioskData, setPlkKioskData] = useState<unknown[]>([]);
  const [disconnectedKiosks, setDisconnectedKiosks] = useState<number>(0);
  const [lastFailedTime, setLastFailedTime] = useState<number | null>(null);
  const [lastFailedStore, setLastFailedStore] = useState<string | null>(null);

  const fetchData = async () => {
    setRefreshing(true);
    // const startTime = new Date();
    try {
      const plkService = new DashboardDataService(
        TENANT_CONFIG.PLKUS.accountId,
        TENANT_CONFIG.PLKUS.apiKey,
        'PLKUS'
      );

      const [plkStats, plkCharts, plkLocations, disconnected, lastFailed] = await Promise.all([
        plkService.fetchDashboardData('PLKUS'),
        plkService.fetchChartData('PLKUS'),
        plkService.fetchKioskLocations('PLKUS'),
        plkService.fetchDisconnectedKiosks('PLKUS'),
        plkService.fetchLastFailedOrder('PLKUS'),
      ]);

      console.log('[PLK-US Dashboard] PLK Kiosk Locations:', plkLocations);
      console.log('[PLK-US Dashboard] PLK Kiosk Data Length:', plkLocations?.length);
      console.log('[PLK-US Dashboard] Disconnected Kiosks:', disconnected);
      console.log('[PLK-US Dashboard] Last Failed Order:', lastFailed);
      
      setStats(plkStats);
      setChartData(plkCharts);
      setPlkKioskData(plkLocations || []);
      setDisconnectedKiosks(disconnected);
      setLastFailedTime(lastFailed.timestamp);
      setLastFailedStore(lastFailed.storeName);
    } catch (error) {
      console.error('[PLK-US Dashboard Refresh] Failed:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (!DASHBOARD_CONFIG.showRefreshButton) {
      const intervalMs = DASHBOARD_CONFIG.autoRefreshMinutes * 60 * 1000;
      const interval = setInterval(fetchData, intervalMs);
      return () => clearInterval(interval);
    }
  }, []);

  const calculatePercentage = (online: number, total: number) => {
    if (total === 0) return '0.00';
    return ((online / total) * 100).toFixed(2);
  };

  const formatTimeAgo = (timestamp: number | null): string => {
    if (!timestamp) return 'N/A';
    
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const plkLogo = (
    <div className="w-14 h-14 rounded-lg overflow-hidden shadow-lg bg-white flex items-center justify-center">
      <Image src="/nr-tv-dashboard/plk-us.png" alt="PLK-US" width={56} height={56} className="object-contain" />
    </div>
  );

  return (
    <div className="h-screen bg-gray-900 transition-colors overflow-hidden">
      {DASHBOARD_CONFIG.showRefreshButton && (
        <button
          onClick={fetchData}
          disabled={refreshing}
          className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg border border-gray-700"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      )}

      <div className="h-full p-4">
        <div className="flex flex-col space-y-3 h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-3 shadow-lg">
            <div className="flex items-center justify-center gap-3">
              {plkLogo}
              <div>
                <h2 className="text-2xl font-bold text-white">PLK-US Alerts</h2>
                <p className="text-xs text-orange-50">Popeyes United States</p>
              </div>
            </div>
          </div>

          {/* Row 1: Six Stat Cards */}
          <div className="grid grid-cols-6 gap-3 items-stretch">
            <StatCard title="Total Store (Kiosk)" value={`${stats.totalStores} (${Math.max(0, stats.onlineKiosks + stats.offlineKiosks)})`} loading={loading} />
            <StatCard title="Online Kiosks" value={`${calculatePercentage(stats.onlineKiosks, Math.max(1, stats.onlineKiosks + stats.offlineKiosks))}%`} subtitle={`${stats.onlineKiosks} / ${Math.max(0, stats.onlineKiosks + stats.offlineKiosks)}`} loading={loading} />
            <StatCard title="Offline Kiosks" value={`${stats.offlineKiosks}`} loading={loading} />
            <StatCard title="Disconnected Kiosks" value={`${disconnectedKiosks}`} loading={loading} />
            <StatCard title="Last Failed Order" value={formatTimeAgo(lastFailedTime)} loading={loading} />
            <StatCard title="Failed At" value={lastFailedStore || 'N/A'} loading={loading} />
          </div>

          {/* Row 2: Two Maps Side by Side */}
          <div className="grid grid-cols-2 gap-3 flex-1">
            {/* Map 1: Order Failure Map */}
            <div className="bg-gray-800 rounded-xl border-2 border-orange-600 shadow-lg overflow-hidden">
              <div className="px-3 py-2 border-b border-orange-600">
                <h3 className="text-base font-bold text-orange-400">Order Failure Map (Today)</h3>
              </div>
              <div className="p-3 h-[calc(100%-48px)]">
                <AlertHeatmap data={chartData.alertHeatmap} />
              </div>
            </div>
            {/* Map 2: PLK-US Kiosk Status (Online/Offline) */}
            <div className="bg-gray-800 rounded-xl border-2 border-orange-600 shadow-lg overflow-hidden relative">
              <div className="px-3 py-2 border-b border-orange-600 flex items-center justify-between">
                <h3 className="text-base font-bold text-orange-400">PLK-US Kiosk Status (Online/Offline)</h3>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="text-gray-300">Online</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="text-gray-300">Offline</span>
                  </span>
                </div>
              </div>
              <div className="h-[calc(100%-48px)] relative">
                {loading ? (
                  <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-700 font-semibold">Loading map data...</p>
                    </div>
                  </div>
                ) : plkKioskData.length === 0 ? (
                  <div className="h-full flex items-center justify-center bg-gray-50 rounded">
                    <div className="text-center">
                      <p className="text-gray-600 font-semibold">No kiosk data available</p>
                      <p className="text-gray-500 text-sm">Check console for errors</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <KioskLocationMap data={plkKioskData} />
                    {/* State Health Legend */}
                    <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
                      <h4 className="text-xs font-bold text-gray-700 mb-2">State Health</h4>
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded" style={{backgroundColor: '#dcfce7'}}></div>
                          <span className="text-gray-600">&lt; 5% offline</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded" style={{backgroundColor: '#fed7aa'}}></div>
                          <span className="text-gray-600">5-10% offline</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded" style={{backgroundColor: '#fecaca'}}></div>
                          <span className="text-gray-600">&gt; 10% offline</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Row 3: Four Charts in a single row */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-gray-800 rounded-xl border-2 border-orange-600 shadow-lg p-3">
              <h3 className="text-sm font-bold mb-2 text-orange-400">Order Failure Trend (1 Week)</h3>
              <div className="h-[200px]">
                {chartData.orderFailureTrend.length > 0 ? (
                  <ConfigurableLineChart config={{ title: 'PLK-US Order Failure Trend', colors: { primary: '#f97316' } }} data={chartData.orderFailureTrend} />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-50 rounded">
                    <div className="text-gray-400 text-gray-600">Loading chart...</div>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl border-2 border-orange-600 shadow-lg p-3">
              <h3 className="text-sm font-bold mb-2 text-orange-400">Order Failure Types (1 Week)</h3>
              <div className="h-[200px]">
                {chartData.orderFailureTypes.length > 0 ? (
                  <ConfigurableBarChart config={{ title: 'PLK-US Order Failure Types', colors: { primary: '#f97316' }, orientation: 'horizontal' }} data={chartData.orderFailureTypes} />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-50 rounded">
                    <div className="text-gray-400 text-gray-600">Loading chart...</div>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl border-2 border-orange-600 shadow-lg p-3">
              <h3 className="text-sm font-bold mb-2 text-orange-400">Order Failure by POS (1 Week)</h3>
              <div className="h-[200px]">
                {chartData.orderFailureByPOS && chartData.orderFailureByPOS.length > 0 ? (
                  <ConfigurableBarChart config={{ title: 'PLK-US Order Failure by POS', colors: { primary: '#f97316' }, orientation: 'horizontal' }} data={chartData.orderFailureByPOS} />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-50 rounded">
                    <div className="text-gray-400 text-gray-600">Loading chart...</div>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl border-2 border-orange-600 shadow-lg p-3">
              <h3 className="text-sm font-bold mb-2 text-orange-400">Order Failure Types (Today)</h3>
              <div className="h-[200px]">
                {chartData.orderFailureTypesToday && chartData.orderFailureTypesToday.length > 0 ? (
                  <ConfigurableBarChart config={{ title: 'PLK-US Order Failure Types Today', colors: { primary: '#f97316' }, orientation: 'horizontal' }} data={chartData.orderFailureTypesToday} />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-50 rounded">
                    <div className="text-gray-400 text-gray-600">Loading chart...</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
