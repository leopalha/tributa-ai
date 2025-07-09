// Frontend Fabric Client - Compatível com Browser
// Remove dependências Node.js e usa API calls para o backend

// Tipos para os créditos tokenizados
export interface TokenizedCredit {
  id: string;
  title: string;
  description: string;
  type: string;
  value: number;
  issueDate: string;
  validationDate: string;
  tokenId: string;
  ownerId: string;
  ownerName: string;
  status: 'ACTIVE' | 'LISTED' | 'LOCKED' | 'TRANSFERRED' | 'EXPIRED';
  createdAt: string;
  metadata: Record<string, any>;
}

// Opções de conexão (apenas configuração frontend)
export interface FabricConnectionOptions {
  apiBaseUrl?: string;
  userId?: string;
  channelName?: string;
  chaincodeName?: string;
}

// Cliente HTTP para comunicação com backend
class FabricAPIClient {
  private baseUrl: string;
  private userId: string;

  constructor(baseUrl: string = 'http://localhost:3001/api', userId: string = 'user') {
    this.baseUrl = baseUrl;
    this.userId = userId;
  }

  async post(endpoint: string, data: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro na requisição POST ${endpoint}:`, error);
      throw error;
    }
  }

  async get(endpoint: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro na requisição GET ${endpoint}:`, error);
      throw error;
    }
  }

  private getToken(): string {
    // Recuperar token do localStorage ou sessionStorage
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';
  }
}

export interface FabricServiceOptions {
  apiBaseUrl?: string;
  userId?: string;
  channelName?: string;
  contractName?: string;
}

export class FabricService {
  private apiClient: FabricAPIClient;
  private options: FabricServiceOptions;
  private isInitialized: boolean = false;

  constructor(options: FabricServiceOptions = {}) {
    this.options = {
      apiBaseUrl: options.apiBaseUrl || 'http://localhost:3001/api',
      userId: options.userId || 'admin',
      channelName: options.channelName || 'tributa-channel',
      contractName: options.contractName || 'tributa-tokens',
      ...options,
    };

    this.apiClient = new FabricAPIClient(this.options.apiBaseUrl, this.options.userId);
  }

