import io from 'socket.io-client';
import {
  EnhancedNotification,
  NotificationTypeEnhanced,
  NotificationCategory,
  NotificationPriority,
  SubscriptionFilters,
  ServerToClientEventsEnhanced,
  ClientToServerEventsEnhanced,
  ConnectionState,
  UserPresenceStatus,
  RealTimeMetric,
  RealTimeAlert,
  MarketUpdateData,
  AnalyticsUpdateData,
} from '@/types/realtime-enhanced';
import { api } from './api';
import {
  Notificacao,
  TipoNotificacao,
  PrioridadeNotificacao,
  StatusNotificacao,
  FiltrosNotificacao,
  EstatisticasNotificacao,
  ConfiguracaoNotificacao,
  EventoRealtime,
  ConexaoRealtime,
} from '@/types/realtime-enhanced';

interface RealtimeServiceConfig {
  url: string;
  autoConnect: boolean;
  reconnection: boolean;
  reconnectionAttempts: number;
  reconnectionDelay: number;
  timeout: number;
}

class EnhancedRealtimeService {
  private static instance: EnhancedRealtimeService;
  private socket: any | null = null;
  private connectionState: ConnectionState = {
    connected: false,
    reconnecting: false,
    reconnectAttempts: 0,
    subscriptions: [],
  };
  private config: RealtimeServiceConfig;
  private eventListeners: Map<string, Set<Function>> = new Map();
  private notificationCache: Map<string, EnhancedNotification> = new Map();
  private metricsCache: Map<string, RealTimeMetric> = new Map();
  private alertsCache: Map<string, RealTimeAlert> = new Map();
  private presenceCache: Map<string, UserPresenceStatus> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private baseUrl = '/api/notifications';

  private constructor(config?: Partial<RealtimeServiceConfig>) {
    this.config = {
      url: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000',
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      ...config,
    };

    if (this.config.autoConnect) {
      this.connect();
    }
  }

  public static getInstance(config?: Partial<RealtimeServiceConfig>): EnhancedRealtimeService {
    if (!EnhancedRealtimeService.instance) {
      EnhancedRealtimeService.instance = new EnhancedRealtimeService(config);
    }
    return EnhancedRealtimeService.instance;
  }

  // Connection Management
  public connect(userId?: string, token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      this.socket = io(this.config.url, {
        path: '/api/socket',
        transports: ['websocket', 'polling'],
        timeout: this.config.timeout,
        reconnection: this.config.reconnection,
        reconnectionAttempts: this.config.reconnectionAttempts,
        reconnectionDelay: this.config.reconnectionDelay,
        auth: {
          userId,
          token,
        },
      });

      this.setupEventHandlers();

      this.socket.on('connect', () => {
        this.connectionState.connected = true;
        this.connectionState.reconnecting = false;
        this.connectionState.reconnectAttempts = 0;
        this.connectionState.lastConnected = new Date();

        this.startHeartbeat();
        this.emit('connection:established');
        resolve();
      });

      this.socket.on('connect_error', error => {
        this.connectionState.connected = false;
        this.emit('connection:error', error);
        reject(error);
      });

      this.socket.on('disconnect', reason => {
        this.connectionState.connected = false;
        this.connectionState.lastDisconnected = new Date();
        this.stopHeartbeat();
        this.emit('connection:lost', reason);

        if (reason === 'io server disconnect') {
          // Server initiated disconnect, try to reconnect
          this.attemptReconnect();
        }
      });
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.stopHeartbeat();
    this.clearReconnectTimeout();
    this.connectionState.connected = false;
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Enhanced Notifications
    this.socket.on('notification', (notification: EnhancedNotification) => {
      this.notificationCache.set(notification.id, notification);
      this.emit('notification:received', notification);
      this.handleNotificationByPriority(notification);
    });

    this.socket.on(
      'notificationUpdate',
      (notificationId: string, updates: Partial<EnhancedNotification>) => {
        const existing = this.notificationCache.get(notificationId);
        if (existing) {
          const updated = { ...existing, ...updates, updatedAt: new Date() };
          this.notificationCache.set(notificationId, updated);
          this.emit('notification:updated', updated);
        }
      }
    );

    this.socket.on('notificationBatch', (notifications: EnhancedNotification[]) => {
      notifications.forEach(notif => {
        this.notificationCache.set(notif.id, notif);
      });
      this.emit('notification:batch', notifications);
    });

    // Market Updates
    this.socket.on('marketUpdate', (data: MarketUpdateData) => {
      this.emit('market:update', data);
    });

    this.socket.on('priceUpdate', data => {
      this.emit('market:price', data);
    });

    this.socket.on('volumeUpdate', data => {
      this.emit('market:volume', data);
    });

    // Trading
    this.socket.on('orderUpdate', data => {
      this.emit('trading:order', data);
    });

    this.socket.on('tradeExecuted', data => {
      this.emit('trading:executed', data);
    });

    this.socket.on('positionUpdate', data => {
      this.emit('trading:position', data);
    });

    // Blockchain
    this.socket.on('blockchainEvent', data => {
      this.emit('blockchain:event', data);
    });

    this.socket.on('transactionConfirmed', data => {
      this.emit('blockchain:transaction', data);
    });

    // System
    this.socket.on('systemStatus', data => {
      this.emit('system:status', data);
    });

    this.socket.on('maintenanceMode', data => {
      this.emit('system:maintenance', data);
    });

    // Analytics
    this.socket.on('analyticsUpdate', (data: AnalyticsUpdateData) => {
      this.emit('analytics:update', data);
    });

    this.socket.on('reportReady', data => {
      this.emit('analytics:report', data);
    });

    // Presence
    this.socket.on('userPresence', data => {
      this.presenceCache.set(data.userId, data.status);
      this.emit('presence:update', data);
    });

    this.socket.on('typingIndicator', data => {
      this.emit('typing:indicator', data);
    });
  }

