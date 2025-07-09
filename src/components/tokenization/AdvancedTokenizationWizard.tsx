import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileUp,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  Shield,
  Brain,
  Calculator,
  Gavel,
  FileText,
  Eye,
  Download,
  Upload,
  ChevronRight,
  ChevronLeft,
  X,
  Clock,
  DollarSign,
  Building,
  MapPin,
  Calendar,
  Hash,
  Link,
  Star,
  Target,
  Globe,
  Users,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipos do sistema de tokenização
interface TokenizationRequest {
  // Dados básicos
  titulo: string;
  descricao: string;
  categoria: string;
  subcategoria: string;
  valor: number;

  // Dados do emissor
  emissor: {
    tipo: 'pf' | 'pj';
    nome: string;
    documento: string;
    email: string;
    telefone: string;
    endereco: {
      cep: string;
      logradouro: string;
      numero: string;
      complemento?: string;
      bairro: string;
      cidade: string;
      uf: string;
    };
  };

  // Dados do crédito
  credito: {
    origem: string;
    dataGeracao: Date;
    dataVencimento: Date;
    numeroProcesso?: string;
    orgaoEmissor: string;
    situacaoFiscal: string;
    garantias: string[];
  };

  // Documentos
  documentos: Array<{
    tipo: string;
    nome: string;
    arquivo: File;
    obrigatorio: boolean;
    verificado?: boolean;
  }>;

  // Configurações de tokenização
  tokenizacao: {
    padrao: 'ERC1400' | 'FABRIC' | 'CUSTOM';
    transferivel: boolean;
    fracionavel: boolean;
    valorMinimo: number;
    restricoes: string[];
    compliance: {
      kyc: boolean;
      aml: boolean;
      investidorQualificado: boolean;
      restricaoGeografica: string[];
    };
  };

  // Marketplace
  marketplace: {
    listar: boolean;
    modalidade: 'venda_direta' | 'leilao' | 'proposta';
    precoVenda?: number;
    precoMinimo?: number;
    prazoVenda?: number;
    descricaoVenda?: string;
  };
}

interface ValidationResult {
  campo: string;
  status: 'success' | 'warning' | 'error';
  mensagem: string;
  detalhes?: string[];
}

interface PricingAnalysis {
  valorSugerido: number;
  faixaPreco: {
    minimo: number;
    maximo: number;
  };
  desconto: number;
  liquidez: number;
  demanda: number;
  comparaveis: Array<{
    titulo: string;
    valor: number;
    preco: number;
    desconto: number;
  }>;
  fatoresRisco: string[];
  recomendacoes: string[];
}

