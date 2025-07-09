import {
  TituloCreditoUnion,
  TipoTC,
  StatusTC,
  FiltrosTC,
  EstatisticasMarketplace,
  OrdemNegociacao,
  TransacaoTC,
  TipoNegociacao,
} from '@/types/titulo-credito';
import { api } from './api';
import { BlockchainService } from './blockchain.service';
import { API_CONFIG } from '@/config/api.config';

export class TituloCreditoService {
  private static instance: TituloCreditoService;
  private baseUrl = '/api/tcs';
  private blockchainService: BlockchainService;

  private constructor() {
    this.blockchainService = BlockchainService.getInstance();
  }

  public static getInstance(): TituloCreditoService {
    if (!TituloCreditoService.instance) {
      TituloCreditoService.instance = new TituloCreditoService();
    }
    return TituloCreditoService.instance;
  }

  // CRUD Básico para TCs
  public async listarTCs(filtros?: FiltrosTC): Promise<TituloCreditoUnion[]> {
    try {
      if (API_CONFIG.USE_MOCK_DATA) {
        // Retornar lista mockada
        return this.mockListarTCs(filtros);
      }

      const response = await api.get<TituloCreditoUnion[]>(API_CONFIG.ENDPOINTS.TCS.LIST, filtros);
      return response;
    } catch (error) {
      console.error('Erro ao listar TCs:', error);
      throw new Error('Falha ao listar títulos de crédito');
    }
  }

  public async obterTC(id: string): Promise<TituloCreditoUnion> {
    try {
      if (API_CONFIG.USE_MOCK_DATA) {
        // Retornar TC mockado
        return this.mockObterTC(id);
      }

      const response = await api.get<TituloCreditoUnion>(API_CONFIG.ENDPOINTS.TCS.GET(id));
      return response;
    } catch (error) {
      console.error('Erro ao obter TC:', error);
      throw new Error('Falha ao obter título de crédito');
    }
  }

  public async criarTC(tc: Partial<TituloCreditoUnion>): Promise<TituloCreditoUnion> {
    try {
      if (API_CONFIG.USE_MOCK_DATA) {
        // Simular criação
        const novoTC: TituloCreditoUnion = {
          id: `tc-${Date.now()}`,
          tcId: `tc-${Date.now()}`,
          nome: tc.nome || 'Novo Título',
          descricao: tc.descricao || 'Título criado automaticamente',
          tipo: tc.tipo || 'tributario',
          subtipo: tc.subtipo || 'federal',
          valorNominal: tc.valorNominal || 0,
          valorAtual: tc.valorAtual || tc.valorNominal || 0,
          dataEmissao: tc.dataEmissao || new Date(),
          dataVencimento: tc.dataVencimento || new Date(),
          dataUltimaAtualizacao: new Date(),
          status: 'disponivel',
          validado: false,
          documentosVerificados: false,
          emissor: tc.emissor || {
            id: 'default-emissor',
            nome: 'Emissor Padrão',
            documento: '00.000.000/0001-00',
            tipo: 'pessoa_juridica',
            endereco: {
              logradouro: 'Rua Exemplo',
              numero: '123',
              bairro: 'Centro',
              cidade: 'São Paulo',
              estado: 'SP',
              cep: '01000-000',
              pais: 'Brasil',
            },
            contato: {
              email: 'contato@exemplo.com',
              telefone: '(11) 99999-9999',
            },
          },
          garantias: [],
          documentos: [],
          blockchain: {
            network: 'hyperledger-fabric',
            contractAddress: 'mock-contract',
            tokenId: `token-${Date.now()}`,
            transactionHash: `0x${Math.random().toString(16).substring(2)}`,
            blockNumber: Math.floor(Math.random() * 1000000),
          },
          historico: [],
          metadados: {},
          criadoEm: new Date(),
          atualizadoEm: new Date(),
        } as TituloCreditoUnion;

        return novoTC;
      }

      const response = await api.post<TituloCreditoUnion>(API_CONFIG.ENDPOINTS.TCS.CREATE, tc);
      return response;
    } catch (error) {
      console.error('Erro ao criar TC:', error);
      throw new Error('Falha ao criar título de crédito');
    }
  }

