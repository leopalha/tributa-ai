import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTC } from '@/hooks/useTC';
import { formatCurrency } from '@/lib/utils';
import { TCType, TC } from '@/types/tc';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface TCAnalyticsProps {
  tc: TC | null;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function TCAnalytics({ tc }: TCAnalyticsProps) {
  const { obterEstatisticas } = useTC();
  const [periodo, setPeriodo] = useState<'7d' | '30d' | '90d' | '365d'>('30d');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{
    totalCreditos: number;
    totalCompensacoes: number;
    totalTransacoes: number;
    mediaNegociacao: number;
    volumeNegociado: number;
    distribuicaoPorTipo: Record<TCType, number>;
    historicoTransacoes: Array<{
      data: string;
      valor: number;
      tipo: string;
    }>;
  }>({
    totalCreditos: 0,
    totalCompensacoes: 0,
    totalTransacoes: 0,
    mediaNegociacao: 0,
    volumeNegociado: 0,
    distribuicaoPorTipo: {
      'TC-F': 0,
      'TC-E': 0,
      'TC-M': 0,
    },
    historicoTransacoes: [],
  });

  useEffect(() => {
    loadStats();
  }, [tc, periodo]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await obterEstatisticas(tc?.emissor?.id, { periodo });
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const pieData = Object.entries(stats.distribuicaoPorTipo).map(([tipo, valor]) => ({
    name: tipo,
    value: valor,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <Select value={periodo} onValueChange={(value: any) => setPeriodo(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
            <SelectItem value="365d">Último ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Créditos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalCreditos)}</div>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              +{((stats.totalCreditos / stats.volumeNegociado - 1) * 100).toFixed(1)}% em relação ao
              período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Compensações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalCompensacoes)}</div>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              {stats.totalCompensacoes} compensações realizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume Negociado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.volumeNegociado)}</div>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              {stats.totalTransacoes} transações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Negociação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.mediaNegociacao)}</div>
            <Progress
              value={(stats.mediaNegociacao / stats.volumeNegociado) * 100}
              className="h-2"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Tipo de TC</CardTitle>
            <CardDescription>
              Distribuição do volume negociado por tipo de título de crédito
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Transações</CardTitle>
            <CardDescription>Volume de transações ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.historicoTransacoes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="valor" name="Valor" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
