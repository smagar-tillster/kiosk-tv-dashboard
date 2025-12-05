'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OrderFailureTrendChartProps {
  data: any[];
  color: string;
}

export function OrderFailureTrendChart({ data, color }: OrderFailureTrendChartProps) {
  // Transform NewRelic timeseries data
  const chartData = data.map((item: any) => ({
    date: new Date(item.beginTimeSeconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: item['count(*)'] || item.count || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 11, fontWeight: 'bold' }} 
          angle={-45} 
          textAnchor="end" 
          height={60}
        />
        <YAxis tick={{ fontSize: 12, fontWeight: 'bold' }} width={50} />
        <Tooltip contentStyle={{ fontWeight: 'bold' }} />
        <Line 
          type="monotone" 
          dataKey="count" 
          stroke={color} 
          strokeWidth={2} 
          dot={{ r: 3 }} 
          label={{ position: 'top', fontSize: 11, fill: '#000', fontWeight: 'bold' }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
