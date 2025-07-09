import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Eye, 
  Calendar, 
  PieChart, 
  LineChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Percent, 
  CreditCard, 
  Building, 
  Map, 
  Download,
  FileSpreadsheet,
  Printer,
  Share2
} from 'lucide-react';

// Componentes de gráficos simulados
const LineChartComponent = ({ data, height = 200 }) => (
  <div className="w-full" style={{ height }}>
    <div className="w-full h-full flex items-end">
      {data.map((value, index) => (
        <div 
          key={index} 
          className="flex-1 mx-0.5 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
          style={{ height: `${(value / Math.max(...data)) * 100}%` }}
        />
      ))}
    </div>
  </div>
);

const BarChartComponent = ({ data, height = 200 }) => (
  <div className="w-full" style={{ height }}>
    <div className="w-full h-full flex items-end">
      {data.map((value, index) => (
        <div 
          key={index} 
          className="flex-1 mx-1 bg-gradient-to-t from-green-500 to-green-300 rounded-t"
          style={{ height: `${(value / Math.max(...data)) * 100}%` }}
        />
      ))}
    </div>
  </div>
);

const PieChartComponent = ({ data, height = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let startAngle = 0;
  
  return (
    <div className="w-full flex justify-center" style={{ height }}>
      <div className="relative w-full max-w-[200px] h-full">
        <div className="absolute inset-0 rounded-full border-8 border-gray-100"></div>
        {data.map((segment, index) => {
          const angle = (segment.value / total) * 360;
          const endAngle = startAngle + angle;
          const largeArcFlag = angle > 180 ? 1 : 0;
          
          // Calcular pontos no círculo
          const startX = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
          const startY = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
          const endX = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
          const endY = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);
          
          const path = `
            M 100 100
            L ${startX} ${startY}
            A 80 80 0 ${largeArcFlag} 1 ${endX} ${endY}
            Z
          `;
          
          const result = (
            <svg key={index} className="absolute inset-0" viewBox="0 0 200 200">
              <path d={path} fill={segment.color} />
            </svg>
          );
          
          startAngle = endAngle;
          return result;
        })}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold">{total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercent = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  // Dados simulados
  const volumeData = [1200000, 1500000, 1800000, 2200000, 2500000, 2800000];
  const transactionsData = [32, 38, 41, 45, 47, 52];
  const viewsData = [1850, 2100, 2350, 2600, 2847, 3050];
  
  const categoryDistribution = [
    { name: 'ICMS', value: 20, color: '#3b82f6' },
    { name: 'PIS/COFINS', value: 16, color: '#10b981' },
    { name: 'IRPJ', value: 12, color: '#f59e0b' },
    { name: 'CSLL', value: 8, color: '#8b5cf6' },
    { name: 'IPI', value: 4, color: '#ef4444' }
  ];
  
  const regionDistribution = [
    { name: 'Sudeste', value: 45, color: '#3b82f6' },
    { name: 'Sul', value: 25, color: '#10b981' },
    { name: 'Nordeste', value: 15, color: '#f59e0b' },
    { name: 'Centro-Oeste', value: 10, color: '#8b5cf6' },
    { name: 'Norte', value: 5, color: '#ef4444' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics do Marketplace</h1>
          <p className="text-gray-600">Métricas e relatórios de performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mês</SelectItem>
              <SelectItem value="quarter">Último trimestre</SelectItem>
              <SelectItem value="year">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <FileSpreadsheet className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Volume Total</p>
                    <p className="text-2xl font-bold">{formatCurrency(2500000)}</p>
                    <div className="flex items-center mt-1 text-green-600 text-sm">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      <span>+12.5% vs. período anterior</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Transações</p>
                    <p className="text-2xl font-bold">47</p>
                    <div className="flex items-center mt-1 text-green-600 text-sm">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      <span>+8.3% vs. período anterior</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Desconto Médio</p>
                    <p className="text-2xl font-bold">12.5%</p>
                    <div className="flex items-center mt-1 text-red-600 text-sm">
                      <ArrowDownRight className="w-3 h-3 mr-1" />
                      <span>-2.1% vs. período anterior</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Percent className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Satisfação</p>
                    <p className="text-2xl font-bold">4.8/5</p>
                    <div className="flex items-center mt-1 text-green-600 text-sm">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      <span>+0.2 vs. período anterior</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos principais */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Volume de Transações</CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChartComponent data={volumeData} height={220} />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Jan</span>
                  <span>Fev</span>
                  <span>Mar</span>
                  <span>Abr</span>
                  <span>Mai</span>
                  <span>Jun</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
                <CardDescription>Número de transações</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col">
                <PieChartComponent data={categoryDistribution} height={220} />
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {categoryDistribution.map((category, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                      <span className="text-sm">{category.name}: {category.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Métricas secundárias */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Visualizações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <Eye className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-2xl font-bold">2,847</p>
                    <p className="text-sm text-gray-600">Últimos 30 dias</p>
                  </div>
                  <div className="h-16">
                    <BarChartComponent data={viewsData} height={64} />
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-gray-600">Média diária</p>
                    <p className="font-medium">94.9</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Taxa de conversão</p>
                    <p className="font-medium">1.65%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tempo Médio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <p className="text-2xl font-bold">6.3</p>
                  <p className="text-sm text-gray-600">Dias para venda</p>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>ICMS</span>
                    <span className="font-medium">5.2 dias</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>PIS/COFINS</span>
                    <span className="font-medium">7.8 dias</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Precatórios</span>
                    <span className="font-medium">9.5 dias</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribuição Regional</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-4">
                  <Map className="w-8 h-8 text-green-500" />
                </div>
                <div className="space-y-3">
                  {regionDistribution.map((region, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{region.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{ width: `${region.value}%`, backgroundColor: region.color }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{region.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Transações</CardTitle>
              <CardDescription>
                Dados detalhados sobre transações no marketplace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Análise de transações em desenvolvimento
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Esta funcionalidade estará disponível em breve com relatórios detalhados e gráficos interativos.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Usuários</CardTitle>
              <CardDescription>
                Comportamento e estatísticas de usuários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Análise de usuários em desenvolvimento
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Esta funcionalidade estará disponível em breve com relatórios detalhados e gráficos interativos.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
