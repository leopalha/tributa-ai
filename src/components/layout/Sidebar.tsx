// PROMPT DE PADRONIZAÇÃO PARA TRIBUTA.AI
/**
 * PADRONIZAÇÃO TRIBUTA.AI v1.0
 * 
 * Este componente Sidebar foi padronizado seguindo as diretrizes do design system.
 * Para padronizar TODOS os componentes da plataforma, siga estas diretrizes:
 * 
 * 1. CORES PADRONIZADAS
 *    - Use classes Tailwind padronizadas (text-blue-600) em vez de hardcoded [hsl(var(--...))]
 *    - Cores primárias: blue-600 (ações principais), gray-700 (textos), gray-200 (bordas)
 *    - Estados: blue-50 (hover/active bg), red-600 (destructive), green-500 (success)
 * 
 * 2. TAMANHOS PADRONIZADOS
 *    - Botões: h-8/32px (sm), h-10/40px (md), h-12/48px (lg) 
 *    - Cards: p-4/16px (sm), p-6/24px (md), p-8/32px (lg)
 *    - Espaçamento: gap-2/8px (xs), gap-4/16px (sm), gap-6/24px (md), gap-8/32px (lg)
 *    - Tipografia: text-sm, text-base (padrão), text-lg, text-xl, text-2xl
 * 
 * 3. COMPONENTES PADRONIZADOS
 *    - Cards com estrutura Header + Content + Actions
 *    - Botões sempre alinhados no canto inferior direito dos cards
 *    - Estados consistentes: Loading (spinner centralizado), Empty (ícone+título+ação)
 * 
 * 4. LAYOUT RESPONSIVO
 *    - Mobile-first: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
 *    - Flex adaptável: flex flex-col md:flex-row
 * 
 * 5. ESTADOS CONSISTENTES
 *    - Loading: <Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />
 *    - Empty: Componente centralizado com ícone, texto e ação
 *    - Error: Mensagem clara com opção de retry
 * 
 * Ao desenvolver novos componentes ou modificar existentes, utilize o StandardPageLayout
 * para manter consistência de espaçamento, margens e layout geral.
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useDemoUser } from '@/hooks/useDemoUser';
import { 
  ChevronRight, 
  LayoutDashboard,
  Search,
  FileCheck,
  PlusCircle,
  Wallet,
  Heart,
  DollarSign,
  MessageSquare,
  History,
  Brain,
  Target,
  FileSearch,
  Eye,
  GitBranch,
  Layers,
  Gavel,
  Database,
  Activity,
  Coins,
  Receipt,
  Shield,
  CircleDollarSign,
  Plus,
  TrendingUp,
  BarChart,
  Settings,
  User,
  Building2,
  Users,
  LogOut,
  Crown,
  Server,
  FileText,
  BarChart3,
  Zap,
  ShoppingCart,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { LucideIcon } from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

function SidebarLink({ to, icon, children, className, onClick }: SidebarLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname?.startsWith(`${to}/`);

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group',
        isActive 
          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
        className
      )}
    >
      <div className={cn('transition-transform duration-200', isActive ? 'text-blue-600' : 'group-hover:text-blue-500')}>
        {icon}
      </div>
      <span>{children}</span>
    </Link>
  );
}

interface SidebarItemProps {
  Icon: LucideIcon;
  label: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function SidebarItem({ Icon, label, children, isOpen, onToggle }: SidebarItemProps) {
  const pathname = useLocation();
  const isActiveSection = pathname.pathname?.includes(label.toLowerCase()) || 
    (label === 'Administração' && pathname.pathname?.includes('/admin'));

  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        className={cn(
          'w-full justify-start h-auto py-2.5 px-3 text-left font-semibold transition-all duration-200 rounded-lg group',
          isActiveSection 
            ? 'bg-blue-50 text-blue-700 shadow-sm' 
            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
        )}
        onClick={onToggle}
      >
        <Icon className={cn(
          "mr-3 h-4 w-4 flex-shrink-0 transition-colors duration-200", 
          isActiveSection ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
        )} />
        <span className="flex-1 text-left">{label}</span>
        <ChevronRight 
          className={cn(
            'h-4 w-4 transition-all duration-200 flex-shrink-0', 
            isOpen && 'rotate-90',
            isActiveSection ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
          )} 
        />
      </Button>
      {isOpen && (
        <div className="ml-4 pl-4 border-l-2 border-gray-200 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
}

interface SidebarProps {
  userName?: string;
}

export function Sidebar({ userName = 'Usuário' }: SidebarProps) {
  const [openSections, setOpenSections] = useState({
    marketplace: false,
    recuperacao: false,
    blockchain: false,
    wallet: false,
    settings: false,
    admin: false,
  });

  const pathname = useLocation();
  const { canAccessAdminPanel, logout } = useDemoUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    logout();
    window.location.href = '/login';
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  // Auto-open sections based on current route
  useEffect(() => {
    if (pathname.pathname?.includes('/marketplace')) {
      setOpenSections(prev => ({ ...prev, marketplace: true }));
    } else if (pathname.pathname?.includes('/recuperacao')) {
      setOpenSections(prev => ({ ...prev, recuperacao: true }));
    } else if (pathname.pathname?.includes('/blockchain')) {
      setOpenSections(prev => ({ ...prev, blockchain: true }));
    } else if (pathname.pathname?.includes('/wallet')) {
      setOpenSections(prev => ({ ...prev, wallet: true }));
    } else if (pathname.pathname?.includes('/configuracoes')) {
      setOpenSections(prev => ({ ...prev, settings: true }));
    } else if (pathname.pathname?.includes('/admin')) {
      setOpenSections(prev => ({ ...prev, admin: true }));
    }
  }, [pathname]);

  // Use the proper admin check from useAuthSystem
  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="flex h-16 items-center border-b border-gray-200 px-4 bg-white">
        <Link to="/dashboard" className="flex items-center gap-3 font-semibold group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-105">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">
            Tributa.AI
          </span>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-auto py-4 px-3">
        <div className="space-y-3">
          {/* Dashboard Principal */}
          <div className="space-y-1">
            <SidebarLink to="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />}>
              Dashboard
            </SidebarLink>
          </div>

          {/* Marketplace */}
          <SidebarItem
            Icon={ShoppingCart}
            label="Marketplace"
            isOpen={openSections.marketplace}
            onToggle={() => toggleSection('marketplace')}
          >
            <SidebarLink to="/dashboard/marketplace" icon={<Search className="h-4 w-4" />}>
              Explorar
            </SidebarLink>
            <SidebarLink to="/dashboard/marketplace/emitir" icon={<PlusCircle className="h-4 w-4" />}>
              Emitir Token
            </SidebarLink>
            <SidebarLink to="/dashboard/marketplace/meus-tokens" icon={<Wallet className="h-4 w-4" />}>
              Meus Tokens
            </SidebarLink>
            <SidebarLink to="/dashboard/marketplace/meus-creditos" icon={<FileCheck className="h-4 w-4" />}>
              Meus Créditos
            </SidebarLink>
            <SidebarLink to="/dashboard/marketplace/minhas-negociacoes" icon={<Gavel className="h-4 w-4" />}>
              Minhas Negociações
            </SidebarLink>
            <SidebarLink to="/dashboard/marketplace/anuncios" icon={<DollarSign className="h-4 w-4" />}>
              Meus Anúncios
            </SidebarLink>
            <SidebarLink to="/dashboard/marketplace/favoritos" icon={<Heart className="h-4 w-4" />}>
              Favoritos
            </SidebarLink>
            <SidebarLink to="/dashboard/marketplace/historico" icon={<History className="h-4 w-4" />}>
              Histórico
            </SidebarLink>
          </SidebarItem>


          {/* Recuperação de Créditos */}
          <SidebarItem
            Icon={Brain}
            label="Recuperação"
            isOpen={openSections.recuperacao}
            onToggle={() => toggleSection('recuperacao')}
          >
            <SidebarLink to="/dashboard/recuperacao" icon={<Target className="h-4 w-4" />}>
              Visão Geral
            </SidebarLink>
            <SidebarLink to="/dashboard/recuperacao/analise" icon={<FileSearch className="h-4 w-4" />}>
              Análise Inteligente
            </SidebarLink>
            <SidebarLink to="/dashboard/recuperacao/resultados" icon={<Eye className="h-4 w-4" />}>
              Resultados
            </SidebarLink>
            <SidebarLink to="/dashboard/recuperacao/compensacao-bilateral" icon={<GitBranch className="h-4 w-4" />}>
              Compensação Bilateral
            </SidebarLink>
            <SidebarLink to="/dashboard/recuperacao/compensacao-multilateral" icon={<Layers className="h-4 w-4" />}>
              Compensação Multilateral
            </SidebarLink>
            <SidebarLink to="/dashboard/recuperacao/processos" icon={<Gavel className="h-4 w-4" />}>
              Processos
            </SidebarLink>
          </SidebarItem>

          {/* Blockchain */}
          <SidebarItem
            Icon={Database}
            label="Blockchain"
            isOpen={openSections.blockchain}
            onToggle={() => toggleSection('blockchain')}
          >
            <SidebarLink to="/dashboard/blockchain" icon={<Activity className="h-4 w-4" />}>
              Visão Geral
            </SidebarLink>
            <SidebarLink to="/dashboard/blockchain/explorer" icon={<Search className="h-4 w-4" />}>
              Explorer
            </SidebarLink>
            <SidebarLink to="/dashboard/blockchain/tokens" icon={<Coins className="h-4 w-4" />}>
              Tokens
            </SidebarLink>
            <SidebarLink to="/dashboard/blockchain/transacoes" icon={<Receipt className="h-4 w-4" />}>
              Transações
            </SidebarLink>
            <SidebarLink to="/dashboard/blockchain/auditoria" icon={<Shield className="h-4 w-4" />}>
              Auditoria
            </SidebarLink>
          </SidebarItem>

          {/* Carteira Digital */}
          <SidebarItem
            Icon={Wallet}
            label="Carteira Digital"
            isOpen={openSections.wallet}
            onToggle={() => toggleSection('wallet')}
          >
            <SidebarLink to="/dashboard/wallet" icon={<Wallet className="h-4 w-4" />}>
              Visão Geral
            </SidebarLink>
            <SidebarLink to="/dashboard/wallet/balance" icon={<CircleDollarSign className="h-4 w-4" />}>
              Saldo
            </SidebarLink>
            <SidebarLink to="/dashboard/wallet/transacoes" icon={<Receipt className="h-4 w-4" />}>
              Transações
            </SidebarLink>
            <SidebarLink to="/dashboard/wallet/deposit" icon={<Plus className="h-4 w-4" />}>
              Depósito
            </SidebarLink>
            <SidebarLink to="/dashboard/wallet/withdraw" icon={<TrendingUp className="h-4 w-4" />}>
              Saque
            </SidebarLink>
            <SidebarLink to="/dashboard/wallet/analytics" icon={<BarChart className="h-4 w-4" />}>
              Analytics
            </SidebarLink>
          </SidebarItem>

          {/* Configurações */}
          <SidebarItem
            Icon={Settings}
            label="Configurações"
            isOpen={openSections.settings}
            onToggle={() => toggleSection('settings')}
          >
            <SidebarLink to="/dashboard/configuracoes" icon={<Settings className="h-4 w-4" />}>
              Visão Geral
            </SidebarLink>
            <SidebarLink to="/dashboard/configuracoes/perfil" icon={<User className="h-4 w-4" />}>
              Perfil
            </SidebarLink>
            <SidebarLink to="/dashboard/configuracoes/empresa" icon={<Building2 className="h-4 w-4" />}>
              Empresa
            </SidebarLink>
            <SidebarLink to="/dashboard/configuracoes/usuarios" icon={<Users className="h-4 w-4" />}>
              Usuários
            </SidebarLink>
          </SidebarItem>
        </div>
      </div>

      {/* Footer - Informações do usuário, Administração e botão de sair */}
      <div className="border-t border-gray-200 p-3 space-y-2">
        {/* Perfil do Usuário */}
        <div className="flex items-center justify-between mb-3 px-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              {userInitial}
            </div>
            <div className="text-sm font-medium text-gray-700">{userName}</div>
          </div>
        </div>
        
        {/* Administração - Movida para área do perfil */}
        {canAccessAdminPanel && (
          <SidebarItem
            Icon={Shield}
            label="Administração"
            isOpen={openSections.admin}
            onToggle={() => toggleSection('admin')}
          >
            <SidebarLink to="/dashboard/admin" icon={<Crown className="h-4 w-4" />}>
              Dashboard Admin
            </SidebarLink>
            <SidebarLink to="/dashboard/admin/sistema" icon={<Server className="h-4 w-4" />}>
              Sistema
            </SidebarLink>
            <SidebarLink to="/dashboard/admin/logs" icon={<FileText className="h-4 w-4" />}>
              Logs
            </SidebarLink>
            <SidebarLink to="/dashboard/admin/relatorios" icon={<BarChart3 className="h-4 w-4" />}>
              Relatórios
            </SidebarLink>
          </SidebarItem>
        )}
        
        {/* Botão Sair */}
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50" 
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sair
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Sidebar para desktop */}
      <div className="hidden lg:flex fixed inset-y-0 z-50 w-64 flex-col bg-white border-r border-gray-200 shadow-sm">
        <SidebarContent />
      </div>
      
      {/* Menu para mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b p-2 flex items-center">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-white">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}