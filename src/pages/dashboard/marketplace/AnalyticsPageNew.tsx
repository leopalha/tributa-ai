import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  Users,
  Clock,
  Target,
  Activity,
  Star,
  ShoppingCart,
  Gavel,
  MessageSquare,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Zap,
  Award,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AnalyticsPageNew() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('todas');
  const [activeTab, setActiveTab] = useState('overview');

  // Dados mockados para analytics
  const analyticsData = {
    overview: {
      totalTransactions: 127,
      totalVolume: 15750000,
      totalCommission: 472500,
      averageTicket: 124015,
      successRate: 94.5,
      averageTime: 2.3, // dias
      growthRate: 12.8,
      activeListings: 23,
    },
    purchases: {
      total: 45,
      volume: 6850000,
      averageDiscount: 12.5,
      averageTime: 1.8,
      categories: [
        { name: 'ICMS', count: 12, volume: 2100000, percentage: 30.7 },
        { name: 'Precatório', count: 8, volume: 1800000, percentage: 26.3 },
        { name: 'PIS/COFINS', count: 10, volume: 1200000, percentage: 17.5 },
        { name: 'IRPJ/CSLL', count: 7, volume: 950000, percentage: 13.9 },
        { name: 'Rural', count: 5, volume: 600000, percentage: 8.8 },
        { name: 'ISS', count: 3, volume: 200000, percentage: 2.9 },
      ],
      monthlyTrend: [
        { month: 'Jan', purchases: 12, volume: 1500000 },
        { month: 'Fev', purchases: 15, volume: 1800000 },
        { month: 'Mar', purchases: 18, volume: 2200000 },
        { month: 'Abr', purchases: 0, volume: 0 }, // Mês atual
      ],
    },
    sales: {
      total: 38,
      volume: 5900000,
      averageDiscount: 11.2,
      averageTime: 3.1,
      categories: [
        { name: 'Precatório', count: 10, volume: 1950000, percentage: 33.1 },
        { name: 'ICMS', count: 8, volume: 1400000, percentage: 23.7 },
        { name: 'Rural', count: 7, volume: 1100000, percentage: 18.6 },
        { name: 'PIS/COFINS', count: 6, volume: 800000, percentage: 13.6 },
        { name: 'IRPJ/CSLL', count: 4, volume: 450000, percentage: 7.6 },
        { name: 'ISS', count: 3, volume: 200000, percentage: 3.4 },
      ],
      monthlyTrend: [
        { month: 'Jan', sales: 10, volume: 1200000 },
        { month: 'Fev', sales: 12, volume: 1500000 },
        { month: 'Mar', sales: 16, volume: 1900000 },
        { month: 'Abr', sales: 0, volume: 0 }, // Mês atual
      ],
    },
    bids: {
      total: 234,
      won: 45,
      lost: 156,
      active: 33,
      winRate: 19.2,
      averageBidValue: 685000,
      totalBidVolume: 160390000,
      categories: [
        { name: 'ICMS', bids: 67, won: 12, winRate: 17.9 },
        { name: 'Precatório', bids: 54, won: 15, winRate: 27.8 },
        { name: 'PIS/COFINS', bids: 43, won: 8, winRate: 18.6 },
        { name: 'Rural', bids: 35, won: 6, winRate: 17.1 },
        { name: 'IRPJ/CSLL', bids: 23, won: 3, winRate: 13.0 },
        { name: 'ISS', bids: 12, won: 1, winRate: 8.3 },
      ],
    },
    performance: {
      roi: 18.7, // Return on Investment
      timeToSale: 2.8, // dias médios
      repeatCustomers: 67.3, // %
      customerSatisfaction: 4.7, // /5
      marketShare: 3.2, // %
      conversionRate: 12.4, // %
      averageMargin: 15.8, // %
      churnRate: 8.2, // %
    },
    trends: {
      priceVariation: -2.3, // % último mês
      volumeGrowth: 15.6, // % último mês
      newListings: 45, // último mês
      marketActivity: 'alta', // alta, média, baixa
      topPerformingCategory: 'Precatório',
      fastestGrowingCategory: 'Rural',
    },
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    if (value < 0) return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'alta':
        return 'bg-green-100 text-green-800';
      case 'média':
        return 'bg-yellow-100 text-yellow-800';
      case 'baixa':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportReport = () => {
    toast.success('Relatório sendo exportado...');
  };

  const handleRefreshData = () => {
    toast.success('Dados atualizados!');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics do Marketplace</h1>
          <p className="text-gray-600">Análise detalhada do seu desempenho na plataforma</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="1y">1 ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefreshData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="purchases">Compras</TabsTrigger>
          <TabsTrigger value="sales">Vendas</TabsTrigger>
          <TabsTrigger value="bids">Lances</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Transações</p>
                    <p className="text-2xl font-bold">{analyticsData.overview.totalTransactions}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {getTrendIcon(analyticsData.overview.growthRate)}
                      <span
                        className={`text-sm ${getTrendColor(analyticsData.overview.growthRate)}`}
                      >
                        {formatPercentage(analyticsData.overview.growthRate)}
                      </span>
                    </div>
                  </div>
                  <Activity className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Volume Total</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(analyticsData.overview.totalVolume)}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {getTrendIcon(analyticsData.trends.volumeGrowth)}
                      <span
                        className={`text-sm ${getTrendColor(analyticsData.trends.volumeGrowth)}`}
                      >
                        {formatPercentage(analyticsData.trends.volumeGrowth)}
                      </span>
                    </div>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Taxa de Sucesso</p>
                    <p className="text-2xl font-bold">
                      {formatPercentage(analyticsData.overview.successRate)}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">Excelente</span>
                    </div>
                  </div>
                  <Target className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Ticket Médio</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(analyticsData.overview.averageTicket)}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">Crescendo</span>
                    </div>
                  </div>
                  <Award className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Atividade do Mercado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Atividade do Mercado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Atividade Geral</span>
                    <Badge className={getActivityColor(analyticsData.trends.marketActivity)}>
                      {analyticsData.trends.marketActivity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Novos Anúncios (30d)</span>
                      <span className="font-medium">{analyticsData.trends.newListings}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Anúncios Ativos</span>
                      <span className="font-medium">{analyticsData.overview.activeListings}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Categoria Top</span>
                    <Badge variant="outline">{analyticsData.trends.topPerformingCategory}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Crescimento Rápido</span>
                      <span className="font-medium">
                        {analyticsData.trends.fastestGrowingCategory}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Market Share</span>
                      <span className="font-medium">
                        {formatPercentage(analyticsData.performance.marketShare)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Variação de Preços</span>
                    <span
                      className={`text-sm font-medium ${getTrendColor(analyticsData.trends.priceVariation)}`}
                    >
                      {analyticsData.trends.priceVariation > 0 ? '+' : ''}
                      {formatPercentage(analyticsData.trends.priceVariation)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Tempo Médio Venda</span>
                      <span className="font-medium">
                        {analyticsData.performance.timeToSale} dias
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Taxa Conversão</span>
                      <span className="font-medium">
                        {formatPercentage(analyticsData.performance.conversionRate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Compras</p>
                    <p className="text-2xl font-bold">{analyticsData.purchases.total}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Volume Compras</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(analyticsData.purchases.volume)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Desconto Médio</p>
                    <p className="text-2xl font-bold">
                      {formatPercentage(analyticsData.purchases.averageDiscount)}
                    </p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tempo Médio</p>
                    <p className="text-2xl font-bold">{analyticsData.purchases.averageTime}d</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.purchases.categories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{category.name}</Badge>
                        <span className="text-sm text-gray-600">{category.count} compras</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(category.volume)}</p>
                        <p className="text-sm text-gray-600">
                          {formatPercentage(category.percentage)}
                        </p>
                      </div>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Vendas</p>
                    <p className="text-2xl font-bold">{analyticsData.sales.total}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Volume Vendas</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(analyticsData.sales.volume)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Desconto Médio</p>
                    <p className="text-2xl font-bold">
                      {formatPercentage(analyticsData.sales.averageDiscount)}
                    </p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tempo Médio</p>
                    <p className="text-2xl font-bold">{analyticsData.sales.averageTime}d</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance de Vendas por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.sales.categories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{category.name}</Badge>
                        <span className="text-sm text-gray-600">{category.count} vendas</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(category.volume)}</p>
                        <p className="text-sm text-gray-600">
                          {formatPercentage(category.percentage)}
                        </p>
                      </div>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bids" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Lances</p>
                    <p className="text-2xl font-bold">{analyticsData.bids.total}</p>
                  </div>
                  <Gavel className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Lances Ganhos</p>
                    <p className="text-2xl font-bold">{analyticsData.bids.won}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Taxa de Vitória</p>
                    <p className="text-2xl font-bold">
                      {formatPercentage(analyticsData.bids.winRate)}
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Lances Ativos</p>
                    <p className="text-2xl font-bold">{analyticsData.bids.active}</p>
                  </div>
                  <Activity className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance de Lances por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.bids.categories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{category.name}</Badge>
                        <span className="text-sm text-gray-600">{category.bids} lances</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{category.won} ganhos</p>
                        <p className="text-sm text-gray-600">
                          {formatPercentage(category.winRate)} taxa
                        </p>
                      </div>
                    </div>
                    <Progress value={category.winRate} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">ROI</p>
                    <p className="text-2xl font-bold">
                      {formatPercentage(analyticsData.performance.roi)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Satisfação</p>
                    <p className="text-2xl font-bold">
                      {analyticsData.performance.customerSatisfaction}/5
                    </p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Clientes Recorrentes</p>
                    <p className="text-2xl font-bold">
                      {formatPercentage(analyticsData.performance.repeatCustomers)}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Margem Média</p>
                    <p className="text-2xl font-bold">
                      {formatPercentage(analyticsData.performance.averageMargin)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Eficiência</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tempo Médio para Venda</span>
                  <span className="font-semibold">{analyticsData.performance.timeToSale} dias</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Taxa de Conversão</span>
                  <span className="font-semibold">
                    {formatPercentage(analyticsData.performance.conversionRate)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Taxa de Churn</span>
                  <span className="font-semibold">
                    {formatPercentage(analyticsData.performance.churnRate)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Market Share</span>
                  <span className="font-semibold">
                    {formatPercentage(analyticsData.performance.marketShare)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recomendações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Otimizar Preços</p>
                    <p className="text-sm text-blue-700">
                      Considere ajustar preços em Precatórios para aumentar conversão
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">Foco em Rural</p>
                    <p className="text-sm text-green-700">
                      Categoria Rural mostra crescimento acelerado
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900">Melhorar Tempo</p>
                    <p className="text-sm text-yellow-700">
                      Reduzir tempo médio de venda pode aumentar volume
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
