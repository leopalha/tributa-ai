import React, { useState, useMemo } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Download,
  Filter,
  Calendar as CalendarIcon,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Eye,
  Settings,
  RefreshCw,
  Share,
  Printer,
  Mail,
  FileSpreadsheet,
  FileBarChart,
  Target,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity,
} from 'lucide-react';
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts';

interface ReportConfig {
  id: string;
  name: string;
  description: string;
  type: 'compliance' | 'financial' | 'obligations' | 'documents' | 'trends' | 'custom';
  category: 'Fiscal' | 'Contabil' | 'Gerencial' | 'Compliance' | 'Operacional';
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually' | 'OnDemand';
  format: 'PDF' | 'Excel' | 'CSV' | 'JSON' | 'HTML';
  isScheduled: boolean;
  lastGenerated?: Date;
  nextGeneration?: Date;
  recipients: string[];
}

interface ReportData {
  id: string;
  title: string;
  generatedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    totalObligations: number;
    pendingObligations: number;
    paidObligations: number;
    overdueObligations: number;
    totalValue: number;
    paidValue: number;
    pendingValue: number;
    complianceRate: number;
    averagePaymentTime: number;
    documentsProcessed: number;
    criticalIssues: number;
  };
  charts: {
    obligationsByType: Array<{ name: string; value: number; color: string }>;
    paymentTrends: Array<{ month: string; paid: number; pending: number; overdue: number }>;
    complianceHistory: Array<{ month: string; rate: number; target: number }>;
    valueDistribution: Array<{ category: string; value: number; percentage: number }>;
  };
}

interface AdvancedReportsProps {
  companyId: string;
}

