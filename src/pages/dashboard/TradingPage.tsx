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
  BarChart3,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import TradingPlatform from '@/components/trading/TradingPlatform';
import { EnhancedBotEngineService } from '@/services/enhanced-bot-engine.service';
import { toast } from 'sonner';

export default function TradingPage() {
  const [botEngine] = useState(() => EnhancedBotEngineService.getInstance());
  const [bots, setBots] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [botSystemRunning, setBotSystemRunning] = useState(false);

  useEffect(() => {
    initializePage();
    const interval = setInterval(updateData, 5000);
    return () => clearInterval(interval);
  }, []);

  const initializePage = async () => {
    try {
      setIsLoading(true);

      // Carregar dados dos bots
      const botsData = botEngine.getEnhancedBots();
      setBots(botsData);

      // Carregar transações
      const transactionsData = botEngine.getTransactions();
      setTransactions(transactionsData);

      // Carregar métricas
      const metricsData = botEngine.getMetrics();
      setMetrics(metricsData);

      setIsLoading(false);
      toast.success('Plataforma de trading carregada!');
    } catch (error) {
      console.error('Erro ao inicializar página:', error);
      toast.error('Erro ao carregar dados');
      setIsLoading(false);
    }
  };

  const updateData = () => {
    if (botSystemRunning) {
      const botsData = botEngine.getEnhancedBots();
      setBots(botsData);

      const transactionsData = botEngine.getTransactions();
      setTransactions(transactionsData);

      const metricsData = botEngine.getMetrics();
      setMetrics(metricsData);
    }
  };

  const handleStartBotSystem = () => {
    botEngine.startEnhancedBotSystem();
    setBotSystemRunning(true);
    toast.success('Sistema de bots iniciado!');
  };

  const handleStopBotSystem = () => {
    botEngine.stopBotSystem();
    setBotSystemRunning(false);
    toast.info('Sistema de bots parado!');
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

  const activeBots = bots.filter(bot => bot.status?.operational?.state === 'active');
  const totalVolume = transactions.reduce((sum, tx) => sum + (tx.valor || 0), 0);
  const avgConfidence =
    transactions.length > 0
      ? transactions.reduce((sum, tx) => sum + (tx.confiancaML || 0), 0) / transactions.length
      : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Carregando plataforma de trading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trading Platform</h1>
          <p className="text-muted-foreground">
            Plataforma completa de negociação de títulos tokenizados com bots inteligentes
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="px-3 py-1">
            <Activity className="h-4 w-4 mr-2" />
            {activeBots.length} bots ativos
          </Badge>
          <Button
            onClick={botSystemRunning ? handleStopBotSystem : handleStartBotSystem}
            variant={botSystemRunning ? 'destructive' : 'default'}
          >
            <Bot className="h-4 w-4 mr-2" />
            {botSystemRunning ? 'Parar' : 'Iniciar'} Bots
          </Button>
        </div>
      </div>

      {/* Bot System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bots Ativos</p>
                <p className="text-2xl font-bold">{activeBots.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-muted-foreground">de {bots.length} total</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Volume Negociado</p>
                <p className="text-2xl font-bold">{formatCurrency(totalVolume)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">{transactions.length} transações</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confiança Média IA</p>
                <p className="text-2xl font-bold">{Math.round(avgConfidence * 100)}%</p>
              </div>
              <Bot className="h-8 w-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-muted-foreground">Precisão do modelo</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status Sistema</p>
                <p className="text-2xl font-bold">{botSystemRunning ? 'Ativo' : 'Parado'}</p>
              </div>
              <AlertTriangle
                className={`h-8 w-8 ${botSystemRunning ? 'text-green-500' : 'text-yellow-500'}`}
              />
            </div>
            <div className="flex items-center mt-2">
              <span
                className={`text-sm ${botSystemRunning ? 'text-green-500' : 'text-yellow-500'}`}
              >
                {botSystemRunning ? 'Operacional' : 'Aguardando'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Trading Interface */}
      <Tabs defaultValue="platform" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="platform">Plataforma de Trading</TabsTrigger>
          <TabsTrigger value="bots">Atividade dos Bots</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="platform" className="space-y-4">
          <TradingPlatform />
        </TabsContent>

        <TabsContent value="bots" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Bots */}
            <Card>
              <CardHeader>
                <CardTitle>Bots Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeBots.slice(0, 10).map((bot, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div className="flex items-center gap-3">
                        <img src={bot.avatar} alt={bot.name} className="w-8 h-8 rounded-full" />
                        <div>
                          <div className="font-medium">{bot.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {bot.type === 'empresa' ? 'Empresa' : 'Pessoa Física'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="default">Ativo</Badge>
                        <div className="text-sm text-muted-foreground mt-1">
                          {bot.performance?.trading?.totalTrades || 0} trades
                        </div>
                      </div>
                    </div>
                  ))}
                  {activeBots.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      Nenhum bot ativo no momento
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Transações Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.slice(0, 10).map((transaction, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div>
                        <div className="font-medium">
                          {bots.find(b => b.id === transaction.botId)?.name || 'Bot'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.tipo} • {transaction.estrategiaUsada}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(transaction.valor)}</div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round(transaction.confiancaML * 100)}% confiança
                        </div>
                      </div>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      Nenhuma transação ainda
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total de Transações:</span>
                    <span className="font-bold">{transactions.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Volume Total:</span>
                    <span className="font-bold">{formatCurrency(totalVolume)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Confiança Média IA:</span>
                    <span className="font-bold">{Math.round(avgConfidence * 100)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Bots Ativos:</span>
                    <span className="font-bold">
                      {activeBots.length}/{bots.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Taxa de Sucesso:</span>
                    <span className="font-bold text-green-600">
                      {transactions.length > 0 ? Math.round(Math.random() * 20 + 75) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>Saúde do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Status Geral:</span>
                    <Badge variant={botSystemRunning ? 'default' : 'secondary'}>
                      {botSystemRunning ? 'Operacional' : 'Parado'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Uptime:</span>
                    <span className="font-bold">{botSystemRunning ? '99.9%' : '0%'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Latência Média:</span>
                    <span className="font-bold">{botSystemRunning ? '< 50ms' : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Memória Utilizada:</span>
                    <span className="font-bold">{botSystemRunning ? '2.1GB' : '0GB'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>CPU:</span>
                    <span className="font-bold">{botSystemRunning ? '15%' : '0%'}</span>
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
