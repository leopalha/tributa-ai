import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/spinner';
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, Calendar, PieChart, BarChart3 } from 'lucide-react';

// Componentes de gráficos
import { LineChartComponent } from '@/components/charts/LineChartComponent';
import { PieChartComponent } from '@/components/charts/PieChartComponent';
import { BarChartComponent } from '@/components/charts/BarChartComponent';

interface WalletAnalyticsProps {
  data: any;
  loading: boolean;
  onRefresh: () => void;
}

export function WalletAnalytics({ data, loading, onRefresh }: WalletAnalyticsProps) {
  // Dados para os gráficos
  const balanceHistoryData = data?.balanceHistory || generateMockBalanceHistory();
  const transactionsByCategory = data?.transactionsByCategory || generateMockTransactionsByCategory();
  const monthlyActivity = data?.monthlyActivity || generateMockMonthlyActivity();

  // Formatar valor como moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Calcular estatísticas
  const totalDeposits = data?.totalDeposits || 12500;
  const totalWithdrawals = data?.totalWithdrawals || 8750;
  const averageTransaction = data?.averageTransaction || 1850;
  const transactionGrowth = data?.transactionGrowth || 12.5;
  const isGrowthPositive = transactionGrowth >= 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Análise Financeira</h3>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
          {loading ? <Spinner className="h-4 w-4 mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Atualizar Dados
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner className="h-8 w-8" />
          <span className="ml-2 text-gray-500">Carregando análises...</span>
        </div>
      ) : (
        <>
          {/* Cards de estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Total de Depósitos</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalDeposits)}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Total de Saques</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalWithdrawals)}</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Média por Transação</p>
                    <p className="text-2xl font-bold">{formatCurrency(averageTransaction)}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Crescimento (30d)</p>
                    <p className={`text-2xl font-bold ${isGrowthPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isGrowthPositive ? '+' : ''}{transactionGrowth}%
                    </p>
                  </div>
                  <div className={`${isGrowthPositive ? 'bg-green-100' : 'bg-red-100'} p-3 rounded-full`}>
                    {isGrowthPositive ? (
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
                  Histórico de Saldo
                </CardTitle>
                <CardDescription>
                  Evolução do saldo nos últimos 30 dias
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <LineChartComponent 
                  data={balanceHistoryData}
                  xAxisKey="date"
                  lineKeys={["balance"]}
                  colors={["#3b82f6"]}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5 text-blue-600" />
                  Transações por Categoria
                </CardTitle>
                <CardDescription>
                  Distribuição de transações por categoria
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <PieChartComponent 
                  data={transactionsByCategory}
                  nameKey="category"
                  valueKey="amount"
                  colors={["#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#22c55e"]}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                  Atividade Mensal
                </CardTitle>
                <CardDescription>
                  Depósitos e saques por mês
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <BarChartComponent 
                  data={monthlyActivity}
                  xAxisKey="month"
                  barKeys={["deposits", "withdrawals"]}
                  colors={["#22c55e", "#ef4444"]}
                />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

// Funções para gerar dados de exemplo
function generateMockBalanceHistory() {
  const data = [];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      balance: 5000 + Math.random() * 10000 - i * 50 + i * i * 2,
    });
  }
  
  return data;
}

function generateMockTransactionsByCategory() {
  return [
    { category: "Depósitos", amount: 12500 },
    { category: "Saques", amount: 8750 },
    { category: "Taxas", amount: 1200 },
    { category: "Recompensas", amount: 850 },
    { category: "Outros", amount: 350 },
  ];
}

function generateMockMonthlyActivity() {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
  
  return months.map(month => ({
    month,
    deposits: Math.floor(Math.random() * 5000) + 1000,
    withdrawals: Math.floor(Math.random() * 4000) + 500,
  }));
} 