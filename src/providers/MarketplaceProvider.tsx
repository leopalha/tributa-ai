"use client";

import React, { createContext, useState, useEffect } from 'react';
import { marketplaceService } from '@/services/marketplace.service';
import { MarketplaceItem, CarrinhoItem, Pedido, Avaliacao } from '@/types/marketplace';

interface MarketplaceContextData {
  items: MarketplaceItem[];
  carrinho: CarrinhoItem[];
  pedidos: Pedido[];
  selectedItem: MarketplaceItem | null;
  loading: boolean;
  error: Error | null;
  fetchItems: (filters?: any) => Promise<void>;
  selectItem: (item: MarketplaceItem) => void;
  addToCarrinho: (itemId: string, quantidade: number) => Promise<void>;
  updateCarrinhoItem: (itemId: string, quantidade: number) => Promise<void>;
  removeFromCarrinho: (itemId: string) => Promise<void>;
  clearCarrinho: () => Promise<void>;
  createPedido: (data: {
    itens: { itemId: string; quantidade: number }[];
    enderecoEntrega?: any;
    metodoPagamento: 'cartao' | 'pix' | 'boleto';
  }) => Promise<void>;
  fetchPedidos: () => Promise<void>;
  createAvaliacao: (itemId: string, data: { nota: number; comentario: string }) => Promise<Avaliacao>;
  fetchAvaliacoes: (itemId: string) => Promise<Avaliacao[]>;
}

export const MarketplaceContext = createContext<MarketplaceContextData>({} as MarketplaceContextData);

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchItems = async (filters?: any) => {
    try {
      setLoading(true);
      const response = await marketplaceService.getItems(filters);
      setItems(response);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const selectItem = (item: MarketplaceItem) => {
    setSelectedItem(item);
  };

  const addToCarrinho = async (itemId: string, quantidade: number) => {
    try {
      setLoading(true);
      const response = await marketplaceService.addToCarrinho(itemId, quantidade);
      setCarrinho(prev => [...prev, response]);
      setError(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCarrinhoItem = async (itemId: string, quantidade: number) => {
    try {
      setLoading(true);
      const response = await marketplaceService.updateCarrinhoItem(itemId, quantidade);
      setCarrinho(prev => prev.map(item => item.item.id === itemId ? response : item));
      setError(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCarrinho = async (itemId: string) => {
    try {
      setLoading(true);
      await marketplaceService.removeFromCarrinho(itemId);
      setCarrinho(prev => prev.filter(item => item.item.id !== itemId));
      setError(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCarrinho = async () => {
    try {
      setLoading(true);
      await marketplaceService.clearCarrinho();
      setCarrinho([]);
      setError(null);
    } catch (err) {
      setError(err as Error);
      throw err;
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
      const response = await marketplaceService.createPedido(data);
      setPedidos(prev => [...prev, response]);
      await clearCarrinho();
      setError(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const response = await marketplaceService.getPedidos();
      setPedidos(response);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createAvaliacao = async (itemId: string, data: { nota: number; comentario: string }) => {
    try {
      setLoading(true);
      const response = await marketplaceService.createAvaliacao(itemId, data);
      setError(null);
      return response;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAvaliacoes = async (itemId: string) => {
    try {
      setLoading(true);
      const response = await marketplaceService.getAvaliacoes(itemId);
      setError(null);
      return response;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchPedidos();
  }, []);

  return (
    <MarketplaceContext.Provider
      value={{
        items,
        carrinho,
        pedidos,
        selectedItem,
        loading,
        error,
        fetchItems,
        selectItem,
        addToCarrinho,
        updateCarrinhoItem,
        removeFromCarrinho,
        clearCarrinho,
        createPedido,
        fetchPedidos,
        createAvaliacao,
        fetchAvaliacoes,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
} 