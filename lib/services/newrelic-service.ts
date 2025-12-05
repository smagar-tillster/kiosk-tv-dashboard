import { NewRelicConnector } from '../connectors/newrelic-connector';
import type { StateMapData } from '@/components/charts';

/**
 * NewRelic Data Service
 * Handles fetching data from NewRelic and transforming it for dashboard consumption
 */
export class NewRelicService {
  private connector: NewRelicConnector;

  constructor(apiKey: string, accountId: string) {
    this.connector = new NewRelicConnector(apiKey, accountId);
  }

  /**
   * Test basic connectivity
   */
  async testConnection(): Promise<boolean> {
    const query = `
      {
        actor {
          user {
            name
            email
          }
        }
      }
    `;

    try {
      const response = await this.connector.fetchData<any>(query);
      return true;
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
  }

  /**
   * Fetch alerts/issues from NewRelic
   */
  async fetchAlerts(policyIds: string[]): Promise<any> {
    const query = `
      {
        actor {
          account(id: $accountId) {
            nrql(query: "SELECT latest(event) as state, latest(incidentIds) FROM NrAiIssue WHERE contains(policyIds, '${policyIds.join(',')}') FACET issueId SINCE 72 hours ago LIMIT MAX") {
              results
            }
          }
        }
      }
    `;

    const response = await this.connector.fetchData<any>(query);
    return response.actor.account.nrql.results;
  }

  /**
   * Fetch kiosk status data with simple query first
   */
  async fetchKioskStatus(tenantCode: string): Promise<{
    online: number;
    offline: number;
    total: number;
    alerts: number;
  }> {
    // Use hardcoded account ID instead of variable for testing
    const query = `
      {
        actor {
          account(id: 4502664) {
            nrql(query: "SELECT filter(count(*), WHERE latestStatus = '1') AS onlineStores, filter(count(*), WHERE latestStatus = '2') AS offlineStores FROM (SELECT latest(ks.KioskStatus) AS latestStatus FROM Log FACET ks.StoreName limit max) since 2 hours ago limit max") {
              results
            }
          }
        }
      }
    `;

    try {
      const response = await this.connector.fetchData<any>(query);
      
      const result = response?.actor?.account?.nrql?.results?.[0] || {};

      const online = result.onlineStores || 0;
      const offline = result.offlineStores || 0;

      return {
        online,
        offline,
        total: online + offline,
        alerts: 0,
      };
    } catch (error) {
      console.error('fetchKioskStatus error:', error);
      throw error;
    }
  }

  /**
   * Fetch time series data for line charts
   */
  async fetchTimeSeries(metric: string, tenantCode: string): Promise<any[]> {
    const query = `
      {
        actor {
          account(id: $accountId) {
            nrql(query: "SELECT average(${metric}) FROM Transaction WHERE tenant = '${tenantCode}' FACET dateOf(timestamp) SINCE 30 days ago TIMESERIES") {
              results
            }
          }
        }
      }
    `;

    const response = await this.connector.fetchData<any>(query);
    const results = response.actor.account.nrql.results || [];

    // Transform to chart format
    return results.map((item: any) => ({
      date: item.facet || item.beginTimeSeconds,
      value: item['average.' + metric] || item.value || 0,
    }));
  }

  /**
   * Fetch category distribution for bar charts
   */
  async fetchCategoryData(tenantCode: string): Promise<any[]> {
    const query = `
      {
        actor {
          account(id: $accountId) {
            nrql(query: "SELECT count(*) FROM Transaction WHERE tenant = '${tenantCode}' FACET transactionType SINCE 24 hours ago LIMIT 10") {
              results
            }
          }
        }
      }
    `;

    const response = await this.connector.fetchData<any>(query);
    const results = response.actor.account.nrql.results || [];

    // Transform to chart format
    return results.map((item: any) => ({
      category: item.facet || 'Unknown',
      value: item.count || 0,
    }));
  }

  /**
   * Fetch state-level data for US map
   */
  async fetchStateData(tenantCode: string): Promise<StateMapData[]> {
    const query = `
      {
        actor {
          account(id: $accountId) {
            nrql(query: "SELECT count(*) as alerts FROM Alert WHERE tenant = '${tenantCode}' AND severity = 'CRITICAL' FACET state SINCE 24 hours ago") {
              results
            }
          }
        }
      }
    `;

    const response = await this.connector.fetchData<any>(query);
    const results = response.actor.account.nrql.results || [];

    // Transform to map format
    return results.map((item: any) => ({
      state: item.facet || 'Unknown',
      value: item.alerts || 0,
    }));
  }

  /**
   * Fetch all dashboard data at once
   */
  async fetchDashboardData(tenantCode: string, policyIds: string[]) {
    try {
      const connected = await this.testConnection();
      if (!connected) {
        throw new Error('NewRelic connection test failed');
      }

      const kioskStatus = await this.fetchKioskStatus(tenantCode);

      return {
        stats: {
          ...kioskStatus,
          alerts: 0,
        },
        charts: {
          timeSeries: [],
          categoryData: [],
          stateData: [],
        },
      };
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      throw error;
    }
  }
}