  public async atualizarTC(
    id: string,
    dados: Partial<TituloCreditoUnion>
  ): Promise<TituloCreditoUnion> {
    try {
      if (API_CONFIG.USE_MOCK_DATA) {
        // Simular atualização
        const tc = await this.obterTC(id);
        const atualizado = {
          ...tc,
          ...dados,
          atualizadoEm: new Date(),
        };
        return atualizado;
      }

      const response = await api.patch<TituloCreditoUnion>(
        API_CONFIG.ENDPOINTS.TCS.UPDATE(id),
        dados
      );
      return response;
    } catch (error) {
      console.error('Erro ao atualizar TC:', error);
      throw new Error('Falha ao atualizar título de crédito');
    }
  }

  public async excluirTC(id: string): Promise<boolean> {
    try {
      if (API_CONFIG.USE_MOCK_DATA) {
        // Simular exclusão
        return true;
      }

      await api.delete(API_CONFIG.ENDPOINTS.TCS.DELETE(id));
      return true;
    } catch (error) {
      console.error('Erro ao excluir TC:', error);
      return false;
    }
  }

  // Operações de Negociação
  public async criarOrdem(ordem: Partial<OrdemNegociacao>): Promise<OrdemNegociacao> {
    try {
      const response = await api.post(`${this.baseUrl}/ordens`, ordem);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar ordem:', error);
      throw new Error('Falha ao criar ordem de negociação');
    }
  }

  public async criarOrdemNegociacao(ordem: Partial<OrdemNegociacao>): Promise<OrdemNegociacao> {
    return this.criarOrdem(ordem);
  }

