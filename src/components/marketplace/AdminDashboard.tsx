import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  Bot,
  TrendingUp,
  DollarSign,
  Settings,
  CheckCircle,
  AlertTriangle,
  Coins,
  Shield,
  Zap,
  Target,
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';

interface AdminDashboardProps {
  stats: any;
  botActivities: any[];
  credits: any[];
  isAdmin: boolean;
}

export function AdminDashboard({ stats, botActivities, credits, isAdmin }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Acesso Restrito</h3>
          <p className="text-gray-600">Apenas administradores têm acesso ao painel de controle.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Painel Administrativo</h2>
          <p className="text-gray-600">Controle e monitoramento da plataforma</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Títulos Tokenizados</p>
                <p className="text-2xl font-bold">{stats.tokenizedCredits}</p>
              </div>
              <Coins className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Volume Total</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalVolume)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bots Ativos</p>
                <p className="text-2xl font-bold">{stats.activeBots}</p>
              </div>
              <Bot className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Comissão</p>
                <p className="text-2xl font-bold">2.5%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="bots">Controle de Bots</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Títulos de Crédito Tokenizados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {credits.slice(0, 5).map(credit => (
                    <div
                      key={credit.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{credit.title}</p>
                        <p className="text-sm text-gray-600">{credit.creditType}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(credit.currentPrice)}</p>
                        <Badge
                          className={
                            credit.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {credit.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">CPU</span>
                      <span className="text-sm">45%</span>
                    </div>
                    <Progress value={45} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Memória</span>
                      <span className="text-sm">62%</span>
                    </div>
                    <Progress value={62} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Blockchain</span>
                      <span className="text-sm">78%</span>
                    </div>
                    <Progress value={78} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bots" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Controle de Bots</CardTitle>
              <p className="text-sm text-gray-600">Gerencie os bots de trading automatizado</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Controles Globais */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold">Controle Global de Bots</h4>
                    <p className="text-sm text-gray-600">
                      Pausar ou ativar todos os bots simultaneamente
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Pausar Todos
                  </Button>
                </div>

                {/* Configurações de Monetização */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-4">Configurações de Monetização</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="text-sm font-medium">Taxa de Comissão (%)</label>
                      <p className="text-2xl font-bold text-green-600">3%</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Preço da Assinatura (R$)</label>
                      <p className="text-2xl font-bold text-blue-600">99</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Modelo de Cobrança</label>
                      <p className="text-2xl font-bold text-purple-600">Mensal</p>
                    </div>
                  </div>
                </div>

                {/* Pacotes de Assinatura */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-4">Pacotes de Assinatura</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 bg-white rounded-lg border">
                      <h5 className="font-semibold">Básico</h5>
                      <p className="text-sm text-gray-600 mb-2">Recursos essenciais</p>
                      <p className="text-xl font-bold text-green-600">R$ 49/mês</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-blue-200">
                      <h5 className="font-semibold">Profissional</h5>
                      <p className="text-sm text-gray-600 mb-2">Recursos avançados + Bots</p>
                      <p className="text-xl font-bold text-blue-600">R$ 99/mês</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-purple-200">
                      <h5 className="font-semibold">Enterprise</h5>
                      <p className="text-sm text-gray-600 mb-2">Recursos completos</p>
                      <p className="text-xl font-bold text-purple-600">R$ 199/mês</p>
                    </div>
                  </div>
                </div>

                {/* Atividade dos Bots */}
                <div>
                  <h4 className="font-semibold mb-4">Atividade dos Bots (Últimas 24h)</h4>
                  <div className="space-y-4">
                    {botActivities.slice(0, 5).map(activity => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full">
                            {activity.success ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{activity.botName}</p>
                            <p className="text-sm text-gray-600">{activity.action}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {activity.amount ? formatCurrency(activity.amount) : '-'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bots Individuais Detalhados */}
                <div>
                  <h4 className="font-semibold mb-4">Bots de Trading - Controle Individual</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Bot className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold">TradingBot Alpha</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Transações:</span>
                            <span className="font-medium">156</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Taxa de Sucesso:</span>
                            <span className="font-medium text-green-600">87.5%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Lucro Total:</span>
                            <span className="font-medium">{formatCurrency(245000)}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button size="sm" variant="outline">
                            Pausar
                          </Button>
                          <Button size="sm" variant="outline">
                            Configurar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-purple-600" />
                            <span className="font-semibold">CreditHunter Pro</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Transações:</span>
                            <span className="font-medium">89</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Taxa de Sucesso:</span>
                            <span className="font-medium text-green-600">92.1%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Lucro Total:</span>
                            <span className="font-medium">{formatCurrency(380000)}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button size="sm" variant="outline">
                            Pausar
                          </Button>
                          <Button size="sm" variant="outline">
                            Configurar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-600" />
                            <span className="font-semibold">MarketMaker Elite</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Transações:</span>
                            <span className="font-medium">203</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Taxa de Sucesso:</span>
                            <span className="font-medium text-green-600">94.2%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Lucro Total:</span>
                            <span className="font-medium">{formatCurrency(520000)}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button size="sm" variant="outline">
                            Pausar
                          </Button>
                          <Button size="sm" variant="outline">
                            Configurar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-green-600" />
                            <span className="font-semibold">ArbitrageBot X1</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Transações:</span>
                            <span className="font-medium">67</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Taxa de Sucesso:</span>
                            <span className="font-medium text-green-600">89.3%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Lucro Total:</span>
                            <span className="font-medium">{formatCurrency(180000)}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button size="sm" variant="outline">
                            Pausar
                          </Button>
                          <Button size="sm" variant="outline">
                            Configurar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Métricas Consolidadas */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-4">Métricas Consolidadas - Todos os Bots</h4>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">515</p>
                      <p className="text-sm text-gray-600">Total Transações</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">90.8%</p>
                      <p className="text-sm text-gray-600">Taxa Sucesso Média</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {formatCurrency(1325000)}
                      </p>
                      <p className="text-sm text-gray-600">Lucro Total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">5</p>
                      <p className="text-sm text-gray-600">Bots Ativos</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Tokenização Automática</p>
                    <p className="text-sm text-gray-600">
                      Sistema de tokenização de títulos de crédito
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurar
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Blockchain Network</p>
                    <p className="text-sm text-gray-600">Configurações da rede blockchain</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurar
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Backup Automático</p>
                    <p className="text-sm text-gray-600">Backup diário dos títulos tokenizados</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurar
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
