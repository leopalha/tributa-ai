import { useRouter } from '@/lib/router-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreditListing } from '@/hooks/use-credit-listing';

interface UnlistCreditFormProps {
  credit: {
    id: string;
    title: string;
    nominalValue: number;
    listingPrice: number | null;
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

export function UnlistCreditForm({ credit }: UnlistCreditFormProps) {
  const router = useRouter();
  const { isLoading, handleUnlist } = useCreditListing({ creditId: credit.id });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Remover Crédito da Listagem</CardTitle>
        <CardDescription>
          Confirme a remoção deste crédito da listagem do marketplace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
              }).format(credit.nominalValue)}
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label>Preço de Listagem</Label>
            <Input
              value={
                credit.listingPrice
                  ? new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(credit.listingPrice)
                  : 'Não listado'
              }
              disabled
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={handleUnlist} disabled={isLoading}>
              {isLoading ? 'Removendo...' : 'Remover da Listagem'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
