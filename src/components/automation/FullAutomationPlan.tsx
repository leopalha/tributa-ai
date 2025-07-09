import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Zap, 
  Shield, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  FileText,
  Brain,
  Coins,
  Building,
  Lock,
  Unlock,
  Target,
  TrendingUp
} from 'lucide-react';
import FullAutomationLegalService from '../../services/full-automation-legal.service';

/**
 * PLANO COMPLETO PARA AUTOMAÇÃO 100% LEGAL
 * 
 * Mostra exatamente como eliminar TODO trabalho manual
 * dentro do framework legal brasileiro.
 */
export const FullAutomationPlan: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState('phase_1');
  
  const automationPossibilities = FullAutomationLegalService.getAutomationPossibilities();
  const roadmap = FullAutomationLegalService.getFullAutomationRoadmap();
  const technicalSolutions = FullAutomationLegalService.getTechnicalSolutions();
  const legalFramework = FullAutomationLegalService.getLegalFramework();
  const actionPlan = FullAutomationLegalService.getActionPlan();

  const getAutomationColor = (potential: number) => {
    if (potential >= 95) return 'text-green-600 bg-green-50';
    if (potential >= 85) return 'text-blue-600 bg-blue-50';
    if (potential >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'full_auto': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'semi_auto': return <Clock className="h-5 w-5 text-yellow-600" />;
      default: return <Lock className="h-5 w-5 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Principal */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Target className="h-8 w-8 text-blue-600" />
            Plano para Automação 100% Legal
          </CardTitle>
          <p className="text-gray-700">
            <strong>Objetivo:</strong> Eliminar TODO trabalho manual através de estratégias legais específicas
          </p>
        </CardHeader>
        <CardContent>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Boa notícia:</strong> Como você vai legalizar a plataforma como SCD, 
              <strong> é possível chegar a 99.5% de automação</strong> seguindo o roadmap correto!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Análise de Possibilidades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Análise: O que pode ser 100% Automático
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automationPossibilities.map((possibility, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(possibility.current_status)}
                    <h3 className="font-semibold">{possibility.category}</h3>
                  </div>
                  <Badge className={getAutomationColor(possibility.automation_potential)}>
                    {possibility.automation_potential}% Automação
                  </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-blue-800 mb-2">
                      🎯 Caminho Legal para 100% Automação:
                    </h4>
                    <p className="text-sm text-gray-700 mb-3">
                      {possibility.legal_path_to_full_auto}
                    </p>
                    
                    <div className="text-sm">
                      <span className="font-medium">Timeline:</span> {possibility.estimated_timeline}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-green-800 mb-2">
                      ✅ Requisitos:
                    </h4>
                    <ul className="text-xs space-y-1">
                      {possibility.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-green-600">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-3 bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm text-green-800 mb-1">
                    🚀 Benefícios da Automação Total:
                  </h4>
                  <div className="text-xs text-green-700 space-y-1">
                    {possibility.benefits.map((benefit, idx) => (
                      <div key={idx}>• {benefit}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Roadmap Faseado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Roadmap Faseado para Automação Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedPhase} onValueChange={setSelectedPhase}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="phase_1">Fase 1: Imediato</TabsTrigger>
              <TabsTrigger value="phase_2">Fase 2: Licenciado</TabsTrigger>
              <TabsTrigger value="phase_3">Fase 3: Total</TabsTrigger>
            </TabsList>

            <TabsContent value="phase_1" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-green-600">
                    {roadmap.phase_1.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{roadmap.phase_1.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {roadmap.phase_1.items.map((item, idx) => (
                      <div key={idx} className="bg-green-50 p-3 rounded-lg">
                        <div className="font-medium text-green-800">{item.feature}</div>
                        <div className="text-sm text-green-700 mt-1">{item.automation}</div>
                        <div className="text-xs text-green-600 mt-2">
                          <strong>Base Legal:</strong> {item.legal_basis}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Alert className="mt-4">
                    <Unlock className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Pode implementar HOJE:</strong> Estas automações não precisam de 
                      autorizações especiais. São otimizações internas permitidas por lei.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="phase_2" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-blue-600">
                    {roadmap.phase_2.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{roadmap.phase_2.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {roadmap.phase_2.items.map((item, idx) => (
                      <div key={idx} className="bg-blue-50 p-3 rounded-lg">
                        <div className="font-medium text-blue-800">{item.feature}</div>
                        <div className="text-sm text-blue-700 mt-1">{item.automation}</div>
                        <div className="text-xs text-blue-600 mt-2">
                          <strong>Base Legal:</strong> {item.legal_basis}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="phase_3" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-purple-600">
                    {roadmap.phase_3.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{roadmap.phase_3.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {roadmap.phase_3.items.map((item, idx) => (
                      <div key={idx} className="bg-purple-50 p-3 rounded-lg">
                        <div className="font-medium text-purple-800">{item.feature}</div>
                        <div className="text-sm text-purple-700 mt-1">{item.automation}</div>
                        <div className="text-xs text-purple-600 mt-2">
                          <strong>Base Legal:</strong> {item.legal_basis}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Soluções Técnicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Soluções Técnicas para Eliminar Trabalho Manual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(technicalSolutions).map(([key, solution]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="text-lg">{solution.description}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    {solution.solutions.map((sol, idx) => (
                      <div key={idx} className="text-sm bg-gray-50 p-2 rounded">
                        • {sol}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-center bg-blue-50 p-2 rounded">
                      <div className="font-bold text-blue-600">{solution.implementation}</div>
                      <div className="text-blue-500">Timeline</div>
                    </div>
                    <div className="text-center bg-green-50 p-2 rounded">
                      <div className="font-bold text-green-600">{solution.automation_gain}</div>
                      <div className="text-green-500">Automação</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Framework Legal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Framework Legal: O que a Lei Permite Automatizar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-green-800 mb-3">✅ Automações Permitidas:</h3>
              <div className="space-y-3">
                {legalFramework.permitted_automations.map((automation, idx) => (
                  <div key={idx} className="bg-green-50 p-3 rounded-lg">
                    <div className="font-medium text-green-800">{automation.category}</div>
                    <div className="text-sm text-green-700 mt-1">
                      <strong>Base Legal:</strong> {automation.legal_basis}
                    </div>
                    <div className="text-sm text-green-600 mt-1">
                      <strong>Escopo:</strong> {automation.automation_scope}
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      <strong>Restrições:</strong> {automation.restrictions}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-blue-800 mb-3">📋 Autorizações Necessárias:</h3>
              <div className="space-y-2">
                {legalFramework.required_authorizations.map((auth, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-blue-50 p-2 rounded">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-800">{auth}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plano de Ação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Plano de Ação: Próximos Passos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-600">Ações Imediatas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {actionPlan.immediate_actions.map((action, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-blue-600">Médio Prazo</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {actionPlan.medium_term.map((action, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-purple-600">Longo Prazo</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {actionPlan.long_term.map((action, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-purple-600 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Resultado Final */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-green-800">
            🎯 Resultado Final: 99.5% de Automação Legal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">99.5%</div>
              <div className="text-sm text-gray-600">Automação Total</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">5s</div>
              <div className="text-sm text-gray-600">Tempo Médio</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">0.5%</div>
              <div className="text-sm text-gray-600">Trabalho Manual</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">24/7</div>
              <div className="text-sm text-gray-600">Operação</div>
            </div>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-center">
              <strong>Conclusão:</strong> É possível eliminar praticamente TODO trabalho manual 
              seguindo o framework legal correto. O segredo está em automatizar dentro da lei 
              e obter as autorizações adequadas como SCD.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default FullAutomationPlan;