import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Bot,
  DollarSign,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Brain,
  Settings,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import TradingPlatformProfessional from '@/components/trading/TradingPlatformProfessional';
import { toast } from 'sonner';

interface BotMetrics {
  totalBots: number;
  activeBots: number;
  totalTrades: number;
  successRate: number;
  totalVolume: number;
  totalPnL: number;
  avgConfidence: number;
  systemHealth: number;
}

interface BotActivity {
  id: string;
  botName: string;
  action: 'BUY' | 'SELL' | 'ANALYZE' | 'ALERT';
  instrument: string;
  amount: number;
  price: number;
  timestamp: Date;
  result: 'SUCCESS' | 'PENDING' | 'FAILED';
  pnl?: number;
}

interface MarketOverview {
  totalMarketCap: number;
  dailyVolume: number;
  activeInstruments: number;
  topPerformers: Array<{
    symbol: string;
    change: number;
    volume: number;
  }>;
  marketSentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  volatilityIndex: number;
}

export default function TradingPageProfessional() {
  const [activeTab, setActiveTab] = useState('platform');
  const [botMetrics, setBotMetrics] = useState<BotMetrics>({
    totalBots: 20,
    activeBots: 18,
    totalTrades: 1247,
    successRate: 94.2,
    totalVolume: 15750000,
    totalPnL: 485000,
    avgConfidence: 87.5,
    systemHealth: 98.3,
  });
  const [botActivities, setBotActivities] = useState<BotActivity[]>([]);
  const [marketOverview, setMarketOverview] = useState<MarketOverview>({
    totalMarketCap: 125000000,
    dailyVolume: 8500000,
    activeInstruments: 45,
    topPerformers: [
      { symbol: 'ICMS-SOY', change: 3.2, volume: 2500000 },
      { symbol: 'CPR-CORN', change: 2.8, volume: 1800000 },
      { symbol: 'PREC-SP', change: -1.5, volume: 1200000 },
    ],
    marketSentiment: 'BULLISH',
    volatilityIndex: 15.8,
  });
  const [systemStatus, setSystemStatus] = useState({
    trading: true,
    bots: true,
    dataFeed: true,
    blockchain: true,
  });

  useEffect(() => {
    // Simular atividades dos bots em tempo real
    const interval = setInterval(() => {
      generateBotActivity();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const generateBotActivity = () => {
    const botNames = [
      'AlphaBot-001',
      'BetaBot-002',
      'GammaBot-003',
      'DeltaBot-004',
      'SigmaBot-005',
      'OmegaBot-006',
      'ThetaBot-007',
      'LambdaBot-008',
    ];

    const instruments = ['ICMS-SOY', 'PREC-SP', 'CPR-CORN', 'PIS-PHARM', 'IRPJ-TECH'];
    const actions: ('BUY' | 'SELL' | 'ANALYZE' | 'ALERT')[] = ['BUY', 'SELL', 'ANALYZE', 'ALERT'];
    const results: ('SUCCESS' | 'PENDING' | 'FAILED')[] = ['SUCCESS', 'PENDING', 'FAILED'];

    const newActivity: BotActivity = {
      id: Date.now().toString(),
      botName: botNames[Math.floor(Math.random() * botNames.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      instrument: instruments[Math.floor(Math.random() * instruments.length)],
      amount: Math.floor(Math.random() * 10000) + 1000,
      price: 0.5 + Math.random() * 0.5,
      timestamp: new Date(),
      result: results[Math.floor(Math.random() * results.length)],
      pnl: Math.random() > 0.5 ? Math.floor(Math.random() * 5000) - 2500 : undefined,
    };

    setBotActivities(prev => [newActivity, ...prev.slice(0, 19)]);
  };

  const toggleBotSystem = () => {
    setSystemStatus(prev => ({ ...prev, bots: !prev.bots }));
    toast.success(`Sistema de bots ${systemStatus.bots ? 'pausado' : 'ativado'}`);
  };

  const toggleTradingSystem = () => {
    setSystemStatus(prev => ({ ...prev, trading: !prev.trading }));
    toast.success(`Sistema de trading ${systemStatus.trading ? 'pausado' : 'ativado'}`);
  };

  const restartSystem = () => {
    toast.success('Sistema reiniciado com sucesso');
    // Simular reinicialização
    setTimeout(() => {
      setSystemStatus({
        trading: true,
        bots: true,
        dataFeed: true,
        blockchain: true,
      });
    }, 2000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY':
        return 'text-green-400';
      case 'SELL':
        return 'text-red-400';
      case 'ANALYZE':
        return 'text-blue-400';
      case 'ALERT':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'SUCCESS':
        return 'text-green-400';
      case 'PENDING':
        return 'text-yellow-400';
      case 'FAILED':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-4 h-4 text-green-400" />
    ) : (
      <AlertTriangle className="w-4 h-4 text-red-400" />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trading Platform</h1>
            <p className="text-gray-600">Plataforma profissional para títulos tokenizados</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant={systemStatus.bots ? 'destructive' : 'default'}
              onClick={toggleBotSystem}
              className="flex items-center space-x-2"
            >
              {systemStatus.bots ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{systemStatus.bots ? 'Pausar Bots' : 'Ativar Bots'}</span>
            </Button>
            <Button
              variant={systemStatus.trading ? 'destructive' : 'default'}
              onClick={toggleTradingSystem}
              className="flex items-center space-x-2"
            >
              {systemStatus.trading ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{systemStatus.trading ? 'Pausar Trading' : 'Ativar Trading'}</span>
            </Button>
            <Button variant="outline" onClick={restartSystem}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reiniciar
            </Button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Trading System</p>
                <p className="text-lg font-semibold text-gray-900">
                  {systemStatus.trading ? 'Ativo' : 'Inativo'}
                </p>
              </div>
              {getStatusIcon(systemStatus.trading)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bot System</p>
                <p className="text-lg font-semibold text-gray-900">
                  {systemStatus.bots ? 'Ativo' : 'Inativo'}
                </p>
              </div>
              {getStatusIcon(systemStatus.bots)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Data Feed</p>
                <p className="text-lg font-semibold text-gray-900">
                  {systemStatus.dataFeed ? 'Conectado' : 'Desconectado'}
                </p>
              </div>
              {getStatusIcon(systemStatus.dataFeed)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Blockchain</p>
                <p className="text-lg font-semibold text-gray-900">
                  {systemStatus.blockchain ? 'Sincronizado' : 'Erro'}
                </p>
              </div>
              {getStatusIcon(systemStatus.blockchain)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="platform">Plataforma de Trading</TabsTrigger>
          <TabsTrigger value="bots">Monitoramento de Bots</TabsTrigger>
          <TabsTrigger value="market">Visão de Mercado</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="platform" className="mt-6">
          <TradingPlatformProfessional />
        </TabsContent>

        <TabsContent value="bots" className="mt-6 space-y-6">
          {/* Bot Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total de Bots</p>
                    <p className="text-2xl font-bold text-blue-600">{botMetrics.totalBots}</p>
                  </div>
                  <Bot className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Bots Ativos</p>
                    <p className="text-2xl font-bold text-green-600">{botMetrics.activeBots}</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Taxa de Sucesso</p>
                    <p className="text-2xl font-bold text-purple-600">{botMetrics.successRate}%</p>
                  </div>
                  <Target className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Volume Total</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatCurrency(botMetrics.totalVolume)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bot Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>Atividades dos Bots em Tempo Real</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {botActivities.map(activity => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Bot className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.botName}</p>
                        <p className="text-sm text-gray-600">
                          <span className={getActionColor(activity.action)}>{activity.action}</span>{' '}
                          {activity.instrument} - {activity.amount} unidades
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(activity.price)}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${getResultColor(activity.result)}`}>
                          {activity.result}
                        </span>
                        {activity.pnl && (
                          <span
                            className={`text-sm ${activity.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {formatCurrency(activity.pnl)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="mt-6 space-y-6">
          {/* Market Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Market Cap Total</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(marketOverview.totalMarketCap)}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Volume Diário</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(marketOverview.dailyVolume)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Instrumentos Ativos</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {marketOverview.activeInstruments}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Melhores Performadores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketOverview.topPerformers.map((performer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{performer.symbol}</p>
                        <p className="text-sm text-gray-600">
                          Volume: {formatCurrency(performer.volume)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`flex items-center space-x-1 ${
                          performer.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {performer.change >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="font-medium">{formatPercent(performer.change)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Sentiment */}
          <Card>
            <CardHeader>
              <CardTitle>Sentimento do Mercado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center">
                  <div
                    className={`text-6xl font-bold mb-2 ${
                      marketOverview.marketSentiment === 'BULLISH'
                        ? 'text-green-600'
                        : marketOverview.marketSentiment === 'BEARISH'
                          ? 'text-red-600'
                          : 'text-gray-600'
                    }`}
                  >
                    {marketOverview.marketSentiment === 'BULLISH'
                      ? '📈'
                      : marketOverview.marketSentiment === 'BEARISH'
                        ? '📉'
                        : '➡️'}
                  </div>
                  <p className="text-lg font-medium text-gray-900">
                    {marketOverview.marketSentiment}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2 text-orange-600">
                    {marketOverview.volatilityIndex.toFixed(1)}
                  </div>
                  <p className="text-lg font-medium text-gray-900">Índice de Volatilidade</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance dos Bots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total de Trades</span>
                    <span className="font-medium">{botMetrics.totalTrades.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">P&L Total</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(botMetrics.totalPnL)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Confiança Média</span>
                    <span className="font-medium">{botMetrics.avgConfidence}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Saúde do Sistema</span>
                    <span className="font-medium text-green-600">{botMetrics.systemHealth}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estatísticas de Mercado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Capitalização Total</span>
                    <span className="font-medium">
                      {formatCurrency(marketOverview.totalMarketCap)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Volume 24h</span>
                    <span className="font-medium">
                      {formatCurrency(marketOverview.dailyVolume)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Títulos Ativos</span>
                    <span className="font-medium">{marketOverview.activeInstruments}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Volatilidade</span>
                    <span className="font-medium text-orange-600">
                      {marketOverview.volatilityIndex}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
