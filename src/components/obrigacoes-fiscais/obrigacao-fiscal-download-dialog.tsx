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

interface ObrigacaoFiscalDownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anexo: AnexoObrigacao | null;
  onConfirm: () => void;
}

export function ObrigacaoFiscalDownloadDialog({
  open,
  onOpenChange,
  anexo,
  onConfirm,
}: ObrigacaoFiscalDownloadDialogProps) {
  if (!anexo) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Download de Anexo</AlertDialogTitle>
          <AlertDialogDescription>
            Deseja fazer o download do arquivo {anexo.nome}?
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
