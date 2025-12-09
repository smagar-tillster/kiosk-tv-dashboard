import { DataConnector, QueryResult } from './types';

/**
 * NewRelic NerdGraph API connector
 * Connects to NewRelic's GraphQL API via proxy to avoid CORS
 * Supports both local dev (/api/newrelic) and production (AWS Lambda)
 */
export class NewRelicConnector implements DataConnector {
  name = 'NewRelic';
  private apiKey: string;
  private accountId: string;
  private endpoint: string;
  private tenant?: string;

  constructor(apiKey: string, accountId: string, tenant?: string) {
    this.apiKey = apiKey;
    this.accountId = accountId;
    this.tenant = tenant;
    
    // Use Lambda endpoint in production, local API in development
    this.endpoint = process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_API_ENDPOINT
      ? process.env.NEXT_PUBLIC_API_ENDPOINT
      : '/api/newrelic';
  }

  /**
   * Execute NerdGraph query via proxy
   */
  async fetchData<T>(query: string, params?: Record<string, any>): Promise<T> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add tenant header for Lambda
      if (this.tenant) {
        headers['X-Tenant'] = this.tenant;
      }
      
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          tenant: this.tenant,
          query,
          variables: { accountId: this.accountId, ...params },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`NewRelic API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(`Proxy error: ${result.error}`);
      }

      if (result.errors) {
        throw new Error(`NerdGraph query error: ${JSON.stringify(result.errors)}`);
      }

      return result.data as T;
    } catch (error) {
      console.error('NewRelic connector error:', error);
      throw error;
    }
  }

  /**
   * Check if connection is valid
   */
  async isConnected(): Promise<boolean> {
    try {
      const query = `
        {
          actor {
            user {
              name
            }
          }
        }
      `;
      
      await this.fetchData(query);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Helper method to build NRQL queries
   */
  buildNRQLQuery(nrql: string, timeRange?: { since?: string; until?: string }) {
    const since = timeRange?.since || '30 minutes ago';
    const until = timeRange?.until || 'now';

    return `
      {
        actor {
          account(id: ${this.accountId}) {
            nrql(query: "${nrql} SINCE ${since} UNTIL ${until}") {
              results
            }
          }
        }
      }
    `;
  }
}
