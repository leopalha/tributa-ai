import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Blocks,
  Activity,
  Clock,
  Hash,
  Users,
  Database,
  TrendingUp,
  Globe,
  Zap,
  Shield,
  Eye,
  ExternalLink,
  Copy,
  RefreshCw,
  Code,
  BookOpen,
  Terminal
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface BlockInfo {
  number: number;
  hash: string;
  timestamp: Date;
  transactionCount: number;
  validator: string;
  size: number;
  gasUsed: number;
  gasLimit: number;
}

interface TransactionInfo {
  hash: string;
  blockNumber: number;
  from: string;
  to: string;
  value: number;
  gasPrice: number;
  gasUsed: number;
  timestamp: Date;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  type: 'TRANSFER' | 'CONTRACT_CALL' | 'CONTRACT_CREATION';
}

interface NetworkStats {
  totalBlocks: number;
  totalTransactions: number;
  tps: number;
  blockTime: number;
  activeValidators: number;
  totalSupply: number;
  marketCap: number;
  price: number;
}

export default function BlockchainExplorerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentBlocks, setRecentBlocks] = useState<BlockInfo[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<TransactionInfo[]>([]);
  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    totalBlocks: 2847593,
    totalTransactions: 18475629,
    tps: 2847,
    blockTime: 3.2,
    activeValidators: 27,
    totalSupply: 100000000,
    marketCap: 2500000000,
    price: 25.47,
  });
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [apiExamples, setApiExamples] = useState({
    status: {
      endpoint: '/api/blockchain/status',
      method: 'GET',
      description: 'Obtém o status atual da blockchain',
      response: {
        "status": "online",
        "lastBlock": 2847593,
        "networkHash": "0x1a2b3c...",
        "difficulty": "15.2T",
        "tps": 2847
      }
    },
    transaction: {
      endpoint: '/api/blockchain/transaction/{hash}',
      method: 'GET', 
      description: 'Busca detalhes de uma transação específica',
      response: {
        "hash": "0xabc123...",
        "block": 2847592,
        "from": "0x123abc...",
        "to": "0x456def...",
        "value": "1.5 ETH",
        "gas": 21000,
        "status": "SUCCESS"
      }
    },
    address: {
      endpoint: '/api/blockchain/address/{address}',
      method: 'GET',
      description: 'Obtém informações sobre um endereço',
      response: {
        "address": "0x123abc...",
        "balance": "125.3 ETH",
        "transactionCount": 847,
        "firstSeen": "2023-01-15",
        "lastActivity": "2024-01-10"
      }
    }
  });

  useEffect(() => {
    loadBlockchainData();
    const interval = setInterval(loadBlockchainData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadBlockchainData = () => {
    // Simular dados de blocos recentes
    const blocks: BlockInfo[] = Array.from({ length: 10 }, (_, i) => ({
      number: 2847593 - i,
      hash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 8)}`,
      timestamp: new Date(Date.now() - i * 3200),
      transactionCount: Math.floor(Math.random() * 200) + 50,
      validator: `Validator-${Math.floor(Math.random() * 27) + 1}`,
      size: Math.floor(Math.random() * 50000) + 10000,
      gasUsed: Math.floor(Math.random() * 8000000) + 2000000,
      gasLimit: 10000000,
    }));

    // Simular transações recentes
    const transactions: TransactionInfo[] = Array.from({ length: 15 }, (_, i) => ({
      hash: `0x${Math.random().toString(16).substr(2, 16)}...${Math.random().toString(16).substr(2, 8)}`,
      blockNumber: 2847593 - Math.floor(i / 3),
      from: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 8)}`,
      to: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 8)}`,
      value: Math.random() * 1000,
      gasPrice: Math.floor(Math.random() * 50) + 10,
      gasUsed: Math.floor(Math.random() * 100000) + 21000,
      timestamp: new Date(Date.now() - i * 2000),
      status: Math.random() > 0.1 ? 'SUCCESS' : Math.random() > 0.5 ? 'FAILED' : 'PENDING',
      type:
        Math.random() > 0.7
          ? 'CONTRACT_CALL'
          : Math.random() > 0.5
            ? 'CONTRACT_CREATION'
            : 'TRANSFER',
    }));

    setRecentBlocks(blocks);
    setRecentTransactions(transactions);
  };

  const handleSearch = () => {
    setLoading(true);
    // Simular busca inteligente
    setTimeout(() => {
      const mockResult = {
        type: searchTerm.startsWith('0x') ? 'transaction' : 'block',
        data: {
          hash: searchTerm,
          status: 'SUCCESS',
          value: Math.random() * 1000,
          gasUsed: 21000,
          timestamp: new Date(),
          riskScore: Math.random() * 100,
          isAnomaly: Math.random() > 0.8
        }
      };
      setSearchResults(mockResult);
      setLoading(false);
    }, 1000);
  };

  const detectAnomalies = () => {
    const mockAnomalies = [
      {
        id: 1,
        type: 'HIGH_VALUE_TRANSFER',
        severity: 'HIGH',
        description: 'Transferência suspeita de alto valor',
        txHash: '0x123...abc',
        timestamp: new Date(),
        riskScore: 85
      },
      {
        id: 2,
        type: 'RAPID_TRANSACTIONS',
        severity: 'MEDIUM',
        description: 'Múltiplas transações em sequência rápida',
        address: '0x456...def',
        timestamp: new Date(),
        riskScore: 65
      }
    ];
    setAnomalies(mockAnomalies);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência!');
  };

  const tryApiEndpoint = (endpoint: string) => {
    toast.info(`Testando endpoint: ${endpoint}`);
    // Simular chamada de API
    setTimeout(() => {
      toast.success('Endpoint testado com sucesso!');
    }, 1000);
  };

  const analyzeContract = (address: string) => {
    // Simular análise de contrato
    return {
      isVerified: Math.random() > 0.5,
      securityScore: Math.floor(Math.random() * 100),
      vulnerabilities: Math.floor(Math.random() * 5),
      lastAudit: new Date()
    };
  };

  const formatHash = (hash: string) => {
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  const formatTime = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header com Busca */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Tributa.AI Explorer</h1>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <Activity className="w-4 h-4 mr-1" />
              Live
            </Badge>
            <Button variant="outline" size="sm" onClick={loadBlockchainData}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Busca Global */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por hash de transação, endereço, bloco ou contrato..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Buscar
          </Button>
        </div>
      </div>

      {/* Estatísticas da Rede */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Blocos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(networkStats.totalBlocks)}
                </p>
              </div>
              <Blocks className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Transações</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(networkStats.totalTransactions)}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">TPS</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(networkStats.tps)}</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Validadores Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{networkStats.activeValidators}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Navegação */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics">Análise</TabsTrigger>
          <TabsTrigger value="contracts">Contratos</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalias</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Resultado da Busca */}
          {searchResults && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-900">Resultado da Busca</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tipo</p>
                    <p className="text-lg font-semibold">{searchResults.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Score de Risco</p>
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full ${
                        searchResults.data.riskScore > 70 ? 'bg-red-500' :
                        searchResults.data.riskScore > 40 ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <span>{searchResults.data.riskScore.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                {searchResults.data.isAnomaly && (
                  <Badge variant="destructive" className="mt-2">
                    <Shield className="w-3 h-3 mr-1" />
                    Anomalia Detectada
                  </Badge>
                )}
              </CardContent>
            </Card>
          )}

          {/* Conteúdo Principal */}
          <div className="grid grid-cols-2 gap-6">
        {/* Blocos Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Blocks className="w-5 h-5 mr-2" />
              Blocos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBlocks.map(block => (
                <div
                  key={block.number}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Blocks className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">#{block.number}</p>
                      <p className="text-sm text-gray-500">{formatHash(block.hash)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {block.transactionCount} txns
                    </p>
                    <p className="text-xs text-gray-500">{formatTime(block.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transações Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Transações Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map(tx => (
                <div
                  key={tx.hash}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        tx.status === 'SUCCESS'
                          ? 'bg-green-100'
                          : tx.status === 'FAILED'
                            ? 'bg-red-100'
                            : 'bg-yellow-100'
                      }`}
                    >
                      <Hash
                        className={`w-5 h-5 ${
                          tx.status === 'SUCCESS'
                            ? 'text-green-600'
                            : tx.status === 'FAILED'
                              ? 'text-red-600'
                              : 'text-yellow-600'
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{formatHash(tx.hash)}</p>
                      <p className="text-sm text-gray-500">
                        {formatHash(tx.from)} → {formatHash(tx.to)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{tx.value.toFixed(4)} TTA</p>
                    <p className="text-xs text-gray-500">{formatTime(tx.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Análise de Fluxo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Fluxos de Alto Volume</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">0x123...abc → 0x456...def</span>
                        <span className="text-sm font-medium">1,250 TTA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">0x789...ghi → 0x012...jkl</span>
                        <span className="text-sm font-medium">875 TTA</span>
                      </div>
                    </div>
                  </div>
                  <Button onClick={detectAnomalies} className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Detectar Anomalias
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Métricas Avançadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Concentração de Riqueza</p>
                    <p className="text-lg font-semibold">12.5%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Endereços Ativos</p>
                    <p className="text-lg font-semibold">45,291</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Volume 24h</p>
                    <p className="text-lg font-semibold">2.4M TTA</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Velocidade</p>
                    <p className="text-lg font-semibold">1.8x</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Contratos Inteligentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { address: '0xabc...123', name: 'TributaToken', verified: true, score: 95 },
                  { address: '0xdef...456', name: 'CompensacaoContract', verified: true, score: 88 },
                  { address: '0xghi...789', name: 'MarketplaceContract', verified: false, score: 62 }
                ].map((contract, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{contract.name}</p>
                        <p className="text-sm text-gray-600">{contract.address}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {contract.verified && (
                          <Badge variant="secondary">
                            <Shield className="w-3 h-3 mr-1" />
                            Verificado
                          </Badge>
                        )}
                        <div className={`px-2 py-1 rounded text-xs ${
                          contract.score > 80 ? 'bg-green-100 text-green-800' :
                          contract.score > 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          Score: {contract.score}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Detecção de Anomalias
              </CardTitle>
            </CardHeader>
            <CardContent>
              {anomalies.length > 0 ? (
                <div className="space-y-4">
                  {anomalies.map((anomaly) => (
                    <div key={anomaly.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={anomaly.severity === 'HIGH' ? 'destructive' : 'secondary'}>
                          {anomaly.severity}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {formatTime(anomaly.timestamp)}
                        </span>
                      </div>
                      <p className="font-medium mb-1">{anomaly.description}</p>
                      <p className="text-sm text-gray-600">
                        {anomaly.txHash && `Hash: ${anomaly.txHash}`}
                        {anomaly.address && `Endereço: ${anomaly.address}`}
                      </p>
                      <div className="mt-2 flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          anomaly.riskScore > 70 ? 'bg-red-500' :
                          anomaly.riskScore > 40 ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <span className="text-sm">Risco: {anomaly.riskScore}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma anomalia detectada</p>
                  <Button onClick={detectAnomalies} className="mt-4">
                    Executar Detecção
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                API Explorer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Endpoints Disponíveis</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <code className="text-sm">/api/blockchain/status</code>
                      <Badge variant="outline">GET</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="text-sm">/api/blockchain/transaction/{hash}</code>
                      <Badge variant="outline">GET</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="text-sm">/api/blockchain/block/{number}</code>
                      <Badge variant="outline">GET</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="text-sm">/api/blockchain/address/{address}</code>
                      <Badge variant="outline">GET</Badge>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">Documentação API</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Acesse nossa documentação completa da API para integração.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Ver Documentação
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center">
                          <Code className="w-5 h-5 mr-2" />
                          Documentação da API Blockchain
                        </DialogTitle>
                        <DialogDescription>
                          Explore e teste os endpoints disponíveis da nossa API REST.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        {/* Autenticação */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-semibold mb-2 flex items-center">
                            <Shield className="w-4 h-4 mr-2" />
                            Autenticação
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Todas as requisições devem incluir o header de autorização:
                          </p>
                          <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
                            Authorization: Bearer YOUR_API_KEY
                          </div>
                        </div>

                        {/* Status Endpoint */}
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold flex items-center">
                              <Activity className="w-4 h-4 mr-2 text-green-500" />
                              Status da Rede
                            </h3>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => copyToClipboard(apiExamples.status.endpoint)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => tryApiEndpoint(apiExamples.status.endpoint)}
                              >
                                <Terminal className="w-3 h-3 mr-1" />
                                Testar
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600 mb-2">{apiExamples.status.description}</p>
                              <div className="bg-blue-50 p-3 rounded">
                                <code className="text-sm">
                                  <span className="text-green-600">{apiExamples.status.method}</span> {apiExamples.status.endpoint}
                                </code>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Resposta exemplo:</p>
                              <div className="bg-gray-800 text-green-400 p-3 rounded text-xs font-mono overflow-x-auto">
                                <pre>{JSON.stringify(apiExamples.status.response, null, 2)}</pre>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Transaction Endpoint */}
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold flex items-center">
                              <Hash className="w-4 h-4 mr-2 text-blue-500" />
                              Detalhes da Transação
                            </h3>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => copyToClipboard(apiExamples.transaction.endpoint)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => tryApiEndpoint(apiExamples.transaction.endpoint)}
                              >
                                <Terminal className="w-3 h-3 mr-1" />
                                Testar
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600 mb-2">{apiExamples.transaction.description}</p>
                              <div className="bg-blue-50 p-3 rounded">
                                <code className="text-sm">
                                  <span className="text-green-600">{apiExamples.transaction.method}</span> {apiExamples.transaction.endpoint}
                                </code>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Resposta exemplo:</p>
                              <div className="bg-gray-800 text-green-400 p-3 rounded text-xs font-mono overflow-x-auto">
                                <pre>{JSON.stringify(apiExamples.transaction.response, null, 2)}</pre>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Address Endpoint */}
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold flex items-center">
                              <Users className="w-4 h-4 mr-2 text-purple-500" />
                              Informações do Endereço
                            </h3>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => copyToClipboard(apiExamples.address.endpoint)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => tryApiEndpoint(apiExamples.address.endpoint)}
                              >
                                <Terminal className="w-3 h-3 mr-1" />
                                Testar
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600 mb-2">{apiExamples.address.description}</p>
                              <div className="bg-blue-50 p-3 rounded">
                                <code className="text-sm">
                                  <span className="text-green-600">{apiExamples.address.method}</span> {apiExamples.address.endpoint}
                                </code>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Resposta exemplo:</p>
                              <div className="bg-gray-800 text-green-400 p-3 rounded text-xs font-mono overflow-x-auto">
                                <pre>{JSON.stringify(apiExamples.address.response, null, 2)}</pre>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Rate Limits */}
                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                          <h3 className="font-semibold mb-2 flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-yellow-600" />
                            Limites de Taxa
                          </h3>
                          <ul className="text-sm space-y-1">
                            <li>• 1000 requisições por hora para contas gratuitas</li>
                            <li>• 10000 requisições por hora para contas premium</li>
                            <li>• Headers de rate limit incluídos nas respostas</li>
                          </ul>
                        </div>

                        {/* SDKs */}
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                          <h3 className="font-semibold mb-2 flex items-center">
                            <Code className="w-4 h-4 mr-2 text-blue-600" />
                            SDKs Disponíveis
                          </h3>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <h4 className="font-medium">JavaScript/Node.js</h4>
                              <code className="text-xs">npm install tributa-api</code>
                            </div>
                            <div>
                              <h4 className="font-medium">Python</h4>
                              <code className="text-xs">pip install tributa-api</code>
                            </div>
                            <div>
                              <h4 className="font-medium">Go</h4>
                              <code className="text-xs">go get tributa.ai/api</code>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
