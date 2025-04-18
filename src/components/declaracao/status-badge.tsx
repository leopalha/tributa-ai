import { AlertCircle, CheckCircle2, Clock4 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StatusBadgeProps {
  status: 'pendente' | 'em_andamento' | 'concluida';
  showTooltip?: boolean;
  className?: string;
}

const statusConfig = {
  pendente: {
    icon: AlertCircle,
    text: 'Pendente',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    description: 'Declaração aguardando início do processamento'
  },
  em_andamento: {
    icon: Clock4,
    text: 'Em Andamento',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    description: 'Declaração em processo de elaboração'
  },
  concluida: {
    icon: CheckCircle2,
    text: 'Concluída',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    description: 'Declaração finalizada e pronta para envio'
  }
};

export function StatusBadge({ status, showTooltip = true, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const badge = (
    <Badge
      variant="secondary"
      className={cn(
        'transition-all hover:scale-105',
        config.bgColor,
        config.color,
        className
      )}
    >
      <Icon className="w-4 h-4 mr-2 animate-pulse" />
      {config.text}
    </Badge>
  );

  if (!showTooltip) return badge;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 