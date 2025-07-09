import React, { useState, useEffect } from 'react';
import {
  Shield,
  Database,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Building2,
  FileText,
  Settings,
  BarChart3,
  TrendingUp,
  Eye,
  Download,
  Bell,
  MapPin,
  Loader2,
  ExternalLink,
  Search,
  Calendar,
  Target
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { governmentAPIsOrchestrator } from '@/services/government-apis-orchestrator.service';
import { simpleNotificationService } from '@/services/notification-simple.service';

const IntegracaoGovernamentalPage = () => {
  const [cnpjConsulta, setCnpjConsulta] = useState('');
  const [analisandoCompleto, setAnalisandoCompleto] = useState(false);
  const [ultimaAnalise, setUltimaAnalise] = useState<any>(null);
  const [historico, setHistorico] = useState<any[]>([]);
  const [estatisticas, setEstatisticas] = useState<any>(null);
  const [progressoAnalise, setProgressoAnalise] = useState(0);
  const [etapaAtual, setEtapaAtual] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    const hist = governmentAPIsOrchestrator.getHistoricoAnalises();
    const stats = governmentAPIsOrchestrator.getEstatisticas();
    
    setHistorico(hist);
    setEstatisticas(stats);
    
    if (hist.length > 0) {
      setUltimaAnalise(hist[0]);
    }
  };

  const formatarCNPJ = (cnpj: string) => {
    const limpo = cnpj.replace(/\D/g, '');
    return limpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const executarAnaliseCompleta = async () => {
    if (!cnpjConsulta || cnpjConsulta.length < 14) {
      simpleNotificationService.show({
        type: 'error',
        message: 'Por favor, informe um CNPJ válido'
      });
      return;
    }

    setAnalisandoCompleto(true);
    setProgressoAnalise(0);
    
    try {
      // Simular progresso da análise
      const etapas = [
        { progresso: 20, etapa: 'Consultando Receita Federal...' },
        { progresso: 40, etapa: 'Analisando débitos federais...' },
        { progresso: 60, etapa: 'Consultando SEFAZ multi-estado...' },
        { progresso: 80, etapa: 'Identificando oportunidades...' },
        { progresso: 90, etapa: 'Calculando resumo financeiro...' },
        { progresso: 100, etapa: 'Análise concluída!' }
      ];

      for (const etapa of etapas) {
        setEtapaAtual(etapa.etapa);
        setProgressoAnalise(etapa.progresso);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Executar análise real
      const resultado = await governmentAPIsOrchestrator.analiseCompleta(cnpjConsulta);
      
      setUltimaAnalise(resultado);
      carregarDados();
      
      simpleNotificationService.show({
        type: 'success',
        message: `Análise completa concluída! ${resultado.oportunidades.creditosRFB.length + resultado.oportunidades.creditosSEFAZ.length} oportunidades identificadas.`
      });

    } catch (error) {
      console.error('Erro na análise:', error);
      simpleNotificationService.show({
        type: 'error',
        message: 'Erro durante a análise das APIs governamentais'
      });
    } finally {
      setAnalisandoCompleto(false);
      setProgressoAnalise(0);
      setEtapaAtual('');
    }
  };

  const configurarMonitoramento = async () => {
    if (!cnpjConsulta) return;

    await governmentAPIsOrchestrator.configurarMonitoramento({
      cnpj: cnpjConsulta,
      frequencia: 'MENSAL',
      alertas: {
        novosDebitos: true,
        vencimentos: true,
        oportunidades: true,
        mudancasSituacao: true
      },
      ativo: true
    });
  };

  const exportarRelatorio = () => {
    if (!ultimaAnalise) return;

    const relatorio = [
      'RELATÓRIO DE INTEGRAÇÃO GOVERNAMENTAL',
      '',
      `Empresa: ${ultimaAnalise.razaoSocial}`,
      `CNPJ: ${formatarCNPJ(ultimaAnalise.cnpj)}`,
      `Data da Análise: ${new Date(ultimaAnalise.dataAnalise).toLocaleDateString('pt-BR')}`,
      '',
      'RESUMO FINANCEIRO',
      `Total de Créditos: R$ ${ultimaAnalise.resumoFinanceiro.totalCreditos.toLocaleString('pt-BR')}`,
      `Total de Débitos: R$ ${ultimaAnalise.resumoFinanceiro.totalDebitos.toLocaleString('pt-BR')}`,
      `Valor Recuperável: R$ ${ultimaAnalise.resumoFinanceiro.valorRecuperavel.toLocaleString('pt-BR')}`,
      `Economia Estimada: R$ ${ultimaAnalise.resumoFinanceiro.economiaEstimada.toLocaleString('pt-BR')}`,
      '',
      'OPORTUNIDADES IDENTIFICADAS',
      'Receita Federal:',
      ...ultimaAnalise.oportunidades.creditosRFB.map((op: any) => 
        `- ${op.tipo}: R$ ${op.valor.toLocaleString('pt-BR')} (${op.viabilidade}% viabilidade)`),
      '',
      'SEFAZ Estados:',
      ...ultimaAnalise.oportunidades.creditosSEFAZ.map((op: any) => 
        `- ${op.uf} - ${op.tipo}: R$ ${op.valor.toLocaleString('pt-BR')} (${op.viabilidade}% viabilidade)`),
      '',
      'RISCOS E ALERTAS',
      `Nível de Risco: ${ultimaAnalise.riscos.nivel}`,
      'Alertas:',
      ...ultimaAnalise.riscos.alertas.map((alerta: string) => `- ${alerta}`),
      '',
      'Recomendações:',
      ...ultimaAnalise.riscos.recomendacoes.map((rec: string) => `- ${rec}`)
    ].join('\n');

    const blob = new Blob([relatorio], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `integracao-governamental-${ultimaAnalise.cnpj}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Shield className="w-8 h-8 mr-3 text-blue-600" />
            Integração Governamental
          </h1>
          <p className="text-muted-foreground">
            Análise completa via APIs da Receita Federal e SEFAZ de todos os estados
          </p>
        </div>
        <Button
          onClick={carregarDados}
          variant="outline"
          className="flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Estatísticas Gerais */}
      {estatisticas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Empresas Analisadas</p>
                  <p className="text-2xl font-bold">{estatisticas.totalEmpresas}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Database className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total de Análises</p>
                  <p className="text-2xl font-bold">{estatisticas.totalAnalises}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Oportunidades</p>
                  <p className="text-2xl font-bold">{estatisticas.totalOportunidades}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Valor Recuperável</p>
                  <p className="text-xl font-bold">R$ {estatisticas.valorTotalRecuperavel.toLocaleString('pt-BR')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Consulta Nova */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2 text-blue-600" />
            Nova Análise Completa
          </CardTitle>
          <CardDescription>
            Consulte todas as APIs governamentais para um CNPJ específico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Digite o CNPJ (00.000.000/0000-00)"
                value={formatarCNPJ(cnpjConsulta)}
                onChange={(e) => setCnpjConsulta(e.target.value.replace(/\D/g, ''))}
                maxLength={18}
              />
            </div>
            <Button
              onClick={executarAnaliseCompleta}
              disabled={analisandoCompleto || !cnpjConsulta}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {analisandoCompleto ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Analisar
                </>
              )}
            </Button>
            <Button
              onClick={configurarMonitoramento}
              disabled={!cnpjConsulta}
              variant="outline"
            >
              <Bell className="w-4 h-4 mr-2" />
              Monitorar
            </Button>
          </div>

          {/* Progresso da Análise */}
          {analisandoCompleto && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{etapaAtual}</span>
                <span className="text-sm font-medium text-blue-600">{progressoAnalise}%</span>
              </div>
              <Progress value={progressoAnalise} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resultado da Última Análise */}
      {ultimaAnalise && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Última Análise - {ultimaAnalise.razaoSocial}
                </CardTitle>
                <CardDescription>
                  CNPJ: {formatarCNPJ(ultimaAnalise.cnpj)} • {new Date(ultimaAnalise.dataAnalise).toLocaleDateString('pt-BR')}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={exportarRelatorio}
                  variant="outline"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
                <Button
                  onClick={() => window.open(`/dashboard/recuperacao/resultados-analise?cnpj=${ultimaAnalise.cnpj}`, '_blank')}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Créditos
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Resumo Financeiro */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Total de Créditos</p>
                <p className="text-2xl font-bold text-green-700">
                  R$ {ultimaAnalise.resumoFinanceiro.totalCreditos.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-600 font-medium">Total de Débitos</p>
                <p className="text-2xl font-bold text-red-700">
                  R$ {ultimaAnalise.resumoFinanceiro.totalDebitos.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Valor Recuperável</p>
                <p className="text-2xl font-bold text-blue-700">
                  R$ {ultimaAnalise.resumoFinanceiro.valorRecuperavel.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Economia Estimada</p>
                <p className="text-2xl font-bold text-purple-700">
                  R$ {ultimaAnalise.resumoFinanceiro.economiaEstimada.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>

            {/* Oportunidades */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Receita Federal */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-blue-600" />
                  Receita Federal ({ultimaAnalise.oportunidades.creditosRFB.length})
                </h4>
                <div className="space-y-2">
                  {ultimaAnalise.oportunidades.creditosRFB.map((credito: any, index: number) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{credito.tipo}</p>
                          <p className="text-xs text-gray-600">{credito.descricao}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">R$ {credito.valor.toLocaleString('pt-BR')}</p>
                          <Badge variant="outline" className="text-xs">
                            {credito.viabilidade}% viável
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SEFAZ Estados */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-green-600" />
                  SEFAZ Estados ({ultimaAnalise.oportunidades.creditosSEFAZ.length})
                </h4>
                <div className="space-y-2">
                  {ultimaAnalise.oportunidades.creditosSEFAZ.map((credito: any, index: number) => (
                    <div key={index} className="p-3 bg-green-50 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{credito.uf} - {credito.tipo}</p>
                          <p className="text-xs text-gray-600">{credito.descricao}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">R$ {credito.valor.toLocaleString('pt-BR')}</p>
                          <Badge variant="outline" className="text-xs">
                            {credito.viabilidade}% viável
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Riscos e Alertas */}
            {ultimaAnalise.riscos.alertas.length > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
                  Riscos e Alertas - Nível {ultimaAnalise.riscos.nivel}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-yellow-800 mb-2">Alertas:</p>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {ultimaAnalise.riscos.alertas.map((alerta: string, index: number) => (
                        <li key={index}>• {alerta}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-yellow-800 mb-2">Recomendações:</p>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {ultimaAnalise.riscos.recomendacoes.map((rec: string, index: number) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Histórico */}
      {historico.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-600" />
              Histórico de Análises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Empresa</th>
                    <th className="text-left p-3">CNPJ</th>
                    <th className="text-left p-3">Data</th>
                    <th className="text-left p-3">Oportunidades</th>
                    <th className="text-left p-3">Valor Recuperável</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {historico.slice(0, 10).map((analise, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{analise.razaoSocial}</td>
                      <td className="p-3 font-mono text-sm">{formatarCNPJ(analise.cnpj)}</td>
                      <td className="p-3 text-sm">
                        {new Date(analise.dataAnalise).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">
                          {analise.oportunidades.creditosRFB.length + analise.oportunidades.creditosSEFAZ.length}
                        </Badge>
                      </td>
                      <td className="p-3 font-semibold text-green-600">
                        R$ {analise.resumoFinanceiro.valorRecuperavel.toLocaleString('pt-BR')}
                      </td>
                      <td className="p-3">
                        <Badge 
                          variant={analise.riscos.nivel === 'BAIXO' ? 'default' : 
                                  analise.riscos.nivel === 'MEDIO' ? 'secondary' : 'destructive'}
                        >
                          {analise.riscos.nivel}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setUltimaAnalise(analise)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Ver
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IntegracaoGovernamentalPage;