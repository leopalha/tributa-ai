import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Download,
  Upload,
  FileText,
  Brain,
  Settings,
  RefreshCw,
  Calendar,
  Filter,
  Search,
  Star,
  Target,
  Zap,
  Eye,
  Share2,
  Clock,
  Users,
  DollarSign,
  Shield,
  AlertTriangle,
  CheckCircle,
  Activity,
  Database,
  Globe,
} from 'lucide-react';

// Importando componentes de relatórios avançados
import { ReportGenerator } from '@/components/reports/ReportGenerator';
import { AdvancedReports } from '@/components/fiscal/advanced-reports';

// Tipos para relatórios
interface ReportMetrics {
  totalRelatorios: number;
  relatoriosGerados: number;
  tempoMedioGeracao: number;
  precisaoAnalise: number;
  dadosProcessados: number;
  insightsGerados: number;
  automacaoAtiva: number;
  satisfacaoUsuario: number;
}

interface ReportTemplate {
  id: string;
  nome: string;
  descricao: string;
  categoria: 'fiscal' | 'financeiro' | 'operacional' | 'compliance' | 'personalizado';
  tipo: 'dashboard' | 'excel' | 'pdf' | 'api';
  frequencia: 'diario' | 'semanal' | 'mensal' | 'trimestral' | 'anual' | 'sob_demanda';
  status: 'ativo' | 'inativo' | 'agendado';
  ultimaExecucao?: Date;
  proximaExecucao?: Date;
  tamanhoMedio: string;
  tempoGeracao: number;
  popularidade: number;
}

const reportMetrics: ReportMetrics = {
  totalRelatorios: 47,
  relatoriosGerados: 1247,
  tempoMedioGeracao: 8.5,
  precisaoAnalise: 96.8,
  dadosProcessados: 2500000,
  insightsGerados: 156,
  automacaoAtiva: 89,
  satisfacaoUsuario: 94.2,
};

const reportTemplates: ReportTemplate[] = [
  {
    id: 'rel-001',
    nome: 'Dashboard Executivo Fiscal',
    descricao: 'Visão executiva completa das obrigações fiscais, prazos e compliance',
    categoria: 'fiscal',
    tipo: 'dashboard',
    frequencia: 'diario',
    status: 'ativo',
    ultimaExecucao: new Date(Date.now() - 2 * 60 * 60 * 1000),
    proximaExecucao: new Date(Date.now() + 22 * 60 * 60 * 1000),
    tamanhoMedio: '2.3 MB',
    tempoGeracao: 5,
    popularidade: 98,
  },
  {
    id: 'rel-002',
    nome: 'Análise de Créditos PIS/COFINS',
    descricao: 'Relatório detalhado de créditos disponíveis, utilizados e oportunidades',
    categoria: 'fiscal',
    tipo: 'excel',
    frequencia: 'mensal',
    status: 'ativo',
    ultimaExecucao: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    proximaExecucao: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    tamanhoMedio: '850 KB',
    tempoGeracao: 12,
    popularidade: 87,
  },
  {
    id: 'rel-003',
    nome: 'Performance do Marketplace',
    descricao: 'Métricas de negociação, volume, preços e tendências do marketplace',
    categoria: 'financeiro',
    tipo: 'dashboard',
    frequencia: 'diario',
    status: 'ativo',
    ultimaExecucao: new Date(Date.now() - 1 * 60 * 60 * 1000),
    proximaExecucao: new Date(Date.now() + 23 * 60 * 60 * 1000),
    tamanhoMedio: '1.8 MB',
    tempoGeracao: 7,
    popularidade: 92,
  },
  {
    id: 'rel-004',
    nome: 'Auditoria de Compliance',
    descricao: 'Status de conformidade, pendências e plano de ação automático',
    categoria: 'compliance',
    tipo: 'pdf',
    frequencia: 'semanal',
    status: 'ativo',
    ultimaExecucao: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    proximaExecucao: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    tamanhoMedio: '3.2 MB',
    tempoGeracao: 15,
    popularidade: 78,
  },
  {
    id: 'rel-005',
    nome: 'Análise Preditiva de Riscos',
    descricao: 'IA identifica riscos fiscais potenciais e recomenda ações preventivas',
    categoria: 'fiscal',
    tipo: 'dashboard',
    frequencia: 'semanal',
    status: 'ativo',
    ultimaExecucao: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    proximaExecucao: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    tamanhoMedio: '1.1 MB',
    tempoGeracao: 20,
    popularidade: 85,
  },
  {
    id: 'rel-006',
    nome: 'Blockchain Transaction Log',
    descricao: 'Auditoria completa de todas as transações blockchain e smart contracts',
    categoria: 'operacional',
    tipo: 'excel',
    frequencia: 'mensal',
    status: 'ativo',
    ultimaExecucao: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    proximaExecucao: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
    tamanhoMedio: '4.7 MB',
    tempoGeracao: 25,
    popularidade: 73,
  },
];

