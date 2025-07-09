import React, { useState, useEffect } from 'react';
import { useRouter } from '@/lib/router-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Loader2,
  Edit,
  Trash2,
  Tag,
  FileDigit,
  List,
  BadgeDollarSign,
  CalendarCheck,
  CalendarX,
  UserCircle,
  ArrowRight,
  Mail,
  User,
  AlertCircle,
} from 'lucide-react';
import {
  Proposta,
  Empresa,
  TipoNegociacao,
  User as PrismaUser,
  Anuncio,
  CreditTitle,
} from '@/types/prisma';
import { formatCurrency, formatDate } from '@/lib/utils';
import toast from '@/lib/toast-transition';
import { useSession } from '../../hooks/useSession';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import Link from '@/components/ui/custom-link';
import { api } from '@/services/api';

// Tipo estendido para os dados que esperamos da API
// Usa Omit para remover relações completas e adiciona tipos simplificados
interface AnuncioDetalhadoData extends Omit<Anuncio, 'creditTitle' | 'seller' | 'propostas'> {
  creditTitle?:
    | (Omit<CreditTitle, 'owner' | 'ownerCompany'> & {
        owner?: Pick<PrismaUser, 'id' | 'name' | 'email'> | null;
        ownerCompany?: Empresa | null;
      })
    | null;
  seller?: Pick<PrismaUser, 'id' | 'name' | 'email'> | null;
  propostas?:
    | (Omit<Proposta, 'buyer' | 'anuncio'> & {
        buyer?: Pick<PrismaUser, 'id' | 'name'> | null;
      })[]
    | null;
}

interface AnuncioDetalhesProps {
  anuncioId: string;
}

