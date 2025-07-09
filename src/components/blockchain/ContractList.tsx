import { useState } from 'react';
import Link from '@/components/ui/custom-link';
import {
  Copy,
  CheckCircle,
  Box,
  ExternalLink,
  Verified,
  Code,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface Contract {
  id: string;
  address: string;
  name: string;
  description?: string;
  type?: string;
  status?: 'verificado' | 'não verificado' | 'suspeito' | string;
  createdAt: string | Date;
  balance?: string;
  transactionCount?: number;
  creator?: string;
  verified?: boolean;
}

export interface ContractListProps {
  contracts: Contract[];
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  limit?: number;
  showViewAll?: boolean;
  viewAllHref?: string;
  onContractClick?: (contract: Contract) => void;
  hideColumns?: string[];
}

export function ContractList({
  contracts,
  isLoading = false,
  emptyMessage = 'Não há contratos para exibir',
  className,
  limit,
  showViewAll = false,
  viewAllHref = '/dashboard/blockchain/contracts',
  onContractClick,
  hideColumns = [],
}: ContractListProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const displayedContracts = limit ? contracts.slice(0, limit) : contracts;
  const hasMoreContracts = limit ? contracts.length > limit : false;

  const copyToClipboard = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDate = (timestamp: string | Date) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const shouldHideColumn = (column: string) => {
    return hideColumns.includes(column);
  };

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    switch (status.toLowerCase()) {
      case 'verificado':
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
          >
            <Verified className="h-3 w-3 mr-1" />
            Verificado
          </Badge>
        );
      case 'não verificado':
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
          >
            <Shield className="h-3 w-3 mr-1" />
            Não Verificado
          </Badge>
        );
      case 'suspeito':
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
          >
            <AlertTriangle className="h-3 w-3 mr-1" />
            Suspeito
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-full max-w-[500px]" />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {!shouldHideColumn('name') && (
                    <TableHead>
                      <Skeleton className="h-4 w-24" />
                    </TableHead>
                  )}
                  {!shouldHideColumn('address') && (
                    <TableHead>
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                  )}
                  {!shouldHideColumn('type') && (
                    <TableHead>
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                  )}
                  {!shouldHideColumn('status') && (
                    <TableHead>
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                  )}
                  {!shouldHideColumn('createdAt') && (
                    <TableHead>
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                  )}
                  {!shouldHideColumn('balance') && (
                    <TableHead>
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                  )}
                  <TableHead className="w-[100px]">
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    {!shouldHideColumn('name') && (
                      <TableCell>
                        <Skeleton className="h-5 w-32" />
                      </TableCell>
                    )}
                    {!shouldHideColumn('address') && (
                      <TableCell>
                        <Skeleton className="h-5 w-32" />
                      </TableCell>
                    )}
                    {!shouldHideColumn('type') && (
                      <TableCell>
                        <Skeleton className="h-5 w-20" />
                      </TableCell>
                    )}
                    {!shouldHideColumn('status') && (
                      <TableCell>
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                    )}
                    {!shouldHideColumn('createdAt') && (
                      <TableCell>
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                    )}
                    {!shouldHideColumn('balance') && (
                      <TableCell>
                        <Skeleton className="h-5 w-20" />
                      </TableCell>
                    )}
                    <TableCell>
                      <Skeleton className="h-9 w-16" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!contracts.length) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Contratos Inteligentes</CardTitle>
          <CardDescription>Lista de contratos inteligentes na blockchain</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Box className="h-16 w-16 text-muted-foreground" />
            <p className="text-center text-muted-foreground">{emptyMessage}</p>
            <Button asChild>
              <Link href={viewAllHref}>Explorar contratos</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle>Contratos Inteligentes</CardTitle>
        <CardDescription>Lista de contratos inteligentes na blockchain</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {!shouldHideColumn('name') && <TableHead>Nome</TableHead>}
                {!shouldHideColumn('address') && <TableHead>Endereço</TableHead>}
                {!shouldHideColumn('type') && <TableHead>Tipo</TableHead>}
                {!shouldHideColumn('status') && <TableHead>Status</TableHead>}
                {!shouldHideColumn('createdAt') && <TableHead>Criado em</TableHead>}
                {!shouldHideColumn('balance') && <TableHead>Saldo</TableHead>}
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedContracts.map(contract => (
                <TableRow
                  key={contract.id}
                  className={onContractClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                  onClick={() => onContractClick && onContractClick(contract)}
                >
                  {!shouldHideColumn('name') && (
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-1">
                        <span>{contract.name || 'Unnamed Contract'}</span>
                        {contract.verified && <Verified className="h-3.5 w-3.5 text-green-500" />}
                      </div>
                    </TableCell>
                  )}
                  {!shouldHideColumn('address') && (
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <code className="text-xs rounded-md bg-muted px-2 py-1 font-mono">
                          {truncateAddress(contract.address)}
                        </code>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={e => copyToClipboard(contract.address, e)}
                        >
                          {copied === contract.address ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  )}
                  {!shouldHideColumn('type') && (
                    <TableCell>
                      {contract.type ? (
                        <Badge variant="secondary">{contract.type}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  {!shouldHideColumn('status') && (
                    <TableCell>{getStatusBadge(contract.status)}</TableCell>
                  )}
                  {!shouldHideColumn('createdAt') && (
                    <TableCell>{formatDate(contract.createdAt)}</TableCell>
                  )}
                  {!shouldHideColumn('balance') && <TableCell>{contract.balance || '-'}</TableCell>}
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        asChild
                        onClick={e => e.stopPropagation()}
                      >
                        <Link href={`/dashboard/blockchain/contract/${contract.address}`}>
                          <Code className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        asChild
                        onClick={e => e.stopPropagation()}
                      >
                        <Link
                          href={`https://polygonscan.com/address/${contract.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {hasMoreContracts && showViewAll && (
          <div className="flex justify-center mt-4">
            <Button variant="outline" asChild>
              <Link href={viewAllHref}>Ver todos os contratos</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
