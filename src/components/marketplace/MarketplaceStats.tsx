import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUp,
  ArrowDown,
  BarChart,
  LineChart,
  PieChart,
  BarChart2 as BarChart3,
  Users,
  Banknote,
  ArrowUpRight,
  BadgeDollarSign,
  CreditCard,
  FileText,
  Home,
  Building,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCategory } from '@/types/credit-types';
import { cn } from '@/lib/utils';

// Format number function
function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

// Interface for marketplace statistics v1
export interface MarketplaceStatProps {
  statistics: MarketplaceStatistics;
  className?: string;
}

// Interface for marketplace statistics v1
export interface MarketplaceStatistics {
  totalCredits: number;
  totalValue: number;
  availableOffers: number;
  tokenizedCredits: number;
  tradingVolume: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  creditsByCategory: Record<
    CreditCategory,
    {
      count: number;
      value: number;
      percentageChange: number;
    }
  >;
  recentTransactions: {
    count: number;
    value: number;
    percentageChange: number;
  };
  popularCategories: Array<{
    category: CreditCategory;
    percentage: number;
  }>;
  tradingTrend: Array<{
    date: string;
    volume: number;
  }>;
}

// Category icons mapping
const categoryIcons = {
  [CreditCategory.TRIBUTARIO]: <BarChart className="h-5 w-5" />,
  [CreditCategory.COMERCIAL]: <CreditCard className="h-5 w-5" />,
  [CreditCategory.FINANCEIRO]: <BadgeDollarSign className="h-5 w-5" />,
  [CreditCategory.JUDICIAL]: <FileText className="h-5 w-5" />,
  [CreditCategory.RURAL]: <BarChart className="h-5 w-5" />,
  [CreditCategory.IMOBILIARIO]: <Home className="h-5 w-5" />,
  [CreditCategory.AMBIENTAL]: <BarChart className="h-5 w-5" />,
  [CreditCategory.ESPECIAL]: <Building className="h-5 w-5" />,
};

// Category labels mapping
const categoryLabels = {
  [CreditCategory.TRIBUTARIO]: 'Tributários',
  [CreditCategory.COMERCIAL]: 'Comerciais',
  [CreditCategory.FINANCEIRO]: 'Financeiros',
  [CreditCategory.JUDICIAL]: 'Judiciais',
  [CreditCategory.RURAL]: 'Rurais',
  [CreditCategory.IMOBILIARIO]: 'Imobiliários',
  [CreditCategory.AMBIENTAL]: 'Ambientais',
  [CreditCategory.ESPECIAL]: 'Especiais',
};

