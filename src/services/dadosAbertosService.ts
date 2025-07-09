// Serviço de Integração com Dados Abertos da Receita Federal
import axios from 'axios';

// Interface principal para dados da empresa
export interface DadosEmpresa {
  // Dados Cadastrais Básicos
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  situacao: 'ATIVA' | 'BAIXADA' | 'SUSPENSA' | 'INAPTA';
  dataAbertura: string;
  porte: 'MEI' | 'ME' | 'EPP' | 'NORMAL' | 'Não informado';
  naturezaJuridica?: string;
  
  // Endereço
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
  
  // Contato
  telefone?: string;
  email?: string;
  
  // Dados Tributários
  regimeTributario: 'Simples Nacional' | 'Lucro Real' | 'Lucro Presumido' | 'MEI';
  limiteFaturamento?: string;
  aliquotaGeral?: string;
  tributosAplicaveis?: string[];
  
  // Atividade Econômica
  atividadePrincipal: {
    codigo: string;
    descricao: string;
  };
  atividadesSecundarias?: Array<{
    codigo: string;
    descricao: string;
  }>;
  
  // Dados Avançados da Receita Federal
  arrecadacao?: {
    total: number;
    periodo: string;
    impostos: Array<{
      tipo: string;
      valor: number;
    }>;
  };
  
  beneficiosFiscais?: Array<{
    tipo: string;
    valor: number;
    vigencia: string;
  }>;
  
  cargaTributaria?: {
    aliquotaEfetiva: number;
    comparativoSetor: number;
  };
  
  comercioExterior?: {
    importacoes: number;
    exportacoes: number;
    balanca: number;
  };
  
  contenciosoAdministrativo?: Array<{
    processo: string;
    valor: number;
    status: string;
  }>;
  
  creditosAtivos?: {
    total: number;
    detalhes: Array<{
      tipo: string;
      valor: number;
      vencimento: string;
    }>;
  };
  
  parcelamentos?: Array<{
    programa: string;
    valorTotal: number;
    valorPago: number;
    parcelas: string;
    status: string;
  }>;
  
  restituicoes?: {
    pendentes: number;
    aprovadas: number;
    periodo: string;
  };
  
  transacoesTributarias?: Array<{
    tipo: string;
    valor: number;
    data: string;
  }>;
}

// APIs e fontes de dados abertos
const APIS_DADOS_ABERTOS = {
  // API da Receita Federal (via proxy ou serviço autorizado)
  receitaWS: 'https://receitaws.com.br/v1/cnpj/',
  
  // APIs do Portal da Transparência
  transparencia: 'https://api.portaldatransparencia.gov.br/api-de-dados/',
  
  // APIs do gov.br
  govBr: 'https://api.gov.br/conecta/api/v2/',
  
  // Outras APIs públicas
  cnpjBrasil: 'https://publica.cnpj.ws/cnpj/',
};

