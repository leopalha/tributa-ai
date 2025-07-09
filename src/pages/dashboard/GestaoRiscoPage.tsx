import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  AlertTriangle,
  Shield,
  TrendingUp,
  TrendingDown,
  Eye,
  Bell,
  FileText,
  Users,
  Activity,
  DollarSign,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  RefreshCw,
  Download,
  Settings,
  Filter,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface RiskMetric {
  id: string;
  name: string;
  value: number;
  status: 'low' | 'medium' | 'high' | 'critical';
  trend: 'up' | 'down' | 'stable';
  description: string;
  lastUpdate: Date;
}

interface ComplianceItem {
  id: string;
  category: string;
  requirement: string;
  status: 'compliant' | 'non-compliant' | 'pending' | 'review';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  responsible: string;
  documents: string[];
}

interface RiskAlert {
  id: string;
  type: 'financial' | 'operational' | 'compliance' | 'market';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  status: 'active' | 'acknowledged' | 'resolved';
  affectedArea: string;
}

interface GovernanceRule {
  id: string;
  name: string;
  category: 'authorization' | 'validation' | 'reporting' | 'monitoring';
  description: string;
  isActive: boolean;
  lastTriggered: Date;
  triggers: number;
  effectiveness: number;
}

export default function GestaoRiscoPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetric[]>([]);
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const [governanceRules, setGovernanceRules] = useState<GovernanceRule[]>([]);

  useEffect(() => {
    loadRiskData();
  }, []);

  const loadRiskData = async () => {
    setLoading(true);
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data
      const mockRiskMetrics: RiskMetric[] = [
        {
          id: '1',
          name: 'Risco de Crédito',
          value: 7.2,
          status: 'medium',
          trend: 'down',
          description: 'Análise de inadimplência e exposição ao risco de crédito',
          lastUpdate: new Date(),
        },
        {
          id: '2',
          name: 'Risco Operacional',
          value: 4.8,
          status: 'low',
          trend: 'stable',
          description: 'Avaliação de processos internos e falhas operacionais',
          lastUpdate: new Date(),
        },
        {
          id: '3',
          name: 'Risco de Mercado',
          value: 8.5,
          status: 'high',
          trend: 'up',
          description: 'Exposição a volatilidade de preços e taxas',
          lastUpdate: new Date(),
        },
        {
          id: '4',
          name: 'Risco de Liquidez',
          value: 6.1,
          status: 'medium',
          trend: 'stable',
          description: 'Capacidade de honrar compromissos de curto prazo',
          lastUpdate: new Date(),
        },
      ];

      const mockComplianceItems: ComplianceItem[] = [
        {
          id: '1',
          category: 'LGPD',
          requirement: 'Relatório de Impacto à Proteção de Dados',
          status: 'compliant',
          priority: 'high',
          dueDate: new Date('2024-12-31'),
          responsible: 'João Silva',
          documents: ['relatorio-lgpd-2024.pdf'],
        },
        {
          id: '2',
          category: 'SOX',
          requirement: 'Controles Internos sobre Relatórios Financeiros',
          status: 'pending',
          priority: 'high',
          dueDate: new Date('2024-11-15'),
          responsible: 'Maria Santos',
          documents: ['controles-sox-q3.pdf'],
        },
        {
          id: '3',
          category: 'Basel III',
          requirement: 'Cálculo de Capital Regulatório',
          status: 'compliant',
          priority: 'medium',
          dueDate: new Date('2024-10-30'),
          responsible: 'Carlos Oliveira',
          documents: ['basel-capital-calc.xlsx'],
        },
      ];

      const mockRiskAlerts: RiskAlert[] = [
        {
          id: '1',
          type: 'financial',
          severity: 'high',
          title: 'Concentração de Risco de Crédito',
          description: 'Exposição excessiva a um único setor econômico detectada',
          timestamp: new Date(),
          status: 'active',
          affectedArea: 'Carteira de Crédito',
        },
        {
          id: '2',
          type: 'operational',
          severity: 'medium',
          title: 'Falha no Sistema de Backup',
          description: 'Sistema de backup apresentou falhas nas últimas 24 horas',
          timestamp: new Date(),
          status: 'acknowledged',
          affectedArea: 'Infraestrutura TI',
        },
      ];

      const mockGovernanceRules: GovernanceRule[] = [
        {
          id: '1',
          name: 'Aprovação de Crédito > R$ 1M',
          category: 'authorization',
          description: 'Operações de crédito acima de R$ 1 milhão requerem aprovação do comitê',
          isActive: true,
          lastTriggered: new Date(),
          triggers: 15,
          effectiveness: 94.2,
        },
        {
          id: '2',
          name: 'Validação de Documentos KYC',
          category: 'validation',
          description: 'Validação automática de documentos de Know Your Customer',
          isActive: true,
          lastTriggered: new Date(),
          triggers: 128,
          effectiveness: 97.8,
        },
      ];

      setRiskMetrics(mockRiskMetrics);
      setComplianceItems(mockComplianceItems);
      setRiskAlerts(mockRiskAlerts);
      setGovernanceRules(mockGovernanceRules);
    } catch (error) {
      console.error('Erro ao carregar dados de risco:', error);
      toast.error('Falha ao carregar dados de gestão de risco');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low':
      case 'compliant':
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'medium':
      case 'pending':
      case 'acknowledged':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
      case 'non-compliant':
      case 'active':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'high':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'medium':
        return <Bell className="w-4 h-4 text-yellow-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Carregando análise de risco...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-red-600" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Risco</h1>
            <p className="text-muted-foreground">
              Monitoramento, compliance e governança corporativa
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={loadRiskData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Relatório
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      {/* Alertas Críticos */}
      {riskAlerts.filter(alert => alert.severity === 'critical' || alert.severity === 'high')
        .length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Atenção:</strong>{' '}
            {
              riskAlerts.filter(alert => alert.severity === 'critical' || alert.severity === 'high')
                .length
            }{' '}
            alertas de risco crítico/alto requerem ação imediata.
          </AlertDescription>
        </Alert>
      )}

      {/* Métricas Cards - Estilo padronizado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alertas Críticos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-800">
              {riskAlerts.filter(alert => alert.severity === 'critical').length}
            </p>
            <p className="text-xs text-red-600 mt-1">Requerem ação imediata</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Monitoramento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-800">24/7</p>
            <p className="text-xs text-orange-600 mt-1">Sistemas ativos</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-800">
              {Math.round(
                (complianceItems.filter(item => item.status === 'compliant').length /
                  complianceItems.length) *
                  100
              )}
              %
            </p>
            <p className="text-xs text-blue-600 mt-1">Taxa de conformidade</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Governança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-800">
              {governanceRules.filter(rule => rule.isActive).length}
            </p>
            <p className="text-xs text-green-600 mt-1">Regras ativas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Score de Risco
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-800">7.2</p>
            <p className="text-xs text-purple-600 mt-1">
              <TrendingDown className="inline w-3 h-3 mr-1" />
              Melhorou 0.3 pontos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-cyan-50 to-cyan-100 border-cyan-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-cyan-700 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Efetividade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-cyan-800">94.8%</p>
            <p className="text-xs text-cyan-600 mt-1">Controles internos</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Gestão de Risco */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b bg-muted/30">
              <TabsList className="h-auto p-0 bg-transparent w-full justify-start">
                <TabsTrigger value="overview" className="flex items-center gap-2 px-6 py-4">
                  <BarChart3 className="w-4 h-4" />
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger value="metrics" className="flex items-center gap-2 px-6 py-4">
                  <Activity className="w-4 h-4" />
                  Métricas de Risco
                </TabsTrigger>
                <TabsTrigger value="compliance" className="flex items-center gap-2 px-6 py-4">
                  <FileText className="w-4 h-4" />
                  Compliance
                </TabsTrigger>
                <TabsTrigger value="alerts" className="flex items-center gap-2 px-6 py-4">
                  <Bell className="w-4 h-4" />
                  Alertas
                </TabsTrigger>
                <TabsTrigger value="governance" className="flex items-center gap-2 px-6 py-4">
                  <Shield className="w-4 h-4" />
                  Governança
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="overview" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Resumo de Risco */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        Resumo de Risco
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {riskMetrics.map(metric => (
                        <div
                          key={metric.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {getTrendIcon(metric.trend)}
                              <span className="font-medium">{metric.name}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">{metric.value}%</span>
                            <Badge className={getStatusColor(metric.status)}>
                              {metric.status === 'low'
                                ? 'Baixo'
                                : metric.status === 'medium'
                                  ? 'Médio'
                                  : metric.status === 'high'
                                    ? 'Alto'
                                    : 'Crítico'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Status de Compliance */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-green-600" />
                        Status de Compliance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Conformidade Geral</span>
                          <span className="text-lg font-bold text-green-600">
                            {Math.round(
                              (complianceItems.filter(item => item.status === 'compliant').length /
                                complianceItems.length) *
                                100
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={Math.round(
                            (complianceItems.filter(item => item.status === 'compliant').length /
                              complianceItems.length) *
                              100
                          )}
                          className="h-2"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Conforme</span>
                          <span className="font-medium text-green-600">
                            {complianceItems.filter(item => item.status === 'compliant').length}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Pendente</span>
                          <span className="font-medium text-yellow-600">
                            {complianceItems.filter(item => item.status === 'pending').length}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Em Revisão</span>
                          <span className="font-medium text-blue-600">
                            {complianceItems.filter(item => item.status === 'review').length}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Alertas Recentes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-orange-600" />
                      Alertas Recentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {riskAlerts.slice(0, 5).map(alert => (
                        <div
                          key={alert.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {getSeverityIcon(alert.severity)}
                            <div>
                              <p className="font-medium">{alert.title}</p>
                              <p className="text-sm text-gray-600">{alert.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(alert.status)}>
                              {alert.status === 'active'
                                ? 'Ativo'
                                : alert.status === 'acknowledged'
                                  ? 'Reconhecido'
                                  : 'Resolvido'}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {alert.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="metrics" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {riskMetrics.map(metric => (
                    <Card key={metric.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{metric.name}</span>
                          <Badge className={getStatusColor(metric.status)}>
                            {metric.status === 'low'
                              ? 'Baixo'
                              : metric.status === 'medium'
                                ? 'Médio'
                                : metric.status === 'high'
                                  ? 'Alto'
                                  : 'Crítico'}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{metric.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-3xl font-bold">{metric.value}%</span>
                            {getTrendIcon(metric.trend)}
                          </div>
                          <Progress value={metric.value} className="h-3" />
                          <div className="text-xs text-gray-500">
                            Última atualização: {metric.lastUpdate.toLocaleString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="compliance" className="mt-0 space-y-6">
                <div className="space-y-4">
                  {complianceItems.map(item => (
                    <Card key={item.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{item.requirement}</CardTitle>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status === 'compliant'
                              ? 'Conforme'
                              : item.status === 'pending'
                                ? 'Pendente'
                                : item.status === 'review'
                                  ? 'Em Revisão'
                                  : 'Não Conforme'}
                          </Badge>
                        </div>
                        <CardDescription>
                          Categoria: {item.category} | Responsável: {item.responsible}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Prioridade</p>
                            <Badge
                              className={
                                item.priority === 'high'
                                  ? 'bg-red-100 text-red-800'
                                  : item.priority === 'medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                              }
                            >
                              {item.priority === 'high'
                                ? 'Alta'
                                : item.priority === 'medium'
                                  ? 'Média'
                                  : 'Baixa'}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Prazo</p>
                            <p className="text-sm">{item.dueDate.toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Documentos</p>
                            <p className="text-sm">{item.documents.length} anexos</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="alerts" className="mt-0 space-y-6">
                <div className="space-y-4">
                  {riskAlerts.map(alert => (
                    <Card key={alert.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            {getSeverityIcon(alert.severity)}
                            {alert.title}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(alert.status)}>
                              {alert.status === 'active'
                                ? 'Ativo'
                                : alert.status === 'acknowledged'
                                  ? 'Reconhecido'
                                  : 'Resolvido'}
                            </Badge>
                            <Badge variant="outline">
                              {alert.type === 'financial'
                                ? 'Financeiro'
                                : alert.type === 'operational'
                                  ? 'Operacional'
                                  : alert.type === 'compliance'
                                    ? 'Compliance'
                                    : 'Mercado'}
                            </Badge>
                          </div>
                        </div>
                        <CardDescription>{alert.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Área Afetada</p>
                              <p className="text-sm">{alert.affectedArea}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Timestamp</p>
                              <p className="text-sm">{alert.timestamp.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {alert.status === 'active' && (
                              <Button size="sm" variant="outline">
                                Reconhecer
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              Detalhes
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="governance" className="mt-0 space-y-6">
                <div className="space-y-4">
                  {governanceRules.map(rule => (
                    <Card key={rule.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{rule.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                rule.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }
                            >
                              {rule.isActive ? 'Ativa' : 'Inativa'}
                            </Badge>
                            <Badge variant="outline">
                              {rule.category === 'authorization'
                                ? 'Autorização'
                                : rule.category === 'validation'
                                  ? 'Validação'
                                  : rule.category === 'reporting'
                                    ? 'Relatório'
                                    : 'Monitoramento'}
                            </Badge>
                          </div>
                        </div>
                        <CardDescription>{rule.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Efetividade</p>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-green-600">
                                {rule.effectiveness}%
                              </span>
                              <Progress value={rule.effectiveness} className="h-2 flex-1" />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Triggers</p>
                            <p className="text-lg font-bold">{rule.triggers}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Último Trigger</p>
                            <p className="text-sm">{rule.lastTriggered.toLocaleString()}</p>
                          </div>
                          <div>
                            <Button size="sm" variant="outline">
                              Configurar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Footer com estatísticas rápidas */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              🛡️ {governanceRules.filter(rule => rule.isActive).length} regras de governança ativas
            </span>
            <span>📊 Score de risco: 7.2/10</span>
            <span>
              ✅{' '}
              {Math.round(
                (complianceItems.filter(item => item.status === 'compliant').length /
                  complianceItems.length) *
                  100
              )}
              % compliance
            </span>
            <span>
              🔔 {riskAlerts.filter(alert => alert.status === 'active').length} alertas ativos
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
