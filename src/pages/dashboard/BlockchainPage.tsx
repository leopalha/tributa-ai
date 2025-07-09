import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Blocks,
  Activity,
  Map,
  Search,
  TrendingUp,
  Users,
  Database,
  Shield,
  Globe,
  Zap,
  Eye,
  Hash,
  Clock,
  ArrowRight,
  ExternalLink,
  Wallet,
  FileText,
  Network,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NetworkStats {
  totalBlocks: number;
  totalTransactions: number;
  tps: number;
  blockTime: number;
  activeValidators: number;
  networkHealth: number;
  totalValue: number;
  gasPrice: number;
}

interface QuickStat {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

export default function BlockchainPage() {
  const navigate = useNavigate();
  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    totalBlocks: 2847593,
    totalTransactions: 18475629,
    tps: 2847,
    blockTime: 3.2,
    activeValidators: 27,
    networkHealth: 99.8,
    totalValue: 2500000000,
    gasPrice: 15.4,
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      type: 'block',
      data: 'Novo bloco #2847593 minerado',
      time: '2s atrás',
      hash: '0x7a8b9c2d...f1e2d3c4',
    },
    {
      type: 'transaction',
      data: 'Transferência de 1,250 TTA',
      time: '5s atrás',
      hash: '0x9c8b7a6d...c4d3e2f1',
    },
    {
      type: 'contract',
      data: 'Contrato implantado',
      time: '12s atrás',
      hash: '0x8b7a6c5d...d3e2f1a0',
    },
    {
      type: 'block',
      data: 'Novo bloco #2847592 minerado',
      time: '15s atrás',
      hash: '0x7a6c5b4d...e2f1a0b9',
    },
    {
      type: 'transaction',
      data: 'Transferência de 5,000 TTA',
      time: '18s atrás',
      hash: '0x6c5b4a3d...f1a0b9c8',
    },
  ]);

  useEffect(() => {
    // Simular atualizações em tempo real
    const interval = setInterval(() => {
      setNetworkStats(prev => ({
        ...prev,
        totalBlocks: prev.totalBlocks + Math.floor(Math.random() * 2),
        totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 10),
        tps: 2847 + Math.floor(Math.random() * 200) - 100,
        gasPrice: 15.4 + (Math.random() - 0.5) * 2,
      }));

      // Adicionar nova atividade ocasionalmente
      if (Math.random() > 0.7) {
        const activities = [
          {
            type: 'block',
            data: `Novo bloco #${networkStats.totalBlocks + 1} minerado`,
            time: 'agora',
            hash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 8)}`,
          },
          {
            type: 'transaction',
            data: `Transferência de ${(Math.random() * 10000).toFixed(0)} TTA`,
            time: 'agora',
            hash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 8)}`,
          },
          {
            type: 'contract',
            data: 'Contrato chamado',
            time: 'agora',
            hash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 8)}`,
          },
        ];

        setRecentActivity(prev => [
          activities[Math.floor(Math.random() * activities.length)],
          ...prev.slice(0, 9),
        ]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [networkStats.totalBlocks]);

  const quickStats: QuickStat[] = [
    {
      label: 'Total de Blocos',
      value: networkStats.totalBlocks.toLocaleString(),
      change: 2.4,
      icon: <Blocks className="w-6 h-6" />,
      color: 'text-blue-600',
    },
    {
      label: 'Transações Totais',
      value: networkStats.totalTransactions.toLocaleString(),
      change: 5.7,
      icon: <Activity className="w-6 h-6" />,
      color: 'text-green-600',
    },
    {
      label: 'TPS Atual',
      value: networkStats.tps.toString(),
      change: -1.2,
      icon: <Zap className="w-6 h-6" />,
      color: 'text-yellow-600',
    },
    {
      label: 'Validadores Ativos',
      value: networkStats.activeValidators.toString(),
      change: 0,
      icon: <Users className="w-6 h-6" />,
      color: 'text-purple-600',
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'block':
        return <Blocks className="w-4 h-4 text-blue-500" />;
      case 'transaction':
        return <Activity className="w-4 h-4 text-green-500" />;
      case 'contract':
        return <Hash className="w-4 h-4 text-purple-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blockchain</h1>
          <p className="text-gray-600">
            Explore e monitore transações, contratos e tokens na blockchain
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Activity className="w-4 h-4 mr-1" />
            Network Online
          </Badge>
          <Button onClick={() => handleNavigate('/dashboard/blockchain/explorer')}>
            <Search className="w-4 h-4 mr-2" />
            Explorador
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total de Transações</p>
                    <p className="text-2xl font-bold">24,583</p>
                    <p className="text-sm text-green-600">+156 hoje</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tokens Ativos</p>
                    <p className="text-2xl font-bold">1,245</p>
                    <p className="text-sm text-green-600">+28 esta semana</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Blocos Validados</p>
                    <p className="text-2xl font-bold">8,742</p>
                    <p className="text-sm text-green-600">+12 hoje</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Blocks className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Valor Total</p>
                    <p className="text-2xl font-bold">R$ 2.8B</p>
                    <p className="text-sm text-green-600">+5.2% este mês</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <BarChart className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Principais Ferramentas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="w-5 h-5 mr-2 text-blue-600" />
                  Explorador Blockchain
                </CardTitle>
                <CardDescription>
                  Pesquise transações, endereços e contratos inteligentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Explore detalhes completos de qualquer transação, endereço ou contrato na blockchain
                  da Tributa.AI com ferramentas avançadas de análise.
                </p>
                <Button 
                  className="w-full" 
                  onClick={() => handleNavigate('/dashboard/blockchain/explorer')}
                >
                  Acessar Explorador
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Map className="w-5 h-5 mr-2 text-green-600" />
                  Mapa de Transações
                </CardTitle>
                <CardDescription>
                  Visualize fluxos e conexões entre endereços
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Visualize graficamente os fluxos de tokens e conexões entre diferentes endereços e 
                  entidades na blockchain com nossa ferramenta de mapeamento avançada.
                </p>
                <Button 
                  className="w-full" 
                  onClick={() => handleNavigate('/dashboard/blockchain/transaction-map')}
                >
                  Ver Mapa de Transações
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-purple-600" />
                  Status da Rede
                </CardTitle>
                <CardDescription>
                  Monitore saúde e desempenho da rede blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Acompanhe métricas de desempenho, saúde da rede, validadores ativos e outros
                  indicadores importantes do ecossistema blockchain da Tributa.AI.
                </p>
                <Button 
                  className="w-full" 
                  onClick={() => handleNavigate('/dashboard/blockchain/status')}
                >
                  Ver Status da Rede
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Transações Recentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Transações Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-green-100' : index === 1 ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        {index === 0 ? (
                          <Wallet className="w-5 h-5 text-green-600" />
                        ) : index === 1 ? (
                          <FileText className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Network className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {index === 0
                            ? 'Tokenização de Crédito'
                            : index === 1
                            ? 'Compensação Multilateral'
                            : 'Transferência de Token'}
                        </p>
                        <p className="text-sm text-gray-600 font-mono">
                          {activity.hash}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {index === 0 ? 'R$ 1,250,000' : index === 1 ? 'R$ 850,000' : 'R$ 350,000'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={() => handleNavigate('/dashboard/blockchain/explorer')}>
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Todas as Transações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Transações</CardTitle>
              <CardDescription>
                Informações detalhadas sobre transações na blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Activity className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Análise de Transações em Desenvolvimento
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Esta funcionalidade estará disponível em breve com relatórios detalhados e gráficos interativos.
                </p>
                <Button className="mt-4" onClick={() => handleNavigate('/dashboard/blockchain/explorer')}>
                  <Search className="w-4 h-4 mr-2" />
                  Ir para o Explorador
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens">
          <Card>
            <CardHeader>
              <CardTitle>Tokens na Blockchain</CardTitle>
              <CardDescription>
                Explore tokens e contratos tokenizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Wallet className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Análise de Tokens em Desenvolvimento
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Esta funcionalidade estará disponível em breve com relatórios detalhados e gráficos interativos.
                </p>
                <Button className="mt-4" onClick={() => handleNavigate('/dashboard/tokenizacao/meus-tokens')}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ir para Meus Tokens
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
