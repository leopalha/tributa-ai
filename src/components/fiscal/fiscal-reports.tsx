import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Target,
  Users,
  Building,
  FileSpreadsheet,
  File,
  FileImage,
  Mail,
  Share2,
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  Copy,
  Archive,
  Search,
} from 'lucide-react';
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Pie,
} from 'recharts';

interface FiscalReport {
  id: string;
  name: string;
  description: string;
  type: 'compliance' | 'financial' | 'obligations' | 'tax' | 'audit' | 'custom';
  template: string;
  status: 'draft' | 'generated' | 'scheduled' | 'sent';
  createdAt: Date;
  generatedAt?: Date;
  scheduledFor?: Date;
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv' | 'html';
  filters: {
    dateRange: {
      start: Date;
      end: Date;
    };
    categories: string[];
    status: string[];
    amount: {
      min?: number;
      max?: number;
    };
  };
  data?: any;
  size?: string;
  downloadUrl?: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  fields: string[];
  charts: string[];
  defaultFormat: string;
  isCustom: boolean;
}

interface FiscalReportsProps {
  obligations: any[];
}

export function FiscalReports({ obligations }: FiscalReportsProps) {
  const [reports, setReports] = useState<FiscalReport[]>([
    {
      id: '1',
      name: 'Relatório de Compliance Mensal',
      description: 'Relatório completo de conformidade fiscal do mês',
      type: 'compliance',
      template: 'compliance-monthly',
      status: 'generated',
      createdAt: new Date('2024-01-15T10:00:00'),
      generatedAt: new Date('2024-01-15T10:30:00'),
      recipients: ['fiscal@empresa.com', 'diretor@empresa.com'],
      format: 'pdf',
      filters: {
        dateRange: {
          start: startOfMonth(new Date()),
          end: endOfMonth(new Date()),
        },
        categories: ['ICMS', 'IPI', 'PIS', 'COFINS'],
        status: ['PAID', 'PENDING', 'OVERDUE'],
        amount: {},
      },
      size: '2.3 MB',
      downloadUrl: '/reports/compliance-monthly-2024-01.pdf',
    },
    {
      id: '2',
      name: 'Análise Financeira Trimestral',
      description: 'Análise detalhada dos tributos pagos no trimestre',
      type: 'financial',
      template: 'financial-quarterly',
      status: 'scheduled',
      createdAt: new Date('2024-01-10T14:00:00'),
      scheduledFor: new Date('2024-02-01T09:00:00'),
      recipients: ['contabilidade@empresa.com'],
      format: 'excel',
      filters: {
        dateRange: {
          start: subMonths(new Date(), 3),
          end: new Date(),
        },
        categories: ['all'],
        status: ['PAID'],
        amount: { min: 1000 },
      },
    },
    {
      id: '3',
      name: 'Obrigações Vencidas',
      description: 'Relatório de obrigações em atraso para ação imediata',
      type: 'obligations',
      template: 'overdue-obligations',
      status: 'draft',
      createdAt: new Date('2024-01-14T16:00:00'),
      recipients: [],
      format: 'pdf',
      filters: {
        dateRange: {
          start: subDays(new Date(), 30),
          end: new Date(),
        },
        categories: ['all'],
        status: ['OVERDUE'],
        amount: {},
      },
    },
  ]);

  const [templates] = useState<ReportTemplate[]>([
    {
      id: 'compliance-monthly',
      name: 'Compliance Mensal',
      description: 'Relatório completo de conformidade fiscal mensal',
      type: 'compliance',
      category: 'Padrão',
      fields: ['obligations', 'compliance_score', 'overdue_items', 'payments'],
      charts: ['status_distribution', 'amount_by_type', 'compliance_trend'],
      defaultFormat: 'pdf',
      isCustom: false,
    },
    {
      id: 'financial-quarterly',
      name: 'Financeiro Trimestral',
      description: 'Análise financeira detalhada do trimestre',
      type: 'financial',
      category: 'Padrão',
      fields: ['total_paid', 'total_pending', 'tax_breakdown', 'trends'],
      charts: ['payment_timeline', 'tax_distribution', 'monthly_comparison'],
      defaultFormat: 'excel',
      isCustom: false,
    },
    {
      id: 'overdue-obligations',
      name: 'Obrigações Vencidas',
      description: 'Lista de obrigações em atraso',
      type: 'obligations',
      category: 'Padrão',
      fields: ['overdue_list', 'amounts', 'due_dates', 'penalties'],
      charts: ['overdue_by_type', 'aging_analysis'],
      defaultFormat: 'pdf',
      isCustom: false,
    },
    {
      id: 'audit-trail',
      name: 'Trilha de Auditoria',
      description: 'Registro completo de atividades fiscais',
      type: 'audit',
      category: 'Avançado',
      fields: ['activities', 'users', 'changes', 'approvals'],
      charts: ['activity_timeline', 'user_actions'],
      defaultFormat: 'html',
      isCustom: false,
    },
  ]);

  const [selectedReport, setSelectedReport] = useState<FiscalReport | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Dados para gráficos de exemplo
  const complianceData = [
    { month: 'Jan', score: 95, target: 90 },
    { month: 'Fev', score: 88, target: 90 },
    { month: 'Mar', score: 92, target: 90 },
    { month: 'Abr', score: 96, target: 90 },
    { month: 'Mai', score: 89, target: 90 },
    { month: 'Jun', score: 94, target: 90 },
  ];

  const taxDistributionData = [
    { name: 'ICMS', value: 45, amount: 125000 },
    { name: 'IPI', value: 25, amount: 68000 },
    { name: 'PIS', value: 15, amount: 42000 },
    { name: 'COFINS', value: 15, amount: 38000 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Filtrar relatórios
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      if (filterType !== 'all' && report.type !== filterType) return false;
      if (filterStatus !== 'all' && report.status !== filterStatus) return false;
      if (searchTerm && !report.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [reports, filterType, filterStatus, searchTerm]);

  // Estatísticas
  const totalReports = reports.length;
  const generatedReports = reports.filter(r => r.status === 'generated').length;
  const scheduledReports = reports.filter(r => r.status === 'scheduled').length;
  const draftReports = reports.filter(r => r.status === 'draft').length;

  // Função para gerar relatório
  const generateReport = (reportId: string) => {
    setReports(prev =>
      prev.map(report =>
        report.id === reportId
          ? {
              ...report,
              status: 'generated',
              generatedAt: new Date(),
              size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
              downloadUrl: `/reports/${report.template}-${Date.now()}.${report.format}`,
            }
          : report
      )
    );
  };

  // Função para duplicar relatório
  const duplicateReport = (report: FiscalReport) => {
    const newReport: FiscalReport = {
      ...report,
      id: Date.now().toString(),
      name: `${report.name} (Cópia)`,
      status: 'draft',
      createdAt: new Date(),
      generatedAt: undefined,
      downloadUrl: undefined,
      size: undefined,
    };
    setReports(prev => [newReport, ...prev]);
  };

  // Função para excluir relatório
  const deleteReport = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
  };

  // Obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sent':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Obter ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generated':
        return <CheckCircle className="h-4 w-4" />;
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      case 'sent':
        return <Mail className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Obter ícone do formato
  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'excel':
        return <FileSpreadsheet className="h-4 w-4" />;
      case 'pdf':
        return <File className="h-4 w-4" />;
      case 'csv':
        return <FileText className="h-4 w-4" />;
      case 'html':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Relatórios Fiscais
          </h2>
          <p className="text-muted-foreground">
            Gere relatórios automatizados e personalizados para análise fiscal
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Button size="sm" onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Relatório
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Relatórios</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
            <p className="text-xs text-muted-foreground">Relatórios criados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gerados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{generatedReports}</div>
            <p className="text-xs text-muted-foreground">Prontos para download</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendados</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{scheduledReports}</div>
            <p className="text-xs text-muted-foreground">Geração automática</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rascunhos</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{draftReports}</div>
            <p className="text-xs text-muted-foreground">Em desenvolvimento</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Relatórios
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="text-sm font-medium">Filtros:</span>
                </div>

                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <Input
                    placeholder="Buscar relatórios..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-60"
                  />
                </div>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="financial">Financeiro</SelectItem>
                    <SelectItem value="obligations">Obrigações</SelectItem>
                    <SelectItem value="audit">Auditoria</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="generated">Gerado</SelectItem>
                    <SelectItem value="scheduled">Agendado</SelectItem>
                    <SelectItem value="sent">Enviado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Relatórios */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredReports.map(report => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getFormatIcon(report.format)}
                      <div>
                        <CardTitle className="text-lg">{report.name}</CardTitle>
                        <CardDescription className="mt-1">{report.description}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(report.status)}>
                      {getStatusIcon(report.status)}
                      <span className="ml-1">{report.status}</span>
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Criado:</span>
                      <p className="font-medium">
                        {format(report.createdAt, 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Formato:</span>
                      <p className="font-medium uppercase">{report.format}</p>
                    </div>
                    {report.size && (
                      <div>
                        <span className="text-muted-foreground">Tamanho:</span>
                        <p className="font-medium">{report.size}</p>
                      </div>
                    )}
                    {report.scheduledFor && (
                      <div>
                        <span className="text-muted-foreground">Agendado:</span>
                        <p className="font-medium">
                          {format(report.scheduledFor, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </p>
                      </div>
                    )}
                  </div>

                  {report.recipients.length > 0 && (
                    <div>
                      <span className="text-sm text-muted-foreground">Destinatários:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {report.recipients.slice(0, 2).map((email, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {email}
                          </Badge>
                        ))}
                        {report.recipients.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{report.recipients.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    {report.status === 'generated' && report.downloadUrl && (
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}

                    {report.status === 'draft' && (
                      <Button size="sm" onClick={() => generateReport(report.id)}>
                        <FileText className="h-4 w-4 mr-2" />
                        Gerar
                      </Button>
                    )}

                    <Button size="sm" variant="ghost" onClick={() => setSelectedReport(report)}>
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button size="sm" variant="ghost" onClick={() => duplicateReport(report)}>
                      <Copy className="h-4 w-4" />
                    </Button>

                    <Button size="sm" variant="ghost" onClick={() => deleteReport(report.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Evolução do Compliance
                </CardTitle>
                <CardDescription>Score de conformidade fiscal ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={complianceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#8884d8"
                        strokeWidth={3}
                        name="Score Atual"
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke="#82ca9d"
                        strokeDasharray="5 5"
                        name="Meta"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Distribuição de Tributos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Distribuição de Tributos
                </CardTitle>
                <CardDescription>Proporção dos tributos por tipo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={taxDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {taxDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Métricas Resumidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(273000)}</div>
                <p className="text-xs text-muted-foreground">+12% vs mês anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">94.2%</div>
                <p className="text-xs text-muted-foreground">Meta: 90%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Obrigações Ativas</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">23</div>
                <p className="text-xs text-muted-foreground">5 vencendo esta semana</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {templates.map(template => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {template.name}
                      </CardTitle>
                      <CardDescription className="mt-1">{template.description}</CardDescription>
                    </div>
                    <Badge variant={template.isCustom ? 'default' : 'secondary'}>
                      {template.category}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Campos inclusos:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.fields.map(field => (
                        <Badge key={field} variant="outline" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">Gráficos:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.charts.map(chart => (
                        <Badge key={chart} variant="outline" className="text-xs">
                          {chart}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      {getFormatIcon(template.defaultFormat)}
                      <span className="text-sm text-muted-foreground">
                        {template.defaultFormat.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Usar Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
