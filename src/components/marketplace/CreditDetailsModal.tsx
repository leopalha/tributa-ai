import React, { useState, useEffect } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Shield,
  Star,
  MapPin,
  Users,
  Gavel,
  ShoppingCart,
  MessageSquare,
  ExternalLink,
  Coins,
  TrendingUp,
  Clock,
  Verified,
  AlertTriangle,
  Info,
  Download,
  Copy
} from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { PlatformFee } from '@/components/ui/platform-fee';
import { toast } from 'sonner';

interface CreditTitle {
  id: string;
  title: string;
  description: string;
  creditType: string;
  creditValue: number;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  minBid: number;
  bidIncrement: number;
  timeRemaining: number;
  totalBids: number;
  participants: number;
  seller: {
    name: string;
    rating: number;
    verified: boolean;
    location: string;
    avatar: string;
    totalSales: number;
    memberSince: string;
    responseTime: string;
  };
  status: 'active' | 'ending_soon' | 'ended' | 'buy_now';
  category: 'auction' | 'buy_now' | 'negotiable';
  auctionType: 'traditional' | 'reverse' | 'dutch';
  startDate: string;
  endDate: string;
  tags: string[];
  documentation: {
    complete: boolean;
    verified: boolean;
    items: string[];
  };
  riskLevel: 'low' | 'medium' | 'high';
  liquidityScore: number;
  images: string[];
  tokenId?: string;
  blockchain?: string;
  guarantees: string[];
  legalProcedures: {
    transferType: string;
    requiredDocs: string[];
    processingTime: string;
    governmentApproval: boolean;
  };
  marketHistory: {
    priceHistory: { date: string; price: number }[];
    volumeHistory: { date: string; volume: number }[];
    similarCredits: number;
  };
}

interface CreditDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  credit: CreditTitle | null;
  onBuy: (credit: CreditTitle) => void;
  onBid: (credit: CreditTitle) => void;
  onNegotiate: (credit: CreditTitle) => void;
}

