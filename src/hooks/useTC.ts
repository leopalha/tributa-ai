import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { TituloDeCredito, TCTransaction, TCFormData, TipoTitulo } from '@/types/tc';

interface UseTCReturn {
  tcs: TituloDeCredito[];
  loading: boolean;
  error: string | null;
  fetchTCs: () => Promise<void>;
  createTC: (data: TCFormData) => Promise<void>;
  updateTC: (id: string, data: Partial<TituloDeCredito>) => Promise<void>;
  deleteTC: (id: string) => Promise<void>;
  addTransaction: (tcId: string, transaction: Omit<TCTransaction, 'id'>) => Promise<void>;
  getTCById: (id: string) => Promise<TituloDeCredito | null>;
  getTransactions: (tcId: string) => Promise<TCTransaction[]>;
}

export function useTC(): UseTCReturn {
  const [tcs, setTCs] = useState<TituloDeCredito[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchTCs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tcs');
      setTCs(response.data);
    } catch (err) {
      setError('Erro ao carregar títulos de crédito');
    } finally {
      setLoading(false);
    }
  };

  const createTC = async (data: TCFormData) => {
    try {
      setLoading(true);
      const response = await api.post('/tcs', data);
      setTCs(prev => [...prev, response.data]);
      router.push('/tcs');
    } catch (err) {
      setError('Erro ao criar título de crédito');
    } finally {
      setLoading(false);
    }
  };

  const updateTC = async (id: string, data: Partial<TituloDeCredito>) => {
    try {
      setLoading(true);
      const response = await api.put(`/tcs/${id}`, data);
      setTCs(prev => prev.map(tc => tc.id === id ? response.data : tc));
    } catch (err) {
      setError('Erro ao atualizar título de crédito');
    } finally {
      setLoading(false);
    }
  };

  const deleteTC = async (id: string) => {
    try {
      setLoading(true);
      await api.delete(`/tcs/${id}`);
      setTCs(prev => prev.filter(tc => tc.id !== id));
    } catch (err) {
      setError('Erro ao deletar título de crédito');
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (tcId: string, transaction: Omit<TCTransaction, 'id'>) => {
    try {
      setLoading(true);
      const response = await api.post(`/tcs/${tcId}/transactions`, transaction);
      setTCs(prev => prev.map(tc => {
        if (tc.id === tcId) {
          return {
            ...tc,
            transacoes: [...(tc.transacoes || []), response.data]
          };
        }
        return tc;
      }));
    } catch (err) {
      setError('Erro ao adicionar transação');
    } finally {
      setLoading(false);
    }
  };

  const getTCById = async (id: string): Promise<TituloDeCredito | null> => {
    try {
      setLoading(true);
      const response = await api.get(`/tcs/${id}`);
      return response.data;
    } catch (err) {
      setError('Erro ao buscar título de crédito');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getTransactions = async (tcId: string): Promise<TCTransaction[]> => {
    try {
      setLoading(true);
      const response = await api.get(`/tcs/${tcId}/transactions`);
      return response.data;
    } catch (err) {
      setError('Erro ao buscar transações');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    tcs,
    loading,
    error,
    fetchTCs,
    createTC,
    updateTC,
    deleteTC,
    addTransaction,
    getTCById,
    getTransactions
  };
} 