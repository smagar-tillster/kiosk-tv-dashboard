import { NewRelicConnector } from '@/app/connectors/newrelic-connector';
import { NEWRELIC_QUERIES, buildNerdGraphQuery } from '@/app/queries/newrelic-queries';

/**
 * Data Service for Dashboard Metrics
 * Fetches and transforms data from NewRelic into dashboard-ready format
 */

export interface DashboardStats {
  totalStores: number;
  totalKiosks: number;
  onlineStores: number;
  offlineStores: number;
  onlineKiosks: number;
  offlineKiosks: number;
}

export interface ChartData {
  orderFailureTrend: any[];
  typeOfIssues: any[];
  orderFailureTypes: any[];
  alertHeatmap: any[];
}

export class DashboardDataService {
  private connector: NewRelicConnector;
  private accountId: string;
  private tenant: 'BKUS' | 'PLKUS';

  constructor(accountId: string, apiKey: string, tenant: 'BKUS' | 'PLKUS') {
    this.connector = new NewRelicConnector(apiKey, accountId, tenant);
    this.accountId = accountId;
    this.tenant = tenant;
  }

  /**
   * Fetch total stores and kiosks count
   */
  async fetchTotalCounts(tenant: 'BKUS' | 'PLKUS'): Promise<{
    stores: number;
    kiosks: number;
  }> {
    try {
      const queries = NEWRELIC_QUERIES[tenant];
      
      // Fetch both counts in parallel
      const [storesResponse, kiosksResponse] = await Promise.all([
        this.executeQuery(queries.totalStores),
        this.executeQuery(queries.totalKiosks),
      ]);

      console.log('[DEBUG] kiosksResponse:', JSON.stringify(kiosksResponse));
      const stores = storesResponse[0]?.["uniqueCount.storeName"] || 0;
      const kiosks = kiosksResponse[0]?.["uniqueCount.concat(storeName, kioskName)"] || 0;

      return { stores, kiosks };
    } catch (error) {
      console.error(`Error fetching ${tenant} total counts:`, error);
      throw error;
    }
  }

  /**
   * Fetch store and kiosk online/offline status
   */
  async fetchStatus(tenant: 'BKUS' | 'PLKUS'): Promise<{
    onlineStores: number;
    offlineStores: number;
    onlineKiosks: number;
    offlineKiosks: number;
  }> {
    try {
      const queries = NEWRELIC_QUERIES[tenant];
      
      // Fetch both statuses in parallel
      const [storeStatusResponse, kioskStatusResponse] = await Promise.all([
        this.executeQuery(queries.storeStatus),
        this.executeQuery(queries.kioskStatus),
      ]);

      const storeStatus = storeStatusResponse[0] || {};
      const kioskStatus = kioskStatusResponse[0] || {};

      const result = {
        onlineStores: storeStatus.onlineStores || 0,
        offlineStores: storeStatus.offlineStores || 0,
        onlineKiosks: kioskStatus.onlineKiosks || 0,
        offlineKiosks: kioskStatus.offlineKiosks || 0,
      };

      return result;
    } catch (error) {
      console.error(`Error fetching ${tenant} status:`, error);
      throw error;
    }
  }

  /**
   * Fetch all dashboard data for a tenant
   */
  async fetchDashboardData(tenant: 'BKUS' | 'PLKUS'): Promise<DashboardStats> {
    try {
      const [counts, status] = await Promise.all([
        this.fetchTotalCounts(tenant),
        this.fetchStatus(tenant),
      ]);

      const stats: DashboardStats = {
        totalStores: counts.stores,
        totalKiosks: counts.kiosks,
        onlineStores: status.onlineStores,
        offlineStores: status.offlineStores,
        onlineKiosks: status.onlineKiosks,
        offlineKiosks: status.offlineKiosks,
      };

      return stats;
    } catch (error) {
      console.error(`❌ Error fetching ${tenant} dashboard data:`, error);
      throw error;
    }
  }

  /**
   * Fetch chart data for a tenant
   */
  async fetchChartData(tenant: 'BKUS' | 'PLKUS'): Promise<ChartData> {
    try {
      const queries = NEWRELIC_QUERIES[tenant];

      const [orderFailureTrend, typeOfIssues, orderFailureTypes, alertHeatmap] = await Promise.all([
        this.executeQuery(queries.orderFailureTrend),
        this.executeQuery(queries.typeOfIssues),
        this.executeQuery(queries.orderFailureTypes),
        this.executeQuery(queries.alertHeatmap),
      ]);

      const chartData: ChartData = {
        orderFailureTrend,
        typeOfIssues,
        orderFailureTypes,
        alertHeatmap,
      };

      return chartData;
    } catch (error) {
      console.error(`❌ Error fetching ${tenant} chart data:`, error);
      return {
        orderFailureTrend: [],
        typeOfIssues: [],
        orderFailureTypes: [],
        alertHeatmap: [],
      };
    }
  }

  /**
   * Fetch individual kiosk locations with online/offline status
   */
  async fetchKioskLocations(tenant: 'BKUS' | 'PLKUS'): Promise<any[]> {
    try {
      const queries = NEWRELIC_QUERIES[tenant];
      const kioskLocations = await this.executeQuery(queries.kioskLocations);
      return kioskLocations;
    } catch (error) {
      console.error(`❌ Error fetching ${tenant} kiosk locations:`, error);
      return [];
    }
  }

  /**
   * Execute a NRQL query and return results
   */
  private async executeQuery(nrqlQuery: string): Promise<any[]> {
    const graphqlQuery = buildNerdGraphQuery(this.accountId, nrqlQuery);
    const response = await this.connector.fetchData<any>(graphqlQuery);
    return response?.actor?.account?.nrql?.results || [];
  }
}
