import { useState, useCallback } from 'react';
import { useRouter } from '@/lib/router-utils';
import { api } from '@/services/api';
import { CreditTitle, CreditCategory, CreditStatus } from '@prisma/client';

// Interface para resposta paginada da API
interface PaginatedTCResponse {
  data: CreditTitle[];
  totalPages: number;
  currentPage: number;
  total: number;
}

interface UseTCReturn {
  tcs: CreditTitle[];
  loading: boolean;
  error: string | null;
  pagination: { page: number; totalPages: number; total: number };
  fetchTCs: (filtros?: {
    page?: number;
    limit?: number;
    status?: CreditStatus | '';
    category?: CreditCategory | '';
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    ownerId?: string;
  }) => Promise<void>;
  getTCById: (id: string) => Promise<CreditTitle | null>;
  createTC: (
    data: Omit<
      CreditTitle,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'owner'
      | 'ownerCompany'
      | 'listings'
      | 'compensacoes'
      | 'embedding'
      | 'tokenizationInfo'
      | 'validationHistory'
      | 'underlyingDocuments'
      | 'guarantees'
    > & { ownerCompanyId?: string | null }
  ) => Promise<CreditTitle | null>;
  updateTC: (id: string, data: Partial<CreditTitle>) => Promise<CreditTitle | null>;
  deleteTC: (id: string) => Promise<boolean>;
}

export const useTC = (): UseTCReturn => {
  const [tcs, setTCs] = useState<CreditTitle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const router = useRouter();

  const fetchTCs = useCallback(
    async (
      filtros: {
        page?: number;
        limit?: number;
        status?: CreditStatus | '';
        category?: CreditCategory | '';
        search?: string;
        sort?: string;
        order?: 'asc' | 'desc';
        ownerId?: string;
      } = {}
    ) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        Object.entries(filtros).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            params.append(key, String(value));
          }
        });

        const response = await api.get<PaginatedTCResponse>(`/api/tcs?${params.toString()}`);
        setTCs(response.data || []);
        setPagination({
          page: response.currentPage,
          totalPages: response.totalPages,
          total: response.total,
        });
      } catch (err) {
        console.error('Erro ao buscar TCs:', err);
        setError((err as Error).message || 'Falha ao buscar Títulos de Crédito.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getTCById = useCallback(async (id: string): Promise<CreditTitle | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<CreditTitle>(`/api/tcs/${id}`);
      return response;
    } catch (err) {
      console.error(`Erro ao buscar TC ${id}:`, err);
      setError((err as Error).message || 'Falha ao buscar Título de Crédito.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTC = useCallback(
    async (
      data: Omit<
        CreditTitle,
        | 'id'
        | 'createdAt'
        | 'updatedAt'
        | 'owner'
        | 'ownerCompany'
        | 'listings'
        | 'compensacoes'
        | 'embedding'
        | 'tokenizationInfo'
        | 'validationHistory'
        | 'underlyingDocuments'
        | 'guarantees'
      > & { ownerCompanyId?: string | null }
    ): Promise<CreditTitle | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post<CreditTitle>('/api/tcs', data);
        setTCs(prev => [...prev, response]);
        router.push('/tc');
        return response;
      } catch (err) {
        console.error('Erro ao criar TC:', err);
        setError((err as Error).message || 'Falha ao criar Título de Crédito.');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const updateTC = useCallback(
    async (id: string, data: Partial<CreditTitle>): Promise<CreditTitle | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put<CreditTitle>(`/api/tcs/${id}`, data);
        setTCs(prev => prev.map(tc => (tc.id === id ? response : tc)));
        return response;
      } catch (err) {
        console.error(`Erro ao atualizar TC ${id}:`, err);
        setError((err as Error).message || 'Falha ao atualizar Título de Crédito.');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteTC = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/tcs/${id}`);
      setTCs(prev => prev.filter(tc => tc.id !== id));
      return true;
    } catch (err) {
      console.error(`Erro ao deletar TC ${id}:`, err);
      setError((err as Error).message || 'Falha ao deletar Título de Crédito.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tcs,
    loading,
    error,
    pagination,
    fetchTCs,
    getTCById,
    createTC,
    updateTC,
    deleteTC,
  };
};
