// Enhanced Real-time System Types for Tributa.AI Platform

export interface EnhancedNotification {
  id: string;
  userId: string;
  type: NotificationTypeEnhanced;
  category: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  message: string;
  data?: Record<string, any>;
  metadata: NotificationMetadata;
  actions?: NotificationAction[];
  read: boolean;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export enum NotificationTypeEnhanced {
  // Marketplace
  PROPOSTA_RECEBIDA = 'PROPOSTA_RECEBIDA',
  PROPOSTA_ACEITA = 'PROPOSTA_ACEITA',
  PROPOSTA_REJEITADA = 'PROPOSTA_REJEITADA',
  PROPOSTA_CONTRAOFERTA = 'PROPOSTA_CONTRAOFERTA',
  LEILAO_INICIADO = 'LEILAO_INICIADO',
  LEILAO_FINALIZADO = 'LEILAO_FINALIZADO',
  LANCE_SUPERADO = 'LANCE_SUPERADO',
  PRECO_ATUALIZADO = 'PRECO_ATUALIZADO',

  // Transactions
  TRANSACAO_INICIADA = 'TRANSACAO_INICIADA',
  TRANSACAO_CONFIRMADA = 'TRANSACAO_CONFIRMADA',
  TRANSACAO_CANCELADA = 'TRANSACAO_CANCELADA',
  PAGAMENTO_RECEBIDO = 'PAGAMENTO_RECEBIDO',
  PAGAMENTO_PROCESSADO = 'PAGAMENTO_PROCESSADO',

  // Blockchain
  TOKENIZACAO_INICIADA = 'TOKENIZACAO_INICIADA',
  TOKENIZACAO_CONCLUIDA = 'TOKENIZACAO_CONCLUIDA',
  TOKENIZACAO_FALHOU = 'TOKENIZACAO_FALHOU',
  VALIDACAO_CONCLUIDA = 'VALIDACAO_CONCLUIDA',
  SMART_CONTRACT_EXECUTADO = 'SMART_CONTRACT_EXECUTADO',

  // Compensation
  COMPENSACAO_SOLICITADA = 'COMPENSACAO_SOLICITADA',
  COMPENSACAO_APROVADA = 'COMPENSACAO_APROVADA',
  COMPENSACAO_REJEITADA = 'COMPENSACAO_REJEITADA',
  COMPENSACAO_PROCESSADA = 'COMPENSACAO_PROCESSADA',
  MULTILATERAL_ENCONTRADA = 'MULTILATERAL_ENCONTRADA',

  // Fiscal
  OBRIGACAO_VENCENDO = 'OBRIGACAO_VENCENDO',
  OBRIGACAO_VENCIDA = 'OBRIGACAO_VENCIDA',
  DECLARACAO_PROCESSADA = 'DECLARACAO_PROCESSADA',
  ALERTA_CONFORMIDADE = 'ALERTA_CONFORMIDADE',
  AUDITORIA_INICIADA = 'AUDITORIA_INICIADA',

  // System
  SISTEMA_MANUTENCAO = 'SISTEMA_MANUTENCAO',
  BACKUP_CONCLUIDO = 'BACKUP_CONCLUIDO',
  ERRO_CRITICO = 'ERRO_CRITICO',
  ATUALIZACAO_DISPONIVEL = 'ATUALIZACAO_DISPONIVEL',

  // Communication
  MENSAGEM_RECEBIDA = 'MENSAGEM_RECEBIDA',
  CHAT_INICIADO = 'CHAT_INICIADO',
  VIDEOCHAMADA_INICIADA = 'VIDEOCHAMADA_INICIADA',

  // Analytics
  RELATORIO_GERADO = 'RELATORIO_GERADO',
  ANOMALIA_DETECTADA = 'ANOMALIA_DETECTADA',
  TENDENCIA_IDENTIFICADA = 'TENDENCIA_IDENTIFICADA',
  META_ATINGIDA = 'META_ATINGIDA',
}

export enum NotificationCategory {
  MARKETPLACE = 'MARKETPLACE',
  BLOCKCHAIN = 'BLOCKCHAIN',
  FISCAL = 'FISCAL',
  FINANCIAL = 'FINANCIAL',
  SYSTEM = 'SYSTEM',
  SECURITY = 'SECURITY',
  COMPLIANCE = 'COMPLIANCE',
  ANALYTICS = 'ANALYTICS',
  COMMUNICATION = 'COMMUNICATION',
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL',
}

export interface NotificationMetadata {
  source: string;
  sourceId?: string;
  relatedEntities?: Array<{
    type: string;
    id: string;
    name?: string;
  }>;
  tags?: string[];
  locale?: string;
  deviceInfo?: {
    platform: string;
    userAgent?: string;
  };
}

export interface NotificationAction {
  id: string;
  label: string;
  type: 'button' | 'link' | 'dismiss';
  action: string;
  url?: string;
  style?: 'primary' | 'secondary' | 'danger';
  requiresConfirmation?: boolean;
}

// Real-time subscription types
export interface SubscriptionFilters {
  categories?: NotificationCategory[];
  priorities?: NotificationPriority[];
  types?: NotificationTypeEnhanced[];
  entityIds?: string[];
  keywords?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface RealTimeSubscription {
  id: string;
  userId: string;
  channel: string;
  filters?: SubscriptionFilters;
  active: boolean;
  createdAt: Date;
  lastActivity: Date;
}

// Enhanced WebSocket Events
export interface ServerToClientEventsEnhanced {
  // Notifications
  notification: (notification: EnhancedNotification) => void;
  notificationUpdate: (notificationId: string, updates: Partial<EnhancedNotification>) => void;
  notificationBatch: (notifications: EnhancedNotification[]) => void;

