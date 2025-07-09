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
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ObrigacaoFiscalViewDarfDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  darf: {
    id: string;
    codigoReceita: string;
    dataVencimento: string;
    valor: number;
    observacoes?: string;
    dataGeracao: string;
    usuario: string;
    url: string;
  };
  onDownload: () => void;
}

export function ObrigacaoFiscalViewDarfDialog({
  open,
  onOpenChange,
  darf,
  onDownload,
}: ObrigacaoFiscalViewDarfDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Detalhes do DARF</AlertDialogTitle>
          <AlertDialogDescription>
            Visualize os detalhes do DARF da obrigação fiscal.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium">Código da Receita</h3>
            <p className="text-sm text-gray-500">{darf.codigoReceita}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Data de Vencimento</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(darf.dataVencimento), 'dd/MM/yyyy', {
                locale: ptBR,
              })}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Valor</h3>
            <p className="text-sm text-gray-500">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(darf.valor)}
            </p>
          </div>
          {darf.observacoes && (
            <div>
              <h3 className="text-sm font-medium">Observações</h3>
              <p className="text-sm text-gray-500">{darf.observacoes}</p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium">Data de Geração</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(darf.dataGeracao), 'dd/MM/yyyy HH:mm', {
                locale: ptBR,
              })}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Usuário</h3>
            <p className="text-sm text-gray-500">{darf.usuario}</p>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Fechar</AlertDialogCancel>
          <AlertDialogAction onClick={onDownload}>Download</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
