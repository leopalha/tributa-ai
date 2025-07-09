import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipos básicos para TC
interface TC {
  id: string;
  numero: string;
  valor: number;
  tipo: string;
  status: string;
  dataEmissao: Date;
  dataVencimento: Date;
  empresaId: string;
}

interface TCContextType {
  tcs: TC[];
  loading: boolean;
  error: string | null;
  emitirTC: (dados: any) => Promise<void>;
  obterTCs: () => Promise<void>;
  atualizarTC: (id: string, dados: any) => Promise<void>;
}

const TCContext = createContext<TCContextType | undefined>(undefined);

export function TCProvider({ children }: { children: ReactNode }) {
  const [tcs] = useState<TC[]>([
    {
      id: '1',
      numero: 'TC-001',
      valor: 150000,
      tipo: 'ICMS',
      status: 'ativo',
      dataEmissao: new Date(),
      dataVencimento: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      empresaId: '1',
    },
  ]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const emitirTC = async (dados: any) => {
    console.log('Mock: Emitindo TC', dados);
  };

  const obterTCs = async () => {
    console.log('Mock: Obtendo TCs');
  };

  const atualizarTC = async (id: string, dados: any) => {
    console.log('Mock: Atualizando TC', id, dados);
  };

  const contextValue: TCContextType = {
    tcs,
    loading,
    error,
    emitirTC,
    obterTCs,
    atualizarTC,
  };

  return <TCContext.Provider value={contextValue}>{children}</TCContext.Provider>;
}

export const useTC = () => {
  const context = useContext(TCContext);
  if (context === undefined) {
    throw new Error('useTC must be used within a TCProvider');
  }
  return context;
};
