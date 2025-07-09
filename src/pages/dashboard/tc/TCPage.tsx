import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Eye, Edit, Trash2, CreditCard, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockTitulos = [
  {
    id: 1,
    numero: 'TC-2024-001',
    tipo: 'Nota Fiscal',
    valor: 25000.00,
    devedor: 'Empresa ABC Ltda',
    vencimento: '2024-12-31',
    status: 'Ativo',
    origem: 'ICMS',
  },
  {
    id: 2,
    numero: 'TC-2024-002',
    tipo: 'Duplicata',
    valor: 15000.00,
    devedor: 'Empresa XYZ S.A.',
    vencimento: '2024-11-15',
    status: 'Pendente',
    origem: 'IPI',
  },
  {
    id: 3,
    numero: 'TC-2024-003',
    tipo: 'Cheque',
    valor: 8500.00,
    devedor: 'João Silva',
    vencimento: '2024-10-20',
    status: 'Vencido',
    origem: 'ISS',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Ativo': return 'bg-green-100 text-green-800';
    case 'Pendente': return 'bg-yellow-100 text-yellow-800';
    case 'Vencido': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function TCPage() {
  const valorTotal = mockTitulos.reduce((acc, titulo) => acc + titulo.valor, 0);
  const titulosAtivos = mockTitulos.filter(t => t.status === 'Ativo').length;
  const titulosPendentes = mockTitulos.filter(t => t.status === 'Pendente').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Títulos de Crédito</h1>
          <p className="text-muted-foreground">
            Gerencie seus títulos de crédito tributário
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/tc/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Título
          </Link>
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total em Títulos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor total dos títulos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Títulos Ativos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{titulosAtivos}</div>
            <p className="text-xs text-muted-foreground">
              Títulos em vigor
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{titulosPendentes}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando validação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Títulos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTitulos.length}</div>
            <p className="text-xs text-muted-foreground">
              Títulos cadastrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Títulos */}
      <Card>
        <CardHeader>
          <CardTitle>Meus Títulos</CardTitle>
          <CardDescription>
            Lista completa dos seus títulos de crédito tributário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTitulos.map((titulo) => (
              <div key={titulo.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{titulo.numero}</h4>
                    <p className="text-sm text-muted-foreground">{titulo.tipo} • {titulo.devedor}</p>
                    <p className="text-sm text-muted-foreground">
                      Vencimento: {new Date(titulo.vencimento).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">
                      {titulo.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <Badge className={getStatusColor(titulo.status)}>
                      {titulo.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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