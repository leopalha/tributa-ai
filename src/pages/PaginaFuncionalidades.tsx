import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Target,
  Zap,
  FileText,
  Building2,
  Shield,
  BarChart3,
  Brain,
  Settings,
  Calendar,
  DollarSign,
  Users,
  Globe,
  Activity,
  CreditCard,
  PieChart,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  Eye,
  Download,
  Upload,
  Search,
  Filter,
  Plus,
  RefreshCw,
  Bell,
  Lock,
  Unlock,
  Smartphone,
  Mail,
  Database,
  Cloud,
  Cpu,
  HardDrive,
  Network,
  Wifi,
  Bluetooth,
  Camera,
  Mic,
  Volume2,
  Printer,
  Monitor,
  Keyboard,
  Mouse,
  Gamepad2,
  Headphones,
  Speaker,
} from 'lucide-react';

interface Funcionalidade {
  id: string;
  nome: string;
  descricao: string;
  categoria: 'core' | 'avancado' | 'ia' | 'fiscal' | 'marketplace' | 'blockchain' | 'compliance';
  rota: string;
  icon: React.ElementType;
  status: 'ativo' | 'beta' | 'em_desenvolvimento' | 'planejado';
  popularidade: number;
  tempoImplementacao: number;
  complexidade: 'simples' | 'media' | 'alta';
  requerAutenticacao: boolean;
  componenteDisponivel: boolean;
}

