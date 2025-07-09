import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  Maximize2,
  Minimize2,
  Sparkles,
  MessageSquare,
  Mic,
  Paperclip,
  Settings,
  Volume2,
  VolumeX,
  Search,
  FileText,
  Calculator,
  TrendingUp,
  HelpCircle,
  Lightbulb,
  Zap,
  Brain,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
  metadata?: {
    confidence?: number;
    sources?: string[];
    category?: string;
  };
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  description: string;
  action: string;
  category: 'fiscal' | 'credits' | 'marketplace' | 'help';
}

const quickActions: QuickAction[] = [
  {
    icon: <FileText className="h-5 w-5" />,
    label: 'Declarações Fiscais',
    description: 'Ajuda com DCTF, SPED, EFD',
    action: 'Como posso ajudar com suas declarações fiscais?',
    category: 'fiscal',
  },
  {
    icon: <Calculator className="h-5 w-5" />,
    label: 'Cálculo de Tributos',
    description: 'Calcular ICMS, ISS, PIS/COFINS',
    action: 'Qual tributo você precisa calcular?',
    category: 'fiscal',
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    label: 'Análise de Créditos',
    description: 'Verificar créditos disponíveis',
    action: 'Vou analisar seus créditos tributários disponíveis.',
    category: 'credits',
  },
  {
    icon: <Zap className="h-5 w-5" />,
    label: 'Otimização Fiscal',
    description: 'Sugestões de economia',
    action: 'Vou buscar oportunidades de otimização fiscal para sua empresa.',
    category: 'credits',
  },
  {
    icon: <HelpCircle className="h-5 w-5" />,
    label: 'Suporte Técnico',
    description: 'Problemas com a plataforma',
    action: 'Como posso ajudar com a plataforma?',
    category: 'help',
  },
  {
    icon: <Lightbulb className="h-5 w-5" />,
    label: 'Dicas e Tutoriais',
    description: 'Aprenda a usar o sistema',
    action: 'Que funcionalidade você gostaria de aprender?',
    category: 'help',
  },
];

