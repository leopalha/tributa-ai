import React, { useState } from 'react';
import { useEmpresa } from '@/providers/EmpresaProvider';
import { toast } from 'sonner';

export function EmpresaConfig() {
  const { empresaAtual, atualizarEmpresa } = useEmpresa();
  const [editMode, setEditMode] = useState(!empresaAtual);
  const [formData, setFormData] = useState({
    nome: empresaAtual?.nome || '',
    cnpj: empresaAtual?.cnpj || '',
    email: empresaAtual?.email || '',
    telefone: empresaAtual?.telefone || '',
    endereco: empresaAtual?.endereco || '',
  });

  const handleSave = () => {
    if (!formData.nome || !formData.cnpj) {
      toast.error('Nome e CNPJ são obrigatórios');
      return;
    }

    if (empresaAtual) {
      atualizarEmpresa(empresaAtual.id, formData);
      toast.success('Dados da empresa atualizados!');
    }
    setEditMode(false);
  };

  const handleCancel = () => {
    if (empresaAtual) {
      setFormData({
        nome: empresaAtual.nome,
        cnpj: empresaAtual.cnpj,
        email: empresaAtual.email || '',
        telefone: empresaAtual.telefone || '',
        endereco: empresaAtual.endereco || '',
      });
    }
    setEditMode(false);
  };

  if (!editMode && empresaAtual) {
    return (
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-blue-800">🏢 Dados da Empresa</h3>
          <button
            onClick={() => setEditMode(true)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ✏️ Editar
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-blue-700 font-medium">Nome:</span>
            <p className="text-blue-800">{empresaAtual.nome}</p>
          </div>
          <div>
            <span className="text-blue-700 font-medium">CNPJ:</span>
            <p className="text-blue-800">{empresaAtual.cnpj}</p>
          </div>
          {empresaAtual.email && (
            <div>
              <span className="text-blue-700 font-medium">E-mail:</span>
              <p className="text-blue-800">{empresaAtual.email}</p>
            </div>
          )}
          {empresaAtual.telefone && (
            <div>
              <span className="text-blue-700 font-medium">Telefone:</span>
              <p className="text-blue-800">{empresaAtual.telefone}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="font-medium text-gray-800 mb-4">
        {empresaAtual ? '✏️ Editar Dados da Empresa' : '🏢 Configure os Dados da sua Empresa'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome da Empresa *</label>
          <input
            type="text"
            value={formData.nome}
            onChange={e => setFormData({ ...formData, nome: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: Minha Empresa LTDA"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">CNPJ *</label>
          <input
            type="text"
            value={formData.cnpj}
            onChange={e => setFormData({ ...formData, cnpj: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="00.000.000/0001-00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">E-mail</label>
          <input
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="contato@empresa.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Telefone</label>
          <input
            type="tel"
            value={formData.telefone}
            onChange={e => setFormData({ ...formData, telefone: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Endereço</label>
          <input
            type="text"
            value={formData.endereco}
            onChange={e => setFormData({ ...formData, endereco: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Rua, número, bairro, cidade - UF"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          💾 Salvar
        </button>
        {empresaAtual && (
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ❌ Cancelar
          </button>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-3">
        * Campos obrigatórios. Esses dados serão usados nos documentos de recuperação de créditos.
      </p>
    </div>
  );
}
