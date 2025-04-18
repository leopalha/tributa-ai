'use client';

import { useState } from 'react';
import {
  Bell,
  Calendar,
  Check,
  Clock,
  Filter,
  MoreVertical,
  Search,
  Trash2,
  AlertTriangle,
  AlertTriangleIcon,
  FileCheck,
  Info
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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'react-hot-toast';

interface Notificacao {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'info' | 'warning' | 'success' | 'error';
  data: string;
  lida: boolean;
  empresa?: string;
  acao?: {
    texto: string;
    url: string;
  };
}

export default function Notificacoes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<Notificacao['tipo'] | 'all'>('all');
  const [apenasNaoLidas, setApenasNaoLidas] = useState(false);

  const [notificacoes] = useState<Notificacao[]>([
    {
      id: '1',
      titulo: 'DCTF Web próxima do vencimento',
      descricao: 'A declaração DCTF Web vence em 5 dias. Certifique-se de preparar todos os documentos necessários.',
      tipo: 'warning',
      data: '2024-03-20T10:00:00',
      lida: false,
      empresa: 'Empresa ABC Ltda',
      acao: {
        texto: 'Ver Declaração',
        url: '/declaracoes/dctf'
      }
    },
    {
      id: '2',
      titulo: 'EFD-Reinf enviada com sucesso',
      descricao: 'A declaração EFD-Reinf foi processada e aceita pela Receita Federal.',
      tipo: 'success',
      data: '2024-03-18T15:30:00',
      lida: true,
      empresa: 'Empresa ABC Ltda'
    },
    {
      id: '3',
      titulo: 'Atualização na legislação',
      descricao: 'Nova instrução normativa publicada afetando o cálculo do PIS/COFINS.',
      tipo: 'info',
      data: '2024-03-15T09:15:00',
      lida: false,
      acao: {
        texto: 'Ler Mais',
        url: '/legislacao/updates'
      }
    },
    {
      id: '4',
      titulo: 'Erro no envio da GFIP',
      descricao: 'Identificamos inconsistências no arquivo da GFIP. Verifique os dados e reenvie.',
      tipo: 'error',
      data: '2024-03-14T16:45:00',
      lida: false,
      empresa: 'Filial XYZ',
      acao: {
        texto: 'Verificar Erro',
        url: '/declaracoes/gfip'
      }
    }
  ]);

  const getNotificacaoIcon = (tipo: Notificacao['tipo']) => {
    switch (tipo) {
      case 'info':
        return <Info className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangleIcon className="h-5 w-5" />;
      case 'success':
        return <FileCheck className="h-5 w-5" />;
      case 'error':
        return <AlertTriangleIcon className="h-5 w-5" />;
    }
  };

  const getNotificacaoColor = (tipo: Notificacao['tipo']) => {
    switch (tipo) {
      case 'info':
        return 'text-blue-500 bg-blue-50';
      case 'warning':
        return 'text-yellow-500 bg-yellow-50';
      case 'success':
        return 'text-green-500 bg-green-50';
      case 'error':
        return 'text-red-500 bg-red-50';
    }
  };

  const marcarComoLida = (id: string) => {
    // TODO: Implementar integração com API
    toast.success('Notificação marcada como lida');
  };

  const excluirNotificacao = (id: string) => {
    // TODO: Implementar integração com API
    toast.success('Notificação excluída com sucesso');
  };

  const filteredNotificacoes = notificacoes.filter(notificacao => {
    const matchesSearch = notificacao.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notificacao.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filtroTipo === 'all' || notificacao.tipo === filtroTipo;
    const matchesLida = !apenasNaoLidas || !notificacao.lida;
    return matchesSearch && matchesTipo && matchesLida;
  });

  const totalNotificacoes = notificacoes.length;
  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Notificações</h1>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Notificações</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNotificacoes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Não Lidas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notificacoesNaoLidas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Últimos 7 Dias</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notificacoes.filter(n => {
                const date = new Date(n.data);
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                return date >= sevenDaysAgo;
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar notificações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Tipo
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFiltroTipo('all')}>
                    Todos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFiltroTipo('info')}>
                    Informações
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFiltroTipo('warning')}>
                    Avisos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFiltroTipo('success')}>
                    Sucessos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFiltroTipo('error')}>
                    Erros
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                onClick={() => setApenasNaoLidas(!apenasNaoLidas)}
                className={apenasNaoLidas ? 'bg-primary text-white hover:bg-primary/90' : ''}
              >
                <Clock className="h-4 w-4 mr-2" />
                Não Lidas
              </Button>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[600px]">
          <div className="divide-y">
            {filteredNotificacoes.map((notificacao) => (
              <div
                key={notificacao.id}
                className={`p-4 transition-colors duration-200 hover:bg-gray-50 ${
                  !notificacao.lida ? 'bg-blue-50/50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${getNotificacaoColor(notificacao.tipo)}`}>
                    {getNotificacaoIcon(notificacao.tipo)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{notificacao.titulo}</h3>
                      <div className="flex items-center gap-2">
                        {!notificacao.lida && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Nova
                          </Badge>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!notificacao.lida && (
                              <DropdownMenuItem onClick={() => marcarComoLida(notificacao.id)}>
                                <Check className="mr-2 h-4 w-4" />
                                Marcar como lida
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => excluirNotificacao(notificacao.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{notificacao.descricao}</p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500">
                          {new Date(notificacao.data).toLocaleString('pt-BR')}
                        </span>
                        {notificacao.empresa && (
                          <span className="text-xs text-gray-500">
                            {notificacao.empresa}
                          </span>
                        )}
                      </div>
                      {notificacao.acao && (
                        <Button
                          variant="link"
                          className="text-primary p-0 h-auto"
                          onClick={() => window.location.href = notificacao.acao!.url}
                        >
                          {notificacao.acao.texto}
                        </Button>
                      )}
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