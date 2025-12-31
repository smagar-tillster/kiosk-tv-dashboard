'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChartConfig, DEFAULT_BAR_CHART_CONFIG } from '@/app/config';
import { BarChartData, BarChartDataPoint } from '@/app/dtos';

interface ConfigurableBarChartProps {
  data: BarChartData | unknown[]; // Support both DTO and raw data
  config: Partial<BarChartConfig>;
}

export function ConfigurableBarChart({ data, config }: ConfigurableBarChartProps) {
  // Merge with default config
  const chartConfig = { ...DEFAULT_BAR_CHART_CONFIG, ...config };
  
  // Transform data to DTO format if raw NewRelic data
  const chartData = Array.isArray(data) 
    ? transformNewRelicData(data)
    : data.data;

  const color = chartConfig.colors?.primary || '#3b82f6';
  const isHorizontal = chartConfig.orientation === 'horizontal';
  const xAxisConfig = chartConfig.xAxis || {};
  const yAxisConfig = chartConfig.yAxis || {};

  // Calculate dynamic Y-axis width for horizontal charts based on longest label
  let yAxisWidth = 80;
  if (isHorizontal && chartData && chartData.length > 0) {
    const maxLength = Math.max(
      ...chartData.map(item => String(item.type || '').length)
    );
    // Estimate: ~8 pixels per character + padding
    yAxisWidth = Math.min(Math.max(maxLength * 7 + 20, 100), 200);
  }

  // Reduce left margin for horizontal charts to fit labels better
  const margin = isHorizontal 
    ? { top: 5, right: 50, left: 5, bottom: 5 }
    : { top: 5, right: 30, left: 10, bottom: 5 };

  return (
    <ResponsiveContainer 
      width={chartConfig.width as any || '100%'} 
      height={chartConfig.height as any || '100%'}
    >
      <BarChart 
        data={chartData} 
        layout={isHorizontal ? 'vertical' : 'horizontal'}
        margin={margin}
        barGap={chartConfig.barGap}
        barCategoryGap={chartConfig.barCategoryGap}
      >
        <XAxis 
          type={isHorizontal ? 'number' : 'category'}
          dataKey={isHorizontal ? undefined : (xAxisConfig.dataKey || 'type')}
          tick={{ 
            fontSize: xAxisConfig.fontSize || 14, 
            fontWeight: xAxisConfig.fontWeight || 'bold',
            fill: xAxisConfig.color || '#9ca3af',
          }}
          angle={xAxisConfig.angle}
          label={xAxisConfig.label ? { value: xAxisConfig.label, position: 'insideBottom', fill: '#9ca3af' } : undefined}
        />
        <YAxis 
          type={isHorizontal ? 'category' : 'number'}
          dataKey={isHorizontal ? (yAxisConfig.dataKey || 'type') : undefined}
          tick={{ 
            fontSize: yAxisConfig.fontSize || 10, 
            fontWeight: yAxisConfig.fontWeight || 'bold',
            fill: yAxisConfig.color || '#9ca3af',
          }} 
          width={isHorizontal ? yAxisWidth : (yAxisConfig.width || 50)}
          label={yAxisConfig.label ? { value: yAxisConfig.label, angle: -90, position: 'insideLeft', fill: '#9ca3af' } : undefined}
        />
        {chartConfig.showTooltip !== false && (
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
            labelStyle={{ color: '#e5e7eb', fontWeight: 'bold' }}
          />
        )}
        <Bar 
          dataKey="count" 
          fill={color}
          maxBarSize={chartConfig.barSize}
          label={chartConfig.showLabels !== false ? { 
            position: chartConfig.labelPosition || 'right', 
            fontSize: 14,
            fill: '#d1d5db',
            fontWeight: 'bold'
          } : undefined}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Helper function to transform NewRelic data to DTO format
function transformNewRelicData(rawData: unknown[]): BarChartDataPoint[] {
  return (rawData as Record<string, any>[])
    .filter((item: Record<string, any>) => item.facet)
    .map((item: Record<string, any>) => ({
      type: item.facet || 'Unknown',
      category: item.facet || 'Unknown',
      count: item['count(*)'] || item.count || 0,
      value: item['count(*)'] || item.count || 0,
      label: item.facet,
    }))
    .sort((a, b) => b.count - a.count);
}
