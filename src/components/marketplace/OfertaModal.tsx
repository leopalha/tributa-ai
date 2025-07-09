import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  MessageSquare,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Loader2,
  FileText,
  TrendingDown,
  Shield,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { CreditTitle } from '@/types/prisma';

interface OfertaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titulo: CreditTitle;
  precoSugerido: number;
  onSuccess?: () => void;
}

export function OfertaModal({
  open,
  onOpenChange,
  titulo,
  precoSugerido,
  onSuccess,
}: OfertaModalProps) {
  const [loading, setLoading] = useState(false);
  const [valorOferta, setValorOferta] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [prazoValidade, setPrazoValidade] = useState('7'); // em dias
  const [etapa, setEtapa] = useState<'oferta' | 'processando' | 'concluido'>('oferta');

  // Cálculos
  const valorOriginal = titulo.value;
  const valorOfertaNum = parseFloat(valorOferta.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  const desconto = valorOriginal - valorOfertaNum;
  const percentualDesconto = valorOfertaNum > 0 ? (desconto / valorOriginal) * 100 : 0;
  const descontoSugerido = ((valorOriginal - precoSugerido) / valorOriginal) * 100;

  // Verificar se título está tokenizado
  const isTokenizado = titulo.status === 'TOKENIZED' && titulo.tokenizationInfo?.tokenAddress;

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    // Formatar como moeda brasileira
    const numericValue = valor.replace(/[^\d]/g, '');
    if (numericValue) {
      const formatted = (parseInt(numericValue) / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
      setValorOferta(formatted);
    } else {
      setValorOferta('');
    }
  };

  const handleOferta = async () => {
    if (!valorOfertaNum || valorOfertaNum <= 0) {
      toast.error('Informe um valor válido para a oferta');
      return;
    }

    if (valorOfertaNum >= valorOriginal) {
      toast.error('Valor da oferta deve ser menor que o valor nominal');
      return;
    }

    if (!isTokenizado) {
      toast.error('Apenas títulos tokenizados podem receber ofertas');
      return;
    }

    setLoading(true);
    setEtapa('processando');

    try {
      // Simular registro da oferta na blockchain
      await new Promise(resolve => setTimeout(resolve, 2500));

      setEtapa('concluido');

      toast.success('Oferta enviada com sucesso!');

      setTimeout(() => {
        onSuccess?.();
        onOpenChange(false);
        setEtapa('oferta');
        setValorOferta('');
        setMensagem('');
      }, 2000);
    } catch (error) {
      toast.error('Erro ao enviar oferta');
      setEtapa('oferta');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (etapa !== 'processando') {
      onOpenChange(false);
      setEtapa('oferta');
      setValorOferta('');
      setMensagem('');
    }
  };

  const sugerirValor = (percentual: number) => {
    const valorSugerido = valorOriginal * (1 - percentual / 100);
    const formatted = valorSugerido.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    setValorOferta(formatted);
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
              Apenas títulos tokenizados podem receber ofertas no marketplace.
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
            <h3 className="text-lg font-semibold mb-2">Enviando Oferta</h3>
            <p className="text-sm text-muted-foreground text-center">
              Registrando sua proposta na blockchain...
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
            <h3 className="text-lg font-semibold mb-2">Oferta Enviada!</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Sua proposta foi registrada e o vendedor será notificado.
            </p>
            <div className="text-center space-y-2">
              <p className="text-2xl font-bold text-green-600">{valorOferta}</p>
              <p className="text-sm text-muted-foreground">Válida por {prazoValidade} dias</p>
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
            <MessageSquare className="h-5 w-5" />
            Fazer Oferta
          </DialogTitle>
          <DialogDescription>
            Envie uma proposta personalizada para este título tokenizado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Detalhes do Título */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{titulo.title || titulo.subtype}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Badge variant="secondary">{titulo.category}</Badge>
                <Badge variant="outline">
                  Token: {titulo.tokenizationInfo?.tokenAddress?.slice(-8)}
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  <Shield className="h-3 w-3 mr-1" />
                  Tokenizado
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Valor Nominal:</span>
                  <p className="font-medium">{formatCurrency(valorOriginal)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Preço Sugerido:</span>
                  <p className="font-medium text-blue-600">{formatCurrency(precoSugerido)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Emissor:</span>
                  <p className="font-medium">{titulo.issuerName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Desconto Sugerido:</span>
                  <p className="font-medium text-green-600">{descontoSugerido.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Valor da Oferta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Valor da Oferta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Quanto você está disposto a pagar?
                </label>
                <Input
                  type="text"
                  placeholder="R$ 0,00"
                  value={valorOferta}
                  onChange={handleValorChange}
                  className="text-lg"
                />
              </div>

              {/* Sugestões de Valor */}
              <div>
                <p className="text-sm text-muted-foreground mb-3">Sugestões baseadas no mercado:</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => sugerirValor(10)}
                    className="text-xs"
                  >
                    10% desc.
                    <br />
                    {formatCurrency(valorOriginal * 0.9)}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => sugerirValor(15)}
                    className="text-xs"
                  >
                    15% desc.
                    <br />
                    {formatCurrency(valorOriginal * 0.85)}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => sugerirValor(20)}
                    className="text-xs"
                  >
                    20% desc.
                    <br />
                    {formatCurrency(valorOriginal * 0.8)}
                  </Button>
                </div>
              </div>

              {/* Análise da Oferta */}
              {valorOfertaNum > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <TrendingDown className="h-4 w-4" />
                    Análise da Oferta
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Valor Nominal:</span>
                      <span>{formatCurrency(valorOriginal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sua Oferta:</span>
                      <span className="font-medium">{formatCurrency(valorOfertaNum)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Desconto:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(desconto)} ({percentualDesconto.toFixed(1)}%)
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Economia:</span>
                      <span className="text-green-600">{formatCurrency(desconto)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mensagem e Prazo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Detalhes da Proposta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Mensagem para o vendedor (opcional)
                </label>
                <Textarea
                  placeholder="Ex: Interesse em adquirir para compensação de débitos ICMS..."
                  value={mensagem}
                  onChange={e => setMensagem(e.target.value)}
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {mensagem.length}/500 caracteres
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Prazo de validade da oferta
                </label>
                <Select value={prazoValidade} onValueChange={setPrazoValidade}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 dia</SelectItem>
                    <SelectItem value="3">3 dias</SelectItem>
                    <SelectItem value="7">7 dias</SelectItem>
                    <SelectItem value="15">15 dias</SelectItem>
                    <SelectItem value="30">30 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Informações Importantes */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs space-y-2">
              <p>
                <strong>Importante:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Ofertas são registradas na blockchain e não podem ser editadas</li>
                <li>O vendedor pode aceitar, recusar ou ignorar sua proposta</li>
                <li>Se aceita, você se compromete a adquirir o título pelo valor ofertado</li>
                <li>
                  A transferência de titularidade será automática após confirmação do pagamento
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleClose} disabled={loading} className="flex-1">
              Cancelar
            </Button>
            <Button
              onClick={handleOferta}
              disabled={!valorOfertaNum || valorOfertaNum <= 0 || loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Enviar Oferta
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
