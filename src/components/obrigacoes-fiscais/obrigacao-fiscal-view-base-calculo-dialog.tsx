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
import { BaseCalculo } from '@/types/obrigacao-fiscal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ObrigacaoFiscalViewBaseCalculoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  baseCalculo: BaseCalculo;
}

export function ObrigacaoFiscalViewBaseCalculoDialog({
  open,
  onOpenChange,
  baseCalculo,
}: ObrigacaoFiscalViewBaseCalculoDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Detalhes da Base de Cálculo</AlertDialogTitle>
          <AlertDialogDescription>
            Visualize os detalhes da base de cálculo da obrigação fiscal.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium">Tipo</h3>
            <p className="text-sm text-gray-500">{baseCalculo.tipo}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Valor</h3>
            <p className="text-sm text-gray-500">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(baseCalculo.valor)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Alíquota</h3>
            <p className="text-sm text-gray-500">
              {new Intl.NumberFormat('pt-BR', {
                style: 'percent',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(baseCalculo.aliquota / 100)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Valor Calculado</h3>
            <p className="text-sm text-gray-500">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(baseCalculo.valorCalculado)}
            </p>
          </div>
          {baseCalculo.observacoes && (
            <div>
              <h3 className="text-sm font-medium">Observações</h3>
              <p className="text-sm text-gray-500">{baseCalculo.observacoes}</p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium">Data de Cálculo</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(baseCalculo.dataCalculo), 'dd/MM/yyyy HH:mm', {
                locale: ptBR,
              })}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Usuário</h3>
            <p className="text-sm text-gray-500">{baseCalculo.usuario}</p>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Fechar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
