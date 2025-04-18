import { useEffect, useRef } from 'react';
import { History, AlertCircle, CheckCircle2, Clock4, FileText, User, Edit } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Atividade {
  id: string;
  data: string;
  usuario: string;
  acao: 'criou' | 'atualizou' | 'anexou' | 'removeu' | 'compartilhou' | 'comentou';
  detalhes?: string;
  metadata?: Record<string, any>;
}

interface ActivityTimelineProps {
  atividades: Atividade[];
  className?: string;
}

const acaoConfig = {
  criou: {
    icon: FileText,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  atualizou: {
    icon: Edit,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  anexou: {
    icon: FileText,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  removeu: {
    icon: AlertCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10'
  },
  compartilhou: {
    icon: User,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  },
  comentou: {
    icon: History,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10'
  }
};

export function ActivityTimeline({ atividades, className }: ActivityTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll para a última atividade quando novas são adicionadas
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [atividades]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Histórico de Atividades</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4" ref={scrollRef}>
          <div className="relative">
            {atividades.map((atividade, index) => {
              const config = acaoConfig[atividade.acao];
              const Icon = config.icon;

              return (
                <motion.div
                  key={atividade.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 pb-6 relative"
                >
                  {/* Linha vertical conectando os itens */}
                  {index < atividades.length - 1 && (
                    <div className="absolute left-[11px] top-7 bottom-0 w-[2px] bg-border" />
                  )}

                  {/* Ícone da atividade */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`
                            w-6 h-6 rounded-full flex items-center justify-center z-10
                            ${config.bgColor} ${config.color}
                            transition-transform hover:scale-110 cursor-help
                          `}
                        >
                          <Icon className="w-3 h-3" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {atividade.acao.charAt(0).toUpperCase() + atividade.acao.slice(1)}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Conteúdo da atividade */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{atividade.usuario}</span>
                      <Badge
                        variant="secondary"
                        className={`${config.bgColor} ${config.color}`}
                      >
                        {atividade.acao}
                      </Badge>
                    </div>

                    {atividade.detalhes && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-muted-foreground mt-1"
                      >
                        {atividade.detalhes}
                      </motion.p>
                    )}

                    {/* Metadados adicionais */}
                    {atividade.metadata && Object.entries(atividade.metadata).length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-xs text-muted-foreground"
                      >
                        {Object.entries(atividade.metadata).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-1">
                            <span className="font-medium">{key}:</span>
                            <span>{value}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-muted-foreground block mt-1"
                    >
                      {formatDistanceToNow(new Date(atividade.data), { locale: ptBR, addSuffix: true })}
                    </motion.span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 