import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  Download,
  FileText,
  TrendingUp,
  DollarSign,
  Calendar,
  PieChart as PieChartIcon,
  BarChart3,
  LineChart as LineChartIcon,
  Filter,
  RefreshCw
} from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { tokenService } from '@/services/token.service';
import { toast } from 'sonner';

interface ReportFilters {
  periodo: string;
  tipo: string;
  status: string;
  dataInicio: string;
  dataFim: string;
}

interface TokenStats {
  total: number;
  valorTotal: number;
  porStatus: Record<string, number>;
  porTipo: Record<string, number>;
  crescimentoMensal: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const TokenReports: React.FC = () => {
  const [stats, setStats] = useState<TokenStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilters>({
    periodo: '30',
    tipo: '',
    status: '',
    dataInicio: '',
    dataFim: ''
  });
  const [chartData, setChartData] = useState({
    statusData: [] as any[],
    tipoData: [] as any[],
    crescimentoData: [] as any[]
  });

  useEffect(() => {
    loadReportData();
  }, [filters]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      
      // Carregar estatísticas gerais
      const tokenStats = await tokenService.getTokenStats();
      setStats(tokenStats);

      // Preparar dados para gráficos
      const statusData = Object.entries(tokenStats.porStatus).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
        percentage: ((count / tokenStats.total) * 100).toFixed(1)
      }));

      const tipoData = Object.entries(tokenStats.porTipo).map(([tipo, count]) => ({
        name: tipo.charAt(0).toUpperCase() + tipo.slice(1),
        value: count,
        percentage: ((count / tokenStats.total) * 100).toFixed(1)
      }));

      // Simular dados de crescimento (em um cenário real, viria da API)
      const crescimentoData = [
        { mes: 'Jan', tokens: 45, valor: 2500000 },
        { mes: 'Fev', tokens: 52, valor: 3200000 },
        { mes: 'Mar', tokens: 48, valor: 2800000 },
        { mes: 'Abr', tokens: 61, valor: 4100000 },
        { mes: 'Mai', tokens: 73, valor: 5200000 },
        { mes: 'Jun', tokens: 68, valor: 4800000 }
      ];

      setChartData({
        statusData,
        tipoData,
        crescimentoData
      });

    } catch (error) {
      console.error('Erro ao carregar dados do relatório:', error);
      toast.error('Erro ao carregar dados do relatório');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async (format: 'pdf' | 'excel') => {
    try {
      toast.loading(`Gerando relatório ${format.toUpperCase()}...`, { id: 'download-report' });
      
      const filterParams = {
        ...filters,
        dataInicio: filters.dataInicio ? new Date(filters.dataInicio) : undefined,
        dataFim: filters.dataFim ? new Date(filters.dataFim) : undefined
      };

      const blob = await tokenService.generateReport(filterParams);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-tokens-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`Relatório ${format.toUpperCase()} baixado com sucesso!`, { id: 'download-report' });
    } catch (error) {
      toast.error(`Erro ao gerar relatório ${format.toUpperCase()}`, { id: 'download-report' });
    }
  };

  const clearFilters = () => {
    setFilters({
      periodo: '30',
      tipo: '',
      status: '',
      dataInicio: '',
      dataFim: ''
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios de Tokens</h1>
          <p className="text-gray-600">Análises e estatísticas dos seus tokens</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleDownloadReport('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Button onClick={() => handleDownloadReport('pdf')}>
            <FileText className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros do Relatório
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Período</Label>
              <Select
                value={filters.periodo}
                onValueChange={(value) => setFilters({...filters, periodo: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="90">Últimos 3 meses</SelectItem>
                  <SelectItem value="365">Último ano</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={filters.tipo}
                onValueChange={(value) => setFilters({...filters, tipo: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="tributario">Tributário</SelectItem>
                  <SelectItem value="judicial">Judicial</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({...filters, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="listado">Listado</SelectItem>
                  <SelectItem value="vendido">Vendido</SelectItem>
                  <SelectItem value="liquidado">Liquidado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filters.periodo === 'custom' && (
              <>
                <div className="space-y-2">
                  <Label>Data Início</Label>
                  <Input
                    type="date"
                    value={filters.dataInicio}
                    onChange={(e) => setFilters({...filters, dataInicio: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Data Fim</Label>
                  <Input
                    type="date"
                    value={filters.dataFim}
                    onChange={(e) => setFilters({...filters, dataFim: e.target.value})}
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <Button variant="outline" onClick={clearFilters}>
              Limpar Filtros
            </Button>
            <Button onClick={loadReportData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Resumo */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Tokens</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Total</p>
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(stats.valorTotal)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Crescimento Mensal</p>
                  <p className="text-3xl font-bold text-blue-600">+{stats.crescimentoMensal.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Médio</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {formatCurrency(stats.valorTotal / stats.total)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Distribuição por Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, percentage}) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Distribuição por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Distribuição por Tipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.tipoData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evolução Temporal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChartIcon className="w-5 h-5" />
            Evolução de Tokens e Valores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.crescimentoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'valor' ? formatCurrency(Number(value)) : value,
                    name === 'tokens' ? 'Tokens' : 'Valor Total'
                  ]}
                />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="tokens" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="valor" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Resumo */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Detalhado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Categoria</th>
                  <th className="text-right p-2">Quantidade</th>
                  <th className="text-right p-2">Percentual</th>
                  <th className="text-right p-2">Valor Total</th>
                </tr>
              </thead>
              <tbody>
                {chartData.statusData.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">
                      <Badge variant="outline">{item.name}</Badge>
                    </td>
                    <td className="text-right p-2 font-medium">{item.value}</td>
                    <td className="text-right p-2">{item.percentage}%</td>
                    <td className="text-right p-2 font-medium">
                      {formatCurrency((item.value / (stats?.total || 1)) * (stats?.valorTotal || 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 