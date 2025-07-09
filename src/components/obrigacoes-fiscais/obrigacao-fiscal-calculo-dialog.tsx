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

interface ObrigacaoFiscalCalculoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: {
    baseCalculo: number;
    aliquota: number;
    valor: number;
    observacoes: string;
  }) => void;
}

export function ObrigacaoFiscalCalculoDialog({
  open,
  onOpenChange,
  onConfirm,
}: ObrigacaoFiscalCalculoDialogProps) {
  const [baseCalculo, setBaseCalculo] = useState('');
  const [aliquota, setAliquota] = useState('');
  const [valor, setValor] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const handleConfirm = () => {
    onConfirm({
      baseCalculo: parseFloat(baseCalculo),
      aliquota: parseFloat(aliquota),
      valor: parseFloat(valor),
      observacoes,
    });
    setBaseCalculo('');
    setAliquota('');
    setValor('');
    setObservacoes('');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Calcular Impostos</AlertDialogTitle>
          <AlertDialogDescription>
            Preencha os dados para cálculo dos impostos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Base de Cálculo</label>
            <Input
              type="number"
              placeholder="0,00"
              value={baseCalculo}
              onChange={e => setBaseCalculo(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Alíquota (%)</label>
            <Input
              type="number"
              placeholder="0,00"
              value={aliquota}
              onChange={e => setAliquota(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Valor</label>
            <Input
              type="number"
              placeholder="0,00"
              value={valor}
              onChange={e => setValor(e.target.value)}
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
              setBaseCalculo('');
              setAliquota('');
              setValor('');
              setObservacoes('');
            }}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={!baseCalculo || !aliquota || !valor}>
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
