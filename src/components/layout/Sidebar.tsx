import React from 'react';
import Link from '@/components/ui/custom-link';
import { usePathname } from '@/lib/router-utils';
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
  BarChart3,
  Blocks,
  Activity,
  MessageSquare,
  Coins,
  ShoppingCart,
  Shield,
  DollarSign,
  RefreshCw,
  Search,
  Brain,
  TrendingUp,
  ClipboardList,
  ArrowRightLeft,
  Zap,
  Database,
  Bot,
  Heart,
  Home,
  Plus,
  AlertTriangle,
  Calendar,
  Bell,
  Gavel,
} from 'lucide-react';
// TODO: Replace with custom auth
// import { useSession } from 'next-auth/react';

const mainNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Visão geral da sua atividade e métricas principais',
  },
  {
    title: 'Recuperação',
    href: '/dashboard/recuperacao',
    icon: RefreshCw,
    description: 'Sistema principal de recuperação de créditos tributários',
    highlight: true,
    items: [
      {
        title: 'Análise de Obrigações',
        href: '/dashboard/recuperacao/analise',
        icon: Brain,
        description: 'IA analisa CPF/CNPJ e identifica créditos e obrigações',
      },
      {
        title: 'Resultados das Análises',
        href: '/dashboard/recuperacao/resultados',
        icon: Search,
        description: 'Resultados da análise com créditos e débitos identificados',
      },
      {
        title: 'Compensação Bilateral',
        href: '/dashboard/recuperacao/compensacao-bilateral',
        icon: ArrowRightLeft,
        description: 'Compensação direta entre créditos e débitos',
      },
      {
        title: 'Compensação Multilateral',
        href: '/dashboard/recuperacao/compensacao-multilateral',
        icon: ArrowRightLeft,
        description: 'Sistema de compensação entre múltiplas partes',
      },
      {
        title: 'Processos de Recuperação',
        href: '/dashboard/recuperacao/processos',
        icon: ClipboardList,
        description: 'Acompanhe protocolos e andamentos',
      },
      {
        title: 'Relatórios',
        href: '/dashboard/recuperacao/relatorios',
        icon: BarChartIcon,
        description: 'Analytics e performance da recuperação',
      },
    ],
  },
  {
    title: 'Marketplace',
    href: '/dashboard/marketplace',
    icon: Store,
    description: 'Marketplace universal para negociação de títulos',
    items: [
      {
        title: 'Explorar Créditos',
        href: '/dashboard/marketplace',
        icon: Search,
        description: 'Explore todos os tipos de títulos disponíveis',
      },
      {
        title: 'Minhas Negociações',
        href: '/dashboard/marketplace/negociacoes',
        icon: MessageSquare,
        description: 'Leilões e ofertas ativas',
      },
      {
        title: 'Minhas Compras',
        href: '/dashboard/marketplace/compras',
        icon: ShoppingCart,
        description: 'Compras realizadas',
      },
      {
        title: 'Minhas Vendas',
        href: '/dashboard/marketplace/vendas',
        icon: TrendingUp,
        description: 'Vendas concluídas',
      },
      {
        title: 'Meus Anúncios',
        href: '/dashboard/marketplace/anuncios',
        icon: Store,
        description: 'Títulos anunciados',
      },
      {
        title: 'Lista de Desejos',
        href: '/dashboard/marketplace/desejos',
        icon: Heart,
        description: 'Títulos favoritos',
      },
      {
        title: 'Mensagens',
        href: '/dashboard/marketplace/mensagens',
        icon: MessageSquare,
        description: 'Conversas privadas',
      },
      {
        title: 'Analytics',
        href: '/dashboard/marketplace/analytics',
        icon: BarChart3,
        description: 'Relatórios e métricas',
      },
      {
        title: 'Configurações',
        href: '/dashboard/marketplace/configuracoes',
        icon: Settings,
        description: 'Preferências do marketplace',
      },
    ],
  },
  {
    title: 'Tokenização',
    href: '/dashboard/tokenizacao',
    icon: Coins,
    description: 'Transforme seus créditos em tokens blockchain',
    items: [
      {
        title: 'Visão Geral',
        href: '/dashboard/tokenizacao',
        icon: Coins,
        description: 'Visão geral da tokenização',
      },
      {
        title: 'Criar Novo Token',
        href: '/dashboard/tokenizacao/criar',
        icon: Plus,
        description: 'Tokenize um novo título de crédito',
      },
      {
        title: 'Meus Tokens',
        href: '/dashboard/tokenizacao/meus-tokens',
        icon: Coins,
        description: 'Gerencie seus títulos tokenizados',
      },
    ],
  },
  {
    title: 'Carteira',
    href: '/dashboard/wallet',
    icon: DollarSign,
    description: 'Gerencie seu saldo e pagamentos na plataforma',
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
        title: 'Explorador',
        href: '/dashboard/blockchain/explorer',
        icon: Search,
        description: 'Explorador de blocos e transações',
      },
      {
        title: 'Status da Rede',
        href: '/dashboard/blockchain/status',
        icon: Activity,
        description: 'Monitoramento da rede blockchain',
      },
    ],
  },
  {
    title: 'Gestão de Riscos',
    href: '/dashboard/risk',
    icon: Shield,
    description: 'Sistema avançado de monitoramento e controle de riscos',
  },
];

const tradingNavItems = [
  {
    title: 'Trading Profissional',
    href: '/dashboard/trading-pro',
    icon: BarChart3,
    description: 'Plataforma estilo IQ Option com bots inteligentes',
    highlight: true,
  },
  {
    title: 'Análise de Mercado',
    href: '/dashboard/trading/analysis',
    icon: TrendingUp,
    description: 'Análise técnica e fundamental em tempo real',
  },
];

