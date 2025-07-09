import React, { useState } from 'react';
import { useEmpresa } from '@/providers/EmpresaProvider';
import { useRecuperacaoCreditos } from '@/hooks/use-recuperacao-creditos';
import { FileUploadZone } from '@/components/recuperacao-creditos/FileUploadZone';
import { EmpresaConfig } from '@/components/recuperacao-creditos/EmpresaConfig';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DollarSign,
  RefreshCw,
  Download,
  TrendingUp,
  Clock,
  CheckCircle,
  Target,
  Activity,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

export default function RecuperacaoCreditosPage() {
  const { empresaAtual } = useEmpresa();
  const [activeTab, setActiveTab] = useState('dados');
  const [tipoAnalise, setTipoAnalise] = useState('completa');
  const [periodoInicial, setPeriodoInicial] = useState('');
  const [periodoFinal, setPeriodoFinal] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('DCTF');
  const [periodoDocumento, setPeriodoDocumento] = useState('');

  const {
    loading,
    creditos,
    processos,
    arquivos,
    estatisticas,
    analiseAtual,
    uploadProgress,
    uploadArquivo,
    iniciarAnalise,
    iniciarProcesso,
    deletarArquivo,
    gerarRelatorio,
    tokenizarCredito,
  } = useRecuperacaoCreditos(empresaAtual?.id);

  // Dados mockados para demonstração quando não há dados reais
  const mockStats = estatisticas || {
    totalIdentificado: 2700000,
    emProcesso: 2050000,
    recuperado: 450000,
    taxaSucesso: 87,
    tempoMedio: '5.2 meses',
    processosAtivos: 15,
    creditosPorTipo: {},
    performanceMensal: [],
  };

  const mockCreditos =
    creditos.length > 0
      ? creditos
      : [
          {
            id: '1',
            tipo: 'PIS/COFINS' as const,
            periodo: '2020-2023',
            valor: 850000,
            probabilidade: 95,
            status: 'Identificado' as const,
            prazoRecuperacao: '3-6 meses',
            complexidade: 'Baixa' as const,
            documentosNecessarios: ['DCTF', 'EFD-Contribuições', 'Livro Caixa'],
            descricao: 'Créditos de PIS/COFINS sobre insumos não aproveitados adequadamente',
            empresaId: empresaAtual?.id || '1',
            dataIdentificacao: new Date(),
          },
          {
            id: '2',
            tipo: 'ICMS' as const,
            periodo: '2021-2023',
            valor: 1200000,
            probabilidade: 78,
            status: 'Em análise' as const,
            prazoRecuperacao: '6-12 meses',
            complexidade: 'Média' as const,
            documentosNecessarios: ['Livros Fiscais', 'SPED Fiscal', 'GIA'],
            descricao: 'Créditos acumulados de ICMS em operações interestaduais',
            empresaId: empresaAtual?.id || '1',
            dataIdentificacao: new Date(),
          },
        ];

  const mockProcessos =
    processos.length > 0
      ? processos
      : [
          {
            id: 'PROC001',
            tipo: 'PIS/COFINS',
            valor: 850000,
            status: 'Em andamento' as const,
            protocolo: 'RF-2024-001234',
            dataInicio: '15/01/2024',
            prazoEstimado: '15/04/2024',
            etapaAtual: 'Análise documental',
            progresso: 65,
            proximaAcao: 'Aguardando resposta da Receita Federal',
            responsavel: 'João Silva - Especialista Tributário',
            empresaId: empresaAtual?.id || '1',
            creditoId: '1',
            documentos: [],
          },
        ];

  const handleFileUpload = async (files: File[]) => {
    if (!empresaAtual) {
      toast.error('Configure os dados da empresa primeiro');
      return;
    }

    if (!periodoDocumento) {
      toast.error('Informe o período do documento');
      return;
    }

    try {
      for (const file of files) {
        await uploadArquivo(file, tipoDocumento, periodoDocumento);
      }
    } catch (error) {
      console.error('Erro no upload:', error);
    }
  };

  const handleIniciarAnalise = async () => {
    if (!empresaAtual) {
      toast.error('Configure os dados da empresa primeiro');
      return;
    }

    if (arquivos.length === 0) {
      toast.error('Envie pelo menos um arquivo fiscal primeiro');
      return;
    }

    try {
      await iniciarAnalise(tipoAnalise as any, periodoInicial, periodoFinal);
    } catch (error) {
      console.error('Erro ao iniciar análise:', error);
    }
  };

  const handleIniciarProcesso = async (creditoId: string) => {
    try {
      await iniciarProcesso(creditoId);
    } catch (error) {
      console.error('Erro ao iniciar processo:', error);
    }
  };

  const handleGerarRelatorio = async (tipo: 'completo' | 'executivo' | 'planilha') => {
    try {
      await gerarRelatorio(tipo);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-blue-600" />
            Recuperação de Créditos
          </h1>
          <p className="text-muted-foreground mt-2">
            Sistema inteligente para identificação e recuperação de créditos tributários
          </p>
          {empresaAtual ? (
            <p className="text-sm text-blue-600 mt-1 font-medium">
              🏢 {empresaAtual.nome} • {empresaAtual.cnpj}
            </p>
          ) : (
            <p className="text-sm text-amber-600 mt-1 font-medium">
              ⚠️ Configure os dados da sua empresa para começar
            </p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            {mockStats.processosAtivos} processos ativos
          </span>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas Cards - Estilo padronizado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Identificado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-800">
              R$ {(mockStats.totalIdentificado / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-blue-600 mt-1">Potencial de recuperação</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Em Processo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-800">
              R$ {(mockStats.emProcesso / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-orange-600 mt-1">Processos em andamento</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Recuperado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-800">
              R$ {(mockStats.recuperado / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-green-600 mt-1">Já recuperado</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Taxa de Sucesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-800">{mockStats.taxaSucesso}%</p>
            <p className="text-xs text-purple-600 mt-1">Aprovações obtidas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-pink-50 to-pink-100 border-pink-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-pink-700 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Tempo Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-pink-800">{mockStats.tempoMedio}</p>
            <p className="text-xs text-pink-600 mt-1">Para recuperação</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-cyan-50 to-cyan-100 border-cyan-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-cyan-700 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Processos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-cyan-800">{mockStats.processosAtivos}</p>
            <p className="text-xs text-cyan-600 mt-1">Em acompanhamento</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Principais */}
      <div className="space-y-6">
        <div className="flex border-b overflow-x-auto">
          {[
            { id: 'dados', label: 'Dados Fiscais', icon: '📁' },
            { id: 'analise', label: 'Análise IA', icon: '🤖' },
            { id: 'creditos', label: 'Créditos', icon: '💰' },
            { id: 'processos', label: 'Processos', icon: '📋' },
            { id: 'marketplace', label: 'Marketplace', icon: '🏪' },
            { id: 'relatorios', label: 'Relatórios', icon: '📊' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 whitespace-nowrap border-b-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Dados Fiscais */}
        {activeTab === 'dados' && (
          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-bold mb-4">📁 Inserir Dados Fiscais</h2>
            <p className="text-gray-600 mb-6">
              Faça upload de declarações e obrigações fiscais para análise
            </p>

            {/* Configuração da Empresa */}
            <div className="mb-6">
              <EmpresaConfig />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Período de Análise</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      className="p-2 border rounded-lg"
                      value={periodoInicial}
                      onChange={e => setPeriodoInicial(e.target.value)}
                    />
                    <input
                      type="date"
                      className="p-2 border rounded-lg"
                      value={periodoFinal}
                      onChange={e => setPeriodoFinal(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tipo de Documento</label>
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={tipoDocumento}
                    onChange={e => setTipoDocumento(e.target.value)}
                  >
                    <option value="DCTF">DCTF</option>
                    <option value="EFD-Contribuições">EFD-Contribuições</option>
                    <option value="SPED Fiscal">SPED Fiscal</option>
                    <option value="GIA">GIA</option>
                    <option value="ECF">ECF</option>
                    <option value="LALUR">LALUR</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Período do Documento</label>
                  <input
                    type="text"
                    placeholder="Ex: 01/2023 a 12/2023"
                    className="w-full p-2 border rounded-lg"
                    value={periodoDocumento}
                    onChange={e => setPeriodoDocumento(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <FileUploadZone
                  onFileSelect={handleFileUpload}
                  loading={loading}
                  progress={uploadProgress}
                />
              </div>
            </div>

            {/* Lista de arquivos enviados */}
            {arquivos.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">Arquivos Enviados ({arquivos.length})</h3>
                <div className="space-y-2">
                  {arquivos.map(arquivo => (
                    <div
                      key={arquivo.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center">
                          📄
                        </div>
                        <div>
                          <p className="font-medium">{arquivo.nome}</p>
                          <p className="text-sm text-gray-600">
                            {arquivo.tipoDocumento} • {arquivo.periodo} •{' '}
                            {(arquivo.tamanho / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            arquivo.status === 'Processado'
                              ? 'bg-green-100 text-green-800'
                              : arquivo.status === 'Processando'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {arquivo.status}
                        </span>
                        <button
                          onClick={() => deletarArquivo(arquivo.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t flex justify-between items-center">
              <div className="text-sm text-gray-600">{arquivos.length} arquivo(s) enviado(s)</div>
              <button
                onClick={handleIniciarAnalise}
                disabled={loading || arquivos.length === 0}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                ⚡ Iniciar Análise
              </button>
            </div>
          </div>
        )}

        {/* Tab: Análise IA */}
        {activeTab === 'analise' && (
          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-bold mb-4">🤖 Análise Automática com IA</h2>
            <p className="text-gray-600 mb-6">
              Inteligência artificial analisa seus dados e identifica oportunidades
            </p>

            {analiseAtual ? (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Status da Análise</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{analiseAtual.etapaAtual}</span>
                        <span>{analiseAtual.progresso}%</span>
                      </div>
                      <div className="bg-blue-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${analiseAtual.progresso}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-blue-700">
                      {analiseAtual.status === 'Processando' && '⚡ Processando...'}
                      {analiseAtual.status === 'Concluida' && '✅ Concluída'}
                      {analiseAtual.status === 'Erro' && '❌ Erro'}
                    </div>
                  </div>
                </div>

                {analiseAtual.status === 'Concluida' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {analiseAtual.creditosEncontrados}
                      </p>
                      <p className="text-sm text-green-700">Créditos Encontrados</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        R$ {(analiseAtual.valorTotal / 1000000).toFixed(1)}M
                      </p>
                      <p className="text-sm text-blue-700">Valor Total</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {analiseAtual.detalhes.documentosAnalisados}
                      </p>
                      <p className="text-sm text-purple-700">Documentos Analisados</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  🤖
                </div>
                <p className="text-gray-600 mb-4">Nenhuma análise em andamento</p>
                <button
                  onClick={handleIniciarAnalise}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Iniciar Nova Análise
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab: Créditos Identificados */}
        {activeTab === 'creditos' && (
          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-bold mb-4">💰 Créditos Identificados</h2>
            <p className="text-gray-600 mb-6">
              Oportunidades de recuperação encontradas pela análise
            </p>

            <div className="space-y-4">
              {mockCreditos.map(credito => (
                <div
                  key={credito.id}
                  className="border-l-4 border-l-blue-500 bg-gray-50 p-6 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {credito.tipo}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            credito.status === 'Validado'
                              ? 'bg-green-100 text-green-800'
                              : credito.status === 'Identificado'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {credito.status}
                        </span>
                        <span className="text-sm text-gray-600">Período: {credito.periodo}</span>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg">
                          R$ {credito.valor.toLocaleString('pt-BR')}
                        </h3>
                        <p className="text-sm text-gray-600">{credito.descricao}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Probabilidade:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="bg-gray-200 rounded-full h-2 flex-1">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${credito.probabilidade}%` }}
                              />
                            </div>
                            <span className="font-medium">{credito.probabilidade}%</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Prazo:</span>
                          <p className="font-medium">{credito.prazoRecuperacao}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Complexidade:</span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              credito.complexidade === 'Baixa'
                                ? 'bg-green-100 text-green-800'
                                : credito.complexidade === 'Média'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {credito.complexidade}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-gray-600 text-sm">Documentos necessários:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {credito.documentosNecessarios.map((doc, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs"
                            >
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-6">
                      <button
                        onClick={() => handleIniciarProcesso(credito.id)}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                      >
                        ➡️ Iniciar Recuperação
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                        👁️ Ver Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Processos */}
        {activeTab === 'processos' && (
          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-bold mb-4">📋 Processos de Recuperação</h2>
            <p className="text-gray-600 mb-6">
              Acompanhe o andamento dos seus processos de recuperação
            </p>

            <div className="space-y-6">
              {mockProcessos.map(processo => (
                <div
                  key={processo.id}
                  className="border-l-4 border-l-orange-500 bg-gray-50 p-6 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
                          {processo.id}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {processo.tipo}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            processo.status === 'Em andamento'
                              ? 'bg-orange-100 text-orange-800'
                              : processo.status === 'Finalizado'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {processo.status}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg">
                          R$ {processo.valor.toLocaleString('pt-BR')}
                        </h3>
                        <p className="text-sm text-gray-600">Protocolo: {processo.protocolo}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Progresso:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="bg-gray-200 rounded-full h-2 flex-1">
                              <div
                                className="bg-orange-600 h-2 rounded-full"
                                style={{ width: `${processo.progresso}%` }}
                              />
                            </div>
                            <span className="font-medium">{processo.progresso}%</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Etapa Atual:</span>
                          <p className="font-medium">{processo.etapaAtual}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Data de Início:</span>
                          <p className="font-medium">{processo.dataInicio}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Prazo Estimado:</span>
                          <p className="font-medium">{processo.prazoEstimado}</p>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Próxima ação:</strong> {processo.proximaAcao}
                        </p>
                      </div>

                      <div className="text-sm">
                        <span className="text-gray-600">Responsável:</span>
                        <p className="font-medium">{processo.responsavel}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-6">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                        👁️ Acompanhar
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                        📄 Documentos
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Marketplace */}
        {activeTab === 'marketplace' && (
          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-bold mb-4">🏪 Marketplace de Créditos Recuperados</h2>
            <p className="text-gray-600 mb-6">
              Tokenize e negocie seus créditos recuperados com certificação premium
            </p>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold mb-3 text-green-800">
                🏆 Créditos Certificados Premium
              </h3>
              <p className="text-sm text-green-700 mb-4">
                Seus créditos recuperados têm certificação premium por terem passado por análise de
                IA e validação legal, oferecendo maior segurança aos compradores e melhores preços
                de venda.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm">Validação por IA</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm">Certificação Legal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm">Preços Premium</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  🪙
                </div>
                <h3 className="font-semibold mb-2">Tokenizar Créditos</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Transforme seus créditos recuperados em tokens blockchain
                </p>
                <button
                  onClick={() => (window.location.href = '/dashboard/tokenizacao')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Tokenizar Agora
                </button>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  🛒
                </div>
                <h3 className="font-semibold mb-2">Vender no Marketplace</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Liste seus créditos para venda com preços competitivos
                </p>
                <button
                  onClick={() => (window.location.href = '/dashboard/marketplace')}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  Criar Anúncio
                </button>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  ↔️
                </div>
                <h3 className="font-semibold mb-2">Compensação</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Use créditos para compensar débitos automaticamente
                </p>
                <button
                  onClick={() =>
                    (window.location.href = '/dashboard/recuperacao/compensacao-bilateral')
                  }
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  Ver Opções
                </button>
              </div>
            </div>

            {/* Créditos disponíveis para tokenização */}
            <div className="mt-8">
              <h3 className="font-semibold mb-4">Créditos Disponíveis para Tokenização</h3>
              <div className="space-y-3">
                {mockCreditos
                  .filter(c => c.status === 'Validado')
                  .map(credito => (
                    <div
                      key={credito.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {credito.tipo} - R$ {credito.valor.toLocaleString('pt-BR')}
                        </p>
                        <p className="text-sm text-gray-600">{credito.descricao}</p>
                      </div>
                      <button
                        onClick={() => tokenizarCredito(credito.id, credito.valor)}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        🪙 Tokenizar
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Relatórios */}
        {activeTab === 'relatorios' && (
          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-bold mb-4">📊 Relatórios e Analytics</h2>
            <p className="text-gray-600 mb-6">Análise de performance e resultados da recuperação</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="h-8 w-8 bg-blue-600 rounded mx-auto mb-2"></div>
                <p className="text-2xl font-bold text-blue-600">{mockStats.taxaSucesso}%</p>
                <p className="text-sm text-gray-600">Taxa de Sucesso</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="h-8 w-8 bg-green-600 rounded mx-auto mb-2"></div>
                <p className="text-2xl font-bold text-green-600">{mockStats.tempoMedio}</p>
                <p className="text-sm text-gray-600">Tempo Médio</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="h-8 w-8 bg-purple-600 rounded mx-auto mb-2"></div>
                <p className="text-2xl font-bold text-purple-600">
                  R$ {(mockStats.totalIdentificado / 1000000).toFixed(1)}M
                </p>
                <p className="text-sm text-gray-600">Total Identificado</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="h-8 w-8 bg-orange-600 rounded mx-auto mb-2"></div>
                <p className="text-2xl font-bold text-orange-600">+25%</p>
                <p className="text-sm text-gray-600">vs Mês Anterior</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <button
                onClick={() => handleGerarRelatorio('completo')}
                disabled={loading}
                className="h-auto p-4 flex flex-col items-center gap-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center">
                  📄
                </div>
                <span className="font-medium">Relatório Completo</span>
                <span className="text-xs text-gray-600">PDF • Análise detalhada</span>
              </button>

              <button
                onClick={() => handleGerarRelatorio('planilha')}
                disabled={loading}
                className="h-auto p-4 flex flex-col items-center gap-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <div className="h-8 w-8 bg-green-100 rounded flex items-center justify-center">
                  📊
                </div>
                <span className="font-medium">Planilha de Dados</span>
                <span className="text-xs text-gray-600">XLSX • Dados brutos</span>
              </button>

              <button
                onClick={() => handleGerarRelatorio('executivo')}
                disabled={loading}
                className="h-auto p-4 flex flex-col items-center gap-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <div className="h-8 w-8 bg-purple-100 rounded flex items-center justify-center">
                  📈
                </div>
                <span className="font-medium">Dashboard Executivo</span>
                <span className="text-xs text-gray-600">PDF • Resumo executivo</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
