import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Star,
  TrendingUp,
  Award,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Trophy,
  Users,
  MessageSquare,
  ThumbsUp,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UserReputation {
  userId: string;
  userName: string;
  userAvatar?: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  score: number;
  totalTransactions: number;
  successfulTransactions: number;
  totalVolume: number;
  averageRating: number;
  totalRatings: number;
  badges: Badge[];
  joinedDate: Date;
  lastActive: Date;
  verificationStatus: 'unverified' | 'basic' | 'verified' | 'premium';
  stats: {
    asBuyer: TransactionStats;
    asSeller: TransactionStats;
  };
  reviews: Review[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedDate: Date;
}

interface TransactionStats {
  total: number;
  successful: number;
  volume: number;
  averageTime: number;
  rating: number;
}

interface Review {
  id: string;
  fromUserId: string;
  fromUserName: string;
  rating: number;
  comment: string;
  transactionId: string;
  date: Date;
  type: 'buyer' | 'seller';
}

interface UserReputationSystemProps {
  reputation: UserReputation;
  showFullProfile?: boolean;
  onViewProfile?: () => void;
  className?: string;
}

export function UserReputationSystem({
  reputation,
  showFullProfile = false,
  onViewProfile,
  className,
}: UserReputationSystemProps) {
  const getLevelColor = (level: string): string => {
    switch (level) {
      case 'bronze':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'silver':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
      case 'gold':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'platinum':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
      case 'diamond':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getVerificationIcon = () => {
    switch (reputation.verificationStatus) {
      case 'premium':
        return <ShieldCheck className="h-5 w-5 text-blue-600" />;
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'basic':
        return <CheckCircle className="h-5 w-5 text-gray-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
    }
  };

  const getSuccessRate = (): number => {
    if (reputation.totalTransactions === 0) return 0;
    return (reputation.successfulTransactions / reputation.totalTransactions) * 100;
  };

  const formatVolume = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      case 'rare':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'epic':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'legendary':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={cn(
              'h-4 w-4',
              star <= rating
                ? 'fill-yellow-500 text-yellow-500'
                : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
            )}
          />
        ))}
      </div>
    );
  };

  if (!showFullProfile) {
    // Compact view for listings
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <Avatar className="h-10 w-10">
          <AvatarImage src={reputation.userAvatar} alt={reputation.userName} />
          <AvatarFallback>{reputation.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{reputation.userName}</span>
            {getVerificationIcon()}
            <Badge className={cn('text-xs', getLevelColor(reputation.level))}>
              {reputation.level.toUpperCase()}
            </Badge>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <span>{reputation.averageRating.toFixed(1)}</span>
              <span>({reputation.totalRatings})</span>
            </div>
            <span>•</span>
            <span>{reputation.totalTransactions} transações</span>
            <span>•</span>
            <span>{getSuccessRate().toFixed(0)}% sucesso</span>
          </div>
        </div>

        {onViewProfile && (
          <button
            onClick={onViewProfile}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Ver perfil
          </button>
        )}
      </div>
    );
  }

  // Full profile view
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={reputation.userAvatar} alt={reputation.userName} />
              <AvatarFallback>{reputation.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold">{reputation.userName}</h3>
                {getVerificationIcon()}
                <Badge className={cn('text-sm', getLevelColor(reputation.level))}>
                  {reputation.level.toUpperCase()}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span>Membro desde {new Date(reputation.joinedDate).toLocaleDateString()}</span>
                <span>•</span>
                <span>
                  Última atividade: {new Date(reputation.lastActive).toLocaleDateString()}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Avaliação</p>
                  <div className="flex items-center gap-2">
                    <StarRating rating={reputation.averageRating} />
                    <span className="font-semibold">{reputation.averageRating.toFixed(1)}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Transações</p>
                  <p className="font-semibold">{reputation.totalTransactions}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Volume Total</p>
                  <p className="font-semibold">{formatVolume(reputation.totalVolume)}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                  <p className="font-semibold">{getSuccessRate().toFixed(0)}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reputation Score Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Pontuação de Reputação</span>
              <span className="text-sm font-bold">{reputation.score}/1000</span>
            </div>
            <Progress value={reputation.score / 10} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      {reputation.badges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {reputation.badges.map(badge => (
                <div
                  key={badge.id}
                  className={cn(
                    'p-3 rounded-lg text-center space-y-2',
                    getRarityColor(badge.rarity)
                  )}
                >
                  <div className="text-2xl">{badge.icon}</div>
                  <p className="font-medium text-sm">{badge.name}</p>
                  <p className="text-xs opacity-75">{badge.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Estatísticas de Negociação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="buyer" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buyer">Como Comprador</TabsTrigger>
              <TabsTrigger value="seller">Como Vendedor</TabsTrigger>
            </TabsList>

            <TabsContent value="buyer" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold">{reputation.stats.asBuyer.total}</p>
                  <p className="text-sm text-muted-foreground">Compras</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold">{reputation.stats.asBuyer.successful}</p>
                  <p className="text-sm text-muted-foreground">Bem-sucedidas</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-2xl font-bold">
                    {formatVolume(reputation.stats.asBuyer.volume)}
                  </p>
                  <p className="text-sm text-muted-foreground">Volume Total</p>
                </div>
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                  <p className="text-2xl font-bold">{reputation.stats.asBuyer.averageTime}d</p>
                  <p className="text-sm text-muted-foreground">Tempo Médio</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="seller" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold">{reputation.stats.asSeller.total}</p>
                  <p className="text-sm text-muted-foreground">Vendas</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold">{reputation.stats.asSeller.successful}</p>
                  <p className="text-sm text-muted-foreground">Bem-sucedidas</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-2xl font-bold">
                    {formatVolume(reputation.stats.asSeller.volume)}
                  </p>
                  <p className="text-sm text-muted-foreground">Volume Total</p>
                </div>
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                  <p className="text-2xl font-bold">{reputation.stats.asSeller.averageTime}d</p>
                  <p className="text-sm text-muted-foreground">Tempo Médio</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      {reputation.reviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Avaliações Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reputation.reviews.slice(0, 5).map(review => (
                <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {review.fromUserName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{review.fromUserName}</p>
                        <p className="text-xs text-muted-foreground">
                          {review.type === 'buyer' ? 'Comprador' : 'Vendedor'} •{' '}
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
