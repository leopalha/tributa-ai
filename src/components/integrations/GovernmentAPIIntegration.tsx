import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GovernmentAPIIntegrationReal } from './GovernmentAPIIntegrationReal';
import {
  Globe,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  Database,
  Key,
  Settings,
  RefreshCw,
  ExternalLink,
  Activity,
  TrendingUp,
  AlertCircle,
  FileText,
  Building2,
  CreditCard,
  Receipt,
  Gavel,
  Users,
  MapPin,
  Calendar,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Upload,
  Eye,
  EyeOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipos de API governamental
export enum APIType {
  RECEITA_FEDERAL = 'RECEITA_FEDERAL',
  SEFAZ_ESTADUAL = 'SEFAZ_ESTADUAL',
  PREFEITURA = 'PREFEITURA',
  BACEN = 'BACEN',
  SERPRO = 'SERPRO',
  DATAPREV = 'DATAPREV',
  INSS = 'INSS',
  FGTS = 'FGTS',
  PGFN = 'PGFN',
  SIAFI = 'SIAFI',
}

// Status da integração
export enum IntegrationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ERROR = 'ERROR',
  MAINTENANCE = 'MAINTENANCE',
  RATE_LIMITED = 'RATE_LIMITED',
}

// Interface para integração com API
export interface APIIntegration {
  id: string;
  name: string;
  description: string;
  type: APIType;
  status: IntegrationStatus;
  endpoint: string;
  version: string;
  lastSync: Date;
  nextSync?: Date;
  syncInterval: number; // em minutos
  requestCount: number;
  errorCount: number;
  successRate: number;
  responseTime: number; // em ms
  rateLimit: {
    requests: number;
    period: string;
    remaining: number;
    resetTime: Date;
  };
  authentication: {
    type: 'API_KEY' | 'OAUTH2' | 'CERTIFICATE';
    status: 'VALID' | 'EXPIRED' | 'INVALID';
    expiresAt?: Date;
  };
  services: APIService[];
  enabled: boolean;
  provider: string;
  syncFrequency: 'manual' | 'hourly' | 'daily' | 'weekly';
  dataTypes: string[];
  lastError?: string;
  syncCount: number;
}

// Interface para serviço da API
export interface APIService {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  enabled: boolean;
  lastUsed: Date;
  usageCount: number;
  averageResponseTime: number;
  errorRate: number;
}

// Interface para consulta
export interface APIQuery {
  id: string;
  service: string;
  parameters: Record<string, any>;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  result?: any;
  error?: string;
  requestedAt: Date;
  completedAt?: Date;
  responseTime?: number;
}

// Interface para log de sincronização
interface SyncLog {
  id: string;
  integrationId: string;
  integrationName: string;
  timestamp: Date;
  status: 'success' | 'error' | 'warning';
  recordsProcessed: number;
  duration: number;
  message: string;
}

