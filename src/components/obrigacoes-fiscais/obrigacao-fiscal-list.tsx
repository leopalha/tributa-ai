import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { ObrigacaoFiscal } from '@/types/obrigacao-fiscal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ObrigacaoFiscalListProps {
  obrigacoes: ObrigacaoFiscal[];
  onView: (obrigacao: ObrigacaoFiscal) => void;
  onEdit: (obrigacao: ObrigacaoFiscal) => void;
  onDelete: (obrigacao: ObrigacaoFiscal) => void;
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

export function ObrigacaoFiscalList({
  obrigacoes,
  onView,
  onEdit,
  onDelete,
}: ObrigacaoFiscalListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {obrigacoes.map(obrigacao => (
            <TableRow key={obrigacao.id}>
              <TableCell>{obrigacao.tipo}</TableCell>
              <TableCell>
                <Badge className={statusColors[obrigacao.status]} variant="secondary">
                  {statusLabels[obrigacao.status]}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(obrigacao.dataVencimento), 'dd/MM/yyyy', {
                  locale: ptBR,
                })}
              </TableCell>
              <TableCell>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(obrigacao.valor)}
              </TableCell>
              <TableCell>{obrigacao.responsavel || '-'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onView(obrigacao)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(obrigacao)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(obrigacao)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
