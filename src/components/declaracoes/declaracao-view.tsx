import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Declaracao, StatusDeclaracao } from '@/types/declaracao';
import { AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { DeclaracaoAnexos } from './declaracao-anexos';
import { DeclaracaoService } from '@/services/declaracao.service';
import { useToast } from '@/components/ui/use-toast';
import { DeclaracaoHistorico } from './declaracao-historico';

interface DeclaracaoViewProps {
  declaracao: Declaracao;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const statusIcons = {
  declaracao_pendente: <AlertCircle className="h-4 w-4" />,
  declaracao_em_andamento: <Clock className="h-4 w-4" />,
  declaracao_concluida: <CheckCircle2 className="h-4 w-4" />,
  declaracao_atrasada: <AlertCircle className="h-4 w-4" />,
  declaracao_cancelada: <XCircle className="h-4 w-4" />,
};

const statusColors = {
  declaracao_pendente: 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-200',
  declaracao_em_andamento: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
  declaracao_concluida: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200',
  declaracao_atrasada: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200',
  declaracao_cancelada: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
};

const statusLabels = {
  declaracao_pendente: 'Pendente',
  declaracao_em_andamento: 'Em Andamento',
  declaracao_concluida: 'Concluída',
  declaracao_atrasada: 'Atrasada',
  declaracao_cancelada: 'Cancelada',
};

export function DeclaracaoView({
  declaracao,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: DeclaracaoViewProps) {
  const { toast } = useToast();
  const service = DeclaracaoService.getInstance();

  const handleUploadAnexo = async (file: File) => {
    try {
      await service.uploadAnexo(declaracao.id, file);
      toast({
        title: 'Anexo enviado',
        description: 'O arquivo foi enviado com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao enviar anexo',
        description: 'Não foi possível enviar o arquivo.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAnexo = async (anexoId: string) => {
    try {
      await service.excluirAnexo(declaracao.id, anexoId);
      toast({
        title: 'Anexo excluído',
        description: 'O arquivo foi excluído com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao excluir anexo',
        description: 'Não foi possível excluir o arquivo.',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadAnexo = async (anexoId: string) => {
    try {
      await service.baixarAnexo(declaracao.id, anexoId);
    } catch (error) {
      toast({
        title: 'Erro ao baixar anexo',
        description: 'Não foi possível baixar o arquivo.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {declaracao.tipo}
            <Badge variant="secondary" className={statusColors[declaracao.status]}>
              {statusIcons[declaracao.status]}
              <span className="ml-1">{statusLabels[declaracao.status]}</span>
            </Badge>
          </DialogTitle>
          <DialogDescription>Detalhes da declaração</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Data de Vencimento</dt>
                  <dd className="mt-1">
                    {format(new Date(declaracao.dataVencimento), "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Valor</dt>
                  <dd className="mt-1">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(declaracao.valor)}
                  </dd>
                </div>

                {declaracao.descricao && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Descrição</dt>
                    <dd className="mt-1 whitespace-pre-wrap">{declaracao.descricao}</dd>
                  </div>
                )}

                {declaracao.observacoes && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Observações</dt>
                    <dd className="mt-1 whitespace-pre-wrap">{declaracao.observacoes}</dd>
                  </div>
                )}

                {declaracao.responsavel && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Responsável</dt>
                    <dd className="mt-1">{declaracao.responsavel}</dd>
                  </div>
                )}

                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Data de Criação</dt>
                  <dd className="mt-1">
                    {format(new Date(declaracao.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Última Atualização</dt>
                  <dd className="mt-1">
                    {format(new Date(declaracao.updatedAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <DeclaracaoAnexos
            anexos={declaracao.anexos || []}
            onUpload={handleUploadAnexo}
            onDelete={handleDeleteAnexo}
            onDownload={handleDownloadAnexo}
          />

          <DeclaracaoHistorico historico={declaracao.historico || []} />

          <div className="flex justify-end gap-4">
            {onDelete && declaracao.status === 'declaracao_pendente' && (
              <Button variant="destructive" onClick={onDelete}>
                Excluir
              </Button>
            )}
            {onEdit && declaracao.status === 'declaracao_pendente' && (
              <Button onClick={onEdit}>Editar</Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
