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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface ObrigacaoFiscalRetificacaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: {
    motivo: string;
    valorOriginal: number;
    valorRetificado: number;
    observacoes: string;
  }) => void;
}

export function ObrigacaoFiscalRetificacaoDialog({
  open,
  onOpenChange,
  onConfirm,
}: ObrigacaoFiscalRetificacaoDialogProps) {
  const [motivo, setMotivo] = useState('');
  const [valorOriginal, setValorOriginal] = useState('');
  const [valorRetificado, setValorRetificado] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const handleConfirm = () => {
    onConfirm({
      motivo,
      valorOriginal: parseFloat(valorOriginal),
      valorRetificado: parseFloat(valorRetificado),
      observacoes,
    });
    setMotivo('');
    setValorOriginal('');
    setValorRetificado('');
    setObservacoes('');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Retificar Obrigação</AlertDialogTitle>
          <AlertDialogDescription>
            Preencha os dados para retificação da obrigação.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Motivo</label>
            <Input
              type="text"
              placeholder="Motivo da retificação"
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Valor Original</label>
            <Input
              type="number"
              placeholder="0,00"
              value={valorOriginal}
              onChange={e => setValorOriginal(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Valor Retificado</label>
            <Input
              type="number"
              placeholder="0,00"
              value={valorRetificado}
              onChange={e => setValorRetificado(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Observações</label>
            <Textarea
              placeholder="Observações..."
              value={observacoes}
              onChange={e => setObservacoes(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setMotivo('');
              setValorOriginal('');
              setValorRetificado('');
              setObservacoes('');
            }}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!motivo || !valorOriginal || !valorRetificado}
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
