import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, FileText, Eye, Download, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const mockAuditorias = [
  {
    id: 1,
    titulo: 'Auditoria de Compensações - Q4 2024',
    tipo: 'Compensação',
    dataInicio: '2024-11-01',
    dataFim: '2024-11-30',
    status: 'Concluída',
    auditor: 'Sistema Blockchain',
    transacoes: 45,
    inconsistencias: 0,
    confiabilidade: 100,
    hash: 'a1b2c3d4e5f6...',
    observacoes: 'Todas as compensações validadas com sucesso',
  },
  {
    id: 2,
    titulo: 'Auditoria de Títulos de Crédito - Outubro 2024',
    tipo: 'Títulos',
    dataInicio: '2024-10-01',
    dataFim: '2024-10-31',
    status: 'Em Progresso',
    auditor: 'Sistema Blockchain',
    transacoes: 28,
    inconsistencias: 1,
    confiabilidade: 96.4,
    hash: 'b2c3d4e5f6g7...',
    observacoes: 'Uma pequena discrepância identificada no título TC-2024-018',
  },
  {
    id: 3,
    titulo: 'Auditoria Geral - Setembro 2024',
    tipo: 'Geral',
    dataInicio: '2024-09-01',
    dataFim: '2024-09-30',
    status: 'Concluída',
    auditor: 'Sistema Blockchain',
    transacoes: 67,
    inconsistencias: 0,
    confiabilidade: 100,
    hash: 'c3d4e5f6g7h8...',
    observacoes: 'Auditoria completa sem irregularidades',
  },
  {
    id: 4,
    titulo: 'Auditoria de Débitos Fiscais - Agosto 2024',
    tipo: 'Débitos',
    dataInicio: '2024-08-01',
    dataFim: '2024-08-31',
    status: 'Pendente',
    auditor: 'Sistema Blockchain',
    transacoes: 52,
    inconsistencias: 2,
    confiabilidade: 92.3,
    hash: 'd4e5f6g7h8i9...',
    observacoes: 'Aguardando validação de duas transações',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Concluída': return 'bg-green-100 text-green-800';
    case 'Em Progresso': return 'bg-blue-100 text-blue-800';
    case 'Pendente': return 'bg-yellow-100 text-yellow-800';
    case 'Falha': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Concluída': return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'Em Progresso': return <Clock className="h-4 w-4 text-blue-600" />;
    case 'Pendente': return <Clock className="h-4 w-4 text-yellow-600" />;
    case 'Falha': return <AlertTriangle className="h-4 w-4 text-red-600" />;
    default: return <Shield className="h-4 w-4 text-gray-600" />;
  }
};

const getConfiabilidadeColor = (valor: number) => {
  if (valor >= 98) return 'text-green-600';
  if (valor >= 90) return 'text-yellow-600';
  return 'text-red-600';
};

export default function AuditoriasPage() {
  const auditoriasCompletas = mockAuditorias.filter(a => a.status === 'Concluída').length;
  const auditoriasPendentes = mockAuditorias.filter(a => a.status === 'Pendente' || a.status === 'Em Progresso').length;
  const totalTransacoes = mockAuditorias.reduce((acc, a) => acc + a.transacoes, 0);
  const totalInconsistencias = mockAuditorias.reduce((acc, a) => acc + a.inconsistencias, 0);

  const handleNovaAuditoria = () => {
    console.log('Iniciando nova auditoria...');
    alert('Nova auditoria iniciada!');
  };

  const handleExportarRelatorio = (id: number) => {
    console.log(`Exportando relatório da auditoria ${id}...`);
    alert('Relatório exportado com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Auditoria Blockchain</h1>
          <p className="text-muted-foreground">
            Auditoria automática e verificação de integridade via blockchain
          </p>
        </div>
        <Button onClick={handleNovaAuditoria}>
          <Shield className="mr-2 h-4 w-4" />
          Nova Auditoria
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auditorias Completas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{auditoriasCompletas}</div>
            <p className="text-xs text-muted-foreground">
              Processos finalizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{auditoriasPendentes}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando conclusão
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transações Auditadas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransacoes}</div>
            <p className="text-xs text-muted-foreground">
              Total verificado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Integridade</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {((totalTransacoes - totalInconsistencias) / totalTransacoes * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Dados íntegros
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Informações sobre Blockchain */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Segurança Blockchain
          </CardTitle>
          <CardDescription>
            Suas transações são protegidas por tecnologia blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold">Imutabilidade</h4>
              <p className="text-sm text-muted-foreground">
                Registros não podem ser alterados após validação
              </p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold">Transparência</h4>
              <p className="text-sm text-muted-foreground">
                Todas as transações são verificáveis
              </p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-purple-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold">Rastreabilidade</h4>
              <p className="text-sm text-muted-foreground">
                Histórico completo de todas as operações
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Auditorias */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Auditorias</CardTitle>
          <CardDescription>
            Relatórios de auditoria e verificações de integridade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAuditorias.map((auditoria) => (
              <div key={auditoria.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {getStatusIcon(auditoria.status)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{auditoria.titulo}</h4>
                      <Badge variant="outline">{auditoria.tipo}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Período: {new Date(auditoria.dataInicio).toLocaleDateString('pt-BR')} - {new Date(auditoria.dataFim).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Auditor: {auditoria.auditor} • Hash: {auditoria.hash}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {auditoria.observacoes}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">Confiabilidade:</span>
                      <span className={`font-bold ${getConfiabilidadeColor(auditoria.confiabilidade)}`}>
                        {auditoria.confiabilidade}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {auditoria.transacoes} transações • {auditoria.inconsistencias} inconsistências
                    </p>
                    <Badge className={getStatusColor(auditoria.status)}>
                      {auditoria.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleExportarRelatorio(auditoria.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detalhes Técnicos */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes Técnicos da Blockchain</CardTitle>
          <CardDescription>
            Informações técnicas sobre a rede blockchain utilizada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Rede:</span>
                <span className="text-sm">Ethereum (Polygon)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Consenso:</span>
                <span className="text-sm">Proof of Stake</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Tempo de Bloco:</span>
                <span className="text-sm">2 segundos</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Gas Fee Médio:</span>
                <span className="text-sm">0.001 MATIC</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Smart Contract:</span>
                <span className="text-sm font-mono">0xa1b2...f9g8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Versão:</span>
                <span className="text-sm">v2.1.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Último Bloco:</span>
                <span className="text-sm">#45,892,341</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Status da Rede:</span>
                <Badge className="bg-green-100 text-green-800">Online</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}