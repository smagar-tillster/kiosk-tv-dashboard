'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { KioskLocationMap } from '@/app/components';
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
  variant: 'bk' | 'plk';
  loading: boolean;
}

function StatCard({ title, value, subtitle, variant, loading }: StatCardProps) {
  const bgColor = variant === 'bk' ? 'bg-gradient-to-br from-emerald-50 to-teal-50' : 'bg-gradient-to-br from-orange-50 to-amber-50';
  const textColor = variant === 'bk' ? 'text-emerald-700' : 'text-orange-700';
  const borderColor = variant === 'bk' ? 'border-emerald-200' : 'border-orange-200';
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

export default function ExecDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<{
    BKUS: DashboardStats;
    PLKUS: DashboardStats;
  }>({
    BKUS: { totalStores: 0, totalKiosks: 0, onlineStores: 0, offlineStores: 0, onlineKiosks: 0, offlineKiosks: 0 },
    PLKUS: { totalStores: 0, totalKiosks: 0, onlineStores: 0, offlineStores: 0, onlineKiosks: 0, offlineKiosks: 0 },
  });
  const [disconnectedKiosks, setDisconnectedKiosks] = useState<{
    BKUS: number;
    PLKUS: number;
  }>({
    BKUS: 0,
    PLKUS: 0,
  });
  const [kioskLocations, setKioskLocations] = useState<{
    BKUS: any[];
    PLKUS: any[];
  }>({
    BKUS: [],
    PLKUS: [],
  });
  const [chartData, setChartData] = useState<{
    BKUS: ChartData;
    PLKUS: ChartData;
  }>({
    BKUS: { orderFailureTrend: [], typeOfIssues: [], orderFailureTypes: [], alertHeatmap: [] },
    PLKUS: { orderFailureTrend: [], typeOfIssues: [], orderFailureTypes: [], alertHeatmap: [] },
  });

  const fetchData = async () => {
    setRefreshing(true);
    const startTime = new Date();
    
    logger.debug('=== EXEC DASHBOARD REFRESH START ===');
    logger.info(`Exec dashboard refresh started at ${startTime.toLocaleTimeString()}`);
    
    try {
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

      const [bkData, plkData, bkCharts, plkCharts, bkDisconnected, plkDisconnected, bkLocations, plkLocations] = await Promise.all([
        bkService.fetchDashboardData('BKUS'),
        plkService.fetchDashboardData('PLKUS'),
        bkService.fetchChartData('BKUS'),
        plkService.fetchChartData('PLKUS'),
        bkService.fetchDisconnectedKiosks('BKUS'),
        plkService.fetchDisconnectedKiosks('PLKUS'),
        bkService.fetchKioskLocations('BKUS'),
        plkService.fetchKioskLocations('PLKUS'),
      ]);

      setStats({ BKUS: bkData, PLKUS: plkData });
      setChartData({ BKUS: bkCharts, PLKUS: plkCharts });
      setDisconnectedKiosks({ BKUS: bkDisconnected, PLKUS: plkDisconnected });
      setKioskLocations({ BKUS: bkLocations || [], PLKUS: plkLocations || [] });
      
      const endTime = new Date();
      const duration = ((endTime.getTime() - startTime.getTime()) / 1000).toFixed(2);
      logger.info(`Exec dashboard refresh completed in ${duration}s`);
      logger.info(`Stats - BK-US: ${bkData.onlineKiosks}/${bkData.totalKiosks} online, PLK-US: ${plkData.onlineKiosks}/${plkData.totalKiosks} online`);
    } catch (error) {
      logger.error('Exec dashboard refresh failed:', error);
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
          {/* BK-US Column */}
          <div className="flex flex-col space-y-3 h-full">
            {/* BK-US Header with Logo */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden shadow-lg bg-white">
                  <Image src="/nr-tv-dashboard/bk-us.png" alt="Burger King" width={56} height={56} className="object-contain" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">BK-US Executive View</h2>
                  <p className="text-xs text-emerald-50">Burger King United States</p>
                </div>
              </div>
            </div>

            {/* Row 2: Stats */}
            <div className="grid grid-cols-3 gap-3 items-stretch">
              <StatCard
                title="Total Store (Kiosk)"
                value={`${stats.BKUS.totalStores} (${Math.max(0, stats.BKUS.onlineKiosks + stats.BKUS.offlineKiosks - disconnectedKiosks.BKUS)})`}
                icon={<Store className="h-5 w-5" />}
                variant="bk"
                loading={loading}
              />
              <StatCard
                title="Online Kiosks"
                value={`${calculatePercentage(stats.BKUS.onlineKiosks, Math.max(1, stats.BKUS.onlineKiosks + stats.BKUS.offlineKiosks))}%`}
                subtitle={`${stats.BKUS.onlineKiosks} / ${Math.max(0, stats.BKUS.onlineKiosks + stats.BKUS.offlineKiosks)}`}
                icon={<Activity className="h-5 w-5" />}
                variant="bk"
                loading={loading}
              />
              <StatCard
                title="Offline Kiosks"
                value={`${stats.BKUS.offlineKiosks}`}
                icon={<Server className="h-5 w-5" />}
                variant="bk"
                loading={loading}
              />
            </div>

            {/* Row 3: US Map - Increased Height */}
            <div className="bg-gray-800 rounded-xl border-2 border-emerald-600 shadow-lg overflow-hidden flex-1">
              <div className="px-3 py-2 border-b border-emerald-600">
                <h3 className="text-base font-bold text-emerald-400">Kiosk Status Map (Online/Offline)</h3>
              </div>
              <div className="p-3 h-[calc(100%-48px)]">
                <KioskLocationMap data={kioskLocations.BKUS} />
              </div>
            </div>
          </div>

          {/* PLK-US Column */}
          <div className="flex flex-col space-y-3 h-full">
            {/* PLK-US Header with Logo and Background */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden shadow-lg bg-white flex items-center justify-center p-1">
                  <Image src="/nr-tv-dashboard/plk-us.png" alt="Popeyes" width={56} height={56} className="object-contain" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">PLK-US Executive View</h2>
                  <p className="text-xs text-orange-50">Popeyes United States</p>
                </div>
              </div>
            </div>

            {/* Row 2: Stats */}
            <div className="grid grid-cols-3 gap-3 items-stretch">
              <StatCard
                title="Total Store (Kiosk)"
                value={`${stats.PLKUS.totalStores} (${Math.max(0, stats.PLKUS.onlineKiosks + stats.PLKUS.offlineKiosks - disconnectedKiosks.PLKUS)})`}
                icon={<Store className="h-5 w-5" />}
                variant="plk"
                loading={loading}
              />
              <StatCard
                title="Online Kiosks"
                value={`${calculatePercentage(stats.PLKUS.onlineKiosks, Math.max(1, stats.PLKUS.onlineKiosks + stats.PLKUS.offlineKiosks))}%`}
                subtitle={`${stats.PLKUS.onlineKiosks}`}
                icon={<Activity className="h-5 w-5" />}
                variant="plk"
                loading={loading}
              />
              <StatCard
                title="Offline Kiosks"
                value={`${stats.PLKUS.offlineKiosks}`}
                icon={<Server className="h-5 w-5" />}
                variant="plk"
                loading={loading}
              />
            </div>

            {/* Row 3: US Map - Increased Height */}
            <div className="bg-gray-800 rounded-xl border-2 border-orange-600 shadow-lg overflow-hidden flex-1">
              <div className="px-3 py-2 border-b border-orange-600">
                <h3 className="text-base font-bold text-orange-400">Kiosk Status Map (Online/Offline)</h3>
              </div>
              <div className="p-3 h-[calc(100%-48px)]">
                <KioskLocationMap data={kioskLocations.PLKUS} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
