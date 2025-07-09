import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Eye, Share2, Clock, DollarSign, Package, Coins, Award, Database, Star } from 'lucide-react';
import { toast } from 'sonner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ScrollArea,
  ScrollBar,
  ScrollViewport,
  ScrollElement,
} from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  Search,
  Filter,
  RefreshCw,
  Download,
  ExternalLink,
  MessageSquare,
  CheckCircle,
  XCircle,
  Bell,
  Calendar,
  Verified,
  ShoppingCart,
  FileText,
  MoreVertical,
  Pause,
  Play,
  Hash,
  User,
} from 'lucide-react';
import {
  Separator,
} from '@/components/ui/separator';

interface UserToken {
  id: string;
  tokenId: string;
  titulo: string;
  valor: number;
  tipo: string;
  categoria: string;
  empresa: string;
  blockchain: string;
  padrao: string;
  hash: string;
  dataCreacao: string;
  status: 'ativo' | 'pausado' | 'vendido';
  transferivel: boolean;
  fracionavel: boolean;
}

interface Anuncio {
  id: string;
  titulo: string;
  valor: number;
  precoVenda: number;
  desconto: number;
  categoria: string;
  status: 'ativo' | 'pausado' | 'vendido' | 'expirado';
  visualizacoes: number;
  interessados: number;
  dataPublicacao: string;
  prazoVenda: number;
  tokenId?: string;
}

