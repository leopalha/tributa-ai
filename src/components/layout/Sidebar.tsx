'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  FileText,
  CalendarDays,
  Settings,
  Bell,
  Users,
  HelpCircle,
  CreditCard,
  Store,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Empresas',
    href: '/empresas',
    icon: Building2,
  },
  {
    name: 'Declarações',
    href: '/declaracoes',
    icon: FileText,
  },
  {
    name: 'Obrigações',
    href: '/obrigacoes',
    icon: CalendarDays,
  },
  {
    name: 'Títulos de Crédito',
    href: '/tc',
    icon: CreditCard,
  },
  {
    name: 'Marketplace',
    href: '/marketplace',
    icon: Store,
  },
  {
    name: 'Usuários',
    href: '/usuarios',
    icon: Users,
  },
];

const secondaryNavigation = [
  {
    name: 'Notificações',
    href: '/notificacoes',
    icon: Bell,
  },
  {
    name: 'Configurações',
    href: '/configuracoes',
    icon: Settings,
  },
  {
    name: 'Ajuda',
    href: '/ajuda',
    icon: HelpCircle,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen flex-col justify-between border-r bg-card px-4 py-6">
      <div>
        <div className="flex h-16 items-center px-2">
          <h1 className="text-2xl font-bold text-primary">Tributa.ai</h1>
        </div>
        <nav className="space-y-6 pt-4">
          <div>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
                    isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div>
            <div className="px-3 py-2">
              <h2 className="mb-2 text-xs font-semibold text-muted-foreground">
                Suporte
              </h2>
              <div className="space-y-1">
                {secondaryNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
                        isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>
      </div>
      <div className="px-3 py-2">
        <div className="flex items-center gap-3 rounded-lg bg-accent/50 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <span className="text-sm font-medium text-primary-foreground">
              {/* TODO: Usar inicial do usuário logado */}
              U
            </span>
          </div>
          <div>
            <p className="text-sm font-medium">Usuário</p>
            <p className="text-xs text-muted-foreground">usuario@email.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}