import React, { useState } from 'react';
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

interface ObrigacaoFiscalPagamentoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: {
    numero: string;
    valor: number;
    dataPagamento: string;
    observacoes?: string;
  }) => void;
}

export function ObrigacaoFiscalPagamentoDialog({
  open,
  onOpenChange,
  onConfirm,
}: ObrigacaoFiscalPagamentoDialogProps) {
  const [numero, setNumero] = useState('');
  const [valor, setValor] = useState('');
  const [dataPagamento, setDataPagamento] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const handleConfirm = () => {
    onConfirm({
      numero,
      valor: Number(valor),
      dataPagamento,
      observacoes: observacoes || undefined,
    });
    handleCancel();
  };

  const handleCancel = () => {
    setNumero('');
    setValor('');
    setDataPagamento('');
    setObservacoes('');
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Registrar Pagamento</AlertDialogTitle>
          <AlertDialogDescription>
            Preencha os dados do pagamento da obrigação fiscal.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <label htmlFor="numero" className="text-sm font-medium">
              Número do Comprovante
            </label>
            <Input
              id="numero"
              value={numero}
              onChange={e => setNumero(e.target.value)}
              placeholder="Digite o número do comprovante"
            />
          </div>
          <div>
            <label htmlFor="valor" className="text-sm font-medium">
              Valor
            </label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              value={valor}
              onChange={e => setValor(e.target.value)}
              placeholder="Digite o valor do pagamento"
            />
          </div>
          <div>
            <label htmlFor="dataPagamento" className="text-sm font-medium">
              Data do Pagamento
            </label>
            <Input
              id="dataPagamento"
              type="date"
              value={dataPagamento}
              onChange={e => setDataPagamento(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="observacoes" className="text-sm font-medium">
              Observações
            </label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={e => setObservacoes(e.target.value)}
              placeholder="Digite as observações do pagamento"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={!numero || !valor || !dataPagamento}>
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
