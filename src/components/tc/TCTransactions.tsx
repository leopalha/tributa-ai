"use client";

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TC, Transaction, TransactionType, TransactionStatus } from '@/types/tc';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowUpDown, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { tcService } from '@/services/tc.service';
import { Badge } from '@/components/ui/badge';
import { TituloDeCredito, TCTransaction, TCTransactionType, TCTransactionStatus } from '@/types/tc';

interface TCTransactionsProps {
  tc: TituloDeCredito;
  transactions: TCTransaction[];
}

export function TCTransactions({ tc, transactions }: TCTransactionsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState<keyof Transaction>('dataTransacao');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<TransactionType | ''>('');
  const [filterStatus, setFilterStatus] = useState<TransactionStatus | ''>('');

  useEffect(() => {
    if (tc) {
      loadTransactions();
    }
  }, [tc]);

  const loadTransactions = async () => {
    if (!tc) return;
    
    try {
      setLoading(true);
      if (tc.transacoes && tc.transacoes.length > 0) {
        setTransactions(tc.transacoes);
      } else {
        const data = await tcService.obterTransacoes(tc.id);
        setTransactions(data);
      }
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: keyof Transaction) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleCancel = async (transactionId: string) => {
    if (!tc) return;
    
    try {
      await tcService.cancelarTransacao(tc.id, transactionId);
      await loadTransactions();
      toast({
        title: "Transação cancelada",
        description: "A transação foi cancelada com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao cancelar transação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível cancelar a transação.",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: TransactionStatus) => {
  switch (status) {
      case 'CONCLUIDA':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'CANCELADA':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'REJEITADA':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTransactionTypeLabel = (type: TransactionType) => {
    const labels: Record<TransactionType, string> = {
      'COMPENSACAO': 'Compensação',
      'TRANSFERENCIA': 'Transferência',
      'VENDA': 'Venda',
      'CANCELAMENTO': 'Cancelamento'
    };
    return labels[type] || type;
  };

  const getTransactionTypeColor = (type: TCTransactionType) => {
    switch (type) {
      case 'COMPENSACAO':
        return 'bg-blue-100 text-blue-800';
      case 'TRANSFERENCIA':
        return 'bg-purple-100 text-purple-800';
      case 'VENDA':
      return 'bg-green-100 text-green-800';
      case 'CANCELAMENTO':
      return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
  }
};

  const getTransactionStatusColor = (status: TCTransactionStatus) => {
  switch (status) {
      case 'PENDENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONCLUIDA':
        return 'bg-green-100 text-green-800';
      case 'CANCELADA':
        return 'bg-red-100 text-red-800';
      case 'REJEITADA':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAndSortedTransactions = transactions
    .filter(t => !filterType || t.tipo === filterType)
    .filter(t => !filterStatus || t.status === filterStatus)
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * direction;
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * direction;
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return (aValue.getTime() - bValue.getTime()) * direction;
      }
      
      return 0;
    });

  if (!tc) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center">
            <h3 className="text-lg font-medium">Selecione um título de crédito</h3>
            <p className="text-muted-foreground">
              Para visualizar as transações, selecione um TC na lista
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <Select
            value={filterType}
            onValueChange={(value) => setFilterType(value as TransactionType | '')}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os tipos</SelectItem>
              <SelectItem value="EMISSAO">Emissão</SelectItem>
              <SelectItem value="COMPRA">Compra</SelectItem>
              <SelectItem value="VENDA">Venda</SelectItem>
              <SelectItem value="COMPENSACAO_DIRETA">Compensação Direta</SelectItem>
              <SelectItem value="COMPENSACAO_INDIRETA">Compensação Indireta</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterStatus}
            onValueChange={(value) => setFilterStatus(value as TransactionStatus | '')}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os status</SelectItem>
              <SelectItem value="PENDENTE">Pendente</SelectItem>
              <SelectItem value="CONCLUIDA">Concluída</SelectItem>
              <SelectItem value="CANCELADA">Cancelada</SelectItem>
              <SelectItem value="FALHA">Falha</SelectItem>
            </SelectContent>
          </Select>
                  </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Valor Líquido</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Carregando transações...
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Nenhuma transação encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.dataTransacao)}</TableCell>
                    <TableCell>
                      <Badge className={getTransactionTypeColor(transaction.tipo)}>
                        {transaction.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(transaction.valorTotal)}</TableCell>
                    <TableCell>{formatCurrency(transaction.valorLiquido)}</TableCell>
                    <TableCell>
                      <Badge className={getTransactionStatusColor(transaction.status)}>
                        {transaction.status}
                    </Badge>
                    </TableCell>
                    <TableCell>
                      {transaction.detalhesCompensacao && (
                        <div className="text-sm text-muted-foreground">
                          <p>Tributo: {transaction.detalhesCompensacao.tipoTributo}</p>
                          {transaction.detalhesCompensacao.numeroDebito && (
                            <p>Débito: {transaction.detalhesCompensacao.numeroDebito}</p>
                          )}
                          <p>Valor: {formatCurrency(transaction.detalhesCompensacao.valorDebito)}</p>
                          <p>Vencimento: {formatDate(transaction.detalhesCompensacao.dataVencimento)}</p>
                  </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
      </CardContent>
    </Card>
  );
} 