const funcionalidades: Funcionalidade[] = [
  // Core Dashboard
  {
    id: 'dashboard',
    nome: 'Dashboard Executivo',
    descricao: 'Painel principal com métricas, KPIs e navegação inteligente para toda a plataforma',
    categoria: 'core',
    rota: '/dashboard',
    icon: LayoutDashboard,
    status: 'ativo',
    popularidade: 98,
    tempoImplementacao: 100,
    complexidade: 'alta',
    requerAutenticacao: true,
    componenteDisponivel: true,
  },

  // Marketplace Universal
  {
    id: 'marketplace',
    nome: 'Marketplace Universal',
    descricao: 'Trading completo de todos os tipos de títulos de crédito com sistema de leilões',
    categoria: 'marketplace',
    rota: '/dashboard/marketplace',
    icon: ShoppingBag,
    status: 'ativo',
    popularidade: 95,
    tempoImplementacao: 100,
    complexidade: 'alta',
    requerAutenticacao: true,
    componenteDisponivel: true,
  },

  // Tokenização Avançada
  {
    id: 'tokenizacao',
    nome: 'Tokenização Avançada',
    descricao: 'Wizard de 6 etapas para tokenizar créditos com IA e validação automática',
    categoria: 'blockchain',
    rota: '/dashboard/tokenizacao/wizard',
    icon: Zap,
    status: 'ativo',
    popularidade: 92,
    tempoImplementacao: 100,
    complexidade: 'alta',
    requerAutenticacao: true,
    componenteDisponivel: true,
  },

  // Compensação Multilateral
  {
    id: 'compensacao',
    nome: 'Compensação Multilateral',
    descricao: 'Engine de matching automático para compensar créditos e débitos com IA',
    categoria: 'ia',
    rota: '/dashboard/recuperacao/compensacao-multilateral',
    icon: Target,
    status: 'ativo',
    popularidade: 89,
    tempoImplementacao: 100,
    complexidade: 'alta',
    requerAutenticacao: true,
    componenteDisponivel: true,
  },

  // KYC Avançado
  {
    id: 'kyc',
    nome: 'KYC/Compliance Avançado',
    descricao: 'Sistema de verificação automatizado com IA, PEP, AML e scoring inteligente',
    categoria: 'compliance',
    rota: '/dashboard/kyc',
    icon: Shield,
    status: 'ativo',
    popularidade: 87,
    tempoImplementacao: 100,
    complexidade: 'alta',
    requerAutenticacao: true,
    componenteDisponivel: true,
  },

  // ARIA IA
  {
    id: 'aria',
    nome: 'ARIA - Assistente IA',
    descricao: 'Assistente de IA conversacional que executa ações em toda a plataforma',
    categoria: 'ia',
    rota: '/dashboard/aria',
    icon: Brain,
    status: 'ativo',
    popularidade: 94,
    tempoImplementacao: 100,
    complexidade: 'alta',
    requerAutenticacao: true,
    componenteDisponivel: true,
  },

  // Gestão Fiscal
  {
    id: 'gestao-fiscal',
    nome: 'Gestão Fiscal Inteligente',
    descricao: 'Centro completo de gestão fiscal com 12 módulos avançados integrados',
    categoria: 'fiscal',
    rota: '/dashboard/gestao-fiscal',
    icon: FileText,
    status: 'ativo',
    popularidade: 91,
    tempoImplementacao: 100,
    complexidade: 'alta',
    requerAutenticacao: true,
    componenteDisponivel: true,
  },

  // Blockchain Dashboard
  {
    id: 'blockchain',
    nome: 'Blockchain Dashboard',
    descricao: 'Monitoramento completo da rede, transações e smart contracts',
    categoria: 'blockchain',
    rota: '/dashboard/blockchain',
    icon: Database,
    status: 'ativo',
    popularidade: 85,
    tempoImplementacao: 100,
    complexidade: 'media',
    requerAutenticacao: true,
    componenteDisponivel: true,
  },

  // Business Intelligence
  {
    id: 'relatorios',
    nome: 'Business Intelligence',
    descricao: 'Centro de BI com relatórios avançados, análises preditivas e dashboards',
    categoria: 'avancado',
    rota: '/dashboard/relatorios',
    icon: BarChart3,
    status: 'ativo',
    popularidade: 88,
    tempoImplementacao: 100,
    complexidade: 'alta',
    requerAutenticacao: true,
    componenteDisponivel: true,
  },

  // Gestão de Empresas
  {
    id: 'empresas',
    nome: 'Gestão de Empresas',
    descricao: 'Cadastro e gestão completa de empresas participantes da plataforma',
    categoria: 'core',
    rota: '/dashboard/empresas',
    icon: Building2,
    status: 'ativo',
    popularidade: 76,
    tempoImplementacao: 100,
    complexidade: 'media',
    requerAutenticacao: true,
    componenteDisponivel: true,
  },

  // Risk & Analytics
  {
    id: 'risk',
    nome: 'Risk & Analytics',
    descricao: 'Análise de riscos financeiros, VaR, stress testing e modelagem preditiva',
    categoria: 'avancado',
    rota: '/dashboard/risk',
    icon: TrendingUp,
    status: 'ativo',
    popularidade: 82,
    tempoImplementacao: 100,
    complexidade: 'alta',
    requerAutenticacao: true,
    componenteDisponivel: true,
  },

  // Títulos de Crédito
  {
    id: 'titulos',
    nome: 'Títulos de Crédito',
    descricao: 'Gestão completa de títulos de crédito com validação e rastreamento',
    categoria: 'core',
    rota: '/dashboard/tokenizacao',
    icon: CreditCard,
    status: 'ativo',
    popularidade: 79,
    tempoImplementacao: 100,
    complexidade: 'media',
    requerAutenticacao: true,
    componenteDisponivel: true,
  },

  // Configurações
  {
    id: 'configuracoes',
    nome: 'Centro Administrativo',
    descricao: 'Configurações avançadas, automações, segurança e gestão de usuários',
    categoria: 'core',
    rota: '/dashboard/configuracoes',
    icon: Settings,
    status: 'ativo',
    popularidade: 71,
    tempoImplementacao: 100,
    complexidade: 'media',
    requerAutenticacao: true,
    componenteDisponivel: true,
  },
];

