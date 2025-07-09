import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTC } from '@/hooks/useTC';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { TituloDeCredito } from '@/types/tc';

interface TCRiskAnalysisProps {
  tc: TituloDeCredito | null;
}

export function TCRiskAnalysis({ tc }: TCRiskAnalysisProps) {
  const { obterAnaliseRisco } = useTC();
  const [loading, setLoading] = useState(false);
  const [riskData, setRiskData] = useState<{
    nivelRisco: 'BAIXO' | 'MEDIO' | 'ALTO';
    pontuacao: number;
    fatores: Array<{
      descricao: string;
      impacto: number;
    }>;
  } | null>(null);

  useEffect(() => {
    if (tc) {
      loadRiskAnalysis();
    }
  }, [tc]);

  const loadRiskAnalysis = async () => {
    if (!tc) return;

    try {
      setLoading(true);
      const data = await obterAnaliseRisco(tc.id);
      setRiskData(data);
    } catch (error) {
      console.error('Erro ao carregar análise de risco:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (nivel: 'BAIXO' | 'MEDIO' | 'ALTO') => {
    switch (nivel) {
      case 'BAIXO':
        return 'bg-green-100 text-green-800';
      case 'MEDIO':
        return 'bg-yellow-100 text-yellow-800';
      case 'ALTO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskIcon = (nivel: 'BAIXO' | 'MEDIO' | 'ALTO') => {
    switch (nivel) {
      case 'BAIXO':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'MEDIO':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'ALTO':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  if (!tc) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center">
            <h3 className="text-lg font-medium">Selecione um título de crédito</h3>
            <p className="text-[hsl(var(--muted-foreground))]">
              Para visualizar a análise de risco, selecione um TC na lista
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análise de Risco</CardTitle>
          <CardDescription>Carregando análise de risco...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!riskData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análise de Risco</CardTitle>
          <CardDescription>Não foi possível carregar a análise de risco.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Análise de Risco</CardTitle>
            <CardDescription>Avaliação de risco baseada em múltiplos fatores</CardDescription>
          </div>
          <Badge className={getRiskColor(riskData.nivelRisco)}>
            <div className="flex items-center gap-2">
              {getRiskIcon(riskData.nivelRisco)}
              <span>Risco {riskData.nivelRisco}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Pontuação de Risco</span>
              <span className="text-sm font-medium">{riskData.pontuacao}/100</span>
            </div>
            <Progress
              value={riskData.pontuacao}
              className="h-2"
              indicatorClassName={
                riskData.pontuacao < 30
                  ? 'bg-green-500'
                  : riskData.pontuacao < 70
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Fatores de Risco</h3>
            {riskData.fatores.map((fator, index) => (
              <Alert
                key={index}
                variant={
                  fator.impacto > 7 ? 'destructive' : fator.impacto > 4 ? 'default' : 'success'
                }
              >
                <AlertTitle>Fator {index + 1}</AlertTitle>
                <AlertDescription className="flex items-center justify-between">
                  <span>{fator.descricao}</span>
                  <Badge
                    variant={
                      fator.impacto > 7 ? 'destructive' : fator.impacto > 4 ? 'default' : 'success'
                    }
                  >
                    Impacto: {fator.impacto}/10
                  </Badge>
                </AlertDescription>
              </Alert>
            ))}
          </div>

          {riskData.nivelRisco === 'ALTO' && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Atenção</AlertTitle>
              <AlertDescription>
                Este TC apresenta alto risco. Recomenda-se uma análise detalhada antes de prosseguir
                com qualquer operação.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
