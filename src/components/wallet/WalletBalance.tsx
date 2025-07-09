import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { WalletBalance as WalletBalanceType } from '@/types/wallet';
import { formatCurrency } from '@/utils/format';

interface WalletBalanceProps {
  balance: WalletBalanceType | null;
  loading: boolean;
}

export function WalletBalance({ balance, loading }: WalletBalanceProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Saldo Total</CardDescription>
          <CardTitle className="text-2xl font-bold">
            {loading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              formatCurrency(balance?.balance || 0)
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Saldo total disponível na sua carteira
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Disponível para Saque</CardDescription>
          <CardTitle className="text-2xl font-bold">
            {loading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              formatCurrency(balance?.availableBalance || 0)
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Valores já confirmados e disponíveis para uso
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Pendente</CardDescription>
          <CardTitle className="text-2xl font-bold">
            {loading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              formatCurrency(balance?.pendingBalance || 0)
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Valores em processamento ou aguardando confirmação
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 