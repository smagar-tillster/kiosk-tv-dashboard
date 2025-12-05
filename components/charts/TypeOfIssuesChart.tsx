'use client';

import ReactECharts from 'echarts-for-react';

interface TypeOfIssuesChartProps {
  data: any[];
  color: string;
}

export function TypeOfIssuesChart({ data, color }: TypeOfIssuesChartProps) {
  // Transform NewRelic facet data to bar chart format
  const chartData = data
    .map((item: any) => ({
      name: item.facet || item.alert_category_name || 'Unknown',
      value: item['count(*)'] || item.count || 0,
    }))
    .sort((a, b) => a.value - b.value); // Sort ascending (smallest to largest)

  const categories = chartData.map(item => item.name);
  const values = chartData.map(item => item.value);

  // Use green/orange theme based on color prop
  const barColor = color === '#22c55e' ? '#22c55e' : '#f97316'; // Green for BK-US, Orange for PLK-US

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: '{b}: {c}'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 10,
        fontWeight: 'bold'
      }
    },
    yAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        fontSize: 11,
        interval: 0,
        fontWeight: 'bold'
      }
    },
    series: [
      {
        type: 'bar',
        data: values,
        itemStyle: {
          color: barColor,
          borderRadius: [0, 4, 4, 0]
        },
        label: {
          show: true,
          position: 'right',
          fontSize: 10,
          color: '#333',
          fontWeight: 'bold',
          formatter: '{c}',
          backgroundColor: 'transparent',
          borderWidth: 0,
          padding: 0
        },
        emphasis: {
          itemStyle: {
            color: barColor,
            opacity: 0.8
          }
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />;
}
