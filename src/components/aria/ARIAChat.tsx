/**
 * 🤖 ARIA CHAT - ASSISTENTE INTELIGENTE
 * Sistema de chat integrado com IA
 */
import { useState, useEffect, useRef } from 'react';
import { useDataSource } from '@/contexts/DataSourceContext';
import { UnifiedText, UnifiedCard, UnifiedButton } from '@/components/ui/design-system-master';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { logger } from '@/lib/logger-unified';
import { genesisClient } from '@/services/genesis-client.service';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

/**
 * Componente principal do chat ARIA
 */
export function ARIAChat() {
  const { isMockMode } = useDataSource();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Sou a ARIA, sua assistente inteligente. Como posso ajudar você hoje?',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      if (isMockMode) {
        // 🎭 MOCK MODE - Simulated AI response
        logger.mock('ARIA AI processing message', { message: currentInput });
        setTimeout(() => {
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            content: `Entendi sua pergunta sobre "${currentInput}". Esta é uma resposta simulada da ARIA. Em modo mock.`,
            role: 'assistant',
            timestamp: new Date()
          };

          setMessages(prev => [...prev, aiResponse]);
          setIsLoading(false);
        }, 1500);
      } else {
        // 🔥 API MODE - Real GENESIS connection
        logger.info('ARIA AI processing message via GENESIS', { message: currentInput });

        // Envia para ARIA via GENESIS
        const taskResponse = await genesisClient.sendMessageToAgent(
          'aria',
          currentInput,
          {
            conversationId: `conv-${Date.now()}`,
            userId: 'user-frontend'
          }
        );

        // Extrai resposta da ARIA
        const ariaMessage = taskResponse.result?.message ||
          taskResponse.result?.response ||
          'ARIA processou sua mensagem mas não retornou resposta.';

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: ariaMessage,
          role: 'assistant',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);

        logger.info('ARIA response received', { taskId: taskResponse.id });
      }
    } catch (error) {
      logger.error('Failed to get ARIA response', { error });

      // Mensagem de erro amigável
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '⚠️ Desculpe, não consegui me conectar com o sistema GENESIS. Verifique se o backend está online.',
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-4 border-b bg-blue-50">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500 p-2 rounded-full">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <UnifiedText variant="heading" size="lg" className="font-semibold">
              ARIA Assistant
            </UnifiedText>
            <UnifiedText variant="body" size="sm" className="text-gray-600">
              Assistente IA Tributária
            </UnifiedText>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%]`}>
              {message.role === 'assistant' && (
                <div className="bg-blue-500 p-1 rounded-full">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}

              <UnifiedCard
                className={`p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100'
                }`}
              >
                <UnifiedText variant="body" size="sm">
                  {message.content}
                </UnifiedText>
                <div className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </UnifiedCard>

              {message.role === 'user' && (
                <div className="bg-gray-500 p-1 rounded-full">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="bg-blue-500 p-1 rounded-full">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <UnifiedCard className="p-3 bg-gray-100">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <UnifiedText variant="body" size="sm">
                    ARIA está pensando...
                  </UnifiedText>
                </div>
              </UnifiedCard>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem para a ARIA..."
            className="flex-1 resize-none border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
            disabled={isLoading}
          />
          <UnifiedButton
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="px-3"
          >
            <Send className="h-4 w-4" />
          </UnifiedButton>
        </div>
      </div>
    </div>
  );
}

export default ARIAChat;