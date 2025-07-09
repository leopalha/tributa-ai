import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipos básicos para Marketplace
interface MarketplaceStats {
  volumeTotal: number;
  numeroTransacoes: number;
  tcsAtivos: number;
  precoMedio: number;
}

interface MarketplaceContextType {
  stats: MarketplaceStats;
  loading: boolean;
  error: string | null;
  criarOferta: (dados: any) => Promise<void>;
  cancelarOferta: (id: string) => Promise<void>;
  buscarOfertas: () => Promise<void>;
  atualizarEstatisticas: () => Promise<void>;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [stats] = useState<MarketplaceStats>({
    volumeTotal: 2500000,
    numeroTransacoes: 125,
    tcsAtivos: 42,
    precoMedio: 115000,
  });
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const criarOferta = async (dados: any) => {
    console.log('Mock: Criando oferta', dados);
  };

  const cancelarOferta = async (id: string) => {
    console.log('Mock: Cancelando oferta', id);
  };

  const buscarOfertas = async () => {
    console.log('Mock: Buscando ofertas');
  };

  const atualizarEstatisticas = async () => {
    console.log('Mock: Atualizando estatísticas');
  };

  const contextValue: MarketplaceContextType = {
    stats,
    loading,
    error,
    criarOferta,
    cancelarOferta,
    buscarOfertas,
    atualizarEstatisticas,
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
