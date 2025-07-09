// =====================================================
// FONTE ÚNICA DE VERDADE PARA TIPOS DE BOTS (ADMIN)
// Este arquivo consolida TODOS os tipos de bots usados no painel admin.
// Foco em bots de empresa para simulação de negociações.
// =====================================================

export interface BotProfile {
  id: string;
  name: string;
  type: 'empresa';
  avatar: string;
  status: 'ativo' | 'pausado' | 'parado' | 'erro';
  strategy: string;
  profit: number;
  transactions: BotTransaction[];
  metrics: BotMetrics;
  createdAt: Date;
  updatedAt: Date;
  // Campos avançados opcionais podem ser adicionados aqui
}

export interface BotTransaction {
  id: string;
  botId: string;
  type: 'compra' | 'venda' | 'arbitragem' | 'proposta';
  value: number;
  timestamp: Date;
  status: 'pendente' | 'executada' | 'cancelada' | 'rejeitada';
  strategy: string;
  profit?: number;
}

export interface BotMetrics {
  totalTransactions: number;
  totalProfit: number;
  successRate: number;
  avgDecisionTime: number;
  // Outros campos relevantes para o admin podem ser adicionados aqui
}

// Aliases para compatibilidade futura
export type AdminBotProfile = BotProfile;
