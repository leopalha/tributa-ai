import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCreditHistory } from '@/hooks/use-credit-history';

interface CreditHistoryProps {
  creditId: string;
}

export function CreditHistory({ creditId }: CreditHistoryProps) {
  const { isLoading, fetchHistory } = useCreditHistory({ creditId });
  const [history, setHistory] = useState<
    Array<{
      id: string;
      type: string;
      status: string;
      price: number;
      createdAt: string;
      buyer: {
        id: string;
        name: string;
        email: string;
      };
      seller: {
        id: string;
        name: string;
        email: string;
      };
    }>
  >([]);

  useEffect(() => {
    const loadHistory = async () => {
      const data = await fetchHistory();
      setHistory(data);
    };

    loadHistory();
  }, [creditId, fetchHistory]);

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'default';
      case 'COMPLETED':
        return 'success';
      case 'FAILED':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getTransactionType = (type: string) => {
    switch (type) {
      case 'SALE':
        return 'Venda Direta';
      case 'AUCTION':
        return 'Leilão';
      case 'SETTLEMENT':
        return 'Liquidação';
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Transações</CardTitle>
        <CardDescription>Acompanhe todas as transações relacionadas a este crédito</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando histórico...</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma transação encontrada.</p>
        ) : (
          <div className="space-y-4">
            {history.map(entry => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={getBadgeVariant(entry.status)}>{entry.status}</Badge>
                    <Badge variant="outline">{getTransactionType(entry.type)}</Badge>
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">{entry.seller.name}</span>
                    {' → '}
                    <span className="font-medium">{entry.buyer.name}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(entry.price)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
