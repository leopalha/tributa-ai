import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { History, Search, Filter, Eye, Download, CheckCircle, Clock, XCircle } from 'lucide-react';

const mockHistorico = [
  {
    id: 1,
    protocolo: 'COMP-2024-001',
    dataCompensacao: '2024-11-15',
    valorDebito: 45000.00,
    valorCredito: 50000.00,
    valorCompensado: 45000.00,
    saldoCredito: 5000.00,
    tipoDebito: 'ICMS',
    tipoCredito: 'ICMS',
    status: 'Concluída',
    observacoes: 'Compensação bilateral aprovada',
  },
  {
    id: 2,
    protocolo: 'COMP-2024-002',
    dataCompensacao: '2024-11-10',
    valorDebito: 23000.00,
    valorCredito: 18000.00,
    valorCompensado: 18000.00,
    saldoCredito: 0.00,
    tipoDebito: 'IPI',
    tipoCredito: 'IPI',
    status: 'Parcial',
    observacoes: 'Compensação parcial - saldo pendente',
  },
  {
    id: 3,
    protocolo: 'COMP-2024-003',
    dataCompensacao: '2024-11-05',
    valorDebito: 8500.00,
    valorCredito: 8500.00,
    valorCompensado: 8500.00,
    saldoCredito: 0.00,
    tipoDebito: 'ISS',
    tipoCredito: 'ISS',
    status: 'Concluída',
    observacoes: 'Compensação total processada',
  },
  {
    id: 4,
    protocolo: 'COMP-2024-004',
    dataCompensacao: '2024-10-28',
    valorDebito: 12000.00,
    valorCredito: 15000.00,
    valorCompensado: 0.00,
    saldoCredito: 0.00,
    tipoDebito: 'PIS',
    tipoCredito: 'PIS',
    status: 'Rejeitada',
    observacoes: 'Documentação insuficiente',
  },
  {
    id: 5,
    protocolo: 'COMP-2024-005',
    dataCompensacao: '2024-10-20',
    valorDebito: 35000.00,
    valorCredito: 35000.00,
    valorCompensado: 35000.00,
    saldoCredito: 0.00,
    tipoDebito: 'COFINS',
    tipoCredito: 'COFINS',
    status: 'Processando',
    observacoes: 'Aguardando análise fiscal',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Concluída': return 'bg-green-100 text-green-800';
    case 'Parcial': return 'bg-yellow-100 text-yellow-800';
    case 'Processando': return 'bg-blue-100 text-blue-800';
    case 'Rejeitada': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Concluída': return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'Parcial': return <CheckCircle className="h-4 w-4 text-yellow-600" />;
    case 'Processando': return <Clock className="h-4 w-4 text-blue-600" />;
    case 'Rejeitada': return <XCircle className="h-4 w-4 text-red-600" />;
    default: return <History className="h-4 w-4 text-gray-600" />;
  }
};

export default function HistoricoCompensacaoPage() {
  const [filtros, setFiltros] = useState({
    busca: '',
    status: '',
    periodo: '',
    tipo: '',
  });

  const valorTotalCompensado = mockHistorico.reduce((acc, item) => acc + item.valorCompensado, 0);
  const compensacoesConcluidas = mockHistorico.filter(item => item.status === 'Concluída').length;
  const compensacoesProcessando = mockHistorico.filter(item => item.status === 'Processando').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Histórico de Compensações</h1>
          <p className="text-muted-foreground">
            Consulte o histórico completo das suas compensações fiscais
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Compensado</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {valorTotalCompensado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor total compensado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{compensacoesConcluidas}</div>
            <p className="text-xs text-muted-foreground">
              Compensações finalizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Processamento</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{compensacoesProcessando}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando análise
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Processos</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockHistorico.length}</div>
            <p className="text-xs text-muted-foreground">
              Processos iniciados
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por protocolo..."
                value={filtros.busca}
                onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
                className="pl-10"
              />
            </div>
            
            <Select
              value={filtros.status}
              onValueChange={(value) => setFiltros({ ...filtros, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os status</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
                <SelectItem value="parcial">Parcial</SelectItem>
                <SelectItem value="processando">Processando</SelectItem>
                <SelectItem value="rejeitada">Rejeitada</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filtros.tipo}
              onValueChange={(value) => setFiltros({ ...filtros, tipo: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de tributo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os tipos</SelectItem>
                <SelectItem value="icms">ICMS</SelectItem>
                <SelectItem value="ipi">IPI</SelectItem>
                <SelectItem value="iss">ISS</SelectItem>
                <SelectItem value="pis">PIS</SelectItem>
                <SelectItem value="cofins">COFINS</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filtros.periodo}
              onValueChange={(value) => setFiltros({ ...filtros, periodo: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os períodos</SelectItem>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
                <SelectItem value="365">Último ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Histórico */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Compensações</CardTitle>
          <CardDescription>
            Lista completa das compensações realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockHistorico.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {getStatusIcon(item.status)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{item.protocolo}</h4>
                      <Badge variant="outline">{item.tipoDebito}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.dataCompensacao).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.observacoes}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">
                      {item.valorCompensado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      de {item.valorDebito.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
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