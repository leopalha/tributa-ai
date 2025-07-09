import { api } from '@/lib/api';
import {
  PaymentDetails,
  PaymentRequest,
  WalletBalance,
  WalletPaymentMethod,
  WalletReferenceType,
  WalletTransaction,
  WalletTransactionStatus,
  WalletTransactionType,
  BlockchainTransaction,
  WalletAnalyticsData
} from '@/types/wallet';
import { FormaPagamento } from '@/types/prisma';

export class WalletService {
  // Obter saldo da carteira
  async getBalance(): Promise<WalletBalance> {
    try {
      const response = await api.get<WalletBalance>('/wallet/balance');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter saldo da carteira:', error);
      // Retornar um saldo zerado em caso de erro
      return {
        id: '',
        userId: '',
        balance: 0,
        availableBalance: 0,
        pendingBalance: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  }

  // Obter histórico de transações
  async getTransactions(limit: number = 10, offset: number = 0): Promise<WalletTransaction[]> {
    try {
      const response = await api.get<WalletTransaction[]>('/wallet/transactions', {
        params: { limit, offset },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter transações:', error);
      return [];
    }
  }

  // Criar uma solicitação de depósito
  async createDeposit(
    amount: number,
    paymentMethod: FormaPagamento
  ): Promise<{ paymentDetails: PaymentDetails; transactionId: string }> {
    try {
      const response = await api.post<{ paymentDetails: PaymentDetails; transactionId: string }>(
        '/wallet/deposit',
        {
          amount,
          paymentMethod,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao criar depósito:', error);
      throw error;
    }
  }

  // Solicitar um saque
  async requestWithdrawal(
    amount: number,
    paymentMethod: FormaPagamento,
    paymentDetails: Partial<PaymentDetails>
  ): Promise<{ transactionId: string }> {
    try {
      const response = await api.post<{ transactionId: string }>('/wallet/withdrawal', {
        amount,
        paymentMethod,
        paymentDetails,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao solicitar saque:', error);
      throw error;
    }
  }

  // Processar pagamento de taxa
  async payFee(
    amount: number,
    description: string,
    referenceId: string,
    referenceType: WalletReferenceType,
    useWalletBalance: boolean = true
  ): Promise<{ success: boolean; transaction?: WalletTransaction; paymentRequest?: PaymentRequest }> {
    try {
      const response = await api.post<{
        success: boolean;
        transaction?: WalletTransaction;
        paymentRequest?: PaymentRequest;
      }>('/wallet/pay-fee', {
        amount,
        description,
        referenceId,
        referenceType,
        useWalletBalance,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao processar pagamento de taxa:', error);
      throw error;
    }
  }

  // Verificar status de uma transação
  async checkTransactionStatus(transactionId: string): Promise<WalletTransactionStatus> {
    try {
      const response = await api.get<{ status: WalletTransactionStatus }>(
        `/wallet/transaction/${transactionId}/status`
      );
      return response.data.status;
    } catch (error) {
      console.error('Erro ao verificar status da transação:', error);
      return WalletTransactionStatus.FAILED;
    }
  }

  // Obter métodos de pagamento salvos
  async getSavedPaymentMethods(): Promise<WalletPaymentMethod[]> {
    try {
      const response = await api.get<WalletPaymentMethod[]>('/wallet/payment-methods');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter métodos de pagamento:', error);
      return [];
    }
  }

  // Adicionar um novo método de pagamento
  async addPaymentMethod(
    type: FormaPagamento,
    details: any,
    isDefault: boolean = false
  ): Promise<WalletPaymentMethod> {
    try {
      const response = await api.post<WalletPaymentMethod>('/wallet/payment-methods', {
        type,
        details,
        isDefault,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar método de pagamento:', error);
      throw error;
    }
  }

  // Simular pagamento (para ambiente de desenvolvimento)
  async simulatePayment(
    transactionId: string,
    status: WalletTransactionStatus = WalletTransactionStatus.COMPLETED
  ): Promise<{ success: boolean }> {
    try {
      const response = await api.post<{ success: boolean }>(`/wallet/simulate-payment`, {
        transactionId,
        status,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao simular pagamento:', error);
      return { success: false };
    }
  }

  /**
   * Obter transações da blockchain
   */
  async getBlockchainTransactions(): Promise<BlockchainTransaction[]> {
    try {
      // Em um ambiente real, isso faria uma chamada à API
      // const response = await api.get('/api/wallet/blockchain-transactions');
      // return response.data;
      
      // Dados simulados para desenvolvimento
      return this.generateMockBlockchainTransactions();
    } catch (error) {
      console.error('Erro ao obter transações blockchain:', error);
      throw new Error('Não foi possível obter as transações da blockchain');
    }
  }

  /**
   * Obter dados analíticos da carteira
   */
  async getWalletAnalytics(): Promise<WalletAnalyticsData> {
    try {
      // Em um ambiente real, isso faria uma chamada à API
      // const response = await api.get('/api/wallet/analytics');
      // return response.data;
      
      // Dados simulados para desenvolvimento
      return this.generateMockWalletAnalytics();
    } catch (error) {
      console.error('Erro ao obter dados analíticos:', error);
      throw new Error('Não foi possível obter os dados analíticos da carteira');
    }
  }

  /**
   * Gerar transações blockchain simuladas
   */
  private generateMockBlockchainTransactions(): BlockchainTransaction[] {
    const types = ['SEND', 'RECEIVE', 'CONTRACT_INTERACTION'] as const;
    const statuses = ['SUCCESS', 'FAILED', 'PENDING'] as const;
    
    return Array.from({ length: 10 }, (_, i) => {
      const type = types[Math.floor(Math.random() * types.length)];
      const now = new Date();
      now.setHours(now.getHours() - i);
      
      return {
        id: `tx-${i}`,
        hash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
        blockNumber: 15000000 - i,
        timestamp: now.toISOString(),
        from: `0x${Math.random().toString(16).substring(2, 42)}`,
        to: `0x${Math.random().toString(16).substring(2, 42)}`,
        value: Math.random() * 10000,
        fee: Math.random() * 10,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        type,
      };
    });
  }

  /**
   * Gerar dados analíticos simulados
   */
  private generateMockWalletAnalytics(): WalletAnalyticsData {
    // Histórico de saldo
    const balanceHistory = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      
      return {
        date: date.toISOString().split('T')[0],
        balance: 5000 + Math.random() * 10000 - (29 - i) * 50 + (29 - i) * (29 - i) * 2,
      };
    });

    // Transações por categoria
    const transactionsByCategory = [
      { category: "Depósitos", amount: 12500 },
      { category: "Saques", amount: 8750 },
      { category: "Taxas", amount: 1200 },
      { category: "Recompensas", amount: 850 },
      { category: "Outros", amount: 350 },
    ];

    // Atividade mensal
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
    const monthlyActivity = months.map(month => ({
      month,
      deposits: Math.floor(Math.random() * 5000) + 1000,
      withdrawals: Math.floor(Math.random() * 4000) + 500,
    }));

    return {
      balanceHistory,
      transactionsByCategory,
      monthlyActivity,
      totalDeposits: 12500,
      totalWithdrawals: 8750,
      averageTransaction: 1850,
      transactionGrowth: 12.5,
    };
  }
}