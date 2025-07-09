import jsPDF from 'jspdf';
import 'jspdf-autotable';

export interface ReportConfig {
  id: string;
  title: string;
  subtitle?: string;
  type: 'ANALYSIS' | 'FINANCIAL' | 'OPERATIONAL' | 'COMPLIANCE' | 'CUSTOM';
  format: 'PDF' | 'EXCEL' | 'CSV' | 'JSON';
  template: ReportTemplate;
  data: any;
  filters?: Record<string, any>;
  metadata?: {
    company?: string;
    cnpj?: string;
    period?: string;
    author?: string;
    department?: string;
  };
}

export interface ReportTemplate {
  sections: ReportSection[];
  styling?: {
    primaryColor?: string;
    secondaryColor?: string;
    logoUrl?: string;
    fontFamily?: string;
  };
  settings?: {
    includeHeader?: boolean;
    includeFooter?: boolean;
    includeCharts?: boolean;
    includeWatermark?: boolean;
    pageNumbers?: boolean;
  };
}

export interface ReportSection {
  id: string;
  title: string;
  type: 'TEXT' | 'TABLE' | 'CHART' | 'SUMMARY' | 'LIST' | 'METRICS' | 'CUSTOM';
  content: any;
  styling?: {
    fontSize?: number;
    textAlign?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    borderColor?: string;
  };
  visible?: boolean;
  pageBreakBefore?: boolean;
}

export interface ReportMetrics {
  key: string;
  label: string;
  value: number | string;
  format: 'CURRENCY' | 'PERCENTAGE' | 'NUMBER' | 'TEXT';
  comparison?: {
    previous: number | string;
    change: number;
    trend: 'UP' | 'DOWN' | 'STABLE';
  };
}

export interface ReportSchedule {
  id: string;
  reportConfigId: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  recipients: string[];
  nextRun: Date;
  lastRun?: Date;
  enabled: boolean;
}

