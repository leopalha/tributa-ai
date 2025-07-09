import { FormaPagamento } from './prisma';

export interface WalletBalance {
  id: string;
  userId: string;
  balance: number;
  availableBalance: number;
  pendingBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: WalletTransactionType;
  amount: number;
  description: string;
  status: WalletTransactionStatus;
  reference?: string; // ID da transação relacionada (compra, venda, etc.)
  referenceType?: WalletReferenceType;
  paymentMethod?: FormaPagamento;
  paymentDetails?: PaymentDetails;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentDetails {
  transactionId?: string; // ID da transação bancária/PIX/blockchain
  bank?: string;
  agency?: string;
  account?: string;
  receiptUrl?: string;
  pixCode?: string;
  boletoUrl?: string;
  boletoCode?: string;
  blockchainTxHash?: string;
}

export enum WalletTransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  PLATFORM_FEE = 'PLATFORM_FEE',
  PURCHASE = 'PURCHASE',
  SALE = 'SALE',
  REFUND = 'REFUND',
  ADJUSTMENT = 'ADJUSTMENT'
}

export enum WalletTransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum WalletReferenceType {
  TOKEN_PURCHASE = 'TOKEN_PURCHASE',
  TOKEN_SALE = 'TOKEN_SALE',
  MARKETPLACE_FEE = 'MARKETPLACE_FEE',
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL'
}

export interface WalletPaymentMethod {
  id: string;
  userId: string;
  type: FormaPagamento;
  isDefault: boolean;
  details: {
    bank?: string;
    agency?: string;
    account?: string;
    pixKey?: string;
    cardLastFour?: string;
    cardBrand?: string;
    walletAddress?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentRequest {
  amount: number;
  description: string;
  referenceId?: string;
  referenceType?: WalletReferenceType;
  paymentMethod?: FormaPagamento;
  callbackUrl?: string;
  expiresAt?: Date;
}

export interface BlockchainTransaction {
  id: string;
  hash: string;
  blockNumber: number;
  timestamp: string;
  from: string;
  to: string;
  value: number;
  fee: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  type: 'SEND' | 'RECEIVE' | 'CONTRACT_INTERACTION';
}

export interface WalletAnalyticsData {
  balanceHistory: BalanceHistoryItem[];
  transactionsByCategory: CategoryDistribution[];
  monthlyActivity: MonthlyActivityItem[];
  totalDeposits: number;
  totalWithdrawals: number;
  averageTransaction: number;
  transactionGrowth: number;
}

export interface BalanceHistoryItem {
  date: string;
  balance: number;
}

export interface CategoryDistribution {
  category: string;
  amount: number;
}

export interface MonthlyActivityItem {
  month: string;
  deposits: number;
  withdrawals: number;
}

// Tipos para tokenização de ativos
export interface TokenizationRequest {
  id: string;
  assetType: 'CREDITO_FISCAL' | 'PRECATORIO' | 'TITULO' | 'OUTRO';
  assetValue: number;
  assetDescription: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  completedAt?: string;
  tokenId?: string;
  tokenAddress?: string;
  transactionHash?: string;
  progress: number;
}

export interface Token {
  id: string;
  name: string;
  symbol: string;
  tokenType: 'ERC20' | 'ERC721' | 'ERC1155';
  contractAddress: string;
  balance: string;
  formattedBalance: string;
  value: number;
  priceUsd: number;
  change24h: number;
  imageUrl?: string;
  isVerified: boolean;
  network: string;
  lastUpdated: string;
}

export interface SwapQuote {
  fromAmount: string;
  toAmount: string;
  exchangeRate: number;
  priceImpact: number;
  fee: number;
  minReceived: string;
  route: string[];
  estimatedTime: number;
}

export interface SwapResult {
  success: boolean;
  transactionHash: string;
  fromAmount?: string;
  toAmount?: string;
  timestamp?: string;
} 