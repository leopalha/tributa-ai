import { useState, useCallback } from 'react';
import fabricService, { TokenizedCredit } from '@/services/fabric';

export interface TokenizationCredit {
  id: string;
  title: string;
  description: string;
  type: string;
  value: number;
  issueDate: string;
  validationDate: string;
  ownerId: string;
  ownerName: string;
  metadata?: Record<string, any>;
}

export interface TokenizationResult {
  success: boolean;
  message: string;
  token?: TokenizedCredit;
}

export interface UseTokenizationReturn {
  tokenizeCredit: (credit: TokenizationCredit) => Promise<TokenizationResult>;
  getUserTokens: (userId: string) => Promise<TokenizedCredit[]>;
  updateTokenStatus: (tokenId: string, status: TokenizedCredit['status']) => Promise<boolean>;
  transferToken: (
    tokenId: string,
    fromId: string,
    toId: string,
    toName: string
  ) => Promise<boolean>;
  getTokenHistory: (tokenId: string) => Promise<any[]>;
  loading: boolean;
  error: string | null;
}

export function useTokenization(): UseTokenizationReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para tokenizar um crédito
  const tokenizeCredit = useCallback(
    async (credit: TokenizationCredit): Promise<TokenizationResult> => {
      setLoading(true);
      setError(null);

      try {
        // Configurar os dados do crédito para tokenização
        const creditData = {
          ...credit,
          status: 'ACTIVE' as const,
        };

        // Enviar para o serviço Fabric
        const result = await fabricService.tokenizeCredit(creditData);

        if (!result) {
          throw new Error('Falha ao tokenizar o crédito. Serviço indisponível.');
        }

        return {
          success: true,
          message: 'Crédito tokenizado com sucesso!',
          token: result,
        };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido na tokenização';
        setError(errorMsg);
        return {
          success: false,
          message: errorMsg,
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Função para buscar tokens de um usuário
  const getUserTokens = useCallback(async (userId: string): Promise<TokenizedCredit[]> => {
    setLoading(true);
    setError(null);

    try {
      const tokens = await fabricService.getUserTokens(userId);
      return tokens;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao buscar tokens do usuário';
      setError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para atualizar o status de um token
  const updateTokenStatus = useCallback(
    async (tokenId: string, status: TokenizedCredit['status']): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const success = await fabricService.updateTokenStatus(tokenId, status);
        return success;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erro ao atualizar status do token';
        setError(errorMsg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Função para transferir um token
  const transferToken = useCallback(
    async (tokenId: string, fromId: string, toId: string, toName: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const success = await fabricService.transferToken(tokenId, fromId, toId, toName);
        return success;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erro ao transferir token';
        setError(errorMsg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Função para obter o histórico de um token
  const getTokenHistory = useCallback(async (tokenId: string): Promise<any[]> => {
    setLoading(true);
    setError(null);

    try {
      const history = await fabricService.getTokenHistory(tokenId);
      return history;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao buscar histórico do token';
      setError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tokenizeCredit,
    getUserTokens,
    updateTokenStatus,
    transferToken,
    getTokenHistory,
    loading,
    error,
  };
}
