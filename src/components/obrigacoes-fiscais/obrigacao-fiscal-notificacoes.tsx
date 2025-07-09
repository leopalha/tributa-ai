import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export function ObrigacaoFiscalNotificacoes() {
  const notificacoes = [
    {
      id: 1,
      titulo: 'DCTF vencendo em 3 dias',
      tipo: 'warning',
      data: '2024-01-15',
      status: 'pendente',
    },
    {
      id: 2,
      titulo: 'DEFIS entregue com sucesso',
      tipo: 'success',
      data: '2024-01-10',
      status: 'concluido',
    },
  ];

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getVariant = (tipo: string) => {
    switch (tipo) {
      case 'warning':
        return 'destructive' as const;
      case 'success':
        return 'default' as const;
      default:
        return 'secondary' as const;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notificações de Obrigações Fiscais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">Acompanhe prazos e status das obrigações fiscais.</p>

        <div className="space-y-3">
          {notificacoes.map(notificacao => (
            <div
              key={notificacao.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                {getIcon(notificacao.tipo)}
                <div>
                  <p className="font-medium">{notificacao.titulo}</p>
                  <p className="text-sm text-muted-foreground">{notificacao.data}</p>
                </div>
              </div>
              <Badge variant={getVariant(notificacao.tipo)}>{notificacao.status}</Badge>
            </div>
          ))}
        </div>

        <Button className="w-full" variant="outline">
          Ver todas as notificações
        </Button>

        <div className="text-sm text-muted-foreground">Funcionalidade em desenvolvimento...</div>
      </CardContent>
    </Card>
  );
}
