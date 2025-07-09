import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle2, FileText, AlertTriangleIcon, Clock, Users } from 'lucide-react';

interface Activity {
  id: string;
  type: 'declaracao' | 'alerta' | 'notificacao' | 'usuario' | 'sistema';
  title: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'error' | 'info';
  user?: string;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'declaracao',
    title: 'DCTF Enviada',
    description: 'Declaração enviada com sucesso para a empresa Tech Solutions LTDA',
    timestamp: '2 minutos atrás',
    status: 'success',
    user: 'João Silva',
  },
  {
    id: '2',
    type: 'alerta',
    title: 'Prazo Próximo',
    description: 'EFD-Reinf vence em 3 dias para Comércio Digital S.A.',
    timestamp: '15 minutos atrás',
    status: 'warning',
  },
  {
    id: '3',
    type: 'notificacao',
    title: 'Nova Legislação',
    description: 'Atualização na IN RFB nº 2.132/2024',
    timestamp: '1 hora atrás',
    status: 'info',
  },
  {
    id: '4',
    type: 'usuario',
    title: 'Novo Usuário',
    description: 'Maria Santos foi adicionada como contadora',
    timestamp: '2 horas atrás',
    status: 'info',
    user: 'Admin',
  },
  {
    id: '5',
    type: 'sistema',
    title: 'Backup Realizado',
    description: 'Backup automático dos dados fiscais concluído',
    timestamp: '3 horas atrás',
    status: 'success',
  },
  {
    id: '6',
    type: 'alerta',
    title: 'Erro de Processamento',
    description: 'Falha no envio da GFIP - Empresa: Serviços Online LTDA',
    timestamp: '4 horas atrás',
    status: 'error',
  },
];

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'declaracao':
      return <FileText className="h-4 w-4" />;
    case 'alerta':
      return <AlertTriangleIcon className="h-4 w-4" />;
    case 'notificacao':
      return <Bell className="h-4 w-4" />;
    case 'usuario':
      return <Users className="h-4 w-4" />;
    case 'sistema':
      return <Clock className="h-4 w-4" />;
  }
};

const getStatusColor = (status: Activity['status']) => {
  switch (status) {
    case 'success':
      return 'bg-green-100 text-green-800';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800';
    case 'error':
      return 'bg-red-100 text-red-800';
    case 'info':
    default:
      return 'bg-blue-100 text-blue-800';
  }
};

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Atividades Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {mockActivities.map(activity => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-[hsl(var(--accent))]/5 transition-colors"
              >
                <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                  {getActivityIcon(activity.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{activity.title}</p>
                    <Badge variant="outline" className="text-xs">
                      {activity.timestamp}
                    </Badge>
                  </div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {activity.description}
                  </p>
                  {activity.user && (
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      por {activity.user}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
