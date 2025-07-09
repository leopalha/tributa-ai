import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { ArrowDownToLine, ArrowUpFromLine, ArrowRightLeft } from 'lucide-react';

interface Transaction {
  id: string;
  type: string;
  date: Date;
  amount: string;
  status: string;
  from?: string;
  to?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export function TransactionList({ transactions, isLoading = false }: TransactionListProps) {
  const getTransactionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'entrada':
        return <ArrowDownToLine className="h-4 w-4 text-green-500" />;
      case 'saída':
        return <ArrowUpFromLine className="h-4 w-4 text-red-500" />;
      default:
        return <ArrowRightLeft className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Transações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="p-4 text-center">Carregando transações...</div>
        ) : transactions.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">Nenhuma transação encontrada</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map(transaction => (
                  <TableRow key={transaction.id}>
                    <TableCell className="flex items-center gap-2">
                      {getTransactionIcon(transaction.type)}
                      {transaction.type}
                    </TableCell>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{transaction.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
