export * from './tc';
export * from './empresa';
export * from './obrigacao';
export * from './declaracao';
export * from './usuario';
export * from './notificacao';
export * from './analytics';

// Auditoria exports with aliases to avoid conflicts
export type {
  NivelRisco as NivelRiscoAuditoria,
  TipoEvento as TipoEventoAuditoria,
  EventoAuditoria,
  RegraCompliance,
  ViolacaoCompliance,
  RelatorioAuditoria,
  AlteracaoCampo,
} from './auditoria';

// Marketplace exports with aliases to avoid conflicts
export type {
  NivelRisco as NivelRiscoMarketplace,
  TipoEvento as TipoEventoMarketplace,
  StatusTitulo as StatusTituloMarketplace,
  EstatisticasMarketplace,
} from './marketplace';

export * from './credit-types';
export * from './automation';
// export * from './dashboard';
// export * from './relatorio';