class UniversalReportService {
  private templates: Map<string, ReportTemplate> = new Map();
  private schedules: Map<string, ReportSchedule> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
    this.loadSchedules();
  }

  // Gerar relatório baseado na configuração
  async generateReport(config: ReportConfig): Promise<Blob> {
    switch (config.format) {
      case 'PDF':
        return this.generatePDF(config);
      case 'EXCEL':
        return this.generateExcel(config);
      case 'CSV':
        return this.generateCSV(config);
      case 'JSON':
        return this.generateJSON(config);
      default:
        throw new Error(`Formato ${config.format} não suportado`);
    }
  }

  // Gerar PDF
  private async generatePDF(config: ReportConfig): Promise<Blob> {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    let yPosition = 20;
    const lineHeight = 6;
    const sectionSpacing = 10;

    // Header
    if (config.template.settings?.includeHeader !== false) {
      yPosition = this.addPDFHeader(pdf, config, yPosition);
    }

    // Sections
    for (const section of config.template.sections) {
      if (section.visible === false) continue;

      if (section.pageBreakBefore && yPosition > 30) {
        pdf.addPage();
        yPosition = 20;
      }

      // Check if we need a new page
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }

      yPosition = await this.addPDFSection(pdf, section, config.data, yPosition);
      yPosition += sectionSpacing;
    }

    // Footer
    if (config.template.settings?.includeFooter !== false) {
      this.addPDFFooter(pdf, config);
    }

    return new Blob([pdf.output('blob')], { type: 'application/pdf' });
  }

  // Adicionar header no PDF
  private addPDFHeader(pdf: any, config: ReportConfig, yPosition: number): number {
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Logo (se fornecido)
    if (config.template.styling?.logoUrl) {
      // pdf.addImage(config.template.styling.logoUrl, 'PNG', 20, yPosition, 30, 15);
    }

    // Título
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(config.title, pageWidth / 2, yPosition + 10, { align: 'center' });
    yPosition += 15;

    // Subtitle
    if (config.subtitle) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(config.subtitle, pageWidth / 2, yPosition + 5, { align: 'center' });
      yPosition += 10;
    }

    // Metadata
    if (config.metadata) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      if (config.metadata.company) {
        pdf.text(`Empresa: ${config.metadata.company}`, 20, yPosition + 5);
        yPosition += 5;
      }
      
      if (config.metadata.cnpj) {
        pdf.text(`CNPJ: ${config.metadata.cnpj}`, 20, yPosition + 5);
        yPosition += 5;
      }
      
      if (config.metadata.period) {
        pdf.text(`Período: ${config.metadata.period}`, 20, yPosition + 5);
        yPosition += 5;
      }

      pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - 20, yPosition, { align: 'right' });
      yPosition += 10;
    }

    // Linha separadora
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 10;

    return yPosition;
  }

  // Adicionar seção no PDF
  private async addPDFSection(pdf: any, section: ReportSection, data: any, yPosition: number): Promise<number> {
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Título da seção
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(section.title, 20, yPosition);
    yPosition += 10;

    // Conteúdo baseado no tipo
    switch (section.type) {
      case 'TEXT':
        yPosition = this.addPDFText(pdf, section.content, yPosition);
        break;
      case 'TABLE':
        yPosition = this.addPDFTable(pdf, section.content, yPosition);
        break;
      case 'METRICS':
        yPosition = this.addPDFMetrics(pdf, section.content, yPosition);
        break;
      case 'LIST':
        yPosition = this.addPDFList(pdf, section.content, yPosition);
        break;
      case 'SUMMARY':
        yPosition = this.addPDFSummary(pdf, section.content, yPosition);
        break;
    }

    return yPosition;
  }

  // Adicionar texto no PDF
  private addPDFText(pdf: any, content: string, yPosition: number): number {
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    const lines = pdf.splitTextToSize(content, 170);
    pdf.text(lines, 20, yPosition);
    
    return yPosition + (lines.length * 5);
  }

  // Adicionar tabela no PDF
  private addPDFTable(pdf: any, content: any, yPosition: number): number {
    if (!content.headers || !content.rows) return yPosition;

    const tableConfig = {
      startY: yPosition,
      head: [content.headers],
      body: content.rows,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [66, 139, 202] }
    };

    (pdf as any).autoTable(tableConfig);
    
    return (pdf as any).lastAutoTable.finalY + 10;
  }

  // Adicionar métricas no PDF
  private addPDFMetrics(pdf: any, metrics: ReportMetrics[], yPosition: number): number {
    const metricsPerRow = 2;
    const metricWidth = 80;
    const metricHeight = 25;
    
    pdf.setFontSize(10);
    
    for (let i = 0; i < metrics.length; i += metricsPerRow) {
      for (let j = 0; j < metricsPerRow && i + j < metrics.length; j++) {
        const metric = metrics[i + j];
        const x = 20 + (j * (metricWidth + 10));
        const y = yPosition;

        // Fundo
        pdf.setFillColor(245, 245, 245);
        pdf.rect(x, y, metricWidth, metricHeight, 'F');
        
        // Borda
        pdf.setDrawColor(200, 200, 200);
        pdf.rect(x, y, metricWidth, metricHeight);

        // Label
        pdf.setFont('helvetica', 'normal');
        pdf.text(metric.label, x + 5, y + 8);

        // Value
        pdf.setFont('helvetica', 'bold');
        const formattedValue = this.formatMetricValue(metric.value, metric.format);
        pdf.text(formattedValue, x + 5, y + 16);

        // Comparison
        if (metric.comparison) {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8);
          const changeText = `${metric.comparison.change > 0 ? '+' : ''}${metric.comparison.change}%`;
          pdf.text(changeText, x + 5, y + 22);
        }
      }
      yPosition += metricHeight + 10;
    }

    return yPosition;
  }

  // Adicionar lista no PDF
  private addPDFList(pdf: any, items: string[], yPosition: number): number {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    for (const item of items) {
      pdf.text(`• ${item}`, 25, yPosition);
      yPosition += 5;
    }

    return yPosition + 5;
  }

  // Adicionar resumo no PDF
  private addPDFSummary(pdf: any, content: any, yPosition: number): number {
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');

    if (content.highlights) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Destaques:', 20, yPosition);
      yPosition += 8;
      
      pdf.setFont('helvetica', 'normal');
      for (const highlight of content.highlights) {
        pdf.text(`• ${highlight}`, 25, yPosition);
        yPosition += 6;
      }
      yPosition += 5;
    }

    if (content.recommendations) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Recomendações:', 20, yPosition);
      yPosition += 8;
      
      pdf.setFont('helvetica', 'normal');
      for (const recommendation of content.recommendations) {
        pdf.text(`• ${recommendation}`, 25, yPosition);
        yPosition += 6;
      }
      yPosition += 5;
    }

    return yPosition;
  }

  // Adicionar footer no PDF
  private addPDFFooter(pdf: any, config: ReportConfig): void {
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Linha separadora
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);
    
    // Texto do footer
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Relatório gerado pela plataforma Tributa.AI', 20, pageHeight - 12);
    
    if (config.template.settings?.pageNumbers !== false) {
      pdf.text(`Página ${pdf.internal.getNumberOfPages()}`, pageWidth - 20, pageHeight - 12, { align: 'right' });
    }
  }

  // Gerar Excel
  private async generateExcel(config: ReportConfig): Promise<Blob> {
    // Implementação básica usando CSV para compatibilidade
    const csvContent = this.generateCSVContent(config);
    
    return new Blob([csvContent], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
  }

  // Gerar CSV
  private async generateCSV(config: ReportConfig): Promise<Blob> {
    const csvContent = this.generateCSVContent(config);
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  }

  // Gerar conteúdo CSV
  private generateCSVContent(config: ReportConfig): string {
    let csvContent = `${config.title}\n`;
    
    if (config.subtitle) {
      csvContent += `${config.subtitle}\n`;
    }
    
    csvContent += '\n';

    for (const section of config.template.sections) {
      if (section.visible === false) continue;

      csvContent += `${section.title}\n`;
      
      switch (section.type) {
        case 'TABLE':
          if (section.content.headers && section.content.rows) {
            csvContent += section.content.headers.join(',') + '\n';
            for (const row of section.content.rows) {
              csvContent += row.join(',') + '\n';
            }
          }
          break;
        case 'METRICS':
          for (const metric of section.content) {
            csvContent += `${metric.label},${this.formatMetricValue(metric.value, metric.format)}\n`;
          }
          break;
        case 'LIST':
          for (const item of section.content) {
            csvContent += `${item}\n`;
          }
          break;
      }
      
      csvContent += '\n';
    }

    return csvContent;
  }

  // Gerar JSON
  private async generateJSON(config: ReportConfig): Promise<Blob> {
    const jsonData = {
      report: {
        title: config.title,
        subtitle: config.subtitle,
        type: config.type,
        generatedAt: new Date().toISOString(),
        metadata: config.metadata
      },
      sections: config.template.sections.filter(s => s.visible !== false)
    };

    return new Blob([JSON.stringify(jsonData, null, 2)], { 
      type: 'application/json' 
    });
  }

  // Formatar valores de métricas
  private formatMetricValue(value: number | string, format: string): string {
    if (typeof value === 'string') return value;

    switch (format) {
      case 'CURRENCY':
        return `R$ ${value.toLocaleString('pt-BR')}`;
      case 'PERCENTAGE':
        return `${value}%`;
      case 'NUMBER':
        return value.toLocaleString('pt-BR');
      default:
        return value.toString();
    }
  }

  // Templates padrão
  private initializeDefaultTemplates(): void {
    // Template de análise fiscal
    this.templates.set('fiscal_analysis', {
      sections: [
        {
          id: 'executive_summary',
          title: 'Resumo Executivo',
          type: 'SUMMARY',
          content: {},
          visible: true
        },
        {
          id: 'financial_metrics',
          title: 'Métricas Financeiras',
          type: 'METRICS',
          content: [],
          visible: true
        },
        {
          id: 'credits_table',
          title: 'Créditos Identificados',
          type: 'TABLE',
          content: { headers: [], rows: [] },
          visible: true
        },
        {
          id: 'recommendations',
          title: 'Recomendações',
          type: 'LIST',
          content: [],
          visible: true
        }
      ],
      settings: {
        includeHeader: true,
        includeFooter: true,
        pageNumbers: true
      }
    });

    // Template de compensação
    this.templates.set('compensation_report', {
      sections: [
        {
          id: 'compensation_summary',
          title: 'Resumo da Compensação',
          type: 'METRICS',
          content: [],
          visible: true
        },
        {
          id: 'matching_details',
          title: 'Detalhes do Matching',
          type: 'TABLE',
          content: { headers: [], rows: [] },
          visible: true
        },
        {
          id: 'savings_analysis',
          title: 'Análise de Economia',
          type: 'TEXT',
          content: '',
          visible: true
        }
      ],
      settings: {
        includeHeader: true,
        includeFooter: true,
        pageNumbers: true
      }
    });
  }

  // Métodos públicos
  public getTemplate(templateId: string): ReportTemplate | undefined {
    return this.templates.get(templateId);
  }

  public saveTemplate(templateId: string, template: ReportTemplate): void {
    this.templates.set(templateId, template);
    this.persistTemplates();
  }

  public async scheduleReport(schedule: ReportSchedule): Promise<void> {
    this.schedules.set(schedule.id, schedule);
    await this.persistSchedules();
  }

  public getSchedules(): ReportSchedule[] {
    return Array.from(this.schedules.values());
  }

  // Relatórios específicos por domínio
  public async generateFiscalAnalysisReport(data: any): Promise<Blob> {
    const config: ReportConfig = {
      id: `fiscal_${Date.now()}`,
      title: 'Relatório de Análise Fiscal',
      subtitle: `Empresa: ${data.company || 'N/A'}`,
      type: 'ANALYSIS',
      format: 'PDF',
      template: this.getTemplate('fiscal_analysis')!,
      data,
      metadata: {
        company: data.company,
        cnpj: data.cnpj,
        period: data.period || new Date().getFullYear().toString(),
        author: 'Sistema Tributa.AI'
      }
    };

    // Processar dados específicos
    config.template.sections[1].content = this.buildFiscalMetrics(data);
    config.template.sections[2].content = this.buildCreditsTable(data);
    config.template.sections[3].content = this.buildRecommendations(data);

    return this.generateReport(config);
  }

  public async generateCompensationReport(data: any): Promise<Blob> {
    const config: ReportConfig = {
      id: `compensation_${Date.now()}`,
      title: 'Relatório de Compensação',
      subtitle: `Referência: ${data.reference || 'N/A'}`,
      type: 'FINANCIAL',
      format: 'PDF',
      template: this.getTemplate('compensation_report')!,
      data,
      metadata: {
        author: 'Sistema Tributa.AI'
      }
    };

    return this.generateReport(config);
  }

  // Builders para dados específicos
  private buildFiscalMetrics(data: any): ReportMetrics[] {
    return [
      {
        key: 'total_credits',
        label: 'Total de Créditos',
        value: data.totalCredits || 0,
        format: 'CURRENCY'
      },
      {
        key: 'total_debts',
        label: 'Total de Débitos',
        value: data.totalDebts || 0,
        format: 'CURRENCY'
      },
      {
        key: 'recovery_potential',
        label: 'Potencial de Recuperação',
        value: data.recoveryPotential || 0,
        format: 'CURRENCY'
      },
      {
        key: 'success_rate',
        label: 'Taxa de Sucesso',
        value: data.successRate || 0,
        format: 'PERCENTAGE'
      }
    ];
  }

  private buildCreditsTable(data: any): any {
    if (!data.credits || !Array.isArray(data.credits)) {
      return { headers: [], rows: [] };
    }

    return {
      headers: ['Tipo', 'Descrição', 'Valor', 'Status'],
      rows: data.credits.map((credit: any) => [
        credit.type || 'N/A',
        credit.description || 'N/A',
        this.formatMetricValue(credit.value || 0, 'CURRENCY'),
        credit.status || 'N/A'
      ])
    };
  }

  private buildRecommendations(data: any): string[] {
    const recommendations = [];
    
    if (data.totalCredits > 100000) {
      recommendations.push('Considerar tokenização dos créditos de maior valor');
    }
    
    if (data.totalDebts > data.totalCredits) {
      recommendations.push('Priorizar identificação de novos créditos');
    }
    
    if (data.compensationOpportunities > 0) {
      recommendations.push('Executar compensações disponíveis para economia de juros');
    }

    recommendations.push('Manter monitoramento contínuo de novas oportunidades');
    
    return recommendations;
  }

  // Persistência
  private persistTemplates(): void {
    try {
      const templates = Array.from(this.templates.entries());
      localStorage.setItem('report_templates', JSON.stringify(templates));
    } catch (error) {
      console.error('Erro ao persistir templates:', error);
    }
  }

  private async persistSchedules(): Promise<void> {
    try {
      const schedules = Array.from(this.schedules.values());
      localStorage.setItem('report_schedules', JSON.stringify(schedules));
    } catch (error) {
      console.error('Erro ao persistir agendamentos:', error);
    }
  }

  private loadSchedules(): void {
    try {
      const saved = localStorage.getItem('report_schedules');
      if (saved) {
        const schedules = JSON.parse(saved);
        schedules.forEach((schedule: ReportSchedule) => {
          schedule.nextRun = new Date(schedule.nextRun);
          if (schedule.lastRun) {
            schedule.lastRun = new Date(schedule.lastRun);
          }
          this.schedules.set(schedule.id, schedule);
        });
      }
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    }
  }
}

export const universalReportService = new UniversalReportService();