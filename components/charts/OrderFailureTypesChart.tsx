'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OrderFailureTypesChartProps {
  data: any[];
  color: string;
}

export function OrderFailureTypesChart({ data, color }: OrderFailureTypesChartProps) {
  // Transform NewRelic facet cases data
  const chartData = data
    .filter((item: any) => item.facet && item.facet !== 'Other')
    .map((item: any) => ({
      type: item.facet?.substring(0, 20) || 'Unknown',
      count: item['count(*)'] || item.count || 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis type="number" tick={{ fontSize: 12, fontWeight: 'bold' }} />
        <YAxis dataKey="type" type="category" width={180} tick={{ fontSize: 10, fontWeight: 'bold' }} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
          labelStyle={{ color: '#333', fontWeight: 'bold' }}
        />
        <Bar 
          dataKey="count" 
          fill={color} 
          label={{ 
            position: 'right', 
            fontSize: 11,
            fill: '#333',
            fontWeight: 'bold'
          }} 
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
