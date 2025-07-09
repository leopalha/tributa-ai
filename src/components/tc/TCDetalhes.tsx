import React from 'react';
import { useState } from 'react';
import { useRouter } from '@/lib/router-utils';
import { api } from '@/services/api';
import { CreditTitle, Empresa, User as PrismaUser, CreditStatus } from '@/types/prisma';
import {
  Loader2,
  Edit,
  Trash2,
  BadgeEuro,
  List,
  CalendarCheck,
  CalendarX,
  UserCircle,
  Building,
  Tag,
  FileDigit,
  Store,
  Fingerprint,
  AlertTriangle,
  BadgeCheck,
  BadgeX,
  History,
  Banknote,
  Building2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
// TODO: Replace with custom auth
// import { useSession } from 'next-auth/react';
import toast from '@/lib/toast-transition';
import Link from '@/components/ui/custom-link';

// Tipo estendido para detalhes do TC que este componente recebe
export interface TCDetailed extends Omit<CreditTitle, 'owner' | 'ownerCompany'> {
  owner?: Pick<PrismaUser, 'id' | 'name' | 'email'> | null;
  ownerCompany?: Empresa | null;
  listings?: { id: string; status: string }[];
}

interface TCDetalhesProps {
  tcData: TCDetailed;
}

export function TCDetalhes({ tcData: tc }: TCDetalhesProps) {
  // Renomear prop para tc para clareza
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTokenizing, setIsTokenizing] = useState(false);

  // Verifica se o usuário logado é o proprietário do TC
  const isOwner = authStatus === 'authenticated' && tc?.ownerId === session?.user?.id;

  const handleExcluirTC = async () => {
    if (!tc) return;
    if (!window.confirm('Tem certeza que deseja excluir este Título de Crédito?')) {
      return;
    }
    setIsDeleting(true);
    try {
      await api.delete(`/api/tcs/${tc.id}`);
      toast.success('Título de Crédito excluído com sucesso!');
      router.push('/tc');
      router.refresh();
    } catch (err: any) {
      console.error('Erro ao excluir TC:', err);
      const errorMessage = err?.response?.data?.error || err.message || 'Erro desconhecido';
      toast.error(`Falha ao excluir TC: ${errorMessage}`);
      setIsDeleting(false);
    }
  };

  // Navega para a página de novo anúncio passando o ID do TC
  const handleAnunciar = () => {
    router.push(`/marketplace/anuncios/novo?tcId=${tc.id}`);
  };

  // Navega para a página de edição do TC (a ser criada)
  const handleEditarTC = () => {
    router.push(`/tc/${tc.id}/editar`);
  };

  // Handler para tokenização
  const handleTokenize = async () => {
    if (!tc) return;
    setIsTokenizing(true);
    try {
      const response = await api.post(`/api/tcs/${tc.id}/tokenize`);
      toast.success('Tokenização iniciada/concluída com sucesso!');
      // Atualizar dados do TC para refletir novo status (opcional, API retorna TC atualizado)
      // ou simplesmente recarregar a página/dados
      router.refresh(); // Recarrega dados do servidor para a rota atual
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err.message || 'Erro desconhecido';
      toast.error(`Falha ao tokenizar: ${errorMessage}`);
    } finally {
      setIsTokenizing(false);
    }
  };

  // Função auxiliar para badge de status
  const getStatusBadgeVariant = (
    status: CreditStatus
  ): 'default' | 'secondary' | 'destructive' | 'outline' | 'success' => {
    switch (status) {
      case CreditStatus.VALIDATED:
      case CreditStatus.TOKENIZED:
      case CreditStatus.SETTLED:
        return 'success';
      case CreditStatus.REJECTED:
      case CreditStatus.EXPIRED:
      case CreditStatus.CANCELLED:
        return 'destructive';
      case CreditStatus.DRAFT:
      case CreditStatus.PENDING_VALIDATION:
      case CreditStatus.PENDING_TOKENIZATION:
        return 'secondary';
      case CreditStatus.LISTED_FOR_SALE:
      case CreditStatus.IN_NEGOTIATION:
      case CreditStatus.NEGOTIATED:
      case CreditStatus.SETTLEMENT_PENDING:
        return 'default'; // Ou uma cor específica azul/laranja?
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="text-xl lg:text-2xl mb-1">
                {tc.title || `Título de Crédito`}
              </CardTitle>
              <CardDescription>ID: {tc.id}</CardDescription>
            </div>
            <Badge
              variant={getStatusBadgeVariant(tc.status)}
              className="text-sm px-3 py-1 whitespace-nowrap"
            >
              {tc.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Descrição */}
          {tc.description && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-1 text-muted-foreground">Descrição</h4>
              <p className="text-sm">{tc.description}</p>
            </div>
          )}

          {/* Detalhes Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm border-t pt-4">
            <div className="flex items-center gap-2">
              <BadgeEuro className="h-4 w-4 text-primary flex-shrink-0" />
              <div>
                <span className="font-medium">Valor:</span> {formatCurrency(tc.value)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <List className="h-4 w-4 text-primary flex-shrink-0" />
              <div>
                <span className="font-medium">Categoria:</span> {tc.category}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary flex-shrink-0" />
              <div>
                <span className="font-medium">Subtipo:</span> {tc.subtype}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-primary flex-shrink-0" />
              <div>
                <span className="font-medium">Emitido:</span> {formatDate(tc.issueDate)}
              </div>
            </div>
            {tc.dueDate && (
              <div className="flex items-center gap-2">
                <CalendarX className="h-4 w-4 text-primary flex-shrink-0" />
                <div>
                  <span className="font-medium">Vencimento:</span> {formatDate(tc.dueDate)}
                </div>
              </div>
            )}
            {tc.registrationNumber && (
              <div className="flex items-center gap-2">
                <FileDigit className="h-4 w-4 text-primary flex-shrink-0" />
                <div>
                  <span className="font-medium">Registro:</span> {tc.registrationNumber}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-primary flex-shrink-0" />
              <div>
                <span className="font-medium">Emissor:</span> {tc.issuerName}
              </div>
            </div>
            {tc.debtorName && (
              <div className="flex items-center gap-2">
                <UserCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <span className="font-medium">Devedor:</span> {tc.debtorName}
                </div>
              </div>
            )}
            {tc.originalCreditorName && (
              <div className="flex items-center gap-2">
                <UserCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <span className="font-medium">Credor Orig.:</span> {tc.originalCreditorName}
                </div>
              </div>
            )}
          </div>

          {/* Detalhes Proprietário */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">Proprietário</h4>
            {tc.owner ? (
              <div className="flex items-center gap-2 text-sm">
                <UserCircle className="h-4 w-4 text-primary flex-shrink-0" />
                <span>
                  {tc.owner.name} ({tc.owner.email})
                </span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Informação do proprietário indisponível.
              </p>
            )}
            {tc.ownerCompany && (
              <div className="flex items-center gap-2 text-sm mt-2">
                <Building2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span>
                  {tc.ownerCompany.razaoSocial} (CNPJ: {tc.ownerCompany.cnpj})
                </span>
              </div>
            )}
          </div>

          {/* Informações de Anúncios */}
          {tc.listings && tc.listings.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                Anúncios no Marketplace
              </h4>
              <div className="space-y-1">
                {tc.listings.map(listing => (
                  <div key={listing.id} className="text-sm flex items-center gap-2">
                    <Link
                      href={`/marketplace/anuncios/${listing.id}`}
                      className="text-primary hover:underline"
                    >
                      Anúncio #{listing.id.substring(0, 8)}...
                    </Link>
                    <Badge variant={listing.status === 'ACTIVE' ? 'success' : 'outline'}>
                      {listing.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TODO: Adicionar Documentos, Histórico de Validação, Garantias, Info Tokenização */}
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      {isOwner && (
        <div className="flex items-center justify-end space-x-4 pt-6 border-t flex-wrap gap-2">
          {/* Botão Tokenizar */}
          {tc.status === 'VALIDATED' && (
            <Button onClick={handleTokenize} disabled={isTokenizing || isDeleting}>
              {isTokenizing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Fingerprint className="mr-2 h-4 w-4" />
              )}
              {isTokenizing ? 'Tokenizando...' : 'Tokenizar na Blockchain'}
            </Button>
          )}
          {/* Condição para anunciar: TC validado ou tokenizado, e não está em anúncio ativo */}
          {(tc.status === 'VALIDATED' || tc.status === 'TOKENIZED') &&
            (!tc.listings ||
              tc.listings.length === 0 ||
              tc.listings.every(l => l.status !== 'ACTIVE')) && (
              <Button onClick={handleAnunciar} disabled={isDeleting || isTokenizing}>
                <Store className="mr-2 h-4 w-4" />
                Anunciar no Marketplace
              </Button>
            )}
          {/* Editar TC (página a ser criada) */}
          {tc.status === 'DRAFT' && ( // Só permite editar se for Rascunho?
            <Button
              variant="outline"
              onClick={handleEditarTC}
              disabled={isDeleting || isTokenizing}
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar TC
            </Button>
          )}
          {/* Excluir TC */}
          {(!tc.listings || tc.listings.length === 0) && ( // Só permite excluir se não listado
            <Button
              variant="destructive"
              onClick={handleExcluirTC}
              disabled={isDeleting || isTokenizing}
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              {isDeleting ? 'Excluindo...' : 'Excluir TC'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
