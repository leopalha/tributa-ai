import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Target,
  TrendingUp,
  DollarSign,
  Users,
  BarChart3,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Calculator,
  PieChart,
} from 'lucide-react';
import { toast } from 'sonner';

interface SimulationCenterProps {
  currentStats: any;
  onRunSimulation: (results: any) => void;
}

export function SimulationCenter({ currentStats, onRunSimulation }: SimulationCenterProps) {
  const [activeTab, setActiveTab] = useState('scenarios');
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationParams, setSimulationParams] = useState({
    userGrowth: 20,
    transactionVolume: 15,
    botEfficiency: 85,
    marketVolatility: 30,
    commissionRate: 3,
    subscriptionPrice: 99,
    duration: 30,
  });

  const [simulationResults, setSimulationResults] = useState<any>(null);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const runSimulation = async () => {
    setSimulationRunning(true);

    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 2000));

    const results = {
      projectedRevenue:
        currentStats.revenue *
        (1 + simulationParams.userGrowth / 100) *
        (simulationParams.duration / 30),
      projectedUsers: currentStats.totalUsers * (1 + simulationParams.userGrowth / 100),
      projectedTransactions:
        currentStats.totalTransactions * (1 + simulationParams.transactionVolume / 100),
      subscriptionRevenue:
        (currentStats.totalUsers * simulationParams.subscriptionPrice * simulationParams.duration) /
        30,
      commissionRevenue: (currentStats.totalVolume * simulationParams.commissionRate) / 100,
      totalProjectedRevenue: 0,
      roi: 0,
      breakEvenPoint: 15,
      scenarios: {
        optimistic: { revenue: 0, users: 0, growth: 35 },
        realistic: { revenue: 0, users: 0, growth: 20 },
        pessimistic: { revenue: 0, users: 0, growth: 8 },
      },
    };

    results.totalProjectedRevenue = results.subscriptionRevenue + results.commissionRevenue;
    results.roi =
      ((results.totalProjectedRevenue - currentStats.revenue) / currentStats.revenue) * 100;

    results.scenarios.optimistic.revenue = results.totalProjectedRevenue * 1.5;
    results.scenarios.optimistic.users = results.projectedUsers * 1.3;

    results.scenarios.realistic.revenue = results.totalProjectedRevenue;
    results.scenarios.realistic.users = results.projectedUsers;

    results.scenarios.pessimistic.revenue = results.totalProjectedRevenue * 0.7;
    results.scenarios.pessimistic.users = results.projectedUsers * 0.8;

    setSimulationResults(results);
    setSimulationRunning(false);
    onRunSimulation(results);
    toast.success('Simulação concluída com sucesso!');
  };

  const resetSimulation = () => {
    setSimulationResults(null);
    setSimulationParams({
      userGrowth: 20,
      transactionVolume: 15,
      botEfficiency: 85,
      marketVolatility: 30,
      commissionRate: 3,
      subscriptionPrice: 99,
      duration: 30,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Centro de Simulações</h2>
          <p className="text-gray-600">Modele cenários de crescimento e monetização</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={resetSimulation}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Resetar
          </Button>
          <Button onClick={runSimulation} disabled={simulationRunning} className="min-w-[120px]">
            {simulationRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Processando...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Executar
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scenarios">Cenários</TabsTrigger>
          <TabsTrigger value="monetization">Monetização</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Parâmetros de Simulação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Crescimento de Usuários (%)</Label>
                  <div className="px-3">
                    <Slider
                      value={[simulationParams.userGrowth]}
                      onValueChange={value =>
                        setSimulationParams(prev => ({ ...prev, userGrowth: value[0] }))
                      }
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="text-sm text-gray-600 text-center">
                    {simulationParams.userGrowth}%
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Volume de Transações (%)</Label>
                  <div className="px-3">
                    <Slider
                      value={[simulationParams.transactionVolume]}
                      onValueChange={value =>
                        setSimulationParams(prev => ({ ...prev, transactionVolume: value[0] }))
                      }
                      max={50}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="text-sm text-gray-600 text-center">
                    {simulationParams.transactionVolume}%
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Eficiência dos Bots (%)</Label>
                  <div className="px-3">
                    <Slider
                      value={[simulationParams.botEfficiency]}
                      onValueChange={value =>
                        setSimulationParams(prev => ({ ...prev, botEfficiency: value[0] }))
                      }
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="text-sm text-gray-600 text-center">
                    {simulationParams.botEfficiency}%
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Volatilidade do Mercado (%)</Label>
                  <div className="px-3">
                    <Slider
                      value={[simulationParams.marketVolatility]}
                      onValueChange={value =>
                        setSimulationParams(prev => ({ ...prev, marketVolatility: value[0] }))
                      }
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="text-sm text-gray-600 text-center">
                    {simulationParams.marketVolatility}%
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Duração da Simulação (dias)</Label>
                  <Input
                    type="number"
                    value={simulationParams.duration}
                    onChange={e =>
                      setSimulationParams(prev => ({
                        ...prev,
                        duration: parseInt(e.target.value) || 30,
                      }))
                    }
                    min={1}
                    max={365}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Projeções Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Usuários Atuais</p>
                    <p className="text-lg font-bold">{currentStats.totalUsers}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Projeção</p>
                    <p className="text-lg font-bold">
                      {Math.round(
                        currentStats.totalUsers * (1 + simulationParams.userGrowth / 100)
                      )}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Receita Atual</p>
                    <p className="text-lg font-bold">{formatCurrency(currentStats.revenue)}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Projeção</p>
                    <p className="text-lg font-bold">
                      {formatCurrency(
                        currentStats.revenue *
                          (1 + simulationParams.userGrowth / 100) *
                          (simulationParams.duration / 30)
                      )}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <p className="text-sm text-gray-600">ROI Estimado</p>
                  <p className="text-2xl font-bold text-purple-600">
                    +
                    {(
                      (simulationParams.userGrowth + simulationParams.transactionVolume) /
                      2
                    ).toFixed(1)}
                    %
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monetization" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Monetização</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Taxa de Comissão (%)</Label>
                  <div className="px-3">
                    <Slider
                      value={[simulationParams.commissionRate]}
                      onValueChange={value =>
                        setSimulationParams(prev => ({ ...prev, commissionRate: value[0] }))
                      }
                      max={10}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  <div className="text-sm text-gray-600 text-center">
                    {simulationParams.commissionRate}%
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Preço da Assinatura (R$)</Label>
                  <Input
                    type="number"
                    value={simulationParams.subscriptionPrice}
                    onChange={e =>
                      setSimulationParams(prev => ({
                        ...prev,
                        subscriptionPrice: parseFloat(e.target.value) || 99,
                      }))
                    }
                    min={0}
                    step={0.01}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Modelo de Cobrança</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="quarterly">Trimestral</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pacotes de Assinatura</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Básico</p>
                        <p className="text-sm text-gray-600">Recursos essenciais</p>
                      </div>
                      <p className="font-bold">R$ 49/mês</p>
                    </div>
                  </div>

                  <div className="p-3 border-2 border-blue-200 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Profissional</p>
                        <p className="text-sm text-gray-600">Recursos avançados + Bots</p>
                      </div>
                      <p className="font-bold text-blue-600">R$ 99/mês</p>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Enterprise</p>
                        <p className="text-sm text-gray-600">Recursos completos</p>
                      </div>
                      <p className="font-bold">R$ 199/mês</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {simulationResults ? (
            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Receita Projetada</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(simulationResults.totalProjectedRevenue)}
                        </p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">ROI Projetado</p>
                        <p className="text-2xl font-bold text-blue-600">
                          +{simulationResults.roi.toFixed(1)}%
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Break-even</p>
                        <p className="text-2xl font-bold text-orange-600">
                          {simulationResults.breakEvenPoint} dias
                        </p>
                      </div>
                      <Target className="w-8 h-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Análise de Cenários
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Cenário Otimista</h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          Receita: {formatCurrency(simulationResults.scenarios.optimistic.revenue)}
                        </p>
                        <p>Usuários: {Math.round(simulationResults.scenarios.optimistic.users)}</p>
                        <p>Crescimento: +{simulationResults.scenarios.optimistic.growth}%</p>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Cenário Realista</h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          Receita: {formatCurrency(simulationResults.scenarios.realistic.revenue)}
                        </p>
                        <p>Usuários: {Math.round(simulationResults.scenarios.realistic.users)}</p>
                        <p>Crescimento: +{simulationResults.scenarios.realistic.growth}%</p>
                      </div>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-2">Cenário Pessimista</h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          Receita: {formatCurrency(simulationResults.scenarios.pessimistic.revenue)}
                        </p>
                        <p>Usuários: {Math.round(simulationResults.scenarios.pessimistic.users)}</p>
                        <p>Crescimento: +{simulationResults.scenarios.pessimistic.growth}%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma simulação executada
                </h3>
                <p className="text-gray-600 mb-4">
                  Configure os parâmetros e execute uma simulação para ver os resultados
                </p>
                <Button onClick={() => setActiveTab('scenarios')}>Configurar Simulação</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
