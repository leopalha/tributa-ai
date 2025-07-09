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

interface ObrigacaoFiscalUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: { arquivo: File; descricao: string }) => void;
}

export function ObrigacaoFiscalUploadDialog({
  open,
  onOpenChange,
  onConfirm,
}: ObrigacaoFiscalUploadDialogProps) {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [descricao, setDescricao] = useState('');

  const handleConfirm = () => {
    if (arquivo) {
      onConfirm({
        arquivo,
        descricao,
      });
      setArquivo(null);
      setDescricao('');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Upload de Anexo</AlertDialogTitle>
          <AlertDialogDescription>
            Selecione o arquivo e adicione uma descrição.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Arquivo</label>
            <Input
              type="file"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  setArquivo(file);
                }
              }}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Descrição</label>
            <Textarea
              placeholder="Descrição do arquivo..."
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setArquivo(null);
              setDescricao('');
            }}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={!arquivo || !descricao}>
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
