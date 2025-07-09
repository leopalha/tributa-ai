import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export function BlockchainStatus() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Status Blockchain</CardTitle>
        </div>
        <Shield className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-green-500">Online</div>
        <p className="text-xs text-muted-foreground mt-1">Última sincronização: 2 min atrás</p>
      </CardContent>
    </Card>
  );
}
