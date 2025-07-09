import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipos básicos para Marketplace
interface Oferta {
  id: string;
  tcId: string;
  tipo: 'venda' | 'compra';
  preco: number;
  quantidade: number;
  vendedor: string;
  comprador?: string;
  status: 'ativa' | 'executada' | 'cancelada';
  dataExpiracao: Date;
  createdAt: Date;
}

interface Transacao {
  id: string;
  tcId: string;
  vendedor: string;
  comprador: string;
  preco: number;
  quantidade: number;
  status: 'pendente' | 'confirmada' | 'falhou';
  txHash?: string;
  createdAt: Date;
}

interface MarketplaceStats {
  volumeTotal: number;
  numeroTransacoes: number;
  tcsAtivos: number;
  precoMedio: number;
}

interface MarketplaceContextType {
  ofertas: Oferta[];
  transacoes: Transacao[];
  stats: MarketplaceStats;
  loading: boolean;
  error: string | null;
  criarOferta: (oferta: Omit<Oferta, 'id' | 'createdAt'>) => Promise<void>;
  cancelarOferta: (id: string) => Promise<void>;
  executarTransacao: (ofertaId: string, quantidade: number) => Promise<void>;
  buscarOfertas: (filtros?: any) => Promise<void>;
  atualizarStats: () => Promise<void>;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [stats, setStats] = useState<MarketplaceStats>({
    volumeTotal: 0,
    numeroTransacoes: 0,
    tcsAtivos: 0,
    precoMedio: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const criarOferta = async (novaOferta: Omit<Oferta, 'id' | 'createdAt'>) => {
    try {
      setLoading(true);
      setError(null);

      // Simulação - posteriormente conectar com smart contract
      await new Promise(resolve => setTimeout(resolve, 1500));

      const oferta: Oferta = {
        ...novaOferta,
        id: Date.now().toString(),
        createdAt: new Date(),
      };

      setOfertas(prev => [...prev, oferta]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar oferta');
    } finally {
      setLoading(false);
    }
  };

  const cancelarOferta = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      // Simulação
      await new Promise(resolve => setTimeout(resolve, 1000));

      setOfertas(prev =>
        prev.map(oferta =>
          oferta.id === id ? { ...oferta, status: 'cancelada' as const } : oferta
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cancelar oferta');
    } finally {
      setLoading(false);
    }
  };

  const executarTransacao = async (ofertaId: string, quantidade: number) => {
    try {
      setLoading(true);
      setError(null);

      // Simulação - posteriormente executar smart contract
      await new Promise(resolve => setTimeout(resolve, 2000));

      const oferta = ofertas.find(o => o.id === ofertaId);
      if (!oferta) {
        throw new Error('Oferta não encontrada');
      }

      const transacao: Transacao = {
        id: Date.now().toString(),
        tcId: oferta.tcId,
        vendedor: oferta.vendedor,
        comprador: 'Usuario Atual', // Posteriormente pegar do contexto de auth
        preco: oferta.preco,
        quantidade,
        status: 'confirmada',
        txHash: `0x${Date.now().toString(16)}`,
        createdAt: new Date(),
      };

      setTransacoes(prev => [...prev, transacao]);

      // Atualizar oferta
      setOfertas(prev =>
        prev.map(o =>
          o.id === ofertaId
            ? {
                ...o,
                quantidade: o.quantidade - quantidade,
                status: o.quantidade === quantidade ? ('executada' as const) : o.status,
              }
            : o
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao executar transação');
    } finally {
      setLoading(false);
    }
  };

  const buscarOfertas = async (filtros?: any) => {
    try {
      setLoading(true);
      setError(null);

      // Simulação
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockOfertas: Oferta[] = [
        {
          id: '1',
          tcId: '1',
          tipo: 'venda',
          preco: 14500.0,
          quantidade: 1,
          vendedor: 'Empresa Demo LTDA',
          status: 'ativa',
          dataExpiracao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
        },
      ];

      setOfertas(mockOfertas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar ofertas');
    } finally {
      setLoading(false);
    }
  };

  const atualizarStats = async () => {
    try {
      setLoading(true);

      // Calcular stats baseado nas transações e ofertas
      const volumeTotal = transacoes.reduce((total, t) => total + t.preco * t.quantidade, 0);
      const numeroTransacoes = transacoes.length;
      const tcsAtivos = ofertas.filter(o => o.status === 'ativa').length;
      const precoMedio =
        tcsAtivos > 0 ? ofertas.reduce((total, o) => total + o.preco, 0) / tcsAtivos : 0;

      setStats({
        volumeTotal,
        numeroTransacoes,
        tcsAtivos,
        precoMedio,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  const contextValue: MarketplaceContextType = {
    ofertas,
    transacoes,
    stats,
    loading,
    error,
    criarOferta,
    cancelarOferta,
    executarTransacao,
    buscarOfertas,
    atualizarStats,
  };

  return <MarketplaceContext.Provider value={contextValue}>{children}</MarketplaceContext.Provider>;
}

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};

// Export dos tipos para uso em outros lugares
export type { Oferta, Transacao, MarketplaceStats };