  // Market updates
  marketUpdate: (data: MarketUpdateData) => void;
  priceUpdate: (data: PriceUpdateData) => void;
  volumeUpdate: (data: VolumeUpdateData) => void;

  // Trading
  orderUpdate: (data: OrderUpdateData) => void;
  tradeExecuted: (data: TradeExecutedData) => void;
  positionUpdate: (data: PositionUpdateData) => void;

  // Blockchain
  blockchainEvent: (data: BlockchainEventData) => void;
  transactionConfirmed: (data: TransactionConfirmedData) => void;

  // System
  systemStatus: (data: SystemStatusData) => void;
  maintenanceMode: (data: MaintenanceModeData) => void;

  // Analytics
  analyticsUpdate: (data: AnalyticsUpdateData) => void;
  reportReady: (data: ReportReadyData) => void;

  // Presence
  userPresence: (data: UserPresenceData) => void;
  typingIndicator: (data: TypingIndicatorData) => void;
}

export interface ClientToServerEventsEnhanced {
  // Subscription management
  subscribe: (channel: string, filters?: SubscriptionFilters) => void;
  unsubscribe: (channel: string) => void;
  updateFilters: (channel: string, filters: SubscriptionFilters) => void;

  // Notification actions
  markAsRead: (notificationIds: string[]) => void;
  markAsArchived: (notificationIds: string[]) => void;
  executeAction: (notificationId: string, actionId: string) => void;

  // Presence
  updatePresence: (status: UserPresenceStatus) => void;
  startTyping: (channelId: string) => void;
  stopTyping: (channelId: string) => void;

