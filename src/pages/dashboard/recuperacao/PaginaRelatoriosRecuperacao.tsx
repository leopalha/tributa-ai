import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  Target,
  Clock,
  CheckCircle,
} from 'lucide-react';

const RelatoriosRecuperacaoPage = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('12');

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-purple-600" />
            Relatórios de Recuperação
          </h1>
          <p className="text-gray-600 mt-1">Analytics e performance da recuperação de créditos</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={periodoSelecionado}
            onChange={e => setPeriodoSelecionado(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="6">Últimos 6 meses</option>
            <option value="12">Últimos 12 meses</option>
            <option value="24">Últimos 24 meses</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Download className="w-5 h-5 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Recuperado</p>
              <p className="text-2xl font-bold text-green-600">R$ 3.2M</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">↗ +23% vs período anterior</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taxa de Sucesso</p>
              <p className="text-2xl font-bold text-blue-600">94.7%</p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">↗ +2.3% vs período anterior</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tempo Médio</p>
              <p className="text-2xl font-bold text-orange-600">4.2 meses</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">↓ -0.8 meses vs anterior</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processos Ativos</p>
              <p className="text-2xl font-bold text-purple-600">47</p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">12 finalizados este mês</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recuperação por Mês */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recuperação por Mês</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[
              { mes: 'Jan', valor: 180000 },
              { mes: 'Fev', valor: 220000 },
              { mes: 'Mar', valor: 310000 },
              { mes: 'Abr', valor: 280000 },
              { mes: 'Mai', valor: 350000 },
              { mes: 'Jun', valor: 420000 },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-12 bg-purple-500 rounded-t"
                  style={{ height: `${(item.valor / 420000) * 200}px` }}
                ></div>
                <p className="text-xs text-gray-600 mt-2">{item.mes}</p>
                <p className="text-xs font-medium text-gray-900">
                  R$ {(item.valor / 1000).toFixed(0)}K
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tipos de Crédito */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipos de Crédito Recuperados</h3>
          <div className="space-y-4">
            {[
              { tipo: 'ICMS', valor: 1200000, percentual: 37.5, cor: 'bg-blue-500' },
              { tipo: 'PIS/COFINS', valor: 980000, percentual: 30.6, cor: 'bg-green-500' },
              { tipo: 'IRPJ', valor: 680000, percentual: 21.3, cor: 'bg-yellow-500' },
              { tipo: 'CSLL', valor: 340000, percentual: 10.6, cor: 'bg-red-500' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded ${item.cor} mr-3`}></div>
                  <span className="text-sm font-medium text-gray-900">{item.tipo}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    R$ {(item.valor / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-gray-500">{item.percentual}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela de Performance */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Performance por Empresa</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Processos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Recuperado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxa de Sucesso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tempo Médio
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                {
                  empresa: 'TechCorp LTDA',
                  processos: 23,
                  valor: 1580000,
                  taxa: 96.8,
                  tempo: '3.8 meses',
                },
                {
                  empresa: 'Inovação S.A.',
                  processos: 18,
                  valor: 1240000,
                  taxa: 94.4,
                  tempo: '4.2 meses',
                },
                {
                  empresa: 'Serviços Digitais ME',
                  processos: 12,
                  valor: 380000,
                  taxa: 91.7,
                  tempo: '4.8 meses',
                },
              ].map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.empresa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.processos}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {(item.valor / 1000).toFixed(0)}K
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      {item.taxa}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.tempo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RelatoriosRecuperacaoPage;
