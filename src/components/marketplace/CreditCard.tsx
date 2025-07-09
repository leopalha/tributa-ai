import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Heart,
  Bell,
  Clock,
  Users,
  Gavel,
  ShoppingCart,
  MessageSquare,
  Star,
  MapPin,
  Verified,
  Eye,
  TrendingUp,
  Shield,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CreditCardProps {
  credit: {
    id: string;
    title: string;
    description: string;
    creditType: string;
    creditValue: number;
    currentPrice: number;
    originalPrice: number;
    discount: number;
    minBid?: number;
    bidIncrement?: number;
    timeRemaining?: number;
    totalBids?: number;
    participants?: number;
    seller: {
      name: string;
      rating: number;
      verified: boolean;
      location: string;
      avatar: string;
      totalSales: number;
    };
    status: 'active' | 'ending_soon' | 'ended' | 'buy_now';
    category: 'auction' | 'buy_now' | 'negotiable';
    auctionType?: 'traditional' | 'reverse' | 'dutch';
    tags: string[];
    documentation: {
      complete: boolean;
      verified: boolean;
      items: string[];
    };
    riskLevel: 'low' | 'medium' | 'high';
    liquidityScore: number;
    images: string[];
    botGenerated?: boolean;
  };
  isFavorite?: boolean;
  isWatching?: boolean;
  viewMode?: 'grid' | 'list';
  onToggleFavorite?: (creditId: string) => void;
  onToggleWatch?: (creditId: string) => void;
  onBuyNow?: (credit: any) => void;
  onPlaceBid?: (credit: any) => void;
  onNegotiate?: (credit: any) => void;
  onViewDetails?: (credit: any) => void;
}

export function CreditCard({
  credit,
  isFavorite = false,
  isWatching = false,
  viewMode = 'grid',
  onToggleFavorite,
  onToggleWatch,
  onBuyNow,
  onPlaceBid,
  onNegotiate,
  onViewDetails,
}: CreditCardProps) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-blue-600 bg-blue-100';
      case 'ending_soon':
        return 'text-red-600 bg-red-100';
      case 'ended':
        return 'text-gray-600 bg-gray-100';
      case 'buy_now':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleBuyNow = () => {
    onBuyNow?.(credit);
    toast.success(`Compra iniciada: ${credit.title}`);
  };

  const handlePlaceBid = () => {
    onPlaceBid?.(credit);
    toast.success(`Lance iniciado: ${credit.title}`);
  };

  const handleNegotiate = () => {
    onNegotiate?.(credit);
    toast.success(`Negociação iniciada: ${credit.title}`);
  };

  const handleToggleFavorite = () => {
    onToggleFavorite?.(credit.id);
  };

  const handleToggleWatch = () => {
    onToggleWatch?.(credit.id);
  };

  const handleViewDetails = () => {
    onViewDetails?.(credit);
  };

  // Grid view (padrão)
  return (
    <Card className="hover:shadow-lg transition-all duration-200 h-full flex flex-col">
      <CardHeader className="p-4 pb-2">
        {/* Header com favoritos e notificações */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg line-clamp-2 mb-1">{credit.title}</h3>
            <div className="flex items-center gap-2">
              <Badge className={getRiskColor(credit.riskLevel)} variant="secondary">
                {credit.riskLevel === 'low'
                  ? 'Baixo Risco'
                  : credit.riskLevel === 'medium'
                    ? 'Médio Risco'
                    : 'Alto Risco'}
              </Badge>
              <Badge className={getStatusColor(credit.status)} variant="secondary">
                {credit.status === 'active'
                  ? 'Ativo'
                  : credit.status === 'ending_soon'
                    ? 'Terminando'
                    : credit.status === 'ended'
                      ? 'Encerrado'
                      : 'Compra Direta'}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFavorite}
              className={cn('h-8 w-8 p-0', isFavorite && 'text-red-500')}
            >
              <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleWatch}
              className={cn('h-8 w-8 p-0', isWatching && 'text-blue-500')}
            >
              <Bell className={cn('w-4 h-4', isWatching && 'fill-current')} />
            </Button>
          </div>
        </div>

        {/* Imagem */}
        <div className="w-full h-48 bg-gray-100 rounded-lg mb-3">
          <img
            src={credit.images[0] || '/placeholder-credit.png'}
            alt={credit.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Tipo de crédito e tags */}
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="font-medium">
            {credit.creditType}
          </Badge>
          {credit.botGenerated && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              <Zap className="w-3 h-3 mr-1" />
              Bot
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-1 flex flex-col">
        {/* Descrição */}
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{credit.description}</p>

        {/* Vendedor */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-8 h-8">
            <AvatarImage src={credit.seller.avatar} />
            <AvatarFallback>{credit.seller.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium truncate">{credit.seller.name}</p>
              {credit.seller.verified && <Verified className="w-4 h-4 text-blue-500" />}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-current text-yellow-500" />
                <span>{credit.seller.rating}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{credit.seller.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preços */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Preço Atual</span>
            <span className="text-2xl font-bold text-blue-600">
              {formatCurrency(credit.currentPrice)}
            </span>
          </div>
          {credit.discount > 0 && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Valor Original</span>
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(credit.originalPrice)}
              </span>
            </div>
          )}
          {credit.discount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Desconto</span>
              <span className="text-lg font-semibold text-green-600">{credit.discount}%</span>
            </div>
          )}
        </div>

        {/* Informações do leilão (se aplicável) */}
        {credit.category === 'auction' && (
          <div className="flex items-center justify-between text-sm mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span
                className={
                  credit.status === 'ending_soon' ? 'text-red-600 font-medium' : 'text-gray-600'
                }
              >
                {formatTimeRemaining(credit.timeRemaining || 0)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Gavel className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{credit.totalBids || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{credit.participants || 0}</span>
              </div>
            </div>
          </div>
        )}

        {/* Documentação e liquidez */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span>{credit.documentation.verified ? 'Verificado' : 'Pendente'}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Liquidez: {credit.liquidityScore}%</span>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="mt-auto space-y-2">
          {credit.category === 'buy_now' && (
            <Button
              onClick={handleBuyNow}
              className="w-full bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Comprar Agora
            </Button>
          )}
          {credit.category === 'auction' && (
            <Button
              onClick={handlePlaceBid}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <Gavel className="w-4 h-4 mr-2" />
              Dar Lance
            </Button>
          )}
          {credit.category === 'negotiable' && (
            <Button
              onClick={handleNegotiate}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="sm"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Negociar
            </Button>
          )}
          <Button variant="outline" onClick={handleViewDetails} className="w-full" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
