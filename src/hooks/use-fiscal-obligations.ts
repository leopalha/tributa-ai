import { useState } from 'react';
import { useRouter } from '@/lib/router-utils';
import { toast } from 'sonner';
import { FiscalObligation } from '@prisma/client';

interface UseFiscalObligationsProps {
  initialObligations?: FiscalObligation[];
}

export function useFiscalObligations({ initialObligations = [] }: UseFiscalObligationsProps) {
  const router = useRouter();
  const [obligations, setObligations] = useState<FiscalObligation[]>(initialObligations);
  const [isLoading, setIsLoading] = useState(false);

  const createObligation = async (data: Partial<FiscalObligation>) => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/fiscal/obligations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar obrigação');
      }

      const obligation = await response.json();
      setObligations(prev => [...prev, obligation]);
      toast.success('Obrigação criada com sucesso');
      router.refresh();
      router.push(`/dashboard/gestao-fiscal/${obligation.id}`);
    } catch (error) {
      toast.error('Erro ao criar obrigação');
    } finally {
      setIsLoading(false);
    }
  };

  const updateObligation = async (id: string, data: Partial<FiscalObligation>) => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/fiscal/obligations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar obrigação');
      }

      const updatedObligation = await response.json();
      setObligations(prev =>
        prev.map(obligation => (obligation.id === id ? updatedObligation : obligation))
      );
      toast.success('Obrigação atualizada com sucesso');
      router.refresh();
      router.push(`/dashboard/gestao-fiscal/${id}`);
    } catch (error) {
      toast.error('Erro ao atualizar obrigação');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteObligation = async (id: string) => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/fiscal/obligations/${id}/delete`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir obrigação');
      }

      setObligations(prev => prev.filter(obligation => obligation.id !== id));
      toast.success('Obrigação excluída com sucesso');
      router.refresh();
      router.push('/dashboard/gestao-fiscal');
    } catch (error) {
      toast.error('Erro ao excluir obrigação');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    obligations,
    isLoading,
    createObligation,
    updateObligation,
    deleteObligation,
  };
}
