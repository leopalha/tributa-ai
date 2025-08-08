import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  XCircle,
  Crown,
  Bot,
  Users,
  Database,
  Heart,
  FileText,
  Bell,
  Wallet,
  PieChart,
  Target,
  History,
  Eye,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDemoUser } from '@/hooks/useDemoUser';
import { useKYCStatus } from '@/components/auth/KYCAccessControl';

interface UserProfileHoverProps {
  className?: string;
}

export function UserProfileHover({ className }: UserProfileHoverProps) {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout } = useDemoUser();
  const { kycStatus, loading: kycLoading } = useKYCStatus();
  const { isAdmin, isDemoUserActive, canViewBotControls, canAccessAdminPanel } = useDemoUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  const getKYCStatusInfo = () => {
    if (kycLoading) return { icon: <Clock className="h-4 w-4 text-gray-400" />, label: 'Carregando...', color: 'gray' };
    
    if (!kycStatus) {
      return { 
        icon: <Shield className="h-4 w-4 text-yellow-500" />, 
        label: 'KYC Pendente', 
        color: 'yellow',
        description: 'Complete sua verificação de identidade'
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

  // Itens específicos para usuários demo
  const demoUserMenuItems = [
    {
      title: 'Meu Portfólio',
      href: '/dashboard/portfolio',
      icon: PieChart,
      description: 'Acompanhar performance dos seus investimentos',
    },
    {
      title: 'Oportunidades',
      href: '/dashboard/opportunities',
      icon: Target,
      description: 'Novas oportunidades de investimento',
    },
    {
      title: 'Histórico',
      href: '/dashboard/transactions',
      icon: History,
      description: 'Suas transações e movimentações',
    },
    {
      title: 'Carteira Digital',
      href: '/dashboard/wallet',
      icon: Wallet,
      description: 'Gerenciar sua carteira digital',
    },
  ];

  // Itens específicos para administradores
  const adminMenuItems = [
    {
      title: 'Painel Admin',
      href: '/dashboard/admin',
      icon: Crown,
      description: 'Painel administrativo principal',
    },
    {
      title: 'Bots & Automação',
      href: '/dashboard/admin/bots',
      icon: Bot,
      description: 'Gerenciar bots e automação',
    },
    {
      title: 'Consulta CNPJ/CPF',
      href: '/dashboard/admin/fonte-dados',
      icon: Database,
      description: 'Consulte débitos e créditos fiscais',
    },
    {
      title: 'Sistema de Saúde',
      href: '/dashboard/admin/system-health',
      icon: Heart,
      description: 'Monitoramento da plataforma',
    },
    {
      title: 'Usuários',
      href: '/dashboard/admin/users',
      icon: Users,
      description: 'Gerenciar usuários',
    },
    {
      title: 'Logs de Auditoria',
      href: '/dashboard/admin/audit-logs',
      icon: FileText,
      description: 'Logs de auditoria e segurança',
    },
    {
      title: 'Notificações',
      href: '/dashboard/admin/notifications',
      icon: Bell,
      description: 'Central de notificações',
    },
  ];

  return (
    <div className={className}>
      <HoverCard>
        <HoverCardTrigger asChild>
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser?.avatar || "/avatars/01.png"} alt="Avatar" />
                  <AvatarFallback>
                    {currentUser?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" forceMount>
              {/* Cabeçalho do perfil */}
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center space-x-3 p-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={currentUser?.avatar || "/avatars/01.png"} alt="Avatar" />
                    <AvatarFallback className="text-lg">
                      {currentUser?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none">
                      {currentUser?.name || 'Usuário'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground mt-1">
                      {currentUser?.email || 'usuario@exemplo.com'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {isAdmin && (
                        <Badge variant="secondary" className="text-xs">
                          <Crown className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                      {isDemoUserActive && (
                        <Badge variant="outline" className="text-xs">
                          Demo
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {/* Status KYC */}
              <div className="px-2 py-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center space-x-2">
                    {kycInfo.icon}
                    <div>
                      <p className="text-sm font-medium">{kycInfo.label}</p>
                      <p className="text-xs text-muted-foreground">{kycInfo.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigate('/dashboard/kyc');
                      setIsOpen(false);
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <DropdownMenuSeparator />

              {/* Itens específicos do usuário */}
              <DropdownMenuGroup>
                {isDemoUserActive && (
                  <>
                    <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                      ÁREA DO USUÁRIO
                    </DropdownMenuLabel>
                    {demoUserMenuItems.map((item) => (
                      <DropdownMenuItem 
                        key={item.href}
                        onClick={() => {
                          navigate(item.href);
                          setIsOpen(false);
                        }}
                        className="cursor-pointer"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </>
                )}

                {isAdmin && (
                  <>
                    <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                      ÁREA ADMINISTRATIVA
                    </DropdownMenuLabel>
                    {adminMenuItems.map((item) => (
                      <DropdownMenuItem 
                        key={item.href}
                        onClick={() => {
                          navigate(item.href);
                          setIsOpen(false);
                        }}
                        className="cursor-pointer"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </>
                )}

                {/* Itens comuns */}
                <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                  CONFIGURAÇÕES
                </DropdownMenuLabel>
                <DropdownMenuItem 
                  onClick={() => {
                    navigate('/dashboard/configuracoes/perfil');
                    setIsOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <div>
                    <div className="font-medium">Perfil</div>
                    <div className="text-xs text-muted-foreground">Gerenciar informações pessoais</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    navigate('/dashboard/configuracoes');
                    setIsOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <div>
                    <div className="font-medium">Configurações</div>
                    <div className="text-xs text-muted-foreground">Preferências do sistema</div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </HoverCardTrigger>
        
        <HoverCardContent className="w-80" align="end">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={currentUser?.avatar || "/avatars/01.png"} alt="Avatar" />
                  <AvatarFallback className="text-2xl">
                    {currentUser?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{currentUser?.name || 'Usuário'}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {currentUser?.email || 'usuario@exemplo.com'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {isAdmin && (
                      <Badge variant="secondary" className="text-xs">
                        <Crown className="h-3 w-3 mr-1" />
                        Administrador
                      </Badge>
                    )}
                    {isDemoUserActive && (
                      <Badge variant="outline" className="text-xs">
                        Usuário Demo
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Status KYC */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center space-x-3">
                    {kycInfo.icon}
                    <div>
                      <p className="text-sm font-medium">{kycInfo.label}</p>
                      <p className="text-xs text-muted-foreground">{kycInfo.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/dashboard/kyc')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>

                <Separator />

                {/* Ações rápidas */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/dashboard/configuracoes/perfil')}
                    className="h-auto p-3"
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <User className="h-4 w-4" />
                      <span className="text-xs">Perfil</span>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/dashboard/configuracoes')}
                    className="h-auto p-3"
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <Settings className="h-4 w-4" />
                      <span className="text-xs">Configurações</span>
                    </div>
                  </Button>
                </div>

                {/* Informações adicionais */}
                <div className="text-xs text-muted-foreground">
                  <p>Último acesso: Hoje às 14:30</p>
                  <p>Membro desde: Janeiro 2024</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
} 