// External Integration Types for Tributa.AI Platform

export interface ExternalIntegration {
  id: string;
  name: string;
  type: IntegrationType;
  provider: IntegrationProvider;
  description: string;
  version: string;
  status: IntegrationStatus;
  configuration: IntegrationConfig;
  authentication: AuthenticationConfig;
  endpoints: IntegrationEndpoint[];
  webhooks: WebhookConfig[];
  rateLimits: RateLimitConfig;
  monitoring: MonitoringConfig;
  createdAt: Date;
  updatedAt: Date;
  lastSync?: Date;
  nextSync?: Date;
}

export enum IntegrationType {
  // Government Systems
  RECEITA_FEDERAL = 'RECEITA_FEDERAL',
  SEFAZ = 'SEFAZ',
  PGFN = 'PGFN',
  BACEN = 'BACEN',
  CVM = 'CVM',
  SUSEP = 'SUSEP',

  // Financial Institutions
  BANCO_CENTRAL = 'BANCO_CENTRAL',
  FEBRABAN = 'FEBRABAN',
  SERASA = 'SERASA',
  SPC = 'SPC',

  // Credit Bureaus
  SCPC = 'SCPC',
  SERASA_EXPERIAN = 'SERASA_EXPERIAN',
  SPC_BRASIL = 'SPC_BRASIL',

  // Blockchain Networks
  HYPERLEDGER_FABRIC = 'HYPERLEDGER_FABRIC',
  ETHEREUM = 'ETHEREUM',
  POLYGON = 'POLYGON',
  BSC = 'BSC',

  // ERP Systems
  SAP = 'SAP',
  ORACLE = 'ORACLE',
  TOTVS = 'TOTVS',
  SENIOR = 'SENIOR',

  // Accounting Systems
  CONTABILIZEI = 'CONTABILIZEI',
  OMIE = 'OMIE',
  BLING = 'BLING',
  TINY = 'TINY',

  // Document Management
  DOCUSIGN = 'DOCUSIGN',
  ADOBE_SIGN = 'ADOBE_SIGN',
  CLICKSIGN = 'CLICKSIGN',

  // Communication
  WHATSAPP_BUSINESS = 'WHATSAPP_BUSINESS',
  TELEGRAM = 'TELEGRAM',
  SLACK = 'SLACK',
  MICROSOFT_TEAMS = 'MICROSOFT_TEAMS',

  // Storage
  AWS_S3 = 'AWS_S3',
  AZURE_BLOB = 'AZURE_BLOB',
  GOOGLE_CLOUD = 'GOOGLE_CLOUD',

  // Custom APIs
  REST_API = 'REST_API',
  GRAPHQL = 'GRAPHQL',
  SOAP = 'SOAP',
  WEBHOOK = 'WEBHOOK',
}

export enum IntegrationProvider {
  GOVERNMENT = 'GOVERNMENT',
  FINANCIAL = 'FINANCIAL',
  BLOCKCHAIN = 'BLOCKCHAIN',
  ERP = 'ERP',
  THIRD_PARTY = 'THIRD_PARTY',
  CUSTOM = 'CUSTOM',
}

export enum IntegrationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CONFIGURING = 'CONFIGURING',
  ERROR = 'ERROR',
  MAINTENANCE = 'MAINTENANCE',
  DEPRECATED = 'DEPRECATED',
}

export interface IntegrationConfig {
  baseUrl: string;
  version: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  batchSize?: number;
  syncInterval?: number; // minutes
  dataMapping: DataMappingConfig;
  validation: ValidationConfig;
  transformation: TransformationConfig;
  encryption: EncryptionConfig;
  customSettings: Record<string, any>;
}

export interface AuthenticationConfig {
  type: AuthenticationType;
  credentials: AuthenticationCredentials;
  tokenManagement: TokenManagementConfig;
  certificateConfig?: CertificateConfig;
}

export enum AuthenticationType {
  API_KEY = 'API_KEY',
  OAUTH2 = 'OAUTH2',
  BASIC_AUTH = 'BASIC_AUTH',
  BEARER_TOKEN = 'BEARER_TOKEN',
  CERTIFICATE = 'CERTIFICATE',
  CUSTOM = 'CUSTOM',
}

export interface AuthenticationCredentials {
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  username?: string;
  password?: string;
  token?: string;
  certificate?: string;
  privateKey?: string;
  customFields?: Record<string, string>;
}

export interface TokenManagementConfig {
  autoRefresh: boolean;
  refreshThreshold: number; // minutes before expiry
  tokenUrl?: string;
  scope?: string[];
  audience?: string;
}

export interface CertificateConfig {
  type: 'A1' | 'A3' | 'PFX' | 'PEM';
  path: string;
  password?: string;
  validUntil: Date;
  issuer: string;
  subject: string;
}

export interface IntegrationEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  parameters: EndpointParameter[];
  headers: Record<string, string>;
  requestBody?: EndpointSchema;
  responseSchema: EndpointSchema;
  rateLimit?: number; // requests per minute
  cacheTtl?: number; // seconds
  timeout?: number;
  retryPolicy?: RetryPolicy;
}

