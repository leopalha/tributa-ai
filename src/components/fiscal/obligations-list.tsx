import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, Edit, Eye, Search, Trash2 } from 'lucide-react';
import Link from '@/components/ui/custom-link';

interface FiscalObligation {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  dueDate: Date;
  taxCode?: string;
  taxName?: string;
  taxType?: string;
  taxPeriod?: string;
  taxBase?: number;
  taxRate?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ObligationsListProps {
  initialObligations: FiscalObligation[];
}

export function ObligationsList({ initialObligations }: ObligationsListProps) {
  const [obligations, setObligations] = useState(initialObligations);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="default">Pendente</Badge>;
      case 'PAID':
        return (
          <Badge variant="success" className="bg-green-100 text-green-800">
            Pago
          </Badge>
        );
      case 'OVERDUE':
        return <Badge variant="destructive">Vencido</Badge>;
      case 'CANCELLED':
        return <Badge variant="secondary">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'TAX':
        return <Badge variant="outline">Imposto</Badge>;
      case 'CONTRIBUTION':
        return <Badge variant="outline">Contribuição</Badge>;
      case 'FINE':
        return <Badge variant="outline">Multa</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const filteredObligations = obligations.filter(obligation => {
    const matchesSearch =
      obligation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obligation.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obligation.taxName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeTab === 'all' || obligation.status === activeTab.toUpperCase();

    return matchesSearch && matchesTab;
  });

  const getTabCount = (status: string) => {
    if (status === 'all') return obligations.length;
    return obligations.filter(o => o.status === status.toUpperCase()).length;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const isOverdue = (dueDate: Date, status: string) => {
    return status === 'PENDING' && new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar obrigações..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Todas ({getTabCount('all')})</TabsTrigger>
          <TabsTrigger value="pending">Pendentes ({getTabCount('pending')})</TabsTrigger>
          <TabsTrigger value="paid">Pagas ({getTabCount('paid')})</TabsTrigger>
          <TabsTrigger value="overdue">Vencidas ({getTabCount('overdue')})</TabsTrigger>
          <TabsTrigger value="cancelled">Canceladas ({getTabCount('cancelled')})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredObligations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  Nenhuma obrigação encontrada
                </p>
                <p className="text-sm text-muted-foreground">
                  {searchTerm
                    ? 'Tente ajustar os filtros de busca'
                    : 'Crie sua primeira obrigação fiscal'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredObligations.map(obligation => (
                    <TableRow key={obligation.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{obligation.title}</p>
                          {obligation.description && (
                            <p className="text-sm text-muted-foreground">
                              {obligation.description}
                            </p>
                          )}
                          {obligation.taxName && (
                            <p className="text-xs text-muted-foreground">{obligation.taxName}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(obligation.type)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(obligation.status)}
                          {isOverdue(obligation.dueDate, obligation.status) && (
                            <Badge variant="destructive" className="text-xs">
                              Vencida
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">
                            {formatCurrency(obligation.amount, obligation.currency)}
                          </p>
                          {obligation.taxBase && (
                            <p className="text-xs text-muted-foreground">
                              Base: {formatCurrency(obligation.taxBase, obligation.currency)}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p
                            className={`text-sm ${
                              isOverdue(obligation.dueDate, obligation.status)
                                ? 'text-destructive font-medium'
                                : ''
                            }`}
                          >
                            {formatDate(obligation.dueDate)}
                          </p>
                          {obligation.taxPeriod && (
                            <p className="text-xs text-muted-foreground">{obligation.taxPeriod}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/gestao-fiscal/${obligation.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/gestao-fiscal/${obligation.id}/editar`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
