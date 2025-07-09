import React from 'react';
import { FileText, AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Declaracao, StatusDeclaracao } from '@/types/declaracao';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DeclaracaoListProps {
  declaracoes: Declaracao[];
  onEdit?: (declaracao: Declaracao) => void;
  onDelete?: (declaracao: Declaracao) => void;
  onView?: (declaracao: Declaracao) => void;
}

const statusIcons = {
  declaracao_rascunho: <Clock className="h-4 w-4" />,
  declaracao_pendente: <AlertCircle className="h-4 w-4" />,
  declaracao_enviada: <CheckCircle2 className="h-4 w-4" />,
  declaracao_processando: <Clock className="h-4 w-4" />,
  declaracao_aceita: <CheckCircle2 className="h-4 w-4" />,
  declaracao_rejeitada: <XCircle className="h-4 w-4" />,
  declaracao_cancelada: <XCircle className="h-4 w-4" />,
};

const statusColors = {
  declaracao_rascunho: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  declaracao_pendente: 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-200',
  declaracao_enviada: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
  declaracao_processando: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200',
  declaracao_aceita: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200',
  declaracao_rejeitada: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200',
  declaracao_cancelada: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
};

const statusLabels = {
  declaracao_rascunho: 'Rascunho',
  declaracao_pendente: 'Pendente',
  declaracao_enviada: 'Enviada',
  declaracao_processando: 'Processando',
  declaracao_aceita: 'Aceita',
  declaracao_rejeitada: 'Rejeitada',
  declaracao_cancelada: 'Cancelada',
};

export function DeclaracaoList({ declaracoes, onEdit, onDelete, onView }: DeclaracaoListProps) {
  if (!declaracoes.length) {
    return (
      <div className="p-8 text-center">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
        <h3 className="text-xl font-medium mb-2">Nenhuma declaração encontrada</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Você ainda não possui declarações. Clique no botão abaixo para criar sua primeira
          declaração.
        </p>
        <Button>Nova Declaração</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {declaracoes.map(declaracao => (
        <Card key={declaracao.id} className="hover:bg-muted/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{declaracao.tipo}</h3>
                  <Badge variant="secondary" className={statusColors[declaracao.status]}>
                    {statusIcons[declaracao.status]}
                    <span className="ml-1">{statusLabels[declaracao.status]}</span>
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Vencimento:{' '}
                  {format(new Date(declaracao.dataVencimento), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </p>
                {declaracao.observacoes && (
                  <p className="text-sm text-muted-foreground">{declaracao.observacoes}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {onView && (
                  <Button variant="ghost" size="sm" onClick={() => onView(declaracao)}>
                    Visualizar
                  </Button>
                )}
                {onEdit && declaracao.status === 'declaracao_rascunho' && (
                  <Button variant="ghost" size="sm" onClick={() => onEdit(declaracao)}>
                    Editar
                  </Button>
                )}
                {onDelete && declaracao.status === 'declaracao_rascunho' && (
                  <Button variant="ghost" size="sm" onClick={() => onDelete(declaracao)}>
                    Excluir
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