const FuncionalidadeCard = ({ funcionalidade }: { funcionalidade: Funcionalidade }) => {
  const navigate = useNavigate();

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case 'core':
        return 'bg-blue-100 text-blue-800';
      case 'avancado':
        return 'bg-purple-100 text-purple-800';
      case 'ia':
        return 'bg-green-100 text-green-800';
      case 'fiscal':
        return 'bg-orange-100 text-orange-800';
      case 'marketplace':
        return 'bg-pink-100 text-pink-800';
      case 'blockchain':
        return 'bg-indigo-100 text-indigo-800';
      case 'compliance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'beta':
        return 'bg-yellow-100 text-yellow-800';
      case 'em_desenvolvimento':
        return 'bg-blue-100 text-blue-800';
      case 'planejado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityIcon = (complexidade: string) => {
    switch (complexidade) {
      case 'simples':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'media':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'alta':
        return <Star className="h-4 w-4 text-red-600" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex gap-2">
            <Badge className={getCategoryColor(funcionalidade.categoria)}>
              {funcionalidade.categoria}
            </Badge>
            <Badge className={getStatusColor(funcionalidade.status)}>{funcionalidade.status}</Badge>
          </div>
          <div className="flex items-center gap-2">
            {getComplexityIcon(funcionalidade.complexidade)}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">{funcionalidade.popularidade}%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <funcionalidade.icon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
              {funcionalidade.nome}
            </CardTitle>
          </div>
        </div>

        <CardDescription className="line-clamp-2 text-sm">
          {funcionalidade.descricao}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Implementação:</span>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${funcionalidade.tempoImplementacao}%` }}
                />
              </div>
              <span className="font-medium">{funcionalidade.tempoImplementacao}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Complexidade:</span>
            <Badge variant="outline" className="capitalize">
              {funcionalidade.complexidade}
            </Badge>
          </div>

          <div className="flex gap-2 pt-2">
            <Button size="sm" className="flex-1" onClick={() => navigate(funcionalidade.rota)}>
              <Play className="w-4 h-4 mr-1" />
              Acessar
            </Button>
            <Button size="sm" variant="outline">
              <Eye className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Star className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function FuncionalidadesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredFuncionalidades = funcionalidades.filter(func => {
    const matchesSearch =
      func.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      func.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || func.categoria === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || func.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: funcionalidades.length,
    ativas: funcionalidades.filter(f => f.status === 'ativo').length,
    implementacao: Math.round(
      funcionalidades.reduce((acc, f) => acc + f.tempoImplementacao, 0) / funcionalidades.length
    ),
    popularidade: Math.round(
      funcionalidades.reduce((acc, f) => acc + f.popularidade, 0) / funcionalidades.length
    ),
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Centro de Funcionalidades</h1>
          <p className="text-muted-foreground">
            Todas as funcionalidades implementadas e disponíveis na plataforma Tributa.AI
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium leading-none text-muted-foreground">Total</p>
              <LayoutDashboard className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">funcionalidades</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium leading-none text-muted-foreground">Ativas</p>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold">{stats.ativas}</p>
            <p className="text-xs text-muted-foreground">operacionais</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium leading-none text-muted-foreground">
                Implementação
              </p>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold">{stats.implementacao}%</p>
            <p className="text-xs text-muted-foreground">média geral</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium leading-none text-muted-foreground">Popularidade</p>
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold">{stats.popularidade}%</p>
            <p className="text-xs text-muted-foreground">satisfação</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar funcionalidades..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">Todas as categorias</option>
              <option value="core">Core</option>
              <option value="avancado">Avançado</option>
              <option value="ia">IA</option>
              <option value="fiscal">Fiscal</option>
              <option value="marketplace">Marketplace</option>
              <option value="blockchain">Blockchain</option>
              <option value="compliance">Compliance</option>
            </select>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">Todos os status</option>
              <option value="ativo">Ativo</option>
              <option value="beta">Beta</option>
              <option value="em_desenvolvimento">Em desenvolvimento</option>
              <option value="planejado">Planejado</option>
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Funcionalidades */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredFuncionalidades.map(funcionalidade => (
          <FuncionalidadeCard key={funcionalidade.id} funcionalidade={funcionalidade} />
        ))}
      </div>

      {/* Rodapé */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold">🎉 Plataforma 100% Implementada!</p>
            <p className="text-muted-foreground">
              Todas as funcionalidades principais estão operacionais e prontas para uso
            </p>
            <div className="flex justify-center space-x-4 pt-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                13 módulos ativos
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-600" />
                {stats.popularidade}% satisfação
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Ready for production
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
