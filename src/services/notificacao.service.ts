import { api } from './api';
import { 
  Notificacao, 
  TipoNotificacao, 
  PrioridadeNotificacao,
  StatusNotificacao,
  ConfiguracaoNotificacao 
} from '@/types/notificacao';

export interface NotificacaoFiltros {
  tipo?: TipoNotificacao;
  prioridade?: PrioridadeNotificacao;
  status?: StatusNotificacao;
  dataInicio?: string;
  dataFim?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface NotificacaoPaginada {
  items: Notificacao[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class NotificacaoService {
  private static instance: NotificacaoService;
  private baseUrl = '/notificacoes';

  private constructor() {
    this.inicializarWebSocket();
  }

  public static getInstance(): NotificacaoService {
    if (!NotificacaoService.instance) {
      NotificacaoService.instance = new NotificacaoService();
    }
    return NotificacaoService.instance;
  }

  private inicializarWebSocket(): void {
    if (typeof window !== 'undefined') {
      const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/notificacoes`);

      ws.onmessage = (event) => {
        const notificacao = JSON.parse(event.data);
        this.processarNotificacao(notificacao);
      };

      ws.onclose = () => {
        setTimeout(() => this.inicializarWebSocket(), 5000);
      };
    }
  }

  private processarNotificacao(notificacao: Notificacao): void {
    // Implementar lógica de processamento de notificações em tempo real
    if (Notification.permission === 'granted') {
      new Notification(notificacao.titulo, {
        body: notificacao.mensagem,
        icon: '/logo.png'
      });
    }

    // Disparar eventos para atualizar a interface
    const event = new CustomEvent('novaNotificacao', { detail: notificacao });
    window.dispatchEvent(event);
  }

  public async solicitarPermissao(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Este navegador não suporta notificações desktop');
    }

    if (Notification.permission !== 'denied') {
      return await Notification.requestPermission();
    }

    return Notification.permission;
  }

  public async listar(filtros?: NotificacaoFiltros): Promise<NotificacaoPaginada> {
    return api.get(this.baseUrl, filtros);
  }

  public async obterNaoLidas(): Promise<Notificacao[]> {
    return api.get(`${this.baseUrl}/nao-lidas`);
  }

  public async marcarComoLida(id: string): Promise<void> {
    return api.put(`${this.baseUrl}/${id}/lida`);
  }

  public async marcarTodasComoLidas(): Promise<void> {
    return api.put(`${this.baseUrl}/marcar-todas-lidas`);
  }

  public async arquivar(id: string): Promise<void> {
    return api.put(`${this.baseUrl}/${id}/arquivar`);
  }

  public async excluir(id: string): Promise<void> {
    return api.delete(`${this.baseUrl}/${id}`);
  }

  public async limparTodas(): Promise<void> {
    return api.delete(this.baseUrl);
  }

  public async obterConfiguracoes(): Promise<ConfiguracaoNotificacao[]> {
    return api.get(`${this.baseUrl}/configuracoes`);
  }

  public async atualizarConfiguracoes(configuracoes: ConfiguracaoNotificacao[]): Promise<void> {
    return api.put(`${this.baseUrl}/configuracoes`, configuracoes);
  }

  public async enviarNotificacao(dados: {
    tipo: TipoNotificacao;
    titulo: string;
    mensagem: string;
    prioridade: PrioridadeNotificacao;
    destinatarios: {
      tipo: 'usuario' | 'grupo' | 'empresa';
      id: string;
    }[];
    acoes?: {
      texto: string;
      url: string;
      tipo: 'primaria' | 'secundaria';
    }[];
    dados?: Record<string, unknown>;
  }): Promise<Notificacao> {
    return api.post(this.baseUrl, dados);
  }

  public async obterEstatisticas(periodo?: {
    inicio: string;
    fim: string;
  }): Promise<{
    total: number;
    naoLidas: number;
    porTipo: Record<TipoNotificacao, number>;
    porPrioridade: Record<PrioridadeNotificacao, number>;
    mediaTempoLeitura: number;
    taxaEngajamento: number;
  }> {
    return api.get(`${this.baseUrl}/estatisticas`, periodo);
  }

  public async assinarTopico(topico: string): Promise<void> {
    return api.post(`${this.baseUrl}/topicos/${topico}/assinar`);
  }

  public async cancelarAssinatura(topico: string): Promise<void> {
    return api.post(`${this.baseUrl}/topicos/${topico}/cancelar`);
  }

  public async obterTopicosAssinados(): Promise<{
    topico: string;
    descricao: string;
    totalNotificacoes: number;
  }[]> {
    return api.get(`${this.baseUrl}/topicos`);
  }
}

export const notificacaoService = NotificacaoService.getInstance(); 