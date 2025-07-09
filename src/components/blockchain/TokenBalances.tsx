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
import { Input } from '@/components/ui/input';
import { Search, ChevronUp, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from '@/components/ui/custom-link';
import Image from '@/components/ui/custom-image';

export interface Token {
  id: string;
  symbol: string;
  name: string;
  balance: string;
  valueInReais: number;
  contractAddress: string;
  iconUrl?: string;
}

interface TokenBalancesProps {
  tokens?: Token[];
  isLoading?: boolean;
  limit?: number;
  showAll?: boolean;
}

export function TokenBalances({
  tokens = [],
  isLoading = false,
  limit = 5,
  showAll = false,
}: TokenBalancesProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tokens based on search query
  const filteredTokens = tokens.filter(
    token =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Display limited tokens or all tokens based on props
  const displayTokens = showAll ? filteredTokens : filteredTokens.slice(0, limit);

  // Calculate total value in Reais
  const totalValueInReais = tokens.reduce((sum, token) => sum + token.valueInReais, 0);

  // Format currency to BRL
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Format token balance with symbol
  const formatTokenBalance = (balance: string, symbol: string) => {
    return `${balance} ${symbol}`;
  };

  // Truncate address for display
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Saldo de Tokens</CardTitle>
        <CardDescription>Visualize seus tokens e seus valores atuais</CardDescription>
      </CardHeader>
      <CardContent>
        {showAll && (
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar tokens..."
                className="pl-8"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}

        {!isLoading && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b">
            <div>
              <div className="text-sm text-muted-foreground">Valor Total</div>
              <div className="text-2xl font-bold">{formatCurrency(totalValueInReais)}</div>
            </div>
            <div className="mt-2 sm:mt-0">
              <div className="text-sm text-muted-foreground text-right">Tokens</div>
              <div className="text-lg font-medium text-right">{tokens.length}</div>
            </div>
          </div>
        )}

        {isLoading ? (
          // Loading skeleton
          Array(3)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex items-center space-x-4 mb-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-4 w-[60px]" />
                </div>
              </div>
            ))
        ) : displayTokens.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              {searchQuery ? 'Nenhum token encontrado com essa busca' : 'Nenhum token encontrado'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayTokens.map(token => (
              <div
                key={token.id}
                className="flex items-center justify-between pb-4 border-b last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    {token.iconUrl ? (
                      <Image
                        src={token.iconUrl}
                        alt={token.symbol}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="font-bold text-sm">{token.symbol.substring(0, 2)}</div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{token.name}</div>
                    <Link
                      href={`/dashboard/blockchain/tokens/${token.contractAddress}`}
                      className="text-xs text-muted-foreground hover:underline flex items-center gap-1"
                    >
                      {truncateAddress(token.contractAddress)}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {formatTokenBalance(token.balance, token.symbol)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(token.valueInReais)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {!showAll && filteredTokens.length > limit && (
        <CardFooter className="pt-0">
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href="/dashboard/blockchain/tokens">
              Ver todos os tokens
              <ChevronUp className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