export function AriaAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content:
        'Olá! Eu sou a ARIA, sua assistente inteligente da Tributa.AI. 🤖✨\n\nPosso ajudar você com:\n• Declarações fiscais e obrigações\n• Análise de créditos tributários\n• Otimização fiscal\n• Navegação na plataforma\n\nComo posso ajudar hoje?',
      timestamp: new Date(),
      metadata: {
        category: 'greeting',
      },
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Remover logs de debug
  useEffect(() => {
    // Removido console.log de debug
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const playSound = (type: 'send' | 'receive') => {
    // Removido console.log de debug
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    playSound('send');

    setTimeout(() => {
      const responses = [
        {
          content: 'Entendi sua solicitação. Vou analisar as informações...',
          confidence: 0.95,
          sources: ['Base de conhecimento fiscal', 'Legislação atualizada'],
        },
        {
          content: 'Com base na sua pergunta, aqui está o que encontrei:',
          confidence: 0.88,
          sources: ['Manual da plataforma', 'FAQ'],
        },
        {
          content: 'Processando sua solicitação. Um momento...',
          confidence: 0.92,
          sources: ['Sistema interno', 'Banco de dados'],
        },
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: randomResponse.content,
        timestamp: new Date(),
        metadata: {
          confidence: randomResponse.confidence,
          sources: randomResponse.sources,
          category: 'response',
        },
        actions: [
          {
            label: 'Ver detalhes',
            action: () => toast.info('Abrindo detalhes...'),
          },
          {
            label: 'Salvar resposta',
            action: () => toast.success('Resposta salva!'),
          },
        ],
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      playSound('receive');
    }, 2000);
  };

  const handleQuickAction = (action: QuickAction) => {
    setInput(action.action);
    handleSend();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <>
        {/* Botão principal */}
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px',
            height: '60px',
          }}
          className="aria-assistant-button rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 group flex items-center justify-center"
        >
          <Bot className="h-6 w-6 text-white" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
        </button>
      </>
    );
  }

  return (
    <Card
      className={cn(
        'fixed transition-all duration-300 shadow-2xl',
        isMinimized
          ? 'bottom-6 right-6 w-80 h-16'
          : 'bottom-6 right-6 w-[600px] h-[700px] max-h-[85vh]'
      )}
      style={{ zIndex: 9999 }}
    >
      <CardHeader className="p-0">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-white/20">
                  <AvatarImage src="/aria-avatar.png" />
                  <AvatarFallback className="bg-white/20">
                    <Brain className="h-6 w-6 text-white" />
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  ARIA
                  <Badge variant="secondary" className="text-xs bg-white/20 text-white border-0">
                    AI Assistant
                  </Badge>
                </h3>
                <p className="text-xs opacity-90">Sempre pronta para ajudar</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[calc(100%-80px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="w-full rounded-none border-b">
              <TabsTrigger value="chat" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="actions" className="flex-1">
                <Zap className="h-4 w-4 mr-2" />
                Ações Rápidas
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1">
                <Search className="h-4 w-4 mr-2" />
                Histórico
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex gap-3',
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.type !== 'user' && (
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500">
                            <Sparkles className="h-4 w-4 text-white" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={cn(
                          'max-w-[80%] space-y-2',
                          message.type === 'user' ? 'items-end' : 'items-start'
                        )}
                      >
                        <div
                          className={cn(
                            'rounded-2xl px-4 py-3 text-sm',
                            message.type === 'user'
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-800'
                          )}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>

                        {message.metadata && (
                          <div className="flex items-center gap-2 px-2">
                            {message.metadata.confidence && (
                              <Badge variant="outline" className="text-xs">
                                {Math.round(message.metadata.confidence * 100)}% confiança
                              </Badge>
                            )}
                            {message.metadata.sources && (
                              <Badge variant="outline" className="text-xs">
                                {message.metadata.sources.length} fontes
                              </Badge>
                            )}
                          </div>
                        )}

                        {message.actions && (
                          <div className="flex gap-2 px-2">
                            {message.actions.map((action, idx) => (
                              <Button
                                key={idx}
                                size="sm"
                                variant="ghost"
                                className="text-xs h-7"
                                onClick={action.action}
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}

                        <span className="text-xs text-muted-foreground px-2">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>

                      {message.type === 'user' && (
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500">
                          <Sparkles className="h-4 w-4 text-white" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="border-t p-4 space-y-3">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Digite sua mensagem... (Enter para enviar)"
                    className="min-h-[50px] max-h-[100px] resize-none"
                    rows={2}
                  />
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Powered by AI • Respostas instantâneas</span>
                  <Button variant="link" size="sm" className="text-xs h-auto p-0">
                    <Settings className="h-3 w-3 mr-1" />
                    Configurações
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="actions" className="flex-1 p-4 m-0">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Ações Frequentes</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {quickActions.map((action, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="h-auto p-4 justify-start text-left hover:bg-gray-50 dark:hover:bg-gray-800"
                        onClick={() => handleQuickAction(action)}
                      >
                        <div className="flex gap-3">
                          <div
                            className={cn(
                              'p-2 rounded-lg shrink-0',
                              action.category === 'fiscal' && 'bg-blue-100 text-blue-600',
                              action.category === 'credits' && 'bg-green-100 text-green-600',
                              action.category === 'marketplace' && 'bg-purple-100 text-purple-600',
                              action.category === 'help' && 'bg-orange-100 text-orange-600'
                            )}
                          >
                            {action.icon}
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium text-sm">{action.label}</p>
                            <p className="text-xs text-muted-foreground">{action.description}</p>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="flex-1 p-4 m-0">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar no histórico..." className="flex-1" />
                </div>

                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Seu histórico de conversas aparecerá aqui</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
}
