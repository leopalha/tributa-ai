import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  ShoppingCart,
  CreditCard,
  Wallet,
  Shield,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  FileText,
  Clock,
  Zap,
} from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { PlatformFee } from '@/components/ui/platform-fee';
import { toast } from 'sonner';

interface CreditTitle {
  id: string;
  title: string;
  creditType: string;
  creditValue: number;
  currentPrice: number;
  seller: {
    name: string;
    verified: boolean;
  };
  documentation: {
    complete: boolean;
    verified: boolean;
  };
  legalProcedures: {
    transferType: string;
    processingTime: string;
    governmentApproval: boolean;
  };
}

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  credit: CreditTitle | null;
  onConfirm: (purchaseData: any) => void;
}

export function PurchaseModal({
  isOpen,
  onClose,
  credit,
  onConfirm
}: PurchaseModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'external'>('wallet');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedRisks, setAcceptedRisks] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!credit) return null;

  const platformFee = credit.currentPrice * 0.025;
  const totalAmount = credit.currentPrice + platformFee;

  const handlePurchase = async () => {
    if (!acceptedTerms) {
      toast.error('Você deve aceitar os termos e condições');
      return;
    }

    if (!acceptedRisks) {
      toast.error('Você deve aceitar os riscos da operação');
      return;
    }

    setIsProcessing(true);

    try {
      await onConfirm({
        creditId: credit.id,
        amount: credit.currentPrice,
        platformFee,
        totalAmount,
        paymentMethod,
        terms: {
          acceptedTerms,
          acceptedRisks,
          timestamp: new Date()
        }
      });

      toast.success('Compra realizada com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao processar compra');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Confirmar Compra
          </DialogTitle>
          <DialogDescription>
            Revise os detalhes e confirme a compra do título de crédito
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo do Título */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Resumo da Compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{credit.title}</p>
                <Badge variant="outline" className="mt-1">
                  {credit.creditType}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Vendedor</p>
                  <div className="flex items-center gap-1">
                    <p className="font-medium">{credit.seller.name}</p>
                    {credit.seller.verified && (
                      <Shield className="w-3 h-3 text-blue-500" />
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Valor do Título</p>
                  <p className="font-medium">{formatCurrency(credit.creditValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cálculos Financeiros */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Detalhamento Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Preço do Título:</span>
                <span className="font-medium">{formatCurrency(credit.currentPrice)}</span>
              </div>
              <PlatformFee value={credit.currentPrice} variant="default" />
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total a Pagar:</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Método de Pagamento */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Método de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={(value: 'wallet' | 'external') => setPaymentMethod(value)}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="wallet" id="wallet" />
                  <Label htmlFor="wallet" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      <span className="font-medium">Carteira Digital</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Pagamento instantâneo usando saldo da carteira
                    </p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="external" id="external" />
                  <Label htmlFor="external" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span className="font-medium">Pagamento Externo</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      PIX, cartão de crédito ou transferência bancária
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Informações Legais */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Informações Legais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Tipo de Transferência</p>
                  <p className="font-medium">{credit.legalProcedures.transferType}</p>
                </div>
                <div>
                  <p className="text-gray-600">Tempo de Processamento</p>
                  <p className="font-medium">{credit.legalProcedures.processingTime}</p>
                </div>
              </div>
              {credit.legalProcedures.governmentApproval && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Aprovação Governamental Necessária</p>
                    <p className="text-yellow-700">Esta transferência requer aprovação de órgãos governamentais.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documentação */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Status da Documentação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {credit.documentation.complete ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-600" />
                  )}
                  <span className="text-sm">
                    Documentação {credit.documentation.complete ? 'Completa' : 'Incompleta'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {credit.documentation.verified ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-600" />
                  )}
                  <span className="text-sm">
                    {credit.documentation.verified ? 'Verificada' : 'Pendente de Verificação'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Termos e Condições */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Termos e Condições</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                  Eu li e aceito os{' '}
                  <Button variant="link" className="p-0 h-auto text-blue-600">
                    termos e condições de compra
                  </Button>
                  {' '}da plataforma Tributa.AI, incluindo as taxas de serviço e procedimentos de transferência.
                </Label>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="risks" 
                  checked={acceptedRisks}
                  onCheckedChange={(checked) => setAcceptedRisks(checked as boolean)}
                />
                <Label htmlFor="risks" className="text-sm leading-relaxed cursor-pointer">
                  Declaro estar ciente dos riscos inerentes à compra de títulos de crédito tributário 
                  e aceito total responsabilidade pela operação.
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancelar
          </Button>
          <Button 
            onClick={handlePurchase} 
            disabled={!acceptedTerms || !acceptedRisks || isProcessing}
            className="bg-green-600 hover:bg-green-700"
          >
            {isProcessing ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Confirmar Compra - {formatCurrency(totalAmount)}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}