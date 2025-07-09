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
  BarChart3,
  ArrowUpDown,
  Bell,
  MessageSquare,
  Shield,
  Verified,
  ExternalLink,
  Activity,
  Calendar,
  Users,
  Gavel,
  Edit,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

export default function VendasPageEnhanced() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('data_desc');
  const [selectedPeriod, setSelectedPeriod] = useState('todos');
  const [activeTab, setActiveTab] = useState('vendas');

  const vendas = [
    {
      id: '1',
      titulo: 'IRPJ/CSLL - Serviços Financeiros Tokenizado',
      valor: 680000,
      precoVenda: 612000,
      desconto: 10,
      dataVenda: '2024-01-20',
      status: 'vendido',
      comprador: 'FinanceServ Corp',
      categoria: 'IRPJ/CSLL',
      rating: 4.9,
      transactionId: 'SALE_20240120_001',
      proofUrl: '/proof/SALE_20240120_001.pdf',
      tokenId: 'ERC-20-001',
      blockchain: 'Ethereum',
      avatar: '/avatars/finance.png',
      verified: true,
      comissao: 18360,
      liquidacao: '2024-01-21',
      documentos: ['Título Original', 'Certidões', 'Contrato'],
      avaliacaoComprador: 4.9,
      tempoVenda: 5,
      visualizacoes: 234,
    },
    {
      id: '2',
      titulo: 'ISS - Prestação de Serviços Tokenizado',
      valor: 180000,
      precoVenda: 162000,
      desconto: 10,
      dataVenda: '2024-01-18',
      status: 'vendido',
      comprador: 'Consultoria Fiscal SA',
      categoria: 'ISS',
      rating: 4.6,
      transactionId: 'SALE_20240118_002',
      proofUrl: '/proof/SALE_20240118_002.pdf',
      tokenId: 'ERC-1155-002',
      blockchain: 'Polygon',
      avatar: '/avatars/consultoria.png',
      verified: true,
      comissao: 4860,
      liquidacao: '2024-01-19',
      documentos: ['Título Original', 'Certidões'],
      avaliacaoComprador: 4.6,
      tempoVenda: 3,
      visualizacoes: 156,
    },
    {
      id: '3',
      titulo: 'Duplicata Comercial Tokenizada',
      valor: 450000,
      precoVenda: 405000,
      desconto: 10,
      dataVenda: '2024-01-15',
      status: 'processando',
      comprador: 'Comercial Distribuidora Ltda',
      categoria: 'Comercial',
      rating: 4.7,
      transactionId: 'SALE_20240115_003',
      proofUrl: null,
      tokenId: 'ERC-1155-003',
      blockchain: 'Polygon',
      avatar: '/avatars/comercial.png',
      verified: false,
      comissao: 12150,
      liquidacao: null,
      documentos: ['Título Original'],
      avaliacaoComprador: null,
      tempoVenda: 8,
      visualizacoes: 189,
    },
  ];

  const anunciosAtivos = [
    {
      id: '4',
      titulo: 'Crédito Rural Tokenizado',
      valor: 950000,
      precoAtual: 855000,
      desconto: 10,
      dataPublicacao: '2024-01-22',
      status: 'ativo',
      categoria: 'Rural',
      propostas: 12,
      visualizacoes: 567,
      interessados: 23,
      tokenId: 'ERC-721-004',
      blockchain: 'Ethereum',
      tempoRestante: 86400,
      lanceAtual: 860000,
      totalLances: 8,
    },
    {
      id: '5',
      titulo: 'ICMS - Exportação Agronegócio Tokenizado',
      valor: 850000,
      precoAtual: 765000,
      desconto: 10,
      dataPublicacao: '2024-01-20',
      status: 'negociacao',
      categoria: 'ICMS',
      propostas: 5,
      visualizacoes: 234,
      interessados: 15,
      tokenId: 'ERC-721-005',
      blockchain: 'Ethereum',
      tempoRestante: 172800,
      lanceAtual: 770000,
      totalLances: 3,
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

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'vendido':
        return 'bg-green-100 text-green-800';
      case 'processando':
        return 'bg-blue-100 text-blue-800';
      case 'ativo':
        return 'bg-blue-100 text-blue-800';
      case 'negociacao':
        return 'bg-yellow-100 text-yellow-800';
      case 'pausado':
        return 'bg-gray-100 text-gray-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'vendido':
        return 'Vendido';
      case 'processando':
        return 'Processando';
      case 'ativo':
        return 'Ativo';
      case 'negociacao':
        return 'Em Negociação';
      case 'pausado':
        return 'Pausado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'vendido':
        return <CheckCircle className="w-4 h-4" />;
      case 'processando':
        return <Clock className="w-4 h-4" />;
      case 'ativo':
        return <Activity className="w-4 h-4" />;
      case 'negociacao':
        return <MessageSquare className="w-4 h-4" />;
      case 'pausado':
        return <Clock className="w-4 h-4" />;
      case 'cancelado':
        return <AlertCircle className="w-4 h-4" />;
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

  const handleDownloadProof = (venda: any) => {
    if (venda.proofUrl) {
      const link = document.createElement('a');
      link.href = venda.proofUrl;
      link.download = `comprovante_venda_${venda.transactionId}.pdf`;
      link.click();
      toast.success('Comprovante de venda baixado com sucesso!');
    } else {
      toast.error('Comprovante não disponível');
    }
  };

  const handleViewDetails = (venda: any) => {
    toast.info(`Visualizando detalhes da venda: ${venda.titulo}`);
  };

  const handleViewOnBlockchain = (venda: any) => {
    const explorerUrl =
      venda.blockchain === 'Ethereum'
        ? `https://etherscan.io/token/${venda.tokenId}`
        : `https://polygonscan.com/token/${venda.tokenId}`;
    window.open(explorerUrl, '_blank');
    toast.info(`Visualizando na blockchain: ${venda.tokenId}`);
  };

  const handleContactBuyer = (venda: any) => {
    toast.info(`Contatando comprador: ${venda.comprador}`);
  };

  const handleEditListing = (anuncio: any) => {
    toast.info(`Editando anúncio: ${anuncio.titulo}`);
  };

  const handlePauseListing = (anuncio: any) => {
    toast.success(`Anúncio pausado: ${anuncio.titulo}`);
  };

  const handleDeleteListing = (anuncio: any) => {
    toast.success(`Anúncio removido: ${anuncio.titulo}`);
  };

  const handleGenerateReport = () => {
    toast.success('Relatório de vendas gerado com sucesso!');
  };

  const handleExportData = () => {
    const allData = { vendas, anunciosAtivos };
    const dataStr = JSON.stringify(allData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'minhas_vendas.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success('Dados de vendas exportados com sucesso!');
  };

  const formatTimeRemaining = (seconds: number): string => {
    if (seconds <= 0) return 'Encerrado';

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else {
      return `${hours}h`;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Vendas</h1>
          <p className="text-gray-600">Gerencie suas vendas e anúncios ativos</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleGenerateReport}>
            <FileText className="w-4 h-4 mr-2" />
            Relatório
          </Button>
          <Button variant="outline" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Anúncio
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vendas">Vendas Concluídas</TabsTrigger>
          <TabsTrigger value="anuncios">Anúncios Ativos</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="vendas" className="space-y-6">
          {/* Métricas de Vendas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Vendas</p>
                    <p className="text-2xl font-bold">{vendas.length}</p>
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
                    <p className="text-2xl font-bold">{formatCurrency(1179000)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Comissões</p>
                    <p className="text-2xl font-bold">{formatCurrency(35370)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avaliação</p>
                    <p className="text-2xl font-bold">4.7/5</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-500" />
              <Input
                placeholder="Buscar vendas..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="vendido">Vendido</SelectItem>
                <SelectItem value="processando">Processando</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="data_desc">Data ↓</SelectItem>
                <SelectItem value="data_asc">Data ↑</SelectItem>
                <SelectItem value="valor_desc">Valor ↓</SelectItem>
                <SelectItem value="valor_asc">Valor ↑</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lista de Vendas */}
          <div className="space-y-4">
            {vendas.map(venda => (
              <Card key={venda.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={venda.avatar} />
                        <AvatarFallback>{venda.comprador.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{venda.titulo}</CardTitle>
                        <p className="text-sm text-gray-600">Vendido para {venda.comprador}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(venda.status)}>
                        {getStatusIcon(venda.status)}
                        {getStatusText(venda.status)}
                      </Badge>
                      {venda.verified && (
                        <Badge variant="outline" className="text-green-600">
                          <Verified className="w-3 h-3 mr-1" />
                          Verificado
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Valor Original</p>
                      <p className="font-semibold">{formatCurrency(venda.valor)}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Preço Vendido</p>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(venda.precoVenda)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Comissão</p>
                      <p className="font-semibold text-blue-600">
                        {formatCurrency(venda.comissao)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Data da Venda</p>
                      <p className="font-semibold">{formatDate(venda.dataVenda)}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Tempo de Venda</p>
                      <p className="font-semibold">{venda.tempoVenda} dias</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Visualizações</p>
                      <p className="font-semibold flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {venda.visualizacoes}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getBlockchainColor(venda.blockchain)}>
                        {venda.blockchain}
                      </Badge>
                      <span className="text-sm text-gray-600">Token: {venda.tokenId}</span>
                      {venda.avaliacaoComprador && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{venda.avaliacaoComprador}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails(venda)}>
                        <Eye className="w-4 h-4 mr-1" />
                        Detalhes
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewOnBlockchain(venda)}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Blockchain
                      </Button>
                      {venda.proofUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadProof(venda)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Comprovante
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => handleContactBuyer(venda)}>
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Contato
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="anuncios" className="space-y-6">
          {/* Métricas de Anúncios */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Anúncios Ativos</p>
                    <p className="text-2xl font-bold">{anunciosAtivos.length}</p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Valor Total</p>
                    <p className="text-2xl font-bold">{formatCurrency(1620000)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Propostas</p>
                    <p className="text-2xl font-bold">17</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Visualizações</p>
                    <p className="text-2xl font-bold">801</p>
                  </div>
                  <Eye className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Anúncios Ativos */}
          <div className="space-y-4">
            {anunciosAtivos.map(anuncio => (
              <Card key={anuncio.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{anuncio.titulo}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(anuncio.status)}>
                        {getStatusIcon(anuncio.status)}
                        {getStatusText(anuncio.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Valor Original</p>
                      <p className="font-semibold">{formatCurrency(anuncio.valor)}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Preço Atual</p>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(anuncio.precoAtual)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Propostas</p>
                      <p className="font-semibold flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {anuncio.propostas}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Visualizações</p>
                      <p className="font-semibold flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {anuncio.visualizacoes}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Interessados</p>
                      <p className="font-semibold flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {anuncio.interessados}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Tempo Restante</p>
                      <p className="font-semibold flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTimeRemaining(anuncio.tempoRestante)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getBlockchainColor(anuncio.blockchain)}>
                        {anuncio.blockchain}
                      </Badge>
                      <span className="text-sm text-gray-600">Token: {anuncio.tokenId}</span>
                      {anuncio.lanceAtual && (
                        <span className="text-sm text-green-600 font-medium">
                          Lance: {formatCurrency(anuncio.lanceAtual)}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditListing(anuncio)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePauseListing(anuncio)}
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        Pausar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(anuncio)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Detalhes
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteListing(anuncio)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Taxa de Conversão</span>
                    <span className="font-semibold">15.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tempo Médio de Venda</span>
                    <span className="font-semibold">5.3 dias</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Desconto Médio</span>
                    <span className="font-semibold">10%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avaliação Média</span>
                    <span className="font-semibold">4.7/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['IRPJ/CSLL', 'ISS', 'Comercial', 'Rural', 'ICMS'].map((categoria, index) => (
                    <div key={categoria} className="flex items-center justify-between">
                      <span className="text-sm">{categoria}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(index + 1) * 20}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
