import React, { useState, useEffect } from 'react';
import { Database, Brain, TrendingUp, Building2, DollarSign } from 'lucide-react';
import { realDataService } from '@/services/real-data.service';

const RealDataPanel = () => {
  const [stats, setStats] = useState<any>(null);
  const [isCollecting, setIsCollecting] = useState(false);
  const [empresas, setEmpresas] = useState<any[]>([]);

  useEffect(() => {
    loadStats();
    loadEmpresas();
  }, []);

  const loadStats = () => {
    const statistics = realDataService.obterEstatisticas();
    setStats(statistics);
  };

  const loadEmpresas = () => {
    const stored = JSON.parse(localStorage.getItem('empresas_reais') || '[]');
    setEmpresas(stored);
  };

  const collectData = async () => {
    setIsCollecting(true);

    const sampleCNPJs = ['11222333000181', '11222333000262', '11222333000343'];

    for (const cnpj of sampleCNPJs) {
      const empresa = await realDataService.coletarDadosEmpresa(cnpj);
      await realDataService.treinarModelo(empresa);

      setEmpresas(prev => [empresa, ...prev]);
      localStorage.setItem('empresas_reais', JSON.stringify([empresa, ...empresas]));
    }

    loadStats();
    setIsCollecting(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg border">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-2">
          <Database className="w-6 h-6 mr-2 text-blue-600" />
          Banco de Dados Real
        </h2>
        <p className="text-gray-600">
          Sistema de coleta automática de dados reais de empresas brasileiras
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">{empresas.length}</span>
          </div>
          <p className="text-sm text-blue-700">Empresas Coletadas</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Brain className="w-5 h-5 text-green-600" />
            <span className="text-2xl font-bold text-green-600">
              {stats ? (stats.modeloPrecisao * 100).toFixed(0) : 0}%
            </span>
          </div>
          <p className="text-sm text-green-700">Precisão ML</p>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-orange-600" />
            <span className="text-2xl font-bold text-orange-600">
              R${' '}
              {Math.round(
                empresas.reduce((acc, emp) => acc + (emp.creditosDisponiveis || 0), 0) / 1000
              )}
              K
            </span>
          </div>
          <p className="text-sm text-orange-700">Créditos Totais</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="text-2xl font-bold text-purple-600">
              {isCollecting ? 'ATIVO' : 'PRONTO'}
            </span>
          </div>
          <p className="text-sm text-purple-700">Status Sistema</p>
        </div>
      </div>

      {/* Botão de Coleta */}
      <div className="mb-6">
        <button
          onClick={collectData}
          disabled={isCollecting}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            isCollecting
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isCollecting ? '🔄 Coletando Dados...' : '🚀 Iniciar Coleta de Dados'}
        </button>
      </div>

      {/* Lista de Empresas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Empresas no Banco de Dados</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {empresas.length > 0 ? (
            empresas.map((empresa, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{empresa.razaoSocial}</p>
                  <p className="text-sm text-gray-600">CNPJ: {empresa.cnpj}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">
                    R$ {empresa.creditosDisponiveis?.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(empresa.dataColeta).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Database className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Nenhuma empresa coletada ainda.</p>
              <p className="text-sm">Clique no botão acima para começar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealDataPanel;
