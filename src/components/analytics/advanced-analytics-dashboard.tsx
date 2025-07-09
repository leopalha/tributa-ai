import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Download,
  RefreshCw,
  Settings,
  Filter,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  DollarSign,
  FileText,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
  AreaChart,
  ScatterChart,
  RadarChart,
  Line,
  Bar,
  Pie,
  Cell,
  Area,
  Scatter,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AnalyticsDashboard,
  DashboardWidget,
  ReportResult,
  KeyMetric,
  ReportInsight,
  ReportRecommendation,
  VisualizationType,
  ReportType,
  ReportCategory,
  ReportStatus,
} from '@/types/analytics-advanced';
import { AdvancedAnalyticsService } from '@/services/analytics-advanced.service';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface AdvancedAnalyticsDashboardProps {
  dashboardId?: string;
  initialData?: AnalyticsDashboard;
  onExport?: (format: string) => void;
  onShare?: () => void;
}

export function AdvancedAnalyticsDashboard({
  dashboardId,
  initialData,
  onExport,
  onShare,
}: AdvancedAnalyticsDashboardProps) {
  const [dashboard, setDashboard] = useState<AnalyticsDashboard | null>(initialData || null);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [widgetData, setWidgetData] = useState<Map<string, any>>(new Map());
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date(),
  });
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [insights, setInsights] = useState<ReportInsight[]>([]);
  const [recommendations, setRecommendations] = useState<ReportRecommendation[]>([]);
  const [keyMetrics, setKeyMetrics] = useState<KeyMetric[]>([]);

  const analyticsService = AdvancedAnalyticsService.getInstance();

  // Load dashboard data
  useEffect(() => {
    if (dashboardId && !initialData) {
      loadDashboard();
    } else if (initialData) {
      setWidgets(initialData.widgets);
      loadWidgetData();
    }
  }, [dashboardId, initialData]);

  // Auto-refresh functionality
  useEffect(() => {
    if (dashboard?.autoRefresh && dashboard.refreshInterval) {
      const interval = setInterval(() => {
        refreshDashboard();
      }, dashboard.refreshInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [dashboard]);

  const loadDashboard = async () => {
    if (!dashboardId) return;

    setLoading(true);
    try {
      const dashboardData = await analyticsService.getDashboard(dashboardId);
      setDashboard(dashboardData);
      setWidgets(dashboardData.widgets);
      await loadWidgetData();
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWidgetData = async () => {
    if (!dashboard || widgets.length === 0) return;

    setRefreshing(true);
    const newWidgetData = new Map();

    try {
      // Load data for all widgets in parallel
      const dataPromises = widgets.map(async widget => {
        try {
          const data = await analyticsService.getWidgetData(dashboard.id, widget.id);
          return { widgetId: widget.id, data };
        } catch (error) {
          console.error(`Erro ao carregar dados do widget ${widget.id}:`, error);
          return { widgetId: widget.id, data: null };
        }
      });

      const results = await Promise.all(dataPromises);
      results.forEach(({ widgetId, data }) => {
        if (data) {
          newWidgetData.set(widgetId, data);
        }
      });

      setWidgetData(newWidgetData);
    } catch (error) {
      console.error('Erro ao carregar dados dos widgets:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const refreshDashboard = useCallback(async () => {
    await loadWidgetData();
  }, [dashboard, widgets]);

  const refreshWidget = async (widgetId: string) => {
    if (!dashboard) return;

    try {
      const data = await analyticsService.refreshWidget(dashboard.id, widgetId);
      setWidgetData(prev => new Map(prev.set(widgetId, data)));
    } catch (error) {
      console.error('Erro ao atualizar widget:', error);
    }
  };

  const handleExport = (format: string) => {
    if (onExport) {
      onExport(format);
    }
  };

  const renderVisualization = (widget: DashboardWidget, data: any) => {
    if (!data) return <div className="p-4 text-center text-gray-500">Sem dados disponíveis</div>;

    const colors = [
      '#3B82F6',
      '#10B981',
      '#F59E0B',
      '#EF4444',
      '#8B5CF6',
      '#F97316',
      '#06B6D4',
      '#84CC16',
    ];

    switch (widget.type) {
      case 'chart':
        return renderChart(widget, data, colors);
      case 'table':
        return renderTable(widget, data);
      case 'kpi':
        return renderKPI(widget, data);
      case 'text':
        return renderText(widget, data);
      default:
        return <div>Tipo de widget não suportado</div>;
    }
  };

  const renderChart = (widget: DashboardWidget, data: any, colors: string[]) => {
    const config = widget.config.visualization || {};
    const chartData = Array.isArray(data) ? data : data.chartData || [];

    switch (widget.type) {
      case 'chart':
        // Determine chart type from config or default to line
        const chartType = config.customOptions?.chartType || 'LINE_CHART';

        switch (chartType) {
          case 'LINE_CHART':
            return (
              <ResponsiveContainer width="100%" height={config.height || 300}>
                <RechartsLineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey={config.axes?.x?.label || 'x'}
                    tickFormatter={
                      config.axes?.x?.format ? value => format(new Date(value), 'dd/MM') : undefined
                    }
                  />
                  <YAxis
                    tickFormatter={
                      config.axes?.y?.format === 'currency' ? formatCurrency : undefined
                    }
                  />
                  <Tooltip
                    labelFormatter={
                      config.axes?.x?.format
                        ? value => format(new Date(value), 'dd/MM/yyyy', { locale: ptBR })
                        : undefined
                    }
                    formatter={
                      config.axes?.y?.format === 'currency'
                        ? (value: number) => [formatCurrency(value), '']
                        : undefined
                    }
                  />
                  <Legend />
                  {Object.keys(chartData[0] || {})
                    .filter(key => key !== (config.axes?.x?.label || 'x'))
                    .map((key, index) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={colors[index % colors.length]}
                        strokeWidth={2}
                      />
                    ))}
                </RechartsLineChart>
              </ResponsiveContainer>
            );

          case 'BAR_CHART':
            return (
              <ResponsiveContainer width="100%" height={config.height || 300}>
                <RechartsBarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={config.axes?.x?.label || 'x'} />
                  <YAxis
                    tickFormatter={
                      config.axes?.y?.format === 'currency' ? formatCurrency : undefined
                    }
                  />
                  <Tooltip
                    formatter={
                      config.axes?.y?.format === 'currency'
                        ? (value: number) => [formatCurrency(value), '']
                        : undefined
                    }
                  />
                  <Legend />
                  {Object.keys(chartData[0] || {})
                    .filter(key => key !== (config.axes?.x?.label || 'x'))
                    .map((key, index) => (
                      <Bar key={key} dataKey={key} fill={colors[index % colors.length]} />
                    ))}
                </RechartsBarChart>
              </ResponsiveContainer>
            );

          case 'PIE_CHART':
            return (
              <ResponsiveContainer width="100%" height={config.height || 300}>
                <RechartsPieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {chartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) =>
                      config.axes?.y?.format === 'currency' ? formatCurrency(value) : value
                    }
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            );

          case 'AREA_CHART':
            return (
              <ResponsiveContainer width="100%" height={config.height || 300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={config.axes?.x?.label || 'x'} />
                  <YAxis
                    tickFormatter={
                      config.axes?.y?.format === 'currency' ? formatCurrency : undefined
                    }
                  />
                  <Tooltip
                    formatter={
                      config.axes?.y?.format === 'currency'
                        ? (value: number) => [formatCurrency(value), '']
                        : undefined
                    }
                  />
                  <Legend />
                  {Object.keys(chartData[0] || {})
                    .filter(key => key !== (config.axes?.x?.label || 'x'))
                    .map((key, index) => (
                      <Area
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stackId="1"
                        stroke={colors[index % colors.length]}
                        fill={colors[index % colors.length]}
                        fillOpacity={0.6}
                      />
                    ))}
                </AreaChart>
              </ResponsiveContainer>
            );

          default:
            return (
              <ResponsiveContainer width="100%" height={config.height || 300}>
                <RechartsLineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={config.axes?.x?.label || 'x'} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke={colors[0]} />
                </RechartsLineChart>
              </ResponsiveContainer>
            );
        }

      default:
        return <div>Tipo de visualização não suportado</div>;
    }
  };

  const renderTable = (widget: DashboardWidget, data: any) => {
    const tableData = data.rows || [];
    const headers = data.headers || [];

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              {headers.map((header: string, index: number) => (
                <th key={index} className="border border-gray-200 px-4 py-2 text-left font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row: any[], rowIndex: number) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.map((cell: any, cellIndex: number) => (
                  <td key={cellIndex} className="border border-gray-200 px-4 py-2">
                    {typeof cell === 'number' && headers[cellIndex]?.toLowerCase().includes('valor')
                      ? formatCurrency(cell)
                      : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderKPI = (widget: DashboardWidget, data: any) => {
    const kpiConfig = widget.config.kpi;
    if (!kpiConfig) return null;

    const value = data.value || 0;
    const previousValue = data.previousValue || 0;
    const change = data.change || 0;
    const changePercent = data.changePercent || 0;

    const isPositive = change >= 0;
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;
    const trendColor = isPositive ? 'text-green-600' : 'text-red-600';

    return (
      <div className="text-center">
        <div className="text-3xl font-bold mb-2">
          {kpiConfig.format === 'currency'
            ? formatCurrency(value)
            : kpiConfig.format === 'percentage'
              ? formatPercentage(value)
              : value.toLocaleString()}
        </div>
        {kpiConfig.showTrend && (
          <div className={`flex items-center justify-center gap-1 ${trendColor}`}>
            <TrendIcon className="h-4 w-4" />
            <span className="text-sm">{Math.abs(changePercent).toFixed(1)}%</span>
          </div>
        )}
        {kpiConfig.showComparison && previousValue > 0 && (
          <div className="text-xs text-gray-500 mt-1">
            vs.{' '}
            {kpiConfig.format === 'currency'
              ? formatCurrency(previousValue)
              : previousValue.toLocaleString()}{' '}
            anterior
          </div>
        )}
      </div>
    );
  };

  const renderText = (widget: DashboardWidget, data: any) => {
    const textConfig = widget.config.text;
    if (!textConfig) return null;

    return (
      <div
        className="prose max-w-none"
        style={{
          fontSize: textConfig.fontSize,
          textAlign: textConfig.textAlign,
        }}
      >
        {textConfig.format === 'html' ? (
          <div dangerouslySetInnerHTML={{ __html: textConfig.content }} />
        ) : (
          <div>{textConfig.content}</div>
        )}
      </div>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Carregando dashboard...</span>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Dashboard não encontrado</h3>
        <p className="text-gray-500">O dashboard solicitado não pôde ser carregado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{dashboard.name}</h1>
          {dashboard.description && <p className="text-gray-600 mt-1">{dashboard.description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="1y">1 ano</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={refreshDashboard} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>

          <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
            <Download className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      {keyMetrics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {keyMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                    <p className="text-2xl font-bold">
                      {metric.format === 'currency'
                        ? formatCurrency(metric.value)
                        : metric.format === 'percentage'
                          ? formatPercentage(metric.value)
                          : metric.value.toLocaleString()}
                    </p>
                    {metric.change !== undefined && (
                      <p
                        className={`text-sm flex items-center gap-1 ${
                          metric.trend === 'up'
                            ? 'text-green-600'
                            : metric.trend === 'down'
                              ? 'text-red-600'
                              : 'text-gray-600'
                        }`}
                      >
                        {metric.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : metric.trend === 'down' ? (
                          <TrendingDown className="h-3 w-3" />
                        ) : (
                          <Activity className="h-3 w-3" />
                        )}
                        {Math.abs(metric.changePercent || 0).toFixed(1)}%
                      </p>
                    )}
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Widgets Grid */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${dashboard.layout.columns}, 1fr)`,
          gridTemplateRows: `repeat(${dashboard.layout.rows}, minmax(300px, auto))`,
        }}
      >
        {widgets.map(widget => (
          <Card
            key={widget.id}
            className="overflow-hidden"
            style={{
              gridColumn: `${widget.position.x + 1} / span ${widget.position.width}`,
              gridRow: `${widget.position.y + 1} / span ${widget.position.height}`,
            }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{widget.title}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => refreshWidget(widget.id)}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>{renderVisualization(widget, widgetData.get(widget.id))}</CardContent>
          </Card>
        ))}
      </div>

      {/* Insights and Recommendations */}
      {(insights.length > 0 || recommendations.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Insights */}
          {insights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Insights Automáticos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.slice(0, 5).map((insight, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium">{insight.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant={
                            insight.impact === 'high'
                              ? 'destructive'
                              : insight.impact === 'medium'
                                ? 'default'
                                : 'secondary'
                          }
                        >
                          {insight.impact === 'high'
                            ? 'Alto Impacto'
                            : insight.impact === 'medium'
                              ? 'Médio Impacto'
                              : 'Baixo Impacto'}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {(insight.confidence * 100).toFixed(0)}% confiança
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Recomendações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.slice(0, 5).map((rec, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-medium">{rec.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant={
                            rec.priority === 'high'
                              ? 'destructive'
                              : rec.priority === 'medium'
                                ? 'default'
                                : 'secondary'
                          }
                        >
                          {rec.priority === 'high'
                            ? 'Alta Prioridade'
                            : rec.priority === 'medium'
                              ? 'Média Prioridade'
                              : 'Baixa Prioridade'}
                        </Badge>
                        <span className="text-xs text-gray-500">Esforço: {rec.effort}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        Última atualização: {format(dashboard.lastUpdated, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
      </div>
    </div>
  );
}
