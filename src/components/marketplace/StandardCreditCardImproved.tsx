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
    timeRemaining?: number;
    totalBids?: number;
    participants?: number;
    seller: {
      name: string;
      rating: number;
      verified: boolean;
      location: string;
      avatar?: string;
    };
    status: 'active' | 'ending_soon' | 'ended' | 'buy_now';
    category: 'auction' | 'buy_now' | 'negotiable';
    riskLevel: 'low' | 'medium' | 'high';
    liquidityScore: number;
    images?: string[];
    botGenerated?: boolean;
  };
  isFavorite?: boolean;
  isWatching?: boolean;
  onToggleFavorite?: (creditId: string) => void;
  onToggleWatch?: (creditId: string) => void;
  onBuyNow?: (credit: any) => void;
  onPlaceBid?: (credit: any) => void;
  onNegotiate?: (credit: any) => void;
  onViewDetails?: (credit: any) => void;
}

export function StandardCreditCardImproved({
  credit,
  isFavorite = false,
  isWatching = false,
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

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuyNow?.(credit);
    toast.success(`Compra iniciada: ${credit.title}`);
  };

  const handlePlaceBid = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlaceBid?.(credit);
    toast.success(`Lance iniciado: ${credit.title}`);
  };

  const handleNegotiate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNegotiate?.(credit);
    toast.success(`Negociação iniciada: ${credit.title}`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(credit.id);
    toast.success(isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
  };

  const handleToggleWatch = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWatch?.(credit.id);
    toast.success(isWatching ? 'Notificações desativadas' : 'Notificações ativadas');
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails?.(credit);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer w-full h-[520px] flex flex-col">
      <CardHeader className="p-4 pb-2 flex-shrink-0">
        {/* Header com favoritos e notificações */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg line-clamp-2 mb-2 min-h-[56px]">{credit.title}</h3>
            <div className="flex items-center gap-2 flex-wrap">
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

        {/* Imagem padronizada */}
        <div className="w-full h-40 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
          {credit.images && credit.images.length > 0 ? (
            <img src={credit.images[0]} alt={credit.title} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-medium">Título de Crédito</p>
              <p className="text-xs text-gray-400">{credit.creditType}</p>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-1 flex flex-col">
        {/* Informações do vendedor */}
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="w-6 h-6">
            <AvatarImage src={credit.seller.avatar} />
            <AvatarFallback className="text-xs">{credit.seller.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{credit.seller.name}</p>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-xs text-gray-600">{credit.seller.rating}</span>
              {credit.seller.verified && <Verified className="w-3 h-3 text-blue-500" />}
            </div>
          </div>
        </div>

        {/* Preços */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">Preço atual</span>
            <span className="text-lg font-bold text-green-600">
              {formatCurrency(credit.currentPrice)}
            </span>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">Valor original</span>
            <span className="text-sm text-gray-500 line-through">
              {formatCurrency(credit.originalPrice)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Desconto</span>
            <span className="text-sm font-semibold text-red-600">{credit.discount}%</span>
          </div>
        </div>

        {/* Informações do leilão */}
        {credit.category === 'auction' && (
          <div className="mb-3 p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Gavel className="w-4 h-4 text-gray-500" />
                <span>{credit.totalBids || 0} lances</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-gray-500" />
                <span>{credit.participants || 0} participantes</span>
              </div>
            </div>
            {credit.timeRemaining && (
              <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                <Clock className="w-4 h-4" />
                <span>{formatTimeRemaining(credit.timeRemaining)}</span>
              </div>
            )}
          </div>
        )}

        {/* Botões de ação */}
        <div className="mt-auto space-y-2">
          <Button onClick={handleViewDetails} variant="outline" className="w-full" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalhes
          </Button>

          <div className="grid grid-cols-2 gap-2">
            {credit.category === 'auction' ? (
              <Button
                onClick={handlePlaceBid}
                className="w-full"
                size="sm"
                disabled={credit.status === 'ended'}
              >
                <Gavel className="w-4 h-4 mr-1" />
                Lance
              </Button>
            ) : (
              <Button
                onClick={handleBuyNow}
                className="w-full"
                size="sm"
                disabled={credit.status === 'ended'}
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Comprar
              </Button>
            )}

            <Button
              onClick={handleNegotiate}
              variant="outline"
              className="w-full"
              size="sm"
              disabled={credit.status === 'ended'}
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              Negociar
            </Button>
          </div>
        </div>

        {/* Indicadores adicionais */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{credit.seller.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            <span>Liquidez: {credit.liquidityScore}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