const secondaryNavItems = [
  {
    title: 'Notificações',
    href: '/dashboard/notifications',
    icon: Bell,
    description: 'Central de notificações e atividades em tempo real',
  },
  {
    title: 'KYC',
    href: '/dashboard/kyc',
    icon: Shield,
    description: 'Verificação de identidade e compliance',
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
    title: 'Dashboard Admin',
    href: '/dashboard/admin',
    icon: Settings,
    description: 'Painel administrativo principal',
  },
  {
    title: 'Consulta CNPJ/CPF',
    href: '/dashboard/fonte-dados',
    icon: Database,
    description: 'Consulte débitos e créditos fiscais em tempo real',
    highlight: false,
  },
  {
    title: 'Sistema de Saúde',
    href: '/dashboard/admin/system-health',
    icon: Heart,
    description: 'Monitoramento completo da plataforma',
  },
  {
    title: 'Painel de Controle - Bots',
    href: '/dashboard/admin/bots',
    icon: Bot,
    description: 'Controle e monitoramento dos bots',
  },
  {
    title: 'Status da Rede',
    href: '/dashboard/admin/network-status',
    icon: Activity,
    description: 'Status da rede blockchain',
  },
  {
    title: 'Leilões',
    href: '/dashboard/admin/auctions',
    icon: Gavel,
    description: 'Gerenciamento de leilões',
  },
  {
    title: 'Notificações',
    href: '/dashboard/admin/notifications',
    icon: Bell,
    description: 'Central de notificações do sistema',
  },
  {
    title: 'Usuários',
    href: '/dashboard/admin/users',
    icon: Users,
    description: 'Gerenciamento de usuários',
  },
  {
    title: 'Logs de Auditoria',
    href: '/dashboard/admin/audit-logs',
    icon: FileText,
    description: 'Logs de auditoria e segurança',
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = React.useState('');
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);
  // TODO: Implement session management
  const session = null;

  // Verifica se o usuário é administrador
  // Temporariamente definindo como true para acesso ao painel
  const isAdmin = true; // session?.user?.role === 'ADMIN';

  // Auto-expandir item ativo - FIXO: usar callback para evitar loop
  React.useEffect(() => {
    const shouldExpand: string[] = [];

    mainNavItems.forEach(item => {
      if (item.items && pathname.startsWith(item.href)) {
        shouldExpand.push(item.href);
      }
    });

    if (shouldExpand.length > 0) {
      setExpandedItems(prev => {
        const newExpanded = [...prev];
        let hasChanges = false;

        shouldExpand.forEach(href => {
          if (!newExpanded.includes(href)) {
            newExpanded.push(href);
            hasChanges = true;
          }
        });

        return hasChanges ? newExpanded : prev;
      });
    }
  }, [pathname]);

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href) ? prev.filter(item => item !== href) : [...prev, href]
    );
  };

  const renderNavItem = (item: any, level = 0) => {
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
    const isExpanded = expandedItems.includes(item.href);
    const hasItems = item.items && item.items.length > 0;

    return (
      <div key={item.href}>
        <div
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group cursor-pointer',
            level > 0 && 'ml-4 py-2',
            // Padronização: fundo azul uniforme para todos os itens selecionados ou com subitens
            isActive || hasItems
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
              : 'hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-800 dark:text-white',
            item.highlight && 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
          )}
          onMouseEnter={() => setActiveItem(item.href)}
          onMouseLeave={() => setActiveItem('')}
          onClick={() => {
            if (hasItems) {
              toggleExpanded(item.href);
            }
          }}
        >
          <Link href={item.href} className="flex items-center gap-3 flex-1">
            <item.icon
              className={cn(
                'h-5 w-5',
                level > 0 && 'h-4 w-4',
                // Padronização: ícone azul para itens ativos/com subitens, cinza para outros
                isActive || hasItems
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400',
                item.highlight && 'text-blue-600 dark:text-blue-400'
              )}
            />
            <div className="flex flex-col flex-1">
              <span
                className={cn(
                  // Padronização: texto azul para itens ativos/com subitens, cinza para outros
                  isActive || hasItems
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-gray-800 dark:text-white',
                  item.highlight && 'text-blue-700 dark:text-blue-300'
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
          {hasItems && (
            <Zap
              className={cn(
                'h-4 w-4 transition-transform',
                isExpanded ? 'rotate-90' : '',
                'text-blue-600 dark:text-blue-400'
              )}
            />
          )}
        </div>

        {hasItems && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.items.map((subItem: any) => renderNavItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="hidden md:flex fixed h-full w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 pt-8 z-40">
      <div className="flex flex-col w-full px-4 overflow-y-auto">
        <div className="flex items-center h-16 px-4 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-2xl">
            T
          </div>
          <span className="ml-3 text-xl font-semibold">Tributa.AI</span>
        </div>

        <div className="space-y-1 px-2">
          <h3 className="px-4 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Sistema Principal
          </h3>
          {mainNavItems.map(item => renderNavItem(item))}
        </div>

        <div className="mt-6 space-y-1 px-2">
          <h3 className="px-4 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Trading
          </h3>
          {tradingNavItems.map(item => renderNavItem(item))}
        </div>

        <div className="mt-6 space-y-1 px-2">
          <h3 className="px-4 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Configurações
          </h3>
          {secondaryNavItems.map(item => renderNavItem(item))}
        </div>

        {/* Seção de administração - SEMPRE VISÍVEL PARA DEBUG */}
        <div className="mt-6 space-y-1 px-2">
          <h3 className="px-4 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Administração
          </h3>
          {adminNavItems.map(item => renderNavItem(item))}
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
