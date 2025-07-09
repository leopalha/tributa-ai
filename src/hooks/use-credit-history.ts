import { useState } from 'react';
import { useRouter } from '@/lib/router-utils';
import { toast } from 'sonner';

interface UseCreditHistoryProps {
  creditId: string;
}

interface HistoryEntry {
  id: string;
  type: string;
  status: string;
  price: number;
  createdAt: string;
  buyer: {
    id: string;
    name: string;
    email: string;
  };
  seller: {
    id: string;
    name: string;
    email: string;
  };
}

export function useCreditHistory({ creditId }: UseCreditHistoryProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/marketplace/credits/${creditId}/history`);

      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }

      const data = await response.json();
      return data as HistoryEntry[];
    } catch (error) {
      toast.error('Erro ao carregar histórico');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    fetchHistory,
  };
}
