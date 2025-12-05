'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, AlertCircle, Server, TrendingUp } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: string;
  variant?: 'default' | 'bk' | 'plk';
  loading?: boolean;
}

/**
 * Small stat card component for displaying key metrics
 */
export function StatCard({ title, value, icon, trend, variant = 'default', loading = false }: StatCardProps) {
  const variantStyles = {
    default: '',
    bk: 'border-l-4 border-l-[#22c55e]',
    plk: 'border-l-4 border-l-[#f97316]',
  };

  return (
    <Card className={`overflow-hidden ${variantStyles[variant]}`}>
      <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2 p-2">
        <CardTitle className="text-xl font-bold text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0 text-center">
        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-10 bg-gray-200 rounded w-24 mx-auto"></div>
          </div>
        ) : (
          <div className="text-4xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );

}
