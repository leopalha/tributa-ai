import { api } from '@/services/api';
import {
  Declaracao,
  TipoDeclaracao,
  StatusDeclaracao,
  ComprovantePagamento,
  TipoTributo,
  ObrigacaoFiscal,
  Periodicidade,
  NivelComplexidade,
  AnexoObrigacao,
  ValidacaoObrigacao,
  DeclaracaoCreate,
  DeclaracaoUpdate,
  DeclaracaoFiltros,
  AnexoDeclaracao,
  HistoricoDeclaracao,
  DeclaracaoEstatisticas,
  DeclaracaoPendencias,
  DeclaracaoCalendario,
} from '@/types/declaracao';
import { mapToBaseStatus, isStatusInState } from '@/types/common/status';

export interface DeclaracaoPaginada {
  items: Declaracao[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class DeclaracaoService {
  private static instance: DeclaracaoService;
  private baseUrl = '/declaracoes';

  private constructor() {}

  public static getInstance(): DeclaracaoService {
    if (!DeclaracaoService.instance) {
      DeclaracaoService.instance = new DeclaracaoService();
    }
    return DeclaracaoService.instance;
  }

  public async listar(filtros?: DeclaracaoFiltros): Promise<Declaracao[]> {
    const response = await api.get(this.baseUrl, { params: filtros });
    return response.data;
  }

  public async obter(id: string): Promise<Declaracao> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  public async criar(declaracao: DeclaracaoCreate): Promise<Declaracao> {
    const response = await api.post(this.baseUrl, declaracao);
    return response.data;
  }

  public async atualizar(id: string, declaracao: DeclaracaoUpdate): Promise<Declaracao> {
    const response = await api.put(`${this.baseUrl}/${id}`, declaracao);
    return response.data;
  }

  public async excluir(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  public async atualizarStatus(id: string, status: StatusDeclaracao): Promise<Declaracao> {
    const response = await api.patch(`${this.baseUrl}/${id}/status`, { status });
    return response.data;
  }

  public async enviar(id: string): Promise<Declaracao> {
    const response = await api.post(`${this.baseUrl}/${id}/enviar`);
    return response.data;
  }

  public async cancelar(id: string, motivo: string): Promise<Declaracao> {
    const response = await api.post(`${this.baseUrl}/${id}/cancelar`, { motivo });
    return response.data;
  }

  public async uploadAnexo(id: string, arquivo: File): Promise<AnexoDeclaracao> {
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

  public async obterHistorico(id: string): Promise<HistoricoDeclaracao[]> {
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
  ): Promise<Declaracao> {
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
    novosDados: Partial<Declaracao>
  ): Promise<Declaracao> {
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

  public async transmitir(id: string): Promise<Declaracao> {
    const response = await api.post(`${this.baseUrl}/${id}/transmitir`);
    return response.data;
  }

  public async gerarRecibo(id: string): Promise<Blob> {
    const response = await api.get(`${this.baseUrl}/${id}/recibo`, {
      responseType: 'blob',
    });
    return response.data;
  }

  public async obterEstatisticas(empresaId: string): Promise<DeclaracaoEstatisticas> {
    const response = await api.get(`${this.baseUrl}/estatisticas`, {
      params: { empresaId },
    });
    return response.data;
  }

  public async verificarPendencias(empresaId: string): Promise<DeclaracaoPendencias> {
    const response = await api.get(`${this.baseUrl}/pendencias/${empresaId}`);
    return response.data;
  }

  public async listarObrigacoes(filtros?: {
    status?: StatusDeclaracao;
    tipo?: TipoDeclaracao;
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
    return api.get(`${this.baseUrl}/obrigacoes`, filtros);
  }

  public async obterObrigacao(id: string): Promise<ObrigacaoFiscal> {
    return api.get(`${this.baseUrl}/obrigacoes/${id}`);
  }

  public async criarObrigacao(obrigacao: Omit<ObrigacaoFiscal, 'id'>): Promise<ObrigacaoFiscal> {
    return api.post(`${this.baseUrl}/obrigacoes`, obrigacao);
  }

  public async atualizarObrigacao(
    id: string,
    obrigacao: Partial<ObrigacaoFiscal>
  ): Promise<ObrigacaoFiscal> {
    return api.put(`${this.baseUrl}/obrigacoes/${id}`, obrigacao);
  }

  public async excluirObrigacao(id: string): Promise<void> {
    return api.delete(`${this.baseUrl}/obrigacoes/${id}`);
  }

  public async calcularJurosEMultas(id: string): Promise<{
    juros: number;
    multa: number;
    total: number;
  }> {
    return api.post(`${this.baseUrl}/obrigacoes/${id}/calcular-juros-multas`);
  }

  public async exportarObrigacoes(filtros?: {
    formato?: 'csv' | 'xlsx';
    periodoInicio?: string;
    periodoFim?: string;
    status?: string;
    tipo?: string;
  }): Promise<void> {
    const queryParams = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }
    const url = `${this.baseUrl}/obrigacoes/exportar?${queryParams.toString()}`;
    const filename = `obrigacoes-${Date.now()}.${filtros?.formato || 'csv'}`;
    return api.download(url, filename);
  }

  public async verificarNotificacoes(): Promise<{
    proximas: ObrigacaoFiscal[];
    vencidas: ObrigacaoFiscal[];
  }> {
    return api.get(`${this.baseUrl}/obrigacoes/notificacoes`);
  }

  public async validarObrigacao(id: string): Promise<ValidacaoObrigacao[]> {
    return api.post(`${this.baseUrl}/obrigacoes/${id}/validar`);
  }

  public async uploadAnexoObrigacao(
    id: string,
    arquivo: File,
    onProgress?: (progress: number) => void
  ): Promise<AnexoObrigacao> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    return api.upload(`${this.baseUrl}/obrigacoes/${id}/anexos`, formData, onProgress);
  }

  public async excluirAnexoObrigacao(id: string, anexoId: string): Promise<void> {
    return api.delete(`${this.baseUrl}/obrigacoes/${id}/anexos/${anexoId}`);
  }

  public async baixarAnexoObrigacao(id: string, anexoId: string): Promise<void> {
    return api.download(`${this.baseUrl}/obrigacoes/${id}/anexos/${anexoId}`, `anexo-${anexoId}`);
  }

  public async atualizarStatusObrigacao(
    id: string,
    status: StatusDeclaracao,
    observacoes?: string
  ): Promise<ObrigacaoFiscal> {
    return api.put(`${this.baseUrl}/obrigacoes/${id}/status`, { status, observacoes });
  }

  public async atribuirResponsavelObrigacao(
    id: string,
    usuarioId: string
  ): Promise<ObrigacaoFiscal> {
    return api.put(`${this.baseUrl}/obrigacoes/${id}/responsavel`, { usuarioId });
  }

  public async obterHistoricoObrigacao(id: string): Promise<
    {
      data: string;
      status: StatusDeclaracao;
      usuario: string;
      observacoes?: string;
    }[]
  > {
    return api.get(`${this.baseUrl}/obrigacoes/${id}/historico`);
  }

  public async gerarRelatorio(
    filtros?: DeclaracaoFiltros,
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
  ): Promise<DeclaracaoCalendario> {
    const response = await api.get(`${this.baseUrl}/calendario`, {
      params: { empresaId, mes, ano },
    });
    return response.data;
  }

  // Métodos de utilidade
  public isDeclaracaoRascunho(declaracao: Declaracao): boolean {
    return isStatusInState('declaracao', declaracao.status, 'PENDENTE');
  }

  public isDeclaracaoPendente(declaracao: Declaracao): boolean {
    return isStatusInState('declaracao', declaracao.status, 'PENDENTE');
  }

  public isDeclaracaoEnviada(declaracao: Declaracao): boolean {
    return isStatusInState('declaracao', declaracao.status, 'PROCESSANDO');
  }

  public isDeclaracaoProcessando(declaracao: Declaracao): boolean {
    return isStatusInState('declaracao', declaracao.status, 'PROCESSANDO');
  }

  public isDeclaracaoAceita(declaracao: Declaracao): boolean {
    return isStatusInState('declaracao', declaracao.status, 'CONCLUIDO');
  }

  public isDeclaracaoRejeitada(declaracao: Declaracao): boolean {
    return isStatusInState('declaracao', declaracao.status, 'REJEITADO');
  }

  public isDeclaracaoCancelada(declaracao: Declaracao): boolean {
    return isStatusInState('declaracao', declaracao.status, 'CANCELADO');
  }

  public async gerarRelatorioObrigacoes(params: {
    formato?: 'csv' | 'xlsx';
    periodoInicio?: string;
    periodoFim?: string;
    status?: string;
    tipo?: string;
  }): Promise<Blob> {
    return api.get(`${this.baseUrl}/obrigacoes/relatorio`, {
      params,
      responseType: 'blob',
    });
  }

  public async gerarRelatorioDeclaracoes(
    params: DeclaracaoFiltros & {
      formato: 'csv' | 'pdf' | 'excel';
      agruparPor?: ('status' | 'tipo' | 'responsavel' | 'empresa')[];
    }
  ): Promise<Blob> {
    return api.get(`${this.baseUrl}/relatorio`, {
      params,
      responseType: 'blob',
    });
  }
}

export const declaracaoService = DeclaracaoService.getInstance();
