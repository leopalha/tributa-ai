/**
 * Serviço de monitoramento de erros
 * Centraliza o registro e monitoramento de erros na aplicação
 * Pode ser facilmente conectado a serviços como Sentry no futuro
 */

import React from 'react';

interface ErrorContext {
  component?: string;
  additionalData?: any;
  user?: any;
  url?: string;
  timestamp?: Date;
}

interface ErrorInfo {
  message: string;
  stack?: string;
  context: ErrorContext;
}

class ErrorMonitoring {
  private errors: ErrorInfo[] = [];
  private isEnabled = true;

  constructor() {
    // Configurar handlers globais de erro
    this.setupGlobalHandlers();
  }

  private setupGlobalHandlers() {
    if (typeof window !== 'undefined') {
      // Capturar erros não tratados
      window.addEventListener('error', event => {
        this.captureException(new Error(event.message), {
          additionalData: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
          },
        });
      });

      // Capturar promises rejeitadas
      window.addEventListener('unhandledrejection', event => {
        this.captureException(new Error(event.reason || 'Unhandled Promise Rejection'), {
          additionalData: { reason: event.reason },
        });
      });
    }
  }

  captureException(error: Error, context: ErrorContext = {}) {
    if (!this.isEnabled) return;

    const errorInfo: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      context: {
        ...context,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        timestamp: new Date(),
      },
    };

    // Armazenar localmente (posteriormente enviar para serviço)
    this.errors.push(errorInfo);

    // Log no console para desenvolvimento
    console.error('Error captured:', errorInfo);

    // Limitar tamanho do array de erros
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(-50);
    }

    // Posteriormente: enviar para serviço de monitoramento
    // this.sendToMonitoringService(errorInfo);
  }

  captureMessage(
    message: string,
    level: 'info' | 'warning' | 'error' = 'info',
    context: ErrorContext = {}
  ) {
    console.log(`[${level.toUpperCase()}] ${message}`, context);

    if (level === 'error') {
      this.captureException(new Error(message), context);
    }
  }

  getErrors() {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  // Método para configurar usuário
  setUser(user: any) {
    // Implementar posteriormente
    console.log('User set for error monitoring:', user);
  }

  // Método para adicionar contexto global
  setContext(key: string, value: any) {
    // Implementar posteriormente
    console.log('Context set for error monitoring:', key, value);
  }
}

// Instância singleton
export const errorMonitoring = new ErrorMonitoring();

// Funções helper
export const captureException = (error: Error, context?: ErrorContext) => {
  errorMonitoring.captureException(error, context);
};

export const captureMessage = (
  message: string,
  level?: 'info' | 'warning' | 'error',
  context?: ErrorContext
) => {
  errorMonitoring.captureMessage(message, level, context);
};

export default errorMonitoring;

/**
 * HOC para capturar erros em componentes React
 */
export function withErrorMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.FC<P> {
  return function WrappedComponent(props: P) {
    try {
      return React.createElement(Component, props);
    } catch (error) {
      errorMonitoring.captureException(error as Error, {
        component: componentName,
        additionalData: { props },
      });
      throw error; // Re-lançar para ser capturado pelo ErrorBoundary
    }
  };
}
