import { api } from './api';
import { 
  Declaracao, 
  TipoDeclaracao, 
  StatusDeclaracao,
  ComprovantePagamento,
  TipoTributo 
} from '@/types/declaracao';

export interface DeclaracaoFiltros {
  tipo?: TipoDeclaracao;
  status?: StatusDeclaracao;
  tributo?: TipoTributo;
  empresaId?: string;
  periodoInicio?: string;
  periodoFim?: string;
  vencimentoInicio?: string;
  vencimentoFim?: string;
  valorMinimo?: number;
  valorMaximo?: number;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface DeclaracaoPaginada {
  items: Declaracao[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class DeclaracaoService {
  private static instance: DeclaracaoService;
  private baseUrl = '/declaracoes';

  private constructor() {}

  public static getInstance(): DeclaracaoService {
    if (!DeclaracaoService.instance) {
      DeclaracaoService.instance = new DeclaracaoService();
    }
    return DeclaracaoService.instance;
  }

  public async listar(filtros?: DeclaracaoFiltros): Promise<DeclaracaoPaginada> {
    return api.get(this.baseUrl, filtros);
  }

  public async obterPorId(id: string): Promise<Declaracao> {
    return api.get(`${this.baseUrl}/${id}`);
  }

  public async criar(declaracao: Omit<Declaracao, 'id'>): Promise<Declaracao> {
    return api.post(this.baseUrl, declaracao);
  }

  public async atualizar(id: string, declaracao: Partial<Declaracao>): Promise<Declaracao> {
    return api.put(`${this.baseUrl}/${id}`, declaracao);
  }

  public async excluir(id: string): Promise<void> {
    return api.delete(`${this.baseUrl}/${id}`);
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

  public async retificar(id: string, motivo: string, novosDados: Partial<Declaracao>): Promise<Declaracao> {
    return api.post(`${this.baseUrl}/${id}/retificar`, {
      motivo,
      ...novosDados
    });
  }

  public async obterHistoricoRetificacoes(id: string): Promise<{
    data: string;
    motivo: string;
    usuario: string;
    alteracoes: {
      campo: string;
      valorAntigo: any;
      valorNovo: any;
    }[];
  }[]> {
    return api.get(`${this.baseUrl}/${id}/retificacoes`);
  }

  public async validar(id: string): Promise<{
    valido: boolean;
    erros: {
      campo: string;
      mensagem: string;
      tipo: 'erro' | 'alerta';
    }[];
  }> {
    return api.post(`${this.baseUrl}/${id}/validar`);
  }

  public async transmitir(id: string): Promise<{
    protocolo: string;
    dataTransmissao: string;
    situacao: 'processando' | 'aceita' | 'rejeitada';
    mensagem?: string;
  }> {
    return api.post(`${this.baseUrl}/${id}/transmitir`);
  }

  public async gerarRecibo(id: string): Promise<void> {
    return api.download(`${this.baseUrl}/${id}/recibo`, `recibo-${id}.pdf`);
  }

  public async obterEstatisticas(empresaId?: string, periodo?: {
    inicio: string;
    fim: string;
  }): Promise<{
    totalDeclaracoes: number;
    valorTotal: number;
    declaracoesPorStatus: Record<StatusDeclaracao, number>;
    declaracoesPorTipo: Record<TipoDeclaracao, number>;
    tributosDeclarados: {
      tributo: TipoTributo;
      quantidade: number;
      valorTotal: number;
    }[];
    evolucaoMensal: {
      mes: string;
      quantidade: number;
      valor: number;
    }[];
  }> {
    return api.get(`${this.baseUrl}/estatisticas`, { empresaId, ...periodo });
  }

  public async verificarPendencias(empresaId: string): Promise<{
    temPendencias: boolean;
    declaracoesPendentes: {
      id: string;
      tipo: TipoDeclaracao;
      tributo: TipoTributo;
      vencimento: string;
      valor: number;
    }[];
    totalPendente: number;
  }> {
    return api.get(`${this.baseUrl}/pendencias/${empresaId}`);
  }
}

export const declaracaoService = DeclaracaoService.getInstance(); 