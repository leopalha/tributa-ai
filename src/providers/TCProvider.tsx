import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipos básicos para Título de Crédito
interface TC {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  valor: number;
  dataEmissao: Date;
  dataVencimento: Date;
  status: 'ativo' | 'negociado' | 'vencido' | 'cancelado';
  proprietario: string;
  tokenId?: string;
  categoria: string;
  documentos: string[];
  createdAt: Date;
}

interface TCContextType {
  tcs: TC[];
  tcAtual: TC | null;
  loading: boolean;
  error: string | null;
  emitirTC: (tc: Omit<TC, 'id' | 'createdAt'>) => Promise<void>;
  atualizarTC: (id: string, dados: Partial<TC>) => void;
  removerTC: (id: string) => void;
  buscarTCs: (filtros?: any) => Promise<void>;
  selecionarTC: (tc: TC) => void;
}

const TCContext = createContext<TCContextType | undefined>(undefined);

export function TCProvider({ children }: { children: ReactNode }) {
  const [tcs, setTCs] = useState<TC[]>([]);
  const [tcAtual, setTCAtual] = useState<TC | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emitirTC = async (novoTC: Omit<TC, 'id' | 'createdAt'>) => {
    try {
      setLoading(true);
      setError(null);

      // Simulação - posteriormente conectar com blockchain
      await new Promise(resolve => setTimeout(resolve, 2000));

      const tc: TC = {
        ...novoTC,
        id: Date.now().toString(),
        tokenId: `TC-${Date.now()}`,
        createdAt: new Date(),
      };

      setTCs(prev => [...prev, tc]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao emitir TC');
    } finally {
      setLoading(false);
    }
  };

  const atualizarTC = (id: string, dados: Partial<TC>) => {
    setTCs(prev => prev.map(tc => (tc.id === id ? { ...tc, ...dados } : tc)));

    if (tcAtual?.id === id) {
      setTCAtual(prev => (prev ? { ...prev, ...dados } : null));
    }
  };

  const removerTC = (id: string) => {
    setTCs(prev => prev.filter(tc => tc.id !== id));
    if (tcAtual?.id === id) {
      setTCAtual(null);
    }
  };

  const buscarTCs = async (filtros?: any) => {
    try {
      setLoading(true);
      setError(null);

      // Simulação - posteriormente conectar com API real
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockTCs: TC[] = [
        {
          id: '1',
          titulo: 'Crédito ICMS - Janeiro 2024',
          descricao: 'Crédito tributário ICMS referente ao mês de janeiro',
          tipo: 'tributario',
          valor: 15000.0,
          dataEmissao: new Date('2024-01-15'),
          dataVencimento: new Date('2024-12-31'),
          status: 'ativo',
          proprietario: 'Empresa Demo LTDA',
          tokenId: 'TC-1705123456',
          categoria: 'ICMS',
          documentos: ['documento1.pdf', 'comprovante.pdf'],
          createdAt: new Date('2024-01-15'),
        },
      ];

      setTCs(mockTCs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar TCs');
    } finally {
      setLoading(false);
    }
  };

  const selecionarTC = (tc: TC) => {
    setTCAtual(tc);
  };

  const contextValue: TCContextType = {
    tcs,
    tcAtual,
    loading,
    error,
    emitirTC,
    atualizarTC,
    removerTC,
    buscarTCs,
    selecionarTC,
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

// Export do tipo para uso em outros lugares
export type { TC };
