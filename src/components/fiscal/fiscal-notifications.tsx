import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bell,
  BellRing,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  Smartphone,
  Settings,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  Calendar,
  DollarSign,
  FileText,
  Shield,
  Zap,
  TrendingUp,
  Download,
  Users,
  Target,
} from 'lucide-react';
import { format, isAfter, isBefore, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FiscalObligation {
  id: string;
  title: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  dueDate: Date;
  taxName?: string;
  description?: string;
}

interface FiscalNotification {
  id: string;
  type: 'deadline' | 'overdue' | 'payment_due' | 'compliance' | 'reminder' | 'system';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  obligationId?: string;
  createdAt: Date;
  readAt?: Date;
  dismissedAt?: Date;
  actionRequired: boolean;
  actionUrl?: string;
  metadata?: {
    amount?: number;
    dueDate?: Date;
    taxType?: string;
    complianceScore?: number;
  };
}

interface NotificationSettings {
  email: {
    enabled: boolean;
    deadlineAlerts: boolean;
    overdueAlerts: boolean;
    complianceReports: boolean;
    weeklyDigest: boolean;
    monthlyReport: boolean;
  };
  sms: {
    enabled: boolean;
    criticalAlertsOnly: boolean;
    deadlineReminders: boolean;
  };
  push: {
    enabled: boolean;
    allNotifications: boolean;
    onlyHighPriority: boolean;
  };
  alertTiming: {
    deadlineWarningDays: number;
    overdueReminderDays: number;
    complianceCheckFrequency: 'daily' | 'weekly' | 'monthly';
  };
  autoReports: {
    weeklyEnabled: boolean;
    monthlyEnabled: boolean;
    quarterlyEnabled: boolean;
    recipients: string[];
  };
}

interface FiscalNotificationsProps {
  obligations: FiscalObligation[];
}

export function FiscalNotifications({ obligations }: FiscalNotificationsProps) {
  const [notifications, setNotifications] = useState<FiscalNotification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      enabled: true,
      deadlineAlerts: true,
      overdueAlerts: true,
      complianceReports: true,
      weeklyDigest: true,
      monthlyReport: true,
    },
    sms: {
      enabled: false,
      criticalAlertsOnly: true,
      deadlineReminders: false,
    },
    push: {
      enabled: true,
      allNotifications: false,
      onlyHighPriority: true,
    },
    alertTiming: {
      deadlineWarningDays: 15,
      overdueReminderDays: 3,
      complianceCheckFrequency: 'weekly',
    },
    autoReports: {
      weeklyEnabled: true,
      monthlyEnabled: true,
      quarterlyEnabled: false,
      recipients: [],
    },
  });

  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showRead, setShowRead] = useState(true);

  // Gerar notificações baseadas nas obrigações
  useEffect(() => {
    const generateNotifications = () => {
      const newNotifications: FiscalNotification[] = [];
      const now = new Date();

      obligations.forEach(obligation => {
        const dueDate = new Date(obligation.dueDate);
        const warningDate = subDays(dueDate, settings.alertTiming.deadlineWarningDays);

        // Notificação de prazo próximo
        if (isAfter(now, warningDate) && isBefore(now, dueDate) && obligation.status !== 'PAID') {
          newNotifications.push({
            id: `deadline-${obligation.id}`,
            type: 'deadline',
            priority: 'high',
            title: 'Prazo se aproximando',
            message: `${obligation.title} vence em ${Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} dias`,
            obligationId: obligation.id,
            createdAt: now,
            actionRequired: true,
            actionUrl: `/dashboard/gestao-fiscal?tab=obligations&id=${obligation.id}`,
            metadata: {
              amount: obligation.amount,
              dueDate: obligation.dueDate,
              taxType: obligation.taxName,
            },
          });
        }

        // Notificação de vencimento
        if (isAfter(now, dueDate) && obligation.status !== 'PAID') {
          newNotifications.push({
            id: `overdue-${obligation.id}`,
            type: 'overdue',
            priority: 'critical',
            title: 'Obrigação vencida',
            message: `${obligation.title} está vencida há ${Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))} dias`,
            obligationId: obligation.id,
            createdAt: now,
            actionRequired: true,
            actionUrl: `/dashboard/gestao-fiscal?tab=obligations&id=${obligation.id}`,
            metadata: {
              amount: obligation.amount,
              dueDate: obligation.dueDate,
              taxType: obligation.taxName,
            },
          });
        }
      });

      // Notificações de sistema
      const pendingCount = obligations.filter(o => o.status === 'PENDING').length;
      const overdueCount = obligations.filter(o => o.status === 'OVERDUE').length;

      if (overdueCount > 0) {
        newNotifications.push({
          id: 'system-overdue-summary',
          type: 'system',
          priority: 'high',
          title: 'Resumo de obrigações vencidas',
          message: `Você tem ${overdueCount} obrigação(ões) vencida(s) que requer(em) atenção imediata`,
          createdAt: now,
          actionRequired: true,
          actionUrl: '/dashboard/gestao-fiscal?tab=obligations&filter=overdue',
        });
      }

      // Notificação de compliance
      const complianceScore = 87.5; // Mock score
      if (complianceScore < 90) {
        newNotifications.push({
          id: 'compliance-warning',
          type: 'compliance',
          priority: 'medium',
          title: 'Score de compliance baixo',
          message: `Seu score de compliance está em ${complianceScore}%. Considere revisar suas obrigações pendentes.`,
          createdAt: now,
          actionRequired: false,
          actionUrl: '/dashboard/gestao-fiscal?tab=compliance',
          metadata: {
            complianceScore,
          },
        });
      }

      setNotifications(newNotifications);
    };

    generateNotifications();
  }, [obligations, settings.alertTiming]);

  // Filtrar notificações
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      if (filterType !== 'all' && notification.type !== filterType) return false;
      if (filterPriority !== 'all' && notification.priority !== filterPriority) return false;
      if (!showRead && notification.readAt) return false;
      if (notification.dismissedAt) return false;
      return true;
    });
  }, [notifications, filterType, filterPriority, showRead]);

  // Marcar como lida
  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, readAt: new Date() } : n))
    );
  };

  // Descartar notificação
  const dismissNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, dismissedAt: new Date() } : n))
    );
  };

  // Marcar todas como lidas
  const markAllAsRead = () => {
    const now = new Date();
    setNotifications(prev => prev.map(n => (!n.readAt ? { ...n, readAt: now } : n)));
  };

  // Obter cor da prioridade
  const getPriorityColor = (priority: FiscalNotification['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Obter ícone do tipo
  const getTypeIcon = (type: FiscalNotification['type']) => {
    switch (type) {
      case 'deadline':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4" />;
      case 'payment_due':
        return <DollarSign className="h-4 w-4" />;
      case 'compliance':
        return <Shield className="h-4 w-4" />;
      case 'reminder':
        return <Bell className="h-4 w-4" />;
      default:
        return <BellRing className="h-4 w-4" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const unreadCount = notifications.filter(n => !n.readAt && !n.dismissedAt).length;
  const criticalCount = notifications.filter(
    n => n.priority === 'critical' && !n.dismissedAt
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notificações Fiscais
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground">
            Alertas inteligentes e lembretes para suas obrigações fiscais
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Marcar Todas como Lidas
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Não Lidas</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">Notificações pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Críticas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">Requerem ação imediata</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canais Ativos</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                [settings.email.enabled, settings.sms.enabled, settings.push.enabled].filter(
                  Boolean
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Email, SMS, Push</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Automáticos</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {
                [settings.autoReports.weeklyEnabled, settings.autoReports.monthlyEnabled].filter(
                  Boolean
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Relatórios agendados</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="text-sm font-medium">Filtros:</span>
                </div>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="deadline">Prazos</SelectItem>
                    <SelectItem value="overdue">Vencidas</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                  <Switch id="show-read" checked={showRead} onCheckedChange={setShowRead} />
                  <Label htmlFor="show-read" className="text-sm">
                    Mostrar lidas
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Notificações */}
          <Card>
            <CardHeader>
              <CardTitle>Notificações ({filteredNotifications.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma notificação</h3>
                    <p className="text-muted-foreground">Você está em dia com suas obrigações!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredNotifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`p-4 border rounded-lg transition-colors ${
                          notification.readAt ? 'bg-muted/30' : 'bg-background'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}
                            >
                              {getTypeIcon(notification.type)}
                            </div>
                            <div>
                              <h4 className="font-medium">{notification.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {notification.message}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                notification.priority === 'critical' ? 'destructive' : 'secondary'
                              }
                            >
                              {notification.priority}
                            </Badge>
                            {!notification.readAt && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => dismissNotification(notification.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>
                            {format(notification.createdAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </span>

                          {notification.metadata && (
                            <div className="flex items-center gap-4">
                              {notification.metadata.amount && (
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  {formatCurrency(notification.metadata.amount)}
                                </span>
                              )}
                              {notification.metadata.dueDate && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {format(notification.metadata.dueDate, 'dd/MM/yyyy', {
                                    locale: ptBR,
                                  })}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {notification.actionRequired && notification.actionUrl && (
                          <div className="mt-3">
                            <Button size="sm" variant="outline">
                              Ver Detalhes
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configurações de Canais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Canais de Notificação
                </CardTitle>
                <CardDescription>
                  Configure como você deseja receber as notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <Label className="font-medium">Email</Label>
                    </div>
                    <Switch
                      checked={settings.email.enabled}
                      onCheckedChange={checked =>
                        setSettings(prev => ({
                          ...prev,
                          email: { ...prev.email, enabled: checked },
                        }))
                      }
                    />
                  </div>

                  {settings.email.enabled && (
                    <div className="ml-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Alertas de prazo</Label>
                        <Switch
                          checked={settings.email.deadlineAlerts}
                          onCheckedChange={checked =>
                            setSettings(prev => ({
                              ...prev,
                              email: { ...prev.email, deadlineAlerts: checked },
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Alertas de vencimento</Label>
                        <Switch
                          checked={settings.email.overdueAlerts}
                          onCheckedChange={checked =>
                            setSettings(prev => ({
                              ...prev,
                              email: { ...prev.email, overdueAlerts: checked },
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Resumo semanal</Label>
                        <Switch
                          checked={settings.email.weeklyDigest}
                          onCheckedChange={checked =>
                            setSettings(prev => ({
                              ...prev,
                              email: { ...prev.email, weeklyDigest: checked },
                            }))
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* SMS */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <Label className="font-medium">SMS</Label>
                    </div>
                    <Switch
                      checked={settings.sms.enabled}
                      onCheckedChange={checked =>
                        setSettings(prev => ({
                          ...prev,
                          sms: { ...prev.sms, enabled: checked },
                        }))
                      }
                    />
                  </div>

                  {settings.sms.enabled && (
                    <div className="ml-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Apenas alertas críticos</Label>
                        <Switch
                          checked={settings.sms.criticalAlertsOnly}
                          onCheckedChange={checked =>
                            setSettings(prev => ({
                              ...prev,
                              sms: { ...prev.sms, criticalAlertsOnly: checked },
                            }))
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Configurações de Timing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Configurações de Alertas
                </CardTitle>
                <CardDescription>Defina quando você deseja ser notificado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Alertar sobre prazos (dias antes)</Label>
                  <Input
                    type="number"
                    value={settings.alertTiming.deadlineWarningDays}
                    onChange={e =>
                      setSettings(prev => ({
                        ...prev,
                        alertTiming: {
                          ...prev.alertTiming,
                          deadlineWarningDays: parseInt(e.target.value) || 15,
                        },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Lembrar vencimentos (dias após)</Label>
                  <Input
                    type="number"
                    value={settings.alertTiming.overdueReminderDays}
                    onChange={e =>
                      setSettings(prev => ({
                        ...prev,
                        alertTiming: {
                          ...prev.alertTiming,
                          overdueReminderDays: parseInt(e.target.value) || 3,
                        },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Verificação de compliance</Label>
                  <Select
                    value={settings.alertTiming.complianceCheckFrequency}
                    onValueChange={(value: any) =>
                      setSettings(prev => ({
                        ...prev,
                        alertTiming: {
                          ...prev.alertTiming,
                          complianceCheckFrequency: value,
                        },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Salvar Configurações
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
