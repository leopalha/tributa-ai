import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HistoricoDeclaracao, StatusDeclaracao } from '@/types/declaracao';
import { AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface DeclaracaoHistoricoProps {
  historico: HistoricoDeclaracao[];
}

const statusIcons = {
  declaracao_pendente: <AlertCircle className="h-4 w-4" />,
  declaracao_em_andamento: <Clock className="h-4 w-4" />,
  declaracao_concluida: <CheckCircle2 className="h-4 w-4" />,
  declaracao_atrasada: <AlertCircle className="h-4 w-4" />,
  declaracao_cancelada: <XCircle className="h-4 w-4" />,
};

const statusColors = {
  declaracao_pendente: 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-200',
  declaracao_em_andamento: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
  declaracao_concluida: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200',
  declaracao_atrasada: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200',
  declaracao_cancelada: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
};

const statusLabels = {
  declaracao_pendente: 'Pendente',
  declaracao_em_andamento: 'Em Andamento',
  declaracao_concluida: 'Concluída',
  declaracao_atrasada: 'Atrasada',
  declaracao_cancelada: 'Cancelada',
};

export function DeclaracaoHistorico({ historico }: DeclaracaoHistoricoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {historico.length > 0 ? (
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
              {historico.map((item, index) => (
                <div key={item.id} className="relative pl-8 pb-4 last:pb-0">
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-background border flex items-center justify-center">
                    {statusIcons[item.status]}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={statusColors[item.status]}>
                        {statusLabels[item.status]}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(item.data), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    <p className="text-sm">{item.observacoes}</p>
                    <p className="text-xs text-muted-foreground">Por: {item.usuario}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Nenhum histórico encontrado
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
