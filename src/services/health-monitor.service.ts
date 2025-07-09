import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

// === TIPOS PARA SISTEMA DE SAÚDE ===

export interface HealthStatus {
  overall: 'healthy' | 'warning' | 'critical' | 'error';
  score: number; // 0-100
  lastCheck: Date;
  issues: HealthIssue[];
  autoFixesApplied: number;
  autoFixesAvailable: number;
}

export interface HealthIssue {
  id: string;
  type: 'typescript' | 'duplicated-types' | 'missing-imports' | 'performance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  file?: string;
  line?: number;
  autoFixable: boolean;
  solution?: string;
  impact: string;
  createdAt: Date;
}

export interface AutoFixConfig {
  enabled: boolean;
  autoApplyLowRisk: boolean;
  maxAutoFixes: number;
  notifyOnFix: boolean;
}

// === SERVIÇO DE MONITORAMENTO DE SAÚDE ===

export class HealthMonitorService {
  private static instance: HealthMonitorService;
  private monitoringActive = false;
  private checkInterval: NodeJS.Timeout | null = null;
  private listeners: Array<(status: HealthStatus) => void> = [];
  private config: AutoFixConfig = {
    enabled: true,
    autoApplyLowRisk: true,
    maxAutoFixes: 10,
    notifyOnFix: true,
  };

  private constructor() {}

  public static getInstance(): HealthMonitorService {
    if (!HealthMonitorService.instance) {
      HealthMonitorService.instance = new HealthMonitorService();
    }
    return HealthMonitorService.instance;
  }

  // === MONITORAMENTO PRINCIPAL ===

  async startMonitoring(intervalMinutes: number = 15): Promise<void> {
    if (this.monitoringActive) return;

    this.monitoringActive = true;
    console.log(`🏥 Sistema de Saúde iniciado - verificação a cada ${intervalMinutes} minutos`);

    // Verificação inicial
    await this.performHealthCheck();

    // Agendar verificações periódicas
    this.checkInterval = setInterval(
      async () => {
        await this.performHealthCheck();
      },
      intervalMinutes * 60 * 1000
    );
  }

  async stopMonitoring(): Promise<void> {
    this.monitoringActive = false;
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    console.log('🏥 Sistema de Saúde pausado');
  }

  async performHealthCheck(): Promise<HealthStatus> {
    console.log('🔍 Executando verificação de saúde da plataforma...');

    const issues: HealthIssue[] = [];
    let autoFixesApplied = 0;

    try {
      // 1. Verificar erros TypeScript
      const tsIssues = await this.checkTypeScriptErrors();
      issues.push(...tsIssues);

      // 2. Verificar tipos duplicados
      const duplicateIssues = await this.checkDuplicatedTypes();
      issues.push(...duplicateIssues);

      // 3. Aplicar auto-correções se habilitado
      if (this.config.enabled) {
        autoFixesApplied = await this.applyAutoFixes(issues);
      }

      // 4. Calcular status geral
      const status = this.calculateOverallStatus(issues);

      const healthStatus: HealthStatus = {
        overall: status.level,
        score: status.score,
        lastCheck: new Date(),
        issues: issues.filter(i => !i.autoFixable || !this.config.autoApplyLowRisk),
        autoFixesApplied,
        autoFixesAvailable: issues.filter(i => i.autoFixable).length,
      };

      // Notificar listeners
      this.notifyListeners(healthStatus);

      return healthStatus;
    } catch (error) {
      console.error('Erro na verificação de saúde:', error);
      throw error;
    }
  }

  // === VERIFICAÇÕES ESPECÍFICAS ===

  private async checkTypeScriptErrors(): Promise<HealthIssue[]> {
    const issues: HealthIssue[] = [];

    try {
      await execAsync('npx tsc --noEmit --pretty');
      return issues; // Sem erros
    } catch (error: any) {
      const output = error.stdout || error.stderr || '';
      const foundMatch = output.match(/Found (\d+) error/);

      if (foundMatch) {
        const errorCount = parseInt(foundMatch[1]);
        issues.push({
          id: 'typescript-errors',
          type: 'typescript',
          severity: errorCount > 50 ? 'critical' : errorCount > 20 ? 'high' : 'medium',
          title: `${errorCount} Erros TypeScript`,
          description: `Encontrados ${errorCount} erros de compilação TypeScript`,
          autoFixable: errorCount < 30,
          solution: 'Executar correções automáticas de tipos',
          impact: 'Impede compilação e desenvolvimento',
          createdAt: new Date(),
        });
      }
    }

    return issues;
  }

