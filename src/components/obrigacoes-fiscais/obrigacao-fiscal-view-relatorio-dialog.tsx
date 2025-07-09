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

interface ObrigacaoFiscalViewRelatorioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  relatorio: {
    id: string;
    tipo: 'mensal' | 'trimestral' | 'semestral' | 'anual';
    dataInicio: string;
    dataFim: string;
    formato: 'pdf' | 'xlsx';
    observacoes?: string;
    dataGeracao: string;
    usuario: string;
    url: string;
  };
  onDownload: () => void;
}

export function ObrigacaoFiscalViewRelatorioDialog({
  open,
  onOpenChange,
  relatorio,
  onDownload,
}: ObrigacaoFiscalViewRelatorioDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Detalhes do Relatório</AlertDialogTitle>
          <AlertDialogDescription>
            Visualize os detalhes do relatório de obrigações fiscais.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium">Tipo de Relatório</h3>
            <p className="text-sm text-gray-500">
              {relatorio.tipo.charAt(0).toUpperCase() + relatorio.tipo.slice(1)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Período</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(relatorio.dataInicio), 'dd/MM/yyyy', {
                locale: ptBR,
              })}{' '}
              a{' '}
              {format(new Date(relatorio.dataFim), 'dd/MM/yyyy', {
                locale: ptBR,
              })}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Formato</h3>
            <p className="text-sm text-gray-500">{relatorio.formato.toUpperCase()}</p>
          </div>
          {relatorio.observacoes && (
            <div>
              <h3 className="text-sm font-medium">Observações</h3>
              <p className="text-sm text-gray-500">{relatorio.observacoes}</p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium">Data de Geração</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(relatorio.dataGeracao), 'dd/MM/yyyy HH:mm', {
                locale: ptBR,
              })}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Usuário</h3>
            <p className="text-sm text-gray-500">{relatorio.usuario}</p>
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
