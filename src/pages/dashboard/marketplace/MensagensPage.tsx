import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageSquare,
  Send,
  Search,
  Filter,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Star,
  CheckCheck,
  User,
  Gavel,
  DollarSign,
  Image,
  FileText,
  Trash2,
  Archive,
  RefreshCw,
  Bell,
  Clock,
  Calendar,
  ChevronDown,
  Info,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Conversation {
  id: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
  type: 'negociacao' | 'suporte' | 'geral';
  isFavorite?: boolean;
  associatedItem?: {
    id: string;
    title: string;
    type: 'anuncio' | 'proposta' | 'compra' | 'venda';
    value: number;
  };
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  attachments?: {
    type: 'image' | 'document';
    url: string;
    name: string;
  }[];
}

export default function MensagensPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('todas');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  
  // Mensagens da conversa selecionada
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'other',
      text: 'Olá! Estou interessado em negociar o preço do crédito ICMS.',
      timestamp: new Date(Date.now() - 3600000),
      status: 'read',
    },
    {
      id: '2',
      senderId: 'me',
      text: 'Olá! Tudo bem? Qual valor você tem em mente?',
      timestamp: new Date(Date.now() - 3500000),
      status: 'read',
    },
    {
      id: '3',
      senderId: 'other',
      text: 'Estava pensando em um desconto de 15% sobre o valor anunciado.',
      timestamp: new Date(Date.now() - 3400000),
      status: 'read',
    },
    {
      id: '4',
      senderId: 'me',
      text: 'Posso oferecer no máximo 12% de desconto, considerando o valor do título e as taxas envolvidas.',
      timestamp: new Date(Date.now() - 1800000),
      status: 'delivered',
    },
    {
      id: '5',
      senderId: 'other',
      text: 'Entendo. Vou avaliar e retorno em breve com uma contraproposta.',
      timestamp: new Date(Date.now() - 1700000),
      status: 'read',
    },
  ]);

  const conversations: Conversation[] = [
    {
      id: '1',
      participantName: 'João Silva',
      participantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
      lastMessage: 'Olá! Estou interessado em negociar o preço do crédito ICMS.',
      timestamp: new Date(Date.now() - 1800000),
      unreadCount: 2,
      isOnline: true,
      type: 'negociacao',
      isFavorite: true,
      associatedItem: {
        id: 'anc-123',
        title: 'ICMS - Exportação Agronegócio',
        type: 'anuncio',
        value: 850000,
      },
    },
    {
      id: '2',
      participantName: 'Maria Santos',
      participantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
      lastMessage: 'Perfeito! Vou preparar a documentação.',
      timestamp: new Date(Date.now() - 3600000),
      unreadCount: 0,
      isOnline: false,
      type: 'negociacao',
      associatedItem: {
        id: 'prop-456',
        title: 'Proposta para PIS/COFINS',
        type: 'proposta',
        value: 420000,
      },
    },
    {
      id: '3',
      participantName: 'Suporte Tributa.AI',
      participantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=suporte',
      lastMessage: 'Como posso ajudar com sua dúvida sobre compensação multilateral?',
      timestamp: new Date(Date.now() - 86400000),
      unreadCount: 0,
      isOnline: true,
      type: 'suporte',
    },
    {
      id: '4',
      participantName: 'Carlos Mendes',
      participantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
      lastMessage: 'Podemos conversar sobre aquela oportunidade de parceria?',
      timestamp: new Date(Date.now() - 172800000),
      unreadCount: 1,
      isOnline: false,
      type: 'geral',
    },
    {
      id: '5',
      participantName: 'Ana Oliveira',
      participantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
      lastMessage: 'Obrigado pela negociação! Foi um prazer fazer negócios.',
      timestamp: new Date(Date.now() - 259200000),
      unreadCount: 0,
      isOnline: false,
      type: 'negociacao',
      associatedItem: {
        id: 'venda-789',
        title: 'Precatório Judicial TJSP',
        type: 'venda',
        value: 1200000,
      },
    },
  ];

  const formatTime = (date: Date): string => {
    const diffInHours = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60));
        return `${diffInMinutes}m atrás`;
      }
      return `${diffInHours}h atrás`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d atrás`;
    }
    
    return date.toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      text: newMessage,
      timestamp: new Date(),
      status: 'sent',
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Simular resposta após alguns segundos
    setTimeout(() => {
      const responseMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        senderId: 'other',
        text: 'Obrigado pela sua mensagem! Vou analisar e responder em breve.',
        timestamp: new Date(),
        status: 'delivered',
      };
      
      setMessages(prev => [...prev, responseMsg]);
    }, 3000);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    toast.info('Atualizando conversas...');
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Conversas atualizadas!');
    }, 1000);
  };

  const filteredConversations = conversations.filter(conversation => {
    // Filtrar por termo de busca
    const matchesSearch = conversation.participantName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrar por tipo de conversa
    const matchesType = activeTab === 'todas' || conversation.type === activeTab;
    
    return matchesSearch && matchesType;
  });

  // Ordenar conversas
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (sortBy === 'recent') {
      return b.timestamp.getTime() - a.timestamp.getTime();
    } else if (sortBy === 'unread') {
      return b.unreadCount - a.unreadCount;
    } else if (sortBy === 'alphabetical') {
      return a.participantName.localeCompare(b.participantName);
    }
    return 0;
  });

  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mensagens</h1>
          <p className="text-gray-600">Gerencie suas conversas e negociações</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Atualizar
          </Button>
          <Button size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Nova Mensagem
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm mb-1">Ordenar por</p>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Mais recentes</SelectItem>
                    <SelectItem value="unread">Não lidas</SelectItem>
                    <SelectItem value="alphabetical">Ordem alfabética</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <p className="text-sm mb-1">Período</p>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="week">Esta semana</SelectItem>
                    <SelectItem value="month">Este mês</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <p className="text-sm mb-1">Status</p>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativas</SelectItem>
                    <SelectItem value="archived">Arquivadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        <div className="lg:col-span-1 flex flex-col min-h-0">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Conversas</CardTitle>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="todas">Todas</TabsTrigger>
                    <TabsTrigger value="negociacao">Negociações</TabsTrigger>
                    <TabsTrigger value="suporte">Suporte</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar conversas..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-0">
              <ScrollArea className="h-[calc(100vh-22rem)]">
                <div className="space-y-1">
                  {sortedConversations.length > 0 ? (
                    sortedConversations.map(conversation => (
                      <div
                        key={conversation.id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 border-b transition-colors ${
                          selectedConversation === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                        onClick={() => setSelectedConversation(conversation.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={conversation.participantAvatar} />
                              <AvatarFallback>{conversation.participantName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {conversation.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <h3 className="font-medium truncate">{conversation.participantName}</h3>
                                {conversation.isFavorite && (
                                  <Star className="w-3 h-3 fill-current text-yellow-500" />
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {conversation.unreadCount > 0 && (
                                  <Badge variant="destructive" className="text-xs">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                                <span className="text-xs text-gray-500">
                                  {formatTime(conversation.timestamp)}
                                </span>
                              </div>
                            </div>

                            <p
                              className={`text-sm mt-1 truncate ${conversation.unreadCount > 0 ? 'font-medium' : 'text-gray-600'}`}
                            >
                              {conversation.lastMessage}
                            </p>
                            
                            {conversation.associatedItem && (
                              <div className="mt-1 flex items-center">
                                <Badge variant="outline" className="text-xs">
                                  {conversation.associatedItem.type === 'anuncio' && 'Anúncio'}
                                  {conversation.associatedItem.type === 'proposta' && 'Proposta'}
                                  {conversation.associatedItem.type === 'compra' && 'Compra'}
                                  {conversation.associatedItem.type === 'venda' && 'Venda'}
                                </Badge>
                                <span className="text-xs text-gray-500 ml-2 truncate">
                                  {conversation.associatedItem.title}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                      <p className="text-gray-500">Nenhuma conversa encontrada</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 flex flex-col min-h-0">
          {selectedConversation ? (
            <Card className="flex-1 flex flex-col">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=joao" />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">João Silva</h3>
                      <p className="text-sm text-green-600">Online agora</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Phone className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Chamada de voz</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Video className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Videochamada</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Info className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Informações da conversa</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Star className="w-4 h-4 mr-2" />
                          Favoritar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="w-4 h-4 mr-2" />
                          Arquivar conversa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir conversa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                {/* Informações da negociação associada */}
                <div className="mt-2 p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gavel className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Negociação: ICMS - Exportação Agronegócio</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <DollarSign className="w-3 h-3 mr-1" />
                      {formatCurrency(850000)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-4">
                <ScrollArea className="h-[calc(100vh-28rem)]">
                  <div className="space-y-4">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.senderId === 'me'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p>{message.text}</p>
                          <div
                            className={`text-xs mt-1 flex justify-end items-center gap-1 ${
                              message.senderId === 'me' ? 'text-blue-100' : 'text-gray-500'
                            }`}
                          >
                            {formatTime(message.timestamp)}
                            {message.senderId === 'me' && (
                              <CheckCheck
                                className={`w-3 h-3 ${
                                  message.status === 'read' ? 'text-blue-200' : 'text-blue-100'
                                }`}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>

              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Image className="w-4 h-4 mr-2" />
                        Enviar imagem
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="w-4 h-4 mr-2" />
                        Enviar documento
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    className="flex-1"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  
                  <Button variant="ghost" size="icon">
                    <Smile className="w-4 h-4" />
                  </Button>
                  
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="flex-1 flex items-center justify-center">
              <div className="text-center p-6">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma conversa</h3>
                <p className="text-gray-600 max-w-md">
                  Escolha uma conversa da lista para começar a trocar mensagens ou iniciar uma nova conversa.
                </p>
                <Button className="mt-4">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Nova Conversa
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
