import React from 'react';
import { Bar as BarChart } from 'recharts';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart as RechartsBarChart,
} from 'recharts';
import { cn } from '@/lib/utils';

interface BarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  color?: string; // Tailwind color class (e.g., 'bg-blue-500')
}

export const Bar: React.FC<BarProps> = ({
  value,
  color = 'bg-primary',
  className,
  ...props
}: BarProps) => {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn('h-2 w-full rounded-full bg-muted', className)} {...props}>
      <div className={cn('h-full rounded-full', color)} style={{ width: `${clampedValue}%` }} />
    </div>
  );
};

Bar.displayName = 'Bar';

interface BarChartProps {
  data: any[];
  categories: string[];
  index: string;
  colors: string[];
  valueFormatter: (value: number) => string;
  yAxisWidth?: number;
}

export function BarChartComponent({
  data,
  categories,
  index,
  colors,
  valueFormatter,
  yAxisWidth = 40,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={index} />
        <YAxis width={yAxisWidth} tickFormatter={valueFormatter} />
        <Tooltip
          formatter={valueFormatter}
          labelStyle={{ color: 'black' }}
          contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }}
        />
        <Legend />
        {categories.map((category, i) => (
          <BarChart key={category} dataKey={category} fill={colors[i]} radius={[4, 4, 0, 0]} />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
