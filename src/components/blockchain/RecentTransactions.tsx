import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  RotateCw,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from '@/components/ui/custom-link';

export interface Transaction {
  id: string;
  hash: string;
  sender: string;
  receiver: string;
  value: string;
  type: string;
  date: Date;
  status: string;
  blockNumber: number;
}

interface RecentTransactionsProps {
  transactions?: Transaction[];
  isLoading?: boolean;
  limit?: number;
  showPagination?: boolean;
}

export function RecentTransactions({
  transactions = [],
  isLoading = false,
  limit = 5,
  showPagination = false,
}: RecentTransactionsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(transactions.length / limit);

  const paginatedTransactions = transactions.slice((currentPage - 1) * limit, currentPage * limit);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get badge color based on transaction type
  const getTransactionBadgeVariant = (
    type: string
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (type.toLowerCase()) {
      case 'transferência':
        return 'default';
      case 'tokenização':
        return 'secondary';
      case 'compensação':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Format date to a readable string
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
        <CardDescription>Últimas transações realizadas na blockchain</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          // Loading skeleton
          Array(3)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex items-start space-x-4 mb-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))
        ) : transactions.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Nenhuma transação encontrada</p>
            <Button variant="outline" size="sm" className="mt-2">
              <RotateCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedTransactions.map(transaction => (
              <div
                key={transaction.id}
                className="flex flex-col space-y-2 pb-4 border-b last:border-b-0"
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Badge variant={getTransactionBadgeVariant(transaction.type)}>
                        {transaction.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                    <div className="mt-1">
                      <Link
                        href={`/dashboard/blockchain/transactions/${transaction.hash}`}
                        className="text-sm font-medium hover:underline flex items-center gap-1"
                      >
                        {transaction.hash.substring(0, 10)}...
                        {transaction.hash.substring(transaction.hash.length - 6)}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                  <div className="text-sm font-medium">{transaction.value}</div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    De: {transaction.sender}
                    <ArrowRight className="h-3 w-3" />
                    Para: {transaction.receiver}
                  </div>
                  <div>Bloco #{transaction.blockNumber}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {showPagination && transactions.length > 0 && (
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-xs text-muted-foreground">
            Mostrando {(currentPage - 1) * limit + 1} a{' '}
            {Math.min(currentPage * limit, transactions.length)} de {transactions.length} transações
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={handlePrevPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      )}
      {!showPagination && transactions.length > 0 && (
        <CardFooter className="pt-0">
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href="/dashboard/blockchain/transactions">
              Ver todas as transações
              <ChevronUp className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
