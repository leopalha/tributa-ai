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

interface ObrigacaoFiscalDarfDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: {
    codigoReceita: string;
    dataVencimento: string;
    valor: number;
    observacoes: string;
  }) => void;
}

export function ObrigacaoFiscalDarfDialog({
  open,
  onOpenChange,
  onConfirm,
}: ObrigacaoFiscalDarfDialogProps) {
  const [codigoReceita, setCodigoReceita] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [valor, setValor] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const handleConfirm = () => {
    onConfirm({
      codigoReceita,
      dataVencimento,
      valor: parseFloat(valor),
      observacoes,
    });
    setCodigoReceita('');
    setDataVencimento('');
    setValor('');
    setObservacoes('');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Gerar DARF</AlertDialogTitle>
          <AlertDialogDescription>Preencha os dados para geração do DARF.</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Código da Receita</label>
            <Input
              type="text"
              placeholder="Código da receita"
              value={codigoReceita}
              onChange={e => setCodigoReceita(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Data de Vencimento</label>
            <Input
              type="date"
              value={dataVencimento}
              onChange={e => setDataVencimento(e.target.value)}
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
              setCodigoReceita('');
              setDataVencimento('');
              setValor('');
              setObservacoes('');
            }}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!codigoReceita || !dataVencimento || !valor}
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
