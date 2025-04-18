'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PieChart, BarChart2, TrendingUp, ArrowRight, Lightbulb, Target, AlertTriangleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalyticsInsight {
  id: string;
  title: string;
  description: string;
  category: 'tendencia' | 'anomalia' | 'oportunidade' | 'risco';
  metrics: {
    label: string;
    value: number;
    target?: number;
    unit: string;
    trend: number;
  }[];
  recommendations?: string[];
}

const mockInsights: AnalyticsInsight[] = [
  {
    id: '1',
    title: 'Análise de Créditos Fiscais',
    description: 'Identificamos padrões de aproveitamento de créditos fiscais abaixo do potencial',
    category: 'oportunidade',
    metrics: [
      {
        label: 'Taxa de Aproveitamento',
        value: 75,
        target: 90,
        unit: '%',
        trend: -5
      },
      {
        label: 'Créditos Disponíveis',
        value: 150000,
        unit: 'BRL',
        trend: 12
      }
    ],
    recommendations: [
      'Revisar processos de escrituração fiscal',
      'Implementar controles automatizados',
      'Capacitar equipe em legislação específica'
    ]
  },
  {
    id: '2',
    title: 'Distribuição de Tributos',
    description: 'Análise da composição da carga tributária por tipo de imposto',
    category: 'tendencia',
    metrics: [
      {
        label: 'ICMS',
        value: 45,
        unit: '%',
        trend: 2
      },
      {
        label: 'PIS/COFINS',
        value: 30,
        unit: '%',
        trend: -1
      },
      {
        label: 'ISS',
        value: 25,
        unit: '%',
        trend: -1
      }
    ]
  },
  {
    id: '3',
    title: 'Anomalias em Declarações',
    description: 'Detectamos inconsistências nos valores declarados vs. documentos fiscais',
    category: 'anomalia',
    metrics: [
      {
        label: 'Taxa de Divergência',
        value: 8.5,
        target: 3,
        unit: '%',
        trend: 2.5
      }
    ],
    recommendations: [
      'Auditar registros com divergências',
      'Verificar parametrização do sistema',
      'Reprocessar declarações afetadas'
    ]
  },
  {
    id: '4',
    title: 'Exposição a Riscos Fiscais',
    description: 'Avaliação dos principais fatores de risco identificados',
    category: 'risco',
    metrics: [
      {
        label: 'Risco de Autuação',
        value: 65,
        target: 40,
        unit: '%',
        trend: 15
      },
      {
        label: 'Contingências',
        value: 250000,
        unit: 'BRL',
        trend: 25
      }
    ],
    recommendations: [
      'Revisar procedimentos de compliance',
      'Atualizar políticas internas',
      'Implementar monitoramento contínuo'
    ]
  }
];

const getCategoryColor = (category: AnalyticsInsight['category']) => {
  switch (category) {
    case 'tendencia':
      return 'bg-blue-100 text-blue-800';
    case 'anomalia':
      return 'bg-red-100 text-red-800';
    case 'oportunidade':
      return 'bg-green-100 text-green-800';
    case 'risco':
      return 'bg-yellow-100 text-yellow-800';
  }
};

const getCategoryIcon = (category: AnalyticsInsight['category']) => {
  switch (category) {
    case 'tendencia':
      return <TrendingUp className="h-4 w-4 text-blue-500" />;
    case 'anomalia':
      return <AlertTriangleIcon className="h-4 w-4 text-red-500" />;
    case 'oportunidade':
      return <Lightbulb className="h-4 w-4 text-green-500" />;
    case 'risco':
      return <Target className="h-4 w-4 text-yellow-500" />;
  }
};

const formatValue = (value: number, unit: string) => {
  if (unit === 'BRL') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
  if (unit === '%') {
    return `${value}%`;
  }
  return value;
};

const formatTrend = (trend: number) => {
  const prefix = trend > 0 ? '+' : '';
  return `${prefix}${trend}%`;
};

export function AdvancedAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5" />
          Análises Avançadas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {mockInsights.map((insight) => (
              <div
                key={insight.id}
                className="rounded-lg border p-4 hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getCategoryIcon(insight.category)}
                      <h4 className="font-medium">{insight.title}</h4>
                    </div>
                    <Badge className={getCategoryColor(insight.category)}>
                      {insight.category}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {insight.description}
                </p>

                <div className="space-y-4 mb-4">
                  {insight.metrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {metric.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">
                            {formatValue(metric.value, metric.unit)}
                          </span>
                          <span className={`text-xs ${
                            metric.trend > 0 ? 'text-success' : 'text-destructive'
                          }`}>
                            {formatTrend(metric.trend)}
                          </span>
                        </div>
                      </div>
                      {metric.target && (
                        <div className="space-y-1">
                          <Progress
                            value={(metric.value / metric.target) * 100}
                            className="h-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Atual</span>
                            <span>Meta: {formatValue(metric.target, metric.unit)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {insight.recommendations && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Recomendações:</h5>
                    <div className="grid gap-2">
                      {insight.recommendations.map((recommendation, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <ArrowRight className="h-4 w-4" />
                          <span>{recommendation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}