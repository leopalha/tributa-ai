"use client";

import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

const activities = [
  {
    id: 1,
    description: "Nova declaração enviada para Empresa ABC",
    timestamp: "Há 5 minutos",
    type: "declaracao"
  },
  {
    id: 2,
    description: "Obrigação atualizada para Empresa XYZ",
    timestamp: "Há 15 minutos",
    type: "obrigacao"
  },
  {
    id: 3,
    description: "TC emitido para Empresa 123",
    timestamp: "Há 30 minutos",
    type: "tc"
  },
  {
    id: 4,
    description: "Nova empresa cadastrada: Tech Solutions",
    timestamp: "Há 1 hora",
    type: "empresa"
  },
  {
    id: 5,
    description: "Declaração aprovada para Empresa DEF",
    timestamp: "Há 2 horas",
    type: "declaracao"
  }
];

export function RecentActivity() {
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-4 rounded-lg border p-3"
          >
            <div className="flex-1">
              <p className="text-sm font-medium leading-none">
                {activity.description}
              </p>
              <p className="text-sm text-muted-foreground">
                {activity.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
} 