// Version 1 component
export function MarketplaceStatsV1({ statistics, className }: MarketplaceStatProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Créditos no Marketplace</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalCredits}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(statistics.totalValue)} em valor total
            </p>
            <div className="mt-4 h-1 w-full rounded-full bg-secondary">
              <div
                className="h-1 rounded-full bg-primary"
                style={{
                  width: `${Math.min((statistics.tokenizedCredits / statistics.totalCredits) * 100, 100)}%`,
                }}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {statistics.tokenizedCredits} créditos tokenizados (
              {Math.round((statistics.tokenizedCredits / statistics.totalCredits) * 100)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ofertas Disponíveis</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.availableOffers}</div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Novos Hoje: 12
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                325 interessados
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Volume de Negociação</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(statistics.tradingVolume.monthly)}
            </div>
            <div className="flex items-center pt-1">
              <span className="text-muted-foreground text-xs">Este Mês</span>
              <span className="ml-2 flex items-center text-xs text-green-500">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +15.3%
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs font-medium">Hoje</p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(statistics.tradingVolume.daily)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium">Semana</p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(statistics.tradingVolume.weekly)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium">Mês</p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(statistics.tradingVolume.monthly)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transações Recentes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.recentTransactions.count}</div>
            <div className="flex items-center pt-1">
              <p className="text-xs text-muted-foreground">
                {formatCurrency(statistics.recentTransactions.value)} negociados
              </p>
              <span
                className={cn(
                  'ml-2 flex items-center text-xs',
                  statistics.recentTransactions.percentageChange >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                )}
              >
                {statistics.recentTransactions.percentageChange >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowUpRight className="h-3 w-3 mr-1 rotate-180" />
                )}
                {statistics.recentTransactions.percentageChange >= 0 ? '+' : ''}
                {statistics.recentTransactions.percentageChange}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Distribuição por Categorias</CardTitle>
            <CardDescription>Proporção de créditos por categoria no marketplace</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="space-y-4">
              {statistics.popularCategories.map(item => (
                <div key={item.category} className="flex items-center">
                  <div className="w-8 mr-3">{categoryIcons[item.category]}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        Créditos {categoryLabels[item.category]}
                      </p>
                      <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                    </div>
                    <Progress value={item.percentage} className="h-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Detalhes por Categoria</CardTitle>
            <CardDescription>Volume e estatísticas por tipo de crédito</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <Tabs defaultValue="TRIBUTARIO">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="TRIBUTARIO" className="text-xs">
                  Tributários
                </TabsTrigger>
                <TabsTrigger value="JUDICIAL" className="text-xs">
                  Judiciais
                </TabsTrigger>
                <TabsTrigger value="COMERCIAL" className="text-xs">
                  Comerciais
                </TabsTrigger>
                <TabsTrigger value="AMBIENTAL" className="text-xs">
                  Ambientais
                </TabsTrigger>
              </TabsList>

              {Object.values(CreditCategory)
                .filter(cat => ['TRIBUTARIO', 'JUDICIAL', 'COMERCIAL', 'AMBIENTAL'].includes(cat))
                .map(category => (
                  <TabsContent key={category} value={category}>
                    <div className="space-y-4 pt-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Quantidade</p>
                          <p className="text-lg font-medium">
                            {statistics.creditsByCategory[category].count} títulos
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Valor Total</p>
                          <p className="text-lg font-medium">
                            {formatCurrency(statistics.creditsByCategory[category].value)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">Tendência</p>
                            <span
                              className={cn(
                                'text-sm flex items-center',
                                statistics.creditsByCategory[category].percentageChange >= 0
                                  ? 'text-green-500'
                                  : 'text-red-500'
                              )}
                            >
                              {statistics.creditsByCategory[category].percentageChange >= 0 ? (
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                              ) : (
                                <ArrowUpRight className="h-3 w-3 mr-1 rotate-180" />
                              )}
                              {statistics.creditsByCategory[category].percentageChange >= 0
                                ? '+'
                                : ''}
                              {statistics.creditsByCategory[category].percentageChange}%
                            </span>
                          </div>
                          <Progress
                            value={Math.abs(
                              statistics.creditsByCategory[category].percentageChange
                            )}
                            className={cn(
                              'h-1',
                              statistics.creditsByCategory[category].percentageChange >= 0
                                ? 'bg-green-100'
                                : 'bg-red-100'
                            )}
                          />
                        </div>
                      </div>

                      <div className="pt-3 border-t">
                        <h4 className="text-sm font-medium mb-2">Subtipo mais negociado</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {category === CreditCategory.TRIBUTARIO && (
                            <>
                              <Badge variant="outline" className="justify-center py-1.5">
                                ICMS
                              </Badge>
                              <Badge variant="outline" className="justify-center py-1.5">
                                IRPJ
                              </Badge>
                            </>
                          )}
                          {category === CreditCategory.JUDICIAL && (
                            <>
                              <Badge variant="outline" className="justify-center py-1.5">
                                PRECATÓRIO
                              </Badge>
                              <Badge variant="outline" className="justify-center py-1.5">
                                HONORÁRIO
                              </Badge>
                            </>
                          )}
                          {category === CreditCategory.COMERCIAL && (
                            <>
                              <Badge variant="outline" className="justify-center py-1.5">
                                DUPLICATA
                              </Badge>
                              <Badge variant="outline" className="justify-center py-1.5">
                                NOTA PROMISSÓRIA
                              </Badge>
                            </>
                          )}
                          {category === CreditCategory.AMBIENTAL && (
                            <>
                              <Badge variant="outline" className="justify-center py-1.5">
                                CRÉDITO CARBONO
                              </Badge>
                              <Badge variant="outline" className="justify-center py-1.5">
                                HÍDRICO
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Mock data for visualization v1
export const mockMarketplaceStatisticsV1: MarketplaceStatistics = {
  totalCredits: 1254,
  totalValue: 87490000,
  availableOffers: 148,
  tokenizedCredits: 876,
  tradingVolume: {
    daily: 3250000,
    weekly: 18750000,
    monthly: 76500000,
  },
  creditsByCategory: {
    [CreditCategory.TRIBUTARIO]: {
      count: 528,
      value: 45290000,
      percentageChange: 12.5,
    },
    [CreditCategory.COMERCIAL]: {
      count: 267,
      value: 15730000,
      percentageChange: 8.3,
    },
    [CreditCategory.FINANCEIRO]: {
      count: 143,
      value: 9850000,
      percentageChange: -3.2,
    },
    [CreditCategory.JUDICIAL]: {
      count: 176,
      value: 12450000,
      percentageChange: 15.7,
    },
    [CreditCategory.RURAL]: {
      count: 62,
      value: 3100000,
      percentageChange: 5.1,
    },
    [CreditCategory.IMOBILIARIO]: {
      count: 37,
      value: 2910000,
      percentageChange: -1.8,
    },
    [CreditCategory.AMBIENTAL]: {
      count: 23,
      value: 1580000,
      percentageChange: 21.4,
    },
    [CreditCategory.ESPECIAL]: {
      count: 18,
      value: 980000,
      percentageChange: 4.2,
    },
  },
  recentTransactions: {
    count: 87,
    value: 12450000,
    percentageChange: 18.5,
  },
  popularCategories: [
    {
      category: CreditCategory.TRIBUTARIO,
      percentage: 42,
    },
    {
      category: CreditCategory.COMERCIAL,
      percentage: 21,
    },
    {
      category: CreditCategory.JUDICIAL,
      percentage: 14,
    },
    {
      category: CreditCategory.FINANCEIRO,
      percentage: 11,
    },
    {
      category: CreditCategory.RURAL,
      percentage: 5,
    },
    {
      category: CreditCategory.AMBIENTAL,
      percentage: 4,
    },
    {
      category: CreditCategory.IMOBILIARIO,
      percentage: 2,
    },
    {
      category: CreditCategory.ESPECIAL,
      percentage: 1,
    },
  ],
  tradingTrend: [
    { date: '2023-01', volume: 45000000 },
    { date: '2023-02', volume: 48500000 },
    { date: '2023-03', volume: 52300000 },
    { date: '2023-04', volume: 58700000 },
    { date: '2023-05', volume: 63100000 },
    { date: '2023-06', volume: 69800000 },
    { date: '2023-07', volume: 74200000 },
    { date: '2023-08', volume: 76500000 },
  ],
};

// Interfaces for simple stats display (v2)
export interface MarketplaceStatistic {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export interface MarketplaceStatisticsProps {
  anunciosAtivos: number;
  volumeTotalNegociado: number;
  valorMedioCredito: number;
  descontoMedio: number;
  totalUsuarios: number;
  crescimentoMensal: number;
}

// Simple statistics mock data (v2)
export const mockMarketplaceStatisticsV2: MarketplaceStatistic[] = [
  {
    title: 'Volume Negociado',
    value: 'R$ 54.800.000',
    change: '+15.3% vs. mês anterior',
    isPositive: true,
  },
  {
    title: 'Total de Transações',
    value: '1.843',
    change: '+8.7% vs. mês anterior',
    isPositive: true,
  },
  {
    title: 'Preço Médio',
    value: 'R$ 0,85/R$',
    change: '-2.1% vs. mês anterior',
    isPositive: false,
  },
  {
    title: 'Tempo Médio p/ Venda',
    value: '14 dias',
    change: '-3.2 dias vs. mês anterior',
    isPositive: true,
  },
];

// Main statistics mock data (v3)
export const mockMarketplaceStatsData: MarketplaceStatisticsProps = {
  anunciosAtivos: 142,
  volumeTotalNegociado: 12750000,
  valorMedioCredito: 89500,
  descontoMedio: 12.5,
  totalUsuarios: 320,
  crescimentoMensal: 15.3,
};

// Component for small market stats cards
export const MarketplaceStatsSmall: React.FC<{ title: string; icon: React.ReactNode }> = ({
  title,
  icon,
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Volume</p>
            <p className="font-medium">R$ 24,5M</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Transações</p>
            <p className="font-medium">842</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Preço Médio</p>
            <p className="font-medium">R$ 0,88/R$</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Tendência</p>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
            >
              <ArrowUp className="h-3 w-3 mr-1" />
              Alta
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Component for market indicators
export const MarketIndicators: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MarketplaceStatsSmall
        title="ICMS São Paulo"
        icon={<BarChart className="h-4 w-4 text-blue-500" />}
      />
      <MarketplaceStatsSmall
        title="Precatórios Federais"
        icon={<LineChart className="h-4 w-4 text-purple-500" />}
      />
      <MarketplaceStatsSmall
        title="PIS/COFINS"
        icon={<PieChart className="h-4 w-4 text-green-500" />}
      />
    </div>
  );
};

// Interface for marketplace stat items
interface MarketplaceStat {
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  isCurrency?: boolean;
  formatter?: (value: number) => string;
}

// Main MarketplaceStats component (v3)
export function MarketplaceStats({ statistics }: { statistics: MarketplaceStatisticsProps }) {
  const stats: MarketplaceStat[] = [
    {
      title: 'Anúncios Ativos',
      value: statistics.anunciosAtivos,
      change: 12,
      trend: 'up',
      description: 'Créditos disponíveis para compra',
      isCurrency: false,
      formatter: formatNumber,
    },
    {
      title: 'Volume Total Negociado',
      value: statistics.volumeTotalNegociado,
      change: 8.2,
      trend: 'up',
      description: 'Valor acumulado de todos os créditos negociados',
      isCurrency: true,
    },
    {
      title: 'Valor Médio dos Créditos',
      value: statistics.valorMedioCredito,
      change: -2.1,
      trend: 'down',
      description: 'Média do valor dos créditos disponíveis',
      isCurrency: true,
    },
    {
      title: 'Desconto Médio',
      value: `${statistics.descontoMedio}%`,
      change: 1.5,
      trend: 'up',
      description: 'Desconto médio aplicado aos créditos',
      isCurrency: false,
    },
    {
      title: 'Total de Usuários',
      value: statistics.totalUsuarios,
      change: 5.7,
      trend: 'up',
      description: 'Usuários ativos no marketplace',
      isCurrency: false,
      formatter: formatNumber,
    },
    {
      title: 'Crescimento Mensal',
      value: `${statistics.crescimentoMensal}%`,
      change: 2.1,
      trend: 'up',
      description: 'Taxa de crescimento do último mês',
      isCurrency: false,
    },
  ];

  // Function to render trend icon
  const renderTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Function to format stat value
  const formatStatValue = (stat: MarketplaceStat) => {
    if (typeof stat.value === 'string') return stat.value;

    if (stat.isCurrency) {
      return formatCurrency(stat.value);
    }

    if (stat.formatter) {
      return stat.formatter(stat.value);
    }

    return stat.value.toString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {getStatIcon(stat.title)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatStatValue(stat)}</div>
            {stat.change && (
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                {renderTrendIcon(stat.trend)}
                <span
                  className={
                    stat.trend === 'up'
                      ? 'text-green-500'
                      : stat.trend === 'down'
                        ? 'text-red-500'
                        : ''
                  }
                >
                  {stat.change > 0 ? '+' : ''}
                  {stat.change}%
                </span>
                <span className="ml-1">em relação ao mês anterior</span>
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Helper function to get the appropriate icon for each stat
function getStatIcon(title: string) {
  switch (title) {
    case 'Anúncios Ativos':
      return <BarChart className="h-4 w-4 text-muted-foreground" />;
    case 'Volume Total Negociado':
      return <DollarSign className="h-4 w-4 text-muted-foreground" />;
    case 'Valor Médio dos Créditos':
      return <DollarSign className="h-4 w-4 text-muted-foreground" />;
    case 'Desconto Médio':
      return <PieChart className="h-4 w-4 text-muted-foreground" />;
    case 'Total de Usuários':
      return <Users className="h-4 w-4 text-muted-foreground" />;
    case 'Crescimento Mensal':
      return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
    default:
      return <BarChart className="h-4 w-4 text-muted-foreground" />;
  }
}
