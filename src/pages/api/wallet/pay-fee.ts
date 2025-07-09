// Simulação de API para desenvolvimento
// Em produção, usar os tipos corretos do Next.js e NextAuth
import { WalletTransaction, WalletTransactionStatus, WalletTransactionType, WalletReferenceType } from '@/types/wallet';

// Simulação de banco de dados para desenvolvimento
const mockWalletBalances: Record<string, { balance: number; availableBalance: number; pendingBalance: number }> = {
  'user-1': {
    balance: 5000,
    availableBalance: 5000,
    pendingBalance: 0,
  },
};

const mockTransactions: WalletTransaction[] = [];

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
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

    const { amount, description, referenceId, referenceType, useWalletBalance } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    if (!referenceId) {
      return res.status(400).json({ error: 'Reference ID is required' });
    }

    // Verificar se o usuário tem saldo suficiente
    const userBalance = mockWalletBalances[userId];
    if (!userBalance) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    if (useWalletBalance && userBalance.availableBalance < amount) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient funds',
        paymentRequest: {
          amount,
          description,
          referenceId,
          referenceType,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
        },
      });
    }

    // Processar o pagamento
    if (useWalletBalance) {
      // Deduzir do saldo
      userBalance.balance -= amount;
      userBalance.availableBalance -= amount;

      // Criar transação
      const transaction: WalletTransaction = {
        id: `tx-${Date.now()}`,
        userId,
        type: WalletTransactionType.PLATFORM_FEE,
        amount,
        description,
        status: WalletTransactionStatus.COMPLETED,
        reference: referenceId,
        referenceType,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTransactions.push(transaction);

      return res.status(200).json({
        success: true,
        transaction,
      });
    } else {
      // Criar solicitação de pagamento externo
      return res.status(200).json({
        success: false,
        paymentRequest: {
          amount,
          description,
          referenceId,
          referenceType,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
        },
      });
    }
  } catch (error) {
    console.error('Error processing fee payment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 