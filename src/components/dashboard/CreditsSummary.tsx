import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  FileText,
  ArrowUpRight,
  AlertCircle,
  Percent,
  CreditCard,
  TrendingUp,
} from 'lucide-react';
import Link from '@/components/ui/custom-link';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';

interface CreditSummary {
  totalCredits: number;
  totalValue: number;
  pendingValidation: number;
  validatedCredits: number;
  tokenizedCredits: number;
  listedForSale: number;
  topCategories: Array<{
    category: string;
    count: number;
    value: number;
  }>;
}

export function CreditsSummary() {
  const [creditData, setCreditData] = useState<CreditSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCreditData = async () => {
      try {
        // Em um cenário real, isso buscaria dados da API
        // const response = await fetch('/api/credits/summary');
        // const data = await response.json();

        // Usando dados de exemplo por enquanto
        const mockData: CreditSummary = {
          totalCredits: 48,
          totalValue: 1250000,
          pendingValidation: 8,
          validatedCredits: 32,
          tokenizedCredits: 24,
          listedForSale: 16,
          topCategories: [
            { category: 'TRIBUTARIO', count: 24, value: 750000 },
            { category: 'COMERCIAL', count: 12, value: 300000 },
            { category: 'JUDICIAL', count: 8, value: 150000 },
            { category: 'FINANCEIRO', count: 4, value: 50000 },
          ],
        };

        // Simular tempo de carregamento
        setTimeout(() => {
          setCreditData(mockData);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Erro ao carregar dados de créditos:', error);
        setError('Falha ao carregar os dados de créditos. Tente novamente mais tarde.');
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível carregar o resumo de créditos.',
        });
        setLoading(false);
      }
    };

    fetchCreditData();
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
          <CardTitle>Resumo de Créditos</CardTitle>
          <CardDescription>Visão geral dos seus créditos registrados</CardDescription>
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

  if (!creditData) {
    return null;
  }

  const tokenizationProgress =
    Math.round((creditData.tokenizedCredits / creditData.validatedCredits) * 100) || 0;

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Créditos Tributários</CardTitle>
        </div>
        <Link href="/dashboard/creditos/novo">
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Novo
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Total de Créditos</span>
            <span className="text-2xl font-bold">{formatCurrency(creditData.totalCredits)}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Disponíveis</span>
              <span className="text-xl font-semibold">
                {formatCurrency(creditData.totalValue - creditData.pendingValidation * 150000)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Pendentes</span>
              <span className="text-xl font-semibold">
                {formatCurrency(creditData.pendingValidation * 150000)}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Link href="/dashboard/creditos">
              <Button variant="link" className="p-0 h-auto">
                Ver Todos os Créditos
                <TrendingUp className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
