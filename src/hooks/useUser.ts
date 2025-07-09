import { useState, useEffect, useCallback } from 'react';
// TODO: Replace with custom auth
// import { useSession } from 'next-auth/react';
import { api } from '@/services/api';
import { User as PrismaUser, Empresa } from '@prisma/client'; // Usar tipo Prisma

// Tipo estendido para incluir a empresa, se houver
export type UserWithCompany = PrismaUser & { empresa?: Empresa | null };

interface UseUserReturn {
  user: UserWithCompany | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => void;
  updateUser: (data: Partial<UserWithCompany>) => Promise<boolean>;
  // Adicionar outras funções conforme necessário (ex: changePassword)
}

export const useUser = (): UseUserReturn => {
  // TODO: Implement custom session management for Vite
  const session = null;
  const status = 'unauthenticated';
  const updateSession = async () => {};

  const [user, setUser] = useState<UserWithCompany | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (status === 'authenticated' && session?.user?.id) {
      setLoading(true);
      setError(null);
      try {
        // Chamar API para buscar dados completos do usuário (incluindo empresa)
        const userData: UserWithCompany = await api.get(`/api/users/${session.user.id}`);
        setUser(userData);
      } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err);
        setError((err as Error).message || 'Falha ao carregar dados do usuário.');
      } finally {
        setLoading(false);
      }
    } else if (status !== 'loading') {
      // Se não autenticado ou sem ID, parar loading e limpar usuário
      setUser(null);
      setLoading(false);
    }
  }, [session?.user?.id, status]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const updateUser = useCallback(
    async (data: Partial<UserWithCompany>): Promise<boolean> => {
      if (!user?.id) {
        setError('Usuário não carregado para atualização.');
        return false;
      }
      setLoading(true);
      setError(null);
      try {
        const updatedUser: UserWithCompany = await api.patch(`/api/users/${user.id}`, data);
        setUser(updatedUser); // Atualiza estado local
        // Atualiza sessão do NextAuth se campos relevantes mudaram (ex: nome)
        if (data.name && data.name !== session?.user?.name) {
          await updateSession({ name: data.name });
        }
        return true;
      } catch (err) {
        console.error('Erro ao atualizar usuário:', err);
        setError((err as Error).message || 'Falha ao atualizar dados do usuário.');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user?.id, updateSession, session?.user?.name]
  );

  return {
    user,
    loading: loading || status === 'loading',
    error,
    fetchUser,
    updateUser,
  };
};
