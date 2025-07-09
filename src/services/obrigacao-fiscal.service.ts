import { api } from '@/services/api';
import {
  ObrigacaoFiscal,
  TipoObrigacaoFiscal,
  StatusDeclaracao,
  ComprovantePagamento,
  TipoTributo,
  Periodicidade,
  NivelComplexidade,
  AnexoObrigacao,
  ValidacaoObrigacao,
  ObrigacaoFiscalCreate,
  ObrigacaoFiscalUpdate,
  ObrigacaoFiscalFiltros,
  HistoricoObrigacao,
  ObrigacaoFiscalEstatisticas,
  ObrigacaoFiscalPendencias,
  ObrigacaoFiscalCalendario,
} from '@/types/obrigacao-fiscal';
import { mapToBaseStatus, isStatusInState } from '@/types/common/status';

export interface ObrigacaoFiscalPaginada {
  items: ObrigacaoFiscal[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ObrigacaoFiscalService {
  private static instance: ObrigacaoFiscalService;
  private baseUrl = '/obrigacoes-fiscais';

  private constructor() {}

  public static getInstance(): ObrigacaoFiscalService {
    if (!ObrigacaoFiscalService.instance) {
      ObrigacaoFiscalService.instance = new ObrigacaoFiscalService();
    }
    return ObrigacaoFiscalService.instance;
  }

  public async listar(filtros?: ObrigacaoFiscalFiltros): Promise<ObrigacaoFiscal[]> {
    const response = await api.get(this.baseUrl, { params: filtros });
    return response.data;
  }

  public async obter(id: string): Promise<ObrigacaoFiscal> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  public async criar(obrigacao: ObrigacaoFiscalCreate): Promise<ObrigacaoFiscal> {
    const response = await api.post(this.baseUrl, obrigacao);
    return response.data;
  }

  public async atualizar(id: string, obrigacao: ObrigacaoFiscalUpdate): Promise<ObrigacaoFiscal> {
    const response = await api.put(`${this.baseUrl}/${id}`, obrigacao);
    return response.data;
  }

  public async excluir(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  public async atualizarStatus(id: string, status: StatusDeclaracao): Promise<ObrigacaoFiscal> {
    const response = await api.patch(`${this.baseUrl}/${id}/status`, { status });
    return response.data;
  }

  public async enviar(id: string): Promise<ObrigacaoFiscal> {
    const response = await api.post(`${this.baseUrl}/${id}/enviar`);
    return response.data;
  }

  public async cancelar(id: string, motivo: string): Promise<ObrigacaoFiscal> {
    const response = await api.post(`${this.baseUrl}/${id}/cancelar`, { motivo });
    return response.data;
  }

  public async uploadAnexo(id: string, arquivo: File): Promise<AnexoObrigacao> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    const response = await api.upload(`${this.baseUrl}/${id}/anexos`, formData);
    return response.data;
  }

  public async excluirAnexo(id: string, anexoId: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}/anexos/${anexoId}`);
  }

  public async baixarAnexo(id: string, anexoId: string): Promise<Blob> {
    const response = await api.get(`${this.baseUrl}/${id}/anexos/${anexoId}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  public async obterHistorico(id: string): Promise<HistoricoObrigacao[]> {
    const response = await api.get(`${this.baseUrl}/${id}/historico`);
    return response.data;
  }

  public async criarNotificacao(notificacao: {
    titulo: string;
    mensagem: string;
    tipo: 'info' | 'warning' | 'error' | 'success';
    link?: string;
  }): Promise<void> {
    return api.post('/notificacoes', notificacao);
  }

  public async calcularImpostos(dados: {
    empresaId: string;
    tributo: TipoTributo;
    periodoReferencia: string;
    baseCalculo: number;
    ajustes?: {
      tipo: string;
      valor: number;
    }[];
  }): Promise<{
    valorPrincipal: number;
    multa?: number;
    juros?: number;
    valorTotal: number;
    aliquotas: {
      nome: string;
      valor: number;
      base: number;
    }[];
    deducoes?: {
      tipo: string;
      valor: number;
    }[];
  }> {
    return api.post(`${this.baseUrl}/calcular`, dados);
  }

  public async gerarDARF(id: string): Promise<{
    codigoBarras: string;
    linhaDigitavel: string;
    vencimento: string;
    valor: number;
    url: string;
  }> {
    return api.post(`${this.baseUrl}/${id}/gerar-darf`);
  }

  public async registrarPagamento(
    id: string,
    comprovante: Omit<ComprovantePagamento, 'id'>,
    arquivo?: File
  ): Promise<ObrigacaoFiscal> {
    const formData = new FormData();
    formData.append('dados', JSON.stringify(comprovante));
    if (arquivo) {
      formData.append('arquivo', arquivo);
    }
    return api.post(`${this.baseUrl}/${id}/pagamento`, formData);
  }

  public async retificar(
    id: string,
    motivo: string,
    novosDados: Partial<ObrigacaoFiscal>
  ): Promise<ObrigacaoFiscal> {
    return api.post(`${this.baseUrl}/${id}/retificar`, {
      motivo,
      ...novosDados,
    });
  }

  public async obterHistoricoRetificacoes(id: string): Promise<
    {
      data: string;
      motivo: string;
      usuario: string;
      alteracoes: {
        campo: string;
        valorAntigo: any;
        valorNovo: any;
      }[];
    }[]
  > {
    return api.get(`${this.baseUrl}/${id}/retificacoes`);
  }

  public async validar(id: string): Promise<{ valido: boolean; mensagens: string[] }> {
    const response = await api.post(`${this.baseUrl}/${id}/validar`);
    return response.data;
  }

  public async transmitir(id: string): Promise<ObrigacaoFiscal> {
    const response = await api.post(`${this.baseUrl}/${id}/transmitir`);
    return response.data;
  }

  public async gerarRecibo(id: string): Promise<Blob> {
    const response = await api.get(`${this.baseUrl}/${id}/recibo`, {
      responseType: 'blob',
    });
    return response.data;
  }

  public async obterEstatisticas(empresaId: string): Promise<ObrigacaoFiscalEstatisticas> {
    const response = await api.get(`${this.baseUrl}/estatisticas`, { params: { empresaId } });
    return response.data;
  }

  public async verificarPendencias(empresaId: string): Promise<ObrigacaoFiscalPendencias> {
    const response = await api.get(`${this.baseUrl}/pendencias`, { params: { empresaId } });
    return response.data;
  }

  public async listarObrigacoes(filtros?: {
    status?: StatusDeclaracao;
    tipo?: TipoObrigacaoFiscal;
    empresaId?: string;
    periodoInicio?: string;
    periodoFim?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    items: ObrigacaoFiscal[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await api.get(`${this.baseUrl}/lista`, { params: filtros });
    return response.data;
  }

  public async obterObrigacao(id: string): Promise<ObrigacaoFiscal> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  public async criarObrigacao(obrigacao: Omit<ObrigacaoFiscal, 'id'>): Promise<ObrigacaoFiscal> {
    const response = await api.post(this.baseUrl, obrigacao);
    return response.data;
  }

  public async atualizarObrigacao(
    id: string,
    obrigacao: Partial<ObrigacaoFiscal>
  ): Promise<ObrigacaoFiscal> {
    const response = await api.put(`${this.baseUrl}/${id}`, obrigacao);
    return response.data;
  }

  public async excluirObrigacao(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  public async calcularJurosEMultas(id: string): Promise<{
    juros: number;
    multa: number;
    total: number;
  }> {
    const response = await api.get(`${this.baseUrl}/${id}/juros-multas`);
    return response.data;
  }

  public async exportarObrigacoes(filtros?: {
    formato?: 'csv' | 'xlsx';
    periodoInicio?: string;
    periodoFim?: string;
    status?: string;
    tipo?: string;
  }): Promise<Blob> {
    const response = await api.get(`${this.baseUrl}/exportar`, {
      params: filtros,
      responseType: 'blob',
    });
    return response.data;
  }

  public async verificarNotificacoes(): Promise<{
    proximas: ObrigacaoFiscal[];
    vencidas: ObrigacaoFiscal[];
  }> {
    const response = await api.get(`${this.baseUrl}/notificacoes`);
    return response.data;
  }

  public async validarObrigacao(id: string): Promise<ValidacaoObrigacao[]> {
    const response = await api.post(`${this.baseUrl}/${id}/validar`);
    return response.data;
  }

  public async uploadAnexoObrigacao(
    id: string,
    arquivo: File,
    onProgress?: (progress: number) => void
  ): Promise<AnexoObrigacao> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    const response = await api.upload(`${this.baseUrl}/${id}/anexos`, formData, onProgress);
    return response.data;
  }

  public async excluirAnexoObrigacao(id: string, anexoId: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}/anexos/${anexoId}`);
  }

  public async baixarAnexoObrigacao(id: string, anexoId: string): Promise<void> {
    await api.get(`${this.baseUrl}/${id}/anexos/${anexoId}`, {
      responseType: 'blob',
    });
  }

  public async atualizarStatusObrigacao(
    id: string,
    status: StatusDeclaracao,
    observacoes?: string
  ): Promise<ObrigacaoFiscal> {
    const response = await api.patch(`${this.baseUrl}/${id}/status`, { status, observacoes });
    return response.data;
  }

  public async atribuirResponsavelObrigacao(
    id: string,
    usuarioId: string
  ): Promise<ObrigacaoFiscal> {
    const response = await api.patch(`${this.baseUrl}/${id}/responsavel`, { usuarioId });
    return response.data;
  }

  public async obterHistoricoObrigacao(id: string): Promise<
    {
      data: string;
      status: StatusDeclaracao;
      usuario: string;
      observacoes?: string;
    }[]
  > {
    const response = await api.get(`${this.baseUrl}/${id}/historico`);
    return response.data;
  }

  public async gerarRelatorio(
    filtros?: ObrigacaoFiscalFiltros,
    formato: 'csv' | 'pdf' | 'excel' = 'pdf'
  ): Promise<Blob> {
    const response = await api.get(`${this.baseUrl}/relatorio`, {
      params: { ...filtros, formato },
      responseType: 'blob',
    });
    return response.data;
  }

  public async obterCalendario(
    empresaId: string,
    mes: number,
    ano: number
  ): Promise<ObrigacaoFiscalCalendario> {
    const response = await api.get(`${this.baseUrl}/calendario`, {
      params: { empresaId, mes, ano },
    });
    return response.data;
  }

  public isObrigacaoRascunho(obrigacao: ObrigacaoFiscal): boolean {
    return obrigacao.status === 'declaracao_pendente';
  }

  public isObrigacaoPendente(obrigacao: ObrigacaoFiscal): boolean {
    return obrigacao.status === 'declaracao_pendente';
  }

  public isObrigacaoEnviada(obrigacao: ObrigacaoFiscal): boolean {
    return obrigacao.status === 'declaracao_em_andamento';
  }

  public isObrigacaoProcessando(obrigacao: ObrigacaoFiscal): boolean {
    return obrigacao.status === 'declaracao_em_andamento';
  }

  public isObrigacaoAceita(obrigacao: ObrigacaoFiscal): boolean {
    return obrigacao.status === 'declaracao_concluida';
  }

  public isObrigacaoRejeitada(obrigacao: ObrigacaoFiscal): boolean {
    return obrigacao.status === 'declaracao_atrasada';
  }

  public isObrigacaoCancelada(obrigacao: ObrigacaoFiscal): boolean {
    return obrigacao.status === 'declaracao_cancelada';
  }

  public async gerarRelatorioObrigacoes(params: {
    formato?: 'csv' | 'xlsx';
    periodoInicio?: string;
    periodoFim?: string;
    status?: string;
    tipo?: string;
  }): Promise<Blob> {
    const response = await api.get(`${this.baseUrl}/relatorio-obrigacoes`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  }

  public async gerarRelatorioDeclaracoes(
    params: ObrigacaoFiscalFiltros & {
      formato: 'csv' | 'pdf' | 'excel';
      agruparPor?: ('status' | 'tipo' | 'responsavel' | 'empresa')[];
    }
  ): Promise<Blob> {
    const response = await api.get(`${this.baseUrl}/relatorio-declaracoes`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  }
}
