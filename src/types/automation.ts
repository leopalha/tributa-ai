export interface AutomationConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: 'high' | 'medium' | 'low';
  triggers: AutomationTrigger[];
  actions: AutomationAction[];
  conditions: AutomationCondition[];
  created_at: Date;
  updated_at: Date;
}

export interface AutomationTrigger {
  id: string;
  type: 'transaction_amount' | 'document_upload' | 'form_submission' | 'schedule' | 'api_webhook';
  condition: string;
  value: any;
  metadata?: Record<string, any>;
}

export interface AutomationAction {
  id: string;
  type: 'pre_fill_form' | 'generate_report' | 'validate_document' | 'send_notification' | 'create_task';
  parameters: Record<string, any>;
  order: number;
  enabled: boolean;
}

export interface AutomationCondition {
  id: string;
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'not_empty' | 'matches_regex';
  value: any;
  logical_operator?: 'AND' | 'OR';
}

// Formulários Pré-preenchidos
export interface PreFilledForm {
  id: string;
  form_type: 'SISCOAF' | 'PERDCOMP' | 'DARF' | 'SPED' | 'ECF' | 'CUSTOM';
  template_id: string;
  customer_id: string;
  empresa_id: string;
  pre_filled_data: Record<string, any>;
  completion_percentage: number;
  status: 'draft' | 'pre_filled' | 'validated' | 'submitted' | 'approved' | 'rejected';
  validation_errors?: ValidationError[];
  generated_at: Date;
  validated_at?: Date;
  submitted_at?: Date;
  expires_at?: Date;
  metadata?: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  auto_fixable: boolean;
}

// Compliance Automático
export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  rule_type: 'COAF' | 'PERDCOMP' | 'SISCOAF' | 'ANTI_LAVAGEM' | 'CUSTOM';
  threshold_value?: number;
  threshold_currency?: string;
  conditions: ComplianceCondition[];
  actions: ComplianceAction[];
  enabled: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
  created_at: Date;
  updated_at: Date;
}

export interface ComplianceCondition {
  id: string;
  field: string;
  operator: string;
  value: any;
  weight: number;
}

export interface ComplianceAction {
  id: string;
  type: 'generate_report' | 'flag_transaction' | 'require_approval' | 'block_transaction' | 'notify_authorities';
  parameters: Record<string, any>;
  auto_execute: boolean;
  requires_human_validation: boolean;
}

export interface ComplianceAlert {
  id: string;
  rule_id: string;
  transaction_id?: string;
  empresa_id: string;
  alert_type: 'COAF_REPORT' | 'SUSPICIOUS_ACTIVITY' | 'THRESHOLD_EXCEEDED' | 'DOCUMENT_ISSUE';
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  description: string;
  auto_generated_report?: string;
  requires_human_review: boolean;
  assigned_to?: string;
  created_at: Date;
  resolved_at?: Date;
  metadata?: Record<string, any>;
}

// Validação de Documentos com OCR
export interface DocumentValidation {
  id: string;
  document_id: string;
  document_type: 'CERTIDAO_NEGATIVA' | 'CNPJ' | 'CPF' | 'CONTRATO_SOCIAL' | 'BALANCETE' | 'CUSTOM';
  validation_status: 'pending' | 'processing' | 'completed' | 'failed' | 'requires_review';
  ocr_confidence: number;
  extracted_data: Record<string, any>;
  validation_results: DocumentValidationResult[];
  human_review_required: boolean;
  auto_approved: boolean;
  processed_at: Date;
  reviewed_at?: Date;
  reviewer_id?: string;
  metadata?: Record<string, any>;
}

export interface DocumentValidationResult {
  field: string;
  extracted_value: any;
  expected_value?: any;
  confidence: number;
  status: 'valid' | 'invalid' | 'uncertain' | 'missing';
  validation_rule: string;
  error_message?: string;
}

// Dashboard do Operador
export interface OperatorQueue {
  id: string;
  operator_id: string;
  tasks: OperatorTask[];
  priority_score: number;
  estimated_completion_time: number;
  created_at: Date;
  updated_at: Date;
}