  // Subscription Management
  public subscribe(channel: string, filters?: SubscriptionFilters): void {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('subscribe', channel, filters);

    if (!this.connectionState.subscriptions.includes(channel)) {
      this.connectionState.subscriptions.push(channel);
    }

    this.emit('subscription:added', { channel, filters });
  }

  public unsubscribe(channel: string): void {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('unsubscribe', channel);

    const index = this.connectionState.subscriptions.indexOf(channel);
    if (index > -1) {
      this.connectionState.subscriptions.splice(index, 1);
    }

    this.emit('subscription:removed', { channel });
  }

  public updateFilters(channel: string, filters: SubscriptionFilters): void {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('updateFilters', channel, filters);
    this.emit('subscription:updated', { channel, filters });
  }

  // Notification Management
  public markNotificationsAsRead(notificationIds: string[]): void {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('markAsRead', notificationIds);

    // Update local cache
    notificationIds.forEach(id => {
      const notification = this.notificationCache.get(id);
      if (notification) {
        notification.read = true;
        notification.updatedAt = new Date();
        this.notificationCache.set(id, notification);
      }
    });
  }

  public archiveNotifications(notificationIds: string[]): void {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('markAsArchived', notificationIds);

    // Update local cache
    notificationIds.forEach(id => {
      const notification = this.notificationCache.get(id);
      if (notification) {
        notification.archived = true;
        notification.updatedAt = new Date();
        this.notificationCache.set(id, notification);
      }
    });
  }

  public executeNotificationAction(notificationId: string, actionId: string): void {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('executeAction', notificationId, actionId);
  }

  // Presence Management
  public updatePresence(status: UserPresenceStatus): void {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('updatePresence', status);
  }

  public startTyping(channelId: string): void {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('startTyping', channelId);
  }

  public stopTyping(channelId: string): void {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('stopTyping', channelId);
  }

  // Data Retrieval
  public requestSnapshot(channel: string): void {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('requestSnapshot', channel);
  }

  public requestHistory(channel: string, options: any): void {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('requestHistory', channel, options);
  }

  // Cache Management
  public getNotification(id: string): EnhancedNotification | undefined {
    return this.notificationCache.get(id);
  }

  public getAllNotifications(): EnhancedNotification[] {
    return Array.from(this.notificationCache.values());
  }

  public getUnreadNotifications(): EnhancedNotification[] {
    return Array.from(this.notificationCache.values()).filter(n => !n.read);
  }

  public getNotificationsByCategory(category: NotificationCategory): EnhancedNotification[] {
    return Array.from(this.notificationCache.values()).filter(n => n.category === category);
  }

  public getNotificationsByPriority(priority: NotificationPriority): EnhancedNotification[] {
    return Array.from(this.notificationCache.values()).filter(n => n.priority === priority);
  }

  public getUserPresence(userId: string): UserPresenceStatus | undefined {
    return this.presenceCache.get(userId);
  }

  public getConnectionState(): ConnectionState {
    return { ...this.connectionState };
  }

  // Event Handling
  public on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  public off(event: string, callback?: Function): void {
    if (!this.eventListeners.has(event)) return;

    if (callback) {
      this.eventListeners.get(event)!.delete(callback);
    } else {
      this.eventListeners.delete(event);
    }
  }

  private emit(event: string, data?: any): void {
    if (!this.eventListeners.has(event)) return;

    this.eventListeners.get(event)!.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }

