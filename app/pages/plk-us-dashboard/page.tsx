'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ConfigurableLineChart, ConfigurableBarChart, AlertHeatmap } from '@/app/components';
import { DashboardDataService } from '@/app/services/dashboard-data-service';
import { TENANT_CONFIG, DASHBOARD_CONFIG } from '@/app/config/tenant-config';
import { RefreshCw, Activity, Server, Store } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  variant: 'plk';
  loading: boolean;
}

function StatCard({ title, value, subtitle, variant, loading }: StatCardProps) {
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
                  w-20 h-20 rounded-full
                  ${isHealthy 
                    ? 'bg-green-500' 
                    : 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50'
                  }
                `}>
                  <span className="text-4xl font-extrabold text-white">{value}</span>
                </div>
                {subtitle && (
                  <p className={`text-2xl font-bold ${textColor}`}>{subtitle}</p>
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
}

export default function PLKUSDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({ totalStores: 0, totalKiosks: 0, onlineStores: 0, offlineStores: 0, onlineKiosks: 0, offlineKiosks: 0 });
  const [chartData, setChartData] = useState<ChartData>({ orderFailureTrend: [], typeOfIssues: [], orderFailureTypes: [], alertHeatmap: [] });

  const fetchData = async () => {
    setRefreshing(true);
    const startTime = new Date();
    try {
      const plkService = new DashboardDataService(
        TENANT_CONFIG.PLKUS.accountId,
        TENANT_CONFIG.PLKUS.apiKey,
        'PLKUS'
      );

      const [plkStats, plkCharts] = await Promise.all([
        plkService.fetchDashboardData('PLKUS'),
        plkService.fetchChartData('PLKUS'),
      ]);

      setStats(plkStats);
      setChartData(plkCharts);
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
    if (total === 0) return 0;
    return Math.round((online / total) * 100);
  };

  const plkLogo = (
    <div className="w-14 h-14 rounded-lg overflow-hidden shadow-lg bg-white">
      <Image src="/plk-us.png" alt="PLK-US" width={56} height={56} className="object-contain" />
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
        <div className="h-full grid grid-cols-1 gap-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-3 shadow-lg">
            <div className="flex items-center gap-3">
              {plkLogo}
              <div>
                <h2 className="text-2xl font-bold text-white">PLK-US Alerts</h2>
                <p className="text-xs text-orange-50">Popeyes Louisiana Kitchen - United States</p>
              </div>
            </div>
          </div>

          {/* Row 1: Six Stat Cards */}
          <div className="grid grid-cols-3 gap-3 items-stretch">
            <StatCard title="Total Store (Kiosk)" value={`${stats.totalStores} (${stats.totalKiosks || 0})`} icon={<Store className="h-5 w-5" />} variant="plk" loading={loading} />
            <StatCard title="Online Kiosks" value={`${calculatePercentage(stats.onlineKiosks, stats.totalKiosks || 0)}%`} subtitle={`${stats.onlineKiosks} / ${stats.totalKiosks || 0}`} icon={<Activity className="h-5 w-5" />} variant="plk" loading={loading} />
            <StatCard title="Offline Kiosks" value={`${stats.offlineKiosks}`} icon={<Server className="h-5 w-5" />} variant="plk" loading={loading} />
            <StatCard title="Disconnected Kiosks" value={`Coming soon`} icon={<Server className="h-5 w-5" />} variant="plk" loading={false} />
            <StatCard title="Coming soon" value={`0`} icon={<Server className="h-5 w-5" />} variant="plk" loading={false} />
            <StatCard title="Coming soon" value={`0`} icon={<Server className="h-5 w-5" />} variant="plk" loading={false} />
          </div>

          {/* Row 2: Order Failure Today + PLK-US Online/Offline Map */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800 rounded-xl border-2 border-orange-600 shadow-lg p-3">
              <h3 className="text-sm font-bold mb-2 text-orange-400">Order Failure Map (Today)</h3>
              <div className="h-[220px]">
                <AlertHeatmap data={chartData.alertHeatmap} />
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl border-2 border-orange-600 shadow-lg p-3">
              <h3 className="text-sm font-bold mb-2 text-orange-400">PLK-US Kiosk Status (Online/Offline)</h3>
              <div className="h-[220px]">
                {/* TODO: Implement PLK-US only online/offline map using KioskLocationMap with PLK-US data */}
                <div className="h-full flex items-center justify-center bg-gray-50 rounded">
                  <div className="text-gray-600">Coming soon</div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Charts */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800 rounded-xl border-2 border-orange-600 shadow-lg p-3">
              <h3 className="text-sm font-bold mb-2 text-orange-400">Order Failure Trend (1 Week)</h3>
              <div className="h-[200px]">
                {chartData.orderFailureTrend.length > 0 ? (
                  <ConfigurableLineChart config={{ title: 'PLK-US Order Failure Trend', colors: { primary: '#f97316' } }} data={chartData.orderFailureTrend} />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-50 rounded">
                    <div className="text-gray-600">Loading chart...</div>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl border-2 border-orange-600 shadow-lg p-3">
              <h3 className="text-sm font-bold mb-2 text-orange-400">Order Failure Types</h3>
              <div className="h-[200px]">
                {chartData.orderFailureTypes.length > 0 ? (
                  <ConfigurableBarChart config={{ title: 'PLK-US Order Failure Types', colors: { primary: '#f97316' } }} data={chartData.orderFailureTypes} />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-50 rounded">
                    <div className="text-gray-600">Loading chart...</div>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl border-2 border-orange-600 shadow-lg p-3">
              <h3 className="text-sm font-bold mb-2 text-orange-400">Order Failure by POS</h3>
              <div className="h-[200px]">
                <div className="h-full flex items-center justify-center bg-gray-50 rounded">
                  <div className="text-gray-600">Coming soon</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl border-2 border-orange-600 shadow-lg p-3">
              <h3 className="text-sm font-bold mb-2 text-orange-400">Top 5 Order Failure Stores</h3>
              <div className="h-[200px]">
                <div className="h-full flex items-center justify-center bg-gray-50 rounded">
                  <div className="text-gray-600">Coming soon</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
