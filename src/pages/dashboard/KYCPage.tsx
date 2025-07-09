import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Clock,
  User,
  Building,
  FileText,
  Shield,
  Star,
  Upload,
  ArrowRight,
  ArrowLeft,
  X,
  Eye,
  MapPin,
  Scan,
  Fingerprint,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

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

interface DocumentRequirement {
  tipo: string;
  nome: string;
  obrigatorio: boolean;
  descricao: string;
  formatos: string[];
  exemplo?: string;
}

const documentosRequeridos: Record<string, DocumentRequirement[]> = {
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
    {
      tipo: 'comprovante_renda',
      nome: 'Comprovante de Renda',
      obrigatorio: true,
      descricao: 'Holerite, declaração IR ou extrato bancário',
      formatos: ['jpg', 'png', 'pdf'],
      exemplo: 'Documento que comprove sua renda mensal',
    },
    {
      tipo: 'selfie',
      nome: 'Selfie com Documento',
      obrigatorio: true,
      descricao: 'Foto pessoal segurando o RG',
      formatos: ['jpg', 'png'],
      exemplo: 'Foto sua segurando o RG ao lado do rosto',
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
    {
      tipo: 'documento_representante',
      nome: 'RG e CPF do Representante Legal',
      obrigatorio: true,
      descricao: 'Documentos do responsável pela empresa',
      formatos: ['jpg', 'png', 'pdf'],
      exemplo: 'RG e CPF do sócio administrador',
    },
    {
      tipo: 'certidoes_regularidade',
      nome: 'Certidões de Regularidade',
      obrigatorio: true,
      descricao: 'Federal, Estadual, Municipal, FGTS e Trabalhista',
      formatos: ['pdf'],
      exemplo: 'Certidões negativas atualizadas',
    },
    {
      tipo: 'balanco_patrimonial',
      nome: 'Balanço Patrimonial',
      obrigatorio: false,
      descricao: 'Último exercício fiscal (se disponível)',
      formatos: ['pdf'],
      exemplo: 'Demonstrativo financeiro assinado pelo contador',
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

export default function KYCPage() {
  const navigate = useNavigate();
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
      // Na etapa 4, se ainda não iniciou verificação, apenas inicia (não avança)
      iniciarVerificacao();
      return;
    }

    // Para todas as outras etapas, avança normalmente
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

      // Na etapa de análise de documentos, aprova os documentos concluídos
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
    toast.success('🎉 Verificação KYC concluída com sucesso!', {
      description: 'Todos os documentos foram aprovados. Você pode avançar para finalização.',
    });
  };

  const consultarCEP = async (cep: string) => {
    if (cep.length === 8) {
      setLoading(true);
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          logradouro: 'Rua das Flores, 123',
          bairro: 'Centro',
          cidade: 'São Paulo',
          uf: 'SP',
        }));
        setLoading(false);
        toast.success('CEP encontrado!');
      }, 1000);
    }
  };

  const handleUploadDocumento = (file: File, tipo: string) => {
    // Primeiro, marca como "enviado" com status pendente
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

    // Notifica upload bem-sucedido
    toast.success(`📄 Documento enviado!`, {
      description: 'Upload realizado com sucesso. Aguardando verificação na etapa 4...',
    });

    // Simula processamento e marca como concluído (não aprovado ainda)
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        documentos: prev.documentos.map(d =>
          d.tipo === tipo
            ? {
                ...d,
                status: 'analisando' as const,
                observacoes: 'Processando documento... Aguardando verificação completa...',
              }
            : d
        ),
      }));

      toast.info('🔍 Processando documento...', {
        description: 'Documento recebido. Verificação acontecerá na Etapa 4.',
      });
    }, 1000);

    // Marca como concluído (pronto para verificação na etapa 4)
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

      toast.success(`✅ Documento processado!`, {
        description: 'Documento pronto para verificação na próxima etapa.',
      });
    }, 3000);
  };

  const finalizarKYC = async () => {
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    toast.success('🎉 Verificação KYC concluída com sucesso!', {
      description:
        'Seu perfil foi aprovado e você já pode utilizar todos os recursos da plataforma.',
      duration: 5000,
    });

    setLoading(false);

    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const renderEtapa = () => {
    switch (etapaAtual) {
      case 1:
        return <EtapaDadosBasicos formData={formData} setFormData={setFormData} />;
      case 2:
        return (
          <EtapaEndereco
            formData={formData}
            setFormData={setFormData}
            onConsultarCEP={consultarCEP}
            loading={loading}
          />
        );
      case 3:
        return <EtapaDocumentacao formData={formData} onUpload={handleUploadDocumento} />;
      case 4:
        return (
          <EtapaVerificacao verificando={verificando} progresso={progresso} formData={formData} />
        );
      case 5:
        return (
          <EtapaFinalizacao formData={formData} onFinalizar={finalizarKYC} loading={loading} />
        );
      default:
        return null;
    }
  };

  const podeProximaEtapa = () => {
    switch (etapaAtual) {
      case 1:
        return formData.nome && formData.documento && formData.email && formData.telefone;
      case 2:
        return formData.cep && formData.logradouro && formData.cidade;
      case 3:
        const docsObrigatorios = documentosRequeridos[formData.tipo].filter(d => d.obrigatorio);
        const docsEnviados = formData.documentos.filter(
          d =>
            d.status === 'pendente' ||
            d.status === 'analisando' ||
            d.status === 'concluido' ||
            d.status === 'aprovado'
        );
        return docsEnviados.length >= docsObrigatorios.length;
      case 4:
        // Permite clicar se:
        // 1. Há documentos prontos para verificação (progresso === 0 e não verificando)
        // 2. Verificação foi concluída (progresso === 100 e não verificando)
        const documentosEnviados = formData.documentos.filter(
          d => d.status === 'concluido' || d.status === 'aprovado'
        );
        return (
          !verificando && ((progresso === 0 && documentosEnviados.length > 0) || progresso === 100)
        );
      default:
        return true;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">🛡️ Verificação KYC</h1>
          <p className="text-muted-foreground">
            Complete sua verificação de identidade e compliance
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progresso da Verificação</CardTitle>
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
                <Button onClick={proximaEtapa} disabled={!podeProximaEtapa()}>
                  {etapaAtual === 4 && progresso === 0 && !verificando
                    ? 'Iniciar Verificação'
                    : 'Próxima'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={finalizarKYC}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Finalizando...' : 'Finalizar Verificação'}
                  <CheckCircle className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EtapaDadosBasicos({
  formData,
  setFormData,
}: {
  formData: KYCFormData;
  setFormData: React.Dispatch<React.SetStateAction<KYCFormData>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Dados Básicos
        </CardTitle>
        <CardDescription>Informe seus dados pessoais ou empresariais</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Tipo de Pessoa</Label>
          <Select
            value={formData.tipo}
            onValueChange={(value: 'pf' | 'pj') => setFormData(prev => ({ ...prev, tipo: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pf">Pessoa Física</SelectItem>
              <SelectItem value="pj">Pessoa Jurídica</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nome">
              {formData.tipo === 'pf' ? 'Nome Completo' : 'Razão Social'}
            </Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={e => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder={formData.tipo === 'pf' ? 'Seu nome completo' : 'Razão social da empresa'}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documento">{formData.tipo === 'pf' ? 'CPF' : 'CNPJ'}</Label>
            <Input
              id="documento"
              value={formData.documento}
              onChange={e => setFormData(prev => ({ ...prev, documento: e.target.value }))}
              placeholder={formData.tipo === 'pf' ? '000.000.000-00' : '00.000.000/0000-00'}
              required
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={e => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
              placeholder="(11) 99999-9999"
              required
            />
          </div>
        </div>

        {formData.tipo === 'pf' && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="dataNascimento">Data de Nascimento</Label>
              <Input
                id="dataNascimento"
                type="date"
                value={formData.dataNascimento || ''}
                onChange={e => setFormData(prev => ({ ...prev, dataNascimento: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profissao">Profissão</Label>
              <Input
                id="profissao"
                value={formData.profissao || ''}
                onChange={e => setFormData(prev => ({ ...prev, profissao: e.target.value }))}
                placeholder="Sua profissão"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renda">Renda Mensal (R$)</Label>
              <Input
                id="renda"
                type="number"
                value={formData.renda || ''}
                onChange={e => setFormData(prev => ({ ...prev, renda: Number(e.target.value) }))}
                placeholder="5000"
              />
            </div>
          </div>
        )}

        {formData.tipo === 'pj' && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                <Input
                  id="nomeFantasia"
                  value={formData.nomeFantasia || ''}
                  onChange={e => setFormData(prev => ({ ...prev, nomeFantasia: e.target.value }))}
                  placeholder="Nome fantasia da empresa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnae">CNAE Principal</Label>
                <Input
                  id="cnae"
                  value={formData.cnae || ''}
                  onChange={e => setFormData(prev => ({ ...prev, cnae: e.target.value }))}
                  placeholder="0000-0/00"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Porte da Empresa</Label>
                <Select
                  value={formData.porte || ''}
                  onValueChange={value => setFormData(prev => ({ ...prev, porte: value as any }))}
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
              <div className="space-y-2">
                <Label htmlFor="faturamento">Faturamento Anual (R$)</Label>
                <Input
                  id="faturamento"
                  type="number"
                  value={formData.faturamento || ''}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, faturamento: Number(e.target.value) }))
                  }
                  placeholder="1000000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="funcionarios">Número de Funcionários</Label>
                <Input
                  id="funcionarios"
                  type="number"
                  value={formData.funcionarios || ''}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, funcionarios: Number(e.target.value) }))
                  }
                  placeholder="10"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EtapaEndereco({
  formData,
  setFormData,
  onConsultarCEP,
  loading,
}: {
  formData: KYCFormData;
  setFormData: React.Dispatch<React.SetStateAction<KYCFormData>>;
  onConsultarCEP: (cep: string) => void;
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Endereço
        </CardTitle>
        <CardDescription>Informe seu endereço completo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="cep">CEP</Label>
            <Input
              id="cep"
              value={formData.cep}
              onChange={e => {
                const cep = e.target.value.replace(/\D/g, '');
                setFormData(prev => ({ ...prev, cep }));
                if (cep.length === 8) {
                  onConsultarCEP(cep);
                }
              }}
              placeholder="00000-000"
              maxLength={8}
              required
            />
            {loading && <p className="text-sm text-blue-600">Consultando CEP...</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="uf">Estado</Label>
            <Select
              value={formData.uf}
              onValueChange={value => setFormData(prev => ({ ...prev, uf: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="UF" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SP">São Paulo</SelectItem>
                <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                <SelectItem value="MG">Minas Gerais</SelectItem>
                <SelectItem value="RS">Rio Grande do Sul</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cidade">Cidade</Label>
            <Input
              id="cidade"
              value={formData.cidade}
              onChange={e => setFormData(prev => ({ ...prev, cidade: e.target.value }))}
              placeholder="Nome da cidade"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="logradouro">Logradouro</Label>
            <Input
              id="logradouro"
              value={formData.logradouro}
              onChange={e => setFormData(prev => ({ ...prev, logradouro: e.target.value }))}
              placeholder="Rua, Avenida, etc."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numero">Número</Label>
            <Input
              id="numero"
              value={formData.numero}
              onChange={e => setFormData(prev => ({ ...prev, numero: e.target.value }))}
              placeholder="123"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="complemento">Complemento</Label>
            <Input
              id="complemento"
              value={formData.complemento || ''}
              onChange={e => setFormData(prev => ({ ...prev, complemento: e.target.value }))}
              placeholder="Apt, Sala, etc."
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bairro">Bairro</Label>
          <Input
            id="bairro"
            value={formData.bairro}
            onChange={e => setFormData(prev => ({ ...prev, bairro: e.target.value }))}
            placeholder="Nome do bairro"
            required
          />
        </div>
      </CardContent>
    </Card>
  );
}

function EtapaDocumentacao({
  formData,
  onUpload,
}: {
  formData: KYCFormData;
  onUpload: (file: File, tipo: string) => void;
}) {
  const documentos = documentosRequeridos[formData.tipo];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documentação
        </CardTitle>
        <CardDescription>Faça upload dos documentos necessários para verificação</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {documentos.map(doc => {
          const docEnviado = formData.documentos.find(d => d.tipo === doc.tipo);

          // Determina a cor e o texto do badge baseado no status
          const getBadgeProps = () => {
            if (!docEnviado) {
              return doc.obrigatorio
                ? {
                    variant: 'destructive' as const,
                    text: 'Obrigatório',
                    className: 'bg-red-100 text-red-800',
                  }
                : {
                    variant: 'secondary' as const,
                    text: 'Opcional',
                    className: 'bg-gray-100 text-gray-600',
                  };
            }

            switch (docEnviado.status) {
              case 'pendente':
                return {
                  variant: 'secondary' as const,
                  text: 'Enviado',
                  className: 'bg-blue-100 text-blue-800',
                };
              case 'analisando':
                return {
                  variant: 'secondary' as const,
                  text: 'Processando',
                  className: 'bg-yellow-100 text-yellow-800',
                };
              case 'concluido':
                return {
                  variant: 'default' as const,
                  text: '✅ Processado',
                  className: 'bg-green-100 text-green-800',
                };
              case 'aprovado':
                return {
                  variant: 'default' as const,
                  text: '✅ Aprovado',
                  className: 'bg-green-100 text-green-800',
                };
              case 'rejeitado':
                return {
                  variant: 'destructive' as const,
                  text: '❌ Rejeitado',
                  className: 'bg-red-100 text-red-800',
                };
              default:
                return {
                  variant: 'secondary' as const,
                  text: 'Pendente',
                  className: 'bg-gray-100 text-gray-600',
                };
            }
          };

          const badgeProps = getBadgeProps();

          const getBorderColor = () => {
            if (!docEnviado) return 'border-red-200';
            switch (docEnviado.status) {
              case 'pendente':
                return 'border-blue-200';
              case 'analisando':
                return 'border-yellow-200';
              case 'concluido':
                return 'border-green-200';
              case 'aprovado':
                return 'border-emerald-200';
              case 'rejeitado':
                return 'border-red-200';
              default:
                return 'border-gray-200';
            }
          };

          return (
            <div
              key={doc.tipo}
              className={`border rounded-lg p-4 space-y-3 hover:border-blue-200 transition-colors ${getBorderColor()}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{doc.nome}</h4>
                    <Badge
                      variant={badgeProps.variant}
                      className={`text-xs font-medium ${badgeProps.className}`}
                    >
                      {badgeProps.text}
                    </Badge>
                    {docEnviado?.status === 'analisando' && (
                      <div className="flex items-center gap-1">
                        <div className="animate-spin h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{doc.descricao}</p>
                  {doc.exemplo && <p className="text-xs text-blue-600 mb-1">💡 {doc.exemplo}</p>}
                  <p className="text-xs text-gray-500">
                    Formatos aceitos: {doc.formatos.join(', ').toUpperCase()} • Máx. 10MB
                  </p>
                </div>

                <div className="flex gap-2 ml-4">
                  {docEnviado && (
                    <Button variant="outline" size="sm" className="h-8">
                      <Eye className="h-3 w-3" />
                    </Button>
                  )}
                  <div className="relative">
                    <input
                      type="file"
                      id={`upload-${doc.tipo}`}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      accept={doc.formatos.map(f => `.${f}`).join(',')}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Validação de tamanho (10MB)
                          if (file.size > 10 * 1024 * 1024) {
                            toast.error('Arquivo muito grande!', {
                              description: 'O arquivo deve ter no máximo 10MB.',
                            });
                            return;
                          }

                          // Validação de formato
                          const fileExtension = file.name.split('.').pop()?.toLowerCase();
                          if (!doc.formatos.includes(fileExtension || '')) {
                            toast.error('Formato não suportado!', {
                              description: `Apenas arquivos ${doc.formatos.join(', ').toUpperCase()} são aceitos.`,
                            });
                            return;
                          }

                          onUpload(file, doc.tipo);
                        }
                        // Limpa o input para permitir reenvio do mesmo arquivo
                        e.target.value = '';
                      }}
                    />
                    <Button
                      variant={docEnviado?.status === 'aprovado' ? 'secondary' : 'default'}
                      size="sm"
                      className="h-8 relative z-0"
                      type="button"
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      {docEnviado
                        ? docEnviado.status === 'aprovado'
                          ? 'Reenviar'
                          : 'Alterar'
                        : 'Enviar'}
                    </Button>
                  </div>
                </div>
              </div>

              {docEnviado && (
                <div
                  className={`p-3 rounded-lg border-l-4 ${
                    docEnviado.status === 'aprovado'
                      ? 'bg-green-50 border-l-green-500'
                      : docEnviado.status === 'analisando'
                        ? 'bg-yellow-50 border-l-yellow-500'
                        : docEnviado.status === 'rejeitado'
                          ? 'bg-red-50 border-l-red-500'
                          : 'bg-blue-50 border-l-blue-500'
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">{docEnviado.nome}</span>
                    {docEnviado.status === 'analisando' && (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">Processando...</span>
                      </div>
                    )}
                  </div>
                  {docEnviado.observacoes && (
                    <p
                      className={`text-sm ${
                        docEnviado.status === 'aprovado'
                          ? 'text-green-700'
                          : docEnviado.status === 'analisando'
                            ? 'text-yellow-700'
                            : docEnviado.status === 'rejeitado'
                              ? 'text-red-700'
                              : 'text-blue-700'
                      }`}
                    >
                      {docEnviado.observacoes}
                    </p>
                  )}

                  {/* Barra de progresso para análise */}
                  {docEnviado.status === 'analisando' && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-yellow-600 mb-1">
                        <span>Analisando documento...</span>
                        <span>Aguarde</span>
                      </div>
                      <div className="w-full bg-yellow-200 rounded-full h-1">
                        <div className="bg-yellow-500 h-1 rounded-full animate-pulse w-3/4"></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Resumo dos documentos */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <h4 className="font-medium text-blue-800">Status dos Documentos</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-600">
                {documentos.filter(d => d.obrigatorio).length}
              </div>
              <div className="text-gray-600">Obrigatórios</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {formData.documentos.filter(d => d.status === 'pendente').length}
              </div>
              <div className="text-blue-600">Enviados</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">
                {formData.documentos.filter(d => d.status === 'analisando').length}
              </div>
              <div className="text-yellow-600">Processando</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {formData.documentos.filter(d => d.status === 'concluido').length}
              </div>
              <div className="text-green-600">Processados</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-600">
                {formData.documentos.filter(d => d.status === 'aprovado').length}
              </div>
              <div className="text-emerald-600">Aprovados</div>
            </div>
          </div>
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            🔒 <strong>Segurança:</strong> Seus documentos são protegidos por criptografia AES-256 e
            processados de acordo com a LGPD. Os dados são automaticamente excluídos após aprovação.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function EtapaVerificacao({
  verificando,
  progresso,
  formData,
}: {
  verificando: boolean;
  progresso: number;
  formData: KYCFormData;
}) {
  const documentosEnviados = formData.documentos.filter(
    d => d.status === 'concluido' || d.status === 'aprovado'
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scan className="h-5 w-5" />
          Verificação Automática
        </CardTitle>
        <CardDescription>Aguarde enquanto verificamos suas informações</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!verificando && progresso === 0 ? (
          /* Estado inicial - pronto para verificar */
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <Clock className="h-16 w-16 mx-auto text-blue-500" />
              <div>
                <h3 className="text-lg font-medium text-blue-600">Pronto para Verificação</h3>
                <p className="text-gray-600">
                  Clique em "Próxima" para iniciar as verificações automáticas
                </p>
              </div>
            </div>

            {/* Lista de documentos prontos para verificação */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documentos Prontos para Verificação
              </h4>
              <div className="space-y-2">
                {documentosEnviados.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-white rounded border"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">{doc.nome}</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">✅ Processado</Badge>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-sm text-blue-700">
                📋 <strong>{documentosEnviados.length} documentos</strong> prontos para verificação
                automática
              </div>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Sistema de Verificação:</strong> Utilizamos IA avançada para validar
                documentos, verificar autenticidade e realizar consultas em bases governamentais.
              </AlertDescription>
            </Alert>
          </div>
        ) : verificando ? (
          /* Estado durante verificação */
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="animate-pulse">
                <Fingerprint className="h-16 w-16 mx-auto text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-600">Verificando informações...</h3>
                <p className="text-gray-600">Processamento em andamento</p>
              </div>
              <Progress value={progresso} className="w-full" />
              <p className="text-sm text-gray-500">{Math.round(progresso)}% concluído</p>
            </div>

            {/* Status detalhado dos documentos durante verificação */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-3 flex items-center gap-2">
                <Scan className="h-4 w-4" />
                Status da Verificação
              </h4>
              <div className="space-y-3">
                {documentosEnviados.map((doc, index) => {
                  // Simula progresso baseado no progresso geral
                  const docProgress = Math.min(100, Math.max(0, progresso - index * 15));
                  const isVerificando = docProgress > 0 && docProgress < 100;
                  const isCompleto = docProgress >= 100;

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white rounded border"
                    >
                      <div className="flex items-center gap-3">
                        {isCompleto ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : isVerificando ? (
                          <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                        ) : (
                          <Clock className="h-5 w-5 text-gray-400" />
                        )}
                        <div>
                          <span className="text-sm font-medium">{doc.nome}</span>
                          <div className="text-xs text-gray-500">
                            {isCompleto
                              ? 'Verificado e aprovado'
                              : isVerificando
                                ? 'Verificando autenticidade...'
                                : 'Aguardando verificação'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {isCompleto ? (
                          <Badge className="bg-green-100 text-green-800">✅ Aprovado</Badge>
                        ) : isVerificando ? (
                          <Badge className="bg-yellow-100 text-yellow-800">🔍 Verificando</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-600">⏳ Aguardando</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Estado final - verificação concluída */
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
              <div>
                <h3 className="text-lg font-medium text-green-600">Verificação Concluída!</h3>
                <p className="text-gray-600">Todas as verificações foram aprovadas com sucesso</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800">✅ Identidade Verificada</h4>
                <p className="text-sm text-green-600">Documentos validados via IA</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800">✅ Endereço Confirmado</h4>
                <p className="text-sm text-green-600">Localização validada</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800">✅ Compliance OK</h4>
                <p className="text-sm text-green-600">Sem restrições encontradas</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800">✅ Score Alto</h4>
                <p className="text-sm text-green-600">Perfil de baixo risco</p>
              </div>
            </div>

            {/* Resumo dos documentos aprovados */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Documentos Aprovados
              </h4>
              <div className="space-y-2">
                {documentosEnviados.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-white rounded border border-green-200"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">{doc.nome}</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">✅ Aprovado</Badge>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-sm text-green-700">
                🎉 <strong>Parabéns!</strong> Todos os documentos foram verificados e aprovados.
              </div>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-700">
                <strong>Verificação KYC Concluída!</strong> Seu perfil foi aprovado. Clique em
                "Próxima" para finalizar o processo.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EtapaFinalizacao({
  formData,
  onFinalizar,
  loading,
}: {
  formData: KYCFormData;
  onFinalizar: () => void;
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Finalização
        </CardTitle>
        <CardDescription>Revise suas informações e finalize o processo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-green-800">Verificação Aprovada!</h3>
              <p className="text-green-700">Seu perfil KYC foi verificado com sucesso</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Dados Verificados</h4>
              <ul className="text-sm space-y-1">
                <li>
                  ✅ {formData.tipo === 'pf' ? 'Nome' : 'Razão Social'}: {formData.nome}
                </li>
                <li>
                  ✅ {formData.tipo === 'pf' ? 'CPF' : 'CNPJ'}: {formData.documento}
                </li>
                <li>✅ Email: {formData.email}</li>
                <li>✅ Telefone: {formData.telefone}</li>
                <li>
                  ✅ Endereço: {formData.cidade}, {formData.uf}
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Documentos Aprovados</h4>
              <ul className="text-sm space-y-1">
                {formData.documentos
                  .filter(d => d.status === 'aprovado')
                  .map(doc => (
                    <li key={doc.tipo}>✅ {doc.nome}</li>
                  ))}
              </ul>
            </div>
          </div>
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Parabéns!</strong> Sua verificação KYC foi concluída com sucesso. Agora você tem
            acesso a todas as funcionalidades da plataforma Tributa.AI.
          </AlertDescription>
        </Alert>

        <div className="flex justify-center">
          <Button
            onClick={onFinalizar}
            disabled={loading}
            size="lg"
            className="bg-green-600 hover:bg-green-700 px-8"
          >
            {loading ? 'Finalizando...' : 'Finalizar e Ir para Dashboard'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
