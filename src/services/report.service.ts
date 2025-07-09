import { prisma } from '@/lib/prisma';
import puppeteer from 'puppeteer';
import { compile } from '@fileforge/react-print';
import React from 'react';

export enum ReportType {
  // Relatórios Financeiros
  FINANCIAL_SUMMARY = 'FINANCIAL_SUMMARY',
  TRANSACTION_HISTORY = 'TRANSACTION_HISTORY',
  PORTFOLIO_ANALYSIS = 'PORTFOLIO_ANALYSIS',

  // Relatórios Tributários
  TAX_CREDITS_REPORT = 'TAX_CREDITS_REPORT',
  TAX_DEBITS_REPORT = 'TAX_DEBITS_REPORT',
  COMPENSATION_REPORT = 'COMPENSATION_REPORT',

  // Relatórios de Compliance
  AUDIT_TRAIL = 'AUDIT_TRAIL',
  COMPLIANCE_CERTIFICATE = 'COMPLIANCE_CERTIFICATE',

  // Relatórios de Marketplace
  MARKETPLACE_ACTIVITY = 'MARKETPLACE_ACTIVITY',
  TRADING_PERFORMANCE = 'TRADING_PERFORMANCE',

  // Relatórios Customizados
  CUSTOM = 'CUSTOM',
}

export interface ReportOptions {
  type: ReportType;
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  entityId?: string;
  format?: 'pdf' | 'excel' | 'csv';
  includeCharts?: boolean;
  includeDetails?: boolean;
  language?: 'pt-BR' | 'en-US';
}

interface ReportData {
  title: string;
  subtitle?: string;
  generatedAt: Date;
  period?: { start: Date; end: Date };
  user?: any;
  data: any;
  summary?: any;
  charts?: any[];
}

class ReportService {
  private static instance: ReportService;

  private constructor() {}

  public static getInstance(): ReportService {
    if (!ReportService.instance) {
      ReportService.instance = new ReportService();
    }
    return ReportService.instance;
  }

