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

interface ObrigacaoFiscalDeleteAnexoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anexo: AnexoObrigacao | null;
  onConfirm: () => void;
}

export function ObrigacaoFiscalDeleteAnexoDialog({
  open,
  onOpenChange,
  anexo,
  onConfirm,
}: ObrigacaoFiscalDeleteAnexoDialogProps) {
  if (!anexo) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Anexo</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o arquivo {anexo.nome}? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
