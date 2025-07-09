import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { useRouter } from '@/lib/router-utils';
import { api } from '@/services/api';
import { CreditTitle, CreditStatus, CreditCategory } from '@/types/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Store,
  Search,
  Filter,
  X as XIcon,
  FileUp,
  Banknote,
  ExternalLink,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
// TODO: Replace with custom auth
// import { useSession } from 'next-auth/react';
import { debounce } from 'lodash';

// Interface para filtros de TC
interface TCFilters {
  status?: CreditStatus | '';
  category?: CreditCategory | '';
  search?: string;
}

// Interface para paginação da API
interface PaginationData {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

// Tipo para dados retornados pela API (incluindo anúncios simplificados)
type TCListItem = Omit<CreditTitle, 'listings'> & {
  listings?: { id: string }[]; // Apenas para saber se existe
};

interface TCListProps {
  ownerId?: string;
  ownerCompanyId?: string;
}

export function TCList({ ownerId, ownerCompanyId }: TCListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();

  const [tcs, setTcs] = useState<TCListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Estados para filtros e paginação
  const [filters, setFilters] = useState<TCFilters>({ status: '', category: '', search: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(15); // 15 TCs por página
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({}); // Para loading de ações

  // Fetch TCs com useCallback
  const fetchTCs = useCallback(
    async (page: number, currentFilters: TCFilters) => {
      if (!ownerId && !ownerCompanyId) {
        setError('ID do proprietário ou empresa não fornecido.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.set('page', page.toString());
        params.set('limit', limit.toString());
        if (ownerId) params.set('ownerId', ownerId);
        if (ownerCompanyId) params.set('ownerCompanyId', ownerCompanyId);
        if (currentFilters.status) params.set('status', currentFilters.status);
        if (currentFilters.category) params.set('category', currentFilters.category);
        if (currentFilters.search) params.set('search', currentFilters.search);

        const response = await api.get<{ data: TCListItem[]; pagination: PaginationData }>(
          `/api/tcs?${params.toString()}`
        );
        setTcs(response.data);
        setPagination(response.pagination);
      } catch (err: any) {
        setError(err?.response?.data?.error || err.message || 'Falha ao carregar TCs');
        setTcs([]); // Limpar em caso de erro
        setPagination(null);
      } finally {
        setLoading(false);
      }
    },
    [limit, ownerId, ownerCompanyId]
  );

  useEffect(() => {
    fetchTCs(currentPage, filters);
  }, [currentPage, filters, fetchTCs]);

  // Debounce para busca
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      setFilters(prev => ({ ...prev, search: searchValue }));
      setCurrentPage(1); // Resetar página na busca
    }, 500),
    [] // Sem dependências, pois usa setFilters com função
  );

  // Handlers para filtros
  const handleFilterChange = (name: keyof TCFilters, value: string) => {
    const typedValue =
      name === 'status'
        ? (value as CreditStatus | '')
        : name === 'category'
          ? (value as CreditCategory | '')
          : value;
    setFilters(prev => ({ ...prev, [name]: typedValue }));
    setCurrentPage(1); // Resetar página ao mudar filtro
  };

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilters(prev => ({ ...prev, search: value })); // Atualiza estado local imediatamente
    debouncedSearch(value); // Chama API com debounce
  };

