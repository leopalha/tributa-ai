export type TipoEvento = 
  | 'criacao'
  | 'atualizacao'
  | 'exclusao'
  | 'visualizacao'
  | 'download'
  | 'upload'
  | 'autenticacao'
  | 'autorizacao';

export type NivelRisco = 
  | 'baixo'
  | 'medio'
  | 'alto'
  | 'critico';

export interface AlteracaoCampo {
  campo: string;
  valorAntigo: unknown;
  valorNovo: unknown;
}

export interface EventoAuditoria {
  id: string;
  tipo: TipoEvento;
  recurso: string;
  identificadorRecurso: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
  };
  dataHora: string;
  ip: string;
  dispositivo: string;
  alteracoes?: AlteracaoCampo[];
  metadados?: Record<string, unknown>;
}

export interface RegraCompliance {
  id: string;
  nome: string;
  descricao: string;
  tipo: string;
  nivelRisco: NivelRisco;
  ativo: boolean;
  parametros?: Record<string, unknown>;
  acaoAutomatica?: {
    tipo: string;
    parametros: Record<string, unknown>;
  };
}

export interface ViolacaoCompliance {
  id: string;
  regra: RegraCompliance;
  dataIdentificacao: string;
  recurso: string;
  identificadorRecurso: string;
  detalhes: string;
  status: 'identificada' | 'em_analise' | 'resolvida' | 'falso_positivo';
  resolucao?: {
    dataHora: string;
    usuario: string;
    descricao: string;
    acaoTomada: string;
  };
}

export interface RelatorioAuditoria {
  id: string;
  periodo: {
    inicio: string;
    fim: string;
  };
  eventos: EventoAuditoria[];
  violacoes: ViolacaoCompliance[];
  metricas: {
    totalEventos: number;
    eventosporTipo: Record<TipoEvento, number>;
    violacoesporNivel: Record<NivelRisco, number>;
    usuariosMaisAtivos: {
      usuario: string;
      eventos: number;
    }[];
  };
  geradoEm: string;
  geradoPor: string;
} 