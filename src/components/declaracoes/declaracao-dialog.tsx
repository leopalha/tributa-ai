import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DeclaracaoForm } from './declaracao-form';
import { Declaracao, DeclaracaoCreate } from '@/types/declaracao';

interface DeclaracaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  declaracao?: Declaracao;
  onSubmit: (data: DeclaracaoCreate) => void;
}

export function DeclaracaoDialog({
  open,
  onOpenChange,
  declaracao,
  onSubmit,
}: DeclaracaoDialogProps) {
  const handleSubmit = (data: DeclaracaoCreate) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{declaracao ? 'Editar Declaração' : 'Nova Declaração'}</DialogTitle>
          <DialogDescription>
            {declaracao
              ? 'Atualize os dados da declaração'
              : 'Preencha os dados para criar uma nova declaração'}
          </DialogDescription>
        </DialogHeader>
        <DeclaracaoForm
          declaracao={declaracao}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
