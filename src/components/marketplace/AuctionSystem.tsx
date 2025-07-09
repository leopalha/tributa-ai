import React, { useState, useEffect } from 'react';
import {
  Gavel,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Timer,
  Clock,
  Users,
  TrendingUp,
  Banknote,
  ChevronRight,
  History,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export enum AuctionType {
  TRADITIONAL = 'TRADITIONAL', // Preço inicial baixo, lances crescentes
  REVERSE = 'REVERSE', // Preço máximo definido, lances decrescentes
  DUTCH = 'DUTCH', // Preço inicial alto e diminui até alguém aceitar
}

export enum AuctionStatus {
  UPCOMING = 'UPCOMING',
  ACTIVE = 'ACTIVE',
  ENDING_SOON = 'ENDING_SOON',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED',
}

export interface Bid {
  id: string;
  auctionId: string;
  userId: string;
  userName: string;
  amount: number;
  timestamp: Date;
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  creditId: string;
  creditTitle: string;
  creditValue: number;
  creditType: string;
  initialPrice: number;
  currentPrice: number;
  minIncrement: number;
  startDate: Date;
  endDate: Date;
  status: AuctionStatus;
  type: AuctionType;
  createdBy: string;
  bids: Bid[];
  totalBids: number;
  watchCount: number;
  minimumPrice?: number; // Preço de reserva (opcional)
  imageUrl?: string;
}

interface AuctionCardProps {
  auction: Auction;
  onBidClick: (auction: Auction) => void;
  onViewDetails: (auction: Auction) => void;
  className?: string;
}

interface AuctionListProps {
  auctions: Auction[];
  onBidClick: (auction: Auction) => void;
  onViewDetails: (auction: Auction) => void;
}

interface AuctionDetailProps {
  auction: Auction;
  onPlaceBid: (auctionId: string, amount: number) => Promise<boolean>;
  onWatchToggle: (auctionId: string) => void;
  isWatching: boolean;
}

interface PlaceBidProps {
  auction: Auction;
  onPlaceBid: (auctionId: string, amount: number) => Promise<boolean>;
  className?: string;
}

// Componente para cartão de leilão na listagem
const AuctionCard: React.FC<AuctionCardProps> = ({
  auction,
  onBidClick,
  onViewDetails,
  className,
}) => {
  // Calcula tempo restante
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(auction.endDate);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) return 'Encerrado';

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) return `${days}d ${hours}h`;
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Atualiza a cada minuto

    return () => clearInterval(timer);
  }, [auction.endDate]);

  // Determina status do leilão visualmente
  const getStatusColor = () => {
    switch (auction.status) {
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

  const getAuctionTypeIcon = () => {
    switch (auction.type) {
      case AuctionType.TRADITIONAL:
        return <ArrowUpNarrowWide className="h-4 w-4 mr-1" />;
      case AuctionType.REVERSE:
        return <ArrowDownNarrowWide className="h-4 w-4 mr-1" />;
      case AuctionType.DUTCH:
        return <TrendingUp className="h-4 w-4 mr-1" />;
      default:
        return <Gavel className="h-4 w-4 mr-1" />;
    }
  };

  const getAuctionTypeName = () => {
    switch (auction.type) {
      case AuctionType.TRADITIONAL:
        return 'Leilão Tradicional';
      case AuctionType.REVERSE:
        return 'Leilão Reverso';
      case AuctionType.DUTCH:
        return 'Leilão Holandês';
      default:
        return 'Leilão';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <Card className={cn('overflow-hidden transition-all hover:shadow-md', className)}>
      {auction.imageUrl && (
        <div className="aspect-[2/1] relative">
          <img src={auction.imageUrl} alt={auction.title} className="object-cover w-full h-full" />
          <Badge className={cn('absolute top-2 right-2 px-2 py-1', getStatusColor())}>
            {auction.status}
          </Badge>
        </div>
      )}

      <CardHeader className={auction.imageUrl ? 'pt-3 pb-2' : 'pb-2'}>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{auction.title}</CardTitle>
          {!auction.imageUrl && (
            <Badge className={cn('px-2 py-1', getStatusColor())}>{auction.status}</Badge>
          )}
        </div>
        <CardDescription className="flex items-center text-sm">
          {getAuctionTypeIcon()}
          {getAuctionTypeName()}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Valor do crédito:</span>
            <span className="font-medium">{formatCurrency(auction.creditValue)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {auction.type === AuctionType.REVERSE ? 'Preço máximo:' : 'Lance atual:'}
            </span>
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {formatCurrency(auction.currentPrice)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center text-xs text-muted-foreground">
              <Timer className="h-3.5 w-3.5 mr-1" />
              {timeLeft}
            </div>

            <div className="flex items-center text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5 mr-1" />
              {auction.totalBids} lance(s)
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-0">
        <Button variant="outline" size="sm" onClick={() => onViewDetails(auction)}>
          Detalhes
        </Button>

        <Button
          size="sm"
          disabled={
            auction.status !== AuctionStatus.ACTIVE && auction.status !== AuctionStatus.ENDING_SOON
          }
          onClick={() => onBidClick(auction)}
        >
          Dar Lance
        </Button>
      </CardFooter>
    </Card>
  );
};

// Componente para lista de leilões
export const AuctionList: React.FC<AuctionListProps> = ({
  auctions,
  onBidClick,
  onViewDetails,
}) => {
  const [filter, setFilter] = useState<AuctionStatus | 'ALL'>('ALL');

  const filteredAuctions =
    filter === 'ALL' ? auctions : auctions.filter(auction => auction.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Leilões no Marketplace</h2>

        <div className="flex space-x-2">
          <Button
            variant={filter === 'ALL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('ALL')}
          >
            Todos
          </Button>
          <Button
            variant={filter === AuctionStatus.ACTIVE ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(AuctionStatus.ACTIVE)}
          >
            Ativos
          </Button>
          <Button
            variant={filter === AuctionStatus.UPCOMING ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(AuctionStatus.UPCOMING)}
          >
            Futuros
          </Button>
          <Button
            variant={filter === AuctionStatus.ENDED ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(AuctionStatus.ENDED)}
          >
            Encerrados
          </Button>
        </div>
      </div>

      {filteredAuctions.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <Gavel className="h-12 w-12 text-muted-foreground opacity-30" />
            <h3 className="text-lg font-medium">Nenhum leilão encontrado</h3>
            <p className="text-muted-foreground max-w-sm">
              Não há leilões com os filtros selecionados. Tente mudar os filtros ou volte mais
              tarde.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map(auction => (
            <AuctionCard
              key={auction.id}
              auction={auction}
              onBidClick={onBidClick}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Componente para dar lance
const PlaceBid: React.FC<PlaceBidProps> = ({ auction, onPlaceBid, className }) => {
  const [bidAmount, setBidAmount] = useState<number | string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determina lance mínimo com base no tipo de leilão
  useEffect(() => {
    if (auction.type === AuctionType.TRADITIONAL) {
      // Para leilões tradicionais, o mínimo é o lance atual + incremento
      setBidAmount(auction.currentPrice + auction.minIncrement);
    } else if (auction.type === AuctionType.REVERSE) {
      // Para leilões reversos, o máximo é o lance atual - incremento
      setBidAmount(auction.currentPrice - auction.minIncrement);
    }
  }, [auction]);

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBidAmount(value === '' ? '' : Number(value));
    setError(null);
  };

  const validateBid = (): boolean => {
    const amount = typeof bidAmount === 'string' ? parseFloat(bidAmount) : bidAmount;

    if (!amount || isNaN(amount)) {
      setError('Por favor, informe um valor válido');
      return false;
    }

    if (auction.type === AuctionType.TRADITIONAL) {
      if (amount < auction.currentPrice + auction.minIncrement) {
        setError(
          `O lance mínimo é ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(auction.currentPrice + auction.minIncrement)}`
        );
        return false;
      }
    } else if (auction.type === AuctionType.REVERSE) {
      if (amount > auction.currentPrice - auction.minIncrement) {
        setError(
          `O lance máximo é ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(auction.currentPrice - auction.minIncrement)}`
        );
        return false;
      }

      if (auction.minimumPrice && amount < auction.minimumPrice) {
        setError(`O valor do lance está abaixo do valor mínimo para este item`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateBid()) return;

    setIsSubmitting(true);

    try {
      const amount = typeof bidAmount === 'string' ? parseFloat(bidAmount) : bidAmount;
      const success = await onPlaceBid(auction.id, amount);

      if (success) {
        toast.success('Lance realizado com sucesso!');
        // Reset para o próximo lance, se necessário
        if (auction.type === AuctionType.TRADITIONAL) {
          setBidAmount(amount + auction.minIncrement);
        } else if (auction.type === AuctionType.REVERSE) {
          setBidAmount(amount - auction.minIncrement);
        }
      }
    } catch (error) {
      console.error('Erro ao dar lance:', error);
      setError('Ocorreu um erro ao realizar o lance. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-semibold flex items-center">
        <Gavel className="h-5 w-5 mr-2" />
        Dar Lance
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {auction.type === AuctionType.TRADITIONAL ? 'Lance atual:' : 'Oferta atual:'}
            </span>
            <span>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                auction.currentPrice
              )}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {auction.type === AuctionType.TRADITIONAL
                ? 'Incremento mínimo:'
                : 'Decremento mínimo:'}
            </span>
            <span>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                auction.minIncrement
              )}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="bidAmount" className="text-sm font-medium">
            {auction.type === AuctionType.TRADITIONAL ? 'Seu lance:' : 'Sua oferta:'}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              R$
            </span>
            <Input
              id="bidAmount"
              type="number"
              value={bidAmount}
              onChange={handleBidChange}
              min={
                auction.type === AuctionType.TRADITIONAL
                  ? auction.currentPrice + auction.minIncrement
                  : 0
              }
              max={
                auction.type === AuctionType.REVERSE
                  ? auction.currentPrice - auction.minIncrement
                  : undefined
              }
              step="0.01"
              className="pl-10"
              placeholder="0,00"
              disabled={isSubmitting}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Spinner className="h-4 w-4 mr-2" /> : <Gavel className="h-4 w-4 mr-2" />}
          {auction.type === AuctionType.TRADITIONAL ? 'Confirmar Lance' : 'Confirmar Oferta'}
        </Button>
      </form>

      <Alert className="bg-blue-50 dark:bg-blue-900/20">
        <AlertTitle className="flex items-center">
          <Info className="h-4 w-4 mr-2" />
          {auction.type === AuctionType.TRADITIONAL
            ? 'Como funciona o leilão'
            : 'Como funciona o leilão reverso'}
        </AlertTitle>
        <AlertDescription className="text-sm">
          {auction.type === AuctionType.TRADITIONAL
            ? 'Neste leilão, o maior lance vence. Seu lance deve ser pelo menos o valor atual mais o incremento mínimo.'
            : 'Neste leilão reverso, o menor valor vence. Sua oferta deve ser menor que o valor atual menos o decremento mínimo.'}
        </AlertDescription>
      </Alert>
    </div>
  );
};

// Componente para detalhes do leilão
export const AuctionDetail: React.FC<AuctionDetailProps> = ({
  auction,
  onPlaceBid,
  onWatchToggle,
  isWatching,
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
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
  }, [auction.startDate, auction.endDate]);

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

  const formatDateTime = (date: Date): string => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3 space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{auction.title}</h1>
            <p className="text-muted-foreground mt-2">{auction.description}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
              <Gavel className="h-3.5 w-3.5" />
              {auction.type === AuctionType.TRADITIONAL
                ? 'Leilão Tradicional'
                : auction.type === AuctionType.REVERSE
                  ? 'Leilão Reverso'
                  : 'Leilão Holandês'}
            </Badge>

            <Badge
              className={cn(
                'flex items-center gap-1 px-3 py-1',
                auction.status === AuctionStatus.ACTIVE
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : auction.status === AuctionStatus.ENDING_SOON
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              )}
            >
              <Clock className="h-3.5 w-3.5" />
              {auction.status}
            </Badge>

            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
              <Users className="h-3.5 w-3.5" />
              {auction.totalBids} lance(s)
            </Badge>
          </div>

          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <h3 className="font-medium">Progresso do Leilão</h3>
              <span className="text-sm text-muted-foreground">{timeLeft}</span>
            </div>

            <Progress value={progress} className="h-2" />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Início: {formatDateTime(auction.startDate)}</span>
              <span>Término: {formatDateTime(auction.endDate)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium">Informações do Crédito</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Título do Crédito</p>
                <p className="font-medium">{auction.creditTitle}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Tipo de Crédito</p>
                <p className="font-medium">{auction.creditType}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Valor do Crédito</p>
                <p className="font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    auction.creditValue
                  )}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {auction.type === AuctionType.TRADITIONAL ? 'Preço Inicial' : 'Preço Máximo'}
                </p>
                <p className="font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    auction.initialPrice
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium flex items-center">
              <History className="h-5 w-5 mr-2" />
              Histórico de Lances
            </h3>

            {auction.bids.length === 0 ? (
              <div className="text-center py-8 border rounded-lg">
                <p className="text-muted-foreground">Nenhum lance registrado ainda</p>
              </div>
            ) : (
              <div className="border rounded-lg divide-y">
                {auction.bids.map(bid => (
                  <div key={bid.id} className="flex justify-between p-3">
                    <div>
                      <p className="font-medium">{bid.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(bid.timestamp).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          'font-medium',
                          auction.type === AuctionType.TRADITIONAL
                            ? 'text-green-600'
                            : 'text-blue-600'
                        )}
                      >
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(bid.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="md:w-1/3 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Banknote className="h-5 w-5 mr-2" />
                Resumo do Leilão
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor do crédito:</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      auction.creditValue
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lance atual:</span>
                  <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      auction.currentPrice
                    )}
                  </span>
                </div>

                {auction.type === AuctionType.REVERSE && auction.minimumPrice && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preço mínimo:</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(auction.minimumPrice)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Incremento mínimo:</span>
                  <span>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      auction.minIncrement
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total de lances:</span>
                  <span>{auction.totalBids}</span>
                </div>
              </div>

              {auction.status === AuctionStatus.ACTIVE ||
              auction.status === AuctionStatus.ENDING_SOON ? (
                <PlaceBid auction={auction} onPlaceBid={onPlaceBid} />
              ) : (
                <Alert>
                  <AlertTitle>
                    Leilão {auction.status === AuctionStatus.ENDED ? 'Encerrado' : 'Não Iniciado'}
                  </AlertTitle>
                  <AlertDescription>
                    {auction.status === AuctionStatus.ENDED
                      ? 'Este leilão já foi encerrado e não aceita mais lances.'
                      : 'Este leilão ainda não foi iniciado. Você pode acompanhá-lo para ser notificado quando começar.'}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => onWatchToggle(auction.id)}
              >
                {isWatching ? 'Não Acompanhar' : 'Acompanhar Leilão'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Sistema de Leilões Principal
export function AuctionSystem() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [isWatching, setIsWatching] = useState<boolean>(false);
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Carrega os dados de leilões (simulados para demonstração)
  useEffect(() => {
    const loadAuctions = async () => {
      setIsLoading(true);

      try {
        // Simular chamada à API
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Dados simulados
        const mockAuctions: Auction[] = [
          {
            id: '1',
            title: 'Crédito Tributário ICMS - Empresa ABC',
            description:
              'Crédito tributário de ICMS da Empresa ABC, validado e pronto para compensação.',
            creditId: 'cred-123',
            creditTitle: 'TC ICMS - Processo 1234/2023',
            creditValue: 150000,
            creditType: 'TRIBUTARIO/ICMS',
            initialPrice: 120000,
            currentPrice: 125000,
            minIncrement: 1000,
            startDate: new Date(Date.now() - 3600000 * 24), // 24h atrás
            endDate: new Date(Date.now() + 3600000 * 48), // 48h à frente
            status: AuctionStatus.ACTIVE,
            type: AuctionType.TRADITIONAL,
            createdBy: 'user-123',
            bids: [
              {
                id: 'bid-1',
                auctionId: '1',
                userId: 'user-456',
                userName: 'João Silva',
                amount: 121000,
                timestamp: new Date(Date.now() - 3600000 * 12),
              },
              {
                id: 'bid-2',
                auctionId: '1',
                userId: 'user-789',
                userName: 'Maria Souza',
                amount: 125000,
                timestamp: new Date(Date.now() - 3600000 * 6),
              },
            ],
            totalBids: 2,
            watchCount: 15,
            imageUrl:
              'https://images.unsplash.com/photo-1565514501303-026e59011dc4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8dGF4fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
          },
          {
            id: '2',
            title: 'Crédito Precatório Federal - Processo 5432/2022',
            description:
              'Precatório federal validado pela União, com pagamento previsto para o próximo ano.',
            creditId: 'cred-456',
            creditTitle: 'Precatório União - Processo 5432/2022',
            creditValue: 500000,
            creditType: 'JUDICIAL/PRECATORIO_FEDERAL',
            initialPrice: 450000,
            currentPrice: 380000,
            minIncrement: 5000,
            startDate: new Date(Date.now() - 3600000 * 48), // 48h atrás
            endDate: new Date(Date.now() + 3600000 * 24), // 24h à frente
            status: AuctionStatus.ENDING_SOON,
            type: AuctionType.REVERSE,
            createdBy: 'user-123',
            bids: [
              {
                id: 'bid-3',
                auctionId: '2',
                userId: 'user-456',
                userName: 'João Silva',
                amount: 400000,
                timestamp: new Date(Date.now() - 3600000 * 24),
              },
              {
                id: 'bid-4',
                auctionId: '2',
                userId: 'user-789',
                userName: 'Maria Souza',
                amount: 390000,
                timestamp: new Date(Date.now() - 3600000 * 12),
              },
              {
                id: 'bid-5',
                auctionId: '2',
                userId: 'user-101',
                userName: 'Carlos Oliveira',
                amount: 380000,
                timestamp: new Date(Date.now() - 3600000 * 6),
              },
            ],
            totalBids: 3,
            watchCount: 28,
            minimumPrice: 350000,
            imageUrl:
              'https://images.unsplash.com/photo-1589666564459-93cdd3ab856a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8bGF3fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
          },
          {
            id: '3',
            title: 'Crédito Carbono Voluntário - 1000 tCO2e',
            description:
              'Créditos de carbono validados pelo padrão VCS, de projeto de conservação florestal.',
            creditId: 'cred-789',
            creditTitle: 'Certificado de Crédito de Carbono - Projeto Amazônia',
            creditValue: 250000,
            creditType: 'AMBIENTAL/CREDITO_CARBONO_VOLUNTARIO',
            initialPrice: 280000,
            currentPrice: 250000,
            minIncrement: 2000,
            startDate: new Date(Date.now() + 3600000 * 24), // 24h à frente
            endDate: new Date(Date.now() + 3600000 * 72), // 72h à frente
            status: AuctionStatus.UPCOMING,
            type: AuctionType.DUTCH,
            createdBy: 'user-123',
            bids: [],
            totalBids: 0,
            watchCount: 7,
          },
          {
            id: '4',
            title: 'Crédito PIS/COFINS - 2022',
            description: 'Créditos de PIS/COFINS validados e homologados pela Receita Federal.',
            creditId: 'cred-101',
            creditTitle: 'Crédito PIS/COFINS - Período 2022',
            creditValue: 80000,
            creditType: 'TRIBUTARIO/PIS_COFINS',
            initialPrice: 70000,
            currentPrice: 75000,
            minIncrement: 500,
            startDate: new Date(Date.now() - 3600000 * 72), // 72h atrás
            endDate: new Date(Date.now() - 3600000 * 24), // 24h atrás
            status: AuctionStatus.ENDED,
            type: AuctionType.TRADITIONAL,
            createdBy: 'user-123',
            bids: [
              {
                id: 'bid-6',
                auctionId: '4',
                userId: 'user-456',
                userName: 'João Silva',
                amount: 72000,
                timestamp: new Date(Date.now() - 3600000 * 48),
              },
              {
                id: 'bid-7',
                auctionId: '4',
                userId: 'user-789',
                userName: 'Maria Souza',
                amount: 75000,
                timestamp: new Date(Date.now() - 3600000 * 36),
              },
            ],
            totalBids: 2,
            watchCount: 5,
          },
        ];

        setAuctions(mockAuctions);
      } catch (error) {
        console.error('Erro ao carregar leilões:', error);
        toast.error('Erro ao carregar leilões. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAuctions();
  }, []);

  const handleBidClick = (auction: Auction) => {
    setSelectedAuction(auction);
    setView('detail');
  };

  const handleViewDetails = (auction: Auction) => {
    setSelectedAuction(auction);
    setView('detail');
  };

  const handlePlaceBid = async (auctionId: string, amount: number): Promise<boolean> => {
    // Simular chamada à API
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Atualizar estado local
    setAuctions(prev =>
      prev.map(auction => {
        if (auction.id === auctionId) {
          const updatedBids = [
            ...auction.bids,
            {
              id: `bid-${Date.now()}`,
              auctionId,
              userId: 'user-current',
              userName: 'Você',
              amount,
              timestamp: new Date(),
            },
          ];

          return {
            ...auction,
            currentPrice:
              auction.type === AuctionType.REVERSE
                ? Math.min(auction.currentPrice, amount)
                : Math.max(auction.currentPrice, amount),
            bids: updatedBids,
            totalBids: auction.totalBids + 1,
          };
        }
        return auction;
      })
    );

    // Atualizar o leilão selecionado também
    if (selectedAuction && selectedAuction.id === auctionId) {
      setSelectedAuction(prev => {
        if (!prev) return null;

        const updatedBids = [
          ...prev.bids,
          {
            id: `bid-${Date.now()}`,
            auctionId,
            userId: 'user-current',
            userName: 'Você',
            amount,
            timestamp: new Date(),
          },
        ];

        return {
          ...prev,
          currentPrice:
            prev.type === AuctionType.REVERSE
              ? Math.min(prev.currentPrice, amount)
              : Math.max(prev.currentPrice, amount),
          bids: updatedBids,
          totalBids: prev.totalBids + 1,
        };
      });
    }

    return true;
  };

  const handleWatchToggle = (auctionId: string) => {
    setIsWatching(!isWatching);
    toast.success(
      !isWatching
        ? 'Você está agora acompanhando este leilão!'
        : 'Você deixou de acompanhar este leilão.'
    );
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedAuction(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-8 w-8 text-blue-600" />
        <span className="ml-3 text-lg">Carregando leilões...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {view === 'list' ? (
        <AuctionList
          auctions={auctions}
          onBidClick={handleBidClick}
          onViewDetails={handleViewDetails}
        />
      ) : selectedAuction ? (
        <div className="space-y-4">
          <Button variant="ghost" className="flex items-center mb-4" onClick={handleBackToList}>
            <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
            Voltar para lista de leilões
          </Button>

          <AuctionDetail
            auction={selectedAuction}
            onPlaceBid={handlePlaceBid}
            onWatchToggle={handleWatchToggle}
            isWatching={isWatching}
          />
        </div>
      ) : null}
    </div>
  );
}
