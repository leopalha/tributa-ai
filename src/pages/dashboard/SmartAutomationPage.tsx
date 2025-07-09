import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription } from '../../components/ui/alert';
import SmartOperatorDashboard from '../../components/automation/SmartOperatorDashboard';
import PerdcompAutomation from '../../components/automation/PerdcompAutomation';
import FullAutomationPlan from '../../components/automation/FullAutomationPlan';
import { 
  Zap, 
  Brain, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  FileText,
  Shield,
  Download,
  Settings,
  BarChart3
} from 'lucide-react';

/**
 * SISTEMA DE SEMI-AUTOMAÇÃO INTELIGENTE - PÁGINA PRINCIPAL
 * 
 * Objetivo: Reduzir trabalho manual de 30 minutos para 30 segundos por processo
 * 
 * Funcionalidades:
 * 1. Formulários pré-preenchidos automaticamente (90% completos)
 * 2. Compliance automático com validação mínima
 * 3. Validação de certidões semi-automática com OCR
 * 4. Dashboard de operador inteligente
 * 5. Integração PERDCOMP semi-automática (99% aprovação RFB)
 */
export const SmartAutomationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data para demonstração
  const automationMetrics = {
    total_processes: 1000,
    automated_processes: 950,
    automation_rate: 0.95,
    average_processing_time: 30, // segundos
    time_saved_hours: 475,
    cost_savings: 23750,
    success_rate: 0.99
  };

  const todayStats = {
    processed: 127,
    automated: 121,
    manual_review: 6,
    average_time: 28,
    forms_generated: 89,
    compliance_alerts: 3
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Principal */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-600" />
            Sistema de Semi-Automação Inteligente
          </h1>
          <p className="text-gray-600 mt-2">
            Reduzindo trabalho manual de 30 minutos para 30 segundos por processo
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge className="bg-green-500 text-white">
            95% Automação
          </Badge>
          <Badge className="bg-blue-500 text-white">
            30s por processo
          </Badge>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Automação</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(automationMetrics.automation_rate * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {automationMetrics.automated_processes} de {automationMetrics.total_processes} processos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {automationMetrics.average_processing_time}s
            </div>
            <p className="text-xs text-muted-foreground">
              vs 30 minutos manual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economia de Tempo</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {automationMetrics.time_saved_hours}h
            </div>
            <p className="text-xs text-muted-foreground">
              economizadas este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(automationMetrics.success_rate * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              aprovação automática
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas do Dia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Resumo do Dia - {new Date().toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{todayStats.processed}</div>
              <div className="text-xs text-gray-600">Processados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{todayStats.automated}</div>
              <div className="text-xs text-gray-600">Automatizados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{todayStats.manual_review}</div>
              <div className="text-xs text-gray-600">Revisão Manual</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{todayStats.average_time}s</div>
              <div className="text-xs text-gray-600">Tempo Médio</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{todayStats.forms_generated}</div>
              <div className="text-xs text-gray-600">Formulários Gerados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{todayStats.compliance_alerts}</div>
              <div className="text-xs text-gray-600">Alertas Compliance</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Principais Funcionalidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('forms')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Formulários Pré-preenchidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-600">90%</div>
              <p className="text-sm text-gray-600">
                Formulários SISCOAF/PERDCOMP gerados automaticamente com dados já cadastrados
              </p>
              <Badge variant="outline" className="text-green-600">
                Operador só valida em 30s
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('compliance')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Compliance Automático
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">R$ 10k+</div>
              <p className="text-sm text-gray-600">
                Detecção automática de transações. Relatório COAF gerado em 30 segundos
              </p>
              <Badge variant="outline" className="text-blue-600">
                IA identifica padrões suspeitos
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('perdcomp')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-purple-600" />
              PERDCOMP Semi-Automático
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-600">99%</div>
              <p className="text-sm text-gray-600">
                Taxa de aprovação na RFB. Cliente só faz upload no e-CAC
              </p>
              <Badge variant="outline" className="text-purple-600">
                Arquivo .TXT pré-pronto
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NOVO: Card Especial para Automação 100% */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('full-automation')}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-yellow-600" />
              Plano para Automação 100% Legal
            </span>
            <Badge className="bg-yellow-500 text-white">
              NOVA FEATURE
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">99.5%</div>
              <p className="text-xs text-gray-600">Automação Total Possível</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">0.5%</div>
              <p className="text-xs text-gray-600">Trabalho Manual</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">Zero</div>
              <p className="text-xs text-gray-600">Intervenção Humana</p>
            </div>
          </div>
          <Alert className="mt-4">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-center">
              <strong>Descoberta:</strong> Como SCD legalizada, é possível eliminar praticamente 
              TODO trabalho manual seguindo estratégias legais específicas!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>


      {/* Tabs Principais */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="forms">Formulários</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="perdcomp">PERDCOMP</TabsTrigger>
          <TabsTrigger value="full-automation">100% Auto</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <SmartOperatorDashboard operatorId="op_001" />
        </TabsContent>

        <TabsContent value="forms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Formulários Pré-preenchidos Automaticamente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  🚀 Sistema coleta TODOS os dados que cliente já digitou na plataforma
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Dados da empresa (CNPJ, razão social, endereço)</li>
                  <li>• Histórico de tributos e pagamentos</li>
                  <li>• Declarações já transmitidas</li>
                  <li>• Créditos identificados automaticamente</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">SISCOAF</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Preenchimento automático:</span>
                        <span className="font-semibold text-green-600">95%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tempo do operador:</span>
                        <span className="font-semibold text-blue-600">30s</span>
                      </div>
                      <Button className="w-full mt-3">
                        Gerar SISCOAF
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">DARF</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Preenchimento automático:</span>
                        <span className="font-semibold text-green-600">92%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tempo do operador:</span>
                        <span className="font-semibold text-blue-600">25s</span>
                      </div>
                      <Button className="w-full mt-3">
                        Gerar DARF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Compliance Automático com Validação Mínima
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">
                  ✅ Sistema detecta automaticamente quando transação > R$ 10.000
                </h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Gera relatório COAF pré-preenchido em 30 segundos</li>
                  <li>• IA identifica operações suspeitas automaticamente</li>
                  <li>• Operador só revisa e aprova (2 cliques)</li>
                  <li>• 🔒 Validação humana obrigatória até autorização COAF</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-center">Detecção</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                    <p className="text-sm text-gray-600">Automática</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-center">Relatório</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">30s</div>
                    <p className="text-sm text-gray-600">Geração</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-center">Validação</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">30s</div>
                    <p className="text-sm text-gray-600">Operador</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="perdcomp" className="space-y-4">
          <PerdcompAutomation empresaId="empresa_001" />
        </TabsContent>

        <TabsContent value="full-automation" className="space-y-4">
          <FullAutomationPlan />
        </TabsContent>
      </Tabs>

      {/* Resumo de Economia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Impacto da Automação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">R$ 23.750</div>
              <div className="text-sm text-gray-600">Economia em custos operacionais</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">475h</div>
              <div className="text-sm text-gray-600">Tempo economizado por mês</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">60x</div>
              <div className="text-sm text-gray-600">Aumento de produtividade</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">95%</div>
              <div className="text-sm text-gray-600">Redução de erros manuais</div>
            </div>
          </div>
          
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-center mb-2">
              🎯 Objetivo Alcançado: Operador trabalha 30 segundos por processo vs 30 minutos manual tradicional
            </h3>
            <p className="text-sm text-center text-gray-700">
              Sistema automatiza máximo possível, deixando apenas validação final humana conforme framework legal SCD
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartAutomationPage;