import { useState, useCallback, useEffect } from 'react';
import { WalletService } from '@/services/wallet.service';
import {
  WalletBalance,
  WalletTransaction,
  WalletPaymentMethod,
  WalletReferenceType,
  WalletTransactionStatus,
  BlockchainTransaction,
  WalletAnalyticsData
} from '@/types/wallet';
import { FormaPagamento } from '@/types/prisma';
import { useToast } from '@/components/ui/use-toast';

// Instanciar o serviço
const walletService = new WalletService();

export function useWallet() {
  const { toast } = useToast();
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<WalletPaymentMethod[]>([]);
  const [blockchainTransactions, setBlockchainTransactions] = useState<BlockchainTransaction[]>([]);
  const [analyticsData, setAnalyticsData] = useState<WalletAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Função para forçar atualização dos dados
  const refreshWallet = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Carregar saldo
  const loadBalance = useCallback(async () => {
    setLoading(true);
    try {
      const data = await walletService.getBalance();
      setBalance(data);
    } catch (error) {
      console.error('Erro ao carregar saldo:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar transações
  const loadTransactions = useCallback(async (limit = 10, offset = 0) => {
    setLoading(true);
    try {
      const data = await walletService.getTransactions(limit, offset);
      setTransactions(data);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar métodos de pagamento
  const loadPaymentMethods = useCallback(async () => {
    setLoading(true);
    try {
      const data = await walletService.getSavedPaymentMethods();
      setPaymentMethods(data);
    } catch (error) {
      console.error('Erro ao carregar métodos de pagamento:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obter transações da blockchain
  const getBlockchainTransactions = useCallback(async () => {
    try {
      const data = await walletService.getBlockchainTransactions();
      setBlockchainTransactions(data);
      return data;
    } catch (error) {
      console.error('Erro ao carregar transações blockchain:', error);
      throw error;
    }
  }, []);

  // Obter dados analíticos da carteira
  const getWalletAnalytics = useCallback(async () => {
    try {
      const data = await walletService.getWalletAnalytics();
      setAnalyticsData(data);
      return data;
    } catch (error) {
      console.error('Erro ao carregar dados analíticos:', error);
      throw error;
    }
  }, []);

  // Criar depósito
  const createDeposit = useCallback(
    async (amount: number, paymentMethod: FormaPagamento) => {
      setLoading(true);
      try {
        const result = await walletService.createDeposit(amount, paymentMethod);
        toast({
          title: 'Depósito criado',
          description: 'Siga as instruções para concluir o depósito.',
        });
        refreshWallet();
        return result;
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Erro ao criar depósito',
          description: error.message || 'Tente novamente mais tarde.',
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast, refreshWallet]
  );

  // Solicitar saque
  const requestWithdrawal = useCallback(
    async (amount: number, paymentMethod: FormaPagamento, paymentDetails: any) => {
      setLoading(true);
      try {
        const result = await walletService.requestWithdrawal(amount, paymentMethod, paymentDetails);
        toast({
          title: 'Solicitação de saque enviada',
          description: 'O processamento pode levar até 2 dias úteis.',
        });
        refreshWallet();
        return result;
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Erro ao solicitar saque',
          description: error.message || 'Tente novamente mais tarde.',
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast, refreshWallet]
  );

  // Pagar taxa
  const payFee = useCallback(
    async (
      amount: number,
      description: string,
      referenceId: string,
      referenceType: WalletReferenceType,
      useWalletBalance: boolean = true
    ) => {
      setLoading(true);
      try {
        const result = await walletService.payFee(
          amount,
          description,
          referenceId,
          referenceType,
          useWalletBalance
        );
        
        if (result.success) {
          toast({
            title: 'Pagamento processado',
            description: 'Taxa paga com sucesso.',
          });
        } else if (result.paymentRequest) {
          toast({
            title: 'Pagamento pendente',
            description: 'Siga as instruções para concluir o pagamento da taxa.',
          });
        }
        
        refreshWallet();
        return result;
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Erro ao processar pagamento',
          description: error.message || 'Tente novamente mais tarde.',
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast, refreshWallet]
  );

  // Adicionar método de pagamento
  const addPaymentMethod = useCallback(
    async (type: FormaPagamento, details: any, isDefault: boolean = false) => {
      setLoading(true);
      try {
        const result = await walletService.addPaymentMethod(type, details, isDefault);
        toast({
          title: 'Método de pagamento adicionado',
          description: 'Seu novo método de pagamento foi salvo com sucesso.',
        });
        loadPaymentMethods();
        return result;
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Erro ao adicionar método de pagamento',
          description: error.message || 'Tente novamente mais tarde.',
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast, loadPaymentMethods]
  );

  // Verificar status da transação
  const checkTransactionStatus = useCallback(async (transactionId: string) => {
    try {
      return await walletService.checkTransactionStatus(transactionId);
    } catch (error) {
      console.error('Erro ao verificar status da transação:', error);
      return WalletTransactionStatus.FAILED;
    }
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    loadBalance();
    loadTransactions();
    loadPaymentMethods();
  }, [loadBalance, loadTransactions, loadPaymentMethods, refreshTrigger]);

  return {
    balance,
    transactions,
    paymentMethods,
    blockchainTransactions,
    analyticsData,
    loading,
    createDeposit,
    requestWithdrawal,
    payFee,
    addPaymentMethod,
    checkTransactionStatus,
    refreshWallet,
    loadMoreTransactions: loadTransactions,
    getBlockchainTransactions,
    getWalletAnalytics
  };
}