import { type LucideIcon } from 'lucide-react';
import { LayoutDashboard, User, Settings } from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
};

export const siteConfig = {
  name: 'Tributa.AI - Plataforma de Gestão Tributária',
  description:
    'Sistema completo para gestão tributária com foco em recuperação de créditos e automação fiscal.',
  url: 'https://tributa.ai',
  ogImage: 'https://tributa.ai/og.jpg',
  links: {
    twitter: 'https://twitter.com/tributaai',
    github: 'https://github.com/tributa-ai',
  },
  defaultTitle: 'Tributa.AI - Plataforma de Gestão Tributária',
  defaultMetaDescription:
    'Sistema completo para gestão tributária com foco em recuperação de créditos e automação fiscal.',
  mainNav: [
    {
      title: 'Dashboard',
      href: '/',
    },
    {
      title: 'TCs',
      href: '/tc',
    },
    {
      title: 'Marketplace',
      href: '/marketplace',
    },
    {
      title: 'Empresas',
      href: '/empresas',
    },
    {
      title: 'Declarações',
      href: '/declaracoes',
    },
    {
      title: 'Obrigações',
      href: '/obrigacoes',
    },
    {
      title: 'Usuários',
      href: '/usuarios',
    },
  ] as NavItem[],
  dashboardNav: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Perfil',
      href: '/dashboard/perfil',
      icon: User,
    },
    {
      title: 'Configurações',
      href: '/dashboard/configuracoes',
      icon: Settings,
    },
  ] as NavItem[],
  footerNav: [
    {
      title: 'Início',
      href: '/',
    },
    {
      title: 'Serviços',
      href: '/servicos',
    },
    {
      title: 'Preços',
      href: '/precos',
    },
    {
      title: 'Sobre',
      href: '/sobre',
    },
    {
      title: 'Contato',
      href: '/contato',
    },
    {
      title: 'Termos de Uso',
      href: '/termos',
    },
    {
      title: 'Política de Privacidade',
      href: '/privacidade',
    },
  ] as NavItem[],
  socialLinks: {
    twitter: 'https://twitter.com/tributaai',
    github: 'https://github.com/tributaai',
    linkedin: 'https://linkedin.com/company/tributaai',
  },
  features: [
    {
      title: 'Automação Tributária',
      description: 'Automatize seus processos fiscais e tributários',
      icon: 'Calculator',
    },
    {
      title: 'Gestão de Documentos',
      description: 'Gerencie seus documentos fiscais de forma centralizada',
      icon: 'FileText',
    },
    {
      title: 'Relatórios',
      description: 'Acesse relatórios detalhados sobre sua situação fiscal',
      icon: 'BarChart',
    },
    {
      title: 'Notificações',
      description: 'Receba alertas sobre prazos e obrigações fiscais',
      icon: 'Bell',
    },
  ],
  pricing: [
    {
      name: 'Básico',
      price: 'R$ 99',
      description: 'Para pequenas empresas',
      features: [
        'Automação básica',
        'Gestão de documentos',
        'Relatórios simples',
        'Suporte por email',
      ],
    },
    {
      name: 'Profissional',
      price: 'R$ 299',
      description: 'Para empresas em crescimento',
      features: [
        'Automação avançada',
        'Gestão de documentos',
        'Relatórios detalhados',
        'Suporte prioritário',
        'API de integração',
      ],
    },
    {
      name: 'Enterprise',
      price: 'R$ 999',
      description: 'Para grandes empresas',
      features: [
        'Automação completa',
        'Gestão de documentos',
        'Relatórios personalizados',
        'Suporte 24/7',
        'API de integração',
        'Consultoria especializada',
      ],
    },
  ],
};