// Componente de métrica de relatórios
const ReportMetricCard = ({ title, value, icon: Icon, trend, color = 'blue', suffix = '' }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center justify-between space-y-0 pb-2">
        <p className="text-sm font-medium leading-none text-muted-foreground">{title}</p>
        <Icon className={`h-5 w-5 text-${color}-600`} />
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold">
          {value}
          {suffix}
        </p>
        {trend && (
          <div className="flex items-center text-sm">
            {trend > 0 ? (
              <>
                <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                <span className="text-green-600">+{trend}%</span>
              </>
            ) : (
              <>
                <TrendingUp className="mr-1 h-4 w-4 text-red-600 rotate-180" />
                <span className="text-red-600">{trend}%</span>
              </>
            )}
            <span className="ml-1 text-muted-foreground">vs período anterior</span>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

// Componente de template de relatório
const ReportTemplateCard = ({ template }: { template: ReportTemplate }) => {
  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case 'fiscal':
        return 'bg-blue-100 text-blue-800';
      case 'financeiro':
        return 'bg-green-100 text-green-800';
      case 'operacional':
        return 'bg-purple-100 text-purple-800';
      case 'compliance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'dashboard':
        return <BarChart3 className="h-4 w-4" />;
      case 'excel':
        return <FileText className="h-4 w-4" />;
      case 'pdf':
        return <Download className="h-4 w-4" />;
      case 'api':
        return <Database className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex gap-2">
            <Badge className={getCategoryColor(template.categoria)}>{template.categoria}</Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              {getTypeIcon(template.tipo)}
              {template.tipo}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-muted-foreground">{template.popularidade}%</span>
          </div>
        </div>

        <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
          {template.nome}
        </CardTitle>

        <CardDescription className="line-clamp-2">{template.descricao}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{template.tempoGeracao}min</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <span>{template.tamanhoMedio}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Frequência:</span>
            <Badge variant="secondary" className="capitalize">
              {template.frequencia.replace('_', ' ')}
            </Badge>
          </div>

          {template.proximaExecucao && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Próxima execução:</span>
              <span className="font-medium">
                {template.proximaExecucao.toLocaleDateString('pt-BR')}
              </span>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button size="sm" className="flex-1">
              <Eye className="w-4 h-4 mr-1" />
              Executar
            </Button>
            <Button size="sm" variant="outline">
              <Settings className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function RelatoriosPage() {
  const [activeTab, setActiveTab] = useState('templates');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const filteredTemplates = reportTemplates.filter(template => {
    const matchesSearch =
      template.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Centro de Business Intelligence</h1>
          <p className="text-muted-foreground">
            Relatórios avançados, análises preditivas e dashboards inteligentes
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Agendar
          </Button>
          <Button>
            <Target className="h-4 w-4 mr-2" />
            Novo Relatório
          </Button>
        </div>
      </div>

      {/* Métricas dos Relatórios */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ReportMetricCard
          title="Relatórios Gerados"
          value={formatNumber(reportMetrics.relatoriosGerados)}
          icon={FileText}
          trend={15.2}
          color="blue"
        />
        <ReportMetricCard
          title="Precisão da Análise"
          value={reportMetrics.precisaoAnalise}
          icon={Brain}
          trend={3.7}
          color="purple"
          suffix="%"
        />
        <ReportMetricCard
          title="Insights Gerados"
          value={reportMetrics.insightsGerados}
          icon={Zap}
          trend={28.5}
          color="yellow"
        />
        <ReportMetricCard
          title="Automação Ativa"
          value={reportMetrics.automacaoAtiva}
          icon={Target}
          trend={8.3}
          color="green"
          suffix="%"
        />
      </div>

      {/* Sistema de Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="generator">Gerador</TabsTrigger>
          <TabsTrigger value="advanced">Avançados</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          {/* Filtros e Busca */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar relatórios..."
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
                  <option value="fiscal">Fiscal</option>
                  <option value="financeiro">Financeiro</option>
                  <option value="operacional">Operacional</option>
                  <option value="compliance">Compliance</option>
                </select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Grid de Templates */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map(template => (
              <ReportTemplateCard key={template.id} template={template} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="generator" className="space-y-4">
          <ReportGenerator />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <AdvancedReports />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics de Uso</CardTitle>
              <CardDescription>Análise de performance e utilização dos relatórios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {reportMetrics.tempoMedioGeracao}min
                        </p>
                        <p className="text-sm text-muted-foreground">Tempo médio de geração</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {reportMetrics.satisfacaoUsuario}%
                        </p>
                        <p className="text-sm text-muted-foreground">Satisfação do usuário</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">
                          {formatNumber(reportMetrics.dadosProcessados)}
                        </p>
                        <p className="text-sm text-muted-foreground">Registros processados</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Relatórios Mais Populares</h4>
                  <div className="space-y-2">
                    {reportTemplates
                      .sort((a, b) => b.popularidade - a.popularidade)
                      .slice(0, 5)
                      .map((template, index) => (
                        <div
                          key={template.id}
                          className="flex items-center justify-between p-3 border rounded"
                        >
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline">#{index + 1}</Badge>
                            <span className="font-medium">{template.nome}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm">{template.popularidade}%</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Relatórios</CardTitle>
              <CardDescription>
                Configure preferências globais, formatos e automações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="formato-padrao">Formato Padrão</Label>
                  <select id="formato-padrao" className="w-full p-2 border rounded">
                    <option>PDF</option>
                    <option>Excel</option>
                    <option>Dashboard</option>
                    <option>API</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequencia-padrao">Frequência Padrão</Label>
                  <select id="frequencia-padrao" className="w-full p-2 border rounded">
                    <option>Sob demanda</option>
                    <option>Diário</option>
                    <option>Semanal</option>
                    <option>Mensal</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Automações</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Geração automática</p>
                      <p className="text-sm text-muted-foreground">
                        Gerar relatórios automaticamente conforme agendamento
                      </p>
                    </div>
                    <Badge variant="default">Ativo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificações por email</p>
                      <p className="text-sm text-muted-foreground">
                        Enviar relatórios por email quando concluídos
                      </p>
                    </div>
                    <Badge variant="default">Ativo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Análise de anomalias</p>
                      <p className="text-sm text-muted-foreground">
                        IA identifica automaticamente dados anômalos
                      </p>
                    </div>
                    <Badge variant="secondary">Inativo</Badge>
                  </div>
                </div>
              </div>

              <Button className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
