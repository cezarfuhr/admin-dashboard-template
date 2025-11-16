'use client';

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BarChartProps {
  data: Array<{ name: string; value: number; [key: string]: any }>;
  dataKey?: string;
  xAxisKey?: string;
  height?: number;
  color?: string;
}

export function BarChart({ data, dataKey = 'value', xAxisKey = 'name', height = 300, color = '#3b82f6' }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey={xAxisKey} className="text-xs" />
        <YAxis className="text-xs" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
          }}
        />
        <Legend />
        <Bar dataKey={dataKey} fill={color} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
