import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';
import { ObrigacaoFiscal } from '@/types/declaracao';
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface ObrigacaoFiscalCalendarioProps {
  obrigacoes: ObrigacaoFiscal[];
}

export function ObrigacaoFiscalCalendario({ obrigacoes }: ObrigacaoFiscalCalendarioProps) {
  const obrigacoesProximas = obrigacoes
    .filter(obrigacao => {
      const vencimento = new Date(obrigacao.dataVencimento);
      return isThisWeek(vencimento) || isToday(vencimento) || isTomorrow(vencimento);
    })
    .sort((a, b) => new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime());

  const getUrgencia = (dataVencimento: string) => {
    const vencimento = new Date(dataVencimento);
    if (isToday(vencimento)) return 'hoje';
    if (isTomorrow(vencimento)) return 'amanha';
    return 'semana';
  };

  const getVariantBadge = (urgencia: string) => {
    switch (urgencia) {
      case 'hoje':
        return 'destructive' as const;
      case 'amanha':
        return 'default' as const;
      default:
        return 'secondary' as const;
    }
  };

  const getTextoUrgencia = (urgencia: string) => {
    switch (urgencia) {
      case 'hoje':
        return 'Hoje';
      case 'amanha':
        return 'Amanhã';
      default:
        return 'Esta semana';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Calendário Fiscal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {obrigacoesProximas.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma obrigação fiscal nos próximos dias</p>
          </div>
        ) : (
          <div className="space-y-3">
            {obrigacoesProximas.map(obrigacao => {
              const urgencia = getUrgencia(obrigacao.dataVencimento);
              return (
                <div
                  key={obrigacao.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {urgencia === 'hoje' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                      {urgencia === 'amanha' && <Clock className="h-5 w-5 text-yellow-500" />}
                      {urgencia === 'semana' && <Calendar className="h-5 w-5 text-blue-500" />}
                    </div>
                    <div>
                      <p className="font-medium">{obrigacao.titulo}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(obrigacao.dataVencimento), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={getVariantBadge(urgencia)}>{getTextoUrgencia(urgencia)}</Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {obrigacao.valor.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