export interface OperatorTask {
  id: string;
  task_type: 'FORM_VALIDATION' | 'DOCUMENT_REVIEW' | 'COMPLIANCE_REVIEW' | 'APPROVAL_REQUIRED' | 'CUSTOM';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  customer_name: string;
  empresa_name: string;
  estimated_time: number; // em segundos
  status: 'pending' | 'in_progress' | 'completed' | 'rejected' | 'escalated';
  pre_filled_data?: Record<string, any>;
  suggested_actions: SuggestedAction[];
  one_click_actions: OneClickAction[];
  assigned_at: Date;
  started_at?: Date;
  completed_at?: Date;
  metadata?: Record<string, any>;
}

export interface SuggestedAction {
  id: string;
  action_type: 'APPROVE' | 'REJECT' | 'REQUEST_MORE_INFO' | 'ESCALATE' | 'CUSTOM';
  confidence: number;
  reasoning: string;
  estimated_impact: string;
  recommended: boolean;
}

export interface OneClickAction {
  id: string;
  label: string;
  action_type: string;
  confirmation_required: boolean;
  warning_message?: string;
  success_message: string;
  api_endpoint: string;
  parameters: Record<string, any>;
}

// Integração PERDCOMP Semi-Automática
export interface PerdcompIntegration {
  id: string;
  empresa_id: string;
  integration_type: 'PERDCOMP' | 'SISCOAF' | 'CUSTOM';
  status: 'configuring' | 'ready' | 'processing' | 'completed' | 'error';
  eligibility_check: EligibilityCheck;
  generated_file?: GeneratedFile;
  submission_status?: SubmissionStatus;
  created_at: Date;
  completed_at?: Date;
  metadata?: Record<string, any>;
}

export interface EligibilityCheck {
  eligible: boolean;
  requirements_met: RequirementCheck[];
  blocking_issues: string[];
  warnings: string[];
  confidence_score: number;
  checked_at: Date;
}

export interface RequirementCheck {
  requirement: string;
  status: 'met' | 'not_met' | 'partially_met';
  details: string;
  auto_fixable: boolean;
}

export interface GeneratedFile {
  file_id: string;
  file_name: string;
  file_type: 'TXT' | 'XML' | 'PDF' | 'CSV';
  file_size: number;
  file_path: string;
  validation_status: 'valid' | 'invalid' | 'pending';
  generated_at: Date;
  expires_at?: Date;
}

export interface SubmissionStatus {
  submitted: boolean;
  submission_id?: string;
  rfb_protocol?: string;
  status: 'pending' | 'processing' | 'approved' | 'rejected' | 'error';
  response_message?: string;
  submitted_at?: Date;
  processed_at?: Date;
}

// Estatísticas e Métricas de Automação
export interface AutomationMetrics {
  total_processes: number;
  automated_processes: number;
  manual_processes: number;
  automation_rate: number;
  average_processing_time: number;
  average_operator_time: number;
  success_rate: number;
  error_rate: number;
  time_saved_hours: number;
  cost_savings: number;
  operator_productivity: number;
  period_start: Date;
  period_end: Date;
}

export interface ProcessingStats {
  form_type: string;
  total_count: number;
  auto_processed: number;
  manual_review: number;
  average_time: number;
  success_rate: number;
  common_errors: string[];
}

// Configurações do Sistema
export interface AutomationSettings {
  id: string;
  empresa_id: string;
  auto_pre_fill_forms: boolean;
  auto_compliance_check: boolean;
  auto_document_validation: boolean;
  auto_approval_threshold: number;
  human_review_threshold: number;
  notification_preferences: NotificationPreferences;
  integration_settings: IntegrationSettings;
  created_at: Date;
  updated_at: Date;
}

export interface NotificationPreferences {
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  alert_types: string[];
  frequency: 'instant' | 'hourly' | 'daily' | 'weekly';
}

export interface IntegrationSettings {
  rfb_enabled: boolean;
  sefaz_enabled: boolean;
  receita_federal_api_key?: string;
  sefaz_certificates?: string[];
  custom_integrations: Record<string, any>;
}