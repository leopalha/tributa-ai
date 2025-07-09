import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ObrigacaoFiscal } from '@/types/obrigacao-fiscal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Pencil, Trash2 } from 'lucide-react';

interface ObrigacaoFiscalViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  obrigacao: ObrigacaoFiscal | null;
  onEdit: () => void;
  onDelete: () => void;
}

const statusColors: Record<string, string> = {
  declaracao_pendente: 'bg-yellow-100 text-yellow-800',
  declaracao_em_andamento: 'bg-blue-100 text-blue-800',
  declaracao_concluida: 'bg-green-100 text-green-800',
  declaracao_atrasada: 'bg-red-100 text-red-800',
  declaracao_cancelada: 'bg-gray-100 text-gray-800',
};

const statusLabels: Record<string, string> = {
  declaracao_pendente: 'Pendente',
  declaracao_em_andamento: 'Em Andamento',
  declaracao_concluida: 'Concluída',
  declaracao_atrasada: 'Atrasada',
  declaracao_cancelada: 'Cancelada',
};

export function ObrigacaoFiscalView({
  open,
  onOpenChange,
  obrigacao,
  onEdit,
  onDelete,
}: ObrigacaoFiscalViewProps) {
  if (!obrigacao) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detalhes da Obrigação</DialogTitle>
          <DialogDescription>Visualize os detalhes da obrigação fiscal.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">Tipo</h3>
            <p className="text-sm text-gray-500">{obrigacao.tipo}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Status</h3>
            <Badge className={statusColors[obrigacao.status]} variant="secondary">
              {statusLabels[obrigacao.status]}
            </Badge>
          </div>
          <div>
            <h3 className="text-sm font-medium">Data de Vencimento</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(obrigacao.dataVencimento), 'dd/MM/yyyy', {
                locale: ptBR,
              })}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Valor</h3>
            <p className="text-sm text-gray-500">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(obrigacao.valor)}
            </p>
          </div>
          {obrigacao.descricao && (
            <div>
              <h3 className="text-sm font-medium">Descrição</h3>
              <p className="text-sm text-gray-500">{obrigacao.descricao}</p>
            </div>
          )}
          {obrigacao.observacoes && (
            <div>
              <h3 className="text-sm font-medium">Observações</h3>
              <p className="text-sm text-gray-500">{obrigacao.observacoes}</p>
            </div>
          )}
          {obrigacao.responsavel && (
            <div>
              <h3 className="text-sm font-medium">Responsável</h3>
              <p className="text-sm text-gray-500">{obrigacao.responsavel}</p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium">Data de Criação</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(obrigacao.createdAt), 'dd/MM/yyyy HH:mm', {
                locale: ptBR,
              })}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Última Atualização</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(obrigacao.updatedAt), 'dd/MM/yyyy HH:mm', {
                locale: ptBR,
              })}
            </p>
          </div>
        </div>
        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
