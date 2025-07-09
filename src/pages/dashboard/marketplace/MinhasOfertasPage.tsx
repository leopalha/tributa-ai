import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CircleDollarSign, Plus, Eye, Edit, Trash2, TrendingUp } from 'lucide-react';

const mockOfertas = [
  {
    id: 1,
    titulo: 'Crédito ICMS - Exportação',
    valor: 125000.00,
    valorOriginal: 150000.00,
    desconto: 16.67,
    tipo: 'ICMS',
    competencia: '09/2024',
    status: 'Ativa',
    visualizacoes: 24,
    propostas: 3,
    dataPublicacao: '2024-11-01',
    validadeOferta: '2024-12-01',
  },
  {
    id: 2,
    titulo: 'Crédito IPI - Industrialização',
    valor: 75000.00,
    valorOriginal: 85000.00,
    desconto: 11.76,
    tipo: 'IPI',
    competencia: '10/2024',
    status: 'Negociação',
    visualizacoes: 18,
    propostas: 2,
    dataPublicacao: '2024-10-25',
    validadeOferta: '2024-11-25',
  },
  {
    id: 3,
    titulo: 'Crédito ISS - Serviços',
    valor: 45000.00,
    valorOriginal: 50000.00,
    desconto: 10.00,
    tipo: 'ISS',
    competencia: '11/2024',
    status: 'Vendida',
    visualizacoes: 31,
    propostas: 5,
    dataPublicacao: '2024-10-15',
    validadeOferta: '2024-11-15',
  },
  {
    id: 4,
    titulo: 'Crédito PIS/COFINS - Insumos',
    valor: 28000.00,
    valorOriginal: 32000.00,
    desconto: 12.50,
    tipo: 'PIS/COFINS',
    competencia: '08/2024',
    status: 'Pausada',
    visualizacoes: 12,
    propostas: 1,
    dataPublicacao: '2024-10-20',
    validadeOferta: '2024-11-20',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Ativa': return 'bg-green-100 text-green-800';
    case 'Negociação': return 'bg-blue-100 text-blue-800';
    case 'Vendida': return 'bg-purple-100 text-purple-800';
    case 'Pausada': return 'bg-yellow-100 text-yellow-800';
    case 'Expirada': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function MinhasOfertasPage() {
  const totalOfertas = mockOfertas.length;
  const ofertasAtivas = mockOfertas.filter(o => o.status === 'Ativa').length;
  const valorTotalEmOferta = mockOfertas.filter(o => o.status === 'Ativa').reduce((acc, o) => acc + o.valor, 0);
  const totalVisualizacoes = mockOfertas.reduce((acc, o) => acc + o.visualizacoes, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Minhas Ofertas</h1>
          <p className="text-muted-foreground">
            Gerencie suas ofertas de créditos no marketplace
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Oferta
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total em Ofertas</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {valorTotalEmOferta.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor em ofertas ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ofertas Ativas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{ofertasAtivas}</div>
            <p className="text-xs text-muted-foreground">
              de {totalOfertas} ofertas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisualizacoes}</div>
            <p className="text-xs text-muted-foreground">
              Total de visualizações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propostas</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockOfertas.reduce((acc, o) => acc + o.propostas, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Propostas recebidas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Ofertas */}
      <Card>
        <CardHeader>
          <CardTitle>Suas Ofertas</CardTitle>
          <CardDescription>
            Gerencie todas as suas ofertas de créditos fiscais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockOfertas.map((oferta) => (
              <div key={oferta.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <CircleDollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{oferta.titulo}</h4>
                      <Badge variant="outline">{oferta.tipo}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Competência: {oferta.competencia} • 
                      Publicada em: {new Date(oferta.dataPublicacao).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Válida até: {new Date(oferta.validadeOferta).toLocaleDateString('pt-BR')}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm">👁️ {oferta.visualizacoes} visualizações</span>
                      <span className="text-sm">💬 {oferta.propostas} propostas</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {oferta.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <p className="text-sm text-muted-foreground line-through">
                      {oferta.valorOriginal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <p className="text-sm text-green-600">
                      {oferta.desconto.toFixed(1)}% desconto
                    </p>
                    <Badge className={getStatusColor(oferta.status)}>
                      {oferta.status}
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