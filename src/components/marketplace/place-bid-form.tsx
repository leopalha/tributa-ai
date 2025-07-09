import { useRouter } from '@/lib/router-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreditBids } from '@/hooks/use-credit-bids';

interface PlaceBidFormProps {
  credit: {
    id: string;
    title: string;
    value: number;
    status: string;
    listingPrice: number | null;
    owner: {
      id: string;
      name: string | null;
      email: string | null;
    };
  };
}

export function PlaceBidForm({ credit }: PlaceBidFormProps) {
  const router = useRouter();
  const { isLoading, handleBid } = useCreditBids({ creditId: credit.id });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const price = Number(formData.get('price'));

    if (!price || price <= 0) {
      return;
    }

    await handleBid({
      price,
      type: credit.status === 'LISTED_FOR_SALE' ? 'DIRECT' : 'AUCTION',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fazer Lance</CardTitle>
        <CardDescription>Envie sua proposta para este crédito</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Título do Crédito</Label>
            <Input value={credit.title} disabled />
          </div>
          <div className="space-y-2">
            <Label>Valor Nominal</Label>
            <Input
              value={new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(credit.value)}
              disabled
            />
          </div>
          {credit.listingPrice && (
            <div className="space-y-2">
              <Label>Preço de Listagem</Label>
              <Input
                value={new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(credit.listingPrice)}
                disabled
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="price">Valor do Lance</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="Digite o valor do seu lance"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar Lance'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
