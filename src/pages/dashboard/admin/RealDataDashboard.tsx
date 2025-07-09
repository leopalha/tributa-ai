import React, { useState, useEffect } from 'react';
import {
  Database,
  Brain,
  TrendingUp,
  Building2,
  DollarSign,
  Activity,
  Search,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Zap,
  BarChart3,
  Users,
  Globe,
  Settings,
  Play,
  Pause,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { realDataService } from '@/services/real-data.service';
import { cnpjService } from '@/services/cnpj.service';

interface EmpresaReal {
  cnpj: string;
  razaoSocial: string;
  receitaAnual: number;
  debitosPendentes: number;
  creditosDisponiveis: number;
  dataColeta: string;
  status: 'coletando' | 'processando' | 'concluido' | 'erro';
}

const RealDataDashboard = () => {
  const [estatisticas, setEstatisticas] = useState<any>(null);
  const [empresas, setEmpresas] = useState<EmpresaReal[]>([]);
  const [coletaAtiva, setColetaAtiva] = useState(false);
  const [treinamentoAtivo, setTreinamentoAtivo] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [cnpjInput, setCnpjInput] = useState('');

  useEffect(() => {
    carregarEstatisticas();
    carregarEmpresas();
  }, []);

  const carregarEstatisticas = () => {
    const stats = realDataService.obterEstatisticas();
    setEstatisticas(stats);
  };

  const carregarEmpresas = () => {
    const empresasLocal = JSON.parse(localStorage.getItem('empresas_reais') || '[]');
    setEmpresas(empresasLocal);
  };

  const adicionarLog = (mensagem: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${mensagem}`, ...prev.slice(0, 9)]);
  };

  const coletarDadosEmpresa = async (cnpj: string) => {
    try {
      setColetaAtiva(true);
      adicionarLog(`Iniciando coleta para CNPJ: ${cnpj}`);

      // Adicionar empresa com status coletando
      const novaEmpresa: EmpresaReal = {
        cnpj,
        razaoSocial: `Empresa ${cnpj.slice(-4)}`,
        receitaAnual: 0,
        debitosPendentes: 0,
        creditosDisponiveis: 0,
        dataColeta: new Date().toISOString(),
        status: 'coletando',
      };

      setEmpresas(prev => [novaEmpresa, ...prev]);

      // Simular coleta de dados
      await new Promise(resolve => setTimeout(resolve, 2000));

      const dadosEmpresa = await realDataService.coletarDadosEmpresa(cnpj);

      // Buscar dados complementares
      const dadosComplementares = await cnpjService.buscarEmpresa(cnpj);

      const empresaCompleta: EmpresaReal = {
        cnpj,
        razaoSocial: dadosComplementares?.razaoSocial || dadosEmpresa.razaoSocial,
        receitaAnual: dadosEmpresa.receitaAnual,
        debitosPendentes: dadosEmpresa.debitosPendentes,
        creditosDisponiveis: dadosEmpresa.creditosDisponiveis,
        dataColeta: dadosEmpresa.dataColeta,
        status: 'processando',
      };

      setEmpresas(prev => prev.map(e => (e.cnpj === cnpj ? empresaCompleta : e)));
      adicionarLog(`Dados coletados: ${empresaCompleta.razaoSocial}`);

      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 1500));

      setEmpresas(prev => prev.map(e => (e.cnpj === cnpj ? { ...e, status: 'concluido' } : e)));
      adicionarLog(`Processamento concluído para: ${empresaCompleta.razaoSocial}`);

      // Salvar no localStorage
      const empresasLocal = JSON.parse(localStorage.getItem('empresas_reais') || '[]');
      empresasLocal.push(empresaCompleta);
      localStorage.setItem('empresas_reais', JSON.stringify(empresasLocal));

      // Treinar modelo automaticamente
      await treinarModelo(empresaCompleta);

      carregarEstatisticas();
    } catch (error) {
      console.error('Erro ao coletar dados:', error);
      setEmpresas(prev => prev.map(e => (e.cnpj === cnpj ? { ...e, status: 'erro' } : e)));
      adicionarLog(`Erro ao coletar dados para CNPJ: ${cnpj}`);
    } finally {
      setColetaAtiva(false);
    }
  };

  const treinarModelo = async (empresa: EmpresaReal) => {
    try {
      setTreinamentoAtivo(true);
      adicionarLog('Iniciando treinamento do modelo ML...');

      // Simular treinamento
      for (let i = 0; i <= 100; i += 10) {
        setProgresso(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      await realDataService.treinarModelo(empresa);

      adicionarLog('Modelo treinado com sucesso!');
      setProgresso(0);
    } catch (error) {
      console.error('Erro ao treinar modelo:', error);
      adicionarLog('Erro no treinamento do modelo');
    } finally {
      setTreinamentoAtivo(false);
    }
  };

  const coletarDadosLote = async () => {
    const cnpjsParaColeta = [
      '11222333000181',
      '11222333000262',
      '11222333000343',
      '11222333000424',
      '11222333000505',
    ];

    setColetaAtiva(true);
    adicionarLog(`Iniciando coleta em lote para ${cnpjsParaColeta.length} empresas`);

    for (const cnpj of cnpjsParaColeta) {
      await coletarDadosEmpresa(cnpj);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    adicionarLog('Coleta em lote finalizada!');
    setColetaAtiva(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cnpjInput.length === 14) {
      coletarDadosEmpresa(cnpjInput);
      setCnpjInput('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'coletando':
        return 'text-blue-600 bg-blue-50';
      case 'processando':
        return 'text-yellow-600 bg-yellow-50';
      case 'concluido':
        return 'text-green-600 bg-green-50';
      case 'erro':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'coletando':
        return <Search className="w-4 h-4" />;
      case 'processando':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'concluido':
        return <CheckCircle className="w-4 h-4" />;
      case 'erro':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  const exportarDados = () => {
    const dados = {
      empresas,
      estatisticas,
      dataExportacao: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(dados, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tributa-ai-dados-reais-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    adicionarLog('Dados exportados com sucesso!');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Database className="w-8 h-8 mr-3 text-blue-600" />
            Banco de Dados Real - Tributa.AI
          </h1>
          <p className="text-gray-600 mt-1">
            Coleta automatizada de dados de empresas brasileiras + Machine Learning
          </p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={exportarDados} variant="outline" className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Exportar Dados
          </Button>
          <Button
            onClick={coletarDadosLote}
            disabled={coletaAtiva}
            className="flex items-center bg-blue-600 hover:bg-blue-700"
          >
            {coletaAtiva ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Coletando...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Coleta em Lote
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Empresas</CardTitle>
            <Building2 className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {estatisticas?.totalEmpresas || 0}
            </div>
            <p className="text-xs text-gray-500">Empresas no banco de dados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Precisão do Modelo</CardTitle>
            <Brain className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {((estatisticas?.modeloPrecisao || 0) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500">Precisão do Machine Learning</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Valor Total Créditos
            </CardTitle>
            <DollarSign className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              R${' '}
              {(empresas.reduce((acc, emp) => acc + emp.creditosDisponiveis, 0) / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-gray-500">Créditos identificados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Status Sistema</CardTitle>
            <Activity className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {coletaAtiva || treinamentoAtivo ? 'ATIVO' : 'AGUARDANDO'}
            </div>
            <p className="text-xs text-gray-500">
              {coletaAtiva
                ? 'Coletando dados...'
                : treinamentoAtivo
                  ? 'Treinando modelo...'
                  : 'Sistema pronto'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Área de Coleta */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coleta Manual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2 text-blue-600" />
              Coleta Manual de Dados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNPJ da Empresa
                </label>
                <input
                  type="text"
                  value={cnpjInput}
                  onChange={e => setCnpjInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Digite o CNPJ (apenas números)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={14}
                />
              </div>
              <Button
                type="submit"
                disabled={coletaAtiva || cnpjInput.length !== 14}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {coletaAtiva ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Coletando...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 mr-2" />
                    Coletar Dados
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Treinamento ML */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-green-600" />
              Machine Learning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Status do Treinamento</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    treinamentoAtivo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {treinamentoAtivo ? 'Treinando' : 'Aguardando'}
                </span>
              </div>

              {treinamentoAtivo && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Progresso</span>
                    <span className="text-sm font-medium">{progresso}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progresso}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-600">
                <p>
                  <strong>Precisão Atual:</strong>{' '}
                  {((estatisticas?.modeloPrecisao || 0) * 100).toFixed(1)}%
                </p>
                <p>
                  <strong>Dados de Treino:</strong> {empresas.length} empresas
                </p>
                <p>
                  <strong>Última Atualização:</strong>{' '}
                  {estatisticas?.ultimaAtualizacao
                    ? new Date(estatisticas.ultimaAtualizacao).toLocaleString()
                    : 'Nunca'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logs e Empresas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logs do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-purple-600" />
              Logs do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className="text-sm font-mono text-gray-700 bg-gray-50 p-2 rounded"
                  >
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-sm text-center py-8">
                  Nenhum log disponível. Inicie uma coleta para ver os logs.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Empresas Coletadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-orange-600" />
              Empresas Coletadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {empresas.length > 0 ? (
                empresas.map((empresa, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{empresa.razaoSocial}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(empresa.status)}`}
                        >
                          {getStatusIcon(empresa.status)}
                          <span className="ml-1 capitalize">{empresa.status}</span>
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        CNPJ: {empresa.cnpj} | Créditos: R${' '}
                        {empresa.creditosDisponiveis.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-sm text-center py-8">
                  Nenhuma empresa coletada ainda. Use o formulário acima para coletar dados.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealDataDashboard;
