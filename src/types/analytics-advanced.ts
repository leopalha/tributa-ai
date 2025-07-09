// Advanced Analytics Types for Tributa.AI Platform

export interface AnalyticsReport {
  id: string;
  name: string;
  type: ReportType;
  category: ReportCategory;
  description: string;
  parameters: ReportParameters;
  schedule?: ReportSchedule;
  status: ReportStatus;
  createdBy: string;
  createdAt: Date;
  lastGenerated?: Date;
  nextGeneration?: Date;
  retention: number; // days
  tags: string[];
  permissions: ReportPermissions;
}

export enum ReportType {
  DASHBOARD = 'DASHBOARD',
  DETAILED = 'DETAILED',
  SUMMARY = 'SUMMARY',
  TREND = 'TREND',
  COMPARATIVE = 'COMPARATIVE',
  REGULATORY = 'REGULATORY',
  CUSTOM = 'CUSTOM',
}

export enum ReportCategory {
  MARKETPLACE = 'MARKETPLACE',
  PORTFOLIO = 'PORTFOLIO',
  FISCAL = 'FISCAL',
  RISK = 'RISK',
  COMPLIANCE = 'COMPLIANCE',
  PERFORMANCE = 'PERFORMANCE',
  OPERATIONAL = 'OPERATIONAL',
  FINANCIAL = 'FINANCIAL',
}

export interface ReportParameters {
  dateRange: {
    start: Date;
    end: Date;
    period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  };
  filters: {
    entities?: string[];
    categories?: string[];
    statuses?: string[];
    values?: {
      min?: number;
      max?: number;
    };
    custom?: Record<string, any>;
  };
  metrics: string[];
  dimensions: string[];
  aggregations: AggregationType[];
  visualizations: VisualizationType[];
  format: ReportFormat;
  language: 'pt-BR' | 'en-US';
}

export enum AggregationType {
  SUM = 'SUM',
  AVERAGE = 'AVERAGE',
  COUNT = 'COUNT',
  MAX = 'MAX',
  MIN = 'MIN',
  MEDIAN = 'MEDIAN',
  PERCENTILE = 'PERCENTILE',
  GROWTH_RATE = 'GROWTH_RATE',
  VARIANCE = 'VARIANCE',
}

export enum VisualizationType {
  TABLE = 'TABLE',
  LINE_CHART = 'LINE_CHART',
  BAR_CHART = 'BAR_CHART',
  PIE_CHART = 'PIE_CHART',
  AREA_CHART = 'AREA_CHART',
  SCATTER_PLOT = 'SCATTER_PLOT',
  HEATMAP = 'HEATMAP',
  TREEMAP = 'TREEMAP',
  GAUGE = 'GAUGE',
  KPI_CARD = 'KPI_CARD',
}

export enum ReportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
  JSON = 'JSON',
  HTML = 'HTML',
  POWERPOINT = 'POWERPOINT',
}

export interface ReportSchedule {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  time: string; // HH:mm format
  timezone: string;
  weekday?: number; // 1-7 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  recipients: string[];
  webhookUrl?: string;
}

export enum ReportStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  ARCHIVED = 'ARCHIVED',
}

export interface ReportPermissions {
  viewers: string[];
  editors: string[];
  administrators: string[];
  public: boolean;
  shareableLink?: string;
  expiresAt?: Date;
}

export interface ReportResult {
  id: string;
  reportId: string;
  generatedAt: Date;
  generatedBy: string;
  parameters: ReportParameters;
  data: ReportData;
  metadata: ReportMetadata;
  files: ReportFile[];
  status: 'success' | 'partial' | 'failed';
  errors?: ReportError[];
  executionTime: number; // milliseconds
}

export interface ReportData {
  sections: ReportSection[];
  summary: ReportSummary;
  insights: ReportInsight[];
  recommendations: ReportRecommendation[];
}

export interface ReportSection {
  id: string;
  title: string;
  description?: string;
  order: number;
  visualizations: ReportVisualization[];
  tables: ReportTable[];
  text?: string;
}

export interface ReportVisualization {
  id: string;
  type: VisualizationType;
  title: string;
  data: any[];
  config: VisualizationConfig;
  insights?: string[];
}