  private async checkDuplicatedTypes(): Promise<HealthIssue[]> {
    const issues: HealthIssue[] = [];
    const typesDir = path.join(process.cwd(), 'src/types');

    try {
      const files = await fs.readdir(typesDir);
      const typeFiles = files.filter(f => f.endsWith('.ts'));

      // Analisar duplicações conhecidas
      const knownDuplicates = [
        { name: 'TituloCredito', files: ['tc.ts', 'titulo-credito.ts', 'titulo.ts'] },
        { name: 'BotProfile', files: ['bots.ts', 'enhanced-bots.ts'] },
        { name: 'Analytics', files: ['analytics.ts', 'analytics-advanced.ts'] },
      ];

      for (const duplicate of knownDuplicates) {
        const existingFiles = duplicate.files.filter(f => typeFiles.includes(f));
        if (existingFiles.length > 1) {
          issues.push({
            id: `duplicate-${duplicate.name}`,
            type: 'duplicated-types',
            severity: 'medium',
            title: `Tipos duplicados: ${duplicate.name}`,
            description: `Definições duplicadas em: ${existingFiles.join(', ')}`,
            autoFixable: true,
            solution: 'Consolidar em arquivo principal',
            impact: 'Confusão de tipos e conflitos de importação',
            createdAt: new Date(),
          });
        }
      }
    } catch (error) {
      console.error('Erro ao verificar tipos duplicados:', error);
    }

    return issues;
  }

  // === AUTO-CORREÇÕES ===

  private async applyAutoFixes(issues: HealthIssue[]): Promise<number> {
    let fixesApplied = 0;
    const maxFixes = this.config.maxAutoFixes;

    for (const issue of issues) {
      if (fixesApplied >= maxFixes) break;
      if (!issue.autoFixable) continue;

      const success = await this.applyFix(issue);
      if (success) {
        fixesApplied++;
        console.log(`✅ Auto-correção aplicada: ${issue.title}`);
      }
    }

    return fixesApplied;
  }

  private async applyFix(issue: HealthIssue): Promise<boolean> {
    try {
      switch (issue.type) {
        case 'duplicated-types':
          return await this.fixDuplicatedTypes(issue);
        default:
          return false;
      }
    } catch (error) {
      console.error(`Erro ao aplicar correção para ${issue.id}:`, error);
      return false;
    }
  }

  private async fixDuplicatedTypes(issue: HealthIssue): Promise<boolean> {
    console.log(`📋 Preparando consolidação: ${issue.title}`);
    // Marcar para consolidação manual por enquanto
    return false;
  }

  // === CÁLCULOS ===

  private calculateOverallStatus(issues: HealthIssue[]): {
    level: HealthStatus['overall'];
    score: number;
  } {
    const criticalIssues = issues.filter(i => i.severity === 'critical').length;
    const highIssues = issues.filter(i => i.severity === 'high').length;
    const mediumIssues = issues.filter(i => i.severity === 'medium').length;

    let score = 100;
    score -= criticalIssues * 25;
    score -= highIssues * 10;
    score -= mediumIssues * 5;
    score = Math.max(0, score);

    let level: HealthStatus['overall'];
    if (criticalIssues > 0) level = 'critical';
    else if (highIssues > 0) level = 'error';
    else if (mediumIssues > 3) level = 'warning';
    else level = 'healthy';

    return { level, score };
  }

  // === LISTENERS ===

  onHealthChange(callback: (status: HealthStatus) => void): void {
    this.listeners.push(callback);
  }

  private notifyListeners(status: HealthStatus): void {
    this.listeners.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('Erro ao notificar listener:', error);
      }
    });
  }

  updateConfig(config: Partial<AutoFixConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Instância singleton
export const healthMonitor = HealthMonitorService.getInstance();
