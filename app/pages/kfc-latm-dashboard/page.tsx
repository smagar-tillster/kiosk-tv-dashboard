'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ConfigurableLineChart, ConfigurableBarChart, AlertHeatmap } from '@/app/components';
import { DashboardDataService } from '@/app/services/dashboard-data-service';
import { TENANT_CONFIG, DASHBOARD_CONFIG } from '@/app/config/tenant-config';
import { logger, LogLevel } from '@/app/utils';
import { RefreshCw, Activity, Server, Store } from 'lucide-react';

// Set log level from config
logger.setLevel(LogLevel[DASHBOARD_CONFIG.logLevel]);

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  loading: boolean;
}

function StatCard({ title, value, subtitle, loading }: StatCardProps) {
  // KFC red color scheme for both tenants
  const bgColor = 'bg-gradient-to-br from-red-50 to-rose-50';
  const textColor = 'text-red-700';
  const borderColor = 'border-red-200';
  
  // Check if value is a percentage for special styling
  const isPercentage = value.includes('%');
  const percentValue = isPercentage ? parseFloat(value.replace('%', '')) : null;
  const isHealthy = percentValue !== null && percentValue >= 90;
  
  // Adjust font size for longer values (4+ digits)
  const valueLength = value.replace(/[^0-9]/g, '').length;
  const fontSize = valueLength >= 4 ? 'text-3xl' : 'text-4xl';
  
  return (
    <div className={`${bgColor} rounded-xl p-4 border-2 ${borderColor} shadow-sm hover:shadow-md transition-shadow h-[140px] flex flex-col justify-center`}>
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
                  <p className={`text-3xl font-extrabold ${textColor}`}>{subtitle.split(' / ')[0]}</p>
                )}
              </>
            ) : (
              <p className={`${fontSize} font-extrabold ${textColor} text-center whitespace-nowrap`}>{value}</p>
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
}

