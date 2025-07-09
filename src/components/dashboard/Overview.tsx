import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { memo, useState, useMemo, useCallback } from 'react';

// Dados para o gráfico separados como constantes para evitar recriação a cada renderização
const monthlyData = [
  {
    name: 'Jan',
    ICMSRecuperado: 2400,
    PISSuspenso: 1200,
    COFINSSuspenso: 2000,
  },
  {
    name: 'Fev',
    ICMSRecuperado: 3000,
    PISSuspenso: 1800,
    COFINSSuspenso: 2200,
  },
  {
    name: 'Mar',
    ICMSRecuperado: 2000,
    PISSuspenso: 1300,
    COFINSSuspenso: 1500,
  },
  {
    name: 'Abr',
    ICMSRecuperado: 2780,
    PISSuspenso: 3200,
    COFINSSuspenso: 2500,
  },
  {
    name: 'Mai',
    ICMSRecuperado: 1890,
    PISSuspenso: 2300,
    COFINSSuspenso: 1800,
  },
  {
    name: 'Jun',
    ICMSRecuperado: 2390,
    PISSuspenso: 2800,
    COFINSSuspenso: 2100,
  },
];

const quarterlyData = [
  {
    name: 'Q1',
    ICMSRecuperado: 7400,
    PISSuspenso: 4300,
    COFINSSuspenso: 5700,
  },
  {
    name: 'Q2',
    ICMSRecuperado: 7060,
    PISSuspenso: 8300,
    COFINSSuspenso: 6400,
  },
  {
    name: 'Q3',
    ICMSRecuperado: 5200,
    PISSuspenso: 5800,
    COFINSSuspenso: 4900,
  },
  {
    name: 'Q4',
    ICMSRecuperado: 6800,
    PISSuspenso: 7100,
    COFINSSuspenso: 6200,
  },
];

const yearlyData = [
  {
    name: '2021',
    ICMSRecuperado: 25200,
    PISSuspenso: 21500,
    COFINSSuspenso: 19800,
  },
  {
    name: '2022',
    ICMSRecuperado: 28600,
    PISSuspenso: 24900,
    COFINSSuspenso: 22400,
  },
  {
    name: '2023',
    ICMSRecuperado: 32100,
    PISSuspenso: 27500,
    COFINSSuspenso: 24900,
  },
  {
    name: '2024',
    ICMSRecuperado: 26460,
    PISSuspenso: 25500,
    COFINSSuspenso: 23200,
  },
];

// Componente de tooltip memoizado para evitar re-renderizações
const CustomTooltip = memo(({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Card className="p-2 bg-[hsl(var(--background))] border shadow-md">
        <p className="font-medium">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
            <span style={{ color: entry.color }}>
              {`${entry.name}: R$ ${entry.value.toLocaleString('pt-BR')}`}
            </span>
          </div>
        ))}
      </Card>
    );
  }
  return null;
});

CustomTooltip.displayName = 'CustomTooltip';

// Componente de gráfico memoizado
const ChartComponent = memo(({ data, title }: { data: any[]; title: string }) => {
  // Formatar números como moeda
  const formatCurrency = useCallback((value: number) => `R$ ${value.toLocaleString('pt-BR')}`, []);

  return (
    <Card className="col-span-1 bg-transparent border-none shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.1)" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '15px' }} />
            <Bar
              dataKey="ICMSRecuperado"
              name="ICMS Recuperado"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
            />
            <Bar
              dataKey="PISSuspenso"
              name="PIS Suspenso"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
            <Bar
              dataKey="COFINSSuspenso"
              name="COFINS Suspenso"
              fill="#eab308"
              radius={[4, 4, 0, 0]}
              animationDuration={2000}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

ChartComponent.displayName = 'ChartComponent';

// Criando componente principal utilizando memo para evitar re-renderizações desnecessárias
const Overview = memo(() => {
  const [period, setPeriod] = useState('monthly');

  // Use useMemo para evitar cálculos desnecessários
  const chartData = useMemo(() => {
    switch (period) {
      case 'monthly':
        return monthlyData;
      case 'quarterly':
        return quarterlyData;
      case 'yearly':
        return yearlyData;
      default:
        return monthlyData;
    }
  }, [period]);

  // Use useMemo para evitar recriação desnecessária de títulos
  const chartTitle = useMemo(() => {
    switch (period) {
      case 'monthly':
        return 'Créditos Tributários Recuperados (2024)';
      case 'quarterly':
        return 'Créditos Tributários Recuperados (2024)';
      case 'yearly':
        return 'Créditos Tributários Recuperados (por Ano)';
      default:
        return 'Créditos Tributários Recuperados';
    }
  }, [period]);

  return (
    <div className="space-y-4 px-2">
      <Tabs defaultValue="monthly" className="w-full" onValueChange={setPeriod}>
        <div className="flex items-center justify-between">
          <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <TabsTrigger
              value="monthly"
              className="transition-all rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
            >
              Mensal
            </TabsTrigger>
            <TabsTrigger
              value="quarterly"
              className="transition-all rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
            >
              Trimestral
            </TabsTrigger>
            <TabsTrigger
              value="yearly"
              className="transition-all rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
            >
              Anual
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="monthly" className="mt-2 space-y-4">
          <ChartComponent data={chartData} title={chartTitle} />
        </TabsContent>

        <TabsContent value="quarterly" className="mt-2 space-y-4">
          <ChartComponent data={chartData} title={chartTitle} />
        </TabsContent>

        <TabsContent value="yearly" className="mt-2 space-y-4">
          <ChartComponent data={chartData} title={chartTitle} />
        </TabsContent>
      </Tabs>
    </div>
  );
});

Overview.displayName = 'Overview';

export { Overview };
