import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Save, 
  Camera, 
  Eye, 
  EyeOff, 
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  X,
  ArrowRight,
  ArrowLeft,
  Settings,
  Lock,
  Crown,
  FileText,
  Upload
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDemoUser } from '@/hooks/useDemoUser';
import { useKYCStatus } from '@/components/auth/KYCAccessControl';
import { toast } from 'sonner';

// Interfaces para KYC
interface KYCFormData {
  tipo: 'pf' | 'pj';
  nome: string;
  documento: string;
  email: string;
  telefone: string;
  dataNascimento?: string;
  nacionalidade: string;
  profissao?: string;
  renda?: number;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  pais: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  cnae?: string;
  porte?: 'mei' | 'micro' | 'pequena' | 'media' | 'grande';
  faturamento?: number;
  funcionarios?: number;
  dataConstituicao?: string;
  documentos: Array<{
    tipo: string;
    nome: string;
    arquivo?: File;
    status: 'pendente' | 'analisando' | 'aprovado' | 'rejeitado' | 'concluido';
    observacoes?: string;
  }>;
}

// Imports e dados do KYC original
const documentosRequeridos: Record<string, Array<{
  tipo: string;
  nome: string;
  obrigatorio: boolean;
  descricao: string;
  formatos: string[];
  exemplo?: string;
}>> = {
  pf: [
    {
      tipo: 'rg_frente',
      nome: 'RG - Frente',
      obrigatorio: true,
      descricao: 'Documento de identidade (frente)',
      formatos: ['jpg', 'png', 'pdf'],
      exemplo: 'Foto clara do RG, sem reflexos ou sombras',
    },
    {
      tipo: 'cpf',
      nome: 'CPF',
      obrigatorio: true,
      descricao: 'Cadastro de Pessoa Física',
      formatos: ['jpg', 'png', 'pdf'],
      exemplo: 'Cartão do CPF ou documento com número do CPF',
    },
    {
      tipo: 'comprovante_residencia',
      nome: 'Comprovante de Residência',
      obrigatorio: true,
      descricao: 'Conta de luz, água ou telefone (últimos 3 meses)',
      formatos: ['jpg', 'png', 'pdf'],
      exemplo: 'Documento que comprove seu endereço atual',
    },
  ],
  pj: [
    {
      tipo: 'contrato_social',
      nome: 'Contrato Social',
      obrigatorio: true,
      descricao: 'Contrato social consolidado e atualizado',
      formatos: ['pdf'],
      exemplo: 'Documento registrado na Junta Comercial',
    },
    {
      tipo: 'cartao_cnpj',
      nome: 'Cartão CNPJ',
      obrigatorio: true,
      descricao: 'Comprovante de inscrição na Receita Federal',
      formatos: ['jpg', 'png', 'pdf'],
      exemplo: 'Cartão CNPJ atualizado da Receita Federal',
    },
  ],
};

const etapas = [
  { numero: 1, titulo: 'Dados Básicos', descricao: 'Informações pessoais ou empresariais' },
  { numero: 2, titulo: 'Endereço', descricao: 'Dados de localização' },
  { numero: 3, titulo: 'Documentação', descricao: 'Upload e verificação de documentos' },
  { numero: 4, titulo: 'Verificação', descricao: 'Análise automática e validações' },
  { numero: 5, titulo: 'Finalização', descricao: 'Revisão e conclusão' },
];

