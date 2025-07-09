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
import { ComprovantePagamento } from '@/types/obrigacao-fiscal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ObrigacaoFiscalViewComprovanteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comprovante: ComprovantePagamento;
  onDownload: () => void;
}

export function ObrigacaoFiscalViewComprovanteDialog({
  open,
  onOpenChange,
  comprovante,
  onDownload,
}: ObrigacaoFiscalViewComprovanteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Detalhes do Comprovante</AlertDialogTitle>
          <AlertDialogDescription>
            Visualize os detalhes do comprovante de pagamento da obrigação fiscal.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium">Número do Documento</h3>
            <p className="text-sm text-gray-500">{comprovante.numeroDocumento}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Forma de Pagamento</h3>
            <p className="text-sm text-gray-500">{comprovante.formaPagamento}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Valor</h3>
            <p className="text-sm text-gray-500">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(comprovante.valor)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Data do Pagamento</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(comprovante.data), 'dd/MM/yyyy', {
                locale: ptBR,
              })}
            </p>
          </div>
          {comprovante.observacoes && (
            <div>
              <h3 className="text-sm font-medium">Observações</h3>
              <p className="text-sm text-gray-500">{comprovante.observacoes}</p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium">Data de Registro</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(comprovante.dataRegistro), 'dd/MM/yyyy HH:mm', {
                locale: ptBR,
              })}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Usuário</h3>
            <p className="text-sm text-gray-500">{comprovante.usuario}</p>
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
