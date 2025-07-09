import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Eye, 
  ThumbsUp, 
  ThumbsDown,
  Timer,
  Zap,
  Brain,
  Shield
} from 'lucide-react';
import { OperatorTask, OneClickAction } from '../../types/automation';

interface SmartOperatorDashboardProps {
  operatorId: string;
}

/**
 * DASHBOARD DO OPERADOR INTELIGENTE
 * 
 * Sistema que reduz trabalho manual de 30 minutos para 30 segundos:
 * - Fila priorizada por criticidade/valor
 * - Formulários pré-prontos para submissão  
 * - Botões "Aprovar/Rejeitar" com 1 clique
 * - Compliance automático com validação mínima
 */
export const SmartOperatorDashboard: React.FC<SmartOperatorDashboardProps> = ({ 
  operatorId 
}) => {
  const [tasks, setTasks] = useState<OperatorTask[]>([]);
  const [currentTask, setCurrentTask] = useState<OperatorTask | null>(null);
  const [processingTime, setProcessingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadOperatorQueue();
  }, [operatorId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessing) {
      interval = setInterval(() => {
        setProcessingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const loadOperatorQueue = async () => {
    // Mock data - Em produção, viria do SmartAutomationService
    const mockTasks: OperatorTask[] = [
      {
        id: 'task_1',
        task_type: 'FORM_VALIDATION',
        priority: 'urgent',
        title: 'SISCOAF - Validação Automática',
        description: 'Formulário SISCOAF pré-preenchido (95% completo) - Transação R$ 15.000',
        customer_name: 'João Silva',
        empresa_name: 'Tech Solutions LTDA',
        estimated_time: 30,
        status: 'pending',
        pre_filled_data: {
          cnpj: '12.345.678/0001-90',
          valor: 15000,
          tipo: 'COMPENSACAO_TRIBUTARIA'
        },
        suggested_actions: [
          {
            id: 'suggest_1',
            action_type: 'APPROVE',
            confidence: 0.96,
            reasoning: 'Dados validados automaticamente. CNPJ ativo, valores conferem, documentação completa.',
            estimated_impact: 'Processo será finalizado em 30 segundos',
            recommended: true
          }
        ],
        one_click_actions: [
          {
            id: 'approve_1',
            label: 'Aprovar e Enviar',
            action_type: 'APPROVE_AND_SUBMIT',
            confirmation_required: false,
            success_message: 'SISCOAF aprovado e enviado com sucesso!',
            api_endpoint: '/api/automation/approve-submit',
            parameters: { taskId: 'task_1' }
          },
          {
            id: 'reject_1', 
            label: 'Rejeitar',
            action_type: 'REJECT',
            confirmation_required: true,
            warning_message: 'Tem certeza? Esta operação requer justificativa.',
            success_message: 'Formulário rejeitado',
            api_endpoint: '/api/automation/reject',
            parameters: { taskId: 'task_1' }
          }
        ],
        assigned_at: new Date(),
        metadata: {
          automation_level: 'high',
          confidence_score: 0.96,
          time_saved: 1770 // 29.5 minutos economizados
        }
      },
      {
        id: 'task_2',
        task_type: 'COMPLIANCE_REVIEW',
        priority: 'high',
        title: 'COAF - Relatório Automático',
        description: 'Relatório COAF pré-gerado - Transação R$ 25.000 (aguarda validação)',
        customer_name: 'Maria Santos',
        empresa_name: 'Logística Premium LTDA',
        estimated_time: 30,
        status: 'pending',
        pre_filled_data: {
          valor: 25000,
          relatorio_gerado: true,
          status_legal: 'awaiting_validation'
        },
        suggested_actions: [
          {
            id: 'suggest_2',
            action_type: 'APPROVE',
            confidence: 0.92,
            reasoning: 'Relatório COAF preparado automaticamente. Operação dentro dos padrões legais.',
            estimated_impact: 'Validação em 30 segundos',
            recommended: true
          }
        ],
        one_click_actions: [
          {
            id: 'validate_coaf',
            label: 'Validar COAF',
            action_type: 'VALIDATE_COAF',
            confirmation_required: false,
            success_message: 'Relatório COAF validado!',
            api_endpoint: '/api/automation/validate-coaf',
            parameters: { taskId: 'task_2' }
          }
        ],
        assigned_at: new Date(),
        metadata: {
          legal_framework: 'SCD_compliance',
          awaiting_authorization: 'COAF_pending'
        }
      }
    ];
    
    setTasks(mockTasks);
    if (mockTasks.length > 0) {
      setCurrentTask(mockTasks[0]);
    }
  };

  const handleOneClickAction = async (action: OneClickAction) => {
    if (action.confirmation_required) {
      const confirmed = window.confirm(action.warning_message || 'Confirmar ação?');
      if (!confirmed) return;
    }

    setIsProcessing(true);
    setProcessingTime(0);

    try {
      // Simula processamento (em produção seria uma chamada API real)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Atualiza tarefa como completada
      if (currentTask) {
        const updatedTask = { ...currentTask, status: 'completed' as const, completed_at: new Date() };
        setTasks(prev => prev.map(t => t.id === currentTask.id ? updatedTask : t));
        
        // Move para próxima tarefa
        const remainingTasks = tasks.filter(t => t.id !== currentTask.id);
        setCurrentTask(remainingTasks.length > 0 ? remainingTasks[0] : null);
      }

      alert(action.success_message);
    } catch (error) {
      alert('Erro ao processar ação');
    } finally {
      setIsProcessing(false);
      setProcessingTime(0);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'FORM_VALIDATION': return <FileText className="h-4 w-4" />;
      case 'COMPLIANCE_REVIEW': return <Shield className="h-4 w-4" />;
      case 'DOCUMENT_REVIEW': return <Eye className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header com Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fila Atual</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.filter(t => t.status === 'pending').length}</div>
            <p className="text-xs text-muted-foreground">tarefas pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">30s</div>
            <p className="text-xs text-muted-foreground">por processo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automação</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">95%</div>
            <p className="text-xs text-muted-foreground">pré-processado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economia</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">29.5min</div>
            <p className="text-xs text-muted-foreground">por tarefa</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fila de Tarefas */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Fila Priorizada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  currentTask?.id === task.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setCurrentTask(task)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTaskIcon(task.task_type)}
                    <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                      {task.priority}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    {task.estimated_time}s
                  </div>
                </div>
                <div className="text-sm font-medium truncate">
                  {task.title}
                </div>
                <div className="text-xs text-gray-600 truncate">
                  {task.customer_name} - {task.empresa_name}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tarefa Atual */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Processamento Inteligente</span>
              {isProcessing && (
                <Badge variant="outline" className="text-blue-600">
                  Processando... {processingTime}s
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentTask ? (
              <div className="space-y-4">
                {/* Info da Tarefa */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{currentTask.title}</h3>
                    <Badge className={`${getPriorityColor(currentTask.priority)} text-white`}>
                      {currentTask.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{currentTask.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Cliente:</span> {currentTask.customer_name}
                    </div>
                    <div>
                      <span className="font-medium">Empresa:</span> {currentTask.empresa_name}
                    </div>
                  </div>
                </div>

                {/* Dados Pré-preenchidos */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Dados Pré-processados Automaticamente
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(currentTask.pre_filled_data || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium">{key}:</span>
                        <span>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                  {currentTask.metadata?.confidence_score && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Confiança IA:</span>
                        <span>{Math.round(currentTask.metadata.confidence_score * 100)}%</span>
                      </div>
                      <Progress value={currentTask.metadata.confidence_score * 100} className="h-2" />
                    </div>
                  )}
                </div>

                {/* Ações Sugeridas */}
                {currentTask.suggested_actions.map((suggestion) => (
                  <div key={suggestion.id} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Recomendação IA ({Math.round(suggestion.confidence * 100)}% confiança)
                    </h4>
                    <p className="text-sm text-blue-700 mb-2">{suggestion.reasoning}</p>
                    <p className="text-xs text-blue-600">{suggestion.estimated_impact}</p>
                  </div>
                ))}

                <Separator />

                {/* Botões de Ação 1-Clique */}
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Ações Rápidas (1 clique)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentTask.one_click_actions.map((action) => (
                      <Button
                        key={action.id}
                        onClick={() => handleOneClickAction(action)}
                        disabled={isProcessing}
                        className={
                          action.action_type.includes('APPROVE') 
                            ? 'bg-green-600 hover:bg-green-700'
                            : action.action_type.includes('REJECT')
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }
                      >
                        {action.action_type.includes('APPROVE') && <ThumbsUp className="h-4 w-4 mr-2" />}
                        {action.action_type.includes('REJECT') && <ThumbsDown className="h-4 w-4 mr-2" />}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Informações Legais */}
                {currentTask.metadata?.legal_framework && (
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 text-sm text-yellow-800">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">Status Legal:</span>
                      <span>{currentTask.metadata.legal_framework}</span>
                    </div>
                    {currentTask.metadata.awaiting_authorization && (
                      <div className="text-xs text-yellow-700 mt-1">
                        🔒 {currentTask.metadata.awaiting_authorization}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma tarefa na fila</p>
                <p className="text-sm">Todas as operações foram processadas!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SmartOperatorDashboard;