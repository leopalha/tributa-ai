// Enum types that match the Prisma schema
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  EMPRESA = 'EMPRESA',
  PROFISSIONAL_TRIBUTARIO = 'PROFISSIONAL_TRIBUTARIO',
  INVESTIDOR_QUALIFICADO = 'INVESTIDOR_QUALIFICADO',
}

export enum CreditCategory {
  TRIBUTARIO = 'TRIBUTARIO',
  COMERCIAL = 'COMERCIAL',
  FINANCEIRO = 'FINANCEIRO',
  JUDICIAL = 'JUDICIAL',
  RURAL = 'RURAL',
  IMOBILIARIO = 'IMOBILIARIO',
  AMBIENTAL = 'AMBIENTAL',
  ESPECIAL = 'ESPECIAL',
}

export enum CreditStatus {
  DRAFT = 'DRAFT',
  PENDING_VALIDATION = 'PENDING_VALIDATION',
  VALIDATED = 'VALIDATED',
  REJECTED = 'REJECTED',
  PENDING_TOKENIZATION = 'PENDING_TOKENIZATION',
  TOKENIZED = 'TOKENIZED',
  LISTED_FOR_SALE = 'LISTED_FOR_SALE',
  IN_NEGOTIATION = 'IN_NEGOTIATION',
  NEGOTIATED = 'NEGOTIATED',
  SETTLEMENT_PENDING = 'SETTLEMENT_PENDING',
  SETTLED = 'SETTLED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum TipoNegociacao {
  LEILAO = 'LEILAO',
  NEGOCIACAO_DIRETA = 'NEGOCIACAO_DIRETA',
  VENDA_DIRETA = 'VENDA_DIRETA',
}

export type FormaPagamento = 'PIX' | 'BOLETO' | 'TRANSFERENCIA_BANCARIA' | 'BLOCKCHAIN_TRANSFER';

// Adicionar Enum DebitoStatus
export enum DebitoStatus {
  ABERTO = 'ABERTO',
  EM_COMPENSACAO = 'EM_COMPENSACAO',
  PAGO_PARCIALMENTE = 'PAGO_PARCIALMENTE',
  PAGO_TOTALMENTE = 'PAGO_TOTALMENTE',
  CANCELADO = 'CANCELADO',
  VENCIDO = 'VENCIDO',
}

// Type interfaces for Prisma models
export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  password?: string | null;
  role: UserRole;
  twoFactorEnabled: boolean;
  termsAcceptedAt?: Date | null;
  walletAddress?: string | null;
  kycStatus?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Empresa {
  id: string;
  razaoSocial: string;
  nomeFantasia?: string | null;
  cnpj: string;
  inscEstadual?: string | null;
  inscMunicipal?: string | null;
  endereco?: Address | null;
  telefone?: string | null;
  email?: string | null;
  website?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  representantePrincipalId: string;
}

export interface CreditTitle {
  id: string;
  title?: string;
  value: number;
  category: string;
  subtype: string;
  issuerName: string;
  dueDate?: Date;
  status: string;
  tokenizationInfo?: {
    tokenAddress: string;
    tokenId: string;
    network: string;
    createdAt: Date;
  };
}

export interface Anuncio {
  id: string;
  description?: string | null;
  askingPrice?: number | null;
  minimumBid?: number | null;
  buyNowPrice?: number | null;
  type: TipoNegociacao;
  status: string;
  publishedAt: Date;
  expiresAt?: Date | null;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  creditTitleId: string;
  sellerId: string;

  // Relations (optional for type safety)
  creditTitle?: CreditTitle;
  seller?: User;
  propostas?: Proposta[];
}

export interface Proposta {
  id: string;
  offerValue: number;
  message?: string | null;
  status: string;
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  anuncioId: string;
  buyerId: string;

  // Relations
  anuncio?: Anuncio;
  buyer?: User;
}

