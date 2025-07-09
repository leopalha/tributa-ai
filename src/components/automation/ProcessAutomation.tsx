import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Play, Pause, Settings } from 'lucide-react';

export default function ProcessAutomation() {
  const processes = [
    {
      id: 1,
      name: 'Verificação Automática de Débitos',
      status: 'active',
      description: 'Monitora novos débitos tributários automaticamente',
      lastRun: '2 horas atrás',
    },
    {
      id: 2,
      name: 'Geração de Relatórios Mensais',
      status: 'pending',
      description: 'Gera relatórios consolidados mensalmente',
      lastRun: '1 dia atrás',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Automação de Processos
        </CardTitle>
        <CardDescription>Gerencie e monitore processos automatizados</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {processes.map(process => (
          <div key={process.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <h3 className="font-medium">{process.name}</h3>
              <p className="text-sm text-gray-600">{process.description}</p>
              <p className="text-xs text-gray-500">Última execução: {process.lastRun}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={process.status === 'active' ? 'default' : 'secondary'}>
                {process.status}
              </Badge>
              <Button size="sm" variant="outline">
                {process.status === 'active' ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
