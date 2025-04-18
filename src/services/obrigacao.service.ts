import { api } from './api';
import { 
  Obrigacao, 
  TipoObrigacao, 
  StatusObrigacao, 
  AnexoObrigacao,
  ValidacaoObrigacao 
} from '@/types/obrigacao';

export interface ObrigacaoFiltros {
  tipo?: TipoObrigacao;
  status?: StatusObrigacao;
  empresaId?: string;
  periodoInicio?: string;
  periodoFim?: string;
  vencimentoInicio?: string;
  vencimentoFim?: string;
  responsavel?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ObrigacaoPaginada {
  items: Obrigacao[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class ObrigacaoService {
  private static instance: ObrigacaoService;
  private baseUrl = '/obrigacoes';

  private constructor() {}

  public static getInstance(): ObrigacaoService {
    if (!ObrigacaoService.instance) {
      ObrigacaoService.instance = new ObrigacaoService();
    }
    return ObrigacaoService.instance;
  }

  public async listar(filtros?: ObrigacaoFiltros): Promise<ObrigacaoPaginada> {
    return api.get(this.baseUrl, filtros);
  }

  public async obterPorId(id: string): Promise<Obrigacao> {
    return api.get(`${this.baseUrl}/${id}`);
  }

  public async criar(obrigacao: Omit<Obrigacao, 'id'>): Promise<Obrigacao> {
    return api.post(this.baseUrl, obrigacao);
  }

  public async atualizar(id: string, obrigacao: Partial<Obrigacao>): Promise<Obrigacao> {
    return api.put(`${this.baseUrl}/${id}`, obrigacao);
  }

  public async excluir(id: string): Promise<void> {
    return api.delete(`${this.baseUrl}/${id}`);
  }

  public async validar(id: string): Promise<ValidacaoObrigacao[]> {
    return api.post(`${this.baseUrl}/${id}/validar`);
  }

  public async uploadAnexo(
    id: string,
    arquivo: File,
    onProgress?: (progress: number) => void
  ): Promise<AnexoObrigacao> {
    return api.upload(`${this.baseUrl}/${id}/anexos`, arquivo, onProgress);
  }

  public async excluirAnexo(id: string, anexoId: string): Promise<void> {
    return api.delete(`${this.baseUrl}/${id}/anexos/${anexoId}`);
  }

  public async baixarAnexo(id: string, anexoId: string): Promise<void> {
    return api.download(`${this.baseUrl}/${id}/anexos/${anexoId}`, `anexo-${anexoId}`);
  }

  public async atualizarStatus(id: string, status: StatusObrigacao, observacoes?: string): Promise<Obrigacao> {
    return api.put(`${this.baseUrl}/${id}/status`, { status, observacoes });
  }

  public async atribuirResponsavel(id: string, usuarioId: string): Promise<Obrigacao> {
    return api.put(`${this.baseUrl}/${id}/responsavel`, { usuarioId });
  }

  public async obterHistorico(id: string): Promise<{
    data: string;
    status: StatusObrigacao;
    usuario: string;
    observacoes?: string;
  }[]> {
    return api.get(`${this.baseUrl}/${id}/historico`);
  }

  public async gerarRelatorio(filtros: ObrigacaoFiltros & {
    formato: 'pdf' | 'excel' | 'csv';
    agruparPor?: ('tipo' | 'status' | 'empresa' | 'responsavel')[];
  }): Promise<void> {
    return api.download(`${this.baseUrl}/relatorio`, `relatorio-obrigacoes.${filtros.formato}`);
  }

  public async obterCalendario(mes: number, ano: number, empresaId?: string): Promise<{
    data: string;
    obrigacoes: {
      id: string;
      tipo: TipoObrigacao;
      descricao: string;
      status: StatusObrigacao;
    }[];
  }[]> {
    return api.get(`${this.baseUrl}/calendario`, { mes, ano, empresaId });
  }

  public async obterEstatisticas(empresaId?: string, periodo?: {
    inicio: string;
    fim: string;
  }): Promise<{
    totalObrigacoes: number;
    obrigacoesPorStatus: Record<StatusObrigacao, number>;
    obrigacoesPorTipo: Record<TipoObrigacao, number>;
    prazoMedioEntrega: number;
    taxaCumprimento: number;
  }> {
    return api.get(`${this.baseUrl}/estatisticas`, { empresaId, ...periodo });
  }

  public async verificarPendencias(empresaId: string): Promise<{
    temPendencias: boolean;
    obrigacoesPendentes: {
      id: string;
      tipo: TipoObrigacao;
      vencimento: string;
      diasAtraso: number;
    }[];
  }> {
    return api.get(`${this.baseUrl}/pendencias/${empresaId}`);
  }
}

export const obrigacaoService = ObrigacaoService.getInstance(); 