  /**
   * Gera relatório baseado nas opções
   */
  async generateReport(options: ReportOptions): Promise<Buffer> {
    try {
      // Buscar dados baseado no tipo de relatório
      const reportData = await this.fetchReportData(options);

      // Gerar HTML do relatório
      const html = await this.generateReportHTML(reportData, options);

      // Converter para PDF
      if (options.format === 'pdf' || !options.format) {
        return await this.generatePDF(html);
      } else if (options.format === 'excel') {
        return await this.generateExcel(reportData);
      } else {
        return await this.generateCSV(reportData);
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      throw new Error('Falha ao gerar relatório');
    }
  }

  /**
   * Busca dados específicos para cada tipo de relatório
   */
  private async fetchReportData(options: ReportOptions): Promise<ReportData> {
    switch (options.type) {
      case ReportType.FINANCIAL_SUMMARY:
        return await this.fetchFinancialSummaryData(options);

      case ReportType.TRANSACTION_HISTORY:
        return await this.fetchTransactionHistoryData(options);

      case ReportType.TAX_CREDITS_REPORT:
        return await this.fetchTaxCreditsData(options);

      case ReportType.COMPENSATION_REPORT:
        return await this.fetchCompensationData(options);

      case ReportType.AUDIT_TRAIL:
        return await this.fetchAuditTrailData(options);

      case ReportType.MARKETPLACE_ACTIVITY:
        return await this.fetchMarketplaceActivityData(options);

      default:
        throw new Error(`Tipo de relatório não suportado: ${options.type}`);
    }
  }

  /**
   * Busca dados de resumo financeiro
   */
  private async fetchFinancialSummaryData(options: ReportOptions): Promise<ReportData> {
    const where: any = {};

    if (options.userId) {
      where.OR = [{ ownerId: options.userId }, { issuerId: options.userId }];
    }

    if (options.startDate || options.endDate) {
      where.createdAt = {};
      if (options.startDate) where.createdAt.gte = options.startDate;
      if (options.endDate) where.createdAt.lte = options.endDate;
    }

    const [credits, transactions, totalValue] = await Promise.all([
      prisma.creditTitle.findMany({
        where,
        include: {
          owner: true,
          issuer: true,
        },
      }),
      prisma.transaction.findMany({
        where: {
          AND: [where, { status: 'COMPLETED' }],
        },
        include: {
          creditTitle: true,
          seller: true,
          buyer: true,
        },
      }),
      prisma.creditTitle.aggregate({
        where,
        _sum: {
          valueCurrent: true,
        },
      }),
    ]);

    return {
      title: 'Resumo Financeiro',
      subtitle: 'Análise completa do portfólio',
      generatedAt: new Date(),
      period:
        options.startDate && options.endDate
          ? { start: options.startDate, end: options.endDate }
          : undefined,
      data: {
        credits,
        transactions,
        totalCredits: credits.length,
        totalTransactions: transactions.length,
        totalValue: totalValue._sum.valueCurrent || 0,
      },
      summary: {
        byCategory: this.groupByCategory(credits),
        byStatus: this.groupByStatus(credits),
        monthlyEvolution: await this.calculateMonthlyEvolution(credits, transactions),
      },
    };
  }

  /**
   * Busca histórico de transações
   */
  private async fetchTransactionHistoryData(options: ReportOptions): Promise<ReportData> {
    const where: any = {};

    if (options.userId) {
      where.OR = [{ sellerId: options.userId }, { buyerId: options.userId }];
    }

    if (options.startDate || options.endDate) {
      where.createdAt = {};
      if (options.startDate) where.createdAt.gte = options.startDate;
      if (options.endDate) where.createdAt.lte = options.endDate;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        creditTitle: true,
        seller: { select: { name: true, email: true } },
        buyer: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      title: 'Histórico de Transações',
      generatedAt: new Date(),
      period:
        options.startDate && options.endDate
          ? { start: options.startDate, end: options.endDate }
          : undefined,
      data: {
        transactions,
        total: transactions.length,
        totalVolume: transactions.reduce((sum, t) => sum + t.price, 0),
      },
    };
  }

  /**
   * Busca dados de créditos tributários
   */
  private async fetchTaxCreditsData(options: ReportOptions): Promise<ReportData> {
    const where: any = { category: 'TRIBUTARIO' };

    if (options.userId) {
      where.ownerId = options.userId;
    }

    const credits = await prisma.creditTitle.findMany({
      where,
      include: {
        owner: true,
        detailsTributario: true,
      },
    });

    return {
      title: 'Relatório de Créditos Tributários',
      generatedAt: new Date(),
      data: {
        credits,
        total: credits.length,
        totalValue: credits.reduce((sum, c) => sum + c.valueCurrent, 0),
        byType: this.groupTaxCreditsByType(credits),
      },
    };
  }

  /**
   * Busca dados de compensação
   */
  private async fetchCompensationData(options: ReportOptions): Promise<ReportData> {
    // Implementar busca de dados de compensação
    return {
      title: 'Relatório de Compensações',
      generatedAt: new Date(),
      data: {
        compensations: [],
        total: 0,
        totalValue: 0,
      },
    };
  }

  /**
   * Busca trilha de auditoria
   */
  private async fetchAuditTrailData(options: ReportOptions): Promise<ReportData> {
    const where: any = {};

    if (options.userId) where.userId = options.userId;
    if (options.entityId) where.entityId = options.entityId;

    if (options.startDate || options.endDate) {
      where.createdAt = {};
      if (options.startDate) where.createdAt.gte = options.startDate;
      if (options.endDate) where.createdAt.lte = options.endDate;
    }

    const auditLogs = await prisma.auditLog.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 1000, // Limitar para evitar relatórios muito grandes
    });

