import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ObrigacaoFiscalPendencias as ObrigacaoFiscalPendenciasType } from '@/types/obrigacao-fiscal';
import { AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ObrigacaoFiscalPendenciasProps {
  pendencias: ObrigacaoFiscalPendenciasType;
}

export function ObrigacaoFiscalPendencias({ pendencias }: ObrigacaoFiscalPendenciasProps) {
  if (!pendencias.temPendencias || pendencias.obrigacoesPendentes.length === 0) {
    return null;
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Obrigações Pendentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendencias.obrigacoesPendentes.map(pendencia => (
            <div
              key={pendencia.id}
              className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg"
            >
              <div>
                <h3 className="font-medium">{pendencia.tipo}</h3>
                <p className="text-sm text-gray-500">
                  Vencimento:{' '}
                  {format(new Date(pendencia.vencimento), 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{pendencia.diasAtraso} dias de atraso</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
