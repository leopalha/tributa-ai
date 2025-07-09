import React from 'react';
import { BellRing, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Alert = {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  date: string;
  read: boolean;
};

interface AlertsNotificationsProps {
  limit?: number;
}

export function AlertsNotifications({ limit = 3 }: AlertsNotificationsProps) {
  // Dados de exemplo
  const alerts: Alert[] = [
    {
      id: '1',
      title: 'Transação Concluída',
      message: 'Seu crédito de ICMS foi tokenizado com sucesso',
      type: 'success',
      date: '2025-04-28T15:30:00',
      read: false,
    },
    {
      id: '2',
      title: 'Lembrete',
      message: 'Prazo para compensação de créditos se encerra em 5 dias',
      type: 'info',
      date: '2025-04-28T09:15:00',
      read: false,
    },
    {
      id: '3',
      title: 'Atenção',
      message: 'Necessário revisar documentação para validação de crédito',
      type: 'warning',
      date: '2025-04-27T14:20:00',
      read: true,
    },
    {
      id: '4',
      title: 'Nova Oferta',
      message: 'Você recebeu uma nova oferta em seu anúncio',
      type: 'info',
      date: '2025-04-26T11:45:00',
      read: true,
    },
  ];

  // Limitar o número de alertas mostrados, priorizando os não lidos
  const limitedAlerts = [...alerts]
    .sort((a, b) => {
      // Primeiro os não lidos
      if (a.read !== b.read) return a.read ? 1 : -1;
      // Depois por data, mais recentes primeiro
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, limit);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min atrás`;
    } else if (diffHours < 24) {
      return `${diffHours} h atrás`;
    } else if (diffDays === 1) {
      return 'Ontem';
    } else if (diffDays < 7) {
      return `${diffDays} dias atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
      default:
        return <Calendar className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {limitedAlerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <BellRing className="h-10 w-10 text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">Não há notificações</p>
        </div>
      ) : (
        limitedAlerts.map(alert => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg border ${alert.read ? 'bg-transparent' : 'bg-primary/5 border-primary/10'}`}
          >
            <div className="flex gap-3">
              {getAlertIcon(alert.type)}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium">{alert.title}</h4>
                  {!alert.read && (
                    <Badge
                      variant="outline"
                      className="bg-primary/20 text-primary border-primary/30 text-xs"
                    >
                      Novo
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{formatDate(alert.date)}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
