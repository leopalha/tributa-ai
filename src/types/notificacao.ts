export type TipoNotificacao = 'obrigacao' | 'declaracao' | 'pagamento' | 'sistema';

export type PrioridadeNotificacao = 'baixa' | 'media' | 'alta' | 'urgente';

export type StatusNotificacao =
  | 'notificacao_nao_lida'
  | 'notificacao_lida'
  | 'notificacao_arquivada';

export type CanalNotificacao = 'app' | 'email' | 'sms' | 'push' | 'telegram';

export interface AcaoNotificacao {
  texto: string;
  url: string;
  tipo: 'primaria' | 'secundaria';
}

export interface DestinatarioNotificacao {
  id: string;
  tipo: 'usuario' | 'grupo' | 'empresa';
  status: StatusNotificacao;
  dataLeitura?: string;
}

export interface Notificacao {
  id: string;
  tipo: TipoNotificacao;
  status: StatusNotificacao;
  titulo: string;
  mensagem: string;
  data: string;
  destinatario?: string;
  link?: string;
  dados?: Record<string, unknown>;
}

export interface NotificacaoFiltros {
  status?: StatusNotificacao;
  tipo?: TipoNotificacao;
  dataInicio?: string;
  dataFim?: string;
  destinatario?: string;
}

export interface NotificacaoCreate {
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
  destinatario?: string;
  link?: string;
  dados?: Record<string, unknown>;
}

export interface NotificacaoUpdate {
  status?: StatusNotificacao;
  titulo?: string;
  mensagem?: string;
  link?: string;
  dados?: Record<string, unknown>;
}

export interface NotificacaoPreferencias {
  email: boolean;
  sms: boolean;
  push: boolean;
  tipos: TipoNotificacao[];
}

export interface NotificacaoQuantidade {
  quantidade: number;
}

export interface NotificacaoEmail extends Omit<NotificacaoCreate, 'tipo'> {
  destinatario: string;
}

export interface NotificacaoSMS extends Omit<NotificacaoCreate, 'tipo' | 'titulo'> {
  destinatario: string;
}

export interface ConfiguracaoNotificacao {
  tipo: TipoNotificacao;
  canaisHabilitados: CanalNotificacao[];
  prioridadeMinima: PrioridadeNotificacao;
  horarioPermitido?: {
    inicio: string;
    fim: string;
  };
  diasPermitidos?: number[];
}
