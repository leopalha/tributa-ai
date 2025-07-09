import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  RefreshCw,
  Settings,
  FileText,
  BarChart3,
  Target,
  Zap,
  Activity,
  Calendar,
  Users,
  Database,
} from 'lucide-react';
import { format, subDays, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  category: 'Fiscal' | 'Contabil' | 'Trabalhista' | 'Ambiental' | 'Regulatoria';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Inactive' | 'Deprecated';
  lastUpdated: Date;
  applicableTo: string[];
  automatedCheck: boolean;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';
}

interface ComplianceCheck {
  id: string;
  ruleId: string;
  ruleName: string;
  status: 'Passed' | 'Failed' | 'Warning' | 'Pending' | 'NotApplicable';
  executedAt: Date;
  nextCheck: Date;
  score: number;
  findings: ComplianceFinding[];
  recommendations: string[];
  impact: 'High' | 'Medium' | 'Low';
  effort: 'High' | 'Medium' | 'Low';
}

interface ComplianceFinding {
  id: string;
  type: 'Error' | 'Warning' | 'Info';
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  category: string;
  affectedEntities: string[];
  remediation: string;
  dueDate?: Date;
  assignedTo?: string;
  status: 'Open' | 'InProgress' | 'Resolved' | 'Dismissed';
}

interface ComplianceMetrics {
  overallScore: number;
  totalRules: number;
  passedChecks: number;
  failedChecks: number;
  warningChecks: number;
  criticalFindings: number;
  highFindings: number;
  mediumFindings: number;
  lowFindings: number;
  complianceRate: number;
  trendDirection: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

interface ComplianceAuditProps {
  companyId: string;
}

export function ComplianceAudit({ companyId }: ComplianceAuditProps) {
  const [metrics, setMetrics] = useState<ComplianceMetrics>({
    overallScore: 87.5,
    totalRules: 156,
    passedChecks: 142,
    failedChecks: 8,
    warningChecks: 6,
    criticalFindings: 2,
    highFindings: 6,
    mediumFindings: 12,
    lowFindings: 18,
    complianceRate: 91.0,
    trendDirection: 'up',
    trendPercentage: 3.2,
  });

  const [checks, setChecks] = useState<ComplianceCheck[]>([
    {
      id: '1',
      ruleId: 'FISCAL_001',
      ruleName: 'Entrega de DCTF no Prazo',
      status: 'Failed',
      executedAt: new Date(),
      nextCheck: new Date(Date.now() + 24 * 60 * 60 * 1000),
      score: 0,
      findings: [
        {
          id: 'f1',
          type: 'Error',
          title: 'DCTF em Atraso',
          description: 'DCTF do período 03/2024 não foi entregue no prazo',
          severity: 'Critical',
          category: 'Prazo',
          affectedEntities: ['DCTF_032024'],
          remediation: 'Entregar DCTF com multa por atraso',
          dueDate: new Date(),
          status: 'Open',
        },
      ],
      recommendations: [
        'Implementar alertas automáticos 15 dias antes do vencimento',
        'Configurar backup de responsável para entregas',
      ],
      impact: 'High',
      effort: 'Low',
    },
    {
      id: '2',
      ruleId: 'FISCAL_002',
      ruleName: 'Validação de NFe',
      status: 'Warning',
      executedAt: new Date(),
      nextCheck: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      score: 75,
      findings: [
        {
          id: 'f2',
          type: 'Warning',
          title: 'NFe com Inconsistências',
          description: '3 NFe com divergências menores identificadas',
          severity: 'Medium',
          category: 'Validação',
          affectedEntities: ['NFe_001', 'NFe_002', 'NFe_003'],
          remediation: 'Revisar e corrigir dados das NFe',
          status: 'InProgress',
        },
      ],
      recommendations: [
        'Implementar validação automática antes da emissão',
        'Treinamento da equipe sobre preenchimento correto',
      ],
      impact: 'Medium',
      effort: 'Medium',
    },
    {
      id: '3',
      ruleId: 'FISCAL_003',
      ruleName: 'Conformidade ICMS',
      status: 'Passed',
      executedAt: new Date(),
      nextCheck: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      score: 100,
      findings: [],
      recommendations: [],
      impact: 'Low',
      effort: 'Low',
    },
  ]);

  const [rules, setRules] = useState<ComplianceRule[]>([
    {
      id: 'FISCAL_001',
      name: 'Entrega de DCTF no Prazo',
      description: 'Verificar se todas as DCTF foram entregues dentro do prazo legal',
      category: 'Fiscal',
      severity: 'Critical',
      status: 'Active',
      lastUpdated: new Date(),
      applicableTo: ['Todas as empresas'],
      automatedCheck: true,
      frequency: 'Daily',
    },
    {
      id: 'FISCAL_002',
      name: 'Validação de NFe',
      description: 'Validar estrutura e conteúdo das Notas Fiscais Eletrônicas',
      category: 'Fiscal',
      severity: 'High',
      status: 'Active',
      lastUpdated: new Date(),
      applicableTo: ['Empresas com NFe'],
      automatedCheck: true,
      frequency: 'Weekly',
    },
  ]);

  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);

