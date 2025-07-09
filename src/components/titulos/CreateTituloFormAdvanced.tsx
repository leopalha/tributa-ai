import React, { useState } from 'react';
import { Upload, FileText, Clock, CheckCircle, AlertCircle, Coins, Scan } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

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

interface CreateTituloFormAdvancedProps {
  onSubmit: (data: FormDataTitulo) => void;
  loading: boolean;
}

export default function CreateTituloFormAdvanced({
  onSubmit,
  loading,
}: CreateTituloFormAdvancedProps) {
  const [etapaAtual, setEtapaAtual] = useState(1);
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
  const [analisando, setAnalisando] = useState(false);
  const [progressoAnalise, setProgressoAnalise] = useState(0);

  const etapas = [
    { numero: 1, titulo: 'Dados Básicos', descricao: 'Informações do título e empresa' },
    { numero: 2, titulo: 'Documentação', descricao: 'Upload de documentos obrigatórios' },
    { numero: 3, titulo: 'Validação', descricao: 'Análise automática dos documentos' },
    { numero: 4, titulo: 'Finalização', descricao: 'Revisão e criação do título' },
  ];

  // Documentos obrigatórios por tipo de título
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

  const podeProximaEtapa = () => {
    switch (etapaAtual) {
      case 1:
        return (
          formData.tipo &&
          formData.categoria &&
          formData.empresa &&
          formData.cnpj &&
          formData.valor &&
          formData.vencimento &&
          formData.descricao
        );
      case 2:
        const docsObrigatorios =
          documentosObrigatorios[formData.tipo]?.filter(d => d.obrigatorio) || [];
        const docsEnviados = formData.documentos.filter(
          d => d.status === 'pendente' || d.status === 'analisando' || d.status === 'aprovado'
        );
        return docsEnviados.length >= docsObrigatorios.length;
      case 3:
        return !analisando && progressoAnalise === 100;
      default:
        return true;
    }
  };

  const proximaEtapa = () => {
    if (etapaAtual === 3 && !analisando && progressoAnalise === 0) {
      iniciarAnalise();
      return;
    }
    setEtapaAtual(prev => Math.min(prev + 1, etapas.length));
  };

  const etapaAnterior = () => {
    setEtapaAtual(prev => Math.max(prev - 1, 1));
  };

  const handleUploadDocumento = (file: File, tipo: string) => {
    const novoDoc: DocumentoFormulario = {
      tipo,
      nome: file.name,
      arquivo: file,
      status: 'pendente',
      observacoes: 'Documento enviado com sucesso!',
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
          d.tipo === tipo ? { ...d, status: 'aprovado' as const } : d
        ),
      }));
    }, 2000);
  };

  const iniciarAnalise = async () => {
    setAnalisando(true);
    setProgressoAnalise(0);

    const etapasAnalise = [
      { nome: 'Verificação de Autenticidade', tempo: 1000 },
      { nome: 'Análise de Conteúdo', tempo: 1500 },
      { nome: 'Validação Final', tempo: 1000 },
    ];

    for (let i = 0; i < etapasAnalise.length; i++) {
      const etapa = etapasAnalise[i];
      toast.info(`🔍 ${etapa.nome}`);

      await new Promise(resolve => setTimeout(resolve, etapa.tempo));
      setProgressoAnalise(((i + 1) / etapasAnalise.length) * 100);
    }

    setAnalisando(false);
    toast.success('✅ Análise concluída!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="flex items-center justify-between">
        {etapas.map((etapa, index) => (
          <React.Fragment key={etapa.numero}>
            <div className="flex flex-col items-center">
              <div
                className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                ${
                  etapaAtual >= etapa.numero
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }
              `}
              >
                {etapa.numero}
              </div>
              <div className="mt-2 text-center">
                <p className="text-sm font-medium">{etapa.titulo}</p>
                <p className="text-xs text-muted-foreground">{etapa.descricao}</p>
              </div>
            </div>
            {index < etapas.length - 1 && (
              <div
                className={`
                flex-1 h-1 mx-4 rounded
                ${etapaAtual > etapa.numero ? 'bg-blue-600' : 'bg-gray-200'}
              `}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Conteúdo das Etapas */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Etapa 1: Dados Básicos */}
        {etapaAtual === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Dados Básicos do Título
              </CardTitle>
              <CardDescription>
                Preencha as informações fundamentais do título de crédito
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="tipo">Tipo de Título *</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={value => setFormData({ ...formData, tipo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ICMS">ICMS</SelectItem>
                      <SelectItem value="PIS">PIS</SelectItem>
                      <SelectItem value="COFINS">COFINS</SelectItem>
                      <SelectItem value="IRPJ">IRPJ</SelectItem>
                      <SelectItem value="CSLL">CSLL</SelectItem>
                      <SelectItem value="PRECATORIO">Precatório</SelectItem>
                      <SelectItem value="DUPLICATA">Duplicata</SelectItem>
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
                      <SelectItem value="RURAL">Rural</SelectItem>
                      <SelectItem value="AMBIENTAL">Ambiental</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="empresa">Empresa *</Label>
                  <Input
                    id="empresa"
                    value={formData.empresa}
                    onChange={e => setFormData({ ...formData, empresa: e.target.value })}
                    placeholder="Nome da empresa emissora"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cnpj">CNPJ *</Label>
                  <Input
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={e => setFormData({ ...formData, cnpj: e.target.value })}
                    placeholder="00.000.000/0000-00"
                    required
                  />
                </div>
              </div>

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
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="vencimento">Data de Vencimento *</Label>
                  <Input
                    id="vencimento"
                    type="date"
                    value={formData.vencimento}
                    onChange={e => setFormData({ ...formData, vencimento: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="descricao">Descrição *</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descrição detalhada do título de crédito"
                  rows={3}
                  required
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navegação */}
        <div className="flex justify-between pt-6">
          {etapaAtual > 1 && (
            <Button type="button" variant="outline" onClick={etapaAnterior}>
              Anterior
            </Button>
          )}

          <div className="flex gap-2 ml-auto">
            {etapaAtual < etapas.length ? (
              <Button type="button" onClick={proximaEtapa} disabled={!podeProximaEtapa()}>
                {etapaAtual === 3 && progressoAnalise === 0 && !analisando
                  ? 'Iniciar Análise'
                  : 'Próxima'}
              </Button>
            ) : (
              <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                {loading ? 'Criando...' : 'Criar Título'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
