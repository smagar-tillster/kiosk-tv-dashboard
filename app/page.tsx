'use client';

import { useEffect, useState } from 'react';
import { StatCard } from '@/components/ui/stat-card';
import { DashboardDataService, DashboardStats, ChartData } from '@/lib/services/dashboard-data-service';
import { TENANT_CONFIG } from '@/lib/config/tenant-config';
import { DASHBOARD_CONFIG } from '@/lib/config/dashboard-config';
import { Activity, Server, RefreshCw, Store } from 'lucide-react';
import { OrderFailureTrendChart } from '@/components/charts/OrderFailureTrendChart';
import { TypeOfIssuesChart } from '@/components/charts/TypeOfIssuesChart';
import { OrderFailureTypesChart } from '@/components/charts/OrderFailureTypesChart';
import { AlertHeatmap } from '@/components/charts/AlertHeatmap';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState<{
    BKUS: DashboardStats;
    PLKUS: DashboardStats;
  }>({
    BKUS: {
      totalStores: 0,
      totalKiosks: 0,
      onlineStores: 0,
      offlineStores: 0,
      onlineKiosks: 0,
      offlineKiosks: 0,
    },
    PLKUS: {
      totalStores: 0,
      totalKiosks: 0,
      onlineStores: 0,
      offlineStores: 0,
      onlineKiosks: 0,
      offlineKiosks: 0,
    },
  });

  const [chartData, setChartData] = useState<{
    BKUS: ChartData;
    PLKUS: ChartData;
  }>({
    BKUS: {
      orderFailureTrend: [],
      typeOfIssues: [],
      orderFailureTypes: [],
      alertHeatmap: [],
    },
    PLKUS: {
      orderFailureTrend: [],
      typeOfIssues: [],
      orderFailureTypes: [],
      alertHeatmap: [],
    },
  });

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

      // Fetch data for both tenants in parallel
      const [bkData, plkData, bkCharts, plkCharts] = await Promise.all([
        bkService.fetchDashboardData('BKUS'),
        plkService.fetchDashboardData('PLKUS'),
        bkService.fetchChartData('BKUS'),
        plkService.fetchChartData('PLKUS'),
      ]);

      setStats({
        BKUS: bkData,
        PLKUS: plkData,
      });

      setChartData({
        BKUS: bkCharts,
        PLKUS: plkCharts,
      });

    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Setup auto-refresh if button is disabled
    if (!DASHBOARD_CONFIG.showRefreshButton) {
      const intervalMs = DASHBOARD_CONFIG.autoRefreshMinutes * 60 * 1000;
      const interval = setInterval(() => {
        fetchData();
      }, intervalMs);
      
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="h-screen flex flex-col p-3 space-y-2 overflow-hidden">
      <div className="flex items-center justify-between pb-1">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#f97316' }}>Tillster Proactive monitoring dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Real-time monitoring and analytics dashboard
            {!DASHBOARD_CONFIG.showRefreshButton && (
              <span className="ml-2 text-xs text-gray-500">
                (Auto-refreshes every {DASHBOARD_CONFIG.autoRefreshMinutes} minutes)
              </span>
            )}
          </p>
        </div>
        {DASHBOARD_CONFIG.showRefreshButton && (
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        )}
      </div>

      {/* Stat Cards Row - 6 cards (3 BK-US + 3 PLK-US) */}
      <div className="grid grid-cols-6 gap-0 flex-shrink-0">
        {/* BK-US Cards */}
        <StatCard
          title="BK-US Total Store(Kiosk)"
          value={`${stats.BKUS.totalStores}(${stats.BKUS.totalKiosks})`}
          icon={<Store className="h-4 w-4" />}
          variant="bk"
          loading={loading || stats.BKUS.totalStores === 0}
        />
        <StatCard
          title="BK-US Online Store(Kiosk)"
          value={`${stats.BKUS.onlineStores}(${stats.BKUS.onlineKiosks})`}
          icon={<Activity className="h-4 w-4" />}
          variant="bk"
          loading={loading || stats.BKUS.totalStores === 0}
        />
        <StatCard
          title="BK-US Offline Store(Kiosk)"
          value={`${stats.BKUS.offlineStores}(${stats.BKUS.offlineKiosks})`}
          icon={<Server className="h-4 w-4" />}
          variant="bk"
          loading={loading || stats.BKUS.totalStores === 0}
        />
        
        {/* PLK-US Cards */}
        <StatCard
          title="PLK-US Total Store(Kiosk)"
          value={`${stats.PLKUS.totalStores}(${stats.PLKUS.totalKiosks})`}
          icon={<Store className="h-4 w-4" />}
          variant="plk"
          loading={loading || stats.PLKUS.totalStores === 0}
        />
        <StatCard
          title="PLK-US Online Store(Kiosk)"
          value={`${stats.PLKUS.onlineStores}(${stats.PLKUS.onlineKiosks})`}
          icon={<Activity className="h-4 w-4" />}
          variant="plk"
          loading={loading || stats.PLKUS.totalStores === 0}
        />
        <StatCard
          title="PLK-US Offline Store(Kiosk)"
          value={`${stats.PLKUS.offlineStores}(${stats.PLKUS.offlineKiosks})`}
          icon={<Server className="h-4 w-4" />}
          variant="plk"
          loading={loading || stats.PLKUS.totalStores === 0}
        />
      </div>

      {/* Row 2 - Order Failure Trends and Type of Issues */}
      <div className="grid grid-cols-4 gap-2 flex-shrink-0" style={{ height: 'calc((100vh - 140px) / 2)' }}>
        <div className="bg-white rounded-lg border p-3">
          <h3 className="text-lg font-bold mb-2" style={{ color: '#22c55e' }}>BK-US Order Failure Trend (1 Week)</h3>
          <div className="h-[calc(100%-2.5rem)]">
            {chartData.BKUS.orderFailureTrend.length > 0 ? (
              <OrderFailureTrendChart data={chartData.BKUS.orderFailureTrend} color="#22c55e" />
            ) : (
              <div className="h-full animate-pulse bg-gray-100 rounded flex items-center justify-center">
                <div className="text-gray-400">Loading chart...</div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-3">
          <h3 className="text-lg font-bold mb-2" style={{ color: '#22c55e' }}>BK-US Type of Issues (Today)</h3>
          <div className="h-[calc(100%-2.5rem)]">
            {chartData.BKUS.typeOfIssues.length > 0 ? (
              <TypeOfIssuesChart data={chartData.BKUS.typeOfIssues} color="#22c55e" />
            ) : (
              <div className="h-full animate-pulse bg-gray-100 rounded flex items-center justify-center">
                <div className="text-gray-400">Loading chart...</div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-3">
          <h3 className="text-lg font-bold mb-2" style={{ color: '#f97316' }}>PLK-US Order Failure Trend (1 Week)</h3>
          <div className="h-[calc(100%-2.5rem)]">
            {chartData.PLKUS.orderFailureTrend.length > 0 ? (
              <OrderFailureTrendChart data={chartData.PLKUS.orderFailureTrend} color="#f97316" />
            ) : (
              <div className="h-full animate-pulse bg-gray-100 rounded flex items-center justify-center">
                <div className="text-gray-400">Loading chart...</div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-3">
          <h3 className="text-lg font-bold mb-2" style={{ color: '#f97316' }}>PLK-US Type of Issues (Today)</h3>
          <div className="h-[calc(100%-2.5rem)]">
            {chartData.PLKUS.typeOfIssues.length > 0 ? (
              <TypeOfIssuesChart data={chartData.PLKUS.typeOfIssues} color="#f97316" />
            ) : (
              <div className="h-full animate-pulse bg-gray-100 rounded flex items-center justify-center">
                <div className="text-gray-400">Loading chart...</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 3 - Order Failure Types and US Map */}
      <div className="grid grid-cols-4 gap-2" style={{ height: 'calc((100vh - 140px) / 2)' }}>
        <div className="bg-white rounded-lg border p-3">
          <h3 className="text-lg font-bold mb-2" style={{ color: '#22c55e' }}>BK-US Order Failure Types (1 Week)</h3>
          <div className="h-[calc(100%-2.5rem)]">
            {chartData.BKUS.orderFailureTypes.length > 0 ? (
              <OrderFailureTypesChart data={chartData.BKUS.orderFailureTypes} color="#22c55e" />
            ) : (
              <div className="h-full animate-pulse bg-gray-100 rounded flex items-center justify-center">
                <div className="text-gray-400">Loading chart...</div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-3">
          <h3 className="text-lg font-bold mb-2" style={{ color: '#22c55e' }}>BK-US Alert Heatmap (Today)</h3>
          <div className="h-[calc(100%-2.5rem)]">
            {chartData.BKUS.alertHeatmap.length > 0 ? (
              <AlertHeatmap data={chartData.BKUS.alertHeatmap} />
            ) : (
              <div className="h-full animate-pulse bg-gray-100 rounded flex items-center justify-center">
                <div className="text-gray-400">Loading chart...</div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-3">
          <h3 className="text-lg font-bold mb-2" style={{ color: '#f97316' }}>PLK-US Order Failure Types (1 Week)</h3>
          <div className="h-[calc(100%-2.5rem)]">
            {chartData.PLKUS.orderFailureTypes.length > 0 ? (
              <OrderFailureTypesChart data={chartData.PLKUS.orderFailureTypes} color="#f97316" />
            ) : (
              <div className="h-full animate-pulse bg-gray-100 rounded flex items-center justify-center">
                <div className="text-gray-400">Loading chart...</div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-3">
          <h3 className="text-lg font-bold mb-2" style={{ color: '#f97316' }}>PLK-US Alert Heatmap (Today)</h3>
          <div className="h-[calc(100%-2.5rem)]">
            {chartData.PLKUS.alertHeatmap.length > 0 ? (
              <AlertHeatmap data={chartData.PLKUS.alertHeatmap} />
            ) : (
              <div className="h-full animate-pulse bg-gray-100 rounded flex items-center justify-center">
                <div className="text-gray-400">Loading chart...</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
