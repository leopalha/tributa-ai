import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Wallet, TrendingUp, TrendingDown, DollarSign, ArrowRightLeft, History } from 'lucide-react';

const mockCreditos = [
  {
    id: 1,
    tipo: 'ICMS',
    valor: 125000.00,
    valorOriginal: 150000.00,
    origem: 'Compra - Empresa ABC',
    dataAquisicao: '2024-11-01',
    dataVencimento: '2024-12-31',
    status: 'Ativo',
    utilizacao: 25,
  },
  {
    id: 2,
    tipo: 'IPI',
    valor: 75000.00,
    valorOriginal: 85000.00,
    origem: 'Compensação Própria',
    dataAquisicao: '2024-10-15',
    dataVencimento: '2024-11-30',
    status: 'Ativo',
    utilizacao: 60,
  },
  {
    id: 3,
    tipo: 'ISS',
    valor: 8500.00,
    valorOriginal: 12000.00,
    origem: 'Compra - Marketplace',
    dataAquisicao: '2024-10-20',
    dataVencimento: '2024-12-15',
    status: 'Parcialmente Utilizado',
    utilizacao: 80,
  },
];

const mockTransacoes = [
  {
    id: 1,
    tipo: 'Compra',
    descricao: 'Compra de Crédito ICMS',
    valor: 125000.00,
    data: '2024-11-01',
    status: 'Concluída',
  },
  {
    id: 2,
    tipo: 'Venda',
    descricao: 'Venda de Crédito IPI',
    valor: 45000.00,
    data: '2024-10-28',
    status: 'Concluída',
  },
  {
    id: 3,
    tipo: 'Utilização',
    descricao: 'Compensação Débito ISS',
    valor: 8500.00,
    data: '2024-10-25',
    status: 'Processada',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Ativo': return 'bg-green-100 text-green-800';
    case 'Parcialmente Utilizado': return 'bg-yellow-100 text-yellow-800';
    case 'Utilizado': return 'bg-gray-100 text-gray-800';
    case 'Vencido': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case 'Compra': return <TrendingDown className="h-4 w-4 text-red-600" />;
    case 'Venda': return <TrendingUp className="h-4 w-4 text-green-600" />;
    case 'Utilização': return <ArrowRightLeft className="h-4 w-4 text-blue-600" />;
    default: return <History className="h-4 w-4 text-gray-600" />;
  }
};

export default function CarteiraPage() {
  const saldoTotal = mockCreditos.reduce((acc, credito) => acc + credito.valor, 0);
  const creditosAtivos = mockCreditos.filter(c => c.status === 'Ativo').length;
  const valorInvestido = mockCreditos.reduce((acc, credito) => acc + credito.valorOriginal, 0);
  const economia = valorInvestido - saldoTotal;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Minha Carteira</h1>
          <p className="text-muted-foreground">
            Gerencie seus créditos fiscais e transações
          </p>
        </div>
        <Button>
          <Wallet className="mr-2 h-4 w-4" />
          Nova Transação
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {saldoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              Em créditos disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créditos Ativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creditosAtivos}</div>
            <p className="text-xs text-muted-foreground">
              Créditos utilizáveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Investido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {valorInvestido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              Total investido
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economia</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {economia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              {((economia / valorInvestido) * 100).toFixed(1)}% de desconto
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="creditos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="creditos">Meus Créditos</TabsTrigger>
          <TabsTrigger value="transacoes">Histórico de Transações</TabsTrigger>
        </TabsList>

        <TabsContent value="creditos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Créditos em Carteira</CardTitle>
              <CardDescription>
                Seus créditos fiscais disponíveis para utilização
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCreditos.map((credito) => (
                  <div key={credito.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Wallet className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">Crédito {credito.tipo}</h4>
                          <Badge variant="outline">{credito.tipo}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {credito.origem}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Adquirido em: {new Date(credito.dataAquisicao).toLocaleDateString('pt-BR')} • 
                          Vence em: {new Date(credito.dataVencimento).toLocaleDateString('pt-BR')}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm">Utilização:</span>
                          <Progress value={credito.utilizacao} className="w-24" />
                          <span className="text-sm">{credito.utilizacao}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          {credito.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Valor disponível
                        </p>
                        <Badge className={getStatusColor(credito.status)}>
                          {credito.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Utilizar
                        </Button>
                        <Button variant="outline" size="sm">
                          Vender
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Transações</CardTitle>
              <CardDescription>
                Todas as suas transações de créditos fiscais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransacoes.map((transacao) => (
                  <div key={transacao.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        {getTipoIcon(transacao.tipo)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{transacao.descricao}</h4>
                          <Badge variant="outline">{transacao.tipo}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transacao.data).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transacao.tipo === 'Compra' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {transacao.tipo === 'Compra' ? '-' : '+'}
                          {transacao.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                        <Badge className="bg-green-100 text-green-800">
                          {transacao.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}