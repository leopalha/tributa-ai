import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { DeclaracaoService } from '@/services/declaracao.service';
import { useToast } from '@/components/ui/use-toast';
import { DeclaracaoPendencias as DeclaracaoPendenciasType } from '@/types/declaracao';

interface DeclaracaoPendenciasProps {
  onPendenciaResolvida?: () => void;
}

export function DeclaracaoPendencias({ onPendenciaResolvida }: DeclaracaoPendenciasProps) {
  const { toast } = useToast();
  const [pendencias, setPendencias] = React.useState<DeclaracaoPendenciasType>({
    temPendencias: false,
    declaracoesPendentes: [],
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const loadPendencias = async () => {
    try {
      setIsLoading(true);
      const service = DeclaracaoService.getInstance();
      const response = await service.verificarPendencias('1'); // TODO: Get empresaId from context
      setPendencias(response);
    } catch (error) {
      console.error('Erro ao carregar pendências:', error);
      toast({
        title: 'Erro ao carregar pendências',
        description: 'Não foi possível carregar as pendências.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadPendencias();
  }, []);

  const handleMarcarComoResolvida = async (declaracaoId: string) => {
    try {
      const service = DeclaracaoService.getInstance();
      await service.criarNotificacao({
        titulo: 'Pendência resolvida',
        mensagem: 'A pendência foi marcada como resolvida.',
        tipo: 'success',
        link: `/dashboard/declaracoes/${declaracaoId}`,
      });
      loadPendencias();
      onPendenciaResolvida?.();
    } catch (error) {
      console.error('Erro ao marcar pendência como resolvida:', error);
      toast({
        title: 'Erro ao marcar pendência',
        description: 'Não foi possível marcar a pendência como resolvida.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Pendências
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendencias.temPendencias ? (
            <div>
              <h3 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Declarações Pendentes
              </h3>
              <ul className="space-y-2">
                {pendencias.declaracoesPendentes.map(declaracao => (
                  <li
                    key={declaracao.id}
                    className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950/40 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{declaracao.tipo}</p>
                      <p className="text-sm text-muted-foreground">
                        Vencimento: {new Date(declaracao.vencimento).toLocaleDateString()}
                        {declaracao.diasAtraso > 0 && (
                          <span className="ml-2 text-red-600 dark:text-red-400">
                            ({declaracao.diasAtraso} dias de atraso)
                          </span>
                        )}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarcarComoResolvida(declaracao.id)}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma pendência encontrada
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