// Mock data para integrações
const MOCK_INTEGRATIONS: APIIntegration[] = [
  {
    id: 'rf-001',
    name: 'Receita Federal do Brasil',
    description: 'Consultas de CNPJ, CPF, situação fiscal e débitos',
    type: APIType.RECEITA_FEDERAL,
    status: IntegrationStatus.ACTIVE,
    endpoint: 'https://api.receita.fazenda.gov.br/v1',
    version: '1.2.0',
    lastSync: new Date(Date.now() - 300000), // 5 min atrás
    nextSync: new Date(Date.now() + 900000), // 15 min à frente
    syncInterval: 15,
    requestCount: 2847,
    errorCount: 12,
    successRate: 99.6,
    responseTime: 850,
    rateLimit: {
      requests: 1000,
      period: 'hour',
      remaining: 743,
      resetTime: new Date(Date.now() + 2400000),
    },
    authentication: {
      type: 'API_KEY',
      status: 'VALID',
      expiresAt: new Date(Date.now() + 86400000 * 30),
    },
    services: [
      {
        id: 'rf-cnpj',
        name: 'Consulta CNPJ',
        description: 'Consulta dados de pessoa jurídica',
        endpoint: '/cnpj/{cnpj}',
        method: 'GET',
        enabled: true,
        lastUsed: new Date(Date.now() - 120000),
        usageCount: 1247,
        averageResponseTime: 720,
        errorRate: 0.8,
      },
      {
        id: 'rf-cpf',
        name: 'Consulta CPF',
        description: 'Consulta dados de pessoa física',
        endpoint: '/cpf/{cpf}',
        method: 'GET',
        enabled: true,
        lastUsed: new Date(Date.now() - 300000),
        usageCount: 892,
        averageResponseTime: 650,
        errorRate: 1.2,
      },
    ],
    enabled: true,
    provider: 'Receita Federal do Brasil',
    syncFrequency: 'daily',
    dataTypes: ['CNPJ', 'CPF', 'Situação Fiscal', 'Débitos'],
    syncCount: 145,
  },
  {
    id: 'sefaz-sp',
    name: 'SEFAZ São Paulo',
    description: 'Consultas de ICMS, NFe e débitos estaduais',
    type: APIType.SEFAZ_ESTADUAL,
    status: IntegrationStatus.ACTIVE,
    endpoint: 'https://api.fazenda.sp.gov.br/v2',
    version: '2.1.5',
    lastSync: new Date(Date.now() - 600000), // 10 min atrás
    nextSync: new Date(Date.now() + 1200000), // 20 min à frente
    syncInterval: 30,
    requestCount: 1523,
    errorCount: 8,
    successRate: 99.5,
    responseTime: 1200,
    rateLimit: {
      requests: 500,
      period: 'hour',
      remaining: 342,
      resetTime: new Date(Date.now() + 1800000),
    },
    authentication: {
      type: 'CERTIFICATE',
      status: 'VALID',
      expiresAt: new Date(Date.now() + 86400000 * 365),
    },
    services: [
      {
        id: 'sefaz-nfe',
        name: 'Consulta NFe',
        description: 'Consulta notas fiscais eletrônicas',
        endpoint: '/nfe/{chave}',
        method: 'GET',
        enabled: true,
        lastUsed: new Date(Date.now() - 180000),
        usageCount: 856,
        averageResponseTime: 1100,
        errorRate: 0.5,
      },
    ],
    enabled: true,
    provider: 'SEFAZ',
    syncFrequency: 'hourly',
    dataTypes: ['NFe', 'NFCe', 'CTe', 'ICMS'],
    syncCount: 89,
  },
  {
    id: 'bacen-001',
    name: 'Banco Central do Brasil',
    description: 'Consultas de câmbio, taxa Selic e indicadores econômicos',
    type: APIType.BACEN,
    status: IntegrationStatus.ACTIVE,
    endpoint: 'https://api.bcb.gov.br/dados/serie/bcdata.sgs',
    version: '1.0.0',
    lastSync: new Date(Date.now() - 1800000), // 30 min atrás
    nextSync: new Date(Date.now() + 1800000), // 30 min à frente
    syncInterval: 60,
    requestCount: 456,
    errorCount: 2,
    successRate: 99.6,
    responseTime: 450,
    rateLimit: {
      requests: 10000,
      period: 'day',
      remaining: 9544,
      resetTime: new Date(Date.now() + 86400000),
    },
    authentication: {
      type: 'API_KEY',
      status: 'VALID',
    },
    services: [
      {
        id: 'bacen-selic',
        name: 'Taxa Selic',
        description: 'Consulta taxa básica de juros',
        endpoint: '/11/dados',
        method: 'GET',
        enabled: true,
        lastUsed: new Date(Date.now() - 1800000),
        usageCount: 156,
        averageResponseTime: 420,
        errorRate: 0.0,
      },
    ],
    enabled: true,
    provider: 'Banco Central do Brasil',
    syncFrequency: 'daily',
    dataTypes: ['Taxa Selic'],
    syncCount: 156,
  },
  {
    id: 'serpro-001',
    name: 'SERPRO - Consultas CPF/CNPJ',
    description: 'Serviços de consulta a bases de dados governamentais',
    type: APIType.SERPRO,
    status: IntegrationStatus.ERROR,
    endpoint: 'https://gateway.apiserpro.serpro.gov.br',
    version: '1.0.0',
    lastSync: new Date(Date.now() - 3600000), // 1h atrás
    syncInterval: 60,
    requestCount: 234,
    errorCount: 45,
    successRate: 80.8,
    responseTime: 2500,
    rateLimit: {
      requests: 250,
      period: 'hour',
      remaining: 0,
      resetTime: new Date(Date.now() + 3600000),
    },
    authentication: {
      type: 'OAUTH2',
      status: 'EXPIRED',
      expiresAt: new Date(Date.now() - 86400000),
    },
    services: [
      {
        id: 'serpro-cpf',
        name: 'Consulta CPF',
        description: 'Validação de CPF',
        endpoint: '/consulta-cpf/v1/cpf/{cpf}',
        method: 'GET',
        enabled: false,
        lastUsed: new Date(Date.now() - 3600000),
        usageCount: 134,
        averageResponseTime: 2800,
        errorRate: 25.4,
      },
    ],
    enabled: false,
    provider: 'SERPRO',
    syncFrequency: 'weekly',
    dataTypes: ['CPF'],
    syncCount: 134,
    lastError: 'Erro de autenticação - Token expirado',
  },
  {
    id: 'pgfn-001',
    name: 'Procuradoria-Geral da Fazenda Nacional',
    description: 'Consultas de dívida ativa da União',
    type: APIType.PGFN,
    status: IntegrationStatus.MAINTENANCE,
    endpoint: 'https://api.pgfn.fazenda.gov.br/v1',
    version: '1.1.0',
    lastSync: new Date(Date.now() - 7200000), // 2h atrás
    syncInterval: 120,
    requestCount: 89,
    errorCount: 0,
    successRate: 100,
    responseTime: 1850,
    rateLimit: {
      requests: 100,
      period: 'hour',
      remaining: 100,
      resetTime: new Date(Date.now() + 3600000),
    },
    authentication: {
      type: 'CERTIFICATE',
      status: 'VALID',
      expiresAt: new Date(Date.now() + 86400000 * 180),
    },
    services: [
      {
        id: 'pgfn-divida',
        name: 'Consulta Dívida Ativa',
        description: 'Consulta débitos inscritos em dívida ativa',
        endpoint: '/divida-ativa/{documento}',
        method: 'GET',
        enabled: true,
        lastUsed: new Date(Date.now() - 7200000),
        usageCount: 89,
        averageResponseTime: 1850,
        errorRate: 0.0,
      },
    ],
    enabled: true,
    provider: 'Procuradoria-Geral da Fazenda Nacional',
    syncFrequency: 'weekly',
    dataTypes: ['Dívida Ativa'],
    syncCount: 89,
  },
];

