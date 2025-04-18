'use client';

import { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Building2, 
  Mail, 
  Phone,
  MoreVertical,
  FileText,
  Trash2,
  PenSquare
} from 'lucide-react';

const clientesExemplo = [
  {
    id: '1',
    nome: 'Empresa ABC Ltda',
    cnpj: '12.345.678/0001-90',
    email: 'contato@empresaabc.com.br',
    telefone: '(11) 3456-7890',
    regime: 'Simples Nacional',
    status: 'ativo',
    declaracoesPendentes: 2,
  },
  {
    id: '2',
    nome: 'XYZ Comércio S.A.',
    cnpj: '98.765.432/0001-21',
    email: 'fiscal@xyzcomercio.com.br',
    telefone: '(11) 2345-6789',
    regime: 'Lucro Presumido',
    status: 'ativo',
    declaracoesPendentes: 1,
  },
  {
    id: '3',
    nome: 'Tech Solutions ME',
    cnpj: '45.678.901/0001-23',
    email: 'contabil@techsolutions.com.br',
    telefone: '(11) 9876-5432',
    regime: 'Lucro Real',
    status: 'inativo',
    declaracoesPendentes: 0,
  },
];

export default function Clientes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showActions, setShowActions] = useState<string | null>(null);

  const filteredClientes = clientesExemplo.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cnpj.includes(searchTerm)
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
        <p className="mt-1 text-gray-600">
          Gerencie seus clientes e suas informações fiscais.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nome ou CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <Plus className="h-5 w-5 mr-2" />
              Novo Cliente
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Regime Tributário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pendências
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">{cliente.nome}</div>
                        <div className="text-sm text-gray-500">{cliente.cnpj}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center text-gray-500">
                        <Mail className="h-4 w-4 mr-1" />
                        {cliente.email}
                      </div>
                      <div className="flex items-center text-gray-500 mt-1">
                        <Phone className="h-4 w-4 mr-1" />
                        {cliente.telefone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cliente.regime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        cliente.status === 'ativo'
                          ? 'bg-success-100 text-success-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {cliente.status.charAt(0).toUpperCase() + cliente.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {cliente.declaracoesPendentes > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                        {cliente.declaracoesPendentes} pendente(s)
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                        Em dia
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative">
                      <button
                        onClick={() => setShowActions(showActions === cliente.id ? null : cliente.id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      
                      {showActions === cliente.id && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1" role="menu">
                            <button
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              <FileText className="h-4 w-4 mr-3" />
                              Ver Declarações
                            </button>
                            <button
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              <PenSquare className="h-4 w-4 mr-3" />
                              Editar
                            </button>
                            <button
                              className="flex items-center w-full px-4 py-2 text-sm text-error-600 hover:bg-gray-100"
                              role="menuitem"
                            >
                              <Trash2 className="h-4 w-4 mr-3" />
                              Excluir
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 