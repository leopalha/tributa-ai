import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Building2,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  TrendingUp,
  DollarSign,
  Activity,
  Target,
  Briefcase,
  Phone,
  Mail,
  Calendar,
  Award,
  Shield,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectItem } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface EmpresaCliente {
  id: string;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  status: 'ATIVA' | 'PENDENTE' | 'SUSPENSA' | 'INATIVA';
  kycStatus: 'PENDENTE' | 'EM_ANALISE' | 'APROVADO' | 'REJEITADO';
  plano: 'BASICO' | 'PROFISSIONAL' | 'ENTERPRISE';
  cadastroEm: string;
  ultimaAtividade: string;
  valorTitulos: number;
  receitaGerada: number;
  transacoes: number;
  responsavel: string;
  setor: string;
  porte: 'MICRO' | 'PEQUENA' | 'MEDIA' | 'GRANDE';
  documentosCompletos: boolean;
  taxaConversao: number;
  tempoMedioAprovacao: number;
}

const mockEmpresas: EmpresaCliente[] = [
  {
    id: '1',
    nome: 'TechCorp Solutions Ltda',
    cnpj: '12.345.678/0001-90',
    email: 'admin@techcorp.com.br',
    telefone: '(11) 98765-4321',
    status: 'ATIVA',
    kycStatus: 'APROVADO',
    plano: 'ENTERPRISE',
    cadastroEm: '2024-01-15',
    ultimaAtividade: '2024-01-20',
    valorTitulos: 2500000,
    receitaGerada: 125000,
    transacoes: 45,
    responsavel: 'Carlos Silva',
    setor: 'TECNOLOGIA',
    porte: 'MEDIA',
    documentosCompletos: true,
    taxaConversao: 87.5,
    tempoMedioAprovacao: 3,
  },
  {
    id: '2',
    nome: 'Industria Alpha SA',
    cnpj: '98.765.432/0001-10',
    email: 'fiscal@alpha.com.br',
    telefone: '(11) 91234-5678',
    status: 'ATIVA',
    kycStatus: 'APROVADO',
    plano: 'PROFISSIONAL',
    cadastroEm: '2024-01-10',
    ultimaAtividade: '2024-01-18',
    valorTitulos: 1800000,
    receitaGerada: 90000,
    transacoes: 32,
    responsavel: 'Ana Costa',
    setor: 'INDUSTRIAL',
    porte: 'GRANDE',
    documentosCompletos: true,
    taxaConversao: 92.1,
    tempoMedioAprovacao: 2,
  },
  {
    id: '3',
    nome: 'Comércio Beta Ltda',
    cnpj: '11.222.333/0001-44',
    email: 'contato@beta.com.br',
    telefone: '(11) 95555-1234',
    status: 'PENDENTE',
    kycStatus: 'EM_ANALISE',
    plano: 'BASICO',
    cadastroEm: '2024-01-19',
    ultimaAtividade: '2024-01-19',
    valorTitulos: 0,
    receitaGerada: 0,
    transacoes: 0,
    responsavel: 'Maria Santos',
    setor: 'COMERCIO',
    porte: 'PEQUENA',
    documentosCompletos: false,
    taxaConversao: 0,
    tempoMedioAprovacao: 0,
  },
  {
    id: '4',
    nome: 'Serviços Gamma ME',
    cnpj: '55.666.777/0001-88',
    email: 'admin@gamma.com.br',
    telefone: '(11) 94444-5678',
    status: 'SUSPENSA',
    kycStatus: 'REJEITADO',
    plano: 'BASICO',
    cadastroEm: '2023-12-20',
    ultimaAtividade: '2024-01-05',
    valorTitulos: 150000,
    receitaGerada: 7500,
    transacoes: 3,
    responsavel: 'João Lima',
    setor: 'SERVICOS',
    porte: 'MICRO',
    documentosCompletos: false,
    taxaConversao: 45.2,
    tempoMedioAprovacao: 12,
  },
];

const statusColors = {
  ATIVA: 'bg-green-100 text-green-800',
  PENDENTE: 'bg-yellow-100 text-yellow-800',
  SUSPENSA: 'bg-red-100 text-red-800',
  INATIVA: 'bg-gray-100 text-gray-800',
};

const kycStatusColors = {
  PENDENTE: 'bg-gray-100 text-gray-800',
  EM_ANALISE: 'bg-yellow-100 text-yellow-800',
  APROVADO: 'bg-green-100 text-green-800',
  REJEITADO: 'bg-red-100 text-red-800',
};

const statusIcons = {
  ATIVA: CheckCircle,
  PENDENTE: Clock,
  SUSPENSA: AlertCircle,
  INATIVA: Building2,
};