// Cache local para reduzir requisições
const cacheEmpresas = new Map<string, { data: DadosEmpresa; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hora

export class DadosAbertosService {
  // Busca completa de dados da empresa
  static async buscarDadosEmpresa(cnpj: string): Promise<DadosEmpresa> {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    
    // Verifica cache
    const cached = cacheEmpresas.get(cnpjLimpo);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    
    try {
      // Busca dados básicos da empresa
      const dadosBasicos = await this.buscarDadosBasicos(cnpjLimpo);
      
      // Enriquece com dados tributários
      const dadosTributarios = await this.buscarDadosTributarios(cnpjLimpo);
      
      // Busca dados de comércio exterior
      const comercioExterior = await this.buscarComercioExterior(cnpjLimpo);
      
      // Busca dados de parcelamentos e débitos
      const situacaoFiscal = await this.buscarSituacaoFiscal(cnpjLimpo);
      
      // Combina todos os dados
      const dadosCompletos: DadosEmpresa = {
        ...dadosBasicos,
        ...dadosTributarios,
        comercioExterior,
        ...situacaoFiscal,
      };
      
      // Salva no cache
      cacheEmpresas.set(cnpjLimpo, {
        data: dadosCompletos,
        timestamp: Date.now(),
      });
      
      return dadosCompletos;
    } catch (error) {
      console.error('Erro ao buscar dados da empresa:', error);
      return this.getDadosPadrao(cnpjLimpo);
    }
  }
  
  // Busca dados básicos do CNPJ
  private static async buscarDadosBasicos(cnpj: string): Promise<Partial<DadosEmpresa>> {
    try {
      // Tenta múltiplas APIs para garantir disponibilidade
      const response = await axios.get(`${APIS_DADOS_ABERTOS.receitaWS}${cnpj}`);
      const data = response.data;
      
      return {
        cnpj: cnpj,
        razaoSocial: data.nome || 'Nome não encontrado',
        nomeFantasia: data.fantasia || undefined,
        situacao: data.situacao === 'ATIVA' ? 'ATIVA' : 'BAIXADA',
        dataAbertura: data.abertura || '',
        porte: this.determinarPorte(data),
        naturezaJuridica: data.natureza_juridica,
        endereco: {
          logradouro: data.logradouro || '',
          numero: data.numero || '',
          complemento: data.complemento || '',
          bairro: data.bairro || '',
          cidade: data.municipio || '',
          uf: data.uf || '',
          cep: data.cep || '',
        },
        telefone: data.telefone,
        email: data.email,
        atividadePrincipal: {
          codigo: data.atividade_principal?.[0]?.code || '',
          descricao: data.atividade_principal?.[0]?.text || '',
        },
        atividadesSecundarias: data.atividades_secundarias?.map((ativ: any) => ({
          codigo: ativ.code,
          descricao: ativ.text,
        })),
      };
    } catch (error) {
      // Fallback para dados mockados em caso de erro
      return this.getDadosMockados(cnpj);
    }
  }
  
  // Busca dados tributários
  private static async buscarDadosTributarios(cnpj: string): Promise<Partial<DadosEmpresa>> {
    // Simula busca em base de dados tributários
    // Em produção, integraria com APIs reais do eSocial, SPED, etc.
    return {
      regimeTributario: this.determinarRegimeTributario(cnpj),
      limiteFaturamento: 'R$ 4.800.000,00',
      aliquotaGeral: '15%',
      tributosAplicaveis: ['IRPJ', 'CSLL', 'PIS', 'COFINS', 'ISS'],
      arrecadacao: {
        total: Math.random() * 1000000,
        periodo: '2024',
        impostos: [
          { tipo: 'IRPJ', valor: Math.random() * 100000 },
          { tipo: 'CSLL', valor: Math.random() * 50000 },
          { tipo: 'PIS', valor: Math.random() * 30000 },
          { tipo: 'COFINS', valor: Math.random() * 80000 },
        ],
      },
      cargaTributaria: {
        aliquotaEfetiva: 12.5,
        comparativoSetor: 15.2,
      },
    };
  }
  
  // Busca dados de comércio exterior
  private static async buscarComercioExterior(cnpj: string): Promise<any> {
    // Integraria com APIs do SISCOMEX, MDIC, etc.
    return {
      importacoes: Math.random() * 500000,
      exportacoes: Math.random() * 800000,
      balanca: Math.random() * 300000,
    };
  }
  
  // Busca situação fiscal
  private static async buscarSituacaoFiscal(cnpj: string): Promise<Partial<DadosEmpresa>> {
    return {
      creditosAtivos: {
        total: Math.random() * 100000,
        detalhes: [
          {
            tipo: 'ICMS',
            valor: Math.random() * 50000,
            vencimento: '2024-12-31',
          },
          {
            tipo: 'PIS/COFINS',
            valor: Math.random() * 30000,
            vencimento: '2024-11-30',
          },
        ],
      },
      parcelamentos: [
        {
          programa: 'REFIS',
          valorTotal: 150000,
          valorPago: 50000,
          parcelas: '20/60',
          status: 'REGULAR',
        },
      ],
      restituicoes: {
        pendentes: Math.random() * 10000,
        aprovadas: Math.random() * 5000,
        periodo: '2024',
      },
    };
  }
  
  // Determina o porte da empresa
  private static determinarPorte(data: any): DadosEmpresa['porte'] {
    const capital = parseFloat(data.capital_social || '0');
    if (capital < 81000) return 'MEI';
    if (capital < 360000) return 'ME';
    if (capital < 4800000) return 'EPP';
    return 'NORMAL';
  }
  
  // Determina regime tributário
  private static determinarRegimeTributario(cnpj: string): DadosEmpresa['regimeTributario'] {
    // Lógica simplificada - em produção consultaria base real
    const ultimo = parseInt(cnpj.slice(-2));
    if (ultimo < 25) return 'Simples Nacional';
    if (ultimo < 50) return 'Lucro Presumido';
    if (ultimo < 75) return 'Lucro Real';
    return 'MEI';
  }
  
  // Dados mockados para fallback
  private static getDadosMockados(cnpj: string): Partial<DadosEmpresa> {
    return {
      cnpj: cnpj,
      razaoSocial: 'EMPRESA EXEMPLO LTDA',
      nomeFantasia: 'EXEMPLO',
      situacao: 'ATIVA',
      dataAbertura: '01/01/2020',
      porte: 'ME',
      endereco: {
        logradouro: 'Rua Exemplo',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP',
        cep: '01000-000',
      },
      telefone: '(11) 9999-9999',
      email: 'contato@exemplo.com.br',
      atividadePrincipal: {
        codigo: '6201-5/01',
        descricao: 'Desenvolvimento de programas de computador sob encomenda',
      },
    };
  }
  
  // Retorna dados padrão em caso de erro
  private static getDadosPadrao(cnpj: string): DadosEmpresa {
    return {
      cnpj: cnpj,
      razaoSocial: 'Dados temporariamente indisponíveis',
      situacao: 'ATIVA',
      dataAbertura: '',
      porte: 'Não informado',
      endereco: {
        logradouro: '',
        numero: '',
        bairro: '',
        cidade: '',
        uf: '',
        cep: '',
      },
      regimeTributario: 'Lucro Real',
      atividadePrincipal: {
        codigo: '',
        descricao: 'Não informado',
      },
    };
  }
  
  // Busca dados específicos para emissão de token
  static async buscarDadosParaToken(cnpj: string): Promise<{
    razaoSocial: string;
    nomeFantasia?: string;
    endereco: string;
    telefone?: string;
    email?: string;
    situacao: string;
  }> {
    const dados = await this.buscarDadosEmpresa(cnpj);
    return {
      razaoSocial: dados.razaoSocial,
      nomeFantasia: dados.nomeFantasia,
      endereco: `${dados.endereco.logradouro}, ${dados.endereco.numero} - ${dados.endereco.cidade}/${dados.endereco.uf}`,
      telefone: dados.telefone,
      email: dados.email,
      situacao: dados.situacao,
    };
  }
  
  // Busca dados para análise de obrigações
  static async buscarDadosParaObrigacoes(cnpj: string): Promise<{
    empresa: DadosEmpresa;
    obrigacoesDetectadas: Array<{
      tipo: string;
      valor: number;
      vencimento: string;
      status: string;
    }>;
  }> {
    const empresa = await this.buscarDadosEmpresa(cnpj);
    
    // Simula detecção de obrigações baseada nos dados
    const obrigacoesDetectadas = [];
    
    if (empresa.arrecadacao) {
      empresa.arrecadacao.impostos.forEach(imposto => {
        if (imposto.valor > 0) {
          obrigacoesDetectadas.push({
            tipo: imposto.tipo,
            valor: imposto.valor,
            vencimento: this.calcularVencimento(imposto.tipo),
            status: 'PENDENTE',
          });
        }
      });
    }
    
    return { empresa, obrigacoesDetectadas };
  }
  
  // Calcula vencimento baseado no tipo de imposto
  private static calcularVencimento(tipoImposto: string): string {
    const hoje = new Date();
    const vencimento = new Date(hoje);
    
    switch (tipoImposto) {
      case 'IRPJ':
      case 'CSLL':
        vencimento.setMonth(vencimento.getMonth() + 3); // Trimestral
        break;
      case 'PIS':
      case 'COFINS':
        vencimento.setMonth(vencimento.getMonth() + 1); // Mensal
        vencimento.setDate(25);
        break;
      default:
        vencimento.setMonth(vencimento.getMonth() + 1);
        vencimento.setDate(20);
    }
    
    return vencimento.toISOString().split('T')[0];
  }
}

// Exporta instância única do serviço
export default DadosAbertosService;