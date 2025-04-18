import { api } from './api';
import { 
  PeriodoAnalise,
  MetricaAnalytics,
  GraficoAnalytics,
  Insight,
  RelatorioAnalytics,
  DashboardAnalytics 
} from '@/types/analytics';

export interface AnalyticsFiltros {
  empresaId?: string;
  periodo?: PeriodoAnalise;
  dataInicio?: string;
  dataFim?: string;
  agrupamento?: string;
  categorias?: string[];
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private baseUrl = '/analytics';

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  public async obterMetricas(filtros?: AnalyticsFiltros): Promise<MetricaAnalytics[]> {
    return api.get(`${this.baseUrl}/metricas`, filtros);
  }

  public async obterGraficos(filtros?: AnalyticsFiltros): Promise<GraficoAnalytics[]> {
    return api.get(`${this.baseUrl}/graficos`, filtros);
  }

  public async obterInsights(filtros?: AnalyticsFiltros): Promise<Insight[]> {
    return api.get(`${this.baseUrl}/insights`, filtros);
  }

  public async obterRelatorio(id: string): Promise<RelatorioAnalytics> {
    return api.get(`${this.baseUrl}/relatorios/${id}`);
  }

  public async gerarRelatorio(dados: {
    titulo: string;
    descricao: string;
    periodo: PeriodoAnalise;
    dataInicio: string;
    dataFim: string;
    metricas: string[];
    graficos: string[];
    filtros?: Record<string, unknown>;
  }): Promise<RelatorioAnalytics> {
    return api.post(`${this.baseUrl}/relatorios`, dados);
  }

  public async exportarRelatorio(id: string, formato: 'pdf' | 'excel'): Promise<void> {
    return api.download(`${this.baseUrl}/relatorios/${id}/exportar`, `relatorio-${id}.${formato}`);
  }

  public async obterDashboard(id: string): Promise<DashboardAnalytics> {
    return api.get(`${this.baseUrl}/dashboards/${id}`);
  }

  public async salvarDashboard(dashboard: Omit<DashboardAnalytics, 'id'>): Promise<DashboardAnalytics> {
    return api.post(`${this.baseUrl}/dashboards`, dashboard);
  }

  public async atualizarDashboard(id: string, dados: Partial<DashboardAnalytics>): Promise<DashboardAnalytics> {
    return api.put(`${this.baseUrl}/dashboards/${id}`, dados);
  }

  public async excluirDashboard(id: string): Promise<void> {
    return api.delete(`${this.baseUrl}/dashboards/${id}`);
  }

  public async obterAnaliseCreditos(empresaId: string, periodo?: {
    inicio: string;
    fim: string;
  }): Promise<{
    totalCreditos: number;
    creditosUtilizados: number;
    creditosDisponiveis: number;
    creditosVencidos: number;
    distribuicaoPorTipo: Record<string, number>;
    evolucaoMensal: {
      mes: string;
      creditos: number;
      utilizacao: number;
    }[];
    projecaoProximosMeses: {
      mes: string;
      valor: number;
      confianca: number;
    }[];
  }> {
    return api.get(`${this.baseUrl}/creditos/${empresaId}`, periodo);
  }

  public async obterAnaliseObrigacoes(empresaId: string, periodo?: {
    inicio: string;
    fim: string;
  }): Promise<{
    totalObrigacoes: number;
    obrigacoesNoPrazo: number;
    obrigacoesAtrasadas: number;
    tempoMedioAtraso: number;
    custoTotalMultas: number;
    distribuicaoPorTipo: Record<string, number>;
    evolucaoMensal: {
      mes: string;
      quantidade: number;
      pontualidade: number;
    }[];
  }> {
    return api.get(`${this.baseUrl}/obrigacoes/${empresaId}`, periodo);
  }

  public async obterAnaliseRiscos(empresaId: string): Promise<{
    nivelRiscoGeral: number;
    principaisRiscos: {
      categoria: string;
      nivel: number;
      impacto: number;
      probabilidade: number;
      descricao: string;
    }[];
    distribuicaoPorCategoria: Record<string, number>;
    evolucaoRisco: {
      mes: string;
      nivel: number;
    }[];
    recomendacoes: {
      prioridade: number;
      descricao: string;
      impacto: string;
    }[];
  }> {
    return api.get(`${this.baseUrl}/riscos/${empresaId}`);
  }

  public async obterPrevisoes(empresaId: string, horizonte: number): Promise<{
    obrigacoes: {
      data: string;
      tipo: string;
      valor: number;
      probabilidade: number;
    }[];
    creditos: {
      data: string;
      tipo: string;
      valor: number;
      probabilidade: number;
    }[];
    riscos: {
      data: string;
      categoria: string;
      nivel: number;
      probabilidade: number;
    }[];
  }> {
    return api.get(`${this.baseUrl}/previsoes/${empresaId}`, { horizonte });
  }

  public async obterComparativoMercado(empresaId: string, metricas: string[]): Promise<{
    posicaoRanking: number;
    totalEmpresas: number;
    metricas: {
      nome: string;
      valor: number;
      mediaSetor: number;
      percentil: number;
    }[];
  }> {
    return api.get(`${this.baseUrl}/mercado/${empresaId}`, { metricas });
  }
}

export const analyticsService = AnalyticsService.getInstance(); 