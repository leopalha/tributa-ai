import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  FileText,
  Plus,
  RefreshCw,
  Download,
  Target,
  Zap,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Timer,
  Users,
  Building2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { CompensacaoService } from '@/services/compensacao.service';
import { EstatisticasCompensacao, MetricasCompensacao } from '@/types/compensacao';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface CompensationDashboardProps {
  userId: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function CompensationDashboard({ userId }: CompensationDashboardProps) {
  const [estatisticas, setEstatisticas] = useState<EstatisticasCompensacao | null>(null);
  const [metricas, setMetricas] = useState<MetricasCompensacao | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState<'30d' | '90d' | '12m'>('30d');

  const compensacaoService = CompensacaoService.getInstance();

  useEffect(() => {
    carregarDados();
  }, [periodo]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);

      const agora = new Date();
      let inicio: Date;

      switch (periodo) {
        case '30d':
          inicio = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          inicio = new Date(agora.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '12m':
          inicio = new Date(agora.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          inicio = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      const [estatisticasData, metricasData] = await Promise.all([
        compensacaoService.obterEstatisticas({ inicio, fim: agora }),
        compensacaoService.obterMetricas(),
      ]);

      setEstatisticas(estatisticasData);
      setMetricas(metricasData);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Falha ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const dadosGraficoTendencia = [
    { mes: 'Jan', valor: 4500000, economia: 675000 },
    { mes: 'Fev', valor: 5200000, economia: 780000 },
    { mes: 'Mar', valor: 4800000, economia: 720000 },
    { mes: 'Abr', valor: 6100000, economia: 915000 },
    { mes: 'Mai', valor: 5800000, economia: 870000 },
    { mes: 'Jun', valor: 6500000, economia: 975000 },
  ];

  const dadosGraficoDistribuicao = [
    { categoria: 'ICMS', valor: 2500000, count: 45 },
    { categoria: 'PIS/COFINS', valor: 1800000, count: 32 },
    { categoria: 'IPI', valor: 1200000, count: 18 },
    { categoria: 'Outros', valor: 800000, count: 25 },
  ];

  const dadosGraficoStatus = [
    { status: 'Concluídas', value: 65, color: '#00C49F' },
    { status: 'Processando', value: 20, color: '#FFBB28' },
    { status: 'Pendentes', value: 10, color: '#FF8042' },
    { status: 'Rejeitadas', value: 5, color: '#FF6B6B' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                </CardTitle>
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compensação de Créditos</h1>
          <p className="text-muted-foreground">Gerencie e otimize suas compensações tributárias</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={carregarDados}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Compensação
          </Button>
        </div>
      </div>

      {/* Período Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Período:</span>
        {(['30d', '90d', '12m'] as const).map(p => (
          <Button
            key={p}
            variant={periodo === p ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriodo(p)}
          >
            {p === '30d' ? '30 dias' : p === '90d' ? '90 dias' : '12 meses'}
          </Button>
        ))}
      </div>

      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Compensado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(estatisticas?.totalValorCompensado || 0)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />+
              {estatisticas?.comparacaoPeriodoAnterior.crescimentoValor || 0}% vs período anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economia Gerada</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(estatisticas?.totalEconomia || 0)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Percent className="h-3 w-3 mr-1" />
              {formatPercentage(
                ((estatisticas?.totalEconomia || 0) / (estatisticas?.totalValorCompensado || 1)) *
                  100
              )}{' '}
              de economia
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(estatisticas?.taxaSucesso || 0)}
            </div>
            <Progress value={estatisticas?.taxaSucesso || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {estatisticas?.tempoMedioProcessamento || 0} dias
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDownRight className="h-3 w-3 mr-1 text-green-500" />-
              {estatisticas?.comparacaoPeriodoAnterior.melhoriaEficiencia || 0}% vs anterior
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Notificações */}
      <div className="grid gap-4 md:grid-cols-3">
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Oportunidades Detectadas</AlertTitle>
          <AlertDescription>
            Identificamos 12 créditos que podem ser compensados, gerando uma economia estimada de R$
            45.000.
          </AlertDescription>
        </Alert>

        <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <Clock className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800 dark:text-yellow-200">Prazos Próximos</AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-300">
            3 solicitações de compensação vencem nos próximos 7 dias.
          </AlertDescription>
        </Alert>

        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <Activity className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800 dark:text-blue-200">Processamento</AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            8 compensações estão sendo processadas pela Receita Federal.
          </AlertDescription>
        </Alert>
      </div>

      {/* Tabs com Conteúdo Detalhado */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="categories">Por Categoria</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Status</CardTitle>
                <CardDescription>Status atual das solicitações de compensação</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={dadosGraficoStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dadosGraficoStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Qualidade</CardTitle>
                <CardDescription>Indicadores de performance do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Eficiência</span>
                    <span>{formatPercentage(metricas?.eficiencia || 0)}</span>
                  </div>
                  <Progress value={metricas?.eficiencia || 0} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Velocidade</span>
                    <span>{formatPercentage(metricas?.velocidade || 0)}</span>
                  </div>
                  <Progress value={metricas?.velocidade || 0} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Qualidade</span>
                    <span>{formatPercentage(metricas?.qualidade || 0)}</span>
                  </div>
                  <Progress value={metricas?.qualidade || 0} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Satisfação</span>
                    <span>{formatPercentage(metricas?.satisfacao || 0)}</span>
                  </div>
                  <Progress value={metricas?.satisfacao || 0} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evolução do Valor Compensado</CardTitle>
              <CardDescription>
                Tendência de valores compensados e economia gerada ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosGraficoTendencia}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        formatCurrency(value),
                        name === 'valor' ? 'Valor Compensado' : 'Economia Gerada',
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="valor"
                      stroke="#8884d8"
                      strokeWidth={2}
                      name="valor"
                    />
                    <Line
                      type="monotone"
                      dataKey="economia"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      name="economia"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compensações por Categoria</CardTitle>
              <CardDescription>
                Distribuição de valores e quantidade por tipo de crédito
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosGraficoDistribuicao}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categoria" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === 'valor' ? formatCurrency(value) : value,
                        name === 'valor' ? 'Valor' : 'Quantidade',
                      ]}
                    />
                    <Bar dataKey="valor" fill="#8884d8" name="valor" />
                    <Bar dataKey="count" fill="#82ca9d" name="count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Processamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {metricas?.detalhes.tempoMedioProcessamento || 0} dias
                </div>
                <p className="text-sm text-muted-foreground">Tempo médio de processamento</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Aprovação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {formatPercentage(metricas?.detalhes.taxaAprovacao || 0)}
                </div>
                <p className="text-sm text-muted-foreground">Taxa de aprovação</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                  Valor Médio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {formatCurrency(metricas?.detalhes.valorMedioCompensacao || 0)}
                </div>
                <p className="text-sm text-muted-foreground">Valor médio por compensação</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesse rapidamente as funcionalidades mais utilizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-20 flex-col gap-2" variant="outline">
              <Calculator className="h-6 w-6" />
              <span>Simular Compensação</span>
            </Button>

            <Button className="h-20 flex-col gap-2" variant="outline">
              <FileText className="h-6 w-6" />
              <span>Gerar Relatório</span>
            </Button>

            <Button className="h-20 flex-col gap-2" variant="outline">
              <BarChart3 className="h-6 w-6" />
              <span>Análise Detalhada</span>
            </Button>

            <Button className="h-20 flex-col gap-2" variant="outline">
              <Download className="h-6 w-6" />
              <span>Exportar Dados</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
