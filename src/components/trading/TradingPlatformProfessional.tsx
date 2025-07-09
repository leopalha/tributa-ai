import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Activity,
  Play,
  Pause,
  Settings,
  DollarSign,
  TrendingUp,
  Target,
  Gauge,
  Zap,
  CandlestickChart,
  LineChart,
  BarChart3,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface TradingInstrument {
  id: string;
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
}

interface BotTransaction {
  id: string;
  botName: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  price: number;
  amount: number;
  timestamp: Date;
  strategy: string;
}

interface MarketMetrics {
  totalVolume: number;
  totalTransactions: number;
  activePositions: number;
  profitability: number;
  volatilityIndex: number;
  liquidityScore: number;
}

export default function TradingPlatformProfessional() {
  const [isLive, setIsLive] = useState(true);
  const [selectedInstrument, setSelectedInstrument] = useState<TradingInstrument | null>(null);
  const [chartType, setChartType] = useState('candlestick');
  const [timeframe, setTimeframe] = useState('1h');
  const [botTransactions, setBotTransactions] = useState<BotTransaction[]>([]);
  const [marketMetrics, setMarketMetrics] = useState<MarketMetrics>({
    totalVolume: 15750000,
    totalTransactions: 1247,
    activePositions: 89,
    profitability: 12.5,
    volatilityIndex: 3.2,
    liquidityScore: 8.7,
  });

  const tradingInstruments: TradingInstrument[] = [
    { id: '1', symbol: 'ICMS-TC', name: 'Título ICMS', price: 95.5, changePercent: 2.3 },
    { id: '2', symbol: 'PIS-TC', name: 'Título PIS/COFINS', price: 89.75, changePercent: -1.2 },
    { id: '3', symbol: 'IRPJ-TC', name: 'Título IRPJ', price: 102.3, changePercent: 3.8 },
    { id: '4', symbol: 'PREC-TC', name: 'Precatório', price: 78.9, changePercent: 0.5 },
    { id: '5', symbol: 'ISS-TC', name: 'Título ISS', price: 91.25, changePercent: 1.7 },
  ];

  const tradingBots = [
    { name: 'ArbitrageBot', strategy: 'Arbitragem', status: 'ATIVO', profit: 15.2 },
    { name: 'TrendFollower', strategy: 'Seguidor de Tendência', status: 'ATIVO', profit: 8.7 },
    { name: 'MeanReversion', strategy: 'Reversão à Média', status: 'ATIVO', profit: 12.1 },
    { name: 'ScalpingBot', strategy: 'Scalping', status: 'ATIVO', profit: 6.3 },
    { name: 'GridTrader', strategy: 'Grid Trading', status: 'ATIVO', profit: 9.8 },
  ];

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        simulateBotTransactions();
        updateMetrics();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isLive]);

  const simulateBotTransactions = () => {
    const newTransaction: BotTransaction = {
      id: Date.now().toString(),
      botName: tradingBots[Math.floor(Math.random() * tradingBots.length)].name,
      symbol: tradingInstruments[Math.floor(Math.random() * tradingInstruments.length)].symbol,
      type: Math.random() > 0.5 ? 'BUY' : 'SELL',
      price: 80 + Math.random() * 40,
      amount: Math.floor(Math.random() * 1000) + 100,
      timestamp: new Date(),
      strategy: tradingBots[Math.floor(Math.random() * tradingBots.length)].strategy,
    };

    setBotTransactions(prev => [newTransaction, ...prev.slice(0, 9)]);
  };

  const updateMetrics = () => {
    setMarketMetrics(prev => ({
      totalVolume: prev.totalVolume + Math.floor(Math.random() * 50000),
      totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 5) + 1,
      activePositions: prev.activePositions + Math.floor(Math.random() * 3) - 1,
      profitability: prev.profitability + (Math.random() - 0.5) * 0.5,
      volatilityIndex: Math.max(0, prev.volatilityIndex + (Math.random() - 0.5) * 0.3),
      liquidityScore: Math.max(0, Math.min(10, prev.liquidityScore + (Math.random() - 0.5) * 0.2)),
    }));
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

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'candlestick':
        return <CandlestickChart className="w-4 h-4" />;
      case 'line':
        return <LineChart className="w-4 h-4" />;
      case 'bar':
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <CandlestickChart className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Trading Profissional</h1>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Activity className="w-3 h-3 mr-1" />
              LIVE
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={isLive ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsLive(!isLive)}
            >
              {isLive ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
              {isLive ? 'Pausar' : 'Iniciar'}
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Métricas em Tempo Real */}
      <div className="p-4">
        <div className="grid grid-cols-6 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Volume Total</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatCurrency(marketMetrics.totalVolume)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Transações</p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatNumber(marketMetrics.totalTransactions)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Posições Ativas</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {marketMetrics.activePositions}
                  </p>
                </div>
                <Target className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Rentabilidade</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {formatPercent(marketMetrics.profitability)}
                  </p>
                </div>
                <Gauge className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Volatilidade</p>
                  <p className="text-2xl font-bold text-red-900">
                    {marketMetrics.volatilityIndex.toFixed(1)}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-teal-50 to-teal-100 border-teal-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-teal-600">Liquidez</p>
                  <p className="text-2xl font-bold text-teal-900">
                    {marketMetrics.liquidityScore.toFixed(1)}
                  </p>
                </div>
                <Zap className="w-8 h-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Gráfico Principal */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {selectedInstrument ? selectedInstrument.name : 'Selecione um Instrumento'}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="candlestick">
                          <div className="flex items-center gap-2">
                            <CandlestickChart className="w-4 h-4" />
                            Candlestick
                          </div>
                        </SelectItem>
                        <SelectItem value="line">
                          <div className="flex items-center gap-2">
                            <LineChart className="w-4 h-4" />
                            Linha
                          </div>
                        </SelectItem>
                        <SelectItem value="bar">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Barras
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={timeframe} onValueChange={(value: any) => setTimeframe(value)}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1m">1m</SelectItem>
                        <SelectItem value="5m">5m</SelectItem>
                        <SelectItem value="15m">15m</SelectItem>
                        <SelectItem value="1h">1h</SelectItem>
                        <SelectItem value="4h">4h</SelectItem>
                        <SelectItem value="1d">1d</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center relative">
                  <div className="text-center">
                    {getChartIcon(chartType)}
                    <p className="text-gray-600 mt-2">
                      Gráfico{' '}
                      {chartType === 'candlestick'
                        ? 'Candlestick'
                        : chartType === 'line'
                          ? 'de Linha'
                          : 'de Barras'}{' '}
                      - {timeframe}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedInstrument
                        ? `${selectedInstrument.symbol} - ${formatCurrency(selectedInstrument.price)}`
                        : 'Selecione um instrumento'}
                    </p>
                  </div>

                  {/* Overlay de Transações dos Bots */}
                  {isLive && botTransactions.length > 0 && (
                    <div className="absolute top-2 right-2 space-y-1">
                      {botTransactions.slice(0, 3).map((transaction, index) => (
                        <div
                          key={transaction.id}
                          className={`px-2 py-1 rounded text-xs font-medium animate-pulse ${
                            transaction.type === 'BUY'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                          style={{ animationDelay: `${index * 0.2}s` }}
                        >
                          {transaction.type === 'BUY' ? '↗' : '↘'} {transaction.botName}:{' '}
                          {transaction.symbol}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Painel Lateral */}
          <div className="space-y-6">
            {/* Instrumentos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Instrumentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tradingInstruments.map(instrument => (
                    <div
                      key={instrument.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedInstrument?.id === instrument.id
                          ? 'bg-blue-50 border-2 border-blue-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedInstrument(instrument)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{instrument.symbol}</p>
                          <p className="text-xs text-gray-600">{instrument.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{formatCurrency(instrument.price)}</p>
                          <p
                            className={`text-xs flex items-center ${
                              instrument.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {instrument.changePercent >= 0 ? (
                              <ArrowUp className="w-3 h-3" />
                            ) : (
                              <ArrowDown className="w-3 h-3" />
                            )}
                            {Math.abs(instrument.changePercent)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bots de Trading */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bots Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tradingBots.map((bot, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">{bot.name}</p>
                        <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                          {bot.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{bot.strategy}</p>
                      <p className="text-xs font-medium text-green-600">
                        Lucro: +{bot.profit.toFixed(1)}%
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Transações Recentes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transações Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {botTransactions.slice(0, 5).map(transaction => (
                    <div key={transaction.id} className="p-2 bg-gray-50 rounded text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{transaction.botName}</span>
                        <span
                          className={`font-medium ${
                            transaction.type === 'BUY' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-gray-600">{transaction.symbol}</span>
                        <span className="text-gray-600">{formatCurrency(transaction.price)}</span>
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        {transaction.timestamp.toLocaleTimeString('pt-BR')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
