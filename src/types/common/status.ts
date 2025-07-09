// Status base que pode ser usado em todo o sistema
export type BaseStatus =
  | 'PENDENTE'
  | 'ATIVO'
  | 'CONCLUIDO'
  | 'CANCELADO'
  | 'REJEITADO'
  | 'PROCESSANDO'
  | 'SUSPENSO'
  | 'BLOQUEADO';

export type StatusTitulo =
  | 'titulo_pendente'
  | 'titulo_ativo'
  | 'titulo_cancelado'
  | 'titulo_compensado';

export type StatusDeclaracao =
  | 'declaracao_pendente'
  | 'declaracao_em_andamento'
  | 'declaracao_concluida'
  | 'declaracao_atrasada'
  | 'declaracao_cancelada';

export type StatusObrigacao =
  | 'obrigacao_pendente'
  | 'obrigacao_em_andamento'
  | 'obrigacao_concluida'
  | 'obrigacao_atrasada'
  | 'obrigacao_dispensada';

export type StatusAnuncio =
  | 'anuncio_ativo'
  | 'anuncio_pausado'
  | 'anuncio_finalizado'
  | 'anuncio_expirado';

export type StatusProposta =
  | 'proposta_pendente'
  | 'proposta_aceita'
  | 'proposta_rejeitada'
  | 'proposta_cancelada';

export type StatusNotificacao =
  | 'notificacao_nao_lida'
  | 'notificacao_lida'
  | 'notificacao_arquivada';

// Importar StatusTransacao do arquivo correto
import { StatusTransacao } from '../transacao';

// Mapeamento de status específicos para o status base
export const StatusMapping = {
  titulo: {
    titulo_pendente: 'PENDENTE',
    titulo_ativo: 'ATIVO',
    titulo_cancelado: 'CANCELADO',
    titulo_compensado: 'CONCLUIDO',
  },
  transacao: {
    transacao_pendente: 'PENDENTE',
    transacao_concluida: 'CONCLUIDO',
    transacao_erro: 'REJEITADO',
    transacao_cancelada: 'CANCELADO',
  },
  declaracao: {
    declaracao_pendente: 'PENDENTE',
    declaracao_em_andamento: 'PROCESSANDO',
    declaracao_concluida: 'CONCLUIDO',
    declaracao_atrasada: 'REJEITADO',
    declaracao_cancelada: 'CANCELADO',
  },
  obrigacao: {
    obrigacao_pendente: 'PENDENTE',
    obrigacao_em_andamento: 'PROCESSANDO',
    obrigacao_concluida: 'CONCLUIDO',
    obrigacao_atrasada: 'REJEITADO',
    obrigacao_dispensada: 'CANCELADO',
  },
  anuncio: {
    anuncio_ativo: 'ATIVO',
    anuncio_pausado: 'SUSPENSO',
    anuncio_finalizado: 'CONCLUIDO',
    anuncio_expirado: 'BLOQUEADO',
  },
  proposta: {
    proposta_pendente: 'PENDENTE',
    proposta_aceita: 'CONCLUIDO',
    proposta_rejeitada: 'REJEITADO',
    proposta_cancelada: 'CANCELADO',
  },
  notificacao: {
    notificacao_nao_lida: 'PENDENTE',
    notificacao_lida: 'CONCLUIDO',
    notificacao_arquivada: 'CANCELADO',
  },
} as const;

// Função helper para converter status específicos para o status base
export function mapToBaseStatus<T extends keyof typeof StatusMapping>(
  entityType: T,
  status: keyof (typeof StatusMapping)[T]
): BaseStatus {
  return StatusMapping[entityType][status] as BaseStatus;
}

// Função helper para verificar se um status está em um determinado estado base
export function isStatusInState<T extends keyof typeof StatusMapping>(
  entityType: T,
  status: keyof (typeof StatusMapping)[T],
  baseState: BaseStatus
): boolean {
  return mapToBaseStatus(entityType, status) === baseState;
}

// Função helper para agrupar status por estado base
export function groupStatusByBaseState<T extends keyof typeof StatusMapping>(
  entityType: T
): Record<BaseStatus, Array<keyof (typeof StatusMapping)[T]>> {
  const result = {} as Record<BaseStatus, Array<keyof (typeof StatusMapping)[T]>>;

  Object.entries(StatusMapping[entityType]).forEach(([status, baseStatus]) => {
    if (!result[baseStatus]) {
      result[baseStatus] = [];
    }
    result[baseStatus].push(status as keyof (typeof StatusMapping)[T]);
  });

  return result;
}
