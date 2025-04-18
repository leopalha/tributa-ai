'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Search,
  Filter,
  Calendar,
  Building2,
  Clock,
  AlertTriangleIcon,
  CheckCircle2,
  XCircle,
  FileWarning,
  MoreVertical,
  Eye,
  Download,
  Upload
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Declaracao {
  id: string;
  tipo: 'DCTF' | 'EFD_ICMS_IPI' | 'EFD_CONTRIBUICOES' | 'SPED_CONTABIL' | 'SPED_FISCAL' | 'GFIP' | 'REINF';
  empresa: {
    id: string;
    nome: string;
    cnpj: string;
  };
  competencia: string;
  prazo: string;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'atrasada' | 'erro';
  responsavel?: string;
  ultimaAtualizacao: string;
}

const tiposDeclaracao = {
  DCTF: 'DCTF Web',
  EFD_ICMS_IPI: 'EFD ICMS/IPI',
  EFD_CONTRIBUICOES: 'EFD Contribuições',
  SPED_CONTABIL: 'SPED Contábil',
  SPED_FISCAL: 'SPED Fiscal',
  GFIP: 'GFIP',
  REINF: 'EFD-Reinf'
};

export default function Declaracoes() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('all');
  const [filtroStatus, setFiltroStatus] = useState<string>('all');
  const [filtroEmpresa, setFiltroEmpresa] = useState<string>('all');

  const [declaracoes] = useState<Declaracao[]>([
    {
      id: '1',
      tipo: 'DCTF',
      empresa: {
        id: '1',
        nome: 'Empresa ABC Ltda',
        cnpj: '12.345.678/0001-90'
      },
      competencia: '2024-02',
      prazo: '2024-03-25',
      status: 'pendente',
      responsavel: 'João Silva',
      ultimaAtualizacao: '2024-03-20T10:00:00'
    },
    {
      id: '2',
      tipo: 'EFD_CONTRIBUICOES',
      empresa: {
        id: '1',
        nome: 'Empresa ABC Ltda',
        cnpj: '12.345.678/0001-90'
      },
      competencia: '2024-02',
      prazo: '2024-03-15',
      status: 'atrasada',
      responsavel: 'Maria Santos',
      ultimaAtualizacao: '2024-03-16T14:30:00'
    },
    {
      id: '3',
      tipo: 'REINF',
      empresa: {
        id: '2',
        nome: 'Filial XYZ',
        cnpj: '98.765.432/0001-21'
      },
      competencia: '2024-02',
      prazo: '2024-03-20',
      status: 'concluida',
      responsavel: 'Pedro Costa',
      ultimaAtualizacao: '2024-03-18T16:45:00'
    },
    {
      id: '4',
      tipo: 'SPED_FISCAL',
      empresa: {
        id: '2',
        nome: 'Filial XYZ',
        cnpj: '98.765.432/0001-21'
      },
      competencia: '2024-02',
      prazo: '2024-03-22',
      status: 'em_andamento',
      responsavel: 'Ana Oliveira',
      ultimaAtualizacao: '2024-03-20T09:15:00'
    }
  ]);

  const getStatusIcon = (status: Declaracao['status']) => {
    switch (status) {
      case 'pendente':
        return <Clock className="h-5 w-5" />;
      case 'em_andamento':
        return <FileText className="h-5 w-5" />;
      case 'concluida':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'atrasada':
        return <AlertTriangleIcon className="h-5 w-5" />;
      case 'erro':
        return <XCircle className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: Declaracao['status']) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'em_andamento':
        return 'bg-blue-100 text-blue-800';
      case 'concluida':
        return 'bg-green-100 text-green-800';
      case 'atrasada':
        return 'bg-red-100 text-red-800';
      case 'erro':
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusLabel = (status: Declaracao['status']) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'em_andamento':
        return 'Em Andamento';
      case 'concluida':
        return 'Concluída';
      case 'atrasada':
        return 'Atrasada';
      case 'erro':
        return 'Erro';
    }
  };

  const filteredDeclaracoes = declaracoes.filter(declaracao => {
    const matchesSearch = 
      declaracao.empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      declaracao.empresa.cnpj.includes(searchTerm) ||
      tiposDeclaracao[declaracao.tipo].toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = filtroTipo === 'all' || declaracao.tipo === filtroTipo;
    const matchesStatus = filtroStatus === 'all' || declaracao.status === filtroStatus;
    const matchesEmpresa = filtroEmpresa === 'all' || declaracao.empresa.id === filtroEmpresa;
    
    return matchesSearch && matchesTipo && matchesStatus && matchesEmpresa;
  });

  const totalDeclaracoes = declaracoes.length;
  const declaracoesPendentes = declaracoes.filter(d => d.status === 'pendente').length;
  const declaracoesAtrasadas = declaracoes.filter(d => d.status === 'atrasada').length;

  const handleDownload = (id: string) => {
    toast.success('Iniciando download da declaração...');
  };

  const handleUpload = (id: string) => {
    toast.success('Upload da declaração realizado com sucesso!');
  };

  const handleView = (id: string) => {
    router.push(`/declaracoes/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Declarações</h1>
        <Button onClick={() => router.push('/declaracoes/nova')}>
          <FileText className="w-4 h-4 mr-2" />
          Nova Declaração
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Declarações</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeclaracoes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{declaracoesPendentes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{declaracoesAtrasadas}</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por empresa, CNPJ ou tipo de declaração..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de Declaração" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  {Object.entries(tiposDeclaracao).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                  <SelectItem value="atrasada">Atrasada</SelectItem>
                  <SelectItem value="erro">Erro</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filtroEmpresa} onValueChange={setFiltroEmpresa}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Empresas</SelectItem>
                  <SelectItem value="1">Empresa ABC Ltda</SelectItem>
                  <SelectItem value="2">Filial XYZ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[600px]">
          <div className="divide-y">
            {filteredDeclaracoes.map((declaracao) => (
              <div
                key={declaracao.id}
                className="p-4 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${getStatusColor(declaracao.status)}`}>
                    {getStatusIcon(declaracao.status)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{tiposDeclaracao[declaracao.tipo]}</h3>
                        <p className="text-sm text-gray-500">
                          {declaracao.empresa.nome} - {declaracao.empresa.cnpj}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={getStatusColor(declaracao.status)}
                        >
                          {getStatusLabel(declaracao.status)}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(declaracao.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/declaracoes/${declaracao.id}/editar`)}>
                              <FileText className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(declaracao.id)}>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            {declaracao.status !== 'concluida' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleUpload(declaracao.id)}>
                                  <Upload className="mr-2 h-4 w-4" />
                                  Enviar Arquivo
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Competência: {format(new Date(declaracao.competencia + '-01'), 'MMMM/yyyy', { locale: ptBR })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Prazo: {format(new Date(declaracao.prazo), 'dd/MM/yyyy')}</span>
                      </div>
                      {declaracao.responsavel && (
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          <span>Responsável: {declaracao.responsavel}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      Última atualização: {format(new Date(declaracao.ultimaAtualizacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
} 