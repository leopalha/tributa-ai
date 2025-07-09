import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar, Filter, BarChart, DollarSign, TrendingUp } from 'lucide-react';

const mockDados = {
  totalCompensado: 1250000.00,
  economiaGerada: 187500.00,
  compensacoes: 45,
  mediaMensal: 208333.33,
  percentualEconomia: 15.0,
  tendencia: 'alta',
};

const mockCompensacoes = [
  {
    id: 1,
    periodo: '11/2024',
    valorDebito: 125000.00,
    valorCredito: 125000.00,
    valorCompensado: 125000.00,
    economia: 18750.00,
    tipoDebito: 'ICMS',
    tipoCredito: 'ICMS',
    status: 'Concluída',
    data: '2024-11-15',
  },
  {
    id: 2,
    periodo: '10/2024',
    valorDebito: 87000.00,
    valorCredito: 100000.00,
    valorCompensado: 87000.00,
    economia: 13050.00,
    tipoDebito: 'IPI',
    tipoCredito: 'IPI',
    status: 'Concluída',
    data: '2024-10-28',
  },
  {
    id: 3,
    periodo: '09/2024',
    valorDebito: 65000.00,
    valorCredito: 65000.00,
    valorCompensado: 65000.00,
    economia: 9750.00,
    tipoDebito: 'ISS',
    tipoCredito: 'ISS',
    status: 'Concluída',
    data: '2024-09-20',
  },
  {
    id: 4,
    periodo: '08/2024',
    valorDebito: 95000.00,
    valorCredito: 95000.00,
    valorCompensado: 95000.00,
    economia: 14250.00,
    tipoDebito: 'PIS/COFINS',
    tipoCredito: 'PIS/COFINS',
    status: 'Concluída',
    data: '2024-08-15',
  },
];

export default function CompensacoesPage() {
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    tipoTributo: '',
    status: '',
  });

  const handleExportarRelatorio = () => {
    // Simular exportação de relatório
    console.log('Exportando relatório de compensações...');
    alert('Relatório exportado com sucesso!');
  };

  const handleGerarRelatorio = () => {
    // Simular geração de relatório
    console.log('Gerando relatório personalizado...', filtros);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Relatório de Compensações</h1>
          <p className="text-muted-foreground">
            Análise detalhada das compensações fiscais realizadas
          </p>
        </div>
        <Button onClick={handleExportarRelatorio}>
          <Download className="mr-2 h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Compensado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockDados.totalCompensado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor total compensado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economia Gerada</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockDados.economiaGerada.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockDados.percentualEconomia}% de economia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compensações</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDados.compensacoes}</div>
            <p className="text-xs text-muted-foreground">
              Processos concluídos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Mensal</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockDados.mediaMensal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              Compensação por mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros do Relatório
          </CardTitle>
          <CardDescription>
            Configure os filtros para gerar relatórios personalizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data Início</Label>
              <Input
                id="dataInicio"
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFim">Data Fim</Label>
              <Input
                id="dataFim"
                type="date"
                value={filtros.dataFim}
                onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoTributo">Tipo de Tributo</Label>
              <Select
                value={filtros.tipoTributo}
                onValueChange={(value) => setFiltros({ ...filtros, tipoTributo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  <SelectItem value="icms">ICMS</SelectItem>
                  <SelectItem value="ipi">IPI</SelectItem>
                  <SelectItem value="iss">ISS</SelectItem>
                  <SelectItem value="pis">PIS</SelectItem>
                  <SelectItem value="cofins">COFINS</SelectItem>
                  <SelectItem value="pis-cofins">PIS/COFINS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={filtros.status}
                onValueChange={(value) => setFiltros({ ...filtros, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os status</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                  <SelectItem value="parcial">Parcial</SelectItem>
                  <SelectItem value="processando">Processando</SelectItem>
                  <SelectItem value="rejeitada">Rejeitada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={handleGerarRelatorio}>
              <BarChart className="mr-2 h-4 w-4" />
              Gerar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Tendência */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução das Compensações</CardTitle>
          <CardDescription>
            Acompanhe a evolução mensal das compensações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Gráfico de evolução das compensações
              </p>
              <p className="text-sm text-muted-foreground">
                (Implementar com biblioteca de gráficos)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalhamento das Compensações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalhamento das Compensações
          </CardTitle>
          <CardDescription>
            Lista detalhada das compensações realizadas no período
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCompensacoes.map((compensacao) => (
              <div key={compensacao.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">Compensação {compensacao.periodo}</h4>
                      <Badge variant="outline">{compensacao.tipoDebito}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Processada em: {new Date(compensacao.data).toLocaleDateString('pt-BR')}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-muted-foreground">
                        Débito: {compensacao.valorDebito.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Crédito: {compensacao.valorCredito.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {compensacao.valorCompensado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <p className="text-sm text-green-600">
                      Economia: {compensacao.economia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <Badge className="bg-green-100 text-green-800">
                      {compensacao.status}
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

      {/* Resumo Analítico */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Analítico</CardTitle>
          <CardDescription>
            Análise consolidada do período
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold">Tipos de Tributo</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">ICMS</span>
                  <span className="font-medium">R$ 450.000,00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">IPI</span>
                  <span className="font-medium">R$ 320.000,00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">ISS</span>
                  <span className="font-medium">R$ 285.000,00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">PIS/COFINS</span>
                  <span className="font-medium">R$ 195.000,00</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Taxa de Sucesso</span>
                  <span className="font-medium text-green-600">96%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tempo Médio</span>
                  <span className="font-medium">12 dias</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Economia Média</span>
                  <span className="font-medium text-green-600">15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">ROI</span>
                  <span className="font-medium text-green-600">245%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}