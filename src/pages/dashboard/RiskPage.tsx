import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  Activity,
  Target,
  RefreshCw,
  Download,
  Settings,
  BarChart3,
} from 'lucide-react';

// Sistema avançado de gestão de riscos descoberto
import {
  RiskManagementDashboard,
  RiskFactor,
  RiskMetrics,
  RiskLimit,
} from '@/components/risk/risk-management-dashboard';

export default function RiskPage() {
  const [loading, setLoading] = useState(true);

  // Mock data para demonstração
  const [riskMetrics] = useState<RiskMetrics>({
    overallScore: 32,
    riskLevel: 'medium',
    categories: {
      credit: 25,
      market: 40,
      liquidity: 20,
      operational: 28,
      regulatory: 30,
    },
    concentration: {
      byType: {
        TRIBUTARIO: 45.2,
        COMERCIAL: 23.1,
        FINANCEIRO: 15.8,
        JUDICIAL: 8.9,
        RURAL: 4.2,
        IMOBILIARIO: 2.1,
        AMBIENTAL: 0.5,
        ESPECIAL: 0.2,
      },
      byIssuer: {
        'Receita Federal': 35.5,
        'SEFAZ SP': 28.3,
        'SEFAZ RJ': 15.2,
        Outros: 21.0,
      },
      byMaturity: {
        '0-30 dias': 15.5,
        '30-90 dias': 25.8,
        '90-180 dias': 35.2,
        '180+ dias': 23.5,
      },
      geographic: {
        Sudeste: 55.8,
        Sul: 22.3,
        Nordeste: 12.1,
        'Centro-Oeste': 6.8,
        Norte: 3.0,
      },
    },
    volatility: {
      daily: 1.2,
      weekly: 3.8,
      monthly: 8.5,
      annual: 15.2,
    },
    var: {
      confidence95: 125000,
      confidence99: 185000,
      timeHorizon: 30,
    },
    stressTest: {
      scenarios: [
        {
          name: 'Crise Econômica Severa',
          description: 'Cenário de recessão profunda com aumento significativo da inadimplência',
          impact: 45,
          probability: 15,
        },
        {
          name: 'Mudanças Regulatórias',
          description: 'Alterações significativas na legislação tributária',
          impact: 30,
          probability: 25,
        },
        {
          name: 'Instabilidade Política',
          description: 'Período de incerteza política e institucional',
          impact: 35,
          probability: 20,
        },
      ],
    },
    alerts: [
      {
        id: '1',
        type: 'warning',
        title: 'Concentração Elevada',
        message: 'Concentração acima de 40% em créditos tributários federais',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        acknowledged: false,
      },
      {
        id: '2',
        type: 'error',
        title: 'Limite VaR Violado',
        message: 'Value at Risk excedeu o limite de R$ 150.000',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        acknowledged: false,
      },
    ],
  });

  const [riskFactors] = useState<RiskFactor[]>([
    {
      id: '1',
      name: 'Concentração por Emissor',
      category: 'credit',
      severity: 'high',
      impact: 75,
      probability: 35,
      description:
        'Alta concentração de créditos de um único emissor pode impactar significativamente o portfólio',
      mitigation: [
        'Diversificar portfólio entre diferentes emissores',
        'Estabelecer limites máximos por emissor',
      ],
      lastUpdated: new Date(),
    },
    {
      id: '2',
      name: 'Volatilidade do Mercado',
      category: 'market',
      severity: 'medium',
      impact: 60,
      probability: 55,
      description:
        'Flutuações nos preços dos créditos tributários podem afetar a valorização do portfólio',
      mitigation: ['Implementar estratégias de hedge', 'Diversificar tipos de créditos'],
      lastUpdated: new Date(),
    },
  ]);

  const [riskLimits] = useState<RiskLimit[]>([
    {
      id: '1',
      name: 'VaR 95% - 30 dias',
      type: 'var',
      limit: 150000,
      current: 185000,
      unit: 'currency',
      breached: true,
      warningThreshold: 135000,
    },
    {
      id: '2',
      name: 'Concentração por Emissor',
      type: 'concentration',
      limit: 40,
      current: 35.5,
      unit: 'percentage',
      breached: false,
      warningThreshold: 35,
    },
  ]);

  const [portfolio] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAcknowledgeAlert = async (alertId: string) => {
    console.log('Acknowledging alert:', alertId);
  };

  const handleUpdateRiskLimit = async (limitId: string, newLimit: number) => {
    console.log('Updating risk limit:', limitId, newLimit);
  };

  const handleGenerateReport = async () => {
    console.log('Generating risk report');
  };

  const handleRefreshData = async () => {
    console.log('Refreshing risk data');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Riscos</h1>
        <p className="text-muted-foreground">Carregando sistema avançado de riscos...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Risco</h1>
          <p className="text-muted-foreground">
            Análise e monitoramento de riscos da carteira de TCs
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handleRefreshData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button size="sm" onClick={handleGenerateReport}>
            <Download className="w-4 h-4 mr-2" />
            Relatório
          </Button>
        </div>
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Score de Risco</p>
              <p className="text-2xl font-bold text-green-600">7.2</p>
              <p className="text-xs text-gray-500">Baixo</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Alertas Ativos</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">VaR (95%)</p>
              <p className="text-2xl font-bold">R$ 45K</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Exposição</p>
              <p className="text-2xl font-bold">R$ 1.2M</p>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Distribuição de Risco por Categoria</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tributário</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <span className="text-sm font-medium">65%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Judicial</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <span className="text-sm font-medium">25%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Comercial</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
                <span className="text-sm font-medium">10%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Alertas de Risco</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Concentração Elevada</p>
                <p className="text-xs text-gray-600">40% da carteira em único emissor</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-orange-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Vencimento Próximo</p>
                <p className="text-xs text-gray-600">5 TCs vencem em 30 dias</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Score Deteriorado</p>
                <p className="text-xs text-gray-600">Emissor XYZ reduziu rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Análise Detalhada de Risco</h2>
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Módulo de Gestão de Risco em Desenvolvimento
          </h3>
          <p className="text-gray-600">
            Dashboard completo de análise de risco será implementado em breve
          </p>
        </div>
      </div>
    </div>
  );
}
