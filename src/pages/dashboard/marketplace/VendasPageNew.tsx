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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DollarSign,
  Package,
  TrendingUp,
  Eye,
  Star,
  Filter,
  Plus,
  Search,
  Download,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  BarChart3,
  Bell,
  MessageSquare,
  Verified,
  ExternalLink,
  Coins,
  Activity,
  Users,
  Calendar,
  Target,
  Award,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

export default function VendasPageNew() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('data_desc');
  const [selectedPeriod, setSelectedPeriod] = useState('todos');
  const [showAnalytics, setShowAnalytics] = useState(false);

  const vendas = [
    {
      id: '1',
      titulo: 'Precatório Judicial Tokenizado TJSP',
      valor: 1200000,
      precoVenda: 960000,
      desconto: 20,
      dataVenda: '2024-01-20',
      status: 'vendido',
      comprador: 'Investimentos Premium SA',
      categoria: 'Precatório',
      rating: 4.9,
      transactionId: 'SALE_20240120_001',
      proofUrl: '/proof/SALE_20240120_001.pdf',
      tokenId: 'ERC-721-001',
      blockchain: 'Ethereum',
      avatar: '/avatars/premium.png',
      verified: true,
      documentos: ['Precatório', 'Certidões', 'Contrato', 'Laudo'],
      liquidacao: '2024-01-21',
      comissao: 28800,
      tempoVenda: 3, // dias
      visualizacoes: 245,
      interessados: 12,
      lances: 8,
    },
    {
      id: '2',
      titulo: 'IRPJ/CSLL - Serviços Financeiros Tokenizado',
      valor: 680000,
      precoVenda: 612000,
      desconto: 10,
      dataVenda: '2024-01-18',
      status: 'vendido',
      comprador: 'FinanceServ Corp',
      categoria: 'IRPJ/CSLL',
      rating: 4.7,
      transactionId: 'SALE_20240118_002',
      proofUrl: '/proof/SALE_20240118_002.pdf',
      tokenId: 'ERC-20-002',
      blockchain: 'Ethereum',
      avatar: '/avatars/finance.png',
      verified: true,
      documentos: ['Título Original', 'Certidões', 'Contrato'],
      liquidacao: '2024-01-19',
      comissao: 18360,
      tempoVenda: 7, // dias
      visualizacoes: 189,
      interessados: 8,
      lances: 5,
    },
    {
      id: '3',
      titulo: 'Crédito Rural Tokenizado',
      valor: 950000,
      precoVenda: 855000,
      desconto: 10,
      dataVenda: '2024-01-15',
      status: 'vendido',
      comprador: 'AgroInvest Brasil',
      categoria: 'Rural',
      rating: 4.8,
      transactionId: 'SALE_20240115_003',
      proofUrl: '/proof/SALE_20240115_003.pdf',
      tokenId: 'ERC-721-003',
      blockchain: 'Polygon',
      avatar: '/avatars/agro.png',
      verified: true,
      documentos: ['Título Original', 'Certidões', 'Contrato'],
      liquidacao: '2024-01-16',
      comissao: 25650,
      tempoVenda: 2, // dias
      visualizacoes: 312,
      interessados: 15,
      lances: 12,
    },
    {
      id: '4',
      titulo: 'Duplicata Comercial Tokenizada',
      valor: 450000,
      precoVenda: 405000,
      desconto: 10,
      dataVenda: '2024-01-12',
      status: 'vendido',
      comprador: 'Comercial Invest Ltda',
      categoria: 'Comercial',
      rating: 4.6,
      transactionId: 'SALE_20240112_004',
      proofUrl: '/proof/SALE_20240112_004.pdf',
      tokenId: 'ERC-1155-004',
      blockchain: 'Polygon',
      avatar: '/avatars/comercial.png',
      verified: false,
      documentos: ['Duplicata', 'Certidões'],
      liquidacao: '2024-01-13',
      comissao: 12150,
      tempoVenda: 5, // dias
      visualizacoes: 156,
      interessados: 6,
      lances: 3,
    },
    {
      id: '5',
      titulo: 'ICMS - Exportação Agronegócio',
      valor: 320000,
      precoVenda: 0,
      desconto: 15,
      dataVenda: null,
      status: 'em_negociacao',
      comprador: 'Múltiplos Interessados',
      categoria: 'ICMS',
      rating: 0,
      transactionId: 'NEGO_20240110_005',
      proofUrl: null,
      tokenId: 'ERC-721-005',
      blockchain: 'Ethereum',
      avatar: null,
      verified: true,
      documentos: ['Título Original', 'Certidões'],
      liquidacao: null,
      comissao: 0,
      tempoVenda: 0,
      visualizacoes: 89,
      interessados: 4,
      lances: 2,
    },
    {
      id: '6',
      titulo: 'ISS - Prestação de Serviços',
      valor: 180000,
      precoVenda: 0,
      desconto: 12,
      dataVenda: null,
      status: 'ativo',
      comprador: null,
      categoria: 'ISS',
      rating: 0,
      transactionId: 'LIST_20240108_006',
      proofUrl: null,
      tokenId: 'ERC-1155-006',
      blockchain: 'Polygon',
      avatar: null,
      verified: true,
      documentos: ['Título Original', 'Certidões'],
      liquidacao: null,
      comissao: 0,
      tempoVenda: 0,
      visualizacoes: 67,
      interessados: 3,
      lances: 1,
    },
  ];

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Pendente';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'vendido':
        return 'bg-green-100 text-green-800';
      case 'em_negociacao':
        return 'bg-blue-100 text-blue-800';
      case 'ativo':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      case 'pausado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'vendido':
        return 'Vendido';
      case 'em_negociacao':
        return 'Em Negociação';
      case 'ativo':
        return 'Ativo';
      case 'cancelado':
        return 'Cancelado';
      case 'pausado':
        return 'Pausado';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'vendido':
        return <CheckCircle className="w-4 h-4" />;
      case 'em_negociacao':
        return <MessageSquare className="w-4 h-4" />;
      case 'ativo':
        return <Activity className="w-4 h-4" />;
      case 'cancelado':
        return <AlertCircle className="w-4 h-4" />;
      case 'pausado':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
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

  const filteredVendas = vendas.filter(venda => {
    const matchesSearch =
      venda.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (venda.comprador && venda.comprador.toLowerCase().includes(searchTerm.toLowerCase())) ||
      venda.categoria.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'todos' || venda.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedVendas = [...filteredVendas].sort((a, b) => {
    switch (sortBy) {
      case 'data_desc':
        if (!a.dataVenda && !b.dataVenda) return 0;
        if (!a.dataVenda) return 1;
        if (!b.dataVenda) return -1;
        return new Date(b.dataVenda).getTime() - new Date(a.dataVenda).getTime();
      case 'data_asc':
        if (!a.dataVenda && !b.dataVenda) return 0;
        if (!a.dataVenda) return 1;
        if (!b.dataVenda) return -1;
        return new Date(a.dataVenda).getTime() - new Date(b.dataVenda).getTime();
      case 'valor_desc':
        return b.precoVenda - a.precoVenda;
      case 'valor_asc':
        return a.precoVenda - b.precoVenda;
      case 'rating_desc':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  // Estatísticas
  const stats = {
    total: vendas.length,
    vendidos: vendas.filter(v => v.status === 'vendido').length,
    ativos: vendas.filter(v => v.status === 'ativo').length,
    negociacao: vendas.filter(v => v.status === 'em_negociacao').length,
    receitaTotal: vendas
      .filter(v => v.status === 'vendido')
      .reduce((sum, v) => sum + v.precoVenda, 0),
    comissaoTotal: vendas
      .filter(v => v.status === 'vendido')
      .reduce((sum, v) => sum + v.comissao, 0),
    descontoMedio:
      vendas.filter(v => v.status === 'vendido').reduce((sum, v) => sum + v.desconto, 0) /
      vendas.filter(v => v.status === 'vendido').length,
    tempoMedioVenda:
      vendas.filter(v => v.status === 'vendido').reduce((sum, v) => sum + v.tempoVenda, 0) /
      vendas.filter(v => v.status === 'vendido').length,
    visualizacoesTotal: vendas.reduce((sum, v) => sum + v.visualizacoes, 0),
    interessadosTotal: vendas.reduce((sum, v) => sum + v.interessados, 0),
    ratingMedio:
      vendas.filter(v => v.rating > 0).reduce((sum, v) => sum + v.rating, 0) /
      vendas.filter(v => v.rating > 0).length,
  };

  const handleDownloadProof = (venda: any) => {
    if (venda.proofUrl) {
      toast.success(`Baixando comprovante de ${venda.titulo}`);
    } else {
      toast.error('Comprovante não disponível');
    }
  };

  const handleViewDetails = (venda: any) => {
    toast.info(`Abrindo detalhes de ${venda.titulo}`);
  };

  const handleViewOnBlockchain = (venda: any) => {
    toast.info(`Abrindo transação ${venda.transactionId} no blockchain`);
  };

  const handleContactBuyer = (venda: any) => {
    if (venda.comprador) {
      toast.info(`Iniciando conversa com ${venda.comprador}`);
    } else {
      toast.error('Comprador não disponível');
    }
  };

  const handleNewListing = () => {
    toast.info('Abrindo formulário de novo anúncio');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Vendas</h1>
          <p className="text-gray-600">Histórico completo de títulos vendidos e em negociação</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAnalytics(!showAnalytics)}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            Notificações
          </Button>
          <Button onClick={handleNewListing}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Anúncio
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vendas</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.receitaTotal)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vendidos</p>
                <p className="text-2xl font-bold">{stats.vendidos}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ativos</p>
                <p className="text-2xl font-bold">{stats.ativos}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tempo Médio</p>
                <p className="text-2xl font-bold">{stats.tempoMedioVenda.toFixed(1)}d</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avaliação</p>
                <p className="text-2xl font-bold">{stats.ratingMedio.toFixed(1)}/5</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-500" />
          <Input
            placeholder="Buscar por título, comprador ou categoria..."
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
            <SelectItem value="vendido">Vendidos</SelectItem>
            <SelectItem value="ativo">Ativos</SelectItem>
            <SelectItem value="em_negociacao">Em Negociação</SelectItem>
            <SelectItem value="pausado">Pausados</SelectItem>
            <SelectItem value="cancelado">Cancelados</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="data_desc">Data (Mais Recente)</SelectItem>
            <SelectItem value="data_asc">Data (Mais Antiga)</SelectItem>
            <SelectItem value="valor_desc">Valor (Maior)</SelectItem>
            <SelectItem value="valor_asc">Valor (Menor)</SelectItem>
            <SelectItem value="rating_desc">Avaliação (Maior)</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Lista de Vendas */}
      <div className="space-y-4">
        {sortedVendas.map(venda => (
          <Card key={venda.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={venda.avatar} />
                    <AvatarFallback>
                      {venda.comprador ? venda.comprador.charAt(0) : 'T'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{venda.titulo}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600">
                        {venda.comprador || 'Aguardando comprador'}
                      </span>
                      {venda.verified && <Verified className="w-4 h-4 text-blue-500" />}
                      {venda.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-current text-yellow-500" />
                          <span className="text-sm text-gray-600">{venda.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(venda.status)}>
                    {getStatusIcon(venda.status)}
                    <span className="ml-1">{getStatusText(venda.status)}</span>
                  </Badge>
                  <Badge variant="outline">{venda.categoria}</Badge>
                  <Badge className={getBlockchainColor(venda.blockchain)}>
                    <Coins className="w-3 h-3 mr-1" />
                    {venda.blockchain}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-8 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Valor Original</p>
                  <p className="font-semibold">{formatCurrency(venda.valor)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Preço Vendido</p>
                  <p className="font-semibold text-green-600">
                    {venda.precoVenda > 0 ? formatCurrency(venda.precoVenda) : 'Pendente'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Desconto</p>
                  <p className="font-semibold text-blue-600">{venda.desconto}%</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Data da Venda</p>
                  <p className="font-semibold">{formatDate(venda.dataVenda)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Tempo de Venda</p>
                  <p className="font-semibold">
                    {venda.tempoVenda > 0 ? `${venda.tempoVenda} dias` : 'Ativo'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Visualizações</p>
                  <p className="font-semibold">{venda.visualizacoes}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Interessados</p>
                  <p className="font-semibold">{venda.interessados}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Comissão</p>
                  <p className="font-semibold text-orange-600">
                    {venda.comissao > 0 ? formatCurrency(venda.comissao) : 'Pendente'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Button size="sm" variant="outline" onClick={() => handleViewDetails(venda)}>
                  <Eye className="w-4 h-4 mr-1" />
                  Detalhes
                </Button>

                {venda.proofUrl && (
                  <Button size="sm" variant="outline" onClick={() => handleDownloadProof(venda)}>
                    <Download className="w-4 h-4 mr-1" />
                    Comprovante
                  </Button>
                )}

                <Button size="sm" variant="outline" onClick={() => handleViewOnBlockchain(venda)}>
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Blockchain
                </Button>

                {venda.comprador && (
                  <Button size="sm" variant="outline" onClick={() => handleContactBuyer(venda)}>
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Contatar
                  </Button>
                )}

                <Button size="sm" variant="outline">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Relatório
                </Button>

                {venda.status === 'vendido' && (
                  <Badge variant="secondary" className="ml-auto">
                    <Award className="w-3 h-3 mr-1" />
                    Venda Concluída
                  </Badge>
                )}

                {venda.status === 'ativo' && (
                  <Badge variant="secondary" className="ml-auto">
                    <Zap className="w-3 h-3 mr-1" />
                    Anúncio Ativo
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedVendas.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma venda encontrada</h3>
          <p className="text-gray-500">Ajuste os filtros ou crie seu primeiro anúncio</p>
          <Button className="mt-4" onClick={handleNewListing}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeiro Anúncio
          </Button>
        </div>
      )}
    </div>
  );
}
