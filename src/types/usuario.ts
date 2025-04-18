export type TipoUsuario = 
  | 'administrador'
  | 'contador'
  | 'analista'
  | 'consultor'
  | 'cliente';

export type StatusUsuario = 
  | 'ativo'
  | 'inativo'
  | 'bloqueado'
  | 'pendente_confirmacao';

export interface Permissao {
  recurso: string;
  acoes: ('ler' | 'criar' | 'editar' | 'excluir')[];
}

export interface GrupoUsuario {
  id: string;
  nome: string;
  descricao?: string;
  permissoes: Permissao[];
}

export interface HistoricoAcesso {
  id: string;
  dataHora: string;
  ip: string;
  dispositivo: string;
  navegador: string;
  sucesso: boolean;
  mensagem?: string;
}

export interface PreferenciasUsuario {
  tema: 'claro' | 'escuro' | 'sistema';
  notificacoes: {
    email: boolean;
    push: boolean;
    telegram?: boolean;
  };
  dashboard: {
    widgets: string[];
    ordem: string[];
  };
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: TipoUsuario;
  status: StatusUsuario;
  empresasVinculadas: string[];
  grupos: GrupoUsuario[];
  permissoes: Permissao[];
  ultimoAcesso?: string;
  historicoAcessos: HistoricoAcesso[];
  preferencias: PreferenciasUsuario;
  telefone?: string;
  foto?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TokenAutenticacao {
  accessToken: string;
  refreshToken: string;
  tipo: string;
  expiraEm: number;
}

export interface SessaoUsuario {
  usuario: Usuario;
  token: TokenAutenticacao;
  empresaSelecionada?: string;
} 