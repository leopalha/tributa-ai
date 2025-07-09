import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Coins } from 'lucide-react';

export function TokenBalance() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Saldo de Tokens</CardTitle>
        </div>
        <Coins className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">1,250 TCRED</div>
        <p className="text-xs text-muted-foreground mt-1">Equivalente a R$ 125.000,00</p>
      </CardContent>
    </Card>
  );
}
