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
import { HistoricoObrigacao } from '@/types/obrigacao-fiscal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ObrigacaoFiscalViewHistoricoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  historico: HistoricoObrigacao;
}

export function ObrigacaoFiscalViewHistoricoDialog({
  open,
  onOpenChange,
  historico,
}: ObrigacaoFiscalViewHistoricoDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Detalhes do Histórico</AlertDialogTitle>
          <AlertDialogDescription>
            Visualize os detalhes do histórico da obrigação fiscal.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium">Ação</h3>
            <p className="text-sm text-gray-500">{historico.acao}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Descrição</h3>
            <p className="text-sm text-gray-500">{historico.descricao}</p>
          </div>
          {historico.observacoes && (
            <div>
              <h3 className="text-sm font-medium">Observações</h3>
              <p className="text-sm text-gray-500">{historico.observacoes}</p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium">Data da Ação</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(historico.dataAcao), 'dd/MM/yyyy HH:mm', {
                locale: ptBR,
              })}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Usuário</h3>
            <p className="text-sm text-gray-500">{historico.usuario}</p>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Fechar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