  const clearFilters = () => {
    setFilters({ status: '', category: '', search: '' });
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Handlers de Ações (view, edit, anunciar, delete)
  const handleViewDetails = (id: string) => {
    router.push(`/tc/${id}`);
  };
  const handleEdit = (id: string) => {
    router.push(`/tc/${id}/editar`);
  };
  const handleAnunciar = (id: string) => {
    router.push(`/marketplace/anuncios/novo?tcId=${id}`);
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este Título de Crédito?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/tcs/${id}`);
      toast({
        title: 'Sucesso',
        description: 'Título de Crédito excluído.',
      });
      fetchTCs(currentPage, filters); // Recarregar a lista
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err.message || 'Erro desconhecido';
      toast({
        title: 'Erro',
        description: `Falha ao excluir: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleAction = async (action: string, tcId: string) => {
    setActionLoading(prev => ({ ...prev, [tcId]: true }));
    try {
      if (action === 'delete') {
        if (!window.confirm('Tem certeza que deseja excluir este Título?')) return;
        await api.delete(`/api/tcs/${tcId}`);
        toast({
          title: 'Sucesso',
          description: 'Título excluído com sucesso!',
        });
        fetchTCs(currentPage, filters); // Recarrega
      } else if (action === 'announce') {
        router.push(`/marketplace/anuncios/novo?tcId=${tcId}`);
      } else if (action === 'tokenize') {
        await api.post(`/api/tcs/${tcId}/tokenize`);
        toast({
          title: 'Sucesso',
          description: 'Tokenização iniciada!',
        });
        fetchTCs(currentPage, filters); // Recarrega para ver status PENDING_TOKENIZATION
      } else if (action === 'validate') {
        // Chamar API de validação
        await api.post(`/api/tcs/${tcId}/validate`);
        toast({
          title: 'Sucesso',
          description: 'Solicitação de validação enviada!',
        });
        fetchTCs(currentPage, filters); // Recarrega para ver status PENDING_VALIDATION
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err.message || 'Erro desconhecido';
      toast({
        title: 'Erro',
        description: `Falha ao ${action}: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [tcId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando Títulos de Crédito...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Erro ao Carregar</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (tcs.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum Título de Crédito encontrado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Você ainda não adicionou nenhum Título de Crédito.
            </p>
            <Button onClick={() => router.push('/tc/novo')}>Adicionar TC</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* --- Filtros --- */}
      <Card className="shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium flex items-center">
              <Filter className="h-5 w-5 mr-2" /> Filtros
            </h3>
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
              <XIcon className="h-4 w-4 mr-1" /> Limpar Filtros
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Busca */}
            <div>
              <Label className="text-sm font-medium mb-1 block">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Título, subtipo, registro..."
                  className="pl-9"
                  value={filters.search}
                  onChange={handleSearchInputChange}
                />
              </div>
            </div>
            {/* Status */}
            <div>
              <Label className="text-sm font-medium mb-1 block">Status</Label>
              <Select value={filters.status} onValueChange={v => handleFilterChange('status', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {Object.values(CreditStatus).map(s => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Categoria */}
            <div>
              <Label className="text-sm font-medium mb-1 block">Categoria</Label>
              <Select
                value={filters.category}
                onValueChange={v => handleFilterChange('category', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  {Object.values(CreditCategory).map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- Tabela --- */}
      {loading && (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {!loading && error && (
        <Card className="border-destructive">{/* ... Mensagem de erro ... */}</Card>
      )}
      {!loading && !error && tcs.length === 0 && <Card>{/* ... Mensagem Lista Vazia ... */}</Card>}
      {!loading && !error && tcs.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Emissão</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tcs.map(tc => {
                  const isDeleting = deletingId === tc.id;
                  const canEdit = tc.status === CreditStatus.DRAFT;
                  const hasActiveListing = tc.listings && tc.listings.length > 0;
                  const canDelete = !hasActiveListing;
                  const canAnnounce =
                    (tc.status === CreditStatus.VALIDATED ||
                      tc.status === CreditStatus.TOKENIZED) &&
                    !hasActiveListing;

                  return (
                    <TableRow key={tc.id}>
                      <TableCell className="font-medium">
                        {tc.title || `TC ${tc.id.substring(0, 6)}...`}
                      </TableCell>
                      <TableCell>{tc.category}</TableCell>
                      <TableCell>{formatCurrency(tc.value)}</TableCell>
                      <TableCell>
                        <Badge variant={tc.status === 'VALIDATED' ? 'default' : 'secondary'}>
                          {tc.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(tc.issueDate)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isDeleting || actionLoading[tc.id]}
                            >
                              {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <MoreHorizontal className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(tc.id)}>
                              <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
                            </DropdownMenuItem>
                            {canEdit && (
                              <DropdownMenuItem onClick={() => handleEdit(tc.id)}>
                                <Edit className="mr-2 h-4 w-4" /> Editar
                              </DropdownMenuItem>
                            )}
                            {canAnnounce && (
                              <DropdownMenuItem onClick={() => handleAnunciar(tc.id)}>
                                <Store className="mr-2 h-4 w-4" /> Anunciar
                              </DropdownMenuItem>
                            )}
                            {tc.status === CreditStatus.DRAFT && (
                              <DropdownMenuItem onClick={() => handleAction('validate', tc.id)}>
                                <FileUp className="mr-2 h-4 w-4" /> Solicitar Validação
                              </DropdownMenuItem>
                            )}
                            {tc.status === CreditStatus.VALIDATED && (
                              <DropdownMenuItem onClick={() => handleAction('announce', tc.id)}>
                                <Banknote className="mr-2 h-4 w-4" /> Anunciar
                              </DropdownMenuItem>
                            )}
                            {tc.status === CreditStatus.VALIDATED && (
                              <DropdownMenuItem onClick={() => handleAction('tokenize', tc.id)}>
                                <ExternalLink className="mr-2 h-4 w-4" /> Tokenizar
                              </DropdownMenuItem>
                            )}
                            {canDelete && (
                              <DropdownMenuItem
                                onClick={() => handleDelete(tc.id)}
                                className="text-destructive focus:text-destructive"
                                disabled={actionLoading[tc.id]}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Excluir
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* --- Paginação --- */}
      {!loading && !error && pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || loading}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.min(pagination.totalPages, currentPage + 1))}
            disabled={currentPage === pagination.totalPages || loading}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
