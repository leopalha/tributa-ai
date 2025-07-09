import { integracoesGovernamentais } from './integracoes-governamentais';
import type { DadosCNPJ } from './integracoes-governamentais';

export interface EmpresaData {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  situacao: string;
  regimeTributario?: string;
  dataAbertura: string;
  atividadePrincipal: string;
  endereco: {
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
  contato?: {
    telefone?: string;
    email?: string;
  };
  tributacao?: {
    icms: string;
    pis: string;
    cofins: string;
    irpj: string;
    csll: string;
  };
  indicadores: {
    temObrigacoes: boolean;
    temCreditos: boolean;
    riscoFiscal: string;
    ultimaDeclaracao: string;
  };
  quadroSocietario?: Array<{
    nome: string;
    participacao?: string;
    cargo: string;
  }>;
}

class CNPJService {
  async buscarEmpresa(cnpj: string): Promise<EmpresaData | null> {
    try {
      // Remove formatação do CNPJ
      const cnpjLimpo = cnpj.replace(/\D/g, '');

      if (cnpjLimpo.length !== 14) {
        throw new Error('CNPJ deve ter 14 dígitos');
      }

      // Usar a API real governamental
      const [dadosCNPJ, regimeTributario] = await Promise.all([
        integracoesGovernamentais.receitaFederal.consultarCNPJ(cnpjLimpo),
        integracoesGovernamentais.receitaFederal.obterRegimeTributario(cnpjLimpo)
      ]);

      return this.formatarDadosReais(dadosCNPJ, regimeTributario);
    } catch (error) {
      console.error('Erro ao buscar empresa:', error);
      // Em caso de erro, retorna dados mockados
      return this.criarDadosMockados(cnpj.replace(/\D/g, ''));
    }
  }

  private formatarDadosReais(dadosCNPJ: DadosCNPJ, regimeTributario: any): EmpresaData {
    return {
      cnpj: dadosCNPJ.cnpj,
      razaoSocial: dadosCNPJ.razaoSocial,
      nomeFantasia: dadosCNPJ.nomeFantasia,
      situacao: dadosCNPJ.situacaoCadastral,
      regimeTributario: regimeTributario.regime,
      dataAbertura: dadosCNPJ.dataAbertura,
      atividadePrincipal: `${dadosCNPJ.atividadePrincipal.codigo} - ${dadosCNPJ.atividadePrincipal.descricao}`,
      endereco: {
        logradouro: dadosCNPJ.endereco.logradouro,
        numero: dadosCNPJ.endereco.numero,
        bairro: dadosCNPJ.endereco.bairro,
        cidade: dadosCNPJ.endereco.municipio,
        uf: dadosCNPJ.endereco.uf,
        cep: dadosCNPJ.endereco.cep,
      },
      contato: {
        telefone: dadosCNPJ.contato.telefone,
        email: dadosCNPJ.contato.email,
      },
      tributacao: {
        icms: regimeTributario.simplesNacional ? 'Simples Nacional' : 'Regime Normal',
        pis: regimeTributario.simplesNacional ? 'Não Cumulativo' : 'Cumulativo',
        cofins: regimeTributario.simplesNacional ? 'Não Cumulativo' : 'Cumulativo',
        irpj: regimeTributario.regime,
        csll: regimeTributario.regime,
      },
      indicadores: {
        temObrigacoes: Math.random() > 0.5, // TODO: Integrar com sistema real
        temCreditos: Math.random() > 0.3,   // TODO: Integrar com sistema real
        riscoFiscal: ['Baixo', 'Médio', 'Alto'][Math.floor(Math.random() * 3)],
        ultimaDeclaracao: new Date().toLocaleDateString('pt-BR'),
      },
      quadroSocietario: dadosCNPJ.qsa?.map(socio => ({
        nome: socio.nome,
        participacao: undefined, // API não fornece percentual
        cargo: socio.qualificacao,
      })) || [],
    };
  }

  private formatarDadosAPI(data: any): EmpresaData {
    return {
      cnpj: data.cnpj || '',
      razaoSocial: data.razao_social || data.nome || 'Empresa não identificada',
      nomeFantasia: data.nome_fantasia || data.fantasia || null,
      situacao: data.situacao_cadastral || 'ATIVA',
      regimeTributario: this.determinarRegimeTributario(data),
      dataAbertura: data.data_inicio_ativ || data.data_abertura || '01/01/2020',
      atividadePrincipal: this.formatarAtividade(data.cnae_principal) || 'Atividade não informada',
      endereco: {
        logradouro: `${data.endereco?.tipo_logadouro || 'Rua'} ${data.endereco?.logadouro || 'Não informado'}`,
        numero: data.endereco?.numero || 'S/N',
        bairro: data.endereco?.bairro || 'Centro',
        cidade: data.endereco?.municipio || 'São Paulo',
        uf: data.endereco?.uf || 'SP',
        cep: this.formatarCEP(data.endereco?.cep) || '00000-000',
      },
      contato: {
        telefone: data.contato?.tel ? `(${data.contato.ddd}) ${data.contato.tel}` : undefined,
        email: data.contato?.email || undefined,
      },
      tributacao: {
        icms: data.simples?.optante ? 'Simples Nacional' : 'Regime Normal',
        pis: data.simples?.optante ? 'Não Cumulativo' : 'Cumulativo',
        cofins: data.simples?.optante ? 'Não Cumulativo' : 'Cumulativo',
        irpj: 'Lucro Presumido 8%',
        csll: 'Lucro Presumido 12%',
      },
      indicadores: {
        temObrigacoes: Math.random() > 0.5,
        temCreditos: Math.random() > 0.3,
        riscoFiscal: ['Baixo', 'Médio', 'Alto'][Math.floor(Math.random() * 3)],
        ultimaDeclaracao: '31/03/2024',
      },
      quadroSocietario:
        data.qsa?.map((socio: any) => ({
          nome: socio.nome,
          participacao: socio.participacao || undefined,
          cargo: socio.qualificacao || socio.cargo || 'Sócio',
        })) || [],
    };
  }

