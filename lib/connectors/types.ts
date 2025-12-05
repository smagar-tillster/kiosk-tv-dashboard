/**
 * Base connector interface that all data source connectors must implement
 */
export interface DataConnector {
  name: string;
  fetchData: <T>(query: string, params?: Record<string, any>) => Promise<T>;
  isConnected: () => Promise<boolean>;
}

/**
 * Query result interface
 */
export interface QueryResult<T = any> {
  data: T;
  timestamp: Date;
  source: string;
}
