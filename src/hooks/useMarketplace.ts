import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import { AnuncioDaLista } from '@/components/marketplace/AnunciosList';
import { TipoNegociacao, CreditCategory } from '@/types/prisma';
import { CarrinhoItem, Pedido } from '@/types/marketplace';

export interface MarketplaceFilters {
  status?: string;
  type?: TipoNegociacao | '';
  category?: CreditCategory | '';
  valorMin?: number | string;
  valorMax?: number | string;
  search?: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

interface MarketplaceData {
  anuncios: AnuncioDaLista[] | null;
  pagination: PaginationState | null;
  isLoading: boolean;
  error: Error | null;
  setFilters: (filters: MarketplaceFilters) => void;
  setPage: (page: number) => void;
  // Propriedades do carrinho
  carrinho: CarrinhoItem[];
  loading: boolean;
  updateCarrinhoItem: (itemId: string, quantidade: number) => Promise<void>;
  removeFromCarrinho: (itemId: string) => Promise<void>;
  clearCarrinho: () => Promise<void>;
  createPedido: (data: {
    itens: { itemId: string; quantidade: number }[];
    enderecoEntrega?: any;
    metodoPagamento: 'cartao' | 'pix' | 'boleto';
  }) => Promise<void>;
}

export function useMarketplace(): MarketplaceData {
  const [anuncios, setAnuncios] = useState<AnuncioDaLista[] | null>(null);
  const [pagination, setPagination] = useState<PaginationState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState<MarketplaceFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(12);

  const fetchData = useCallback(
    async (page: number, currentFilters: MarketplaceFilters) => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.set('page', page.toString());
        params.set('limit', limit.toString());

        if (currentFilters.status) params.set('status', currentFilters.status);
        if (currentFilters.type) params.set('type', currentFilters.type);
        if (currentFilters.category) params.set('category', currentFilters.category);
        if (currentFilters.valorMin) params.set('valorMin', String(currentFilters.valorMin));
        if (currentFilters.valorMax) params.set('valorMax', String(currentFilters.valorMax));
        if (currentFilters.search) params.set('search', currentFilters.search);

        const response = await api.get<{ data: AnuncioDaLista[]; pagination: PaginationState }>(
          `/api/marketplace?${params.toString()}`
        );

        setAnuncios(response.data);
        setPagination(response.pagination);
      } catch (err: any) {
        console.error('Erro ao buscar anúncios paginados:', err);
        setError(
          err instanceof Error ? err : new Error('Erro ao carregar anúncios do marketplace')
        );
        setAnuncios(null);
        setPagination(null);
      } finally {
        setIsLoading(false);
      }
    },
    [limit]
  );

  // Funções do carrinho
  const updateCarrinhoItem = async (itemId: string, quantidade: number) => {
    try {
      setLoading(true);
      // Simular API call
      setCarrinho(prev =>
        prev.map(item =>
          item.itemId === itemId
            ? { ...item, quantidade, valorTotal: item.valorUnitario * quantidade }
            : item
        )
      );
    } catch (err) {
      console.error('Erro ao atualizar item do carrinho:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCarrinho = async (itemId: string) => {
    try {
      setLoading(true);
      setCarrinho(prev => prev.filter(item => item.itemId !== itemId));
    } catch (err) {
      console.error('Erro ao remover item do carrinho:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearCarrinho = async () => {
    try {
      setLoading(true);
      setCarrinho([]);
    } catch (err) {
      console.error('Erro ao limpar carrinho:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPedido = async (data: {
    itens: { itemId: string; quantidade: number }[];
    enderecoEntrega?: any;
    metodoPagamento: 'cartao' | 'pix' | 'boleto';
  }) => {
    try {
      setLoading(true);
      // Simular API call
      console.log('Criando pedido:', data);
      // Limpar carrinho após criar pedido
      setCarrinho([]);
    } catch (err) {
      console.error('Erro ao criar pedido:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, filters);
  }, [currentPage, filters, fetchData]);

  const handleSetFilters = (newFilters: MarketplaceFilters) => {
    setCurrentPage(1);
    setFilters(newFilters);
  };

  const handleSetPage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return {
    anuncios,
    pagination,
    isLoading,
    error,
    setFilters: handleSetFilters,
    setPage: handleSetPage,
    // Propriedades do carrinho
    carrinho,
    loading,
    updateCarrinhoItem,
    removeFromCarrinho,
    clearCarrinho,
    createPedido,
  };
}
