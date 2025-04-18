import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { EstatisticasMarketplace, Anuncio } from '@/types/marketplace';

interface MarketplaceData {
  estatisticas: EstatisticasMarketplace | null;
  anuncios: Anuncio[] | null;
  isLoading: boolean;
  error: Error | null;
}

export function useMarketplace(): MarketplaceData {
  const [estatisticas, setEstatisticas] = useState<EstatisticasMarketplace | null>(null);
  const [anuncios, setAnuncios] = useState<Anuncio[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [estatisticasResponse, anunciosResponse] = await Promise.all([
          api.get('/marketplace/estatisticas'),
          api.get('/marketplace/anuncios/listar')
        ]);
        setEstatisticas(estatisticasResponse.data);
        setAnuncios(anunciosResponse.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar dados do marketplace'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return {
    estatisticas,
    anuncios,
    isLoading,
    error
  };
} 