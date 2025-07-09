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
import { ValidacaoObrigacao } from '@/types/obrigacao-fiscal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ObrigacaoFiscalViewValidacaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  validacao: ValidacaoObrigacao;
}

export function ObrigacaoFiscalViewValidacaoDialog({
  open,
  onOpenChange,
  validacao,
}: ObrigacaoFiscalViewValidacaoDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Detalhes da Validação</AlertDialogTitle>
          <AlertDialogDescription>
            Visualize os detalhes da validação da obrigação fiscal.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium">Tipo</h3>
            <p className="text-sm text-gray-500">{validacao.tipo}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Status</h3>
            <p className="text-sm text-gray-500">{validacao.aprovado ? 'Aprovado' : 'Reprovado'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Descrição</h3>
            <p className="text-sm text-gray-500">{validacao.descricao}</p>
          </div>
          {validacao.observacoes && (
            <div>
              <h3 className="text-sm font-medium">Observações</h3>
              <p className="text-sm text-gray-500">{validacao.observacoes}</p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium">Data da Validação</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(validacao.dataValidacao), 'dd/MM/yyyy HH:mm', {
                locale: ptBR,
              })}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Usuário</h3>
            <p className="text-sm text-gray-500">{validacao.usuario}</p>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Fechar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
