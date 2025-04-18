export type RegimeTributario = 'simples_nacional' | 'lucro_presumido' | 'lucro_real';
export type SetorAtividade = 'comercio' | 'industria' | 'servicos' | 'agronegocio';
export type StatusEmpresa = 'ativa' | 'inativa' | 'suspensa' | 'baixada';

export interface EnderecoEmpresa {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
}

export interface ContatoEmpresa {
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
  departamento: string;
}

export interface CertificadoDigital {
  id: string;
  tipo: 'e-CNPJ' | 'e-PJ' | 'NF-e';
  numeroSerie: string;
  dataEmissao: string;
  dataValidade: string;
  status: 'valido' | 'expirado' | 'revogado';
  arquivo?: string;
}

export interface InscricaoFiscal {
  tipo: 'estadual' | 'municipal';
  numero: string;
  estado?: string;
  municipio?: string;
  status: 'ativa' | 'baixada' | 'suspensa';
}

export interface ConfiguracaoFiscal {
  regimeTributario: RegimeTributario;
  inscricoes: InscricaoFiscal[];
  certificados: CertificadoDigital[];
  obrigacoesAcessorias: string[];
  aliquotas: {
    [key: string]: number;
  };
}

export interface Empresa {
  id: string;
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj: string;
  setorAtividade: SetorAtividade;
  status: StatusEmpresa;
  dataAbertura: string;
  endereco: EnderecoEmpresa;
  contatos: ContatoEmpresa[];
  configuracaoFiscal: ConfiguracaoFiscal;
  matrizFilial: 'matriz' | 'filial';
  cnpjMatriz?: string;
  createdAt: string;
  updatedAt: string;
} 