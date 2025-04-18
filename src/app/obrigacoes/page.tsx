'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, Search, Plus, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import toast from 'react-hot-toast';

interface Obrigacao {
  id: number;
  titulo: string;
  empresa: string;
  tipo: 'federal' | 'estadual' | 'municipal';
  prazo: string;
  periodicidade: 'mensal' | 'trimestral' | 'anual' | 'eventual';
  prioridade: 'baixa' | 'media' | 'alta';
  status: 'pendente' | 'concluida' | 'atrasada';
}

const obrigacoesMock: Obrigacao[] = [
  {
    id: 1,
    titulo: 'Declaração de ICMS',
    empresa: 'Empresa ABC Ltda',
    tipo: 'estadual',
    prazo: '2024-03-20',
    periodicidade: 'mensal',
    prioridade: 'alta',
    status: 'pendente'
  },
  {
    id: 2,
    titulo: 'Declaração de IR',
    empresa: 'Filial XYZ',
    tipo: 'federal',
    prazo: '2024-04-30',
    periodicidade: 'anual',
    prioridade: 'alta',
    status: 'pendente'
  }
];

export default function Obrigacoes() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [obrigacoes, setObrigacoes] = useState<Obrigacao[]>(obrigacoesMock);
  const [obrigacaoParaExcluir, setObrigacaoParaExcluir] = useState<Obrigacao | null>(null);
  const [loading, setLoading] = useState(false);

  const totalObrigacoes = obrigacoes.length;
  const obrigacoesPendentes = obrigacoes.filter(o => o.status === 'pendente').length;
  const obrigacoesAtrasadas = obrigacoes.filter(o => o.status === 'atrasada').length;

  const filteredObrigacoes = obrigacoes.filter(obrigacao =>
    obrigacao.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    obrigacao.empresa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExcluir = async () => {
    if (!obrigacaoParaExcluir) return;

    setLoading(true);
    try {
      // TODO: Implementar integração com API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulando chamada API
      setObrigacoes(prev => prev.filter(obr => obr.id !== obrigacaoParaExcluir.id));
      toast.success('Obrigação excluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir obrigação. Tente novamente.');
    } finally {
      setLoading(false);
      setObrigacaoParaExcluir(null);
    }
  };

  const getStatusColor = (status: Obrigacao['status']) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'concluida':
        return 'bg-green-100 text-green-800';
      case 'atrasada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo: Obrigacao['tipo']) => {
    switch (tipo) {
      case 'federal':
        return 'bg-blue-100 text-blue-800';
      case 'estadual':
        return 'bg-purple-100 text-purple-800';
      case 'municipal':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadeColor = (prioridade: Obrigacao['prioridade']) => {
    switch (prioridade) {
      case 'baixa':
        return 'bg-green-100 text-green-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'alta':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Obrigações</CardTitle>
            <CalendarDays className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalObrigacoes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Obrigações Pendentes</CardTitle>
            <CalendarDays className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{obrigacoesPendentes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Obrigações Atrasadas</CardTitle>
            <CalendarDays className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{obrigacoesAtrasadas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Pesquisa e Botão Adicionar */}
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Buscar obrigações..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => router.push('/obrigacoes/novo')}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Obrigação
        </Button>
      </div>

      {/* Tabela de Obrigações */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empresa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prazo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Periodicidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prioridade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredObrigacoes.map((obrigacao) => (
              <tr key={obrigacao.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{obrigacao.titulo}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{obrigacao.empresa}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTipoColor(obrigacao.tipo)}`}>
                    {obrigacao.tipo.charAt(0).toUpperCase() + obrigacao.tipo.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(obrigacao.prazo).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {obrigacao.periodicidade.charAt(0).toUpperCase() + obrigacao.periodicidade.slice(1)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPrioridadeColor(obrigacao.prioridade)}`}>
                    {obrigacao.prioridade.charAt(0).toUpperCase() + obrigacao.prioridade.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(obrigacao.status)}`}>
                    {obrigacao.status.charAt(0).toUpperCase() + obrigacao.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/obrigacoes/${obrigacao.id}/editar`)}
                    >
                      <Pencil className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setObrigacaoParaExcluir(obrigacao)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationDialog
        isOpen={!!obrigacaoParaExcluir}
        onClose={() => setObrigacaoParaExcluir(null)}
        onConfirm={handleExcluir}
        title="Excluir Obrigação"
        message={`Tem certeza que deseja excluir a obrigação "${obrigacaoParaExcluir?.titulo}"? Esta ação não poderá ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        isLoading={loading}
      />
    </div>
  );
} 