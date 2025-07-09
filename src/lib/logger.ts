import { writeFileSync, appendFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type LogCategory =
  | 'system'
  | 'auth'
  | 'blockchain'
  | 'marketplace'
  | 'fiscal'
  | 'api'
  | 'security'
  | 'audit';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  data?: any;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  duration?: number;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  metadata?: Record<string, any>;
}

export interface AuditLogEntry extends LogEntry {
  action: string;
  resource: string;
  resourceId?: string;
  oldValue?: any;
  newValue?: any;
  success: boolean;
}

class Logger {
  private static instance: Logger;
  private logDirectory: string;
  private isDevelopment: boolean;
  private enableFileLogging: boolean;
  private maxLogFileSize: number;
  private logRetentionDays: number;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.enableFileLogging = process.env.ENABLE_FILE_LOGGING === 'true';
    this.maxLogFileSize = parseInt(process.env.MAX_LOG_FILE_SIZE || '10485760'); // 10MB
    this.logRetentionDays = parseInt(process.env.LOG_RETENTION_DAYS || '30');
    this.logDirectory = join(process.cwd(), 'logs');

    if (this.enableFileLogging && !existsSync(this.logDirectory)) {
      mkdirSync(this.logDirectory, { recursive: true });
    }
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatLogEntry(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toISOString();
    const level = entry.level.toUpperCase().padEnd(5);
    const category = entry.category.toUpperCase().padEnd(10);

    let logLine = `[${timestamp}] ${level} ${category} ${entry.message}`;

    if (entry.userId) logLine += ` | User: ${entry.userId}`;
    if (entry.requestId) logLine += ` | Request: ${entry.requestId}`;
    if (entry.duration) logLine += ` | Duration: ${entry.duration}ms`;

    if (entry.data) {
      logLine += ` | Data: ${JSON.stringify(entry.data)}`;
    }

    if (entry.error) {
      logLine += ` | Error: ${entry.error.name}: ${entry.error.message}`;
      if (this.isDevelopment && entry.error.stack) {
        logLine += `\nStack: ${entry.error.stack}`;
      }
    }

    return logLine;
  }

  private shouldLog(level: LogLevel): boolean {
    const logLevels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
      fatal: 4,
    };

