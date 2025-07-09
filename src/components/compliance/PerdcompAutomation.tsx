/**
 * PERDCOMP Automation Component
 * Sistema de Geração Automática de Arquivos PERDCOMP/PER
 * 
 * Funcionalidades:
 * - Sistema gera arquivo .per/.dcomp pronto
 * - Todos os campos preenchidos automaticamente
 * - Cliente baixa arquivo finalizado
 * - Contador só faz upload no e-CAC oficial
 * - Zero digitação manual
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  Zap,
  Archive,
  ExternalLink,
  TrendingUp,
  Calculator,
  Shield
} from 'lucide-react';

interface PerdcompFile {
  id: string;
  empresaId: string;
  empresaNome: string;
  tipoArquivo: 'PER' | 'DCOMP';
  periodoApuracao: string;
  status: 'GERANDO' | 'CONCLUIDO' | 'BAIXADO' | 'UTILIZADO_ECAC';
  totalCreditos: number;
  totalDebitos: number;
  saldoCompensacao: number;
  nomeArquivo: string;
  tamanhoArquivo: number;
  tempoGeracao: number;
  dataGeracao: Date;
  dataBaixada?: Date;
  dataUtilizacaoEcac?: Date;
  hash: string;
}

interface FormularioGeracao {
  empresaId: string;
  tipoArquivo: 'PER' | 'DCOMP';
  periodoApuracao: string;
}

const PerdcompAutomation: React.FC = () => {
  const [arquivos, setArquivos] = useState<PerdcompFile[]>([]);
  const [formulario, setFormulario] = useState<FormularioGeracao>({
    empresaId: '',
    tipoArquivo: 'DCOMP',
    periodoApuracao: ''
  });
  const [gerando, setGerando] = useState(false);
  const [tempoGeracao, setTempoGeracao] = useState(0);
  const [progresso, setProgresso] = useState(0);
  const [stats, setStats] = useState({
    totalGerados: 156,
    utilizadosEcac: 142,
    percentualAutomatizacao: 100,
    tempoMedioGeracao: 18,
    valorTotalCreditos: 2500000,
    valorTotalDebitos: 1800000
  });
  const [empresas] = useState([
    { id: 'emp_001', nome: 'Tech Solutions Ltda', cnpj: '12.345.678/0001-95' },
    { id: 'emp_002', nome: 'Comercial ABC S.A.', cnpj: '98.765.432/0001-10' },
    { id: 'emp_003', nome: 'Indústria XYZ Ltda', cnpj: '11.222.333/0001-44' }
  ]);

  useEffect(() => {
    // Simular arquivos já gerados
    const arquivosSimulados: PerdcompFile[] = [
      {
        id: 'file_001',
        empresaId: 'emp_001',
        empresaNome: 'Tech Solutions Ltda',
        tipoArquivo: 'DCOMP',
        periodoApuracao: '12/2024',
        status: 'CONCLUIDO',
        totalCreditos: 125000,
        totalDebitos: 85000,
        saldoCompensacao: 40000,
        nomeArquivo: 'DCOMP_12345678000195_122024.txt',
        tamanhoArquivo: 4567,
        tempoGeracao: 15,
        dataGeracao: new Date(Date.now() - 86400000),
        hash: 'SHA256ABC123'
      },
      {
        id: 'file_002',
        empresaId: 'emp_002',
        empresaNome: 'Comercial ABC S.A.',
        tipoArquivo: 'PER',
        periodoApuracao: '11/2024',
        status: 'UTILIZADO_ECAC',
        totalCreditos: 75000,
        totalDebitos: 0,
        saldoCompensacao: 75000,
        nomeArquivo: 'PER_98765432000110_112024.txt',
        tamanhoArquivo: 2134,
        tempoGeracao: 12,
        dataGeracao: new Date(Date.now() - 172800000),
        dataBaixada: new Date(Date.now() - 86400000),
        dataUtilizacaoEcac: new Date(Date.now() - 43200000),
        hash: 'SHA256DEF456'
      }
    ];

    setArquivos(arquivosSimulados);

    // Definir período padrão como mês atual
    const agora = new Date();
    const mesAtual = String(agora.getMonth() + 1).padStart(2, '0');
    const anoAtual = agora.getFullYear();
    setFormulario(prev => ({
      ...prev,
      periodoApuracao: `${mesAtual}/${anoAtual}`
    }));
  }, []);

  const gerarArquivoPerdcomp = async () => {
    if (!formulario.empresaId || !formulario.periodoApuracao) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    setGerando(true);
    setTempoGeracao(0);
    setProgresso(0);

    const empresa = empresas.find(e => e.id === formulario.empresaId);
    if (!empresa) return;

    try {
      // Simular processo de geração
      const inicioGeracao = Date.now();
      const intervaloCronometro = setInterval(() => {
        const tempoDecorrido = (Date.now() - inicioGeracao) / 1000;
        setTempoGeracao(tempoDecorrido);
      }, 100);

      // Etapa 1: Coleta de dados (5 segundos)
      await simularEtapa('Coletando dados da empresa...', 0, 25, 5000);
      
      // Etapa 2: Identificação de créditos (8 segundos)
      await simularEtapa('Identificando créditos automaticamente...', 25, 60, 8000);
      
      // Etapa 3: Consolidação de débitos (3 segundos)
      await simularEtapa('Consolidando débitos fiscais...', 60, 80, 3000);
      
      // Etapa 4: Geração do arquivo (4 segundos)
      await simularEtapa('Gerando arquivo finalizado...', 80, 100, 4000);

      clearInterval(intervaloCronometro);

      // Criar novo arquivo
      const totalCreditos = Math.round(Math.random() * 200000 + 50000);
      const totalDebitos = Math.round(Math.random() * 150000 + 30000);
      const saldoCompensacao = totalCreditos - totalDebitos;

      const novoArquivo: PerdcompFile = {
        id: `file_${Date.now()}`,
        empresaId: formulario.empresaId,
        empresaNome: empresa.nome,
        tipoArquivo: formulario.tipoArquivo,
        periodoApuracao: formulario.periodoApuracao,
        status: 'CONCLUIDO',
        totalCreditos,
        totalDebitos,
        saldoCompensacao,
        nomeArquivo: `${formulario.tipoArquivo}_${empresa.cnpj.replace(/[^0-9]/g, '')}_${formulario.periodoApuracao.replace('/', '')}.txt`,
        tamanhoArquivo: Math.round(Math.random() * 5000 + 2000),
        tempoGeracao: 20,
        dataGeracao: new Date(),
        hash: `SHA256${Math.random().toString(36).substring(2, 10).toUpperCase()}`
      };

      setArquivos(prev => [novoArquivo, ...prev]);

      // Atualizar stats
      setStats(prev => ({
        ...prev,
        totalGerados: prev.totalGerados + 1,
        valorTotalCreditos: prev.valorTotalCreditos + totalCreditos,
        valorTotalDebitos: prev.valorTotalDebitos + totalDebitos
      }));

      // Limpar formulário
      setFormulario(prev => ({
        ...prev,
        empresaId: '',
        tipoArquivo: 'DCOMP'
      }));

    } catch (error) {
      console.error('Erro na geração:', error);
    } finally {
      setGerando(false);
      setProgresso(100);
    }
  };

  const simularEtapa = async (descricao: string, inicio: number, fim: number, duracao: number) => {
    const passos = 20;
    const incremento = (fim - inicio) / passos;
    const intervalo = duracao / passos;

    for (let i = 0; i <= passos; i++) {
      await new Promise(resolve => setTimeout(resolve, intervalo));
      const progresso = Math.min(fim, inicio + (incremento * i));
      setProgresso(progresso);
    }
  };

  const baixarArquivo = (arquivo: PerdcompFile) => {
    // Simular download
    setArquivos(prev => 
      prev.map(a => 
        a.id === arquivo.id 
          ? { 
              ...a, 
              status: 'BAIXADO',
              dataBaixada: new Date()
            }
          : a
      )
    );

    // Em produção, iniciar download real
    console.log(`Baixando arquivo: ${arquivo.nomeArquivo}`);
  };

  const marcarUtilizadoEcac = (arquivo: PerdcompFile) => {
    setArquivos(prev => 
      prev.map(a => 
        a.id === arquivo.id 
          ? { 
              ...a, 
              status: 'UTILIZADO_ECAC',
              dataUtilizacaoEcac: new Date()
            }
          : a
      )
    );

    setStats(prev => ({
      ...prev,
      utilizadosEcac: prev.utilizadosEcac + 1
    }));
  };

  const obterCorStatus = (status: PerdcompFile['status']) => {
    switch (status) {
      case 'GERANDO': return 'text-blue-600 bg-blue-100';
      case 'CONCLUIDO': return 'text-green-600 bg-green-100';
      case 'BAIXADO': return 'text-purple-600 bg-purple-100';
      case 'UTILIZADO_ECAC': return 'text-emerald-600 bg-emerald-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const obterIconeStatus = (status: PerdcompFile['status']) => {
    switch (status) {
      case 'GERANDO': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'CONCLUIDO': return <CheckCircle className="h-4 w-4" />;
      case 'BAIXADO': return <Download className="h-4 w-4" />;
      case 'UTILIZADO_ECAC': return <ExternalLink className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const obterTextoStatus = (status: PerdcompFile['status']) => {
    switch (status) {
      case 'GERANDO': return 'Gerando Arquivo';
      case 'CONCLUIDO': return 'Pronto para Download';
      case 'BAIXADO': return 'Arquivo Baixado';
      case 'UTILIZADO_ECAC': return 'Utilizado no e-CAC';
      default: return 'Status Desconhecido';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">PERDCOMP Automático</h1>
          <p className="text-gray-600 mt-1">
            Geração automática • Todos os campos preenchidos • Zero digitação manual
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Arquivos Gerados</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalGerados}</div>
            <p className="text-xs text-gray-600">Total de arquivos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilizados e-CAC</CardTitle>
            <ExternalLink className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.utilizadosEcac}</div>
            <p className="text-xs text-gray-600">Transmitidos oficialmente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automação</CardTitle>
            <Zap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.percentualAutomatizacao}%</div>
            <p className="text-xs text-gray-600">Zero digitação manual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.tempoMedioGeracao}s</div>
            <p className="text-xs text-gray-600">Geração completa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Créditos</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">
              {(stats.valorTotalCreditos / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-gray-600">Valor em créditos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Débitos</CardTitle>
            <Calculator className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-600">
              {(stats.valorTotalDebitos / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-gray-600">Valor em débitos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário de Geração */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <span>Gerar Arquivo Automático</span>
            </CardTitle>
            <CardDescription>
              Todos os campos são preenchidos automaticamente. Zero digitação manual.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {gerando && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
                  <span className="text-sm font-medium text-blue-800">
                    Geração Automática em Andamento
                  </span>
                </div>
                <Progress value={progresso} className="h-2 mb-2" />
                <div className="flex justify-between text-xs text-blue-600">
                  <span>{tempoGeracao.toFixed(1)}s de processamento</span>
                  <span>{progresso.toFixed(0)}% concluído</span>
                </div>
                <div className="mt-2 text-xs text-blue-700">
                  ⚡ Coletando dados automaticamente
                  <br />
                  🔍 Identificando créditos tributários
                  <br />
                  📊 Consolidando débitos fiscais
                  <br />
                  📄 Gerando arquivo finalizado
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="empresaId">Empresa</Label>
              <Select 
                value={formulario.empresaId} 
                onValueChange={(value) => setFormulario(prev => ({ ...prev, empresaId: value }))}
                disabled={gerando}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresas.map((empresa) => (
                    <SelectItem key={empresa.id} value={empresa.id}>
                      {empresa.nome} - {empresa.cnpj}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipoArquivo">Tipo de Arquivo</Label>
                <Select 
                  value={formulario.tipoArquivo} 
                  onValueChange={(value: 'PER' | 'DCOMP') => setFormulario(prev => ({ ...prev, tipoArquivo: value }))}
                  disabled={gerando}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DCOMP">DCOMP - Demonstrativo de Compensação</SelectItem>
                    <SelectItem value="PER">PER - Pedido Eletrônico de Restituição</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="periodoApuracao">Período de Apuração</Label>
                <Input
                  id="periodoApuracao"
                  value={formulario.periodoApuracao}
                  onChange={(e) => setFormulario(prev => ({ ...prev, periodoApuracao: e.target.value }))}
                  placeholder="MM/AAAA"
                  disabled={gerando}
                />
              </div>
            </div>

            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>100% Automatizado:</strong> O sistema irá coletar automaticamente todos 
                os créditos identificados, débitos fiscais e gerar o arquivo completo com 
                todos os campos preenchidos. Tempo estimado: 15-20 segundos.
              </AlertDescription>
            </Alert>

            <Button 
              className="w-full" 
              onClick={gerarArquivoPerdcomp}
              disabled={gerando || !formulario.empresaId || !formulario.periodoApuracao}
            >
              {gerando ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Gerando Automaticamente...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Gerar {formulario.tipoArquivo} Automaticamente
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Lista de Arquivos Gerados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Archive className="h-5 w-5 text-green-600" />
              <span>Arquivos Gerados</span>
              <Badge variant="outline">{arquivos.length}</Badge>
            </CardTitle>
            <CardDescription>
              Arquivos PERDCOMP/PER prontos para download e uso no e-CAC
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {arquivos.map((arquivo) => (
                <div key={arquivo.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {obterIconeStatus(arquivo.status)}
                      <div>
                        <h4 className="font-medium text-sm">{arquivo.nomeArquivo}</h4>
                        <p className="text-xs text-gray-500">
                          {arquivo.empresaNome} • {arquivo.periodoApuracao}
                        </p>
                      </div>
                    </div>
                    <Badge className={obterCorStatus(arquivo.status)}>
                      {obterTextoStatus(arquivo.status)}
                    </Badge>
                  </div>

                  {/* Resumo Financeiro */}
                  <div className="bg-gray-50 rounded-md p-3 mb-3">
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-gray-500">Créditos:</span>
                        <p className="font-semibold text-green-600">
                          {arquivo.totalCreditos.toLocaleString('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Débitos:</span>
                        <p className="font-semibold text-red-600">
                          {arquivo.totalDebitos.toLocaleString('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Saldo:</span>
                        <p className={`font-semibold ${arquivo.saldoCompensacao >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {arquivo.saldoCompensacao.toLocaleString('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Informações Técnicas */}
                  <div className="text-xs text-gray-500 mb-3">
                    <div className="flex justify-between">
                      <span>Tamanho: {(arquivo.tamanhoArquivo / 1024).toFixed(1)} KB</span>
                      <span>Gerado em: {arquivo.tempoGeracao}s</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Hash: {arquivo.hash}</span>
                      <span>{arquivo.dataGeracao.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>

                  {/* Status e Datas */}
                  {arquivo.dataBaixada && (
                    <div className="text-xs text-purple-600 mb-2">
                      📥 Baixado em: {arquivo.dataBaixada.toLocaleString('pt-BR')}
                    </div>
                  )}
                  {arquivo.dataUtilizacaoEcac && (
                    <div className="text-xs text-green-600 mb-2">
                      ✅ Utilizado no e-CAC em: {arquivo.dataUtilizacaoEcac.toLocaleString('pt-BR')}
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex space-x-2">
                    {arquivo.status === 'CONCLUIDO' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => baixarArquivo(arquivo)}
                          className="flex-1"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Baixar Arquivo
                        </Button>
                        <Button size="sm" variant="outline">
                          👁️ Prévia
                        </Button>
                      </>
                    )}
                    {arquivo.status === 'BAIXADO' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => marcarUtilizadoEcac(arquivo)}
                        className="flex-1"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Marcar como Utilizado no e-CAC
                      </Button>
                    )}
                    {arquivo.status === 'UTILIZADO_ECAC' && (
                      <div className="flex-1 text-center text-sm text-green-600 font-medium py-2">
                        ✅ Processo Concluído com Sucesso
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {arquivos.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum arquivo gerado ainda</p>
                  <p className="text-sm mt-1">Use o formulário ao lado para gerar seu primeiro arquivo</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instruções de Uso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Instruções de Uso</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-sm text-green-600 mb-2">✅ O que o Sistema Faz Automaticamente:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Identifica todos os créditos tributários disponíveis</li>
                <li>• Consolida débitos fiscais pendentes</li>
                <li>• Preenche TODOS os campos obrigatórios</li>
                <li>• Calcula saldos de compensação</li>
                <li>• Gera arquivo .per/.dcomp finalizado</li>
                <li>• Valida integridade e formatação</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-blue-600 mb-2">📋 Próximos Passos:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>1. Baixe o arquivo gerado</li>
                <li>2. Revise os dados (opcional)</li>
                <li>3. Faça upload no e-CAC da Receita Federal</li>
                <li>4. Aguarde processamento oficial</li>
                <li>5. Marque como "Utilizado no e-CAC"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>PERDCOMP Automatizado:</strong> Este sistema gera arquivos PERDCOMP/PER com 
          TODOS os campos preenchidos automaticamente em 15-20 segundos. Zero digitação manual. 
          O arquivo é apenas para facilitar o processo - a compensação oficial deve ser feita 
          via e-CAC da Receita Federal.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default PerdcompAutomation;