export function AdvancedReports({ companyId }: AdvancedReportsProps) {
  const [selectedReportType, setSelectedReportType] = useState<string>('compliance');
  const [dateRange, setDateRange] = useState<{ start: Date | undefined; end: Date | undefined }>({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  });
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState<string>('PDF');

  const reportConfigs: ReportConfig[] = [
    {
      id: 'compliance-monthly',
      name: 'Relatório de Compliance Mensal',
      description: 'Análise detalhada da conformidade fiscal mensal',
      type: 'compliance',
      category: 'Compliance',
      frequency: 'Monthly',
      format: 'PDF',
      isScheduled: true,
      lastGenerated: new Date(),
      nextGeneration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      recipients: ['fiscal@empresa.com', 'diretor@empresa.com'],
    },
    {
      id: 'financial-quarterly',
      name: 'Relatório Financeiro Trimestral',
      description: 'Análise financeira de obrigações fiscais',
      type: 'financial',
      category: 'Fiscal',
      frequency: 'Quarterly',
      format: 'Excel',
      isScheduled: true,
      lastGenerated: subDays(new Date(), 5),
      nextGeneration: new Date(Date.now() + 85 * 24 * 60 * 60 * 1000),
      recipients: ['contabilidade@empresa.com'],
    },
    {
      id: 'obligations-weekly',
      name: 'Relatório Semanal de Obrigações',
      description: 'Status semanal das obrigações fiscais',
      type: 'obligations',
      category: 'Operacional',
      frequency: 'Weekly',
      format: 'HTML',
      isScheduled: true,
      lastGenerated: subDays(new Date(), 2),
      nextGeneration: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      recipients: ['operacional@empresa.com'],
    },
  ];

  const sampleReportData: ReportData = {
    id: 'report-2024-03',
    title: 'Relatório Fiscal - Março 2024',
    generatedAt: new Date(),
    period: {
      start: new Date('2024-03-01'),
      end: new Date('2024-03-31'),
    },
    metrics: {
      totalObligations: 45,
      pendingObligations: 8,
      paidObligations: 35,
      overdueObligations: 2,
      totalValue: 245800,
      paidValue: 198500,
      pendingValue: 47300,
      complianceRate: 87.5,
      averagePaymentTime: 12.5,
      documentsProcessed: 1247,
      criticalIssues: 3,
    },
    charts: {
      obligationsByType: [
        { name: 'ICMS', value: 15, color: '#8884d8' },
        { name: 'IPI', value: 8, color: '#82ca9d' },
        { name: 'PIS/COFINS', value: 12, color: '#ffc658' },
        { name: 'DCTF', value: 6, color: '#ff7300' },
        { name: 'Outros', value: 4, color: '#00ff88' },
      ],
      paymentTrends: [
        { month: 'Jan', paid: 32, pending: 8, overdue: 2 },
        { month: 'Fev', paid: 28, pending: 12, overdue: 3 },
        { month: 'Mar', paid: 35, pending: 8, overdue: 2 },
        { month: 'Abr', paid: 0, pending: 15, overdue: 0 },
      ],
      complianceHistory: [
        { month: 'Jan', rate: 85.2, target: 90 },
        { month: 'Fev', rate: 82.1, target: 90 },
        { month: 'Mar', rate: 87.5, target: 90 },
        { month: 'Abr', rate: 0, target: 90 },
      ],
      valueDistribution: [
        { category: 'Tributos Federais', value: 125000, percentage: 50.8 },
        { category: 'Tributos Estaduais', value: 85000, percentage: 34.6 },
        { category: 'Tributos Municipais', value: 35800, percentage: 14.6 },
      ],
    },
  };

  const generateReport = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simular geração de relatório
    for (let i = 0; i <= 100; i += 10) {
      setGenerationProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setIsGenerating(false);
    setGenerationProgress(0);
  };

  const exportReport = (format: string) => {
    console.log(`Exportando relatório em formato ${format}`);
    // Implementar lógica de exportação
  };

  const scheduleReport = (reportId: string) => {
    console.log(`Agendando relatório ${reportId}`);
    // Implementar lógica de agendamento
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff88'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileBarChart className="h-6 w-6" />
            Relatórios Avançados
          </h2>
          <p className="text-muted-foreground">
            Gere relatórios detalhados e análises de dados fiscais
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar Dados
          </Button>
          <Button onClick={generateReport} disabled={isGenerating}>
            <FileText className="h-4 w-4 mr-2" />
            {isGenerating ? 'Gerando...' : 'Gerar Relatório'}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      {isGenerating && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Gerando relatório...</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Gerar Relatório
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Agendados
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Histórico
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Visualização
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report Configuration */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configuração do Relatório</CardTitle>
                  <CardDescription>Configure os parâmetros do relatório</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tipo de Relatório</Label>
                    <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compliance">Compliance</SelectItem>
                        <SelectItem value="financial">Financeiro</SelectItem>
                        <SelectItem value="obligations">Obrigações</SelectItem>
                        <SelectItem value="documents">Documentos</SelectItem>
                        <SelectItem value="trends">Tendências</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Período</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.start
                              ? format(dateRange.start, 'dd/MM/yyyy', { locale: ptBR })
                              : 'Data inicial'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dateRange.start}
                            onSelect={date => setDateRange(prev => ({ ...prev, start: date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.end
                              ? format(dateRange.end, 'dd/MM/yyyy', { locale: ptBR })
                              : 'Data final'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dateRange.end}
                            onSelect={date => setDateRange(prev => ({ ...prev, end: date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Formato de Exportação</Label>
                    <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="Excel">Excel</SelectItem>
                        <SelectItem value="CSV">CSV</SelectItem>
                        <SelectItem value="HTML">HTML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Filtros</Label>
                    <div className="space-y-2">
                      {[
                        'Apenas Pendentes',
                        'Apenas Vencidas',
                        'Valores > R$ 1.000',
                        'Críticas',
                      ].map(filter => (
                        <div key={filter} className="flex items-center space-x-2">
                          <Checkbox
                            id={filter}
                            checked={selectedFilters.includes(filter)}
                            onCheckedChange={checked => {
                              if (checked) {
                                setSelectedFilters([...selectedFilters, filter]);
                              } else {
                                setSelectedFilters(selectedFilters.filter(f => f !== filter));
                              }
                            }}
                          />
                          <Label htmlFor={filter} className="text-sm">
                            {filter}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex flex-col gap-2">
                    <Button onClick={generateReport} disabled={isGenerating} className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Gerar Relatório
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" onClick={() => exportReport('PDF')}>
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => exportReport('Excel')}>
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Excel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Report Templates */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Modelos de Relatório</CardTitle>
                  <CardDescription>Selecione um modelo pré-configurado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reportConfigs.map(config => (
                      <div
                        key={config.id}
                        className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{config.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {config.description}
                            </p>
                          </div>
                          <Badge variant={config.isScheduled ? 'default' : 'secondary'}>
                            {config.category}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{config.frequency}</span>
                          <span>{config.format}</span>
                        </div>

                        {config.lastGenerated && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Último: {format(config.lastGenerated, 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                        )}

                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Download className="h-4 w-4 mr-2" />
                            Gerar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Agendados</CardTitle>
              <CardDescription>Gerencie relatórios com geração automática</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportConfigs
                  .filter(config => config.isScheduled)
                  .map(config => (
                    <div
                      key={config.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{config.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>Frequência: {config.frequency}</span>
                          <span>Formato: {config.format}</span>
                          {config.nextGeneration && (
                            <span>
                              Próxima:{' '}
                              {format(config.nextGeneration, 'dd/MM/yyyy', { locale: ptBR })}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Ativo</Badge>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Relatórios</CardTitle>
              <CardDescription>Relatórios gerados anteriormente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(index => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">
                          Relatório Fiscal -{' '}
                          {format(subDays(new Date(), index * 7), 'MMMM yyyy', { locale: ptBR })}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            Gerado em:{' '}
                            {format(subDays(new Date(), index * 7), 'dd/MM/yyyy HH:mm', {
                              locale: ptBR,
                            })}
                          </span>
                          <span>Formato: PDF</span>
                          <span>Tamanho: 2.{index}MB</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Metrics Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Métricas Principais</CardTitle>
                <CardDescription>Resumo dos indicadores do período</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {sampleReportData.metrics.complianceRate}%
                    </div>
                    <p className="text-sm text-muted-foreground">Taxa de Compliance</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {sampleReportData.metrics.totalObligations}
                    </div>
                    <p className="text-sm text-muted-foreground">Total de Obrigações</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      R$ {(sampleReportData.metrics.totalValue / 1000).toFixed(0)}K
                    </div>
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {sampleReportData.metrics.criticalIssues}
                    </div>
                    <p className="text-sm text-muted-foreground">Problemas Críticos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Obligations by Type */}
            <Card>
              <CardHeader>
                <CardTitle>Obrigações por Tipo</CardTitle>
                <CardDescription>Distribuição por categoria de tributo</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsPieChart>
                    <Pie
                      data={sampleReportData.charts.obligationsByType}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {sampleReportData.charts.obligationsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Payment Trends */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Tendência de Pagamentos</CardTitle>
                <CardDescription>Evolução mensal dos pagamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={sampleReportData.charts.paymentTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="paid" fill="#82ca9d" name="Pagas" />
                    <Bar dataKey="pending" fill="#ffc658" name="Pendentes" />
                    <Bar dataKey="overdue" fill="#ff7300" name="Vencidas" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Export Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações de Exportação</CardTitle>
              <CardDescription>Exporte o relatório em diferentes formatos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => exportReport('PDF')}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
                <Button variant="outline" onClick={() => exportReport('Excel')}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Exportar Excel
                </Button>
                <Button variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar por Email
                </Button>
                <Button variant="outline">
                  <Share className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
