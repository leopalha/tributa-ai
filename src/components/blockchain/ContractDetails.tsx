import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Contract } from '@/types/blockchain';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Copy, CheckCircle, AlertCircle, Calendar, User, Code, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

export interface ContractDetailsProps {
  contract: Contract | null;
  isLoading: boolean;
}

export default function ContractDetails({ contract, isLoading }: ContractDetailsProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado para a área de transferência`);
  };

  if (isLoading) {
    return <ContractDetailsSkeleton />;
  }

  if (!contract) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contrato não encontrado</CardTitle>
          <CardDescription>Não foi possível encontrar os detalhes deste contrato</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contract.stats.transactions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total de interações com o contrato</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contract.stats.balance.toLocaleString()} ETH</div>
            <p className="text-xs text-muted-foreground">Saldo atual do contrato</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Idade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contract.stats.age} dias</div>
            <p className="text-xs text-muted-foreground">Desde a criação do contrato</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Usuários únicos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contract.stats.uniqueCallers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Endereços que interagiram com o contrato
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Contrato</CardTitle>
          <CardDescription>Detalhes técnicos do contrato inteligente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Endereço</h3>
                <div className="flex items-center space-x-2">
                  <code className="rounded bg-muted px-2 py-1 text-xs">{contract.address}</code>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => copyToClipboard(contract.address, 'Endereço')}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copiar endereço</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-7 w-7" asChild>
                          <a
                            href={`https://etherscan.io/address/${contract.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ver no Etherscan</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Nome</h3>
                <p>{contract.name}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Tipo</h3>
                <div className="flex items-center space-x-2">
                  <p>{contract.type}</p>
                  <Badge variant="outline">{contract.category}</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Versão</h3>
                <div className="flex items-center space-x-2">
                  <p>{contract.version}</p>
                  <Badge variant={contract.verified ? 'success' : 'destructive'}>
                    {contract.verified ? (
                      <span className="flex items-center">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Verificado
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Não verificado
                      </span>
                    )}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Proprietário</h3>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <code className="rounded bg-muted px-2 py-1 text-xs">
                    {`${contract.owner.substring(0, 6)}...${contract.owner.substring(
                      contract.owner.length - 4
                    )}`}
                  </code>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => copyToClipboard(contract.owner, 'Proprietário')}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copiar endereço do proprietário</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Criado por</h3>
                <div className="flex items-center space-x-2">
                  <Code className="h-4 w-4 text-muted-foreground" />
                  <code className="rounded bg-muted px-2 py-1 text-xs">
                    {`${contract.deployer.substring(0, 6)}...${contract.deployer.substring(
                      contract.deployer.length - 4
                    )}`}
                  </code>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => copyToClipboard(contract.deployer, 'Deployer')}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copiar endereço do deployer</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Data de criação</h3>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">
                    {new Date(contract.createdAt).toLocaleDateString()} (
                    {formatDistanceToNow(new Date(contract.createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                    )
                  </p>
                </div>
              </div>
            </div>

            {contract.description && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Descrição</h3>
                <p className="text-sm text-muted-foreground">{contract.description}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function ContractDetailsSkeleton() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
