import React, { useState, useCallback, useEffect } from 'react';
import { useWallet } from '@/hooks/use-wallet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/spinner';
import { WalletTransactionType } from '@/types/wallet';
import { FormaPagamento } from '@/types/prisma';
import { WalletBalance } from './WalletBalance';
import { WalletTransactions } from './WalletTransactions';
import { WalletDeposit } from './WalletDeposit';
import { WalletWithdraw } from './WalletWithdraw';
import { WalletPaymentMethods } from './WalletPaymentMethods';
import { WalletAnalytics } from './WalletAnalytics';
import { WalletBlockchainTransactions } from './WalletBlockchainTransactions';
import { WalletTokenization } from './WalletTokenization';
import { WalletSwap } from './WalletSwap';
import { 
  RefreshCw, 
  Wallet, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  CreditCard, 
  BarChart3, 
  Blocks,
  AlertTriangle,
  Coins,
  Repeat
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function WalletDashboard() {
  const { 
    balance, 
    transactions, 
    paymentMethods,
    blockchainTransactions,
    analyticsData,
    loading, 
    createDeposit, 
    requestWithdrawal,
    addPaymentMethod,
    refreshWallet,
    getBlockchainTransactions,
    getWalletAnalytics
  } = useWallet();

  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showLowBalanceAlert, setShowLowBalanceAlert] = useState(false);
  const [loadingBlockchain, setLoadingBlockchain] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Verificar saldo baixo
  useEffect(() => {
    if (balance && balance.availableBalance < 100) {
      setShowLowBalanceAlert(true);
    } else {
      setShowLowBalanceAlert(false);
    }
  }, [balance]);

  // Atualizar dados
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      refreshWallet();
      toast({
        title: 'Dados atualizados',
        description: 'As informações da sua carteira foram atualizadas.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar os dados da carteira.',
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshWallet, toast]);

  // Carregar transações da blockchain
  const loadBlockchainTransactions = useCallback(async () => {
    setLoadingBlockchain(true);
    try {
      await getBlockchainTransactions();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar transações',
        description: 'Não foi possível carregar as transações da blockchain.',
      });
    } finally {
      setLoadingBlockchain(false);
    }
  }, [getBlockchainTransactions, toast]);

  // Carregar dados analíticos
  const loadAnalyticsData = useCallback(async () => {
    setLoadingAnalytics(true);
    try {
      await getWalletAnalytics();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar análises',
        description: 'Não foi possível carregar os dados analíticos.',
      });
    } finally {
      setLoadingAnalytics(false);
    }
  }, [getWalletAnalytics, toast]);

  // Processar depósito
  const handleDeposit = useCallback(
    async (amount: number, paymentMethod: FormaPagamento) => {
      try {
        const result = await createDeposit(amount, paymentMethod);
        toast({
          title: 'Depósito iniciado',
          description: 'Siga as instruções para concluir o depósito.',
        });
        return result;
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Erro ao processar depósito',
          description: error.message || 'Tente novamente mais tarde.',
        });
        throw error;
      }
    },
    [createDeposit, toast]
  );

  // Processar saque
  const handleWithdraw = useCallback(
    async (amount: number, paymentMethod: FormaPagamento, paymentDetails: any) => {
      try {
        const result = await requestWithdrawal(amount, paymentMethod, paymentDetails);
        toast({
          title: 'Saque solicitado',
          description: 'Sua solicitação de saque foi enviada com sucesso.',
        });
        return result;
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Erro ao processar saque',
          description: error.message || 'Tente novamente mais tarde.',
        });
        throw error;
      }
    },
    [requestWithdrawal, toast]
  );

  // Adicionar método de pagamento
  const handleAddPaymentMethod = useCallback(
    async (type: FormaPagamento, details: any, isDefault: boolean = false) => {
      try {
        return await addPaymentMethod(type, details, isDefault);
      } catch (error) {
        throw error;
      }
    },
    [addPaymentMethod]
  );

  // Conectar carteira blockchain
  const handleConnectWallet = useCallback(() => {
    // Em um ambiente real, isso usaria uma biblioteca como ethers.js ou web3.js
    // para conectar a uma carteira como MetaMask
    
    // Simulação para desenvolvimento
    setWalletConnected(true);
    setWalletAddress('0x1234567890abcdef1234567890abcdef12345678');
    
    toast({
      title: 'Carteira conectada',
      description: 'Sua carteira blockchain foi conectada com sucesso.',
    });
  }, [toast]);

  // Desconectar carteira blockchain
  const handleDisconnectWallet = useCallback(() => {
    setWalletConnected(false);
    setWalletAddress(null);
    
    toast({
      title: 'Carteira desconectada',
      description: 'Sua carteira blockchain foi desconectada.',
    });
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Minha Carteira</h2>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleRefresh} 
          disabled={loading || isRefreshing}
        >
          {loading || isRefreshing ? <Spinner className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </div>

      {showLowBalanceAlert && (
        <Alert variant="warning" className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle>Saldo baixo</AlertTitle>
          <AlertDescription>
            Seu saldo está abaixo de R$ 100,00. Considere fazer um depósito para evitar problemas em operações futuras.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-8">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="deposit" className="flex items-center gap-2">
            <ArrowDownCircle className="h-4 w-4" />
            Depositar
          </TabsTrigger>
          <TabsTrigger value="withdraw" className="flex items-center gap-2">
            <ArrowUpCircle className="h-4 w-4" />
            Sacar
          </TabsTrigger>
          <TabsTrigger value="payment-methods" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Métodos de Pagamento
          </TabsTrigger>
          <TabsTrigger value="swap" className="flex items-center gap-2">
            <Repeat className="h-4 w-4" />
            Swap
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Análises
          </TabsTrigger>
          <TabsTrigger value="blockchain" className="flex items-center gap-2">
            <Blocks className="h-4 w-4" />
            Blockchain
          </TabsTrigger>
          <TabsTrigger value="tokenization" className="flex items-center gap-2">
            <Coins className="h-4 w-4" />
            Tokenização
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <WalletBalance balance={balance} loading={loading} />
          <WalletTransactions transactions={transactions} loading={loading} />
        </TabsContent>

        <TabsContent value="deposit">
          <WalletDeposit onDeposit={handleDeposit} loading={loading} />
        </TabsContent>

        <TabsContent value="withdraw">
          <WalletWithdraw 
            onWithdraw={handleWithdraw} 
            loading={loading} 
            balance={balance?.availableBalance || 0} 
            paymentMethods={paymentMethods}
          />
        </TabsContent>

        <TabsContent value="payment-methods">
          <WalletPaymentMethods 
            paymentMethods={paymentMethods} 
            onAddPaymentMethod={handleAddPaymentMethod} 
            loading={loading} 
          />
        </TabsContent>

        <TabsContent value="swap">
          <WalletSwap 
            isConnected={walletConnected}
            onConnectWallet={handleConnectWallet}
            loading={loading}
          />
        </TabsContent>
        
        <TabsContent value="analytics">
          <WalletAnalytics 
            data={analyticsData} 
            loading={loadingAnalytics} 
            onRefresh={loadAnalyticsData}
          />
        </TabsContent>
        
        <TabsContent value="blockchain">
          <WalletBlockchainTransactions 
            transactions={blockchainTransactions} 
            loading={loadingBlockchain} 
            onRefresh={loadBlockchainTransactions}
          />
        </TabsContent>

        <TabsContent value="tokenization">
          <WalletTokenization 
            walletAddress={walletAddress}
            isConnected={walletConnected}
            onConnectWallet={handleConnectWallet}
            onRefresh={loadBlockchainTransactions}
            loading={loadingBlockchain}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 