import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Heart,
  Bell,
  Eye,
  Star,
  Filter,
  Search,
  Clock,
  TrendingUp,
  DollarSign,
  RefreshCw,
  BarChart3,
  Gavel,
  ShoppingCart,
  MessageSquare,
  Verified,
  MapPin,
  Users,
  Activity,
  Target,
  AlertCircle,
  CheckCircle,
  Zap,
  Coins,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';

export default function DesejosPageNew() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('data_desc');
  const [priceAlerts, setPriceAlerts] = useState<{ [key: string]: number }>({});
  const [showNotifications, setShowNotifications] = useState(false);

  const desejos = [
    {
      id: '1',
      titulo: 'ICMS - Exportação Agronegócio Premium',
      valor: 950000,
      precoAtual: 855000,
      precoDesejado: 800000,
      desconto: 10,
      dataAdicao: '2024-01-15',
      status: 'disponivel',
      vendedor: 'AgroExport Premium Ltda',
      categoria: 'ICMS',
      rating: 4.9,
      avatar: '/avatars/agro-premium.png',
      verified: true,
      timeRemaining: 86400, // 24 horas
      totalBids: 15,
      participants: 8,
      category: 'auction',
      riskLevel: 'low',
      liquidityScore: 95,
      alertaPreco: true,
      variacao: -2.5, // % nas últimas 24h
      visualizacoes: 234,
      interessados: 12,
      blockchain: 'Ethereum',
      tokenType: 'ERC-721',
    },
    {
      id: '2',
      titulo: 'Precatório Judicial TJSP Premium',
      valor: 1500000,
      precoAtual: 1200000,
      precoDesejado: 1100000,
      desconto: 20,
      dataAdicao: '2024-01-12',
      status: 'indisponivel',
      vendedor: 'Judicial Invest SA',
      categoria: 'Precatório',
      rating: 4.8,
      avatar: '/avatars/judicial.png',
      verified: true,
      timeRemaining: 0,
      totalBids: 0,
      participants: 0,
      category: 'buy_now',
      riskLevel: 'medium',
      liquidityScore: 85,
      alertaPreco: true,
      variacao: 0, // Sem mudança
      visualizacoes: 189,
      interessados: 7,
      blockchain: 'Ethereum',
      tokenType: 'ERC-721',
    },
    {
      id: '3',
      titulo: 'PIS/COFINS - Indústria Farmacêutica',
      valor: 680000,
      precoAtual: 578000,
      precoDesejado: 550000,
      desconto: 15,
      dataAdicao: '2024-01-10',
      status: 'disponivel',
      vendedor: 'Pharma Industries Corp',
      categoria: 'PIS/COFINS',
      rating: 4.7,
      avatar: '/avatars/pharma.png',
      verified: true,
      timeRemaining: 172800, // 48 horas
      totalBids: 8,
      participants: 5,
      category: 'auction',
      riskLevel: 'low',
      liquidityScore: 92,
      alertaPreco: false,
      variacao: 1.2, // % nas últimas 24h
      visualizacoes: 156,
      interessados: 9,
      blockchain: 'Polygon',
      tokenType: 'ERC-1155',
    },
    {
      id: '4',
      titulo: 'IRPJ/CSLL - Tecnologia Avançada',
      valor: 420000,
      precoAtual: 378000,
      precoDesejado: 350000,
      desconto: 10,
      dataAdicao: '2024-01-08',
      status: 'preco_atingido',
      vendedor: 'TechAdvanced Solutions',
      categoria: 'IRPJ/CSLL',
      rating: 4.6,
      avatar: '/avatars/tech-advanced.png',
      verified: false,
      timeRemaining: 259200, // 72 horas
      totalBids: 12,
      participants: 7,
      category: 'negotiable',
      riskLevel: 'medium',
      liquidityScore: 78,
      alertaPreco: true,
      variacao: -5.2, // % nas últimas 24h
      visualizacoes: 298,
      interessados: 15,
      blockchain: 'Ethereum',
      tokenType: 'ERC-20',
    },
    {
      id: '5',
      titulo: 'Crédito Rural - Agricultura Sustentável',
      valor: 750000,
      precoAtual: 675000,
      precoDesejado: 650000,
      desconto: 10,
      dataAdicao: '2024-01-05',
      status: 'disponivel',
      vendedor: 'EcoAgro Sustentável',
      categoria: 'Rural',
      rating: 4.8,
      avatar: '/avatars/eco-agro.png',
      verified: true,
      timeRemaining: 43200, // 12 horas
      totalBids: 6,
      participants: 4,
      category: 'auction',
      riskLevel: 'low',
      liquidityScore: 88,
      alertaPreco: false,
      variacao: 0.8, // % nas últimas 24h
      visualizacoes: 167,
      interessados: 8,
      blockchain: 'Polygon',
      tokenType: 'ERC-721',
    },
  ];

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
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
      case 'disponivel':
        return 'bg-green-100 text-green-800';
      case 'indisponivel':
        return 'bg-red-100 text-red-800';
      case 'preco_atingido':
        return 'bg-blue-100 text-blue-800';
      case 'removido':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'disponivel':
        return 'Disponível';
      case 'indisponivel':
        return 'Indisponível';
      case 'preco_atingido':
        return 'Preço Atingido';
      case 'removido':
        return 'Removido';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'disponivel':
        return <CheckCircle className="w-4 h-4" />;
      case 'indisponivel':
        return <AlertCircle className="w-4 h-4" />;
      case 'preco_atingido':
        return <Target className="w-4 h-4" />;
      case 'removido':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
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

  const getVariationColor = (variacao: number) => {
    if (variacao > 0) return 'text-red-600';
    if (variacao < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  const getBlockchainColor = (blockchain: string) => {
    switch (blockchain) {
      case 'Ethereum':
        return 'bg-blue-100 text-blue-800';
      case 'Polygon':
        return 'bg-purple-100 text-purple-800';
      case 'BSC':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDesejos = desejos.filter(desejo => {
    const matchesSearch =
      desejo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      desejo.vendedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      desejo.categoria.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'todos' || desejo.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedDesejos = [...filteredDesejos].sort((a, b) => {
    switch (sortBy) {
      case 'data_desc':
        return new Date(b.dataAdicao).getTime() - new Date(a.dataAdicao).getTime();
      case 'data_asc':
        return new Date(a.dataAdicao).getTime() - new Date(b.dataAdicao).getTime();
      case 'preco_desc':
        return b.precoAtual - a.precoAtual;
      case 'preco_asc':
        return a.precoAtual - b.precoAtual;
      case 'desconto_desc':
        return b.desconto - a.desconto;
      case 'proximidade_preco':
        return Math.abs(a.precoAtual - a.precoDesejado) - Math.abs(b.precoAtual - b.precoDesejado);
      default:
        return 0;
    }
  });

  // Estatísticas
  const stats = {
    total: desejos.length,
    disponiveis: desejos.filter(d => d.status === 'disponivel').length,
    precoAtingido: desejos.filter(d => d.status === 'preco_atingido').length,
    indisponiveis: desejos.filter(d => d.status === 'indisponivel').length,
    valorTotal: desejos.reduce((sum, d) => sum + d.precoDesejado, 0),
    economiaEsperada: desejos.reduce((sum, d) => sum + (d.valor - d.precoDesejado), 0),
    alertasAtivos: desejos.filter(d => d.alertaPreco).length,
    proximosPreco: desejos.filter(
      d => Math.abs(d.precoAtual - d.precoDesejado) / d.precoDesejado <= 0.05
    ).length,
  };

  const handleRemoveFromWishlist = (desejoId: string) => {
    toast.success('Item removido da lista de desejos');
  };

  const handleSetPriceAlert = (desejoId: string, preco: number) => {
    setPriceAlerts(prev => ({ ...prev, [desejoId]: preco }));
    toast.success('Alerta de preço configurado!');
  };

  const handleBuyNow = (desejo: any) => {
    toast.success(`Compra iniciada: ${desejo.titulo}`);
  };

  const handlePlaceBid = (desejo: any) => {
    toast.success(`Lance iniciado: ${desejo.titulo}`);
  };

  const handleNegotiate = (desejo: any) => {
    toast.success(`Negociação iniciada: ${desejo.titulo}`);
  };

  const handleViewDetails = (desejo: any) => {
    toast.info(`Abrindo detalhes de ${desejo.titulo}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lista de Desejos</h1>
          <p className="text-gray-600">Títulos de crédito que você está acompanhando</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell className="w-4 h-4 mr-2" />
            Alertas ({stats.alertasAtivos})
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
                <p className="text-sm text-gray-600">Total Itens</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Desejado</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.valorTotal)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disponíveis</p>
                <p className="text-2xl font-bold">{stats.disponiveis}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Preço Atingido</p>
                <p className="text-2xl font-bold">{stats.precoAtingido}</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alertas Ativos</p>
                <p className="text-2xl font-bold">{stats.alertasAtivos}</p>
              </div>
              <Bell className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Próximos Preço</p>
                <p className="text-2xl font-bold">{stats.proximosPreco}</p>
              </div>
              <Zap className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-500" />
          <Input
            placeholder="Buscar por título, vendedor ou categoria..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Status</SelectItem>
            <SelectItem value="disponivel">Disponíveis</SelectItem>
            <SelectItem value="preco_atingido">Preço Atingido</SelectItem>
            <SelectItem value="indisponivel">Indisponíveis</SelectItem>
            <SelectItem value="removido">Removidos</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="data_desc">Data (Mais Recente)</SelectItem>
            <SelectItem value="data_asc">Data (Mais Antiga)</SelectItem>
            <SelectItem value="preco_desc">Preço (Maior)</SelectItem>
            <SelectItem value="preco_asc">Preço (Menor)</SelectItem>
            <SelectItem value="desconto_desc">Desconto (Maior)</SelectItem>
            <SelectItem value="proximidade_preco">Proximidade do Preço</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm">
          <BarChart3 className="w-4 h-4 mr-2" />
          Analytics
        </Button>
      </div>

      {/* Lista de Desejos */}
      <div className="space-y-4">
        {sortedDesejos.map(desejo => (
          <Card key={desejo.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={desejo.avatar} />
                    <AvatarFallback>{desejo.vendedor.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{desejo.titulo}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600">{desejo.vendedor}</span>
                      {desejo.verified && <Verified className="w-4 h-4 text-blue-500" />}
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current text-yellow-500" />
                        <span className="text-sm text-gray-600">{desejo.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(desejo.status)}>
                    {getStatusIcon(desejo.status)}
                    <span className="ml-1">{getStatusText(desejo.status)}</span>
                  </Badge>
                  <Badge variant="outline">{desejo.categoria}</Badge>
                  <Badge className={getRiskColor(desejo.riskLevel)}>
                    {desejo.riskLevel === 'low'
                      ? 'Baixo Risco'
                      : desejo.riskLevel === 'medium'
                        ? 'Médio Risco'
                        : 'Alto Risco'}
                  </Badge>
                  <Badge className={getBlockchainColor(desejo.blockchain)}>
                    <Coins className="w-3 h-3 mr-1" />
                    {desejo.blockchain}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-8 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Valor Original</p>
                  <p className="font-semibold">{formatCurrency(desejo.valor)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Preço Atual</p>
                  <div className="flex items-center gap-1">
                    <p className="font-semibold text-blue-600">
                      {formatCurrency(desejo.precoAtual)}
                    </p>
                    {desejo.variacao !== 0 && (
                      <span className={`text-xs ${getVariationColor(desejo.variacao)}`}>
                        ({desejo.variacao > 0 ? '+' : ''}
                        {desejo.variacao}%)
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Preço Desejado</p>
                  <p className="font-semibold text-green-600">
                    {formatCurrency(desejo.precoDesejado)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Diferença</p>
                  <p
                    className={`font-semibold ${desejo.precoAtual <= desejo.precoDesejado ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {formatCurrency(Math.abs(desejo.precoAtual - desejo.precoDesejado))}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Data Adição</p>
                  <p className="font-semibold">{formatDate(desejo.dataAdicao)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Tempo Restante</p>
                  <p
                    className={`font-semibold ${desejo.timeRemaining <= 86400 ? 'text-red-600' : 'text-gray-900'}`}
                  >
                    {formatTimeRemaining(desejo.timeRemaining)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Liquidez</p>
                  <p className="font-semibold">{desejo.liquidityScore}%</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Interessados</p>
                  <p className="font-semibold">{desejo.interessados}</p>
                </div>
              </div>

              {/* Informações do leilão */}
              {desejo.category === 'auction' && (
                <div className="flex items-center justify-between text-sm mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Gavel className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{desejo.totalBids} lances</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{desejo.participants} participantes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{desejo.visualizacoes} visualizações</span>
                    </div>
                  </div>
                  {desejo.alertaPreco && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      <Bell className="w-3 h-3 mr-1" />
                      Alerta Ativo
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                {desejo.status === 'disponivel' && (
                  <>
                    {desejo.category === 'buy_now' && (
                      <Button
                        size="sm"
                        onClick={() => handleBuyNow(desejo)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Comprar
                      </Button>
                    )}
                    {desejo.category === 'auction' && (
                      <Button
                        size="sm"
                        onClick={() => handlePlaceBid(desejo)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Gavel className="w-4 h-4 mr-1" />
                        Dar Lance
                      </Button>
                    )}
                    {desejo.category === 'negotiable' && (
                      <Button
                        size="sm"
                        onClick={() => handleNegotiate(desejo)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Negociar
                      </Button>
                    )}
                  </>
                )}

                {desejo.status === 'preco_atingido' && (
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Target className="w-4 h-4 mr-1" />
                    Preço Atingido - Comprar
                  </Button>
                )}

                <Button size="sm" variant="outline" onClick={() => handleViewDetails(desejo)}>
                  <Eye className="w-4 h-4 mr-1" />
                  Detalhes
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSetPriceAlert(desejo.id, desejo.precoDesejado)}
                >
                  <Bell className="w-4 h-4 mr-1" />
                  {desejo.alertaPreco ? 'Editar Alerta' : 'Criar Alerta'}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemoveFromWishlist(desejo.id)}
                >
                  <Heart className="w-4 h-4 mr-1 fill-current text-red-500" />
                  Remover
                </Button>

                {desejo.status === 'preco_atingido' && (
                  <Badge variant="secondary" className="ml-auto">
                    <Target className="w-3 h-3 mr-1" />
                    Oportunidade Ativa
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedDesejos.length === 0 && (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Sua lista de desejos está vazia
          </h3>
          <p className="text-gray-500">Adicione títulos que você tem interesse em acompanhar</p>
          <Button className="mt-4">
            <Search className="w-4 h-4 mr-2" />
            Explorar Marketplace
          </Button>
        </div>
      )}
    </div>
  );
}
