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
  Shield,
  CheckCircle,
  AlertTriangle,
  Info,
  Camera,
  FileText,
  User,
  Building,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Globe,
  Eye,
  Upload,
  Download,
  Clock,
  Star,
  Target,
  Zap,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  X,
  Plus,
  Minus,
  Search,
  Filter,
  ExternalLink,
  Hash,
  Link2,
  Fingerprint,
  Scan,
  Smartphone,
  QrCode,
  Brain,
  Settings,
  Users,
  Scale,
  FileCheck,
  AlertCircle,
  UserCheck,
} from 'lucide-react';

// Tipos do sistema de KYC
interface KYCProfile {
  id: string;
  tipo: 'pf' | 'pj';
  status:
    | 'iniciado'
    | 'documentos_pendentes'
    | 'verificacao'
    | 'aprovado'
    | 'rejeitado'
    | 'suspenso';
  nivel: 'basico' | 'intermediario' | 'avancado' | 'qualificado';

  // Dados Pessoais/Jurídicos
  dadosBasicos: {
    nome: string;
    documento: string;
    email: string;
    telefone: string;
    dataNascimento?: Date;
    nacionalidade: string;
    profissao?: string;
    renda?: number;
    patrimonio?: number;
  };

  // Endereço
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    pais: string;
  };

  // Dados da Empresa (se PJ)
  empresa?: {
    razaoSocial: string;
    nomeFantasia: string;
    cnae: string;
    porte: 'mei' | 'micro' | 'pequena' | 'media' | 'grande';
    faturamento?: number;
    funcionarios?: number;
    dataConstituicao: Date;
    situacaoReceita: string;
  };

  // Documentos
  documentos: Array<{
    tipo: string;
    nome: string;
    arquivo?: File;
    url?: string;
    status: 'pendente' | 'analisando' | 'aprovado' | 'rejeitado';
    observacoes?: string;
    dataUpload: Date;
    dataVerificacao?: Date;
  }>;

  // Verificações
  verificacoes: {
    identidade: VerificationResult;
    endereco: VerificationResult;
    renda: VerificationResult;
    antecedentes: VerificationResult;
    pep: VerificationResult;
    sanctions: VerificationResult;
    aml: VerificationResult;
  };

  // Score e Risco
  scoring: {
    scoreGeral: number;
    scoreCredito: number;
    scoreCompliance: number;
    nivelRisco: 'baixo' | 'medio' | 'alto' | 'critico';
    fatoresRisco: string[];
    recomendacoes: string[];
  };

  // Histórico
  timeline: Array<{
    data: Date;
    evento: string;
    descricao: string;
    responsavel: string;
    status: 'info' | 'success' | 'warning' | 'error';
  }>;
}

interface VerificationResult {
  status: 'pendente' | 'verificado' | 'falhou' | 'indisponivel';
  score: number;
  detalhes: string;
  fonte: string;
  dataVerificacao?: Date;
}

interface DocumentRequirement {
  tipo: string;
  nome: string;
  obrigatorio: boolean;
  descricao: string;
  formatos: string[];
  tamanhoMax: number;
  exemplos?: string[];
  validacoes: string[];
}

