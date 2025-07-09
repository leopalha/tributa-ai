import { useState, useEffect, useCallback } from 'react';
import { useRouter } from '@/lib/router-utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Calendar,
  DollarSign,
  Tag,
  AlertCircle,
  Search,
  Filter,
  Loader2,
  ShoppingCart,
  MessageSquare,
  Eye,
} from 'lucide-react';
import { CompraModal } from './CompraModal';
import { PropostaModal } from './PropostaModal';

interface AnuncioItem {
  id: string;
  title: string;
  price: number;
  discount?: number;
  type: string;
  category: string;
  creditTitleId?: string;
}

interface AnuncioFilters {
  search?: string;
  category?: string;
  type?: string;
  valorMin?: string;
  valorMax?: string;
}

interface AnunciosListProps {
  sellerId?: string;
  creditTitleId?: string;
}

export function AnunciosList({ sellerId, creditTitleId }: AnunciosListProps) {
  const router = useRouter();

  const [anuncios, setAnuncios] = useState<AnuncioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<AnuncioFilters>({});
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  // Estados para modais
  const [compraModalOpen, setCompraModalOpen] = useState(false);
  const [propostaModalOpen, setPropostaModalOpen] = useState(false);
  const [selectedAnuncio, setSelectedAnuncio] = useState<AnuncioItem | null>(null);

  const fetchAnuncios = useCallback(
    async (page: number, currentFilters: AnuncioFilters) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set('page', page.toString());
        params.set('limit', limit.toString());
        params.set('status', 'ACTIVE');

        if (sellerId) params.set('sellerId', sellerId);
        if (creditTitleId) params.set('creditTitleId', creditTitleId);
        if (currentFilters.search) params.set('search', currentFilters.search);
        if (currentFilters.category) params.set('category', currentFilters.category);
        if (currentFilters.type) params.set('type', currentFilters.type);
        if (currentFilters.valorMin) params.set('valorMinimo', currentFilters.valorMin);
        if (currentFilters.valorMax) params.set('valorMaximo', currentFilters.valorMax);

        const response = await fetch(`/api/marketplace/anuncios?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Erro ao carregar anúncios');
        }

        const data = await response.json();

        if (data.success) {
          // Mapear dados da API para o formato esperado
          const mappedAnuncios = data.items.map((item: any) => ({
            id: item.id,
            title: item.creditTitle?.title || 'Título não disponível',
            price: item.askingPrice || 0,
            discount: item.discount,
            type: item.type || 'VENDA_DIRETA',
            category: item.creditTitle?.category || 'TRIBUTARIO',
            creditTitleId: item.creditTitleId,
          }));

          setAnuncios(mappedAnuncios);
          setTotalPages(data.totalPages || 1);
        } else {
          throw new Error(data.error || 'Erro desconhecido');
        }
      } catch (err: any) {
        console.error('Erro ao buscar anúncios:', err);
        setError(err.message || 'Erro ao carregar anúncios');
        setAnuncios([]);
      } finally {
        setLoading(false);
      }
    },
    [limit, sellerId, creditTitleId]
  );

  useEffect(() => {
    fetchAnuncios(currentPage, filters);
  }, [currentPage, filters, fetchAnuncios]);

  const handleFilterChange = (newFilters: Partial<AnuncioFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleVerDetalhes = (anuncio: AnuncioItem) => {
    router.push(`/dashboard/marketplace/anuncio/${anuncio.id}`);
  };

  const handleComprar = (anuncio: AnuncioItem) => {
    setSelectedAnuncio(anuncio);
    setCompraModalOpen(true);
  };

  const handleEnviarProposta = (anuncio: AnuncioItem) => {
    setSelectedAnuncio(anuncio);
    setPropostaModalOpen(true);
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'TRIBUTARIO':
        return 'bg-blue-100 text-blue-800';
      case 'JUDICIAL':
        return 'bg-purple-100 text-purple-800';
      case 'FINANCEIRO':
        return 'bg-green-100 text-green-800';
      case 'COMERCIAL':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'VENDA_DIRETA':
        return 'bg-emerald-100 text-emerald-800';
      case 'LEILAO':
        return 'bg-amber-100 text-amber-800';
      case 'OFERTA':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium flex items-center">
              <Filter className="h-5 w-5 mr-2" /> Filtros
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <Label className="text-sm font-medium mb-1 block">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Título, descrição..."
                  className="pl-9"
                  value={filters.search || ''}
                  onChange={e => handleFilterChange({ search: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-1 block">Categoria</Label>
              <Select
                value={filters.category || ''}
                onValueChange={v => handleFilterChange({ category: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="TRIBUTARIO">Tributário</SelectItem>
                  <SelectItem value="JUDICIAL">Judicial</SelectItem>
                  <SelectItem value="FINANCEIRO">Financeiro</SelectItem>
                  <SelectItem value="COMERCIAL">Comercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-1 block">Tipo</Label>
              <Select
                value={filters.type || ''}
                onValueChange={v => handleFilterChange({ type: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="VENDA_DIRETA">Venda Direta</SelectItem>
                  <SelectItem value="LEILAO">Leilão</SelectItem>
                  <SelectItem value="OFERTA">Oferta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-1 block">Valor Mín (R$)</Label>
              <Input
                type="number"
                placeholder="Min"
                value={filters.valorMin || ''}
                onChange={e => handleFilterChange({ valorMin: e.target.value })}
                step="0.01"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-1 block">Valor Máx (R$)</Label>
              <Input
                type="number"
                placeholder="Max"
                value={filters.valorMax || ''}
                onChange={e => handleFilterChange({ valorMax: e.target.value })}
                step="0.01"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Anúncios */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Erro ao carregar anúncios</h3>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <Button onClick={() => fetchAnuncios(currentPage, filters)}>Tentar novamente</Button>
            </div>
          </CardContent>
        </Card>
      ) : anuncios.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum anúncio encontrado</h3>
              <p className="text-sm text-gray-600 mb-4">
                Não existem anúncios disponíveis com os filtros selecionados.
              </p>
              <Button onClick={() => setFilters({})}>Limpar filtros</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {anuncios.map(anuncio => (
              <Card key={anuncio.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{anuncio.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={getCategoryBadgeColor(anuncio.category)}>
                          {anuncio.category}
                        </Badge>
                        <Badge className={getTypeBadgeColor(anuncio.type)}>
                          {anuncio.type.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-green-600">
                          R$ {anuncio.price.toLocaleString('pt-BR')}
                        </span>
                        {anuncio.discount && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            -{anuncio.discount}%
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerDetalhes(anuncio)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalhes
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEnviarProposta(anuncio)}
                        className="flex-1"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Proposta
                      </Button>
                      <Button size="sm" onClick={() => handleComprar(anuncio)} className="flex-1">
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Comprar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>

              <span className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </span>

              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}

      {/* Modais */}
      {selectedAnuncio && (
        <>
          <CompraModal
            isOpen={compraModalOpen}
            onClose={() => {
              setCompraModalOpen(false);
              setSelectedAnuncio(null);
            }}
            anuncio={selectedAnuncio}
          />

          <PropostaModal
            isOpen={propostaModalOpen}
            onClose={() => {
              setPropostaModalOpen(false);
              setSelectedAnuncio(null);
            }}
            anuncio={selectedAnuncio}
          />
        </>
      )}
    </div>
  );
}
