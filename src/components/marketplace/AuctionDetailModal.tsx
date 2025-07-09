import React, { useState, useEffect } from 'react';
import {
  X,
  Gavel,
  Clock,
  Users,
  Eye,
  Star,
  DollarSign,
  Calendar,
  MapPin,
  Building,
  Shield,
  FileText,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  History,
  Share2,
  Download,
  ArrowLeft,
  ArrowRight,
  Timer,
  Award,
  Target,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Auction, AuctionStatus, AuctionType } from './AuctionSystem';

interface AuctionDetailModalProps {
  auction: Auction | null;
  isOpen: boolean;
  onClose: () => void;
  onPlaceBid?: (auctionId: string, amount: number) => Promise<boolean>;
  onWatchToggle?: (auctionId: string) => void;
  isWatching?: boolean;
}

export function AuctionDetailModal({
  auction,
  isOpen,
  onClose,
  onPlaceBid,
  onWatchToggle,
  isWatching = false,
}: AuctionDetailModalProps) {
  const [bidAmount, setBidAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [activeTab, setActiveTab] = useState('overview');

  // Atualizar tempo restante e progresso
  useEffect(() => {
    if (!auction) return;

    const updateTime = () => {
      const now = new Date();
      const start = new Date(auction.startDate);
      const end = new Date(auction.endDate);

      if (now < start) {
        setTimeLeft(`Inicia em ${formatTimeRemaining(start.getTime() - now.getTime())}`);
        setProgress(0);
      } else if (now > end) {
        setTimeLeft('Leilão encerrado');
        setProgress(100);
      } else {
        const total = end.getTime() - start.getTime();
        const elapsed = now.getTime() - start.getTime();
        const percentage = Math.min(100, Math.floor((elapsed / total) * 100));

        setTimeLeft(`Encerra em ${formatTimeRemaining(end.getTime() - now.getTime())}`);
        setProgress(percentage);
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [auction]);

  const formatTimeRemaining = (ms: number): string => {
    if (ms <= 0) return '0m 0s';

    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m ${seconds}s`;
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDateTime = (date: Date): string => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: AuctionStatus): string => {
    switch (status) {
      case AuctionStatus.ACTIVE:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case AuctionStatus.ENDING_SOON:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case AuctionStatus.ENDED:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case AuctionStatus.UPCOMING:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusText = (status: AuctionStatus): string => {
    switch (status) {
      case AuctionStatus.ACTIVE:
        return 'Ativo';
      case AuctionStatus.ENDING_SOON:
        return 'Terminando';
      case AuctionStatus.ENDED:
        return 'Encerrado';
      case AuctionStatus.UPCOMING:
        return 'Futuro';
      default:
        return 'Desconhecido';
    }
  };

  const getMinimumBid = (): number => {
    if (!auction) return 0;

    switch (auction.type) {
      case AuctionType.TRADITIONAL:
        return auction.currentPrice + auction.minIncrement;
      case AuctionType.REVERSE:
        return Math.max(0, auction.currentPrice - auction.minIncrement);
      case AuctionType.DUTCH:
        return auction.currentPrice;
      default:
        return auction.currentPrice;
    }
  };

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auction || !onPlaceBid) return;

    const amount = parseFloat(bidAmount);
    const minBid = getMinimumBid();

    if (isNaN(amount) || amount <= 0) {
      toast.error('Digite um valor válido para o lance.');
      return;
    }

    if (auction.type === AuctionType.TRADITIONAL && amount < minBid) {
      toast.error(`O lance mínimo é ${formatCurrency(minBid)}.`);
      return;
    }

    if (auction.type === AuctionType.REVERSE && amount > minBid) {
      toast.error(`O lance máximo é ${formatCurrency(minBid)}.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await onPlaceBid(auction.id, amount);
      if (success) {
        toast.success('Lance realizado com sucesso!');
        setBidAmount('');
      }
    } catch (error) {
      console.error('Erro ao dar lance:', error);
      toast.error('Erro ao realizar lance. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !auction) return null;

  const isUrgent = auction.status === AuctionStatus.ENDING_SOON;
  const canBid =
    auction.status === AuctionStatus.ACTIVE || auction.status === AuctionStatus.ENDING_SOON;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-full sm:max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-xl font-semibold">{auction.title}</h2>
              <p className="text-sm text-muted-foreground">{auction.creditTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Conteúdo Principal */}
          <div className="flex-1 overflow-y-auto p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="bids">Lances</TabsTrigger>
                <TabsTrigger value="documents">Documentos</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                {/* Status e Tempo */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Timer className="h-5 w-5" />
                      Status do Leilão
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Badge className={getStatusColor(auction.status)}>
                        {getStatusText(auction.status)}
                      </Badge>
                      <Badge variant="outline">
                        {auction.type === AuctionType.TRADITIONAL
                          ? 'Tradicional'
                          : auction.type === AuctionType.REVERSE
                            ? 'Reverso'
                            : auction.type === AuctionType.DUTCH
                              ? 'Holandês'
                              : 'Fechado'}
                      </Badge>
                      <Badge variant="secondary">{auction.category}</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tempo Restante</span>
                        <span
                          className={cn('font-medium', isUrgent && 'text-amber-600 font-semibold')}
                        >
                          {timeLeft}
                        </span>
                      </div>
                      <Progress value={progress} className={cn(isUrgent && 'bg-amber-100')} />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Início</p>
                        <p className="font-medium">{formatDateTime(auction.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Fim</p>
                        <p className="font-medium">{formatDateTime(auction.endDate)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Participantes</p>
                        <p className="font-medium">{auction.participants}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Visualizações</p>
                        <p className="font-medium">{auction.viewCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Informações do Crédito */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Informações do Crédito
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Valor do Crédito</p>
                          <p className="text-2xl font-bold">
                            {formatCurrency(auction.creditValue)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Lance Atual</p>
                          <p className="text-xl font-bold text-blue-600">
                            {formatCurrency(auction.currentPrice)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Incremento Mínimo</p>
                          <p className="font-medium">{formatCurrency(auction.minIncrement)}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Tipo de Crédito</p>
                          <p className="font-medium">{auction.creditType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Localização</p>
                          <p className="font-medium flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {auction.location}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total de Lances</p>
                          <p className="font-medium">{auction.totalBids}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Emissor */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Informações do Emissor
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{auction.issuer.name}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {auction.issuer.rating}
                          </span>
                          <span>{auction.issuer.transactions} transações</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {auction.compliance.kyc && (
                          <Badge variant="outline" className="text-green-600">
                            <Shield className="h-3 w-3 mr-1" />
                            KYC
                          </Badge>
                        )}
                        {auction.compliance.legal && (
                          <Badge variant="outline" className="text-blue-600">
                            <FileText className="h-3 w-3 mr-1" />
                            Legal
                          </Badge>
                        )}
                        {auction.compliance.fiscal && (
                          <Badge variant="outline" className="text-purple-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Fiscal
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Descrição */}
                <Card>
                  <CardHeader>
                    <CardTitle>Descrição</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{auction.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bids" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gavel className="h-5 w-5" />
                      Histórico de Lances
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {auction.bids.length === 0 ? (
                      <div className="text-center py-8">
                        <Gavel className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Nenhum lance realizado ainda.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {auction.bids
                          .sort(
                            (a, b) =>
                              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                          )
                          .map(bid => (
                            <div
                              key={bid.id}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div>
                                <p className="font-medium">{bid.userName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatDateTime(bid.timestamp)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">{formatCurrency(bid.amount)}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Documentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {auction.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-muted-foreground">{doc.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {doc.verified ? (
                              <Badge variant="outline" className="text-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verificado
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-amber-600">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Pendente
                              </Badge>
                            )}
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Estatísticas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{auction.totalBids}</p>
                          <p className="text-sm text-muted-foreground">Total de Lances</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <p className="text-2xl font-bold text-green-600">
                            {auction.participants}
                          </p>
                          <p className="text-sm text-muted-foreground">Participantes</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">{auction.viewCount}</p>
                          <p className="text-sm text-muted-foreground">Visualizações</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <p className="text-2xl font-bold text-amber-600">{auction.watchCount}</p>
                          <p className="text-sm text-muted-foreground">Favoritos</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Progresso
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progresso do Leilão</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Valor Atual vs. Inicial</span>
                          <span>
                            {auction.currentPrice > auction.initialPrice ? '+' : ''}
                            {formatCurrency(auction.currentPrice - auction.initialPrice)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {auction.currentPrice > auction.initialPrice ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm">
                            {((auction.currentPrice / auction.initialPrice - 1) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar com Ações */}
          <div className="w-80 border-l p-6 space-y-6">
            {/* Resumo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor do crédito:</span>
                    <span className="font-medium">{formatCurrency(auction.creditValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lance atual:</span>
                    <span className="font-bold text-lg text-blue-600">
                      {formatCurrency(auction.currentPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Incremento mínimo:</span>
                    <span>{formatCurrency(auction.minIncrement)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total de lances:</span>
                    <span>{auction.totalBids}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dar Lance */}
            {canBid && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dar Lance</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePlaceBid} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Valor do Lance</label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder={formatCurrency(getMinimumBid())}
                        value={bidAmount}
                        onChange={e => setBidAmount(e.target.value)}
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-muted-foreground">
                        Lance mínimo: {formatCurrency(getMinimumBid())}
                      </p>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting || !bidAmount}>
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Gavel className="h-4 w-4 mr-2" />
                          Dar Lance
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Ações */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onWatchToggle?.(auction.id)}
                >
                  <Star className="h-4 w-4 mr-2" />
                  {isWatching ? 'Não Acompanhar' : 'Acompanhar Leilão'}
                </Button>

                <Button variant="outline" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>

                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Dados
                </Button>
              </CardContent>
            </Card>

            {/* Alertas */}
            {isUrgent && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Atenção!</AlertTitle>
                <AlertDescription>
                  Este leilão termina em breve. Não perca a oportunidade!
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
