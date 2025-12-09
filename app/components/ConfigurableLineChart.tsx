'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LineChartConfig, DEFAULT_LINE_CHART_CONFIG } from '@/app/config';
import { LineChartData, LineChartDataPoint } from '@/app/dtos/charts';

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
  const xAxisConfig = chartConfig.xAxis || DEFAULT_LINE_CHART_CONFIG.xAxis || {};
  const yAxisConfig = chartConfig.yAxis || DEFAULT_LINE_CHART_CONFIG.yAxis || {};

  return (
    <ResponsiveContainer 
      width={chartConfig.style?.width as any || '100%'} 
      height={chartConfig.style?.height as any || '100%'}
    >
      <LineChart 
        data={chartData} 
        margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
      >
        {xAxisConfig.showGrid !== false && (
          <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.colors?.grid || '#f0f0f0'} />
        )}
        <XAxis 
          dataKey={xAxisConfig.dataKey || 'date'}
          tick={{ 
            fontSize: xAxisConfig.fontSize || 14, 
            fontWeight: xAxisConfig.fontWeight || 'bold',
            fill: xAxisConfig.color,
          }} 
          angle={xAxisConfig.angle || -45} 
          textAnchor="end" 
          height={60}
          label={xAxisConfig.label ? { value: xAxisConfig.label, position: 'insideBottom' } : undefined}
        />
        <YAxis 
          dataKey={yAxisConfig.dataKey}
          tick={{ 
            fontSize: yAxisConfig.fontSize || 14, 
            fontWeight: yAxisConfig.fontWeight || 'bold',
            fill: yAxisConfig.color,
          }} 
          width={yAxisConfig.width || 50}
          label={yAxisConfig.label ? { value: yAxisConfig.label, angle: -90, position: 'insideLeft' } : undefined}
        />
        {chartConfig.showTooltip !== false && (
          <Tooltip contentStyle={{ fontWeight: 'bold' }} />
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
            fill: '#000', 
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
  return rawData.map((item: Record<string, any>) => {
    const timestamp = item.beginTimeSeconds * 1000;
    const date = new Date(timestamp);
    const normalizedDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    return {
      date: normalizedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
      timestamp: normalizedDate.getTime(),
      value: item['count(*)'] || item.count || 0,
      count: item['count(*)'] || item.count || 0,
    };
  }).sort((a, b) => a.timestamp - b.timestamp);
}
