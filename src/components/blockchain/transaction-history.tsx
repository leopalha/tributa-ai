import React from 'react';
import { Badge } from '@/components/ui/badge';

type Transaction = {
  id: string;
  type: 'entrada' | 'saida';
  amount: string;
  date: string;
  status: 'success' | 'pending' | 'failed';
};

export function TransactionHistory() {
  // Dados de exemplo
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'entrada',
      amount: '500 TCRED',
      date: '2025-04-28T14:30:00',
      status: 'success',
    },
    {
      id: '2',
      type: 'saida',
      amount: '150 TCRED',
      date: '2025-04-27T10:15:00',
      status: 'success',
    },
    {
      id: '3',
      type: 'entrada',
      amount: '300 TCRED',
      date: '2025-04-26T09:45:00',
      status: 'pending',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="success">Concluído</Badge>;
      case 'pending':
        return <Badge variant="outline">Pendente</Badge>;
      case 'failed':
        return <Badge variant="destructive">Falhou</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {transactions.length === 0 ? (
        <p className="text-sm text-center text-muted-foreground py-4">
          Nenhuma transação encontrada
        </p>
      ) : (
        <div className="space-y-4">
          {transactions.map(transaction => (
            <div
              key={transaction.id}
              className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800"
            >
              <div className="flex flex-col">
                <span className="font-medium">{transaction.amount}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(transaction.date)}
                </span>
              </div>
              <div className="flex items-center">{getStatusBadge(transaction.status)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
