import { useState } from 'react';
import { useRouter } from '@/lib/router-utils';
import { toast } from 'sonner';

interface UseCreditActionsProps {
  creditId: string;
}

interface AuctionData {
  type: 'TRADITIONAL' | 'DUTCH';
  startPrice: number;
  startDate: Date;
  endDate: Date;
}

interface SettlementData {
  type: 'DIRECT' | 'PARTIAL';
  participants: {
    userId: string;
    role: 'CREDITOR' | 'DEBTOR';
    value: number;
  }[];
}

export function useCreditActions({ creditId }: UseCreditActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleBuy = async (price: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/marketplace/credits/${creditId}/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to buy credit');
      }

      toast.success('Crédito comprado com sucesso!');
      router.push(`/marketplace/${creditId}`);
    } catch (error) {
      toast.error('Erro ao comprar crédito');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuction = async (data: AuctionData) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/marketplace/credits/${creditId}/auction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create auction');
      }

      toast.success('Leilão criado com sucesso!');
      router.push(`/marketplace/${creditId}`);
    } catch (error) {
      toast.error('Erro ao criar leilão');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettlement = async (data: SettlementData) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/marketplace/credits/${creditId}/settlement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create settlement');
      }

      toast.success('Liquidação proposta com sucesso!');
      router.push(`/marketplace/${creditId}`);
    } catch (error) {
      toast.error('Erro ao propor liquidação');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleBuy,
    handleAuction,
    handleSettlement,
  };
}
