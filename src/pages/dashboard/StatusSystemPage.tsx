import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Server,
  Database,
  Globe,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Cpu,
  HardDrive,
  Wifi,
  Zap,
  Eye,
  Bell,
  Settings,
  BarChart3,
  Users,
  FileText,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';

interface SystemMetric {
  name: string;
  value: number;
  status: 'normal' | 'warning' | 'critical';
  unit: string;
  description: string;
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  uptime: number;
  responseTime: number;
  lastCheck: Date;
  version: string;
}

export default function StatusSystemPage() {
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    {
      name: 'CPU Usage',
      value: 45,
      status: 'normal',
      unit: '%',
      description: 'Processamento do servidor',
    },
    {
      name: 'Memory Usage',
      value: 68,
      status: 'warning',
      unit: '%',
      description: 'Uso de memória RAM',
    },
    {
      name: 'Disk Usage',
      value: 23,
      status: 'normal',
      unit: '%',
      description: 'Espaço em disco utilizado',
    },
    {
      name: 'Network I/O',
      value: 156,
      status: 'normal',
      unit: 'MB/s',
      description: 'Tráfego de rede',
    },
  ]);

  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'API Principal',
      status: 'online',
      uptime: 99.9,
      responseTime: 120,
      lastCheck: new Date(),
      version: '2.1.0',
    },
    {
      name: 'Banco de Dados',
      status: 'online',
      uptime: 99.8,
      responseTime: 45,
      lastCheck: new Date(),
      version: 'PostgreSQL 15.2',
    },
    {
      name: 'Sistema de Arquivos',
      status: 'online',
      uptime: 99.9,
      responseTime: 80,
      lastCheck: new Date(),
      version: 'S3 Compatible',
    },
    {
      name: 'Blockchain Node',
      status: 'online',
      uptime: 98.5,
      responseTime: 230,
      lastCheck: new Date(),
      version: 'v1.5.2',
    },
    {
      name: 'Trading Engine',
      status: 'online',
      uptime: 99.7,
      responseTime: 95,
      lastCheck: new Date(),
      version: '3.0.1',
    },
    {
      name: 'KYC Service',
      status: 'maintenance',
      uptime: 97.2,
      responseTime: 0,
      lastCheck: new Date(),
      version: '1.8.3',
    },
    {
      name: 'Notification Service',
      status: 'online',
      uptime: 99.1,
      responseTime: 150,
      lastCheck: new Date(),
      version: '2.2.1',
    },
    {
      name: 'API Externa - RFB',
      status: 'online',
      uptime: 95.8,
      responseTime: 450,
      lastCheck: new Date(),
      version: 'v3.1',
    },
  ]);

  const refreshData = async () => {
    setLoading(true);
    toast.info('Atualizando status do sistema...');

    try {
      // Simular atualização dos dados
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Atualizar métricas com valores aleatórios
      setMetrics(prev =>
        prev.map(metric => ({
          ...metric,
          value:
            metric.unit === '%'
              ? Math.floor(Math.random() * 100)
              : Math.floor(Math.random() * 500 + 50),
          status:
            Math.random() > 0.8 ? 'warning' : Math.random() > 0.95 ? 'critical' : 'normal',
        }))
      );

      // Atualizar status dos serviços
      setServices(prev =>
        prev.map(service => ({
          ...service,
          uptime: Math.random() * 5 + 95,
          responseTime: Math.floor(Math.random() * 300 + 50),
          lastCheck: new Date(),
          status:
            service.name === 'KYC Service'
              ? 'maintenance'
              : Math.random() > 0.9
                ? 'offline'
                : 'online',
        }))
      );

      setLastUpdate(new Date());
      toast.success('✅ Status do sistema atualizado!');
    } catch (error) {
      toast.error('❌ Erro ao atualizar status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
      case 'offline':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'normal':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical':
      case 'offline':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'maintenance':
        return <Settings className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const overallStatus = services.every(s => s.status === 'online')
    ? 'online'
    : services.some(s => s.status === 'offline')
      ? 'degraded'
      : 'maintenance';

  const averageUptime = services.reduce((sum, s) => sum + s.uptime, 0) / services.length;
  const averageResponseTime =
    services
      .filter(s => s.status === 'online')
      .reduce((sum, s) => sum + s.responseTime, 0) /
    services.filter(s => s.status === 'online').length;

  useEffect(() => {
    // Auto-refresh a cada 30 segundos
    const interval = setInterval(() => {
      if (!loading) {
        refreshData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Status do Sistema</h1>
          <p className="text-muted-foreground">
            Monitoramento em tempo real da infraestrutura Tributa.AI
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
          </div>
          <Button onClick={refreshData} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Status Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(overallStatus)}
            Status Geral da Plataforma
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{overallStatus === 'online' ? '✅' : '⚠️'}</div>
              <div className="text-sm font-medium">Sistema</div>
              <Badge className={getStatusColor(overallStatus)}>
                {overallStatus === 'online'
                  ? 'Operacional'
                  : overallStatus === 'degraded'
                    ? 'Degradado'
                    : 'Manutenção'}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{averageUptime.toFixed(1)}%</div>
              <div className="text-sm font-medium">Uptime Médio</div>
              <div className="text-xs text-muted-foreground">Últimas 24h</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(averageResponseTime)}ms</div>
              <div className="text-sm font-medium">Latência Média</div>
              <div className="text-xs text-muted-foreground">Tempo de resposta</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {services.filter(s => s.status === 'online').length}
              </div>
              <div className="text-sm font-medium">Serviços Ativos</div>
              <div className="text-xs text-muted-foreground">de {services.length} total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="incidents">Incidentes</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <div className="grid gap-4">
            {services.map((service, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <div className="font-semibold">{service.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Versão: {service.version}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          Uptime: {service.uptime.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {service.status === 'online'
                            ? `${service.responseTime}ms`
                            : service.status === 'maintenance'
                              ? 'Em manutenção'
                              : 'Offline'}
                        </div>
                      </div>
                      <Badge className={getStatusColor(service.status)}>
                        {service.status === 'online'
                          ? 'Online'
                          : service.status === 'offline'
                            ? 'Offline'
                            : service.status === 'maintenance'
                              ? 'Manutenção'
                              : 'Desconhecido'}
                      </Badge>
                    </div>
                  </div>
                  {service.status === 'online' && (
                    <div className="mt-3">
                      <Progress value={service.uptime} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{metric.name}</CardTitle>
                  <CardDescription>{metric.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold">
                      {metric.value}
                      {metric.unit}
                    </span>
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status === 'normal'
                        ? 'Normal'
                        : metric.status === 'warning'
                          ? 'Atenção'
                          : 'Crítico'}
                    </Badge>
                  </div>
                  <Progress
                    value={metric.unit === '%' ? metric.value : (metric.value / 500) * 100}
                    className={`h-2 ${
                      metric.status === 'critical'
                        ? 'bg-red-200'
                        : metric.status === 'warning'
                          ? 'bg-yellow-200'
                          : 'bg-green-200'
                    }`}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Alertas de Métricas */}
          {metrics.some(m => m.status === 'warning' || m.status === 'critical') && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Atenção:</strong> Algumas métricas estão fora do padrão normal. Monitore os
                recursos do sistema.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Incidentes</CardTitle>
              <CardDescription>Últimos incidentes e manutenções programadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Settings className="h-5 w-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <div className="font-medium">Manutenção programada - KYC Service</div>
                    <div className="text-sm text-muted-foreground">
                      Atualização do sistema de verificação de identidade
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      Iniciado em: {new Date().toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Em andamento</Badge>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                  <div className="flex-1">
                    <div className="font-medium">Atualização do Trading Engine</div>
                    <div className="text-sm text-muted-foreground">
                      Deploy da versão 3.0.1 com melhorias de performance
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      Concluído: {new Date(Date.now() - 86400000).toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Resolvido</Badge>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1" />
                  <div className="flex-1">
                    <div className="font-medium">Lentidão na API Externa - RFB</div>
                    <div className="text-sm text-muted-foreground">
                      Instabilidade nos serviços da Receita Federal
                    </div>
                    <div className="text-xs text-yellow-600 mt-1">
                      Detectado: {new Date(Date.now() - 172800000).toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Monitorando</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}