// Configurações de documentos por tipo e nível
const documentRequirements: Record<string, Record<string, DocumentRequirement[]>> = {
  pf: {
    basico: [
      {
        tipo: 'rg_frente',
        nome: 'RG - Frente',
        obrigatorio: true,
        descricao: 'Documento de identidade (frente)',
        formatos: ['jpg', 'png', 'pdf'],
        tamanhoMax: 5,
        validacoes: ['ocr', 'qualidade', 'autenticidade'],
      },
      {
        tipo: 'rg_verso',
        nome: 'RG - Verso',
        obrigatorio: true,
        descricao: 'Documento de identidade (verso)',
        formatos: ['jpg', 'png', 'pdf'],
        tamanhoMax: 5,
        validacoes: ['ocr', 'qualidade'],
      },
      {
        tipo: 'cpf',
        nome: 'CPF',
        obrigatorio: true,
        descricao: 'Cadastro de Pessoa Física',
        formatos: ['jpg', 'png', 'pdf'],
        tamanhoMax: 5,
        validacoes: ['ocr', 'receita_federal'],
      },
      {
        tipo: 'comprovante_residencia',
        nome: 'Comprovante de Residência',
        obrigatorio: true,
        descricao: 'Conta de luz, água ou telefone (últimos 3 meses)',
        formatos: ['jpg', 'png', 'pdf'],
        tamanhoMax: 5,
        validacoes: ['data', 'endereco'],
      },
    ],
    intermediario: [
      {
        tipo: 'selfie',
        nome: 'Selfie com Documento',
        obrigatorio: true,
        descricao: 'Foto pessoal segurando o documento de identidade',
        formatos: ['jpg', 'png'],
        tamanhoMax: 5,
        validacoes: ['biometria', 'liveness', 'matching'],
      },
      {
        tipo: 'comprovante_renda',
        nome: 'Comprovante de Renda',
        obrigatorio: true,
        descricao: 'Holerite, declaração IR ou extrato bancário',
        formatos: ['jpg', 'png', 'pdf'],
        tamanhoMax: 10,
        validacoes: ['data', 'valor', 'fonte'],
      },
    ],
    avancado: [
      {
        tipo: 'declaracao_ir',
        nome: 'Declaração de Imposto de Renda',
        obrigatorio: true,
        descricao: 'Última declaração completa',
        formatos: ['pdf'],
        tamanhoMax: 10,
        validacoes: ['receita_federal', 'consistencia'],
      },
      {
        tipo: 'extrato_bancario',
        nome: 'Extrato Bancário',
        obrigatorio: true,
        descricao: 'Últimos 3 meses de movimentação',
        formatos: ['pdf'],
        tamanhoMax: 15,
        validacoes: ['banco', 'movimentacao', 'consistencia'],
      },
    ],
  },
  pj: {
    basico: [
      {
        tipo: 'contrato_social',
        nome: 'Contrato Social',
        obrigatorio: true,
        descricao: 'Contrato social consolidado e atualizado',
        formatos: ['pdf'],
        tamanhoMax: 10,
        validacoes: ['junta_comercial', 'vigencia'],
      },
      {
        tipo: 'cartao_cnpj',
        nome: 'Cartão CNPJ',
        obrigatorio: true,
        descricao: 'Comprovante de inscrição na Receita Federal',
        formatos: ['jpg', 'png', 'pdf'],
        tamanhoMax: 5,
        validacoes: ['receita_federal', 'situacao_ativa'],
      },
      {
        tipo: 'documento_representante',
        nome: 'Documento do Representante Legal',
        obrigatorio: true,
        descricao: 'RG e CPF do responsável pela empresa',
        formatos: ['jpg', 'png', 'pdf'],
        tamanhoMax: 10,
        validacoes: ['ocr', 'vinculo_empresa'],
      },
    ],
    intermediario: [
      {
        tipo: 'certidao_regularidade',
        nome: 'Certidões de Regularidade',
        obrigatorio: true,
        descricao: 'Federal, Estadual, Municipal, FGTS e Trabalhista',
        formatos: ['pdf'],
        tamanhoMax: 20,
        validacoes: ['orgaos_oficiais', 'vigencia'],
      },
      {
        tipo: 'balanco_patrimonial',
        nome: 'Balanço Patrimonial',
        obrigatorio: true,
        descricao: 'Último exercício fiscal',
        formatos: ['pdf'],
        tamanhoMax: 15,
        validacoes: ['assinatura_contador', 'consistencia'],
      },
    ],
  },
};

