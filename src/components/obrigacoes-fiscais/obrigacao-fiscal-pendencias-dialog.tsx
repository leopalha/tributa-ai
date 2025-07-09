import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ObrigacaoFiscalPendencias } from '@/types/obrigacao-fiscal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ObrigacaoFiscalPendenciasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendencias: ObrigacaoFiscalPendencias;
  onViewObrigacao: (id: string) => void;
}

export function ObrigacaoFiscalPendenciasDialog({
  open,
  onOpenChange,
  pendencias,
  onViewObrigacao,
}: ObrigacaoFiscalPendenciasDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Pendências de Obrigações Fiscais</AlertDialogTitle>
          <AlertDialogDescription>
            Visualize as pendências de obrigações fiscais.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium">Total de Pendências</h3>
            <p className="text-sm text-gray-500">{pendencias.totalPendencias}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Valor Total Pendente</h3>
            <p className="text-sm text-gray-500">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(pendencias.valorTotalPendente)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Obrigações Pendentes</h3>
            <div className="mt-2 space-y-2">
              {pendencias.obrigacoesPendentes.map(obrigacao => (
                <div
                  key={obrigacao.id}
                  className="p-2 border rounded hover:bg-gray-50 cursor-pointer"
                  onClick={() => onViewObrigacao(obrigacao.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">{obrigacao.tipo}</p>
                      <p className="text-sm text-gray-500">
                        Vencimento:{' '}
                        {format(new Date(obrigacao.dataVencimento), 'dd/MM/yyyy', {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(obrigacao.valor)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium">Obrigações Atrasadas</h3>
            <div className="mt-2 space-y-2">
              {pendencias.obrigacoesAtrasadas.map(obrigacao => (
                <div
                  key={obrigacao.id}
                  className="p-2 border rounded hover:bg-gray-50 cursor-pointer"
                  onClick={() => onViewObrigacao(obrigacao.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">{obrigacao.tipo}</p>
                      <p className="text-sm text-gray-500">
                        Vencimento:{' '}
                        {format(new Date(obrigacao.dataVencimento), 'dd/MM/yyyy', {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(obrigacao.valor)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Fechar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
