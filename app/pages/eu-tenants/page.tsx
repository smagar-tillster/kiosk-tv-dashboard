'use client';

import { useState, useEffect } from 'react';
import { ConfigurableBarChart } from '@/app/components';
import { DashboardDataService } from '@/app/services/dashboard-data-service';
import { TENANT_CONFIG, DASHBOARD_CONFIG } from '@/app/config/tenant-config';
import { RefreshCw } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [chartData, setChartData] = useState<unknown[]>([]);

  const fetchData = async () => {
    setRefreshing(true);
    const startTime = new Date();
    console.log(`[EU Tenants Refresh] Started at ${startTime.toLocaleTimeString()}`);
    
    try {
      // Create service for BK-US tenant
      const bkService = new DashboardDataService(
        TENANT_CONFIG.BKUS.accountId,
        TENANT_CONFIG.BKUS.apiKey,
        'BKUS'
      );

      // Fetch chart data
      const data = await bkService.fetchChartData('BKUS');
      
      // Use any chart data you want (typeOfIssues, orderFailureTypes, etc.)
      setChartData(data.typeOfIssues);
      
      const endTime = new Date();
      const duration = ((endTime.getTime() - startTime.getTime()) / 1000).toFixed(2);
      console.log(`[EU Tenants Refresh] Completed at ${endTime.toLocaleTimeString()} (took ${duration}s)`);
      console.log(`[EU Tenants Stats] Chart data points: ${data.typeOfIssues?.length || 0}`);
      
    } catch (error) {
      console.error('[EU Tenants Refresh] Failed:', error);
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

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-gray-800 border-b border-gray-700">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#f97316' }}>
            Analytics Dashboard
          </h1>
          <p className="text-sm text-gray-400">
            Custom analytics view for BK-US
          </p>
        </div>
        
        {DASHBOARD_CONFIG.showRefreshButton && (
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        )}
      </div>

      {/* Chart Container */}
      <div className="flex-1 p-6">
        <div className="h-full bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-white">
            Type of Issues
          </h2>
          
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="h-[calc(100%-3rem)]">
              <ConfigurableBarChart
                config={{
                  title: 'BK-US Type of Issues',
                  colors: { primary: '#22c55e' },
                  orientation: 'vertical',
                }}
                data={chartData}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}