// Componente principal do sistema de KYC
export function AdvancedKYCSystem({ userId, onComplete, onCancel }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<KYCProfile>({
    id: userId || 'new',
    tipo: 'pf',
    status: 'iniciado',
    nivel: 'basico',
    dadosBasicos: {
      nome: '',
      documento: '',
      email: '',
      telefone: '',
      nacionalidade: 'BR',
    },
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: '',
      uf: '',
      pais: 'BR',
    },
    documentos: [],
    verificacoes: {
      identidade: { status: 'pendente', score: 0, detalhes: '', fonte: '' },
      endereco: { status: 'pendente', score: 0, detalhes: '', fonte: '' },
      renda: { status: 'pendente', score: 0, detalhes: '', fonte: '' },
      antecedentes: { status: 'pendente', score: 0, detalhes: '', fonte: '' },
      pep: { status: 'pendente', score: 0, detalhes: '', fonte: '' },
      sanctions: { status: 'pendente', score: 0, detalhes: '', fonte: '' },
      aml: { status: 'pendente', score: 0, detalhes: '', fonte: '' },
    },
    scoring: {
      scoreGeral: 0,
      scoreCredito: 0,
      scoreCompliance: 0,
      nivelRisco: 'medio',
      fatoresRisco: [],
      recomendacoes: [],
    },
    timeline: [
      {
        data: new Date(),
        evento: 'KYC Iniciado',
        descricao: 'Processo de verificação iniciado',
        responsavel: 'Sistema',
        status: 'info',
      },
    ],
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('dados');

  // Etapas do processo
  const steps = [
    { number: 1, title: 'Dados Básicos', description: 'Informações pessoais ou empresariais' },
    { number: 2, title: 'Documentação', description: 'Upload e verificação de documentos' },
    { number: 3, title: 'Verificação', description: 'Análise automática e validações' },
    { number: 4, title: 'Compliance', description: 'Verificações AML e listas restritivas' },
    { number: 5, title: 'Scoring', description: 'Avaliação de risco e aprovação' },
  ];

  // Executar verificações automáticas
  const runVerifications = async () => {
    setIsVerifying(true);
    setVerificationProgress(0);

    const verificationsToRun = [
      { key: 'identidade', name: 'Verificação de Identidade', duration: 2000 },
      { key: 'endereco', name: 'Validação de Endereço', duration: 1500 },
      { key: 'renda', name: 'Análise de Renda', duration: 3000 },
      { key: 'antecedentes', name: 'Consulta a Antecedentes', duration: 2500 },
      { key: 'pep', name: 'Verificação PEP', duration: 1000 },
      { key: 'sanctions', name: 'Listas Restritivas', duration: 1500 },
      { key: 'aml', name: 'Análise AML', duration: 2000 },
    ];

    for (let i = 0; i < verificationsToRun.length; i++) {
      const verification = verificationsToRun[i];
      setVerificationProgress(((i + 1) / verificationsToRun.length) * 100);

      await new Promise(resolve => setTimeout(resolve, verification.duration));

      // Simular resultado da verificação
      const result: VerificationResult = {
        status: Math.random() > 0.1 ? 'verificado' : 'falhou',
        score: Math.floor(Math.random() * 40) + 60, // 60-100
        detalhes: `Verificação realizada com sucesso via ${verification.name}`,
        fonte: 'API Externa',
        dataVerificacao: new Date(),
      };

      setProfile(prev => ({
        ...prev,
        verificacoes: {
          ...prev.verificacoes,
          [verification.key]: result,
        },
      }));
    }

    // Calcular score geral
    const scores = Object.values(profile.verificacoes)
      .filter(v => v.status === 'verificado')
      .map(v => v.score);

    const scoreGeral =
      scores.length > 0 ? Math.floor(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    setProfile(prev => ({
      ...prev,
      scoring: {
        scoreGeral,
        scoreCredito: scoreGeral + Math.floor(Math.random() * 20) - 10,
        scoreCompliance: scoreGeral + Math.floor(Math.random() * 10) - 5,
        nivelRisco: scoreGeral > 80 ? 'baixo' : scoreGeral > 60 ? 'medio' : 'alto',
        fatoresRisco: scoreGeral < 70 ? ['Renda não comprovada', 'Histórico limitado'] : [],
        recomendacoes: ['Perfil aprovado para operações básicas', 'Revisar em 12 meses'],
      },
      status: scoreGeral > 70 ? 'aprovado' : 'verificacao',
    }));

    setIsVerifying(false);
  };

  // Upload de documento
  const handleDocumentUpload = async (file: File, tipo: string) => {
    const newDoc = {
      tipo,
      nome: file.name,
      arquivo: file,
      status: 'analisando' as const,
      dataUpload: new Date(),
    };

    setProfile(prev => ({
      ...prev,
      documentos: [...prev.documentos.filter(d => d.tipo !== tipo), newDoc],
    }));

    // Simular análise OCR
    setTimeout(() => {
      setProfile(prev => ({
        ...prev,
        documentos: prev.documentos.map(d =>
          d.tipo === tipo
            ? {
                ...d,
                status: 'aprovado' as const,
                dataVerificacao: new Date(),
                observacoes: 'Documento verificado automaticamente via OCR',
              }
            : d
        ),
      }));
    }, 3000);
  };

  // Consultar CEP
  const consultarCEP = async (cep: string) => {
    if (cep.length === 8) {
      // Simular consulta de CEP
      setTimeout(() => {
        setProfile(prev => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            logradouro: 'Rua das Flores',
            bairro: 'Centro',
            cidade: 'São Paulo',
            uf: 'SP',
          },
        }));
      }, 1000);
    }
  };

  // Navegação
  const nextStep = () => {
    if (currentStep === 3 && !isVerifying) {
      runVerifications();
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Renderizar etapa atual
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepBasicData profile={profile} setProfile={setProfile} onConsultarCEP={consultarCEP} />
        );
      case 2:
        return <StepDocuments profile={profile} onUpload={handleDocumentUpload} />;
      case 3:
        return (
          <StepVerification
            profile={profile}
            isVerifying={isVerifying}
            progress={verificationProgress}
          />
        );
      case 4:
        return <StepCompliance profile={profile} />;
      case 5:
        return <StepScoring profile={profile} onComplete={onComplete} />;
      default:
        return null;
    }
  };

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Verificação KYC Avançada</h1>
        <p className="text-muted-foreground">
          Complete sua verificação para acessar todas as funcionalidades da plataforma
        </p>
      </div>

      {/* Progress Steps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2
                ${
                  getStepStatus(step.number) === 'completed'
                    ? 'bg-green-600 border-green-600 text-white'
                    : getStepStatus(step.number) === 'current'
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-gray-100 border-gray-300 text-gray-600'
                }
              `}
              >
                {getStepStatus(step.number) === 'completed' ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  step.number
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 w-16 mx-2 ${
                    getStepStatus(step.number) === 'completed' ? 'bg-green-600' : 'bg-gray-300'
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

      {/* Status Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge
                variant={
                  profile.status === 'aprovado'
                    ? 'default'
                    : profile.status === 'rejeitado'
                      ? 'destructive'
                      : 'secondary'
                }
              >
                {profile.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Nível: {profile.nivel} • Tipo:{' '}
                {profile.tipo === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {profile.scoring.scoreGeral > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Score:</span>
                  <Badge variant="outline">{profile.scoring.scoreGeral}/100</Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

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

          <Button onClick={nextStep} disabled={isVerifying}>
            {currentStep === steps.length ? 'Finalizar' : 'Próximo'}
            {currentStep < steps.length && <ChevronRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Componentes das etapas
const StepBasicData = ({ profile, setProfile, onConsultarCEP }) => (
  <div className="space-y-6">
    {/* Tipo de Pessoa */}
    <div>
      <Label className="text-base font-medium">Tipo de Cadastro</Label>
      <div className="flex space-x-4 mt-2">
        <Button
          variant={profile.tipo === 'pf' ? 'default' : 'outline'}
          onClick={() => setProfile(prev => ({ ...prev, tipo: 'pf' }))}
        >
          <User className="h-4 w-4 mr-2" />
          Pessoa Física
        </Button>
        <Button
          variant={profile.tipo === 'pj' ? 'default' : 'outline'}
          onClick={() => setProfile(prev => ({ ...prev, tipo: 'pj' }))}
        >
          <Building className="h-4 w-4 mr-2" />
          Pessoa Jurídica
        </Button>
      </div>
    </div>

    <Separator />

    {/* Dados Básicos */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Dados Básicos</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="nome">{profile.tipo === 'pf' ? 'Nome Completo' : 'Razão Social'}</Label>
          <Input
            id="nome"
            value={profile.dadosBasicos.nome}
            onChange={e =>
              setProfile(prev => ({
                ...prev,
                dadosBasicos: { ...prev.dadosBasicos, nome: e.target.value },
              }))
            }
          />
        </div>

        <div>
          <Label htmlFor="documento">{profile.tipo === 'pf' ? 'CPF' : 'CNPJ'}</Label>
          <Input
            id="documento"
            value={profile.dadosBasicos.documento}
            onChange={e =>
              setProfile(prev => ({
                ...prev,
                dadosBasicos: { ...prev.dadosBasicos, documento: e.target.value },
              }))
            }
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={profile.dadosBasicos.email}
            onChange={e =>
              setProfile(prev => ({
                ...prev,
                dadosBasicos: { ...prev.dadosBasicos, email: e.target.value },
              }))
            }
          />
        </div>

        <div>
          <Label htmlFor="telefone">Telefone</Label>
          <Input
            id="telefone"
            value={profile.dadosBasicos.telefone}
            onChange={e =>
              setProfile(prev => ({
                ...prev,
                dadosBasicos: { ...prev.dadosBasicos, telefone: e.target.value },
              }))
            }
          />
        </div>
      </div>
    </div>

    <Separator />

    {/* Endereço */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Endereço</h3>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="cep">CEP</Label>
          <Input
            id="cep"
            value={profile.endereco.cep}
            onChange={e => {
              const cep = e.target.value;
              setProfile(prev => ({
                ...prev,
                endereco: { ...prev.endereco, cep },
              }));
              if (cep.length === 8) onConsultarCEP(cep);
            }}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="logradouro">Logradouro</Label>
          <Input
            id="logradouro"
            value={profile.endereco.logradouro}
            onChange={e =>
              setProfile(prev => ({
                ...prev,
                endereco: { ...prev.endereco, logradouro: e.target.value },
              }))
            }
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <Label htmlFor="numero">Número</Label>
          <Input
            id="numero"
            value={profile.endereco.numero}
            onChange={e =>
              setProfile(prev => ({
                ...prev,
                endereco: { ...prev.endereco, numero: e.target.value },
              }))
            }
          />
        </div>

        <div>
          <Label htmlFor="complemento">Complemento</Label>
          <Input
            id="complemento"
            value={profile.endereco.complemento}
            onChange={e =>
              setProfile(prev => ({
                ...prev,
                endereco: { ...prev.endereco, complemento: e.target.value },
              }))
            }
          />
        </div>

        <div>
          <Label htmlFor="cidade">Cidade</Label>
          <Input
            id="cidade"
            value={profile.endereco.cidade}
            onChange={e =>
              setProfile(prev => ({
                ...prev,
                endereco: { ...prev.endereco, cidade: e.target.value },
              }))
            }
          />
        </div>

        <div>
          <Label htmlFor="uf">UF</Label>
          <Select
            value={profile.endereco.uf}
            onValueChange={value =>
              setProfile(prev => ({
                ...prev,
                endereco: { ...prev.endereco, uf: value },
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SP">São Paulo</SelectItem>
              <SelectItem value="RJ">Rio de Janeiro</SelectItem>
              <SelectItem value="MG">Minas Gerais</SelectItem>
              <SelectItem value="RS">Rio Grande do Sul</SelectItem>
              <SelectItem value="PR">Paraná</SelectItem>
              {/* Mais estados... */}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  </div>
);

const StepDocuments = ({ profile, onUpload }) => {
  const requirements = documentRequirements[profile.tipo][profile.nivel];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Documentos Necessários</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Faça upload dos documentos listados abaixo. Certifique-se de que estejam legíveis e dentro
          da validade.
        </p>
      </div>

      <div className="space-y-4">
        {requirements.map(req => {
          const uploadedDoc = profile.documentos.find(d => d.tipo === req.tipo);

          return (
            <Card key={req.tipo}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{req.nome}</h4>
                    <p className="text-sm text-muted-foreground">{req.descricao}</p>
                    {req.obrigatorio && (
                      <Badge variant="destructive" className="text-xs mt-1">
                        Obrigatório
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {uploadedDoc ? (
                      <Badge
                        variant={
                          uploadedDoc.status === 'aprovado'
                            ? 'default'
                            : uploadedDoc.status === 'analisando'
                              ? 'secondary'
                              : 'destructive'
                        }
                      >
                        {uploadedDoc.status}
                      </Badge>
                    ) : null}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = req.formatos.map(f => `.${f}`).join(',');
                        input.onchange = e => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) onUpload(file, req.tipo);
                        };
                        input.click();
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadedDoc ? 'Trocar' : 'Upload'}
                    </Button>
                  </div>
                </div>

                {uploadedDoc && (
                  <div className="mt-2 p-2 bg-muted rounded text-sm">
                    <div className="flex items-center justify-between">
                      <span>{uploadedDoc.nome}</span>
                      <span className="text-xs text-muted-foreground">
                        {uploadedDoc.dataUpload.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    {uploadedDoc.observacoes && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {uploadedDoc.observacoes}
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-2 text-xs text-muted-foreground">
                  Formatos aceitos: {req.formatos.join(', ')} • Máx: {req.tamanhoMax}MB
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const StepVerification = ({ profile, isVerifying, progress }) => (
  <div className="space-y-6">
    <div className="text-center">
      <Brain className="h-12 w-12 mx-auto mb-4 text-blue-600" />
      <h3 className="text-lg font-semibold">Verificação Automática</h3>
      <p className="text-sm text-muted-foreground">
        Estamos verificando seus dados e documentos automaticamente
      </p>
    </div>

    {isVerifying && (
      <div className="space-y-4">
        <Progress value={progress} className="h-2" />
        <div className="text-center text-sm text-muted-foreground">
          Verificando informações... {progress.toFixed(0)}%
        </div>
      </div>
    )}

    <div className="space-y-4">
      {Object.entries(profile.verificacoes).map(([key, verification]) => (
        <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center space-x-3">
            <div
              className={`p-1 rounded ${
                verification.status === 'verificado'
                  ? 'bg-green-100 text-green-600'
                  : verification.status === 'falhou'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-600'
              }`}
            >
              {verification.status === 'verificado' ? (
                <CheckCircle className="h-4 w-4" />
              ) : verification.status === 'falhou' ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <Clock className="h-4 w-4" />
              )}
            </div>
            <div>
              <h4 className="font-medium capitalize">{key.replace('_', ' ')}</h4>
              <p className="text-sm text-muted-foreground">{verification.detalhes}</p>
            </div>
          </div>

          {verification.status === 'verificado' && (
            <Badge variant="outline">{verification.score}/100</Badge>
          )}
        </div>
      ))}
    </div>
  </div>
);

const StepCompliance = ({ profile }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold mb-4">Verificações de Compliance</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Análise de conformidade com regulamentações AML e listas restritivas
      </p>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Verificação PEP</h4>
              <p className="text-sm text-muted-foreground">Pessoa Exposta Politicamente</p>
            </div>
            <Badge
              variant={profile.verificacoes.pep.status === 'verificado' ? 'default' : 'secondary'}
            >
              {profile.verificacoes.pep.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Listas Restritivas</h4>
              <p className="text-sm text-muted-foreground">OFAC, ONU, EU Sanctions</p>
            </div>
            <Badge
              variant={
                profile.verificacoes.sanctions.status === 'verificado' ? 'default' : 'secondary'
              }
            >
              {profile.verificacoes.sanctions.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Análise AML</h4>
              <p className="text-sm text-muted-foreground">Anti-Money Laundering</p>
            </div>
            <Badge
              variant={profile.verificacoes.aml.status === 'verificado' ? 'default' : 'secondary'}
            >
              {profile.verificacoes.aml.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Antecedentes</h4>
              <p className="text-sm text-muted-foreground">Histórico criminal e civil</p>
            </div>
            <Badge
              variant={
                profile.verificacoes.antecedentes.status === 'verificado' ? 'default' : 'secondary'
              }
            >
              {profile.verificacoes.antecedentes.status}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>

    <Alert>
      <Shield className="h-4 w-4" />
      <AlertDescription>
        Todas as verificações de compliance foram realizadas de acordo com as regulamentações
        vigentes. Os dados são tratados com máxima segurança e confidencialidade.
      </AlertDescription>
    </Alert>
  </div>
);

const StepScoring = ({ profile, onComplete }) => (
  <div className="space-y-6">
    <div className="text-center">
      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
      <h3 className="text-lg font-semibold">Análise Concluída</h3>
      <p className="text-sm text-muted-foreground">Sua verificação foi processada com sucesso</p>
    </div>

    {/* Score Cards */}
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{profile.scoring.scoreGeral}</div>
          <div className="text-sm text-muted-foreground">Score Geral</div>
          <Progress value={profile.scoring.scoreGeral} className="h-2 mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {profile.scoring.scoreCredito}
          </div>
          <div className="text-sm text-muted-foreground">Score de Crédito</div>
          <Progress value={profile.scoring.scoreCredito} className="h-2 mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {profile.scoring.scoreCompliance}
          </div>
          <div className="text-sm text-muted-foreground">Score Compliance</div>
          <Progress value={profile.scoring.scoreCompliance} className="h-2 mt-2" />
        </CardContent>
      </Card>
    </div>

    {/* Status */}
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-center space-x-4">
          <Badge
            variant={profile.status === 'aprovado' ? 'default' : 'secondary'}
            className="text-lg py-2 px-4"
          >
            {profile.status === 'aprovado' ? '✅ Aprovado' : '⏳ Em Análise'}
          </Badge>
          <Badge variant="outline" className="text-sm">
            Nível de Risco: {profile.scoring.nivelRisco}
          </Badge>
        </div>
      </CardContent>
    </Card>

    {/* Recomendações */}
    {profile.scoring.recomendacoes.length > 0 && (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recomendações</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {profile.scoring.recomendacoes.map((rec, index) => (
              <li key={index} className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                {rec}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    )}

    <div className="flex justify-center">
      <Button size="lg" onClick={onComplete} className="bg-green-600 hover:bg-green-700">
        <UserCheck className="h-4 w-4 mr-2" />
        Finalizar Verificação
      </Button>
    </div>
  </div>
);

export default AdvancedKYCSystem;