  // Real-time queries
  requestSnapshot: (channel: string) => void;
  requestHistory: (channel: string, options: HistoryOptions) => void;
}

// Data interfaces for events
export interface MarketUpdateData {
  type: 'NEW_LISTING' | 'PRICE_CHANGE' | 'STATUS_CHANGE' | 'VOLUME_CHANGE';
  entityId: string;
  entityType: 'CREDIT_TITLE' | 'AUCTION' | 'ORDER';
  details: Record<string, any>;
  timestamp: Date;
}

export interface PriceUpdateData {
  entityId: string;
  entityType: string;
  oldPrice: number;
  newPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: Date;
}

export interface VolumeUpdateData {
  entityId: string;
  volume: number;
  volumeChange: number;
  averagePrice: number;
  timestamp: Date;
}

export interface OrderUpdateData {
  orderId: string;
  status: string;
  price?: number;
  quantity?: number;
  filled?: number;
  remaining?: number;
  timestamp: Date;
}

export interface TradeExecutedData {
  tradeId: string;
  buyOrderId: string;
  sellOrderId: string;
  price: number;
  quantity: number;
  entityId: string;
  timestamp: Date;
}

export interface PositionUpdateData {
  userId: string;
  entityId: string;
  position: number;
  averagePrice: number;
  unrealizedPnL: number;
  timestamp: Date;
}

export interface BlockchainEventData {
  type: 'TRANSACTION' | 'BLOCK' | 'CONTRACT_EVENT';
  transactionHash?: string;
  blockNumber?: number;
  contractAddress?: string;
  eventName?: string;
  data: Record<string, any>;
  timestamp: Date;
}

export interface TransactionConfirmedData {
  transactionHash: string;
  blockNumber: number;
  confirmations: number;
  gasUsed: number;
  status: 'SUCCESS' | 'FAILED';
  timestamp: Date;
}

export interface SystemStatusData {
  component: string;
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED' | 'MAINTENANCE';
  message?: string;
  timestamp: Date;
}

export interface MaintenanceModeData {
  enabled: boolean;
  scheduledStart?: Date;
  scheduledEnd?: Date;
  reason?: string;
  affectedServices?: string[];
}

export interface AnalyticsUpdateData {
  type: 'METRIC_UPDATE' | 'REPORT_PROGRESS' | 'INSIGHT_GENERATED';
  data: Record<string, any>;
  timestamp: Date;
}

export interface ReportReadyData {
  reportId: string;
  reportType: string;
  downloadUrl: string;
  expiresAt: Date;
  timestamp: Date;
}

export interface UserPresenceData {
  userId: string;
  status: UserPresenceStatus;
  lastSeen?: Date;
  customMessage?: string;
}

export interface TypingIndicatorData {
  userId: string;
  channelId: string;
  isTyping: boolean;
}

export enum UserPresenceStatus {
  ONLINE = 'ONLINE',
  AWAY = 'AWAY',
  BUSY = 'BUSY',
  OFFLINE = 'OFFLINE',
}

export interface HistoryOptions {
  limit?: number;
  offset?: number;
  startDate?: Date;
  endDate?: Date;
  filters?: Record<string, any>;
}

// Real-time analytics types
export interface RealTimeMetric {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
  unit: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface RealTimeAlert {
  id: string;
  type: 'THRESHOLD' | 'ANOMALY' | 'TREND' | 'PATTERN';
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  metric: string;
  condition: string;
  currentValue: number;
  thresholdValue?: number;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

// Connection management
export interface ConnectionState {
  connected: boolean;
  reconnecting: boolean;
  reconnectAttempts: number;
  lastConnected?: Date;
  lastDisconnected?: Date;
  latency?: number;
  subscriptions: string[];
}

export interface ConnectionStats {
  totalConnections: number;
  activeSubscriptions: number;
  messagesReceived: number;
  messagesSent: number;
  errorsCount: number;
  averageLatency: number;
  uptime: number;
}

export enum TipoNotificacao {
  SISTEMA = 'SISTEMA',
  TRANSACAO = 'TRANSACAO',
  MARKETPLACE = 'MARKETPLACE',
  COMPENSACAO = 'COMPENSACAO',
  FISCAL = 'FISCAL',
  INTEGRACAO = 'INTEGRACAO',
  SEGURANCA = 'SEGURANCA',
  MANUTENCAO = 'MANUTENCAO',
}

export enum PrioridadeNotificacao {
  BAIXA = 'BAIXA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  CRITICA = 'CRITICA',
}

export enum StatusNotificacao {
  NAO_LIDA = 'NAO_LIDA',
  LIDA = 'LIDA',
  ARQUIVADA = 'ARQUIVADA',
}

export interface Notificacao {
  id: string;
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
  prioridade: PrioridadeNotificacao;
  status: StatusNotificacao;
  destinatarioId: string;
  remetenteId?: string;
  dados?: any;
  acoes?: NotificacaoAcao[];
  criadaEm: Date;
  lidaEm?: Date;
  expiresEm?: Date;
}

export interface NotificacaoAcao {
  id: string;
  label: string;
  tipo: 'button' | 'link' | 'callback';
  url?: string;
  callback?: string;
  estilo?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export interface FiltrosNotificacao {
  tipo?: TipoNotificacao[];
  status?: StatusNotificacao[];
  prioridade?: PrioridadeNotificacao[];
  dataInicio?: Date;
  dataFim?: Date;
  remetenteId?: string;
  limit?: number;
  offset?: number;
}

export interface EstatisticasNotificacao {
  total: number;
  naoLidas: number;
  lidas: number;
  arquivadas: number;
  porTipo: Record<TipoNotificacao, number>;
  porPrioridade: Record<PrioridadeNotificacao, number>;
}

export interface ConfiguracaoNotificacao {
  usuarioId: string;
  tiposHabilitados: TipoNotificacao[];
  canaisHabilitados: string[];
  horarioSilencioso?: {
    inicio: string;
    fim: string;
  };
  frequenciaDigest?: 'imediata' | 'horaria' | 'diaria' | 'semanal';
}

export interface EventoRealtime {
  id: string;
  tipo: string;
  dados: any;
  timestamp: Date;
  origem: string;
  destinatarios?: string[];
  sala?: string;
}

export interface ConexaoRealtime {
  id: string;
  usuarioId: string;
  socketId: string;
  conectadoEm: Date;
  ultimaAtividade: Date;
  salas: string[];
  metadados?: any;
}
