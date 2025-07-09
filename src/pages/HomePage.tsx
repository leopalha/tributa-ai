import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  TrendingUp,
  Users,
  Banknote,
  FileText,
  Building,
  Wallet,
  BarChart3,
  Coins,
  Scale,
  Brain,
  CheckCircle,
} from 'lucide-react';

const heroStats = [
  { value: 'R$ 2.5B+', label: 'Volume Tokenizado', icon: Banknote },
  { value: '15.000+', label: 'TCs Negociados', icon: FileText },
  { value: '99.9%', label: 'Uptime', icon: Shield },
  { value: '500+', label: 'Empresas Ativas', icon: Building },
];

const features = [
  {
    title: 'Blockchain Hyperledger',
    description: 'Segurança enterprise com smart contracts auditáveis',
    icon: Shield,
  },
  {
    title: 'IA para Precificação',
    description: 'Algoritmos avançados para determinação de valor justo',
    icon: Zap,
  },
  {
    title: 'Liquidação T+0',
    description: 'Transferência instantânea via blockchain',
    icon: TrendingUp,
  },
  {
    title: 'Suporte 24/7',
    description: 'Equipe especializada em tributário e blockchain',
    icon: Users,
  },
];

const modules = [
  {
    title: 'Carteira Digital',
    description: 'Gerencie saldo, transações, depósitos e tokenize seus ativos com segurança blockchain',
    icon: Wallet,
    link: '/dashboard',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    title: 'Marketplace',
    description: 'Compre e venda créditos tributários com total segurança e liquidez garantida',
    icon: Globe,
    link: '/dashboard/marketplace/explorar',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Recuperação de Créditos',
    description: 'Identifique e recupere créditos tributários com análise avançada de documentos fiscais',
    icon: Coins,
    link: '/dashboard/recuperacao/analise-obrigacoes',
    color: 'from-amber-500 to-orange-600',
  },
  {
    title: 'Sistema de Compensação',
    description: 'Utilize compensação bilateral ou multilateral com IA para matching automático',
    icon: Scale,
    link: '/dashboard/recuperacao/compensacao-multilateral',
    color: 'from-purple-500 to-fuchsia-600',
  },
  {
    title: 'Análise Avançada',
    description: 'Visualize métricas e indicadores com dashboards interativos e personalizáveis',
    icon: BarChart3,
    link: '/dashboard',
    color: 'from-rose-500 to-pink-600',
  },
  {
    title: 'ARIA Assistente IA',
    description: 'Assistente virtual especializado em tributário para responder suas dúvidas',
    icon: Brain,
    link: '/dashboard',
    color: 'from-cyan-500 to-blue-600',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Tributa.AI
                </h1>
                <p className="text-xs text-gray-500">Marketplace Universal</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/sobre" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Sobre
              </Link>
              <Link to="/funcionalidades" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Funcionalidades
              </Link>
              <Link to="/precos" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Preços
              </Link>
              <Link to="/contato" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Contato
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Entrar
              </Link>
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Acessar Plataforma
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              O Marketplace Universal de{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Títulos de Crédito
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Revolutionamos o mercado brasileiro criando o primeiro marketplace universal para
              negociação de TODOS os tipos de créditos através da tokenização blockchain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center"
              >
                Explorar Marketplace
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/dashboard"
                className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Ver Demonstração
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {heroStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Módulos Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Módulos Completos e Integrados
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nossa plataforma oferece uma solução completa para gestão tributária e financeira
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <Link
                key={index}
                to={module.link}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                <div className="p-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${module.color} rounded-lg flex items-center justify-center mb-4`}>
                    {React.createElement(module.icon, { className: "h-6 w-6 text-white" })}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
                  <p className="text-gray-600 text-sm">{module.description}</p>
                  <div className="mt-4 flex items-center text-blue-600 font-medium text-sm">
                    Saiba mais
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tecnologia de Ponta
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Utilizamos as melhores tecnologias para garantir segurança, transparência e eficiência
              em todas as transações
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefícios Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher a Tributa.AI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Benefícios que transformam a gestão tributária da sua empresa
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Economia Fiscal</h3>
                <p className="text-gray-600">
                  Reduza sua carga tributária com identificação automática de créditos e oportunidades de compensação.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Segurança Blockchain</h3>
                <p className="text-gray-600">
                  Todas as transações são registradas em blockchain, garantindo imutabilidade e rastreabilidade.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Liquidez Imediata</h3>
                <p className="text-gray-600">
                  Transforme créditos tributários em ativos líquidos através da tokenização e negociação no marketplace.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Inteligência Artificial</h3>
                <p className="text-gray-600">
                  Utilize nosso assistente ARIA para análises avançadas e recomendações personalizadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para revolucionar seus créditos?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de empresas que já tokenizaram mais de R$ 2.5 bilhões em créditos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold inline-flex items-center justify-center"
            >
              Criar Conta Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-400 transition-colors font-semibold inline-flex items-center justify-center"
            >
              Acessar Plataforma
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">T</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Tributa.AI</h3>
                  <p className="text-xs text-gray-400">Marketplace Universal</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Plataforma de tokenização de créditos tributários com blockchain
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Produto</h4>
              <ul className="space-y-2">
                <li><Link to="/funcionalidades" className="text-gray-400 hover:text-white">Funcionalidades</Link></li>
                <li><Link to="/precos" className="text-gray-400 hover:text-white">Preços</Link></li>
                <li><Link to="/casos-de-uso" className="text-gray-400 hover:text-white">Casos de Uso</Link></li>
                <li><Link to="/seguranca" className="text-gray-400 hover:text-white">Segurança</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li><Link to="/sobre" className="text-gray-400 hover:text-white">Sobre Nós</Link></li>
                <li><Link to="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link to="/carreiras" className="text-gray-400 hover:text-white">Carreiras</Link></li>
                <li><Link to="/contato" className="text-gray-400 hover:text-white">Contato</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/termos" className="text-gray-400 hover:text-white">Termos de Uso</Link></li>
                <li><Link to="/privacidade" className="text-gray-400 hover:text-white">Política de Privacidade</Link></li>
                <li><Link to="/cookies" className="text-gray-400 hover:text-white">Política de Cookies</Link></li>
                <li><Link to="/compliance" className="text-gray-400 hover:text-white">Compliance</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 Tributa.AI. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
