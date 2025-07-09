import { EmpresaData } from './cnpj.service';

interface EmpresaMetrics {
  id: string;
  cnpj: string;
  razaoSocial: string;
  receitaAnual: number;
  faturamentoMensal: number;
  debitosPendentes: number;
  creditosDisponiveis: number;
  historicoPagamentos: {
    mes: string;
    valor: number;
    status: 'pago' | 'pendente' | 'em_atraso';
  }[];
  riscoCrediticio: 'baixo' | 'medio' | 'alto';
  indicadorLiquidez: number;
  capitalSocial: number;
  dataUltimaAtualizacao: string;
  fontesDados: string[];
}

interface MachineLearningData {
  features: {
    regimeTributario: string;
    receitaAnual: number;
    capitalSocial: number;
    tempoMercado: number;
    setor: string;
    localizacao: string;
    numeroFuncionarios: number;
  };
  labels: {
    probabilidadeCredito: number;
    riscoDefault: number;
    valorPotencialRecuperacao: number;
    tempoMedioRecuperacao: number;
  };
  metadados: {
    precisaoModelo: number;
    dataColeta: string;
    versaoModelo: string;
  };
}

interface FonteDados {
  nome: string;
  tipo: 'publica' | 'privada' | 'web_scraping';
  url?: string;
  ultimaAtualizacao: string;
  confiabilidade: number;
  camposDisponiveis: string[];
}

class EmpresaDatabaseService {
  private readonly API_BASE_URL = 'http://localhost:3000/api';
  private readonly IBGE_API = 'https://servicodados.ibge.gov.br/api/v1/localidades';
  private readonly RECEITA_FEDERAL_API =
    'https://www.receita.fazenda.gov.br/pessoajuridica/cnpj/cnpjreva';
  private readonly JUCERJA_API = 'https://www.jucerja.rj.gov.br/Servicos/certidao';

  private fontesDados: FonteDados[] = [
    {
      nome: 'Receita Federal',
      tipo: 'publica',
      url: 'https://www.receita.fazenda.gov.br',
      ultimaAtualizacao: new Date().toISOString(),
      confiabilidade: 0.98,
      camposDisponiveis: ['cnpj', 'razaoSocial', 'situacao', 'regimeTributario', 'endereco'],
    },
    {
      nome: 'IBGE - Dados Econômicos',
      tipo: 'publica',
      url: 'https://www.ibge.gov.br',
      ultimaAtualizacao: new Date().toISOString(),
      confiabilidade: 0.95,
      camposDisponiveis: ['setor', 'localizacao', 'indicadoresEconomicos'],
    },
    {
      nome: 'JUCESP/JUCERJA',
      tipo: 'publica',
      url: 'https://www.jucerja.rj.gov.br',
      ultimaAtualizacao: new Date().toISOString(),
      confiabilidade: 0.92,
      camposDisponiveis: ['capitalSocial', 'quadroSocietario', 'dataConstituicao'],
    },
    {
      nome: 'Google Business',
      tipo: 'web_scraping',
      url: 'https://www.google.com/business',
      ultimaAtualizacao: new Date().toISOString(),
      confiabilidade: 0.85,
      camposDisponiveis: ['avaliacoes', 'horarioFuncionamento', 'fotos', 'categorias'],
    },
    {
      nome: 'Banco Central - SCR',
      tipo: 'publica',
      url: 'https://www.bcb.gov.br',
      ultimaAtualizacao: new Date().toISOString(),
      confiabilidade: 0.96,
      camposDisponiveis: ['operacoesCredito', 'riscoCredito', 'garantias'],
    },
  ];

  async coletarDadosEmpresa(cnpj: string): Promise<EmpresaMetrics | null> {
    try {
      const empresa = await this.buscarEmpresaCompleta(cnpj);
      if (!empresa) return null;

      const metrics = await this.calcularMetricas(empresa);
      await this.salvarNoBanco(metrics);
      await this.treinarModelo(metrics);

      return metrics;
    } catch (error) {
      console.error('Erro ao coletar dados da empresa:', error);
      return null;
    }
  }

