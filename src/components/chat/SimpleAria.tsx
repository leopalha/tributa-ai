import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'aria';
  timestamp: Date;
  metadata?: {
    confidence?: number;
    sources?: string[];
    category?: string;
  };
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  description: string;
  action: string;
  category: 'fiscal' | 'credits' | 'marketplace' | 'automation' | 'help';
}

// Ações rápidas baseadas no AriaAssistant original (agora com modal direto)
const quickActions: QuickAction[] = [
  {
    label: 'Compensar Débitos',
    icon: <span>💸</span>,
    description: 'Realizar compensação automática',
    action: 'compensar_modal',
    category: 'fiscal',
  },
  {
    label: 'Analisar Créditos',
    icon: <span>📊</span>,
    description: 'Verificar créditos disponíveis',
    action: 'Vou analisar seus créditos tributários disponíveis',
    category: 'credits',
  },
  {
    label: 'Vender TCs',
    icon: <span>🛒</span>,
    description: 'Marketplace de títulos',
    action: 'vender_modal',
    category: 'marketplace',
  },
  {
    label: 'Criar TC',
    icon: <span>➕</span>,
    description: 'Gerar novo título',
    action: 'criar_tc_modal',
    category: 'credits',
  },
  {
    label: 'Tokenizar',
    icon: <span>🔗</span>,
    description: 'Blockchain tokenization',
    action: 'tokenizar_modal',
    category: 'automation',
  },
  {
    label: 'Gerar Relatório',
    icon: <span>📄</span>,
    description: 'Relatórios fiscais',
    action: 'Que tipo de relatório você precisa gerar?',
    category: 'fiscal',
  },
];

const systemStatus = [
  { label: 'Receita Federal', status: 'online', ms: 120 },
  { label: 'Blockchain', status: 'online', ms: 45 },
  { label: 'Analytics', status: 'online', ms: 230 },
  { label: 'Database', status: 'online', ms: 15 },
];

