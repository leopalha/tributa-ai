"use client";

import React, { createContext, useState, useEffect } from 'react';
import { api } from '@/services/api';

export interface Empresa {
  id: string;
  nome: string;
  cnpj: string;
  razaoSocial: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  endereco?: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  contato?: {
    telefone: string;
    email: string;
  };
  status: 'ativa' | 'inativa' | 'pendente';
  createdAt: string;
  updatedAt: string;
}

interface EmpresaContextData {
  empresas: Empresa[];
  selectedEmpresa: Empresa | null;
  loading: boolean;
  error: Error | null;
  fetchEmpresas: () => Promise<void>;
  selectEmpresa: (empresa: Empresa) => void;
  createEmpresa: (data: Omit<Empresa, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEmpresa: (id: string, data: Partial<Empresa>) => Promise<void>;
  deleteEmpresa: (id: string) => Promise<void>;
}

export const EmpresaContext = createContext<EmpresaContextData>({} as EmpresaContextData);

export function EmpresaProvider({ children }: { children: React.ReactNode }) {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEmpresas = async () => {
    try {
      setLoading(true);
      const response = await api.get<Empresa[]>('/empresas');
      setEmpresas(response);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const selectEmpresa = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
  };

  const createEmpresa = async (data: Omit<Empresa, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const response = await api.post<Empresa>('/empresas', data);
      setEmpresas(prev => [...prev, response]);
      setError(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEmpresa = async (id: string, data: Partial<Empresa>) => {
    try {
      setLoading(true);
      const response = await api.put<Empresa>(`/empresas/${id}`, data);
      setEmpresas(prev => prev.map(empresa => empresa.id === id ? response : empresa));
      if (selectedEmpresa?.id === id) {
        setSelectedEmpresa(response);
      }
      setError(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEmpresa = async (id: string) => {
    try {
      setLoading(true);
      await api.delete(`/empresas/${id}`);
      setEmpresas(prev => prev.filter(empresa => empresa.id !== id));
      if (selectedEmpresa?.id === id) {
        setSelectedEmpresa(null);
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
    fetchEmpresas();
  }, []);

  return (
    <EmpresaContext.Provider
      value={{
        empresas,
        selectedEmpresa,
        loading,
        error,
        fetchEmpresas,
        selectEmpresa,
        createEmpresa,
        updateEmpresa,
        deleteEmpresa,
      }}
    >
      {children}
    </EmpresaContext.Provider>
  );
} 