import axios, { AxiosInstance, AxiosResponse } from 'axios';

interface DCOMPData {
  cpfCnpjContribuinte: string;
  periodoApuracao: string;
  codigoReceita: string;
  valorCompensacao: number;
  numeroProcesso?: string;
  documentos: {
    tipo: string;
    numero: string;
    valor: number;
  }[];
}

interface DCOMPResponse {
  protocolo: string;
  situacao: 'PROCESSADO' | 'PENDENTE' | 'REJEITADO';
  dataProcessamento: string;
  mensagem?: string;
  erros?: string[];
}

interface ConsultaDebitosResponse {
  cnpj: string;
  situacao: 'REGULAR' | 'PENDENTE' | 'IRREGULAR';
  debitos: {
    codigo: string;
    descricao: string;
    valor: number;
    vencimento: string;
    situacao: 'ABERTO' | 'PAGO' | 'PARCELADO';
  }[];
  totalDebitos: number;
}

interface ValidacaoCreditoResponse {
  valido: boolean;
  valor: number;
  origem: string;
  situacao: 'DISPONIVEL' | 'UTILIZADO' | 'EXPIRADO';
  observacoes?: string[];
}

export class ReceitaFederalIntegrationService {
  private api: AxiosInstance;
  private baseURL: string;
  private certificadoDigital?: string;
  private chavePrivada?: string;

