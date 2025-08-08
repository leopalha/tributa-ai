import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  Store, 
  TrendingUp, 
  DollarSign, 
  ArrowRightLeft,
  PieChart,
  History,
  Target,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { useDemoUser } from '@/hooks/useDemoUser';

export function MainDashboard() {
  const { currentUser } = useDemoUser();

  // Dados mockados para usuário regular
  const userStats = {
    walletBalance: 50000,
    totalInvestments: 250000,
    monthlyReturn: 3.5,
    activeCredits: 5,
    pendingTransactions: 2,
    availableOpportunities: 12
  };

  const recentTransactions = [
    { id: 1, type: 'buy', title: 'ICMS-SP Indústria', amount: 45000, date: '2024-01-15', status: 'completed' },
    { id: 2, type: 'sell', title: 'Precatório TJRJ', amount: 80000, date: '2024-01-12', status: 'completed' },
    { id: 3, type: 'buy', title: 'CPR Soja', amount: 25000, date: '2024-01-10', status: 'pending' },
  ];

  const opportunities = [
    { id: 1, title: 'ICMS-MG Exportação', value: 120000, discount: 15, yield: 18.5 },
    { id: 2, title: 'Debênture Verde', value: 75000, discount: 10, yield: 12.0 },
    { id: 3, title: 'CPR Milho', value: 35000, discount: 20, yield: 22.0 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Bem-vindo, {currentUser?.name}! Acompanhe seus investimentos e oportunidades.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <CreditCard className="w-4 h-4 mr-2" />
            Conta Ativa
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Saldo Disponível</CardTitle>
            <Wallet className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900">R$ {userStats.walletBalance.toLocaleString()}</div>
            <p className="text-xs text-gray-600">
              Disponível para investir
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Investimentos</CardTitle>
            <PieChart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900">R$ {userStats.totalInvestments.toLocaleString()}</div>
            <p className="text-xs text-gray-600">
              {userStats.activeCredits} títulos ativos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Retorno Mensal</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-green-600">+{userStats.monthlyReturn}%</div>
            <p className="text-xs text-gray-600">
              Acima da média do mercado
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Oportunidades</CardTitle>
            <Target className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-blue-600">{userStats.availableOpportunities}</div>
            <p className="text-xs text-gray-600">
              Novas oportunidades disponíveis
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <History className="h-5 w-5 text-blue-600" />
                Transações Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'buy' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {transaction.type === 'buy' ? <ArrowRightLeft className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{transaction.title}</p>
                        <p className="text-xs text-gray-600">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-gray-900">
                        {transaction.type === 'buy' ? '-' : '+'}R$ {transaction.amount.toLocaleString()}
                      </p>
                      <Badge 
                        variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                        className={`text-xs ${
                          transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {transaction.status === 'completed' ? 'Concluída' : 'Pendente'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment Opportunities */}
        <div>
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Target className="h-5 w-5 text-blue-600" />
                Oportunidades
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {opportunities.map((opportunity) => (
                  <div key={opportunity.id} className="p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm text-gray-900">{opportunity.title}</h4>
                        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                          {opportunity.discount}% OFF
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Valor:</span>
                          <span className="font-medium text-gray-900">R$ {opportunity.value.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Rendimento:</span>
                          <span className="font-medium text-green-600">{opportunity.yield}% a.a.</span>
                        </div>
                      </div>
                      <Button size="sm" className="w-full text-xs">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <DollarSign className="h-5 w-5 text-blue-600" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-20 flex flex-col items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Store className="h-6 w-6" />
              <span className="text-sm">Marketplace</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-gray-300 hover:bg-gray-50">
              <Wallet className="h-6 w-6" />
              <span className="text-sm">Minha Carteira</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-gray-300 hover:bg-gray-50">
              <ArrowRightLeft className="h-6 w-6" />
              <span className="text-sm">Compensação</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-gray-300 hover:bg-gray-50">
              <PieChart className="h-6 w-6" />
              <span className="text-sm">Relatórios</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pending Actions */}
      {userStats.pendingTransactions > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 shadow-sm">
          <CardHeader className="border-b border-yellow-200">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              Ações Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-yellow-700 mb-4">
              Você tem {userStats.pendingTransactions} transação(ões) pendente(s) que requer(em) sua atenção.
            </p>
            <Button variant="outline" size="sm" className="border-yellow-300 text-yellow-700 hover:bg-yellow-100">
              Ver Transações Pendentes
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 