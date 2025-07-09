import React, { memo, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  CalendarClock,
  Check,
  Clock,
  FileText,
  LifeBuoy,
  UploadCloud,
  Banknote,
  FileBarChart,
  ChevronRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Dados mockados em constante para evitar recriação a cada renderização
const activities = [
  {
    id: 1,
    type: 'declaracao_enviada',
    title: 'DCTF enviada com sucesso',
    description: 'Declaração do mês 04/2024',
    timestamp: 'Há 2 horas',
    user: {
      name: 'Maria Silva',
      image: null,
      initials: 'MS',
    },
    status: 'success',
  },
  {
    id: 2,
    type: 'credito_identificado',
    title: 'Crédito de ICMS identificado',
    description: 'R$ 15.280,45 - Nota Fiscal #35892',
    timestamp: 'Há 5 horas',
    user: {
      name: 'Sistema Automático',
      image: null,
      initials: 'SA',
    },
    status: 'info',
  },
  {
    id: 3,
    type: 'prazo_proximo',
    title: 'Prazo de obrigação se aproximando',
    description: 'EFD-Contribuições vence em 3 dias',
    timestamp: 'Há 12 horas',
    user: {
      name: 'Sistema de Alertas',
      image: null,
      initials: 'SA',
    },
    status: 'warning',
  },
  {
    id: 4,
    type: 'documento_processado',
    title: 'Documento fiscal processado',
    description: 'XML de NF-e importado automaticamente',
    timestamp: 'Há 1 dia',
    user: {
      name: 'João Pires',
      image: null,
      initials: 'JP',
    },
    status: 'success',
  },
  {
    id: 5,
    type: 'tc_emitido',
    title: 'Título de Crédito emitido',
    description: 'TC #12458 - ICMS-ST - R$ 8.540,20',
    timestamp: 'Há 2 dias',
    user: {
      name: 'Marcos Oliveira',
      image: null,
      initials: 'MO',
    },
    status: 'success',
  },
  {
    id: 6,
    type: 'compensacao',
    title: 'Compensação tributária realizada',
    description: 'PIS/COFINS - Competência 03/2024',
    timestamp: 'Há 3 dias',
    user: {
      name: 'Ana Costa',
      image: null,
      initials: 'AC',
    },
    status: 'info',
  },
];

// Componente de ícone memoizado
const ActivityIcon = memo(({ type }: { type: string }) => {
  let icon;
  let colorClass = '';

  switch (type) {
    case 'declaracao_enviada':
      icon = <FileText className="h-5 w-5" />;
      colorClass = 'text-blue-500 bg-blue-50';
      break;
    case 'credito_identificado':
      icon = <Banknote className="h-5 w-5" />;
      colorClass = 'text-green-500 bg-green-50';
      break;
    case 'prazo_proximo':
      icon = <CalendarClock className="h-5 w-5" />;
      colorClass = 'text-amber-500 bg-amber-50';
      break;
    case 'documento_processado':
      icon = <UploadCloud className="h-5 w-5" />;
      colorClass = 'text-purple-500 bg-purple-50';
      break;
    case 'tc_emitido':
      icon = <FileBarChart className="h-5 w-5" />;
      colorClass = 'text-blue-500 bg-blue-50';
      break;
    case 'compensacao':
      icon = <Check className="h-5 w-5" />;
      colorClass = 'text-green-500 bg-green-50';
      break;
    default:
      icon = <Clock className="h-5 w-5" />;
      colorClass = 'text-gray-500 bg-gray-50';
  }

  return <div className={`rounded-full p-2 ${colorClass} transition-colors`}>{icon}</div>;
});

ActivityIcon.displayName = 'ActivityIcon';

// Componente de badge memoizado
const StatusBadge = memo(({ status }: { status: string }) => {
  switch (status) {
    case 'success':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Sucesso
        </Badge>
      );
    case 'warning':
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          Atenção
        </Badge>
      );
    case 'error':
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Erro
        </Badge>
      );
    case 'info':
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Informação
        </Badge>
      );
    default:
      return null;
  }
});

StatusBadge.displayName = 'StatusBadge';

// Componente de atividade individual memoizado
const ActivityItem = memo(({ activity }: { activity: (typeof activities)[0] }) => {
  return (
    <div className="flex items-start gap-4 group hover:bg-slate-100 dark:hover:bg-slate-800/50 p-3 rounded-lg transition-all">
      <div className="mt-1">
        <ActivityIcon type={activity.type} />
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="font-medium leading-none">{activity.title}</p>
          <StatusBadge status={activity.status} />
        </div>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">{activity.description}</p>
        <div className="flex items-center gap-2 pt-1">
          <Avatar className="h-6 w-6 border border-slate-200 dark:border-slate-700">
            <AvatarImage src={activity.user.image || ''} alt={activity.user.name} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {activity.user.initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            {activity.user.name} • {activity.timestamp}
          </span>
        </div>
      </div>
    </div>
  );
});

ActivityItem.displayName = 'ActivityItem';

// Componente principal memoizado
const RecentActivity = memo(() => {
  // Use useMemo para evitar recriação desnecessária da lista de atividades
  const activityList = useMemo(() => {
    return activities.map(activity => <ActivityItem key={activity.id} activity={activity} />);
  }, []);

  return (
    <ScrollArea className="max-h-[350px] pr-3">
      <div className="space-y-2">
        {activityList}

        <div className="pt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-sm text-primary hover:text-primary/80 hover:bg-primary/10 transition-colors flex items-center gap-1 font-medium"
          >
            Ver todas as atividades
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
});

RecentActivity.displayName = 'RecentActivity';

export { RecentActivity };
