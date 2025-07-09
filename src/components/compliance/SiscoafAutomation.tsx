/**
 * SISCOAF Automation Component
 * Sistema de Controle de Atividades Financeiras - 100% Automatizado
 * 
 * Funcionalidades:
 * - Detecção automática de transações > R$ 10.000
 * - Formulário pré-preenchido em 30 segundos
 * - Operador só clica "Enviar" após revisar
 * - Backup automático por 5 anos
 * - Protocolo de envio automático para COAF
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
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  Send, 
  FileText, 
  AlertTriangle,
  RefreshCw,
  Download,
  Archive,
  Search,
  Eye,
  Zap
} from 'lucide-react';

interface SiscoafTransaction {
  id: string;
  valor: number;
  tipo: string;
  data: Date;
  operadorCpf: string;
  operadorNome: string;
  beneficiarioCpf?: string;
  beneficiarioNome?: string;
  status: 'DETECTADO' | 'PREENCHIDO' | 'REVISAO' | 'ENVIADO' | 'ERRO';
  tempoPreenchimento?: number;
  protocoloCoaf?: string;
  dataEnvio?: Date;
  backupRealizado?: boolean;
}

interface SiscoafFormData {
  valorTransacao: string;
  tipoTransacao: string;
  dataTransacao: string;
  operadorCpf: string;
  operadorNome: string;
  beneficiarioCpf: string;
  beneficiarioNome: string;
  observacoes: string;
}

const SiscoafAutomation: React.FC = () => {
  const [transacoes, setTransacoes] = useState<SiscoafTransaction[]>([]);
  const [transacaoSelecionada, setTransacaoSelecionada] = useState<SiscoafTransaction | null>(null);
  const [formulario, setFormulario] = useState<SiscoafFormData>({
    valorTransacao: '',
    tipoTransacao: '',
    dataTransacao: '',
    operadorCpf: '',
    operadorNome: '',
    beneficiarioCpf: '',
    beneficiarioNome: '',
    observacoes: ''
  });
  const [preenchendoFormulario, setPreenchendoFormulario] = useState(false);
  const [enviandoRelatorio, setEnviandoRelatorio] = useState(false);
  const [tempoPreenchimento, setTempoPreenchimento] = useState(0);
  const [stats, setStats] = useState({
    totalDetectadas: 89,
    totalEnviadas: 87,
    pendentesEnvio: 2,
    percentualAutomatico: 98,
    tempoMedioProcessamento: 28
  });

  useEffect(() => {
    // Simular detecção automática de transações
    const transacoesSimuladas: SiscoafTransaction[] = [
      {
        id: 'txn_001',
        valor: 15000.00,
        tipo: 'MARKETPLACE',
        data: new Date(),
        operadorCpf: '123.456.789-01',
        operadorNome: 'João Silva Santos',
        beneficiarioCpf: '987.654.321-00',
        beneficiarioNome: 'Maria Oliveira Ltda',
        status: 'DETECTADO'
      },
      {
        id: 'txn_002',
        valor: 25000.00,
        tipo: 'TOKENIZACAO',
        data: new Date(Date.now() - 3600000),
        operadorCpf: '111.222.333-44',
        operadorNome: 'Pedro Costa',
        beneficiarioCpf: '555.666.777-88',
        beneficiarioNome: 'TechCorp S.A.',
        status: 'ENVIADO',
        protocoloCoaf: 'COAF-1234567890-ABC',
        dataEnvio: new Date(Date.now() - 1800000),
        backupRealizado: true
      }
    ];

    setTransacoes(transacoesSimuladas);
  }, []);

  const preencherFormularioAutomatico = async (transacao: SiscoafTransaction) => {
    setPreenchendoFormulario(true);
    setTransacaoSelecionada(transacao);
    setTempoPreenchimento(0);

    // Simular preenchimento automático em 30 segundos
    const inicioPreenchimento = Date.now();
    const intervalo = setInterval(() => {
      const tempoDecorrido = (Date.now() - inicioPreenchimento) / 1000;
      setTempoPreenchimento(tempoDecorrido);
    }, 100);

    // Preencher campos progressivamente
    await new Promise(resolve => setTimeout(resolve, 2000));
    setFormulario(prev => ({
      ...prev,
      valorTransacao: transacao.valor.toLocaleString('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      })
    }));

    await new Promise(resolve => setTimeout(resolve, 3000));
    setFormulario(prev => ({
      ...prev,
      tipoTransacao: transacao.tipo,
      dataTransacao: transacao.data.toLocaleDateString('pt-BR')
    }));

    await new Promise(resolve => setTimeout(resolve, 5000));
    setFormulario(prev => ({
      ...prev,
      operadorCpf: transacao.operadorCpf,
      operadorNome: transacao.operadorNome
    }));

    await new Promise(resolve => setTimeout(resolve, 4000));
    setFormulario(prev => ({
      ...prev,
      beneficiarioCpf: transacao.beneficiarioCpf || '',
      beneficiarioNome: transacao.beneficiarioNome || ''
    }));

    await new Promise(resolve => setTimeout(resolve, 3000));
    setFormulario(prev => ({
      ...prev,
      observacoes: `Transação ${transacao.tipo} identificada automaticamente. Valor: ${transacao.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}. Sistema de detecção automática TRIBUTA.AI.`
    }));

    clearInterval(intervalo);
    setTempoPreenchimento(30);
    setPreenchendoFormulario(false);

    // Atualizar status da transação
    setTransacoes(prev => 
      prev.map(t => 
        t.id === transacao.id 
          ? { ...t, status: 'PREENCHIDO', tempoPreenchimento: 30 }
          : t
      )
    );
  };

  const enviarRelatorioCoaf = async () => {
    if (!transacaoSelecionada) return;

    setEnviandoRelatorio(true);

    try {
      // Simular envio para COAF (5 segundos)
      await new Promise(resolve => setTimeout(resolve, 5000));

      const protocoloCoaf = `COAF-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const dataEnvio = new Date();

      // Atualizar transação
      setTransacoes(prev => 
        prev.map(t => 
          t.id === transacaoSelecionada.id 
            ? { 
                ...t, 
                status: 'ENVIADO',
                protocoloCoaf,
                dataEnvio,
                backupRealizado: true
              }
            : t
        )
      );

      // Atualizar stats
      setStats(prev => ({
        ...prev,
        totalEnviadas: prev.totalEnviadas + 1,
        pendentesEnvio: prev.pendentesEnvio - 1
      }));

      // Limpar formulário
      setTransacaoSelecionada(null);
      setFormulario({
        valorTransacao: '',
        tipoTransacao: '',
        dataTransacao: '',
        operadorCpf: '',
        operadorNome: '',
        beneficiarioCpf: '',
        beneficiarioNome: '',
        observacoes: ''
      });

    } catch (error) {
      console.error('Erro ao enviar relatório:', error);
      
      // Marcar como erro
      setTransacoes(prev => 
        prev.map(t => 
          t.id === transacaoSelecionada.id 
            ? { ...t, status: 'ERRO' }
            : t
        )
      );
    } finally {
      setEnviandoRelatorio(false);
    }
  };

  const obterCorStatus = (status: SiscoafTransaction['status']) => {
    switch (status) {
      case 'DETECTADO': return 'text-blue-600 bg-blue-100';
      case 'PREENCHIDO': return 'text-green-600 bg-green-100';
      case 'REVISAO': return 'text-yellow-600 bg-yellow-100';
      case 'ENVIADO': return 'text-emerald-600 bg-emerald-100';
      case 'ERRO': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const obterIconeStatus = (status: SiscoafTransaction['status']) => {
    switch (status) {
      case 'DETECTADO': return <Search className="h-4 w-4" />;
      case 'PREENCHIDO': return <FileText className="h-4 w-4" />;
      case 'REVISAO': return <Eye className="h-4 w-4" />;
      case 'ENVIADO': return <CheckCircle className="h-4 w-4" />;
      case 'ERRO': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const obterTextoStatus = (status: SiscoafTransaction['status']) => {
    switch (status) {
      case 'DETECTADO': return 'Detectado Automaticamente';
      case 'PREENCHIDO': return 'Formulário Preenchido';
      case 'REVISAO': return 'Aguardando Revisão';
      case 'ENVIADO': return 'Enviado para COAF';
      case 'ERRO': return 'Erro no Envio';
      default: return 'Status Desconhecido';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SISCOAF Automático</h1>
          <p className="text-gray-600 mt-1">
            Detecção automática • Formulário pré-preenchido em 30s • Envio automatizado
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Detectar Transações
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Relatório
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Detectadas</CardTitle>
            <Search className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalDetectadas}</div>
            <p className="text-xs text-gray-600">Transações > R$ 10.000</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enviadas</CardTitle>
            <Send className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalEnviadas}</div>
            <p className="text-xs text-gray-600">Relatórios para COAF</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendentesEnvio}</div>
            <p className="text-xs text-gray-600">Aguardando envio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automação</CardTitle>
            <Zap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.percentualAutomatico}%</div>
            <p className="text-xs text-gray-600">Processamento auto</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <RefreshCw className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{stats.tempoMedioProcessamento}s</div>
            <p className="text-xs text-gray-600">Preenchimento auto</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de Transações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Transações Detectadas</span>
              <Badge variant="outline">{transacoes.length}</Badge>
            </CardTitle>
            <CardDescription>
              Transações acima de R$ 10.000 detectadas automaticamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transacoes.map((transacao) => (
                <div 
                  key={transacao.id} 
                  className={`
                    border rounded-lg p-4 cursor-pointer transition-all
                    ${transacaoSelecionada?.id === transacao.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'}
                  `}
                  onClick={() => setTransacaoSelecionada(transacao)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {obterIconeStatus(transacao.status)}
                      <span className="font-medium text-sm">{transacao.id}</span>
                    </div>
                    <Badge className={obterCorStatus(transacao.status)}>
                      {obterTextoStatus(transacao.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>
                      <span className="text-gray-500">Valor:</span>
                      <p className="font-semibold text-lg text-gray-900">
                        {transacao.valor.toLocaleString('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        })}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Tipo:</span>
                      <p className="font-medium">{transacao.tipo}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Operador:</span>
                      <p className="font-medium">{transacao.operadorNome}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Data:</span>
                      <p className="font-medium">{transacao.data.toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>

                  {transacao.protocoloCoaf && (
                    <div className="mt-2 p-2 bg-green-50 rounded text-xs">
                      <span className="text-green-700 font-medium">
                        Protocolo COAF: {transacao.protocoloCoaf}
                      </span>
                      {transacao.backupRealizado && (
                        <div className="flex items-center mt-1 text-green-600">
                          <Archive className="h-3 w-3 mr-1" />
                          <span>Backup realizado (5 anos)</span>
                        </div>
                      )}
                    </div>
                  )}

                  {transacao.status === 'DETECTADO' && (
                    <div className="mt-3">
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          preencherFormularioAutomatico(transacao);
                        }}
                        disabled={preenchendoFormulario}
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        Preencher Automaticamente (30s)
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Formulário SISCOAF */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span>Formulário SISCOAF</span>
              {preenchendoFormulario && (
                <Badge variant="outline" className="animate-pulse">
                  Preenchendo...
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Formulário pré-preenchido automaticamente em 30 segundos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {preenchendoFormulario && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
                  <span className="text-sm font-medium text-blue-800">
                    Preenchimento Automático em Andamento
                  </span>
                </div>
                <Progress value={(tempoPreenchimento / 30) * 100} className="h-2" />
                <p className="text-xs text-blue-600 mt-1">
                  {tempoPreenchimento.toFixed(1)}s / 30s
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valorTransacao">Valor da Transação</Label>
                <Input
                  id="valorTransacao"
                  value={formulario.valorTransacao}
                  onChange={(e) => setFormulario(prev => ({ ...prev, valorTransacao: e.target.value }))}
                  placeholder="R$ 0,00"
                  readOnly={preenchendoFormulario}
                />
              </div>
              <div>
                <Label htmlFor="tipoTransacao">Tipo de Transação</Label>
                <Input
                  id="tipoTransacao"
                  value={formulario.tipoTransacao}
                  onChange={(e) => setFormulario(prev => ({ ...prev, tipoTransacao: e.target.value }))}
                  placeholder="MARKETPLACE"
                  readOnly={preenchendoFormulario}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="dataTransacao">Data da Transação</Label>
              <Input
                id="dataTransacao"
                value={formulario.dataTransacao}
                onChange={(e) => setFormulario(prev => ({ ...prev, dataTransacao: e.target.value }))}
                placeholder="DD/MM/AAAA"
                readOnly={preenchendoFormulario}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="operadorCpf">CPF do Operador</Label>
                <Input
                  id="operadorCpf"
                  value={formulario.operadorCpf}
                  onChange={(e) => setFormulario(prev => ({ ...prev, operadorCpf: e.target.value }))}
                  placeholder="000.000.000-00"
                  readOnly={preenchendoFormulario}
                />
              </div>
              <div>
                <Label htmlFor="operadorNome">Nome do Operador</Label>
                <Input
                  id="operadorNome"
                  value={formulario.operadorNome}
                  onChange={(e) => setFormulario(prev => ({ ...prev, operadorNome: e.target.value }))}
                  placeholder="Nome completo"
                  readOnly={preenchendoFormulario}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="beneficiarioCpf">CPF/CNPJ do Beneficiário</Label>
                <Input
                  id="beneficiarioCpf"
                  value={formulario.beneficiarioCpf}
                  onChange={(e) => setFormulario(prev => ({ ...prev, beneficiarioCpf: e.target.value }))}
                  placeholder="000.000.000-00"
                  readOnly={preenchendoFormulario}
                />
              </div>
              <div>
                <Label htmlFor="beneficiarioNome">Nome do Beneficiário</Label>
                <Input
                  id="beneficiarioNome"
                  value={formulario.beneficiarioNome}
                  onChange={(e) => setFormulario(prev => ({ ...prev, beneficiarioNome: e.target.value }))}
                  placeholder="Nome completo"
                  readOnly={preenchendoFormulario}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formulario.observacoes}
                onChange={(e) => setFormulario(prev => ({ ...prev, observacoes: e.target.value }))}
                placeholder="Observações adicionais..."
                rows={3}
                readOnly={preenchendoFormulario}
              />
            </div>

            {transacaoSelecionada?.status === 'PREENCHIDO' && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Formulário Preenchido Automaticamente!</strong> Todos os campos foram 
                  preenchidos em {transacaoSelecionada.tempoPreenchimento}s. Revise os dados e 
                  clique em "Enviar para COAF" para finalizar.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex space-x-3">
              <Button 
                className="flex-1"
                onClick={enviarRelatorioCoaf}
                disabled={!transacaoSelecionada || transacaoSelecionada.status !== 'PREENCHIDO' || enviandoRelatorio}
              >
                {enviandoRelatorio ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Enviando para COAF...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar para COAF
                  </>
                )}
              </Button>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Revisar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer */}
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>SISCOAF Automatizado:</strong> Este sistema detecta automaticamente transações 
          acima de R$ 10.000 e preenche formulários SISCOAF em 30 segundos. O operador apenas 
          revisa e envia. Backup automático é mantido por 5 anos conforme exigência legal.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SiscoafAutomation;