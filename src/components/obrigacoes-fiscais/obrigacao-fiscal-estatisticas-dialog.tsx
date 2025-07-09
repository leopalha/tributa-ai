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
import { ObrigacaoFiscalEstatisticas } from '@/types/obrigacao-fiscal';

interface ObrigacaoFiscalEstatisticasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estatisticas: ObrigacaoFiscalEstatisticas;
}

export function ObrigacaoFiscalEstatisticasDialog({
  open,
  onOpenChange,
  estatisticas,
}: ObrigacaoFiscalEstatisticasDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Estatísticas de Obrigações Fiscais</AlertDialogTitle>
          <AlertDialogDescription>
            Visualize as estatísticas das obrigações fiscais.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium">Total de Obrigações</h3>
              <p className="text-sm text-gray-500">{estatisticas.totalObrigacoes}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Obrigações Pendentes</h3>
              <p className="text-sm text-gray-500">{estatisticas.obrigacoesPendentes}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Obrigações em Andamento</h3>
              <p className="text-sm text-gray-500">{estatisticas.obrigacoesEmAndamento}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Obrigações Concluídas</h3>
              <p className="text-sm text-gray-500">{estatisticas.obrigacoesConcluidas}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Obrigações Atrasadas</h3>
              <p className="text-sm text-gray-500">{estatisticas.obrigacoesAtrasadas}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Obrigações Canceladas</h3>
              <p className="text-sm text-gray-500">{estatisticas.obrigacoesCanceladas}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium">Valor Total</h3>
            <p className="text-sm text-gray-500">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(estatisticas.valorTotal)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Valor Pendente</h3>
            <p className="text-sm text-gray-500">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(estatisticas.valorPendente)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Valor Pago</h3>
            <p className="text-sm text-gray-500">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(estatisticas.valorPago)}
            </p>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Fechar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
