import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditTitle } from '@prisma/client';
import { useSession } from '../../hooks/useSession';
import { useRouter } from '@/lib/router-utils';
import { useCreditListing } from '@/hooks/use-credit-listing';

interface CreditActionsProps {
  credit: {
    id: string;
    status: string;
    issuer: {
      id: string;
      name: string;
      email: string;
    };
    owner: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export function CreditActions({ credit }: CreditActionsProps) {
  const { user } = useSession();
  const router = useRouter();
  const { isLoading, handleUnlist } = useCreditListing({ creditId: credit.id });

  const isOwner = user?.id === credit.owner.id;
  const isIssuer = user?.id === credit.issuer.id;

  const handleBuy = async () => {
    router.push(`/marketplace/${credit.id}/buy`);
  };

  const handleAuction = async () => {
    router.push(`/marketplace/${credit.id}/auction`);
  };

  const handleSettlement = async () => {
    router.push(`/marketplace/${credit.id}/settlement`);
  };

  const handleList = async () => {
    router.push(`/marketplace/${credit.id}/list`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações</CardTitle>
        <CardDescription>
          {isOwner
            ? 'Gerencie seu crédito'
            : isIssuer
              ? 'Ações disponíveis para o emissor'
              : 'Ações disponíveis para compradores'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {!isOwner && credit.status === 'LISTED_FOR_SALE' && (
          <Button className="w-full" onClick={handleBuy}>
            Comprar Crédito
          </Button>
        )}

        {!isOwner && credit.status === 'IN_AUCTION' && (
          <Button className="w-full" onClick={handleAuction}>
            Participar do Leilão
          </Button>
        )}

        {!isOwner && credit.status === 'IN_SETTLEMENT' && (
          <Button className="w-full" onClick={handleSettlement}>
            Propor Liquidação
          </Button>
        )}

        {isOwner && credit.status === 'TOKENIZED' && (
          <Button className="w-full" onClick={handleList}>
            Listar para Venda
          </Button>
        )}

        {isOwner && credit.status === 'LISTED_FOR_SALE' && (
          <Button
            className="w-full"
            variant="destructive"
            onClick={handleUnlist}
            disabled={isLoading}
          >
            {isLoading ? 'Removendo...' : 'Remover da Listagem'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