export interface EndpointParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';
  required: boolean;
  description: string;
  validation?: string;
  defaultValue?: any;
  example?: any;
}

export interface EndpointSchema {
  type: 'object' | 'array' | 'string' | 'number' | 'boolean';
  properties?: Record<string, SchemaProperty>;
  items?: EndpointSchema;
  required?: string[];
  example?: any;
}

export interface SchemaProperty {
  type: string;
  description?: string;
  format?: string;
  enum?: any[];
  properties?: Record<string, SchemaProperty>;
  items?: SchemaProperty;
}

export interface RetryPolicy {
  maxAttempts: number;
  backoffStrategy: 'linear' | 'exponential' | 'fixed';
  baseDelay: number; // milliseconds
  maxDelay: number; // milliseconds
  retryConditions: string[]; // HTTP status codes or error types
}

export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret?: string;
  headers: Record<string, string>;
  active: boolean;
  retryPolicy: RetryPolicy;
  transformation?: string; // JavaScript code for data transformation
}

export interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  burstLimit: number;
  strategy: 'sliding_window' | 'fixed_window' | 'token_bucket';
}

export interface MonitoringConfig {
  healthCheck: HealthCheckConfig;
  metrics: MetricsConfig;
  alerting: AlertingConfig;
  logging: LoggingConfig;
}

export interface HealthCheckConfig {
  enabled: boolean;
  interval: number; // minutes
  endpoint: string;
  timeout: number;
  expectedStatus: number[];
  expectedResponse?: any;
}

export interface MetricsConfig {
  enabled: boolean;
  collectResponseTime: boolean;
  collectErrorRate: boolean;
  collectThroughput: boolean;
  customMetrics: string[];
}

export interface AlertingConfig {
  enabled: boolean;
  errorThreshold: number; // percentage
  responseTimeThreshold: number; // milliseconds
  uptimeThreshold: number; // percentage
  recipients: string[];
  channels: string[];
}

export interface LoggingConfig {
  enabled: boolean;
  level: 'debug' | 'info' | 'warn' | 'error';
  includeRequestBody: boolean;
  includeResponseBody: boolean;
  retention: number; // days
}

export interface DataMappingConfig {
  mappings: FieldMapping[];
  defaultValues: Record<string, any>;
  conditionalMappings: ConditionalMapping[];
}

export interface FieldMapping {
  source: string;
  target: string;
  type: 'direct' | 'transform' | 'calculate' | 'lookup';
  transformation?: string; // JavaScript code
  required: boolean;
  validation?: string;
}

export interface ConditionalMapping {
  condition: string; // JavaScript expression
  mappings: FieldMapping[];
}

export interface ValidationConfig {
  enabled: boolean;
  rules: ValidationRule[];
  onError: 'reject' | 'skip' | 'default';
}

export interface ValidationRule {
  field: string;
  type: 'required' | 'format' | 'range' | 'custom';
  parameters: any;
  message: string;
}

export interface TransformationConfig {
  enabled: boolean;
  transformations: DataTransformation[];
}

export interface DataTransformation {
  name: string;
  type: 'map' | 'filter' | 'aggregate' | 'join' | 'custom';
  config: any;
  order: number;
}

export interface EncryptionConfig {
  enabled: boolean;
  algorithm: string;
  keyRotation: boolean;
  rotationInterval: number; // days
}

// Integration Execution Types
export interface IntegrationExecution {
  id: string;
  integrationId: string;
  endpointId: string;
  status: ExecutionStatus;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  request: ExecutionRequest;
  response?: ExecutionResponse;
  error?: ExecutionError;
  retryCount: number;
  metadata: ExecutionMetadata;
}

export enum ExecutionStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  TIMEOUT = 'TIMEOUT',
  CANCELLED = 'CANCELLED',
}

export interface ExecutionRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: any;
  parameters: Record<string, any>;
}

export interface ExecutionResponse {
  status: number;
  headers: Record<string, string>;
  body: any;
  size: number;
}

export interface ExecutionError {
  code: string;
  message: string;
  details?: any;
  stack?: string;
}

export interface ExecutionMetadata {
  userAgent: string;
  clientIp: string;
  userId?: string;
  sessionId?: string;
  correlationId: string;
  tags: string[];
}

