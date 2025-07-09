import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Gavel,
  Clock,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Eye,
  DollarSign,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { CreditTitle } from '@/types/prisma';

interface LanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titulo: CreditTitle;
  leilaoInfo: {
    lanceAtual: number;
    incrementoMinimo: number;
    tempoRestante: number; // em segundos
    participantes: number;
    totalLances: number;
    lanceMinimo: number;
    ultimoLance?: {
      valor: number;
      usuario: string;
      timestamp: Date;
    };
  };
  onSuccess?: () => void;
}

export function LanceModal({ open, onOpenChange, titulo, leilaoInfo, onSuccess }: LanceModalProps) {
  const [loading, setLoading] = useState(false);
  const [valorLance, setValorLance] = useState('');
  const [tempoRestante, setTempoRestante] = useState(leilaoInfo.tempoRestante);
  const [etapa, setEtapa] = useState<'lance' | 'processando' | 'concluido'>('lance');

  // Timer para atualizar tempo restante
  useEffect(() => {
    if (tempoRestante <= 0) return;

    const timer = setInterval(() => {
      setTempoRestante(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [tempoRestante]);

  // Cálculos
  const valorMinimo = leilaoInfo.lanceAtual + leilaoInfo.incrementoMinimo;
  const valorLanceNum = parseFloat(valorLance.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  const isValorValido = valorLanceNum >= valorMinimo;
  const leilaoExpirado = tempoRestante <= 0;

  // Verificar se título está tokenizado
  const isTokenizado = titulo.status === 'TOKENIZED' && titulo.tokenizationInfo?.tokenAddress;

  const formatarTempo = (segundos: number): string => {
    if (segundos <= 0) return 'Leilão encerrado';

    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;

    if (horas > 0) {
      return `${horas}h ${minutos}m ${segs}s`;
    } else if (minutos > 0) {
      return `${minutos}m ${segs}s`;
    } else {
      return `${segs}s`;
    }
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    // Formatar como moeda brasileira
    const numericValue = valor.replace(/[^\d]/g, '');
    if (numericValue) {
      const formatted = (parseInt(numericValue) / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
      setValorLance(formatted);
    } else {
      setValorLance('');
    }
  };

  const handleLance = async () => {
    if (!isValorValido) {
      toast.error('Valor do lance deve ser maior que o lance mínimo');
      return;
    }

    if (leilaoExpirado) {
      toast.error('Leilão já foi encerrado');
      return;
    }

    if (!isTokenizado) {
      toast.error('Apenas títulos tokenizados podem ser leiloados');
      return;
    }

    setLoading(true);
    setEtapa('processando');

    try {
      // Simular registro do lance na blockchain
      await new Promise(resolve => setTimeout(resolve, 2000));

      setEtapa('concluido');

      toast.success('Lance registrado com sucesso!');

      setTimeout(() => {
        onSuccess?.();
        onOpenChange(false);
        setEtapa('lance');
        setValorLance('');
      }, 2000);
    } catch (error) {
      toast.error('Erro ao registrar lance');
      setEtapa('lance');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (etapa !== 'processando') {
      onOpenChange(false);
      setEtapa('lance');
      setValorLance('');
    }
  };

  // Verificação de tokenização
  if (!isTokenizado) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Título Não Tokenizado</h3>
            <p className="text-sm text-muted-foreground text-center">
              Apenas títulos tokenizados podem ser leiloados no marketplace.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (etapa === 'processando') {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Registrando Lance</h3>
            <p className="text-sm text-muted-foreground text-center">
              Validando lance e registrando na blockchain...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (etapa === 'concluido') {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Lance Registrado!</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Seu lance foi registrado com sucesso na blockchain.
            </p>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{valorLance}</p>
              <p className="text-sm text-muted-foreground">Valor do lance</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gavel className="h-5 w-5" />
            Dar Lance - Leilão
          </DialogTitle>
          <DialogDescription>
            Participe do leilão deste título de crédito tokenizado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status do Leilão */}
          <Card
            className={leilaoExpirado ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock
                    className={`h-5 w-5 ${leilaoExpirado ? 'text-red-600' : 'text-green-600'}`}
                  />
                  <span className="font-medium">
                    {leilaoExpirado ? 'Leilão Encerrado' : 'Tempo Restante'}
                  </span>
                </div>
                <Badge variant={leilaoExpirado ? 'destructive' : 'default'}>
                  {formatarTempo(tempoRestante)}
                </Badge>
              </div>

              {!leilaoExpirado && (
                <Progress
                  value={Math.max(0, 100 - (tempoRestante / leilaoInfo.tempoRestante) * 100)}
                  className="h-2"
                />
              )}
            </CardContent>
          </Card>

          {/* Detalhes do Título */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{titulo.title || titulo.subtype}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Badge variant="secondary">{titulo.category}</Badge>
                <Badge variant="outline">
                  Token: {titulo.tokenizationInfo?.tokenAddress?.slice(-8)}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Valor Nominal:</span>
                  <p className="font-medium">{formatCurrency(titulo.value)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Emissor:</span>
                  <p className="font-medium">{titulo.issuerName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Leilão */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Status do Leilão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(leilaoInfo.lanceAtual)}
                  </p>
                  <p className="text-sm text-muted-foreground">Lance Atual</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{leilaoInfo.participantes}</p>
                  <p className="text-sm text-muted-foreground">Participantes</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Lance Mínimo:</span>
                  <span className="font-medium">{formatCurrency(leilaoInfo.lanceMinimo)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Próximo Lance Mínimo:</span>
                  <span className="font-medium text-green-600">{formatCurrency(valorMinimo)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Incremento Mínimo:</span>
                  <span className="font-medium">{formatCurrency(leilaoInfo.incrementoMinimo)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total de Lances:</span>
                  <span className="font-medium">{leilaoInfo.totalLances}</span>
                </div>
              </div>

              {/* Último Lance */}
              {leilaoInfo.ultimoLance && (
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Último Lance</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Valor:</span>
                      <span className="font-medium">
                        {formatCurrency(leilaoInfo.ultimoLance.valor)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Por:</span>
                      <span className="font-medium">{leilaoInfo.ultimoLance.usuario}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quando:</span>
                      <span className="font-medium">
                        {new Date(leilaoInfo.ultimoLance.timestamp).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fazer Lance */}
          {!leilaoExpirado && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gavel className="h-5 w-5" />
                  Seu Lance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Valor do Lance (mínimo: {formatCurrency(valorMinimo)})
                  </label>
                  <Input
                    type="text"
                    placeholder="R$ 0,00"
                    value={valorLance}
                    onChange={handleValorChange}
                    className={!isValorValido && valorLance ? 'border-red-500' : ''}
                  />
                  {!isValorValido && valorLance && (
                    <p className="text-sm text-red-600 mt-1">
                      Valor deve ser maior que {formatCurrency(valorMinimo)}
                    </p>
                  )}
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <strong>Importante:</strong> Lances são vinculativos e não podem ser cancelados.
                    Se vencer o leilão, você se compromete a adquirir o título pelo valor ofertado.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleClose} disabled={loading} className="flex-1">
              {leilaoExpirado ? 'Fechar' : 'Cancelar'}
            </Button>
            {!leilaoExpirado && (
              <Button
                onClick={handleLance}
                disabled={!isValorValido || loading || !valorLance}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <Gavel className="mr-2 h-4 w-4" />
                    Dar Lance
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
