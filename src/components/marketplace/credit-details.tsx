import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditTitle, CreditCategory, CreditStatus } from '@prisma/client';

interface CreditDetailsProps {
  credit: CreditTitle & {
    issuer: {
      id: string;
      name: string | null;
      email: string | null;
    };
    owner: {
      id: string;
      name: string | null;
      email: string | null;
    };
  };
}

export function CreditDetails({ credit }: CreditDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Título de Crédito #{credit.id.slice(-8)}</CardTitle>
            <CardDescription>Categoria: {credit.category}</CardDescription>
          </div>
          <Badge variant={credit.status === 'LISTED_FOR_SALE' ? 'default' : 'secondary'}>
            {credit.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Informações Básicas</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Categoria</span>
                  <span className="text-sm font-medium">{credit.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="text-sm font-medium">{credit.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Valor Nominal</span>
                  <span className="text-sm font-medium">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(credit.valueNominal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Valor Atual</span>
                  <span className="text-sm font-medium">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(credit.valueCurrent)}
                  </span>
                </div>

                {credit.isListed && credit.listingPrice && (
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
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Datas</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Data de Emissão</span>
                  <span className="text-sm font-medium">
                    {new Intl.DateTimeFormat('pt-BR').format(credit.issueDate)}
                  </span>
                </div>
                {credit.expiryDate && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Data de Vencimento</span>
                    <span className="text-sm font-medium">
                      {new Intl.DateTimeFormat('pt-BR').format(credit.expiryDate)}
                    </span>
                  </div>
                )}
                {credit.listingDate && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Data de Listagem</span>
                    <span className="text-sm font-medium">
                      {new Intl.DateTimeFormat('pt-BR').format(credit.listingDate)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Emissor</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Nome</span>
                  <span className="text-sm font-medium">{credit.issuer.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm font-medium">{credit.issuer.email || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Proprietário Atual</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Nome</span>
                  <span className="text-sm font-medium">{credit.owner.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm font-medium">{credit.owner.email || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Informações de Tokenização */}
            {credit.tokenId && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Tokenização</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Token ID</span>
                    <span className="text-sm font-medium font-mono">{credit.tokenId}</span>
                  </div>
                  {credit.tokenStandard && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Padrão</span>
                      <span className="text-sm font-medium">{credit.tokenStandard}</span>
                    </div>
                  )}
                  {credit.blockchainTxHash && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">TX Hash</span>
                      <span className="text-sm font-medium font-mono truncate">
                        {credit.blockchainTxHash.slice(0, 10)}...{credit.blockchainTxHash.slice(-6)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