export interface VisualizationConfig {
  width?: number;
  height?: number;
  colors?: string[];
  axes?: {
    x?: AxisConfig;
    y?: AxisConfig;
  };
  legend?: LegendConfig;
  tooltip?: TooltipConfig;
  animation?: boolean;
  responsive?: boolean;
  customOptions?: Record<string, any>;
}

export interface AxisConfig {
  label?: string;
  format?: string;
  scale?: 'linear' | 'log' | 'time';
  min?: number;
  max?: number;
}

export interface LegendConfig {
  show: boolean;
  position: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
}

export interface TooltipConfig {
  show: boolean;
  format?: string;
  customFormatter?: string;
}

export interface ReportTable {
  id: string;
  title: string;
  headers: string[];
  rows: any[][];
  formatting?: TableFormatting;
  pagination?: boolean;
  sortable?: boolean;
  filterable?: boolean;
}

export interface TableFormatting {
  headerStyle?: CellStyle;
  rowStyle?: CellStyle;
  alternateRowStyle?: CellStyle;
  columnStyles?: Record<string, CellStyle>;
}

export interface CellStyle {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
  format?: string; // currency, percentage, etc.
}

export interface ReportSummary {
  totalRecords: number;
  dateRange: {
    start: Date;
    end: Date;
  };
  keyMetrics: KeyMetric[];
  trends: TrendSummary[];
  alerts: AlertSummary[];
}

export interface KeyMetric {
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
  unit: string;
  format: string;
  trend: 'up' | 'down' | 'stable';
  significance: 'high' | 'medium' | 'low';
}

export interface TrendSummary {
  metric: string;
  direction: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  strength: number; // 0-1
  confidence: number; // 0-1
  description: string;
}

export interface AlertSummary {
  type: 'warning' | 'error' | 'info';
  message: string;
  metric?: string;
  threshold?: number;
  currentValue?: number;
  recommendations?: string[];
}

export interface ReportInsight {
  id: string;
  type: 'pattern' | 'anomaly' | 'correlation' | 'prediction' | 'optimization';
  title: string;
  description: string;
  confidence: number; // 0-1
  impact: 'high' | 'medium' | 'low';
  data: any;
  visualizations?: string[]; // IDs of related visualizations
}

export interface ReportRecommendation {
  id: string;
  category: 'performance' | 'risk' | 'opportunity' | 'compliance' | 'efficiency';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  rationale: string;
  expectedImpact: string;
  effort: 'low' | 'medium' | 'high';
  timeline: string;
  metrics: string[];
  actions: RecommendedAction[];
}

