import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Gavel,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  MessageSquare,
  Heart,
  Trophy,
  AlertCircle,
  CheckCircle,
  XCircle,
  Timer,
  Activity,
  Star,
  Zap,
  RefreshCw,
  Filter,
  Search,
  BarChart3,
  ArrowUpDown,
  Settings,
} from 'lucide-react';
import { toast } from 'sonner';

interface Bid {
  id: string;
  auctionId: string;
  auctionTitle: string;
  amount: number;
  timestamp: Date;
  status: 'active' | 'outbid' | 'winning' | 'won' | 'lost';
  isAutoBid: boolean;
  maxAutoBid?: number;
  seller: {
    name: string;
    avatar: string;
    rating: number;
  };
  timeRemaining: number;
  currentHighestBid: number;
  totalBids: number;
  participants: number;
  creditType: string;
  creditValue: number;
}

interface AutoBidRule {
  id: string;
  auctionId: string;
  maxBid: number;
  increment: number;
  isActive: boolean;
  conditions: string[];
}

export default function NegociacoesPage() {
  const [activeTab, setActiveTab] = useState('ativos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('time_remaining');
  const [showAutoBidSettings, setShowAutoBidSettings] = useState(false);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);

  // Mock data para lances
  const [bids, setBids] = useState<Bid[]>([
    {
      id: '1',
      auctionId: 'auction_1',
      auctionTitle: 'Crédito ICMS - Exportação Soja Premium',
      amount: 775000,
      timestamp: new Date(Date.now() - 1800000),
      status: 'winning',
      isAutoBid: false,
      seller: {
        name: 'Agronegócio Sul Brasil',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ASB',
        rating: 4.8,
      },
      timeRemaining: 3600,
      currentHighestBid: 775000,
      totalBids: 24,
      participants: 9,
      creditType: 'ICMS',
      creditValue: 850000,
    },
    {
      id: '2',
      auctionId: 'auction_2',
      auctionTitle: 'PIS/COFINS - Indústria Química',
      amount: 381000,
      timestamp: new Date(Date.now() - 3600000),
      status: 'outbid',
      isAutoBid: true,
      maxAutoBid: 390000,
      seller: {
        name: 'Química Industrial SP',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=QIS',
        rating: 4.6,
      },
      timeRemaining: 1800,
      currentHighestBid: 385000,
      totalBids: 16,
      participants: 6,
      creditType: 'PIS/COFINS',
      creditValue: 420000,
    },
    {
      id: '3',
      auctionId: 'auction_3',
      auctionTitle: 'Precatório Federal - Justiça Trabalho',
      amount: 950000,
      timestamp: new Date(Date.now() - 86400000),
      status: 'won',
      isAutoBid: false,
      seller: {
        name: 'Escritório Jurídico Andrade',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=EJA',
        rating: 4.9,
      },
      timeRemaining: 0,
      currentHighestBid: 950000,
      totalBids: 12,
      participants: 5,
      creditType: 'Precatório',
      creditValue: 1200000,
    },
    {
      id: '4',
      auctionId: 'auction_4',
      auctionTitle: 'IPI - Metalúrgica Grande Porte',
      amount: 520000,
      timestamp: new Date(Date.now() - 7200000),
      status: 'lost',
      isAutoBid: true,
      maxAutoBid: 550000,
      seller: {
        name: 'Metalúrgica Centro-Oeste',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MCO',
        rating: 4.7,
      },
      timeRemaining: 0,
      currentHighestBid: 560000,
      totalBids: 28,
      participants: 11,
      creditType: 'IPI',
      creditValue: 680000,
    },
    {
      id: '5',
      auctionId: 'auction_5',
      auctionTitle: 'ICMS - Operações Internas Alimentício',
      amount: 290000,
      timestamp: new Date(Date.now() - 900000),
      status: 'active',
      isAutoBid: false,
      seller: {
        name: 'Alimentos Norte Ltda',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ANL',
        rating: 4.4,
      },
      timeRemaining: 172800,
      currentHighestBid: 290000,
      totalBids: 8,
      participants: 4,
      creditType: 'ICMS',
      creditValue: 320000,
    },
  ]);

  const [autoBidRules, setAutoBidRules] = useState<AutoBidRule[]>([
    {
      id: '1',
      auctionId: 'auction_2',
      maxBid: 390000,
      increment: 3000,
      isActive: true,
      conditions: ['Manter liderança', 'Não exceder 92% do valor'],
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
      case 'winning':
        return 'bg-green-100 text-green-800';
      case 'outbid':
        return 'bg-red-100 text-red-800';
      case 'won':
        return 'bg-blue-100 text-blue-800';
      case 'lost':
        return 'bg-gray-100 text-gray-800';
      case 'active':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'winning':
        return <Trophy className="w-4 h-4" />;
      case 'outbid':
        return <AlertCircle className="w-4 h-4" />;
      case 'won':
        return <CheckCircle className="w-4 h-4" />;
      case 'lost':
        return <XCircle className="w-4 h-4" />;
      case 'active':
        return <Activity className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'winning':
        return 'Vencendo';
      case 'outbid':
        return 'Superado';
      case 'won':
        return 'Venceu';
      case 'lost':
        return 'Perdeu';
      case 'active':
        return 'Ativo';
      default:
        return 'Desconhecido';
    }
  };

  const handleIncreaseBid = (bid: Bid) => {
    const newAmount = bid.amount + 5000;
    toast.success(`Novo lance de ${formatCurrency(newAmount)} realizado!`);

    setBids(prev =>
      prev.map(b =>
        b.id === bid.id
          ? { ...b, amount: newAmount, currentHighestBid: newAmount, status: 'winning' }
          : b
      )
    );
  };

  const handleToggleAutoBid = (bidId: string) => {
    setBids(prev =>
      prev.map(bid => (bid.id === bidId ? { ...bid, isAutoBid: !bid.isAutoBid } : bid))
    );

    toast.success('Configuração de lance automático atualizada!');
  };

  const handleViewDetails = (bid: Bid) => {
    setSelectedBid(bid);
    toast.info(`Visualizando detalhes de: ${bid.auctionTitle}`);
  };

  const handleSendMessage = (bid: Bid) => {
    toast.info(`Enviando mensagem para: ${bid.seller.name}`);
  };

  const filteredBids = bids.filter(bid => {
    const matchesSearch =
      bid.auctionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.seller.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      activeTab === 'todos' ||
      (activeTab === 'ativos' && ['winning', 'outbid', 'active'].includes(bid.status)) ||
      (activeTab === 'finalizados' && ['won', 'lost'].includes(bid.status)) ||
      (activeTab === 'vencendo' && bid.status === 'winning');

    return matchesSearch && matchesTab;
  });

  // Atualizar contadores em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setBids(prev =>
        prev.map(bid => ({
          ...bid,
          timeRemaining: Math.max(0, bid.timeRemaining - 1),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Estatísticas
  const stats = {
    total: bids.length,
    winning: bids.filter(b => b.status === 'winning').length,
    won: bids.filter(b => b.status === 'won').length,
    active: bids.filter(b => ['winning', 'outbid', 'active'].includes(b.status)).length,
    totalValue: bids.reduce((sum, b) => sum + b.amount, 0),
    avgBid: bids.length > 0 ? bids.reduce((sum, b) => sum + b.amount, 0) / bids.length : 0,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Negociações</h1>
          <p className="text-gray-600">
            Gerencie seus lances e acompanhe o progresso das negociações
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAutoBidSettings(!showAutoBidSettings)}>
            <Settings className="w-4 h-4 mr-2" />
            Lance Automático
          </Button>
          <Button>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Lances</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Gavel className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vencendo</p>
                <p className="text-2xl font-bold text-green-600">{stats.winning}</p>
              </div>
              <Trophy className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vitórias</p>
                <p className="text-2xl font-bold text-blue-600">{stats.won}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.active}</p>
              </div>
              <Activity className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-lg font-bold">{formatCurrency(stats.totalValue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lance Médio</p>
                <p className="text-lg font-bold">{formatCurrency(stats.avgBid)}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por título ou vendedor..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4" />
            Ordenar
          </Button>
        </div>
      </div>

      {/* Configurações de Lance Automático */}
      {showAutoBidSettings && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Configurações de Lance Automático
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Limite máximo por lance</label>
                  <Input type="number" placeholder="R$ 0,00" />
                </div>
                <div>
                  <label className="text-sm font-medium">Incremento padrão</label>
                  <Input type="number" placeholder="R$ 5.000" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button>Salvar Configurações</Button>
                <Button variant="outline">Cancelar</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todos">Todos ({bids.length})</TabsTrigger>
          <TabsTrigger value="ativos">
            Ativos ({bids.filter(b => ['winning', 'outbid', 'active'].includes(b.status)).length})
          </TabsTrigger>
          <TabsTrigger value="vencendo">
            Vencendo ({bids.filter(b => b.status === 'winning').length})
          </TabsTrigger>
          <TabsTrigger value="finalizados">
            Finalizados ({bids.filter(b => ['won', 'lost'].includes(b.status)).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredBids.map(bid => (
              <Card key={bid.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{bid.auctionTitle}</h3>
                            <Badge className={getStatusColor(bid.status)}>
                              {getStatusIcon(bid.status)}
                              <span className="ml-1">{getStatusLabel(bid.status)}</span>
                            </Badge>
                            {bid.isAutoBid && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                <Zap className="w-3 h-3 mr-1" />
                                Auto
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Badge variant="secondary">{bid.creditType}</Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {bid.participants} participantes
                            </div>
                            <div className="flex items-center gap-1">
                              <Gavel className="w-4 h-4" />
                              {bid.totalBids} lances
                            </div>
                          </div>
                        </div>

                        <div className="text-right space-y-2">
                          <div>
                            <p className="text-sm text-gray-600">Seu Lance</p>
                            <p className="text-xl font-bold text-blue-600">
                              {formatCurrency(bid.amount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Lance Atual</p>
                            <p className="text-lg font-semibold">
                              {formatCurrency(bid.currentHighestBid)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Valor do Título</span>
                            <span className="font-medium">{formatCurrency(bid.creditValue)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Desconto Atual</span>
                            <span className="font-medium text-green-600">
                              {Math.round(
                                ((bid.creditValue - bid.currentHighestBid) / bid.creditValue) * 100
                              )}
                              %
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={bid.seller.avatar} />
                              <AvatarFallback>{bid.seller.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{bid.seller.name}</p>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-gray-600">{bid.seller.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span
                              className={`text-sm ${bid.timeRemaining <= 3600 ? 'text-red-600 font-medium' : 'text-gray-600'}`}
                            >
                              {formatTimeRemaining(bid.timeRemaining)}
                            </span>
                          </div>
                          {bid.timeRemaining > 0 && (
                            <Progress
                              value={Math.max(0, Math.min(100, (bid.timeRemaining / 86400) * 100))}
                              className="h-2"
                            />
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t">
                        {bid.status === 'winning' && (
                          <Button variant="outline" className="flex items-center gap-2">
                            <Trophy className="w-4 h-4" />
                            Você está vencendo!
                          </Button>
                        )}

                        {bid.status === 'outbid' && bid.timeRemaining > 0 && (
                          <Button
                            onClick={() => handleIncreaseBid(bid)}
                            className="flex items-center gap-2"
                          >
                            <Gavel className="w-4 h-4" />
                            Aumentar Lance
                          </Button>
                        )}

                        {bid.status === 'active' && bid.timeRemaining > 0 && (
                          <Button
                            onClick={() => handleIncreaseBid(bid)}
                            className="flex items-center gap-2"
                          >
                            <Gavel className="w-4 h-4" />
                            Dar Lance
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          onClick={() => handleViewDetails(bid)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Detalhes
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => handleSendMessage(bid)}
                          className="flex items-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Mensagem
                        </Button>

                        {bid.timeRemaining > 0 && (
                          <Button
                            variant="outline"
                            onClick={() => handleToggleAutoBid(bid.id)}
                            className="flex items-center gap-2"
                          >
                            <Zap className="w-4 h-4" />
                            {bid.isAutoBid ? 'Desativar' : 'Ativar'} Auto
                          </Button>
                        )}
                      </div>
                    </div>
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
