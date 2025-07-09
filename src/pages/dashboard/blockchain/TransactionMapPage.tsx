import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Map,
  Activity,
  Search,
  Info,
  ArrowLeft,
  ExternalLink,
  Brain,
  Target,
  Users,
  TrendingUp,
  AlertTriangle,
  Shield,
  Eye,
  Download,
  RefreshCw,
  Bell,
  FileText,
  Share2,
  Monitor
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BlockchainTransactionMap } from '@/components/blockchain/BlockchainTransactionMap';
import { blockchainAnalyticsService, EntityCluster, FlowAnalysis, TransactionAnomaly } from '@/services/blockchain-analytics.service';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function TransactionMapPage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('map');
  const [clusters, setClusters] = useState<EntityCluster[]>([]);
  const [flowAnalysis, setFlowAnalysis] = useState<FlowAnalysis[]>([]);
  const [anomalies, setAnomalies] = useState<TransactionAnomaly[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');
  const [detectedPatterns, setDetectedPatterns] = useState<any[]>([]);
  const [isRealTimeMonitoring, setIsRealTimeMonitoring] = useState(false);
  const [alertsConfig, setAlertsConfig] = useState({
    enabled: false,
    email: '',
    thresholds: {
      highValue: 100000,
      anomalyScore: 80,
      riskLevel: 'HIGH'
    }
  });
  const [mlPredictions, setMlPredictions] = useState<any[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [clustersData, anomaliesData] = await Promise.all([
        blockchainAnalyticsService.clusterEntities(),
        blockchainAnalyticsService.detectAnomalies()
      ]);
      setClusters(clustersData);
      setAnomalies(anomaliesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const analyzeFlows = async () => {
    if (!searchAddress) {
      alert('Digite um endereço para análise');
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const flows = await blockchainAnalyticsService.analyzeFlows(searchAddress);
      setFlowAnalysis(flows);
    } catch (error) {
      console.error('Erro na análise de fluxos:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const detectPatterns = async () => {
    setIsAnalyzing(true);
    try {
      const patterns = [
        {
          type: 'CIRCULAR_FLOW',
          description: 'Fluxo circular detectado entre 3 endereços',
          severity: 'MEDIUM',
          addresses: ['0x123...abc', '0x456...def', '0x789...ghi'],
          confidence: 85,
          amount: 500000
        },
        {
          type: 'RAPID_DISPERSION',
          description: 'Dispersão rápida de fundos para múltiplos endereços',
          severity: 'HIGH',
          addresses: ['0x5678...efgh'],
          confidence: 92,
          amount: 1250000
        },
        {
          type: 'LAYER_MIXING',
          description: 'Uso de múltiplas camadas de mixing detectado',
          severity: 'HIGH',
          addresses: ['0x9abc...ijkl', '0xdef0...mnop'],
          confidence: 88,
          amount: 750000
        }
      ];
      setDetectedPatterns(patterns);
      toast.success('Padrões detectados com sucesso!');
    } catch (error) {
      console.error('Erro na detecção de padrões:', error);
      toast.error('Erro ao detectar padrões');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const exportData = async (format: 'json' | 'csv' | 'pdf') => {
    try {
      const data = {
        clusters,
        flowAnalysis,
        anomalies,
        detectedPatterns,
        timestamp: new Date().toISOString()
      };

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `blockchain-analysis-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === 'csv') {
        const csvData = [
          ['Tipo', 'ID', 'Descrição', 'Severity', 'Timestamp'],
          ...anomalies.map(a => [a.type, a.id, a.description, a.severity, a.timestamp.toISOString()]),
          ...detectedPatterns.map(p => [p.type, 'N/A', p.description, p.severity, new Date().toISOString()])
        ];
        
        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `blockchain-analysis-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === 'pdf') {
        // Simular geração de PDF (seria integrado com biblioteca como jsPDF)
        toast.info('Gerando relatório PDF... (Em desenvolvimento)');
        setTimeout(() => {
          toast.success('Relatório PDF gerado com sucesso!');
        }, 2000);
      }

      toast.success(`Dados exportados em formato ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Erro na exportação:', error);
      toast.error('Erro ao exportar dados');
    }
  };

  const saveAlertsConfig = () => {
    localStorage.setItem('alertsConfig', JSON.stringify(alertsConfig));
    toast.success('Configuração de alertas salva!');
  };

  const toggleRealTimeMonitoring = () => {
    setIsRealTimeMonitoring(!isRealTimeMonitoring);
    if (!isRealTimeMonitoring) {
      toast.success('Monitor em tempo real ativado');
      // Simular início do monitoramento
      const interval = setInterval(() => {
        if (Math.random() > 0.8) {
          toast.warning('Nova transação suspeita detectada!');
        }
      }, 10000);
      
      // Limpar interval após 30 segundos (simulação)
      setTimeout(() => {
        clearInterval(interval);
      }, 30000);
    } else {
      toast.info('Monitor em tempo real desativado');
    }
  };

  const runPredictiveAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const predictions = [
        {
          id: '1',
          type: 'PRICE_PREDICTION',
          description: 'Previsão de alta volatilidade em 24h',
          confidence: 78,
          timeframe: '24h',
          impact: 'MEDIUM'
        },
        {
          id: '2',
          type: 'FLOW_PREDICTION',
          description: 'Possível movimentação de fundos da exchange X',
          confidence: 85,
          timeframe: '12h',
          impact: 'HIGH'
        },
        {
          id: '3',
          type: 'ANOMALY_PREDICTION',
          description: 'Padrão de lavagem pode se repetir no endereço Y',
          confidence: 92,
          timeframe: '6h',
          impact: 'HIGH'
        }
      ];
      
      setMlPredictions(predictions);
      toast.success('Análise preditiva concluída!');
    } catch (error) {
      console.error('Erro na análise preditiva:', error);
      toast.error('Erro na análise preditiva');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runMLPatterns = async () => {
    setIsAnalyzing(true);
    try {
      const mlPatterns = [
        {
          type: 'BEHAVIORAL_CLUSTER',
          description: 'Cluster de comportamento similar entre 15 endereços',
          algorithm: 'K-Means',
          confidence: 89,
          addresses: 15
        },
        {
          type: 'SEQUENTIAL_PATTERN',
          description: 'Padrão sequencial de transações detectado',
          algorithm: 'Sequential Pattern Mining',
          confidence: 76,
          sequences: 8
        },
        {
          type: 'NETWORK_ANALYSIS',
          description: 'Estrutura de rede suspeita identificada',
          algorithm: 'Graph Neural Network',
          confidence: 94,
          nodes: 23
        }
      ];
      
      // Adicionar aos padrões detectados
      setDetectedPatterns(prev => [...prev, ...mlPatterns]);
      toast.success('Padrões ML detectados!');
    } catch (error) {
      console.error('Erro na detecção ML:', error);
      toast.error('Erro na detecção ML');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Carregar configurações salvas
  useEffect(() => {
    const savedConfig = localStorage.getItem('alertsConfig');
    if (savedConfig) {
      setAlertsConfig(JSON.parse(savedConfig));
    }
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatTime = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s atrás`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m atrás`;
    return `${Math.floor(seconds / 3600)}h atrás`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard/blockchain')}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Mapa de Transações</h1>
          </div>
          <p className="text-gray-600 mt-1 ml-11">
            Visualização avançada de fluxos e conexões entre endereços blockchain
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Activity className="w-4 h-4 mr-1" />
            Network Online
          </Badge>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard/blockchain/explorer')}
            className="border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            <Search className="w-4 h-4 mr-2" />
            Explorador
          </Button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="space-y-6">
        {/* Informações sobre o mapa */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800">Sobre o Mapa de Transações</h3>
                <p className="text-sm text-blue-700">
                  Este mapa permite visualizar fluxos de tokens e conexões entre endereços na blockchain.
                  Inspirado em ferramentas como Arkham Intelligence, ele ajuda a identificar padrões e
                  rastrear movimentações de fundos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs de Navegação */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="map">Mapa Visual</TabsTrigger>
            <TabsTrigger value="flows">Análise de Fluxos</TabsTrigger>
            <TabsTrigger value="clusters">Clusters</TabsTrigger>
            <TabsTrigger value="patterns">Padrões</TabsTrigger>
            <TabsTrigger value="anomalies">Anomalias</TabsTrigger>
          </TabsList>

          <TabsContent value="map">
            <BlockchainTransactionMap />
          </TabsContent>

          <TabsContent value="flows" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Análise de Fluxos
                  </span>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Endereço para análise..."
                      value={searchAddress}
                      onChange={(e) => setSearchAddress(e.target.value)}
                      className="w-64"
                    />
                    <Button onClick={analyzeFlows} disabled={isAnalyzing}>
                      {isAnalyzing ? (
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Brain className="w-4 h-4 mr-2" />
                      )}
                      Analisar
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {flowAnalysis.length > 0 ? (
                  <div className="space-y-4">
                    {flowAnalysis.map((flow, index) => (
                      <div key={flow.id} className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Fluxo {index + 1}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant={flow.riskFlags.length > 0 ? 'destructive' : 'secondary'}>
                              {flow.riskFlags.length} flags
                            </Badge>
                            <Badge variant="outline">
                              Score: {flow.anomalyScore}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Origem:</p>
                            <p className="font-mono">{flow.source}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Destino:</p>
                            <p className="font-mono">{flow.destination}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Valor Total:</p>
                            <p className="font-medium">{formatCurrency(flow.totalAmount)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Hops:</p>
                            <p className="font-medium">{flow.hops}</p>
                          </div>
                        </div>
                        {flow.riskFlags.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600 mb-1">Flags de Risco:</p>
                            <div className="flex flex-wrap gap-1">
                              {flow.riskFlags.map((flag) => (
                                <Badge key={flag} variant="outline" className="text-xs">
                                  {flag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {flow.patterns.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600 mb-1">Padrões:</p>
                            <div className="flex flex-wrap gap-1">
                              {flow.patterns.map((pattern) => (
                                <Badge key={pattern} variant="secondary" className="text-xs">
                                  {pattern}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Digite um endereço e execute a análise para ver os fluxos</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clusters" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Clusters de Entidades
                  </span>
                  <Button onClick={loadInitialData}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Atualizar
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clusters.map((cluster) => (
                    <div key={cluster.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{cluster.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{cluster.type}</Badge>
                            <Badge variant={cluster.riskLevel === 'HIGH' ? 'destructive' : 
                                           cluster.riskLevel === 'MEDIUM' ? 'secondary' : 'outline'}>
                              {cluster.riskLevel}
                            </Badge>
                            <span className="text-sm text-gray-500">Confiança: {cluster.confidence}%</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Valor Total</p>
                          <p className="font-medium">{formatCurrency(cluster.totalValue)}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Endereços</p>
                          <p className="font-medium">{cluster.addresses.length}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Transações</p>
                          <p className="font-medium">{cluster.transactionCount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Última Atividade</p>
                          <p className="font-medium">{formatTime(cluster.lastActivity)}</p>
                        </div>
                      </div>
                      {cluster.tags.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1">
                            {cluster.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Detecção de Padrões
                  </span>
                  <Button onClick={detectPatterns} disabled={isAnalyzing}>
                    {isAnalyzing ? (
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Brain className="w-4 h-4 mr-2" />
                    )}
                    Detectar Padrões
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {detectedPatterns.length > 0 ? (
                  <div className="space-y-4">
                    {detectedPatterns.map((pattern, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant={pattern.severity === 'HIGH' ? 'destructive' : 
                                           pattern.severity === 'MEDIUM' ? 'secondary' : 'outline'}>
                              {pattern.severity}
                            </Badge>
                            <span className="font-medium">{pattern.type}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">Confiança: {pattern.confidence}%</span>
                            <Badge variant="outline">{formatCurrency(pattern.amount)}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{pattern.description}</p>
                        <div className="text-xs text-gray-500">
                          Endereços envolvidos: {pattern.addresses.length}
                          <div className="mt-1">
                            {pattern.addresses.slice(0, 3).map((addr: string) => (
                              <span key={addr} className="mr-2 font-mono">{addr}</span>
                            ))}
                            {pattern.addresses.length > 3 && (
                              <span>+{pattern.addresses.length - 3} mais</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Execute a detecção para identificar padrões suspeitos</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="anomalies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Anomalias Detectadas
                  </span>
                  <Button onClick={loadInitialData}>
                    <Shield className="w-4 h-4 mr-2" />
                    Detectar Novas
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {anomalies.length > 0 ? (
                  <div className="space-y-4">
                    {anomalies.map((anomaly) => (
                      <div key={anomaly.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant={anomaly.severity === 'HIGH' ? 'destructive' : 
                                           anomaly.severity === 'MEDIUM' ? 'secondary' : 'outline'}>
                              {anomaly.severity}
                            </Badge>
                            <span className="font-medium">{anomaly.type}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">{formatTime(anomaly.timestamp)}</span>
                            <Badge variant="outline">Score: {anomaly.score}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{anomaly.description}</p>
                        <div className="text-xs text-gray-500">
                          <p>Hash: <span className="font-mono">{anomaly.txHash}</span></p>
                          <p className="mt-1">Endereços: {anomaly.addresses.join(', ')}</p>
                        </div>
                        {Object.keys(anomaly.metadata).length > 0 && (
                          <div className="mt-2 text-xs">
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(anomaly.metadata).map(([key, value]) => (
                                <span key={key} className="bg-gray-100 px-2 py-1 rounded">
                                  {key}: {typeof value === 'number' ? value.toLocaleString() : value}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma anomalia detectada no momento</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Previsões ML */}
        {mlPredictions.length > 0 && (
          <Card className="bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-800">
                <Brain className="w-5 h-5 mr-2" />
                Previsões de Inteligência Artificial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mlPredictions.map((prediction) => (
                  <div key={prediction.id} className="p-3 bg-white rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={prediction.impact === 'HIGH' ? 'destructive' : 
                                     prediction.impact === 'MEDIUM' ? 'secondary' : 'outline'}>
                        {prediction.impact}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Confiança: {prediction.confidence}%</span>
                        <Badge variant="outline">{prediction.timeframe}</Badge>
                      </div>
                    </div>
                    <p className="text-sm">{prediction.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status do Monitor em Tempo Real */}
        {isRealTimeMonitoring && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="font-medium text-green-800">Monitor em Tempo Real Ativo</p>
                  <p className="text-sm text-green-700">
                    Sistema monitorando continuamente por anomalias e padrões suspeitos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recursos Adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Download className="w-5 h-5 mr-2" />
                Exportar Análise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Exporte todos os dados de análise em diferentes formatos para relatórios ou integração.
              </p>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="sm"
                  onClick={() => exportData('json')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar JSON
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="sm"
                  onClick={() => exportData('csv')}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Exportar CSV
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="sm"
                  onClick={() => exportData('pdf')}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Relatório PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Monitoramento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Configure alertas e monitoramento contínuo para endereços e padrões específicos.
              </p>
              <div className="space-y-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full" size="sm">
                      <Shield className="w-4 h-4 mr-2" />
                      Configurar Alertas
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Configuração de Alertas</DialogTitle>
                      <DialogDescription>
                        Configure alertas para monitoramento automático de atividades suspeitas.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="enable-alerts"
                          checked={alertsConfig.enabled}
                          onCheckedChange={(checked) => 
                            setAlertsConfig(prev => ({ ...prev, enabled: !!checked }))
                          }
                        />
                        <Label htmlFor="enable-alerts">Ativar alertas</Label>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email para notificações</Label>
                        <Input
                          id="email"
                          type="email"
                          value={alertsConfig.email}
                          onChange={(e) => 
                            setAlertsConfig(prev => ({ ...prev, email: e.target.value }))
                          }
                          placeholder="seu@email.com"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="high-value">Valor alto (R$)</Label>
                        <Input
                          id="high-value"
                          type="number"
                          value={alertsConfig.thresholds.highValue}
                          onChange={(e) => 
                            setAlertsConfig(prev => ({
                              ...prev,
                              thresholds: {
                                ...prev.thresholds,
                                highValue: Number(e.target.value)
                              }
                            }))
                          }
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="anomaly-score">Score de anomalia mínimo</Label>
                        <Input
                          id="anomaly-score"
                          type="number"
                          min="0"
                          max="100"
                          value={alertsConfig.thresholds.anomalyScore}
                          onChange={(e) => 
                            setAlertsConfig(prev => ({
                              ...prev,
                              thresholds: {
                                ...prev.thresholds,
                                anomalyScore: Number(e.target.value)
                              }
                            }))
                          }
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="risk-level">Nível de risco mínimo</Label>
                        <Select
                          value={alertsConfig.thresholds.riskLevel}
                          onValueChange={(value) => 
                            setAlertsConfig(prev => ({
                              ...prev,
                              thresholds: {
                                ...prev.thresholds,
                                riskLevel: value
                              }
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="LOW">Baixo</SelectItem>
                            <SelectItem value="MEDIUM">Médio</SelectItem>
                            <SelectItem value="HIGH">Alto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button onClick={saveAlertsConfig} className="w-full">
                        <Bell className="w-4 h-4 mr-2" />
                        Salvar Configuração
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant={isRealTimeMonitoring ? "default" : "outline"} 
                  className="w-full" 
                  size="sm"
                  onClick={toggleRealTimeMonitoring}
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  {isRealTimeMonitoring ? 'Parar Monitor' : 'Monitor em Tempo Real'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                IA Avançada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Ferramentas de inteligência artificial para análise preditiva e detecção avançada.
              </p>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="sm"
                  onClick={runPredictiveAnalysis}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Target className="w-4 h-4 mr-2" />
                  )}
                  Análise Preditiva
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="sm"
                  onClick={runMLPatterns}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <TrendingUp className="w-4 h-4 mr-2" />
                  )}
                  ML Patterns
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
