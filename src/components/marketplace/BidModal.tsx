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
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Gavel,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  AlertTriangle,
  Target,
  Zap,
  History,
} from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { PlatformFee } from '@/components/ui/platform-fee';
import { toast } from 'sonner';

interface BidHistory {
  id: string;
  amount: number;
  bidder: string;
  timestamp: Date;
  isWinning: boolean;
}

interface CreditTitle {
  id: string;
  title: string;
  creditType: string;
  creditValue: number;
  currentPrice: number;
  minBid: number;
  bidIncrement: number;
  timeRemaining: number;
  totalBids: number;
  participants: number;
  bidHistory?: BidHistory[];
}

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  credit: CreditTitle | null;
  onConfirm: (bidData: any) => void;
}

export function BidModal({
  isOpen,
  onClose,
  credit,
  onConfirm
}: BidModalProps) {
  const [bidAmount, setBidAmount] = useState('');
  const [maxBid, setMaxBid] = useState('');
  const [autoincrement, setAutoincrement] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!credit) return null;

  const minimumBid = credit.currentPrice + credit.bidIncrement;
  const bidAmountNumber = parseFloat(bidAmount) || 0;
  const maxBidNumber = parseFloat(maxBid) || 0;
  const platformFee = bidAmountNumber * 0.025;
  const totalAmount = bidAmountNumber + platformFee;

  const formatTimeRemaining = (seconds: number): string => {
    if (seconds <= 0) return 'Encerrado';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const handleBid = async () => {
    if (bidAmountNumber < minimumBid) {
      toast.error(`Lance mínimo é ${formatCurrency(minimumBid)}`);
      return;
    }

    if (autoincrement && maxBidNumber <= bidAmountNumber) {
      toast.error('Lance máximo deve ser maior que o lance inicial');
      return;
    }

    if (!acceptedTerms) {
      toast.error('Você deve aceitar os termos do leilão');
      return;
    }

    setIsProcessing(true);

    try {
      await onConfirm({
        creditId: credit.id,
        bidAmount: bidAmountNumber,
        maxBid: autoincrement ? maxBidNumber : undefined,
        autoincrement,
        platformFee,
        totalAmount,
        terms: {
          acceptedTerms,
          timestamp: new Date()
        }
      });

      toast.success('Lance realizado com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao processar lance');
    } finally {
      setIsProcessing(false);
    }
  };

  const suggestedBids = [
    minimumBid,
    minimumBid + credit.bidIncrement,
    minimumBid + (credit.bidIncrement * 2),
    minimumBid + (credit.bidIncrement * 5)
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gavel className="w-5 h-5" />
            Dar Lance
          </DialogTitle>
          <DialogDescription>
            Participe do leilão e faça seu lance para este título de crédito
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Leilão */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Informações do Leilão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{credit.title}</p>
                <Badge variant="outline" className="mt-1">
                  {credit.creditType}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lance Atual:</span>
                    <span className="font-medium text-green-600">{formatCurrency(credit.currentPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lance Mínimo:</span>
                    <span className="font-medium">{formatCurrency(minimumBid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Incremento:</span>
                    <span className="font-medium">{formatCurrency(credit.bidIncrement)}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tempo Restante:</span>
                    <span className="font-medium text-red-600">{formatTimeRemaining(credit.timeRemaining)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total de Lances:</span>
                    <span className="font-medium">{credit.totalBids}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Participantes:</span>
                    <span className="font-medium">{credit.participants}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fazer Lance */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5" />
                Seu Lance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bidAmount">Valor do Lance</Label>
                <Input
                  id="bidAmount"
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Mínimo: ${formatCurrency(minimumBid)}`}
                  min={minimumBid}
                  step={credit.bidIncrement}
                  className="mt-1"
                />
                {bidAmountNumber > 0 && bidAmountNumber < minimumBid && (
                  <p className="text-sm text-red-600 mt-1">
                    Lance deve ser no mínimo {formatCurrency(minimumBid)}
                  </p>
                )}
              </div>

              {/* Sugestões de Lance */}
              <div>
                <Label className="text-sm text-gray-600">Sugestões Rápidas:</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {suggestedBids.map((amount, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setBidAmount(amount.toString())}
                      className="text-xs"
                    >
                      {formatCurrency(amount)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Lance Automático */}
              <div className="border rounded-lg p-4 bg-blue-50">
                <div className="flex items-center space-x-2 mb-3">
                  <Checkbox 
                    id="autoincrement" 
                    checked={autoincrement}
                    onCheckedChange={(checked) => setAutoincrement(checked as boolean)}
                  />
                  <Label htmlFor="autoincrement" className="font-medium cursor-pointer">
                    Ativar Lance Automático
                  </Label>
                </div>
                
                {autoincrement && (
                  <div>
                    <Label htmlFor="maxBid" className="text-sm">Lance Máximo</Label>
                    <Input
                      id="maxBid"
                      type="number"
                      value={maxBid}
                      onChange={(e) => setMaxBid(e.target.value)}
                      placeholder="Valor máximo que você está disposto a pagar"
                      min={bidAmountNumber + credit.bidIncrement}
                      step={credit.bidIncrement}
                      className="mt-1"
                    />
                    <p className="text-xs text-blue-600 mt-1">
                      O sistema fará lances automaticamente até este valor
                    </p>
                  </div>
                )}
              </div>

              {/* Cálculo de Taxas */}
              {bidAmountNumber > 0 && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium mb-3">Resumo Financeiro</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Valor do Lance:</span>
                      <span className="font-medium">{formatCurrency(bidAmountNumber)}</span>
                    </div>
                    <PlatformFee value={bidAmountNumber} variant="compact" />
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total se Vencer:</span>
                      <span>{formatCurrency(totalAmount)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Histórico de Lances */}
          {credit.bidHistory && credit.bidHistory.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Últimos Lances
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {credit.bidHistory.slice(0, 5).map((bid) => (
                    <div 
                      key={bid.id} 
                      className={`flex justify-between items-center p-2 rounded text-sm ${
                        bid.isWinning ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                      }`}
                    >
                      <div>
                        <span className="font-medium">{bid.bidder}</span>
                        {bid.isWinning && (
                          <Badge variant="secondary" className="ml-2 text-xs">Vencendo</Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(bid.amount)}</p>
                        <p className="text-xs text-gray-500">
                          {bid.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Termos do Leilão */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Termos do Leilão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="auctionTerms" 
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                />
                <Label htmlFor="auctionTerms" className="text-sm leading-relaxed cursor-pointer">
                  Eu li e aceito os{' '}
                  <Button variant="link" className="p-0 h-auto text-blue-600">
                    termos e condições do leilão
                  </Button>
                  , incluindo as regras de lance, taxas da plataforma e procedimentos em caso de vitória.
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Alertas */}
          <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800">Atenção</p>
              <p className="text-yellow-700">
                Em caso de vitória no leilão, você terá 24 horas para efetuar o pagamento. 
                O não pagamento resultará em penalidades conforme os termos da plataforma.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancelar
          </Button>
          <Button 
            onClick={handleBid} 
            disabled={bidAmountNumber < minimumBid || !acceptedTerms || isProcessing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Gavel className="w-4 h-4 mr-2" />
                Confirmar Lance - {formatCurrency(bidAmountNumber)}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}