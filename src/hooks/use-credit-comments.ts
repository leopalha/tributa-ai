import { useState } from 'react';
import { useRouter } from '@/lib/router-utils';
import { toast } from 'sonner';

interface UseCreditCommentsProps {
  creditId: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export function useCreditComments({ creditId }: UseCreditCommentsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/marketplace/credits/${creditId}/comments`);

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data = await response.json();
      return data as Comment[];
    } catch (error) {
      toast.error('Erro ao carregar comentários');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const addComment = async (content: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/marketplace/credits/${creditId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      toast.success('Comentário adicionado com sucesso');
      router.refresh();
    } catch (error) {
      toast.error('Erro ao adicionar comentário');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/marketplace/credits/${creditId}/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      toast.success('Comentário removido com sucesso');
      router.refresh();
    } catch (error) {
      toast.error('Erro ao remover comentário');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    fetchComments,
    addComment,
    deleteComment,
  };
}
