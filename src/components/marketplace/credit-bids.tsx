import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSession } from '../../hooks/useSession';
import { useRouter } from '@/lib/router-utils';
import { useCreditBids } from '@/hooks/use-credit-bids';

interface CreditBidsProps {
  credit: {
    id: string;
    status: string;
    owner: {
      id: string;
    };
  };
  bids: Array<{
    id: string;
    price: number;
    type: string;
    status: string;
    createdAt: string;
    buyer: {
      id: string;
      name: string | null;
      email: string | null;
    };
  }>;
}

export function CreditBids({ credit, bids }: CreditBidsProps) {
  const { user } = useSession();
  const router = useRouter();
  const { isLoading, handleAcceptBid, handleRejectBid } = useCreditBids({ creditId: credit.id });

  const isOwner = user?.id === credit.owner.id;

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'default';
      case 'ACCEPTED':
        return 'success';
      case 'REJECTED':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getBidType = (type: string) => {
    switch (type) {
      case 'DIRECT':
        return 'Venda Direta';
      case 'AUCTION':
        return 'Leilão';
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Lances</CardTitle>
            <CardDescription>Acompanhe os lances recebidos para este crédito</CardDescription>
          </div>
          {!isOwner && (credit.status === 'LISTED_FOR_SALE' || credit.status === 'IN_AUCTION') && (
            <Button onClick={() => router.push(`/marketplace/${credit.id}/bid`)}>
              Fazer Lance
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {bids.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum lance encontrado.</p>
        ) : (
          <div className="space-y-4">
            {bids.map(bid => (
              <div key={bid.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={getBadgeVariant(bid.status)}>{bid.status}</Badge>
                    <Badge variant="outline">{getBidType(bid.type)}</Badge>
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">{bid.buyer.name}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(bid.price)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(bid.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                {isOwner && bid.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRejectBid(bid.id)}
                      disabled={isLoading}
                    >
                      Rejeitar
                    </Button>
                    <Button size="sm" onClick={() => handleAcceptBid(bid.id)} disabled={isLoading}>
                      Aceitar
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