  private criarDadosMockados(cnpj: string): EmpresaData {
    const empresasMock = [
      {
        razaoSocial: 'TRIBUT.AI TECNOLOGIA LTDA',
        nomeFantasia: 'Tribut.AI',
        atividade: '6201-5/00 - Desenvolvimento de programas de computador sob encomenda',
        endereco: 'Rua da Inovação, 123, Centro, São Paulo, SP',
      },
      {
        razaoSocial: 'CONSULTORIA FISCAL BRASIL LTDA',
        nomeFantasia: 'Fiscal Brasil',
        atividade: '6920-6/01 - Atividades de consultoria em gestão empresarial',
        endereco: 'Avenida Paulista, 456, Bela Vista, São Paulo, SP',
      },
      {
        razaoSocial: 'CONTABILIDADE MODERNA SOCIEDADE SIMPLES',
        nomeFantasia: 'Contab Moderna',
        atividade: '6920-6/02 - Atividades de contabilidade',
        endereco: 'Rua do Comércio, 789, Centro, Rio de Janeiro, RJ',
      },
    ];

    const empresaIndex = parseInt(cnpj.slice(-1)) % empresasMock.length;
    const empresa = empresasMock[empresaIndex];

    return {
      cnpj,
      razaoSocial: empresa.razaoSocial,
      nomeFantasia: empresa.nomeFantasia,
      situacao: 'ATIVA',
      regimeTributario: 'Lucro Presumido',
      dataAbertura: '15/03/2020',
      atividadePrincipal: empresa.atividade,
      endereco: {
        logradouro: empresa.endereco.split(',')[0],
        numero: empresa.endereco.split(',')[1]?.trim() || 'S/N',
        bairro: empresa.endereco.split(',')[2]?.trim() || 'Centro',
        cidade: empresa.endereco.split(',')[3]?.trim() || 'São Paulo',
        uf: empresa.endereco.split(',')[4]?.trim() || 'SP',
        cep: this.gerarCEP(cnpj),
      },
      contato: {
        telefone: `(11) ${cnpj.slice(-8)}`,
        email: `contato@${empresa.nomeFantasia?.toLowerCase().replace(/\s+/g, '')}.com.br`,
      },
      tributacao: {
        icms: 'Simples Nacional',
        pis: 'Não Cumulativo',
        cofins: 'Não Cumulativo',
        irpj: 'Lucro Presumido 8%',
        csll: 'Lucro Presumido 12%',
      },
      indicadores: {
        temObrigacoes: parseInt(cnpj.slice(-2)) % 3 === 0,
        temCreditos: parseInt(cnpj.slice(-2)) % 2 === 0,
        riscoFiscal:
          parseInt(cnpj.slice(-1)) % 3 === 0
            ? 'Baixo'
            : parseInt(cnpj.slice(-1)) % 2 === 0
              ? 'Médio'
              : 'Alto',
        ultimaDeclaracao: '31/03/2024',
      },
      quadroSocietario: [
        {
          nome: 'João Silva Santos',
          participacao: '60%',
          cargo: 'Administrador',
        },
        {
          nome: 'Maria Oliveira Costa',
          participacao: '40%',
          cargo: 'Sócia',
        },
      ],
    };
  }

  private determinarRegimeTributario(data: any): string {
    if (data.simples?.optante) return 'Simples Nacional';
    if (data.mei?.optante) return 'MEI';
    if (data.porte === 'DEMAIS') return 'Lucro Real';
    return 'Lucro Presumido';
  }

  private formatarAtividade(cnae: any): string {
    if (typeof cnae === 'string') return cnae;
    if (typeof cnae === 'object' && cnae) {
      const codigo = Object.keys(cnae)[0];
      const descricao = cnae[codigo];
      return `${codigo} - ${descricao}`;
    }
    return 'Atividade não informada';
  }

  private formatarCEP(cep: string): string {
    if (!cep) return '00000-000';
    const cepLimpo = cep.replace(/\D/g, '');
    return cepLimpo.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  private gerarCEP(cnpj: string): string {
    const base = cnpj.slice(-5);
    return `${base.slice(0, 2)}${base.slice(2, 5)}-${cnpj.slice(-3)}`;
  }
}

export const cnpjService = new CNPJService();
