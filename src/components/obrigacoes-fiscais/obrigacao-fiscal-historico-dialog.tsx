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
import { HistoricoObrigacao } from '@/types/obrigacao-fiscal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ObrigacaoFiscalHistoricoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  historico: HistoricoObrigacao[];
}

export function ObrigacaoFiscalHistoricoDialog({
  open,
  onOpenChange,
  historico,
}: ObrigacaoFiscalHistoricoDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Histórico da Obrigação</AlertDialogTitle>
          <AlertDialogDescription>
            Visualize o histórico de alterações da obrigação.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            {historico.map(item => (
              <div key={item.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{item.acao}</h3>
                  <p className="text-sm text-gray-500">{item.descricao}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(item.data), 'dd/MM/yyyy HH:mm', {
                      locale: ptBR,
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{item.usuario}</p>
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
