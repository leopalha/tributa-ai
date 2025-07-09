import { useState, useEffect, useCallback } from 'react';
import { 
  AutomationMetrics, 
  OperatorTask, 
  PreFilledForm, 
  ComplianceAlert,
  DocumentValidation,
  PerdcompIntegration,
  AutomationSettings
} from '../types/automation';
import SmartAutomationService from '../services/smart-automation.service';

/**
 * Hook para gerenciar o Sistema de Semi-Automação Inteligente
 * 
 * Facilita o uso do SmartAutomationService nos componentes React,
 * mantendo estado e fornecendo funcionalidades prontas para uso.
 */
export const useSmartAutomation = (empresaId?: string, operatorId?: string) => {
  const [metrics, setMetrics] = useState<AutomationMetrics | null>(null);
  const [operatorTasks, setOperatorTasks] = useState<OperatorTask[]>([]);
  const [complianceAlerts, setComplianceAlerts] = useState<ComplianceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const automationService = SmartAutomationService.getInstance();

  // Carregar métricas de automação
  const loadMetrics = useCallback(async () => {
    if (!empresaId) return;
    
    try {
      setIsLoading(true);
      const metricsData = await automationService.getAutomationMetrics(empresaId);
      setMetrics(metricsData);
    } catch (err) {
      setError('Erro ao carregar métricas de automação');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [empresaId, automationService]);

  // Carregar fila do operador
  const loadOperatorQueue = useCallback(async () => {
    if (!operatorId) return;
    
    try {
      setIsLoading(true);
      const tasks = await automationService.generateOperatorQueue(operatorId);
      setOperatorTasks(tasks);
    } catch (err) {
      setError('Erro ao carregar fila do operador');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [operatorId, automationService]);

  // Gerar formulário pré-preenchido
  const generatePreFilledForm = useCallback(async (
    formType: 'SISCOAF' | 'PERDCOMP' | 'DARF' | 'SPED' | 'ECF',
    customerId: string
  ): Promise<PreFilledForm | null> => {
    if (!empresaId) return null;

    try {
      setIsLoading(true);
      const form = await automationService.generatePreFilledForm(formType, empresaId, customerId);
      return form;
    } catch (err) {
      setError(`Erro ao gerar formulário ${formType}`);
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [empresaId, automationService]);

  // Processar verificação de compliance
  const processComplianceCheck = useCallback(async (
    transactionData: any
  ): Promise<ComplianceAlert[]> => {
    if (!empresaId) return [];

    try {
      setIsLoading(true);
      const alerts = await automationService.processComplianceCheck(transactionData, empresaId);
      setComplianceAlerts(prev => [...prev, ...alerts]);
      return alerts;
    } catch (err) {
      setError('Erro na verificação de compliance');
      console.error(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [empresaId, automationService]);

  // Validar documento
  const validateDocument = useCallback(async (
    documentId: string,
    documentType: 'CERTIDAO_NEGATIVA' | 'CNPJ' | 'CPF' | 'CONTRATO_SOCIAL' | 'BALANCETE',
    fileBuffer: Buffer
  ): Promise<DocumentValidation | null> => {
    try {
      setIsLoading(true);
      const validation = await automationService.validateDocument(documentId, documentType, fileBuffer);
      return validation;
    } catch (err) {
      setError('Erro na validação de documento');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [automationService]);

  // Gerar integração PERDCOMP
  const generatePerdcompIntegration = useCallback(async (): Promise<PerdcompIntegration | null> => {
    if (!empresaId) return null;

    try {
      setIsLoading(true);
      const integration = await automationService.generatePerdcompFile(empresaId);
      return integration;
    } catch (err) {
      setError('Erro ao gerar integração PERDCOMP');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [empresaId, automationService]);

  // Completar tarefa do operador
  const completeOperatorTask = useCallback(async (
    taskId: string,
    action: 'approve' | 'reject' | 'escalate',
    notes?: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Atualizar tarefa localmente
      setOperatorTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { ...task, status: action === 'approve' ? 'completed' : 'rejected', completed_at: new Date() }
            : task
        )
      );

      // Em produção, seria uma chamada API real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (err) {
      setError('Erro ao completar tarefa');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Estatísticas em tempo real
  const getRealtimeStats = useCallback(() => {
    if (!metrics) return null;

    return {
      automation_rate: metrics.automation_rate,
      average_processing_time: metrics.average_processing_time,
      pending_tasks: operatorTasks.filter(t => t.status === 'pending').length,
      completed_today: operatorTasks.filter(t => 
        t.status === 'completed' && 
        t.completed_at && 
        new Date(t.completed_at).toDateString() === new Date().toDateString()
      ).length,
      active_alerts: complianceAlerts.filter(a => a.status === 'open').length,
      time_saved_today: operatorTasks
        .filter(t => t.status === 'completed' && t.metadata?.time_saved)
        .reduce((sum, t) => sum + (t.metadata?.time_saved || 0), 0)
    };
  }, [metrics, operatorTasks, complianceAlerts]);

  // Verificar se sistema está funcionando corretamente
  const getSystemHealth = useCallback(() => {
    const stats = getRealtimeStats();
    if (!stats) return 'unknown';

    const automationRate = stats.automation_rate;
    const averageTime = stats.average_processing_time;

    if (automationRate >= 0.9 && averageTime <= 60) {
      return 'excellent'; // 90%+ automação e <= 60s
    } else if (automationRate >= 0.8 && averageTime <= 120) {
      return 'good'; // 80%+ automação e <= 2min
    } else if (automationRate >= 0.7 && averageTime <= 300) {
      return 'fair'; // 70%+ automação e <= 5min
    } else {
      return 'poor'; // Abaixo dos padrões
    }
  }, [getRealtimeStats]);

  // Carregar dados iniciais
  useEffect(() => {
    if (empresaId) {
      loadMetrics();
    }
  }, [empresaId, loadMetrics]);

  useEffect(() => {
    if (operatorId) {
      loadOperatorQueue();
    }
  }, [operatorId, loadOperatorQueue]);

  // Auto-refresh das métricas a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (empresaId) {
        loadMetrics();
      }
      if (operatorId) {
        loadOperatorQueue();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [empresaId, operatorId, loadMetrics, loadOperatorQueue]);

  return {
    // Estados
    metrics,
    operatorTasks,
    complianceAlerts,
    isLoading,
    error,

    // Ações
    generatePreFilledForm,
    processComplianceCheck,
    validateDocument,
    generatePerdcompIntegration,
    completeOperatorTask,
    loadMetrics,
    loadOperatorQueue,

    // Utilitários
    getRealtimeStats,
    getSystemHealth,

    // Limpeza de erro
    clearError: () => setError(null)
  };
};

export default useSmartAutomation;