import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  Heart,
  Bell,
  Gavel,
  Clock,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  DollarSign,
  Activity,
  Star,
  Eye,
  ShoppingCart,
  Zap,
  ArrowUpDown,
  Grid3X3,
  List,
  SlidersHorizontal,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

interface CreditTitle {
  id: string;
  title: string;
  description: string;
  creditType: 'ICMS' | 'PIS/COFINS' | 'IPI' | 'ISS' | 'IRPJ/CSLL' | 'Precatório';
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
}

export default function ExplorarPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [filterType, setFilterType] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterLocation, setFilterLocation] = useState('todos');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [favoriteCredits, setFavoriteCredits] = useState<Set<string>>(new Set());
  const [watchedCredits, setWatchedCredits] = useState<Set<string>>(new Set());

  // Mock data para títulos de crédito
  const [credits, setCredits] = useState<CreditTitle[]>([
    {
      id: '1',
      title: 'Crédito ICMS - Exportação Soja Premium',
      description:
        'Crédito ICMS acumulado de exportação de soja, empresa do agronegócio com histórico sólido e documentação completa auditada.',
      creditType: 'ICMS',
      creditValue: 850000,
      currentPrice: 765000,
      originalPrice: 850000,
      discount: 10,
      minBid: 770000,
      bidIncrement: 5000,
      timeRemaining: 86400,
      totalBids: 23,
      participants: 8,
      seller: {
        name: 'Agronegócio Sul Brasil Ltda',
        rating: 4.8,
        verified: true,
        location: 'Rio Grande do Sul',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ASB',
        totalSales: 45,
      },
      status: 'active',
      category: 'auction',
      auctionType: 'traditional',
      startDate: '2024-01-15T10:00:00',
      endDate: '2024-01-16T18:00:00',
      tags: ['exportacao', 'soja', 'agronegocio', 'premium'],
      documentation: {
        complete: true,
        verified: true,
        items: ['Nota Fiscal', 'Comprovante de Exportação', 'Auditoria', 'Certidões Negativas'],
      },
      riskLevel: 'low',
      liquidityScore: 95,
      images: ['https://via.placeholder.com/400x200?text=ICMS+Soja'],
    },
    {
      id: '2',
      title: 'PIS/COFINS - Indústria Química Certificada',
      description:
        'Créditos PIS/COFINS de indústria química, valores auditados e documentação completa com certificação ISO.',
      creditType: 'PIS/COFINS',
      creditValue: 420000,
      currentPrice: 378000,
      originalPrice: 420000,
      discount: 10,
      minBid: 381000,
      bidIncrement: 3000,
      timeRemaining: 3600,
      totalBids: 15,
      participants: 5,
      seller: {
        name: 'Química Industrial SP',
        rating: 4.6,
        verified: true,
        location: 'São Paulo',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=QIS',
        totalSales: 32,
      },
      status: 'ending_soon',
      category: 'auction',
      auctionType: 'traditional',
      startDate: '2024-01-14T14:00:00',
      endDate: '2024-01-15T15:00:00',
      tags: ['industria', 'quimica', 'auditado', 'iso'],
      documentation: {
        complete: true,
        verified: true,
        items: ['Nota Fiscal', 'Certificação ISO', 'Auditoria', 'Balanço Patrimonial'],
      },
      riskLevel: 'low',
      liquidityScore: 88,
      images: ['https://via.placeholder.com/400x200?text=PIS+COFINS'],
    },
    {
      id: '3',
      title: 'Precatório Federal - Justiça do Trabalho',
      description:
        'Precatório federal da Justiça do Trabalho com previsão de pagamento para 2024. Documentação completa.',
      creditType: 'Precatório',
      creditValue: 1200000,
      currentPrice: 960000,
      originalPrice: 1200000,
      discount: 20,
      minBid: 0,
      bidIncrement: 0,
      timeRemaining: 0,
      totalBids: 0,
      participants: 0,
      seller: {
        name: 'Escritório Jurídico Andrade & Associados',
        rating: 4.9,
        verified: true,
        location: 'Brasília',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=EJA',
        totalSales: 28,
      },
      status: 'buy_now',
      category: 'buy_now',
      auctionType: 'traditional',
      startDate: '2024-01-15T08:00:00',
      endDate: '2024-01-18T20:00:00',
      tags: ['precatorio', 'federal', 'justica-trabalho', 'garantido'],
      documentation: {
        complete: true,
        verified: true,
        items: ['Certidão de Precatório', 'Sentença Judicial', 'Cálculo Atualizado', 'Procuração'],
      },
      riskLevel: 'low',
      liquidityScore: 92,
      images: ['https://via.placeholder.com/400x200?text=Precatorio'],
    },
  ]);

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

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'ending_soon':
        return 'bg-red-100 text-red-800';
      case 'ended':
        return 'bg-gray-100 text-gray-800';
      case 'buy_now':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string): string => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auction':
        return <Gavel className="w-4 h-4" />;
      case 'buy_now':
        return <ShoppingCart className="w-4 h-4" />;
      case 'negotiable':
        return <Users className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'auction':
        return 'Leilão';
      case 'buy_now':
        return 'Comprar Agora';
      case 'negotiable':
        return 'Negociável';
      default:
        return 'Outros';
    }
  };

  const handleToggleFavorite = (creditId: string) => {
    setFavoriteCredits(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(creditId)) {
        newFavorites.delete(creditId);
        toast.info('Removido dos favoritos');
      } else {
        newFavorites.add(creditId);
        toast.success('Adicionado aos favoritos');
      }
      return newFavorites;
    });
  };

  const handleToggleWatch = (creditId: string) => {
    setWatchedCredits(prev => {
      const newWatched = new Set(prev);
      if (newWatched.has(creditId)) {
        newWatched.delete(creditId);
        toast.info('Notificações desativadas');
      } else {
        newWatched.add(creditId);
        toast.success('Você será notificado sobre este título');
      }
      return newWatched;
    });
  };

  const handleBuyNow = (credit: CreditTitle) => {
    toast.success(`Compra iniciada: ${credit.title}`);
  };

  const handlePlaceBid = (credit: CreditTitle) => {
    toast.success(`Lance realizado para: ${credit.title}`);
  };

  const handleNegotiate = (credit: CreditTitle) => {
    toast.info(`Iniciando negociação para: ${credit.title}`);
  };

  const filteredCredits = credits.filter(credit => {
    const matchesSearch =
      credit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credit.seller.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      activeTab === 'todos' ||
      (activeTab === 'leiloes' && credit.category === 'auction') ||
      (activeTab === 'compra-direta' && credit.category === 'buy_now') ||
      (activeTab === 'negociaveis' && credit.category === 'negotiable');

    const matchesType = filterType === 'todos' || credit.creditType === filterType;
    const matchesStatus = filterStatus === 'todos' || credit.status === filterStatus;
    const matchesLocation =
      filterLocation === 'todos' || credit.seller.location.includes(filterLocation);

    return matchesSearch && matchesTab && matchesType && matchesStatus && matchesLocation;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCredits(prev =>
        prev.map(credit => ({
          ...credit,
          timeRemaining: Math.max(0, credit.timeRemaining - 1),
          status:
            credit.timeRemaining <= 3600 && credit.timeRemaining > 0
              ? 'ending_soon'
              : credit.timeRemaining <= 0 && credit.category === 'auction'
                ? 'ended'
                : credit.status,
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Marketplace de Créditos</h1>
        <p className="text-gray-600">
          Encontre as melhores oportunidades em títulos de crédito tributários
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Títulos Ativos</p>
                <p className="text-2xl font-bold">
                  {credits.filter(c => c.status === 'active' || c.status === 'ending_soon').length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terminando Hoje</p>
                <p className="text-2xl font-bold">
                  {credits.filter(c => c.status === 'ending_soon').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(credits.reduce((sum, c) => sum + c.creditValue, 0))}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Participantes</p>
                <p className="text-2xl font-bold">
                  {credits.reduce((sum, c) => sum + c.participants, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por título, descrição ou vendedor..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevância</SelectItem>
                <SelectItem value="price_asc">Menor Preço</SelectItem>
                <SelectItem value="price_desc">Maior Preço</SelectItem>
                <SelectItem value="ending_soon">Terminando Logo</SelectItem>
                <SelectItem value="newest">Mais Recentes</SelectItem>
                <SelectItem value="most_bids">Mais Lances</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
            </Button>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {showAdvancedFilters && (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de Crédito" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Tipos</SelectItem>
                    <SelectItem value="ICMS">ICMS</SelectItem>
                    <SelectItem value="PIS/COFINS">PIS/COFINS</SelectItem>
                    <SelectItem value="IPI">IPI</SelectItem>
                    <SelectItem value="ISS">ISS</SelectItem>
                    <SelectItem value="IRPJ/CSLL">IRPJ/CSLL</SelectItem>
                    <SelectItem value="Precatório">Precatório</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos Status</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="ending_soon">Terminando</SelectItem>
                    <SelectItem value="buy_now">Compra Direta</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Localização" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas Localizações</SelectItem>
                    <SelectItem value="São Paulo">São Paulo</SelectItem>
                    <SelectItem value="Rio de Janeiro">Rio de Janeiro</SelectItem>
                    <SelectItem value="Minas Gerais">Minas Gerais</SelectItem>
                    <SelectItem value="Rio Grande do Sul">Rio Grande do Sul</SelectItem>
                    <SelectItem value="Paraná">Paraná</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setFilterType('todos');
                    setFilterStatus('todos');
                    setFilterLocation('todos');
                    setSearchTerm('');
                  }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Limpar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todos">Todos ({credits.length})</TabsTrigger>
          <TabsTrigger value="leiloes">
            Leilões ({credits.filter(c => c.category === 'auction').length})
          </TabsTrigger>
          <TabsTrigger value="compra-direta">
            Compra Direta ({credits.filter(c => c.category === 'buy_now').length})
          </TabsTrigger>
          <TabsTrigger value="negociaveis">
            Negociáveis ({credits.filter(c => c.category === 'negotiable').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div
            className={
              viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'
            }
          >
            {filteredCredits.map(credit => (
              <Card key={credit.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {credit.images.length > 0 && (
                  <div className="relative h-48">
                    <img
                      src={credit.images[0]}
                      alt={credit.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Badge className={getStatusColor(credit.status)}>
                        {credit.status === 'active'
                          ? 'Ativo'
                          : credit.status === 'ending_soon'
                            ? 'Terminando'
                            : credit.status === 'buy_now'
                              ? 'Compre Agora'
                              : 'Encerrado'}
                      </Badge>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge className={getRiskColor(credit.riskLevel)}>
                        Risco{' '}
                        {credit.riskLevel === 'low'
                          ? 'Baixo'
                          : credit.riskLevel === 'medium'
                            ? 'Médio'
                            : 'Alto'}
                      </Badge>
                    </div>
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg line-clamp-2">{credit.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {credit.creditType}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getCategoryIcon(credit.category)}
                          <span className="ml-1">{getCategoryLabel(credit.category)}</span>
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleToggleFavorite(credit.id)}
                      >
                        <Heart
                          className={`w-4 h-4 ${favoriteCredits.has(credit.id) ? 'fill-red-500 text-red-500' : ''}`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleToggleWatch(credit.id)}
                      >
                        <Bell
                          className={`w-4 h-4 ${watchedCredits.has(credit.id) ? 'text-blue-600' : ''}`}
                        />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{credit.description}</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Valor do Título</span>
                      <span className="font-semibold">{formatCurrency(credit.creditValue)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Preço Atual</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(credit.currentPrice)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Desconto</span>
                      <span className="text-sm font-medium text-green-600">
                        {credit.discount}% OFF
                      </span>
                    </div>
                  </div>

                  {credit.category === 'auction' && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span
                          className={
                            credit.status === 'ending_soon'
                              ? 'text-red-600 font-medium'
                              : 'text-gray-600'
                          }
                        >
                          {formatTimeRemaining(credit.timeRemaining)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Gavel className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{credit.totalBids}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{credit.participants}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={credit.seller.avatar}
                          alt={credit.seller.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{credit.seller.rating}</span>
                        </div>
                        {credit.seller.verified && (
                          <Badge variant="outline" className="text-xs">
                            Verificado
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {credit.seller.location}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{credit.seller.name}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Detalhes
                    </Button>

                    {credit.category === 'auction' && credit.status === 'active' && (
                      <Button className="flex-1" onClick={() => handlePlaceBid(credit)}>
                        <Gavel className="w-4 h-4 mr-2" />
                        Dar Lance
                      </Button>
                    )}

                    {credit.category === 'buy_now' && (
                      <Button className="flex-1" onClick={() => handleBuyNow(credit)}>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Comprar
                      </Button>
                    )}

                    {credit.category === 'negotiable' && (
                      <Button className="flex-1" onClick={() => handleNegotiate(credit)}>
                        <Users className="w-4 h-4 mr-2" />
                        Negociar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
