import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CreditCategory, CreditStatus } from '@prisma/client';

interface MarketplaceFilters {
  category?: CreditCategory;
  minValue?: number;
  maxValue?: number;
  status?: CreditStatus;
  verified?: boolean;
  tokenized?: boolean;
}

interface MarketplaceState {
  filters: MarketplaceFilters;
  setFilters: (filters: MarketplaceFilters) => void;
  credits: any[];
  isLoading: boolean;
  error: Error | null;
}

export function useMarketplace(): MarketplaceState {
  const [filters, setFilters] = useState<MarketplaceFilters>({});

  const {
    data: credits,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['credits', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.minValue) params.append('minValue', filters.minValue.toString());
      if (filters.maxValue) params.append('maxValue', filters.maxValue.toString());
      if (filters.status) params.append('status', filters.status);
      if (filters.verified) params.append('verified', 'true');
      if (filters.tokenized) params.append('tokenized', 'true');

      const response = await fetch(`/api/marketplace/credits?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch credits');
      }
      return response.json();
    },
  });

  return {
    filters,
    setFilters,
    credits: credits || [],
    isLoading,
    error: error as Error | null,
  };
}
