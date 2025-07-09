import React, { useState } from 'react';
import { Search, Filter, Calendar, DollarSign, Building, X, ChevronDown } from 'lucide-react';

export interface FilterConfig {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'dateRange' | 'number' | 'multiSelect';
  options?: { value: string; label: string }[];
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface FilterValue {
  [key: string]: any;
}

interface StandardFiltersProps {
  filters: FilterConfig[];
  values: FilterValue;
  onChange: (values: FilterValue) => void;
  onReset?: () => void;
  className?: string;
}

export const StandardFilters: React.FC<StandardFiltersProps> = ({
  filters,
  values,
  onChange,
  onReset,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (id: string, value: any) => {
    onChange({
      ...values,
      [id]: value
    });
  };

  const resetFilters = () => {
    const resetValues: FilterValue = {};
    filters.forEach(filter => {
      resetValues[filter.id] = filter.type === 'multiSelect' ? [] : '';
    });
    onChange(resetValues);
    onReset?.();
  };

  const hasActiveFilters = Object.values(values).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== ''
  );

  const renderFilter = (filter: FilterConfig) => {
    const value = values[filter.id] || (filter.type === 'multiSelect' ? [] : '');

    switch (filter.type) {
      case 'text':
        return (
          <div key={filter.id} className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">{filter.label}</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={filter.placeholder || `Buscar ${filter.label.toLowerCase()}...`}
                value={value}
                onChange={(e) => updateFilter(filter.id, e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        );

      case 'select':
        return (
          <div key={filter.id} className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">{filter.label}</label>
            <select
              value={value}
              onChange={(e) => updateFilter(filter.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos</option>
              {filter.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'date':
        return (
          <div key={filter.id} className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">{filter.label}</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={value}
                onChange={(e) => updateFilter(filter.id, e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        );

      case 'dateRange':
        return (
          <div key={filter.id} className="min-w-[300px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">{filter.label}</label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={value.start || ''}
                onChange={(e) => updateFilter(filter.id, { ...value, start: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="self-center text-gray-500">até</span>
              <input
                type="date"
                value={value.end || ''}
                onChange={(e) => updateFilter(filter.id, { ...value, end: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        );

      case 'number':
        return (
          <div key={filter.id} className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">{filter.label}</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                placeholder={filter.placeholder || "0"}
                value={value}
                min={filter.min}
                max={filter.max}
                onChange={(e) => updateFilter(filter.id, e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        );

      case 'multiSelect':
        return (
          <div key={filter.id} className="min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">{filter.label}</label>
            <div className="relative">
              <select
                multiple
                value={value}
                onChange={(e) => {
                  const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
                  updateFilter(filter.id, selectedValues);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                size={3}
              >
                {filter.options?.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
            {hasActiveFilters && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                {Object.values(values).filter(v => Array.isArray(v) ? v.length > 0 : v !== '').length} ativo(s)
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 mr-1" />
                Limpar
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronDown className={`w-4 h-4 mr-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              {isExpanded ? 'Recolher' : 'Expandir'}
            </button>
          </div>
        </div>

        <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96' : 'max-h-20'}`}>
          <div className="flex flex-wrap gap-4">
            {filters.map(renderFilter)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Configurações de filtros pré-definidas para diferentes contextos
export const COMPENSATION_FILTERS: FilterConfig[] = [
  {
    id: 'search',
    label: 'Busca Geral',
    type: 'text',
    placeholder: 'Protocolo, empresa, CNPJ...'
  },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'APROVADO', label: 'Aprovado' },
      { value: 'PROCESSANDO', label: 'Em Análise' },
      { value: 'ANALISE_ADICIONAL', label: 'Documentos Pendentes' },
      { value: 'REJEITADO', label: 'Rejeitado' },
      { value: 'PENDENTE', label: 'Pendente' }
    ]
  },
  {
    id: 'type',
    label: 'Tipo',
    type: 'select',
    options: [
      { value: 'BILATERAL', label: 'Compensação Bilateral' },
      { value: 'MULTILATERAL', label: 'Compensação Multilateral' }
    ]
  },
  {
    id: 'dateRange',
    label: 'Período',
    type: 'dateRange'
  },
  {
    id: 'valueMin',
    label: 'Valor Mínimo',
    type: 'number',
    placeholder: 'R$ 0,00'
  },
  {
    id: 'valueMax',
    label: 'Valor Máximo',
    type: 'number',
    placeholder: 'R$ 999.999,99'
  }
];

export const CREDIT_TITLES_FILTERS: FilterConfig[] = [
  {
    id: 'search',
    label: 'Busca Geral',
    type: 'text',
    placeholder: 'Título, empresa, descrição...'
  },
  {
    id: 'titleType',
    label: 'Tipo de Título',
    type: 'select',
    options: [
      { value: 'ICMS', label: 'ICMS' },
      { value: 'PIS', label: 'PIS' },
      { value: 'COFINS', label: 'COFINS' },
      { value: 'IRPJ', label: 'IRPJ' },
      { value: 'CSLL', label: 'CSLL' },
      { value: 'PRECATORIO', label: 'Precatório' },
      { value: 'DUPLICATA', label: 'Duplicata' },
      { value: 'OUTROS', label: 'Outros' }
    ]
  },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'ATIVO', label: 'Ativo' },
      { value: 'TOKENIZADO', label: 'Tokenizado' },
      { value: 'NEGOCIADO', label: 'Negociado' },
      { value: 'VENCIDO', label: 'Vencido' }
    ]
  },
  {
    id: 'dateRange',
    label: 'Período de Vencimento',
    type: 'dateRange'
  },
  {
    id: 'valueRange',
    label: 'Faixa de Valor',
    type: 'select',
    options: [
      { value: '0-10000', label: 'Até R$ 10.000' },
      { value: '10000-50000', label: 'R$ 10.000 - R$ 50.000' },
      { value: '50000-100000', label: 'R$ 50.000 - R$ 100.000' },
      { value: '100000-500000', label: 'R$ 100.000 - R$ 500.000' },
      { value: '500000+', label: 'Acima de R$ 500.000' }
    ]
  }
]; 