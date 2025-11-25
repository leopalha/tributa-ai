import { Link } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  Users,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Building,
  ShoppingCart,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const stats_data = [
    {
      name: 'Volume Total',
      value: 'R$ 5.2M',
      change: '+12.3%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      name: 'TCs Ativos',
      value: '43',
      change: '+3',
      trend: 'up',
      icon: BarChart3,
    },
    {
      name: 'Transações',
      value: '127',
      change: '+8',
      trend: 'up',
      icon: TrendingUp,
    },
    {
      name: 'Preço Médio',
      value: 'R$ 122K',
      change: '-2.1%',
      trend: 'down',
      icon: Users,
    },
  ];

  return (
    <div className="px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">🎯 Bem-vindo ao Tributa.AI</h1>
        <p className="text-blue-100">
          Plataforma completa de recuperação de créditos tributários e marketplace de tokenização
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats_data.map(stat => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow p-6 flex items-center hover:shadow-lg transition-shadow"
          >
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <stat.icon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.name}</div>
              <div
                className={`text-xs mt-1 flex items-center ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
              >
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 mr-1" />
                )}
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grid de funcionalidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sistema RCT */}
        <Link
          to="/dashboard/recuperacao/compensacao-bilateral"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow block"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">Sistema RCT</h3>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            Recuperação automatizada de créditos tributários PIS/COFINS/ICMS
          </p>
          <div className="text-blue-600 text-sm font-medium">Acessar módulo →</div>
        </Link>

        {/* Blockchain */}
        <Link
          to="/dashboard/blockchain"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow block"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">Blockchain</h3>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            Hyperledger Fabric para tokenização e contratos inteligentes
          </p>
          <div className="text-blue-600 text-sm font-medium">Ver rede →</div>
        </Link>

        {/* Obrigações */}
        <Link
          to="/dashboard/obrigacoes"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow block"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-orange-100 rounded-lg mr-3">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold">Obrigações Fiscais</h3>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            Calendário e gestão de obrigações tributárias
          </p>
          <div className="text-blue-600 text-sm font-medium">Gerenciar →</div>
        </Link>

        {/* Relatórios */}
        <Link
          to="/dashboard/relatorios"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow block"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg mr-3">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold">Relatórios</h3>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            Analytics avançados e relatórios personalizados
          </p>
          <div className="text-blue-600 text-sm font-medium">Ver relatórios →</div>
        </Link>

        {/* Empresas */}
        <Link
          to="/dashboard/empresas"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow block"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <Building className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold">Empresas</h3>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            Gestão de empresas e filiais do grupo econômico
          </p>
          <div className="text-blue-600 text-sm font-medium">Gerenciar empresas →</div>
        </Link>

        {/* Marketplace */}
        <Link
          to="/dashboard/marketplace"
          className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg shadow p-6 hover:shadow-lg transition-shadow block text-white"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg mr-3">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold">Marketplace</h3>
          </div>
          <p className="text-purple-100 text-sm mb-3">
            Negociação de títulos de crédito tokenizados via blockchain
          </p>
          <div className="text-purple-100 text-sm font-medium">Acessar marketplace →</div>
        </Link>
      </div>

      {/* Status do sistema */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Status do Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="text-sm">Plataforma Online</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="text-sm">Blockchain Ativo</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
            <span className="text-sm">APIs Governo (Mock)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
