import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  TrendingUp,
  Store,
  Activity,
  Bell,
  BarChart3,
  CheckCircle,
  Zap,
  RefreshCw,
  Search,
} from 'lucide-react';

const DashboardPageSimple = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Tributa.AI</h1>
          <p className="text-gray-600 mt-1">
            Bem-vindo à plataforma de recuperação de créditos tributários
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard/status"
            className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
          >
            <Activity className="h-4 w-4 mr-2" />
            Status do Sistema
          </Link>
          <Link
            to="/dashboard/notifications"
            className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Bell className="w-4 h-4 mr-2" />
            Notificações
          </Link>
          <Link
            to="/dashboard/admin/system-health"
            className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
          >
            <Activity className="w-4 h-4 mr-2" />
            Sistema de Saúde
          </Link>
        </div>
      </div>

      {/* Links de Acesso Rápido */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Acesso Rápido</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/recuperacao"
            className="flex items-center p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg"
          >
            <RefreshCw className="h-8 w-8 mr-3" />
            <div>
              <h4 className="font-semibold">Recuperação</h4>
              <p className="text-sm opacity-90">Sistema principal da plataforma</p>
            </div>
          </Link>

          <Link
            to="/dashboard/trading-pro"
            className="flex items-center p-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200 shadow-lg"
          >
            <TrendingUp className="h-8 w-8 mr-3" />
            <div>
              <h4 className="font-semibold">Trading Profissional</h4>
              <p className="text-sm opacity-90">Plataforma estilo IQ Option</p>
            </div>
          </Link>

          <Link
            to="/dashboard/marketplace"
            className="flex items-center p-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg"
          >
            <Store className="h-8 w-8 mr-3" />
            <div>
              <h4 className="font-semibold">Marketplace</h4>
              <p className="text-sm opacity-90">Negociação de títulos</p>
            </div>
          </Link>

          <Link
            to="/dashboard/tokenizacao"
            className="flex items-center p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            <Zap className="h-8 w-8 mr-3" />
            <div>
              <h4 className="font-semibold">Tokenização</h4>
              <p className="text-sm opacity-90">Transforme créditos em tokens</p>
            </div>
          </Link>

          <Link
            to="/dashboard/blockchain"
            className="flex items-center p-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
          >
            <Activity className="h-8 w-8 mr-3" />
            <div>
              <h4 className="font-semibold">Blockchain</h4>
              <p className="text-sm opacity-90">Visualize transações</p>
            </div>
          </Link>

          <Link
            to="/dashboard/recuperacao/analise"
            className="flex items-center p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-lg"
          >
            <Search className="h-8 w-8 mr-3" />
            <div>
              <h4 className="font-semibold">Análise de Obrigações</h4>
              <p className="text-sm opacity-90">IA identifica créditos e obrigações</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Atividade Simulada em Tempo Real */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Atividade em Tempo Real</h2>
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>

        {/* Estatísticas gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bots Ativos</p>
                <p className="text-2xl font-bold text-green-600">6/6</p>
              </div>
              <Bot className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Atividades Hoje</p>
                <p className="text-2xl font-bold text-blue-600">247</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Sucesso</p>
                <p className="text-2xl font-bold text-green-600">97.3%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Volume Total</p>
                <p className="text-2xl font-bold text-purple-600">R$ 2.8M</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Feed de Atividades Simples */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status dos Bots */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Bot className="w-5 h-5 mr-2 text-blue-600" />
                Status dos Bots
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {[
                {
                  name: 'TradeMaster',
                  status: 'active',
                  task: 'Monitorando mercado',
                  success: '98.2%',
                },
                {
                  name: 'AnalyzerPro',
                  status: 'processing',
                  task: 'Analisando documentos fiscais',
                  success: '96.8%',
                },
                {
                  name: 'CompensaBot',
                  status: 'active',
                  task: 'Aguardando compensação',
                  success: '99.1%',
                },
                {
                  name: 'FiscalAI',
                  status: 'active',
                  task: 'Validando obrigações',
                  success: '97.5%',
                },
                {
                  name: 'MarketBot',
                  status: 'active',
                  task: 'Analisando propostas',
                  success: '95.2%',
                },
                {
                  name: 'TokenizerAI',
                  status: 'active',
                  task: 'Registrando tokens',
                  success: '98.7%',
                },
              ].map(bot => (
                <div
                  key={bot.name}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        bot.status === 'active'
                          ? 'bg-green-500'
                          : bot.status === 'processing'
                            ? 'bg-blue-500 animate-pulse'
                            : 'bg-gray-500'
                      }`}
                    ></div>
                    <div>
                      <p className="font-medium text-gray-900">{bot.name}</p>
                      <p className="text-sm text-gray-600">{bot.task}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        bot.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {bot.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{bot.success} sucesso</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Atividades Recentes */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                Atividades Recentes
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {[
                {
                  bot: 'TradeMaster',
                  action: 'Executou transação de compra',
                  amount: 'R$ 45.000',
                  time: '2min atrás',
                  type: 'trade',
                },
                {
                  bot: 'AnalyzerPro',
                  action: 'Identificou oportunidade',
                  amount: 'R$ 85.000',
                  time: '5min atrás',
                  type: 'analysis',
                },
                {
                  bot: 'CompensaBot',
                  action: 'Compensação processada',
                  amount: 'R$ 120.000',
                  time: '10min atrás',
                  type: 'compensation',
                },
                {
                  bot: 'FiscalAI',
                  action: 'Declaração enviada',
                  amount: '',
                  time: '15min atrás',
                  type: 'fiscal',
                },
                {
                  bot: 'MarketBot',
                  action: 'Proposta aceita',
                  amount: 'R$ 67.500',
                  time: '20min atrás',
                  type: 'marketplace',
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    {activity.type === 'trade' && <TrendingUp className="w-4 h-4 text-green-500" />}
                    {activity.type === 'analysis' && (
                      <BarChart3 className="w-4 h-4 text-blue-500" />
                    )}
                    {activity.type === 'compensation' && (
                      <Zap className="w-4 h-4 text-purple-500" />
                    )}
                    {activity.type === 'fiscal' && (
                      <CheckCircle className="w-4 h-4 text-orange-500" />
                    )}
                    {activity.type === 'marketplace' && <Store className="w-4 h-4 text-pink-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{activity.bot}</p>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{activity.action}</p>
                    {activity.amount && (
                      <p className="text-xs font-medium text-green-600 mt-1">{activity.amount}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPageSimple;
