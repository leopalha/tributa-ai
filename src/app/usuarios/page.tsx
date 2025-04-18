'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  UserPlus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Mail,
  Shield,
  Building2
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
import { toast } from 'react-hot-toast';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  empresa: string;
  perfil: 'admin' | 'gestor' | 'analista';
  status: 'ativo' | 'inativo';
  ultimoAcesso?: string;
}

export default function Usuarios() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);

  const [usuarios] = useState<Usuario[]>([
    {
      id: '1',
      nome: 'João Silva',
      email: 'joao.silva@empresa.com',
      cargo: 'Contador',
      empresa: 'Empresa ABC Ltda',
      perfil: 'admin',
      status: 'ativo',
      ultimoAcesso: '2024-03-19T14:30:00'
    },
    {
      id: '2',
      nome: 'Maria Santos',
      email: 'maria.santos@empresa.com',
      cargo: 'Analista Fiscal',
      empresa: 'Empresa ABC Ltda',
      perfil: 'analista',
      status: 'ativo',
      ultimoAcesso: '2024-03-19T10:15:00'
    },
    {
      id: '3',
      nome: 'Pedro Costa',
      email: 'pedro.costa@empresa.com',
      cargo: 'Gestor Fiscal',
      empresa: 'Filial XYZ',
      perfil: 'gestor',
      status: 'inativo',
      ultimoAcesso: '2024-03-15T16:45:00'
    }
  ]);

  const totalUsuarios = usuarios.length;
  const usuariosAtivos = usuarios.filter(u => u.status === 'ativo').length;

  const handleExcluir = async () => {
    if (!usuarioParaExcluir) return;

    setLoading(true);
    try {
      // TODO: Implementar integração com API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Usuário excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir usuário. Tente novamente.');
    } finally {
      setLoading(false);
      setUsuarioParaExcluir(null);
    }
  };

  const getPerfilColor = (perfil: Usuario['perfil']) => {
    switch (perfil) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'gestor':
        return 'bg-blue-100 text-blue-800';
      case 'analista':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Usuario['status']) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'inativo':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.empresa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Usuários</h1>
        <Button onClick={() => router.push('/usuarios/novo')}>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsuarios}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usuariosAtivos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas Vinculadas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, email ou empresa..."
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
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead className="w-[48px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">{usuario.nome}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.cargo}</TableCell>
                  <TableCell>{usuario.empresa}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getPerfilColor(usuario.perfil)}
                    >
                      {usuario.perfil.charAt(0).toUpperCase() + usuario.perfil.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(usuario.status)}
                    >
                      {usuario.status.charAt(0).toUpperCase() + usuario.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {usuario.ultimoAcesso
                      ? new Date(usuario.ultimoAcesso).toLocaleString('pt-BR')
                      : 'Nunca acessou'}
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
                          onClick={() => router.push(`/usuarios/${usuario.id}/editar`)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600"
                          onClick={() => setUsuarioParaExcluir(usuario)}
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
        isOpen={!!usuarioParaExcluir}
        onClose={() => setUsuarioParaExcluir(null)}
        onConfirm={handleExcluir}
        title="Excluir Usuário"
        message={`Tem certeza que deseja excluir o usuário "${usuarioParaExcluir?.nome}"? Esta ação não poderá ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        isLoading={loading}
      />
    </div>
  );
} 