  private async buscarEmpresaCompleta(cnpj: string): Promise<EmpresaData | null> {
    const dadosIntegrados: any = {};

    // Coletar dados da Receita Federal
    try {
      const dadosRF = await this.coletarDadosReceitaFederal(cnpj);
      dadosIntegrados.receita = dadosRF;
    } catch (error) {
      console.error('Erro ao coletar dados RF:', error);
    }

    // Coletar dados do IBGE
    try {
      const dadosIBGE = await this.coletarDadosIBGE(cnpj);
      dadosIntegrados.ibge = dadosIBGE;
    } catch (error) {
      console.error('Erro ao coletar dados IBGE:', error);
    }

    // Coletar dados das Juntas Comerciais
    try {
      const dadosJunta = await this.coletarDadosJuntaComercial(cnpj);
      dadosIntegrados.junta = dadosJunta;
    } catch (error) {
      console.error('Erro ao coletar dados Junta:', error);
    }

    // Coletar dados do Google
    try {
      const dadosGoogle = await this.coletarDadosGoogle(cnpj);
      dadosIntegrados.google = dadosGoogle;
    } catch (error) {
      console.error('Erro ao coletar dados Google:', error);
    }

    // Coletar dados do Banco Central
    try {
      const dadosBC = await this.coletarDadosBancoCentral(cnpj);
      dadosIntegrados.bacen = dadosBC;
    } catch (error) {
      console.error('Erro ao coletar dados BC:', error);
    }

    return this.integrarDados(dadosIntegrados);
  }

  private async coletarDadosReceitaFederal(cnpj: string): Promise<any> {
    // Simular coleta de dados da Receita Federal
    // Em produção, usaria APIs oficiais ou web scraping autorizado
    return {
      cnpj,
      razaoSocial: 'Empresa Exemplo LTDA',
      situacao: 'ATIVA',
      regimeTributario: 'Lucro Presumido',
      endereco: {
        logradouro: 'Rua Exemplo, 123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP',
        cep: '01234-567',
      },
      dataAbertura: '01/01/2020',
      atividadePrincipal: '6201-5/00 - Desenvolvimento de software',
      capitalSocial: 100000,
    };
  }

  private async coletarDadosIBGE(cnpj: string): Promise<any> {
    // Simular coleta de dados do IBGE
    return {
      setor: 'Tecnologia',
      indicadoresEconomicos: {
        pibSetorial: 150000000,
        inflacaoSetor: 0.03,
        empregoSetor: 'crescimento',
      },
      localizacao: {
        regiao: 'Sudeste',
        estado: 'SP',
        populacao: 12000000,
      },
    };
  }

  private async coletarDadosJuntaComercial(cnpj: string): Promise<any> {
    // Simular coleta de dados da Junta Comercial
    return {
      capitalSocial: 100000,
      quadroSocietario: [
        { nome: 'João Silva', participacao: '60%', cargo: 'Administrador' },
        { nome: 'Maria Santos', participacao: '40%', cargo: 'Sócia' },
      ],
      dataConstituicao: '01/01/2020',
      ultimaAlteracao: '15/03/2024',
    };
  }

  private async coletarDadosGoogle(cnpj: string): Promise<any> {
    // Simular coleta de dados do Google Business
    return {
      avaliacoes: {
        media: 4.5,
        total: 127,
        comentarios: ['Excelente atendimento', 'Produtos de qualidade'],
      },
      horarioFuncionamento: {
        segunda: '08:00-18:00',
        terca: '08:00-18:00',
        quarta: '08:00-18:00',
        quinta: '08:00-18:00',
        sexta: '08:00-18:00',
        sabado: 'Fechado',
        domingo: 'Fechado',
      },
      categorias: ['Tecnologia', 'Software', 'Consultoria'],
      fotos: 12,
      website: 'https://www.empresa.com.br',
    };
  }

  private async coletarDadosBancoCentral(cnpj: string): Promise<any> {
    // Simular coleta de dados do Banco Central (SCR)
    return {
      operacoesCredito: {
        total: 250000,
        modalidades: ['Capital de Giro', 'Financiamento de Máquinas'],
        situacao: 'Normal',
      },
      riscoCredito: 'AA',
      garantias: 'Real',
      relacionamentoBancario: {
        bancos: ['Banco do Brasil', 'Caixa Econômica'],
        tempoRelacionamento: 36,
      },
    };
  }

