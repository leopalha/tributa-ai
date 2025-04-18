export type TipoNotificacao = 
  | 'alerta'
  | 'aviso'
  | 'info'
  | 'sucesso'
  | 'erro';

export type PrioridadeNotificacao = 
  | 'baixa'
  | 'media'
  | 'alta'
  | 'urgente';

export type StatusNotificacao = 
  | 'nao_lida'
  | 'lida'
  | 'arquivada'
  | 'excluida';

export type CanalNotificacao = 
  | 'app'
  | 'email'
  | 'sms'
  | 'push'
  | 'telegram';

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
  titulo: string;
  mensagem: string;
  prioridade: PrioridadeNotificacao;
  canais: CanalNotificacao[];
  acoes?: AcaoNotificacao[];
  destinatarios: DestinatarioNotificacao[];
  dataEnvio: string;
  dataExpiracao?: string;
  dados?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
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