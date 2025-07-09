import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Brain,
  Search,
  ArrowRightLeft,
  ClipboardList,
  BarChart3,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

const RecuperacaoPage = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <RefreshCw className="w-8 h-8 mr-3 text-blue-600" />
            Sistema de Recuperação
          </h1>
          <p className="text-gray-600 mt-1">
            Recupere créditos tributários de forma automatizada e inteligente
          </p>
        </div>
      </div>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Créditos Identificados</p>
              <p className="text-2xl font-bold text-blue-600">R$ 2.8M</p>
            </div>
            <Search className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">↗ +15% este mês</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Compensações Realizadas</p>
              <p className="text-2xl font-bold text-green-600">R$ 1.2M</p>
            </div>
            <ArrowRightLeft className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">47 operações</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processos Ativos</p>
              <p className="text-2xl font-bold text-orange-600">23</p>
            </div>
            <ClipboardList className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Em andamento</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taxa de Sucesso</p>
              <p className="text-2xl font-bold text-green-600">94.7%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Recuperações bem-sucedidas</p>
        </div>
      </div>

      {/* Fluxo de Recuperação */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Fluxo de Recuperação</h2>
          <p className="text-gray-600 mt-1">
            Siga o processo completo de recuperação de créditos tributários
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Passo 1 - Análise de Obrigações */}
            <Link
              to="/dashboard/recuperacao/analise"
              className="group p-6 border border-gray-200 rounded-lg hover:border-violet-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  1
                </div>
                <Brain className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Análise de Obrigações</h3>
              <p className="text-sm text-gray-600 mb-4">
                IA analisa documentos e identifica créditos e obrigações
              </p>
              <div className="flex items-center text-violet-600 text-sm font-medium">
                Analisar
                <ArrowRightLeft className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Passo 2 - Créditos Identificados */}
            <Link
              to="/dashboard/recuperacao/resultados-analise"
              className="group p-6 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  2
                </div>
                <Search className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Créditos Identificados</h3>
              <p className="text-sm text-gray-600 mb-4">
                Visualize oportunidades de recuperação encontradas
              </p>
              <div className="flex items-center text-green-600 text-sm font-medium">
                Ver Créditos
                <ArrowRightLeft className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Passo 3 - Compensação Bilateral */}
            <Link
              to="/dashboard/recuperacao/compensacao-bilateral"
              className="group p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  3
                </div>
                <ArrowRightLeft className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Compensação Bilateral</h3>
              <p className="text-sm text-gray-600 mb-4">
                Execute compensações diretas entre créditos e débitos
              </p>
              <div className="flex items-center text-blue-600 text-sm font-medium">
                Compensar
                <ArrowRightLeft className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Passo 4 - Compensação Multilateral */}
            <Link
              to="/dashboard/recuperacao/compensacao-multilateral"
              className="group p-6 border border-gray-200 rounded-lg hover:border-red-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  4
                </div>
                <ArrowRightLeft className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Compensação Multilateral</h3>
              <p className="text-sm text-gray-600 mb-4">
                Participe de compensações entre múltiplas partes
              </p>
              <div className="flex items-center text-red-600 text-sm font-medium">
                Participar
                <ArrowRightLeft className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Passo 5 - Processos de Recuperação */}
            <Link
              to="/dashboard/recuperacao/processos"
              className="group p-6 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  5
                </div>
                <ClipboardList className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Processos de Recuperação</h3>
              <p className="text-sm text-gray-600 mb-4">Acompanhe o andamento dos processos</p>
              <div className="flex items-center text-orange-600 text-sm font-medium">
                Acompanhar
                <ArrowRightLeft className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Processos em Andamento */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Processos em Andamento</h3>
          </div>
          <div className="p-4 space-y-3">
            {[
              {
                id: 'PROC-001',
                tipo: 'ICMS',
                valor: 'R$ 45.000',
                status: 'Em análise',
                prazo: '5 dias',
              },
              {
                id: 'PROC-002',
                tipo: 'PIS/COFINS',
                valor: 'R$ 67.500',
                status: 'Documentação',
                prazo: '3 dias',
              },
              {
                id: 'PROC-003',
                tipo: 'IRPJ',
                valor: 'R$ 23.800',
                status: 'Aprovado',
                prazo: 'Concluído',
              },
            ].map(processo => (
              <div
                key={processo.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{processo.id}</p>
                  <p className="text-sm text-gray-600">
                    {processo.tipo} • {processo.valor}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      processo.status === 'Aprovado'
                        ? 'bg-green-100 text-green-800'
                        : processo.status === 'Em análise'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {processo.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{processo.prazo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Últimas Compensações */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Últimas Compensações</h3>
          </div>
          <div className="p-4 space-y-3">
            {[
              { tipo: 'Bilateral', valor: 'R$ 125.000', data: 'Hoje', status: 'Concluída' },
              { tipo: 'Multilateral', valor: 'R$ 89.500', data: 'Ontem', status: 'Processando' },
              { tipo: 'Bilateral', valor: 'R$ 56.800', data: '2 dias atrás', status: 'Concluída' },
            ].map((comp, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <ArrowRightLeft className="w-4 h-4 text-blue-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{comp.tipo}</p>
                    <p className="text-sm text-gray-600">{comp.data}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">{comp.valor}</p>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      comp.status === 'Concluída'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {comp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecuperacaoPage;
