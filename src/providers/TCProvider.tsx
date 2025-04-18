"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TC, Transaction } from '@/models/types';
import { tcController } from '@/lib/supabase/controllers/tcController';

interface TCContextType {
  tcs: TC[];
  loading: boolean;
  error: Error | null;
  refreshTCs: () => Promise<void>;
  getTCsByEmpresa: (empresaId: string) => Promise<void>;
  getTCsByPeriodo: (dataInicio: string, dataFim: string) => Promise<void>;
  addTC: (tc: Omit<TC, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTC: (id: string, tc: Partial<TC>) => Promise<void>;
  updateTCStatus: (id: string, status: TC['status']) => Promise<void>;
  deleteTC: (id: string) => Promise<void>;
  addTransaction: (tcId: string, transaction: Omit<Transaction, 'id' | 'created_at'>) => Promise<void>;
}

const TCContext = createContext<TCContextType | undefined>(undefined);

export function TCProvider({ children }: { children: React.ReactNode }) {
  const [tcs, setTCs] = useState<TC[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshTCs = async () => {
    try {
      setLoading(true);
      const data = await tcController.getAll();
      setTCs(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const getTCsByEmpresa = async (empresaId: string) => {
    try {
      setLoading(true);
      const data = await tcController.getByEmpresa(empresaId);
      setTCs(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTCsByPeriodo = async (dataInicio: string, dataFim: string) => {
    try {
      setLoading(true);
      const data = await tcController.getByPeriodo(dataInicio, dataFim);
      setTCs(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addTC = async (tc: Omit<TC, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await tcController.create(tc);
      await refreshTCs();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateTC = async (id: string, tc: Partial<TC>) => {
    try {
      await tcController.update(id, tc);
      await refreshTCs();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateTCStatus = async (id: string, status: TC['status']) => {
    try {
      await tcController.updateStatus(id, status);
      await refreshTCs();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteTC = async (id: string) => {
    try {
      await tcController.delete(id);
      await refreshTCs();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const addTransaction = async (tcId: string, transaction: Omit<Transaction, 'id' | 'created_at'>) => {
    try {
      await tcController.addTransaction(tcId, transaction);
      await refreshTCs();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  useEffect(() => {
    refreshTCs();
  }, []);

  return (
    <TCContext.Provider
      value={{
        tcs,
        loading,
        error,
        refreshTCs,
        getTCsByEmpresa,
        getTCsByPeriodo,
        addTC,
        updateTC,
        updateTCStatus,
        deleteTC,
        addTransaction,
      }}
    >
      {children}
    </TCContext.Provider>
  );
}

export function useTCs() {
  const context = useContext(TCContext);
  if (context === undefined) {
    throw new Error('useTCs must be used within a TCProvider');
  }
  return context;
} 