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
import { AnexoObrigacao } from '@/types/obrigacao-fiscal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ObrigacaoFiscalViewAnexoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anexo: AnexoObrigacao;
  onDownload: () => void;
  onDelete: () => void;
}

export function ObrigacaoFiscalViewAnexoDialog({
  open,
  onOpenChange,
  anexo,
  onDownload,
  onDelete,
}: ObrigacaoFiscalViewAnexoDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Detalhes do Anexo</AlertDialogTitle>
          <AlertDialogDescription>
            Visualize os detalhes do anexo da obrigação fiscal.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium">Nome</h3>
            <p className="text-sm text-gray-500">{anexo.nome}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Descrição</h3>
            <p className="text-sm text-gray-500">{anexo.descricao}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Tipo</h3>
            <p className="text-sm text-gray-500">{anexo.tipo}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Tamanho</h3>
            <p className="text-sm text-gray-500">
              {new Intl.NumberFormat('pt-BR', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(anexo.tamanho / 1024)}{' '}
              KB
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Data de Upload</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(anexo.dataUpload), 'dd/MM/yyyy HH:mm', {
                locale: ptBR,
              })}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Usuário</h3>
            <p className="text-sm text-gray-500">{anexo.usuario}</p>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Fechar</AlertDialogCancel>
          <AlertDialogAction onClick={onDownload}>Download</AlertDialogAction>
          <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
