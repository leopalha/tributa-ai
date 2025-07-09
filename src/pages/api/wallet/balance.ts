// Simulação de API para desenvolvimento
// Em produção, usar os tipos corretos do Next.js e NextAuth
import { WalletBalance } from '@/types/wallet';

// Simulação de banco de dados para desenvolvimento
const mockWalletBalances: Record<string, WalletBalance> = {
  'user-1': {
    id: 'balance-1',
    userId: 'user-1',
    balance: 5000,
    availableBalance: 5000,
    pendingBalance: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export default async function handler(
  req: any,
  res: any
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Em produção, obter a sessão do usuário
    // const session = await getServerSession(req, res, authOptions);
    // if (!session) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }
    // const userId = session.user.id;

    // Para desenvolvimento, usar um ID fixo
    const userId = 'user-1';

    // Em produção, buscar do banco de dados
    let walletBalance = mockWalletBalances[userId];

    // Se não existir, criar um saldo inicial
    if (!walletBalance) {
      walletBalance = {
        id: `balance-${userId}`,
        userId,
        balance: 0,
        availableBalance: 0,
        pendingBalance: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockWalletBalances[userId] = walletBalance;
    }

    return res.status(200).json(walletBalance);
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 