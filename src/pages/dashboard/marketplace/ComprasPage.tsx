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
  ShoppingCart,
  Package,
  Calendar,
  Eye,
  Star,
  Filter,
  Search,
  Download,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  DollarSign,
  RefreshCw,
  BarChart3,
  ArrowUpDown,
  Bell,
  MessageSquare,
  Shield,
  Verified,
  ExternalLink,
  Coins,
  Activity,
  XCircle,
  Copy,
  Info,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Compra {
  id: string;
  titulo: string;
  valor: number;
  precoCompra: number;
  economia: number;
  dataCompra: string;
  status: string;
  vendedor: string;
  categoria: string;
  rating: number;
  transactionId: string;
  proofUrl: string | null;
  tokenId: string;
  blockchain: string;
  avatar: string;
  verified: boolean;
  documentos: string[];
  liquidacao: string | null;
  comissao: number;
}

export default function ComprasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('data_desc');
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('todos');
  const [selectedCompra, setSelectedCompra] = useState<Compra | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAvaliacaoModal, setShowAvaliacaoModal] = useState(false);
  const [compraParaAvaliar, setCompraParaAvaliar] = useState<Compra | null>(null);
  const [avaliacao, setAvaliacao] = useState({
    rating: 5,
    comentario: '',
    recomendaria: true
  });

  const compras = [
    {
      id: '1',
      titulo: 'ICMS - Exportação Agronegócio',
      valor: 850000,
      precoCompra: 765000,
      economia: 85000,
      dataCompra: '2024-01-15',
      status: 'concluida',
      vendedor: 'AgroExport Brasil Ltda',
      categoria: 'ICMS',
      rating: 4.8,
      transactionId: 'TXN_20240115_001',
      proofUrl: '/proof/TXN_20240115_001.pdf',
      tokenId: 'ERC-721-001',
      blockchain: 'Ethereum',
      avatar: '/avatars/agroexport.png',
      verified: true,
      documentos: ['Título Original', 'Certidões', 'Contrato'],
      liquidacao: '2024-01-16',
      comissao: 22950,
    },
    {
      id: '2',
      titulo: 'PIS/COFINS - Indústria Química',
      valor: 420000,
      precoCompra: 378000,
      economia: 42000,
      dataCompra: '2024-01-12',
      status: 'processando',
      vendedor: 'Química Industrial SP',
      categoria: 'PIS/COFINS',
      rating: 4.5,
      transactionId: 'TXN_20240112_002',
      proofUrl: '/proof/TXN_20240112_002.pdf',
      tokenId: 'ERC-1155-002',
      blockchain: 'Polygon',
      avatar: '/avatars/quimica.png',
      verified: true,
      documentos: ['Título Original', 'Certidões'],
      liquidacao: '2024-01-14',
      comissao: 11340,
    },
    {
      id: '3',
      titulo: 'Precatório Judicial TJSP',
      valor: 1200000,
      precoCompra: 960000,
      economia: 240000,
      dataCompra: '2024-01-10',
      status: 'concluida',
      vendedor: 'Investimentos Premium SA',
      categoria: 'Precatório',
      rating: 4.9,
      transactionId: 'TXN_20240110_003',
      proofUrl: '/proof/TXN_20240110_003.pdf',
      tokenId: 'ERC-721-003',
      blockchain: 'Ethereum',
      avatar: '/avatars/premium.png',
      verified: true,
      documentos: ['Precatório', 'Certidões', 'Contrato', 'Laudo'],
      liquidacao: '2024-01-11',
      comissao: 28800,
    },
    {
      id: '4',
      titulo: 'IPI - Manufatura Eletrônicos',
      valor: 320000,
      precoCompra: 288000,
      economia: 32000,
      dataCompra: '2024-01-08',
      status: 'concluida',
      vendedor: 'TechManufatura Ltda',
      categoria: 'IPI',
      rating: 4.6,
      transactionId: 'TXN_20240108_004',
      proofUrl: '/proof/TXN_20240108_004.pdf',
      tokenId: 'ERC-1155-004',
      blockchain: 'Polygon',
      avatar: '/avatars/tech.png',
      verified: false,
      documentos: ['Título Original', 'Certidões'],
      liquidacao: '2024-01-09',
      comissao: 8640,
    },
    {
      id: '5',
      titulo: 'IRPJ/CSLL - Serviços Financeiros',
      valor: 680000,
      precoCompra: 612000,
      economia: 68000,
      dataCompra: '2024-01-05',
      status: 'pendente_docs',
      vendedor: 'FinanceServ Corp',
      categoria: 'IRPJ/CSLL',
      rating: 4.7,
      transactionId: 'TXN_20240105_005',
      proofUrl: null,
      tokenId: 'ERC-20-005',
      blockchain: 'Ethereum',
      avatar: '/avatars/finance.png',
      verified: true,
      documentos: ['Título Original'],
      liquidacao: null,
      comissao: 18360,
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
      case 'concluida':
        return 'bg-green-100 text-green-800';
      case 'processando':
        return 'bg-blue-100 text-blue-800';
      case 'pendente_docs':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'concluida':
        return 'Concluída';
      case 'processando':
        return 'Processando';
      case 'pendente_docs':
        return 'Pendente Docs';
      case 'cancelada':
        return 'Cancelada';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluida':
        return <CheckCircle className="w-4 h-4" />;
      case 'processando':
        return <Clock className="w-4 h-4" />;
      case 'pendente_docs':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelada':
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

  const filteredCompras = compras.filter(compra => {
    const matchesSearch =
      compra.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compra.vendedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compra.categoria.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'todos' || compra.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedCompras = [...filteredCompras].sort((a, b) => {
    switch (sortBy) {
      case 'data_desc':
        return new Date(b.dataCompra).getTime() - new Date(a.dataCompra).getTime();
      case 'data_asc':
        return new Date(a.dataCompra).getTime() - new Date(b.dataCompra).getTime();
      case 'valor_desc':
        return b.precoCompra - a.precoCompra;
      case 'valor_asc':
        return a.precoCompra - b.precoCompra;
      case 'economia_desc':
        return b.economia - a.economia;
      default:
        return 0;
    }
  });

  // Estatísticas
  const stats = {
    total: compras.length,
    concluidas: compras.filter(c => c.status === 'concluida').length,
    processando: compras.filter(c => c.status === 'processando').length,
    pendentes: compras.filter(c => c.status === 'pendente_docs').length,
    valorTotal: compras.reduce((sum, c) => sum + c.precoCompra, 0),
    economiaTotal: compras.reduce((sum, c) => sum + c.economia, 0),
    comissaoTotal: compras.reduce((sum, c) => sum + c.comissao, 0),
    ratingMedio: compras.reduce((sum, c) => sum + c.rating, 0) / compras.length,
  };

  const handleDownloadProof = (compra: any) => {
    if (compra.proofUrl) {
      toast.success(`Baixando comprovante de ${compra.titulo}`);
      // Simular download
      const link = document.createElement('a');
      link.href = compra.proofUrl;
      link.download = `comprovante_${compra.transactionId}.pdf`;
      link.click();
    } else {
      toast.error('Comprovante não disponível');
    }
  };

  const handleViewDetails = (compra: Compra) => {
    setSelectedCompra(compra);
    setShowDetailsModal(true);
  };

  const handleViewOnBlockchain = (compra: Compra) => {
    toast.info(`Abrindo transação ${compra.transactionId} no blockchain`);
    // Simulação de abertura do explorador de blockchain
    window.open(`https://explorer.blockchain.com/tx/${compra.transactionId}`, '_blank');
  };

  const handleContactSeller = (compra: Compra) => {
    toast.info(`Iniciando conversa com ${compra.vendedor}`);
  };
  
  const handleAvaliarVendedor = (compra: Compra) => {
    setCompraParaAvaliar(compra);
    setShowAvaliacaoModal(true);
  };
  
  const handleSalvarAvaliacao = () => {
    toast.success(`Avaliação de ${compraParaAvaliar?.vendedor} enviada com sucesso!`);
    setShowAvaliacaoModal(false);
    setAvaliacao({
      rating: 5,
      comentario: '',
      recomendaria: true
    });
    setCompraParaAvaliar(null);
  };
  
  const handleGerarRelatorioCompras = () => {
    toast.success('Relatório de compras gerado! Download iniciado.');
    // Simular download
    const element = document.createElement('a');
    const totalCompras = compras.length;
    const totalGasto = compras.reduce((acc, compra) => acc + compra.precoCompra, 0);
    const totalEconomia = compras.reduce((acc, compra) => acc + compra.economia, 0);
    
    const file = new Blob([
      `Relatório de Compras - Tributa.AI\n\n` +
      `Total de compras: ${totalCompras}\n` +
      `Total gasto: R$ ${totalGasto.toLocaleString('pt-BR')}\n` +
      `Total economizado: R$ ${totalEconomia.toLocaleString('pt-BR')}\n\n` +
      `Detalhes das Compras:\n` +
      compras.map(c => 
        `${c.titulo} - ${formatCurrency(c.precoCompra)} - ${c.status}`
      ).join('\n')
    ], { type: 'text/plain' });
    
    element.href = URL.createObjectURL(file);
    element.download = 'relatorio-compras.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  const calcularDesconto = (valor: number, precoCompra: number): number => {
    return Math.round(((valor - precoCompra) / valor) * 100);
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    toast.info('Atualizando dados...');
    
    // Simular atualização de dados
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Dados atualizados com sucesso!');
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Compras</h1>
          <p className="text-gray-600">Histórico completo de títulos de crédito adquiridos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell className="w-4 h-4 mr-2" />
            Notificações
          </Button>
          <Button onClick={handleRefreshData} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
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
                <p className="text-sm text-gray-600">Total Compras</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Investido</p>
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
                <p className="text-sm text-gray-600">Economia Total</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.economiaTotal)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold">{stats.concluidas}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processando</p>
                <p className="text-2xl font-bold">{stats.processando}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Satisfação</p>
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
            <SelectItem value="concluida">Concluídas</SelectItem>
            <SelectItem value="processando">Processando</SelectItem>
            <SelectItem value="pendente_docs">Pendente Docs</SelectItem>
            <SelectItem value="cancelada">Canceladas</SelectItem>
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
            <SelectItem value="economia_desc">Economia (Maior)</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={handleGerarRelatorioCompras}>
          <BarChart3 className="w-4 h-4 mr-2" />
          Relatório
        </Button>
      </div>

      {/* Lista de Compras */}
      <div className="space-y-4">
        {sortedCompras.map(compra => (
          <Card key={compra.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={compra.avatar} />
                    <AvatarFallback>{compra.vendedor.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{compra.titulo}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600">{compra.vendedor}</span>
                      {compra.verified && <Verified className="w-4 h-4 text-blue-500" />}
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current text-yellow-500" />
                        <span className="text-sm text-gray-600">{compra.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(compra.status)}>
                    {getStatusIcon(compra.status)}
                    <span className="ml-1">{getStatusText(compra.status)}</span>
                  </Badge>
                  <Badge variant="outline">{compra.categoria}</Badge>
                  <Badge className={getBlockchainColor(compra.blockchain)}>
                    <Coins className="w-3 h-3 mr-1" />
                    {compra.blockchain}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-8 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Valor Original</p>
                  <p className="font-semibold">{formatCurrency(compra.valor)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Preço Pago</p>
                  <p className="font-semibold text-blue-600">
                    {formatCurrency(compra.precoCompra)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Economia</p>
                  <p className="font-semibold text-green-600">{formatCurrency(compra.economia)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Data da Compra</p>
                  <p className="font-semibold">{formatDate(compra.dataCompra)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Liquidação</p>
                  <p className="font-semibold">
                    {compra.liquidacao ? formatDate(compra.liquidacao) : 'Pendente'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Token ID</p>
                  <p className="font-semibold text-xs">{compra.tokenId}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Comissão</p>
                  <p className="font-semibold text-orange-600">{formatCurrency(compra.comissao)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Documentos</p>
                  <p className="font-semibold">{compra.documentos.length} docs</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Button size="sm" variant="outline" onClick={() => handleViewDetails(compra)}>
                  <Eye className="w-4 h-4 mr-1" />
                  Detalhes
                </Button>

                {compra.proofUrl && (
                  <Button size="sm" variant="outline" onClick={() => handleDownloadProof(compra)}>
                    <Download className="w-4 h-4 mr-1" />
                    Comprovante
                  </Button>
                )}

                <Button size="sm" variant="outline" onClick={() => handleViewOnBlockchain(compra)}>
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Blockchain
                </Button>

                <Button size="sm" variant="outline" onClick={() => handleContactSeller(compra)}>
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Contatar
                </Button>

                <Button size="sm" variant="outline" onClick={() => handleAvaliarVendedor(compra)}>
                  <Star className="w-4 h-4 mr-1" />
                  Avaliar
                </Button>

                {compra.status === 'concluida' && (
                  <Badge variant="secondary" className="ml-auto">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Transação Concluída
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedCompras.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma compra encontrada</h3>
          <p className="text-gray-500">
            Ajuste os filtros ou faça sua primeira compra no marketplace
          </p>
        </div>
      )}

      {/* Modal de Detalhes */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="mx-4 sm:mx-auto max-w-full sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl">Detalhes da Compra</DialogTitle>
            <DialogDescription>
              Informações completas sobre a transação e o título adquirido
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 pr-4">
            {selectedCompra && (
              <div className="space-y-6">
                {/* Cabeçalho */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={selectedCompra.avatar} />
                      <AvatarFallback>{selectedCompra.vendedor.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-bold">{selectedCompra.titulo}</h2>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{selectedCompra.vendedor}</span>
                        {selectedCompra.verified && <Verified className="w-4 h-4 text-blue-500" />}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(selectedCompra.status)}>
                    {getStatusIcon(selectedCompra.status)}
                    <span className="ml-1">{getStatusText(selectedCompra.status)}</span>
                  </Badge>
                </div>
                
                <Separator />
                
                {/* Informações Principais */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                        Informações Financeiras
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-500">Valor Original</p>
                        <p className="font-semibold">{formatCurrency(selectedCompra.valor)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Preço de Compra</p>
                        <p className="font-semibold text-blue-600">{formatCurrency(selectedCompra.precoCompra)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Economia</p>
                        <p className="font-semibold text-green-600">{formatCurrency(selectedCompra.economia)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Comissão</p>
                        <p className="font-semibold text-orange-600">{formatCurrency(selectedCompra.comissao)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Desconto</p>
                        <p className="font-semibold">{calcularDesconto(selectedCompra.valor, selectedCompra.precoCompra)}%</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2 text-blue-600" />
                        Datas e Prazos
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-500">Data da Compra</p>
                        <p className="font-semibold">{formatDate(selectedCompra.dataCompra)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Liquidação</p>
                        <p className="font-semibold">
                          {selectedCompra.liquidacao ? formatDate(selectedCompra.liquidacao) : 'Pendente'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-purple-600" />
                        Informações do Token
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-500">Token ID</p>
                        <div className="flex items-center gap-1">
                          <p className="font-semibold text-xs">{selectedCompra.tokenId}</p>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5"
                            onClick={() => copyToClipboard(selectedCompra.tokenId)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Blockchain</p>
                        <Badge className={getBlockchainColor(selectedCompra.blockchain)}>
                          <Coins className="w-3 h-3 mr-1" />
                          {selectedCompra.blockchain}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Transaction ID</p>
                        <div className="flex items-center gap-1">
                          <p className="font-semibold text-xs truncate">{selectedCompra.transactionId}</p>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5"
                            onClick={() => copyToClipboard(selectedCompra.transactionId)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Categoria</p>
                        <Badge variant="outline">{selectedCompra.categoria}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Documentos */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Documentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCompra.documentos.map((doc, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{doc}</TableCell>
                            <TableCell>PDF</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                Baixar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                {/* Histórico */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Histórico da Transação
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Compra realizada</p>
                          <p className="text-sm text-gray-500">{formatDate(selectedCompra.dataCompra)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Shield className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Token registrado na blockchain</p>
                          <p className="text-sm text-gray-500">{formatDate(selectedCompra.dataCompra)}</p>
                        </div>
                      </div>
                      
                      {selectedCompra.liquidacao && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">Liquidação concluída</p>
                            <p className="text-sm text-gray-500">{formatDate(selectedCompra.liquidacao)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </ScrollArea>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            {selectedCompra?.proofUrl && (
              <Button 
                variant="outline" 
                onClick={() => handleDownloadProof(selectedCompra)}
                className="w-full sm:w-auto"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar Comprovante
              </Button>
            )}
            
            {selectedCompra && (
              <Button 
                variant="outline" 
                onClick={() => handleViewOnBlockchain(selectedCompra)}
                className="w-full sm:w-auto"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver na Blockchain
              </Button>
            )}
            
            {selectedCompra && (
              <Button 
                variant="outline" 
                onClick={() => handleContactSeller(selectedCompra)}
                className="w-full sm:w-auto"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Contatar Vendedor
              </Button>
            )}
            
            <Button 
              onClick={() => setShowDetailsModal(false)}
              className="w-full sm:w-auto"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Avaliação */}
      <Dialog open={showAvaliacaoModal} onOpenChange={setShowAvaliacaoModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Avaliar Vendedor</DialogTitle>
            <DialogDescription>
              Avalie sua experiência com {compraParaAvaliar?.vendedor}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Nota (1-5 estrelas)</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setAvaliacao({...avaliacao, rating: star})}
                    className="focus:outline-none"
                  >
                    <Star 
                      className={`w-6 h-6 transition-colors ${
                        star <= avaliacao.rating 
                          ? 'text-yellow-500 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Comentário (opcional)</label>
              <textarea
                className="w-full p-2 border rounded-md text-sm"
                rows={3}
                value={avaliacao.comentario}
                onChange={(e) => setAvaliacao({...avaliacao, comentario: e.target.value})}
                placeholder="Conte sua experiência..."
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="recomendaria"
                checked={avaliacao.recomendaria}
                onChange={(e) => setAvaliacao({...avaliacao, recomendaria: e.target.checked})}
                className="rounded"
              />
              <label htmlFor="recomendaria" className="text-sm">
                Recomendaria este vendedor
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAvaliacaoModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarAvaliacao}>
              Enviar Avaliação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
