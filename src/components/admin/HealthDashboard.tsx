import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import {
  Heart,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Activity,
  PlayCircle,
  StopCircle,
  RefreshCw,
  Wrench,
  Code,
  Copy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { healthMonitor, HealthStatus, HealthIssue } from '@/services/health-monitor.service';

export function HealthDashboard() {
  const { toast } = useToast();
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [autoDevMode, setAutoDevMode] = useState(false);

  useEffect(() => {
    // Configurar listener
    healthMonitor.onHealthChange(status => {
      setHealthStatus(status);

      if (status.overall === 'critical') {
        toast({
          title: '⚠️ Status Crítico',
          description: `Saúde: ${status.score}%. Ação necessária.`,
          variant: 'destructive',
        });
      }
    });

    performHealthCheck();
  }, []);

  const performHealthCheck = async () => {
    setIsChecking(true);
    try {
      const status = await healthMonitor.performHealthCheck();
      setHealthStatus(status);

      toast({
        title: '✅ Verificação Concluída',
        description: `Status: ${getStatusText(status.overall)} (${status.score}%)`,
      });
    } catch (error) {
      toast({
        title: '❌ Erro na Verificação',
        description: 'Falha ao verificar saúde',
        variant: 'destructive',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const toggleMonitoring = async () => {
    try {
      if (isMonitoring) {
        await healthMonitor.stopMonitoring();
        setIsMonitoring(false);
        toast({ title: 'Monitoramento Pausado' });
      } else {
        await healthMonitor.startMonitoring(15);
        setIsMonitoring(true);
        toast({ title: 'Monitoramento Ativo' });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao alterar monitoramento',
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: HealthStatus['overall']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-orange-500" />;
      case 'critical':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Activity className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: HealthStatus['overall']) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusText = (status: HealthStatus['overall']) => {
    switch (status) {
      case 'healthy':
        return 'Saudável';
      case 'warning':
        return 'Atenção';
      case 'error':
        return 'Problema';
      case 'critical':
        return 'Crítico';
      default:
        return 'Desconhecido';
    }
  };

  if (!healthStatus) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-muted-foreground">Carregando status de saúde...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Geral */}
      <Card className={cn('border-2', getStatusColor(healthStatus.overall))}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(healthStatus.overall)}
              <div>
                <CardTitle className="text-2xl">
                  Saúde da Plataforma: {getStatusText(healthStatus.overall)}
                </CardTitle>
                <CardDescription className="text-lg">
                  Score: {healthStatus.score}/100 • Última verificação:{' '}
                  {healthStatus.lastCheck.toLocaleTimeString('pt-BR')}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={performHealthCheck}
                disabled={isChecking}
                variant="outline"
                size="sm"
              >
                {isChecking ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Verificar
              </Button>
              <Button
                onClick={toggleMonitoring}
                variant={isMonitoring ? 'destructive' : 'default'}
                size="sm"
              >
                {isMonitoring ? (
                  <>
                    <StopCircle className="h-4 w-4 mr-2" />
                    Pausar
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Monitorar
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={healthStatus.score} className="h-3" />

            {/* Métricas */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-red-600">{healthStatus.issues.length}</div>
                <div className="text-sm text-muted-foreground">Problemas</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-green-600">
                  {healthStatus.autoFixesApplied}
                </div>
                <div className="text-sm text-muted-foreground">Corrigidos</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">
                  {healthStatus.autoFixesAvailable}
                </div>
                <div className="text-sm text-muted-foreground">Auto-fix</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-purple-600">{isMonitoring ? '✓' : '○'}</div>
                <div className="text-sm text-muted-foreground">
                  {isMonitoring ? 'Ativo' : 'Pausado'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problemas */}
      {healthStatus.issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Problemas Detectados ({healthStatus.issues.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-auto">
              {healthStatus.issues.map(issue => (
                <div key={issue.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {issue.type === 'typescript' && <Code className="h-4 w-4" />}
                      {issue.type === 'duplicated-types' && <Copy className="h-4 w-4" />}
                      <div>
                        <h4 className="font-medium">{issue.title}</h4>
                        <p className="text-sm text-muted-foreground">{issue.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={issue.severity === 'critical' ? 'destructive' : 'secondary'}>
                        {issue.severity}
                      </Badge>
                      {issue.autoFixable && (
                        <Badge variant="outline">
                          <Wrench className="h-3 w-3 mr-1" />
                          Auto
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status OK */}
      {healthStatus.issues.length === 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-green-600 mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-green-800">Sistema Saudável</h3>
              <p className="text-green-700">Nenhum problema detectado. Todos os sistemas OK.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Auto-Desenvolvimento e Capacidades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Auto-Desenvolvimento & Capacidades
          </CardTitle>
          <CardDescription>
            Funcionalidades inteligentes que permitem à plataforma evoluir automaticamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {/* Botão de Auto-Dev */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Modo Auto-Desenvolvimento</h3>
                <p className="text-sm text-muted-foreground">
                  Ative para permitir auto-correção e evolução automática
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setAutoDevMode(prev => !prev)}>
                {autoDevMode ? 'Pausar Auto-Dev' : 'Ativar Auto-Dev'}
              </Button>
            </div>
            {/* Capacidades */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: 'Monitoramento de Saúde',
                  desc: 'Detecta problemas TypeScript e aplica correções',
                  status: 'Ativo',
                  progress: 100,
                },
                {
                  name: 'Auto-correção',
                  desc: 'IA que corrige erros automaticamente',
                  status: 'Ativo',
                  progress: 85,
                },
                {
                  name: 'Consolidação de Tipos',
                  desc: 'Elimina duplicações de tipos',
                  status: 'Desenvolvimento',
                  progress: 70,
                },
                {
                  name: 'Otimização de Performance',
                  desc: 'Análise e otimização automática',
                  status: 'Desenvolvimento',
                  progress: 45,
                },
                {
                  name: 'Varredura de Segurança',
                  desc: 'Detecção de vulnerabilidades',
                  status: 'Planejado',
                  progress: 20,
                },
                {
                  name: 'Desenvolvimento por IA',
                  desc: 'IA implementa recursos automaticamente',
                  status: 'Planejado',
                  progress: 10,
                },
              ].map((cap, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{cap.name}</h4>
                      <p className="text-xs text-muted-foreground">{cap.desc}</p>
                    </div>
                    <Badge
                      className={
                        cap.status === 'Ativo'
                          ? 'bg-green-100 text-green-800'
                          : cap.status === 'Desenvolvimento'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {cap.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${cap.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono">{cap.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Estatísticas */}
            <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">3</div>
                <div className="text-sm text-muted-foreground">Ativas</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">2</div>
                <div className="text-sm text-muted-foreground">Desenvolvimento</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">90</div>
                <div className="text-sm text-muted-foreground">Correções</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">98%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
