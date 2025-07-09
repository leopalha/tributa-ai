import { useState } from 'react';
import Link from '@/components/ui/custom-link';
import { usePathname } from '@/lib/router-utils';
import { useSession } from '../../hooks/useSession';
import {
  BarChart2,
  CreditCard,
  FileText,
  Home,
  Menu,
  Settings,
  ShoppingCart,
  X,
  LogOut,
  FileCheck,
  Calculator,
  BarChartHorizontal,
  DollarSign,
  User,
  Database,
  Landmark,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface SidebarProps {
  userName: string;
}

export function Sidebar({ userName }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userInitial = userName.charAt(0).toUpperCase();
  const { signOut } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: 'Títulos de Crédito',
      isCategory: true,
    },
    {
      name: 'Meus Créditos',
      href: '/dashboard/tc',
      icon: <FileCheck className="h-5 w-5" />,
    },
    {
      name: 'Emitir Crédito',
      href: '/dashboard/tc/novo',
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      name: 'Tokenização',
      href: '/dashboard/tokenizacao/wizard',
      icon: <Database className="h-5 w-5" />,
    },
    {
      name: 'Marketplace',
      isCategory: true,
    },
    {
      name: 'Explorar Ofertas',
      href: '/dashboard/marketplace',
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      name: 'Meus Anúncios',
      href: '/dashboard/marketplace/anuncios',
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      name: 'Gestão Fiscal',
      isCategory: true,
    },
    {
      name: 'Obrigações',
      href: '/dashboard/debitos',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: 'Compensações',
      href: '/dashboard/recuperacao/compensacao-bilateral',
      icon: <Calculator className="h-5 w-5" />,
    },
    {
      name: 'Simulador Fiscal',
      href: '/dashboard/simulador',
      icon: <BarChartHorizontal className="h-5 w-5" />,
    },
    {
      name: 'Análises',
      isCategory: true,
    },
    {
      name: 'Relatórios',
      href: '/dashboard/relatorios',
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      name: 'Configurações',
      href: '/dashboard/configuracoes',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  // Componente para links do menu
  const NavLink = ({ item }: { item: (typeof menuItems)[0] }) => {
    if (item.isCategory) {
      return (
        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-1">
          {item.name}
        </div>
      );
    }

    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

    return (
      <Link
        href={item.href}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }`}
      >
        {item.icon}
        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Sidebar para desktop */}
      <div className="hidden lg:flex flex-col w-64 border-r bg-card p-4">
        <div className="mb-6">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              Tribut.AI
            </span>
          </Link>
        </div>
        <div className="flex-1 space-y-1">
          {menuItems.map((item, index) => (
            <NavLink key={item.href || `category-${index}`} item={item} />
          ))}
        </div>
        <div className="pt-4 mt-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                {userInitial}
              </div>
              <div className="text-sm font-medium">{userName}</div>
            </div>
          </div>
          <Link
            href="/dashboard/perfil"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all mb-2"
          >
            <User className="h-4 w-4" />
            <span>Perfil da Empresa</span>
          </Link>
          <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            © {new Date().getFullYear()} Tribut.AI
          </p>
        </div>
      </div>

      {/* Menu para mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-background border-b p-2 flex items-center">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <Link href="/dashboard" className="flex items-center">
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
                    Tribut.AI
                  </span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-1">
              {menuItems.map((item, index) => (
                <NavLink key={item.href || `category-${index}`} item={item} />
              ))}
            </div>
            <div className="p-4 pt-4 mt-4 border-t">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  {userInitial}
                </div>
                <div className="text-sm font-medium">{userName}</div>
              </div>
              <Link
                href="/dashboard/perfil"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all mb-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                <span>Perfil da Empresa</span>
              </Link>
              <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <div className="ml-2 flex-1 text-center">
          <Link href="/dashboard" className="inline-flex">
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              Tribut.AI
            </span>
          </Link>
        </div>
      </div>

      {/* Espaçador para mobile para empurrar o conteúdo para baixo da barra fixa */}
      <div className="h-12 w-full lg:hidden"></div>
    </>
  );
}
