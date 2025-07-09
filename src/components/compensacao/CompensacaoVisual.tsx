import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import {
  ArrowRight,
  Brain,
  CheckCircle,
  AlertTriangle,
  Loader2,
  TrendingUp,
  Shield,
  Calculator,
  FileText,
  Zap,
  DollarSign,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Credito {
  id: string;
  tipo: string;
  valor: number;
  disponivel: number;
  empresa: string;
}

interface Debito {
  id: string;
  tipo: string;
  valor: number;
  vencimento: string;
  empresa: string;
}

export function CompensacaoVisual() {
  const [creditos, setCreditos] = useState<Credito[]>([]);
  const [debitos, setDebitos] = useState<Debito[]>([]);
  const [selectedCredito, setSelectedCredito] = useState<Credito | null>(null);
  const [selectedDebito, setSelectedDebito] = useState<Debito | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analise, setAnalise] = useState<any>(null);
  const [step, setStep] = useState<'select' | 'analyze' | 'result'>('select');
  const { toast } = useToast();

  // Carregar dados ao montar componente
  React.useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    try {
      const response = await fetch('/api/compensacao/simular');
      const data = await response.json();
      setCreditos(data.creditos);
      setDebitos(data.debitos);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedCredito || !selectedDebito) {
      toast({
        title: 'Seleção incompleta',
        description: 'Selecione um crédito e um débito para analisar',
        variant: 'destructive',
      });
      return;
    }

    setAnalyzing(true);
    setStep('analyze');

    try {
      const response = await fetch('/api/compensacao/simular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creditoId: selectedCredito.id,
          debitoId: selectedDebito.id,
          valor: Math.min(selectedCredito.disponivel, selectedDebito.valor),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAnalise(data.analise);
        setStep('result');
      }
    } catch (error) {
      console.error('Erro na análise:', error);
      toast({
        title: 'Erro na análise',
        description: 'Não foi possível processar a compensação',
        variant: 'destructive',
      });
      setStep('select');
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setStep('select');
    setSelectedCredito(null);
    setSelectedDebito(null);
    setAnalise(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          Sistema Inteligente de Compensação
        </h2>
        <p className="text-muted-foreground">
          Nossa IA analisa a melhor forma de compensar seus débitos com créditos disponíveis
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 'select' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Seleção de Crédito */}
            <Card>
              <CardHeader>
                <CardTitle>Selecione um Crédito</CardTitle>
                <CardDescription>Escolha o crédito tributário para compensação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {creditos.map(credito => (
                  <div
                    key={credito.id}
                    onClick={() => setSelectedCredito(credito)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedCredito?.id === credito.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{credito.tipo}</p>
                        <p className="text-sm text-muted-foreground">{credito.empresa}</p>
                      </div>
                      <Badge variant="secondary">{formatCurrency(credito.disponivel)}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Seleção de Débito */}
            <Card>
              <CardHeader>
                <CardTitle>Selecione um Débito</CardTitle>
                <CardDescription>Escolha o débito a ser compensado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {debitos.map(debito => (
                  <div
                    key={debito.id}
                    onClick={() => setSelectedDebito(debito)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedDebito?.id === debito.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{debito.tipo}</p>
                        <p className="text-sm text-muted-foreground">
                          {debito.empresa} • Vence: {debito.vencimento}
                        </p>
                      </div>
                      <Badge variant="destructive">{formatCurrency(debito.valor)}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Botão de Análise */}
            {selectedCredito && selectedDebito && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="lg:col-span-2"
              >
                <Button onClick={handleAnalyze} size="lg" className="w-full">
                  <Calculator className="mr-2 h-5 w-5" />
                  Analisar Compensação
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {step === 'analyze' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card>
              <CardContent className="pt-12 pb-12">
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                  <h3 className="text-xl font-semibold">Analisando Compatibilidade</h3>
                  <p className="text-muted-foreground">
                    Nossa IA está verificando regulamentações e otimizando sua compensação...
                  </p>
                  <Progress value={66} className="max-w-xs mx-auto" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 'result' && analise && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Score de Compatibilidade */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Análise de Compatibilidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {Math.round(analise.compatibilidade.score)}%
                  </div>
                  <p className="text-muted-foreground">Score de Compatibilidade</p>
                </div>

                <div className="space-y-3">
                  {analise.compatibilidade.fatores.map((fator: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {fator.status === 'compatible' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        )}
                        <div>
                          <p className="font-medium">{fator.nome}</p>
                          <p className="text-sm text-muted-foreground">{fator.descricao}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{fator.peso}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Economia Projetada */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Economia Projetada
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor a Compensar</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(analise.economia.valorCompensado)}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Economia com Desconto</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(analise.economia.valorEconomizado)}
                    </p>
                    <Badge variant="secondary" className="mt-1">
                      {analise.economia.taxaDesconto}% de desconto
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tempo de Processamento</p>
                    <p className="font-medium">{analise.economia.tempoProcessamento}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Próximos Passos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analise.proximosPassos.map((passo: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-medium">{index + 1}</span>
                        </div>
                        <p className="text-sm">{passo}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ações */}
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={resetAnalysis}>
                Nova Análise
              </Button>
              <Button size="lg">
                <FileText className="mr-2 h-4 w-4" />
                Iniciar Compensação
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
