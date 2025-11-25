import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, UserPlus, Edit, Trash2, Shield, Mail, Phone, Search, Filter } from 'lucide-react';

const mockUsuarios = [
  {
    id: 1,
    nome: 'João Silva',
    email: 'joao.silva@empresa.com',
    telefone: '(11) 99999-9999',
    cargo: 'Contador',
    departamento: 'Fiscal',
    role: 'admin',
    status: 'Ativo',
    ultimoLogin: '2024-11-15T10:30:00',
    dataCreacao: '2024-01-15',
    avatar: '/placeholder-avatar.jpg',
  },
  {
    id: 2,
    nome: 'Maria Santos',
    email: 'maria.santos@empresa.com',
    telefone: '(11) 88888-8888',
    cargo: 'Analista Fiscal',
    departamento: 'Fiscal',
    role: 'user',
    status: 'Ativo',
    ultimoLogin: '2024-11-15T09:15:00',
    dataCreacao: '2024-02-10',
    avatar: '/placeholder-avatar.jpg',
  },
  {
    id: 3,
    nome: 'Pedro Oliveira',
    email: 'pedro.oliveira@empresa.com',
    telefone: '(11) 77777-7777',
    cargo: 'Assistente Contábil',
    departamento: 'Contábil',
    role: 'user',
    status: 'Inativo',
    ultimoLogin: '2024-11-10T14:20:00',
    dataCreacao: '2024-03-05',
    avatar: '/placeholder-avatar.jpg',
  },
  {
    id: 4,
    nome: 'Ana Costa',
    email: 'ana.costa@empresa.com',
    telefone: '(11) 66666-6666',
    cargo: 'Gerente Financeiro',
    departamento: 'Financeiro',
    role: 'manager',
    status: 'Ativo',
    ultimoLogin: '2024-11-14T16:45:00',
    dataCreacao: '2024-01-20',
    avatar: '/placeholder-avatar.jpg',
  },
];

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-red-100 text-red-800';
    case 'manager': return 'bg-blue-100 text-blue-800';
    case 'user': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'admin': return 'Administrador';
    case 'manager': return 'Gerente';
    case 'user': return 'Usuário';
    default: return 'Usuário';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Ativo': return 'bg-green-100 text-green-800';
    case 'Inativo': return 'bg-red-100 text-red-800';
    case 'Pendente': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function UsuariosPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [filtros, setFiltros] = useState({
    busca: '',
    departamento: '',
    role: '',
    status: '',
  });

  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
    departamento: '',
    role: 'user',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular criação/edição de usuário
    console.log(editingUser ? 'Editando usuário:' : 'Criando usuário:', novoUsuario);
    setIsDialogOpen(false);
    setEditingUser(null);
    setNovoUsuario({
      nome: '',
      email: '',
      telefone: '',
      cargo: '',
      departamento: '',
      role: 'user',
    });
  };

  const handleEdit = (usuario: any) => {
    setEditingUser(usuario);
    setNovoUsuario({
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      cargo: usuario.cargo,
      departamento: usuario.departamento,
      role: usuario.role,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      console.log('Excluindo usuário:', id);
    }
  };

  const usuariosAtivos = mockUsuarios.filter(u => u.status === 'Ativo').length;
  const usuariosInativos = mockUsuarios.filter(u => u.status === 'Inativo').length;
  const administradores = mockUsuarios.filter(u => u.role === 'admin').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie usuários e permissões da sua empresa
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
              </DialogTitle>
              <DialogDescription>
                {editingUser ? 'Edite as informações do usuário' : 'Adicione um novo usuário à sua empresa'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={novoUsuario.nome}
                    onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={novoUsuario.email}
                    onChange={(e) => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={novoUsuario.telefone}
                    onChange={(e) => setNovoUsuario({ ...novoUsuario, telefone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input
                    id="cargo"
                    value={novoUsuario.cargo}
                    onChange={(e) => setNovoUsuario({ ...novoUsuario, cargo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento</Label>
                  <Select
                    value={novoUsuario.departamento}
                    onValueChange={(value) => setNovoUsuario({ ...novoUsuario, departamento: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fiscal">Fiscal</SelectItem>
                      <SelectItem value="Contábil">Contábil</SelectItem>
                      <SelectItem value="Financeiro">Financeiro</SelectItem>
                      <SelectItem value="Jurídico">Jurídico</SelectItem>
                      <SelectItem value="Administração">Administração</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Nível de Acesso</Label>
                  <Select
                    value={novoUsuario.role}
                    onValueChange={(value) => setNovoUsuario({ ...novoUsuario, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="manager">Gerente</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingUser ? 'Salvar Alterações' : 'Criar Usuário'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUsuarios.length}</div>
            <p className="text-xs text-muted-foreground">
              Usuários cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{usuariosAtivos}</div>
            <p className="text-xs text-muted-foreground">
              Com acesso ativo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Inativos</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{usuariosInativos}</div>
            <p className="text-xs text-muted-foreground">
              Sem acesso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{administradores}</div>
            <p className="text-xs text-muted-foreground">
              Com acesso total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuários..."
                value={filtros.busca}
                onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
                className="pl-10"
              />
            </div>
            
            <Select
              value={filtros.departamento}
              onValueChange={(value) => setFiltros({ ...filtros, departamento: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="Fiscal">Fiscal</SelectItem>
                <SelectItem value="Contábil">Contábil</SelectItem>
                <SelectItem value="Financeiro">Financeiro</SelectItem>
                <SelectItem value="Jurídico">Jurídico</SelectItem>
                <SelectItem value="Administração">Administração</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filtros.role}
              onValueChange={(value) => setFiltros({ ...filtros, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Nível de acesso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="user">Usuário</SelectItem>
                <SelectItem value="manager">Gerente</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filtros.status}
              onValueChange={(value) => setFiltros({ ...filtros, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários da Empresa</CardTitle>
          <CardDescription>
            Lista completa dos usuários com acesso ao sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockUsuarios.map((usuario) => (
              <div key={usuario.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={usuario.avatar} alt={usuario.nome} />
                    <AvatarFallback>
                      {usuario.nome.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{usuario.nome}</h4>
                      <Badge className={getRoleColor(usuario.role)}>
                        {getRoleLabel(usuario.role)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {usuario.cargo} • {usuario.departamento}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {usuario.email}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {usuario.telefone}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Badge className={getStatusColor(usuario.status)}>
                      {usuario.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      Último login: {new Date(usuario.ultimoLogin).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(usuario)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(usuario.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}