import React, { Component, ErrorInfo, ReactNode } from 'react';
import { errorMonitoring } from '@/lib/error-monitoring';
import { Button } from './ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Componente que captura erros em qualquer componente filho
 * e exibe uma UI de fallback quando ocorre um erro
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Reportar o erro para o serviço de monitoramento
    errorMonitoring.captureException(error, {
      component: this.props.componentName || 'Unknown',
      additionalData: { errorInfo },
    });
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      // Você pode renderizar qualquer UI customizada de fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-6 border border-destructive/20 rounded-lg bg-destructive/5 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
          <h2 className="text-lg font-semibold mb-2">Algo deu errado</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Ocorreu um erro neste componente. Nossos desenvolvedores foram notificados.
          </p>
          <Button onClick={this.handleReset} variant="outline" size="sm">
            Tentar novamente
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
