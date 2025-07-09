import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Cloud,
  Database,
  Globe,
  HardDrive,
  Layers,
  Network,
  RefreshCw,
  Server,
  Shield,
  Signal,
  Zap,
  AlertTriangle,
} from 'lucide-react';

interface NodeStatus {
  id: string;
  name: string;
  type: 'orderer' | 'peer' | 'ca';
  organization: string;
  status: 'online' | 'offline' | 'syncing' | 'warning';
  uptime: number; // em segundos
  version: string;
  lastBlock?: number;
  pendingTx?: number;
  cpu: number; // porcentagem
  memory: number; // porcentagem
  disk: number; // porcentagem
  lastUpdated: Date;
}

interface NetworkMetrics {
  totalNodes: number;
  activeNodes: number;
  consensusRate: number; // porcentagem
  avgBlockTime: number; // em segundos
  avgTxPerBlock: number;
  currentTPS: number;
  peakTPS: number;
  totalChannels: number;
  totalChaincode: number;
  networkLatency: number; // em ms
  successRate: number; // porcentagem
}

interface HistoricalMetric {
  timestamp: Date;
  tps: number;
  blockTime: number;
  successRate: number;
  activeNodes: number;
}

export default function BlockchainStatusPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [nodes, setNodes] = useState<NodeStatus[]>([]);
  const [metrics, setMetrics] = useState<NetworkMetrics>({
    totalNodes: 24,
    activeNodes: 22,
    consensusRate: 99.7,
    avgBlockTime: 2.3,
    avgTxPerBlock: 127,
    currentTPS: 55.2,
    peakTPS: 142.8,
    totalChannels: 5,
    totalChaincode: 12,
    networkLatency: 187,
    successRate: 99.92,
  });
  const [historicalData, setHistoricalData] = useState<HistoricalMetric[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadNetworkData();
    const interval = setInterval(loadNetworkData, 30000); // Atualiza a cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  const loadNetworkData = () => {
    setLoading(true);
    
    // Simular carregamento de dados
    setTimeout(() => {
      // Gerar dados de nós
      const mockNodes: NodeStatus[] = [
        {
          id: 'orderer1.tributa.ai',
          name: 'Orderer 1',
          type: 'orderer',
          organization: 'TributaAI',
          status: 'online',
          uptime: 1209600, // 14 dias
          version: 'v2.5.3',
          cpu: 32,
          memory: 45,
          disk: 28,
          lastUpdated: new Date(),
        },
        {
          id: 'orderer2.tributa.ai',
          name: 'Orderer 2',
          type: 'orderer',
          organization: 'TributaAI',
          status: 'online',
          uptime: 1123200, // 13 dias
          version: 'v2.5.3',
          cpu: 28,
          memory: 42,
          disk: 26,
          lastUpdated: new Date(),
        },
        {
          id: 'peer0.tributa.ai',
          name: 'Peer 0',
          type: 'peer',
          organization: 'TributaAI',
          status: 'online',
          uptime: 1209600, // 14 dias
          version: 'v2.5.3',
          lastBlock: 24871,
          pendingTx: 8,
          cpu: 54,
          memory: 62,
          disk: 41,
          lastUpdated: new Date(),
        },
        {
          id: 'peer1.tributa.ai',
          name: 'Peer 1',
          type: 'peer',
          organization: 'TributaAI',
          status: 'online',
          uptime: 1036800, // 12 dias
          version: 'v2.5.3',
          lastBlock: 24871,
          pendingTx: 12,
          cpu: 48,
          memory: 58,
          disk: 39,
          lastUpdated: new Date(),
        },
        {
          id: 'peer0.receita.gov.br',
          name: 'Peer Receita',
          type: 'peer',
          organization: 'ReceitaFederal',
          status: 'online',
          uptime: 864000, // 10 dias
          version: 'v2.5.2',
          lastBlock: 24871,
          pendingTx: 5,
          cpu: 41,
          memory: 53,
          disk: 32,
          lastUpdated: new Date(),
        },
        {
          id: 'peer0.sefaz.sp.gov.br',
          name: 'Peer SEFAZ-SP',
          type: 'peer',
          organization: 'SEFAZ-SP',
          status: 'online',
          uptime: 691200, // 8 dias
          version: 'v2.5.3',
          lastBlock: 24871,
          pendingTx: 3,
          cpu: 37,
          memory: 49,
          disk: 28,
          lastUpdated: new Date(),
        },
        {
          id: 'peer0.sefaz.rj.gov.br',
          name: 'Peer SEFAZ-RJ',
          type: 'peer',
          organization: 'SEFAZ-RJ',
          status: 'warning',
          uptime: 432000, // 5 dias
          version: 'v2.5.1',
          lastBlock: 24870,
          pendingTx: 18,
          cpu: 72,
          memory: 81,
          disk: 65,
          lastUpdated: new Date(),
        },
        {
          id: 'peer0.banco.gov.br',
          name: 'Peer Banco Central',
          type: 'peer',
          organization: 'BancoCentral',
          status: 'online',
          uptime: 518400, // 6 dias
          version: 'v2.5.3',
          lastBlock: 24871,
          pendingTx: 7,
          cpu: 45,
          memory: 52,
          disk: 37,
          lastUpdated: new Date(),
        },
        {
          id: 'ca.tributa.ai',
          name: 'CA TributaAI',
          type: 'ca',
          organization: 'TributaAI',
          status: 'online',
          uptime: 1209600, // 14 dias
          version: 'v2.5.3',
          cpu: 22,
          memory: 35,
          disk: 18,
          lastUpdated: new Date(),
        },
        {
          id: 'peer0.sefaz.mg.gov.br',
          name: 'Peer SEFAZ-MG',
          type: 'peer',
          organization: 'SEFAZ-MG',
          status: 'offline',
          uptime: 0,
          version: 'v2.5.2',
          lastBlock: 24862,
          pendingTx: 0,
          cpu: 0,
          memory: 0,
          disk: 42,
          lastUpdated: new Date(),
        },
      ];

      // Gerar dados históricos
      const now = new Date();
      const mockHistoricalData: HistoricalMetric[] = Array.from({ length: 24 }, (_, i) => {
        const timestamp = new Date(now);
        timestamp.setHours(now.getHours() - (23 - i));
        
        return {
          timestamp,
          tps: 40 + Math.sin(i / 3) * 20 + Math.random() * 10,
          blockTime: 2 + Math.sin(i / 4) * 0.5 + Math.random() * 0.3,
          successRate: 99.8 + Math.random() * 0.4 - 0.2,
          activeNodes: 22 - (i % 6 === 0 ? 1 : 0),
        };
      });

      setNodes(mockNodes);
      setHistoricalData(mockHistoricalData);
      setLastUpdated(new Date());
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: NodeStatus['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      case 'syncing':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: NodeStatus['status']) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4" />;
      case 'offline':
        return <AlertCircle className="w-4 h-4" />;
      case 'syncing':
        return <RefreshCw className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const formatUptime = (seconds: number) => {
    if (seconds === 0) return 'Offline';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getResourceStatus = (value: number) => {
    if (value >= 80) return 'bg-red-500';
    if (value >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const activeNodes = nodes.filter(node => node.status === 'online').length;
  const warningNodes = nodes.filter(node => node.status === 'warning').length;
  const offlineNodes = nodes.filter(node => node.status === 'offline').length;
  const networkHealth = activeNodes / nodes.length * 100;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Status da Rede Blockchain</h1>
          <p className="text-gray-600">
            Monitoramento em tempo real da infraestrutura Hyperledger Fabric
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Última atualização: {formatDateTime(lastUpdated)}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadNetworkData}
            disabled={loading}
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Atualizar
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="nodes">Nós da Rede</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Saúde da Rede</p>
                    <p className="text-2xl font-bold text-gray-900">{networkHealth.toFixed(1)}%</p>
                  </div>
                  <div className={`p-2 rounded-full ${
                    networkHealth >= 90 
                      ? 'bg-green-100' 
                      : networkHealth >= 70 
                        ? 'bg-yellow-100' 
                        : 'bg-red-100'
                  }`}>
                    {networkHealth >= 90 ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : networkHealth >= 70 ? (
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                </div>
                <Progress 
                  value={networkHealth} 
                  className="mt-3 h-2" 
                  indicatorClassName={
                    networkHealth >= 90 
                      ? 'bg-green-500' 
                      : networkHealth >= 70 
                        ? 'bg-yellow-500' 
                        : 'bg-red-500'
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nós Ativos</p>
                    <p className="text-2xl font-bold text-gray-900">{activeNodes}/{nodes.length}</p>
                  </div>
                  <div className="p-2 rounded-full bg-green-100">
                    <Server className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-600">{activeNodes} online</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-xs text-gray-600">{warningNodes} alerta</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-xs text-gray-600">{offlineNodes} offline</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">TPS Atual</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.currentTPS.toFixed(1)}</p>
                  </div>
                  <div className="p-2 rounded-full bg-blue-100">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-gray-600">Pico: {metrics.peakTPS.toFixed(1)} TPS</span>
                  <span className="text-xs text-gray-600">•</span>
                  <span className="text-xs text-gray-600">Média: {metrics.avgTxPerBlock.toFixed(0)} tx/bloco</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa de Sucesso</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.successRate.toFixed(2)}%</p>
                  </div>
                  <div className="p-2 rounded-full bg-purple-100">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-gray-600">Latência: {metrics.networkLatency} ms</span>
                  <span className="text-xs text-gray-600">•</span>
                  <span className="text-xs text-gray-600">Consenso: {metrics.consensusRate.toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Taxas e Detalhes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Desempenho da Rede (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500">Gráfico de desempenho da rede</p>
                    <p className="text-sm text-gray-400">(Implementação do gráfico com dados históricos)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Taxas de Transação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Taxa Padrão</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        2.5%
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      Taxa aplicada a todas as transações padrão
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Taxa Premium</span>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700">
                        1.8%
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      Para clientes com volume mensal &gt; R$ 1M
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Taxa Governamental</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        1.5%
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      Para órgãos governamentais e parceiros
                    </p>
                  </div>

                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Próximo Ajuste</span>
                      <span className="text-sm">01/07/2025</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="nodes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nodes.map(node => (
              <Card key={node.id} className={`border-l-4 ${
                node.status === 'online' 
                  ? 'border-l-green-500' 
                  : node.status === 'warning' 
                    ? 'border-l-yellow-500' 
                    : 'border-l-red-500'
              }`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {node.type === 'orderer' ? (
                        <Layers className="h-5 w-5 text-purple-600" />
                      ) : node.type === 'peer' ? (
                        <HardDrive className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Shield className="h-5 w-5 text-green-600" />
                      )}
                      {node.name}
                    </CardTitle>
                    <Badge className={getStatusColor(node.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(node.status)}
                        <span>
                          {node.status === 'online' 
                            ? 'Online' 
                            : node.status === 'warning' 
                              ? 'Alerta' 
                              : node.status === 'offline' 
                                ? 'Offline' 
                                : 'Sincronizando'}
                        </span>
                      </div>
                    </Badge>
                  </div>
                  <CardDescription>
                    {node.id} • {node.organization} • v{node.version}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Uptime</p>
                      <p className="font-medium">{formatUptime(node.uptime)}</p>
                    </div>
                    {node.type === 'peer' && (
                      <div>
                        <p className="text-sm text-gray-600">Último Bloco</p>
                        <p className="font-medium">{node.lastBlock}</p>
                      </div>
                    )}
                    {node.type === 'peer' && (
                      <div>
                        <p className="text-sm text-gray-600">Tx Pendentes</p>
                        <p className="font-medium">{node.pendingTx}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Última Atualização</p>
                      <p className="font-medium">{formatTime(node.lastUpdated)}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>CPU</span>
                        <span>{node.cpu}%</span>
                      </div>
                      <Progress value={node.cpu} className="h-1" indicatorClassName={getResourceStatus(node.cpu)} />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Memória</span>
                        <span>{node.memory}%</span>
                      </div>
                      <Progress value={node.memory} className="h-1" indicatorClassName={getResourceStatus(node.memory)} />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Disco</span>
                        <span>{node.disk}%</span>
                      </div>
                      <Progress value={node.disk} className="h-1" indicatorClassName={getResourceStatus(node.disk)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Tempo de Bloco
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500">Gráfico de tempo de bloco</p>
                    <p className="text-sm text-gray-400">(Implementação do gráfico com dados históricos)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Transações por Segundo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500">Gráfico de TPS</p>
                    <p className="text-sm text-gray-400">(Implementação do gráfico com dados históricos)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  Taxa de Sucesso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500">Gráfico de taxa de sucesso</p>
                    <p className="text-sm text-gray-400">(Implementação do gráfico com dados históricos)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-orange-600" />
                  Nós Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500">Gráfico de nós ativos</p>
                    <p className="text-sm text-gray-400">(Implementação do gráfico com dados históricos)</p>
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