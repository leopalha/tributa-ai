import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { DeclaracaoService } from '@/services/declaracao.service';
import { useToast } from '@/components/ui/use-toast';
import { ObrigacaoFiscal } from '@/types/declaracao';

interface DeclaracaoNotificacoesProps {
  onNotificacaoLida?: () => void;
}

export function DeclaracaoNotificacoes({ onNotificacaoLida }: DeclaracaoNotificacoesProps) {
  const { toast } = useToast();
  const [notificacoes, setNotificacoes] = React.useState<{
    proximas: ObrigacaoFiscal[];
    vencidas: ObrigacaoFiscal[];
  }>({
    proximas: [],
    vencidas: [],
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const loadNotificacoes = async () => {
    try {
      setIsLoading(true);
      const service = DeclaracaoService.getInstance();
      const response = await service.verificarNotificacoes();
      setNotificacoes(response);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      toast({
        title: 'Erro ao carregar notificações',
        description: 'Não foi possível carregar as notificações.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadNotificacoes();
  }, []);

  const handleMarcarComoLida = async (obrigacaoId: string) => {
    try {
      const service = DeclaracaoService.getInstance();
      await service.criarNotificacao({
        titulo: 'Notificação lida',
        mensagem: 'A notificação foi marcada como lida.',
        tipo: 'info',
        link: `/dashboard/obrigacoes/${obrigacaoId}`,
      });
      loadNotificacoes();
      onNotificacaoLida?.();
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      toast({
        title: 'Erro ao marcar notificação',
        description: 'Não foi possível marcar a notificação como lida.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notificações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notificacoes.vencidas.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Obrigações Vencidas
              </h3>
              <ul className="space-y-2">
                {notificacoes.vencidas.map(obrigacao => (
                  <li
                    key={obrigacao.id}
                    className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950/40 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{obrigacao.tipo}</p>
                      <p className="text-sm text-muted-foreground">
                        Vencimento: {new Date(obrigacao.dataVencimento).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarcarComoLida(obrigacao.id)}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {notificacoes.proximas.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Próximas Obrigações
              </h3>
              <ul className="space-y-2">
                {notificacoes.proximas.map(obrigacao => (
                  <li
                    key={obrigacao.id}
                    className="flex items-center justify-between p-2 bg-amber-50 dark:bg-amber-950/40 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{obrigacao.tipo}</p>
                      <p className="text-sm text-muted-foreground">
                        Vencimento: {new Date(obrigacao.dataVencimento).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarcarComoLida(obrigacao.id)}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {notificacoes.vencidas.length === 0 && notificacoes.proximas.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma notificação pendente
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