export default function AnunciosPage() {
  const [userTokens, setUserTokens] = useState<UserToken[]>([]);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [showNewAnuncioDialog, setShowNewAnuncioDialog] = useState(false);
  const [selectedToken, setSelectedToken] = useState<UserToken | null>(null);
  const [precoVenda, setPrecoVenda] = useState('');
  const [descricaoAnuncio, setDescricaoAnuncio] = useState('');
  const [prazoVenda, setPrazoVenda] = useState('30');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('data_desc');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    categoria: '',
    valorMin: '',
    valorMax: '',
    dataInicio: '',
    dataFim: '',
    desconto: '',
    visualizacoes: ''
  });

  // Carregar tokens do usuário e anúncios
  useEffect(() => {
    const loadData = () => {
      try {
        // Carregar tokens do usuário
        const savedTokens = localStorage.getItem('userTokens');
        if (savedTokens) {
          setUserTokens(JSON.parse(savedTokens));
        }

        // Carregar anúncios existentes
        const savedAnuncios = localStorage.getItem('userAnuncios');
        if (savedAnuncios) {
          setAnuncios(JSON.parse(savedAnuncios));
        } else {
          // Anúncios de exemplo
          const exampleAnuncios: Anuncio[] = [
            {
              id: '1',
              titulo: 'Crédito ICMS - Exportação Soja',
              valor: 150000,
              precoVenda: 135000,
              desconto: 10,
              categoria: 'ICMS',
              status: 'ativo',
              visualizacoes: 45,
              interessados: 8,
              dataPublicacao: '2024-01-15',
              prazoVenda: 30,
            },
            {
              id: '2',
              titulo: 'PIS/COFINS - Indústria Química',
              valor: 85000,
              precoVenda: 76500,
              desconto: 10,
              categoria: 'PIS/COFINS',
              status: 'pausado',
              visualizacoes: 23,
              interessados: 3,
              dataPublicacao: '2024-01-10',
              prazoVenda: 45,
            },
          ];
          setAnuncios(exampleAnuncios);
        }

        // Verificar se há token selecionado para anúncio
        const tokenParaAnuncio = localStorage.getItem('tokenParaAnuncio');
        if (tokenParaAnuncio) {
          const token = JSON.parse(tokenParaAnuncio);
          setSelectedToken(token);
          setShowNewAnuncioDialog(true);
          localStorage.removeItem('tokenParaAnuncio');
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadData();
  }, []);

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
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'pausado':
        return 'bg-yellow-100 text-yellow-800';
      case 'vendido':
        return 'bg-blue-100 text-blue-800';
      case 'expirado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'ativo':
        return 'Ativo';
      case 'pausado':
        return 'Pausado';
      case 'vendido':
        return 'Vendido';
      case 'expirado':
        return 'Expirado';
      default:
        return 'Desconhecido';
    }
  };

  const calcularDesconto = (valorOriginal: number, precoVenda: number): number => {
    return Math.round(((valorOriginal - precoVenda) / valorOriginal) * 100);
  };

  const criarAnuncio = () => {
    if (!selectedToken || !precoVenda) {
      toast.error('❌ Selecione um token e defina o preço de venda');
      return;
    }

    const precoVendaNum = parseFloat(precoVenda);
    if (precoVendaNum <= 0 || precoVendaNum >= selectedToken.valor) {
      toast.error('❌ Preço de venda deve ser maior que 0 e menor que o valor original');
      return;
    }

    const novoAnuncio: Anuncio = {
      id: Math.random().toString(36).substr(2, 9),
      titulo: selectedToken.titulo,
      valor: selectedToken.valor,
      precoVenda: precoVendaNum,
      desconto: calcularDesconto(selectedToken.valor, precoVendaNum),
      categoria: selectedToken.tipo,
      status: 'ativo',
      visualizacoes: 0,
      interessados: 0,
      dataPublicacao: new Date().toISOString().split('T')[0],
      prazoVenda: parseInt(prazoVenda),
      tokenId: selectedToken.tokenId,
    };

    const novosAnuncios = [...anuncios, novoAnuncio];
    setAnuncios(novosAnuncios);
    localStorage.setItem('userAnuncios', JSON.stringify(novosAnuncios));

    toast.success('🎉 Anúncio criado com sucesso!');
    setShowNewAnuncioDialog(false);
    setSelectedToken(null);
    setPrecoVenda('');
    setDescricaoAnuncio('');
    setPrazoVenda('30');
  };

  const totalAnunciosAtivos = anuncios.filter(a => a.status === 'ativo').length;
  const totalValorAnuncios = anuncios.reduce((sum, a) => sum + a.valor, 0);
  const totalVisualizacoes = anuncios.reduce((sum, a) => sum + a.visualizacoes, 0);
  const totalInteressados = anuncios.reduce((sum, a) => sum + a.interessados, 0);

  const applyFilters = () => {
    setIsLoading(true);
    
    // Simular aplicação de filtros
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Filtros aplicados com sucesso');
    }, 800);
  };

  const clearFilters = () => {
    setFilterOptions({
      categoria: '',
      valorMin: '',
      valorMax: '',
      dataInicio: '',
      dataFim: '',
      desconto: '',
      visualizacoes: ''
    });
    toast.info('Filtros limpos');
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

  const handleEditAnuncio = (anuncio: Anuncio) => {
    toast.info(`Editando anúncio: ${anuncio.titulo}`);
  };

  const handlePauseAnuncio = (anuncio: Anuncio) => {
    toast.info(`${anuncio.status === 'pausado' ? 'Ativando' : 'Pausando'} anúncio: ${anuncio.titulo}`);
  };

  const handleDeleteAnuncio = (anuncio: Anuncio) => {
    toast.info(`Excluindo anúncio: ${anuncio.titulo}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Anúncios</h1>
          <p className="text-gray-600">Gerencie seus anúncios no marketplace</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar anúncios..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-blue-50" : ""}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefreshData} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Atualizar
          </Button>
          <Button onClick={() => setShowNewAnuncioDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Anúncio
          </Button>
        </div>
      </div>

      {/* Filtros Avançados */}
      {showFilters && (
        <Card className="mt-4 mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Filtros Avançados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select
                  value={filterOptions.categoria}
                  onValueChange={(value) => setFilterOptions({...filterOptions, categoria: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    <SelectItem value="ICMS">ICMS</SelectItem>
                    <SelectItem value="PIS/COFINS">PIS/COFINS</SelectItem>
                    <SelectItem value="IRPJ">IRPJ</SelectItem>
                    <SelectItem value="CSLL">CSLL</SelectItem>
                    <SelectItem value="IPI">IPI</SelectItem>
                    <SelectItem value="Precatório">Precatório</SelectItem>
                    <SelectItem value="Comercial">Comercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valorMin">Valor Mínimo</Label>
                <Input
                  type="number"
                  value={filterOptions.valorMin}
                  onChange={(e) => setFilterOptions({...filterOptions, valorMin: e.target.value})}
                  placeholder="R$ 0,00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valorMax">Valor Máximo</Label>
                <Input
                  type="number"
                  value={filterOptions.valorMax}
                  onChange={(e) => setFilterOptions({...filterOptions, valorMax: e.target.value})}
                  placeholder="R$ 0,00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data Início</Label>
                <Input
                  type="date"
                  value={filterOptions.dataInicio}
                  onChange={(e) => setFilterOptions({...filterOptions, dataInicio: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dataFim">Data Fim</Label>
                <Input
                  type="date"
                  value={filterOptions.dataFim}
                  onChange={(e) => setFilterOptions({...filterOptions, dataFim: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="desconto">Desconto Mínimo (%)</Label>
                <Input
                  type="number"
                  value={filterOptions.desconto}
                  onChange={(e) => setFilterOptions({...filterOptions, desconto: e.target.value})}
                  placeholder="0%"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="outline" onClick={clearFilters}>
                Limpar Filtros
              </Button>
              <Button onClick={applyFilters}>
                Aplicar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs e Lista de Anúncios */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="ativo">Ativos</TabsTrigger>
          <TabsTrigger value="pausado">Pausados</TabsTrigger>
          <TabsTrigger value="vendido">Vendidos</TabsTrigger>
          <TabsTrigger value="expirado">Expirados</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : anuncios.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum anúncio encontrado</h3>
              <p className="text-gray-500">
                Crie seu primeiro anúncio ou ajuste os filtros de busca
              </p>
              <Button className="mt-4" onClick={() => setShowNewAnuncioDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Anúncio
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {anuncios.map(anuncio => (
                <Card key={anuncio.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">{anuncio.titulo}</h3>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(anuncio.status)}>
                              {getStatusText(anuncio.status)}
                            </Badge>
                            <Badge variant="outline">{anuncio.categoria}</Badge>
                            {anuncio.tokenId && (
                              <Badge variant="secondary">
                                <Hash className="w-3 h-3 mr-1" />
                                Token
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Valor Original</p>
                            <p className="font-semibold">{formatCurrency(anuncio.valor)}</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600">Preço de Venda</p>
                            <p className="font-semibold text-blue-600">
                              {formatCurrency(anuncio.precoVenda)}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600">Desconto</p>
                            <p className="font-semibold text-green-600">{anuncio.desconto}%</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600">Data de Publicação</p>
                            <p className="font-semibold">{formatDate(anuncio.dataPublicacao)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{anuncio.visualizacoes} visualizações</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{anuncio.interessados} interessados</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Há {anuncio.prazoVenda} dias</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="h-4 w-4 mr-1" />
                              Ações
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditAnuncio(anuncio)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePauseAnuncio(anuncio)}>
                              {anuncio.status === 'pausado' ? (
                                <>
                                  <Play className="h-4 w-4 mr-2" />
                                  Ativar
                                </>
                              ) : (
                                <>
                                  <Pause className="h-4 w-4 mr-2" />
                                  Pausar
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteAnuncio(anuncio)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Anúncios Ativos</p>
                <p className="text-2xl font-bold">{totalAnunciosAtivos}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold">{formatCurrency(totalValorAnuncios)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Visualizações</p>
                <p className="text-2xl font-bold">{totalVisualizacoes}</p>
              </div>
              <Eye className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Interessados</p>
                <p className="text-2xl font-bold">{totalInteressados}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {anuncios.length > 0 ? (
          anuncios.map(anuncio => (
            <Card key={anuncio.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{anuncio.titulo}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(anuncio.status)}>
                      {getStatusText(anuncio.status)}
                    </Badge>
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      {anuncio.categoria}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Valor Original</p>
                    <p className="font-semibold">{formatCurrency(anuncio.valor)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Preço Anunciado</p>
                    <p className="font-semibold text-green-600">
                      {formatCurrency(anuncio.precoVenda)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Desconto</p>
                    <p className="font-semibold text-blue-600">{anuncio.desconto}%</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Visualizações</p>
                    <p className="font-semibold">{anuncio.visualizacoes}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Interessados</p>
                    <p className="font-semibold">{anuncio.interessados}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Publicado em</p>
                    <p className="font-semibold">{formatDate(anuncio.dataPublicacao)}</p>
                  </div>
                </div>

                {anuncio.tokenId && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-blue-600" />
                      <p className="text-sm font-medium text-blue-700">Token ID: {anuncio.tokenId}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum anúncio criado ainda</h3>
              <p className="text-gray-600 mb-4">
                Crie seu primeiro anúncio para começar a vender seus tokens no marketplace.
              </p>
              <Button
                onClick={() => setShowNewAnuncioDialog(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Anúncio
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
