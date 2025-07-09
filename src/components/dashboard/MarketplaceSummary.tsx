import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, TrendingUp, Clock, Tag, AlertCircle, ShoppingCart } from 'lucide-react';
import Link from '@/components/ui/custom-link';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';

interface MarketSummary {
  totalListings: number;
  activeAuctions: number;
  directSales: number;
  averageDiscount: number;
  totalVolume: number;
  recentTransactions: Array<{
    id: string;
    type: string;
    title: string;
    value: number;
    date: string;
  }>;
}

export function MarketplaceSummary() {
  const [marketData, setMarketData] = useState<MarketSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // Em um cenário real, isso buscaria dados da API
        // const response = await fetch('/api/marketplace/summary');
        // const data = await response.json();

        // Usando dados de exemplo por enquanto
        const mockData: MarketSummary = {
          totalListings: 32,
          activeAuctions: 12,
          directSales: 20,
          averageDiscount: 15,
          totalVolume: 875000,
          recentTransactions: [
            {
              id: 'trans-1',
              type: 'LEILAO',
              title: 'Crédito Tributário ICMS',
              value: 125000,
              date: '2023-06-10',
            },
            {
              id: 'trans-2',
              type: 'VENDA_DIRETA',
              title: 'Crédito Tributário COFINS',
              value: 85000,
              date: '2023-06-08',
            },
            {
              id: 'trans-3',
              type: 'VENDA_DIRETA',
              title: 'Precatório Federal',
              value: 230000,
              date: '2023-06-05',
            },
          ],
        };

        // Simular tempo de carregamento
        setTimeout(() => {
          setMarketData(mockData);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Erro ao carregar dados do marketplace:', error);
        setError('Falha ao carregar os dados do marketplace. Tente novamente mais tarde.');
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível carregar o resumo do marketplace.',
        });
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [toast]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[350px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-[200px]" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Marketplace</CardTitle>
          <CardDescription>Atividade recente de negociação</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive/80" />
            <p className="mt-4 text-muted-foreground">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!marketData) {
    return null;
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <ShoppingCart className="mr-2 h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Marketplace</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Volume Negociado</span>
            <span className="text-2xl font-bold">{formatCurrency(marketData.totalVolume)}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Anúncios Ativos</span>
              <span className="text-xl font-semibold">{marketData.totalListings}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Preço Médio</span>
              <span className="text-xl font-semibold">
                {formatCurrency(marketData.totalVolume / marketData.totalListings)}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Link href="/dashboard/marketplace">
              <Button variant="link" className="p-0 h-auto">
                Explorar Marketplace
                <TrendingUp className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
