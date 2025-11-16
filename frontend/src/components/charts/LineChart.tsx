'use client';

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface LineChartProps {
  data: Array<{ name: string; value: number; [key: string]: any }>;
  dataKey?: string;
  xAxisKey?: string;
  height?: number;
  color?: string;
}

export function LineChart({ data, dataKey = 'value', xAxisKey = 'name', height = 300, color = '#3b82f6' }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data}>
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
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
