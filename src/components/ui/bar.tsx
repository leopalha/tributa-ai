"use client";

import React from 'react';
import { Bar as BarChart } from 'recharts';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart as RechartsBarChart } from 'recharts';

interface BarProps {
  data: any[];
  categories: string[];
  index: string;
  colors: string[];
  valueFormatter: (value: number) => string;
  yAxisWidth?: number;
}

export function Bar({
  data,
  categories,
  index,
  colors,
  valueFormatter,
  yAxisWidth = 40,
}: BarProps) {
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
          <BarChart
            key={category}
            dataKey={category}
            fill={colors[i]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
} 