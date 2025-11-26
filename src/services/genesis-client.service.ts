/**
 * 🚀 GENESIS CLIENT SERVICE
 * Serviço de comunicação com GENESIS Enterprise System
 *
 * Conecta o frontend React com os agentes de IA no backend
 */

import { logger } from '@/lib/logger-unified';

// Configuração da URL do GENESIS
const GENESIS_BASE_URL = import.meta.env.VITE_GENESIS_URL ||
  (import.meta.env.PROD
    ? 'https://tributa-ai-production.railway.app'
    : 'http://localhost:3003'
  );

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface TaskResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: {
    message?: string;
    [key: string]: any;
  };
}

interface AgentStatus {
  name: string;
  role: string;
  status: 'active' | 'idle' | 'error';
  tasksProcessed: number;
  averageResponseTime: number;
  successRate: number;
}

/**
 * Serviço de comunicação com agentes GENESIS
 */
class GenesisClientService {
  private baseUrl: string;
  private wsConnection: WebSocket | null = null;
  private messageCallbacks: Map<string, (message: any) => void> = new Map();

  constructor() {
    this.baseUrl = GENESIS_BASE_URL;
    logger.info('GenesisClientService initialized', { baseUrl: this.baseUrl });
  }

  /**
   * Verifica se GENESIS está online
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        logger.warn('GENESIS health check failed', {
          status: response.status,
          statusText: response.statusText
        });
        return false;
      }

      const data = await response.json();
      logger.info('GENESIS health check OK', data);
      return data.status === 'healthy';
    } catch (error) {
      logger.error('GENESIS health check error', { error });
      return false;
    }
  }

  /**
   * Busca status de todos os agentes
   */
  async getAgents(): Promise<Record<string, AgentStatus>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/agents`);

      if (!response.ok) {
        throw new Error(`Failed to fetch agents: ${response.statusText}`);
      }

      const agents = await response.json();
      logger.info('Agents fetched', { count: Object.keys(agents).length });
      return agents;
    } catch (error) {
      logger.error('Failed to fetch agents', { error });
      throw error;
    }
  }

  /**
   * Envia mensagem para um agente específico
   */
  async sendMessageToAgent(
    agentId: 'aria' | 'oracle' | 'themis' | 'aether' | 'nexus',
    message: string,
    context?: Record<string, any>
  ): Promise<TaskResponse> {
    try {
      logger.info(`Sending message to ${agentId}`, { message, context });

      const response = await fetch(`${this.baseUrl}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: `Chat with ${agentId}`,
          description: message,
          type: agentId === 'aria' ? 'customer_support' : 'agent_query',
          priority: 'high',
          assignedAgent: agentId,
          data: {
            message,
            conversationId: context?.conversationId || `conv-${Date.now()}`,
            userId: context?.userId || 'anonymous',
            ...context
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      const task = await response.json();
      logger.info('Task created', { taskId: task.id, agentId });

      // Poll para resultado (aguardar processamento)
      return await this.waitForTaskCompletion(task.id);
    } catch (error) {
      logger.error('Failed to send message', { error, agentId });
      throw error;
    }
  }

  /**
   * Aguarda conclusão de uma tarefa
   */
  private async waitForTaskCompletion(
    taskId: string,
    maxAttempts = 30,
    intervalMs = 1000
  ): Promise<TaskResponse> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}/api/tasks/${taskId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch task: ${response.statusText}`);
        }

        const task = await response.json();

        if (task.status === 'completed') {
          logger.info('Task completed', { taskId, result: task.result });
          return task;
        }

        if (task.status === 'failed') {
          logger.error('Task failed', { taskId, error: task.error });
          throw new Error(task.error || 'Task failed');
        }

        // Aguarda antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      } catch (error) {
        if (attempt === maxAttempts - 1) throw error;
      }
    }

    throw new Error('Task timeout - agent did not respond in time');
  }

  /**
   * Conecta ao WebSocket para comunicação em tempo real
   */
  connectWebSocket(onMessage?: (data: any) => void): void {
    const wsUrl = this.baseUrl.replace('http', 'ws');

    try {
      this.wsConnection = new WebSocket(wsUrl);

      this.wsConnection.onopen = () => {
        logger.info('WebSocket connected to GENESIS');
      };

      this.wsConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          logger.info('WebSocket message received', { type: data.type });

          if (onMessage) {
            onMessage(data);
          }

          // Chama callbacks específicos
          this.messageCallbacks.forEach(callback => callback(data));
        } catch (error) {
          logger.error('Failed to parse WebSocket message', { error });
        }
      };

      this.wsConnection.onerror = (error) => {
        logger.error('WebSocket error', { error });
      };

      this.wsConnection.onclose = () => {
        logger.warn('WebSocket disconnected');
        // Reconectar após 5s
        setTimeout(() => this.connectWebSocket(onMessage), 5000);
      };
    } catch (error) {
      logger.error('Failed to connect WebSocket', { error });
    }
  }

  /**
   * Envia mensagem via WebSocket
   */
  sendWebSocketMessage(data: any): void {
    if (this.wsConnection?.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify(data));
      logger.info('WebSocket message sent', { type: data.type });
    } else {
      logger.warn('WebSocket not connected, cannot send message');
    }
  }

  /**
   * Registra callback para mensagens WebSocket
   */
  onWebSocketMessage(callback: (data: any) => void): () => void {
    const id = Math.random().toString(36).substring(7);
    this.messageCallbacks.set(id, callback);

    // Retorna função para remover callback
    return () => {
      this.messageCallbacks.delete(id);
    };
  }

  /**
   * Desconecta WebSocket
   */
  disconnectWebSocket(): void {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
      logger.info('WebSocket disconnected');
    }
  }

  /**
   * Busca tarefas pendentes
   */
  async getPendingTasks(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tasks/pending`);

      if (!response.ok) {
        throw new Error(`Failed to fetch pending tasks: ${response.statusText}`);
      }

      const tasks = await response.json();
      return tasks;
    } catch (error) {
      logger.error('Failed to fetch pending tasks', { error });
      return [];
    }
  }

  /**
   * Busca métricas do sistema
   */
  async getMetrics(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/metrics`);

      if (!response.ok) {
        throw new Error(`Failed to fetch metrics: ${response.statusText}`);
      }

      const metrics = await response.json();
      return metrics;
    } catch (error) {
      logger.error('Failed to fetch metrics', { error });
      return null;
    }
  }
}

// Exporta instância singleton
export const genesisClient = new GenesisClientService();

/**
 * Hook para usar GENESIS Client em componentes React
 */
export function useGenesisClient() {
  return genesisClient;
}