export default function KFCLATMDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<{
    KFCGT: DashboardStats;
    KFCMX: DashboardStats;
  }>({
    KFCGT: { totalStores: 0, totalKiosks: 0, onlineStores: 0, offlineStores: 0, onlineKiosks: 0, offlineKiosks: 0 },
    KFCMX: { totalStores: 0, totalKiosks: 0, onlineStores: 0, offlineStores: 0, onlineKiosks: 0, offlineKiosks: 0 },
  });
  const [disconnectedKiosks, setDisconnectedKiosks] = useState<{
    KFCGT: number;
    KFCMX: number;
  }>({
    KFCGT: 0,
    KFCMX: 0,
  });
  const [chartData, setChartData] = useState<{
    KFCGT: ChartData;
    KFCMX: ChartData;
  }>({
    KFCGT: { orderFailureTrend: [], typeOfIssues: [], orderFailureTypes: [], alertHeatmap: [] },
    KFCMX: { orderFailureTrend: [], typeOfIssues: [], orderFailureTypes: [], alertHeatmap: [] },
  });

  const fetchData = async () => {
    setRefreshing(true);
    const startTime = new Date();
    
    logger.debug('=== KFC LATM DASHBOARD REFRESH START ===');
    logger.info(`Dashboard refresh started at ${startTime.toLocaleTimeString()}`);
    
    try {
      const kfcgtService = new DashboardDataService(
        TENANT_CONFIG.KFCGT.accountId,
        TENANT_CONFIG.KFCGT.apiKey,
        'KFCGT'
      );
      const kfcmxService = new DashboardDataService(
        TENANT_CONFIG.KFCMX.accountId,
        TENANT_CONFIG.KFCMX.apiKey,
        'KFCMX'
      );

      const [kfcgtData, kfcmxData, kfcgtCharts, kfcmxCharts, kfcgtDisconnected, kfcmxDisconnected] = await Promise.all([
        kfcgtService.fetchDashboardData('KFCGT'),
        kfcmxService.fetchDashboardData('KFCMX'),
        kfcgtService.fetchChartData('KFCGT'),
        kfcmxService.fetchChartData('KFCMX'),
        kfcgtService.fetchDisconnectedKiosks('KFCGT'),
        kfcmxService.fetchDisconnectedKiosks('KFCMX'),
      ]);

      setStats({ KFCGT: kfcgtData, KFCMX: kfcmxData });
      setChartData({ KFCGT: kfcgtCharts, KFCMX: kfcmxCharts });
      setDisconnectedKiosks({ KFCGT: kfcgtDisconnected, KFCMX: kfcmxDisconnected });
      
      const endTime = new Date();
      const duration = ((endTime.getTime() - startTime.getTime()) / 1000).toFixed(2);
      logger.info(`Dashboard refresh completed in ${duration}s`);
      logger.info(`Stats - KFC-GT: ${kfcgtData.onlineKiosks}/${kfcgtData.totalKiosks} online, KFC-MX: ${kfcmxData.onlineKiosks}/${kfcmxData.totalKiosks} online`);
    } catch (error) {
      logger.error('Dashboard refresh failed:', error);
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

  const calculatePercentage = (online: number, total: number) => {
    if (total === 0) return '0';
    return ((online / total) * 100).toFixed(2);
  };

  return (
    <div className="h-screen bg-gray-900 transition-colors overflow-hidden">
      {/* Floating Refresh Button */}
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
        <div className="h-full grid grid-cols-2 gap-4">
          {/* KFC-GT Column */}
          <div className="flex flex-col space-y-3">
            {/* KFC-GT Header with Logo */}
            <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-xl p-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden shadow-lg bg-white flex items-center justify-center">
                  <Image src="/nr-tv-dashboard/kfc-logo.png" alt="KFC Guatemala" width={56} height={56} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">KFC-GT Alerts</h2>
                  <p className="text-xs text-red-50">KFC Guatemala</p>
                </div>
              </div>
            </div>

            {/* Row 1: Stats */}
            <div className="grid grid-cols-3 gap-3 items-stretch">
              <StatCard
                title="Total Store (Kiosk)"
                value={`${stats.KFCGT.totalStores} (${Math.max(0, stats.KFCGT.onlineKiosks + stats.KFCGT.offlineKiosks - disconnectedKiosks.KFCGT)})`}
                icon={<Store className="h-5 w-5" />}
                loading={loading}
              />
              <StatCard
                title="Online Kiosks"
                value={`${calculatePercentage(stats.KFCGT.onlineKiosks, Math.max(1, stats.KFCGT.onlineKiosks + stats.KFCGT.offlineKiosks))}%`}
                subtitle={`${stats.KFCGT.onlineKiosks} / ${Math.max(0, stats.KFCGT.onlineKiosks + stats.KFCGT.offlineKiosks)}`}
                icon={<Activity className="h-5 w-5" />}
                loading={loading}
              />
              <StatCard
                title="Offline Kiosks"
                value={`${stats.KFCGT.offlineKiosks}`}
                icon={<Server className="h-5 w-5" />}
                loading={loading}
              />
            </div>

            {/* Row 2: Map */}
            <div className="bg-gray-800 rounded-xl border-2 border-red-600 shadow-lg overflow-hidden flex-1">
              <div className="px-3 py-2 border-b border-red-600">
                <h3 className="text-base font-bold text-red-400">Order Failure Map (Today)</h3>
              </div>
              <div className="p-3 h-[calc(100%-48px)]">
                <AlertHeatmap data={chartData.KFCGT.alertHeatmap} />
              </div>
            </div>

            {/* Row 3: Charts */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-800 rounded-xl border-2 border-red-600 shadow-lg p-3">
                <h3 className="text-sm font-bold mb-2 text-red-400">Order Failure Trend (1 Week)</h3>
                <div className="h-[200px]">
                  {chartData.KFCGT.orderFailureTrend.length > 0 ? (
                    <ConfigurableLineChart
                      config={{ title: 'KFC-GT Order Failure Trend', colors: { primary: '#dc2626' } }}
                      data={chartData.KFCGT.orderFailureTrend}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gray-50 rounded">
                      <div className="text-gray-400 text-gray-600">Loading chart...</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl border-2 border-red-600 shadow-lg p-3">
                <h3 className="text-sm font-bold mb-2 text-red-400">Order Failure Types (1 Week)</h3>
                <div className="h-[200px]">
                  {chartData.KFCGT.orderFailureTypes.length > 0 ? (
                    <ConfigurableBarChart
                      config={{ title: 'KFC-GT Order Failure Types', colors: { primary: '#dc2626' }, orientation: 'horizontal' }}
                      data={chartData.KFCGT.orderFailureTypes}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gray-50 rounded">
                      <div className="text-gray-400 text-gray-600">Loading chart...</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* KFC-MX Column */}
          <div className="flex flex-col space-y-3">
            {/* KFC-MX Header with Logo and Background */}
            <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-xl p-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden shadow-lg bg-white flex items-center justify-center">
                  <Image src="/nr-tv-dashboard/kfc-logo.png" alt="KFC Mexico" width={56} height={56} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">KFC-MX Alerts</h2>
                  <p className="text-xs text-red-50">KFC Mexico</p>
                </div>
              </div>
            </div>

            {/* Row 1: Stats */}
            <div className="grid grid-cols-3 gap-3 items-stretch">
              <StatCard
                title="Total Store (Kiosk)"
                value={`${stats.KFCMX.totalStores} (${Math.max(0, stats.KFCMX.onlineKiosks + stats.KFCMX.offlineKiosks - disconnectedKiosks.KFCMX)})`}
                icon={<Store className="h-5 w-5" />}
                loading={loading}
              />
              <StatCard
                title="Online Kiosks"
                value={`${calculatePercentage(stats.KFCMX.onlineKiosks, Math.max(1, stats.KFCMX.onlineKiosks + stats.KFCMX.offlineKiosks))}%`}
                subtitle={`${stats.KFCMX.onlineKiosks}`}
                icon={<Activity className="h-5 w-5" />}
                loading={loading}
              />
              <StatCard
                title="Offline Kiosks"
                value={`${stats.KFCMX.offlineKiosks}`}
                icon={<Server className="h-5 w-5" />}
                loading={loading}
              />
            </div>

            {/* Row 2: Map */}
            <div className="bg-gray-800 rounded-xl border-2 border-red-600 shadow-lg overflow-hidden flex-1">
              <div className="px-3 py-2 border-b border-red-600">
                <h3 className="text-base font-bold text-red-400">Order Failure Map (Today)</h3>
              </div>
              <div className="p-3 h-[calc(100%-48px)]">
                <AlertHeatmap data={chartData.KFCMX.alertHeatmap} />
              </div>
            </div>

            {/* Row 3: Charts */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-800 rounded-xl border-2 border-red-600 shadow-lg p-3">
                <h3 className="text-sm font-bold mb-2 text-red-400">Order Failure Trend (1 Week)</h3>
                <div className="h-[200px]">
                  {chartData.KFCMX.orderFailureTrend.length > 0 ? (
                    <ConfigurableLineChart
                      config={{ title: 'KFC-MX Order Failure Trend', colors: { primary: '#dc2626' } }}
                      data={chartData.KFCMX.orderFailureTrend}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gray-50 rounded">
                      <div className="text-gray-400 text-gray-600">Loading chart...</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl border-2 border-red-600 shadow-lg p-3">
                <h3 className="text-sm font-bold mb-2 text-red-400">Order Failure Types (1 Week)</h3>
                <div className="h-[200px]">
                  {chartData.KFCMX.orderFailureTypes.length > 0 ? (
                    <ConfigurableBarChart
                      config={{ title: 'KFC-MX Order Failure Types', colors: { primary: '#dc2626' }, orientation: 'horizontal' }}
                      data={chartData.KFCMX.orderFailureTypes}
                    />
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
    </div>
  );
}
