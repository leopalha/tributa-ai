import { useContext } from 'react';
import { UserContext } from '@/providers/UserProvider';

/**
 * Hook personalizado para acessar o contexto de usuário
 * Fornece acesso ao usuário atual, estado de carregamento, erros e funções
 * de autenticação como signIn e signOut
 *
 * @returns {object} Contexto de usuário contendo user, loading, error, signIn, signOut e outras funções
 * @throws {Error} Se for usado fora do UserProvider
 */
export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}
