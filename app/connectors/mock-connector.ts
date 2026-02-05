import { DataConnector, QueryResult } from './types';

/**
 * Mock data connector for development and testing
 * Returns dummy data without requiring actual API connections
 */
export class MockDataConnector implements DataConnector {
  name = 'Mock Data Source';

  /**
   * Simulates API call with mock data
   */
  async fetchData<T>(query: string, params?: Record<string, any>): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return mock data based on query type
    return this.getMockData(query) as T;
  }

  /**
   * Always returns true for mock connector
   */
  async isConnected(): Promise<boolean> {
    return true;
  }

  /**
   * Generate mock data based on query type
   */
  private getMockData(query: string): any {
    const queryLower = query.toLowerCase();

    // Mock time series data for line charts
    if (queryLower.includes('timeseries') || queryLower.includes('trend')) {
      return this.generateTimeSeriesData();
    }

    // Mock categorical data for bar charts
    if (queryLower.includes('category') || queryLower.includes('distribution')) {
      return this.generateCategoryData();
    }

    // Mock state data for US map
    if (queryLower.includes('state') || queryLower.includes('map')) {
      return this.generateStateData();
    }

    // Default mock data
    return {
      labels: ['Item 1', 'Item 2', 'Item 3'],
      values: [100, 200, 150],
    };
  }

  /**
   * Generate mock time series data
   */
  private generateTimeSeriesData() {
    const data = [];
    const now = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.floor(Math.random() * 100) + 50,
        value2: Math.floor(Math.random() * 80) + 30,
      });
    }
    
    return data;
  }

  /**
   * Generate mock category data
   */
  private generateCategoryData() {
    return [
      { category: 'Type A', value: 120 },
      { category: 'Type B', value: 95 },
      { category: 'Type C', value: 150 },
      { category: 'Type D', value: 80 },
      { category: 'Type E', value: 110 },
    ];
  }

  /**
   * Generate mock state alert data
   */
  private generateStateData() {
    const states = [
      { state: 'California', stateCode: 'CA' },
      { state: 'Texas', stateCode: 'TX' },
      { state: 'Florida', stateCode: 'FL' },
      { state: 'New York', stateCode: 'NY' },
      { state: 'Pennsylvania', stateCode: 'PA' },
      { state: 'Illinois', stateCode: 'IL' },
      { state: 'Ohio', stateCode: 'OH' },
      { state: 'Georgia', stateCode: 'GA' },
      { state: 'North Carolina', stateCode: 'NC' },
      { state: 'Michigan', stateCode: 'MI' },
      { state: 'New Jersey', stateCode: 'NJ' },
      { state: 'Virginia', stateCode: 'VA' },
      { state: 'Washington', stateCode: 'WA' },
      { state: 'Arizona', stateCode: 'AZ' },
      { state: 'Massachusetts', stateCode: 'MA' },
      { state: 'Tennessee', stateCode: 'TN' },
      { state: 'Indiana', stateCode: 'IN' },
      { state: 'Missouri', stateCode: 'MO' },
      { state: 'Maryland', stateCode: 'MD' },
      { state: 'Wisconsin', stateCode: 'WI' },
      { state: 'Colorado', stateCode: 'CO' },
      { state: 'Minnesota', stateCode: 'MN' },
      { state: 'South Carolina', stateCode: 'SC' },
      { state: 'Alabama', stateCode: 'AL' },
      { state: 'Louisiana', stateCode: 'LA' },
      { state: 'Kentucky', stateCode: 'KY' },
      { state: 'Oregon', stateCode: 'OR' },
      { state: 'Oklahoma', stateCode: 'OK' },
      { state: 'Connecticut', stateCode: 'CT' },
      { state: 'Iowa', stateCode: 'IA' },
      { state: 'Mississippi', stateCode: 'MS' },
      { state: 'Arkansas', stateCode: 'AR' },
      { state: 'Kansas', stateCode: 'KS' },
      { state: 'Utah', stateCode: 'UT' },
      { state: 'Nevada', stateCode: 'NV' },
      { state: 'New Mexico', stateCode: 'NM' },
      { state: 'West Virginia', stateCode: 'WV' },
      { state: 'Nebraska', stateCode: 'NE' },
      { state: 'Idaho', stateCode: 'ID' },
      { state: 'Hawaii', stateCode: 'HI' },
      { state: 'New Hampshire', stateCode: 'NH' },
      { state: 'Maine', stateCode: 'ME' },
      { state: 'Rhode Island', stateCode: 'RI' },
      { state: 'Montana', stateCode: 'MT' },
      { state: 'Delaware', stateCode: 'DE' },
      { state: 'South Dakota', stateCode: 'SD' },
      { state: 'North Dakota', stateCode: 'ND' },
      { state: 'Alaska', stateCode: 'AK' },
      { state: 'Vermont', stateCode: 'VT' },
      { state: 'Wyoming', stateCode: 'WY' },
    ];

    return states.map(s => ({
      ...s,
      count: Math.floor(Math.random() * 100) + 10,
    }));
  }
}