  constructor() {
    this.baseURL = process.env.RECEITA_FEDERAL_API_URL || 'https://api.receita.fazenda.gov.br/v1';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'TributaAI/1.0'
      }
    });

    this.setupInterceptors();
    this.configurarCertificados();
  }

  private setupInterceptors() {
    // Request interceptor para adicionar autenticação
    this.api.interceptors.request.use(
      (config) => {
        // Adicionar certificado digital se disponível
        if (this.certificadoDigital) {
          config.headers['X-Certificate'] = this.certificadoDigital;
        }

        // Adicionar timestamp para controle de sessão
        config.headers['X-Timestamp'] = new Date().toISOString();

        console.log(`[RFB API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[RFB API] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor para tratamento de erros
    this.api.interceptors.response.use(
      (response) => {
        console.log(`[RFB API] Response ${response.status}: ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('[RFB API] Response error:', error.response?.data || error.message);
        
        if (error.response?.status === 401) {
          throw new Error('Certificado digital inválido ou expirado');
        }
        
        if (error.response?.status === 429) {
          throw new Error('Limite de requisições excedido. Tente novamente em alguns minutos');
        }

        if (error.response?.status >= 500) {
          throw new Error('Serviço da Receita Federal temporariamente indisponível');
        }

        return Promise.reject(error);
      }
    );
  }

  private configurarCertificados() {
    // Configurar certificados a partir de variáveis de ambiente
    this.certificadoDigital = process.env.RFB_CERTIFICATE;
    this.chavePrivada = process.env.RFB_PRIVATE_KEY;

    if (!this.certificadoDigital) {
      console.warn('[RFB] Certificado digital não configurado - usando modo simulação');
    }
  }

  // Consultar débitos de um CNPJ
  async consultarDebitos(cnpj: string): Promise<ConsultaDebitosResponse> {
    try {
      const cnpjLimpo = cnpj.replace(/\D/g, '');
      
      if (!this.certificadoDigital) {
        // Retornar dados mockados para desenvolvimento
        return this.mockConsultaDebitos(cnpjLimpo);
      }

      const response: AxiosResponse<ConsultaDebitosResponse> = await this.api.get(
        `/contribuinte/${cnpjLimpo}/debitos`
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao consultar débitos:', error);
      throw new Error('Falha na consulta de débitos na Receita Federal');
    }
  }

  // Validar crédito tributário
  async validarCredito(cnpj: string, codigoCredito: string): Promise<ValidacaoCreditoResponse> {
    try {
      const cnpjLimpo = cnpj.replace(/\D/g, '');
      
      if (!this.certificadoDigital) {
        return this.mockValidacaoCredito(codigoCredito);
      }

      const response: AxiosResponse<ValidacacoCreditoResponse> = await this.api.get(
        `/contribuinte/${cnpjLimpo}/creditos/${codigoCredito}/validar`
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao validar crédito:', error);
      throw new Error('Falha na validação do crédito na Receita Federal');
    }
  }

  // Submeter DCOMP para compensação
  async submeterDCOMP(dadosDCOMP: DCOMPData): Promise<DCOMPResponse> {
    try {
      if (!this.certificadoDigital) {
        return this.mockSubmissaoDCOMP(dadosDCOMP);
      }

      // Validar dados antes da submissão
      this.validarDadosDCOMP(dadosDCOMP);

      const response: AxiosResponse<DCOMPResponse> = await this.api.post(
        '/compensacao/dcomp',
        dadosDCOMP
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao submeter DCOMP:', error);
      throw new Error('Falha na submissão da DCOMP');
    }
  }

  // Acompanhar status de processamento
  async acompanharProcessamento(protocolo: string): Promise<DCOMPResponse> {
    try {
      if (!this.certificadoDigital) {
        return this.mockAcompanhamento(protocolo);
      }

      const response: AxiosResponse<DCOMPResponse> = await this.api.get(
        `/compensacao/acompanhar/${protocolo}`
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao acompanhar processamento:', error);
      throw new Error('Falha no acompanhamento do processamento');
    }
  }

  // Consultar situação cadastral
  async consultarSituacaoCadastral(cnpj: string): Promise<any> {
    try {
      const cnpjLimpo = cnpj.replace(/\D/g, '');
      
      if (!this.certificadoDigital) {
        return this.mockSituacaoCadastral(cnpjLimpo);
      }

      const response = await this.api.get(`/contribuinte/${cnpjLimpo}/situacao`);
      return response.data;
    } catch (error) {
      console.error('Erro ao consultar situação cadastral:', error);
      throw new Error('Falha na consulta da situação cadastral');
    }
  }

  // Validar dados da DCOMP
  private validarDadosDCOMP(dados: DCOMPData): void {
    if (!dados.cpfCnpjContribuinte) {
      throw new Error('CPF/CNPJ do contribuinte é obrigatório');
    }

    if (!dados.periodoApuracao) {
      throw new Error('Período de apuração é obrigatório');
    }

    if (!dados.codigoReceita) {
      throw new Error('Código da receita é obrigatório');
    }

    if (dados.valorCompensacao <= 0) {
      throw new Error('Valor da compensação deve ser maior que zero');
    }

    if (!dados.documentos || dados.documentos.length === 0) {
      throw new Error('Pelo menos um documento deve ser informado');
    }
  }

  // Métodos mock para desenvolvimento
  private mockConsultaDebitos(cnpj: string): ConsultaDebitosResponse {
    return {
      cnpj,
      situacao: 'PENDENTE',
      debitos: [
        {
          codigo: '0220',
          descricao: 'IRPJ - Imposto de Renda Pessoa Jurídica',
          valor: 125000,
          vencimento: '2024-12-31',
          situacao: 'ABERTO'
        },
        {
          codigo: '2506',
          descricao: 'CSLL - Contribuição Social sobre Lucro Líquido',
          valor: 85000,
          vencimento: '2024-12-31',
          situacao: 'ABERTO'
        }
      ],
      totalDebitos: 210000
    };
  }

  private mockValidacaoCredito(codigoCredito: string): ValidacaoCreditoResponse {
    return {
      valido: true,
      valor: 150000,
      origem: 'PIS/COFINS sobre energia elétrica',
      situacao: 'DISPONIVEL',
      observacoes: ['Crédito válido para compensação', 'Sem restrições']
    };
  }

  private mockSubmissaoDCOMP(dados: DCOMPData): DCOMPResponse {
    const protocolo = `RFB${Date.now().toString().slice(-8)}`;
    
    return {
      protocolo,
      situacao: 'PROCESSADO',
      dataProcessamento: new Date().toISOString(),
      mensagem: 'DCOMP processada com sucesso'
    };
  }

  private mockAcompanhamento(protocolo: string): DCOMPResponse {
    return {
      protocolo,
      situacao: 'PROCESSADO',
      dataProcessamento: new Date().toISOString(),
      mensagem: 'Compensação processada e aprovada'
    };
  }

  private mockSituacaoCadastral(cnpj: string): any {
    return {
      cnpj,
      situacao: 'ATIVA',
      inscricaoEstadual: '123456789',
      regimeTributario: 'LUCRO_REAL',
      dataUltimaConsulta: new Date().toISOString()
    };
  }

  // Utilitários
  static formatarCNPJ(cnpj: string): string {
    const limpo = cnpj.replace(/\D/g, '');
    return limpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  static validarCNPJ(cnpj: string): boolean {
    const limpo = cnpj.replace(/\D/g, '');
    return limpo.length === 14;
  }
}

export const receitaFederalService = new ReceitaFederalIntegrationService();