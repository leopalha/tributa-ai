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
import { ValidacaoObrigacao } from '@/types/obrigacao-fiscal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ObrigacaoFiscalValidacoesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  validacoes: ValidacaoObrigacao[];
}

export function ObrigacaoFiscalValidacoesDialog({
  open,
  onOpenChange,
  validacoes,
}: ObrigacaoFiscalValidacoesDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Validações da Obrigação</AlertDialogTitle>
          <AlertDialogDescription>
            Visualize as validações realizadas na obrigação.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            {validacoes.map(validacao => (
              <div key={validacao.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {validacao.aprovada ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <h3 className="font-medium">{validacao.tipo}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{validacao.descricao}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(validacao.data), 'dd/MM/yyyy HH:mm', {
                      locale: ptBR,
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{validacao.usuario}</p>
                  {validacao.observacoes && (
                    <p className="text-sm text-gray-500">{validacao.observacoes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Fechar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
