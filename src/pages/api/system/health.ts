/**
 * 🏥 API ENDPOINT - SISTEMA DE SAÚDE DA PLATAFORMA
 *
 * Endpoint para consultar o status e métricas do sistema de saúde.
 * Fornece dados em tempo real sobre todos os componentes da plataforma.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import platformHealthService from '@/services/platform-health.service';

interface HealthResponse {
  status: 'healthy' | 'warning' | 'error';
  timestamp: string;
  uptime: number;
  platform: any;
  components: any[];
  integrations: any[];
  alerts: any[];
  metrics: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method, query } = req;

    // Configura CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    if (method === 'GET') {
      // Obtém dados do sistema de saúde
      const platformStatus = platformHealthService.getPlatformStatus();
      const components = platformHealthService.getComponents();
      const integrations = platformHealthService.getIntegrations();
      const alerts = platformHealthService.getAlerts(parseInt(query.limit as string) || 20);
      const metrics = platformHealthService.getPerformanceMetrics();

      // Calcula uptime geral
      const uptime = components.reduce((sum, c) => sum + c.metrics.uptime, 0) / components.length;

      const response: HealthResponse = {
        status: platformStatus.overall,
        timestamp: new Date().toISOString(),
        uptime: uptime,
        platform: platformStatus,
        components: components,
        integrations: integrations,
        alerts: alerts,
        metrics: metrics,
      };

      // Status HTTP baseado no status geral
      const statusCode =
        platformStatus.overall === 'healthy'
          ? 200
          : platformStatus.overall === 'warning'
            ? 206
            : 503;

      res.status(statusCode).json(response);
    } else if (method === 'POST') {
      const { action } = req.body;

      switch (action) {
        case 'sync_all':
          await platformHealthService.forceSyncAll();
          res.status(200).json({ message: 'Sincronização iniciada' });
          break;

        case 'restart_all':
          await platformHealthService.restartAll();
          res.status(200).json({ message: 'Reinicialização iniciada' });
          break;

        case 'start_monitoring':
          platformHealthService.startMonitoring();
          res.status(200).json({ message: 'Monitoramento iniciado' });
          break;

        case 'stop_monitoring':
          platformHealthService.stopMonitoring();
          res.status(200).json({ message: 'Monitoramento parado' });
          break;

        default:
          res.status(400).json({ error: 'Ação não reconhecida' });
      }
    } else {
      res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (error) {
    console.error('Erro na API de saúde:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
}

/**
 * Configuração da API
 */
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