export function CreditDetailsModal({
  isOpen,
  onClose,
  credit,
  onBuy,
  onBid,
  onNegotiate
}: CreditDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!credit) return null;

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

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskText = (level: string) => {
    switch (level) {
      case 'low': return 'Baixo Risco';
      case 'medium': return 'Risco Moderado';
      case 'high': return 'Alto Risco';
      default: return 'Risco Indefinido';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="mx-4 sm:mx-auto max-w-full sm:max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                {credit.creditType}
              </Badge>
              <Badge className={getRiskColor(credit.riskLevel)}>
                <Shield className="w-3 h-3 mr-1" />
                {getRiskText(credit.riskLevel)}
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription className="text-lg font-medium">
            {credit.title}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Informações Principais */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Valor e Preço */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                    Informações Financeiras
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Valor do Título</p>
                    <p className="text-2xl font-bold">{formatCurrency(credit.creditValue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Preço Atual</p>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(credit.currentPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Desconto</p>
                    <p className="text-lg font-semibold text-blue-600">{credit.discount}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Economia</p>
                    <p className="text-lg font-semibold text-purple-600">
                      {formatCurrency(credit.creditValue - credit.currentPrice)}
                    </p>
                  </div>
                  <Separator />
                  <PlatformFee value={credit.currentPrice} variant="compact" />
                </CardContent>
              </Card>

              {/* Vendedor */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                    Vendedor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={credit.seller.avatar}
                      alt={credit.seller.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{credit.seller.name}</p>
                        {credit.seller.verified && (
                          <Verified className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{credit.seller.rating}</span>
                        <span className="text-sm text-gray-600">
                          ({credit.seller.totalSales} vendas)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{credit.seller.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>Membro desde {credit.seller.memberSince}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      <span>Responde em {credit.seller.responseTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status e Timeline */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-orange-600" />
                    Status e Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge className={
                      credit.status === 'active' ? 'bg-green-100 text-green-800' :
                      credit.status === 'ending_soon' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {credit.status === 'active' ? 'Ativo' :
                       credit.status === 'ending_soon' ? 'Terminando' : 'Encerrado'}
                    </Badge>
                  </div>
                  {credit.category === 'auction' && (
                    <div>
                      <p className="text-sm text-gray-600">Tempo Restante</p>
                      <p className="text-lg font-bold text-red-600">
                        {formatTimeRemaining(credit.timeRemaining)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Liquidez</p>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${credit.liquidityScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{credit.liquidityScore}%</span>
                    </div>
                  </div>
                  {credit.category === 'auction' && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Lances:</span>
                        <span>{credit.totalBids}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Participantes:</span>
                        <span>{credit.participants}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Tabs de Detalhes */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="documentation">Documentação</TabsTrigger>
                <TabsTrigger value="legal">Procedimentos</TabsTrigger>
                <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
                <TabsTrigger value="market">Mercado</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Descrição</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{credit.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {credit.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {credit.guarantees.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="w-5 h-5 mr-2" />
                        Garantias
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        {credit.guarantees.map((guarantee, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-sm">{guarantee}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="documentation" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Documentação
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status</span>
                        <Badge className={
                          credit.documentation.complete 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }>
                          {credit.documentation.complete ? 'Completa' : 'Incompleta'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Verificação</span>
                        <Badge className={
                          credit.documentation.verified 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }>
                          {credit.documentation.verified ? 'Verificada' : 'Pendente'}
                        </Badge>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-sm font-medium mb-2">Documentos Inclusos:</p>
                        <div className="space-y-2">
                          {credit.documentation.items.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm">{doc}</span>
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="legal" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Procedimentos Legais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Tipo de Transferência:</p>
                      <p className="text-sm text-gray-600">{credit.legalProcedures.transferType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Tempo de Processamento:</p>
                      <p className="text-sm text-gray-600">{credit.legalProcedures.processingTime}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Aprovação Governamental:</p>
                      <Badge className={
                        credit.legalProcedures.governmentApproval 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-green-100 text-green-800'
                      }>
                        {credit.legalProcedures.governmentApproval ? 'Necessária' : 'Não Necessária'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Documentos Necessários:</p>
                      <div className="space-y-1">
                        {credit.legalProcedures.requiredDocs.map((doc, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span className="text-sm">{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="blockchain" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Coins className="w-5 h-5 mr-2" />
                      Informações Blockchain
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {credit.tokenId && (
                      <div>
                        <p className="text-sm font-medium">Token ID:</p>
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {credit.tokenId}
                          </code>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyToClipboard(credit.tokenId!)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    {credit.blockchain && (
                      <div>
                        <p className="text-sm font-medium">Blockchain:</p>
                        <Badge variant="outline">{credit.blockchain}</Badge>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">Status de Tokenização:</p>
                      <Badge className="bg-green-100 text-green-800">Tokenizado</Badge>
                    </div>
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver na Blockchain
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="market" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Análise de Mercado
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium">Créditos Similares no Mercado:</p>
                        <p className="text-2xl font-bold">{credit.marketHistory.similarCredits}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Histórico de Preços (últimos 30 dias):</p>
                        <div className="h-24 bg-gray-50 rounded-lg flex items-center justify-center">
                          <span className="text-sm text-gray-500">Gráfico de preços</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Volume de Negociação:</p>
                        <div className="h-24 bg-gray-50 rounded-lg flex items-center justify-center">
                          <span className="text-sm text-gray-500">Gráfico de volume</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Fechar
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => onNegotiate(credit)}
              className="flex-1"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Negociar
            </Button>

            {credit.category === 'auction' && credit.status === 'active' && (
              <Button 
                onClick={() => onBid(credit)}
                className="flex-1"
              >
                <Gavel className="w-4 h-4 mr-2" />
                Dar Lance
              </Button>
            )}

            {credit.category === 'buy_now' && (
              <Button 
                onClick={() => onBuy(credit)}
                className="flex-1"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Comprar Agora
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}