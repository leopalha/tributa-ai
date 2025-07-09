import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { useRouter } from '@/lib/router-utils';
import { api } from '@/services/api';
import { DebitoFiscal, DebitoStatus, Empresa, User as PrismaUser } from '@/types/prisma';
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
  Search,
  Filter,
  X as XIcon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormLabel } from '@/components/ui/form';
import { formatCurrency, formatDate } from '@/lib/utils';
// TODO: Replace with custom auth
// import { useSession } from 'next-auth/react';
import { debounce } from 'lodash';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowLeftRight } from 'lucide-react';
import toast from '@/lib/toast-transition';

// Filtros para Débitos
interface DebitoFilters {
  status?: DebitoStatus | '';
  tipoTributo?: string;
  competencia?: string;
  // Adicionar mais filtros se necessário
}

// Paginação (Definição completa)
interface PaginationData {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

// Tipo para item da lista (incluindo relações básicas)
type DebitoListItem = DebitoFiscal & {
  user?: Pick<PrismaUser, 'id' | 'name'> | null;
  empresa?: Pick<Empresa, 'id' | 'razaoSocial'> | null;
};

export function DebitoList() {
  const router = useRouter();
  const { data: session } = useSession(); // Para obter userId

  const [debitos, setDebitos] = useState<DebitoListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [filters, setFilters] = useState<DebitoFilters>({
    status: '',
    tipoTributo: '',
    competencia: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(15); // Mais itens por página?

  const userId = session?.user?.id;

  // Fetch Débitos
  const fetchDebitos = useCallback(
    async (page: number, currentFilters: DebitoFilters) => {
      if (!userId) return; // Não buscar se não houver userId
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.set('userId', userId); // Sempre filtra pelo usuário logado (API já faz isso, mas reforça)
        params.set('page', page.toString());
        params.set('limit', limit.toString());
        if (currentFilters.status) params.set('status', currentFilters.status);
        if (currentFilters.tipoTributo) params.set('tipoTributo', currentFilters.tipoTributo);
        if (currentFilters.competencia) params.set('competencia', currentFilters.competencia);

        const response = await api.get<{ data: DebitoListItem[]; pagination: PaginationData }>(
          `/api/debitos?${params.toString()}`
        );
        setDebitos(response.data);
        setPagination(response.pagination);
      } catch (err: any) {
        setError(err?.response?.data?.error || err.message || 'Falha ao carregar débitos');
        setDebitos([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    },
    [userId, limit]
  );

  useEffect(() => {
    fetchDebitos(currentPage, filters);
  }, [userId, currentPage, filters, fetchDebitos]);

  // Handlers de Filtro (simplificado)
  const handleFilterChange = (name: keyof DebitoFilters, value: string) => {
    const typedValue = name === 'status' ? (value as DebitoStatus | '') : value;
    setFilters(prev => ({ ...prev, [name]: typedValue }));
    setCurrentPage(1);
  };
  const clearFilters = () => {
    setFilters({ status: '', tipoTributo: '', competencia: '' });
    setCurrentPage(1);
  };

  // Handlers de Ação
  const handleViewDetails = (id: string) => {
    /* router.push(`/debitos/${id}`); */ alert(`Ver detalhes: ${id}`);
  };
  const handleEdit = (id: string) => {
    /* router.push(`/debitos/${id}/editar`); */ alert(`Editar: ${id}`);
  };
  const handleCompensar = (id: string) => {
    router.push(`/compensacoes?debitoId=${id}`);
  }; // Leva para página de compensação pré-filtrada
  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este Débito Fiscal?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/debitos/${id}`);
      toast.success('Débito excluído com sucesso!');
      fetchDebitos(currentPage, filters);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err.message || 'Erro desconhecido';
      toast.error(`Falha ao excluir débito: ${errorMessage}`);
    } finally {
      setDeletingId(null);
    }
  };

  // Função auxiliar para badge de status
  const getStatusBadgeVariant = (
    status: DebitoStatus
  ): 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' => {
    switch (status) {
      case DebitoStatus.PAGO_TOTALMENTE:
        return 'success';
      case DebitoStatus.CANCELADO:
        return 'destructive';
      case DebitoStatus.ABERTO:
        return 'outline';
      case DebitoStatus.VENCIDO:
        return 'warning';
      case DebitoStatus.EM_COMPENSACAO:
      case DebitoStatus.PAGO_PARCIALMENTE:
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  // ... Renderização (Loading, Error, Lista Vazia) ...

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
            {/* Status */}
            <div>
              <FormLabel className="text-sm font-medium mb-1 block">Status</FormLabel>
              <Select value={filters.status} onValueChange={v => handleFilterChange('status', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {Object.values(DebitoStatus).map(s => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Tipo Tributo */}
            <div>
              <FormLabel className="text-sm font-medium mb-1 block">Tipo Tributo</FormLabel>
              <Input
                placeholder="Ex: ICMS, IRPJ"
                value={filters.tipoTributo}
                onChange={e => handleFilterChange('tipoTributo', e.target.value)}
              />
            </div>
            {/* Competência */}
            <div>
              <FormLabel className="text-sm font-medium mb-1 block">
                Competência (MM/AAAA)
              </FormLabel>
              <Input
                placeholder="Ex: 08/2024"
                value={filters.competencia}
                onChange={e => handleFilterChange('competencia', e.target.value)}
                maxLength={7}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- Tabela --- */}
      {loading && (
        <div className="text-center py-6">
          <Loader2 className="h-6 w-6 animate-spin inline-block" />
        </div>
      )}
      {!loading && error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {!loading && !error && debitos.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Nenhum débito encontrado com os filtros aplicados.
          </CardContent>
        </Card>
      )}
      {!loading && !error && debitos.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tributo</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Competência</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Valor Original</TableHead>
                  <TableHead>Valor Pago</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {debitos.map(debito => {
                  const isDeleting = deletingId === debito.id;
                  const podeCompensar =
                    debito.status === DebitoStatus.ABERTO ||
                    debito.status === DebitoStatus.VENCIDO ||
                    debito.status === DebitoStatus.PAGO_PARCIALMENTE;
                  const podeEditar = debito.status === DebitoStatus.ABERTO;
                  const podeExcluir = debito.status === DebitoStatus.ABERTO; // Ou CANCELADO?

                  return (
                    <TableRow key={debito.id}>
                      <TableCell className="font-medium">{debito.tipoTributo}</TableCell>
                      <TableCell>{debito.empresa?.razaoSocial || 'N/A'}</TableCell>
                      <TableCell>{debito.competencia}</TableCell>
                      <TableCell>{formatDate(debito.dataVencimento)}</TableCell>
                      <TableCell>{formatCurrency(debito.valorOriginal)}</TableCell>
                      <TableCell>{formatCurrency(debito.valorPago)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(debito.status)}>
                          {debito.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={isDeleting}>
                              {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <MoreHorizontal className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(debito.id)}>
                              <Eye className="mr-2 h-4 w-4" /> Detalhes
                            </DropdownMenuItem>
                            {podeCompensar && (
                              <DropdownMenuItem onClick={() => handleCompensar(debito.id)}>
                                <ArrowLeftRight className="mr-2 h-4 w-4" /> Buscar Compensação
                              </DropdownMenuItem>
                            )}
                            {podeEditar && (
                              <DropdownMenuItem onClick={() => handleEdit(debito.id)}>
                                <Edit className="mr-2 h-4 w-4" /> Editar
                              </DropdownMenuItem>
                            )}
                            {podeExcluir && (
                              <DropdownMenuItem
                                onClick={() => handleDelete(debito.id)}
                                className="text-destructive focus:text-destructive"
                                disabled={isDeleting}
                              >
                                {isDeleting ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="mr-2 h-4 w-4" />
                                )}
                                {isDeleting ? 'Excluindo...' : 'Excluir'}
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
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
            onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
            disabled={currentPage === pagination.totalPages || loading}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
