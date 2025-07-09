import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMarketplace } from '@/hooks/use-marketplace';
import { Skeleton } from '@/components/ui/skeleton';

export function CreditList() {
  const { credits, isLoading, error } = useMarketplace();

  if (error) {
    return (
      <div className="text-center text-red-500">
        Erro ao carregar créditos. Por favor, tente novamente.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (credits.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        Nenhum crédito encontrado com os filtros selecionados.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {credits.map(credit => (
        <Card key={credit.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{credit.title}</CardTitle>
              <Badge variant={credit.status === 'LISTED_FOR_SALE' ? 'default' : 'secondary'}>
                {credit.status}
              </Badge>
            </div>
            <CardDescription>{credit.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Categoria</span>
                <span className="text-sm font-medium">{credit.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Subtipo</span>
                <span className="text-sm font-medium">{credit.subType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Valor Nominal</span>
                <span className="text-sm font-medium">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(credit.value)}
                </span>
              </div>
              {credit.listingPrice && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Preço de Listagem</span>
                  <span className="text-sm font-medium">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(credit.listingPrice)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Ver Detalhes</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
