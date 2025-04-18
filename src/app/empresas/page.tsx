'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Users,
  FileCheck,
  AlertTriangleIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { toast } from 'sonner';

interface Empresa {
  id: string;
  razaoSocial: string;
  cnpj: string;
  regimeTributario: 'simples' | 'lucro_presumido' | 'lucro_real';
  status: 'ativo' | 'inativo';
  totalUsuarios: number;
  declaracoesPendentes: number;
  ultimaAtualizacao: string;
}

export default function Empresas() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [empresaParaExcluir, setEmpresaParaExcluir] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(false);

  const [empresas] = useState<Empresa[]>([
    {
      id: '1',
      razaoSocial: 'Empresa ABC Ltda',
      cnpj: '12.345.678/0001-90',
      regimeTributario: 'simples',
      status: 'ativo',
      totalUsuarios: 5,
      declaracoesPendentes: 2,
      ultimaAtualizacao: '2024-03-20T10:00:00'
    },
    {
      id: '2',
      razaoSocial: 'Filial XYZ',
      cnpj: '98.765.432/0001-21',
      regimeTributario: 'lucro_presumido',
      status: 'ativo',
      totalUsuarios: 3,
      declaracoesPendentes: 0,
      ultimaAtualizacao: '2024-03-19T15:30:00'
    },
    {
      id: '3',
      razaoSocial: 'Indústria Tech SA',
      cnpj: '45.678.901/0001-23',
      regimeTributario: 'lucro_real',
      status: 'inativo',
      totalUsuarios: 0,
      declaracoesPendentes: 5,
      ultimaAtualizacao: '2024-03-15T09:00:00'
    }
  ]);

  const handleExcluir = async () => {
    if (!empresaParaExcluir) return;

    setLoading(true);
    try {
      // TODO: Implementar integração com API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Empresa excluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir empresa. Tente novamente.');
    } finally {
      setLoading(false);
      setEmpresaParaExcluir(null);
    }
  };

  const getRegimeTributarioLabel = (regime: Empresa['regimeTributario']) => {
    switch (regime) {
      case 'simples':
        return 'Simples Nacional';
      case 'lucro_presumido':
        return 'Lucro Presumido';
      case 'lucro_real':
        return 'Lucro Real';
    }
  };

  const getRegimeTributarioColor = (regime: Empresa['regimeTributario']) => {
    switch (regime) {
      case 'simples':
        return 'bg-green-100 text-green-800';
      case 'lucro_presumido':
        return 'bg-blue-100 text-blue-800';
      case 'lucro_real':
        return 'bg-purple-100 text-purple-800';
    }
  };

  const getStatusColor = (status: Empresa['status']) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'inativo':
        return 'bg-red-100 text-red-800';
    }
  };

  const filteredEmpresas = empresas.filter(empresa =>
    empresa.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.cnpj.includes(searchTerm)
  );

  const totalEmpresas = empresas.length;
  const empresasAtivas = empresas.filter(e => e.status === 'ativo').length;
  const declaracoesPendentes = empresas.reduce((total, empresa) => total + empresa.declaracoesPendentes, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Empresas</h1>
        <Button onClick={() => router.push('/empresas/nova')}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Empresa
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Empresas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmpresas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas Ativas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{empresasAtivas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Declarações Pendentes</CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{declaracoesPendentes}</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por razão social ou CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Razão Social</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Regime Tributário</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usuários</TableHead>
                <TableHead>Declarações Pendentes</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead className="w-[48px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmpresas.map((empresa) => (
                <TableRow key={empresa.id}>
                  <TableCell className="font-medium">{empresa.razaoSocial}</TableCell>
                  <TableCell>{empresa.cnpj}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getRegimeTributarioColor(empresa.regimeTributario)}
                    >
                      {getRegimeTributarioLabel(empresa.regimeTributario)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(empresa.status)}
                    >
                      {empresa.status.charAt(0).toUpperCase() + empresa.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{empresa.totalUsuarios}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={empresa.declaracoesPendentes > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}
                    >
                      {empresa.declaracoesPendentes}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(empresa.ultimaAtualizacao).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => router.push(`/empresas/${empresa.id}/editar`)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600"
                          onClick={() => setEmpresaParaExcluir(empresa)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={!!empresaParaExcluir}
        onClose={() => setEmpresaParaExcluir(null)}
        onConfirm={handleExcluir}
        title="Excluir Empresa"
        message={`Tem certeza que deseja excluir a empresa "${empresaParaExcluir?.razaoSocial}"? Esta ação não poderá ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        isLoading={loading}
      />
    </div>
  );
} 