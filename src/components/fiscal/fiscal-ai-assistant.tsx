import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bot,
  Brain,
  Sparkles,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Target,
  Zap,
  FileText,
  Calculator,
  Shield,
  CheckCircle,
  Clock,
  Send,
  Mic,
  MicOff,
  Download,
  Share2,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: 'analysis' | 'recommendation' | 'alert' | 'optimization';
  confidence?: number;
  sources?: string[];
  actions?: AIAction[];
}

interface AIAction {
  id: string;
  title: string;
  description: string;
  type: 'calculate' | 'analyze' | 'optimize' | 'alert' | 'report';
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedSavings?: number;
  implementationTime?: number;
  complexity: 'simple' | 'medium' | 'complex';
}

interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'opportunity' | 'risk' | 'compliance' | 'optimization';
  impact: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  potentialSavings?: number;
  potentialRisk?: number;
  recommendations: string[];
  deadline?: Date;
  category: string;
}

interface FiscalAIAssistantProps {
  obligations: any[];
}

export function FiscalAIAssistant({ obligations }: FiscalAIAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content:
        'Olá! Sou seu assistente de IA fiscal. Posso ajudá-lo com análises, otimizações e compliance. Como posso ajudar hoje?',
      timestamp: new Date(),
      category: 'analysis',
      confidence: 100,
    },
  ]);

  const [insights, setInsights] = useState<AIInsight[]>([
    {
      id: '1',
      title: 'Oportunidade de Recuperação de Créditos',
      description:
        'Identifiquei R$ 45.000 em créditos de ICMS não utilizados que podem ser compensados.',
      type: 'opportunity',
      impact: 'high',
      confidence: 87,
      potentialSavings: 45000,
      recommendations: [
        'Revisar apuração de ICMS dos últimos 6 meses',
        'Verificar créditos de energia elétrica',
        'Analisar créditos de matéria-prima',
      ],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      category: 'Recuperação de Créditos',
    },
    {
      id: '2',
      title: 'Risco de Não Conformidade',
      description:
        'Detectei inconsistências nas declarações de PIS/COFINS que podem gerar autuações.',
      type: 'risk',
      impact: 'critical',
      confidence: 92,
      potentialRisk: 125000,
      recommendations: [
        'Revisar base de cálculo de PIS/COFINS',
        'Verificar enquadramento do regime tributário',
        'Atualizar procedimentos de apuração',
      ],
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      category: 'Compliance',
    },
    {
      id: '3',
      title: 'Otimização de Regime Tributário',
      description:
        'Análise indica que mudança para Lucro Presumido pode reduzir carga tributária em 18%.',
      type: 'optimization',
      impact: 'high',
      confidence: 78,
      potentialSavings: 89000,
      recommendations: [
        'Simular cenários de Lucro Presumido vs Real',
        'Analisar impacto nos próximos 12 meses',
        'Consultar contador para viabilidade',
      ],
      category: 'Planejamento Tributário',
    },
  ]);

  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');

  // Simular resposta da IA
  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simular processamento da IA
    setTimeout(() => {
      const aiResponse = generateAIResponse(currentMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  // Gerar resposta da IA baseada na mensagem do usuário
  const generateAIResponse = (userMessage: string): AIMessage => {
    const responses = [
      {
        trigger: ['análise', 'analisar', 'verificar'],
        response:
          'Analisando seus dados fiscais... Identifiquei algumas oportunidades de otimização. Posso detalhar as principais descobertas?',
        category: 'analysis' as const,
        confidence: 85,
      },
      {
        trigger: ['economia', 'economizar', 'reduzir'],
        response:
          'Com base na análise dos seus dados, identifiquei potencial de economia de R$ 67.000 anuais através de otimizações tributárias. Gostaria de ver o detalhamento?',
        category: 'optimization' as const,
        confidence: 78,
      },
      {
        trigger: ['risco', 'problema', 'erro'],
        response:
          'Detectei alguns pontos de atenção que podem representar riscos fiscais. Recomendo ação imediata em 2 itens críticos. Posso priorizar as ações?',
        category: 'alert' as const,
        confidence: 92,
      },
      {
        trigger: ['relatório', 'report', 'dashboard'],
        response:
          'Posso gerar relatórios personalizados com insights de IA. Que tipo de análise você precisa: compliance, otimização ou análise de riscos?',
        category: 'recommendation' as const,
        confidence: 90,
      },
    ];

    const matchedResponse = responses.find(r =>
      r.trigger.some(trigger => userMessage.toLowerCase().includes(trigger))
    );

    return {
      id: Date.now().toString(),
      type: 'assistant',
      content:
        matchedResponse?.response ||
        'Entendi sua pergunta. Deixe-me analisar seus dados fiscais para fornecer uma resposta mais precisa. Isso pode levar alguns segundos...',
      timestamp: new Date(),
      category: matchedResponse?.category || 'analysis',
      confidence: matchedResponse?.confidence || 75,
      actions: generateActions(userMessage),
    };
  };

  // Gerar ações sugeridas
  const generateActions = (userMessage: string): AIAction[] => {
    const actions: AIAction[] = [];

    if (userMessage.toLowerCase().includes('economia')) {
      actions.push({
        id: '1',
        title: 'Análise de Otimização Tributária',
        description: 'Executar análise completa de oportunidades de economia',
        type: 'optimize',
        priority: 'high',
        estimatedSavings: 67000,
        implementationTime: 15,
        complexity: 'medium',
      });
    }

    if (userMessage.toLowerCase().includes('risco')) {
      actions.push({
        id: '2',
        title: 'Auditoria de Compliance',
        description: 'Verificar conformidade com regulamentações fiscais',
        type: 'analyze',
        priority: 'critical',
        implementationTime: 7,
        complexity: 'simple',
      });
    }

    return actions;
  };

  // Obter cor do insight baseado no tipo
  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'risk':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'compliance':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'optimization':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Obter ícone do insight
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <TrendingUp className="h-4 w-4" />;
      case 'risk':
        return <AlertTriangle className="h-4 w-4" />;
      case 'compliance':
        return <Shield className="h-4 w-4" />;
      case 'optimization':
        return <Target className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6 text-blue-600" />
            Assistente de IA Fiscal
          </h2>
          <p className="text-muted-foreground">
            Análises inteligentes e recomendações personalizadas para otimização fiscal
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar Insights
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
          <Button size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar Análise
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat IA
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Análises
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Automação
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Conversa com IA
              </CardTitle>
              <CardDescription>
                Faça perguntas sobre sua situação fiscal e receba análises personalizadas
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                          <span>{format(message.timestamp, 'HH:mm', { locale: ptBR })}</span>
                          {message.confidence && <span>Confiança: {message.confidence}%</span>}
                        </div>

                        {message.actions && message.actions.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs font-medium">Ações Sugeridas:</p>
                            {message.actions.map(action => (
                              <Button
                                key={action.id}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start"
                              >
                                <Target className="h-3 w-3 mr-2" />
                                {action.title}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: '0.1s' }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: '0.2s' }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            IA está digitando...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="flex items-center gap-2 mt-4">
                <Input
                  placeholder="Digite sua pergunta sobre questões fiscais..."
                  value={currentMessage}
                  onChange={e => setCurrentMessage(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsListening(!isListening)}
                  className={isListening ? 'bg-red-100' : ''}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button onClick={handleSendMessage} disabled={!currentMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {insights.map(insight => (
              <Card key={insight.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getInsightIcon(insight.type)}
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getInsightColor(insight.type)}>{insight.type}</Badge>
                      <Badge variant="outline">{insight.confidence}% confiança</Badge>
                    </div>
                  </div>
                  <CardDescription>{insight.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {insight.potentialSavings && (
                      <div>
                        <span className="text-sm text-muted-foreground">Economia Potencial</span>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(insight.potentialSavings)}
                        </p>
                      </div>
                    )}
                    {insight.potentialRisk && (
                      <div>
                        <span className="text-sm text-muted-foreground">Risco Potencial</span>
                        <p className="text-lg font-bold text-red-600">
                          {formatCurrency(insight.potentialRisk)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-sm font-medium mb-2 block">Recomendações:</span>
                    <ul className="space-y-1">
                      {insight.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 mt-0.5 text-green-600 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {insight.deadline && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Prazo: {format(insight.deadline, 'dd/MM/yyyy', { locale: ptBR })}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                    <Button size="sm" variant="outline">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                    <div className="flex items-center gap-1 ml-auto">
                      <Button size="sm" variant="ghost">
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análises Avançadas</CardTitle>
              <CardDescription>Análises detalhadas com inteligência artificial</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Calculator className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Funcionalidade em desenvolvimento</p>
                <p className="text-sm">Em breve você terá acesso a análises avançadas com IA</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automação Inteligente</CardTitle>
              <CardDescription>
                Configure automações baseadas em IA para otimizar processos fiscais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Funcionalidade em desenvolvimento</p>
                <p className="text-sm">Em breve você poderá configurar automações inteligentes</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
