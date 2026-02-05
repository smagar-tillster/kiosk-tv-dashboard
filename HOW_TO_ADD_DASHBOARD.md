# How to Add a New Dashboard

This guide shows you how to manually create a new dashboard page with a single bar chart.

## Step-by-Step Instructions

### Step 1: Create the Dashboard Folder
Create a new folder inside `app/pages/` with your dashboard name:

```bash
# Example: Creating an "analytics" dashboard
app/pages/analytics/
```

### Step 2: Create page.tsx
Inside your new folder, create a file named `page.tsx`:

**File:** `app/pages/analytics/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { ConfigurableBarChart } from '@/app/components';
import { DashboardDataService } from '@/app/services/dashboard-data-service';
import { TENANT_CONFIG } from '@/app/config/tenant-config';
import { RefreshCw } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [chartData, setChartData] = useState<unknown[]>([]);

  const fetchData = async () => {
    setRefreshing(true);
    
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
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-white border-b">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#f97316' }}>
            Analytics Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Custom analytics view for BK-US
          </p>
        </div>
        
        <button
          onClick={fetchData}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Chart Container */}
      <div className="flex-1 p-6">
        <div className="h-full bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
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
```

### Step 3: Access Your Dashboard
Your new dashboard is now available at:
```
http://localhost:3000/pages/analytics
```

### Step 4: Add Link to Landing Page (Optional)
Edit `app/page.tsx` to add a card for your new dashboard:

```typescript
{/* Add this card alongside existing ones */}
<Link href="/pages/analytics">
  <div className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-green-500">
    <div className="flex items-center gap-4 mb-4">
      <div className="p-4 bg-green-100 rounded-xl group-hover:bg-green-500 transition-colors">
        <BarChart3 className="h-8 w-8 text-green-600 group-hover:text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Analytics</h2>
    </div>
    <p className="text-gray-600">
      Custom analytics dashboard with bar charts
    </p>
  </div>
</Link>
```

---

## Available Chart Components

### 1. **ConfigurableBarChart**
```typescript
import { ConfigurableBarChart } from '@/app/components';

<ConfigurableBarChart
  config={{
    title: 'Chart Title',
    colors: { primary: '#22c55e' },
    orientation: 'vertical', // or 'horizontal'
  }}
  data={chartData}
/>
```

### 2. **ConfigurableLineChart**
```typescript
import { ConfigurableLineChart } from '@/app/components';

<ConfigurableLineChart
  config={{
    title: 'Chart Title',
    colors: { primary: '#3b82f6' },
  }}
  data={chartData}
/>
```

### 3. **AlertHeatmap** (US Map)
```typescript
import { AlertHeatmap } from '@/app/components';

<AlertHeatmap data={heatmapData} />
```

### 4. **ConfigurableMapChart** (Alternative Map)
```typescript
import { ConfigurableMapChart } from '@/app/components';

<ConfigurableMapChart
  data={mapData}
  config={{
    style: { height: '100%', width: '100%' },
  }}
/>
```

---

## Available Data Queries

The `DashboardDataService` provides access to these queries:

```typescript
const service = new DashboardDataService(
  TENANT_CONFIG.BKUS.accountId,
  TENANT_CONFIG.BKUS.apiKey,
  'BKUS'
);

// Get stats
const stats = await service.fetchDashboardData('BKUS');
// Returns: { totalStores, totalKiosks, onlineStores, offlineStores, onlineKiosks, offlineKiosks }

// Get chart data
const charts = await service.fetchChartData('BKUS');
// Returns: { orderFailureTrend, typeOfIssues, orderFailureTypes, alertHeatmap }
```

---

## Chart Data Options

Use any of these from `fetchChartData()`:

1. **orderFailureTrend** - Line chart showing order failures over time
2. **typeOfIssues** - Bar chart of issue types
3. **orderFailureTypes** - Bar chart of failure categories
4. **alertHeatmap** - Geographic alert distribution

---

## Customization Tips

### Change Colors
```typescript
config={{
  colors: { 
    primary: '#22c55e',  // Green
    // primary: '#3b82f6',  // Blue
    // primary: '#f97316',  // Orange
    // primary: '#ef4444',  // Red
  }
}}
```

### Bar Chart Orientation
```typescript
orientation: 'vertical'   // Bars go up
orientation: 'horizontal' // Bars go sideways
```

### Add Multiple Charts
Just add more chart containers:

```typescript
<div className="grid grid-cols-2 gap-6">
  <div className="bg-white rounded-lg shadow p-6">
    <ConfigurableBarChart config={...} data={data1} />
  </div>
  <div className="bg-white rounded-lg shadow p-6">
    <ConfigurableLineChart config={...} data={data2} />
  </div>
</div>
```

---

## Summary

1. Create folder: `app/pages/your-dashboard-name/`
2. Create file: `app/pages/your-dashboard-name/page.tsx`
3. Copy the template code above
4. Customize the chart type, data source, and colors
5. Access at: `/pages/your-dashboard-name`

That's it! Your new dashboard is ready! 🎉