  public async listarOrdens(tcId?: string): Promise<OrdemNegociacao[]> {
    try {
      const params = tcId ? { tcId } : {};
      const response = await api.get(`${this.baseUrl}/ordens`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar ordens:', error);
      throw new Error('Falha ao carregar ordens');
    }
  }

  public async cancelarOrdem(ordemId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/ordens/${ordemId}`);
    } catch (error) {
      console.error('Erro ao cancelar ordem:', error);
      throw new Error('Falha ao cancelar ordem');
    }
  }

  public async executarTransacao(transacao: Partial<TransacaoTC>): Promise<TransacaoTC> {
    try {
      // Validar transação
      await this.validarTransacao(transacao);

      // Executar na blockchain primeiro
      const hashTransacao = await this.executarTransacaoBlockchain(transacao);

      // Registrar no banco de dados
      const transacaoCompleta = {
        ...transacao,
        hashTransacao,
        status: 'pendente' as const,
        dataTransacao: new Date(),
      };

      const response = await api.post(`${this.baseUrl}/transacoes`, transacaoCompleta);
      return response.data;
    } catch (error) {
      console.error('Erro ao executar transação:', error);
      throw new Error('Falha ao executar transação');
    }
  }

  public async listarTransacoes(filtros?: {
    tcId?: string;
    usuario?: string;
  }): Promise<TransacaoTC[]> {
    try {
      const response = await api.get(`${this.baseUrl}/transacoes`, { params: filtros });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar transações:', error);
      throw new Error('Falha ao carregar transações');
    }
  }

  // Operações Específicas por Tipo de TC
  public async listarTCsTributarios(
    esfera?: 'federal' | 'estadual' | 'municipal'
  ): Promise<TituloCreditoUnion[]> {
    const filtros: FiltrosTC = {
      tipo: ['tributario'],
      ...(esfera && { esfera: [esfera] }),
    };
    return this.listarTCs(filtros);
  }

  public async listarTCsJudiciais(tribunal?: string): Promise<TituloCreditoUnion[]> {
    const filtros: FiltrosTC = {
      tipo: ['judicial'],
      ...(tribunal && { tribunal: [tribunal] }),
    };
    return this.listarTCs(filtros);
  }

  public async listarTCsAmbientais(): Promise<TituloCreditoUnion[]> {
    return this.listarTCs({ tipo: ['ambiental'] });
  }

  // Validação e Verificação
  public async validarTC(tcId: string): Promise<{ valido: boolean; mensagens: string[] }> {
    try {
      if (API_CONFIG.USE_MOCK_DATA) {
        // Simular validação
        return {
          valido: true,
          mensagens: ['Título válido e apto para negociação'],
        };
      }

      const response = await api.post<{ valido: boolean; mensagens: string[] }>(
        API_CONFIG.ENDPOINTS.TCS.VALIDATE(tcId)
      );
      return response;
    } catch (error) {
      console.error('Erro na validação:', error);
      throw new Error('Falha na validação do título');
    }
  }

  public async verificarDocumentos(id: string): Promise<boolean> {
    try {
      const response = await api.post(`${this.baseUrl}/${id}/verificar-documentos`);
      return response.data.verificado;
    } catch (error) {
      console.error('Erro ao verificar documentos:', error);
      throw new Error('Falha na verificação de documentos');
    }
  }

  // Precificação e Avaliação
  public async calcularPrecoJusto(id: string): Promise<number> {
    try {
      const response = await api.post(`${this.baseUrl}/${id}/precificar`);
      return response.data.precoJusto;
    } catch (error) {
      console.error('Erro ao calcular preço:', error);
      throw new Error('Falha no cálculo de precificação');
    }
  }

  public async obterHistoricoPrecos(
    id: string,
    periodo?: string
  ): Promise<Array<{ data: Date; valor: number }>> {
    try {
      const params = periodo ? { periodo } : {};
      const response = await api.get(`${this.baseUrl}/${id}/historico-precos`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter histórico:', error);
      throw new Error('Falha ao carregar histórico de preços');
    }
  }

  // Compensação
  public async identificarOportunidadesCompensacao(tcId: string): Promise<TituloCreditoUnion[]> {
    try {
      const response = await api.get(`${this.baseUrl}/${tcId}/compensacao/oportunidades`);
      return response.data;
    } catch (error) {
      console.error('Erro ao identificar compensações:', error);
      throw new Error('Falha ao buscar oportunidades de compensação');
    }
  }

  public async executarCompensacao(tcIds: string[]): Promise<TransacaoTC> {
    try {
      const response = await api.post(`${this.baseUrl}/compensacao/executar`, { tcIds });
      return response.data;
    } catch (error) {
      console.error('Erro ao executar compensação:', error);
      throw new Error('Falha ao executar compensação');
    }
  }

  // Estatísticas e Relatórios
  public async obterEstatisticas(): Promise<EstatisticasMarketplace> {
    try {
      if (API_CONFIG.USE_MOCK_DATA) {
        // Retornar estatísticas mockadas
        return this.mockObterEstatisticas();
      }

      const response = await api.get<EstatisticasMarketplace>(
        API_CONFIG.ENDPOINTS.MARKETPLACE.STATS
      );
      return response;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      // Retornar valores padrão em caso de erro
      return this.mockObterEstatisticas();
    }
  }

  public async obterEstatisticasPorTipo(tipo: TipoTC): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/estatisticas/${tipo}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas por tipo:', error);
      throw new Error('Falha ao carregar estatísticas específicas');
    }
  }

  // Busca Avançada
  public async buscarTCs(termo: string, filtros?: FiltrosTC): Promise<TituloCreditoUnion[]> {
    try {
      const params = {
        q: termo,
        ...this.buildQueryParams(filtros),
      };
      const response = await api.get(`${this.baseUrl}/buscar`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro na busca:', error);
      throw new Error('Falha na busca de títulos');
    }
  }

  public async obterRecomendacoes(usuarioId: string): Promise<TituloCreditoUnion[]> {
    try {
      const response = await api.get(`${this.baseUrl}/recomendacoes/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter recomendações:', error);
      throw new Error('Falha ao carregar recomendações');
    }
  }

