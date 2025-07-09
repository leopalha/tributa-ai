import React from 'react';
import Link from '@/components/ui/custom-link';
import { usePathname } from '@/lib/router-utils';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/useUser';
import {
  Menu,
  X,
  Bell,
  Search,
  Sun,
  Moon,
  User,
  LayoutDashboard,
  Building2,
  FileText,
  CreditCard,
  Store,
  CalendarDays,
  Settings,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// TODO: Replace with custom theme
// import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Itens de navegação para menu mobile
const mainNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Empresas',
    href: '/dashboard/empresas',
    icon: Building2,
  },
  {
    title: 'Títulos de Crédito',
    href: '/dashboard/tokenizacao',
    icon: CreditCard,
  },
  {
    title: 'Marketplace',
    href: '/dashboard/marketplace',
    icon: Store,
  },
  {
    title: 'Obrigações',
    href: '/dashboard/obrigacoes',
    icon: CalendarDays,
  },
  {
    title: 'Declarações',
    href: '/dashboard/declaracoes',
    icon: FileText,
  },
  {
    title: 'Usuários',
    href: '/dashboard/usuarios',
    icon: Users,
  },
  {
    title: 'Configurações',
    href: '/dashboard/configuracoes',
    icon: Settings,
  },
];

export function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Determinar o título baseado no caminho atual
  const getPageTitle = () => {
    const path = pathname.split('/').filter(Boolean);

    if (path.length === 0) return 'Início';
    if (path[0] === 'dashboard' && path.length === 1) return 'Dashboard';

    // Converter primeira letra para maiúscula e substituir hífens por espaços
    if (path.length > 1) {
      const pageName = path[1].charAt(0).toUpperCase() + path[1].slice(1).replace(/-/g, ' ');
      return pageName;
    }

    const pageName = path[0].charAt(0).toUpperCase() + path[0].slice(1).replace(/-/g, ' ');
    return pageName;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          <div className="hidden md:flex md:items-center md:gap-2">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {getPageTitle()}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                className="h-9 w-[200px] rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-9 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Claro</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Escuro</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <span>Sistema</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.image} alt={user?.name || 'Usuário'} />
                    <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || 'Usuário'}</p>
                    <p className="text-xs leading-none text-gray-500">
                      {user?.email || 'usuario@exemplo.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/perfil">Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/configuracoes">Configurações</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white dark:bg-gray-900 pt-16">
          <nav className="mt-2 px-6 py-4">
            <ul className="space-y-4">
              {mainNavItems.map(item => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 text-base font-medium text-gray-900 dark:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
