import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Clock, ListChecks } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// Interface para os dados da API GET /api/compensacoes
interface CompensacaoHistoricoItem {
  id: string;
  status: string;
  valorCompensado: number;
  dataCriacao: string;
  dataExecucao?: string | null;
  debitos: {
    valorUtilizado: number;
    debito: { id: string; tipoTributo: string; competencia: string };
  }[];
  titulos: {
    valorUtilizado: number;
    titulo: { id: string; title: string | null; subtype: string };
  }[];
}
interface PaginationData {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export function CompensacaoHistorico() {
  const [compensacoes, setCompensacoes] = useState<CompensacaoHistoricoItem[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10); // Itens por página

  // Fetch data
  const fetchData = useCallback(
    async (page: number) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
        const response = await api.get<{
          data: CompensacaoHistoricoItem[];
          pagination: PaginationData;
        }>(`/api/compensacoes?${params.toString()}`);
        setCompensacoes(response.data);
        setPagination(response.pagination);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : typeof err === 'object' && err !== null && 'response' in err
              ? (err.response as { data?: { error?: string } })?.data?.error || 'Erro na requisição'
              : 'Falha ao carregar histórico.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, fetchData]);

  const getStatusIcon = (status: string) => {
    if (status === 'EXECUTADA') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === 'PENDENTE') return <Clock className="h-4 w-4 text-yellow-500" />;
    if (status === 'FALHOU') return <AlertCircle className="h-4 w-4 text-destructive" />;
    return <Badge className="bg-muted text-sm">Info</Badge>;
  };

  if (loading) {
    /* ... loading state ... */
  }
  if (error) {
    /* ... error state ... */
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ListChecks className="mr-2 h-5 w-5" /> Histórico de Compensações
        </CardTitle>
        <CardDescription>Suas operações de compensação realizadas ou pendentes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {compensacoes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhuma operação de compensação encontrada.
          </p>
        ) : (
          compensacoes.map(comp => (
            <div key={comp.id} className="border rounded-md p-4 bg-muted/30">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(comp.status)}
                  <span className="font-medium text-sm">{comp.status}</span>
                  <span className="text-xs text-muted-foreground">
                    - {formatDate(comp.dataCriacao)}
                  </span>
                </div>
                <span className="text-lg font-semibold text-primary">
                  {formatCurrency(comp.valorCompensado)}
                </span>
              </div>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p>
                  <strong>Débitos:</strong>{' '}
                  {comp.debitos
                    .map(d => `${d.debito.tipoTributo} (${d.debito.competencia})`)
                    .join(', ')}
                </p>
                <p>
                  <strong>Títulos:</strong>{' '}
                  {comp.titulos
                    .map(t => t.titulo.title || `TC ${t.titulo.id.substring(0, 6)}...`)
                    .join(', ')}
                </p>
              </div>
              <div className="mt-2 flex items-center text-xs text-muted-foreground">
                <Badge className="bg-muted text-sm">Info</Badge>
                <span className="ml-1">Detalhes abaixo</span>
              </div>
            </div>
          ))
        )}

        {/* Paginação */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
            >
              Anterior
            </Button>
            <span>
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
      </CardContent>
    </Card>
  );
}
