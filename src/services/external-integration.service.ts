import {
  ExternalIntegration,
  IntegrationType,
  IntegrationStatus,
  IntegrationExecution,
  ExecutionStatus,
  BatchOperation,
  BatchStatus,
  SyncConfiguration,
  SyncExecution,
  APIGatewayConfig,
  AuthenticationConfig,
  IntegrationEndpoint,
  WebhookConfig,
  ExecutionRequest,
  ExecutionResponse,
  ExecutionError,
  BatchItem,
  SyncConflict,
} from '@/types/external-integration';
import { api } from './api';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export class ExternalIntegrationService {
  private static instance: ExternalIntegrationService;
  private baseUrl = '/api/integrations';
  private httpClients: Map<string, AxiosInstance> = new Map();
  private activeConnections: Map<string, any> = new Map();

  private constructor() {}

  public static getInstance(): ExternalIntegrationService {
    if (!ExternalIntegrationService.instance) {
      ExternalIntegrationService.instance = new ExternalIntegrationService();
    }
    return ExternalIntegrationService.instance;
  }

  // Integration Management
  public async createIntegration(
    integration: Omit<ExternalIntegration, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ExternalIntegration> {
    try {
      const response = await api.post(`${this.baseUrl}`, {
        ...integration,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Initialize HTTP client for the integration
      await this.initializeHttpClient(response.data);

      return response.data;
    } catch (error) {
      console.error('Erro ao criar integração:', error);
      throw new Error('Falha ao criar integração');
    }
  }

  public async updateIntegration(
    id: string,
    updates: Partial<ExternalIntegration>
  ): Promise<ExternalIntegration> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, {
        ...updates,
        updatedAt: new Date(),
      });

      // Reinitialize HTTP client if configuration changed
      if (updates.configuration || updates.authentication) {
        await this.initializeHttpClient(response.data);
      }

      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar integração:', error);
      throw new Error('Falha ao atualizar integração');
    }
  }

  public async getIntegration(id: string): Promise<ExternalIntegration> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter integração:', error);
      throw new Error('Integração não encontrada');
    }
  }

  public async listIntegrations(filters?: {
    type?: IntegrationType;
    status?: IntegrationStatus;
    provider?: string;
  }): Promise<ExternalIntegration[]> {
    try {
      const response = await api.get(`${this.baseUrl}`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar integrações:', error);
      throw new Error('Falha ao carregar integrações');
    }
  }

  public async deleteIntegration(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);

      // Clean up HTTP client
      this.httpClients.delete(id);
      this.activeConnections.delete(id);
    } catch (error) {
      console.error('Erro ao excluir integração:', error);
      throw new Error('Falha ao excluir integração');
    }
  }

  public async testIntegration(
    id: string
  ): Promise<{ success: boolean; message: string; responseTime?: number }> {
    try {
      const response = await api.post(`${this.baseUrl}/${id}/test`);
      return response.data;
    } catch (error) {
      console.error('Erro ao testar integração:', error);
      throw new Error('Falha ao testar integração');
    }
  }

  // Execution Management
  public async executeEndpoint(
    integrationId: string,
    endpointId: string,
    parameters?: Record<string, any>,
    body?: any
  ): Promise<IntegrationExecution> {
    try {
      const startTime = new Date();
      const correlationId = crypto.randomUUID();

      // Get integration and endpoint configuration
      const integration = await this.getIntegration(integrationId);
      const endpoint = integration.endpoints.find(e => e.id === endpointId);

      if (!endpoint) {
        throw new Error('Endpoint não encontrado');
      }

      // Prepare request
      const request: ExecutionRequest = {
        method: endpoint.method,
        url: this.buildUrl(integration.configuration.baseUrl, endpoint.path, parameters),
        headers: { ...endpoint.headers },
        body,
        parameters: parameters || {},
      };

      // Add authentication headers
      await this.addAuthenticationHeaders(integration.authentication, request);

      // Execute request
      const httpClient = this.getHttpClient(integrationId);
      let response: AxiosResponse;
      let executionError: ExecutionError | undefined;

      try {
        const axiosConfig: AxiosRequestConfig = {
          method: endpoint.method.toLowerCase() as any,
          url: request.url,
          headers: request.headers,
          data: request.body,
          timeout: endpoint.timeout || integration.configuration.timeout,
        };

        response = await httpClient.request(axiosConfig);
      } catch (error: any) {
        executionError = {
          code: error.code || 'EXECUTION_ERROR',
          message: error.message,
          details: error.response?.data,
          stack: error.stack,
        };
      }

      // Create execution record
      const execution: IntegrationExecution = {
        id: crypto.randomUUID(),
        integrationId,
        endpointId,
        status: executionError ? ExecutionStatus.FAILED : ExecutionStatus.SUCCESS,
        startTime,
        endTime: new Date(),
        duration: Date.now() - startTime.getTime(),
        request,
        response: response
          ? {
              status: response.status,
              headers: response.headers as Record<string, string>,
              body: response.data,
              size: JSON.stringify(response.data).length,
            }
          : undefined,
        error: executionError,
        retryCount: 0,
        metadata: {
          userAgent: 'Tributa.AI Integration Service',
          clientIp: '127.0.0.1',
          correlationId,
          tags: [integration.type, endpoint.name],
        },
      };

      // Save execution record
      await this.saveExecution(execution);

      return execution;
    } catch (error) {
      console.error('Erro ao executar endpoint:', error);
      throw new Error('Falha na execução do endpoint');
    }
  }

  public async getExecution(id: string): Promise<IntegrationExecution> {
    try {
      const response = await api.get(`${this.baseUrl}/executions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter execução:', error);
      throw new Error('Execução não encontrada');
    }
  }

  public async listExecutions(
    integrationId?: string,
    filters?: {
      status?: ExecutionStatus;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    }
  ): Promise<IntegrationExecution[]> {
    try {
      const params = {
        integrationId,
        ...filters,
      };
      const response = await api.get(`${this.baseUrl}/executions`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar execuções:', error);
      throw new Error('Falha ao carregar execuções');
    }
  }

  // Batch Operations
  public async createBatchOperation(
    integrationId: string,
    operation: Omit<BatchOperation, 'id' | 'createdAt' | 'status' | 'progress' | 'results'>
  ): Promise<BatchOperation> {
    try {
      const response = await api.post(`${this.baseUrl}/${integrationId}/batch`, {
        ...operation,
        status: BatchStatus.QUEUED,
        createdAt: new Date(),
      });

      // Start processing in background
      this.processBatchOperation(response.data.id);

      return response.data;
    } catch (error) {
      console.error('Erro ao criar operação em lote:', error);
      throw new Error('Falha ao criar operação em lote');
    }
  }

  public async getBatchOperation(id: string): Promise<BatchOperation> {
    try {
      const response = await api.get(`${this.baseUrl}/batch/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter operação em lote:', error);
      throw new Error('Operação não encontrada');
    }
  }

  public async cancelBatchOperation(id: string): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/batch/${id}/cancel`);
    } catch (error) {
      console.error('Erro ao cancelar operação em lote:', error);
      throw new Error('Falha ao cancelar operação');
    }
  }

  // Synchronization
  public async createSyncConfiguration(
    config: Omit<SyncConfiguration, 'id'>
  ): Promise<SyncConfiguration> {
    try {
      const response = await api.post(`${this.baseUrl}/sync/configurations`, config);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar configuração de sincronização:', error);
      throw new Error('Falha ao criar configuração de sincronização');
    }
  }

  public async executeSyncConfiguration(id: string): Promise<SyncExecution> {
    try {
      const response = await api.post(`${this.baseUrl}/sync/configurations/${id}/execute`);
      return response.data;
    } catch (error) {
      console.error('Erro ao executar sincronização:', error);
      throw new Error('Falha ao executar sincronização');
    }
  }

  public async getSyncExecution(id: string): Promise<SyncExecution> {
    try {
      const response = await api.get(`${this.baseUrl}/sync/executions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter execução de sincronização:', error);
      throw new Error('Execução não encontrada');
    }
  }

  public async resolveSyncConflict(
    executionId: string,
    conflictId: string,
    resolution: 'source' | 'target' | 'merge' | 'manual',
    resolvedValue?: any
  ): Promise<void> {
    try {
      await api.post(
        `${this.baseUrl}/sync/executions/${executionId}/conflicts/${conflictId}/resolve`,
        {
          resolution,
          resolvedValue,
        }
      );
    } catch (error) {
      console.error('Erro ao resolver conflito:', error);
      throw new Error('Falha ao resolver conflito');
    }
  }

  // Webhook Management
  public async createWebhook(
    integrationId: string,
    webhook: Omit<WebhookConfig, 'id'>
  ): Promise<WebhookConfig> {
    try {
      const response = await api.post(`${this.baseUrl}/${integrationId}/webhooks`, webhook);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar webhook:', error);
      throw new Error('Falha ao criar webhook');
    }
  }

  public async processWebhook(
    integrationId: string,
    webhookId: string,
    payload: any
  ): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/${integrationId}/webhooks/${webhookId}/process`, payload);
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      throw new Error('Falha ao processar webhook');
    }
  }

  // Monitoring and Health Checks
  public async getIntegrationHealth(id: string): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: Array<{
      name: string;
      status: 'pass' | 'fail';
      message?: string;
      responseTime?: number;
    }>;
    lastCheck: Date;
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}/health`);
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar saúde da integração:', error);
      throw new Error('Falha ao verificar saúde da integração');
    }
  }

  public async getIntegrationMetrics(
    id: string,
    period: 'hour' | 'day' | 'week' | 'month' = 'day'
  ): Promise<{
    executions: number;
    successRate: number;
    averageResponseTime: number;
    errorRate: number;
    throughput: number;
    errors: Array<{
      code: string;
      count: number;
      percentage: number;
    }>;
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}/metrics`, { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter métricas da integração:', error);
      throw new Error('Falha ao obter métricas');
    }
  }

  // API Gateway
  public async createAPIGateway(config: Omit<APIGatewayConfig, 'id'>): Promise<APIGatewayConfig> {
    try {
      const response = await api.post(`${this.baseUrl}/gateway`, config);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar API Gateway:', error);
      throw new Error('Falha ao criar API Gateway');
    }
  }

  public async proxyRequest(
    gatewayId: string,
    path: string,
    method: string,
    headers: Record<string, string>,
    body?: any
  ): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/gateway/${gatewayId}/proxy${path}`, {
        method: method.toUpperCase(),
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`Gateway request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no proxy request:', error);
      throw error;
    }
  }

  // Utility Methods
  private async initializeHttpClient(integration: ExternalIntegration): Promise<void> {
    const client = axios.create({
      baseURL: integration.configuration.baseUrl,
      timeout: integration.configuration.timeout,
      headers: {
        'User-Agent': 'Tributa.AI Integration Service',
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptors
    client.interceptors.request.use(
      async config => {
        // Add authentication
        await this.addAuthenticationToConfig(integration.authentication, config);

        // Add rate limiting
        await this.enforceRateLimit(integration.id, integration.rateLimits);

        return config;
      },
      error => Promise.reject(error)
    );

    // Add response interceptors
    client.interceptors.response.use(
      response => response,
      async error => {
        // Handle token refresh
        if (
          error.response?.status === 401 &&
          integration.authentication.tokenManagement.autoRefresh
        ) {
          await this.refreshToken(integration.id);
          return client.request(error.config);
        }

        return Promise.reject(error);
      }
    );

    this.httpClients.set(integration.id, client);
  }

  private getHttpClient(integrationId: string): AxiosInstance {
    const client = this.httpClients.get(integrationId);
    if (!client) {
      throw new Error('Cliente HTTP não inicializado para a integração');
    }
    return client;
  }

  private buildUrl(baseUrl: string, path: string, parameters?: Record<string, any>): string {
    let url = `${baseUrl}${path}`;

    if (parameters) {
      // Replace path parameters
      Object.entries(parameters).forEach(([key, value]) => {
        url = url.replace(`{${key}}`, encodeURIComponent(String(value)));
      });

      // Add query parameters
      const queryParams = Object.entries(parameters)
        .filter(([key]) => !path.includes(`{${key}}`))
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');

      if (queryParams) {
        url += `?${queryParams}`;
      }
    }

    return url;
  }

  private async addAuthenticationHeaders(
    auth: AuthenticationConfig,
    request: ExecutionRequest
  ): Promise<void> {
    switch (auth.type) {
      case 'API_KEY':
        if (auth.credentials.apiKey) {
          request.headers['X-API-Key'] = auth.credentials.apiKey;
        }
        break;

      case 'BEARER_TOKEN':
        if (auth.credentials.token) {
          request.headers['Authorization'] = `Bearer ${auth.credentials.token}`;
        }
        break;

      case 'BASIC_AUTH':
        if (auth.credentials.username && auth.credentials.password) {
          const credentials = Buffer.from(
            `${auth.credentials.username}:${auth.credentials.password}`
          ).toString('base64');
          request.headers['Authorization'] = `Basic ${credentials}`;
        }
        break;

      case 'OAUTH2':
        // Handle OAuth2 token
        const token = await this.getOAuth2Token(auth);
        if (token) {
          request.headers['Authorization'] = `Bearer ${token}`;
        }
        break;
    }
  }

  private async addAuthenticationToConfig(
    auth: AuthenticationConfig,
    config: AxiosRequestConfig
  ): Promise<void> {
    // Similar to addAuthenticationHeaders but for AxiosRequestConfig
    if (!config.headers) config.headers = {};

    const request: ExecutionRequest = {
      method: config.method?.toUpperCase() || 'GET',
      url: config.url || '',
      headers: config.headers as Record<string, string>,
      parameters: {},
    };

    await this.addAuthenticationHeaders(auth, request);
    config.headers = request.headers;
  }

  private async getOAuth2Token(auth: AuthenticationConfig): Promise<string | null> {
    try {
      if (!auth.tokenManagement.tokenUrl) {
        return auth.credentials.token || null;
      }

      const response = await axios.post(auth.tokenManagement.tokenUrl, {
        grant_type: 'client_credentials',
        client_id: auth.credentials.clientId,
        client_secret: auth.credentials.clientSecret,
        scope: auth.tokenManagement.scope?.join(' '),
      });

      return response.data.access_token;
    } catch (error) {
      console.error('Erro ao obter token OAuth2:', error);
      return null;
    }
  }

  private async refreshToken(integrationId: string): Promise<void> {
    // Implement token refresh logic
    console.log('Refreshing token for integration:', integrationId);
  }

  private async enforceRateLimit(integrationId: string, rateLimits: any): Promise<void> {
    // Implement rate limiting logic
    console.log('Enforcing rate limit for integration:', integrationId);
  }

  private async saveExecution(execution: IntegrationExecution): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/executions`, execution);
    } catch (error) {
      console.error('Erro ao salvar execução:', error);
    }
  }

  private async processBatchOperation(batchId: string): Promise<void> {
    // Implement batch processing logic in background
    console.log('Processing batch operation:', batchId);
  }

  // Government System Integrations
  public async consultarReceitaFederal(cpfCnpj: string, tipo: 'cpf' | 'cnpj'): Promise<any> {
    const integrationId = 'receita-federal-integration';
    const endpointId = tipo === 'cpf' ? 'consultar-cpf' : 'consultar-cnpj';

    return this.executeEndpoint(integrationId, endpointId, { [tipo]: cpfCnpj });
  }

  public async consultarSefaz(uf: string, inscricaoEstadual: string): Promise<any> {
    const integrationId = `sefaz-${uf.toLowerCase()}-integration`;
    const endpointId = 'consultar-inscricao';

    return this.executeEndpoint(integrationId, endpointId, { inscricaoEstadual });
  }

  public async consultarSerasa(documento: string): Promise<any> {
    const integrationId = 'serasa-integration';
    const endpointId = 'consultar-documento';

    return this.executeEndpoint(integrationId, endpointId, { documento });
  }

  // Blockchain Integrations
  public async submitToBlockchain(network: string, transaction: any): Promise<any> {
    const integrationId = `blockchain-${network}-integration`;
    const endpointId = 'submit-transaction';

    return this.executeEndpoint(integrationId, endpointId, {}, transaction);
  }

  public async queryBlockchain(network: string, query: any): Promise<any> {
    const integrationId = `blockchain-${network}-integration`;
    const endpointId = 'query-ledger';

    return this.executeEndpoint(integrationId, endpointId, query);
  }

  // Add missing methods for API compatibility
  public async listarIntegracoes(filtros?: {
    tipo?: string;
    status?: string;
    ativo?: boolean;
  }): Promise<ExternalIntegration[]> {
    return this.listIntegrations(filtros);
  }

  public async criarIntegracao(
    integracao: Omit<ExternalIntegration, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ExternalIntegration> {
    return this.createIntegration(integracao);
  }

  public async obterIntegracao(id: string): Promise<ExternalIntegration | null> {
    try {
      return await this.getIntegration(id);
    } catch (error) {
      return null;
    }
  }

  public async atualizarIntegracao(
    id: string,
    dados: Partial<ExternalIntegration>,
    userId?: string
  ): Promise<ExternalIntegration> {
    return this.updateIntegration(id, dados);
  }

  public async removerIntegracao(id: string, userId?: string): Promise<boolean> {
    try {
      await this.deleteIntegration(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  public async testarIntegracao(
    id: string,
    endpoint?: string,
    dados?: any,
    configuracao?: any
  ): Promise<any> {
    return this.testIntegration(id);
  }

  public async sincronizarDados(
    id: string,
    tipo?: string,
    configuracao?: any,
    forcado?: boolean
  ): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}/${id}/sync`, {
        tipo,
        configuracao,
        forcado,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao sincronizar dados:', error);
      throw error;
    }
  }

  public async obterStatusSincronizacao(id: string): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}/sync/status`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter status de sincronização:', error);
      throw error;
    }
  }

  public async processarWebhook(
    integrationId: string,
    eventType: string,
    dados: any,
    timestamp?: Date
  ): Promise<any> {
    return this.processWebhook(integrationId, 'webhook-id', dados);
  }

  public async listarWebhooksRecebidos(filtros?: {
    integrationId?: string;
    limit?: number;
    offset?: number;
  }): Promise<any[]> {
    try {
      const response = await api.get(`${this.baseUrl}/webhooks`, { params: filtros });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar webhooks recebidos:', error);
      throw error;
    }
  }
}
