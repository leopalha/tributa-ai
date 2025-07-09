import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertTriangle,
  Calendar,
  DollarSign,
  FileText,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
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

interface FiscalMetrics {
  totalObligations: number;
  pendingObligations: number;
  overdueObligations: number;
  paidObligations: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  complianceRate: number;
  avgPaymentTime: number;
  upcomingDeadlines: number;
}

interface FiscalObligation {
  id: string;
  title: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  dueDate: Date;
  taxName?: string;
}

interface FiscalDashboardProps {
  obligations: FiscalObligation[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function FiscalDashboard({ obligations }: FiscalDashboardProps) {
  const [metrics, setMetrics] = useState<FiscalMetrics>({
    totalObligations: 0,
    pendingObligations: 0,
    overdueObligations: 0,
    paidObligations: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    complianceRate: 0,
    avgPaymentTime: 0,
    upcomingDeadlines: 0,
  });

  const [chartData, setChartData] = useState({
    monthly: [],
    byType: [],
    byStatus: [],
    timeline: [],
  });

  useEffect(() => {
    calculateMetrics();
    generateChartData();
  }, [obligations]);

  const calculateMetrics = () => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const pending = obligations.filter(o => o.status === 'PENDING');
    const overdue = obligations.filter(o => o.status === 'OVERDUE');
    const paid = obligations.filter(o => o.status === 'PAID');
    const upcoming = obligations.filter(
      o => o.status === 'PENDING' && new Date(o.dueDate) <= nextWeek
    );

    const totalAmount = obligations.reduce((sum, o) => sum + o.amount, 0);
    const paidAmount = paid.reduce((sum, o) => sum + o.amount, 0);
    const pendingAmount = pending.reduce((sum, o) => sum + o.amount, 0);
    const overdueAmount = overdue.reduce((sum, o) => sum + o.amount, 0);

    const complianceRate = obligations.length > 0 ? (paid.length / obligations.length) * 100 : 0;

    setMetrics({
      totalObligations: obligations.length,
      pendingObligations: pending.length,
      overdueObligations: overdue.length,
      paidObligations: paid.length,
      totalAmount,
      paidAmount,
      pendingAmount,
      overdueAmount,
      complianceRate,
      avgPaymentTime: 0, // Placeholder
      upcomingDeadlines: upcoming.length,
    });
  };

  const generateChartData = () => {
    // Dados por tipo
    const typeData = obligations.reduce(
      (acc, obligation) => {
        const type = obligation.taxName || obligation.type;
        acc[type] = (acc[type] || 0) + obligation.amount;
        return acc;
      },
      {} as Record<string, number>
    );

    const byType = Object.entries(typeData).map(([name, value]) => ({
      name,
      value,
    }));

    // Dados por status
    const statusData = obligations.reduce(
      (acc, obligation) => {
        acc[obligation.status] = (acc[obligation.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const byStatus = Object.entries(statusData).map(([name, value]) => ({
      name: getStatusLabel(name),
      value,
      color: getStatusColor(name),
    }));

    // Timeline mensal
    const monthlyData = obligations.reduce(
      (acc, obligation) => {
        const month = new Date(obligation.dueDate).toLocaleString('pt-BR', {
          month: 'short',
          year: '2-digit',
        });
        if (!acc[month]) {
          acc[month] = { month, pending: 0, paid: 0, overdue: 0 };
        }
        acc[month][obligation.status.toLowerCase()]++;
        return acc;
      },
      {} as Record<string, any>
    );

    const timeline = Object.values(monthlyData).sort(
      (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
    );

    setChartData({
      monthly: [],
      byType,
      byStatus,
      timeline,
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendente';
      case 'PAID':
        return 'Pago';
      case 'OVERDUE':
        return 'Vencido';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '#0088FE';
      case 'PAID':
        return '#00C49F';
      case 'OVERDUE':
        return '#FF8042';
      case 'CANCELLED':
        return '#CCCCCC';
      default:
        return '#8884D8';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getUpcomingObligations = () => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return obligations
      .filter(o => o.status === 'PENDING' && new Date(o.dueDate) <= nextWeek)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  };

  const getCriticalObligations = () => {
    return obligations
      .filter(o => o.status === 'OVERDUE')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  };

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Obrigações</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalObligations}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(metrics.totalAmount)} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Compliance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.complianceRate.toFixed(1)}%</div>
            <Progress value={metrics.complianceRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencimentos Próximos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{metrics.upcomingDeadlines}</div>
            <p className="text-xs text-muted-foreground">Próximos 7 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Obrigações Vencidas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.overdueObligations}</div>
            <p className="text-xs text-muted-foreground">{formatCurrency(metrics.overdueAmount)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Notificações */}
      {(metrics.overdueObligations > 0 || metrics.upcomingDeadlines > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.overdueObligations > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <XCircle className="h-5 w-5" />
                  Obrigações Vencidas
                </CardTitle>
                <CardDescription className="text-red-600">
                  Atenção necessária imediata
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getCriticalObligations().map(obligation => (
                    <div key={obligation.id} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{obligation.title}</span>
                      <Badge variant="destructive">{formatCurrency(obligation.amount)}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {metrics.upcomingDeadlines > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <AlertCircle className="h-5 w-5" />
                  Vencimentos Próximos
                </CardTitle>
                <CardDescription className="text-yellow-600">Próximos 7 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getUpcomingObligations().map(obligation => (
                    <div key={obligation.id} className="flex justify-between items-center">
                      <div>
                        <span className="text-sm font-medium">{obligation.title}</span>
                        <p className="text-xs text-muted-foreground">
                          {new Date(obligation.dueDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge variant="outline">{formatCurrency(obligation.amount)}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Gráficos e Análises */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="types">Por Tipo</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={chartData.byStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.byStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-medium">{formatCurrency(metrics.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-600">Pago</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(metrics.paidAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-yellow-600">Pendente</span>
                    <span className="font-medium text-yellow-600">
                      {formatCurrency(metrics.pendingAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-red-600">Vencido</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(metrics.overdueAmount)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Compliance</span>
                    <Badge
                      variant={
                        metrics.complianceRate >= 80
                          ? 'success'
                          : metrics.complianceRate >= 60
                            ? 'default'
                            : 'destructive'
                      }
                    >
                      {metrics.complianceRate.toFixed(1)}%
                    </Badge>
                  </div>
                  <Progress value={metrics.complianceRate} className="mt-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Obrigações por Tipo de Tributo</CardTitle>
              <CardDescription>Distribuição dos valores por tipo de tributo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData.byType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={value => formatCurrency(value)} />
                  <Tooltip formatter={value => formatCurrency(Number(value))} />
                  <Bar dataKey="value" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Timeline de Obrigações</CardTitle>
              <CardDescription>Evolução das obrigações ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData.timeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="pending" stroke="#0088FE" name="Pendente" />
                  <Line type="monotone" dataKey="paid" stroke="#00C49F" name="Pago" />
                  <Line type="monotone" dataKey="overdue" stroke="#FF8042" name="Vencido" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Valores Pagos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(metrics.paidAmount)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {metrics.paidObligations} obrigações
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  Valores Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(metrics.pendingAmount)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {metrics.pendingObligations} obrigações
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Valores Vencidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(metrics.overdueAmount)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {metrics.overdueObligations} obrigações
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
