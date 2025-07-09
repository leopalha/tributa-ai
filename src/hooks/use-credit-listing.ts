import { useState } from 'react';
import { useRouter } from '@/lib/router-utils';
import { toast } from 'sonner';

interface UseCreditListingProps {
  creditId: string;
}

export function useCreditListing({ creditId }: UseCreditListingProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleList = async (price: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/marketplace/credits/${creditId}/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to list credit');
      }

      toast.success('Crédito listado com sucesso!');
      router.push(`/marketplace/${creditId}`);
    } catch (error) {
      toast.error('Erro ao listar crédito');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlist = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/marketplace/credits/${creditId}/unlist`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to unlist credit');
      }

      toast.success('Crédito removido da listagem com sucesso!');
      router.push(`/marketplace/${creditId}`);
    } catch (error) {
      toast.error('Erro ao remover crédito da listagem');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleList,
    handleUnlist,
  };
}
