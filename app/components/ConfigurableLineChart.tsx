'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LineChartConfig, DEFAULT_LINE_CHART_CONFIG, ChartAxisConfig } from '@/app/config';
import { LineChartData, LineChartDataPoint } from '@/app/dtos';

interface ConfigurableLineChartProps {
  data: LineChartData | unknown[]; // Support both DTO and raw data
  config: Partial<LineChartConfig>;
}

export function ConfigurableLineChart({ data, config }: ConfigurableLineChartProps) {
  // Merge with default config
  const chartConfig = { ...DEFAULT_LINE_CHART_CONFIG, ...config };
  
  // Transform data to DTO format if raw NewRelic data
  const chartData = Array.isArray(data) 
    ? transformNewRelicData(data)
    : data.data;

  const color = chartConfig.colors?.primary || '#3b82f6';
  const xAxisConfig = (chartConfig.xAxis || DEFAULT_LINE_CHART_CONFIG.xAxis || {}) as ChartAxisConfig;
  const yAxisConfig = (chartConfig.yAxis || DEFAULT_LINE_CHART_CONFIG.yAxis || {}) as ChartAxisConfig;

  return (
    <ResponsiveContainer
      width={chartConfig.width as any || '100%'} 
      height={chartConfig.height as any || '100%'}
    >
      <LineChart 
        data={chartData} 
        margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
      >
        <XAxis 
          dataKey={xAxisConfig.dataKey || 'date'}
          tick={{ 
            fontSize: xAxisConfig.fontSize || 14, 
            fontWeight: xAxisConfig.fontWeight || 'bold',
            fill: xAxisConfig.color || '#9ca3af',
          }} 
          angle={xAxisConfig.angle || -45} 
          textAnchor="end" 
          height={60}
          label={xAxisConfig.label ? { value: xAxisConfig.label, position: 'insideBottom', fill: '#9ca3af' } : undefined}
        />
        <YAxis 
          dataKey={yAxisConfig.dataKey}
          tick={{ 
            fontSize: yAxisConfig.fontSize || 14, 
            fontWeight: yAxisConfig.fontWeight || 'bold',
            fill: yAxisConfig.color || '#9ca3af',
          }} 
          width={yAxisConfig.width || 50}
          label={yAxisConfig.label ? { value: yAxisConfig.label, angle: -90, position: 'insideLeft', fill: '#9ca3af' } : undefined}
        />
        {chartConfig.showTooltip !== false && (
          <Tooltip contentStyle={{ fontWeight: 'bold', backgroundColor: '#1f2937', border: '1px solid #374151', color: '#e5e7eb' }} />
        )}
        <Line 
          type={chartConfig.smooth ? 'monotone' : 'linear'}
          dataKey="count" 
          stroke={color} 
          strokeWidth={chartConfig.lineWidth || 2} 
          dot={chartConfig.showDots !== false ? { r: chartConfig.dotRadius || 3 } : false}
          label={chartConfig.showLabels !== false ? { 
            position: 'top', 
            fontSize: 11, 
            fill: '#d1d5db', 
            fontWeight: 'bold' 
          } : undefined}
          animationDuration={chartConfig.animationDuration}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Helper function to transform NewRelic data to DTO format
function transformNewRelicData(rawData: unknown[]): LineChartDataPoint[] {
  return rawData.map((item, index) => {
    const record = item as Record<string, any>;
    
    let dateStr = '';
    let timestamp = 0;
    
    // NewRelic returns 'Date of timestamp' (with spaces and capital D)
    const dateValue = record['Date of timestamp'];
    
    if (dateValue !== undefined && dateValue !== null) {
      try {
        // Parse the date value (should be ISO string or similar)
        const dateObj = new Date(dateValue);
        const time = dateObj.getTime();
        
        // Check if date is valid
        if (!isNaN(time)) {
          timestamp = time;
          // Format as MMM-DD (e.g., "Dec-14")
          const month = dateObj.toLocaleString('en-US', { month: 'short' });
          const day = String(dateObj.getUTCDate()).padStart(2, '0');
          dateStr = `${month}-${day}`;
        } else {
          dateStr = `Day ${index + 1}`;
          timestamp = index;
        }
      } catch (e) {
        dateStr = `Day ${index + 1}`;
        timestamp = index;
      }
    } else {
      dateStr = `Day ${index + 1}`;
      timestamp = index;
    }

    return {
      date: dateStr,
      timestamp: timestamp,
      value: record['count(*)'] || record.count || 0,
      count: record['count(*)'] || record.count || 0,
    };
  }).sort((a, b) => a.timestamp - b.timestamp);
}
