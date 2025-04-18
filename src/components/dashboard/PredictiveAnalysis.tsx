'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, TrendingDown, AlertTriangleIcon, LineChart, Target, ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HELP_MESSAGES } from "@/constants/help-messages";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { Button } from "@/components/ui/button";

interface Prediction {
  id: string;
  title: string;
  description: string;
  impact: 'alto' | 'medio' | 'baixo';
  trend: 'up' | 'down' | 'neutral';
  confidence: number;
  category: 'fiscal' | 'financeiro' | 'operacional' | 'regulatorio';
  timeframe: string;
  actions?: string[];
}

const mockPredictions: Prediction[] = [
  {
    id: '1',
    title: 'Aumento na Carga Tributária',
    description: 'Previsão de aumento significativo na carga tributária do ICMS no próximo trimestre',
    impact: 'alto',
    trend: 'up',
    confidence: 85,
    category: 'fiscal',
    timeframe: 'Próximo Trimestre',
    actions: [
      'Revisar planejamento tributário',
      'Avaliar benefícios fiscais disponíveis',
      'Preparar fluxo de caixa'
    ]
  },
  {
    id: '2',
    title: 'Redução em Créditos Fiscais',
    description: 'Tendência de redução nos créditos fiscais disponíveis devido a mudanças na legislação',
    impact: 'medio',
    trend: 'down',
    confidence: 75,
    category: 'fiscal',
    timeframe: 'Próximos 6 meses',
    actions: [
      'Otimizar aproveitamento de créditos',
      'Documentar processos fiscais',
      'Avaliar alternativas legais'
    ]
  },
  {
    id: '3',
    title: 'Risco de Compliance',
    description: 'Identificação de potenciais riscos de compliance devido a novas regulamentações',
    impact: 'alto',
    trend: 'up',
    confidence: 90,
    category: 'regulatorio',
    timeframe: 'Imediato',
    actions: [
      'Atualizar procedimentos internos',
      'Treinar equipe',
      'Implementar novos controles'
    ]
  },
  {
    id: '4',
    title: 'Otimização de Processos',
    description: 'Oportunidade de redução de custos através da automação de processos fiscais',
    impact: 'medio',
    trend: 'down',
    confidence: 80,
    category: 'operacional',
    timeframe: 'Próximo Ano',
    actions: [
      'Mapear processos atuais',
      'Avaliar ferramentas de automação',
      'Desenvolver plano de implementação'
    ]
  },
  {
    id: '5',
    title: 'Fluxo de Caixa Fiscal',
    description: 'Previsão de impacto no fluxo de caixa devido a vencimentos concentrados',
    impact: 'alto',
    trend: 'neutral',
    confidence: 70,
    category: 'financeiro',
    timeframe: 'Próximo Mês',
    actions: [
      'Planejar reserva financeira',
      'Negociar prazos com fornecedores',
      'Revisar cronograma de pagamentos'
    ]
  }
];

const getImpactColor = (impact: Prediction['impact']) => {
  switch (impact) {
    case 'alto':
      return 'bg-red-100 text-red-800';
    case 'medio':
      return 'bg-yellow-100 text-yellow-800';
    case 'baixo':
      return 'bg-green-100 text-green-800';
  }
};

const getCategoryColor = (category: Prediction['category']) => {
  switch (category) {
    case 'fiscal':
      return 'bg-blue-100 text-blue-800';
    case 'financeiro':
      return 'bg-green-100 text-green-800';
    case 'operacional':
      return 'bg-purple-100 text-purple-800';
    case 'regulatorio':
      return 'bg-orange-100 text-orange-800';
  }
};

const getTrendIcon = (trend: Prediction['trend']) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-red-500" />;
    case 'down':
      return <TrendingDown className="h-4 w-4 text-green-500" />;
    case 'neutral':
      return <LineChart className="h-4 w-4 text-yellow-500" />;
  }
};

export function PredictiveAnalysis() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-medium">Análise Preditiva</CardTitle>
          <CustomTooltip
            title={HELP_MESSAGES.PREDICTIVE.ANALYSIS.title}
            content={HELP_MESSAGES.PREDICTIVE.ANALYSIS.content}
          />
        </div>
        <Badge variant="outline" className="bg-primary/10">
          IA
        </Badge>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {mockPredictions.map((prediction) => (
              <div
                key={prediction.id}
                className="rounded-lg border p-4 hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{prediction.title}</h4>
                      {getTrendIcon(prediction.trend)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getImpactColor(prediction.impact)}>
                        Impacto {prediction.impact}
                      </Badge>
                      <Badge className={getCategoryColor(prediction.category)}>
                        {prediction.category}
                      </Badge>
                      <Badge variant="outline">
                        {prediction.timeframe}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {prediction.confidence}% confiança
                    </span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {prediction.description}
                </p>

                {prediction.actions && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Ações Recomendadas:</h5>
                    <div className="grid gap-2">
                      {prediction.actions.map((action, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <ArrowRight className="h-4 w-4" />
                          <span>{action}</span>
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