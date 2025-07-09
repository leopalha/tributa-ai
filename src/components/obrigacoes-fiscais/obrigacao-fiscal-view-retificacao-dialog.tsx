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
import { Retificacao } from '@/types/obrigacao-fiscal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ObrigacaoFiscalViewRetificacaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  retificacao: Retificacao;
}

export function ObrigacaoFiscalViewRetificacaoDialog({
  open,
  onOpenChange,
  retificacao,
}: ObrigacaoFiscalViewRetificacaoDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Detalhes da Retificação</AlertDialogTitle>
          <AlertDialogDescription>
            Visualize os detalhes da retificação da obrigação fiscal.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium">Motivo</h3>
            <p className="text-sm text-gray-500">{retificacao.motivo}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Valor Original</h3>
            <p className="text-sm text-gray-500">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(retificacao.valorOriginal)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Valor Retificado</h3>
            <p className="text-sm text-gray-500">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(retificacao.valorRetificado)}
            </p>
          </div>
          {retificacao.observacoes && (
            <div>
              <h3 className="text-sm font-medium">Observações</h3>
              <p className="text-sm text-gray-500">{retificacao.observacoes}</p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium">Data da Retificação</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(retificacao.dataRetificacao), 'dd/MM/yyyy HH:mm', {
                locale: ptBR,
              })}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Usuário</h3>
            <p className="text-sm text-gray-500">{retificacao.usuario}</p>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Fechar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