    const currentLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
    return logLevels[level] >= logLevels[currentLevel];
  }

  private writeToFile(entry: LogEntry): void {
    if (!this.enableFileLogging) return;

    try {
      const fileName = `${entry.category}-${new Date().toISOString().split('T')[0]}.log`;
      const filePath = join(this.logDirectory, fileName);
      const logLine = this.formatLogEntry(entry) + '\n';

      appendFileSync(filePath, logLine, 'utf8');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  private writeToConsole(entry: LogEntry): void {
    const formattedEntry = this.formatLogEntry(entry);

    switch (entry.level) {
      case 'debug':
        console.debug(formattedEntry);
        break;
      case 'info':
        console.info(formattedEntry);
        break;
      case 'warn':
        console.warn(formattedEntry);
        break;
      case 'error':
      case 'fatal':
        console.error(formattedEntry);
        break;
    }
  }

  public log(
    level: LogLevel,
    category: LogCategory,
    message: string,
    data?: any,
    metadata?: Record<string, any>
  ): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
      metadata,
    };

    this.writeToConsole(entry);
    this.writeToFile(entry);
  }

  public debug(category: LogCategory, message: string, data?: any): void {
    this.log('debug', category, message, data);
  }

  public info(category: LogCategory, message: string, data?: any): void {
    this.log('info', category, message, data);
  }

  public warn(category: LogCategory, message: string, data?: any): void {
    this.log('warn', category, message, data);
  }

  public error(category: LogCategory, message: string, error?: Error, data?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      category,
      message,
      data,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    };

    this.writeToConsole(entry);
    this.writeToFile(entry);
  }

  public fatal(category: LogCategory, message: string, error?: Error, data?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'fatal',
      category,
      message,
      data,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    };

    this.writeToConsole(entry);
    this.writeToFile(entry);
  }

  public audit(
    action: string,
    resource: string,
    success: boolean,
    userId?: string,
    resourceId?: string,
    oldValue?: any,
    newValue?: any,
    metadata?: Record<string, any>
  ): void {
    const entry: AuditLogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      category: 'audit',
      message: `${action} ${resource}${resourceId ? ` (${resourceId})` : ''} - ${success ? 'SUCCESS' : 'FAILED'}`,
      action,
      resource,
      resourceId,
      oldValue,
      newValue,
      success,
      userId,
      metadata,
    };

    this.writeToConsole(entry);
    this.writeToFile(entry);
  }

  public httpRequest(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    userId?: string,
    requestId?: string,
    ipAddress?: string,
    userAgent?: string
  ): void {
    const level: LogLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category: 'api',
      message: `${method} ${url} ${statusCode}`,
      duration,
      userId,
      requestId,
      ipAddress,
      userAgent,
      data: {
        method,
        url,
        statusCode,
        duration,
      },
    };

    this.writeToConsole(entry);
    this.writeToFile(entry);
  }

  public security(
    event: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    details: any,
    userId?: string,
    ipAddress?: string
  ): void {
    const level: LogLevel =
      severity === 'critical'
        ? 'fatal'
        : severity === 'high'
          ? 'error'
          : severity === 'medium'
            ? 'warn'
            : 'info';

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category: 'security',
      message: `Security Event: ${event} (${severity.toUpperCase()})`,
      userId,
      ipAddress,
      data: details,
      metadata: {
        severity,
        securityEvent: true,
      },
    };

    this.writeToConsole(entry);
    this.writeToFile(entry);
  }

  public blockchain(
    operation: string,
    transactionId?: string,
    success: boolean = true,
    data?: any,
    error?: Error
  ): void {
    const level: LogLevel = success ? 'info' : 'error';

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category: 'blockchain',
      message: `Blockchain ${operation}${transactionId ? ` (${transactionId})` : ''} - ${success ? 'SUCCESS' : 'FAILED'}`,
      data: {
        operation,
        transactionId,
        success,
        ...data,
      },
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    };

    this.writeToConsole(entry);
    this.writeToFile(entry);
  }

  public performance(operation: string, duration: number, metadata?: Record<string, any>): void {
    const level: LogLevel = duration > 5000 ? 'warn' : 'info';

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category: 'system',
      message: `Performance: ${operation} completed in ${duration}ms`,
      duration,
      data: {
        operation,
        duration,
        performanceMetric: true,
      },
      metadata,
    };

    this.writeToConsole(entry);
    this.writeToFile(entry);
  }

  public cleanupOldLogs(): void {
    if (!this.enableFileLogging) return;

    try {
      const fs = require('fs');
      const files = fs.readdirSync(this.logDirectory);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.logRetentionDays);

      files.forEach((file: string) => {
        const filePath = join(this.logDirectory, file);
        const stats = fs.statSync(filePath);

        if (stats.mtime < cutoffDate) {
          fs.unlinkSync(filePath);
          this.info('system', `Deleted old log file: ${file}`);
        }
      });
    } catch (error) {
      this.error('system', 'Failed to cleanup old logs', error as Error);
    }
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Export utility functions for common logging patterns
export const logRequest = (
  method: string,
  url: string,
  statusCode: number,
  duration: number,
  userId?: string,
  requestId?: string,
  ipAddress?: string,
  userAgent?: string
) => {
  logger.httpRequest(method, url, statusCode, duration, userId, requestId, ipAddress, userAgent);
};

export const logAudit = (
  action: string,
  resource: string,
  success: boolean,
  userId?: string,
  resourceId?: string,
  oldValue?: any,
  newValue?: any,
  metadata?: Record<string, any>
) => {
  logger.audit(action, resource, success, userId, resourceId, oldValue, newValue, metadata);
};

export const logSecurity = (
  event: string,
  severity: 'low' | 'medium' | 'high' | 'critical',
  details: any,
  userId?: string,
  ipAddress?: string
) => {
  logger.security(event, severity, details, userId, ipAddress);
};

export const logBlockchain = (
  operation: string,
  transactionId?: string,
  success: boolean = true,
  data?: any,
  error?: Error
) => {
  logger.blockchain(operation, transactionId, success, data, error);
};

export const logPerformance = (
  operation: string,
  duration: number,
  metadata?: Record<string, any>
) => {
  logger.performance(operation, duration, metadata);
};
