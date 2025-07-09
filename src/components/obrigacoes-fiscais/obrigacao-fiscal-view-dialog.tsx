import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ObrigacaoFiscal } from '@/types/obrigacao-fiscal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ObrigacaoFiscalViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  obrigacao: ObrigacaoFiscal;
  onEdit: () => void;
  onDelete: () => void;
  onEnviar: () => void;
  onCancelar: () => void;
  onValidar: () => void;
  onTransmitir: () => void;
  onRegistrarPagamento: () => void;
  onGerarDARF: () => void;
  onCalcularImpostos: () => void;
  onUploadAnexo: () => void;
  onViewAnexo: (anexoId: string) => void;
  onViewHistorico: () => void;
  onViewValidacoes: () => void;
  onViewRetificacao: () => void;
  onViewComprovante: () => void;
  onViewBaseCalculo: () => void;
}

export function ObrigacaoFiscalViewDialog({
  open,
  onOpenChange,
  obrigacao,
  onEdit,
  onDelete,
  onEnviar,
  onCancelar,
  onValidar,
  onTransmitir,
  onRegistrarPagamento,
  onGerarDARF,
  onCalcularImpostos,
  onUploadAnexo,
  onViewAnexo,
  onViewHistorico,
  onViewValidacoes,
  onViewRetificacao,
  onViewComprovante,
  onViewBaseCalculo,
}: ObrigacaoFiscalViewDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Detalhes da Obrigação Fiscal</AlertDialogTitle>
          <AlertDialogDescription>
            Visualize os detalhes da obrigação fiscal.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium">Título</h3>
            <p className="text-sm text-gray-500">{obrigacao.titulo}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Descrição</h3>
            <p className="text-sm text-gray-500">{obrigacao.descricao}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Tipo</h3>
            <p className="text-sm text-gray-500">{obrigacao.tipo}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Status</h3>
            <p className="text-sm text-gray-500">{obrigacao.status}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Valor</h3>
            <p className="text-sm text-gray-500">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: obrigacao.moeda,
              }).format(obrigacao.valor)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Data de Vencimento</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(obrigacao.dataVencimento), 'dd/MM/yyyy', {
                locale: ptBR,
              })}
            </p>
          </div>
          {obrigacao.codigoTributo && (
            <div>
              <h3 className="text-sm font-medium">Código do Tributo</h3>
              <p className="text-sm text-gray-500">{obrigacao.codigoTributo}</p>
            </div>
          )}
          {obrigacao.nomeTributo && (
            <div>
              <h3 className="text-sm font-medium">Nome do Tributo</h3>
              <p className="text-sm text-gray-500">{obrigacao.nomeTributo}</p>
            </div>
          )}
          {obrigacao.tipoTributo && (
            <div>
              <h3 className="text-sm font-medium">Tipo do Tributo</h3>
              <p className="text-sm text-gray-500">{obrigacao.tipoTributo}</p>
            </div>
          )}
          {obrigacao.periodoTributo && (
            <div>
              <h3 className="text-sm font-medium">Período do Tributo</h3>
              <p className="text-sm text-gray-500">{obrigacao.periodoTributo}</p>
            </div>
          )}
          {obrigacao.baseCalculo && (
            <div>
              <h3 className="text-sm font-medium">Base de Cálculo</h3>
              <p className="text-sm text-gray-500">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: obrigacao.moeda,
                }).format(obrigacao.baseCalculo)}
              </p>
            </div>
          )}
          {obrigacao.aliquota && (
            <div>
              <h3 className="text-sm font-medium">Alíquota</h3>
              <p className="text-sm text-gray-500">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'percent',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(obrigacao.aliquota / 100)}
              </p>
            </div>
          )}
          {obrigacao.valorTributo && (
            <div>
              <h3 className="text-sm font-medium">Valor do Tributo</h3>
              <p className="text-sm text-gray-500">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: obrigacao.moeda,
                }).format(obrigacao.valorTributo)}
              </p>
            </div>
          )}
          {obrigacao.juros && (
            <div>
              <h3 className="text-sm font-medium">Juros</h3>
              <p className="text-sm text-gray-500">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: obrigacao.moeda,
                }).format(obrigacao.juros)}
              </p>
            </div>
          )}
          {obrigacao.multa && (
            <div>
              <h3 className="text-sm font-medium">Multa</h3>
              <p className="text-sm text-gray-500">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: obrigacao.moeda,
                }).format(obrigacao.multa)}
              </p>
            </div>
          )}
          {obrigacao.total && (
            <div>
              <h3 className="text-sm font-medium">Total</h3>
              <p className="text-sm text-gray-500">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: obrigacao.moeda,
                }).format(obrigacao.total)}
              </p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium">Periodicidade</h3>
            <p className="text-sm text-gray-500">{obrigacao.periodicidade}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Nível de Complexidade</h3>
            <p className="text-sm text-gray-500">{obrigacao.complexidade}</p>
          </div>
          {obrigacao.responsavel && (
            <div>
              <h3 className="text-sm font-medium">Responsável</h3>
              <p className="text-sm text-gray-500">{obrigacao.responsavel}</p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium">Data de Criação</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(obrigacao.createdAt), 'dd/MM/yyyy HH:mm', {
                locale: ptBR,
              })}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Data de Atualização</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(obrigacao.updatedAt), 'dd/MM/yyyy HH:mm', {
                locale: ptBR,
              })}
            </p>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Fechar</AlertDialogCancel>
          <AlertDialogAction onClick={onEdit}>Editar</AlertDialogAction>
          <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
            Excluir
          </AlertDialogAction>
          <AlertDialogAction onClick={onEnviar}>Enviar</AlertDialogAction>
          <AlertDialogAction onClick={onCancelar}>Cancelar</AlertDialogAction>
          <AlertDialogAction onClick={onValidar}>Validar</AlertDialogAction>
          <AlertDialogAction onClick={onTransmitir}>Transmitir</AlertDialogAction>
          <AlertDialogAction onClick={onRegistrarPagamento}>Registrar Pagamento</AlertDialogAction>
          <AlertDialogAction onClick={onGerarDARF}>Gerar DARF</AlertDialogAction>
          <AlertDialogAction onClick={onCalcularImpostos}>Calcular Impostos</AlertDialogAction>
          <AlertDialogAction onClick={onUploadAnexo}>Upload Anexo</AlertDialogAction>
          <AlertDialogAction onClick={onViewHistorico}>Histórico</AlertDialogAction>
          <AlertDialogAction onClick={onViewValidacoes}>Validações</AlertDialogAction>
          <AlertDialogAction onClick={onViewRetificacao}>Retificação</AlertDialogAction>
          <AlertDialogAction onClick={onViewComprovante}>Comprovante</AlertDialogAction>
          <AlertDialogAction onClick={onViewBaseCalculo}>Base de Cálculo</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