// Componente KYC completo fiel ao original
function KYCFormContent({ onComplete }: { onComplete: () => void }) {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [loading, setLoading] = useState(false);
  const [verificando, setVerificando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [formData, setFormData] = useState<KYCFormData>({
    tipo: 'pf',
    nome: '',
    documento: '',
    email: '',
    telefone: '',
    nacionalidade: 'BR',
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: '',
    pais: 'BR',
    documentos: [],
  });

  const proximaEtapa = () => {
    if (etapaAtual === 4 && !verificando && progresso === 0) {
      iniciarVerificacao();
      return;
    }
    setEtapaAtual(prev => Math.min(prev + 1, etapas.length));
  };

  const etapaAnterior = () => {
    setEtapaAtual(prev => Math.max(prev - 1, 1));
  };

  const iniciarVerificacao = async () => {
    setVerificando(true);
    setProgresso(0);

    const verificacoes = [
      { nome: 'Verificação de Identidade', tempo: 1000 },
      { nome: 'Validação de Endereço', tempo: 1000 },
      { nome: 'Análise de Documentos', tempo: 2000 },
      { nome: 'Verificação de Compliance', tempo: 1000 },
      { nome: 'Consulta a Bases Restritivas', tempo: 1000 },
      { nome: 'Scoring Final', tempo: 1000 },
    ];

    for (let i = 0; i < verificacoes.length; i++) {
      const verificacao = verificacoes[i];
      toast.info(`Executando: ${verificacao.nome}`);

      if (verificacao.nome === 'Análise de Documentos') {
        setFormData(prev => ({
          ...prev,
          documentos: prev.documentos.map(d =>
            d.status === 'concluido'
              ? {
                  ...d,
                  status: 'aprovado' as const,
                  observacoes: '✅ Documento verificado e aprovado pelo sistema de compliance!',
                }
              : d
          ),
        }));
        toast.success('📄 Documentos aprovados pelo sistema!');
      }

      await new Promise(resolve => setTimeout(resolve, verificacao.tempo));
      setProgresso(((i + 1) / verificacoes.length) * 100);
    }

    setVerificando(false);
    toast.success('🎉 Verificação KYC concluída com sucesso!');
  };

  const handleUploadDocumento = (file: File, tipo: string) => {
    const novoDoc = {
      tipo,
      nome: file.name,
      arquivo: file,
      status: 'pendente' as const,
      observacoes: 'Documento enviado com sucesso! Aguardando análise...',
    };

    setFormData(prev => ({
      ...prev,
      documentos: [...prev.documentos.filter(d => d.tipo !== tipo), novoDoc],
    }));

    toast.success(`📄 Documento enviado!`);

    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        documentos: prev.documentos.map(d =>
          d.tipo === tipo
            ? {
                ...d,
                status: 'concluido' as const,
                observacoes: '✅ Documento processado! Pronto para verificação na Etapa 4.',
              }
            : d
        ),
      }));
    }, 3000);
  };

  const finalizarKYC = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success('🎉 Verificação KYC concluída com sucesso!');
    setLoading(false);
    onComplete();
  };

  const renderEtapa = () => {
    switch (etapaAtual) {
      case 1:
        return <EtapaDadosBasicos formData={formData} setFormData={setFormData} />;
      case 2:
        return <EtapaEndereco formData={formData} setFormData={setFormData} />;
      case 3:
        return <EtapaDocumentacao formData={formData} onUpload={handleUploadDocumento} />;
      case 4:
        return <EtapaVerificacao verificando={verificando} progresso={progresso} formData={formData} />;
      case 5:
        return <EtapaFinalizacao formData={formData} onFinalizar={finalizarKYC} loading={loading} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          {etapas.map((etapa, index) => (
            <div key={etapa.numero} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                etapaAtual > etapa.numero
                  ? 'bg-green-500 text-white'
                  : etapaAtual === etapa.numero
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
              }`}>
                {etapaAtual > etapa.numero ? <CheckCircle className="h-5 w-5" /> : etapa.numero}
              </div>
              {index < etapas.length - 1 && (
                <div className={`w-20 h-1 mx-2 ${etapaAtual > etapa.numero ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Etapa {etapaAtual} de {etapas.length} - {etapas[etapaAtual - 1].titulo}
        </p>
      </div>

      {/* Conteúdo da etapa */}
      <div className="min-h-[500px]">{renderEtapa()}</div>

      {/* Navegação */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={etapaAnterior} disabled={etapaAtual === 1}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        <div className="flex gap-2">
          {etapaAtual < etapas.length ? (
            <Button onClick={proximaEtapa}>
              {etapaAtual === 4 && progresso === 0 && !verificando
                ? 'Iniciar Verificação'
                : 'Próxima'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={finalizarKYC} disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? 'Finalizando...' : 'Finalizar Verificação'}
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PerfilPage() {
  const navigate = useNavigate();
  const { currentUser } = useDemoUser();
  const { kycStatus, loading: kycLoading } = useKYCStatus();
  const { isAdmin, isDemoUserActive } = useDemoUser();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('dados');
  const [showKYCForm, setShowKYCForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: currentUser?.name || 'João Silva',
    email: currentUser?.email || 'joao.silva@empresa.com',
    telefone: '(11) 99999-9999',
    cpf: '123.456.789-00',
    endereco: 'Rua das Flores, 123',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
    cargo: 'Contador',
    departamento: 'Fiscal',
    biografia: 'Contador com 15 anos de experiência em gestão fiscal e tributária.',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados do perfil:', formData);
    toast.success('Perfil atualizado com sucesso!');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Upload de imagem:', file);
      toast.success('Foto do perfil atualizada!');
    }
  };

  const getKYCStatusInfo = () => {
    if (kycLoading) return { icon: <Clock className="h-4 w-4 text-gray-400" />, label: 'Carregando...', color: 'gray' };
    
    if (!kycStatus) {
      return { 
        icon: <Shield className="h-4 w-4 text-yellow-500" />, 
        label: 'KYC Pendente', 
        color: 'yellow',
        description: 'Complete sua verificação de identidade para acessar todas as funcionalidades'
      };
    }

    switch (kycStatus.status) {
      case 'approved':
        return { 
          icon: <CheckCircle className="h-4 w-4 text-green-500" />, 
          label: 'KYC Aprovado', 
          color: 'green',
          description: 'Verificação completa e aprovada'
        };
      case 'pending':
        return { 
          icon: <Clock className="h-4 w-4 text-yellow-500" />, 
          label: 'KYC Pendente', 
          color: 'yellow',
          description: 'Inicie sua verificação de identidade'
        };
      case 'incomplete':
        return { 
          icon: <AlertTriangle className="h-4 w-4 text-orange-500" />, 
          label: 'KYC Incompleto', 
          color: 'orange',
          description: 'Continue o processo de verificação'
        };
      case 'completed':
        return { 
          icon: <Clock className="h-4 w-4 text-blue-500" />, 
          label: 'KYC em Análise', 
          color: 'blue',
          description: 'Aguardando análise da documentação'
        };
      case 'rejected':
        return { 
          icon: <XCircle className="h-4 w-4 text-red-500" />, 
          label: 'KYC Rejeitado', 
          color: 'red',
          description: 'Documentação rejeitada - refaça o processo'
        };
      default:
        return { 
          icon: <Shield className="h-4 w-4 text-gray-400" />, 
          label: 'KYC Necessário', 
          color: 'gray',
          description: 'Verificação de identidade necessária'
        };
    }
  };

  const kycInfo = getKYCStatusInfo();

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Perfil do Usuário</h1>
          <p className="text-sm text-gray-600">
            Gerencie suas informações pessoais e configurações de conta
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
              <Crown className="h-4 w-4 mr-2" />
              Administrador
            </Badge>
          )}
          {isDemoUserActive && (
            <Badge variant="outline" className="border-gray-300 text-gray-700">
              Usuário Demo
            </Badge>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="kyc">Verificação KYC</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          <TabsTrigger value="preferencias">Preferências</TabsTrigger>
        </TabsList>

        <TabsContent value="dados" className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Foto do Perfil */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Camera className="h-5 w-5 text-blue-600" />
                  Foto do Perfil
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={currentUser?.avatar || "/placeholder-avatar.jpg"} alt="Foto do perfil" />
                    <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                      {formData.nome.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <Button type="button" variant="outline" asChild className="border-gray-300 hover:bg-gray-50">
                      <label htmlFor="avatar-upload" className="cursor-pointer">
                        <Camera className="mr-2 h-4 w-4" />
                        Alterar Foto
                      </label>
                    </Button>
                    <p className="text-sm text-gray-600 mt-2">
                      PNG, JPG até 5MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações Pessoais */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <User className="h-5 w-5 text-blue-600" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome" className="text-sm font-medium text-gray-700">Nome Completo</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cpf" className="text-sm font-medium text-gray-700">CPF</Label>
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                      className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cargo">Cargo</Label>
                    <Input
                      id="cargo"
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="departamento">Departamento</Label>
                    <Input
                      id="departamento"
                      value={formData.departamento}
                      onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="biografia">Biografia</Label>
                  <Textarea
                    id="biografia"
                    value={formData.biografia}
                    onChange={(e) => setFormData({ ...formData, biografia: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Endereço */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Endereço
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      value={formData.endereco}
                      onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={formData.cidade}
                      onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                        {/* Adicionar outros estados */}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="kyc" className="space-y-6">
          {/* Status KYC */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Status da Verificação KYC
              </CardTitle>
              <CardDescription>
                Know Your Customer (KYC) é obrigatório para acessar todas as funcionalidades da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center space-x-3">
                  {kycInfo.icon}
                  <div>
                    <p className="text-sm font-medium">{kycInfo.label}</p>
                    <p className="text-xs text-muted-foreground">{kycInfo.description}</p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    // Ao invés de navegar, mostra o formulário KYC inline
                    setShowKYCForm(true);
                  }}
                  variant={kycStatus?.status === 'approved' ? 'outline' : 'default'}
                >
                  {kycStatus?.status === 'approved' ? (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      {kycStatus?.status === 'incomplete' ? 'Continuar' : 'Iniciar'} KYC
                    </>
                  )}
                </Button>
              </div>

              {kycStatus?.status === 'approved' && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium text-green-600">Verificação Completa</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✅ Identidade verificada</li>
                    <li>✅ Documentos aprovados</li>
                    <li>✅ Endereço confirmado</li>
                    <li>✅ Análise de risco concluída</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Formulário KYC Inline */}
          {showKYCForm && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Processo de Verificação KYC</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowKYCForm(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>
                  Complete o processo de verificação para acessar todas as funcionalidades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <KYCFormContent onComplete={() => {
                  setShowKYCForm(false);
                  toast.success('KYC enviado para análise!');
                }} />
              </CardContent>
            </Card>
          )}

          {/* Documentos */}
          <Card>
            <CardHeader>
              <CardTitle>Documentos Enviados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { nome: 'RG', status: 'aprovado' },
                  { nome: 'CPF', status: 'aprovado' },
                  { nome: 'Comprovante de Endereço', status: 'pendente' },
                  { nome: 'Comprovante de Renda', status: 'não enviado' },
                ].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{doc.nome}</span>
                    <Badge variant={
                      doc.status === 'aprovado' ? 'default' :
                      doc.status === 'pendente' ? 'secondary' : 'outline'
                    }>
                      {doc.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca" className="space-y-6">
          {/* Alterar Senha */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Alterar Senha
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="senhaAtual">Senha Atual</Label>
                <div className="relative">
                  <Input
                    id="senhaAtual"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.senhaAtual}
                    onChange={(e) => setFormData({ ...formData, senhaAtual: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="novaSenha">Nova Senha</Label>
                <Input
                  id="novaSenha"
                  type="password"
                  value={formData.novaSenha}
                  onChange={(e) => setFormData({ ...formData, novaSenha: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                <Input
                  id="confirmarSenha"
                  type="password"
                  value={formData.confirmarSenha}
                  onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                />
              </div>

              <Button type="button">
                <Save className="mr-2 h-4 w-4" />
                Alterar Senha
              </Button>
            </CardContent>
          </Card>

          {/* Configurações de Segurança */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Autenticação de Dois Fatores</p>
                  <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
                </div>
                <Button variant="outline">Configurar</Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sessões Ativas</p>
                  <p className="text-sm text-muted-foreground">Gerencie dispositivos conectados</p>
                </div>
                <Button variant="outline">Ver Sessões</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferencias" className="space-y-6">
          {/* Preferências do Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Preferências do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações por E-mail</p>
                  <p className="text-sm text-muted-foreground">Receber atualizações importantes</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações Push</p>
                  <p className="text-sm text-muted-foreground">Alertas no navegador</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Tema Escuro</p>
                  <p className="text-sm text-muted-foreground">Alternar entre claro e escuro</p>
                </div>
                <input type="checkbox" className="rounded" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componentes das etapas KYC - Fiéis ao original
function EtapaDadosBasicos({ formData, setFormData }: { formData: KYCFormData; setFormData: (data: KYCFormData) => void }) {
  const tipoOptions = [
    { value: 'pf', label: 'Pessoa Física', icon: <User className="h-4 w-4" /> },
    { value: 'pj', label: 'Pessoa Jurídica', icon: <Building className="h-4 w-4" /> },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Dados Básicos
        </CardTitle>
        <CardDescription>
          Informe seus dados pessoais ou empresariais
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tipo de Pessoa */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Tipo de Pessoa</Label>
          <div className="grid grid-cols-2 gap-3">
            {tipoOptions.map((option) => (
              <div
                key={option.value}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  formData.tipo === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setFormData({ ...formData, tipo: option.value as 'pf' | 'pj' })}
              >
                <div className="flex items-center gap-2">
                  {option.icon}
                  <span className="font-medium">{option.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {formData.tipo === 'pf' ? (
          <>
            {/* Dados Pessoa Física */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Digite seu nome completo"
                />
              </div>
              <div>
                <Label htmlFor="documento">CPF *</Label>
                <Input
                  id="documento"
                  value={formData.documento}
                  onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                  placeholder="000.000.000-00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={formData.dataNascimento || ''}
                  onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="nacionalidade">Nacionalidade *</Label>
                <Select
                  value={formData.nacionalidade}
                  onValueChange={(value) => setFormData({ ...formData, nacionalidade: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BR">Brasileira</SelectItem>
                    <SelectItem value="US">Americana</SelectItem>
                    <SelectItem value="PT">Portuguesa</SelectItem>
                    <SelectItem value="ES">Espanhola</SelectItem>
                    <SelectItem value="IT">Italiana</SelectItem>
                    <SelectItem value="FR">Francesa</SelectItem>
                    <SelectItem value="DE">Alemã</SelectItem>
                    <SelectItem value="JP">Japonesa</SelectItem>
                    <SelectItem value="CN">Chinesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="profissao">Profissão</Label>
                <Input
                  id="profissao"
                  value={formData.profissao || ''}
                  onChange={(e) => setFormData({ ...formData, profissao: e.target.value })}
                  placeholder="Sua profissão"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="renda">Renda Mensal (R$)</Label>
              <Input
                id="renda"
                type="number"
                value={formData.renda || ''}
                onChange={(e) => setFormData({ ...formData, renda: Number(e.target.value) })}
                placeholder="0,00"
              />
            </div>
          </>
        ) : (
          <>
            {/* Dados Pessoa Jurídica */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="razaoSocial">Razão Social *</Label>
                <Input
                  id="razaoSocial"
                  value={formData.razaoSocial || ''}
                  onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                  placeholder="Razão social da empresa"
                />
              </div>
              <div>
                <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                <Input
                  id="nomeFantasia"
                  value={formData.nomeFantasia || ''}
                  onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
                  placeholder="Nome fantasia"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="documento">CNPJ *</Label>
                <Input
                  id="documento"
                  value={formData.documento}
                  onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                  placeholder="00.000.000/0000-00"
                />
              </div>
              <div>
                <Label htmlFor="cnae">CNAE Principal</Label>
                <Input
                  id="cnae"
                  value={formData.cnae || ''}
                  onChange={(e) => setFormData({ ...formData, cnae: e.target.value })}
                  placeholder="0000-0/00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contato@empresa.com"
                />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(11) 3333-3333"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="porte">Porte da Empresa</Label>
                <Select
                  value={formData.porte || ''}
                  onValueChange={(value) => setFormData({ ...formData, porte: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mei">MEI</SelectItem>
                    <SelectItem value="micro">Microempresa</SelectItem>
                    <SelectItem value="pequena">Pequena</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="grande">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="faturamento">Faturamento Anual (R$)</Label>
                <Input
                  id="faturamento"
                  type="number"
                  value={formData.faturamento || ''}
                  onChange={(e) => setFormData({ ...formData, faturamento: Number(e.target.value) })}
                  placeholder="0,00"
                />
              </div>
              <div>
                <Label htmlFor="funcionarios">Nº de Funcionários</Label>
                <Input
                  id="funcionarios"
                  type="number"
                  value={formData.funcionarios || ''}
                  onChange={(e) => setFormData({ ...formData, funcionarios: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="dataConstituicao">Data de Constituição</Label>
              <Input
                id="dataConstituicao"
                type="date"
                value={formData.dataConstituicao || ''}
                onChange={(e) => setFormData({ ...formData, dataConstituicao: e.target.value })}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function EtapaEndereco({ formData, setFormData }: { formData: KYCFormData; setFormData: (data: KYCFormData) => void }) {
  const consultarCEP = async (cep: string) => {
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData({
            ...formData,
            cep,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            uf: data.uf,
          });
          toast.success('CEP encontrado!');
        } else {
          toast.error('CEP não encontrado');
        }
      } catch (error) {
        toast.error('Erro ao consultar CEP');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Endereço
        </CardTitle>
        <CardDescription>
          Informe seu endereço completo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <Label htmlFor="cep">CEP *</Label>
            <Input
              id="cep"
              value={formData.cep}
              onChange={(e) => {
                const cep = e.target.value.replace(/\D/g, '');
                setFormData({ ...formData, cep });
                if (cep.length === 8) {
                  consultarCEP(cep);
                }
              }}
              placeholder="00000-000"
              maxLength={8}
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="logradouro">Logradouro *</Label>
            <Input
              id="logradouro"
              value={formData.logradouro}
              onChange={(e) => setFormData({ ...formData, logradouro: e.target.value })}
              placeholder="Rua, Avenida, etc."
            />
          </div>
          <div>
            <Label htmlFor="numero">Número *</Label>
            <Input
              id="numero"
              value={formData.numero}
              onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
              placeholder="123"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="complemento">Complemento</Label>
            <Input
              id="complemento"
              value={formData.complemento || ''}
              onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
              placeholder="Apt, Sala, etc."
            />
          </div>
          <div>
            <Label htmlFor="bairro">Bairro *</Label>
            <Input
              id="bairro"
              value={formData.bairro}
              onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
              placeholder="Nome do bairro"
            />
          </div>
          <div>
            <Label htmlFor="cidade">Cidade *</Label>
            <Input
              id="cidade"
              value={formData.cidade}
              onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
              placeholder="Nome da cidade"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="uf">Estado (UF) *</Label>
            <Select
              value={formData.uf}
              onValueChange={(value) => setFormData({ ...formData, uf: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AC">Acre</SelectItem>
                <SelectItem value="AL">Alagoas</SelectItem>
                <SelectItem value="AP">Amapá</SelectItem>
                <SelectItem value="AM">Amazonas</SelectItem>
                <SelectItem value="BA">Bahia</SelectItem>
                <SelectItem value="CE">Ceará</SelectItem>
                <SelectItem value="DF">Distrito Federal</SelectItem>
                <SelectItem value="ES">Espírito Santo</SelectItem>
                <SelectItem value="GO">Goiás</SelectItem>
                <SelectItem value="MA">Maranhão</SelectItem>
                <SelectItem value="MT">Mato Grosso</SelectItem>
                <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                <SelectItem value="MG">Minas Gerais</SelectItem>
                <SelectItem value="PA">Pará</SelectItem>
                <SelectItem value="PB">Paraíba</SelectItem>
                <SelectItem value="PR">Paraná</SelectItem>
                <SelectItem value="PE">Pernambuco</SelectItem>
                <SelectItem value="PI">Piauí</SelectItem>
                <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                <SelectItem value="RO">Rondônia</SelectItem>
                <SelectItem value="RR">Roraima</SelectItem>
                <SelectItem value="SC">Santa Catarina</SelectItem>
                <SelectItem value="SP">São Paulo</SelectItem>
                <SelectItem value="SE">Sergipe</SelectItem>
                <SelectItem value="TO">Tocantins</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="pais">País *</Label>
            <Select
              value={formData.pais}
              onValueChange={(value) => setFormData({ ...formData, pais: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BR">Brasil</SelectItem>
                <SelectItem value="US">Estados Unidos</SelectItem>
                <SelectItem value="PT">Portugal</SelectItem>
                <SelectItem value="ES">Espanha</SelectItem>
                <SelectItem value="IT">Itália</SelectItem>
                <SelectItem value="FR">França</SelectItem>
                <SelectItem value="DE">Alemanha</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EtapaDocumentacao({ formData, onUpload }: { formData: KYCFormData; onUpload: (file: File, tipo: string) => void }) {
  const documentos = documentosRequeridos[formData.tipo] || [];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, tipo: string) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file, tipo);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejeitado':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'analisando':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'concluido':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovado':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejeitado':
        return <X className="h-4 w-4 text-red-600" />;
      case 'analisando':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'concluido':
        return <FileText className="h-4 w-4 text-blue-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documentação
        </CardTitle>
        <CardDescription>
          Envie os documentos necessários para verificação
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Seus documentos são tratados com máxima segurança e usados apenas para verificação de identidade.
            Todos os arquivos são criptografados e armazenados em servidores seguros.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {documentos.map((doc) => {
            const documentoEnviado = formData.documentos.find(d => d.tipo === doc.tipo);
            
            return (
              <div key={doc.tipo} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{doc.nome}</h3>
                      {doc.obrigatorio && (
                        <Badge variant="destructive" className="text-xs">
                          Obrigatório
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{doc.descricao}</p>
                    <p className="text-xs text-gray-500">
                      Formatos aceitos: {doc.formatos.join(', ').toUpperCase()}
                    </p>
                    {doc.exemplo && (
                      <p className="text-xs text-blue-600 mt-1">
                        💡 {doc.exemplo}
                      </p>
                    )}
                  </div>
                </div>

                {documentoEnviado ? (
                  <div className={`border rounded-lg p-3 ${getStatusColor(documentoEnviado.status)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(documentoEnviado.status)}
                        <span className="font-medium">{documentoEnviado.nome}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {documentoEnviado.status}
                      </Badge>
                    </div>
                    {documentoEnviado.observacoes && (
                      <p className="text-sm mt-2">{documentoEnviado.observacoes}</p>
                    )}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Clique para enviar ou arraste o arquivo aqui
                      </p>
                      <input
                        type="file"
                        accept={doc.formatos.map(f => `.${f}`).join(',')}
                        onChange={(e) => handleFileUpload(e, doc.tipo)}
                        className="hidden"
                        id={`file-${doc.tipo}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <label htmlFor={`file-${doc.tipo}`} className="cursor-pointer">
                          Selecionar Arquivo
                        </label>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Dicas para envio de documentos:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Certifique-se de que as imagens estão nítidas e bem iluminadas</li>
            <li>• Evite reflexos, sombras ou texto cortado</li>
            <li>• Use formatos de arquivo compatíveis (JPG, PNG, PDF)</li>
            <li>• Tamanho máximo por arquivo: 10MB</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function EtapaVerificacao({ verificando, progresso, formData }: { verificando: boolean; progresso: number; formData: KYCFormData }) {
  const verificacoes = [
    { nome: 'Verificação de Identidade', concluida: progresso > 16 },
    { nome: 'Validação de Endereço', concluida: progresso > 33 },
    { nome: 'Análise de Documentos', concluida: progresso > 50 },
    { nome: 'Verificação de Compliance', concluida: progresso > 66 },
    { nome: 'Consulta a Bases Restritivas', concluida: progresso > 83 },
    { nome: 'Scoring Final', concluida: progresso === 100 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Verificação Automática
        </CardTitle>
        <CardDescription>
          Aguarde enquanto verificamos suas informações
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {verificando && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progresso da Verificação</span>
              <span className="text-sm text-gray-500">{Math.round(progresso)}%</span>
            </div>
            <Progress value={progresso} className="w-full" />
          </div>
        )}

        <div className="space-y-3">
          {verificacoes.map((verificacao, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                verificacao.concluida
                  ? 'bg-green-50 border-green-200'
                  : verificando && progresso > (index * 16.66)
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200'
              }`}
            >
              {verificacao.concluida ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : verificando && progresso > (index * 16.66) ? (
                <Clock className="h-5 w-5 text-blue-600 animate-spin" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
              )}
              <span className={`font-medium ${
                verificacao.concluida
                  ? 'text-green-700'
                  : verificando && progresso > (index * 16.66)
                    ? 'text-blue-700'
                    : 'text-gray-600'
              }`}>
                {verificacao.nome}
              </span>
            </div>
          ))}
        </div>

        {progresso === 100 && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              ✅ Todas as verificações foram concluídas com sucesso! 
              Você pode prosseguir para a finalização.
            </AlertDescription>
          </Alert>
        )}

        {!verificando && progresso === 0 && (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-700 mb-2">Pronto para Verificação</h3>
            <p className="text-gray-500 text-sm">
              Clique em "Iniciar Verificação" para começar a análise automática dos seus dados.
            </p>
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">Resumo dos Dados:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Tipo:</strong> {formData.tipo === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}</p>
            <p><strong>Nome:</strong> {formData.nome || formData.razaoSocial}</p>
            <p><strong>Documento:</strong> {formData.documento}</p>
            <p><strong>E-mail:</strong> {formData.email}</p>
            <p><strong>Endereço:</strong> {formData.logradouro}, {formData.numero} - {formData.cidade}/{formData.uf}</p>
            <p><strong>Documentos:</strong> {formData.documentos.length} arquivo(s) enviado(s)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EtapaFinalizacao({ formData, onFinalizar, loading }: { formData: KYCFormData; onFinalizar: () => void; loading: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Finalização
        </CardTitle>
        <CardDescription>
          Revise suas informações e finalize a verificação
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            🎉 Parabéns! Sua verificação KYC foi concluída com sucesso. 
            Todas as informações foram validadas e aprovadas pelo nosso sistema.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resumo dos Dados */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Dados Verificados</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">
                  <strong>Identidade:</strong> {formData.nome || formData.razaoSocial}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">
                  <strong>Documento:</strong> {formData.documento}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">
                  <strong>E-mail:</strong> {formData.email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">
                  <strong>Endereço:</strong> Verificado
                </span>
              </div>
            </div>
          </div>

          {/* Status dos Documentos */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Documentos Aprovados</h3>
            <div className="space-y-2">
              {formData.documentos.map((doc, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>{doc.nome}</span>
                  <Badge variant="default" className="text-xs">
                    Aprovado
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Informações Importantes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Próximos Passos:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Acesso completo à plataforma liberado</li>
            <li>• Todas as funcionalidades de tokenização disponíveis</li>
            <li>• Capacidade de realizar transações até R$ 50.000/mês</li>
            <li>• Suporte prioritário ativado</li>
            <li>• Certificado digital de verificação disponível</li>
          </ul>
        </div>

        <div className="text-center pt-4">
          <Button
            onClick={onFinalizar}
            disabled={loading}
            size="lg"
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Finalizando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Finalizar Verificação KYC
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}