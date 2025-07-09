import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Receipt, Search, Filter, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const mockDebitos = [
  {
    id: 1,
    numero: 'DEB-2024-001',
    tipo: 'ICMS',
    valor: 45000.00,
    vencimento: '2024-11-30',
    status: 'Pendente',
    origem: 'Apuração Mensal',
    competencia: '10/2024',
    juros: 1200.00,
    multa: 2250.00,
  },
  {
    id: 2,
    numero: 'DEB-2024-002',
    tipo: 'IPI',
    valor: 23000.00,
    vencimento: '2024-10-15',
    status: 'Vencido',
    origem: 'Autuação Fiscal',
    competencia: '09/2024',
    juros: 850.00,
    multa: 1150.00,
  },
  {
    id: 3,
    numero: 'DEB-2024-003',
    tipo: 'ISS',
    valor: 8500.00,
    vencimento: '2024-12-10',
    status: 'Em Dia',
    origem: 'Declaração',
    competencia: '11/2024',
    juros: 0.00,
    multa: 0.00,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Em Dia': return 'bg-green-100 text-green-800';
    case 'Pendente': return 'bg-yellow-100 text-yellow-800';
    case 'Vencido': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Em Dia': return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'Pendente': return <Clock className="h-4 w-4 text-yellow-600" />;
    case 'Vencido': return <AlertTriangle className="h-4 w-4 text-red-600" />;
    default: return <Receipt className="h-4 w-4 text-gray-600" />;
  }
};

export default function DebitosFiscaisPage() {
  const valorTotal = mockDebitos.reduce((acc, debito) => acc + debito.valor + debito.juros + debito.multa, 0);
  const debitosVencidos = mockDebitos.filter(d => d.status === 'Vencido').length;
  const debitosPendentes = mockDebitos.filter(d => d.status === 'Pendente').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Débitos Fiscais</h1>
          <p className="text-muted-foreground">
            Controle e gerencie seus débitos fiscais
          </p>
        </div>
        <Button>
          <Receipt className="mr-2 h-4 w-4" />
          Novo Débito
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total em Débitos</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              Incluindo juros e multas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Débitos Vencidos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{debitosVencidos}</div>
            <p className="text-xs text-muted-foreground">
              Requer ação urgente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{debitosPendentes}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando pagamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Débitos</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDebitos.length}</div>
            <p className="text-xs text-muted-foreground">
              Débitos cadastrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número ou origem..."
                  className="pl-10"
                />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo de débito" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="icms">ICMS</SelectItem>
                <SelectItem value="ipi">IPI</SelectItem>
                <SelectItem value="iss">ISS</SelectItem>
                <SelectItem value="pis">PIS</SelectItem>
                <SelectItem value="cofins">COFINS</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="em-dia">Em Dia</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtrar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Débitos */}
      <Card>
        <CardHeader>
          <CardTitle>Débitos Fiscais</CardTitle>
          <CardDescription>
            Lista completa dos seus débitos fiscais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockDebitos.map((debito) => (
              <div key={debito.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-red-50 rounded-lg">
                    {getStatusIcon(debito.status)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{debito.numero}</h4>
                      <Badge variant="outline">{debito.tipo}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {debito.origem} • Competência: {debito.competencia}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Vencimento: {new Date(debito.vencimento).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">
                      {debito.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    {(debito.juros > 0 || debito.multa > 0) && (
                      <p className="text-sm text-red-600">
                        + {(debito.juros + debito.multa).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} (J&M)
                      </p>
                    )}
                    <Badge className={getStatusColor(debito.status)}>
                      {debito.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                    {debito.status !== 'Em Dia' && (
                      <Button size="sm">
                        Compensar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}