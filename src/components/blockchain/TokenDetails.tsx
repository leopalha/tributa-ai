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
import { Progress } from '@/components/ui/progress';
import { Copy, CheckCircle, Coins, ExternalLink, Shield, Ban, Clock } from 'lucide-react';
import Link from '@/components/ui/custom-link';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface TokenDetailsProps {
  token: {
    id: string;
    name: string;
    symbol: string;
    address: string;
    standard: string;
    totalSupply: string;
    decimals: number;
    price?: number;
    value?: number;
    balance?: string;
    type?: string;
    status?: 'active' | 'frozen' | 'expired';
    issuerName?: string;
    issueDate?: string;
    expiryDate?: string;
    description?: string;
    category?: string;
    imageUrl?: string;
    tokenId?: string;
    blockchain?: string;
  } | null;
  isLoading?: boolean;
  className?: string;
  showActions?: boolean;
  onTransferClick?: () => void;
  onConvertClick?: () => void;
}

export function TokenDetails({
  token,
  isLoading = false,
  className,
  showActions = true,
  onTransferClick,
  onConvertClick,
}: TokenDetailsProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    switch (status) {
      case 'active':
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
          >
            <Shield className="h-3 w-3 mr-1" />
            Ativo
          </Badge>
        );
      case 'frozen':
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
          >
            <Ban className="h-3 w-3 mr-1" />
            Congelado
          </Badge>
        );
      case 'expired':
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
          >
            <Clock className="h-3 w-3 mr-1" />
            Expirado
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-8 w-40 mb-2" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-28" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-28" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-28" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!token) {
    return (
      <Card className={className}>
        <CardContent className="py-6 text-center">
          <Coins className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <CardTitle className="mb-2">Token não encontrado</CardTitle>
          <CardDescription>Não foi possível obter os detalhes deste token</CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {token.imageUrl ? (
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={token.imageUrl} alt={token.name} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Coins className="h-5 w-5 text-primary" />
              </div>
            )}
            <div>
              <CardTitle>{token.name}</CardTitle>
              <CardDescription className="flex items-center">
                <span className="font-mono mr-2">{token.symbol}</span>
                {getStatusBadge(token.status)}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline">{token.standard}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {token.description && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Descrição</h3>
            <p>{token.description}</p>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Endereço do Token</h3>
          <div className="flex items-center space-x-2">
            <code className="bg-muted p-1.5 rounded text-xs break-all block max-w-full">
              {token.address}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => copyToClipboard(token.address, 'address')}
            >
              {copied === 'address' ? (
                <CheckCircle className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Supply Total</h3>
            <p className="font-medium">
              {parseInt(token.totalSupply).toLocaleString()} {token.symbol}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Decimais</h3>
            <p className="font-medium">{token.decimals}</p>
          </div>

          {token.category && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Categoria</h3>
              <p className="font-medium">{token.category}</p>
            </div>
          )}

          {token.issuerName && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Emissor</h3>
              <p className="font-medium">{token.issuerName}</p>
            </div>
          )}

          {token.blockchain && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Blockchain</h3>
              <p className="font-medium">{token.blockchain}</p>
            </div>
          )}

          {token.issueDate && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Data de Emissão</h3>
              <p className="font-medium">{formatDate(token.issueDate)}</p>
            </div>
          )}

          {token.expiryDate && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Data de Expiração</h3>
              <p className="font-medium">{formatDate(token.expiryDate)}</p>
            </div>
          )}

          {token.value !== undefined && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Valor</h3>
              <p className="font-medium">{formatCurrency(token.value)}</p>
            </div>
          )}
        </div>

        {token.balance && (
          <>
            <Separator />

            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-medium">Seu Saldo</h3>
                <p className="text-sm text-muted-foreground">
                  {token.price && parseFloat(token.balance) * token.price > 0
                    ? formatCurrency(parseFloat(token.balance) * token.price)
                    : ''}
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="text-2xl font-bold">
                  {parseFloat(token.balance).toLocaleString()} {token.symbol}
                </div>

                <Progress
                  value={(parseFloat(token.balance) / parseInt(token.totalSupply)) * 100}
                  className="h-2"
                />

                <p className="text-xs text-muted-foreground">
                  {((parseFloat(token.balance) / parseInt(token.totalSupply)) * 100).toFixed(2)}% do
                  supply total
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className="flex gap-3 border-t pt-4">
          {onTransferClick && (
            <Button onClick={onTransferClick} className="flex-1">
              Transferir
            </Button>
          )}

          {onConvertClick && (
            <Button onClick={onConvertClick} variant="outline" className="flex-1">
              Converter
            </Button>
          )}

          <Button variant="outline" size="icon" asChild>
            <Link
              href={`https://polygonscan.com/token/${token.address}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
