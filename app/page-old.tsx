'use client';

import { useEffect, useState } from 'react';
import { LineChart, BarChart, USStateMap } from '@/components/charts';
import type { StateMapData } from '@/components/charts';
import { StatCard } from '@/components/ui/stat-card';
import { DashboardDataService, DashboardStats } from '@/lib/services/dashboard-data-service';
import { TENANT_CONFIG } from '@/lib/config/tenant-config';
import { Activity, AlertCircle, Server, TrendingUp, RefreshCw, Store } from 'lucide-react';

export default function Home() {
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [stateData, setStateData] = useState<StateMapData[]>([]);
  const [loading, setLoading] = useState(true);
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

  const fetchData = async () => {
    setRefreshing(true);
    
    try {
      // Create services for both tenants
      const bkService = new DashboardDataService(
        TENANT_CONFIG.BKUS.accountId,
        TENANT_CONFIG.BKUS.apiKey
      );
      
      const plkService = new DashboardDataService(
        TENANT_CONFIG.PLKUS.accountId,
        TENANT_CONFIG.PLKUS.apiKey
      );

      // Fetch data for both tenants in parallel
      const [bkData, plkData] = await Promise.all([
        bkService.fetchDashboardData('BKUS'),
        plkService.fetchDashboardData('PLKUS'),
      ]);

      setStats({
        BKUS: bkData,
        PLKUS: plkData,
      });

      // TODO: Add chart data fetching later
      setTimeSeriesData([]);
      setCategoryData([]);
      setStateData([]);

    } catch (error) {
      console.error('Failed to fetch data:', error);
      // Keep existing stats on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col p-4 space-y-2 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">TV Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Real-time monitoring and analytics dashboard
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stat Cards Row - 8 cards in a single row */}
      <div className="grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-8 flex-shrink-0">
        {/* BK-US Cards */}
        <StatCard
          title="BK-US Alerts"
          value={stats.bkUS.alerts}
          icon={<AlertCircle className="h-4 w-4" />}
          trend="Burger King US"
          variant="bk"
        />
        <StatCard
          title="BK-US Online"
          value={stats.bkUS.kiosksOnline}
          icon={<Activity className="h-4 w-4" />}
          trend="Currently active"
          variant="bk"
        />
        <StatCard
          title="BK-US Offline"
          value={stats.bkUS.kiosksOffline}
          icon={<Server className="h-4 w-4" />}
          trend="Needs attention"
          variant="bk"
        />
        <StatCard
          title="BK-US Total"
          value={stats.bkUS.totalKiosks}
          icon={<TrendingUp className="h-4 w-4" />}
          trend="Total kiosks"
          variant="bk"
        />
        
        {/* PLK-US Cards */}
        <StatCard
          title="PLK-US Alerts"
          value={stats.plkUS.alerts}
          icon={<AlertCircle className="h-4 w-4" />}
          trend="Popeyes US"
          variant="plk"
        />
        <StatCard
          title="PLK-US Online"
          value={stats.plkUS.kiosksOnline}
          icon={<Activity className="h-4 w-4" />}
          trend="Currently active"
          variant="plk"
        />
        <StatCard
          title="PLK-US Offline"
          value={stats.plkUS.kiosksOffline}
          icon={<Server className="h-4 w-4" />}
          trend="Needs attention"
          variant="plk"
        />
        <StatCard
          title="PLK-US Total"
          value={stats.plkUS.totalKiosks}
          icon={<TrendingUp className="h-4 w-4" />}
          trend="Total kiosks"
          variant="plk"
        />
      </div>

      {/* 2nd Row - 4 Charts */}
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 flex-1 min-h-0">
        <LineChart
          title="Trend Analysis"
          description="30-day performance metrics"
          data={timeSeriesData}
          dataKeys={['value', 'value2']}
          xAxisKey="date"
          height={200}
        />

        <BarChart
          title="Category Distribution"
          description="Performance by category"
          data={categoryData}
          dataKeys={['value']}
          xAxisKey="category"
          height={200}
        />

        <USStateMap
          title="Alerts by State"
          description="Alert distribution across US states"
          data={stateData}
          height={200}
        />

        <LineChart
          title="Secondary Metric"
          description="Additional trend data"
          data={timeSeriesData}
          dataKeys={['value']}
          xAxisKey="date"
          height={200}
        />
      </div>

      {/* 3rd Row - 4 Charts */}
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 flex-1 min-h-0">
        <BarChart
          title="Response Times"
          description="Average response times"
          data={categoryData}
          dataKeys={['value']}
          xAxisKey="category"
          height={200}
        />

        <LineChart
          title="Daily Traffic"
          description="User activity trends"
          data={timeSeriesData}
          dataKeys={['value2']}
          xAxisKey="date"
          height={200}
        />

        <USStateMap
          title="Activity by State"
          description="State-level activity"
          data={stateData}
          height={200}
        />

        <BarChart
          title="Error Distribution"
          description="Errors by type"
          data={categoryData}
          dataKeys={['value']}
          xAxisKey="category"
          height={200}
        />
      </div>

      <div className="hidden p-2 rounded-lg border bg-card flex-shrink-0">
        <h2 className="text-2xl font-semibold mb-4">How to Extend</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div>
            <strong className="text-foreground">Add New Charts:</strong> Create new chart components in 
            <code className="mx-1 px-2 py-0.5 rounded bg-muted text-foreground">components/charts/</code>
          </div>
          <div>
            <strong className="text-foreground">Add Data Connectors:</strong> Implement new connectors in 
            <code className="mx-1 px-2 py-0.5 rounded bg-muted text-foreground">lib/connectors/</code>
            by extending the <code className="px-1">DataConnector</code> interface
          </div>
          <div>
            <strong className="text-foreground">NewRelic Integration:</strong> Replace MockDataConnector with NewRelicConnector and provide your API key
          </div>
          <div>
            <strong className="text-foreground">Layout Customization:</strong> Modify the grid layout in 
            <code className="mx-1 px-2 py-0.5 rounded bg-muted text-foreground">app/page.tsx</code> to arrange components
          </div>
        </div>
      </div>
    </div>
  );
}