export interface RecommendedAction {
  id: string;
  title: string;
  description: string;
  type: 'immediate' | 'short_term' | 'long_term';
  responsible?: string;
  deadline?: Date;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

export interface ReportMetadata {
  generationTime: number;
  dataPoints: number;
  dataQuality: {
    completeness: number; // 0-1
    accuracy: number; // 0-1
    freshness: number; // hours since last update
  };
  systemInfo: {
    version: string;
    environment: string;
    generatedBy: string;
  };
  dependencies: string[];
  cacheHit: boolean;
}

export interface ReportFile {
  id: string;
  name: string;
  format: ReportFormat;
  size: number;
  url: string;
  downloadUrl: string;
  expiresAt: Date;
  checksum: string;
}

export interface ReportError {
  code: string;
  message: string;
  severity: 'warning' | 'error' | 'critical';
  section?: string;
  details?: any;
  resolution?: string;
}

export interface AnalyticsDashboard {
  id: string;
  name: string;
  description?: string;
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  filters: DashboardFilter[];
  permissions: ReportPermissions;
  refreshInterval?: number; // seconds
  autoRefresh: boolean;
  lastUpdated: Date;
}

export interface DashboardLayout {
  columns: number;
  rows: number;
  responsive: boolean;
  theme: 'light' | 'dark' | 'auto';
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'table' | 'kpi' | 'text' | 'iframe';
  title: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  config: WidgetConfig;
  dataSource: DataSourceConfig;
  refreshInterval?: number;
}

export interface WidgetConfig {
  visualization?: VisualizationConfig;
  table?: TableFormatting;
  kpi?: KPIConfig;
  text?: TextConfig;
  iframe?: IFrameConfig;
}

export interface KPIConfig {
  metric: string;
  format: string;
  showTrend: boolean;
  showComparison: boolean;
  thresholds?: {
    warning: number;
    critical: number;
  };
  colors?: {
    normal: string;
    warning: string;
    critical: string;
  };
}

export interface TextConfig {
  content: string;
  format: 'plain' | 'markdown' | 'html';
  fontSize?: number;
  textAlign?: 'left' | 'center' | 'right';
}

export interface IFrameConfig {
  url: string;
  height: number;
  sandbox?: boolean;
}

export interface DataSourceConfig {
  type: 'api' | 'database' | 'file' | 'realtime';
  connection: string;
  query: string;
  parameters?: Record<string, any>;
  cache?: {
    enabled: boolean;
    ttl: number; // seconds
  };
  transformation?: DataTransformation[];
}

export interface DataTransformation {
  type: 'filter' | 'aggregate' | 'sort' | 'join' | 'calculate';
  config: any;
}

export interface DashboardFilter {
  id: string;
  name: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'text';
  options?: FilterOption[];
  defaultValue?: any;
  required: boolean;
  applies: string[]; // widget IDs
}

export interface FilterOption {
  label: string;
  value: any;
  group?: string;
}

export interface AnalyticsQuery {
  id: string;
  name: string;
  description?: string;
  sql: string;
  parameters: QueryParameter[];
  resultCache: {
    enabled: boolean;
    ttl: number;
  };
  permissions: string[];
  tags: string[];
}

export interface QueryParameter {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'array';
  required: boolean;
  defaultValue?: any;
  validation?: string;
}

export interface AnalyticsMetric {
  id: string;
  name: string;
  description: string;
  category: string;
  formula: string;
  unit: string;
  format: string;
  aggregation: AggregationType;
  dimensions: string[];
  filters?: Record<string, any>;
  businessRules?: BusinessRule[];
}

export interface BusinessRule {
  condition: string;
  action: 'alert' | 'transform' | 'exclude' | 'highlight';
  parameters: any;
}

export interface AnalyticsAlert {
  id: string;
  name: string;
  description: string;
  metric: string;
  condition: AlertCondition;
  recipients: string[];
  channels: AlertChannel[];
  frequency: AlertFrequency;
  enabled: boolean;
  lastTriggered?: Date;
  triggerCount: number;
}

export interface AlertCondition {
  type: 'threshold' | 'change' | 'anomaly' | 'pattern';
  operator: '>' | '<' | '=' | '!=' | '>=' | '<=';
  value?: number;
  percentage?: number;
  period?: string;
  sensitivity?: number;
}

export enum AlertChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WEBHOOK = 'WEBHOOK',
  SLACK = 'SLACK',
  TEAMS = 'TEAMS',
  IN_APP = 'IN_APP',
}

export interface AlertFrequency {
  type: 'immediate' | 'digest' | 'throttled';
  interval?: number; // minutes for throttled
  digestTime?: string; // HH:mm for digest
}

export interface AnalyticsExport {
  id: string;
  name: string;
  type: 'report' | 'dashboard' | 'query';
  sourceId: string;
  format: ReportFormat;
  parameters: any;
  schedule?: ReportSchedule;
  destination: ExportDestination;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  lastExported?: Date;
  nextExport?: Date;
}

export interface ExportDestination {
  type: 'email' | 'ftp' | 's3' | 'webhook' | 'local';
  config: any;
  credentials?: string;
}

// Additional exports for API compatibility
export interface RelatorioAnalytics {
  id: string;
  nome: string;
  tipo: ReportType;
  categoria: ReportCategory;
  descricao: string;
  parametros: ReportParameters;
  status: ReportStatus;
  criadoPor: string;
  criadoEm: Date;
  ultimaGeracao?: Date;
  proximaGeracao?: Date;
}

export interface FiltrosRelatorio {
  tipo?: ReportType[];
  categoria?: ReportCategory[];
  status?: ReportStatus[];
  criadoPor?: string;
  dataInicio?: Date;
  dataFim?: Date;
  tags?: string[];
}

export interface TipoRelatorio {
  id: string;
  nome: string;
  descricao: string;
  categoria: ReportCategory;
  template: ReportParameters;
}

export interface ConfiguracaoRelatorio {
  parametros: ReportParameters;
  agendamento?: ReportSchedule;
  destinatarios?: string[];
  formato?: ReportFormat;
  configuracaoIA?: {
    habilitado: boolean;
    tiposAnalise: string[];
    nivelConfianca: number;
    gerarInsights: boolean;
    gerarRecomendacoes: boolean;
  };
}