// Componente principal
export function GovernmentAPIIntegration() {
  const [integrations, setIntegrations] = useState<APIIntegration[]>(MOCK_INTEGRATIONS);
  const [selectedIntegration, setSelectedIntegration] = useState<APIIntegration | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [queries, setQueries] = useState<APIQuery[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  // Filtrar integrações
  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || integration.status === statusFilter;
    const matchesType = typeFilter === 'all' || integration.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Estatísticas
  const stats = {
    totalIntegrations: integrations.length,
    activeIntegrations: integrations.filter(i => i.status === IntegrationStatus.ACTIVE).length,
    errorIntegrations: integrations.filter(i => i.status === IntegrationStatus.ERROR).length,
    totalRequests: integrations.reduce((acc, i) => acc + i.requestCount, 0),
    averageSuccessRate:
      integrations.reduce((acc, i) => acc + i.successRate, 0) / integrations.length,
    averageResponseTime:
      integrations.reduce((acc, i) => acc + i.responseTime, 0) / integrations.length,
  };

  // Ações
  const handleSyncIntegration = (integrationId: string) => {
    setIsSyncing(integrationId);

    // Simular sincronização
    setTimeout(() => {
      setIntegrations(prev =>
        prev.map(integration =>
          integration.id === integrationId
            ? {
                ...integration,
                lastSync: new Date(),
                nextSync: getNextSyncTime(integration.syncFrequency),
                status: IntegrationStatus.ACTIVE,
                syncCount: integration.syncCount + 1,
              }
            : integration
        )
      );

      // Adicionar log de sincronização
      const integration = integrations.find(i => i.id === integrationId);
      if (integration) {
        const newLog: SyncLog = {
          id: Date.now().toString(),
          integrationId,
          integrationName: integration.name,
          timestamp: new Date(),
          status: 'success',
          recordsProcessed: Math.floor(Math.random() * 1000) + 100,
          duration: Math.floor(Math.random() * 60) + 10,
          message: 'Sincronização manual concluída com sucesso',
        };
        setSyncLogs(prev => [newLog, ...prev]);
      }

      setIsSyncing(null);
    }, 3000);
  };

  const handleToggleIntegration = (integrationId: string) => {
    setIntegrations(prev =>
      prev.map(i =>
        i.id === integrationId
          ? {
              ...i,
              enabled: !i.enabled,
              status: i.enabled ? IntegrationStatus.INACTIVE : IntegrationStatus.ACTIVE,
            }
          : i
      )
    );
  };

  const handleTestConnection = (integrationId: string) => {
    toast.success('Testando conexão...');
    // Simular teste de conexão
    setTimeout(() => {
      toast.success('Conexão testada com sucesso');
    }, 2000);
  };

  // Função para obter ícone do tipo de API
  const getAPITypeIcon = (type: APIType) => {
    switch (type) {
      case APIType.RECEITA_FEDERAL:
        return <Receipt className="h-4 w-4" />;
      case APIType.SEFAZ_ESTADUAL:
        return <Building2 className="h-4 w-4" />;
      case APIType.PREFEITURA:
        return <MapPin className="h-4 w-4" />;
      case APIType.BACEN:
        return <TrendingUp className="h-4 w-4" />;
      case APIType.SERPRO:
        return <Database className="h-4 w-4" />;
      case APIType.PGFN:
        return <Gavel className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  // Função para obter cor do status
  const getStatusColor = (status: IntegrationStatus) => {
    switch (status) {
      case IntegrationStatus.ACTIVE:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case IntegrationStatus.ERROR:
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case IntegrationStatus.MAINTENANCE:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case IntegrationStatus.RATE_LIMITED:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Função para obter próximo horário de sincronização
  const getNextSyncTime = (frequency: string) => {
    const now = new Date();
    switch (frequency) {
      case 'hourly':
        return new Date(now.getTime() + 60 * 60 * 1000);
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Integrações</p>
                <p className="text-2xl font-bold">{stats.totalIntegrations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Ativas</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeIntegrations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium">Com Erro</p>
                <p className="text-2xl font-bold text-red-600">{stats.errorIntegrations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Requisições</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.totalRequests.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Taxa de Sucesso</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.averageSuccessRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Tempo Resposta</p>
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round(stats.averageResponseTime)}ms
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="real-apis">APIs Reais</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
          <TabsTrigger value="queries">Consultas</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status das integrações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Status das Integrações
                </CardTitle>
                <CardDescription>Estado atual das conexões com APIs governamentais</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {integrations.map(integration => (
                      <div
                        key={integration.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          {getAPITypeIcon(integration.type)}
                          <div>
                            <p className="font-medium text-sm">{integration.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {integration.successRate.toFixed(1)}% sucesso •{' '}
                              {integration.responseTime}ms
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={cn('text-xs', getStatusColor(integration.status))}>
                            {integration.status}
                          </Badge>
                          <Switch
                            checked={integration.enabled}
                            onCheckedChange={() => handleToggleIntegration(integration.id)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Rate limits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Limites de Taxa
                </CardTitle>
                <CardDescription>Utilização dos limites de requisições por API</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-4">
                    {integrations
                      .filter(i => i.enabled)
                      .map(integration => (
                        <div key={integration.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{integration.name}</span>
                            <span className="text-muted-foreground">
                              {integration.rateLimit.remaining}/{integration.rateLimit.requests}
                            </span>
                          </div>
                          <Progress
                            value={
                              (integration.rateLimit.remaining / integration.rateLimit.requests) *
                              100
                            }
                            className="h-2"
                          />
                          <p className="text-xs text-muted-foreground">
                            Reset em{' '}
                            {Math.round(
                              (integration.rateLimit.resetTime.getTime() - Date.now()) / 60000
                            )}{' '}
                            min
                          </p>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Alertas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Alertas do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {integrations.filter(i => i.status === IntegrationStatus.ERROR).length > 0 && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Integrações com Erro</AlertTitle>
                    <AlertDescription>
                      {integrations.filter(i => i.status === IntegrationStatus.ERROR).length}{' '}
                      integração(ões) apresentam falhas. Verifique as configurações e credenciais.
                    </AlertDescription>
                  </Alert>
                )}

                {integrations.filter(i => i.authentication.status === 'EXPIRED').length > 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Credenciais Expiradas</AlertTitle>
                    <AlertDescription>
                      Algumas credenciais de autenticação expiraram. Renove-as para manter o
                      funcionamento.
                    </AlertDescription>
                  </Alert>
                )}

                {integrations.filter(i => i.rateLimit.remaining < i.rateLimit.requests * 0.1)
                  .length > 0 && (
                  <Alert>
                    <Zap className="h-4 w-4" />
                    <AlertTitle>Limite de Taxa Baixo</AlertTitle>
                    <AlertDescription>
                      Algumas APIs estão próximas do limite de requisições. Monitore o uso.
                    </AlertDescription>
                  </Alert>
                )}

                {integrations.filter(i => i.status === IntegrationStatus.ERROR).length === 0 && (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Sistema Operacional</AlertTitle>
                    <AlertDescription>
                      Todas as integrações estão funcionando normalmente.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar integrações..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value={IntegrationStatus.ACTIVE}>Ativa</SelectItem>
                      <SelectItem value={IntegrationStatus.INACTIVE}>Inativa</SelectItem>
                      <SelectItem value={IntegrationStatus.ERROR}>Erro</SelectItem>
                      <SelectItem value={IntegrationStatus.MAINTENANCE}>Manutenção</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-48">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Tipos</SelectItem>
                      <SelectItem value={APIType.RECEITA_FEDERAL}>Receita Federal</SelectItem>
                      <SelectItem value={APIType.SEFAZ_ESTADUAL}>SEFAZ Estadual</SelectItem>
                      <SelectItem value={APIType.BACEN}>Banco Central</SelectItem>
                      <SelectItem value={APIType.SERPRO}>SERPRO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de integrações */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredIntegrations.map(integration => (
              <Card
                key={integration.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedIntegration(integration)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getAPITypeIcon(integration.type)}
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={cn('text-xs', getStatusColor(integration.status))}>
                        {integration.status}
                      </Badge>
                      <Switch
                        checked={integration.enabled}
                        onCheckedChange={() => handleToggleIntegration(integration.id)}
                      />
                    </div>
                  </div>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Requisições</p>
                      <p className="font-medium">{integration.requestCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Taxa de Sucesso</p>
                      <p className="font-medium">{integration.successRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tempo de Resposta</p>
                      <p className="font-medium">{integration.responseTime}ms</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Última Sincronização</p>
                      <p className="font-medium">
                        {integration.lastSync.toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Rate Limit</span>
                      <span>
                        {integration.rateLimit.remaining}/{integration.rateLimit.requests}
                      </span>
                    </div>
                    <Progress
                      value={
                        (integration.rateLimit.remaining / integration.rateLimit.requests) * 100
                      }
                      className="h-2"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {integration.version}
                      </Badge>
                      <Badge
                        className={cn(
                          'text-xs',
                          integration.authentication.status === 'VALID'
                            ? 'bg-green-100 text-green-800'
                            : integration.authentication.status === 'EXPIRED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        )}
                      >
                        {integration.authentication.type}
                      </Badge>
                    </div>

                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={e => {
                          e.stopPropagation();
                          handleSyncIntegration(integration.id);
                        }}
                        disabled={isSyncing === integration.id || !integration.enabled}
                      >
                        {isSyncing === integration.id ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <RefreshCw className="h-3 w-3" />
                        )}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={e => {
                          e.stopPropagation();
                          handleTestConnection(integration.id);
                        }}
                      >
                        <Zap className="h-3 w-3" />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedIntegration(integration);
                        }}
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance em tempo real */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Performance em Tempo Real
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrations
                    .filter(i => i.enabled)
                    .map(integration => (
                      <div key={integration.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{integration.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {integration.responseTime}ms
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Sucesso: </span>
                            <span className="font-medium text-green-600">
                              {integration.successRate.toFixed(1)}%
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Erros: </span>
                            <span className="font-medium text-red-600">
                              {integration.errorCount}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Requisições: </span>
                            <span className="font-medium">{integration.requestCount}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Logs de atividade */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Logs de Atividade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2 font-mono text-sm">
                    <div className="flex items-center space-x-2 text-green-600">
                      <span className="text-muted-foreground">15:30:25</span>
                      <span>[INFO]</span>
                      <span>Receita Federal: Consulta CNPJ executada com sucesso</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">15:29:18</span>
                      <span>[DEBUG]</span>
                      <span>SEFAZ-SP: Sincronização de NFe iniciada</span>
                    </div>
                    <div className="flex items-center space-x-2 text-red-600">
                      <span className="text-muted-foreground">15:28:45</span>
                      <span>[ERROR]</span>
                      <span>SERPRO: Falha na autenticação OAuth2</span>
                    </div>
                    <div className="flex items-center space-x-2 text-yellow-600">
                      <span className="text-muted-foreground">15:27:30</span>
                      <span>[WARN]</span>
                      <span>BACEN: Rate limit próximo do limite (90%)</span>
                    </div>
                    <div className="flex items-center space-x-2 text-blue-600">
                      <span className="text-muted-foreground">15:26:12</span>
                      <span>[INFO]</span>
                      <span>PGFN: Manutenção programada iniciada</span>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="queries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Consultas</CardTitle>
              <CardDescription>
                Registro de todas as consultas realizadas às APIs governamentais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Funcionalidade em desenvolvimento</p>
                <p className="text-sm">
                  Em breve você poderá visualizar o histórico completo de consultas
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Globais</CardTitle>
              <CardDescription>
                Configurações gerais para integrações com APIs governamentais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeout">Timeout Padrão (segundos)</Label>
                    <Input id="timeout" type="number" defaultValue="30" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="retry-attempts">Tentativas de Retry</Label>
                    <Input id="retry-attempts" type="number" defaultValue="3" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cache-duration">Duração do Cache (minutos)</Label>
                    <Input id="cache-duration" type="number" defaultValue="15" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-sync">Sincronização Automática</Label>
                    <Switch id="auto-sync" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="rate-limit-alerts">Alertas de Rate Limit</Label>
                    <Switch id="rate-limit-alerts" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="error-notifications">Notificações de Erro</Label>
                    <Switch id="error-notifications" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button>Salvar Configurações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="real-apis" className="space-y-4">
          <GovernmentAPIIntegrationReal />
        </TabsContent>
      </Tabs>
    </div>
  );
}
