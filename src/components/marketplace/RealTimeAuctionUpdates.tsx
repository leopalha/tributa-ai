import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Clock,
  Gavel,
  TrendingUp,
  Users,
  Eye,
  Bell,
  BellOff,
  Zap,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Auction, AuctionStatus } from './AuctionSystem';

interface RealTimeAuctionUpdatesProps {
  auction: Auction;
  onBidUpdate?: (newBid: any) => void;
  onStatusChange?: (newStatus: AuctionStatus) => void;
  onTimeUpdate?: (timeRemaining: number) => void;
  isWatching?: boolean;
  onWatchToggle?: () => void;
}

interface LiveBid {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  timestamp: Date;
  isWinning: boolean;
}

export function RealTimeAuctionUpdates({
  auction,
  onBidUpdate,
  onStatusChange,
  onTimeUpdate,
  isWatching = false,
  onWatchToggle,
}: RealTimeAuctionUpdatesProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [liveBids, setLiveBids] = useState<LiveBid[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout>();
  const bidIntervalRef = useRef<NodeJS.Timeout>();

  // Calculate time remaining
  const calculateTimeRemaining = () => {
    const now = new Date().getTime();
    const endTime = new Date(auction.endDate).getTime();
    const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
    setTimeRemaining(remaining);

    // Update status if auction ended
    if (remaining === 0 && auction.status !== AuctionStatus.ENDED) {
      onStatusChange?.(AuctionStatus.ENDED);
    }

    // Update status if ending soon (last 30 minutes)
    if (remaining <= 1800 && remaining > 0 && auction.status === AuctionStatus.ACTIVE) {
      onStatusChange?.(AuctionStatus.ENDING_SOON);
    }

    onTimeUpdate?.(remaining);
  };

  // Format time remaining
  const formatTimeRemaining = (seconds: number): string => {
    if (seconds <= 0) return 'Encerrado';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Simulate real-time bid updates
  const simulateLiveBids = () => {
    if (auction.status !== AuctionStatus.ACTIVE && auction.status !== AuctionStatus.ENDING_SOON) {
      return;
    }

    // Random chance of new bid (higher chance when ending soon)
    const bidChance = auction.status === AuctionStatus.ENDING_SOON ? 0.3 : 0.1;

    if (Math.random() < bidChance) {
      const newBid: LiveBid = {
        id: `live-bid-${Date.now()}`,
        userId: `user-${Math.floor(Math.random() * 1000)}`,
        userName: `Investidor ${Math.floor(Math.random() * 100)}`,
        amount:
          auction.currentPrice +
          auction.minIncrement +
          Math.floor(Math.random() * auction.minIncrement * 2),
        timestamp: new Date(),
        isWinning: true,
      };

      setLiveBids(prev => [newBid, ...prev.slice(0, 4)]);
      onBidUpdate?.(newBid);
      setLastUpdate(new Date());
    }
  };

  // Get status color
  const getStatusColor = (): string => {
    switch (auction.status) {
      case AuctionStatus.ACTIVE:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case AuctionStatus.ENDING_SOON:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case AuctionStatus.ENDED:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case AuctionStatus.UPCOMING:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Get urgency level
  const getUrgencyLevel = (): 'low' | 'medium' | 'high' | 'critical' => {
    if (timeRemaining <= 300) return 'critical'; // 5 minutes
    if (timeRemaining <= 1800) return 'high'; // 30 minutes
    if (timeRemaining <= 3600) return 'medium'; // 1 hour
    return 'low';
  };

  useEffect(() => {
    // Initial calculation
    calculateTimeRemaining();

    // Set up time updates
    intervalRef.current = setInterval(calculateTimeRemaining, 1000);

    // Set up bid simulation
    bidIntervalRef.current = setInterval(simulateLiveBids, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (bidIntervalRef.current) clearInterval(bidIntervalRef.current);
    };
  }, [auction.endDate, auction.status]);

  const urgencyLevel = getUrgencyLevel();
  const isUrgent = urgencyLevel === 'high' || urgencyLevel === 'critical';

  return (
    <Card
      className={cn(
        'transition-all duration-300',
        isUrgent && 'ring-2 ring-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20'
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className={cn('h-5 w-5', isUrgent && 'text-amber-600 animate-pulse')} />
            Atualizações em Tempo Real
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={cn('px-2 py-1', getStatusColor())}>
              {auction.status === AuctionStatus.ACTIVE
                ? 'Ativo'
                : auction.status === AuctionStatus.ENDING_SOON
                  ? 'Terminando'
                  : auction.status === AuctionStatus.ENDED
                    ? 'Encerrado'
                    : auction.status === AuctionStatus.UPCOMING
                      ? 'Futuro'
                      : 'Desconhecido'}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onWatchToggle}
              className={cn(
                'h-8 w-8 p-0',
                isWatching && 'text-blue-600 bg-blue-50 dark:bg-blue-950'
              )}
            >
              {isWatching ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center gap-2 text-sm">
          <div
            className={cn('w-2 h-2 rounded-full', isConnected ? 'bg-green-500' : 'bg-red-500')}
          />
          <span className="text-muted-foreground">
            {isConnected ? 'Conectado' : 'Desconectado'} • Última atualização:{' '}
            {lastUpdate.toLocaleTimeString()}
          </span>
        </div>

        {/* Time Remaining */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Tempo Restante</span>
            <span
              className={cn(
                'font-bold text-lg',
                urgencyLevel === 'critical' && 'text-red-600 animate-pulse',
                urgencyLevel === 'high' && 'text-amber-600',
                urgencyLevel === 'medium' && 'text-orange-600',
                urgencyLevel === 'low' && 'text-green-600'
              )}
            >
              {formatTimeRemaining(timeRemaining)}
            </span>
          </div>
          <Progress
            value={
              auction.status === AuctionStatus.UPCOMING
                ? 0
                : auction.status === AuctionStatus.ENDED
                  ? 100
                  : ((new Date().getTime() - new Date(auction.startDate).getTime()) /
                      (new Date(auction.endDate).getTime() -
                        new Date(auction.startDate).getTime())) *
                    100
            }
            className={cn(
              'h-2',
              urgencyLevel === 'critical' && 'bg-red-100',
              urgencyLevel === 'high' && 'bg-amber-100'
            )}
          />
        </div>

        {/* Current Price */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Lance Atual</p>
              <p className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(auction.currentPrice)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Participantes</p>
              <p className="text-lg font-semibold">{auction.participants}</p>
            </div>
          </div>
        </div>

        {/* Live Bids */}
        {liveBids.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Gavel className="h-4 w-4" />
              Lances Recentes
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {liveBids.map(bid => (
                <div
                  key={bid.id}
                  className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3 text-green-600" />
                    <span className="text-sm font-medium">{bid.userName}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(bid.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {bid.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Urgency Alert */}
        {isUrgent && (
          <Alert
            className={cn(
              'border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800',
              urgencyLevel === 'critical' &&
                'border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800'
            )}
          >
            <AlertTriangle
              className={cn(
                'h-4 w-4',
                urgencyLevel === 'critical' ? 'text-red-600' : 'text-amber-600'
              )}
            />
            <AlertDescription
              className={cn(
                urgencyLevel === 'critical'
                  ? 'text-red-800 dark:text-red-200'
                  : 'text-amber-800 dark:text-amber-200'
              )}
            >
              {urgencyLevel === 'critical'
                ? '⚠️ Leilão termina em menos de 5 minutos! Lance agora para não perder!'
                : '⏰ Leilão termina em breve! Última chance de dar lance!'}
            </AlertDescription>
          </Alert>
        )}

        {/* Auction Ended */}
        {auction.status === AuctionStatus.ENDED && (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-800">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              ✅ Leilão encerrado! Verifique o resultado final.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
