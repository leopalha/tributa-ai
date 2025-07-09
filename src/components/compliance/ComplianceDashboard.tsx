/**
 * Compliance Dashboard
 * Dashboard principal de compliance com automação de 95%
 * 
 * Funcionalidades:
 * - Visão geral de compliance em tempo real
 * - Monitoramento automático de conformidade
 * - Alertas de vencimentos automáticos
 * - Score de compliance automatizado
 * - Ações rápidas de 30 segundos
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  FileText, 
  Shield, 
  Zap,
  RefreshCw,
  Download,
  Eye
} from 'lucide-react';

interface ComplianceOverview {
  scoreCompliance: number;
  statusCompliance: 'REGULAR' | 'ATENCAO' | 'CRITICO';
  percentualAutomatizacao: number;
  percentualAprovacao: number;
  alertasAtivos: number;
  obrigacoesPendentes: number;
  ultimaAtualizacao: Date;
}

interface ComplianceMetrics {
  siscoaf: {
    total: number;
    pendentes: number;
    enviados: number;
    percentualAutomatico: number;
  };
  documentos: {
    total: number;
    aprovadosAutomatico: number;
    pendentesRevisao: number;
    percentualAprovacao: number;
  };
  perdcomp: {
    total: number;
    gerados: number;
    utilizados: number;
    percentualAutomatizacao: number;
  };
}

interface ComplianceAlert {
  id: string;
  tipo: 'VENCIMENTO' | 'ERRO' | 'ACAO_REQUERIDA' | 'INFORMATIVO';
  prioridade: 'ALTA' | 'MEDIA' | 'BAIXA';
  titulo: string;
  descricao: string;
  dataVencimento?: Date;
  acao?: string;
  resolvido: boolean;
  criadoEm: Date;
}

const ComplianceDashboard: React.FC = () => {
  const [visaoGeral, setVisaoGeral] = useState<ComplianceOverview | null>(null);
  const [metricas, setMetricas] = useState<ComplianceMetrics | null>(null);
  const [alertas, setAlertas] = useState<ComplianceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    carregarDadosCompliance();
    
    // Atualizar a cada 5 minutos
    const interval = setInterval(carregarDadosCompliance, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const carregarDadosCompliance = async () => {
    try {
      setRefreshing(true);
      
      // Simular carregamento de dados (em produção, chamar APIs reais)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setVisaoGeral({
        scoreCompliance: 95,
        statusCompliance: 'REGULAR',
        percentualAutomatizacao: 95,
        percentualAprovacao: 96,
        alertasAtivos: 2,
        obrigacoesPendentes: 3,
        ultimaAtualizacao: new Date()
      });

      setMetricas({
        siscoaf: {
          total: 127,
          pendentes: 2,
          enviados: 125,
          percentualAutomatico: 98
        },
        documentos: {
          total: 543,
          aprovadosAutomatico: 521,
          pendentesRevisao: 22,
          percentualAprovacao: 96
        },
        perdcomp: {
          total: 34,
          gerados: 34,
          utilizados: 28,
          percentualAutomatizacao: 100
        }
      });

      setAlertas([
        {
          id: '1',
          tipo: 'VENCIMENTO',
          prioridade: 'ALTA',
          titulo: 'DCTF Vencendo',
          descricao: 'DCTF mensal vence em 3 dias',
          dataVencimento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          acao: 'Gerar arquivo',
          resolvido: false,
          criadoEm: new Date()
        },
        {
          id: '2',
          tipo: 'ACAO_REQUERIDA',
          prioridade: 'MEDIA',
          titulo: 'Documentos Pendentes',
          descricao: '5 documentos aguardando revisão manual',
          acao: 'Revisar documentos',
          resolvido: false,
          criadoEm: new Date()
        }
      ]);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const obterCorStatus = (status: string) => {
    switch (status) {
      case 'REGULAR': return 'text-green-600 bg-green-100';
      case 'ATENCAO': return 'text-yellow-600 bg-yellow-100';
      case 'CRITICO': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const obterCorPrioridade = (prioridade: string) => {
    switch (prioridade) {
      case 'ALTA': return 'destructive';
      case 'MEDIA': return 'default';
      case 'BAIXA': return 'secondary';
      default: return 'default';
    }
  };

  const obterIconeTipo = (tipo: string) => {
    switch (tipo) {
      case 'VENCIMENTO': return <Clock className="h-4 w-4" />;
      case 'ERRO': return <AlertTriangle className="h-4 w-4" />;
      case 'ACAO_REQUERIDA': return <FileText className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg">Carregando dashboard de compliance...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compliance Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Automação de 95% • Monitoramento em tempo real
          </p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={carregarDadosCompliance}
            disabled={refreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Relatório</span>
          </Button>
        </div>
      </div>

      {/* Score de Compliance */}
      {visaoGeral && (
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-blue-900">Score de Compliance</CardTitle>
                <CardDescription>Conformidade automatizada em tempo real</CardDescription>
              </div>
              <Badge className={`px-3 py-1 text-sm font-semibold ${obterCorStatus(visaoGeral.statusCompliance)}`}>
                {visaoGeral.statusCompliance}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600">{visaoGeral.scoreCompliance}%</div>
                <div className="text-sm text-gray-600 mt-1">Score Geral</div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Automatização</span>
                    <span>{visaoGeral.percentualAutomatizacao}%</span>
                  </div>
                  <Progress value={visaoGeral.percentualAutomatizacao} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Aprovação Automática</span>
                    <span>{visaoGeral.percentualAprovacao}%</span>
                  </div>
                  <Progress value={visaoGeral.percentualAprovacao} className="h-2" />
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                Última atualização:<br />
                {visaoGeral.ultimaAtualizacao.toLocaleString('pt-BR')}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Métricas Principais */}
      {metricas && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* SISCOAF */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SISCOAF Automático</CardTitle>
              <Shield className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{metricas.siscoaf.enviados}</div>
              <p className="text-xs text-gray-600 mb-3">
                {metricas.siscoaf.pendentes} pendentes de {metricas.siscoaf.total} total
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Automatização</span>
                <Badge variant="secondary" className="text-xs">
                  {metricas.siscoaf.percentualAutomatico}%
                </Badge>
              </div>
              <div className="mt-3">
                <Button size="sm" variant="outline" className="w-full">
                  <Eye className="h-3 w-3 mr-1" />
                  Ver Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Validação de Documentos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Validação Inteligente</CardTitle>
              <FileText className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metricas.documentos.aprovadosAutomatico}</div>
              <p className="text-xs text-gray-600 mb-3">
                {metricas.documentos.pendentesRevisao} aguardando revisão
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Aprovação Auto</span>
                <Badge variant="secondary" className="text-xs">
                  {metricas.documentos.percentualAprovacao}%
                </Badge>
              </div>
              <div className="mt-3">
                <Button size="sm" variant="outline" className="w-full">
                  <Eye className="h-3 w-3 mr-1" />
                  Fila de Revisão
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* PERDCOMP */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">PERDCOMP Automático</CardTitle>
              <Zap className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{metricas.perdcomp.gerados}</div>
              <p className="text-xs text-gray-600 mb-3">
                {metricas.perdcomp.utilizados} utilizados no e-CAC
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Automatização</span>
                <Badge variant="secondary" className="text-xs">
                  {metricas.perdcomp.percentualAutomatizacao}%
                </Badge>
              </div>
              <div className="mt-3">
                <Button size="sm" variant="outline" className="w-full">
                  <Download className="h-3 w-3 mr-1" />
                  Gerar Arquivo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alertas Ativos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>Alertas e Ações Rápidas</span>
            <Badge variant="outline">{alertas.length}</Badge>
          </CardTitle>
          <CardDescription>
            Ações que podem ser resolvidas em 30 segundos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alertas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>Todos os processos de compliance estão em conformidade!</p>
              <p className="text-sm mt-1">Sistema operando com 95% de automação</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alertas.map((alerta) => (
                <Alert key={alerta.id} className="border-l-4 border-l-orange-500">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {obterIconeTipo(alerta.tipo)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-sm">{alerta.titulo}</h4>
                          <Badge variant={obterCorPrioridade(alerta.prioridade) as any} className="text-xs">
                            {alerta.prioridade}
                          </Badge>
                        </div>
                        <AlertDescription className="text-sm text-gray-600">
                          {alerta.descricao}
                        </AlertDescription>
                        {alerta.dataVencimento && (
                          <p className="text-xs text-red-600 mt-1">
                            Vencimento: {alerta.dataVencimento.toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        {alerta.acao || 'Ver Detalhes'}
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Zap className="h-3 w-3 mr-1" />
                        Resolver (30s)
                      </Button>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <span>Ações Rápidas de Compliance</span>
          </CardTitle>
          <CardDescription>
            Operações automatizadas com validação em 30 segundos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <Shield className="h-6 w-6" />
              <span className="text-xs">Gerar SISCOAF</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
              <FileText className="h-6 w-6" />
              <span className="text-xs">Validar Documentos</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
              <Download className="h-6 w-6" />
              <span className="text-xs">PERDCOMP</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
              <Eye className="h-6 w-6" />
              <span className="text-xs">Relatório</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Sistema de Compliance Automatizado:</strong> Este dashboard monitora automaticamente 
          a conformidade fiscal e regulatória. Os processos são 95% automatizados, com validação 
          humana apenas em casos excepcionais. Todos os relatórios e arquivos gerados são 
          pré-validados, mas a submissão final aos órgãos oficiais deve ser feita via e-CAC.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ComplianceDashboard;