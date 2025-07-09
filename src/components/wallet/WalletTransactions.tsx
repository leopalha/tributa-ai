import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Skeleton } from '@/components/ui/skeleton';
import { WalletTransaction, WalletTransactionType, WalletTransactionStatus } from '@/types/wallet';
import { formatCurrency } from '@/utils/format';
import {
  ArrowUpCircle,
  ArrowDownCircle,
  CreditCard,
  ShoppingCart,
  Tag,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';

interface WalletTransactionsProps {
  transactions: WalletTransaction[];
  loading: boolean;
}

export function WalletTransactions({ transactions, loading }: WalletTransactionsProps) {
  // Função para obter ícone baseado no tipo de transação
  const getTransactionIcon = (type: WalletTransactionType) => {
    switch (type) {
      case WalletTransactionType.DEPOSIT:
        return <ArrowDownCircle className="h-4 w-4 text-green-500" />;
      case WalletTransactionType.WITHDRAWAL:
        return <ArrowUpCircle className="h-4 w-4 text-orange-500" />;
      case WalletTransactionType.PLATFORM_FEE:
        return <Tag className="h-4 w-4 text-blue-500" />;
      case WalletTransactionType.PURCHASE:
        return <ShoppingCart className="h-4 w-4 text-purple-500" />;
      case WalletTransactionType.SALE:
        return <CreditCard className="h-4 w-4 text-indigo-500" />;
      case WalletTransactionType.REFUND:
        return <RotateCcw className="h-4 w-4 text-cyan-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  // Função para obter ícone baseado no status da transação
  const getStatusIcon = (status: WalletTransactionStatus) => {
    switch (status) {
      case WalletTransactionStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case WalletTransactionStatus.PENDING:
        return <Clock className="h-4 w-4 text-amber-500" />;
      case WalletTransactionStatus.FAILED:
        return <XCircle className="h-4 w-4 text-red-500" />;
      case WalletTransactionStatus.CANCELLED:
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  // Função para obter badge baseado no status da transação
  const getStatusBadge = (status: WalletTransactionStatus) => {
    switch (status) {
      case WalletTransactionStatus.COMPLETED:
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Concluída</Badge>;
      case WalletTransactionStatus.PENDING:
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pendente</Badge>;
      case WalletTransactionStatus.FAILED:
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Falha</Badge>;
      case WalletTransactionStatus.CANCELLED:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Cancelada</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  // Função para formatar o tipo de transação
  const formatTransactionType = (type: WalletTransactionType) => {
    switch (type) {
      case WalletTransactionType.DEPOSIT:
        return 'Depósito';
      case WalletTransactionType.WITHDRAWAL:
        return 'Saque';
      case WalletTransactionType.PLATFORM_FEE:
        return 'Taxa da Plataforma';
      case WalletTransactionType.PURCHASE:
        return 'Compra';
      case WalletTransactionType.SALE:
        return 'Venda';
      case WalletTransactionType.REFUND:
        return 'Reembolso';
      case WalletTransactionType.ADJUSTMENT:
        return 'Ajuste';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Transações</CardTitle>
        <CardDescription>Suas últimas movimentações financeiras</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            <p>Nenhuma transação encontrada.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTransactionIcon(transaction.type)}
                      <span>{formatTransactionType(transaction.type)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    {new Date(transaction.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell className={
                    transaction.type === WalletTransactionType.DEPOSIT || 
                    transaction.type === WalletTransactionType.SALE || 
                    transaction.type === WalletTransactionType.REFUND
                      ? 'text-green-600 font-medium'
                      : 'text-red-600 font-medium'
                  }>
                    {(transaction.type === WalletTransactionType.DEPOSIT || 
                      transaction.type === WalletTransactionType.SALE || 
                      transaction.type === WalletTransactionType.REFUND) 
                      ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(transaction.status)}
                      {getStatusBadge(transaction.status)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      {transactions.length > 0 && (
        <CardFooter className="flex justify-center border-t px-6 py-4">
          <Button variant="outline">Carregar Mais</Button>
        </CardFooter>
      )}
    </Card>
  );
}