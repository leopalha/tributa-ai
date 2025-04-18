import { api } from '@/lib/api';
import { TituloDeCredito, TCFormData, TCFilters, TCTransaction, TCTransactionType } from '@/types/tc';

export interface TCFiltros {
  tipo?: string;
  status?: string;
  dataInicio?: string;
  dataFim?: string;
  valorMin?: number;
  valorMax?: number;
}

export interface TCPaginado {
  items: TituloDeCredito[];
  total: number;
  pagina: number;
  porPagina: number;
}

export class TCService {
  private static instance: TCService;
  private baseUrl = '/tcs';

  private constructor() {}

  public static getInstance(): TCService {
    if (!TCService.instance) {
      TCService.instance = new TCService();
    }
    return TCService.instance;
  }

  async listarTCs(filters?: TCFilters): Promise<TituloDeCredito[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (value instanceof Date) {
            params.append(key, value.toISOString());
          } else {
            params.append(key, String(value));
          }
        }
      });
    }

    const response = await api.get(`${this.baseUrl}?${params.toString()}`);
    return response.data;
  }

  async obterTC(id: string): Promise<TituloDeCredito> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async emitirTC(data: TCFormData): Promise<TituloDeCredito> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'documentos') {
        formData.append(key, String(value));
      }
    });

    data.documentos.forEach((file) => {
      formData.append('documentos', file);
    });

    const response = await api.post(this.baseUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async atualizarTC(id: string, tc: Partial<TituloDeCredito>): Promise<TituloDeCredito> {
    const response = await api.put(`${this.baseUrl}/${id}`, tc);
    return response.data;
  }

  async adicionarTransacao(id: string, transacao: Omit<TCTransaction, "id">): Promise<TCTransaction> {
    const response = await api.post(`${this.baseUrl}/${id}/transacoes`, {
      ...transacao,
      tipo: transacao.tipo as TCTransactionType,
    });
    return response.data;
  }

  async cancelarTC(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  async exportarTC(id: string): Promise<Blob> {
    const response = await api.get(`${this.baseUrl}/${id}/exportar`);
    return response.data;
  }

  public async listar(filtros?: TCFiltros): Promise<TCPaginado> {
    const response = await api.get(this.baseUrl, filtros);
    return response.data;
  }

  public async obterPorId(id: string): Promise<TituloDeCredito> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  public async criar(tc: Omit<TituloDeCredito, 'id'>): Promise<TituloDeCredito> {
    const response = await api.post(this.baseUrl, tc);
    return response.data;
  }

  public async atualizar(id: string, tc: Partial<TituloDeCredito>): Promise<TituloDeCredito> {
    const response = await api.put(`${this.baseUrl}/${id}`, tc);
    return response.data;
  }

  public async excluir(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  public async validarTC(tcId: string): Promise<{
    valido: boolean;
    mensagens: string[];
  }> {
    const response = await api.get(`${this.baseUrl}/${tcId}/validar`);
    return response.data;
  }

  public async simularCompensacao(tcId: string, valor: number): Promise<{
    possivel: boolean;
    valorDisponivel: number;
    mensagem?: string;
  }> {
    const response = await api.post(`${this.baseUrl}/${tcId}/simular-compensacao`, { valor });
    return response.data;
  }

  public async compensar(tcId: string, dados: {
    valor: number;
    tributo: string;
    periodoReferencia: string;
    documentoOrigem?: string;
  }): Promise<TituloDeCredito> {
    const response = await api.post(`${this.baseUrl}/${tcId}/compensar`, dados);
    return response.data;
  }

  public async cancelarCompensacao(tcId: string, transacaoId: string): Promise<TituloDeCredito> {
    const response = await api.post(`${this.baseUrl}/${tcId}/cancelar-compensacao/${transacaoId}`);
    return response.data;
  }

  public async gerarPDF(id: string): Promise<void> {
    await api.download(`${this.baseUrl}/${id}/pdf`, `TC-${id}.pdf`);
  }

  public async uploadDocumentos(id: string, arquivos: File[], onProgress?: (progress: number) => void): Promise<TituloDeCredito> {
    const formData = new FormData();
    arquivos.forEach((file) => {
      formData.append('documentos', file);
    });

    const response = await api.patch(`${this.baseUrl}/${id}/documentos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  public async obterHistorico(id: string): Promise<{
    data: string;
    usuario: string;
    acao: string;
    detalhes: Record<string, unknown>;
  }[]> {
    const response = await api.get(`${this.baseUrl}/${id}/historico`);
    return response.data;
  }

  public async obterEstatisticas(empresaId?: string): Promise<{
    totalTCs: number;
    valorTotal: number;
    valorDisponivel: number;
    valorUtilizado: number;
    distribuicaoPorStatus: Record<string, number>;
    distribuicaoPorTipo: Record<string, number>;
  }> {
    const response = await api.get(`${this.baseUrl}/estatisticas`, { empresaId });
    return response.data;
  }

  async comprarTC(tcId: string, valor: number): Promise<TCTransaction> {
    const response = await api.post(`${this.baseUrl}/${tcId}/comprar`, {
      valor,
      tipo: 'COMPRA' as TCTransactionType,
    });
    return response.data;
  }

  async venderTC(tcId: string, valor: number): Promise<TCTransaction> {
    const response = await api.post(`${this.baseUrl}/${tcId}/vender`, {
      valor,
      tipo: 'VENDA' as TCTransactionType,
    });
    return response.data;
  }

  async compensarDireta(tcId: string, debitoData: {
    tipoTributo: string;
    numeroDebito?: string;
    valorDebito: number;
    dataVencimento: Date;
  }): Promise<TCTransaction> {
    const response = await api.post(`${this.baseUrl}/${tcId}/compensar/direta`, {
      ...debitoData,
      tipo: 'COMPENSACAO_DIRETA' as TCTransactionType,
    });
    return response.data;
  }

  async compensarIndireta(tcId: string, debitoData: {
    tipoTributo: string;
    numeroDebito?: string;
    valorDebito: number;
    dataVencimento: Date;
  }): Promise<TCTransaction> {
    const response = await api.post(`${this.baseUrl}/${tcId}/compensar/indireta`, {
      ...debitoData,
      tipo: 'COMPENSACAO_INDIRETA' as TCTransactionType,
    });
    return response.data;
  }

  async obterTransacoes(tcId: string): Promise<TCTransaction[]> {
    const response = await api.get(`${this.baseUrl}/${tcId}/transacoes`);
    return response.data;
  }

  async calcularCompensacao(tcId: string, valorDebito: number): Promise<{
    valorCompensacao: number;
    valorDesconto: number;
    valorLiquido: number;
  }> {
    const response = await api.post(`${this.baseUrl}/${tcId}/calcular`, {
      valorDebito,
    });
    return response.data;
  }

  async atualizarDocumentos(tcId: string, documentos: File[]): Promise<TituloDeCredito> {
    const formData = new FormData();
    documentos.forEach((file) => {
      formData.append('documentos', file);
    });

    const response = await api.patch(`${this.baseUrl}/${tcId}/documentos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async cancelarTransacao(tcId: string, transacaoId: string): Promise<TCTransaction> {
    const response = await api.post(`${this.baseUrl}/${tcId}/transacoes/${transacaoId}/cancelar`);
    return response.data;
  }

  async obterAnaliseRisco(tcId: string): Promise<{
    nivelRisco: 'BAIXO' | 'MEDIO' | 'ALTO';
    pontuacao: number;
    fatores: Array<{
      descricao: string;
      impacto: number;
    }>;
  }> {
    const response = await api.get(`${this.baseUrl}/${tcId}/risco`);
    return response.data;
  }
}

export const tcService = TCService.getInstance(); 