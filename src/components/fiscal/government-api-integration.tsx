import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  Globe,
  Settings,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Download,
  Upload,
  Wifi,
  WifiOff,
  Server,
  Database,
  Shield,
  Key,
  Activity,
  FileText,
  Calendar,
  Zap,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface APIIntegration {
  id: string;
  name: string;
  description: string;
  provider: string;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync: Date;
  syncFrequency: 'manual' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  dataTypes: string[];
  recordsCount: number;
  enabled: boolean;
  endpoint: string;
  authType: 'certificate' | 'token' | 'oauth' | 'basic';
  version: string;
}

interface SyncActivity {
  id: string;
  integrationId: string;
  integrationName: string;
  timestamp: Date;
  status: 'success' | 'error' | 'warning';
  recordsProcessed: number;
  duration: number;
  message: string;
  details?: string;
}

export function GovernmentAPIIntegration() {
  const [integrations, setIntegrations] = useState<APIIntegration[]>([
    {
      id: '1',
      name: 'Receita Federal - CNPJ',
      description: 'Consulta e validação de dados cadastrais de CNPJ',
      provider: 'Receita Federal do Brasil',
      status: 'connected',
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
      syncFrequency: 'daily',
      dataTypes: ['Dados Cadastrais', 'Situação Fiscal', 'Atividades'],
      recordsCount: 1247,
      enabled: true,
      endpoint: 'https://api.receitafederal.gov.br/cnpj/v1',
      authType: 'certificate',
      version: '1.0',
    },
    {
      id: '2',
      name: 'SPED - Sistema Público de Escrituração Digital',
      description: 'Transmissão de obrigações acessórias digitais',
      provider: 'Receita Federal do Brasil',
      status: 'syncing',
      lastSync: new Date(Date.now() - 30 * 60 * 1000),
      syncFrequency: 'weekly',
      dataTypes: ['ECD', 'ECF', 'EFD-Contribuições'],
      recordsCount: 856,
      enabled: true,
      endpoint: 'https://sped.receita.fazenda.gov.br/api/v2',
      authType: 'certificate',
      version: '2.0',
    },
    {
      id: '3',
      name: 'SEFAZ - Nota Fiscal Eletrônica',
      description: 'Consulta e validação de NFe, NFCe e CTe',
      provider: 'Secretaria da Fazenda Estadual',
      status: 'connected',
      lastSync: new Date(Date.now() - 15 * 60 * 1000),
      syncFrequency: 'hourly',
      dataTypes: ['NFe', 'NFCe', 'CTe', 'MDFe'],
      recordsCount: 3421,
      enabled: true,
      endpoint: 'https://nfe.sefaz.rs.gov.br/ws/nfestatusservico/nfestatusservico4.asmx',
      authType: 'certificate',
      version: '4.0',
    },
    {
      id: '4',
      name: 'PGFN - Dívida Ativa',
      description: 'Consulta de certidões e débitos inscritos em dívida ativa',
      provider: 'Procuradoria-Geral da Fazenda Nacional',
      status: 'error',
      lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000),
      syncFrequency: 'weekly',
      dataTypes: ['Dívida Ativa', 'Certidões', 'Parcelamentos'],
      recordsCount: 89,
      enabled: false,
      endpoint: 'https://pgfn.fazenda.gov.br/api/v1',
      authType: 'oauth',
      version: '1.0',
    },
  ]);

  const [activities, setActivities] = useState<SyncActivity[]>([
    {
      id: '1',
      integrationId: '1',
      integrationName: 'Receita Federal - CNPJ',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'success',
      recordsProcessed: 1247,
      duration: 45,
      message: 'Sincronização concluída com sucesso',
    },
    {
      id: '2',
      integrationId: '3',
      integrationName: 'SEFAZ - NFe',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: 'success',
      recordsProcessed: 342,
      duration: 12,
      message: 'Novos documentos fiscais sincronizados',
    },
    {
      id: '3',
      integrationId: '4',
      integrationName: 'PGFN - Dívida Ativa',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'error',
      recordsProcessed: 0,
      duration: 0,
      message: 'Erro de autenticação - certificado expirado',
      details: 'O certificado digital utilizado para autenticação expirou em 15/12/2024',
    },
  ]);

  const [activeTab, setActiveTab] = useState('overview');
  const [syncInProgress, setSyncInProgress] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'syncing':
        return 'bg-blue-100 text-blue-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'disconnected':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4" />;
      case 'syncing':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      case 'disconnected':
        return <WifiOff className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleSync = async (integrationId: string) => {
    setSyncInProgress(true);

    // Simular sincronização
    setTimeout(() => {
      const newActivity: SyncActivity = {
        id: Date.now().toString(),
        integrationId,
        integrationName: integrations.find(i => i.id === integrationId)?.name || 'Unknown',
        timestamp: new Date(),
        status: 'success',
        recordsProcessed: Math.floor(Math.random() * 500) + 100,
        duration: Math.floor(Math.random() * 30) + 5,
        message: 'Sincronização manual concluída com sucesso',
      };

      setActivities(prev => [newActivity, ...prev]);
      setIntegrations(prev =>
        prev.map(integration =>
          integration.id === integrationId
            ? { ...integration, lastSync: new Date(), status: 'connected' as const }
            : integration
        )
      );
      setSyncInProgress(false);
    }, 3000);
  };

  const handleToggleIntegration = (integrationId: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === integrationId
          ? { ...integration, enabled: !integration.enabled }
          : integration
      )
    );
  };

  const connectedIntegrations = integrations.filter(i => i.status === 'connected').length;
  const totalRecords = integrations.reduce((sum, i) => sum + i.recordsCount, 0);
  const lastSyncTime = Math.max(...integrations.map(i => i.lastSync.getTime()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6 text-blue-600" />
            Integrações Governamentais
          </h2>
          <p className="text-muted-foreground">
            Conecte-se com APIs oficiais para automatizar processos fiscais
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
          <Button size="sm" disabled={syncInProgress}>
            <RefreshCw className={`h-4 w-4 mr-2 ${syncInProgress ? 'animate-spin' : ''}`} />
            Sincronizar Tudo
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Integrações Ativas</p>
                <p className="text-2xl font-bold">
                  {connectedIntegrations}/{integrations.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Registros Sincronizados</p>
                <p className="text-2xl font-bold">{totalRecords.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Última Sincronização</p>
                <p className="text-sm font-medium">
                  {format(new Date(lastSyncTime), 'dd/MM HH:mm', { locale: ptBR })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Status Geral</p>
                <p className="text-sm font-medium text-green-600">Operacional</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="activity">Atividade</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrations.map(integration => (
              <Card key={integration.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Globe className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <CardDescription>{integration.provider}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(integration.status)}>
                        {getStatusIcon(integration.status)}
                        <span className="ml-1">{integration.status}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{integration.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Última Sync:</span>
                      <p className="font-medium">
                        {format(integration.lastSync, 'dd/MM HH:mm', { locale: ptBR })}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Registros:</span>
                      <p className="font-medium">{integration.recordsCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Frequência:</span>
                      <p className="font-medium">{integration.syncFrequency}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Versão:</span>
                      <p className="font-medium">v{integration.version}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground mb-2 block">
                      Tipos de Dados:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {integration.dataTypes.map((type, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={integration.enabled}
                        onCheckedChange={() => handleToggleIntegration(integration.id)}
                      />
                      <span className="text-sm">{integration.enabled ? 'Ativo' : 'Inativo'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(integration.id)}
                        disabled={syncInProgress || !integration.enabled}
                      >
                        <RefreshCw
                          className={`h-4 w-4 mr-2 ${syncInProgress ? 'animate-spin' : ''}`}
                        />
                        Sincronizar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Integrações</CardTitle>
              <CardDescription>
                Configure e monitore suas integrações com órgãos governamentais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Configurações detalhadas em desenvolvimento</p>
                <p className="text-sm">Em breve você terá controle total sobre as integrações</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Log de Atividades</CardTitle>
              <CardDescription>Histórico de sincronizações e operações realizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {activities.map(activity => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div
                        className={`p-2 rounded-full ${
                          activity.status === 'success'
                            ? 'bg-green-100'
                            : activity.status === 'error'
                              ? 'bg-red-100'
                              : 'bg-yellow-100'
                        }`}
                      >
                        {activity.status === 'success' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : activity.status === 'error' ? (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{activity.integrationName}</h4>
                          <span className="text-sm text-muted-foreground">
                            {format(activity.timestamp, 'dd/MM HH:mm', { locale: ptBR })}
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">{activity.message}</p>

                        {activity.details && (
                          <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                            {activity.details}
                          </p>
                        )}

                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Registros: {activity.recordsProcessed}</span>
                          <span>Duração: {activity.duration}s</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Globais</CardTitle>
              <CardDescription>Configure parâmetros gerais das integrações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Configurações avançadas em desenvolvimento</p>
                <p className="text-sm">Certificados, autenticação e políticas de segurança</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