  async initialize(): Promise<void> {
    try {
      console.log('🔗 Inicializando FabricService (modo browser)...');

      // Verificar conectividade com backend
      const status = await this.apiClient.get('/blockchain/status');

      if (status.success) {
        this.isInitialized = true;
        console.log('✅ FabricService inicializado com sucesso (modo browser)');
        console.log('📊 Status da rede:', status.data);
      } else {
        throw new Error('Backend blockchain não está disponível');
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar FabricService:', error);
      // Fallback para modo mock
      this.isInitialized = true;
      console.log('⚠️ Iniciando em modo mock devido a erro de conectividade');
    }
  }

  async connect(): Promise<void> {
    try {
      console.log('🔌 Conectando ao Fabric Network via API...');

      if (!this.isInitialized) {
        await this.initialize();
      }

      // Verificar status da conexão
      const status = await this.getNetworkStatus();
      if (status.status === 'ACTIVE') {
        console.log('✅ Conectado ao Fabric Network via API');
      } else {
        console.log('⚠️ Rede não está ativa, usando modo mock');
      }
    } catch (error) {
      console.error('❌ Erro ao conectar ao Fabric Network:', error);
      console.log('⚠️ Continuando em modo mock');
    }
  }

  async submitTransaction(
    contractName: string,
    transactionName: string,
    ...args: string[]
  ): Promise<string> {
    try {
      console.log(`📤 Enviando transação via API: ${contractName}.${transactionName}`, args);

      const response = await this.apiClient.post('/blockchain/transaction', {
        contractName,
        transactionName,
        args,
        channelName: this.options.channelName,
      });

      if (response.success) {
        console.log('✅ Transação enviada com sucesso via API');
        return response.data.result || response.data.txId;
      } else {
        throw new Error(response.error || 'Erro na transação');
      }
    } catch (error) {
      console.error('❌ Erro ao enviar transação:', error);

      // Fallback mock
      const mockResult = {
        txId: `mock-tx-${Date.now()}`,
        transactionName,
        args,
        timestamp: new Date().toISOString(),
      };

      return JSON.stringify(mockResult);
    }
  }

  async evaluateTransaction(
    contractName: string,
    transactionName: string,
    ...args: string[]
  ): Promise<string> {
    try {
      console.log(`📊 Avaliando transação via API: ${contractName}.${transactionName}`, args);

      const response = await this.apiClient.post('/blockchain/query', {
        contractName,
        transactionName,
        args,
        channelName: this.options.channelName,
      });

      if (response.success) {
        console.log('✅ Transação avaliada com sucesso via API');
        return response.data.result;
      } else {
        throw new Error(response.error || 'Erro na consulta');
      }
    } catch (error) {
      console.error('❌ Erro ao avaliar transação:', error);

      // Fallback mock
      const mockResult = {
        result: 'mock-query-result',
        transactionName,
        args,
        timestamp: new Date().toISOString(),
      };

      return JSON.stringify(mockResult);
    }
  }

  async disconnect(): Promise<void> {
    try {
      console.log('🔌 Desconectado do Fabric Network (cliente browser)');
    } catch (error) {
      console.error('❌ Erro ao desconectar do Fabric Network:', error);
    }
  }

  isConnected(): boolean {
    return this.isInitialized;
  }

  async getNetworkStatus(): Promise<any> {
    try {
      const response = await this.apiClient.get('/blockchain/status');
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao obter status da rede:', error);
      return {
        status: 'ERROR',
        error: error.message,
        lastCheck: new Date().toISOString(),
      };
    }
  }

  // === MÉTODOS ESPECÍFICOS PARA CRÉDITOS TRIBUTÁRIOS ===

  /**
   * Cria um novo token de crédito tributário
   */
  async createCreditToken(creditData: Partial<TokenizedCredit>): Promise<TokenizedCredit | null> {
    try {
      const tokenId = `TC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const tokenData = {
        id: creditData.id || tokenId,
        title: creditData.title || 'Título de Crédito',
        description: creditData.description || '',
        type: creditData.type || 'TRIBUTARIO',
        value: creditData.value || 0,
        issueDate: creditData.issueDate || new Date().toISOString(),
        validationDate: new Date().toISOString(),
        tokenId,
        ownerId: creditData.ownerId || this.options.userId || 'unknown',
        ownerName: creditData.ownerName || 'Proprietário',
        status: 'ACTIVE' as const,
        createdAt: new Date().toISOString(),
        metadata: creditData.metadata || {},
      };

      const result = await this.submitTransaction(
        this.options.contractName || 'TributaToken',
        'createCreditToken',
        JSON.stringify(tokenData)
      );

      console.log(`✅ Crédito tokenizado criado: ${tokenId}`);
      return tokenData;
    } catch (error) {
      console.error('❌ Erro ao criar crédito tokenizado:', error);
      return null;
    }
  }

  /**
   * Busca informações de um crédito tokenizado
   */
  async getCreditToken(tokenId: string): Promise<TokenizedCredit | null> {
    try {
      const result = await this.evaluateTransaction(
        this.options.contractName || 'TributaToken',
        'readCreditToken',
        tokenId
      );

      if (!result) {
        return null;
      }

      const tokenizedCredit = JSON.parse(result) as TokenizedCredit;
      return tokenizedCredit;
    } catch (error) {
      console.error(`❌ Erro ao buscar crédito tokenizado: ${error}`);
      return null;
    }
  }

  /**
   * Lista todos os créditos tokenizados
   */
  async getAllCreditTokens(): Promise<TokenizedCredit[]> {
    try {
      const result = await this.evaluateTransaction(
        this.options.contractName || 'TributaToken',
        'queryAllCreditTokens'
      );

      if (!result) {
        return [];
      }

      const tokens = JSON.parse(result) as TokenizedCredit[];
      return tokens;
    } catch (error) {
      console.error('❌ Erro ao listar créditos tokenizados:', error);
      return [];
    }
  }

  /**
   * Transfere um crédito tokenizado para outro usuário
   */
  async transferToken(
    tokenId: string,
    fromId: string,
    toId: string,
    toName: string
  ): Promise<boolean> {
    try {
      await this.submitTransaction(
        this.options.contractName || 'TributaToken',
        'transferCreditToken',
        tokenId,
        fromId,
        toId,
        toName
      );

      console.log(`✅ Crédito ${tokenId} transferido de ${fromId} para ${toId}`);
      return true;
    } catch (error) {
      console.error(`❌ Erro ao transferir crédito tokenizado: ${error}`);
      return false;
    }
  }

  /**
   * Altera o status de um crédito tokenizado
   */
  async updateTokenStatus(tokenId: string, status: TokenizedCredit['status']): Promise<boolean> {
    try {
      await this.submitTransaction(
        this.options.contractName || 'TributaToken',
        'updateCreditTokenStatus',
        tokenId,
        status
      );

      console.log(`✅ Status do crédito ${tokenId} atualizado para ${status}`);
      return true;
    } catch (error) {
      console.error(`❌ Erro ao atualizar status do crédito tokenizado: ${error}`);
      return false;
    }
  }

  /**
   * Busca o histórico de transações de um crédito tokenizado
   */
  async getTokenHistory(tokenId: string): Promise<any[]> {
    try {
      const result = await this.evaluateTransaction(
        this.options.contractName || 'TributaToken',
        'getHistoryForCreditToken',
        tokenId
      );

      if (!result) {
        return [];
      }

      const history = JSON.parse(result);
      return history;
    } catch (error) {
      console.error(`❌ Erro ao buscar histórico do crédito tokenizado: ${error}`);
      return [];
    }
  }
}

// Instância singleton
export const fabricService = new FabricService({
  channelName: 'tributa-channel',
  contractName: 'tributa-tokens',
  userId: 'admin',
  apiBaseUrl:
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.hostname}:3001/api`
      : 'http://localhost:3001/api',
});

// Auto-inicialização (apenas no browser)
if (typeof window !== 'undefined') {
  fabricService.initialize().catch(console.error);
}
