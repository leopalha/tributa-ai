// Export commonly used types for backward compatibility
export type { Obrigacao, AnexoObrigacao, HistoricoObrigacao } from '@/types/obrigacao';
export type { User } from '@prisma/client';

// TC and Transaction types
export interface TC {
  id: string;
  title: string;
  value: number;
  status: string;
  type: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  fromUserId: string;
  toUserId: string;
  tcId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  type: 'transfer' | 'purchase' | 'compensation';
  createdAt: string;
  updatedAt: string;
}
