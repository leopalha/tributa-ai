import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface PerformanceData {
  month: string;
  creditosTokenizados: number;
  volumeNegociado: number;
  compensacoes: number;
  novosCadastros: number;
}

interface ChartProps {
  title?: string;
  description?: string;
  loading?: boolean;
}

export function PerformanceChart({
  title = 'Performance Mensal',
  description = 'Evolução do portfólio nos últimos 12 meses',
  loading = false,
}: ChartProps) {
  const [data, setData] = useState<PerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dados simulados realistas
        const mockData: PerformanceData[] = [
          {
            month: 'Jan',
            creditosTokenizados: 850000,
            volumeNegociado: 1200000,
            compensacoes: 450000,
            novosCadastros: 12,
          },
          {
            month: 'Fev',
            creditosTokenizados: 920000,
            volumeNegociado: 1450000,
            compensacoes: 520000,
            novosCadastros: 15,
          },
          {
            month: 'Mar',
            creditosTokenizados: 1100000,
            volumeNegociado: 1680000,
            compensacoes: 650000,
            novosCadastros: 18,
          },
          {
            month: 'Abr',
            creditosTokenizados: 980000,
            volumeNegociado: 1520000,
            compensacoes: 580000,
            novosCadastros: 14,
          },
          {
            month: 'Mai',
            creditosTokenizados: 1250000,
            volumeNegociado: 1890000,
            compensacoes: 720000,
            novosCadastros: 22,
          },
          {
            month: 'Jun',
            creditosTokenizados: 1180000,
            volumeNegociado: 1750000,
            compensacoes: 680000,
            novosCadastros: 20,
          },
        ];

        setData(mockData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading || loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" tickFormatter={value => `${value / 1000000}M`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar
                dataKey="creditosTokenizados"
                fill="#3b82f6"
                name="Tokenizados"
                radius={[4, 4, 0, 0]}
              />
              <Bar dataKey="volumeNegociado" fill="#8b5cf6" name="Volume" radius={[4, 4, 0, 0]} />
              <Bar
                dataKey="compensacoes"
                fill="#10b981"
                name="Compensações"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