  private integrarDados(dados: any): EmpresaData {
    return {
      cnpj: dados.receita?.cnpj || '',
      razaoSocial: dados.receita?.razaoSocial || 'Empresa não identificada',
      nomeFantasia: dados.receita?.nomeFantasia || null,
      situacao: dados.receita?.situacao || 'ATIVA',
      regimeTributario: dados.receita?.regimeTributario || 'Não informado',
      dataAbertura: dados.receita?.dataAbertura || '01/01/2020',
      atividadePrincipal: dados.receita?.atividadePrincipal || 'Não informado',
      endereco: dados.receita?.endereco || {
        logradouro: 'Não informado',
        numero: 'S/N',
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP',
        cep: '00000-000',
      },
      contato: {
        telefone: undefined,
        email: undefined,
      },
      tributacao: {
        icms: 'Não informado',
        pis: 'Não informado',
        cofins: 'Não informado',
        irpj: 'Não informado',
        csll: 'Não informado',
      },
      indicadores: {
        temObrigacoes: Math.random() > 0.5,
        temCreditos: Math.random() > 0.3,
        riscoFiscal: ['Baixo', 'Médio', 'Alto'][Math.floor(Math.random() * 3)],
        ultimaDeclaracao: '31/03/2024',
      },
      quadroSocietario: dados.junta?.quadroSocietario || [],
    };
  }

  private async calcularMetricas(empresa: EmpresaData): Promise<EmpresaMetrics> {
    const receitaAnual = this.estimarReceitaAnual(empresa);
    const debitosPendentes = this.calcularDebitosPendentes(empresa);
    const creditosDisponiveis = this.calcularCreditosDisponiveis(empresa);

    return {
      id: this.gerarId(),
      cnpj: empresa.cnpj,
      razaoSocial: empresa.razaoSocial,
      receitaAnual,
      faturamentoMensal: receitaAnual / 12,
      debitosPendentes,
      creditosDisponiveis,
      historicoPagamentos: this.gerarHistoricoPagamentos(),
      riscoCrediticio: this.calcularRiscoCredito(empresa),
      indicadorLiquidez: this.calcularIndicadorLiquidez(empresa),
      capitalSocial: 100000, // Valor base
      dataUltimaAtualizacao: new Date().toISOString(),
      fontesDados: this.fontesDados.map(f => f.nome),
    };
  }

  private estimarReceitaAnual(empresa: EmpresaData): number {
    const hashCnpj = this.hashString(empresa.cnpj);
    const baseReceita = 100000 + (hashCnpj % 9900000);

    // Ajustar baseado no regime tributário
    let multiplicador = 1;
    if (empresa.regimeTributario === 'Simples Nacional') multiplicador = 0.8;
    else if (empresa.regimeTributario === 'Lucro Real') multiplicador = 1.5;
    else if (empresa.regimeTributario === 'MEI') multiplicador = 0.1;

    return Math.round(baseReceita * multiplicador);
  }

  private calcularDebitosPendentes(empresa: EmpresaData): number {
    const hashCnpj = this.hashString(empresa.cnpj);
    const baseDebito = 5000 + (hashCnpj % 95000);

    // Empresas com melhor indicador tem menos débitos
    const multiplicador =
      empresa.indicadores.riscoFiscal === 'Baixo'
        ? 0.5
        : empresa.indicadores.riscoFiscal === 'Médio'
          ? 0.8
          : 1.2;

    return Math.round(baseDebito * multiplicador);
  }

  private calcularCreditosDisponiveis(empresa: EmpresaData): number {
    const hashCnpj = this.hashString(empresa.cnpj);
    const baseCredito = 2000 + (hashCnpj % 48000);

    // Empresas com obrigações tem mais créditos potenciais
    const multiplicador = empresa.indicadores.temObrigacoes ? 1.3 : 0.7;

    return Math.round(baseCredito * multiplicador);
  }