  // Métodos Privados
  private buildQueryParams(filtros?: FiltrosTC): Record<string, any> {
    if (!filtros) return {};

    const params: Record<string, any> = {};

    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          params[key] = value.join(',');
        } else if (value instanceof Date) {
          params[key] = value.toISOString();
        } else {
          params[key] = value;
        }
      }
    });

    return params;
  }

  private validarDadosTC(tc: Partial<TituloCreditoUnion>): void {
    if (!tc.nome || tc.nome.trim() === '') {
      throw new Error('Nome do título é obrigatório');
    }

    if (!tc.valorNominal || tc.valorNominal <= 0) {
      throw new Error('Valor nominal deve ser maior que zero');
    }

    if (!tc.dataVencimento) {
      throw new Error('Data de vencimento é obrigatória');
    }

    if (new Date(tc.dataVencimento) <= new Date()) {
      throw new Error('Data de vencimento deve ser futura');
    }

    if (!tc.emissor || !tc.emissor.documento) {
      throw new Error('Dados do emissor são obrigatórios');
    }
  }

  private async validarTransacao(transacao: Partial<TransacaoTC>): Promise<void> {
    if (!transacao.tcId || !transacao.comprador || !transacao.vendedor) {
      throw new Error('Dados da transação incompletos');
    }

    if (!transacao.valor || transacao.valor <= 0) {
      throw new Error('Valor da transação deve ser maior que zero');
    }

    // Verificar se o TC existe e está disponível
    const tc = await this.obterTC(transacao.tcId!);
    if (tc.status !== 'disponivel') {
      throw new Error('Título não está disponível para negociação');
    }

    // Verificar se o valor está dentro dos limites
    if (transacao.valor! < (tc.valorMinimo || 0)) {
      throw new Error('Valor abaixo do mínimo permitido');
    }
  }

  // Integração com Blockchain
  private async tokenizarTC(tcId: string): Promise<string> {
    try {
      if (API_CONFIG.USE_MOCK_DATA || API_CONFIG.USE_MOCK_BLOCKCHAIN) {
        // Simular tokenização
        const tc = await this.obterTC(tcId);
        const tokenId = `token-${tcId}-${Date.now()}`;

        // Atualizar TC com informações mockadas da blockchain
        await this.atualizarTC(tcId, {
          blockchain: {
            network: 'hyperledger-fabric',
            contractAddress: 'mock-contract-address',
            tokenId,
            transactionHash: `0x${Math.random().toString(16).substring(2)}`,
            blockNumber: Math.floor(Math.random() * 1000000),
          },
          status: 'tokenizado',
        });

        return tokenId;
      }

      const response = await api.post<{ tokenId: string }>(API_CONFIG.ENDPOINTS.TCS.TOKENIZE(tcId));
      return response.tokenId;
    } catch (error) {
      console.error('Erro na tokenização:', error);
      throw new Error('Falha na tokenização do título');
    }
  }

  private async atualizarTCBlockchain(
    tcId: string,
    dados: Partial<TituloCreditoUnion>
  ): Promise<void> {
    try {
      const tc = await this.obterTC(tcId);
      if (tc.blockchain?.tokenId) {
        await this.blockchainService.atualizarAtivo(tc.blockchain.tokenId, dados);
      }
    } catch (error) {
      console.error('Erro ao atualizar na blockchain:', error);
      // Não falha a operação se a blockchain falhar
    }
  }

  private async cancelarTCBlockchain(tcId: string): Promise<void> {
    try {
      const tc = await this.obterTC(tcId);
      if (tc.blockchain?.tokenId) {
        await this.blockchainService.cancelarAtivo(tc.blockchain.tokenId);
      }
    } catch (error) {
      console.error('Erro ao cancelar na blockchain:', error);
      // Não falha a operação se a blockchain falhar
    }
  }

  private async executarTransacaoBlockchain(transacao: Partial<TransacaoTC>): Promise<string> {
    try {
      const tc = await this.obterTC(transacao.tcId!);
      if (!tc.blockchain?.tokenId) {
        throw new Error('Título não está tokenizado');
      }

      return await this.blockchainService.transferirAtivo({
        tokenId: tc.blockchain.tokenId,
        de: transacao.vendedor!,
        para: transacao.comprador!,
        valor: transacao.valor!,
      });
    } catch (error) {
      console.error('Erro na transação blockchain:', error);
      throw new Error('Falha na execução da transação na blockchain');
    }
  }

  // Métodos de mock para desenvolvimento
  private mockListarTCs(filtros?: FiltrosTC): TituloCreditoUnion[] {
    const tcs: TituloCreditoUnion[] = [
      {
        id: 'tc-001',
        nome: 'Crédito ICMS - Janeiro 2024',
        tipo: 'tributario' as const,
        valorNominal: 150000,
        valorAtual: 145000,
        dataEmissao: new Date('2024-01-15'),
        dataVencimento: new Date('2025-01-15'),
        status: 'ATIVO',
        emissor: {
          id: 'empresa-001',
          nome: 'Empresa ABC Ltda',
          documento: '12.345.678/0001-90',
          email: 'contato@empresaabc.com.br',
        },
        blockchain: {
          network: 'hyperledger-fabric',
          contractAddress: 'contract-001',
          tokenId: 'token-001',
          transactionHash: '0xabc123',
          blockNumber: 12345,
        },
        marketplace: {
          listado: true,
          precoVenda: 140000,
          dataListagem: new Date('2024-01-20'),
        },
        criadoEm: new Date('2024-01-15'),
        atualizadoEm: new Date('2024-01-20'),
      },
      {
        id: 'tc-002',
        nome: 'Crédito PIS/COFINS - Fevereiro 2024',
        tipo: TipoTC.TRIBUTARIO,
        valorNominal: 85000,
        valorAtual: 83000,
        dataEmissao: new Date('2024-02-10'),
        dataVencimento: new Date('2025-02-10'),
        status: 'tokenizado',
        emissor: {
          id: 'empresa-002',
          nome: 'Indústria XYZ S.A.',
          documento: '98.765.432/0001-10',
          email: 'fiscal@industriaxyz.com.br',
        },
        blockchain: {
          network: 'hyperledger-fabric',
          contractAddress: 'contract-002',
          tokenId: 'token-002',
          transactionHash: '0xdef456',
          blockNumber: 12346,
        },
        criadoEm: new Date('2024-02-10'),
        atualizadoEm: new Date('2024-02-10'),
      },
    ];

    // Aplicar filtros se existirem
    let resultado = [...tcs];
    if (filtros) {
      if (filtros.tipo) {
        resultado = resultado.filter(tc => tc.tipo === filtros.tipo);
      }
      if (filtros.status) {
        resultado = resultado.filter(tc => tc.status === filtros.status);
      }
      if (filtros.valorMin) {
        resultado = resultado.filter(tc => tc.valorAtual >= filtros.valorMin!);
      }
      if (filtros.valorMax) {
        resultado = resultado.filter(tc => tc.valorAtual <= filtros.valorMax!);
      }
    }

    return resultado;
  }

  private mockObterTC(id: string): TituloCreditoUnion {
    const tcs = this.mockListarTCs();
    const tc = tcs.find(t => t.id === id);
    if (!tc) {
      throw new Error('TC não encontrado');
    }
    return tc;
  }

  private mockObterHistorico(tcId: string): any[] {
    return [
      {
        id: `hist-001`,
        tcId,
        evento: 'CRIACAO',
        descricao: 'Título de crédito criado',
        data: new Date('2024-01-15'),
        usuario: 'Sistema',
      },
      {
        id: `hist-002`,
        tcId,
        evento: 'TOKENIZACAO',
        descricao: 'Título tokenizado na blockchain',
        data: new Date('2024-01-16'),
        usuario: 'Admin',
        transactionHash: '0xabc123',
      },
      {
        id: `hist-003`,
        tcId,
        evento: 'LISTAGEM_MARKETPLACE',
        descricao: 'Título listado no marketplace',
        data: new Date('2024-01-20'),
        usuario: 'Empresa ABC',
        precoListagem: 140000,
      },
    ];
  }

  private mockObterEstatisticas(): EstatisticasMarketplace {
    return {
      volumeTotal: 5250000,
      numeroTransacoes: 127,
      tcsAtivos: 43,
      precoMedio: 122000,
      volumeDiario: 350000,
      tendenciaPreco: 'alta',
      ultimaAtualizacao: new Date(),
    };
  }
}
