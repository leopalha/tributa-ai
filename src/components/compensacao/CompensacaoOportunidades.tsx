import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Check, ArrowRight } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CreditCategory, CreditTitle } from '@prisma/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import toast from '@/lib/toast-transition';

// Interface para um crédito sugerido (vindo da API)
interface CreditoSugerido {
  id: string;
  title?: string | null; // Incluir title para exibição?
  value: number;
}

// Interface oportunidade recebida da API (com múltiplos créditos)
interface OportunidadeCompensacaoDetalhada {
  debito: {
    id: string;
    tipoTributo: string;
    competencia: string;
    valorOriginal: number;
    valorPendente: number;
    dataVencimento: Date;
  };
  creditosSugeridos: CreditoSugerido[]; // Array de créditos
  valorTotalCreditos: number;
  valorCompensavel: number;
}

export function CompensacaoOportunidades() {
  const [oportunidades, setOportunidades] = useState<OportunidadeCompensacaoDetalhada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [executingId, setExecutingId] = useState<string | null>(null); // Para botão de executar

  useEffect(() => {
    fetchOportunidades();
  }, []);

  const fetchOportunidades = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<OportunidadeCompensacaoDetalhada[]>(
        '/api/compensacoes/possiveis'
      );
      setOportunidades(response);
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'Falha ao buscar oportunidades.');
    } finally {
      setLoading(false);
    }
  };

  // Handler para executar (precisa adaptar para múltiplos créditos?)
  // Por ora, a API POST /api/compensacoes só aceita 1 débito e 1 crédito.
  // Vamos pegar apenas o PRIMEIRO crédito sugerido para o botão.
  const handleExecutarCompensacao = async (debitoId: string, creditoId: string, valor: number) => {
    setExecutingId(debitoId + creditoId);
    try {
      // Verificar se a chamada à API está correta e descomentada
      const payload = { debitoId, creditoId, valor };
      await api.post('/api/compensacoes', payload); // Chamada real à API

      toast.success('Compensação executada com sucesso!');
      fetchOportunidades(); // Recarregar
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err.message || 'Erro desconhecido';
      toast.error(`Falha ao executar compensação: ${errorMessage}`);
    } finally {
      setExecutingId(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <Loader2 className="h-8 w-8 animate-spin inline-block" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {oportunidades.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-muted-foreground">
            Nenhuma oportunidade de compensação encontrada no momento.
            <br /> Registre seus débitos fiscais para habilitar a busca.
          </CardContent>
        </Card>
      ) : (
        oportunidades.map(op => {
          // Pegar o primeiro crédito para o botão de execução (simplificação)
          const primeiroCredito = op.creditosSugeridos[0];
          const isLoadingExec = executingId === op.debito.id + (primeiroCredito?.id || 'multi');

          return (
            <Card key={`${op.debito.id}`} className="shadow-sm border-border/60">
              <CardHeader>
                <CardTitle className="text-lg">Oportunidade de Compensação</CardTitle>
                <CardDescription>
                  Compensar Débito de {op.debito.tipoTributo} ({op.debito.competencia}) com Crédito{' '}
                  {op.creditosSugeridos[0].id.substring(0, 8)}...
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                {/* Coluna Débito */}
                <div className="space-y-1 border-r pr-4 border-dashed md:col-span-1">
                  <h4 className="font-medium text-sm text-red-600">Débito a Compensar</h4>
                  <p className="text-xs">
                    <span className="font-semibold">Tributo:</span> {op.debito.tipoTributo}
                  </p>
                  <p className="text-xs">
                    <span className="font-semibold">Competência:</span> {op.debito.competencia}
                  </p>
                  <p className="text-xs pt-1">
                    <span className="font-semibold">Valor Pendente:</span>{' '}
                    {formatCurrency(op.debito.valorPendente)}
                  </p>
                </div>
                {/* Coluna Créditos */}
                <div className="space-y-2 md:col-span-1">
                  <h4 className="font-medium text-sm text-green-600">Crédito(s) Sugerido(s)</h4>
                  {op.creditosSugeridos.map(cred => (
                    <div key={cred.id} className="text-xs border-b pb-1 last:pb-0 last:border-0">
                      <span className="block">ID: {cred.id.substring(0, 8)}...</span>
                      <span>Valor Disp.: {formatCurrency(cred.value)}</span>
                    </div>
                  ))}
                  <p className="text-xs font-semibold pt-1">
                    Total nos Créditos: {formatCurrency(op.valorTotalCreditos)}
                  </p>
                </div>
                {/* Coluna Ação */}
                <div className="text-center md:text-right md:col-span-1">
                  <p className="text-sm font-semibold mb-2">
                    Valor a Compensar: {formatCurrency(op.valorCompensavel)}
                  </p>
                  {/* Botão só funciona se houver pelo menos um crédito */}
                  {primeiroCredito && (
                    <Button
                      onClick={() =>
                        handleExecutarCompensacao(
                          op.debito.id,
                          primeiroCredito.id,
                          op.valorCompensavel
                        )
                      }
                      disabled={isLoadingExec}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isLoadingExec ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      {isLoadingExec ? 'Executando...' : 'Executar Compensação'}
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {' '}
                    (Usando o primeiro crédito sugerido)
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
