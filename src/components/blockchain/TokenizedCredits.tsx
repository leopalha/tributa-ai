import { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Wallet, FileText, ExternalLink, AlertCircle, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { TokenizedCredit } from '@/services/fabric';
import { useTokenization } from '@/hooks/useTokenization';

interface TokenizedCreditsProps {
  userId?: string;
  limit?: number;
  showActions?: boolean;
}

export function TokenizedCredits({ userId, limit, showActions = true }: TokenizedCreditsProps) {
  const { user } = useSession();
  const { getUserTokens, loading, error } = useTokenization();
  const [tokens, setTokens] = useState<TokenizedCredit[]>([]);

  // Carregar tokens do usuário
  useEffect(() => {
    const fetchTokens = async () => {
      // Se não houver usuário informado, usar o usuário da sessão
      const userIdToUse = userId || user?.id;

      if (userIdToUse) {
        const userTokens = await getUserTokens(userIdToUse);

        // Aplicar limite se necessário
        const limitedTokens = limit ? userTokens.slice(0, limit) : userTokens;
        setTokens(limitedTokens);
      }
    };

    fetchTokens();
  }, [getUserTokens, userId, user, limit]);

  // Agrupar tokens por status
  const activeTokens = tokens.filter(token => token.status === 'ACTIVE');
  const listedTokens = tokens.filter(token => token.status === 'LISTED');
  const otherTokens = tokens.filter(token => !['ACTIVE', 'LISTED'].includes(token.status));

  // Função para obter a cor do badge com base no status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'LISTED':
        return 'bg-blue-100 text-blue-800';
      case 'LOCKED':
        return 'bg-yellow-100 text-yellow-800';
      case 'TRANSFERRED':
        return 'bg-purple-100 text-purple-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Texto amigável para o status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Ativo';
      case 'LISTED':
        return 'À Venda';
      case 'LOCKED':
        return 'Bloqueado';
      case 'TRANSFERRED':
        return 'Transferido';
      case 'EXPIRED':
        return 'Expirado';
      default:
        return status;
    }
  };

  // Obter URL para visualizar o token
  const getTokenUrl = (tokenId: string) => {
    return `/dashboard/blockchain/token/${tokenId}`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Créditos Tokenizados</CardTitle>
          <CardDescription>Carregando seus tokens na blockchain...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <Spinner size="lg" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Créditos Tokenizados</CardTitle>
          <CardDescription>Ocorreu um erro ao carregar os tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Erro ao carregar tokens</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (tokens.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Créditos Tokenizados</CardTitle>
          <CardDescription>Seus créditos registrados na blockchain</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum token encontrado</h3>
            <p className="text-muted-foreground">
              Você ainda não possui créditos tokenizados na blockchain.
            </p>
            {showActions && (
              <Button className="mt-4" asChild>
                <a href="/dashboard/tokenizacao/wizard">Tokenizar Créditos</a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Créditos Tokenizados</CardTitle>
            <CardDescription>Seus créditos registrados na blockchain</CardDescription>
          </div>
          {showActions && (
            <Button variant="outline" size="sm" asChild>
              <a href="/dashboard/blockchain/carteira">
                <Wallet className="mr-2 h-4 w-4" />
                Ver Carteira
              </a>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Todos ({tokens.length})</TabsTrigger>
            <TabsTrigger value="active">Ativos ({activeTokens.length})</TabsTrigger>
            <TabsTrigger value="listed">À Venda ({listedTokens.length})</TabsTrigger>
            <TabsTrigger value="other">Outros ({otherTokens.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <TokenTable
              tokens={tokens}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              getTokenUrl={getTokenUrl}
              showActions={showActions}
            />
          </TabsContent>

          <TabsContent value="active" className="mt-4">
            <TokenTable
              tokens={activeTokens}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              getTokenUrl={getTokenUrl}
              showActions={showActions}
            />
          </TabsContent>

          <TabsContent value="listed" className="mt-4">
            <TokenTable
              tokens={listedTokens}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              getTokenUrl={getTokenUrl}
              showActions={showActions}
            />
          </TabsContent>

          <TabsContent value="other" className="mt-4">
            <TokenTable
              tokens={otherTokens}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              getTokenUrl={getTokenUrl}
              showActions={showActions}
            />
          </TabsContent>
        </Tabs>
      </CardContent>

      {showActions && (
        <CardFooter className="border-t p-4">
          <div className="flex justify-between w-full">
            <Button variant="outline" asChild>
              <a href="/dashboard/tokenizacao/wizard">
                <FileText className="mr-2 h-4 w-4" />
                Tokenizar Mais Créditos
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/dashboard/marketplace/anuncios/novo">
                <ExternalLink className="mr-2 h-4 w-4" />
                Anunciar no Marketplace
              </a>
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

// Componente interno para renderizar a tabela de tokens
interface TokenTableProps {
  tokens: TokenizedCredit[];
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  getTokenUrl: (tokenId: string) => string;
  showActions: boolean;
}

function TokenTable({
  tokens,
  getStatusColor,
  getStatusText,
  getTokenUrl,
  showActions,
}: TokenTableProps) {
  if (tokens.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Nenhum token encontrado nesta categoria.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Token ID</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead>Status</TableHead>
            {showActions && <TableHead className="text-right">Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map(token => (
            <TableRow key={token.tokenId}>
              <TableCell className="font-mono text-xs">
                {token.tokenId.substring(0, 8)}...
                {token.tokenId.substring(token.tokenId.length - 8)}
              </TableCell>
              <TableCell>
                <div className="font-medium">{token.title}</div>
                <div className="text-xs text-muted-foreground">
                  Criado em: {new Date(token.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{token.type}</Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(token.value)}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(token.status)}>
                  {getStatusText(token.status)}
                </Badge>
              </TableCell>
              {showActions && (
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={getTokenUrl(token.tokenId)}>
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">Ver detalhes</span>
                    </a>
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