export default function EmpresasPage() {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState<EmpresaCliente[]>(mockEmpresas);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroPlano, setFiltroPlano] = useState<string>('todos');
  const [busca, setBusca] = useState('');
  const [selectedEmpresa, setSelectedEmpresa] = useState<EmpresaCliente | null>(null);
  const [loading, setLoading] = useState(false);

  // Cálculos de métricas
  const totalEmpresas = empresas.length;
  const empresasAtivas = empresas.filter(e => e.status === 'ATIVA').length;
  const empresasPendentes = empresas.filter(e => e.status === 'PENDENTE').length;
  const receitaTotal = empresas.reduce((sum, e) => sum + e.receitaGerada, 0);
  const valorTotalTitulos = empresas.reduce((sum, e) => sum + e.valorTitulos, 0);
  const taxaConversaoMedia =
    empresas.filter(e => e.transacoes > 0).reduce((sum, e) => sum + e.taxaConversao, 0) /
      empresas.filter(e => e.transacoes > 0).length || 0;

  // Filtros
  const empresasFiltradas = empresas.filter(empresa => {
    const matchBusca =
      empresa.nome.toLowerCase().includes(busca.toLowerCase()) ||
      empresa.cnpj.includes(busca) ||
      empresa.email.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === 'todos' || empresa.status === filtroStatus;
    const matchPlano = filtroPlano === 'todos' || empresa.plano === filtroPlano;

    return matchBusca && matchStatus && matchPlano;
  });

  const handleNovaEmpresa = () => {
    // Redirecionar para KYC ao invés de abrir modal
    toast.info('Redirecionando para verificação KYC...', {
      description: 'Complete o processo KYC para cadastrar a nova empresa',
    });

    // Redirecionar para KYC após um breve delay para mostrar a notificação
    setTimeout(() => {
      navigate('/dashboard/kyc');
    }, 1000);
  };

  const handleAprovarEmpresa = (empresa: EmpresaCliente) => {
    setEmpresas(
      empresas.map(e =>
        e.id === empresa.id
          ? {
              ...e,
              status: 'ATIVA' as const,
              kycStatus: 'APROVADO' as const,
              documentosCompletos: true,
            }
          : e
      )
    );
    toast.success(`Empresa ${empresa.nome} aprovada!`);
  };

  const handleRejeitarEmpresa = (empresa: EmpresaCliente) => {
    setEmpresas(
      empresas.map(e =>
        e.id === empresa.id
          ? { ...e, status: 'SUSPENSA' as const, kycStatus: 'REJEITADO' as const }
          : e
      )
    );
    toast.error(`Empresa ${empresa.nome} rejeitada!`);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">🏢 Gestão de Empresas</h1>
          <p className="text-muted-foreground">Administre empresas clientes, KYC e compliance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={handleNovaEmpresa}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Empresa
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Empresas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmpresas}</div>
            <p className="text-xs text-muted-foreground">+2 novas este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas Ativas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{empresasAtivas}</div>
            <p className="text-xs text-muted-foreground">
              {((empresasAtivas / totalEmpresas) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando KYC</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{empresasPendentes}</div>
            <p className="text-xs text-muted-foreground">Para análise</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(receitaTotal)}
            </div>
            <p className="text-xs text-muted-foreground">Comissões geradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume Títulos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(valorTotalTitulos)}
            </div>
            <p className="text-xs text-muted-foreground">Volume transacionado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Conversão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taxaConversaoMedia.toFixed(1)}%</div>
            <Progress value={taxaConversaoMedia} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros e Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="busca">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="busca"
                  placeholder="Nome, CNPJ ou email..."
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="min-w-[150px]">
              <Label>Status</Label>
              <Select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ATIVA">Ativa</SelectItem>
                <SelectItem value="PENDENTE">Pendente</SelectItem>
                <SelectItem value="SUSPENSA">Suspensa</SelectItem>
                <SelectItem value="INATIVA">Inativa</SelectItem>
              </Select>
            </div>

            <div className="min-w-[150px]">
              <Label>Plano</Label>
              <Select value={filtroPlano} onChange={e => setFiltroPlano(e.target.value)}>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="BASICO">Básico</SelectItem>
                <SelectItem value="PROFISSIONAL">Profissional</SelectItem>
                <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Visualização */}
      <Tabs defaultValue="lista" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lista">Lista de Empresas</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="kyc">Aprovações KYC</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Empresas Clientes ({empresasFiltradas.length})</CardTitle>
              <CardDescription>Gerencie e monitore empresas clientes da plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {empresasFiltradas.map(empresa => {
                  const StatusIcon = statusIcons[empresa.status];
                  return (
                    <div
                      key={empresa.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <StatusIcon className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{empresa.nome}</h4>
                            <Badge variant="outline" className={statusColors[empresa.status]}>
                              {empresa.status}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className={kycStatusColors[empresa.kycStatus]}
                            >
                              KYC: {empresa.kycStatus}
                            </Badge>
                            <Badge variant="outline">{empresa.plano}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {empresa.cnpj} • {empresa.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {empresa.setor} • {empresa.porte} • Resp: {empresa.responsavel}
                          </p>
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <p className="font-semibold text-lg">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(empresa.valorTitulos)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Receita:{' '}
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(empresa.receitaGerada)}
                        </p>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedEmpresa(empresa)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          {empresa.status === 'PENDENTE' && (
                            <>
                              <Button size="sm" onClick={() => handleAprovarEmpresa(empresa)}>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Aprovar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRejeitarEmpresa(empresa)}
                              >
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Rejeitar
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(
                    empresas.reduce(
                      (acc, empresa) => {
                        acc[empresa.status] = (acc[empresa.status] || 0) + 1;
                        return acc;
                      },
                      {} as Record<string, number>
                    )
                  ).map(([status, quantidade]) => (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{status}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(quantidade / totalEmpresas) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{quantidade}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Plano</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(
                    empresas.reduce(
                      (acc, empresa) => {
                        acc[empresa.plano] = (acc[empresa.plano] || 0) + 1;
                        return acc;
                      },
                      {} as Record<string, number>
                    )
                  ).map(([plano, quantidade]) => (
                    <div key={plano} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{plano}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${(quantidade / totalEmpresas) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{quantidade}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="kyc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline de Aprovações KYC</CardTitle>
              <CardDescription>Empresas aguardando análise e aprovação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg">Pendentes</h3>
                  <p className="text-3xl font-bold text-yellow-600">
                    {empresas.filter(e => e.kycStatus === 'PENDENTE').length}
                  </p>
                  <p className="text-sm text-muted-foreground">empresas</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg">Em Análise</h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {empresas.filter(e => e.kycStatus === 'EM_ANALISE').length}
                  </p>
                  <p className="text-sm text-muted-foreground">empresas</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg">Aprovadas</h3>
                  <p className="text-3xl font-bold text-green-600">
                    {empresas.filter(e => e.kycStatus === 'APROVADO').length}
                  </p>
                  <p className="text-sm text-muted-foreground">empresas</p>
                </div>
              </div>

              {/* Alert informativo sobre o novo fluxo */}
              <Alert className="mt-4">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Novo Fluxo KYC:</strong> Para cadastrar uma nova empresa, clique em "Nova
                  Empresa" e será redirecionado para o sistema KYC completo com 5 etapas de
                  verificação.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes */}
      {selectedEmpresa && (
        <Dialog open={!!selectedEmpresa} onOpenChange={() => setSelectedEmpresa(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Detalhes da Empresa - {selectedEmpresa.nome}</DialogTitle>
            </DialogHeader>
            <EmpresaDetailsView empresa={selectedEmpresa} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Componente de visualização de detalhes
function EmpresaDetailsView({ empresa }: { empresa: EmpresaCliente }) {
  const StatusIcon = statusIcons[empresa.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusIcon className="h-8 w-8 text-muted-foreground" />
          <div>
            <h3 className="text-xl font-semibold">{empresa.nome}</h3>
            <p className="text-muted-foreground">{empresa.cnpj}</p>
          </div>
        </div>
        <div className="text-right">
          <Badge className={statusColors[empresa.status]}>{empresa.status}</Badge>
          <Badge variant="secondary" className={`ml-2 ${kycStatusColors[empresa.kycStatus]}`}>
            KYC: {empresa.kycStatus}
          </Badge>
        </div>
      </div>

      {/* Informações */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Informações de Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Email:</span>
              <span className="font-medium">{empresa.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Telefone:</span>
              <span className="font-medium">{empresa.telefone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Responsável:</span>
              <span className="font-medium">{empresa.responsavel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Plano:</span>
              <span className="font-medium">{empresa.plano}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Informações Corporativas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Setor:</span>
              <span className="font-medium">{empresa.setor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Porte:</span>
              <span className="font-medium">{empresa.porte}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Cadastro:</span>
              <span className="font-medium">
                {new Date(empresa.cadastroEm).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Última Atividade:</span>
              <span className="font-medium">
                {new Date(empresa.ultimaAtividade).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Performance Financeira</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  empresa.valorTitulos
                )}
              </p>
              <p className="text-sm text-muted-foreground">Volume Títulos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  empresa.receitaGerada
                )}
              </p>
              <p className="text-sm text-muted-foreground">Receita Gerada</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{empresa.transacoes}</p>
              <p className="text-sm text-muted-foreground">Transações</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {empresa.taxaConversao.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">Taxa Conversão</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">
          <Mail className="h-4 w-4 mr-2" />
          Enviar Email
        </Button>
        <Button variant="outline">
          <Phone className="h-4 w-4 mr-2" />
          Ligar
        </Button>
        <Button variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
        {empresa.status === 'PENDENTE' && (
          <Button>
            <CheckCircle className="h-4 w-4 mr-2" />
            Aprovar KYC
          </Button>
        )}
      </div>
    </div>
  );
}