export function SimpleAria() {
  const [isOpen, setIsOpen] = useState(false);
  const [showExecutionModal, setShowExecutionModal] = useState(false);
  const [executingAction, setExecutingAction] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [progressValue, setProgressValue] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Eu sou a ARIA, sua assistente inteligente da Tributa.AI. 🤖✨\n\nPosso ajudar você com:\n• Declarações fiscais e obrigações\n• Análise de créditos tributários\n• Compensação multilateral\n• Marketplace de títulos\n• Tokenização de ativos\n• Automação de processos\n\nComo posso ajudar hoje?',
      sender: 'aria',
      timestamp: new Date(),
      metadata: {
        category: 'greeting',
        confidence: 1.0,
        sources: ['Sistema ARIA', 'Base de conhecimento'],
      },
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simular progresso do step de progress igual ao ARIA Dashboard
  useEffect(() => {
    if (
      showExecutionModal &&
      executingAction &&
      executingAction.steps &&
      executingAction.steps[currentStep]?.type === 'progress'
    ) {
      const step = executingAction.steps[currentStep];
      const duration = step.duration || 3000;

      // Reset progress value quando inicia o step de progress
      setProgressValue(0);

      const progressInterval = setInterval(() => {
        setProgressValue(prev => {
          if (prev >= 100) return 100;
          return prev + 100 / (duration / 100);
        });
      }, 100);

      const timer = setTimeout(() => {
        nextStep('completed');
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [showExecutionModal, currentStep, executingAction]);

  // Sistema de notificações igual ao ARIA Dashboard
  const addNotification = (notification: {
    title: string;
    message: string;
    type: 'success' | 'warning' | 'error' | 'info';
    actionId?: string;
    autoClose?: boolean;
    duration?: number;
  }) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Máximo 5 notificações

    if (notification.autoClose !== false) {
      setTimeout(() => {
        setNotifications(prev => prev.filter((n: any) => n.id !== newNotification.id));
      }, notification.duration || 5000);
    }
  };

  // Função para executar ações com modal interativo (baseado no ARIA Dashboard)
  const executeActionWithModal = (action: any) => {
    setExecutingAction(action);
    setCurrentStep(0);
    setProgressValue(0);
    setShowExecutionModal(true);
  };

  // Avançar para próximo step
  const nextStep = (selectedValue?: any) => {
    if (!executingAction || !executingAction.steps) return;

    if (selectedValue !== undefined && executingAction.steps[currentStep]) {
      executingAction.steps[currentStep].selectedValue = selectedValue;
      executingAction.steps[currentStep].status = 'completed';
    }

    if (currentStep < executingAction.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      if (executingAction.steps[currentStep + 1]) {
        executingAction.steps[currentStep + 1].status = 'active';
      }
    } else {
      finishExecution();
    }
  };

  // Finalizar execução igual ao ARIA Dashboard
  const finishExecution = () => {
    if (!executingAction) return;

    setShowExecutionModal(false);

    const results = executingAction.steps
      ?.map((step: any) =>
        step.selectedValue ? `${step.title}: ${step.selectedValue}` : step.title
      )
      .join('\n• ');

    const completionMessage: Message = {
      id: (Date.now() + 2).toString(),
      text: `🎉 ${executingAction.title} Concluída!\n\nResultados:\n• ${results}\n\n${executingAction.estimatedSavings ? `💰 Economia: R$ ${executingAction.estimatedSavings.toLocaleString('pt-BR')}` : ''}`,
      sender: 'aria',
      timestamp: new Date(),
      metadata: {
        category: 'action',
        confidence: 1.0,
        sources: ['Sistema executado'],
      },
    };

    setMessages(prev => [...prev, completionMessage]);

    // Notificação de sucesso igual ao ARIA Dashboard
    addNotification({
      title: 'Operação Concluída!',
      message: `${executingAction.title} foi executada com sucesso`,
      type: 'success',
      actionId: executingAction.id,
    });

    setExecutingAction(null);
    setCurrentStep(0);
    setProgressValue(0);
  };

  // Função para gerar respostas inteligentes baseadas no contexto (como no ARIA Dashboard)
  const generateIntelligentResponse = (
    userInput: string
  ): { content: string; metadata: any; actions?: any[] } => {
    const input = userInput.toLowerCase();

    // Respostas contextuais baseadas no ARIA Dashboard original
    if (input.includes('compensar') || input.includes('débito') || input.includes('compensação')) {
      return {
        content:
          '⚖️ **Iniciando Compensação Inteligente**\n\n**Análise Preliminar:**\n• Créditos disponíveis: R$ 191.000\n• Débitos pendentes: R$ 214.000\n• Economia potencial: R$ 23.000\n\n**Ações executadas:**\n✅ Validação de créditos\n🔄 Processando compensação automática\n⏱️ Tempo estimado: 3-5 minutos\n\n📊 **Acompanhe o progresso** no painel de operações →',
        metadata: {
          confidence: 0.94,
          sources: ['Sistema de Compensação', 'Base fiscal atualizada', 'Receita Federal'],
          category: 'execution',
        },
        actions: [
          {
            label: 'Executar Compensação',
            action: () =>
              executeActionWithModal({
                id: '1',
                title: 'Executar Compensação',
                description: 'Processar compensação automática completa',
                type: 'execute',
                priority: 'high',
                estimatedSavings: 23000,
                complexity: 'medium',
                canExecute: true,
                status: 'pending',
                requiresInteraction: true,
                buttonText: 'Iniciar Compensação',
                buttonIcon: 'Play',
                steps: [
                  {
                    id: 'step1',
                    title: 'Selecionar Créditos',
                    description: 'Escolha os créditos que deseja utilizar na compensação',
                    type: 'selection',
                    status: 'pending',
                    options: [
                      {
                        id: 'icms',
                        label: 'ICMS - R$ 45.000',
                        value: 'ICMS - R$ 45.000',
                        description: 'Créditos de ICMS disponíveis',
                        recommended: true,
                        savings: 45000,
                        risk: 'low',
                      },
                      {
                        id: 'pis',
                        label: 'PIS/COFINS - R$ 28.000',
                        value: 'PIS/COFINS - R$ 28.000',
                        description: 'Créditos de PIS/COFINS',
                        savings: 28000,
                        risk: 'low',
                      },
                      {
                        id: 'irpj',
                        label: 'IRPJ - R$ 15.000',
                        value: 'IRPJ - R$ 15.000',
                        description: 'Créditos de IRPJ',
                        savings: 15000,
                        risk: 'medium',
                      },
                    ],
                  },
                  {
                    id: 'step2',
                    title: 'Selecionar Débitos',
                    description: 'Escolha os débitos para compensação',
                    type: 'selection',
                    status: 'pending',
                    options: [
                      {
                        id: 'darf1',
                        label: 'DARF IRPJ - R$ 32.000',
                        value: 'DARF IRPJ - R$ 32.000',
                        description: 'Vencimento: 31/01/2025',
                        risk: 'high',
                      },
                      {
                        id: 'darf2',
                        label: 'DARF CSLL - R$ 18.000',
                        value: 'DARF CSLL - R$ 18.000',
                        description: 'Vencimento: 28/02/2025',
                        risk: 'medium',
                      },
                      {
                        id: 'darf3',
                        label: 'GPS - R$ 12.000',
                        value: 'GPS - R$ 12.000',
                        description: 'Vencimento: 15/01/2025',
                        risk: 'high',
                      },
                    ],
                  },
                  {
                    id: 'step3',
                    title: 'Confirmar Operação',
                    description: 'Revisar e confirmar a compensação',
                    type: 'confirmation',
                    status: 'pending',
                  },
                  {
                    id: 'step4',
                    title: 'Executando',
                    description: 'Processando compensação...',
                    type: 'progress',
                    status: 'pending',
                    duration: 5000,
                  },
                ],
              }),
          },
          {
            label: 'Ver Detalhes',
            action: () => toast('Abrindo relatório detalhado...'),
          },
        ],
      };
    }

    if (input.includes('crédito') || input.includes('análise') || input.includes('tribut')) {
      return {
        content:
          '📊 Análise de Créditos Tributários Concluída!\n\nEncontrei os seguintes créditos disponíveis:\n\n• ICMS ST: R$ 23.450,00 (vencimento em 90 dias)\n• PIS Ressarcimento: R$ 15.230,00\n• COFINS Diferencial: R$ 31.200,00\n• Crédito Presumido: R$ 8.900,00\n\nTotal: R$ 78.780,00\n\nSugestões de otimização:\n✅ Transferir créditos com vencimento próximo\n✅ Tokenizar créditos de maior valor\n✅ Vender no marketplace por 98% do valor',
        metadata: {
          confidence: 0.94,
          sources: ['Analytics Engine', 'Base de créditos', 'IA Fiscal'],
          category: 'credits_analysis',
        },
        actions: [
          {
            label: 'Tokenizar Créditos',
            action: () =>
              executeActionWithModal({
                id: '3',
                title: 'Tokenizar Créditos',
                description: 'Converter títulos em tokens blockchain',
                estimatedSavings: 0,
                steps: [
                  {
                    id: 'step1',
                    title: 'Selecionar TCs para Tokenização',
                    description: 'Escolha os títulos que serão convertidos em tokens',
                    type: 'selection',
                    status: 'pending',
                    options: [
                      {
                        id: 'tc1',
                        label: 'TC ICMS #001 - R$ 67.000',
                        value: 'TC ICMS #001 - R$ 67.000',
                        description: 'TC validado - pronto para tokenização',
                        recommended: true,
                        risk: 'low',
                      },
                      {
                        id: 'tc2',
                        label: 'TC PIS #002 - R$ 45.000',
                        value: 'TC PIS #002 - R$ 45.000',
                        description: 'TC validado - documentação completa',
                        risk: 'low',
                      },
                      {
                        id: 'tc3',
                        label: 'TC IRPJ #003 - R$ 44.000',
                        value: 'TC IRPJ #003 - R$ 44.000',
                        description: 'TC validado - aguardando tokenização',
                        risk: 'low',
                      },
                    ],
                  },
                  {
                    id: 'step2',
                    title: 'Configurar Token',
                    description: 'Definir parâmetros do token digital',
                    type: 'selection',
                    status: 'pending',
                    options: [
                      {
                        id: 'erc721',
                        label: 'ERC-721 (NFT)',
                        value: 'ERC-721 (NFT)',
                        description: 'Token único - ideal para TCs',
                        recommended: true,
                        risk: 'low',
                      },
                      {
                        id: 'erc20',
                        label: 'ERC-20 (Fungível)',
                        value: 'ERC-20 (Fungível)',
                        description: 'Token divisível - para fracionamento',
                        risk: 'medium',
                      },
                    ],
                  },
                  {
                    id: 'step3',
                    title: 'Confirmar Tokenização',
                    description: 'Revisar dados e confirmar criação dos tokens',
                    type: 'confirmation',
                    status: 'pending',
                  },
                  {
                    id: 'step4',
                    title: 'Tokenizando na Blockchain',
                    description: 'Criando tokens ERC-721 na rede...',
                    type: 'progress',
                    status: 'pending',
                    duration: 8000,
                  },
                ],
              }),
          },
          {
            label: 'Ir ao Marketplace',
            action: () =>
              executeActionWithModal({
                id: '2',
                title: 'Listar no Marketplace',
                description: 'Criar listagem para venda de títulos',
                estimatedSavings: 34000,
                steps: [
                  {
                    id: 'step1',
                    title: 'Selecionar TCs para Venda',
                    description: 'Escolha os títulos de crédito que deseja listar no marketplace',
                    type: 'selection',
                    status: 'pending',
                    options: [
                      {
                        id: 'tc1',
                        label: 'TC ICMS - R$ 34.000',
                        value: 'TC ICMS - R$ 34.000',
                        description: 'Crédito ICMS - demanda alta',
                        recommended: true,
                        savings: 32300,
                        risk: 'low',
                      },
                      {
                        id: 'tc2',
                        label: 'TC PIS/COFINS - R$ 12.000',
                        value: 'TC PIS/COFINS - R$ 12.000',
                        description: 'Crédito PIS/COFINS - mercado estável',
                        savings: 11040,
                        risk: 'low',
                      },
                      {
                        id: 'tc3',
                        label: 'TC IRPJ - R$ 8.500',
                        value: 'TC IRPJ - R$ 8.500',
                        description: 'Crédito IRPJ - liquidez menor',
                        savings: 7650,
                        risk: 'medium',
                      },
                    ],
                  },
                  {
                    id: 'step2',
                    title: 'Definir Preço de Venda',
                    description: 'Configure o percentual de desconto sobre o valor nominal',
                    type: 'selection',
                    status: 'pending',
                    options: [
                      {
                        id: 'price1',
                        label: '95% do valor nominal',
                        value: '95% do valor nominal',
                        description: 'Desconto mínimo - venda rápida garantida',
                        recommended: true,
                        risk: 'low',
                      },
                      {
                        id: 'price2',
                        label: '92% do valor nominal',
                        value: '92% do valor nominal',
                        description: 'Desconto médio - boa liquidez',
                        risk: 'low',
                      },
                      {
                        id: 'price3',
                        label: '90% do valor nominal',
                        value: '90% do valor nominal',
                        description: 'Desconto moderado - mercado equilibrado',
                        risk: 'low',
                      },
                    ],
                  },
                  {
                    id: 'step3',
                    title: 'Confirmar Listagem',
                    description: 'Revisar dados e confirmar listagem no marketplace',
                    type: 'confirmation',
                    status: 'pending',
                  },
                  {
                    id: 'step4',
                    title: 'Publicando no Marketplace',
                    description: 'Listando TCs no marketplace...',
                    type: 'progress',
                    status: 'pending',
                    duration: 4000,
                  },
                ],
              }),
          },
        ],
      };
    }

    if (input.includes('vender') || input.includes('marketplace') || input.includes('título')) {
      return {
        content:
          '🛒 Marketplace AI Ativado - Análise de Venda\n\nOportunidades de venda identificadas:\n\n• Demanda alta para ICMS: 127% do valor nominal\n• PIS/COFINS: 98-102% do valor\n• ISS Municipal: 95-98% do valor\n\nSeus títulos disponíveis:\n📄 TC-ICMS-2024-001: R$ 45.230,00\n📄 TC-PIS-2024-003: R$ 12.450,00\n📄 TC-ISS-2024-007: R$ 8.750,00\n\n🎯 Recomendação: Vender ICMS agora - preço em alta!',
        metadata: {
          confidence: 0.91,
          sources: ['Marketplace Analytics', 'Dados de mercado', 'IA de Precificação'],
          category: 'marketplace',
        },
        actions: [
          {
            label: 'Listar para Venda',
            action: () =>
              executeActionWithModal({
                id: '2',
                title: 'Listar no Marketplace',
                description: 'Criar listagem para venda de títulos',
                estimatedSavings: 34000,
                steps: [
                  {
                    id: 'step1',
                    title: 'Selecionar TCs para Venda',
                    description: 'Escolha os títulos de crédito que deseja listar no marketplace',
                    type: 'selection',
                    status: 'pending',
                    options: [
                      {
                        id: 'tc1',
                        label: 'TC ICMS - R$ 34.000',
                        value: 'TC ICMS - R$ 34.000',
                        description: 'Crédito ICMS - demanda alta',
                        recommended: true,
                        savings: 32300,
                        risk: 'low',
                      },
                      {
                        id: 'tc2',
                        label: 'TC PIS/COFINS - R$ 12.000',
                        value: 'TC PIS/COFINS - R$ 12.000',
                        description: 'Crédito PIS/COFINS - mercado estável',
                        savings: 11040,
                        risk: 'low',
                      },
                      {
                        id: 'tc3',
                        label: 'TC IRPJ - R$ 8.500',
                        value: 'TC IRPJ - R$ 8.500',
                        description: 'Crédito IRPJ - liquidez menor',
                        savings: 7650,
                        risk: 'medium',
                      },
                    ],
                  },
                  {
                    id: 'step2',
                    title: 'Definir Preço de Venda',
                    description: 'Configure o percentual de desconto sobre o valor nominal',
                    type: 'selection',
                    status: 'pending',
                    options: [
                      {
                        id: 'price1',
                        label: '95% do valor nominal',
                        value: '95% do valor nominal',
                        description: 'Desconto mínimo - venda rápida garantida',
                        recommended: true,
                        risk: 'low',
                      },
                      {
                        id: 'price2',
                        label: '92% do valor nominal',
                        value: '92% do valor nominal',
                        description: 'Desconto médio - boa liquidez',
                        risk: 'low',
                      },
                      {
                        id: 'price3',
                        label: '90% do valor nominal',
                        value: '90% do valor nominal',
                        description: 'Desconto moderado - mercado equilibrado',
                        risk: 'low',
                      },
                    ],
                  },
                  {
                    id: 'step3',
                    title: 'Confirmar Listagem',
                    description: 'Revisar dados e confirmar listagem no marketplace',
                    type: 'confirmation',
                    status: 'pending',
                  },
                  {
                    id: 'step4',
                    title: 'Publicando no Marketplace',
                    description: 'Listando TCs no marketplace...',
                    type: 'progress',
                    status: 'pending',
                    duration: 4000,
                  },
                ],
              }),
          },
          {
            label: 'Ver Análise Completa',
            action: () => toast('Abrindo análise detalhada do mercado...'),
          },
        ],
      };
    }

    if (input.includes('tokenizar') || input.includes('blockchain') || input.includes('token')) {
      return {
        content:
          '⛓️ **Blockchain Engine Ativo**\n\n**Status da Rede:**\n• Hyperledger Fabric: 🟢 ONLINE\n• Smart Contracts: ✅ Validados\n• Gas Fee: R$ 2,50\n\n**Ativos selecionados para tokenização:**\n🏦 3 TCs validados (R$ 156.000)\n📋 Documentação completa\n🔐 Chaves criptográficas ativas\n\n**Processo iniciado:** Criação de tokens ERC-721\n⏱️ Tempo estimado: 5-8 minutos',
        metadata: {
          confidence: 0.93,
          sources: ['Blockchain Engine', 'Smart Contracts', 'Hyperledger Network'],
          category: 'tokenization',
        },
        actions: [
          {
            label: 'Confirmar Tokenização',
            action: () =>
              executeActionWithModal({
                id: '3',
                title: 'Tokenizar Créditos',
                description: 'Converter títulos em tokens blockchain',
                estimatedSavings: 0,
                steps: [
                  {
                    id: 'step1',
                    title: 'Selecionar TCs para Tokenização',
                    description: 'Escolha os títulos que serão convertidos em tokens',
                    type: 'selection',
                    status: 'pending',
                    options: [
                      {
                        id: 'tc1',
                        label: 'TC ICMS #001 - R$ 67.000',
                        value: 'TC ICMS #001 - R$ 67.000',
                        description: 'TC validado - pronto para tokenização',
                        recommended: true,
                        risk: 'low',
                      },
                      {
                        id: 'tc2',
                        label: 'TC PIS #002 - R$ 45.000',
                        value: 'TC PIS #002 - R$ 45.000',
                        description: 'TC validado - documentação completa',
                        risk: 'low',
                      },
                      {
                        id: 'tc3',
                        label: 'TC IRPJ #003 - R$ 44.000',
                        value: 'TC IRPJ #003 - R$ 44.000',
                        description: 'TC validado - aguardando tokenização',
                        risk: 'low',
                      },
                    ],
                  },
                  {
                    id: 'step2',
                    title: 'Configurar Token',
                    description: 'Definir parâmetros do token digital',
                    type: 'selection',
                    status: 'pending',
                    options: [
                      {
                        id: 'erc721',
                        label: 'ERC-721 (NFT)',
                        value: 'ERC-721 (NFT)',
                        description: 'Token único - ideal para TCs',
                        recommended: true,
                        risk: 'low',
                      },
                      {
                        id: 'erc20',
                        label: 'ERC-20 (Fungível)',
                        value: 'ERC-20 (Fungível)',
                        description: 'Token divisível - para fracionamento',
                        risk: 'medium',
                      },
                    ],
                  },
                  {
                    id: 'step3',
                    title: 'Confirmar Tokenização',
                    description: 'Revisar dados e confirmar criação dos tokens',
                    type: 'confirmation',
                    status: 'pending',
                  },
                  {
                    id: 'step4',
                    title: 'Tokenizando na Blockchain',
                    description: 'Criando tokens ERC-721 na rede...',
                    type: 'progress',
                    status: 'pending',
                    duration: 8000,
                  },
                ],
              }),
          },
          {
            label: 'Ver na Blockchain',
            action: () => toast('Abrindo explorador da blockchain...'),
          },
        ],
      };
    }

    if (input.includes('relatório') || input.includes('report') || input.includes('gerar')) {
      return {
        content:
          '📄 **Gerando Relatórios Personalizados...**\n\n**Relatórios disponíveis:**\n\n📊 Relatório Fiscal Mensal\n• Período: Novembro 2024\n• Tributos: Todos\n• Status: ✅ Concluído\n\n📈 Análise de Performance\n• Economia fiscal: R$ 127.450,00\n• Créditos recuperados: R$ 89.230,00\n• ROI da plataforma: 340%\n\n🔄 Relatório de Compensações\n• Compensações realizadas: 23\n• Valor total: R$ 456.780,00\n• Economia de juros: R$ 34.567,00',
        metadata: {
          confidence: 0.89,
          sources: ['Sistema de Relatórios', 'Analytics Database', 'Dados fiscais'],
          category: 'reports',
        },
        actions: [
          {
            label: 'Download PDF',
            action: () => {
              const reportId = `REP-${Date.now().toString().slice(-6)}`;
              toast.success(`Relatório ${reportId} gerado! Baixando...`);
            },
          },
          {
            label: 'Enviar por Email',
            action: () => toast.success('Relatório enviado por email!'),
          },
        ],
      };
    }

    if (input.includes('criar') && input.includes('tc')) {
      return {
        content:
          '🎯 **Criação de Título de Crédito**\n\n**Dados identificados:**\n• Tipo: Crédito tributário\n• Valor estimado: R$ 25.000,00\n• Documentação: Em análise\n\n**Status:**\n✅ Validação inicial completa\n🔄 Preparando emissão blockchain\n📋 Aguardando confirmação\n\n**Próximos passos:**\n1. Validar documentos fiscais\n2. Gerar hash blockchain\n3. Emitir título tokenizado',
        metadata: {
          confidence: 0.92,
          sources: ['Sistema de TCs', 'Blockchain', 'Validador fiscal'],
          category: 'creation',
        },
        actions: [
          {
            label: 'Criar TC',
            action: () =>
              executeActionWithModal({
                id: '4',
                title: 'Criar Título de Crédito',
                description: 'Emitir novo título de crédito',
                estimatedSavings: 0,
                steps: [
                  {
                    id: 'step1',
                    title: 'Tipo de Crédito',
                    description: 'Selecione o tipo de título de crédito a ser criado',
                    type: 'selection',
                    status: 'pending',
                    options: [
                      {
                        id: 'icms',
                        label: 'ICMS',
                        value: 'ICMS',
                        description: 'Imposto sobre Circulação de Mercadorias',
                        recommended: true,
                        risk: 'low',
                      },
                      {
                        id: 'pis',
                        label: 'PIS/COFINS',
                        value: 'PIS/COFINS',
                        description: 'Programa de Integração Social / COFINS',
                        risk: 'low',
                      },
                      {
                        id: 'irpj',
                        label: 'IRPJ',
                        value: 'IRPJ',
                        description: 'Imposto de Renda Pessoa Jurídica',
                        risk: 'medium',
                      },
                      {
                        id: 'csll',
                        label: 'CSLL',
                        value: 'CSLL',
                        description: 'Contribuição Social sobre Lucro Líquido',
                        risk: 'medium',
                      },
                    ],
                  },
                  {
                    id: 'step2',
                    title: 'Valor do Crédito',
                    description: 'Defina o valor nominal do título de crédito',
                    type: 'selection',
                    status: 'pending',
                    options: [
                      {
                        id: 'val1',
                        label: 'R$ 10.000',
                        value: 'R$ 10.000',
                        description: 'Valor pequeno - processamento rápido',
                        risk: 'low',
                      },
                      {
                        id: 'val2',
                        label: 'R$ 25.000',
                        value: 'R$ 25.000',
                        description: 'Valor médio - padrão do mercado',
                        recommended: true,
                        risk: 'low',
                      },
                      {
                        id: 'val3',
                        label: 'R$ 50.000',
                        value: 'R$ 50.000',
                        description: 'Valor alto - requer validação adicional',
                        risk: 'medium',
                      },
                    ],
                  },
                  {
                    id: 'step3',
                    title: 'Confirmar Criação',
                    description: 'Revisar dados e confirmar criação do TC',
                    type: 'confirmation',
                    status: 'pending',
                  },
                  {
                    id: 'step4',
                    title: 'Criando TC na Blockchain',
                    description: 'Processando criação na rede Hyperledger...',
                    type: 'progress',
                    status: 'pending',
                    duration: 6000,
                  },
                ],
              }),
          },
          {
            label: 'Ver Pré-visualização',
            action: () => toast('Abrindo pré-visualização do TC...'),
          },
        ],
      };
    }

    if (input.includes('help') || input.includes('ajuda') || input.includes('como')) {
      return {
        content:
          '💡 **ARIA AI Operacional - Central de Ajuda**\n\nComo seu assistente operacional, posso executar:\n\n**💰 Gestão Fiscal:**\n• "compensar débitos" - Compensação automática\n• "analisar créditos" - Análise de oportunidades\n• "calcular impostos" - Simulações fiscais\n\n**🛒 Marketplace:**\n• "vender TCs" - Listagem automática\n• "comprar créditos" - Busca de oportunidades\n• "preços de mercado" - Análise de preços\n\n**⛓️ Blockchain:**\n• "criar TC" - Emissão de títulos\n• "tokenizar" - Processo blockchain\n• "validar documentos" - Verificação\n\nQual operação você gostaria que eu execute?',
        metadata: {
          confidence: 0.87,
          sources: ['Central de Ajuda', 'Documentação', 'Base de conhecimento'],
          category: 'help',
        },
        actions: [
          {
            label: 'Ver Tutoriais',
            action: () => toast('Abrindo central de tutoriais...'),
          },
          {
            label: 'Suporte Técnico',
            action: () => toast('Conectando com suporte técnico...'),
          },
        ],
      };
    }

    // Resposta padrão inteligente
    const defaultResponses = [
      {
        content:
          '🤖 **ARIA AI Ativa**\n\nEntendi! Como seu assistente operacional, posso executar:\n\n**💰 Gestão Fiscal:**\n• "compensar débitos" - Compensação automática\n• "analisar créditos" - Análise de oportunidades\n• "calcular impostos" - Simulações fiscais\n\n**🛒 Marketplace:**\n• "vender TCs" - Listagem automática\n• "comprar créditos" - Busca de oportunidades\n• "preços de mercado" - Análise de preços\n\n**⛓️ Blockchain:**\n• "criar TC" - Emissão de títulos\n• "tokenizar" - Processo blockchain\n• "validar documentos" - Verificação\n\nQual operação você gostaria que eu execute?',
        metadata: {
          confidence: 0.85,
          sources: ['IA Conversacional', 'Base de conhecimento'],
          category: 'general',
        },
      },
      {
        content:
          'Processando sua solicitação... 🔍\n\nCom base na sua pergunta, aqui estão algumas opções que podem ajudar:\n\n📊 Análise fiscal completa\n💰 Verificação de créditos\n🔄 Compensação automática\n📄 Geração de relatórios\n\nQual dessas opções te interessa mais?',
        metadata: {
          confidence: 0.82,
          sources: ['Sistema ARIA', 'Análise contextual'],
          category: 'suggestion',
        },
      },
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async (text?: string) => {
    const content = text !== undefined ? text : inputText;
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simula processamento da IA
    setTimeout(() => {
      const response = generateIntelligentResponse(content);

      const ariaMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.content,
        sender: 'aria',
        timestamp: new Date(),
        metadata: response.metadata,
        actions: response.actions,
      };

      setMessages(prev => [...prev, ariaMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    // Detectar ações que devem abrir modal diretamente
    if (action.action === 'compensar_modal') {
      executeActionWithModal({
        id: '1',
        title: 'Executar Compensação',
        description: 'Processar compensação automática completa',
        estimatedSavings: 23000,
        steps: [
          {
            id: 'step1',
            title: 'Selecionar Créditos',
            description: 'Escolha os créditos que deseja utilizar na compensação',
            type: 'selection',
            status: 'pending',
            options: [
              {
                id: 'icms',
                label: 'ICMS - R$ 45.000',
                value: 'ICMS - R$ 45.000',
                description: 'Créditos de ICMS disponíveis',
                recommended: true,
                savings: 45000,
                risk: 'low',
              },
              {
                id: 'pis',
                label: 'PIS/COFINS - R$ 28.000',
                value: 'PIS/COFINS - R$ 28.000',
                description: 'Créditos de PIS/COFINS',
                savings: 28000,
                risk: 'low',
              },
              {
                id: 'irpj',
                label: 'IRPJ - R$ 15.000',
                value: 'IRPJ - R$ 15.000',
                description: 'Créditos de IRPJ',
                savings: 15000,
                risk: 'medium',
              },
            ],
          },
          {
            id: 'step2',
            title: 'Selecionar Débitos',
            description: 'Escolha os débitos para compensação',
            type: 'selection',
            status: 'pending',
            options: [
              {
                id: 'darf1',
                label: 'DARF IRPJ - R$ 32.000',
                value: 'DARF IRPJ - R$ 32.000',
                description: 'Vencimento: 31/01/2025',
                risk: 'high',
              },
              {
                id: 'darf2',
                label: 'DARF CSLL - R$ 18.000',
                value: 'DARF CSLL - R$ 18.000',
                description: 'Vencimento: 28/02/2025',
                risk: 'medium',
              },
              {
                id: 'darf3',
                label: 'GPS - R$ 12.000',
                value: 'GPS - R$ 12.000',
                description: 'Vencimento: 15/01/2025',
                risk: 'high',
              },
            ],
          },
          {
            id: 'step3',
            title: 'Confirmar Operação',
            description: 'Revisar e confirmar a compensação',
            type: 'confirmation',
            status: 'pending',
          },
        ],
      });
    } else if (action.action === 'vender_modal') {
      executeActionWithModal({
        id: '2',
        title: 'Listar no Marketplace',
        description: 'Criar listagem para venda de títulos',
        estimatedSavings: 34000,
        steps: [
          {
            id: 'step1',
            title: 'Selecionar TCs para Venda',
            description: 'Escolha os títulos de crédito que deseja listar no marketplace',
            type: 'selection',
            status: 'pending',
            options: [
              {
                id: 'tc1',
                label: 'TC ICMS - R$ 34.000',
                value: 'TC ICMS - R$ 34.000',
                description: 'Crédito ICMS - demanda alta',
                recommended: true,
                savings: 32300,
                risk: 'low',
              },
              {
                id: 'tc2',
                label: 'TC PIS/COFINS - R$ 12.000',
                value: 'TC PIS/COFINS - R$ 12.000',
                description: 'Crédito PIS/COFINS - mercado estável',
                savings: 11040,
                risk: 'low',
              },
              {
                id: 'tc3',
                label: 'TC IRPJ - R$ 8.500',
                value: 'TC IRPJ - R$ 8.500',
                description: 'Crédito IRPJ - liquidez menor',
                savings: 7650,
                risk: 'medium',
              },
            ],
          },
          {
            id: 'step2',
            title: 'Definir Preço de Venda',
            description: 'Configure o percentual de desconto sobre o valor nominal',
            type: 'selection',
            status: 'pending',
            options: [
              {
                id: 'price1',
                label: '95% do valor nominal',
                value: '95% do valor nominal',
                description: 'Desconto mínimo - venda rápida garantida',
                recommended: true,
                risk: 'low',
              },
              {
                id: 'price2',
                label: '92% do valor nominal',
                value: '92% do valor nominal',
                description: 'Desconto médio - boa liquidez',
                risk: 'low',
              },
              {
                id: 'price3',
                label: '90% do valor nominal',
                value: '90% do valor nominal',
                description: 'Desconto moderado - mercado equilibrado',
                risk: 'low',
              },
            ],
          },
          {
            id: 'step3',
            title: 'Confirmar Listagem',
            description: 'Revisar dados e confirmar listagem no marketplace',
            type: 'confirmation',
            status: 'pending',
          },
        ],
      });
    } else if (action.action === 'criar_tc_modal') {
      executeActionWithModal({
        id: '4',
        title: 'Criar Título de Crédito',
        description: 'Emitir novo título de crédito',
        estimatedSavings: 0,
        steps: [
          {
            id: 'step1',
            title: 'Tipo de Crédito',
            description: 'Selecione o tipo de título de crédito a ser criado',
            type: 'selection',
            status: 'pending',
            options: [
              {
                id: 'icms',
                label: 'ICMS',
                value: 'ICMS',
                description: 'Imposto sobre Circulação de Mercadorias',
                recommended: true,
                risk: 'low',
              },
              {
                id: 'pis',
                label: 'PIS/COFINS',
                value: 'PIS/COFINS',
                description: 'Programa de Integração Social / COFINS',
                risk: 'low',
              },
              {
                id: 'irpj',
                label: 'IRPJ',
                value: 'IRPJ',
                description: 'Imposto de Renda Pessoa Jurídica',
                risk: 'medium',
              },
              {
                id: 'csll',
                label: 'CSLL',
                value: 'CSLL',
                description: 'Contribuição Social sobre Lucro Líquido',
                risk: 'medium',
              },
            ],
          },
          {
            id: 'step2',
            title: 'Valor do Crédito',
            description: 'Defina o valor nominal do título de crédito',
            type: 'selection',
            status: 'pending',
            options: [
              {
                id: 'val1',
                label: 'R$ 10.000',
                value: 'R$ 10.000',
                description: 'Valor pequeno - processamento rápido',
                risk: 'low',
              },
              {
                id: 'val2',
                label: 'R$ 25.000',
                value: 'R$ 25.000',
                description: 'Valor médio - padrão do mercado',
                recommended: true,
                risk: 'low',
              },
              {
                id: 'val3',
                label: 'R$ 50.000',
                value: 'R$ 50.000',
                description: 'Valor alto - requer validação adicional',
                risk: 'medium',
              },
            ],
          },
          {
            id: 'step3',
            title: 'Confirmar Criação',
            description: 'Revisar dados e confirmar criação do TC',
            type: 'confirmation',
            status: 'pending',
          },
        ],
      });
    } else if (action.action === 'tokenizar_modal') {
      executeActionWithModal({
        id: '3',
        title: 'Tokenizar Créditos',
        description: 'Converter títulos em tokens blockchain',
        estimatedSavings: 0,
        steps: [
          {
            id: 'step1',
            title: 'Selecionar TCs para Tokenização',
            description: 'Escolha os títulos que serão convertidos em tokens',
            type: 'selection',
            status: 'pending',
            options: [
              {
                id: 'tc1',
                label: 'TC ICMS #001 - R$ 67.000',
                value: 'TC ICMS #001 - R$ 67.000',
                description: 'TC validado - pronto para tokenização',
                recommended: true,
                risk: 'low',
              },
              {
                id: 'tc2',
                label: 'TC PIS #002 - R$ 45.000',
                value: 'TC PIS #002 - R$ 45.000',
                description: 'TC validado - documentação completa',
                risk: 'low',
              },
              {
                id: 'tc3',
                label: 'TC IRPJ #003 - R$ 44.000',
                value: 'TC IRPJ #003 - R$ 44.000',
                description: 'TC validado - aguardando tokenização',
                risk: 'low',
              },
            ],
          },
          {
            id: 'step2',
            title: 'Configurar Token',
            description: 'Definir parâmetros do token digital',
            type: 'selection',
            status: 'pending',
            options: [
              {
                id: 'erc721',
                label: 'ERC-721 (NFT)',
                value: 'ERC-721 (NFT)',
                description: 'Token único - ideal para TCs',
                recommended: true,
                risk: 'low',
              },
              {
                id: 'erc20',
                label: 'ERC-20 (Fungível)',
                value: 'ERC-20 (Fungível)',
                description: 'Token divisível - para fracionamento',
                risk: 'medium',
              },
            ],
          },
          {
            id: 'step3',
            title: 'Confirmar Tokenização',
            description: 'Revisar dados e confirmar criação dos tokens',
            type: 'confirmation',
            status: 'pending',
          },
        ],
      });
    } else {
      // Para ações normais, manda mensagem de texto
      handleSendMessage(action.action);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      {!isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
            boxShadow: '0 8px 32px rgba(37, 99, 235, 0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onClick={() => setIsOpen(true)}
        >
          <div style={{ fontSize: '30px' }}>🤖</div>
          <div
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: '#10b981',
              border: '3px solid white',
            }}
          />
        </div>
      )}

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: '40px',
            right: '24px',
            bottom: '24px',
            width: '1200px',
            background: 'white',
            borderRadius: '24px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.18)',
            display: 'flex',
            overflow: 'hidden',
            zIndex: 999999,
          }}
        >
          {/* Chat principal */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              background: '#f8fafc',
              height: '100%',
              position: 'relative',
            }}
          >
            {/* Header fixo - SEMPRE NO TOPO */}
            <div
              style={{
                padding: '24px 32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #e5e7eb',
                background: 'white',
                borderRadius: '24px 0 0 0',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                height: '80px',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span role="img" aria-label="robo">
                  🤖
                </span>{' '}
                ARIA - Assistente Inteligente
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  border: 'none',
                  color: 'white',
                  fontSize: 20,
                  cursor: 'pointer',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                  position: 'absolute',
                  top: '20px',
                  right: '32px',
                  zIndex: 1001,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.15)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.5)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                }}
              >
                ×
              </button>
            </div>

            {/* Área de mensagens com scroll - COM ESPAÇO PARA O HEADER */}
            <div
              style={{
                flex: 1,
                padding: '120px 32px 20px 32px',
                overflowY: 'auto',
                height: 'calc(100vh - 200px)',
                paddingBottom: '120px',
              }}
            >
              {messages.map(message => (
                <div
                  key={message.id}
                  style={{
                    marginBottom: '24px',
                    display: 'flex',
                    flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                    gap: '12px',
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background:
                        message.sender === 'user'
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      flexShrink: 0,
                    }}
                  >
                    {message.sender === 'user' ? '👤' : '🤖'}
                  </div>

                  {/* Mensagem */}
                  <div
                    style={{
                      maxWidth: '70%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        background: message.sender === 'user' ? '#e0f2fe' : 'white',
                        padding: '16px 20px',
                        borderRadius:
                          message.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.5',
                      }}
                    >
                      {message.text}
                    </div>

                    {/* Metadata */}
                    {message.metadata && (
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          flexWrap: 'wrap',
                          paddingLeft: '4px',
                        }}
                      >
                        {message.metadata.confidence && (
                          <span
                            style={{
                              background: '#f0f9ff',
                              color: '#0369a1',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              border: '1px solid #e0f2fe',
                            }}
                          >
                            {Math.round(message.metadata.confidence * 100)}% confiança
                          </span>
                        )}
                        {message.metadata.sources && (
                          <span
                            style={{
                              background: '#f0fdf4',
                              color: '#166534',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              border: '1px solid #dcfce7',
                            }}
                          >
                            {message.metadata.sources.length} fontes
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    {message.actions && (
                      <div style={{ display: 'flex', gap: '8px', paddingLeft: '4px' }}>
                        {message.actions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={action.action}
                            style={{
                              background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
                              color: 'white',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.transform = 'translateY(-1px)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <div
                      style={{
                        fontSize: '11px',
                        color: '#6b7280',
                        paddingLeft: '4px',
                      }}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div
                  style={{
                    marginBottom: '24px',
                    display: 'flex',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      flexShrink: 0,
                    }}
                  >
                    🤖
                  </div>

                  <div
                    style={{
                      background: 'white',
                      padding: '16px 20px',
                      borderRadius: '20px 20px 20px 4px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      display: 'flex',
                      gap: '4px',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#6b7280',
                        animation: 'pulse 1.5s ease-in-out infinite',
                      }}
                    />
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#6b7280',
                        animation: 'pulse 1.5s ease-in-out infinite 0.1s',
                      }}
                    />
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#6b7280',
                        animation: 'pulse 1.5s ease-in-out infinite 0.2s',
                      }}
                    />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area fixa - SEMPRE NA BASE */}
            <div
              style={{
                padding: '20px 32px',
                background: 'white',
                borderTop: '1px solid #e5e7eb',
                borderRadius: '0 0 0 24px',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <textarea
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem... (Enter para enviar)"
                  style={{
                    flex: 1,
                    minHeight: '44px',
                    maxHeight: '120px',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '22px',
                    resize: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    lineHeight: '1.4',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#2563eb';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#e5e7eb';
                  }}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim()}
                  style={{
                    background: inputText.trim()
                      ? 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)'
                      : '#e5e7eb',
                    color: inputText.trim() ? 'white' : '#9ca3af',
                    border: 'none',
                    width: '44px',
                    height: '44px',
                    borderRadius: '22px',
                    cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                >
                  ➤
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar direita - COM TEXTOS GARANTIDOS */}
          <div
            style={{
              width: '350px',
              background: 'white',
              borderLeft: '1px solid #e5e7eb',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            {/* Header da sidebar */}
            <div
              style={{
                padding: '24px 20px',
                borderBottom: '1px solid #e5e7eb',
                background: '#f8fafc',
                borderRadius: '0 24px 0 0',
                flexShrink: 0,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                🎮 Painel de Controle
              </h3>
            </div>

            {/* Ações Rápidas - GARANTIR QUE APAREÇAM */}
            <div style={{ padding: '20px', flexShrink: 0 }}>
              <h4
                style={{
                  margin: '0 0 16px 0',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6b7280',
                }}
              >
                ⚡ Ações Rápidas
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '14px 16px',
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#374151',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      width: '100%',
                      minHeight: '60px',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = '#2563eb';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <span style={{ fontSize: '18px', flexShrink: 0 }}>{action.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: '600',
                          marginBottom: '4px',
                          fontSize: '13px',
                          color: '#1f2937',
                        }}
                      >
                        {action.label}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: '#6b7280',
                          lineHeight: '1.3',
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
                        }}
                      >
                        {action.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Operações Ativas */}
            <div style={{ padding: '0 20px 20px', flex: 1, minHeight: 0 }}>
              <h4
                style={{
                  margin: '0 0 16px 0',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6b7280',
                }}
              >
                🔄 Operações Ativas
              </h4>
              <div
                style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: '#9ca3af',
                  fontSize: '12px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px dashed #e5e7eb',
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
                <div>Nenhuma operação em andamento</div>
                <div style={{ fontSize: '10px', marginTop: '4px', color: '#d1d5db' }}>
                  As operações aparecem aqui quando iniciadas
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Execução Interativa */}
      {/* Notificações - Modelo igual ao ARIA Dashboard */}
      {notifications.length > 0 && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {notifications.map((notification: any) => (
            <div
              key={notification.id}
              style={{
                width: '320px',
                backgroundColor: 'white',
                border:
                  notification.type === 'success'
                    ? '1px solid #d1fae5'
                    : notification.type === 'warning'
                      ? '1px solid #fef3c7'
                      : notification.type === 'error'
                        ? '1px solid #fee2e2'
                        : '1px solid #dbeafe',
                borderRadius: '8px',
                boxShadow:
                  '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '16px',
                  backgroundColor:
                    notification.type === 'success'
                      ? '#f0fdf4'
                      : notification.type === 'warning'
                        ? '#fffbeb'
                        : notification.type === 'error'
                          ? '#fef2f2'
                          : '#eff6ff',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div
                      style={{
                        marginTop: '2px',
                        color:
                          notification.type === 'success'
                            ? '#16a34a'
                            : notification.type === 'warning'
                              ? '#d97706'
                              : notification.type === 'error'
                                ? '#dc2626'
                                : '#2563eb',
                      }}
                    >
                      {notification.type === 'success'
                        ? '✅'
                        : notification.type === 'warning'
                          ? '⚠️'
                          : notification.type === 'error'
                            ? '❌'
                            : 'ℹ️'}
                    </div>
                    <div>
                      <h4
                        style={{
                          margin: '0 0 4px 0',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#111827',
                        }}
                      >
                        {notification.title}
                      </h4>
                      <p
                        style={{
                          margin: '0 0 4px 0',
                          fontSize: '14px',
                          color: '#6b7280',
                        }}
                      >
                        {notification.message}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '12px',
                          color: '#9ca3af',
                        }}
                      >
                        {new Date(notification.timestamp).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setNotifications(prev => prev.filter((n: any) => n.id !== notification.id))
                    }
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      fontSize: '12px',
                      cursor: 'pointer',
                      padding: '2px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '20px',
                      height: '20px',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showExecutionModal && executingAction && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '70vh',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* Header do Modal */}
            <div
              style={{
                padding: '24px',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#111827' }}>
                  {executingAction.title}
                </h2>
                <button
                  onClick={() => setShowExecutionModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280',
                    padding: '4px',
                  }}
                >
                  ×
                </button>
              </div>
              <p style={{ margin: '8px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                {executingAction.description}
              </p>
            </div>

            {/* Conteúdo do Modal */}
            <div style={{ padding: '24px', maxHeight: 'calc(70vh - 140px)', overflowY: 'auto' }}>
              {executingAction.steps && executingAction.steps[currentStep] && (
                <div>
                  <h3
                    style={{
                      margin: '0 0 12px 0',
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#111827',
                    }}
                  >
                    {executingAction.steps[currentStep].title}
                  </h3>
                  <p style={{ margin: '0 0 20px 0', color: '#6b7280', fontSize: '14px' }}>
                    {executingAction.steps[currentStep].description}
                  </p>

                  {executingAction.steps[currentStep].type === 'selection' &&
                    executingAction.steps[currentStep].options && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {executingAction.steps[currentStep].options?.map((option: any) => (
                          <div
                            key={option.id}
                            style={{
                              padding: '16px',
                              border: option.recommended
                                ? '2px solid #3b82f6'
                                : '1px solid #e5e7eb',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              backgroundColor: option.recommended ? '#eff6ff' : 'white',
                            }}
                            onClick={() => nextStep(option.value)}
                            onMouseEnter={e => {
                              e.currentTarget.style.backgroundColor = option.recommended
                                ? '#dbeafe'
                                : '#f9fafb';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.backgroundColor = option.recommended
                                ? '#eff6ff'
                                : 'white';
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <h4
                                  style={{
                                    margin: '0 0 4px 0',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: option.recommended ? '#1d4ed8' : '#111827',
                                  }}
                                >
                                  {option.label}
                                  {option.recommended && (
                                    <span
                                      style={{
                                        marginLeft: '8px',
                                        padding: '2px 8px',
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        fontSize: '12px',
                                        borderRadius: '12px',
                                        fontWeight: '500',
                                      }}
                                    >
                                      Recomendado
                                    </span>
                                  )}
                                </h4>
                                <p style={{ margin: '0', color: '#6b7280', fontSize: '14px' }}>
                                  {option.description}
                                </p>
                                {option.savings && (
                                  <p
                                    style={{
                                      margin: '4px 0 0 0',
                                      color: '#059669',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                    }}
                                  >
                                    💰 Economia: R$ {option.savings.toLocaleString('pt-BR')}
                                  </p>
                                )}
                              </div>
                              {option.risk && (
                                <span
                                  style={{
                                    padding: '4px 8px',
                                    fontSize: '11px',
                                    borderRadius: '6px',
                                    fontWeight: '500',
                                    backgroundColor:
                                      option.risk === 'low'
                                        ? '#dcfce7'
                                        : option.risk === 'medium'
                                          ? '#fef3c7'
                                          : '#fee2e2',
                                    color:
                                      option.risk === 'low'
                                        ? '#166534'
                                        : option.risk === 'medium'
                                          ? '#92400e'
                                          : '#991b1b',
                                  }}
                                >
                                  {option.risk === 'low'
                                    ? 'Baixo Risco'
                                    : option.risk === 'medium'
                                      ? 'Médio Risco'
                                      : 'Alto Risco'}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  {executingAction.steps[currentStep].type === 'confirmation' && (
                    <div
                      style={{
                        padding: '20px',
                        backgroundColor: '#f0f9ff',
                        border: '1px solid #0284c7',
                        borderRadius: '8px',
                        textAlign: 'center',
                      }}
                    >
                      <h4 style={{ margin: '0 0 12px 0', color: '#0284c7', fontSize: '16px' }}>
                        ✅ Confirmar Operação
                      </h4>
                      <p style={{ margin: '0 0 16px 0', color: '#374151', fontSize: '14px' }}>
                        Clique para confirmar e executar a operação
                      </p>
                      <button
                        onClick={() => nextStep(true)}
                        style={{
                          padding: '12px 24px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.backgroundColor = '#2563eb';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor = '#3b82f6';
                        }}
                      >
                        Confirmar e Executar
                      </button>
                    </div>
                  )}

                  {executingAction.steps[currentStep].type === 'progress' && (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                      <div
                        style={{
                          fontSize: '48px',
                          marginBottom: '16px',
                          animation: 'spin 2s linear infinite',
                        }}
                      >
                        ⚙️
                      </div>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
                        Executando...
                      </h4>
                      <p style={{ margin: '0 0 20px 0', color: '#6b7280', fontSize: '14px' }}>
                        {executingAction.steps[currentStep].description}
                      </p>
                      <div
                        style={{
                          width: '100%',
                          height: '8px',
                          backgroundColor: '#e5e7eb',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${progressValue}%`,
                            height: '100%',
                            backgroundColor: '#3b82f6',
                            transition: 'width 0.2s ease',
                            borderRadius: '4px',
                          }}
                        />
                      </div>
                      <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                        {Math.round(progressValue)}% concluído
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer com Progress */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                  Etapa {currentStep + 1} de {executingAction.steps?.length || 1}
                </span>
                <div
                  style={{
                    width: '200px',
                    height: '4px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${((currentStep + 1) / (executingAction.steps?.length || 1)) * 100}%`,
                      height: '100%',
                      backgroundColor: '#3b82f6',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
