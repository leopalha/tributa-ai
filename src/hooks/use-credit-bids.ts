import { useState } from 'react';
import { useRouter } from '@/lib/router-utils';
import { toast } from 'sonner';

interface UseCreditBidsProps {
  creditId: string;
}

interface BidData {
  price: number;
  type: 'DIRECT' | 'AUCTION';
}

export function useCreditBids({ creditId }: UseCreditBidsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleBid = async (data: BidData) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/marketplace/credits/${creditId}/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to place bid');
      }

      toast.success('Lance enviado com sucesso!');
      router.push(`/marketplace/${creditId}`);
    } catch (error) {
      toast.error('Erro ao enviar lance');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/marketplace/credits/${creditId}/bids/${bidId}/accept`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to accept bid');
      }

      toast.success('Lance aceito com sucesso!');
      router.push(`/marketplace/${creditId}`);
    } catch (error) {
      toast.error('Erro ao aceitar lance');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectBid = async (bidId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/marketplace/credits/${creditId}/bids/${bidId}/reject`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to reject bid');
      }

      toast.success('Lance rejeitado com sucesso!');
      router.push(`/marketplace/${creditId}`);
    } catch (error) {
      toast.error('Erro ao rejeitar lance');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleBid,
    handleAcceptBid,
    handleRejectBid,
  };
}
