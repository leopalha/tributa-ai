import Link from '@/components/ui/custom-link';
import { usePathname } from '@/lib/router-utils';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingCart,
  BarChart,
  Database,
  ChevronRight,
  LucideIcon,
  Users,
  Receipt,
  Calculator,
  History,
  Wallet,
  CircleDollarSign,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

function SidebarLink({ href, icon, children, className }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary',
        isActive ? 'bg-accent text-primary font-medium' : 'text-muted-foreground',
        className
      )}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

interface SidebarItemProps {
  Icon: LucideIcon;
  label: string;
  children?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function SidebarItem({ Icon, label, children, isOpen, onToggle }: SidebarItemProps) {
  const pathname = usePathname();
  const isActiveSection = pathname?.includes(label.toLowerCase());

  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        className={cn(
          'w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent',
          isActiveSection && 'text-foreground'
        )}
        onClick={onToggle}
      >
        <Icon className="mr-2 h-4 w-4" />
        <span className="flex-1 text-left">{label}</span>
        <ChevronRight className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-90')} />
      </Button>
      {isOpen && <div className="ml-6 border-l pl-3 space-y-1">{children}</div>}
    </div>
  );
}

export function Sidebar() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    marketplace: false,
    tc: false,
    fiscal: true,
    reports: false,
    settings: false,
    blockchain: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Auto-open section based on current path
  const pathname = usePathname();
  useEffect(() => {
    const pathSegment = pathname?.split('/')[2] || '';
    const subPathSegment = pathname?.split('/')[3] || '';

    if (pathSegment === 'marketplace') {
      setOpenSections(prev => ({ ...prev, marketplace: true }));
    } else if (pathSegment === 'tc') {
      setOpenSections(prev => ({ ...prev, tc: true }));
    } else if (
      ['debitos', 'compensacao', 'simulador'].includes(pathSegment) ||
      subPathSegment === 'historico'
    ) {
      setOpenSections(prev => ({ ...prev, fiscal: true }));
    } else if (pathSegment === 'relatorios') {
      setOpenSections(prev => ({ ...prev, reports: true }));
    } else if (pathSegment === 'configuracoes') {
      setOpenSections(prev => ({ ...prev, settings: true }));
    } else if (pathSegment === 'blockchain') {
      setOpenSections(prev => ({ ...prev, blockchain: true }));
    }
  }, [pathname]);

  return (
    <div className="fixed inset-y-0 z-50 flex w-72 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-xl">Tributa.AI</span>
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-4 px-4">
        <div className="space-y-4">
          <div className="space-y-1">
            <SidebarLink href="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />}>
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
            <SidebarLink href="/dashboard/marketplace" icon={<CreditCard className="h-4 w-4" />}>
              Ofertas Disponíveis
            </SidebarLink>
            <SidebarLink
              href="/dashboard/marketplace/minhas-ofertas"
              icon={<CircleDollarSign className="h-4 w-4" />}
            >
              Minhas Ofertas
            </SidebarLink>
            <SidebarLink
              href="/dashboard/marketplace/carteira"
              icon={<Wallet className="h-4 w-4" />}
            >
              Minha Carteira
            </SidebarLink>
          </SidebarItem>

          {/* Títulos de Crédito */}
          <SidebarItem
            Icon={Database}
            label="Títulos de Crédito"
            isOpen={openSections.tc}
            onToggle={() => toggleSection('tc')}
          >
            <SidebarLink href="/dashboard/tc" icon={<FileText className="h-4 w-4" />}>
              Meus Títulos
            </SidebarLink>
            <SidebarLink href="/dashboard/tc/novo" icon={<CreditCard className="h-4 w-4" />}>
              Adicionar Título
            </SidebarLink>
            <SidebarLink
              href="/dashboard/tokenizacao/wizard"
              icon={<Database className="h-4 w-4" />}
            >
              Tokenizar Crédito
            </SidebarLink>
          </SidebarItem>

          {/* Gestão Fiscal */}
          <SidebarItem
            Icon={FileText}
            label="Gestão Fiscal"
            isOpen={openSections.fiscal}
            onToggle={() => toggleSection('fiscal')}
          >
            <SidebarLink href="/dashboard/debitos" icon={<Receipt className="h-4 w-4" />}>
              Débitos Fiscais
            </SidebarLink>
            <SidebarLink
              href="/dashboard/recuperacao/compensacao-bilateral"
              icon={<Calculator className="h-4 w-4" />}
            >
              Compensação
            </SidebarLink>
            <SidebarLink
              href="/dashboard/compensacao/historico"
              icon={<History className="h-4 w-4" />}
            >
              Histórico de Compensações
            </SidebarLink>
            <SidebarLink href="/dashboard/simulador" icon={<BarChart className="h-4 w-4" />}>
              Simulador Fiscal
            </SidebarLink>
          </SidebarItem>

          {/* Blockchain */}
          <SidebarItem
            Icon={Shield}
            label="Blockchain"
            isOpen={openSections.blockchain || false}
            onToggle={() => toggleSection('blockchain')}
          >
            <SidebarLink
              href="/dashboard/blockchain/explorer"
              icon={<Database className="h-4 w-4" />}
            >
              Explorer
            </SidebarLink>
            <SidebarLink
              href="/dashboard/relatorios/auditorias"
              icon={<Shield className="h-4 w-4" />}
            >
              Auditoria
            </SidebarLink>
          </SidebarItem>

          {/* Relatórios */}
          <SidebarItem
            Icon={BarChart}
            label="Relatórios"
            isOpen={openSections.reports}
            onToggle={() => toggleSection('reports')}
          >
            <SidebarLink
              href="/dashboard/relatorios/compensacoes"
              icon={<FileText className="h-4 w-4" />}
            >
              Relatório de Compensações
            </SidebarLink>
          </SidebarItem>

          {/* Configurações */}
          <SidebarItem
            Icon={Settings}
            label="Configurações"
            isOpen={openSections.settings}
            onToggle={() => toggleSection('settings')}
          >
            <SidebarLink
              href="/dashboard/configuracoes/perfil"
              icon={<CreditCard className="h-4 w-4" />}
            >
              Perfil
            </SidebarLink>
            <SidebarLink
              href="/dashboard/configuracoes/empresa"
              icon={<Users className="h-4 w-4" />}
            >
              Empresa
            </SidebarLink>
            <SidebarLink
              href="/dashboard/configuracoes/usuario"
              icon={<CreditCard className="h-4 w-4" />}
            >
              Usuários
            </SidebarLink>
          </SidebarItem>
        </div>
      </div>

      <div className="mt-auto border-t p-4">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/auth/logout">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Link>
        </Button>
      </div>
    </div>
  );
}