    return {
      title: 'Trilha de Auditoria',
      subtitle: 'Registro completo de atividades',
      generatedAt: new Date(),
      period:
        options.startDate && options.endDate
          ? { start: options.startDate, end: options.endDate }
          : undefined,
      data: {
        logs: auditLogs.map(log => ({
          ...log,
          details: JSON.parse(log.details),
        })),
        total: auditLogs.length,
      },
    };
  }

  /**
   * Busca atividade do marketplace
   */
  private async fetchMarketplaceActivityData(options: ReportOptions): Promise<ReportData> {
    const where: any = {};

    if (options.userId) {
      where.sellerId = options.userId;
    }

    const [offers, bids] = await Promise.all([
      prisma.offer.findMany({
        where,
        include: {
          creditTitle: true,
          seller: true,
          bids: true,
        },
      }),
      prisma.bid.findMany({
        where: options.userId ? { bidderId: options.userId } : undefined,
        include: {
          offer: {
            include: {
              creditTitle: true,
            },
          },
          bidder: true,
        },
      }),
    ]);

    return {
      title: 'Atividade do Marketplace',
      generatedAt: new Date(),
      data: {
        offers,
        bids,
        totalOffers: offers.length,
        totalBids: bids.length,
        activeOffers: offers.filter(o => o.status === 'ACTIVE').length,
      },
    };
  }

  /**
   * Gera HTML do relatório
   */
  private async generateReportHTML(data: ReportData, options: ReportOptions): Promise<string> {
    const logoBase64 = await this.getLogoBase64();

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${data.title}</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { height: 50px; margin-bottom: 10px; }
            h1 { color: #1f2937; margin: 0; }
            h2 { color: #374151; margin-top: 30px; }
            .subtitle { color: #6b7280; font-size: 14px; }
            .info { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            th { background: #f9fafb; font-weight: 600; }
            .summary { display: flex; gap: 20px; margin: 20px 0; }
            .summary-card { flex: 1; background: #eff6ff; padding: 20px; border-radius: 8px; }
            .summary-value { font-size: 24px; font-weight: bold; color: #3b82f6; }
            .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
            .page-break { page-break-after: always; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${logoBase64}" alt="Tributa.AI" class="logo" />
            <h1>${data.title}</h1>
            ${data.subtitle ? `<p class="subtitle">${data.subtitle}</p>` : ''}
          </div>
          
          <div class="info">
            <p><strong>Data de Geração:</strong> ${new Date(data.generatedAt).toLocaleString('pt-BR')}</p>
            ${
              data.period
                ? `
              <p><strong>Período:</strong> ${new Date(data.period.start).toLocaleDateString('pt-BR')} a ${new Date(data.period.end).toLocaleDateString('pt-BR')}</p>
            `
                : ''
            }
          </div>
          
          ${this.generateReportContent(data, options)}
          
          <div class="footer">
            <p>Tributa.AI - Plataforma de Tokenização de Créditos Tributários</p>
            <p>Este relatório foi gerado automaticamente e tem caráter informativo.</p>
            <p>© ${new Date().getFullYear()} Tributa.AI. Todos os direitos reservados.</p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Gera conteúdo específico baseado no tipo de relatório
   */
  private generateReportContent(data: ReportData, options: ReportOptions): string {
    switch (options.type) {
      case ReportType.FINANCIAL_SUMMARY:
        return this.generateFinancialSummaryContent(data);

      case ReportType.TRANSACTION_HISTORY:
        return this.generateTransactionHistoryContent(data);

      case ReportType.TAX_CREDITS_REPORT:
        return this.generateTaxCreditsContent(data);

      case ReportType.AUDIT_TRAIL:
        return this.generateAuditTrailContent(data);

      case ReportType.MARKETPLACE_ACTIVITY:
        return this.generateMarketplaceContent(data);

      default:
        return '<p>Conteúdo do relatório não disponível.</p>';
    }
  }

  /**
   * Gera conteúdo do resumo financeiro
   */
  private generateFinancialSummaryContent(data: ReportData): string {
    const { credits, transactions, totalValue, totalCredits, totalTransactions } = data.data;

    return `
      <div class="summary">
        <div class="summary-card">
          <p>Total de Créditos</p>
          <p class="summary-value">${totalCredits}</p>
        </div>
        <div class="summary-card">
          <p>Valor Total</p>
          <p class="summary-value">R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div class="summary-card">
          <p>Transações</p>
          <p class="summary-value">${totalTransactions}</p>
        </div>
      </div>
      
      <h2>Créditos por Categoria</h2>
      <table>
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Quantidade</th>
            <th>Valor Total</th>
            <th>% do Portfolio</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(data.summary.byCategory)
            .map(
              ([category, info]: any) => `
            <tr>
              <td>${category}</td>
              <td>${info.count}</td>
              <td>R$ ${info.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td>${((info.value / totalValue) * 100).toFixed(1)}%</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
      
      <h2>Últimas Transações</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>Crédito</th>
            <th>Valor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${transactions
            .slice(0, 10)
            .map(
              (t: any) => `
            <tr>
              <td>${new Date(t.createdAt).toLocaleDateString('pt-BR')}</td>
              <td>${t.type}</td>
              <td>${t.creditTitle.category}</td>
              <td>R$ ${t.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td>${t.status}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;
  }

  /**
   * Gera conteúdo do histórico de transações
   */
  private generateTransactionHistoryContent(data: ReportData): string {
    const { transactions, total, totalVolume } = data.data;

    return `
      <div class="info">
        <p><strong>Total de Transações:</strong> ${total}</p>
        <p><strong>Volume Total:</strong> R$ ${totalVolume.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>Vendedor</th>
            <th>Comprador</th>
            <th>Crédito</th>
            <th>Valor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${transactions
            .map(
              (t: any) => `
            <tr>
              <td>${new Date(t.createdAt).toLocaleString('pt-BR')}</td>
              <td>${t.type}</td>
              <td>${t.seller.name}</td>
              <td>${t.buyer.name}</td>
              <td>${t.creditTitle.category}</td>
              <td>R$ ${t.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td>${t.status}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;
  }

  /**
   * Gera conteúdo de créditos tributários
   */
  private generateTaxCreditsContent(data: ReportData): string {
    const { credits, total, totalValue } = data.data;

    return `
      <div class="info">
        <p><strong>Total de Créditos Tributários:</strong> ${total}</p>
        <p><strong>Valor Total:</strong> R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Emissão</th>
            <th>Vencimento</th>
            <th>Tipo</th>
            <th>Tributo</th>
            <th>Valor Nominal</th>
            <th>Valor Atual</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${credits
            .map(
              (c: any) => `
            <tr>
              <td>${new Date(c.issueDate).toLocaleDateString('pt-BR')}</td>
              <td>${c.expiryDate ? new Date(c.expiryDate).toLocaleDateString('pt-BR') : '-'}</td>
              <td>${c.detailsTributario?.esfera || '-'}</td>
              <td>${c.detailsTributario?.nomeTributo || '-'}</td>
              <td>R$ ${c.valueNominal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td>R$ ${c.valueCurrent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td>${c.status}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;
  }

  /**
   * Gera conteúdo da trilha de auditoria
   */
  private generateAuditTrailContent(data: ReportData): string {
    const { logs, total } = data.data;

    return `
      <div class="info">
        <p><strong>Total de Registros:</strong> ${total}</p>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Data/Hora</th>
            <th>Usuário</th>
            <th>Ação</th>
            <th>Entidade</th>
            <th>Detalhes</th>
          </tr>
        </thead>
        <tbody>
          ${logs
            .map(
              (log: any) => `
            <tr>
              <td>${new Date(log.createdAt).toLocaleString('pt-BR')}</td>
              <td>${log.user?.name || log.userId}</td>
              <td>${log.action || log.eventType}</td>
              <td>${log.entityType}</td>
              <td>${JSON.stringify(log.details).substring(0, 100)}...</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;
  }

  /**
   * Gera conteúdo do marketplace
   */
  private generateMarketplaceContent(data: ReportData): string {
    const { offers, bids, totalOffers, totalBids, activeOffers } = data.data;

    return `
      <div class="summary">
        <div class="summary-card">
          <p>Ofertas Totais</p>
          <p class="summary-value">${totalOffers}</p>
        </div>
        <div class="summary-card">
          <p>Ofertas Ativas</p>
          <p class="summary-value">${activeOffers}</p>
        </div>
        <div class="summary-card">
          <p>Propostas</p>
          <p class="summary-value">${totalBids}</p>
        </div>
      </div>
      
      <h2>Ofertas Ativas</h2>
      <table>
        <thead>
          <tr>
            <th>Crédito</th>
            <th>Tipo</th>
            <th>Preço</th>
            <th>Propostas</th>
            <th>Expira em</th>
          </tr>
        </thead>
        <tbody>
          ${offers
            .filter((o: any) => o.status === 'ACTIVE')
            .map(
              (offer: any) => `
            <tr>
              <td>${offer.creditTitle.category}</td>
              <td>${offer.offerType}</td>
              <td>R$ ${offer.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td>${offer.bids.length}</td>
              <td>${offer.expiryDate ? new Date(offer.expiryDate).toLocaleDateString('pt-BR') : '-'}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;
  }

  /**
   * Gera PDF usando Puppeteer
   */
  private async generatePDF(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm',
        },
      });

      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  /**
   * Gera Excel (placeholder - implementar com exceljs)
   */
  private async generateExcel(data: ReportData): Promise<Buffer> {
    // TODO: Implementar geração de Excel com exceljs
    throw new Error('Geração de Excel ainda não implementada');
  }

  /**
   * Gera CSV
   */
  private async generateCSV(data: ReportData): Promise<Buffer> {
    // Implementação básica de CSV
    let csv = '';

    // Adicionar cabeçalho
    csv += `"${data.title}"\n`;
    csv += `"Gerado em: ${new Date(data.generatedAt).toLocaleString('pt-BR')}"\n\n`;

    // Adicionar dados baseado no tipo
    if (data.data.transactions) {
      csv += '"Data","Tipo","Valor","Status"\n';
      data.data.transactions.forEach((t: any) => {
        csv += `"${new Date(t.createdAt).toLocaleDateString('pt-BR')}","${t.type}","${t.price}","${t.status}"\n`;
      });
    }

    return Buffer.from(csv, 'utf-8');
  }

  /**
   * Obtém logo em base64
   */
  private async getLogoBase64(): Promise<string> {
    // Placeholder - retornar logo real em base64
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMjAwIDUwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzNiODJmNiI+VHJpYnV0YS5BSTwvdGV4dD48L3N2Zz4=';
  }

  /**
   * Agrupa créditos por categoria
   */
  private groupByCategory(credits: any[]): Record<string, any> {
    return credits.reduce((acc, credit) => {
      if (!acc[credit.category]) {
        acc[credit.category] = { count: 0, value: 0 };
      }
      acc[credit.category].count++;
      acc[credit.category].value += credit.valueCurrent;
      return acc;
    }, {});
  }

  /**
   * Agrupa créditos por status
   */
  private groupByStatus(credits: any[]): Record<string, number> {
    return credits.reduce((acc, credit) => {
      acc[credit.status] = (acc[credit.status] || 0) + 1;
      return acc;
    }, {});
  }

  /**
   * Agrupa créditos tributários por tipo
   */
  private groupTaxCreditsByType(credits: any[]): Record<string, any> {
    return credits.reduce((acc, credit) => {
      const type = credit.detailsTributario?.nomeTributo || 'Outros';
      if (!acc[type]) {
        acc[type] = { count: 0, value: 0 };
      }
      acc[type].count++;
      acc[type].value += credit.valueCurrent;
      return acc;
    }, {});
  }

  /**
   * Calcula evolução mensal
   */
  private async calculateMonthlyEvolution(credits: any[], transactions: any[]): Promise<any[]> {
    // Implementação simplificada
    const months: any[] = [];
    const currentDate = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const month = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });

      const monthCredits = credits.filter(c => {
        const creditDate = new Date(c.createdAt);
        return (
          creditDate.getMonth() === date.getMonth() &&
          creditDate.getFullYear() === date.getFullYear()
        );
      });

      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.createdAt);
        return (
          transactionDate.getMonth() === date.getMonth() &&
          transactionDate.getFullYear() === date.getFullYear()
        );
      });

      months.push({
        month,
        credits: monthCredits.length,
        transactions: monthTransactions.length,
        volume: monthTransactions.reduce((sum, t) => sum + t.price, 0),
      });
    }

    return months;
  }
}

// Exportar instância singleton
export const reportService = ReportService.getInstance();

// Helpers para relatórios comuns
export const reportHelpers = {
  /**
   * Gera relatório mensal padrão
   */
  async generateMonthlyReport(userId: string, month?: Date): Promise<Buffer> {
    const date = month || new Date();
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return reportService.generateReport({
      type: ReportType.FINANCIAL_SUMMARY,
      userId,
      startDate,
      endDate,
      includeCharts: true,
      includeDetails: true,
    });
  },

  /**
   * Gera certificado de compliance
   */
  async generateComplianceCertificate(userId: string, year?: number): Promise<Buffer> {
    const currentYear = year || new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);

    return reportService.generateReport({
      type: ReportType.COMPLIANCE_CERTIFICATE,
      userId,
      startDate,
      endDate,
    });
  },

  /**
   * Gera extrato de transações
   */
  async generateTransactionStatement(userId: string, days: number = 30): Promise<Buffer> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return reportService.generateReport({
      type: ReportType.TRANSACTION_HISTORY,
      userId,
      startDate,
      endDate,
      format: 'pdf',
    });
  },
};