export function AnuncioDetalhes({ anuncioId }: AnuncioDetalhesProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [anuncio, setAnuncio] = useState<AnuncioDetalhadoData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Estados para o modal de proposta (simplificado)
  const [valorProposta, setValorProposta] = useState('');
  const [mensagemProposta, setMensagemProposta] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sendingProposta, setSendingProposta] = useState(false);
  const [updatingPropostaId, setUpdatingPropostaId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false); // Estado para exclusão
  const [formError, setFormError] = useState<string | null>(null); // Erro form proposta

  const { user, status } = useSession(); // Obter dados da sessão
  const userId = user?.id; // ID do usuário logado

  // Determinar se o usuário logado é o vendedor
  // Verifica se a sessão está carregada e se o ID do usuário da sessão é o mesmo do vendedor do anúncio
  const isVendedor = status === 'authenticated' && !!userId && anuncio?.seller?.id === userId;

  const carregarDados = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Corrigido: Atribuir diretamente o resultado, pois api.get<T> retorna T
      const anuncioData = await api.get<AnuncioDetalhadoData>(
        `/api/marketplace/anuncios/${anuncioId}`
      );
      setAnuncio(anuncioData);
    } catch (err: unknown) {
      // Substituído any por unknown
      console.error('Erro ao carregar dados do anúncio:', err);
      const errorMessage = err instanceof Error ? err.message : 'Falha ao carregar anúncio';
      // Tentar extrair erro de resposta axios se disponível
      const responseError = (err as { response?: { data?: { error?: string } } })?.response?.data
        ?.error;
      setError(responseError || errorMessage);
      toast.error(`Erro: ${responseError || errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [anuncioId]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]); // carregarDados é agora estável devido ao useCallback

  const getStatusColor = (status: string | undefined) => {
    // Adaptar para os status reais do Prisma se necessário
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-500';
      case 'PAUSED':
        return 'bg-yellow-500';
      case 'FINISHED':
      case 'SETTLED':
        return 'bg-blue-500';
      case 'EXPIRED':
      case 'CANCELLED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTipoNegociacaoLabel = (tipo: TipoNegociacao | undefined) => {
    if (!tipo) return '';
    switch (tipo) {
      case TipoNegociacao.LEILAO:
        return 'Leilão';
      case TipoNegociacao.NEGOCIACAO_DIRETA:
        return 'Negociação Direta';
      case TipoNegociacao.VENDA_DIRETA:
        return 'Venda Direta';
      default:
        return tipo;
    }
  };

  const handleEnviarProposta = async () => {
    if (!anuncio) return;
    setSendingProposta(true);
    setFormError(null);
    try {
      const payload = { offerValue: Number(valorProposta), message: mensagemProposta };
      await api.post(`/api/marketplace/anuncios/${anuncioId}/propostas`, payload);
      toast.success('Proposta enviada com sucesso!');
      setDialogOpen(false);
      setValorProposta('');
      setMensagemProposta('');
      carregarDados();
    } catch (err: unknown) {
      // Substituído any por unknown
      console.error('Erro ao enviar proposta:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      const responseError = (err as { response?: { data?: { error?: string } } })?.response?.data
        ?.error;
      setFormError(responseError || errorMessage);
    } finally {
      setSendingProposta(false);
    }
  };

  // Função para atualizar o status da proposta
  const handleUpdatePropostaStatus = async (
    propostaId: string,
    novoStatus: 'ACCEPTED' | 'REJECTED'
  ) => {
    setUpdatingPropostaId(propostaId);
    try {
      const payload = { status: novoStatus };
      await api.patch(`/api/marketplace/propostas/${propostaId}`, payload);
      toast.success(`Proposta ${novoStatus === 'ACCEPTED' ? 'aceita' : 'rejeitada'} com sucesso!`);
      // Recarregar os dados para refletir a mudança de status e potentially o status do anúncio
      carregarDados();
    } catch (err: unknown) {
      // Substituído any por unknown
      console.error(`Erro ao atualizar proposta ${propostaId}:`, err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      const responseError = (err as { response?: { data?: { error?: string } } })?.response?.data
        ?.error;
      toast.error(
        `Falha ao ${novoStatus === 'ACCEPTED' ? 'aceitar' : 'rejeitar'} proposta: ${responseError || errorMessage}`
      );
    } finally {
      setUpdatingPropostaId(null);
    }
  };

  // Função para excluir o anúncio
  const handleExcluirAnuncio = async () => {
    if (!anuncio) return;
    if (
      !window.confirm(
        'Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita.'
      )
    ) {
      return;
    }
    setIsDeleting(true);
    try {
      await api.delete(`/api/marketplace/anuncios/${anuncioId}`);
      toast.success('Anúncio excluído com sucesso!');
      router.push('/marketplace');
      router.refresh();
    } catch (err: unknown) {
      // Substituído any por unknown
      console.error('Erro ao excluir anúncio:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      const responseError = (err as { response?: { data?: { error?: string } } })?.response?.data
        ?.error;
      toast.error(`Falha ao excluir anúncio: ${responseError || errorMessage}`);
      setIsDeleting(false); // Certificar que isDeleting é resetado em caso de erro
    }
  };

  // Função para navegar para a edição (página a ser criada)
  const handleEditarAnuncio = () => {
    router.push(`/marketplace/anuncios/${anuncioId}/editar`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6 animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 md:w-72 bg-muted" />
            <Skeleton className="h-4 w-32 bg-muted" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24 rounded-md bg-muted" />
            <Skeleton className="h-6 w-20 rounded-md bg-muted" />
          </div>
        </div>
        <Card className="border-none shadow-none">
          <CardContent className="p-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-6 w-1/3 bg-muted" />{' '}
              <Skeleton className="h-12 w-full bg-muted" />
              <Skeleton className="h-48 w-full rounded-lg bg-muted" />
              <Skeleton className="h-6 w-1/3 bg-muted" />{' '}
              <Skeleton className="h-16 w-full bg-muted" />
              <Skeleton className="h-6 w-1/4 bg-muted" />{' '}
              <Skeleton className="h-8 w-1/2 bg-muted" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-64 w-full rounded-lg bg-muted" />
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32 rounded-md bg-muted" />
        </div>
      </div>
    );
  }

  if (error || !anuncio) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao Carregar Anúncio</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error || 'Anúncio não encontrado ou ocorreu um erro inesperado.'}</span>
            <Button variant="secondary" size="sm" onClick={() => router.push('/marketplace')}>
              Voltar ao Marketplace
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Se chegou aqui, anuncio existe
  const { creditTitle, seller, propostas } = anuncio;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">
                {creditTitle?.title || 'Título Indisponível'}
              </CardTitle>
              <CardDescription>Anúncio ID: {anuncio.id}</CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">{getTipoNegociacaoLabel(anuncio.type)}</Badge>
              <Badge className={`${getStatusColor(anuncio.status)} text-white`}>
                {anuncio.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Coluna 1: Detalhes do Anúncio e Vendedor */}
            <div className="lg:col-span-1 space-y-6">
              {/* Detalhes da Oferta */}
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Oferta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preço Sugerido:</span>{' '}
                    <span className="font-medium text-green-600">
                      {formatCurrency(anuncio.askingPrice || 0)}
                    </span>
                  </div>
                  {anuncio.minimumBid && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lance Mínimo:</span>{' '}
                      <span className="font-medium">{formatCurrency(anuncio.minimumBid)}</span>
                    </div>
                  )}
                  {anuncio.buyNowPrice && (
                    <div className="flex justify-between">
                      <span className="font-medium">Compre Agora:</span>{' '}
                      <span className="font-medium text-primary">
                        {formatCurrency(anuncio.buyNowPrice)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo:</span>{' '}
                    <span className="font-medium">{getTipoNegociacaoLabel(anuncio.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Publicado em:</span>{' '}
                    <span className="font-medium">{formatDate(anuncio.publishedAt)}</span>
                  </div>
                  {anuncio.expiresAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expira em:</span>{' '}
                      <span className="font-medium text-destructive">
                        {formatDate(anuncio.expiresAt)}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Detalhes do Vendedor */}
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Vendedor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />{' '}
                    <span className="font-medium">{seller?.name || 'Nome Indisponível'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />{' '}
                    <span>{seller?.email || 'Email Indisponível'}</span>
                  </div>
                  {/* TODO: Adicionar reputação/avaliação do vendedor? */}
                </CardContent>
              </Card>

              {/* Descrição do Anúncio */}
              {anuncio.description && (
                <Card className="border-border/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Descrição Adicional</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{anuncio.description}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Coluna 2: Detalhes do Título de Crédito */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Detalhes do Título de Crédito</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />{' '}
                    <div>
                      <span className="font-medium">Título:</span> {creditTitle?.title || 'N/A'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <List className="h-4 w-4 text-primary" />{' '}
                    <div>
                      <span className="font-medium">Categoria:</span> {creditTitle?.category}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />{' '}
                    <div>
                      <span className="font-medium">Subtipo:</span> {creditTitle?.subtype}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BadgeDollarSign className="h-4 w-4 text-primary" />{' '}
                    <div>
                      <span className="font-medium">Valor Nominal:</span>{' '}
                      {formatCurrency(creditTitle?.value || 0)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4 text-primary" />{' '}
                    <div>
                      <span className="font-medium">Emitido:</span>{' '}
                      {formatDate(creditTitle?.issueDate)}
                    </div>
                  </div>
                  {creditTitle?.dueDate && (
                    <div className="flex items-center gap-2">
                      <CalendarX className="h-4 w-4 text-primary" />{' '}
                      <div>
                        <span className="font-medium">Vencimento:</span>{' '}
                        {formatDate(creditTitle.dueDate)}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4 text-primary" />{' '}
                    <div>
                      <span className="font-medium">Emissor:</span> {creditTitle?.issuerName}
                    </div>
                  </div>
                  {creditTitle?.registrationNumber && (
                    <div className="flex items-center gap-2">
                      <FileDigit className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium">Registro:</span>{' '}
                        {creditTitle.registrationNumber}
                      </div>
                    </div>
                  )}
                  {/* Link para página do TC */}
                  <Button asChild variant="link" size="sm" className="p-0 h-auto mt-2">
                    <Link href={`/tc/${creditTitle?.id}`}>
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              {/* TODO: Adicionar Documentos e Garantias (se houver) */}
            </div>

            {/* Coluna 3: Propostas */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    Propostas
                    {!isVendedor && anuncio.status === 'ACTIVE' && (
                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm">Fazer Proposta</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Nova Proposta</DialogTitle>
                            <DialogDescription>
                              Faça sua oferta para &quot;{creditTitle?.title || 'este título'}
                              &quot;.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <label htmlFor="valorProposta" className="text-sm font-medium">
                                Valor (R$)
                              </label>
                              <Input
                                id="valorProposta"
                                type="number"
                                step="0.01"
                                value={valorProposta}
                                onChange={e => setValorProposta(e.target.value)}
                                placeholder={formatCurrency(anuncio.askingPrice || 0)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label htmlFor="mensagemProposta" className="text-sm font-medium">
                                Mensagem (Opcional)
                              </label>
                              <Textarea
                                id="mensagemProposta"
                                value={mensagemProposta}
                                onChange={e => setMensagemProposta(e.target.value)}
                                placeholder="Sua mensagem para o vendedor..."
                                className="mt-1"
                                rows={3}
                              />
                            </div>
                          </div>
                          {formError && (
                            <Alert variant="destructive" className="mt-4">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Erro ao Enviar</AlertTitle>
                              <AlertDescription>{formError}</AlertDescription>
                            </Alert>
                          )}
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setDialogOpen(false);
                                setFormError(null);
                              }}
                              disabled={sendingProposta}
                            >
                              Cancelar
                            </Button>
                            <Button
                              onClick={handleEnviarProposta}
                              disabled={sendingProposta || !valorProposta}
                            >
                              {sendingProposta ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : null}
                              Enviar Proposta
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </CardTitle>
                  <CardDescription>Propostas recebidas para este anúncio.</CardDescription>
                </CardHeader>
                <CardContent>
                  {!propostas || propostas.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                      Nenhuma proposta recebida ainda.
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {propostas.map(proposta => {
                        // Verificar se o usuário atual é o vendedor E se a proposta está pendente
                        const isVendedorProposta = anuncio?.seller?.id === userId;
                        const isPendente = proposta.status === 'PENDING';

                        return (
                          <div
                            key={proposta.id}
                            className="border p-3 rounded-md bg-muted/50 mb-2 last:mb-0"
                          >
                            <div className="flex items-start justify-between gap-2">
                              {/* Coluna Esquerda Proposta */}
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-xs font-medium">
                                    {proposta.buyer?.name || 'Comprador'}
                                  </span>
                                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                                    {proposta.status}
                                  </Badge>
                                </div>
                                <p className="text-base font-semibold text-primary">
                                  {formatCurrency(proposta.offerValue)}
                                </p>
                              </div>
                              {/* Coluna Direita Proposta (Ações) */}
                              {isVendedor && isPendente && (
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  {/* ... Botões Aceitar/Rejeitar ... */}
                                </div>
                              )}
                            </div>
                            {proposta.message && (
                              <p className="text-xs text-muted-foreground mt-2 border-t pt-1.5">
                                &quot;{proposta.message}&quot;
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground text-right mt-1.5">
                              {formatDate(proposta.createdAt)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end space-x-4 pt-6 border-t">
        <Button variant="outline" onClick={() => router.push('/marketplace')} disabled={isDeleting}>
          Voltar ao Marketplace
        </Button>

        {/* Botões de Ação do Vendedor */}
        {isVendedor && (
          <>
            {/* Só permite editar/excluir se não estiver finalizado/cancelado? */}
            {anuncio.status !== 'SETTLED' &&
              anuncio.status !== 'CANCELLED' &&
              anuncio.status !== 'EXPIRED' && (
                <Button variant="outline" onClick={handleEditarAnuncio} disabled={isDeleting}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              )}
            {/* Só permite excluir se não tiver proposta aceita (API já valida, mas bom ter UI hint) */}
            {!anuncio.propostas?.some(p => p.status === 'ACCEPTED') && (
              <Button variant="destructive" onClick={handleExcluirAnuncio} disabled={isDeleting}>
                {isDeleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                {isDeleting ? 'Excluindo...' : 'Excluir Anúncio'}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
