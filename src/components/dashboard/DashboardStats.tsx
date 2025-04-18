"use client";

import React from 'react';
import { Progress } from "@/components/ui/progress";

const stats = [
  {
    id: 1,
    label: "Declarações Processadas",
    value: 85,
    total: 100,
    description: "85% das declarações foram processadas este mês"
  },
  {
    id: 2,
    label: "Obrigações Cumpridas",
    value: 92,
    total: 100,
    description: "92% das obrigações foram cumpridas no prazo"
  },
  {
    id: 3,
    label: "TCs em Andamento",
    value: 45,
    total: 100,
    description: "45% dos TCs estão em processamento"
  }
];

export function DashboardStats() {
  return (
    <div className="space-y-8">
      {stats.map((stat) => (
        <div key={stat.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">{stat.label}</h4>
            <span className="text-sm text-muted-foreground">
              {stat.value}/{stat.total}
            </span>
          </div>
          <Progress value={stat.value} />
          <p className="text-xs text-muted-foreground">
            {stat.description}
          </p>
        </div>
      ))}
    </div>
  );
} 