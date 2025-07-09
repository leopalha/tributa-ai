import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Zap,
  Brain,
  CreditCard,
  Coins,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
  Upload,
  Shield,
  TrendingUp,
  X,
  Scan,
  Sparkles,
  Database,
  Key,
  FileCheck,
  Copy,
  Download,
  Rocket,
  Star,
  Award,
  Gem,
  DollarSign,
  Percent,
  Store,
  Settings,
  Activity,
  ExternalLink,
  Calculator,
  BarChart3,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { calculateStandardFee, formatCurrency } from '@/utils/format';

interface DocumentoFormulario {
  tipo: string;
  nome: string;
  arquivo: File;
  status: 'pendente' | 'analisando' | 'aprovado' | 'rejeitado';
  observacoes?: string;
}

interface FormDataTitulo {
  tipo: string;
  categoria: string;
  empresa: string;
  cnpj: string;
  valor: string;
  vencimento: string;
  descricao: string;
  documentos: DocumentoFormulario[];
}

interface TokenCreated {
  id: string;
  tokenId: string;
  titulo: string;
  valor: number;
  tipo: string;
  categoria: string;
  empresa: string;
  blockchain: string;
  padrao: string;
  hash: string;
  dataCreacao: string;
  status: 'ativo' | 'pausado' | 'vendido';
  transferivel: boolean;
  fracionavel: boolean;
}

const etapas = [
  { numero: 1, titulo: 'Dados Básicos', descricao: 'Informações do título e empresa' },
  { numero: 2, titulo: 'Documentação', descricao: 'Upload de documentos obrigatórios' },
  { numero: 3, titulo: 'Validação IA', descricao: 'Análise inteligente e verificação completa' },
  { numero: 4, titulo: 'Tokenização', descricao: 'Configurar e criar token na blockchain' },
  { numero: 5, titulo: 'Finalização', descricao: 'Token criado e disponível' },
];

// Documentos obrigatórios por tipo de título (do sistema original)
const documentosObrigatorios: Record<
  string,
  Array<{
    tipo: string;
    nome: string;
    descricao: string;
    obrigatorio: boolean;
    formatos: string[];
  }>
> = {
  ICMS: [
    {
      tipo: 'declaracao_icms',
      nome: 'Declaração ICMS',
      descricao: 'SPED Fiscal ou declaração de apuração do ICMS',
      obrigatorio: true,
      formatos: ['pdf', 'xml'],
    },
    {
      tipo: 'comprovante_pagamento',
      nome: 'Comprovante de Pagamento',
      descricao: 'DARF ou documento que comprove o pagamento indevido',
      obrigatorio: true,
      formatos: ['pdf', 'jpg', 'png'],
    },
    {
      tipo: 'calculo_credito',
      nome: 'Cálculo do Crédito',
      descricao: 'Memória de cálculo detalhada do crédito tributário',
      obrigatorio: true,
      formatos: ['pdf', 'xlsx'],
    },
  ],
  PIS: [
    {
      tipo: 'declaracao_pis',
      nome: 'Declaração PIS/COFINS',
      descricao: 'EFD Contribuições ou declaração de apuração',
      obrigatorio: true,
      formatos: ['pdf', 'xml'],
    },
    {
      tipo: 'balancete',
      nome: 'Balancete',
      descricao: 'Balancete do período de apuração do crédito',
      obrigatorio: true,
      formatos: ['pdf', 'xlsx'],
    },
  ],
  COFINS: [
    {
      tipo: 'declaracao_cofins',
      nome: 'Declaração COFINS',
      descricao: 'EFD Contribuições ou declaração de apuração',
      obrigatorio: true,
      formatos: ['pdf', 'xml'],
    },
    {
      tipo: 'balancete',
      nome: 'Balancete',
      descricao: 'Balancete do período de apuração do crédito',
      obrigatorio: true,
      formatos: ['pdf', 'xlsx'],
    },
  ],
  IRPJ: [
    {
      tipo: 'declaracao_irpj',
      nome: 'Declaração IRPJ',
      descricao: 'ECF - Escrituração Contábil Fiscal',
      obrigatorio: true,
      formatos: ['pdf', 'xml'],
    },
    {
      tipo: 'lalur',
      nome: 'LALUR',
      descricao: 'Livro de Apuração do Lucro Real',
      obrigatorio: true,
      formatos: ['pdf'],
    },
  ],
  PRECATORIO: [
    {
      tipo: 'certidao_judicial',
      nome: 'Certidão Judicial',
      descricao: 'Certidão de trânsito em julgado do processo',
      obrigatorio: true,
      formatos: ['pdf'],
    },
    {
      tipo: 'calculo_valor',
      nome: 'Cálculo do Valor',
      descricao: 'Cálculo atualizado do valor do precatório',
      obrigatorio: true,
      formatos: ['pdf', 'xlsx'],
    },
    {
      tipo: 'sentenca',
      nome: 'Sentença',
      descricao: 'Sentença judicial definitiva',
      obrigatorio: true,
      formatos: ['pdf'],
    },
  ],
  DUPLICATA: [
    {
      tipo: 'duplicata_original',
      nome: 'Duplicata Original',
      descricao: 'Via original da duplicata mercantil',
      obrigatorio: true,
      formatos: ['pdf', 'jpg', 'png'],
    },
    {
      tipo: 'nota_fiscal',
      nome: 'Nota Fiscal',
      descricao: 'Nota fiscal que originou a duplicata',
      obrigatorio: true,
      formatos: ['pdf', 'xml'],
    },
    {
      tipo: 'comprovante_entrega',
      nome: 'Comprovante de Entrega',
      descricao: 'Comprovante de entrega da mercadoria/serviço',
      obrigatorio: false,
      formatos: ['pdf', 'jpg', 'png'],
    },
  ],
};

