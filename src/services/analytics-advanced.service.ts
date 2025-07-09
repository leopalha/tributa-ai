import {
  AnalyticsReport,
  ReportType,
  ReportCategory,
  ReportParameters,
  ReportResult,
  ReportStatus,
  AnalyticsDashboard,
  DashboardWidget,
  AnalyticsQuery,
  AnalyticsMetric,
  AnalyticsAlert,
  AnalyticsExport,
  ReportData,
  ReportVisualization,
  ReportTable,
  KeyMetric,
  ReportInsight,
  ReportRecommendation,
} from '@/types/analytics-advanced';
import { api } from './api';

export class AdvancedAnalyticsService {
  private static instance: AdvancedAnalyticsService;
  private baseUrl = '/api/analytics';

  private constructor() {}

  public static getInstance(): AdvancedAnalyticsService {
    if (!AdvancedAnalyticsService.instance) {
      AdvancedAnalyticsService.instance = new AdvancedAnalyticsService();
    }
    return AdvancedAnalyticsService.instance;
  }

  // Report Management
  public async createReport(
    report: Omit<AnalyticsReport, 'id' | 'createdAt' | 'status'>
  ): Promise<AnalyticsReport> {
    try {
      const response = await api.post(`${this.baseUrl}/reports`, {
        ...report,
        status: ReportStatus.DRAFT,
        createdAt: new Date(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar relatório:', error);
      throw new Error('Falha ao criar relatório');
    }
  }

  public async updateReport(
    id: string,
    updates: Partial<AnalyticsReport>
  ): Promise<AnalyticsReport> {
    try {
      const response = await api.put(`${this.baseUrl}/reports/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar relatório:', error);
      throw new Error('Falha ao atualizar relatório');
    }
  }

  public async getReport(id: string): Promise<AnalyticsReport> {
    try {
      const response = await api.get(`${this.baseUrl}/reports/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter relatório:', error);
      throw new Error('Relatório não encontrado');
    }
  }

  public async listReports(filters?: {
    type?: ReportType;
    category?: ReportCategory;
    status?: ReportStatus;
    createdBy?: string;
  }): Promise<AnalyticsReport[]> {
    try {
      const response = await api.get(`${this.baseUrl}/reports`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar relatórios:', error);
      throw new Error('Falha ao carregar relatórios');
    }
  }

  public async deleteReport(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/reports/${id}`);
    } catch (error) {
      console.error('Erro ao excluir relatório:', error);
      throw new Error('Falha ao excluir relatório');
    }
  }

  // Report Generation
  public async generateReport(
    id: string,
    parameters?: Partial<ReportParameters>
  ): Promise<ReportResult> {
    try {
      const response = await api.post(`${this.baseUrl}/reports/${id}/generate`, { parameters });
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      throw new Error('Falha ao gerar relatório');
    }
  }

  public async getReportResult(reportId: string, resultId: string): Promise<ReportResult> {
    try {
      const response = await api.get(`${this.baseUrl}/reports/${reportId}/results/${resultId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter resultado do relatório:', error);
      throw new Error('Resultado não encontrado');
    }
  }

  public async listReportResults(reportId: string): Promise<ReportResult[]> {
    try {
      const response = await api.get(`${this.baseUrl}/reports/${reportId}/results`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar resultados:', error);
      throw new Error('Falha ao carregar resultados');
    }
  }

  // Dashboard Management
  public async createDashboard(
    dashboard: Omit<AnalyticsDashboard, 'id' | 'lastUpdated'>
  ): Promise<AnalyticsDashboard> {
    try {
      const response = await api.post(`${this.baseUrl}/dashboards`, {
        ...dashboard,
        lastUpdated: new Date(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar dashboard:', error);
      throw new Error('Falha ao criar dashboard');
    }
  }

  public async updateDashboard(
    id: string,
    updates: Partial<AnalyticsDashboard>
  ): Promise<AnalyticsDashboard> {
    try {
      const response = await api.put(`${this.baseUrl}/dashboards/${id}`, {
        ...updates,
        lastUpdated: new Date(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar dashboard:', error);
      throw new Error('Falha ao atualizar dashboard');
    }
  }

  public async getDashboard(id: string): Promise<AnalyticsDashboard> {
    try {
      const response = await api.get(`${this.baseUrl}/dashboards/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter dashboard:', error);
      throw new Error('Dashboard não encontrado');
    }
  }

  public async listDashboards(): Promise<AnalyticsDashboard[]> {
    try {
      const response = await api.get(`${this.baseUrl}/dashboards`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar dashboards:', error);
      throw new Error('Falha ao carregar dashboards');
    }
  }

  public async deleteDashboard(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/dashboards/${id}`);
    } catch (error) {
      console.error('Erro ao excluir dashboard:', error);
      throw new Error('Falha ao excluir dashboard');
    }
  }

  // Widget Data
  public async getWidgetData(dashboardId: string, widgetId: string): Promise<any> {
    try {
      const response = await api.get(
        `${this.baseUrl}/dashboards/${dashboardId}/widgets/${widgetId}/data`
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao obter dados do widget:', error);
      throw new Error('Falha ao carregar dados do widget');
    }
  }

  public async refreshWidget(dashboardId: string, widgetId: string): Promise<any> {
    try {
      const response = await api.post(
        `${this.baseUrl}/dashboards/${dashboardId}/widgets/${widgetId}/refresh`
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar widget:', error);
      throw new Error('Falha ao atualizar widget');
    }
  }

  // Query Management
  public async createQuery(query: Omit<AnalyticsQuery, 'id'>): Promise<AnalyticsQuery> {
    try {
      const response = await api.post(`${this.baseUrl}/queries`, query);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar consulta:', error);
      throw new Error('Falha ao criar consulta');
    }
  }

  public async executeQuery(id: string, parameters?: Record<string, any>): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}/queries/${id}/execute`, { parameters });
      return response.data;
    } catch (error) {
      console.error('Erro ao executar consulta:', error);
      throw new Error('Falha ao executar consulta');
    }
  }

  public async validateQuery(sql: string): Promise<{ valid: boolean; errors?: string[] }> {
    try {
      const response = await api.post(`${this.baseUrl}/queries/validate`, { sql });
      return response.data;
    } catch (error) {
      console.error('Erro ao validar consulta:', error);
      throw new Error('Falha ao validar consulta');
    }
  }

  // Metrics Management
  public async createMetric(metric: Omit<AnalyticsMetric, 'id'>): Promise<AnalyticsMetric> {
    try {
      const response = await api.post(`${this.baseUrl}/metrics`, metric);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar métrica:', error);
      throw new Error('Falha ao criar métrica');
    }
  }

  public async calculateMetric(id: string, parameters?: Record<string, any>): Promise<number> {
    try {
      const response = await api.post(`${this.baseUrl}/metrics/${id}/calculate`, { parameters });
      return response.data.value;
    } catch (error) {
      console.error('Erro ao calcular métrica:', error);
      throw new Error('Falha ao calcular métrica');
    }
  }

  public async listMetrics(category?: string): Promise<AnalyticsMetric[]> {
    try {
      const response = await api.get(`${this.baseUrl}/metrics`, { params: { category } });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar métricas:', error);
      throw new Error('Falha ao carregar métricas');
    }
  }

  // Alerts Management
  public async createAlert(
    alert: Omit<AnalyticsAlert, 'id' | 'triggerCount'>
  ): Promise<AnalyticsAlert> {
    try {
      const response = await api.post(`${this.baseUrl}/alerts`, {
        ...alert,
        triggerCount: 0,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar alerta:', error);
      throw new Error('Falha ao criar alerta');
    }
  }

  public async updateAlert(id: string, updates: Partial<AnalyticsAlert>): Promise<AnalyticsAlert> {
    try {
      const response = await api.put(`${this.baseUrl}/alerts/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar alerta:', error);
      throw new Error('Falha ao atualizar alerta');
    }
  }

  public async listAlerts(enabled?: boolean): Promise<AnalyticsAlert[]> {
    try {
      const response = await api.get(`${this.baseUrl}/alerts`, { params: { enabled } });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar alertas:', error);
      throw new Error('Falha ao carregar alertas');
    }
  }

  public async testAlert(id: string): Promise<{ triggered: boolean; message?: string }> {
    try {
      const response = await api.post(`${this.baseUrl}/alerts/${id}/test`);
      return response.data;
    } catch (error) {
      console.error('Erro ao testar alerta:', error);
      throw new Error('Falha ao testar alerta');
    }
  }

  // Export Management
  public async createExport(
    exportConfig: Omit<AnalyticsExport, 'id' | 'status'>
  ): Promise<AnalyticsExport> {
    try {
      const response = await api.post(`${this.baseUrl}/exports`, {
        ...exportConfig,
        status: 'pending',
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar exportação:', error);
      throw new Error('Falha ao criar exportação');
    }
  }

  public async getExportStatus(id: string): Promise<AnalyticsExport> {
    try {
      const response = await api.get(`${this.baseUrl}/exports/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter status da exportação:', error);
      throw new Error('Exportação não encontrada');
    }
  }

  public async downloadExport(id: string): Promise<Blob> {
    try {
      const response = await api.get(`${this.baseUrl}/exports/${id}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao baixar exportação:', error);
      throw new Error('Falha ao baixar arquivo');
    }
  }

  // Advanced Analytics
  public async detectAnomalies(
    metricId: string,
    options?: {
      sensitivity?: number;
      period?: string;
      algorithm?: 'statistical' | 'ml' | 'hybrid';
    }
  ): Promise<
    Array<{
      timestamp: Date;
      value: number;
      expected: number;
      deviation: number;
      severity: 'low' | 'medium' | 'high';
    }>
  > {
    try {
      const response = await api.post(`${this.baseUrl}/analytics/anomalies`, {
        metricId,
        ...options,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao detectar anomalias:', error);
      throw new Error('Falha na detecção de anomalias');
    }
  }

  public async generateInsights(
    datasetId: string,
    options?: {
      types?: string[];
      confidence?: number;
      limit?: number;
    }
  ): Promise<ReportInsight[]> {
    try {
      const response = await api.post(`${this.baseUrl}/analytics/insights`, {
        datasetId,
        ...options,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar insights:', error);
      throw new Error('Falha ao gerar insights');
    }
  }

  public async predictTrends(
    metricId: string,
    options?: {
      horizon?: number; // days
      confidence?: number;
      model?: 'linear' | 'arima' | 'prophet' | 'ml';
    }
  ): Promise<
    Array<{
      date: Date;
      predicted: number;
      lower: number;
      upper: number;
      confidence: number;
    }>
  > {
    try {
      const response = await api.post(`${this.baseUrl}/analytics/predictions`, {
        metricId,
        ...options,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao prever tendências:', error);
      throw new Error('Falha na previsão de tendências');
    }
  }

  public async analyzeCorrelations(
    metricIds: string[],
    options?: {
      method?: 'pearson' | 'spearman' | 'kendall';
      threshold?: number;
    }
  ): Promise<
    Array<{
      metric1: string;
      metric2: string;
      correlation: number;
      pValue: number;
      significance: 'low' | 'medium' | 'high';
    }>
  > {
    try {
      const response = await api.post(`${this.baseUrl}/analytics/correlations`, {
        metricIds,
        ...options,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao analisar correlações:', error);
      throw new Error('Falha na análise de correlações');
    }
  }

  // Real-time Analytics
  public async subscribeToMetric(
    metricId: string,
    callback: (value: number) => void
  ): Promise<() => void> {
    try {
      // Implementar WebSocket ou Server-Sent Events
      const eventSource = new EventSource(`${this.baseUrl}/metrics/${metricId}/stream`);

      eventSource.onmessage = event => {
        const data = JSON.parse(event.data);
        callback(data.value);
      };

      return () => {
        eventSource.close();
      };
    } catch (error) {
      console.error('Erro ao assinar métrica:', error);
      throw new Error('Falha ao assinar métrica em tempo real');
    }
  }

  public async getRealtimeData(widgetId: string): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/realtime/widgets/${widgetId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter dados em tempo real:', error);
      throw new Error('Falha ao carregar dados em tempo real');
    }
  }

  // Utility Methods
  public async getAvailableDataSources(): Promise<
    Array<{
      id: string;
      name: string;
      type: string;
      description: string;
      schema: any;
    }>
  > {
    try {
      const response = await api.get(`${this.baseUrl}/datasources`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter fontes de dados:', error);
      throw new Error('Falha ao carregar fontes de dados');
    }
  }

  public async getMetricTemplates(): Promise<
    Array<{
      id: string;
      name: string;
      category: string;
      formula: string;
      description: string;
    }>
  > {
    try {
      const response = await api.get(`${this.baseUrl}/templates/metrics`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter templates de métricas:', error);
      throw new Error('Falha ao carregar templates');
    }
  }

  public async getReportTemplates(): Promise<
    Array<{
      id: string;
      name: string;
      category: string;
      description: string;
      parameters: ReportParameters;
    }>
  > {
    try {
      const response = await api.get(`${this.baseUrl}/templates/reports`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter templates de relatórios:', error);
      throw new Error('Falha ao carregar templates');
    }
  }

  // Data Processing
  private processReportData(rawData: any): ReportData {
    // Implementar processamento de dados para relatórios
    return {
      sections: [],
      summary: {
        totalRecords: 0,
        dateRange: {
          start: new Date(),
          end: new Date(),
        },
        keyMetrics: [],
        trends: [],
        alerts: [],
      },
      insights: [],
      recommendations: [],
    };
  }

  private generateVisualization(data: any[], type: string, config: any): ReportVisualization {
    // Implementar geração de visualizações
    return {
      id: crypto.randomUUID(),
      type: type as any,
      title: 'Visualização',
      data,
      config,
      insights: [],
    };
  }

  private calculateKeyMetrics(data: any[]): KeyMetric[] {
    // Implementar cálculo de métricas-chave
    return [];
  }

  private generateRecommendations(data: any): ReportRecommendation[] {
    // Implementar geração de recomendações baseadas em IA
    return [];
  }
}

// Export both class and singleton instance
export { AdvancedAnalyticsService as AnalyticsAdvancedService };
export const analyticsAdvancedService = AdvancedAnalyticsService.getInstance();
