import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  Square,
  Bot,
  TrendingUp,
  DollarSign,
  Activity,
  Settings,
  RefreshCw,
  Zap,
  Brain,
  Users,
  BarChart3,
  Clock,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  Building,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  Edit,
  Filter,
  Search,
  Calendar,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useBotSystem } from '@/hooks/use-bot-system';
import { toast } from 'sonner';

export function BotControlPanel() {
  const {
    bots,
    transactions,
    metrics,
    controlPanel,
    loading,
    isRunning,
    isPaused,
    isStopped,
    activeBots,
    totalVolume,
    totalTransactions,
    startSystem,
    stopSystem,
    pauseSystem,
    resumeSystem,
    toggleBot,
    updateBotConfig,
    updateControlConfig,
    trainBot,
    trainAllBots,
    refreshData,
    formatCurrency,
    formatNumber,
  } = useBotSystem();

  const [selectedBot, setSelectedBot] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const filteredBots = bots.filter(bot => {
    const matchesSearch =
      bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bot.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = showInactive || bot.ativo;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-500';
      case 'pausado':
        return 'bg-yellow-500';
      case 'parado':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'Ativo';
      case 'pausado':
        return 'Pausado';
      case 'parado':
        return 'Parado';
      default:
        return 'Desconhecido';
    }
  };

  const handleConfigChange = (key: string, value: any) => {
    updateControlConfig({ [key]: value });
  };

  const handleBotToggle = (botId: string) => {
    toggleBot(botId);
  };

  const handleBotTrain = (botId: string) => {
    trainBot(botId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando sistema de bots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header com Controles Principais */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Painel de Controle - Bots</h1>
          <p className="text-gray-600">Sistema de negociação automatizada</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${getStatusColor(controlPanel?.status || 'parado')}`}
            />
            <span className="text-sm font-medium">
              {getStatusText(controlPanel?.status || 'parado')}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Controles do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            Controles do Sistema
          </CardTitle>
          <CardDescription>Gerencie o sistema de bots de negociação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button
              onClick={startSystem}
              disabled={isRunning}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="h-4 w-4 mr-2" />
              Iniciar Sistema
            </Button>
            <Button onClick={pauseSystem} disabled={!isRunning} variant="outline">
              <Pause className="h-4 w-4 mr-2" />
              Pausar
            </Button>
            <Button onClick={resumeSystem} disabled={!isPaused} variant="outline">
              <Play className="h-4 w-4 mr-2" />
              Retomar
            </Button>
            <Button onClick={stopSystem} disabled={isStopped} variant="destructive">
              <Square className="h-4 w-4 mr-2" />
              Parar Sistema
            </Button>
            <div className="flex-1" />
            <Button
              onClick={trainAllBots}
              variant="outline"
              className="bg-blue-50 hover:bg-blue-100"
            >
              <Brain className="h-4 w-4 mr-2" />
              Treinar Todos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Métricas em Tempo Real */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bots Ativos</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeBots.length}/{bots.length}
            </div>
            <div className="text-xs text-muted-foreground">
              {((activeBots.length / Math.max(bots.length, 1)) * 100).toFixed(1)}% do total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transações Hoje</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.transacoesHoje || 0}</div>
            <div className="text-xs text-muted-foreground">
              {formatNumber(controlPanel?.transacoesPorMinuto || 0)}/min
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume Hoje</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics?.volumeHoje || 0)}</div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(controlPanel?.lucroHoje || 0)} lucro
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiência</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.taxaSucessoMedia?.toFixed(1) || 0}%</div>
            <div className="text-xs text-muted-foreground">
              {metrics?.tempoMedioResposta?.toFixed(1) || 0}s tempo médio
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com Seções Detalhadas */}
      <Tabs defaultValue="bots" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="bots">Bots</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="config">Configurações</TabsTrigger>
          <TabsTrigger value="ml">Machine Learning</TabsTrigger>
        </TabsList>

        <TabsContent value="bots" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar bots..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-inactive"
                    checked={showInactive}
                    onCheckedChange={setShowInactive}
                  />
                  <Label htmlFor="show-inactive">Mostrar inativos</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aviso de treinamento simulado */}
          <div className="flex items-center mb-2">
            <Badge className="bg-yellow-100 text-yellow-800 mr-2">Treinamento Simulado</Badge>
            <span className="text-xs text-gray-500">
              O treinamento de bots é apenas para fins de demonstração/administração.
            </span>
          </div>

          {/* Lista de Bots */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBots.map(bot => (
              <Card
                key={bot.id}
                className={`${bot.ativo ? 'border-green-200' : 'border-gray-200'}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={bot.avatar} alt={bot.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <CardTitle className="text-lg">{bot.name}</CardTitle>
                        <CardDescription className="flex items-center space-x-2">
                          {bot.type === 'empresa' ? (
                            <Building className="h-3 w-3" />
                          ) : (
                            <User className="h-3 w-3" />
                          )}
                          <span>{bot.type === 'empresa' ? 'Empresa' : 'Pessoa Física'}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={bot.ativo ? 'default' : 'secondary'}>
                        {bot.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <Switch checked={bot.ativo} onCheckedChange={() => handleBotToggle(bot.id)} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Estatísticas */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Transações</div>
                        <div className="font-semibold">{formatNumber(bot.stats.transacoes)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Volume</div>
                        <div className="font-semibold">
                          {formatCurrency(bot.stats.volumeNegociado)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Lucro</div>
                        <div className="font-semibold text-green-600">
                          {formatCurrency(bot.stats.lucroAcumulado)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Taxa Sucesso</div>
                        <div className="font-semibold">
                          {(bot.stats.taxaSucesso * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    {/* Histórico de Treinamento */}
                    <div className="bg-gray-50 rounded p-2 text-xs text-gray-600 flex items-center gap-2">
                      <Brain className="h-3 w-3 text-blue-500" />
                      <span>Último treinamento:</span>
                      <span className="font-medium text-gray-800">
                        {bot.comportamento.ml.ultimoTreinamento
                          ? new Date(bot.comportamento.ml.ultimoTreinamento).toLocaleString('pt-BR')
                          : 'Nunca'}
                      </span>
                      <span className="ml-2">Precisão:</span>
                      <span className="font-medium text-green-700">
                        {(bot.comportamento.ml.precisao * 100).toFixed(1)}%
                      </span>
                    </div>

                    {/* Comportamento */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Agressividade</span>
                        <span className="text-sm font-medium">
                          {bot.comportamento.agressividade}%
                        </span>
                      </div>
                      <Progress value={bot.comportamento.agressividade} className="h-2" />
                    </div>

                    {/* Machine Learning */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Brain className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">ML Treinado</span>
                        {bot.comportamento.ml.modeloTreinado ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleBotTrain(bot.id)}>
                        <Brain className="h-3 w-3 mr-1" />
                        Treinar
                      </Button>
                    </div>

                    {/* Última Atividade */}
                    <div className="text-xs text-gray-500">
                      Última atividade: {bot.ultimaAtividade.toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
              <CardDescription>Últimas operações realizadas pelos bots</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {transactions.slice(0, 50).map(transaction => {
                    const bot = bots.find(b => b.id === transaction.botId);
                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={bot?.avatar || '/placeholder-avatar.png'}
                            alt={bot?.name || 'Bot'}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <div className="font-medium text-sm">
                              {bot?.name || 'Bot Desconhecido'}
                            </div>
                            <div className="text-xs text-gray-600">{transaction.tipo}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(transaction.valor)}</div>
                          <div className="text-xs text-gray-500">
                            {transaction.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Atividade por Hora */}
            <Card>
              <CardHeader>
                <CardTitle>Atividade por Hora</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics?.horariosAtividade || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hora" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="atividade" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Categorias Mais Negociadas */}
            <Card>
              <CardHeader>
                <CardTitle>Categorias Mais Negociadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics?.categoriasMaisNegociadas.map((categoria, index) => (
                    <div key={categoria} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{categoria}</span>
                      <Badge variant="secondary">{index + 1}º</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>Ajuste o comportamento geral dos bots</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="interval">Intervalo entre Ações (segundos)</Label>
                  <Input
                    id="interval"
                    type="number"
                    value={controlPanel?.configuracoes.intervaloBots || 30}
                    onChange={e => handleConfigChange('intervaloBots', parseInt(e.target.value))}
                    min={10}
                    max={300}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="limit">Limite Diário (R$)</Label>
                  <Input
                    id="limit"
                    type="number"
                    value={controlPanel?.configuracoes.limiteDiario || 10000000}
                    onChange={e => handleConfigChange('limiteDiario', parseInt(e.target.value))}
                    min={1000000}
                    max={100000000}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-learning">Auto-aprendizado</Label>
                    <p className="text-sm text-gray-600">
                      Permite que os bots aprendam automaticamente
                    </p>
                  </div>
                  <Switch
                    id="auto-learning"
                    checked={controlPanel?.configuracoes.autoAprendizado || false}
                    onCheckedChange={checked => handleConfigChange('autoAprendizado', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Notificações</Label>
                    <p className="text-sm text-gray-600">Receber notificações de transações</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={controlPanel?.configuracoes.notificacoes || false}
                    onCheckedChange={checked => handleConfigChange('notificacoes', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="detailed-log">Log Detalhado</Label>
                    <p className="text-sm text-gray-600">Registrar todas as ações dos bots</p>
                  </div>
                  <Switch
                    id="detailed-log"
                    checked={controlPanel?.configuracoes.logDetalhado || false}
                    onCheckedChange={checked => handleConfigChange('logDetalhado', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ml" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Machine Learning</CardTitle>
              <CardDescription>Status e configurações dos modelos de IA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Status Geral */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {bots.filter(b => b.comportamento.ml.modeloTreinado).length}
                    </div>
                    <div className="text-sm text-blue-600">Modelos Treinados</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {(
                        (bots.reduce((sum, b) => sum + b.comportamento.ml.precisao, 0) /
                          bots.length) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                    <div className="text-sm text-green-600">Precisão Média</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {
                        bots.filter(
                          b => b.comportamento.ml.parametros.algoritmo === 'random_forest'
                        ).length
                      }
                    </div>
                    <div className="text-sm text-purple-600">Random Forest</div>
                  </div>
                </div>

                {/* Bots por Algoritmo */}
                <div>
                  <h4 className="font-semibold mb-3">Distribuição por Algoritmo</h4>
                  <div className="space-y-2">
                    {['random_forest', 'neural_network', 'gradient_boosting', 'svm'].map(algo => {
                      const count = bots.filter(
                        b => b.comportamento.ml.parametros.algoritmo === algo
                      ).length;
                      const percentage = (count / bots.length) * 100;
                      return (
                        <div key={algo} className="flex items-center justify-between">
                          <span className="text-sm capitalize">{algo.replace('_', ' ')}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Ações */}
                <div className="flex space-x-4">
                  <Button onClick={trainAllBots} className="bg-blue-600 hover:bg-blue-700">
                    <Brain className="h-4 w-4 mr-2" />
                    Treinar Todos os Modelos
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Modelos
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