// Batch Processing Types
export interface BatchOperation {
  id: string;
  integrationId: string;
  name: string;
  type: BatchType;
  status: BatchStatus;
  items: BatchItem[];
  configuration: BatchConfig;
  progress: BatchProgress;
  results: BatchResults;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export enum BatchType {
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
  SYNC = 'SYNC',
  VALIDATION = 'VALIDATION',
  TRANSFORMATION = 'TRANSFORMATION',
}

export enum BatchStatus {
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  PARTIAL = 'PARTIAL',
}

export interface BatchItem {
  id: string;
  data: any;
  status: 'pending' | 'processing' | 'success' | 'failed';
  error?: string;
  result?: any;
}

export interface BatchConfig {
  batchSize: number;
  parallelism: number;
  retryPolicy: RetryPolicy;
  continueOnError: boolean;
  validation: boolean;
}

export interface BatchProgress {
  total: number;
  processed: number;
  successful: number;
  failed: number;
  percentage: number;
  estimatedTimeRemaining?: number;
}

export interface BatchResults {
  summary: BatchSummary;
  items: BatchItem[];
  errors: BatchError[];
  metrics: BatchMetrics;
}

export interface BatchSummary {
  totalItems: number;
  successfulItems: number;
  failedItems: number;
  skippedItems: number;
  processingTime: number;
  throughput: number; // items per second
}

export interface BatchError {
  itemId: string;
  error: string;
  details?: any;
  retryable: boolean;
}

export interface BatchMetrics {
  averageProcessingTime: number;
  peakMemoryUsage: number;
  networkBytesTransferred: number;
  apiCallsCount: number;
}

// Synchronization Types
export interface SyncConfiguration {
  id: string;
  integrationId: string;
  name: string;
  description: string;
  sourceSystem: string;
  targetSystem: string;
  syncType: SyncType;
  schedule: SyncSchedule;
  mapping: DataMappingConfig;
  filters: SyncFilter[];
  conflictResolution: ConflictResolutionStrategy;
  enabled: boolean;
  lastSync?: Date;
  nextSync?: Date;
}

export enum SyncType {
  FULL = 'FULL',
  INCREMENTAL = 'INCREMENTAL',
  BIDIRECTIONAL = 'BIDIRECTIONAL',
  REAL_TIME = 'REAL_TIME',
}

export interface SyncSchedule {
  type: 'manual' | 'cron' | 'interval' | 'event';
  expression?: string; // cron expression
  interval?: number; // minutes
  events?: string[];
}

export interface SyncFilter {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'not_in' | 'contains';
  value: any;
  logic?: 'and' | 'or';
}

export enum ConflictResolutionStrategy {
  SOURCE_WINS = 'SOURCE_WINS',
  TARGET_WINS = 'TARGET_WINS',
  LATEST_WINS = 'LATEST_WINS',
  MANUAL = 'MANUAL',
  MERGE = 'MERGE',
}

export interface SyncExecution {
  id: string;
  configurationId: string;
  status: SyncStatus;
  startTime: Date;
  endTime?: Date;
  statistics: SyncStatistics;
  conflicts: SyncConflict[];
  errors: SyncError[];
}

export enum SyncStatus {
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PARTIAL = 'PARTIAL',
  CANCELLED = 'CANCELLED',
}

export interface SyncStatistics {
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsDeleted: number;
  recordsSkipped: number;
  recordsFailed: number;
  dataTransferred: number; // bytes
}

export interface SyncConflict {
  id: string;
  recordId: string;
  field: string;
  sourceValue: any;
  targetValue: any;
  resolution?: 'source' | 'target' | 'merge' | 'manual';
  resolvedValue?: any;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface SyncError {
  recordId: string;
  error: string;
  details?: any;
  retryable: boolean;
}

// API Gateway Types
export interface APIGatewayConfig {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  version: string;
  authentication: GatewayAuthentication;
  rateLimiting: GatewayRateLimit;
  routing: GatewayRoute[];
  middleware: GatewayMiddleware[];
  monitoring: GatewayMonitoring;
  caching: GatewayCaching;
}

export interface GatewayAuthentication {
  required: boolean;
  methods: string[];
  tokenValidation: boolean;
  roleBasedAccess: boolean;
  ipWhitelist?: string[];
}

export interface GatewayRateLimit {
  enabled: boolean;
  global: RateLimitRule;
  perUser: RateLimitRule;
  perEndpoint: Record<string, RateLimitRule>;
}

export interface RateLimitRule {
  requests: number;
  window: number; // seconds
  burst?: number;
}

export interface GatewayRoute {
  id: string;
  path: string;
  method: string;
  target: RouteTarget;
  transformation?: RouteTransformation;
  validation?: RouteValidation;
  caching?: RouteCaching;
}

export interface RouteTarget {
  type: 'integration' | 'function' | 'proxy';
  integrationId?: string;
  functionName?: string;
  url?: string;
  timeout: number;
}

export interface RouteTransformation {
  request?: string; // JavaScript code
  response?: string; // JavaScript code
}

export interface RouteValidation {
  requestSchema?: any;
  responseSchema?: any;
  required: boolean;
}

export interface RouteCaching {
  enabled: boolean;
  ttl: number; // seconds
  varyBy: string[];
}

export interface GatewayMiddleware {
  name: string;
  type: 'authentication' | 'logging' | 'transformation' | 'validation' | 'custom';
  config: any;
  order: number;
  enabled: boolean;
}

export interface GatewayMonitoring {
  enabled: boolean;
  metrics: string[];
  alerting: AlertingConfig;
  dashboardId?: string;
}

export interface GatewayCaching {
  enabled: boolean;
  provider: 'memory' | 'redis' | 'memcached';
  defaultTtl: number;
  maxSize: number;
}
