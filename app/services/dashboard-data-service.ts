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
  orderFailureByPOS?: any[];
  orderFailureTypesToday?: any[];
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

      console.log('[DEBUG] fetchStatus response - storeStatus:', storeStatus);
      console.log('[DEBUG] fetchStatus response - kioskStatus:', kioskStatus);

      const result = {
        onlineStores: storeStatus.onlineStores || 0,
        offlineStores: storeStatus.offlineStores || 0,
        onlineKiosks: kioskStatus.onlineKiosks || 0,
        offlineKiosks: kioskStatus.offlineKiosks || 0,
      };

      console.log('[DEBUG] fetchStatus result:', result);

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

      // Fetch all queries including additional charts for both tenants
      const results = await Promise.all([
        this.executeQuery(queries.orderFailureTrend),
        this.executeQuery(queries.typeOfIssues),
        this.executeQuery(queries.orderFailureTypes),
        this.executeQuery(queries.alertHeatmap),
        this.executeQuery(queries.orderFailureByPOS),
        this.executeQuery(queries.orderFailureTypesToday),
      ]);
      
      const chartData: ChartData = {
        orderFailureTrend: results[0],
        typeOfIssues: results[1],
        orderFailureTypes: results[2],
        alertHeatmap: results[3],
        orderFailureByPOS: results[4],
        orderFailureTypesToday: results[5],
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
      
      const onlineCount = kioskLocations.filter((k: any) => k.status === 'ONLINE' || k['latest.status'] === 'ONLINE').length;
      const offlineCount = kioskLocations.filter((k: any) => k.status === 'OFFLINE' || k['latest.status'] === 'OFFLINE').length;
      
      console.log('[DEBUG] fetchKioskLocations total count:', kioskLocations.length);
      console.log('[DEBUG] fetchKioskLocations online:', onlineCount);
      console.log('[DEBUG] fetchKioskLocations offline:', offlineCount);
      
      return kioskLocations;
    } catch (error) {
      console.error(`❌ Error fetching ${tenant} kiosk locations:`, error);
      return [];
    }
  }

  /**
   * Fetch disconnected kiosks count (difference between current and 1 week ago)
   * Returns 0 if the difference is negative
   */
  async fetchDisconnectedKiosks(tenant: 'BKUS' | 'PLKUS'): Promise<number> {
    try {
      const queries = NEWRELIC_QUERIES[tenant];
      if (!queries.disconnectedKiosks) {
        return 0;
      }
      
      const response = await this.executeQuery(queries.disconnectedKiosks);
      console.log('[DEBUG] disconnectedKiosks full response:', JSON.stringify(response, null, 2));
      
      if (response && response.length >= 2) {
        // COMPARE WITH returns 2 result objects: [0] = current period, [1] = comparison period
        const currentData = response[0];
        const previousData = response[1];
        
        console.log('[DEBUG] disconnectedKiosks current data:', currentData);
        console.log('[DEBUG] disconnectedKiosks previous data:', previousData);
        
        const current = currentData?.['uniqueCount.fullHostname'] || currentData?.result || 0;
        const previous = previousData?.['uniqueCount.fullHostname'] || previousData?.result || 0;
        
        console.log('[DEBUG] disconnectedKiosks - previous:', previous, 'current:', current);
        
        const difference = previous - current;
        
        // Return 0 if negative (more kiosks now than before)
        const disconnected = difference > 0 ? difference : 0;
        console.log('[DEBUG] disconnectedKiosks - difference:', difference, 'returning:', disconnected);
        
        return disconnected;
      }
      
      return 0;
    } catch (error) {
      console.error(`❌ Error fetching ${tenant} disconnected kiosks:`, error);
      return 0;
    }
  }

  /**
   * Fetch last failed order information (timestamp and store name)
   */
  async fetchLastFailedOrder(tenant: 'BKUS' | 'PLKUS'): Promise<{
    timestamp: number | null;
    storeName: string | null;
  }> {
    try {
      const queries = NEWRELIC_QUERIES[tenant];
      if (!queries.lastFailedOrder) {
        return { timestamp: null, storeName: null };
      }
      
      const response = await this.executeQuery(queries.lastFailedOrder);
      console.log('[DEBUG] lastFailedOrder response:', response);
      
      if (response && response.length > 0) {
        const data = response[0];
        return {
          timestamp: data['latest.timestamp'] || data['latest(timestamp)'] || null,
          storeName: data['latest.storeName'] || data['latest(storeName)'] || null,
        };
      }
      
      return { timestamp: null, storeName: null };
    } catch (error) {
      console.error(`❌ Error fetching ${tenant} last failed order:`, error);
      return { timestamp: null, storeName: null };
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
