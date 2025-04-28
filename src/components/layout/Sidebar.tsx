'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  FileText,
  CreditCard,
  Store,
  CalendarDays,
  Users,
  Settings,
  LogOut,
  History,
  BarChartIcon,
  Blocks,
  Activity,
} from 'lucide-react';
import { useSession } from 'next-auth/react';

const mainNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Visão geral da sua empresa e métricas principais',
  },
  {
    title: 'Empresas',
    href: '/dashboard/empresas',
    icon: Building2,
    description: 'Gerenciamento completo das suas empresas',
  },
  {
    title: 'Títulos de Crédito',
    href: '/dashboard/titulos',
    icon: CreditCard,
    description: 'Controle de títulos e pagamentos',
  },
  {
    title: 'Marketplace',
    href: '/dashboard/marketplace',
    icon: Store,
    description: 'Descubra novas soluções e integrações',
  },
  {
    title: 'Blockchain',
    href: '/dashboard/blockchain',
    icon: Blocks,
    description: 'Visualize tokens e transações na blockchain',
    items: [
      {
        title: 'Visão Geral',
        href: '/dashboard/blockchain',
        icon: Blocks,
        description: 'Visão geral da blockchain',
      },
      {
        title: 'Status da Rede',
        href: '/dashboard/blockchain/network',
        icon: Activity,
        description: 'Monitoramento da rede blockchain',
      },
    ],
  },
  {
    title: 'Obrigações',
    href: '/dashboard/obrigacoes',
    icon: CalendarDays,
    description: 'Acompanhamento de obrigações fiscais',
  },
  {
    title: 'Declarações',
    href: '/dashboard/declaracoes',
    icon: FileText,
    description: 'Gestão e envio de declarações fiscais',
  },
  {
    title: 'Relatórios',
    href: '/dashboard/relatorios',
    icon: BarChartIcon,
    description: 'Relatórios e análises de dados',
  },
];

const secondaryNavItems = [
  {
    title: 'Usuários',
    href: '/dashboard/usuarios',
    icon: Users,
    description: 'Configurações de acesso e permissões',
  },
  {
    title: 'Configurações',
    href: '/dashboard/configuracoes',
    icon: Settings,
    description: 'Personalize sua experiência na plataforma',
  },
];

// Itens de menu apenas para administradores
const adminNavItems = [
  {
    title: 'Logs de Auditoria',
    href: '/dashboard/auditoria',
    icon: History,
    description: 'Registro de atividades e eventos do sistema',
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = React.useState('');
  const { data: session } = useSession();

  // Verifica se o usuário é administrador
  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <div className="hidden md:flex fixed h-full w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 pt-8 z-40">
      <div className="flex flex-col w-full px-4">
        <div className="flex items-center h-16 px-4 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-2xl">
            T
          </div>
          <span className="ml-3 text-xl font-semibold">Tributa.AI</span>
        </div>

        <div className="space-y-1 px-2">
          <h3 className="px-4 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Principais
          </h3>
          {mainNavItems.map(item => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-900'
                )}
                onMouseEnter={() => setActiveItem(item.href)}
                onMouseLeave={() => setActiveItem('')}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5',
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                  )}
                />
                <div className="flex flex-col">
                  <span
                    className={cn(
                      isActive
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-gray-800 dark:text-white'
                    )}
                  >
                    {item.title}
                  </span>
                  {activeItem === item.href && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 max-w-[180px] line-clamp-1 animate-fadeIn">
                      {item.description}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 space-y-1 px-2">
          <h3 className="px-4 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Configurações
          </h3>
          {secondaryNavItems.map(item => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-900'
                )}
                onMouseEnter={() => setActiveItem(item.href)}
                onMouseLeave={() => setActiveItem('')}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5',
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                  )}
                />
                <div className="flex flex-col">
                  <span
                    className={cn(
                      isActive
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-gray-800 dark:text-white'
                    )}
                  >
                    {item.title}
                  </span>
                  {activeItem === item.href && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 max-w-[180px] line-clamp-1 animate-fadeIn">
                      {item.description}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

          {/* Seção de administração - visível apenas para admins */}
          {isAdmin && (
            <>
              <h3 className="px-4 text-sm font-medium text-gray-500 dark:text-gray-400 mt-6 mb-2">
                Administração
              </h3>
              {adminNavItems.map(item => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group',
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-900'
                    )}
                    onMouseEnter={() => setActiveItem(item.href)}
                    onMouseLeave={() => setActiveItem('')}
                  >
                    <item.icon
                      className={cn(
                        'h-5 w-5',
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                      )}
                    />
                    <div className="flex flex-col">
                      <span
                        className={cn(
                          isActive
                            ? 'text-blue-700 dark:text-blue-300'
                            : 'text-gray-800 dark:text-white'
                        )}
                      >
                        {item.title}
                      </span>
                      {activeItem === item.href && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 max-w-[180px] line-clamp-1 animate-fadeIn">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </>
          )}
        </div>

        <div className="mt-auto mb-8 px-6">
          <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium">
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
