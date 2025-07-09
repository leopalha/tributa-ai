import React from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Declaracao } from '@/types/declaracao';

interface DeclaracaoCalendarioProps {
  declaracoes: Declaracao[];
}

export function DeclaracaoCalendario({ declaracoes }: DeclaracaoCalendarioProps) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDeclaracoesForDay = (date: Date) => {
    return declaracoes.filter(declaracao => {
      const vencimento = new Date(declaracao.dataVencimento);
      return (
        vencimento.getDate() === date.getDate() &&
        vencimento.getMonth() === date.getMonth() &&
        vencimento.getFullYear() === date.getFullYear()
      );
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendário de Obrigações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          {days.map(day => {
            const dayDeclaracoes = getDeclaracoesForDay(day);
            const isCurrentMonth = isSameMonth(day, today);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={`
                  min-h-[100px] p-2 border rounded-lg
                  ${isCurrentMonth ? 'bg-background' : 'bg-muted/50'}
                  ${isCurrentDay ? 'border-primary' : 'border-border'}
                `}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`
                    text-sm font-medium
                    ${isCurrentDay ? 'text-primary' : 'text-foreground'}
                    ${!isCurrentMonth && 'text-muted-foreground'}
                  `}
                  >
                    {format(day, 'd')}
                  </span>
                  {dayDeclaracoes.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {dayDeclaracoes.length}
                    </Badge>
                  )}
                </div>
                <div className="space-y-1">
                  {dayDeclaracoes.map(declaracao => (
                    <div
                      key={declaracao.id}
                      className="text-xs p-1 rounded bg-muted truncate"
                      title={`${declaracao.tipo} - ${format(new Date(declaracao.dataVencimento), 'dd/MM/yyyy')}`}
                    >
                      {declaracao.tipo}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
