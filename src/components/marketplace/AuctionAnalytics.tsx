import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Users,
  Clock,
  Eye,
  Target,
  Award,
  ArrowUp,
  ArrowDown,
  Calendar,
  Filter,
  Download,
  Share2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuctionAnalyticsProps {
  auctionId?: string;
  showGlobalAnalytics?: boolean;
  dateRange?: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  description?: string;
}

export function AuctionAnalytics({
  auctionId,
  showGlobalAnalytics = true,
  dateRange = 'month',
}: AuctionAnalyticsProps) {
  const [selectedDateRange, setSelectedDateRange] = useState(dateRange);
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock data for charts
  const performanceData = [
    { date: '01/01', views: 120, bids: 45, conversion: 37.5 },
    { date: '02/01', views: 150, bids: 52, conversion: 34.7 },
    { date: '03/01', views: 180, bids: 68, conversion: 37.8 },
    { date: '04/01', views: 200, bids: 75, conversion: 37.5 },
    { date: '05/01', views: 220, bids: 82, conversion: 37.3 },
    { date: '06/01', views: 250, bids: 95, conversion: 38.0 },
    { date: '07/01', views: 280, bids: 105, conversion: 37.5 },
  ];

  const categoryData = [
    { name: 'ICMS', value: 35, revenue: 2850000 },
    { name: 'PIS/COFINS', value: 25, revenue: 1450000 },
    { name: 'Precatórios', value: 20, revenue: 3200000 },
    { name: 'IRPJ', value: 15, revenue: 1680000 },
    { name: 'Outros', value: 5, revenue: 450000 },
  ];

  const timeDistribution = [
    { hour: '00h', bids: 5 },
    { hour: '06h', bids: 12 },
    { hour: '09h', bids: 45 },
    { hour: '12h', bids: 38 },
    { hour: '15h', bids: 52 },
    { hour: '18h', bids: 65 },
    { hour: '21h', bids: 42 },
  ];

  const competitivenessData = [
    { metric: 'Participantes', value: 85 },
    { metric: 'Lances/Leilão', value: 72 },
    { metric: 'Tempo Médio', value: 68 },
    { metric: 'Taxa de Conclusão', value: 92 },
    { metric: 'Satisfação', value: 88 },
    { metric: 'Retorno', value: 75 },
  ];

  const metrics: MetricCard[] = [
    {
      title: 'Receita Total',
      value: 'R$ 9.63M',
      change: 15.3,
      trend: 'up',
      icon: <DollarSign className="h-5 w-5" />,
      description: 'Últimos 30 dias',
    },
    {
      title: 'Leilões Ativos',
      value: 127,
      change: 8.2,
      trend: 'up',
      icon: <Activity className="h-5 w-5" />,
      description: '+10 esta semana',
    },
    {
      title: 'Taxa de Conversão',
      value: '37.5%',
      change: -2.1,
      trend: 'down',
      icon: <Target className="h-5 w-5" />,
      description: 'Views para lances',
    },
    {
      title: 'Participantes Únicos',
      value: '3,842',
      change: 22.5,
      trend: 'up',
      icon: <Users className="h-5 w-5" />,
      description: '+685 novos',
    },
    {
      title: 'Tempo Médio',
      value: '4.2 dias',
      change: -15.3,
      trend: 'up',
      icon: <Clock className="h-5 w-5" />,
      description: 'Duração dos leilões',
    },
    {
      title: 'Visualizações',
      value: '45.2K',
      change: 32.1,
      trend: 'up',
      icon: <Eye className="h-5 w-5" />,
      description: '+10.9K este mês',
    },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  const MetricCard = ({ metric }: { metric: MetricCard }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
            <p className="text-2xl font-bold">{metric.value}</p>
            {metric.description && (
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <div
              className={cn(
                'p-2 rounded-lg',
                metric.trend === 'up'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : metric.trend === 'down'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
              )}
            >
              {metric.icon}
            </div>
            <div
              className={cn(
                'flex items-center gap-1 text-sm font-medium',
                metric.trend === 'up' && metric.change > 0
                  ? 'text-green-600'
                  : metric.trend === 'down' && metric.change < 0
                    ? 'text-red-600'
                    : 'text-gray-600'
              )}
            >
              {metric.change > 0 ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              {Math.abs(metric.change)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics do Marketplace</h2>
      <p>Sistema de analytics em desenvolvimento...</p>
    </div>
  );
}