  // Priority Handling
  private handleNotificationByPriority(notification: EnhancedNotification): void {
    switch (notification.priority) {
      case NotificationPriority.CRITICAL:
        this.handleCriticalNotification(notification);
        break;
      case NotificationPriority.URGENT:
        this.handleUrgentNotification(notification);
        break;
      case NotificationPriority.HIGH:
        this.handleHighPriorityNotification(notification);
        break;
      default:
        // Standard handling for medium/low priority
        break;
    }
  }

  private handleCriticalNotification(notification: EnhancedNotification): void {
    // Show persistent notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/icons/critical.png',
        requireInteraction: true,
        tag: notification.id,
      });
    }

    // Emit special critical event
    this.emit('notification:critical', notification);
  }

  private handleUrgentNotification(notification: EnhancedNotification): void {
    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/icons/urgent.png',
        tag: notification.id,
      });
    }

    this.emit('notification:urgent', notification);
  }

  private handleHighPriorityNotification(notification: EnhancedNotification): void {
    // Play notification sound or show toast
    this.emit('notification:high', notification);
  }

  // Connection Health
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.socket?.connected) {
        const start = Date.now();
        this.socket.emit('ping', start);

        this.socket.once('pong', (timestamp: number) => {
          this.connectionState.latency = Date.now() - timestamp;
        });
      }
    }, 30000); // Every 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private attemptReconnect(): void {
    if (this.connectionState.reconnectAttempts >= this.config.reconnectionAttempts) {
      this.emit('connection:failed');
      return;
    }

    this.connectionState.reconnecting = true;
    this.connectionState.reconnectAttempts++;

    const delay =
      this.config.reconnectionDelay * Math.pow(2, this.connectionState.reconnectAttempts - 1);

    this.reconnectTimeout = setTimeout(() => {
      this.connect().catch(() => {
        this.attemptReconnect();
      });
    }, delay);
  }

  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  // Cleanup
  public destroy(): void {
    this.disconnect();
    this.eventListeners.clear();
    this.notificationCache.clear();
    this.metricsCache.clear();
    this.alertsCache.clear();
    this.presenceCache.clear();
    EnhancedRealtimeService.instance = null as any;
  }

  // Gerenciamento de Notificações
  public async listarNotificacoes(filtros?: FiltrosNotificacao): Promise<Notificacao[]> {
    try {
      const params = this.buildQueryParams(filtros);
      const response = await api.get(`${this.baseUrl}`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar notificações:', error);
      throw new Error('Falha ao carregar notificações');
    }
  }

  public async criarNotificacao(
    notificacao: Omit<Notificacao, 'id' | 'criadaEm' | 'status'>
  ): Promise<Notificacao> {
    try {
      const novaNotificacao = {
        ...notificacao,
        status: StatusNotificacao.NAO_LIDA,
        criadaEm: new Date(),
      };

      const response = await api.post(`${this.baseUrl}`, novaNotificacao);

      // Enviar via WebSocket se conectado
      if (this.socket) {
        this.socket.emit('nova_notificacao', response.data);
      }

      return response.data;
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      throw new Error('Falha ao criar notificação');
    }
  }

  public async marcarComoLida(notificacaoId: string): Promise<void> {
    try {
      await api.patch(`${this.baseUrl}/${notificacaoId}`, {
        status: StatusNotificacao.LIDA,
        lidaEm: new Date(),
      });
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      throw new Error('Falha ao atualizar notificação');
    }
  }

  public async marcarTodasComoLidas(usuarioId: string): Promise<void> {
    try {
      await api.patch(`${this.baseUrl}`, {
        usuarioId,
        status: StatusNotificacao.LIDA,
        lidaEm: new Date(),
      });
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
      throw new Error('Falha ao atualizar notificações');
    }
  }

  public async arquivarNotificacao(notificacaoId: string): Promise<void> {
    try {
      await api.patch(`${this.baseUrl}/${notificacaoId}`, {
        status: StatusNotificacao.ARQUIVADA,
      });
    } catch (error) {
      console.error('Erro ao arquivar notificação:', error);
      throw new Error('Falha ao arquivar notificação');
    }
  }

  public async excluirNotificacao(notificacaoId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${notificacaoId}`);
    } catch (error) {
      console.error('Erro ao excluir notificação:', error);
      throw new Error('Falha ao excluir notificação');
    }
  }

  public async obterEstatisticas(usuarioId: string): Promise<EstatisticasNotificacao> {
    try {
      const response = await api.get(`${this.baseUrl}/estatisticas/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw new Error('Falha ao carregar estatísticas');
    }
  }

  // Configurações de Notificação
  public async obterConfiguracoes(usuarioId: string): Promise<ConfiguracaoNotificacao> {
    try {
      const response = await api.get(`${this.baseUrl}/configuracoes/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter configurações:', error);
      throw new Error('Falha ao carregar configurações');
    }
  }

  public async atualizarConfiguracoes(
    usuarioId: string,
    configuracoes: Partial<ConfiguracaoNotificacao>
  ): Promise<ConfiguracaoNotificacao> {
    try {
      const response = await api.put(`${this.baseUrl}/configuracoes/${usuarioId}`, configuracoes);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      throw new Error('Falha ao atualizar configurações');
    }
  }

  // WebSocket e Tempo Real
  private initializeWebSocket(): void {
    try {
      // Implementação básica - em produção usar Socket.IO
      if (typeof window !== 'undefined' && window.WebSocket) {
        const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001/ws';
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
          console.log('WebSocket conectado');
          this.connectionState.reconnectAttempts = 0;
        };

        this.socket.onclose = () => {
          console.log('WebSocket desconectado');
          this.handleReconnect();
        };

        this.socket.onerror = (error: any) => {
          console.error('Erro no WebSocket:', error);
        };
      }
    } catch (error) {
      console.error('Erro ao inicializar WebSocket:', error);
    }
  }

  private handleReconnect(): void {
    if (this.connectionState.reconnectAttempts < this.config.reconnectionAttempts) {
      this.connectionState.reconnectAttempts++;
      const delay = Math.pow(2, this.connectionState.reconnectAttempts) * 1000; // Exponential backoff

      setTimeout(() => {
        console.log(
          `Tentativa de reconexão ${this.connectionState.reconnectAttempts}/${this.config.reconnectionAttempts}`
        );
        this.initializeWebSocket();
      }, delay);
    }
  }

  public conectar(usuarioId: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          tipo: 'autenticar',
          usuarioId,
        })
      );
    }
  }

  public desconectar(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  public entrarSala(sala: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          tipo: 'entrar_sala',
          sala,
        })
      );
    }
  }

  public sairSala(sala: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          tipo: 'sair_sala',
          sala,
        })
      );
    }
  }

  public enviarEvento(evento: EventoRealtime): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          tipo: 'evento',
          dados: evento,
        })
      );
    }
  }

  public onNotificacao(callback: (notificacao: Notificacao) => void): void {
    if (this.socket) {
      this.socket.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          if (data.tipo === 'notificacao') {
            callback(data.dados);
          }
        } catch (error) {
          console.error('Erro ao processar mensagem WebSocket:', error);
        }
      };
    }
  }

  public onEvento(callback: (evento: EventoRealtime) => void): void {
    if (this.socket) {
      this.socket.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          if (data.tipo === 'evento') {
            callback(data.dados);
          }
        } catch (error) {
          console.error('Erro ao processar evento WebSocket:', error);
        }
      };
    }
  }

  // Notificações Push
  public async solicitarPermissaoNotificacao(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  public async enviarNotificacaoPush(titulo: string, opcoes?: NotificationOptions): Promise<void> {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(titulo, opcoes);
    }
  }

  // Métodos de Conveniência
  public async notificarTransacao(
    usuarioId: string,
    tipo: string,
    valor: number,
    detalhes?: any
  ): Promise<void> {
    await this.criarNotificacao({
      tipo: TipoNotificacao.TRANSACAO,
      titulo: `Nova ${tipo}`,
      mensagem: `Transação de R$ ${valor.toLocaleString('pt-BR')} realizada`,
      prioridade: PrioridadeNotificacao.MEDIA,
      destinatarioId: usuarioId,
      dados: detalhes,
    });
  }

  public async notificarSistema(
    usuarioId: string,
    titulo: string,
    mensagem: string,
    prioridade: PrioridadeNotificacao = PrioridadeNotificacao.BAIXA
  ): Promise<void> {
    await this.criarNotificacao({
      tipo: TipoNotificacao.SISTEMA,
      titulo,
      mensagem,
      prioridade,
      destinatarioId: usuarioId,
    });
  }

  // Utilitários
  private buildQueryParams(filtros?: FiltrosNotificacao): Record<string, any> {
    if (!filtros) return {};

    const params: Record<string, any> = {};

    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          params[key] = value.join(',');
        } else if (value instanceof Date) {
          params[key] = value.toISOString();
        } else {
          params[key] = value;
        }
      }
    });

    return params;
  }
}

// Export alias for API compatibility
export { EnhancedRealtimeService as RealtimeEnhancedService };

// Export singleton instance
export const enhancedRealtimeService = EnhancedRealtimeService.getInstance();

// Import notification service from dedicated file
export { notificationService } from './notification.service';
