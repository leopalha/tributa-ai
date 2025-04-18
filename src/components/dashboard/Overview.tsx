"use client";

import React from 'react';
import { Bar } from '@/components/ui/bar';

const data = [
  {
    name: "Jan",
    declaracoes: 12,
    obrigacoes: 8,
  },
  {
    name: "Fev",
    declaracoes: 15,
    obrigacoes: 10,
  },
  {
    name: "Mar",
    declaracoes: 18,
    obrigacoes: 12,
  },
  {
    name: "Abr",
    declaracoes: 14,
    obrigacoes: 9,
  },
  {
    name: "Mai",
    declaracoes: 20,
    obrigacoes: 15,
  },
  {
    name: "Jun",
    declaracoes: 22,
    obrigacoes: 18,
  },
];

export function Overview() {
  return (
    <div className="h-[350px]">
      <Bar
        data={data}
        categories={["declaracoes", "obrigacoes"]}
        index="name"
        colors={["blue", "green"]}
        valueFormatter={(value: number) => `${value} itens`}
        yAxisWidth={40}
      />
    </div>
  );
} 