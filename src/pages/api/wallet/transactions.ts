// Simulação de API para desenvolvimento
// Em produção, usar os tipos corretos do Next.js e NextAuth
import { WalletTransaction, WalletTransactionStatus, WalletTransactionType, WalletReferenceType } from '@/types/wallet';

// Simulação de banco de dados para desenvolvimento
const mockTransactions: WalletTransaction[] = [
  {
    id: 'tx-1',
    userId: 'user-1',
    type: WalletTransactionType.DEPOSIT,
    amount: 5000,
    description: 'Depósito inicial',
    status: WalletTransactionStatus.COMPLETED,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 dias atrás
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'tx-2',
    userId: 'user-1',
    type: WalletTransactionType.PLATFORM_FEE,
    amount: 250,
    description: 'Taxa de tokenização',
    status: WalletTransactionStatus.COMPLETED,
    reference: 'token-1',
    referenceType: WalletReferenceType.TOKEN_PURCHASE,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 dias atrás
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'tx-3',
    userId: 'user-1',
    type: WalletTransactionType.WITHDRAWAL,
    amount: 1000,
    description: 'Saque para conta bancária',
    status: WalletTransactionStatus.PENDING,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

export default async function handler(req: any, res: any) {
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

    // Obter parâmetros de paginação
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    // Filtrar transações do usuário
    const userTransactions = mockTransactions
      .filter(tx => tx.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) // Ordenar por data (mais recente primeiro)
      .slice(offset, offset + limit);

    return res.status(200).json(userTransactions);
  } catch (error) {
    console.error('Error getting wallet transactions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 