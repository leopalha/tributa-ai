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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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

export default function VendasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('data_desc');
  const [selectedPeriod, setSelectedPeriod] = useState('todos');
  const [activeTab, setActiveTab] = useState('vendas');
  const [showNovoAnuncio, setShowNovoAnuncio] = useState(false);
  const [showFiltros, setShowFiltros] = useState(false);
  const [selectedVenda, setSelectedVenda] = useState<any>(null);
  const [showDetalhes, setShowDetalhes] = useState(false);
  
  // Estados do formulário de novo anúncio
  const [novoAnuncio, setNovoAnuncio] = useState({
    titulo: '',
    valor: '',
    desconto: '',
    categoria: '',
    descricao: '',
    documentos: [] as string[]
  });
  
  // Estados dos filtros
  const [filtros, setFiltros] = useState({
    valorMin: '',
    valorMax: '',
    dataInicio: '',
    dataFim: '',
    categoria: '',
    status: 'todos'
  });

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
      case 'em_negociacao':
        return 'bg-blue-100 text-blue-800';
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
      case 'em_negociacao':
        return 'Em Negociação';
      case 'cancelado':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };
  
  const handleNovoAnuncio = () => {
    setShowNovoAnuncio(true);
  };
  
  const handleSalvarAnuncio = () => {
    toast.success('Novo anúncio criado com sucesso!');
    setShowNovoAnuncio(false);
    setNovoAnuncio({
      titulo: '',
      valor: '',
      desconto: '',
      categoria: '',
      descricao: '',
      documentos: []
    });
  };
  
  const handleFiltrar = () => {
    setShowFiltros(true);
  };
  
  const handleAplicarFiltros = () => {
    toast.success('Filtros aplicados com sucesso!');
    setShowFiltros(false);
  };
  
  const handleGerarRelatorio = () => {
    toast.success('Relatório de vendas gerado! Download iniciado.');
    // Simular download
    const element = document.createElement('a');
    const file = new Blob(['Relatório de Vendas - Tributa.AI\n\nTotal de vendas: ' + vendas.length], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'relatorio-vendas.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  const handleVerDetalhes = (venda: any) => {
    setSelectedVenda(venda);
    setShowDetalhes(true);
  };
  
  const handleGerarRelatorioVenda = (venda: any) => {
    toast.success(`Relatório da venda ${venda.id} gerado! Download iniciado.`);
    // Simular download do relatório específico
    const element = document.createElement('a');
    const file = new Blob([`Relatório de Venda - ${venda.titulo}\n\nValor: ${formatCurrency(venda.valor)}\nComprador: ${venda.comprador}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `relatorio-venda-${venda.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Vendas</h1>
          <p className="text-gray-600">Histórico de créditos vendidos</p>
        </div>
        <Button onClick={handleNovoAnuncio}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Anúncio
        </Button>
      </div>

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
                <p className="text-2xl font-bold">{formatCurrency(166500)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Desconto Médio</p>
                <p className="text-2xl font-bold">10%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avaliação Média</p>
                <p className="text-2xl font-bold">4.8/5</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={handleFiltrar}>
          <Filter className="w-4 h-4 mr-2" />
          Filtrar
        </Button>
        <Button variant="outline" size="sm" onClick={handleGerarRelatorio}>
          <Eye className="w-4 h-4 mr-2" />
          Relatório
        </Button>
      </div>

      <div className="space-y-4">
        {vendas.map(venda => (
          <Card key={venda.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{venda.titulo}</CardTitle>
                <Badge className={getStatusColor(venda.status)}>
                  {getStatusText(venda.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Valor Original</p>
                  <p className="font-semibold">{formatCurrency(venda.valor)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Preço Vendido</p>
                  <p className="font-semibold text-green-600">{formatCurrency(venda.precoVenda)}</p>
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
                  <p className="text-sm text-gray-600">Comprador</p>
                  <p className="font-semibold">{venda.comprador}</p>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleVerDetalhes(venda)}>
                    Ver Detalhes
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleGerarRelatorioVenda(venda)}>
                    Relatório
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Modal Novo Anúncio */}
      <Dialog open={showNovoAnuncio} onOpenChange={setShowNovoAnuncio}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Anúncio</DialogTitle>
            <DialogDescription>
              Crie um novo anúncio para vender seus créditos tributários
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título do Anúncio</Label>
              <Input
                id="titulo"
                value={novoAnuncio.titulo}
                onChange={(e) => setNovoAnuncio({...novoAnuncio, titulo: e.target.value})}
                placeholder="Ex: IRPJ/CSLL - Serviços Financeiros"
              />
            </div>
            <div>
              <Label htmlFor="valor">Valor do Crédito</Label>
              <Input
                id="valor"
                type="number"
                value={novoAnuncio.valor}
                onChange={(e) => setNovoAnuncio({...novoAnuncio, valor: e.target.value})}
                placeholder="Ex: 680000"
              />
            </div>
            <div>
              <Label htmlFor="desconto">Desconto (%)</Label>
              <Input
                id="desconto"
                type="number"
                value={novoAnuncio.desconto}
                onChange={(e) => setNovoAnuncio({...novoAnuncio, desconto: e.target.value})}
                placeholder="Ex: 10"
              />
            </div>
            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={novoAnuncio.categoria} onValueChange={(value) => setNovoAnuncio({...novoAnuncio, categoria: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IRPJ/CSLL">IRPJ/CSLL</SelectItem>
                  <SelectItem value="ISS">ISS</SelectItem>
                  <SelectItem value="ICMS">ICMS</SelectItem>
                  <SelectItem value="Comercial">Comercial</SelectItem>
                  <SelectItem value="Rural">Rural</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={novoAnuncio.descricao}
                onChange={(e) => setNovoAnuncio({...novoAnuncio, descricao: e.target.value})}
                placeholder="Descreva os detalhes do crédito..."
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowNovoAnuncio(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSalvarAnuncio} className="flex-1">
                Criar Anúncio
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Sheet Filtros */}
      <Sheet open={showFiltros} onOpenChange={setShowFiltros}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filtros Avançados</SheetTitle>
            <SheetDescription>
              Configure os filtros para encontrar vendas específicas
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div>
              <Label htmlFor="valorMin">Valor Mínimo</Label>
              <Input
                id="valorMin"
                type="number"
                value={filtros.valorMin}
                onChange={(e) => setFiltros({...filtros, valorMin: e.target.value})}
                placeholder="Ex: 100000"
              />
            </div>
            <div>
              <Label htmlFor="valorMax">Valor Máximo</Label>
              <Input
                id="valorMax"
                type="number"
                value={filtros.valorMax}
                onChange={(e) => setFiltros({...filtros, valorMax: e.target.value})}
                placeholder="Ex: 1000000"
              />
            </div>
            <div>
              <Label htmlFor="dataInicio">Data Início</Label>
              <Input
                id="dataInicio"
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="dataFim">Data Fim</Label>
              <Input
                id="dataFim"
                type="date"
                value={filtros.dataFim}
                onChange={(e) => setFiltros({...filtros, dataFim: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="categoriaFiltro">Categoria</Label>
              <Select value={filtros.categoria} onValueChange={(value) => setFiltros({...filtros, categoria: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="IRPJ/CSLL">IRPJ/CSLL</SelectItem>
                  <SelectItem value="ISS">ISS</SelectItem>
                  <SelectItem value="ICMS">ICMS</SelectItem>
                  <SelectItem value="Comercial">Comercial</SelectItem>
                  <SelectItem value="Rural">Rural</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="statusFiltro">Status</Label>
              <Select value={filtros.status} onValueChange={(value) => setFiltros({...filtros, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="vendido">Vendido</SelectItem>
                  <SelectItem value="processando">Processando</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setFiltros({
                    valorMin: '',
                    valorMax: '',
                    dataInicio: '',
                    dataFim: '',
                    categoria: '',
                    status: 'todos'
                  });
                }}
                className="flex-1"
              >
                Limpar
              </Button>
              <Button onClick={handleAplicarFiltros} className="flex-1">
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Modal Detalhes da Venda */}
      <Dialog open={showDetalhes} onOpenChange={setShowDetalhes}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Venda</DialogTitle>
            <DialogDescription>
              Informações completas da transação
            </DialogDescription>
          </DialogHeader>
          {selectedVenda && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Título</Label>
                  <p className="text-sm text-gray-700">{selectedVenda.titulo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Transaction ID</Label>
                  <p className="text-sm font-mono text-gray-700">{selectedVenda.transactionId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Valor Original</Label>
                  <p className="text-sm text-gray-700">{formatCurrency(selectedVenda.valor)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Preço Vendido</Label>
                  <p className="text-sm text-green-600 font-semibold">{formatCurrency(selectedVenda.precoVenda)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Comissão (3%)</Label>
                  <p className="text-sm text-blue-600">{formatCurrency(selectedVenda.comissao)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Blockchain</Label>
                  <p className="text-sm text-gray-700">{selectedVenda.blockchain}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Token ID</Label>
                  <p className="text-sm font-mono text-gray-700">{selectedVenda.tokenId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Data de Liquidação</Label>
                  <p className="text-sm text-gray-700">{selectedVenda.liquidacao ? formatDate(selectedVenda.liquidacao) : 'Pendente'}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Comprador</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={selectedVenda.avatar} />
                    <AvatarFallback>{selectedVenda.comprador.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{selectedVenda.comprador}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-600">{selectedVenda.rating}</span>
                      {selectedVenda.verified && <Verified className="w-3 h-3 text-blue-500" />}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Documentos</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedVenda.documentos.map((doc: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <FileText className="w-3 h-3 mr-1" />
                      {doc}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Tempo para Venda</p>
                  <p className="text-lg font-semibold">{selectedVenda.tempoVenda} dias</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Visualizações</p>
                  <p className="text-lg font-semibold">{selectedVenda.visualizacoes}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Avaliação do Comprador</p>
                  <p className="text-lg font-semibold">
                    {selectedVenda.avaliacaoComprador ? `${selectedVenda.avaliacaoComprador}/5` : 'Pendente'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowDetalhes(false)} className="flex-1">
                  Fechar
                </Button>
                <Button onClick={() => handleGerarRelatorioVenda(selectedVenda)} className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Relatório
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