  const runFullAudit = async () => {
    setIsRunningAudit(true);
    setAuditProgress(0);

    // Simular execução de auditoria
    for (let i = 0; i <= 100; i += 10) {
      setAuditProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setIsRunningAudit(false);
    setAuditProgress(0);
  };

  const getStatusIcon = (status: ComplianceCheck['status']) => {
    switch (status) {
      case 'Passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'Warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'Pending':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: ComplianceCheck['status']) => {
    const variants = {
      Passed: 'default',
      Failed: 'destructive',
      Warning: 'secondary',
      Pending: 'outline',
      NotApplicable: 'secondary',
    } as const;

    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'text-red-600';
      case 'High':
        return 'text-orange-600';
      case 'Medium':
        return 'text-yellow-600';
      default:
        return 'text-blue-600';
    }
  };

  const formatScore = (score: number) => {
    if (score >= 90) return { color: 'text-green-600', label: 'Excelente' };
    if (score >= 80) return { color: 'text-blue-600', label: 'Bom' };
    if (score >= 70) return { color: 'text-yellow-600', label: 'Regular' };
    return { color: 'text-red-600', label: 'Crítico' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Auditoria de Compliance
          </h2>
          <p className="text-muted-foreground">
            Monitoramento contínuo de conformidade fiscal e regulatória
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Relatório
          </Button>
          <Button onClick={runFullAudit} disabled={isRunningAudit}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRunningAudit ? 'animate-spin' : ''}`} />
            {isRunningAudit ? 'Executando...' : 'Executar Auditoria'}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      {isRunningAudit && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Executando auditoria completa...</span>
                <span>{auditProgress}%</span>
              </div>
              <Progress value={auditProgress} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score Geral</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${formatScore(metrics.overallScore).color}`}>
              {metrics.overallScore.toFixed(1)}%
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {metrics.trendDirection === 'up' ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              {metrics.trendDirection === 'up' ? '+' : '-'}
              {metrics.trendPercentage}% este mês
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conformidade</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metrics.complianceRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.passedChecks} de {metrics.totalRules} regras
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achados Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.criticalFindings}</div>
            <p className="text-xs text-muted-foreground">Requerem ação imediata</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verificações Ativas</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalRules}</div>
            <p className="text-xs text-muted-foreground">Regras monitoradas</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="checks" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Verificações
          </TabsTrigger>
          <TabsTrigger value="findings" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Achados
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Regras
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Status</CardTitle>
                <CardDescription>Status das verificações de compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Aprovadas
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {metrics.passedChecks} (
                        {((metrics.passedChecks / metrics.totalRules) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <Progress
                      value={(metrics.passedChecks / metrics.totalRules) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Reprovadas
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {metrics.failedChecks} (
                        {((metrics.failedChecks / metrics.totalRules) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <Progress
                      value={(metrics.failedChecks / metrics.totalRules) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        Avisos
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {metrics.warningChecks} (
                        {((metrics.warningChecks / metrics.totalRules) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <Progress
                      value={(metrics.warningChecks / metrics.totalRules) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Severity Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Severidade</CardTitle>
                <CardDescription>Achados categorizados por severidade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-red-600">Críticos</span>
                    <Badge variant="destructive">{metrics.criticalFindings}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-orange-600">Altos</span>
                    <Badge variant="secondary">{metrics.highFindings}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-yellow-600">Médios</span>
                    <Badge variant="outline">{metrics.mediumFindings}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-600">Baixos</span>
                    <Badge variant="outline">{metrics.lowFindings}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Alertas Recentes</CardTitle>
              <CardDescription>Problemas de compliance identificados recentemente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {checks
                  .filter(check => check.status === 'Failed' || check.status === 'Warning')
                  .map(check => (
                    <Alert
                      key={check.id}
                      className={check.status === 'Failed' ? 'border-red-200' : 'border-yellow-200'}
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="flex items-center justify-between">
                        <span>{check.ruleName}</span>
                        {getStatusBadge(check.status)}
                      </AlertTitle>
                      <AlertDescription>
                        {check.findings.length > 0 && (
                          <div className="mt-2">
                            <p className="font-medium">{check.findings[0].title}</p>
                            <p className="text-sm text-muted-foreground">
                              {check.findings[0].description}
                            </p>
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Verificações de Compliance</CardTitle>
              <CardDescription>Status das verificações automáticas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {checks.map(check => (
                  <div
                    key={check.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(check.status)}
                      <div>
                        <h4 className="font-medium">{check.ruleName}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Score: {check.score}%</span>
                          <span>
                            Última execução:{' '}
                            {format(check.executedAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </span>
                          <span>
                            Próxima: {format(check.nextCheck, 'dd/MM/yyyy', { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(check.status)}
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="findings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Achados de Auditoria</CardTitle>
              <CardDescription>Problemas identificados nas verificações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {checks
                  .flatMap(check => check.findings)
                  .map(finding => (
                    <div key={finding.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            {finding.type === 'Error' && (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            {finding.type === 'Warning' && (
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            )}
                            {finding.type === 'Info' && (
                              <CheckCircle className="h-4 w-4 text-blue-500" />
                            )}
                            {finding.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {finding.description}
                          </p>
                        </div>
                        <Badge
                          variant={finding.severity === 'Critical' ? 'destructive' : 'secondary'}
                        >
                          {finding.severity}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Categoria:</span> {finding.category}
                        </div>
                        <div>
                          <span className="font-medium">Entidades Afetadas:</span>{' '}
                          {finding.affectedEntities.join(', ')}
                        </div>
                        <div>
                          <span className="font-medium">Remediação:</span> {finding.remediation}
                        </div>
                        {finding.dueDate && (
                          <div>
                            <span className="font-medium">Prazo:</span>{' '}
                            {format(finding.dueDate, 'dd/MM/yyyy', { locale: ptBR })}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <Badge variant="outline">{finding.status}</Badge>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Atribuir
                          </Button>
                          <Button variant="outline" size="sm">
                            Resolver
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regras de Compliance</CardTitle>
              <CardDescription>Regras configuradas para verificação automática</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rules.map(rule => (
                  <div key={rule.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{rule.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{rule.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={rule.severity === 'Critical' ? 'destructive' : 'secondary'}>
                          {rule.severity}
                        </Badge>
                        <Badge variant={rule.status === 'Active' ? 'default' : 'secondary'}>
                          {rule.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Categoria:</span>
                        <p className="text-muted-foreground">{rule.category}</p>
                      </div>
                      <div>
                        <span className="font-medium">Frequência:</span>
                        <p className="text-muted-foreground">{rule.frequency}</p>
                      </div>
                      <div>
                        <span className="font-medium">Automático:</span>
                        <p className="text-muted-foreground">
                          {rule.automatedCheck ? 'Sim' : 'Não'}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Atualizada:</span>
                        <p className="text-muted-foreground">
                          {format(rule.lastUpdated, 'dd/MM/yyyy', { locale: ptBR })}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configurar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Zap className="h-4 w-4 mr-2" />
                        Executar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