export default function CriarTokenPage() {
  const navigate = useNavigate();
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [loading, setLoading] = useState(false);
  const [analisando, setAnalisando] = useState(false);
  const [progressoAnalise, setProgressoAnalise] = useState(0);
  const [validationStatus, setValidationStatus] = useState<'pending' | 'analyzing' | 'completed'>('pending');
  const [tokenizando, setTokenizando] = useState(false);
  const [progressoTokenizacao, setProgressoTokenizacao] = useState(0);
  const [tokenizationStatus, setTokenizationStatus] = useState<'pending' | 'configuring' | 'minting' | 'completed'>('pending');
  const [tokenCreated, setTokenCreated] = useState<TokenCreated | null>(null);
  const [currentTokenizationStep, setCurrentTokenizationStep] = useState('');
  const [progresso, setProgresso] = useState(25);
  const [formData, setFormData] = useState<FormDataTitulo>({
    tipo: '',
    categoria: '',
    empresa: '',
    cnpj: '',
    valor: '',
    vencimento: '',
    descricao: '',
    documentos: [],
  });
  const [tipoPessoa, setTipoPessoa] = useState<'fisica' | 'juridica'>('juridica');
  const [cpf, setCpf] = useState('');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [empresaInfo, setEmpresaInfo] = useState<any>(null);
  const [loadingEmpresa, setLoadingEmpresa] = useState(false);
  const [numeroTitulo, setNumeroTitulo] = useState('');
  const [naturezaOrigem, setNaturezaOrigem] = useState('');
  const [prazoVencimento, setPrazoVencimento] = useState('');
  const [analiseConcluida, setAnaliseConcluida] = useState(false);
  const [tokenizacaoConcluida, setTokenizacaoConcluida] = useState(false);
  const [tokenCriado, setTokenCriado] = useState<TokenCreated | null>(null);
  const [loadingAnalise, setLoadingAnalise] = useState(false);
  const [loadingTokenizacao, setLoadingTokenizacao] = useState(false);
  const [etapasAnalise, setEtapasAnalise] = useState([
    { id: 1, nome: 'Verificação de autenticidade', status: 'pendente', progresso: 0, score: 0, detalhes: '' },
    { id: 2, nome: 'Análise de conformidade legal', status: 'pendente', progresso: 0, score: 0, detalhes: '' },
    { id: 3, nome: 'Validação de dados', status: 'pendente', progresso: 0, score: 0, detalhes: '' },
    { id: 4, nome: 'Avaliação de risco', status: 'pendente', progresso: 0, score: 0, detalhes: '' },
    { id: 5, nome: 'Análise de documentos individuais', status: 'pendente', progresso: 0, score: 0, detalhes: '' },
    { id: 6, nome: 'Verificação cruzada de dados', status: 'pendente', progresso: 0, score: 0, detalhes: '' },
  ]);
  const [etapasTokenizacao, setEtapasTokenizacao] = useState([
    { id: 1, nome: 'Preparação de metadados', status: 'pendente', progresso: 0 },
    { id: 2, nome: 'Geração de hash único', status: 'pendente', progresso: 0 },
    { id: 3, nome: 'Criação do token', status: 'pendente', progresso: 0 },
    { id: 4, nome: 'Registro na blockchain', status: 'pendente', progresso: 0 },
    { id: 5, nome: 'Confirmação da rede', status: 'pendente', progresso: 0 },
  ]);
  const [taxaTokenizacao, setTaxaTokenizacao] = useState(0);
  const [valorLiquido, setValorLiquido] = useState(0);
  const [analiseDetalhada, setAnaliseDetalhada] = useState<any>(null);
  const [scoreGeral, setScoreGeral] = useState(0);
  const [termoAssinado, setTermoAssinado] = useState(false);
  const [mostrarTermo, setMostrarTermo] = useState(false);
  const [assinandoTermo, setAssinandoTermo] = useState(false);

  // Funções de validação e formatação
  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) return numbers;
    return numbers.slice(0, 14).replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return numbers.slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const validateCNPJ = (cnpj: string) => {
    const numbers = cnpj.replace(/\D/g, '');
    if (numbers.length !== 14) return false;
    
    // Validação básica dos dígitos verificadores
    let sum = 0;
    let weight = 2;
    for (let i = 11; i >= 0; i--) {
      sum += parseInt(numbers.charAt(i)) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    let digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    
    sum = 0;
    weight = 2;
    for (let i = 12; i >= 0; i--) {
      sum += parseInt(numbers.charAt(i)) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    let digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    
    return digit1 === parseInt(numbers.charAt(12)) && digit2 === parseInt(numbers.charAt(13));
  };

  const validateCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length !== 11) return false;
    
    // Verificar se todos os dígitos são iguais
    if (numbers.split('').every(digit => digit === numbers[0])) return false;
    
    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers.charAt(i)) * (10 - i);
    }
    let digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers.charAt(i)) * (11 - i);
    }
    let digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    
    return digit1 === parseInt(numbers.charAt(9)) && digit2 === parseInt(numbers.charAt(10));
  };

  const buscarDadosEmpresa = async (cnpj: string) => {
    if (!validateCNPJ(cnpj)) return;
    
    setLoadingEmpresa(true);
    try {
      // Simular busca na API da Receita Federal
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const empresaSimulada = {
        razaoSocial: 'EMPRESA EXEMPLO LTDA',
        nomeFantasia: 'Empresa Exemplo',
        cnpj: cnpj,
        situacao: 'ATIVA',
        dataAbertura: '15/03/2020',
        naturezaJuridica: 'Sociedade Empresária Limitada',
        capitalSocial: 'R$ 100.000,00',
        endereco: {
          logradouro: 'RUA EXEMPLO, 123',
          bairro: 'CENTRO',
          cidade: 'SÃO PAULO',
          uf: 'SP',
          cep: '01310-100'
        },
        telefone: '(11) 1234-5678',
        email: 'contato@empresaexemplo.com.br',
        atividades: ['Consultoria em tecnologia da informação', 'Desenvolvimento de software'],
        regimeTributario: 'Lucro Presumido'
      };
      
      setEmpresaInfo(empresaSimulada);
      setFormData(prev => ({
        ...prev,
        empresa: empresaSimulada.razaoSocial,
        cnpj: cnpj
      }));
      
      toast.success('✅ Dados da empresa carregados com sucesso!');
    } catch (error) {
      toast.error('❌ Erro ao buscar dados da empresa');
    } finally {
      setLoadingEmpresa(false);
    }
  };

  const calcularPrazoVencimento = (tipoTitulo: string) => {
    const prazos: Record<string, string> = {
      'DUPLICATA': '30 a 180 dias',
      'NOTA_PROMISSORIA': '30 a 365 dias',
      'CHEQUE': '6 meses (pré-datado)',
      'PRECATORIO': 'Conforme decisão judicial',
      'CDB': '30 dias a 5 anos',
      'DEBÊNTURE': '1 a 10 anos',
      'ICMS': 'Conforme período de apuração',
      'PIS': 'Conforme período de apuração',
      'COFINS': 'Conforme período de apuração',
      'IRPJ': 'Conforme período de apuração'
    };
    
    return prazos[tipoTitulo] || 'Consultar legislação específica';
  };

  const podeProximaEtapa = () => {
    switch (etapaAtual) {
      case 1:
        const baseValidation = formData.tipo && formData.categoria && formData.valor && formData.vencimento && formData.descricao && numeroTitulo;
        
        if (tipoPessoa === 'fisica') {
          return baseValidation && nomeCompleto && cpf && validateCPF(cpf);
        } else {
          return baseValidation && formData.empresa && formData.cnpj && validateCNPJ(formData.cnpj);
        }
      case 2:
        if (!formData.tipo || !documentosObrigatorios[formData.tipo]) return false;
        const docsObrigatorios = documentosObrigatorios[formData.tipo].filter(doc => doc.obrigatorio);
        return docsObrigatorios.every(doc =>
          formData.documentos.some(docEnviado => docEnviado.tipo === doc.tipo)
        );
      case 3:
        return validationStatus === 'completed';
      case 4:
        return tokenizationStatus === 'completed';
      case 5:
        return tokenizationStatus === 'completed';
      default:
        return false;
    }
  };

  const proximaEtapa = () => {
    if (etapaAtual === 3 && validationStatus === 'pending') {
      // Iniciar análise quando estiver na etapa 3 e ainda não iniciou
      iniciarAnalise();
      return;
    }
    
    if (etapaAtual === 5 && tokenizationStatus === 'pending') {
      // Iniciar tokenização quando estiver na etapa 5 e ainda não iniciou
      iniciarTokenizacao();
      return;
    }
    
    if (etapaAtual < etapas.length) {
      setEtapaAtual(etapaAtual + 1);
    }
  };

  const etapaAnterior = () => {
    if (etapaAtual > 1) {
      setEtapaAtual(etapaAtual - 1);
    }
  };

  const handleUploadDocumento = (file: File, tipo: string) => {
    const novoDocumento: DocumentoFormulario = {
      tipo,
      nome: file.name,
      arquivo: file,
      status: 'analisando',
      observacoes: 'Documento enviado, aguardando análise...',
    };

    setFormData(prev => ({
      ...prev,
      documentos: [
        ...prev.documentos.filter(doc => doc.tipo !== tipo),
        novoDocumento,
      ],
    }));

    // Simular análise do documento
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        documentos: prev.documentos.map(doc =>
          doc.tipo === tipo
            ? { ...doc, status: 'aprovado', observacoes: 'Documento aprovado e validado' }
            : doc
        ),
      }));
      toast.success(`✅ Documento aprovado: ${file.name}`);
    }, 2000);
  };

  const iniciarAnalise = async () => {
    setValidationStatus('analyzing');
    setAnalisando(true);
    setProgressoAnalise(0);

    // Etapas detalhadas da análise IA
    const etapasDetalhadas = [
      { id: 1, nome: 'Verificação de autenticidade', tempo: 2000, scoreMin: 85, scoreMax: 98 },
      { id: 2, nome: 'Análise de conformidade legal', tempo: 2500, scoreMin: 88, scoreMax: 96 },
      { id: 3, nome: 'Validação de dados', tempo: 1800, scoreMin: 90, scoreMax: 99 },
      { id: 4, nome: 'Avaliação de risco', tempo: 2200, scoreMin: 82, scoreMax: 95 },
      { id: 5, nome: 'Análise de documentos individuais', tempo: 3000, scoreMin: 87, scoreMax: 97 },
      { id: 6, nome: 'Verificação cruzada de dados', tempo: 1500, scoreMin: 91, scoreMax: 98 },
    ];

    let scoreTotal = 0;

    for (let i = 0; i < etapasDetalhadas.length; i++) {
      const etapa = etapasDetalhadas[i];
      
      // Atualizar status da etapa para "processando"
      setEtapasAnalise(prev => prev.map(e => 
        e.id === etapa.id ? { 
          ...e, 
          status: 'processando', 
          detalhes: `Analisando ${etapa.nome.toLowerCase()}...` 
        } : e
      ));

      // Simular progresso da etapa
      for (let progresso = 0; progresso <= 100; progresso += 20) {
        await new Promise(resolve => setTimeout(resolve, etapa.tempo / 5));
        setEtapasAnalise(prev => prev.map(e => 
          e.id === etapa.id ? { ...e, progresso } : e
        ));
      }

      // Gerar score para a etapa
      const score = Math.floor(Math.random() * (etapa.scoreMax - etapa.scoreMin + 1)) + etapa.scoreMin;
      scoreTotal += score;

      // Finalizar etapa
      setEtapasAnalise(prev => prev.map(e => 
        e.id === etapa.id ? { 
          ...e, 
          status: 'concluida', 
          progresso: 100, 
          score,
          detalhes: `✅ Aprovado com score ${score}%`
        } : e
      ));

      toast.success(`✅ ${etapa.nome} - Score: ${score}%`);
      setProgressoAnalise(((i + 1) / etapasDetalhadas.length) * 100);
    }

    // Calcular score geral
    const scoreGeral = Math.floor(scoreTotal / etapasDetalhadas.length);
    setScoreGeral(scoreGeral);

    // Gerar relatório detalhado
    const relatorio = {
      scoreGeral,
      documentosAnalisados: formData.documentos.length,
      conformidadeLegal: scoreGeral >= 90 ? 'Excelente' : scoreGeral >= 80 ? 'Boa' : 'Regular',
      riscoGeral: scoreGeral >= 90 ? 'Baixo' : scoreGeral >= 80 ? 'Médio' : 'Alto',
      recomendacoes: [
        'Título aprovado para tokenização',
        'Documentação completa e válida',
        'Conformidade legal verificada',
        'Risco operacional dentro dos parâmetros'
      ],
      proximosPassos: 'Prosseguir para configuração da tokenização',
      tempoAnalise: etapasDetalhadas.reduce((acc, etapa) => acc + etapa.tempo, 0) / 1000,
    };

    setAnaliseDetalhada(relatorio);
    setAnalisando(false);
    setValidationStatus('completed');
    toast.success(`🎉 Análise IA concluída! Score Geral: ${scoreGeral}%`);
  };

  const iniciarTokenizacao = async () => {
    setLoadingTokenizacao(true);
    
    // Calcular taxa de 2.5%
    const valorNumerico = parseFloat(formData.valor.replace(/[^\d,]/g, '').replace(',', '.'));
    const taxa = valorNumerico * 0.025;
    const liquido = valorNumerico - taxa;
    
    setTaxaTokenizacao(taxa);
    setValorLiquido(liquido);

    // Simular processo de tokenização
    for (let i = 0; i < etapasTokenizacao.length; i++) {
      const etapa = etapasTokenizacao[i];
      setEtapasTokenizacao(prev =>
        prev.map(e =>
          e.id === etapa.id ? { ...e, status: 'processando', progresso: 0 } : e
        )
      );

      // Simular progresso
      for (let p = 0; p <= 100; p += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setEtapasTokenizacao(prev =>
          prev.map(e => (e.id === etapa.id ? { ...e, progresso: p } : e))
        );
      }

      // Marcar como concluído
      setEtapasTokenizacao(prev =>
        prev.map(e =>
          e.id === etapa.id ? { ...e, status: 'concluido', progresso: 100 } : e
        )
      );

      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Criar token simulado
    const novoToken: TokenCreated = {
      id: `TK-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0')}`,
      tokenId: `TC-${formData.tipo}-${new Date().getFullYear()}-${Math.floor(
        Math.random() * 10000
      )
        .toString()
        .padStart(4, '0')}`,
      titulo: `${formData.tipo} - ${formData.empresa}`,
      valor: valorNumerico,
      tipo: formData.tipo,
      categoria: formData.categoria,
      empresa: formData.empresa,
      blockchain: 'Hyperledger Fabric',
      padrao: 'TributaToken',
      hash: `0x${Array.from({ length: 64 })
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join('')}`,
      dataCreacao: new Date().toISOString(),
      status: 'ativo',
      transferivel: true,
      fracionavel: false,
    };

    setTokenCriado(novoToken);

    // Salvar o token no localStorage
    try {
      const savedTokens = localStorage.getItem('userTokens');
      const tokens = savedTokens ? JSON.parse(savedTokens) : [];
      tokens.push(novoToken);
      localStorage.setItem('userTokens', JSON.stringify(tokens));
    } catch (error) {
      console.error('Erro ao salvar token:', error);
    }

    setTokenizacaoConcluida(true);
    setLoadingTokenizacao(false);
    toast.success('🎉 Tokenização concluída com sucesso!');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('📋 Copiado para a área de transferência!');
  };

  const downloadRecibo = () => {
    const recibo = {
      tokenId: tokenCreated?.tokenId,
      titulo: tokenCreated?.titulo,
      valor: tokenCreated?.valor,
      hash: tokenCreated?.hash,
      blockchain: tokenCreated?.blockchain,
      dataCreacao: tokenCreated?.dataCreacao,
    };
    
    const blob = new Blob([JSON.stringify(recibo, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recibo-token-${tokenCreated?.tokenId}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('📄 Recibo baixado com sucesso!');
  };

  const finalizarEIrParaTokens = () => {
    // Navegar para a página de tokens
    navigate('/dashboard/tokenizacao/meus-tokens');
  };

  const renderEtapa = () => {
    switch (etapaAtual) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Dados Básicos do Título
              </CardTitle>
              <CardDescription>
                Preencha as informações completas e precisas do título de crédito
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tipo de Pessoa */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <Label className="text-base font-medium text-blue-700 mb-3 block">Tipo de Emissor *</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="juridica"
                      name="tipoPessoa"
                      value="juridica"
                      checked={tipoPessoa === 'juridica'}
                      onChange={(e) => setTipoPessoa(e.target.value as 'fisica' | 'juridica')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <label htmlFor="juridica" className="text-sm font-medium text-gray-700">
                      Pessoa Jurídica (Empresa)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="fisica"
                      name="tipoPessoa"
                      value="fisica"
                      checked={tipoPessoa === 'fisica'}
                      onChange={(e) => setTipoPessoa(e.target.value as 'fisica' | 'juridica')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <label htmlFor="fisica" className="text-sm font-medium text-gray-700">
                      Pessoa Física
                    </label>
                  </div>
                </div>
              </div>

              {/* Tipo e Categoria do Título */}
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="tipo">Tipo de Título *</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) => {
                      setFormData({ ...formData, tipo: value });
                      setNaturezaOrigem(value === 'DUPLICATA' || value === 'PRECATORIO' ? 'CAUSAL' : 'ABSTRATO');
                      setPrazoVencimento(calcularPrazoVencimento(value));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ICMS">ICMS - Imposto s/ Circulação de Mercadorias</SelectItem>
                      <SelectItem value="PIS">PIS - Programa de Integração Social</SelectItem>
                      <SelectItem value="COFINS">COFINS - Contribuição p/ Financ. Seguridade</SelectItem>
                      <SelectItem value="IRPJ">IRPJ - Imposto de Renda Pessoa Jurídica</SelectItem>
                      <SelectItem value="PRECATORIO">Precatório - Judicial</SelectItem>
                      <SelectItem value="DUPLICATA">Duplicata Mercantil</SelectItem>
                      <SelectItem value="NOTA_PROMISSORIA">Nota Promissória</SelectItem>
                      <SelectItem value="CHEQUE">Cheque</SelectItem>
                      <SelectItem value="CDB">CDB - Certificado de Depósito Bancário</SelectItem>
                      <SelectItem value="DEBENTURE">Debênture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={value => setFormData({ ...formData, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TRIBUTARIO">Tributário</SelectItem>
                      <SelectItem value="JUDICIAL">Judicial</SelectItem>
                      <SelectItem value="COMERCIAL">Comercial</SelectItem>
                      <SelectItem value="BANCARIO">Bancário</SelectItem>
                      <SelectItem value="RURAL">Rural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="numeroTitulo">Número do Título *</Label>
                  <Input
                    id="numeroTitulo"
                    value={numeroTitulo}
                    onChange={e => setNumeroTitulo(e.target.value)}
                    placeholder="Ex: 2025001, 001/2025"
                  />
                  <p className="text-xs text-gray-500 mt-1">Número único identificador</p>
                </div>
              </div>

              {/* Informações sobre Natureza e Origem */}
              {formData.tipo && (
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Natureza/Origem</Label>
                      <p className="text-sm text-gray-600 bg-white p-2 rounded border">
                        {naturezaOrigem || 'Será preenchido automaticamente'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Prazo Típico</Label>
                      <p className="text-sm text-gray-600 bg-white p-2 rounded border">
                        {prazoVencimento || 'Será preenchido automaticamente'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Dados do Emissor */}
              {tipoPessoa === 'juridica' ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="cnpj">CNPJ *</Label>
                      <div className="relative">
                        <Input
                          id="cnpj"
                          value={formData.cnpj}
                          onChange={(e) => {
                            const formatted = formatCNPJ(e.target.value);
                            setFormData({ ...formData, cnpj: formatted });
                            if (formatted.length === 18 && validateCNPJ(formatted)) {
                              buscarDadosEmpresa(formatted);
                            }
                          }}
                          placeholder="00.000.000/0000-00"
                          className={validateCNPJ(formData.cnpj) ? 'border-green-300' : formData.cnpj ? 'border-red-300' : ''}
                        />
                        {loadingEmpresa && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          </div>
                        )}
                      </div>
                      {formData.cnpj && !validateCNPJ(formData.cnpj) && (
                        <p className="text-xs text-red-500 mt-1">CNPJ inválido</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="empresa">Razão Social *</Label>
                      <Input
                        id="empresa"
                        value={formData.empresa}
                        onChange={e => setFormData({ ...formData, empresa: e.target.value })}
                        placeholder="Nome da empresa emissora"
                        disabled={loadingEmpresa}
                      />
                    </div>
                  </div>

                  {/* Informações da Empresa */}
                  {empresaInfo && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Dados da Empresa (Receita Federal)
                      </h4>
                      <div className="grid gap-3 md:grid-cols-2 text-sm">
                        <div>
                          <span className="text-gray-600">Razão Social:</span>
                          <p className="font-medium">{empresaInfo.razaoSocial}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Nome Fantasia:</span>
                          <p className="font-medium">{empresaInfo.nomeFantasia}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Situação:</span>
                          <Badge className="bg-green-100 text-green-800">{empresaInfo.situacao}</Badge>
                        </div>
                        <div>
                          <span className="text-gray-600">Natureza Jurídica:</span>
                          <p className="font-medium">{empresaInfo.naturezaJuridica}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Endereço:</span>
                          <p className="font-medium">{empresaInfo.endereco.logradouro}, {empresaInfo.endereco.cidade}/{empresaInfo.endereco.uf}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Capital Social:</span>
                          <p className="font-medium">{empresaInfo.capitalSocial}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input
                        id="cpf"
                        value={cpf}
                        onChange={(e) => {
                          const formatted = formatCPF(e.target.value);
                          setCpf(formatted);
                        }}
                        placeholder="000.000.000-00"
                        className={validateCPF(cpf) ? 'border-green-300' : cpf ? 'border-red-300' : ''}
                      />
                      {cpf && !validateCPF(cpf) && (
                        <p className="text-xs text-red-500 mt-1">CPF inválido</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                      <Input
                        id="nomeCompleto"
                        value={nomeCompleto}
                        onChange={e => setNomeCompleto(e.target.value)}
                        placeholder="Nome completo do emissor"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Dados Financeiros */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="valor">Valor do Título (R$) *</Label>
                  <Input
                    id="valor"
                    type="number"
                    value={formData.valor}
                    onChange={e => setFormData({ ...formData, valor: e.target.value })}
                    placeholder="0,00"
                    step="0.01"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Valor nominal do título</p>
                </div>

                <div>
                  <Label htmlFor="vencimento">Data de Vencimento *</Label>
                  <Input
                    id="vencimento"
                    type="date"
                    value={formData.vencimento}
                    onChange={e => setFormData({ ...formData, vencimento: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <p className="text-xs text-gray-500 mt-1">Data limite para pagamento</p>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <Label htmlFor="descricao">Descrição Detalhada *</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descrição detalhada do título de crédito, incluindo origem, finalidade e outras informações relevantes"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Inclua informações sobre a origem do crédito, finalidade e outros detalhes importantes
                </p>
              </div>

              {/* Resumo de Validação */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-700 mb-2">Status de Preenchimento</h4>
                <div className="grid gap-2 md:grid-cols-2 text-sm">
                  <div className="flex items-center gap-2">
                    {formData.tipo ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-gray-400" />}
                    <span>Tipo e categoria do título</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {numeroTitulo ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-gray-400" />}
                    <span>Número do título</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {tipoPessoa === 'juridica' 
                      ? (validateCNPJ(formData.cnpj) && formData.empresa ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-gray-400" />)
                      : (validateCPF(cpf) && nomeCompleto ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-gray-400" />)
                    }
                    <span>Dados do emissor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {formData.valor && formData.vencimento ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-gray-400" />}
                    <span>Dados financeiros</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Documentação Obrigatória
              </CardTitle>
              <CardDescription>
                Envie os documentos necessários para validação do título
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.tipo && documentosObrigatorios[formData.tipo] ? (
                <div className="grid gap-4">
                  {documentosObrigatorios[formData.tipo].map(doc => {
                    const docEnviado = formData.documentos.find(d => d.tipo === doc.tipo);
                    return (
                      <div key={doc.tipo} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{doc.nome}</h4>
                            {doc.obrigatorio && (
                              <Badge variant="destructive" className="text-xs">
                                Obrigatório
                              </Badge>
                            )}
                          </div>
                          {docEnviado && (
                            <Badge
                              variant={
                                docEnviado.status === 'aprovado'
                                  ? 'default'
                                  : docEnviado.status === 'rejeitado'
                                    ? 'destructive'
                                    : 'secondary'
                              }
                            >
                              {docEnviado.status === 'aprovado' && <CheckCircle className="w-3 h-3 mr-1" />}
                              {docEnviado.status === 'analisando' && <Clock className="w-3 h-3 mr-1" />}
                              {docEnviado.status === 'rejeitado' && <AlertCircle className="w-3 h-3 mr-1" />}
                              {docEnviado.status}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{doc.descricao}</p>
                        <p className="text-xs text-muted-foreground mb-2">
                          Formatos aceitos: {doc.formatos.join(', ')}
                        </p>
                        <input
                          type="file"
                          accept={doc.formatos.map(f => `.${f}`).join(',')}
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleUploadDocumento(file, doc.tipo);
                            }
                          }}
                          className="hidden"
                          id={`upload-${doc.tipo}`}
                        />
                        <label
                          htmlFor={`upload-${doc.tipo}`}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-md cursor-pointer hover:bg-gray-50"
                        >
                          <Upload className="w-4 h-4" />
                          {docEnviado ? 'Alterar arquivo' : 'Selecionar arquivo'}
                        </label>
                        {docEnviado && (
                          <p className="text-sm text-green-600 mt-2">
                            ✅ {docEnviado.nome} - {docEnviado.observacoes}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Selecione um tipo de título na etapa anterior para ver os documentos necessários.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="border-2 border-gradient-to-r from-blue-200 to-purple-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-blue-600" />
                Validação com Inteligência Artificial
              </CardTitle>
              <CardDescription className="text-base">
                Sistema de IA avançado com análise detalhada e scoring inteligente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {validationStatus === 'pending' && (
                <div className="text-center py-8">
                  <div className="relative">
                    <Sparkles className="w-20 h-20 mx-auto text-blue-500 mb-4 animate-pulse" />
                    <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-blue-200 rounded-full animate-ping"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-blue-700">🚀 IA Pronta para Análise Completa</h3>
                  <p className="text-gray-600 mb-6 text-base">
                    Sistema preparado para análise multicamadas com scoring detalhado
                  </p>
                  <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <FileCheck className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-green-700">{formData.documentos.length} documentos</p>
                      <p className="text-xs text-green-600">Prontos para análise</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <Brain className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-blue-700">6 algoritmos</p>
                      <p className="text-xs text-blue-600">Verificação IA</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-purple-700">Score detalhado</p>
                      <p className="text-xs text-purple-600">Por categoria</p>
                    </div>
                  </div>
                  <Alert className="max-w-md mx-auto bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-700">
                      <strong>Análise multicamadas:</strong> Autenticidade, conformidade legal, validação de dados, avaliação de risco, análise documental e verificação cruzada.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {validationStatus === 'analyzing' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="relative">
                      <Brain className="w-12 h-12 mx-auto text-blue-500 mb-4 animate-pulse" />
                      <div className="absolute inset-0 w-12 h-12 mx-auto border-2 border-blue-300 rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-lg font-bold text-blue-700 mb-2">🔍 IA Analisando com Precisão</h3>
                    <p className="text-gray-600">Sistema multicamadas processando dados...</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-blue-700">Progresso Geral</span>
                      <span className="text-sm font-bold text-blue-600">{progressoAnalise.toFixed(0)}%</span>
                    </div>
                    <Progress value={progressoAnalise} className="w-full h-3 mb-4" />
                  </div>

                  <div className="grid gap-3">
                    {etapasAnalise.map((etapa) => (
                      <div key={etapa.id} className={`p-4 rounded-lg border transition-all ${
                        etapa.status === 'processando' ? 'bg-blue-50 border-blue-200' :
                        etapa.status === 'concluida' ? 'bg-green-50 border-green-200' :
                        'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {etapa.status === 'processando' && <Zap className="w-4 h-4 text-blue-500 animate-pulse" />}
                            {etapa.status === 'concluida' && <CheckCircle className="w-4 h-4 text-green-500" />}
                            {etapa.status === 'pendente' && <Clock className="w-4 h-4 text-gray-400" />}
                            <span className={`text-sm font-medium ${
                              etapa.status === 'processando' ? 'text-blue-700' :
                              etapa.status === 'concluida' ? 'text-green-700' :
                              'text-gray-600'
                            }`}>{etapa.nome}</span>
                          </div>
                          {etapa.status === 'concluida' && (
                            <Badge className="bg-green-100 text-green-800">
                              Score: {etapa.score}%
                            </Badge>
                          )}
                        </div>
                        {etapa.status !== 'pendente' && (
                          <>
                            <Progress value={etapa.progresso} className="w-full h-2 mb-2" />
                            <p className="text-xs text-gray-600">{etapa.detalhes}</p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {validationStatus === 'completed' && analiseDetalhada && (
                <div className="space-y-6">
                  <div className="text-center py-6">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{scoreGeral}%</span>
                      </div>
                      <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-green-200 rounded-full animate-pulse"></div>
                    </div>
                    <h3 className="text-2xl font-bold text-green-700 mb-3">
                      🎉 Análise IA Concluída!
                    </h3>
                    <p className="text-gray-600 mb-4 text-base">
                      Score Geral: <span className="font-bold text-green-600">{scoreGeral}%</span> - {analiseDetalhada.conformidadeLegal}
                    </p>
                  </div>

                  {/* Relatório Detalhado */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      Relatório Detalhado da Análise
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-gray-700">Documentos</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">{analiseDetalhada.documentosAnalisados}</p>
                        <p className="text-sm text-gray-600">Analisados com IA</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-gray-700">Conformidade</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">{analiseDetalhada.conformidadeLegal}</p>
                        <p className="text-sm text-gray-600">Legal aprovada</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          <span className="font-medium text-gray-700">Risco</span>
                        </div>
                        <p className="text-2xl font-bold text-yellow-600">{analiseDetalhada.riscoGeral}</p>
                        <p className="text-sm text-gray-600">Nível detectado</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-3">Scores por Categoria:</h5>
                        <div className="space-y-2">
                          {etapasAnalise.map((etapa) => (
                            <div key={etapa.id} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">{etapa.nome}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-500 h-2 rounded-full" 
                                    style={{ width: `${etapa.score}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-green-600">{etapa.score}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-3">Recomendações:</h5>
                        <div className="space-y-2">
                          {analiseDetalhada.recomendacoes.map((rec, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-700">Próximos Passos</span>
                      </div>
                      <p className="text-sm text-blue-600">{analiseDetalhada.proximosPassos}</p>
                      <p className="text-xs text-blue-500 mt-1">
                        Tempo de análise: {analiseDetalhada.tempoAnalise}s
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="border-2 border-gradient-to-r from-purple-200 to-pink-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-6 w-6 text-purple-600" />
                Configuração da Tokenização
              </CardTitle>
              <CardDescription className="text-base">
                Configure as opções do seu token digital antes da criação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {tokenizationStatus === 'pending' && (
                <div className="space-y-8">
                  {/* Header de status */}
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                        <Rocket className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-purple-200 rounded-full animate-ping"></div>
                    </div>
                    <h3 className="text-2xl font-bold text-purple-700 mb-3">🎯 Sistema Pronto para Tokenização</h3>
                    <p className="text-gray-600 text-base">
                      Título validado com score <span className="font-bold text-green-600">{scoreGeral}%</span>. Configure as opções abaixo e revise o resumo antes de prosseguir.
                    </p>
                  </div>

                  {/* Resumo Completo da Operação */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border-2 border-blue-200">
                    <div className="text-center mb-6">
                      <h4 className="text-2xl font-bold text-blue-700 mb-2">📋 Resumo da Operação</h4>
                      <p className="text-blue-600">Revise todos os detalhes antes de prosseguir para a tokenização</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Dados do Título */}
                      <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-md">
                        <div className="flex items-center gap-2 mb-4">
                          <FileText className="w-6 h-6 text-blue-600" />
                          <h5 className="font-bold text-blue-700">Dados do Título</h5>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">Tipo:</p>
                            <p className="font-semibold text-gray-800">{formData.tipo}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Categoria:</p>
                            <p className="font-semibold text-gray-800">{formData.categoria}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Empresa Emitente:</p>
                            <p className="font-semibold text-gray-800">{formData.empresa}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">CNPJ:</p>
                            <p className="font-mono text-sm text-gray-800">{formData.cnpj}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Vencimento:</p>
                            <p className="font-semibold text-gray-800">{formData.vencimento}</p>
                          </div>
                        </div>
                      </div>

                      {/* Valores Financeiros */}
                      <div className="bg-white p-6 rounded-xl border border-green-100 shadow-md">
                        <div className="flex items-center gap-2 mb-4">
                          <DollarSign className="w-6 h-6 text-green-600" />
                          <h5 className="font-bold text-green-700">Valores Financeiros</h5>
                        </div>
                        <div className="space-y-3">
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">Valor do Título:</p>
                            <p className="font-bold text-green-700 text-xl">
                              {formatCurrency(parseFloat(formData.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0)}
                            </p>
                          </div>
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">Taxa Plataforma (2.5%):</p>
                            <p className="font-bold text-orange-600 text-lg">
                              {formatCurrency(calculateStandardFee(parseFloat(formData.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0))}
                            </p>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">Valor Líquido:</p>
                            <p className="font-bold text-blue-600 text-lg">
                              {formatCurrency((parseFloat(formData.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0) - calculateStandardFee(parseFloat(formData.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0))}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Análise de Validação */}
                      <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-md">
                        <div className="flex items-center gap-2 mb-4">
                          <Brain className="w-6 h-6 text-purple-600" />
                          <h5 className="font-bold text-purple-700">Validação IA</h5>
                        </div>
                        <div className="space-y-3">
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">Score Geral:</p>
                            <p className="font-bold text-purple-700 text-2xl">{scoreGeral}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Status:</p>
                            <Badge className="bg-green-100 text-green-800">✅ Aprovado</Badge>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Documentos:</p>
                            <p className="font-semibold text-gray-800">{formData.documentos.length} validados</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Conformidade:</p>
                            <p className="font-semibold text-green-600">
                              {scoreGeral >= 90 ? 'Excelente' : scoreGeral >= 80 ? 'Boa' : 'Regular'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Descrição do Título */}
                    <div className="mt-6 bg-white p-6 rounded-xl border border-blue-100 shadow-md">
                      <div className="flex items-center gap-2 mb-3">
                        <FileCheck className="w-5 h-5 text-blue-600" />
                        <h5 className="font-bold text-blue-700">Descrição do Título</h5>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {formData.descricao || 'Título de crédito para tokenização digital conforme configurações especificadas acima.'}
                      </p>
                    </div>
                  </div>

                  {/* Calculadora de Custos */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Calculator className="w-6 h-6 text-purple-600" />
                      <h4 className="text-lg font-bold text-purple-700">Cálculo de Custos</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-gray-700">Valor do Título</span>
                        </div>
                        <p className="text-xl font-bold text-green-600">
                          {formatCurrency(parseFloat(formData.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0)}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <Percent className="w-5 h-5 text-orange-600" />
                          <span className="font-medium text-gray-700">Taxa Plataforma (2.5%)</span>
                        </div>
                        <p className="text-xl font-bold text-orange-600">
                          {formatCurrency(calculateStandardFee(parseFloat(formData.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0))}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <Coins className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-gray-700">Valor Líquido</span>
                        </div>
                        <p className="text-xl font-bold text-blue-600">
                          {formatCurrency((parseFloat(formData.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0) - calculateStandardFee(parseFloat(formData.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0))}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Configurações da Tokenização */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Settings className="w-6 h-6 text-purple-600" />
                      <h4 className="text-lg font-bold text-purple-700">Configurações do Token</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 hover:shadow-md transition-all">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Database className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-bold text-blue-800">Blockchain</span>
                        </div>
                        <p className="text-sm text-blue-700 font-bold">Hyperledger Fabric v2.5</p>
                        <p className="text-xs text-blue-600">Rede empresarial de alta performance</p>
                        <div className="mt-2 flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-600 font-medium">Ativo</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200 hover:shadow-md transition-all">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                            <Gem className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-bold text-purple-800">Padrão</span>
                        </div>
                        <p className="text-sm text-purple-700 font-bold">TributaToken (TTC)</p>
                        <p className="text-xs text-purple-600">Token não-fungível certificado</p>
                        <div className="mt-2 flex items-center gap-1">
                          <Award className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-yellow-600 font-medium">Premium</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200 hover:shadow-md transition-all">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-bold text-green-800">Transferível</span>
                        </div>
                        <p className="text-sm text-green-700 font-bold">✅ Sim</p>
                        <p className="text-xs text-green-600">Marketplace integrado</p>
                        <div className="mt-2 flex items-center gap-1">
                          <Store className="w-3 h-3 text-blue-500" />
                          <span className="text-xs text-blue-600 font-medium">Marketplace</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200 hover:shadow-md transition-all">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                            <Gem className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-bold text-orange-800">Fracionável</span>
                        </div>
                        <p className="text-sm text-orange-700 font-bold">❌ Não</p>
                        <p className="text-xs text-orange-600">Token único indivisível</p>
                        <div className="mt-2 flex items-center gap-1">
                          <Shield className="w-3 h-3 text-indigo-500" />
                          <span className="text-xs text-indigo-600 font-medium">Seguro</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estimativas */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-6 h-6 text-green-600" />
                      <h4 className="text-lg font-bold text-green-700">Estimativas do Processo</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-3">Tempo Estimado:</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Preparação de metadados</span>
                            <span className="text-sm font-medium text-blue-600">30-60s</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Criação do token</span>
                            <span className="text-sm font-medium text-blue-600">60-90s</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Registro blockchain</span>
                            <span className="text-sm font-medium text-blue-600">90-120s</span>
                          </div>
                          <div className="flex justify-between items-center font-medium">
                            <span className="text-gray-700">Total estimado</span>
                            <span className="text-green-600">3-4 minutos</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-3">O que será criado:</h5>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-600">Token único identificável</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-600">Metadados completos</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-600">Hash criptográfico</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-600">Registro imutável</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confirmação de Configuração */}
                  <div className="text-center py-6">
                    <div className="mb-4">
                      <Alert className="max-w-md mx-auto bg-purple-50 border-purple-200">
                        <AlertCircle className="h-4 w-4 text-purple-600" />
                        <AlertDescription className="text-purple-700">
                          <strong>Configuração concluída!</strong> Revise as configurações acima e prossiga para a próxima etapa para iniciar a tokenização.
                        </AlertDescription>
                      </Alert>
                    </div>
                    <div className="flex gap-4 justify-center">
                      <Button 
                        onClick={() => navigate('/dashboard/tokenizacao/meus-tokens')}
                        variant="outline"
                        className="border-purple-300 text-purple-700 hover:bg-purple-50"
                      >
                        <Coins className="w-5 h-5 mr-2" />
                        Ver Meus Tokens
                      </Button>
                      <Button 
                        onClick={proximaEtapa}
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 font-bold"
                      >
                        Continuar para Tokenização
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      Processo seguro e auditável • Blockchain Hyperledger Fabric
                    </p>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card className="border-2 border-gradient-to-r from-indigo-200 to-purple-200 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-indigo-600" />
                Criação na Blockchain
              </CardTitle>
              <CardDescription className="text-base">
                Processo completo de tokenização e registro na blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Estado: Pronto para iniciar */}
              {tokenizationStatus === 'pending' && (
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                        <Rocket className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-indigo-200 rounded-full animate-ping"></div>
                      <div className="absolute inset-0 w-32 h-32 mx-auto border-2 border-purple-100 rounded-full animate-pulse"></div>
                    </div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                      🚀 Sistema Pronto para Lançamento
                    </h3>
                    <p className="text-gray-600 text-lg mb-6">
                      Sua configuração está completa. Vamos criar seu token na blockchain Hyperledger Fabric!
                    </p>
                  </div>

                  {/* Resumo Completo da Operação */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-2xl border border-indigo-200">
                    <div className="text-center mb-6">
                      <h4 className="text-2xl font-bold text-indigo-700 mb-2">📋 Detalhes Completos da Operação</h4>
                      <p className="text-indigo-600">Revise todos os aspectos da tokenização antes de prosseguir</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Dados do Título */}
                      <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-lg">
                        <div className="flex items-center gap-2 mb-4">
                          <FileText className="w-6 h-6 text-indigo-600" />
                          <h5 className="font-bold text-indigo-700">Dados do Título</h5>
                        </div>
                        <div className="space-y-3">
                          <div className="bg-indigo-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">Tipo do Título:</p>
                            <p className="font-bold text-indigo-700">{formData.tipo}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Categoria:</p>
                            <p className="font-semibold text-gray-800">{formData.categoria}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Empresa Emitente:</p>
                            <p className="font-semibold text-gray-800">{formData.empresa}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">CNPJ:</p>
                            <p className="font-mono text-sm text-gray-800">{formData.cnpj}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Data de Vencimento:</p>
                            <p className="font-semibold text-gray-800">{formData.vencimento}</p>
                          </div>
                        </div>
                      </div>

                      {/* Valores e Custos */}
                      <div className="bg-white p-6 rounded-xl border border-green-100 shadow-lg">
                        <div className="flex items-center gap-2 mb-4">
                          <DollarSign className="w-6 h-6 text-green-600" />
                          <h5 className="font-bold text-green-700">Valores e Custos</h5>
                        </div>
                        <div className="space-y-3">
                          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <p className="text-sm text-gray-600">Valor Original do Título:</p>
                            <p className="font-bold text-green-700 text-xl">
                              {formatCurrency(parseFloat(formData.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0)}
                            </p>
                          </div>
                          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                            <p className="text-sm text-gray-600">Taxa de Tokenização (2.5%):</p>
                            <p className="font-bold text-orange-600 text-lg">
                              {formatCurrency(calculateStandardFee(parseFloat(formData.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0))}
                            </p>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <p className="text-sm text-gray-600">Valor Líquido Recebido:</p>
                            <p className="font-bold text-blue-600 text-lg">
                              {formatCurrency((parseFloat(formData.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0) - calculateStandardFee(parseFloat(formData.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0))}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Token Digital */}
                      <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-lg">
                        <div className="flex items-center gap-2 mb-4">
                          <Gem className="w-6 h-6 text-purple-600" />
                          <h5 className="font-bold text-purple-700">Token Digital</h5>
                        </div>
                        <div className="space-y-3">
                          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                            <p className="text-sm text-gray-600">Padrão do Token:</p>
                            <p className="font-bold text-purple-700">TributaToken (TTC)</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Blockchain:</p>
                            <p className="font-semibold text-gray-800">Hyperledger Fabric v2.5</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Tipo:</p>
                            <p className="font-semibold text-gray-800">NFT Único (Não Fungível)</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Transferível:</p>
                            <p className="font-semibold text-green-600">✅ Sim</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Fracionável:</p>
                            <p className="font-semibold text-red-600">❌ Não</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Análise de Validação */}
                    <div className="mt-6 bg-white p-6 rounded-xl border border-indigo-100 shadow-lg">
                      <div className="flex items-center gap-2 mb-4">
                        <Brain className="w-6 h-6 text-indigo-600" />
                        <h5 className="font-bold text-indigo-700">Resultados da Validação IA</h5>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                          <p className="text-sm text-gray-600">Score Geral:</p>
                          <p className="font-bold text-indigo-700 text-3xl">{scoreGeral}%</p>
                          <p className="text-sm text-indigo-600">Aprovado para tokenização</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <p className="text-sm text-gray-600">Conformidade Legal:</p>
                          <p className="font-bold text-green-700 text-lg">
                            {scoreGeral >= 90 ? 'Excelente' : scoreGeral >= 80 ? 'Boa' : 'Regular'}
                          </p>
                          <p className="text-sm text-green-600">Documento em conformidade</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <p className="text-sm text-gray-600">Documentos:</p>
                          <p className="font-bold text-purple-700 text-lg">{formData.documentos.length} validados</p>
                          <p className="text-sm text-purple-600">Todos os requisitos atendidos</p>
                        </div>
                      </div>
                    </div>

                    {/* Descrição Detalhada */}
                    <div className="mt-6 bg-white p-6 rounded-xl border border-indigo-100 shadow-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <FileCheck className="w-5 h-5 text-indigo-600" />
                        <h5 className="font-bold text-indigo-700">Descrição do Título</h5>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <p className="text-gray-700 leading-relaxed">
                          {formData.descricao || `Título de crédito ${formData.tipo} emitido por ${formData.empresa}, com vencimento em ${formData.vencimento}, no valor de ${formatCurrency(parseFloat(formData.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0)}, destinado à tokenização digital através da plataforma Tributa.AI para fins de negociação e transferência de propriedade.`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Termo de Cessão de Direitos */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-2xl border-2 border-yellow-300">
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <Shield className="w-8 h-8 text-yellow-600" />
                        <h4 className="text-2xl font-bold text-yellow-700">⚖️ Termo de Cessão de Direitos</h4>
                        <Shield className="w-8 h-8 text-yellow-600" />
                      </div>
                      <p className="text-yellow-600 font-medium">Leia atentamente e aceite os termos para prosseguir</p>
                    </div>
                    
                    <div className="bg-white p-8 rounded-xl border-2 border-yellow-200 shadow-lg max-h-96 overflow-y-auto">
                      <div className="space-y-6">
                        <div className="text-center mb-6">
                          <h5 className="text-xl font-bold text-gray-800 mb-2">TERMO DE CESSÃO DE DIREITOS CREDITÓRIOS</h5>
                          <p className="text-sm text-gray-600">TOKENIZAÇÃO DE TÍTULO DE CRÉDITO</p>
                        </div>

                        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                          <p><strong>CEDENTE:</strong> {formData.empresa}, inscrita no CNPJ nº {formData.cnpj}, doravante denominada "CEDENTE"</p>
                          
                          <p><strong>CESSIONÁRIO:</strong> TRIBUTA.AI TECNOLOGIA LTDA, plataforma de tokenização de ativos, doravante denominada "CESSIONÁRIO"</p>

                          <div>
                            <p><strong>OBJETO DA CESSÃO:</strong></p>
                            <ul className="list-disc ml-6 mt-2 space-y-1">
                              <li>Título de crédito do tipo: <strong>{formData.tipo}</strong></li>
                              <li>Categoria: <strong>{formData.categoria}</strong></li>
                              <li>Valor nominal: <strong>{formatCurrency(parseFloat(formData.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0)}</strong></li>
                              <li>Data de vencimento: <strong>{formData.vencimento}</strong></li>
                            </ul>
                          </div>

                          <div>
                            <p><strong>CLÁUSULAS E CONDIÇÕES:</strong></p>
                            <ol className="list-decimal ml-6 mt-2 space-y-2">
                              <li><strong>DA CESSÃO:</strong> O CEDENTE cede e transfere ao CESSIONÁRIO todos os direitos, ações e pretensões que possui sobre o título de crédito descrito, para fins de tokenização digital na blockchain Hyperledger Fabric.</li>
                              
                              <li><strong>DA TOKENIZAÇÃO:</strong> O título será convertido em token digital não-fungível (NFT), seguindo o padrão TributaToken (TTC), permitindo sua negociação e transferência através da plataforma digital.</li>
                              
                              <li><strong>DAS OBRIGAÇÕES:</strong> O CEDENTE declara ser legítimo proprietário do crédito e que este está livre de ônus, gravames ou restrições de qualquer natureza.</li>
                              
                              <li><strong>DA REMUNERAÇÃO:</strong> A tokenização envolve uma taxa de serviço de 2,5% sobre o valor nominal, resultando em valor líquido de <strong>{formatCurrency((parseFloat(formData.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0) - calculateStandardFee(parseFloat(formData.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0))}</strong>.</li>
                              
                              <li><strong>DA TECNOLOGIA:</strong> O token será registrado na blockchain Hyperledger Fabric, garantindo imutabilidade, rastreabilidade e segurança criptográfica do ativo digital.</li>
                              
                              <li><strong>DA TRANSFERIBILIDADE:</strong> O token poderá ser negociado, vendido ou transferido através da plataforma Tributa.AI ou mercados secundários compatíveis.</li>
                              
                              <li><strong>DAS GARANTIAS:</strong> O CEDENTE garante a veracidade das informações prestadas e a validade jurídica do título cedido.</li>
                              
                              <li><strong>DA LEGISLAÇÃO:</strong> Esta cessão é regida pelo Código Civil Brasileiro (Lei 10.406/2002), artigos 286 a 298, e demais normas aplicáveis.</li>
                              
                              <li><strong>DO FORO:</strong> Fica eleito o foro da comarca de São Paulo/SP para dirimir eventuais controvérsias.</li>
                            </ol>
                          </div>

                          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <p className="text-red-700 font-medium text-center">
                              ⚠️ <strong>ATENÇÃO:</strong> A assinatura deste termo implica na cessão definitiva dos direitos sobre o título de crédito. 
                              O processo de tokenização é irreversível. Certifique-se de ter lido e compreendido todos os termos antes de prosseguir.
                            </p>
                          </div>

                          <div className="text-center">
                            <p className="text-gray-600">Data e hora: <strong>{new Date().toLocaleString('pt-BR')}</strong></p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Checkbox de Aceitação */}
                    <div className="mt-6 bg-white p-6 rounded-xl border border-yellow-200">
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          id="termo-aceito"
                          checked={termoAssinado}
                          onChange={(e) => setTermoAssinado(e.target.checked)}
                          className="w-5 h-5 mt-1 accent-yellow-600"
                        />
                        <label htmlFor="termo-aceito" className="text-gray-700 leading-relaxed">
                          <strong>Declaro que:</strong> Li, compreendi e aceito integralmente todos os termos e condições desta cessão de direitos creditórios. 
                          Confirmo ser o legítimo proprietário do título de crédito e autorizo sua tokenização através da plataforma Tributa.AI. 
                          Estou ciente de que este processo é irreversível e que o token digital criado representará os direitos aqui cedidos.
                        </label>
                      </div>
                      
                      {termoAssinado && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <p className="text-green-700 font-medium">
                              ✅ Termo aceito e assinado digitalmente em {new Date().toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botão Principal para Iniciar */}
                  <div className="text-center py-6">
                    <div className="mb-6">
                      <Alert className={`max-w-lg mx-auto ${termoAssinado ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200' : 'bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200'}`}>
                        {termoAssinado ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <AlertDescription className="text-green-700 text-base">
                              <strong>🎯 Pronto para tokenizar!</strong> Termo assinado com sucesso. Clique no botão abaixo para iniciar a criação do seu token na blockchain.
                            </AlertDescription>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <AlertDescription className="text-red-700 text-base">
                              <strong>⚠️ Ação requerida!</strong> É necessário ler e aceitar o termo de cessão de direitos antes de prosseguir com a tokenização.
                            </AlertDescription>
                          </>
                        )}
                      </Alert>
                    </div>
                    <Button 
                      onClick={iniciarTokenizacao}
                      size="lg"
                      disabled={!termoAssinado}
                      className={`px-16 py-6 text-xl font-bold transform transition-all duration-300 shadow-2xl ${
                        termoAssinado 
                          ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white hover:scale-105' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Rocket className="w-8 h-8 mr-4" />
                      {termoAssinado ? 'INICIAR TOKENIZAÇÃO' : 'ASSINE O TERMO PARA CONTINUAR'}
                      <Sparkles className="w-8 h-8 ml-4" />
                    </Button>
                    <p className="text-sm text-gray-500 mt-4">
                      🔒 Processo criptograficamente seguro • ⛓️ Hyperledger Fabric • ✅ Auditável • ⚖️ Juridicamente válido
                    </p>
                  </div>
                </div>
              )}

              {/* Estados de Processamento */}
              {(tokenizationStatus === 'configuring' || tokenizationStatus === 'minting') && (
                <div className="space-y-8">
                  {/* Header com animação */}
                  <div className="text-center">
                    <div className="relative mb-8">
                      <div className="w-32 h-32 mx-auto">
                        {/* Círculos animados */}
                        <div className="absolute inset-0 rounded-full border-4 border-indigo-200 animate-ping"></div>
                        <div className="absolute inset-4 rounded-full border-4 border-purple-200 animate-pulse"></div>
                        <div className="absolute inset-8 rounded-full border-4 border-pink-200 animate-bounce"></div>
                        {/* Centro com ícone */}
                        <div className="absolute inset-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                          <Zap className="w-8 h-8 text-white animate-pulse" />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-indigo-700 mb-3">
                      {tokenizationStatus === 'configuring' ? '⚙️ Configurando Blockchain' : '🔨 Criando Token'}
                    </h3>
                    <p className="text-gray-600 text-lg">{currentTokenizationStep}</p>
                  </div>

                  {/* Barra de Progresso Avançada */}
                  <div className="space-y-4">
                    <div className="relative">
                      <Progress value={progressoTokenizacao} className="w-full h-6" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-white drop-shadow-lg">
                          {progressoTokenizacao.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Progresso da tokenização</span>
                      <span className="font-medium text-indigo-600">
                        {progressoTokenizacao < 30 ? '🔄 Preparando...' : 
                         progressoTokenizacao < 70 ? '⚡ Processando...' : 
                         '🎯 Finalizando...'}
                      </span>
                    </div>
                  </div>

                  {/* Visualização de Blocos */}
                  <div className="bg-gradient-to-r from-gray-900 to-indigo-900 p-8 rounded-2xl border-2 border-indigo-300">
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-bold text-white mb-2">⛓️ Blockchain em Tempo Real</h4>
                      <p className="text-indigo-200">Visualize a criação dos blocos na rede</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Bloco Anterior */}
                      <div className="bg-green-500 bg-opacity-20 border border-green-400 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-green-300 font-medium">Bloco #1847</span>
                        </div>
                        <p className="text-xs text-green-200">Hash: 0x8f2a...9c1d</p>
                        <p className="text-xs text-green-200">✅ Confirmado</p>
                      </div>
                      
                      {/* Bloco Atual */}
                      <div className="bg-purple-500 bg-opacity-30 border-2 border-purple-400 p-4 rounded-lg animate-pulse">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                          <span className="text-purple-200 font-bold">Bloco #1848</span>
                        </div>
                        <p className="text-xs text-purple-200">🔨 Seu Token</p>
                        <p className="text-xs text-purple-200">⚡ Minerando...</p>
                      </div>
                      
                      {/* Próximo Bloco */}
                      <div className="bg-gray-500 bg-opacity-20 border border-gray-400 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                          <span className="text-gray-300 font-medium">Bloco #1849</span>
                        </div>
                        <p className="text-xs text-gray-300">Hash: Aguardando...</p>
                        <p className="text-xs text-gray-300">⏳ Pendente</p>
                      </div>
                    </div>
                    
                    {/* Informações técnicas */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="bg-black bg-opacity-30 p-3 rounded-lg">
                        <p className="text-xs text-indigo-200">Nodes Ativos</p>
                        <p className="text-white font-bold">47 / 50</p>
                      </div>
                      <div className="bg-black bg-opacity-30 p-3 rounded-lg">
                        <p className="text-xs text-indigo-200">Confirmações</p>
                        <p className="text-white font-bold">{Math.floor(progressoTokenizacao / 10)} / 10</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Técnico */}
                  <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="w-5 h-5 text-indigo-600 animate-pulse" />
                      <p className="text-lg font-bold text-indigo-700">Status Técnico</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-indigo-600 font-medium">Processo Atual:</p>
                        <p className="text-indigo-800 font-bold">{currentTokenizationStep}</p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-600 font-medium">Tempo Estimado:</p>
                        <p className="text-indigo-800 font-bold">
                          {progressoTokenizacao < 50 ? '2-3 minutos restantes' : '30-60 segundos restantes'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Estado de Sucesso */}
              {tokenizationStatus === 'completed' && tokenCreated && (
                <div className="space-y-8">
                  {/* Header de Sucesso */}
                  <div className="text-center">
                    <div className="relative mb-8">
                      {/* Efeito de celebração */}
                      <div className="absolute -inset-4">
                        <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-ping opacity-20"></div>
                      </div>
                      <div className="relative w-32 h-32 mx-auto bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
                        <CheckCircle className="w-16 h-16 text-white" />
                      </div>
                      {/* Sparkles */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
                        <Sparkles className="w-8 h-8 text-yellow-400 animate-bounce" />
                      </div>
                      <div className="absolute bottom-0 left-1/4 transform translate-y-4">
                        <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
                      </div>
                      <div className="absolute bottom-0 right-1/4 transform translate-y-4">
                        <Award className="w-6 h-6 text-yellow-400 animate-pulse" />
                      </div>
                    </div>
                    <h3 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                      🎉 Token Criado com Sucesso!
                    </h3>
                    <p className="text-gray-600 text-xl mb-2">
                      Seu título foi tokenizado e está disponível na blockchain
                    </p>
                    <p className="text-emerald-600 font-semibold text-lg">
                      ✨ Ativo digital único e verificável criado!
                    </p>
                  </div>

                  {/* Certificado de Tokenização */}
                  <div className="bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 p-8 rounded-2xl border-2 border-emerald-200 shadow-xl">
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <Award className="w-8 h-8 text-emerald-600" />
                        <h4 className="text-2xl font-bold text-emerald-700">Certificado de Tokenização</h4>
                        <Gem className="w-8 h-8 text-emerald-600" />
                      </div>
                      <p className="text-emerald-600 font-medium">Documento oficial de criação do ativo digital</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-md">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Token ID</p>
                            <p className="font-mono font-bold text-emerald-700 text-lg">{tokenCreated.tokenId}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(tokenCreated.tokenId)}
                            className="border-emerald-300"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Padrão:</span>
                            <span className="font-medium text-emerald-700">TributaToken (TTC)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tipo:</span>
                            <span className="font-medium">NFT Único</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-md">
                        <p className="text-sm text-gray-600 mb-1">Valor Tokenizado</p>
                        <p className="font-bold text-emerald-700 text-2xl mb-4">
                          {formatCurrency(tokenCreated.valor)}
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Empresa:</span>
                            <span className="font-medium text-gray-800">{tokenCreated.empresa}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Categoria:</span>
                            <span className="font-medium">{tokenCreated.categoria}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-md">
                        <p className="text-sm text-gray-600 mb-1">Blockchain</p>
                        <p className="font-bold text-indigo-700 text-lg mb-2">{tokenCreated.blockchain}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Rede:</span>
                            <span className="font-medium">Hyperledger Fabric v2.5</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <Badge className="bg-emerald-100 text-emerald-800">Ativo</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-md">
                        <p className="text-sm text-gray-600 mb-1">Data de Criação</p>
                        <p className="font-bold text-gray-800 text-lg mb-2">
                          {new Date(tokenCreated.dataCreacao).toLocaleString('pt-BR')}
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Transferível:</span>
                            <span className="font-medium text-green-600">✅ Sim</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Fracionável:</span>
                            <span className="font-medium text-red-600">❌ Não</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Hash da Transação */}
                    <div className="mt-6 bg-white p-6 rounded-xl border border-emerald-100 shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-2">Hash da Transação Blockchain</p>
                          <p className="font-mono text-sm text-emerald-700 break-all">{tokenCreated.hash}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(tokenCreated.hash)}
                          className="border-emerald-300 ml-4"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Ações Finais */}
                  <div className="text-center space-y-6">
                    <div className="flex flex-wrap gap-4 justify-center">
                      <Button 
                        onClick={downloadRecibo} 
                        variant="outline"
                        className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Baixar Certificado
                      </Button>
                      <Button 
                        onClick={() => window.open('https://explorer.hyperledger.com', '_blank')} 
                        variant="outline"
                        className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                      >
                        <ExternalLink className="w-5 h-5 mr-2" />
                        Ver na Blockchain
                      </Button>
                      <Button 
                        onClick={finalizarEIrParaTokens} 
                        className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-3 font-bold"
                      >
                        <Coins className="w-5 h-5 mr-2" />
                        Ver Meus Tokens
                      </Button>
                    </div>
                    
                    {/* Próximos passos */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                      <h5 className="font-bold text-blue-700 mb-3">🎯 Próximos Passos</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Store className="w-6 h-6 text-blue-600" />
                          </div>
                          <p className="text-sm font-medium text-blue-700">Listar no Marketplace</p>
                          <p className="text-xs text-blue-600">Venda ou negocie seu token</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                          </div>
                          <p className="text-sm font-medium text-green-700">Acompanhar Performance</p>
                          <p className="text-xs text-green-600">Monitore seu ativo digital</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Sparkles className="w-6 h-6 text-purple-600" />
                          </div>
                          <p className="text-sm font-medium text-purple-700">Criar Mais Tokens</p>
                          <p className="text-xs text-purple-600">Expanda seu portfólio</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">🪙 Criar Novo Token</h1>
          <p className="text-muted-foreground">
            Processo completo: Título → Validação IA → Tokenização
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dashboard/tokenizacao')}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progresso da Tokenização</CardTitle>
          <CardDescription>
            Etapa {etapaAtual} de {etapas.length} - {etapas[etapaAtual - 1].titulo}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            {etapas.map((etapa, index) => (
              <div key={etapa.numero} className="flex items-center">
                <div
                  className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${
                    etapaAtual > etapa.numero
                      ? 'bg-green-500 text-white'
                      : etapaAtual === etapa.numero
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                  }
                `}
                >
                  {etapaAtual > etapa.numero ? <CheckCircle className="h-5 w-5" /> : etapa.numero}
                </div>
                {index < etapas.length - 1 && (
                  <div
                    className={`
                    w-20 h-1 mx-2
                    ${etapaAtual > etapa.numero ? 'bg-green-500' : 'bg-gray-200'}
                  `}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={(etapaAtual / etapas.length) * 100} className="w-full" />
        </CardContent>
      </Card>

      <div className="min-h-[500px]">{renderEtapa()}</div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <Button variant="outline" onClick={etapaAnterior} disabled={etapaAtual === 1}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            <div className="flex gap-2">
              {etapaAtual < etapas.length ? (
                <Button onClick={proximaEtapa} disabled={!podeProximaEtapa() && !(etapaAtual === 3 && validationStatus === 'pending') && !(etapaAtual === 5 && tokenizationStatus === 'pending')}>
                  {etapaAtual === 3 && validationStatus === 'pending'
                    ? 'Iniciar Análise'
                    : etapaAtual === 5 && tokenizationStatus === 'pending'
                      ? 'Iniciar Tokenização'
                      : 'Próximo'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={finalizarEIrParaTokens}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={tokenizationStatus !== 'completed'}
                >
                  <Coins className="h-4 w-4 mr-2" />
                  Ver Meus Tokens
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