// Wizard de Tokenização Avançado
export function AdvancedTokenizationWizard({ onComplete, onCancel }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TokenizationRequest>({
    titulo: '',
    descricao: '',
    categoria: '',
    subcategoria: '',
    valor: 0,
    emissor: {
      tipo: 'pj',
      nome: '',
      documento: '',
      email: '',
      telefone: '',
      endereco: {
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',
      },
    },
    credito: {
      origem: '',
      dataGeracao: new Date(),
      dataVencimento: new Date(),
      numeroProcesso: '',
      orgaoEmissor: '',
      situacaoFiscal: '',
      garantias: [],
    },
    documentos: [],
    tokenizacao: {
      padrao: 'FABRIC',
      transferivel: true,
      fracionavel: false,
      valorMinimo: 1000,
      restricoes: [],
      compliance: {
        kyc: true,
        aml: true,
        investidorQualificado: false,
        restricaoGeografica: ['BR'],
      },
    },
    marketplace: {
      listar: true,
      modalidade: 'venda_direta',
      precoVenda: 0,
      precoMinimo: 0,
      prazoVenda: 30,
      descricaoVenda: '',
    },
  });

  const [validations, setValidations] = useState<ValidationResult[]>([]);
  const [pricingAnalysis, setPricingAnalysis] = useState<PricingAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Configurações por categoria
  const categorias = {
    TRIBUTARIO: {
      label: 'Tributários',
      subcategorias: ['ICMS', 'PIS/COFINS', 'IRPJ/CSLL', 'ISS', 'IPI', 'IOF'],
      documentos: [
        { tipo: 'declaracao_fiscal', nome: 'Declaração Fiscal', obrigatorio: true },
        { tipo: 'gia', nome: 'GIA/SPED', obrigatorio: true },
        { tipo: 'certidao_receita', nome: 'Certidão Receita Federal', obrigatorio: true },
      ],
    },
    JUDICIAL: {
      label: 'Judiciais',
      subcategorias: ['Precatórios', 'Honorários', 'Creditórios'],
      documentos: [
        { tipo: 'titulo_judicial', nome: 'Título Judicial', obrigatorio: true },
        { tipo: 'rpv', nome: 'RPV', obrigatorio: false },
        { tipo: 'decisao_judicial', nome: 'Decisão Judicial', obrigatorio: true },
      ],
    },
    COMERCIAL: {
      label: 'Comerciais',
      subcategorias: ['Duplicatas', 'Promissórias', 'Letras de Câmbio'],
      documentos: [
        { tipo: 'titulo_comercial', nome: 'Título Comercial', obrigatorio: true },
        { tipo: 'nota_fiscal', nome: 'Nota Fiscal', obrigatorio: true },
        { tipo: 'contrato', nome: 'Contrato', obrigatorio: false },
      ],
    },
    RURAL: {
      label: 'Rurais',
      subcategorias: ['CPR', 'CCR', 'NCR'],
      documentos: [
        { tipo: 'cpr', nome: 'CPR/CCR', obrigatorio: true },
        { tipo: 'incra', nome: 'Certificado INCRA', obrigatorio: true },
      ],
    },
    AMBIENTAL: {
      label: 'Ambientais',
      subcategorias: ['Créditos de Carbono', 'Biodiversidade', 'Hídricos'],
      documentos: [
        { tipo: 'certificado_ambiental', nome: 'Certificado Ambiental', obrigatorio: true },
        { tipo: 'auditoria', nome: 'Auditoria', obrigatorio: true },
      ],
    },
  };

  // Etapas do wizard
  const steps = [
    { number: 1, title: 'Dados Básicos', description: 'Informações do crédito e emissor' },
    { number: 2, title: 'Documentação', description: 'Upload e validação de documentos' },
    { number: 3, title: 'Validação IA', description: 'Análise automática e precificação' },
    { number: 4, title: 'Configuração', description: 'Parâmetros de tokenização' },
    { number: 5, title: 'Marketplace', description: 'Configurações de venda' },
    { number: 6, title: 'Confirmação', description: 'Revisão e tokenização' },
  ];

  // Validação em tempo real
  useEffect(() => {
    const newValidations: ValidationResult[] = [];

    if (currentStep >= 1) {
      if (!formData.titulo) {
        newValidations.push({
          campo: 'titulo',
          status: 'error',
          mensagem: 'Título é obrigatório',
        });
      }

      if (!formData.categoria) {
        newValidations.push({
          campo: 'categoria',
          status: 'error',
          mensagem: 'Categoria é obrigatória',
        });
      }

      if (formData.valor <= 0) {
        newValidations.push({
          campo: 'valor',
          status: 'error',
          mensagem: 'Valor deve ser maior que zero',
        });
      }
    }

    setValidations(newValidations);
  }, [formData, currentStep]);

  // Análise de precificação com IA
  const analyzePricing = async () => {
    setIsProcessing(true);
    setProgress(0);

    // Simular análise de IA
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Resultado mockado da análise
    const analysis: PricingAnalysis = {
      valorSugerido: formData.valor * 0.85,
      faixaPreco: {
        minimo: formData.valor * 0.75,
        maximo: formData.valor * 0.95,
      },
      desconto: 15,
      liquidez: 0.78,
      demanda: 0.82,
      comparaveis: [
        { titulo: 'TC Similar 1', valor: 1500000, preco: 1275000, desconto: 15 },
        { titulo: 'TC Similar 2', valor: 1800000, preco: 1440000, desconto: 20 },
        { titulo: 'TC Similar 3', valor: 1200000, preco: 1080000, desconto: 10 },
      ],
      fatoresRisco: [
        'Prazo de vencimento adequado',
        'Emissor com boa reputação',
        'Categoria com alta demanda',
      ],
      recomendacoes: [
        'Preço competitivo para categoria',
        'Considere listar no marketplace',
        'Boa oportunidade de liquidez',
      ],
    };

    setPricingAnalysis(analysis);
    setFormData(prev => ({
      ...prev,
      marketplace: {
        ...prev.marketplace,
        precoVenda: analysis.valorSugerido,
        precoMinimo: analysis.faixaPreco.minimo,
      },
    }));

    setIsProcessing(false);
  };

  // Navegação entre etapas
  const nextStep = async () => {
    if (currentStep === 3 && !pricingAnalysis) {
      await analyzePricing();
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Upload de documentos
  const handleFileUpload = (file: File, tipo: string) => {
    const newDoc = {
      tipo,
      nome: file.name,
      arquivo: file,
      obrigatorio:
        categorias[formData.categoria]?.documentos.find(d => d.tipo === tipo)?.obrigatorio || false,
    };

    setFormData(prev => ({
      ...prev,
      documentos: [...prev.documentos.filter(d => d.tipo !== tipo), newDoc],
    }));
  };

  // Formatação de valores
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Renderizar etapa atual
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepBasicInfo formData={formData} setFormData={setFormData} categorias={categorias} />
        );
      case 2:
        return (
          <StepDocuments
            formData={formData}
            setFormData={setFormData}
            categorias={categorias}
            onFileUpload={handleFileUpload}
          />
        );
      case 3:
        return (
          <StepValidation
            formData={formData}
            pricingAnalysis={pricingAnalysis}
            isProcessing={isProcessing}
            progress={progress}
          />
        );
      case 4:
        return <StepConfiguration formData={formData} setFormData={setFormData} />;
      case 5:
        return (
          <StepMarketplace
            formData={formData}
            setFormData={setFormData}
            pricingAnalysis={pricingAnalysis}
          />
        );
      case 6:
        return (
          <StepConfirmation
            formData={formData}
            pricingAnalysis={pricingAnalysis}
            onComplete={onComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Tokenização Avançada de Créditos</h1>
        <p className="text-muted-foreground">
          Transforme seu crédito em um ativo digital negociável na blockchain
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${
                  currentStep >= step.number
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }
              `}
              >
                {currentStep > step.number ? <CheckCircle className="h-4 w-4" /> : step.number}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 w-16 mx-2 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-xl font-semibold">{steps[currentStep - 1]?.title}</h2>
          <p className="text-sm text-muted-foreground">{steps[currentStep - 1]?.description}</p>
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardContent className="p-6">{renderStep()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>

          <Button
            onClick={nextStep}
            disabled={validations.some(v => v.status === 'error') || isProcessing}
          >
            {currentStep === steps.length ? 'Tokenizar' : 'Próximo'}
            {currentStep < steps.length && <ChevronRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>

      {/* Validations */}
      {validations.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              {validations.map((validation, index) => (
                <div
                  key={index}
                  className={`text-sm ${
                    validation.status === 'error'
                      ? 'text-red-600'
                      : validation.status === 'warning'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                  }`}
                >
                  • {validation.mensagem}
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Componentes das etapas individuais
const StepBasicInfo = ({ formData, setFormData, categorias }) => (
  <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <Label htmlFor="titulo">Título do Crédito</Label>
        <Input
          id="titulo"
          value={formData.titulo}
          onChange={e => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
          placeholder="Ex: Crédito ICMS Janeiro 2024"
        />
      </div>

      <div>
        <Label htmlFor="valor">Valor Nominal (R$)</Label>
        <Input
          id="valor"
          type="number"
          value={formData.valor}
          onChange={e => setFormData(prev => ({ ...prev, valor: parseFloat(e.target.value) || 0 }))}
          placeholder="0,00"
        />
      </div>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <Label htmlFor="categoria">Categoria</Label>
        <Select
          value={formData.categoria}
          onValueChange={value =>
            setFormData(prev => ({ ...prev, categoria: value, subcategoria: '' }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(categorias).map(([key, cat]) => (
              <SelectItem key={key} value={key}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {formData.categoria && (
        <div>
          <Label htmlFor="subcategoria">Subcategoria</Label>
          <Select
            value={formData.subcategoria}
            onValueChange={value => setFormData(prev => ({ ...prev, subcategoria: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a subcategoria" />
            </SelectTrigger>
            <SelectContent>
              {categorias[formData.categoria]?.subcategorias.map(sub => (
                <SelectItem key={sub} value={sub}>
                  {sub}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>

    <div>
      <Label htmlFor="descricao">Descrição</Label>
      <Textarea
        id="descricao"
        value={formData.descricao}
        onChange={e => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
        placeholder="Descreva as características e origem do crédito..."
        rows={3}
      />
    </div>

    {/* Dados do Emissor */}
    <Separator />
    <h3 className="text-lg font-semibold">Dados do Emissor</h3>

    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <Label htmlFor="emissor-nome">Nome/Razão Social</Label>
        <Input
          id="emissor-nome"
          value={formData.emissor.nome}
          onChange={e =>
            setFormData(prev => ({
              ...prev,
              emissor: { ...prev.emissor, nome: e.target.value },
            }))
          }
        />
      </div>

      <div>
        <Label htmlFor="emissor-documento">CPF/CNPJ</Label>
        <Input
          id="emissor-documento"
          value={formData.emissor.documento}
          onChange={e =>
            setFormData(prev => ({
              ...prev,
              emissor: { ...prev.emissor, documento: e.target.value },
            }))
          }
        />
      </div>
    </div>
  </div>
);

const StepDocuments = ({ formData, categorias, onFileUpload }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold mb-4">Documentos Necessários</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Faça upload dos documentos comprobatórios do seu crédito
      </p>
    </div>

    <div className="space-y-4">
      {categorias[formData.categoria]?.documentos.map(doc => (
        <div key={doc.tipo} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-medium">{doc.nome}</h4>
              {doc.obrigatorio && (
                <Badge variant="destructive" className="text-xs">
                  Obrigatório
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.pdf,.jpg,.jpeg,.png';
                input.onchange = e => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) onFileUpload(file, doc.tipo);
                };
                input.click();
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Fazer Upload
            </Button>
          </div>

          {formData.documentos.find(d => d.tipo === doc.tipo) && (
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-2" />
              {formData.documentos.find(d => d.tipo === doc.tipo)?.nome}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const StepValidation = ({ formData, pricingAnalysis, isProcessing, progress }) => (
  <div className="space-y-6">
    <div className="text-center">
      <Brain className="h-12 w-12 mx-auto mb-4 text-blue-600" />
      <h3 className="text-lg font-semibold">Análise Inteligente por IA</h3>
      <p className="text-sm text-muted-foreground">
        Nossa IA está analisando seu crédito e determinando o melhor preço
      </p>
    </div>

    {isProcessing && (
      <div className="space-y-4">
        <Progress value={progress} className="h-2" />
        <div className="text-center text-sm text-muted-foreground">
          Analisando documentos e histórico de mercado... {progress}%
        </div>
      </div>
    )}

    {pricingAnalysis && (
      <div className="space-y-6">
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Análise concluída com sucesso! Encontramos uma excelente oportunidade.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  pricingAnalysis.valorSugerido
                )}
              </div>
              <div className="text-sm text-muted-foreground">Preço Sugerido</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{pricingAnalysis.desconto}%</div>
              <div className="text-sm text-muted-foreground">Desconto</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">
                {(pricingAnalysis.liquidez * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">Liquidez</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="font-semibold mb-3">Títulos Comparáveis</h4>
            <div className="space-y-2">
              {pricingAnalysis.comparaveis.map((comp, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="text-sm">{comp.titulo}</span>
                  <span className="font-medium">{comp.desconto}% desc</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Recomendações</h4>
            <div className="space-y-2">
              {pricingAnalysis.recomendacoes.map((rec, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);

const StepConfiguration = ({ formData, setFormData }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold">Configurações de Tokenização</h3>

    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <Label>Padrão de Token</Label>
        <Select
          value={formData.tokenizacao.padrao}
          onValueChange={value =>
            setFormData(prev => ({
              ...prev,
              tokenizacao: { ...prev.tokenizacao, padrao: value },
            }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FABRIC">Hyperledger Fabric</SelectItem>
            <SelectItem value="ERC1400">ERC-1400 (Ethereum)</SelectItem>
            <SelectItem value="CUSTOM">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Valor Mínimo de Negociação</Label>
        <Input
          type="number"
          value={formData.tokenizacao.valorMinimo}
          onChange={e =>
            setFormData(prev => ({
              ...prev,
              tokenizacao: { ...prev.tokenizacao, valorMinimo: parseFloat(e.target.value) || 0 },
            }))
          }
        />
      </div>
    </div>

    <div className="space-y-4">
      <h4 className="font-medium">Compliance e Restrições</h4>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="kyc"
            checked={formData.tokenizacao.compliance.kyc}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                tokenizacao: {
                  ...prev.tokenizacao,
                  compliance: { ...prev.tokenizacao.compliance, kyc: e.target.checked },
                },
              }))
            }
          />
          <Label htmlFor="kyc">Requer KYC</Label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="aml"
            checked={formData.tokenizacao.compliance.aml}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                tokenizacao: {
                  ...prev.tokenizacao,
                  compliance: { ...prev.tokenizacao.compliance, aml: e.target.checked },
                },
              }))
            }
          />
          <Label htmlFor="aml">Requer AML</Label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="investidor-qualificado"
            checked={formData.tokenizacao.compliance.investidorQualificado}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                tokenizacao: {
                  ...prev.tokenizacao,
                  compliance: {
                    ...prev.tokenizacao.compliance,
                    investidorQualificado: e.target.checked,
                  },
                },
              }))
            }
          />
          <Label htmlFor="investidor-qualificado">Apenas Investidores Qualificados</Label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="transferivel"
            checked={formData.tokenizacao.transferivel}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                tokenizacao: { ...prev.tokenizacao, transferivel: e.target.checked },
              }))
            }
          />
          <Label htmlFor="transferivel">Transferível</Label>
        </div>
      </div>
    </div>
  </div>
);

const StepMarketplace = ({ formData, setFormData, pricingAnalysis }) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="listar-marketplace"
        checked={formData.marketplace.listar}
        onChange={e =>
          setFormData(prev => ({
            ...prev,
            marketplace: { ...prev.marketplace, listar: e.target.checked },
          }))
        }
      />
      <Label htmlFor="listar-marketplace" className="text-lg font-semibold">
        Listar no Marketplace
      </Label>
    </div>

    {formData.marketplace.listar && (
      <div className="space-y-6">
        <div>
          <Label>Modalidade de Venda</Label>
          <Select
            value={formData.marketplace.modalidade}
            onValueChange={value =>
              setFormData(prev => ({
                ...prev,
                marketplace: { ...prev.marketplace, modalidade: value },
              }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="venda_direta">Venda Direta</SelectItem>
              <SelectItem value="leilao">Leilão</SelectItem>
              <SelectItem value="proposta">Sistema de Propostas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Preço de Venda (R$)</Label>
            <Input
              type="number"
              value={formData.marketplace.precoVenda}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  marketplace: { ...prev.marketplace, precoVenda: parseFloat(e.target.value) || 0 },
                }))
              }
            />
            {pricingAnalysis && (
              <p className="text-xs text-muted-foreground mt-1">
                Sugerido:{' '}
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  pricingAnalysis.valorSugerido
                )}
              </p>
            )}
          </div>

          <div>
            <Label>Preço Mínimo (R$)</Label>
            <Input
              type="number"
              value={formData.marketplace.precoMinimo}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  marketplace: {
                    ...prev.marketplace,
                    precoMinimo: parseFloat(e.target.value) || 0,
                  },
                }))
              }
            />
          </div>
        </div>

        <div>
          <Label>Descrição para o Marketplace</Label>
          <Textarea
            value={formData.marketplace.descricaoVenda}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                marketplace: { ...prev.marketplace, descricaoVenda: e.target.value },
              }))
            }
            placeholder="Destaque as vantagens e características do seu crédito..."
            rows={3}
          />
        </div>
      </div>
    )}
  </div>
);

const StepConfirmation = ({ formData, pricingAnalysis, onComplete }) => (
  <div className="space-y-6">
    <div className="text-center">
      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
      <h3 className="text-lg font-semibold">Pronto para Tokenizar</h3>
      <p className="text-sm text-muted-foreground">
        Revise as informações antes de confirmar a tokenização
      </p>
    </div>

    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Título</Label>
          <p className="font-medium">{formData.titulo}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Valor</Label>
          <p className="font-medium">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
              formData.valor
            )}
          </p>
        </div>
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Categoria</Label>
          <p className="font-medium">
            {formData.categoria} - {formData.subcategoria}
          </p>
        </div>
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Emissor</Label>
          <p className="font-medium">{formData.emissor.nome}</p>
        </div>
      </div>

      {pricingAnalysis && formData.marketplace.listar && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Configuração do Marketplace</h4>
          <div className="grid gap-2 md:grid-cols-2 text-sm">
            <div>Modalidade: {formData.marketplace.modalidade}</div>
            <div>
              Preço:{' '}
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                formData.marketplace.precoVenda || 0
              )}
            </div>
          </div>
        </div>
      )}

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Após a confirmação, seu crédito será tokenizado na blockchain e estará disponível para
          negociação. Este processo não pode ser desfeito.
        </AlertDescription>
      </Alert>
    </div>

    <div className="flex justify-center">
      <Button size="lg" onClick={onComplete} className="bg-green-600 hover:bg-green-700">
        <Zap className="h-4 w-4 mr-2" />
        Confirmar Tokenização
      </Button>
    </div>
  </div>
);

export default AdvancedTokenizationWizard;
