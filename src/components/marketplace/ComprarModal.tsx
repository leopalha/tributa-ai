import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DollarSign,
  Shield,
  Clock,
  FileText,
  CreditCard,
  Zap,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { CreditTitle } from '@/types/prisma';
import { useWallet } from '@/hooks/use-wallet';
import { PlatformFee } from '@/components/ui/platform-fee';

interface ComprarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titulo: CreditTitle;
  precoVenda: number;
  onSuccess?: () => void;
}

export function ComprarModal({
  open,
  onOpenChange,
  titulo,
  precoVenda,
  onSuccess,
}: ComprarModalProps) {
  const [loading, setLoading] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState<'PIX' | 'TRANSFERENCIA' | 'BLOCKCHAIN'>(
    'PIX'
  );
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [etapa, setEtapa] = useState<'detalhes' | 'pagamento' | 'processando' | 'concluido'>(
    'detalhes'
  );

  // Hooks
  const { balance } = useWallet();
  
  // Cálculos
  const valorTitulo = titulo.value;
  const desconto = valorTitulo - precoVenda;
  const percentualDesconto = (desconto / valorTitulo) * 100;
  const taxaPlataforma = precoVenda * 0.025; // 2.5%
  const valorTotal = precoVenda + taxaPlataforma;
  
  // Verificar se o usuário tem saldo suficiente
  const temSaldoSuficiente = balance && balance.availableBalance >= taxaPlataforma;

  const { payFee } = useWallet();

  const handleComprar = async () => {
    if (!aceitouTermos) {
      toast.error('Você deve aceitar os termos e condições');
      return;
    }

    if (!temSaldoSuficiente) {
      toast.error('Saldo insuficiente para pagar a taxa da plataforma');
      return;
    }

    setLoading(true);
    setEtapa('processando');

    try {
      // 1. Processar pagamento da taxa usando a wallet
      const feePaymentResult = await payFee(
        taxaPlataforma,
        `Taxa de compra do título ${titulo.title || titulo.id}`,
        titulo.id,
        'TOKEN_PURCHASE',
        true
      );

      if (!feePaymentResult.success) {
        throw new Error('Falha ao processar pagamento da taxa');
      }

      // 2. Simular processamento de pagamento do título
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. Simular transferência de titularidade
      await new Promise(resolve => setTimeout(resolve, 1500));

      setEtapa('concluido');

      toast.success('Compra realizada com sucesso!');

      setTimeout(() => {
        onSuccess?.();
        onOpenChange(false);
        setEtapa('detalhes');
      }, 2000);
    } catch (error) {
      console.error('Erro ao processar compra:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao processar compra');
      setEtapa('detalhes');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (etapa !== 'processando') {
      onOpenChange(false);
      setEtapa('detalhes');
      setAceitouTermos(false);
    }
  };

  if (etapa === 'processando') {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Processando Compra</h3>
            <p className="text-sm text-muted-foreground text-center">
              Validando pagamento e transferindo titularidade...
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
            <h3 className="text-lg font-semibold mb-2">Compra Realizada!</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              O título de crédito foi transferido para sua carteira.
            </p>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Token ID: {titulo.tokenizationInfo?.tokenAddress || 'TC-' + titulo.id}
            </Badge>
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
            <DollarSign className="h-5 w-5" />
            Comprar Título de Crédito
          </DialogTitle>
          <DialogDescription>Confirme os detalhes da compra e forma de pagamento</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Detalhes do Título */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{titulo.title || titulo.subtype}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Badge variant="secondary">{titulo.category}</Badge>
                <Badge variant="outline">{titulo.subtype}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Emissor:</span>
                  <p className="font-medium">{titulo.issuerName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Vencimento:</span>
                  <p className="font-medium">
                    {titulo.dueDate
                      ? new Date(titulo.dueDate).toLocaleDateString('pt-BR')
                      : 'Sem vencimento'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Valor Nominal:</span>
                  <p className="font-medium">{formatCurrency(valorTitulo)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="outline" className="ml-2">
                    {titulo.status}
                  </Badge>
                </div>
              </div>

              {/* Informações Blockchain */}
              {titulo.tokenizationInfo && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Tokenizado na Blockchain
                    </span>
                  </div>
                  <p className="text-xs text-blue-700">
                    Token: {titulo.tokenizationInfo.tokenAddress}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resumo Financeiro */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo da Compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Valor Nominal</span>
                  <span>{formatCurrency(valorTitulo)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Desconto ({percentualDesconto.toFixed(1)}%)</span>
                  <span>- {formatCurrency(desconto)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Preço de Venda</span>
                  <span className="font-medium">{formatCurrency(precoVenda)}</span>
                </div>
                <PlatformFee value={precoVenda} />
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total a Pagar</span>
                  <span>{formatCurrency(valorTotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pagamento da Taxa */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Taxa da Plataforma
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>Saldo disponível:</span>
                    <span className="font-medium">
                      {formatCurrency(balance?.availableBalance || 0)}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/dashboard/wallet">Depositar</a>
                  </Button>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="usar-saldo" 
                    checked={temSaldoSuficiente} 
                    disabled={!temSaldoSuficiente}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="usar-saldo"
                      className={`text-sm font-medium leading-none ${!temSaldoSuficiente ? 'text-muted-foreground' : ''}`}
                    >
                      Usar saldo da carteira para pagar taxa ({formatCurrency(taxaPlataforma)})
                    </label>
                    {!temSaldoSuficiente && (
                      <p className="text-xs text-red-500">
                        Saldo insuficiente. Faça um depósito para continuar.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Forma de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Forma de Pagamento (Valor do Título)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formaPagamento}
                onValueChange={(value: any) => setFormaPagamento(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PIX">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-600" />
                      PIX (Instantâneo)
                    </div>
                  </SelectItem>
                  <SelectItem value="TRANSFERENCIA">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      Transferência Bancária (1-2 dias úteis)
                    </div>
                  </SelectItem>
                  <SelectItem value="BLOCKCHAIN">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-purple-600" />
                      Transferência Blockchain
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {formaPagamento === 'PIX' && (
                <Alert className="mt-3">
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    O QR Code do PIX será gerado após a confirmação da compra.
                  </AlertDescription>
                </Alert>
              )}

              {formaPagamento === 'TRANSFERENCIA' && (
                <Alert className="mt-3">
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    Os dados bancários serão enviados por email após a confirmação.
                  </AlertDescription>
                </Alert>
              )}

              {formaPagamento === 'BLOCKCHAIN' && (
                <Alert className="mt-3">
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Pagamento direto via smart contract na blockchain.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Termos e Condições */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-2">
                <Checkbox id="termos" checked={aceitouTermos} onCheckedChange={setAceitouTermos} />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="termos"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Aceito os termos e condições
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Concordo com os{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      termos de compra
                    </a>{' '}
                    e{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      política de transferência
                    </a>
                    .
                  </p>
                </div>
              </div>

              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Importante:</strong> Após a confirmação do pagamento, a titularidade será
                  transferida automaticamente e não poderá ser revertida. Certifique-se de que todas
                  as informações estão corretas.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleClose} disabled={loading} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={handleComprar} 
              disabled={!aceitouTermos || loading || (!temSaldoSuficiente)} 
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Confirmar Compra
                </>
              )}
            </Button>
            
            {!temSaldoSuficiente && (
              <div className="col-span-2 mt-2">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    É necessário ter saldo suficiente para pagar a taxa da plataforma. 
                    <Button variant="link" className="p-0 h-auto" asChild>
                      <a href="/dashboard/wallet">Adicionar fundos à carteira</a>
                    </Button>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
