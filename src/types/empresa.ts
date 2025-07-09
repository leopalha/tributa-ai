export type StatusEmpresa = 'ATIVA' | 'INATIVA' | 'SUSPENSA' | 'BLOQUEADA';
export type RegimeTributario = 'SIMPLES' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL' | 'MEI';
export type SetorAtividade =
  | 'COMERCIO'
  | 'INDUSTRIA'
  | 'SERVICO'
  | 'AGROPECUARIA'
  | 'CONSTRUCAO'
  | 'OUTRO';

export interface EnderecoEmpresa {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface ContatoEmpresa {
  telefone: string;
  email: string;
  site?: string;
  responsavel?: string;
}

export interface CertificadoDigital {
  id?: string;
  nome: string;
  validade: string;
  arquivo?: string;
  senha?: string;
  tipo: 'A1' | 'A3';
  status: 'VALIDO' | 'EXPIRADO' | 'PENDENTE';
}

export interface InscricaoFiscal {
  id?: string;
  tipo: 'ESTADUAL' | 'MUNICIPAL' | 'OUTRO';
  numero: string;
  estado?: string;
  cidade?: string;
}

export interface ConfiguracaoFiscal {
  id?: string;
  enviaSpedFiscal: boolean;
  enviaSpedContribuicoes: boolean;
  emiteNfe: boolean;
  emiteNfse: boolean;
  emiteCte: boolean;
  emiteMdfe: boolean;
  retemIss: boolean;
}

export interface Empresa {
  id: string;
  nome: string;
  nomeFantasia?: string;
  cnpj: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  regimeTributario: RegimeTributario;
  setorAtividade?: SetorAtividade;
  cnaePrincipal?: string;
  status: StatusEmpresa;
  dataAbertura?: string;
  endereco: EnderecoEmpresa;
  contato: ContatoEmpresa;
  certificadoDigital?: CertificadoDigital;
  inscricoesFiscais?: InscricaoFiscal[];
  configuracaoFiscal?: ConfiguracaoFiscal;
  observacoes?: string;
  logo?: string;
  matrizFilial?: 'MATRIZ' | 'FILIAL';
  empresaMatriz?: string;
}

export interface EmpresaFiltros {
  nome?: string;
  cnpj?: string;
  status?: StatusEmpresa;
  regimeTributario?: RegimeTributario;
  estado?: string;
  cidade?: string;
  setorAtividade?: SetorAtividade;
}

export interface EmpresaPaginada {
  empresas: Empresa[];
  total: number;
  pagina: number;
  limite: number;
}

export interface EmpresaContextData {
  empresas: Empresa[];
  selectedEmpresa: Empresa | null;
  loading: boolean;
  setSelectedEmpresa: (empresa: Empresa) => void;
  createEmpresa: (empresa: Omit<Empresa, 'id'>) => Promise<Empresa>;
  updateEmpresa: (id: string, empresa: Partial<Empresa>) => Promise<Empresa>;
  deleteEmpresa: (id: string) => Promise<void>;
}
