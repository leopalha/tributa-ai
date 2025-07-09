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
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface ObrigacaoFiscalTransmitirDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (observacoes: string) => void;
}

export function ObrigacaoFiscalTransmitirDialog({
  open,
  onOpenChange,
  onConfirm,
}: ObrigacaoFiscalTransmitirDialogProps) {
  const [observacoes, setObservacoes] = useState('');

  const handleConfirm = () => {
    onConfirm(observacoes);
    setObservacoes('');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Transmitir Obrigação</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja transmitir esta obrigação? Por favor, adicione observações se
            necessário.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Observações..."
            value={observacoes}
            onChange={e => setObservacoes(e.target.value)}
            className="w-full"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setObservacoes('')}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
