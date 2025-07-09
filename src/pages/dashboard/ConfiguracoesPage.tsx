import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  Bot,
  Zap,
  Bell,
  Shield,
  Users,
  Database,
  Key,
  Mail,
  Smartphone,
  Globe,
  Activity,
  RefreshCw,
  Download,
  Upload,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  User,
  Palette,
  Brain,
} from 'lucide-react';

// Importar os componentes avançados descobertos
import ProcessAutomation from '@/components/automation/ProcessAutomation';
import { AIAssistant } from '@/components/chat/AIAssistant';
import { FiscalNotifications } from '@/components/fiscal/fiscal-notifications';
import { TwoFactorAuthSetup } from '@/components/settings/TwoFactorAuthSetup';
import { WalletSetup } from '@/components/settings/WalletSetup';
import { TermsAcceptance } from '@/components/settings/TermsAcceptance';

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('automation');

  const systemStats = {
    activeAutomations: 12,
    aiInteractions: 847,
    notifications: 156,
    securityScore: 92.5,
    apiConnections: 8,
    systemUptime: 99.8,
  };

  // Mock data para obrigações fiscais
  const mockObligations = [
    {
      id: '1',
      taxName: 'ICMS',
      type: 'ICMS',
      amount: 15000,
      dueDate: new Date('2024-02-15'),
      status: 'PENDING' as const,
      description: 'ICMS Janeiro 2024',
    },
    {
      id: '2',
      taxName: 'IPI',
      type: 'IPI',
      amount: 8500,
      dueDate: new Date('2024-02-20'),
      status: 'PAID' as const,
      description: 'IPI Janeiro 2024',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="h-8 w-8 text-blue-600" />
            Centro de Configurações Administrativas
          </h1>
          <p className="mt-2 text-gray-600">
            Gestão completa de automações, IA, notificações e configurações de segurança
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Database className="h-4 w-4 mr-2" />
            Backup
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar Config
          </Button>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sincronizar
          </Button>
        </div>
      </div>

      {/* Métricas do Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Automações</p>
                <p className="text-2xl font-bold text-green-600">{systemStats.activeAutomations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bot className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">IA Sessions</p>
                <p className="text-2xl font-bold text-blue-600">{systemStats.aiInteractions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Notificações</p>
                <p className="text-2xl font-bold text-purple-600">{systemStats.notifications}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Segurança</p>
                <p className="text-2xl font-bold text-yellow-600">{systemStats.securityScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-indigo-600" />
              <div>
                <p className="text-sm font-medium">APIs</p>
                <p className="text-2xl font-bold text-indigo-600">{systemStats.apiConnections}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium">Uptime</p>
                <p className="text-2xl font-bold text-red-600">{systemStats.systemUptime}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sistema Integrado de Configurações */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Automação
          </TabsTrigger>
          <TabsTrigger value="ai-systems" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Sistemas IA
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Integrações
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuários
          </TabsTrigger>
        </TabsList>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Sistema de Automação de Processos
              </CardTitle>
              <CardDescription>
                Configure e monitore automações fiscais, validações automáticas e workflows
                inteligentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProcessAutomation />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-systems" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Configurações do Sistema de IA
              </CardTitle>
              <CardDescription>
                Configure parâmetros avançados de IA, modelos de machine learning e APIs de
                inteligência artificial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Modelo de IA Principal</h4>
                      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Modelo GPT-4 configurado para análises fiscais avançadas
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configurar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Activity className="h-4 w-4 mr-2" />
                        Monitorar
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Pipeline de ML</h4>
                      <Badge className="bg-blue-100 text-blue-800">Treinando</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Modelos de predição de riscos fiscais e otimização tributária
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Brain className="h-4 w-4 mr-2" />
                        Ver Status
                      </Button>
                      <Button variant="outline" size="sm">
                        <Database className="h-4 w-4 mr-2" />
                        Datasets
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Configurações Avançadas</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Nível de Confiança Mínimo</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Rate Limit (requests/min)</span>
                      <span className="text-sm font-medium">100</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cache TTL</span>
                      <span className="text-sm font-medium">30min</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Sistema Avançado de Notificações Fiscais
              </CardTitle>
              <CardDescription>
                Configure alertas inteligentes, notificações push e comunicações automáticas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FiscalNotifications obligations={mockObligations} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Autenticação Dupla (2FA)
                </CardTitle>
                <CardDescription>
                  Configure autenticação de dois fatores para máxima segurança
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TwoFactorAuthSetup />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Configuração de Wallet
                </CardTitle>
                <CardDescription>
                  Configure carteiras blockchain para transações seguras
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WalletSetup />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Termos de Uso e Compliance
              </CardTitle>
              <CardDescription>Gerencie termos de uso e conformidade regulatória</CardDescription>
            </CardHeader>
            <CardContent>
              <TermsAcceptance />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Integrações de APIs Governamentais
              </CardTitle>
              <CardDescription>
                Configure conexões com Receita Federal, SEFAZ e outros órgãos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Receita Federal</h4>
                      <Badge className="bg-green-100 text-green-800">Conectado</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      API para validação de CNPJ, CPF e consultas de débitos
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Testar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configurar
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">SEFAZ Estadual</h4>
                      <Badge className="bg-yellow-100 text-yellow-800">Limitado</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Consultas de NFe, NFCe e ICMS por estado
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Certificado
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configurar
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Banco Central</h4>
                      <Badge className="bg-red-100 text-red-800">Desconectado</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      APIs para consultas bancárias e transferências
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Key className="h-4 w-4 mr-2" />
                        Autenticar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configurar
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Blockchain Hyperledger</h4>
                      <Badge className="bg-blue-100 text-blue-800">Sincronizado</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Rede blockchain para tokenização de créditos
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Activity className="h-4 w-4 mr-2" />
                        Status
                      </Button>
                      <Button variant="outline" size="sm">
                        <Database className="h-4 w-4 mr-2" />
                        Logs
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestão de Usuários e Permissões
              </CardTitle>
              <CardDescription>
                Configure usuários, perfis de acesso e permissões granulares
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Usuários Ativos</h4>
                  <Button size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Adicionar Usuário
                  </Button>
                </div>

                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h5 className="font-medium">Admin Sistema</h5>
                        <p className="text-sm text-gray-600">admin@tributa.ai</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>Administrador</Badge>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h5 className="font-medium">Contador Fiscal</h5>
                        <p className="text-sm text-gray-600">contador@empresa.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Fiscal</Badge>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h5 className="font-medium">Analista Financeiro</h5>
                        <p className="text-sm text-gray-600">analista@empresa.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Leitura</Badge>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
