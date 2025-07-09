import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { CreditTitle } from '@/types/prisma';

// Tipos de operação no marketplace
export type MarketplaceAction = 'comprar' | 'lance' | 'oferta';

// Interface para resultado de ações
interface ActionResult {
  success: boolean;
  transactionId?: string;
  tokenTransferHash?: string;
  message: string;
}

// Interface para dados de transação
interface TransactionData {
  id: string;
  tokenId: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  timestamp: Date;
  blockHash: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export function useMarketplaceActions() {
  const [loading, setLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState<MarketplaceAction | null>(null);

  // Verificar se título está tokenizado
  const isTokenizado = useCallback((titulo: CreditTitle): boolean => {
    return titulo.status === 'TOKENIZED' && Boolean(titulo.tokenizationInfo?.tokenAddress);
  }, []);

  // Validar compatibilidade para compensação
  const validarCompatibilidade = useCallback(
    (titulo: CreditTitle, tipoDebito?: string): boolean => {
      // Regras de compatibilidade baseadas na categoria
      if (!tipoDebito) return true;

      switch (titulo.category) {
        case 'TRIBUTARIO':
          // ICMS é regional
          if (titulo.subtype.includes('ICMS')) {
            // Verificar se é do mesmo estado (simulado)
            return true; // Em produção, verificar estado do débito
          }
          // PIS/COFINS/IRPJ são federais
          if (
            titulo.subtype.includes('PIS') ||
            titulo.subtype.includes('COFINS') ||
            titulo.subtype.includes('IRPJ')
          ) {
            return (
              tipoDebito.includes('PIS') ||
              tipoDebito.includes('COFINS') ||
              tipoDebito.includes('IRPJ')
            );
          }
          return titulo.subtype === tipoDebito;

        case 'JUDICIAL':
          // Precatórios por tribunal
          return titulo.subtype === tipoDebito;

        case 'COMERCIAL':
        case 'RURAL':
        case 'AMBIENTAL':
          // Mais flexíveis para compensação
          return true;

        default:
          return false;
      }
    },
    []
  );

  // Simular chamada para blockchain
  const callBlockchain = useCallback(
    async (
      operation: string,
      params: Record<string, any>
    ): Promise<{ transactionHash: string; blockNumber: number }> => {
      // Simular delay da blockchain
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

      return {
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        blockNumber: Math.floor(Math.random() * 1000) + 10000,
      };
    },
    []
  );

  // Comprar título (venda direta)
  const comprarTitulo = useCallback(
    async (
      titulo: CreditTitle,
      valor: number,
      formaPagamento: 'PIX' | 'TRANSFERENCIA' | 'BLOCKCHAIN'
    ): Promise<ActionResult> => {
      if (!isTokenizado(titulo)) {
        return {
          success: false,
          message: 'Apenas títulos tokenizados podem ser comprados',
        };
      }

      setLoading(true);
      setCurrentAction('comprar');

      try {
        // 1. Validar pagamento (simulado)
        console.log('Validando pagamento...', { valor, formaPagamento });
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 2. Transferir token na blockchain
        console.log('Transferindo titularidade na blockchain...');
        const blockchainResult = await callBlockchain('transferCreditToken', {
          creditId: titulo.id,
          tokenId: titulo.tokenizationInfo?.tokenAddress,
          newOwnerId: 'current_user_id', // Em produção, pegar do contexto
          amount: valor,
        });

        // 3. Atualizar status local
        console.log('Atualizando status local...');
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
          success: true,
          transactionId: `tx_${Date.now()}`,
          tokenTransferHash: blockchainResult.transactionHash,
          message: 'Compra realizada com sucesso! Título transferido para sua carteira.',
        };
      } catch (error) {
        console.error('Erro na compra:', error);
        return {
          success: false,
          message: 'Erro ao processar compra. Tente novamente.',
        };
      } finally {
        setLoading(false);
        setCurrentAction(null);
      }
    },
    [isTokenizado, callBlockchain]
  );

  // Dar lance em leilão
  const darLance = useCallback(
    async (titulo: CreditTitle, valorLance: number, lanceMinimo: number): Promise<ActionResult> => {
      if (!isTokenizado(titulo)) {
        return {
          success: false,
          message: 'Apenas títulos tokenizados podem ser leiloados',
        };
      }

      if (valorLance < lanceMinimo) {
        return {
          success: false,
          message: `Lance deve ser maior que ${lanceMinimo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
        };
      }

      setLoading(true);
      setCurrentAction('lance');

      try {
        // 1. Registrar lance na blockchain
        console.log('Registrando lance na blockchain...', { valorLance });
        const blockchainResult = await callBlockchain('placeBid', {
          creditId: titulo.id,
          tokenId: titulo.tokenizationInfo?.tokenAddress,
          bidAmount: valorLance,
          bidderId: 'current_user_id',
        });

        // 2. Atualizar estado do leilão
        console.log('Atualizando estado do leilão...');
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
          success: true,
          transactionId: `bid_${Date.now()}`,
          tokenTransferHash: blockchainResult.transactionHash,
          message: 'Lance registrado com sucesso na blockchain!',
        };
      } catch (error) {
        console.error('Erro no lance:', error);
        return {
          success: false,
          message: 'Erro ao registrar lance. Tente novamente.',
        };
      } finally {
        setLoading(false);
        setCurrentAction(null);
      }
    },
    [isTokenizado, callBlockchain]
  );

  // Fazer oferta
  const fazerOferta = useCallback(
    async (
      titulo: CreditTitle,
      valorOferta: number,
      mensagem?: string,
      prazoValidade?: number
    ): Promise<ActionResult> => {
      if (!isTokenizado(titulo)) {
        return {
          success: false,
          message: 'Apenas títulos tokenizados podem receber ofertas',
        };
      }

      if (valorOferta >= titulo.value) {
        return {
          success: false,
          message: 'Valor da oferta deve ser menor que o valor nominal',
        };
      }

      setLoading(true);
      setCurrentAction('oferta');

      try {
        // 1. Registrar oferta na blockchain
        console.log('Registrando oferta na blockchain...', { valorOferta, mensagem });
        const blockchainResult = await callBlockchain('makeOffer', {
          creditId: titulo.id,
          tokenId: titulo.tokenizationInfo?.tokenAddress,
          offerAmount: valorOferta,
          message: mensagem,
          validityDays: prazoValidade,
          buyerId: 'current_user_id',
        });

        // 2. Notificar vendedor
        console.log('Notificando vendedor...');
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
          success: true,
          transactionId: `offer_${Date.now()}`,
          tokenTransferHash: blockchainResult.transactionHash,
          message: 'Oferta enviada com sucesso! O vendedor será notificado.',
        };
      } catch (error) {
        console.error('Erro na oferta:', error);
        return {
          success: false,
          message: 'Erro ao enviar oferta. Tente novamente.',
        };
      } finally {
        setLoading(false);
        setCurrentAction(null);
      }
    },
    [isTokenizado, callBlockchain]
  );

  // Obter histórico de transações de um token
  const obterHistoricoToken = useCallback(async (tokenId: string): Promise<TransactionData[]> => {
    try {
      // Simular busca na blockchain
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockHistory: TransactionData[] = [
        {
          id: `tx_${Date.now()}_1`,
          tokenId,
          fromAddress: '0x0000...0000',
          toAddress: '0x1234...5678',
          amount: 0,
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          blockHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          status: 'confirmed',
        },
        {
          id: `tx_${Date.now()}_2`,
          tokenId,
          fromAddress: '0x1234...5678',
          toAddress: '0xabcd...ef01',
          amount: 450000,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          blockHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          status: 'confirmed',
        },
      ];

      return mockHistory;
    } catch (error) {
      console.error('Erro ao obter histórico:', error);
      return [];
    }
  }, []);

  // Verificar status de transação
  const verificarStatusTransacao = useCallback(
    async (transactionHash: string): Promise<'pending' | 'confirmed' | 'failed'> => {
      try {
        // Simular verificação na blockchain
        await new Promise(resolve => setTimeout(resolve, 500));

        // Simular status (95% de sucesso)
        return Math.random() > 0.05 ? 'confirmed' : 'failed';
      } catch (error) {
        console.error('Erro ao verificar status:', error);
        return 'failed';
      }
    },
    []
  );

  // Calcular taxa da plataforma
  const calcularTaxaPlataforma = useCallback((valor: number): number => {
    return valor * 0.025; // 2.5%
  }, []);

  // Simular disponibilidade na carteira após compra
  const adicionarNaCarteira = useCallback(
    async (titulo: CreditTitle, transactionHash: string): Promise<void> => {
      // Simular adição na carteira local
      console.log('Adicionando título à carteira...', {
        tituloId: titulo.id,
        tokenId: titulo.tokenizationInfo?.tokenAddress,
        transactionHash,
      });

      // Em produção, seria uma chamada para API local ou atualização de estado
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    []
  );

  return {
    // Estados
    loading,
    currentAction,

    // Funções principais
    comprarTitulo,
    darLance,
    fazerOferta,

    // Utilitários
    isTokenizado,
    validarCompatibilidade,
    obterHistoricoToken,
    verificarStatusTransacao,
    calcularTaxaPlataforma,
    adicionarNaCarteira,

    // Helpers
    formatCurrency: (value: number) =>
      value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
  };
}
