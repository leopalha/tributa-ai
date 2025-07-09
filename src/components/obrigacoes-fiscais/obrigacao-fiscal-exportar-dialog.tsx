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
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface ObrigacaoFiscalExportarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: { formato: 'csv' | 'xlsx'; dataInicio?: string; dataFim?: string }) => void;
}

export function ObrigacaoFiscalExportarDialog({
  open,
  onOpenChange,
  onConfirm,
}: ObrigacaoFiscalExportarDialogProps) {
  const [formato, setFormato] = useState<'csv' | 'xlsx'>('csv');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const handleConfirm = () => {
    onConfirm({
      formato,
      dataInicio: dataInicio || undefined,
      dataFim: dataFim || undefined,
    });
    handleCancel();
  };

  const handleCancel = () => {
    setFormato('csv');
    setDataInicio('');
    setDataFim('');
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Exportar Obrigações Fiscais</AlertDialogTitle>
          <AlertDialogDescription>
            Selecione as opções para exportação das obrigações fiscais.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <label htmlFor="formato" className="text-sm font-medium">
              Formato
            </label>
            <Select
              id="formato"
              value={formato}
              onValueChange={value => setFormato(value as 'csv' | 'xlsx')}
            >
              <option value="csv">CSV</option>
              <option value="xlsx">XLSX</option>
            </Select>
          </div>
          <div>
            <label htmlFor="dataInicio" className="text-sm font-medium">
              Data Inicial
            </label>
            <Input
              id="dataInicio"
              type="date"
              value={dataInicio}
              onChange={e => setDataInicio(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="dataFim" className="text-sm font-medium">
              Data Final
            </label>
            <Input
              id="dataFim"
              type="date"
              value={dataFim}
              onChange={e => setDataFim(e.target.value)}
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Exportar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
