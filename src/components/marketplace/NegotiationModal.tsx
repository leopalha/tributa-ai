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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  MessageSquare,
  DollarSign,
  Clock,
  User,
  FileText,
  Send,
  AlertCircle,
  Handshake,
  Calendar,
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
    responseTime: string;
  };
}

interface NegotiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  credit: CreditTitle | null;
  onConfirm: (negotiationData: any) => void;
}

export function NegotiationModal({
  isOpen,
  onClose,
  credit,
  onConfirm
}: NegotiationModalProps) {
  const [proposedPrice, setProposedPrice] = useState('');
  const [negotiationType, setNegotiationType] = useState<'price' | 'terms' | 'both'>('price');
  const [message, setMessage] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [deliveryTerms, setDeliveryTerms] = useState('');
  const [validityDays, setValidityDays] = useState('7');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!credit) return null;

  const proposedPriceNumber = parseFloat(proposedPrice) || 0;
  const platformFee = proposedPriceNumber * 0.025;
  const totalAmount = proposedPriceNumber + platformFee;
  const discount = credit.currentPrice > 0 ? ((credit.currentPrice - proposedPriceNumber) / credit.currentPrice) * 100 : 0;

  const handleNegotiation = async () => {
    if (negotiationType === 'price' || negotiationType === 'both') {
      if (proposedPriceNumber <= 0) {
        toast.error('Informe um valor válido para a proposta');
        return;
      }
      if (proposedPriceNumber >= credit.currentPrice) {
        toast.error('O valor proposto deve ser menor que o preço atual');
        return;
      }
    }

    if (!message.trim()) {
      toast.error('Adicione uma mensagem explicando sua proposta');
      return;
    }

    if (!acceptedTerms) {
      toast.error('Você deve aceitar os termos de negociação');
      return;
    }

    setIsProcessing(true);

    try {
      await onConfirm({
        creditId: credit.id,
        negotiationType,
        proposedPrice: proposedPriceNumber,
        message,
        paymentTerms: negotiationType === 'terms' || negotiationType === 'both' ? paymentTerms : undefined,
        deliveryTerms: negotiationType === 'terms' || negotiationType === 'both' ? deliveryTerms : undefined,
        validityDays: parseInt(validityDays),
        platformFee,
        totalAmount,
        terms: {
          acceptedTerms,
          timestamp: new Date()
        }
      });

      toast.success('Proposta de negociação enviada com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao enviar proposta');
    } finally {
      setIsProcessing(false);
    }
  };

  const getExpiryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + parseInt(validityDays));
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="mx-4 sm:mx-auto max-w-full sm:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Negociação Personalizada
          </DialogTitle>
          <DialogDescription>
            Faça uma proposta personalizada para o vendedor
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Título */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Título em Negociação</CardTitle>
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
                    <User className="w-3 h-3" />
                    <p className="font-medium">{credit.seller.name}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Tempo de Resposta</p>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <p className="font-medium">{credit.seller.responseTime}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Preço Atual</p>
                  <p className="font-medium text-green-600">{formatCurrency(credit.currentPrice)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Valor do Título</p>
                  <p className="font-medium">{formatCurrency(credit.creditValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tipo de Negociação */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Tipo de Negociação</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={negotiationType} onValueChange={(value: 'price' | 'terms' | 'both') => setNegotiationType(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="price" id="price" />
                  <Label htmlFor="price" className="cursor-pointer">
                    <div>
                      <p className="font-medium">Negociação de Preço</p>
                      <p className="text-sm text-gray-600">Propor um preço diferente</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="terms" id="terms" />
                  <Label htmlFor="terms" className="cursor-pointer">
                    <div>
                      <p className="font-medium">Negociação de Termos</p>
                      <p className="text-sm text-gray-600">Propor termos de pagamento ou entrega diferentes</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both" className="cursor-pointer">
                    <div>
                      <p className="font-medium">Negociação Completa</p>
                      <p className="text-sm text-gray-600">Propor preço e termos personalizados</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Proposta de Preço */}
          {(negotiationType === 'price' || negotiationType === 'both') && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Proposta de Preço
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="proposedPrice">Valor Proposto</Label>
                  <Input
                    id="proposedPrice"
                    type="number"
                    value={proposedPrice}
                    onChange={(e) => setProposedPrice(e.target.value)}
                    placeholder={`Atual: ${formatCurrency(credit.currentPrice)}`}
                    max={credit.currentPrice - 1}
                    step="0.01"
                    className="mt-1"
                  />
                  {proposedPriceNumber > 0 && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Desconto:</span>
                          <span className="font-medium text-blue-600">
                            {discount.toFixed(1)}% ({formatCurrency(credit.currentPrice - proposedPriceNumber)})
                          </span>
                        </div>
                        <PlatformFee value={proposedPriceNumber} variant="compact" />
                        <Separator />
                        <div className="flex justify-between font-bold">
                          <span>Total Final:</span>
                          <span>{formatCurrency(totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Termos Personalizados */}
          {(negotiationType === 'terms' || negotiationType === 'both') && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Termos Personalizados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="paymentTerms">Termos de Pagamento</Label>
                  <Textarea
                    id="paymentTerms"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    placeholder="Ex: Pagamento parcelado em 3x, desconto para pagamento à vista, etc."
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryTerms">Termos de Entrega/Transferência</Label>
                  <Textarea
                    id="deliveryTerms"
                    value={deliveryTerms}
                    onChange={(e) => setDeliveryTerms(e.target.value)}
                    placeholder="Ex: Transferência após confirmação de documentos, prazo estendido, etc."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mensagem da Proposta */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Mensagem da Proposta</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explique sua proposta de forma clara e profissional. Justifique o valor ou termos propostos..."
                rows={4}
                className="w-full"
              />
              <p className="text-xs text-gray-600 mt-1">
                Uma mensagem bem elaborada aumenta as chances de aceitação da proposta
              </p>
            </CardContent>
          </Card>

          {/* Validade da Proposta */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Validade da Proposta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="validityDays">Dias de Validade</Label>
                  <Input
                    id="validityDays"
                    type="number"
                    value={validityDays}
                    onChange={(e) => setValidityDays(e.target.value)}
                    min="1"
                    max="30"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Expira em</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">
                    {getExpiryDate()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumo da Proposta */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Handshake className="w-5 h-5" />
                Resumo da Proposta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tipo de Negociação:</span>
                <span className="font-medium">
                  {negotiationType === 'price' ? 'Preço' : 
                   negotiationType === 'terms' ? 'Termos' : 'Preço + Termos'}
                </span>
              </div>
              {(negotiationType === 'price' || negotiationType === 'both') && proposedPriceNumber > 0 && (
                <>
                  <div className="flex justify-between">
                    <span>Valor Proposto:</span>
                    <span className="font-medium">{formatCurrency(proposedPriceNumber)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Desconto:</span>
                    <span className="font-medium text-green-600">{discount.toFixed(1)}%</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span>Válida até:</span>
                <span className="font-medium">{getExpiryDate()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Termos de Negociação */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Termos de Negociação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="negotiationTerms" 
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                />
                <Label htmlFor="negotiationTerms" className="text-sm leading-relaxed cursor-pointer">
                  Eu li e aceito os{' '}
                  <Button variant="link" className="p-0 h-auto text-blue-600">
                    termos de negociação
                  </Button>
                  {' '}da plataforma, incluindo as taxas aplicáveis em caso de aceitação da proposta.
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Aviso */}
          <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800">Informação Importante</p>
              <p className="text-yellow-700">
                Esta proposta será enviada diretamente ao vendedor. Se aceita, você terá 24 horas 
                para efetuar o pagamento conforme os termos acordados.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancelar
          </Button>
          <Button 
            onClick={handleNegotiation} 
            disabled={!message.trim() || !acceptedTerms || isProcessing ||
              ((negotiationType === 'price' || negotiationType === 'both') && proposedPriceNumber <= 0)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isProcessing ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar Proposta
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}