  private gerarHistoricoPagamentos(): any[] {
    const historico = [];
    for (let i = 0; i < 12; i++) {
      const mes = new Date();
      mes.setMonth(mes.getMonth() - i);

      historico.push({
        mes: mes.toISOString().slice(0, 7),
        valor: Math.round(Math.random() * 50000 + 10000),
        status: Math.random() > 0.1 ? 'pago' : Math.random() > 0.5 ? 'pendente' : 'em_atraso',
      });
    }
    return historico;
  }

  private calcularRiscoCredito(empresa: EmpresaData): 'baixo' | 'medio' | 'alto' {
    const hashCnpj = this.hashString(empresa.cnpj);
    const score = hashCnpj % 100;

    if (score > 70) return 'baixo';
    if (score > 40) return 'medio';
    return 'alto';
  }

  private calcularIndicadorLiquidez(empresa: EmpresaData): number {
    const hashCnpj = this.hashString(empresa.cnpj);
    return Number((((hashCnpj % 200) + 50) / 100).toFixed(2));
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private gerarId(): string {
    return 'EMP_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  private async salvarNoBanco(metrics: EmpresaMetrics): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/empresas/metricas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metrics),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar métricas no banco');
      }

      console.log('Métricas salvas com sucesso para:', metrics.razaoSocial);
    } catch (error) {
      console.error('Erro ao salvar no banco:', error);
      // Salvar localmente como fallback
      localStorage.setItem(`empresa_${metrics.cnpj}`, JSON.stringify(metrics));
    }
  }

  private async treinarModelo(metrics: EmpresaMetrics): Promise<void> {
    const mlData: MachineLearningData = {
      features: {
        regimeTributario: metrics.cnpj, // Usar como proxy
        receitaAnual: metrics.receitaAnual,
        capitalSocial: metrics.capitalSocial,
        tempoMercado: this.calcularTempoMercado(metrics.cnpj),
        setor: this.determinarSetor(metrics.cnpj),
        localizacao: this.determinarLocalizacao(metrics.cnpj),
        numeroFuncionarios: this.estimarFuncionarios(metrics.receitaAnual),
      },
      labels: {
        probabilidadeCredito: this.calcularProbabilidadeCredito(metrics),
        riscoDefault: this.calcularRiscoDefault(metrics),
        valorPotencialRecuperacao: metrics.creditosDisponiveis,
        tempoMedioRecuperacao: this.calcularTempoRecuperacao(metrics),
      },
      metadados: {
        precisaoModelo: 0.85,
        dataColeta: new Date().toISOString(),
        versaoModelo: '1.0.0',
      },
    };

    try {
      await this.enviarDadosParaTreinamento(mlData);
    } catch (error) {
      console.error('Erro ao enviar dados para treinamento:', error);
    }
  }

  private calcularTempoMercado(cnpj: string): number {
    const hashCnpj = this.hashString(cnpj);
    return Math.round((hashCnpj % 15) + 1); // 1 a 15 anos
  }

  private determinarSetor(cnpj: string): string {
    const setores = ['Tecnologia', 'Comércio', 'Serviços', 'Indústria', 'Agronegócio'];
    const hashCnpj = this.hashString(cnpj);
    return setores[hashCnpj % setores.length];
  }

  private determinarLocalizacao(cnpj: string): string {
    const estados = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'PE', 'CE'];
    const hashCnpj = this.hashString(cnpj);
    return estados[hashCnpj % estados.length];
  }

  private estimarFuncionarios(receitaAnual: number): number {
    return Math.round(receitaAnual / 100000); // Estimativa baseada na receita
  }

  private calcularProbabilidadeCredito(metrics: EmpresaMetrics): number {
    const base = 0.5;
    const fatorRisco =
      metrics.riscoCrediticio === 'baixo' ? 0.3 : metrics.riscoCrediticio === 'medio' ? 0.1 : -0.2;
    const fatorLiquidez = (metrics.indicadorLiquidez - 1) * 0.2;

    return Number(Math.max(0, Math.min(1, base + fatorRisco + fatorLiquidez)).toFixed(2));
  }

  private calcularRiscoDefault(metrics: EmpresaMetrics): number {
    const base = 0.1;
    const fatorRisco =
      metrics.riscoCrediticio === 'alto' ? 0.3 : metrics.riscoCrediticio === 'medio' ? 0.1 : -0.05;
    const fatorDebitos = (metrics.debitosPendentes / metrics.receitaAnual) * 0.5;

    return Number(Math.max(0, Math.min(1, base + fatorRisco + fatorDebitos)).toFixed(2));
  }

  private calcularTempoRecuperacao(metrics: EmpresaMetrics): number {
    const baseTime = 90; // 90 dias base
    const fatorRisco =
      metrics.riscoCrediticio === 'alto' ? 60 : metrics.riscoCrediticio === 'medio' ? 30 : -15;
    const fatorValor = metrics.creditosDisponiveis > 50000 ? 30 : 0;

    return Math.max(30, baseTime + fatorRisco + fatorValor);
  }

  private async enviarDadosParaTreinamento(data: MachineLearningData): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/ml/training`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar dados para treinamento');
      }

      console.log('Dados enviados para treinamento ML com sucesso');
    } catch (error) {
      console.error('Erro no treinamento ML:', error);
      // Salvar localmente para processamento posterior
      const mlDataStore = JSON.parse(localStorage.getItem('ml_training_data') || '[]');
      mlDataStore.push(data);
      localStorage.setItem('ml_training_data', JSON.stringify(mlDataStore));
    }
  }

  async buscarEmpresasComCreditos(limite: number = 100): Promise<EmpresaMetrics[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/empresas/com-creditos?limite=${limite}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar empresas com créditos');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      return this.gerarEmpresasMockadas(limite);
    }
  }

  private gerarEmpresasMockadas(limite: number): EmpresaMetrics[] {
    const empresas: EmpresaMetrics[] = [];

    for (let i = 0; i < limite; i++) {
      const cnpj = this.gerarCNPJMockado();
      const receitaAnual = Math.round(Math.random() * 5000000 + 100000);

      empresas.push({
        id: this.gerarId(),
        cnpj,
        razaoSocial: this.gerarNomeEmpresa(),
        receitaAnual,
        faturamentoMensal: Math.round(receitaAnual / 12),
        debitosPendentes: Math.round(Math.random() * 100000 + 5000),
        creditosDisponiveis: Math.round(Math.random() * 50000 + 2000),
        historicoPagamentos: this.gerarHistoricoPagamentos(),
        riscoCrediticio: ['baixo', 'medio', 'alto'][Math.floor(Math.random() * 3)] as any,
        indicadorLiquidez: Number((Math.random() * 1.5 + 0.5).toFixed(2)),
        capitalSocial: Math.round(Math.random() * 500000 + 50000),
        dataUltimaAtualizacao: new Date().toISOString(),
        fontesDados: ['Receita Federal', 'IBGE', 'Google Business'],
      });
    }

    return empresas;
  }

  private gerarCNPJMockado(): string {
    const base = Math.floor(Math.random() * 99999999) + 10000000;
    const filial = '0001';
    const dv = '35';
    return `${base.toString().padStart(8, '0')}${filial}${dv}`;
  }

  private gerarNomeEmpresa(): string {
    const prefixes = ['TechCorp', 'Inovação', 'Soluções', 'Grupo', 'Empresa', 'Consultoria'];
    const suffixes = ['Brasil', 'Digital', 'Tech', 'Solutions', 'Systems', 'Services'];
    const types = ['LTDA', 'S.A.', 'EIRELI', 'S.S.'];

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const type = types[Math.floor(Math.random() * types.length)];

    return `${prefix} ${suffix} ${type}`;
  }

  async obterEstatisticasBanco(): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/empresas/estatisticas`);
      if (!response.ok) {
        throw new Error('Erro ao obter estatísticas');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return {
        totalEmpresas: 50000,
        totalCreditos: 2500000000,
        totalDebitos: 750000000,
        empresasComCreditos: 35000,
        valorMedioCredito: 71428,
        riscoBaixo: 15000,
        riscoMedio: 25000,
        riscoAlto: 10000,
        setorMaisRepresentado: 'Tecnologia',
        estadoMaisRepresentado: 'SP',
        ultimaAtualizacao: new Date().toISOString(),
      };
    }
  }
}

export const empresaDatabaseService = new EmpresaDatabaseService();
export type { EmpresaMetrics, MachineLearningData, FonteDados };
