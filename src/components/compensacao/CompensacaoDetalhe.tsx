import React, { useState, useEffect } from 'react';
import { useSession } from '../hooks/useSession';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import { FileText, Download, History, Info, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface CompensacaoDetalheProps {
  compensacaoId: string;
  onBackClick?: () => void;
}

interface AuditLog {
  id: string;
  userId: string;
  eventType: string;
  entityId: string;
  details: any;
  createdAt: Date;
  user?: {
    name: string;
    email: string;
  };
}

interface BlockchainInfo {
  transactionId: string;
  timestamp: Date;
  blockNumber: number;
  verified: boolean;
}

interface CompensacaoDetalhada {
  id: string;
  userId: string;
  valorCompensado: number;
  status: string;
  dataCriacao: Date;
  dataExecucao?: Date;
  observacoes?: string;
  user?: {
    name: string;
    email: string;
  };
  creditos: {
    id: string;
    compensacaoId: string;
    creditTitleId: string;
    valorUtilizado: number;
    creditTitle: {
      id: string;
      title?: string;
      value: number;
      category: string;
      subtype: string;
      issuerName: string;
    };
  }[];
  debitos: {
    id: string;
    compensacaoId: string;
    debitoId: string;
    valorUtilizado: number;
    debito: {
      id: string;
      tipoTributo: string;
      competencia: string;
      valorOriginal: number;
      valorAtualizado?: number;
      valorPago: number;
      dataVencimento: Date;
      status: string;
    };
  }[];
  auditLogs: AuditLog[];
  blockchain: BlockchainInfo;
}

export default function CompensacaoDetalhe({
  compensacaoId,
  onBackClick,
}: CompensacaoDetalheProps) {
  const { user } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [compensacao, setCompensacao] = useState<CompensacaoDetalhada | null>(null);
  const [activeTab, setActiveTab] = useState('resumo');

  // Carrega os detalhes da compensação
  useEffect(() => {
    const fetchCompensacao = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/marketplace/compensacao/${compensacaoId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Erro ao buscar dados da compensação');
        }

        setCompensacao(result.data);

        // Carregar logs de auditoria se for Admin
        if (user?.role === 'ADMIN') {
          const auditResponse = await fetch(`/api/auditoria/logs?entityId=${compensacaoId}`);
          const auditData = await auditResponse.json();

          if (auditResponse.ok && auditData.logs) {
            // Adicionar logs ao objeto de compensação
            setCompensacao(prev =>
              prev
                ? {
                    ...prev,
                    auditLogs: auditData.logs,
                  }
                : null
            );
          }
        }
      } catch (err) {
        console.error('Erro:', err);
        setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado');
      } finally {
        setLoading(false);
      }
    };

    if (compensacaoId) {
      fetchCompensacao();
    }
  }, [compensacaoId, user?.role]);

  // Função para formatar data
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Renderiza o status com cor apropriada
  const renderStatusBadge = (status: string) => {
    let variant = 'default';

    switch (status.toLowerCase()) {
      case 'concluido':
      case 'concluída':
      case 'executada':
        variant = 'success';
        break;
      case 'pendente':
        variant = 'warning';
        break;
      case 'processando':
        variant = 'secondary';
        break;
      case 'cancelado':
      case 'cancelada':
      case 'falhou':
        variant = 'destructive';
        break;
      default:
        variant = 'default';
    }

    return <Badge variant={variant as any}>{status}</Badge>;
  };

  // Função para fazer download do comprovante
  const handleDownloadProof = () => {
    alert('Funcionalidade de download do comprovante em desenvolvimento');
  };

  // Renderiza o ícone adequado para o status
  const renderStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'concluido':
      case 'concluída':
      case 'executada':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pendente':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'falhou':
      case 'cancelado':
      case 'cancelada':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  // Renderiza o carregamento
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Skeleton className="h-6 w-32 mr-4" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-36 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Renderiza erros
  if (error) {
    return (
      <div>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Erro ao carregar compensação</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            {onBackClick && (
              <Button className="mt-4" variant="secondary" onClick={onBackClick}>
                Voltar
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Renderiza quando não há dados
  if (!compensacao) {
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Compensação não encontrada</CardTitle>
          </CardHeader>
          <CardContent>
            <p>A compensação solicitada não existe ou você não tem permissão para acessá-la.</p>
            {onBackClick && (
              <Button className="mt-4" variant="secondary" onClick={onBackClick}>
                Voltar
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Cálculos dos totais
  const totalCreditos = compensacao.creditos.reduce(
    (total, credito) => total + credito.valorUtilizado,
    0
  );
  const totalDebitos = compensacao.debitos.reduce(
    (total, debito) => total + debito.valorUtilizado,
    0
  );

  // Verifica se o usuário é admin
  const isAdmin = user?.role === 'ADMIN';

  // Renderiza o conteúdo principal
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBackClick && (
            <Button variant="outline" onClick={onBackClick}>
              Voltar
            </Button>
          )}
          <h2 className="text-xl font-bold flex items-center gap-2">
            {renderStatusIcon(compensacao.status)}
            Compensação{' '}
            <span className="font-mono text-sm opacity-70">{compensacao.id.substring(0, 8)}</span>
          </h2>
          {renderStatusBadge(compensacao.status)}
        </div>
        <Button variant="outline" onClick={handleDownloadProof}>
          <Download className="mr-2 h-4 w-4" />
          Baixar comprovante
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="creditos">Créditos Utilizados</TabsTrigger>
          <TabsTrigger value="debitos">Débitos Quitados</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          {isAdmin && compensacao.auditLogs && (
            <TabsTrigger value="auditoria">Auditoria</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="resumo">
          <Card>
            <CardHeader>
              <CardTitle>Resumo da compensação</CardTitle>
              <CardDescription>
                Compensação realizada em {formatDate(compensacao.dataCriacao)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">ID</p>
                  <p className="font-medium truncate">{compensacao.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-medium">{formatDate(compensacao.dataCriacao)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">{renderStatusBadge(compensacao.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="font-medium text-lg">
                    {formatCurrency(compensacao.valorCompensado)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-base font-semibold mb-2">Resumo de Créditos</h3>
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex justify-between">
                      <span>Total de créditos utilizados:</span>
                      <span className="font-semibold">{compensacao.creditos.length}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span>Valor total:</span>
                      <span className="font-semibold">{formatCurrency(totalCreditos)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold mb-2">Resumo de Débitos</h3>
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex justify-between">
                      <span>Total de débitos quitados:</span>
                      <span className="font-semibold">{compensacao.debitos.length}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span>Valor total:</span>
                      <span className="font-semibold">{formatCurrency(totalDebitos)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {compensacao.observacoes && (
                <div className="mt-6">
                  <h3 className="text-base font-semibold mb-2">Observações</h3>
                  <div className="bg-muted p-4 rounded-md">
                    <p>{compensacao.observacoes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creditos">
          <Card>
            <CardHeader>
              <CardTitle>Créditos Utilizados</CardTitle>
              <CardDescription>Detalhes dos créditos utilizados nesta compensação</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Emissor</TableHead>
                    <TableHead className="text-right">Valor Utilizado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compensacao.creditos.map(credito => (
                    <TableRow key={credito.id}>
                      <TableCell>
                        {credito.creditTitle.title ||
                          `Crédito ${credito.creditTitle.id.substring(0, 6)}`}
                      </TableCell>
                      <TableCell>
                        {credito.creditTitle.category} - {credito.creditTitle.subtype}
                      </TableCell>
                      <TableCell>{credito.creditTitle.issuerName}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(credito.valorUtilizado)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-semibold">
                      Total de Créditos
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(totalCreditos)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debitos">
          <Card>
            <CardHeader>
              <CardTitle>Débitos Quitados</CardTitle>
              <CardDescription>Detalhes dos débitos quitados nesta compensação</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo de Tributo</TableHead>
                    <TableHead>Competência</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead className="text-right">Valor Utilizado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compensacao.debitos.map(debitoItem => (
                    <TableRow key={debitoItem.id}>
                      <TableCell>{debitoItem.debito.tipoTributo}</TableCell>
                      <TableCell>{debitoItem.debito.competencia}</TableCell>
                      <TableCell>
                        {new Date(debitoItem.debito.dataVencimento).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(debitoItem.valorUtilizado)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-semibold">
                      Total de Débitos
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(totalDebitos)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blockchain">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Registro Blockchain
              </CardTitle>
              <CardDescription>Detalhes da transação registrada na blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction Hash</p>
                    <p className="font-mono text-sm truncate">
                      {compensacao.blockchain.transactionId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bloco</p>
                    <p className="font-mono text-sm">{compensacao.blockchain.blockNumber}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Timestamp</p>
                    <p className="font-mono text-sm">
                      {formatDate(compensacao.blockchain.timestamp)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={compensacao.blockchain.verified ? 'success' : 'warning'}>
                      {compensacao.blockchain.verified ? 'Verificado' : 'Pendente'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Ver detalhes completos na blockchain
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {isAdmin && compensacao.auditLogs && (
          <TabsContent value="auditoria">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="mr-2 h-5 w-5" />
                  Logs de Auditoria
                </CardTitle>
                <CardDescription>
                  Histórico de eventos registrados para esta compensação
                </CardDescription>
              </CardHeader>
              <CardContent>
                {compensacao.auditLogs.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Tipo de Evento</TableHead>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Detalhes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {compensacao.auditLogs.map(log => (
                        <TableRow key={log.id}>
                          <TableCell>{formatDate(new Date(log.createdAt))}</TableCell>
                          <TableCell>{log.eventType}</TableCell>
                          <TableCell>{log.user?.name || log.userId}</TableCell>
                          <TableCell>
                            {log.details ? (
                              <div className="max-w-xs truncate">
                                {typeof log.details === 'object'
                                  ? JSON.stringify(log.details)
                                  : log.details}
                              </div>
                            ) : (
                              'N/A'
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhum registro de auditoria encontrado para esta compensação.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