export interface Transacao {
  id: string;
  finalValue: number;
  status: string;
  paymentMethod: FormaPagamento;
  paymentDetails?: PaymentDetails | null;
  settlementInfo?: SettlementInfo | null;
  documents: DocumentLink[];
  timeline: TimelineEvent[];
  createdAt: Date;
  updatedAt: Date;
  anuncioId?: string | null;
  sellerId: string;
  buyerId: string;
  propostaId?: string | null;

  // Relations
  anuncio?: Anuncio | null;
  seller?: User;
  buyer?: User;
  proposta?: Proposta | null;
}

// Interface para Endereço (usado em Empresa)
export interface Address {
  logradouro: string;
  numero: string;
  complemento?: string | null;
  bairro: string;
  cidade: string;
  estado: string; // Ou um enum de UFs?
  cep: string;
  pais?: string; // Opcional
}

// Interface para links de documentos (usado em CreditTitle)
export interface DocumentLink {
  type: string; // Ex: 'sentenca', 'certidao', 'contrato'
  url: string;
  description?: string;
  uploadedAt?: Date | string;
}

// Interface para eventos de validação (usado em CreditTitle)
export interface ValidationEvent {
  date: Date | string;
  status: string; // Ou um enum ValidationStatus?
  by: string; // Quem validou (ex: 'Sistema', 'Admin ID')
  notes?: string;
}

// Interface para garantias (usado em CreditTitle)
export interface Guarantee {
  type: string; // Ou enum TipoGarantia?
  description: string;
  value?: number | null;
  documentUrl?: string | null;
}

// Interface para detalhes de tokenização (usado em CreditTitle)
export interface TokenizationDetails {
  blockchainPlatform: string; // Ex: 'Hyperledger Fabric'
  tokenStandard?: string; // Ex: ERC-1155 (se aplicável)
  transactionHash?: string | null;
  tokenAddress?: string | null; // Endereço do contrato/token
  tokenizedAt?: Date | string;
}

// Interface para detalhes de pagamento (usado em Transacao)
export interface PaymentDetails {
  // Campos dependem do FormaPagamento
  transactionId?: string; // ID da transação bancária/PIX/blockchain
  bank?: string;
  agency?: string;
  account?: string;
  receiptUrl?: string;
}

// Interface para informações de liquidação (usado em Transacao)
export interface SettlementInfo {
  settledAt: Date | string;
  blockchainTxHash?: string | null; // Hash da transferência no Fabric
  confirmationDetails?: string;
}

// Interface para eventos da timeline (usado em Transacao)
export interface TimelineEvent {
  timestamp: Date | string;
  status: string; // Status da Transacao naquele ponto
  description: string;
  actorId?: string | null; // Quem realizou a ação
}

// Adicionar Interface DebitoFiscal
export interface DebitoFiscal {
  id: string;
  userId: string;
  empresaId?: string | null;
  tipoTributo: string;
  competencia: string;
  valorOriginal: number;
  valorAtualizado?: number | null;
  valorPago: number;
  dataVencimento: Date;
  status: DebitoStatus; // Usar o enum já definido
  codigoReceita?: string | null;
  documentoReferencia?: string | null;
  descricao?: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Relações simplificadas para tipo (API trará dados completos se include for usado)
  user?: Pick<User, 'id' | 'name'> | null;
  empresa?: Pick<Empresa, 'id' | 'razaoSocial'> | null;
}

// Add the Notification interface to the end of the file

export interface Notification {
  id: string;
  mensagem: string;
  tipo?: string;
  lida: boolean;
  userId: string;
  contextoId?: string;
  contextoTipo?: string;
  metadados?: any;
  createdAt: Date;
  updatedAt: Date;
}

// Add Prisma namespace for error types used in tests
export namespace Prisma {
  export class PrismaClientKnownRequestError extends Error {
    code: string;
    meta?: any;
    constructor(message: string, props: { code: string; meta?: any }) {
      super(message);
      this.code = props.code;
      this.meta = props.meta;
    }
  }
}
