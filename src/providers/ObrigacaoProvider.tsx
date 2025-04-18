"use client";

import React, { createContext, useState, useEffect } from 'react';
import { api } from '@/services/api';

export interface Obrigacao {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'federal' | 'estadual' | 'municipal';
  periodicidade: 'mensal' | 'trimestral' | 'anual' | 'eventual';
  prazo: string;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'atrasada';
  empresaId: string;
  responsavelId: string;
  anexos?: {
    id: string;
    nome: string;
    url: string;
  }[];
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ObrigacaoContextData {
  obrigacoes: Obrigacao[];
  selectedObrigacao: Obrigacao | null;
  loading: boolean;
  error: Error | null;
  fetchObrigacoes: () => Promise<void>;
  selectObrigacao: (obrigacao: Obrigacao) => void;
  createObrigacao: (data: Omit<Obrigacao, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateObrigacao: (id: string, data: Partial<Obrigacao>) => Promise<void>;
  deleteObrigacao: (id: string) => Promise<void>;
  uploadAnexo: (id: string, file: File) => Promise<void>;
  removeAnexo: (id: string, anexoId: string) => Promise<void>;
}

export const ObrigacaoContext = createContext<ObrigacaoContextData>({} as ObrigacaoContextData);

export function ObrigacaoProvider({ children }: { children: React.ReactNode }) {
  const [obrigacoes, setObrigacoes] = useState<Obrigacao[]>([]);
  const [selectedObrigacao, setSelectedObrigacao] = useState<Obrigacao | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchObrigacoes = async () => {
    try {
      setLoading(true);
      const response = await api.get<Obrigacao[]>('/obrigacoes');
      setObrigacoes(response);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const selectObrigacao = (obrigacao: Obrigacao) => {
    setSelectedObrigacao(obrigacao);
  };

  const createObrigacao = async (data: Omit<Obrigacao, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const response = await api.post<Obrigacao>('/obrigacoes', data);
      setObrigacoes(prev => [...prev, response]);
      setError(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateObrigacao = async (id: string, data: Partial<Obrigacao>) => {
    try {
      setLoading(true);
      const response = await api.put<Obrigacao>(`/obrigacoes/${id}`, data);
      setObrigacoes(prev => prev.map(obrigacao => obrigacao.id === id ? response : obrigacao));
      if (selectedObrigacao?.id === id) {
        setSelectedObrigacao(response);
      }
      setError(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteObrigacao = async (id: string) => {
    try {
      setLoading(true);
      await api.delete(`/obrigacoes/${id}`);
      setObrigacoes(prev => prev.filter(obrigacao => obrigacao.id !== id));
      if (selectedObrigacao?.id === id) {
        setSelectedObrigacao(null);
      }
      setError(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadAnexo = async (id: string, file: File) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post<Obrigacao>(`/obrigacoes/${id}/anexos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setObrigacoes(prev => prev.map(obrigacao => obrigacao.id === id ? response : obrigacao));
      if (selectedObrigacao?.id === id) {
        setSelectedObrigacao(response);
      }
      setError(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeAnexo = async (id: string, anexoId: string) => {
    try {
      setLoading(true);
      const response = await api.delete<Obrigacao>(`/obrigacoes/${id}/anexos/${anexoId}`);
      setObrigacoes(prev => prev.map(obrigacao => obrigacao.id === id ? response : obrigacao));
      if (selectedObrigacao?.id === id) {
        setSelectedObrigacao(response);
      }
      setError(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObrigacoes();
  }, []);

  return (
    <ObrigacaoContext.Provider
      value={{
        obrigacoes,
        selectedObrigacao,
        loading,
        error,
        fetchObrigacoes,
        selectObrigacao,
        createObrigacao,
        updateObrigacao,
        deleteObrigacao,
        uploadAnexo,
        removeAnexo,
      }}
    >
      {children}
    </ObrigacaoContext.Provider>
  );
} 