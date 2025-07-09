import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
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
  RefreshCw,
  DollarSign,
  Activity,
  PieChart,
  BarChart3,
  Users,
  Wallet,
  Building,
  CreditCard,
  Globe,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Play,
  Pause,
  Settings,
  Filter,
  Terminal,
  Code,
  Database,
  Network,
  Cpu,
  HardDrive,
  Wifi,
  MonitorSpeaker,
  Layers,
  GitBranch,
  Lock,
  Unlock,
  Workflow,
  Gauge,
  Timer,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Plus,
  X,
  ShoppingCart,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AIMessage {
  id: string;
  type: 'user' | 'assistant' | 'system' | 'action';
  content: string;
  timestamp: Date;
  category?: 'analysis' | 'recommendation' | 'alert' | 'optimization' | 'action' | 'execution';
  confidence?: number;
  actions?: AIAction[];
  attachments?: string[];
  processing?: boolean;
}

interface AIAction {
  id: string;
  title: string;
  description: string;
  type: 'execute' | 'analyze' | 'optimize' | 'navigate' | 'report' | 'create' | 'update' | 'delete';
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedSavings?: number;
  implementationTime?: number;
  complexity: 'simple' | 'medium' | 'complex';
  canExecute: boolean;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  progress?: number;
  requiresInteraction?: boolean;
  steps?: ExecutionStep[];
  buttonText?: string;
  buttonIcon?: string;
}

interface ExecutionStep {
  id: string;
  title: string;
  description: string;
  type: 'selection' | 'confirmation' | 'input' | 'progress' | 'result';
  status: 'pending' | 'active' | 'completed' | 'skipped';
  options?: SelectionOption[];
  selectedValue?: any;
  result?: string;
  duration?: number;
}

interface SelectionOption {
  id: string;
  label: string;
  value: any;
  description?: string;
  recommended?: boolean;
  savings?: number;
  risk?: 'low' | 'medium' | 'high';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: Date;
  actionId?: string;
  autoClose?: boolean;
  duration?: number;
}

interface OperationDisplay {
  id: string;
  title: string;
  type: 'compensacao' | 'marketplace' | 'blockchain' | 'fiscal' | 'analytics' | 'compliance';
  status: 'idle' | 'active' | 'completed' | 'error';
  progress: number;
  startTime?: Date;
  estimatedDuration?: number;
  details: string[];
  result?: any;
}

interface ARIAConfig {
  autoExecute: boolean;
  voiceEnabled: boolean;
  notificationsEnabled: boolean;
  confidenceThreshold: number;
  operationTimeout: number;
  debugMode: boolean;
  autoSave: boolean;
  realTimeUpdates: boolean;
}

export default function ARIADashboard() {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'system',
      content:
        '🤖 **ARIA AI** inicializada com sucesso!\n\n**Funcionalidades ativas:**\n• Gestão Fiscal Automatizada\n• Compensações Inteligentes\n• Marketplace AI\n• Blockchain Operations\n• Analytics Avançado\n• Compliance Monitor\n\n💡 **Dica:** Digite comandos como "compensar débitos", "analisar créditos", "criar TC" ou "vender no marketplace"',
      timestamp: new Date(),
      category: 'action',
      confidence: 100,
    },
  ]);

  const [activeOperations, setActiveOperations] = useState<OperationDisplay[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState('agent');
  const [operationsExpanded, setOperationsExpanded] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [executingAction, setExecutingAction] = useState<AIAction | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showExecutionModal, setShowExecutionModal] = useState(false);
  const [config, setConfig] = useState<ARIAConfig>({
    autoExecute: false,
    voiceEnabled: true,
    notificationsEnabled: true,
    confidenceThreshold: 80,
    operationTimeout: 300,
    debugMode: false,
    autoSave: true,
    realTimeUpdates: true,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);

  // Stats em tempo real
  const [ariaStats, setAriaStats] = useState({
    totalOperations: 247,
    successRate: 96.8,
    averageResponseTime: 1.2,
    creditsAnalyzed: 1840000,
    automatedSavings: 245000,
    activeMonitors: 12,
    lastUpdate: new Date(),
  });

  // Auto-scroll do chat
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simular progresso do step de progress
  useEffect(() => {
    if (
      showExecutionModal &&
      executingAction &&
      executingAction.steps &&
      executingAction.steps[currentStep]?.type === 'progress'
    ) {
      const step = executingAction.steps[currentStep];
      const duration = step.duration || 3000;

      const timer = setTimeout(() => {
        nextStep('completed');
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [showExecutionModal, currentStep, executingAction]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Simular operações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Atualizar operações ativas
      setActiveOperations(prev =>
        prev.map(op => {
          if (op.status === 'active' && op.progress < 100) {
            const newProgress = Math.min(op.progress + Math.random() * 15, 100);
            const newDetails = [...op.details];

            if (newProgress > 25 && !newDetails.includes('Validando dados...')) {
              newDetails.push('Validando dados...');
            }
            if (newProgress > 50 && !newDetails.includes('Processando...')) {
              newDetails.push('Processando...');
            }
            if (newProgress > 75 && !newDetails.includes('Finalizando...')) {
              newDetails.push('Finalizando...');
            }

            return {
              ...op,
              progress: newProgress,
              details: newDetails,
              status: newProgress >= 100 ? 'completed' : 'active',
            };
          }
          return op;
        })
      );

      // Atualizar stats
      setAriaStats(prev => ({
        ...prev,
        lastUpdate: new Date(),
        totalOperations: prev.totalOperations + Math.floor(Math.random() * 2),
        averageResponseTime: 0.8 + Math.random() * 0.8,
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Comando handlers da ARIA
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

    // Analisar comando e gerar resposta
    const response = await processARIACommand(currentMessage);

    setTimeout(() => {
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  // Processamento inteligente de comandos
  const processARIACommand = async (command: string): Promise<AIMessage> => {
    const cmd = command.toLowerCase();

    // Comandos de Compensação
    if (cmd.includes('compensar') || cmd.includes('compensação')) {
      const operation = createOperation({
        title: 'Compensação Automática',
        type: 'compensacao',
        details: ['Analisando créditos disponíveis...', 'Identificando débitos elegíveis...'],
      });

      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `⚖️ **Iniciando Compensação Inteligente**\n\n**Análise Preliminar:**\n• Créditos disponíveis: R$ 191.000\n• Débitos pendentes: R$ 214.000\n• Economia potencial: R$ 23.000\n\n**Ações executadas:**\n✅ Validação de créditos\n🔄 Processando compensação automática\n⏱️ Tempo estimado: 3-5 minutos\n\n📊 **Acompanhe o progresso** no painel de operações →`,
        timestamp: new Date(),
        category: 'execution',
        confidence: 94,
        actions: [
          {
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
                    value: 45000,
                    description: 'Créditos de ICMS disponíveis',
                    recommended: true,
                    savings: 45000,
                    risk: 'low',
                  },
                  {
                    id: 'pis',
                    label: 'PIS/COFINS - R$ 28.000',
                    value: 28000,
                    description: 'Créditos de PIS/COFINS',
                    savings: 28000,
                    risk: 'low',
                  },
                  {
                    id: 'irpj',
                    label: 'IRPJ - R$ 15.000',
                    value: 15000,
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
                    value: 32000,
                    description: 'Vencimento: 31/01/2025',
                    risk: 'high',
                  },
                  {
                    id: 'darf2',
                    label: 'DARF CSLL - R$ 18.000',
                    value: 18000,
                    description: 'Vencimento: 28/02/2025',
                    risk: 'medium',
                  },
                  {
                    id: 'darf3',
                    label: 'GPS - R$ 12.000',
                    value: 12000,
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
          },
        ],
      };
    }

    // Comandos de Marketplace - Venda
    if (cmd.includes('marketplace') || cmd.includes('vender')) {
      const operation = createOperation({
        title: 'Análise de Marketplace',
        type: 'marketplace',
        details: ['Analisando preços de mercado...', 'Identificando oportunidades...'],
      });

      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `🛒 **Marketplace AI Ativado - Venda**\n\n**Análise de Mercado:**\n• 45 TCs disponíveis para venda\n• Preço médio: R$ 0,92 por real\n• Demanda atual: ALTA 📈\n\n**Oportunidades identificadas:**\n💰 TC ICMS - R$ 34.000 (melhor taxa: 95%)\n💰 TC PIS/COFINS - R$ 12.000 (melhor taxa: 92%)\n💰 TC IRPJ - R$ 8.500 (melhor taxa: 90%)\n\n🎯 **Recomendação:** Vender ICMS agora - preço em alta!`,
        timestamp: new Date(),
        category: 'analysis',
        confidence: 88,
        actions: [
          {
            id: '2',
            title: 'Executar Venda no Marketplace',
            description: 'Listar TCs selecionados para venda automática',
            type: 'execute',
            priority: 'high',
            estimatedSavings: 34000,
            complexity: 'medium',
            canExecute: true,
            status: 'pending',
            requiresInteraction: true,
            buttonText: 'Iniciar Venda',
            buttonIcon: 'DollarSign',
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
                    value: { type: 'ICMS', amount: 34000 },
                    description: 'Crédito ICMS - demanda alta',
                    recommended: true,
                    savings: 32300,
                    risk: 'low',
                  },
                  {
                    id: 'tc2',
                    label: 'TC PIS/COFINS - R$ 12.000',
                    value: { type: 'PIS/COFINS', amount: 12000 },
                    description: 'Crédito PIS/COFINS - mercado estável',
                    savings: 11040,
                    risk: 'low',
                  },
                  {
                    id: 'tc3',
                    label: 'TC IRPJ - R$ 8.500',
                    value: { type: 'IRPJ', amount: 8500 },
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
                    value: 0.95,
                    description: 'Desconto mínimo - venda rápida garantida',
                    recommended: true,
                    risk: 'low',
                  },
                  {
                    id: 'price2',
                    label: '92% do valor nominal',
                    value: 0.92,
                    description: 'Desconto médio - boa liquidez',
                    risk: 'low',
                  },
                  {
                    id: 'price3',
                    label: '90% do valor nominal',
                    value: 0.9,
                    description: 'Desconto moderado - mercado equilibrado',
                    risk: 'low',
                  },
                  {
                    id: 'price4',
                    label: '87% do valor nominal',
                    value: 0.87,
                    description: 'Desconto alto - venda com pressa',
                    risk: 'medium',
                  },
                  {
                    id: 'price5',
                    label: '85% do valor nominal',
                    value: 0.85,
                    description: 'Desconto elevado - liquidação rápida',
                    risk: 'medium',
                  },
                  {
                    id: 'price6',
                    label: '82% do valor nominal',
                    value: 0.82,
                    description: 'Desconto máximo - urgência extrema',
                    risk: 'high',
                  },
                  {
                    id: 'price7',
                    label: '80% do valor nominal',
                    value: 0.8,
                    description: 'Preço de liquidação - último recurso',
                    risk: 'high',
                  },
                  {
                    id: 'price8',
                    label: '75% do valor nominal',
                    value: 0.75,
                    description: 'Preço de emergência',
                    risk: 'high',
                  },
                  {
                    id: 'price9',
                    label: '70% do valor nominal',
                    value: 0.7,
                    description: 'Desconto severo - situação crítica',
                    risk: 'high',
                  },
                  {
                    id: 'price10',
                    label: '60% do valor nominal',
                    value: 0.6,
                    description: 'Desconto máximo - emergência financeira',
                    risk: 'high',
                  },
                ],
              },
              {
                id: 'step3',
                title: 'Confirmar Listagem',
                description: 'Revisar dados e confirmar publicação no marketplace',
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
          },
        ],
      };
    }

    // Comandos de Blockchain
    if (cmd.includes('criar tc') || cmd.includes('tokenizar') || cmd.includes('blockchain')) {
      const operation = createOperation({
        title: 'Tokenização Blockchain',
        type: 'blockchain',
        details: ['Conectando à rede Hyperledger...', 'Validando smart contracts...'],
      });

      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `⛓️ **Blockchain Engine Ativo**\n\n**Status da Rede:**\n• Hyperledger Fabric: 🟢 ONLINE\n• Smart Contracts: ✅ Validados\n• Gas Fee: R$ 2,50\n\n**Pronto para tokenizar:**\n🏦 3 TCs validados (R$ 156.000)\n📋 Documentação completa\n🔐 Chaves criptográficas ativas\n\n**Processo iniciado:** Criação de tokens ERC-721\n⏱️ Tempo estimado: 5-8 minutos`,
        timestamp: new Date(),
        category: 'execution',
        confidence: 96,
        actions: [
          {
            id: '3',
            title: 'Criar Novo Título de Crédito',
            description: 'Emitir um novo TC na blockchain Hyperledger',
            type: 'create',
            priority: 'high',
            estimatedSavings: 0,
            complexity: 'medium',
            canExecute: true,
            status: 'pending',
            requiresInteraction: true,
            buttonText: 'Criar TC',
            buttonIcon: 'Plus',
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
                    value: 10000,
                    description: 'Valor pequeno - processamento rápido',
                    risk: 'low',
                  },
                  {
                    id: 'val2',
                    label: 'R$ 25.000',
                    value: 25000,
                    description: 'Valor médio - padrão do mercado',
                    recommended: true,
                    risk: 'low',
                  },
                  {
                    id: 'val3',
                    label: 'R$ 50.000',
                    value: 50000,
                    description: 'Valor alto - requer validação adicional',
                    risk: 'medium',
                  },
                  {
                    id: 'val4',
                    label: 'Valor personalizado',
                    value: 'custom',
                    description: 'Digite um valor específico',
                    risk: 'medium',
                  },
                ],
              },
              {
                id: 'step3',
                title: 'Documentação',
                description: 'Upload dos documentos comprobatórios',
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
          },
          {
            id: '4',
            title: 'Tokenizar TCs Existentes',
            description: 'Converter TCs em tokens digitais na blockchain',
            type: 'execute',
            priority: 'high',
            estimatedSavings: 156000,
            complexity: 'medium',
            canExecute: true,
            status: 'pending',
            requiresInteraction: true,
            buttonText: 'Tokenizar',
            buttonIcon: 'Network',
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
                    value: { id: 'tc001', amount: 67000 },
                    description: 'TC validado - pronto para tokenização',
                    recommended: true,
                    risk: 'low',
                  },
                  {
                    id: 'tc2',
                    label: 'TC PIS #002 - R$ 45.000',
                    value: { id: 'tc002', amount: 45000 },
                    description: 'TC validado - documentação completa',
                    risk: 'low',
                  },
                  {
                    id: 'tc3',
                    label: 'TC IRPJ #003 - R$ 44.000',
                    value: { id: 'tc003', amount: 44000 },
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
                    value: 'ERC721',
                    description: 'Token único - ideal para TCs',
                    recommended: true,
                    risk: 'low',
                  },
                  {
                    id: 'erc20',
                    label: 'ERC-20 (Fungível)',
                    value: 'ERC20',
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
          },
        ],
      };
    }

    // Comandos de Análise
    if (cmd.includes('analisar') || cmd.includes('relatório') || cmd.includes('analytics')) {
      const operation = createOperation({
        title: 'Análise Avançada',
        type: 'analytics',
        details: ['Coletando dados fiscais...', 'Aplicando ML algorithms...'],
      });

      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `📊 **Analytics AI Processando**\n\n**Análise Fiscal Completa:**\n🔍 2.847 transações analisadas\n📈 17 oportunidades identificadas\n⚠️ 3 riscos detectados\n💡 8 otimizações sugeridas\n\n**Insights Principais:**\n• Economia potencial: R$ 89.000/ano\n• ROI estimado: 340%\n• Compliance score: 94.2%\n\n📋 **Relatório detalhado** sendo gerado...`,
        timestamp: new Date(),
        category: 'analysis',
        confidence: 92,
        actions: [
          {
            id: '5',
            title: 'Gerar Relatório Detalhado',
            description: 'Criar relatório executivo com análises e recomendações',
            type: 'report',
            priority: 'medium',
            estimatedSavings: 89000,
            complexity: 'simple',
            canExecute: true,
            status: 'pending',
            requiresInteraction: true,
            buttonText: 'Gerar Relatório',
            buttonIcon: 'FileText',
            steps: [
              {
                id: 'step1',
                title: 'Período de Análise',
                description: 'Selecione o período para o relatório',
                type: 'selection',
                status: 'pending',
                options: [
                  {
                    id: 'mes',
                    label: 'Último mês',
                    value: 'month',
                    description: 'Análise mensal detalhada',
                    recommended: true,
                    risk: 'low',
                  },
                  {
                    id: 'trimestre',
                    label: 'Último trimestre',
                    value: 'quarter',
                    description: 'Visão trimestral consolidada',
                    risk: 'low',
                  },
                  {
                    id: 'ano',
                    label: 'Último ano',
                    value: 'year',
                    description: 'Análise anual completa',
                    risk: 'low',
                  },
                  {
                    id: 'custom',
                    label: 'Período personalizado',
                    value: 'custom',
                    description: 'Defina datas específicas',
                    risk: 'low',
                  },
                ],
              },
              {
                id: 'step2',
                title: 'Tipo de Relatório',
                description: 'Escolha o foco principal do relatório',
                type: 'selection',
                status: 'pending',
                options: [
                  {
                    id: 'exec',
                    label: 'Executivo',
                    value: 'executive',
                    description: 'Visão gerencial com KPIs principais',
                    recommended: true,
                    risk: 'low',
                  },
                  {
                    id: 'det',
                    label: 'Detalhado',
                    value: 'detailed',
                    description: 'Análise técnica completa',
                    risk: 'low',
                  },
                  {
                    id: 'comp',
                    label: 'Compliance',
                    value: 'compliance',
                    description: 'Foco em conformidade regulatória',
                    risk: 'low',
                  },
                  {
                    id: 'oport',
                    label: 'Oportunidades',
                    value: 'opportunities',
                    description: 'Foco em otimizações fiscais',
                    risk: 'low',
                  },
                ],
              },
              {
                id: 'step3',
                title: 'Confirmar Geração',
                description: 'Revisar parâmetros e iniciar geração do relatório',
                type: 'confirmation',
                status: 'pending',
              },
              {
                id: 'step4',
                title: 'Gerando Relatório',
                description: 'Processando dados e criando relatório...',
                type: 'progress',
                status: 'pending',
                duration: 5000,
              },
            ],
          },
        ],
      };
    }

    // Comandos de Compra
    if (cmd.includes('comprar') || cmd.includes('adquirir')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `🛒 **Marketplace - Compra de Créditos**\n\n**Oportunidades Disponíveis:**\n• 23 ofertas em análise\n• Melhores taxas: 60-95% do valor\n• Volume disponível: R$ 2.3M\n\n**Recomendações por Desconto:**\n💎 TC ICMS - R$ 89.000 (60% valor) - Oportunidade única!\n💎 TC PIS/COFINS - R$ 56.000 (75% valor) - Excelente negócio\n💎 TC CSLL - R$ 23.000 (85% valor) - Boa oportunidade\n\n🎯 **Ação:** Selecione créditos para aquisição`,
        timestamp: new Date(),
        category: 'analysis',
        confidence: 89,
        actions: [
          {
            id: '6',
            title: 'Executar Compra de Créditos',
            description: 'Adquirir títulos de crédito no marketplace',
            type: 'execute',
            priority: 'high',
            estimatedSavings: 89000,
            complexity: 'medium',
            canExecute: true,
            status: 'pending',
            requiresInteraction: true,
            buttonText: 'Comprar Créditos',
            buttonIcon: 'ShoppingCart',
            steps: [
              {
                id: 'step1',
                title: 'Selecionar Créditos para Compra',
                description: 'Escolha os títulos disponíveis para aquisição',
                type: 'selection',
                status: 'pending',
                options: [
                  {
                    id: 'buy1',
                    label: 'TC ICMS - R$ 89.000 (60% valor)',
                    value: { id: 'tc_buy_001', amount: 89000, discount: 0.6 },
                    description: 'Desconto extremo - oportunidade única!',
                    recommended: true,
                    savings: 35600,
                    risk: 'low',
                  },
                  {
                    id: 'buy2',
                    label: 'TC PIS/COFINS - R$ 56.000 (65% valor)',
                    value: { id: 'tc_buy_002', amount: 56000, discount: 0.65 },
                    description: 'Excelente desconto - alta economia',
                    savings: 19600,
                    risk: 'low',
                  },
                  {
                    id: 'buy3',
                    label: 'TC CSLL - R$ 23.000 (70% valor)',
                    value: { id: 'tc_buy_003', amount: 23000, discount: 0.7 },
                    description: 'Bom desconto - economia significativa',
                    savings: 6900,
                    risk: 'low',
                  },
                  {
                    id: 'buy4',
                    label: 'TC IRPJ - R$ 45.000 (75% valor)',
                    value: { id: 'tc_buy_004', amount: 45000, discount: 0.75 },
                    description: 'Desconto moderado - negócio seguro',
                    savings: 11250,
                    risk: 'low',
                  },
                  {
                    id: 'buy5',
                    label: 'TC ICMS - R$ 67.000 (80% valor)',
                    value: { id: 'tc_buy_005', amount: 67000, discount: 0.8 },
                    description: 'Desconto razoável - boa oportunidade',
                    savings: 13400,
                    risk: 'low',
                  },
                  {
                    id: 'buy6',
                    label: 'TC PIS - R$ 34.000 (85% valor)',
                    value: { id: 'tc_buy_006', amount: 34000, discount: 0.85 },
                    description: 'Preço justo - segurança e economia',
                    savings: 5100,
                    risk: 'low',
                  },
                  {
                    id: 'buy7',
                    label: 'TC COFINS - R$ 28.000 (90% valor)',
                    value: { id: 'tc_buy_007', amount: 28000, discount: 0.9 },
                    description: 'Pequeno desconto - máxima segurança',
                    savings: 2800,
                    risk: 'low',
                  },
                  {
                    id: 'buy8',
                    label: 'TC CSLL - R$ 19.000 (95% valor)',
                    value: { id: 'tc_buy_008', amount: 19000, discount: 0.95 },
                    description: 'Preço próximo ao nominal - mínimo risco',
                    savings: 950,
                    risk: 'low',
                  },
                ],
              },
              {
                id: 'step2',
                title: 'Forma de Pagamento',
                description: 'Selecione como realizar o pagamento',
                type: 'selection',
                status: 'pending',
                options: [
                  {
                    id: 'pix',
                    label: 'PIX',
                    value: 'PIX',
                    description: 'Transferência instantânea - sem taxas',
                    recommended: true,
                    risk: 'low',
                  },
                  {
                    id: 'ted',
                    label: 'TED',
                    value: 'TED',
                    description: 'Transferência bancária - taxa R$ 15',
                    risk: 'low',
                  },
                  {
                    id: 'compensacao',
                    label: 'Compensação',
                    value: 'COMPENSACAO',
                    description: 'Usar créditos próprios para pagamento',
                    risk: 'medium',
                  },
                  {
                    id: 'parcelado',
                    label: 'Parcelado (3x)',
                    value: 'PARCELADO',
                    description: 'Dividir em 3 parcelas - juros 2,5% a.m.',
                    risk: 'medium',
                  },
                ],
              },
              {
                id: 'step3',
                title: 'Confirmar Compra',
                description: 'Revisar detalhes e confirmar aquisição',
                type: 'confirmation',
                status: 'pending',
              },
              {
                id: 'step4',
                title: 'Processando Compra',
                description: 'Executando transação no marketplace...',
                type: 'progress',
                status: 'pending',
                duration: 4500,
              },
            ],
          },
        ],
      };
    }

    // Comandos de Validação
    if (cmd.includes('validar') || cmd.includes('compliance')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `🛡️ **Sistema de Validação Ativo**\n\n**Status Compliance:**\n• 47 documentos analisados\n• 3 pendências identificadas\n• Score compliance: 94.2%\n\n**Pendências:**\n⚠️ Certidão CND Federal (vence em 5 dias)\n⚠️ Validação CNPJ Receita Federal\n⚠️ Atualização cadastral SEFAZ\n\n🎯 **Ação:** Regularizar pendências automaticamente`,
        timestamp: new Date(),
        category: 'analysis',
        confidence: 91,
        actions: [
          {
            id: '7',
            title: 'Executar Validação Compliance',
            description: 'Validar e regularizar documentos automaticamente',
            type: 'execute',
            priority: 'high',
            estimatedSavings: 0,
            complexity: 'medium',
            canExecute: true,
            status: 'pending',
            requiresInteraction: true,
            buttonText: 'Validar Documentos',
            buttonIcon: 'Shield',
            steps: [
              {
                id: 'step1',
                title: 'Selecionar Validações',
                description: 'Escolha quais validações executar',
                type: 'selection',
                status: 'pending',
                options: [
                  {
                    id: 'cnd',
                    label: 'Certidão CND Federal',
                    value: 'CND_FEDERAL',
                    description: 'Validar situação fiscal federal',
                    recommended: true,
                    risk: 'high',
                  },
                  {
                    id: 'cnpj',
                    label: 'Validação CNPJ',
                    value: 'CNPJ_VALIDATION',
                    description: 'Consultar situação na Receita Federal',
                    recommended: true,
                    risk: 'medium',
                  },
                  {
                    id: 'sefaz',
                    label: 'Cadastro SEFAZ',
                    value: 'SEFAZ_UPDATE',
                    description: 'Atualizar cadastro estadual',
                    risk: 'medium',
                  },
                  {
                    id: 'all',
                    label: 'Validação Completa',
                    value: 'ALL_VALIDATIONS',
                    description: 'Executar todas as validações',
                    recommended: true,
                    risk: 'low',
                  },
                ],
              },
              {
                id: 'step2',
                title: 'Upload de Documentos',
                description: 'Anexar documentos necessários (se requerido)',
                type: 'confirmation',
                status: 'pending',
              },
              {
                id: 'step3',
                title: 'Executando Validações',
                description: 'Consultando órgãos governamentais...',
                type: 'progress',
                status: 'pending',
                duration: 7000,
              },
            ],
          },
        ],
      };
    }

    // Comandos de Cálculo
    if (cmd.includes('calcular') || cmd.includes('simular') || cmd.includes('impostos')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `🧮 **Calculadora Fiscal Avançada**\n\n**Cenários Disponíveis:**\n• Simulação de regime tributário\n• Cálculo de impostos sobre operações\n• Projeção de economia fiscal\n• Análise de viabilidade\n\n**Últimos Cálculos:**\n📊 Economia projetada: R$ 156.000/ano\n📊 ROI estimado: 285%\n📊 Payback: 4.2 meses\n\n🎯 **Ação:** Configure nova simulação`,
        timestamp: new Date(),
        category: 'analysis',
        confidence: 88,
        actions: [
          {
            id: '8',
            title: 'Executar Simulação Fiscal',
            description: 'Calcular impostos e projeções fiscais',
            type: 'analyze',
            priority: 'medium',
            estimatedSavings: 156000,
            complexity: 'simple',
            canExecute: true,
            status: 'pending',
            requiresInteraction: true,
            buttonText: 'Calcular Impostos',
            buttonIcon: 'Calculator',
            steps: [
              {
                id: 'step1',
                title: 'Tipo de Simulação',
                description: 'Escolha o tipo de cálculo a ser realizado',
                type: 'selection',
                status: 'pending',
                options: [
                  {
                    id: 'regime',
                    label: 'Regime Tributário',
                    value: 'REGIME_SIMULATION',
                    description: 'Simples Nacional vs Lucro Presumido vs Real',
                    recommended: true,
                    risk: 'low',
                  },
                  {
                    id: 'operacao',
                    label: 'Impostos sobre Operação',
                    value: 'OPERATION_TAXES',
                    description: 'Calcular impostos de transação específica',
                    risk: 'low',
                  },
                  {
                    id: 'anual',
                    label: 'Projeção Anual',
                    value: 'ANNUAL_PROJECTION',
                    description: 'Projetar economia fiscal anual',
                    risk: 'low',
                  },
                  {
                    id: 'compensacao',
                    label: 'Simulação Compensação',
                    value: 'COMPENSATION_SIM',
                    description: 'Calcular potencial de compensação',
                    risk: 'low',
                  },
                ],
              },
              {
                id: 'step2',
                title: 'Parâmetros de Cálculo',
                description: 'Definir valores e períodos para simulação',
                type: 'selection',
                status: 'pending',
                options: [
                  {
                    id: 'atual',
                    label: 'Dados Atuais',
                    value: 'CURRENT_DATA',
                    description: 'Usar dados da empresa atual',
                    recommended: true,
                    risk: 'low',
                  },
                  {
                    id: 'projecao',
                    label: 'Projeção de Crescimento',
                    value: 'GROWTH_PROJECTION',
                    description: 'Incluir crescimento estimado',
                    risk: 'low',
                  },
                  {
                    id: 'cenarios',
                    label: 'Múltiplos Cenários',
                    value: 'MULTIPLE_SCENARIOS',
                    description: 'Analisar cenários otimista/pessimista',
                    risk: 'medium',
                  },
                ],
              },
              {
                id: 'step3',
                title: 'Confirmar Simulação',
                description: 'Revisar parâmetros e iniciar cálculos',
                type: 'confirmation',
                status: 'pending',
              },
              {
                id: 'step4',
                title: 'Calculando',
                description: 'Processando simulação fiscal...',
                type: 'progress',
                status: 'pending',
                duration: 3500,
              },
            ],
          },
        ],
      };
    }

    // Comando padrão
    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: `🤖 **ARIA AI Ativa**\n\nEntendi! Como seu assistente operacional, posso executar:\n\n**💰 Gestão Fiscal:**\n• "compensar débitos" - Compensação automática\n• "analisar créditos" - Análise de oportunidades\n• "calcular impostos" - Simulações fiscais\n\n**🛒 Marketplace:**\n• "vender TCs" - Listagem automática\n• "comprar créditos" - Busca de oportunidades\n• "preços de mercado" - Análise de preços\n\n**⛓️ Blockchain:**\n• "criar TC" - Emissão de títulos\n• "tokenizar" - Processo blockchain\n• "validar documentos" - Verificação\n\n**📊 Analytics:**\n• "gerar relatório" - Análises completas\n• "dashboard executivo" - Visão gerencial\n• "compliance check" - Verificação regulatória\n\nQual operação você gostaria que eu execute?`,
      timestamp: new Date(),
      category: 'recommendation',
      confidence: 85,
    };
  };

  // Sistema de notificações
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Máximo 5 notificações

    if (notification.autoClose !== false) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, notification.duration || 5000);
    }
  };

  // Executar ação com interação
  const executeAction = async (action: AIAction) => {
    if (action.requiresInteraction && action.steps) {
      // Execução interativa
      setExecutingAction(action);
      setCurrentStep(0);
      setShowExecutionModal(true);
    } else {
      // Execução simples
      const executionMessage: AIMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `✅ Executando: ${action.title}... Aguarde um momento.`,
        timestamp: new Date(),
        category: 'action',
        confidence: 100,
      };

      setMessages(prev => [...prev, executionMessage]);

      // Simular execução
      setTimeout(() => {
        const completionMessage: AIMessage = {
          id: Date.now().toString(),
          type: 'assistant',
          content: `🎉 Ação completada com sucesso! ${action.description} foi executada. ${action.estimatedSavings ? `Economia estimada: ${formatCurrency(action.estimatedSavings)}` : ''}`,
          timestamp: new Date(),
          category: 'action',
          confidence: 100,
        };
        setMessages(prev => [...prev, completionMessage]);

        // Adicionar notificação
        addNotification({
          title: 'Ação Concluída',
          message: `${action.title} foi executada com sucesso`,
          type: 'success',
        });
      }, 3000);
    }
  };

  // Avançar para próximo step da execução
  const nextStep = (selectedValue?: any) => {
    if (!executingAction || !executingAction.steps) return;

    // Salvar seleção do step atual
    if (selectedValue !== undefined && executingAction.steps[currentStep]) {
      executingAction.steps[currentStep].selectedValue = selectedValue;
      executingAction.steps[currentStep].status = 'completed';
    }

    if (currentStep < executingAction.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      executingAction.steps[currentStep + 1].status = 'active';
    } else {
      // Finalizar execução
      finishExecution();
    }
  };

  // Finalizar execução interativa
  const finishExecution = () => {
    if (!executingAction) return;

    setShowExecutionModal(false);

    // Criar mensagem de conclusão com resultados
    const results = executingAction.steps
      ?.map(step => (step.selectedValue ? `${step.title}: ${step.selectedValue}` : step.title))
      .join('\n• ');

    const completionMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'assistant',
      content: `🎉 **${executingAction.title} Concluída!**\n\n**Resultados:**\n• ${results}\n\n${executingAction.estimatedSavings ? `💰 **Economia:** ${formatCurrency(executingAction.estimatedSavings)}` : ''}`,
      timestamp: new Date(),
      category: 'action',
      confidence: 100,
    };

    setMessages(prev => [...prev, completionMessage]);

    // Notificação de sucesso
    addNotification({
      title: 'Operação Concluída!',
      message: `${executingAction.title} foi executada com sucesso`,
      type: 'success',
      actionId: executingAction.id,
    });

    setExecutingAction(null);
    setCurrentStep(0);
  };

  // Criar nova operação
  const createOperation = (params: {
    title: string;
    type: OperationDisplay['type'];
    details: string[];
  }): OperationDisplay => {
    const operation: OperationDisplay = {
      id: Date.now().toString(),
      title: params.title,
      type: params.type,
      status: 'active',
      progress: 5,
      startTime: new Date(),
      estimatedDuration: 180000, // 3 minutes
      details: params.details,
    };

    setActiveOperations(prev => [operation, ...prev]);
    return operation;
  };

  // Obter cor baseada no tipo de operação
  const getOperationColor = (type: OperationDisplay['type']) => {
    switch (type) {
      case 'compensacao':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'marketplace':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'blockchain':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'fiscal':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'analytics':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'compliance':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Obter ícone da operação
  const getOperationIcon = (type: OperationDisplay['type']) => {
    switch (type) {
      case 'compensacao':
        return <Calculator className="h-4 w-4" />;
      case 'marketplace':
        return <DollarSign className="h-4 w-4" />;
      case 'blockchain':
        return <Network className="h-4 w-4" />;
      case 'fiscal':
        return <FileText className="h-4 w-4" />;
      case 'analytics':
        return <BarChart3 className="h-4 w-4" />;
      case 'compliance':
        return <Shield className="h-4 w-4" />;
      default:
        return <Cpu className="h-4 w-4" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="aria-page flex-1 space-y-6 p-6">
      {/* Notificações */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map(notification => (
            <Card
              key={notification.id}
              className={`w-80 shadow-lg ${
                notification.type === 'success'
                  ? 'border-green-200 bg-green-50'
                  : notification.type === 'warning'
                    ? 'border-yellow-200 bg-yellow-50'
                    : notification.type === 'error'
                      ? 'border-red-200 bg-red-50'
                      : 'border-blue-200 bg-blue-50'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 ${
                        notification.type === 'success'
                          ? 'text-green-600'
                          : notification.type === 'warning'
                            ? 'text-yellow-600'
                            : notification.type === 'error'
                              ? 'text-red-600'
                              : 'text-blue-600'
                      }`}
                    >
                      {notification.type === 'success' ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : notification.type === 'warning' ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : notification.type === 'error' ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : (
                        <Bell className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{notification.title}</h4>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {format(notification.timestamp, 'HH:mm:ss', { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() =>
                      setNotifications(prev => prev.filter(n => n.id !== notification.id))
                    }
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Execução Interativa */}
      {showExecutionModal && executingAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Workflow className="h-5 w-5 text-blue-600" />
                    {executingAction.title}
                  </CardTitle>
                  <CardDescription>
                    Step {currentStep + 1} de {executingAction.steps?.length || 0}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowExecutionModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progresso da Execução</span>
                  <span>
                    {Math.round(((currentStep + 1) / (executingAction.steps?.length || 1)) * 100)}%
                  </span>
                </div>
                <Progress
                  value={((currentStep + 1) / (executingAction.steps?.length || 1)) * 100}
                  className="h-2"
                />
              </div>
            </CardHeader>

            <CardContent className="p-6 max-h-[60vh] overflow-y-auto">
              {executingAction.steps && executingAction.steps[currentStep] && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {executingAction.steps[currentStep].title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {executingAction.steps[currentStep].description}
                  </p>

                  {executingAction.steps[currentStep].type === 'selection' &&
                    executingAction.steps[currentStep].options && (
                      <div className="space-y-3">
                        {executingAction.steps[currentStep].options?.map(option => (
                          <div
                            key={option.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                              option.recommended ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                            }`}
                            onClick={() => nextStep(option.value)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{option.label}</h4>
                                  {option.recommended && (
                                    <Badge className="bg-blue-600 text-white text-xs">
                                      Recomendado
                                    </Badge>
                                  )}
                                  {option.risk && (
                                    <Badge
                                      variant={
                                        option.risk === 'low'
                                          ? 'default'
                                          : option.risk === 'medium'
                                            ? 'secondary'
                                            : 'destructive'
                                      }
                                      className="text-xs"
                                    >
                                      {option.risk === 'low'
                                        ? 'Baixo Risco'
                                        : option.risk === 'medium'
                                          ? 'Risco Médio'
                                          : 'Alto Risco'}
                                    </Badge>
                                  )}
                                </div>
                                {option.description && (
                                  <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                                )}
                              </div>
                              {option.savings && (
                                <div className="text-right">
                                  <span className="text-green-600 font-medium text-sm">
                                    💰 {formatCurrency(option.savings)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  {executingAction.steps[currentStep].type === 'confirmation' && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Confirmar Operação</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Verifique os dados selecionados e confirme a execução da operação.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => nextStep('confirmed')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Confirmar e Executar
                        </Button>
                        <Button variant="outline" onClick={() => setShowExecutionModal(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}

                  {executingAction.steps[currentStep].type === 'progress' && (
                    <div className="text-center py-8">
                      <div className="mx-auto mb-4 flex justify-center">
                        <Workflow className="h-12 w-12 text-blue-600" />
                      </div>
                      <h4 className="font-medium text-lg mb-2">Executando...</h4>
                      <p className="text-gray-600">
                        A operação está sendo processada. Aguarde um momento.
                      </p>
                      <div className="mt-4">
                        <Progress value={75} className="h-2" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bot className="h-10 w-10 text-blue-600" />
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">ARIA - Assistente Inteligente</h1>
            <p className="text-muted-foreground">
              Seu braço operacional para toda a plataforma Tributa.AI
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-green-100 text-green-800 px-3 py-1">
            <Activity className="h-3 w-3 mr-1" />
            Sistema Online
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            {ariaStats.totalOperations} operações
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            {ariaStats.successRate}% precisão
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Operações
                </p>
                <p className="text-xl font-bold text-blue-600">{ariaStats.totalOperations}</p>
              </div>
              <Terminal className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Taxa Sucesso
                </p>
                <p className="text-xl font-bold text-green-600">{ariaStats.successRate}%</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Resp. Média
                </p>
                <p className="text-xl font-bold text-purple-600">
                  {ariaStats.averageResponseTime}s
                </p>
              </div>
              <Timer className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Créditos
                </p>
                <p className="text-xl font-bold text-orange-600">
                  {formatCurrency(ariaStats.creditsAnalyzed)}
                </p>
              </div>
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Economia
                </p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(ariaStats.automatedSavings)}
                </p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Monitores
                </p>
                <p className="text-xl font-bold text-red-600">{ariaStats.activeMonitors}</p>
              </div>
              <Eye className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Interface */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0 aria-chat-container">
        {/* Chat Interface */}
        <div className="lg:col-span-4 min-h-0">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 flex-shrink-0">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Interface de Comando ARIA
              </CardTitle>
              <CardDescription>
                Converse com ARIA em linguagem natural. Execute operações complexas com comandos
                simples.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 chat-container min-h-0">
              <div className="flex-1 overflow-hidden min-h-0">
                <ScrollArea className="h-full chat-scroll-area" ref={chatScrollAreaRef}>
                  <div className="chat-messages">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`message-bubble p-4 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : message.type === 'system'
                                ? 'bg-gray-800 text-white border'
                                : 'bg-white border shadow-sm'
                          }`}
                        >
                          <div className="chat-message-content text-sm leading-relaxed">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: message.content
                                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                  .replace(/\n/g, '<br/>')
                                  .replace(/•/g, '&bull;')
                                  .replace(/💰/g, '💰')
                                  .replace(/🛒/g, '🛒')
                                  .replace(/⚖️/g, '⚖️')
                                  .replace(/⛓️/g, '⛓️')
                                  .replace(/📊/g, '📊')
                                  .replace(/🛡️/g, '🛡️')
                                  .replace(/🧮/g, '🧮')
                                  .replace(/🤖/g, '🤖')
                                  .replace(/🎯/g, '🎯')
                                  .replace(/📈/g, '📈')
                                  .replace(/🟢/g, '🟢')
                                  .replace(/✅/g, '✅')
                                  .replace(/🔄/g, '🔄')
                                  .replace(/⏱️/g, '⏱️')
                                  .replace(/🔍/g, '🔍')
                                  .replace(/⚠️/g, '⚠️')
                                  .replace(/💡/g, '💡')
                                  .replace(/📋/g, '📋')
                                  .replace(/🎉/g, '🎉')
                                  .replace(/💎/g, '💎')
                                  .replace(/🏦/g, '🏦')
                                  .replace(/🔐/g, '🔐'),
                              }}
                            />
                          </div>

                          <div className="flex items-center justify-between mt-3 text-xs opacity-70">
                            <span>{format(message.timestamp, 'HH:mm:ss', { locale: ptBR })}</span>
                            {message.confidence && (
                              <Badge variant="outline" className="text-xs">
                                {message.confidence}% confiança
                              </Badge>
                            )}
                          </div>

                          {message.actions && message.actions.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {message.actions.map(action => (
                                <div key={action.id} className="p-3 bg-gray-50 rounded-lg border">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <div
                                        className={`h-2 w-2 rounded-full ${
                                          action.status === 'executing'
                                            ? 'bg-yellow-500 animate-pulse'
                                            : action.status === 'completed'
                                              ? 'bg-green-500'
                                              : action.status === 'failed'
                                                ? 'bg-red-500'
                                                : 'bg-blue-400'
                                        }`}
                                      />
                                      <span className="text-sm font-medium">{action.title}</span>
                                    </div>
                                    {action.estimatedSavings && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs bg-green-50 text-green-700 border-green-200"
                                      >
                                        💰 {formatCurrency(action.estimatedSavings)}
                                      </Badge>
                                    )}
                                  </div>

                                  <p className="text-xs text-gray-600 mb-3">{action.description}</p>

                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                      <Badge
                                        variant={
                                          action.complexity === 'simple'
                                            ? 'default'
                                            : action.complexity === 'medium'
                                              ? 'secondary'
                                              : 'destructive'
                                        }
                                        className="text-xs"
                                      >
                                        {action.complexity === 'simple'
                                          ? 'Simples'
                                          : action.complexity === 'medium'
                                            ? 'Médio'
                                            : 'Complexo'}
                                      </Badge>
                                      {action.implementationTime && (
                                        <span className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {Math.round(action.implementationTime / 60)}min
                                        </span>
                                      )}
                                    </div>

                                    {action.status === 'pending' && action.canExecute && (
                                      <Button
                                        size="sm"
                                        onClick={() => executeAction(action)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                      >
                                        <Play className="h-3 w-3 mr-1" />
                                        {action.buttonText || 'Executar'}
                                      </Button>
                                    )}

                                    {action.status === 'executing' &&
                                      action.progress !== undefined && (
                                        <div className="flex items-center gap-2">
                                          <div className="w-20">
                                            <Progress value={action.progress} className="h-2" />
                                          </div>
                                          <span className="text-xs text-gray-600">
                                            {Math.round(action.progress)}%
                                          </span>
                                        </div>
                                      )}

                                    {action.status === 'completed' && (
                                      <div className="flex items-center gap-1 text-green-600">
                                        <CheckCircle className="h-3 w-3" />
                                        <span className="text-xs">Concluído</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white border shadow-sm p-4 rounded-lg message-bubble">
                          <div className="flex items-center gap-2">
                            <div className="animate-spin-force">
                              <Brain className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="text-sm text-gray-600">ARIA está processando...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </div>

              {/* Input Area */}
              <div className="border-t bg-gray-50 p-4 flex-shrink-0">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      value={currentMessage}
                      onChange={e => setCurrentMessage(e.target.value)}
                      placeholder="Digite um comando para ARIA: 'compensar débitos', 'analisar marketplace', 'criar TC'..."
                      onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                      className="pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                      onClick={() => setIsListening(!isListening)}
                    >
                      {isListening ? (
                        <Mic className="h-4 w-4 text-red-500" />
                      ) : (
                        <MicOff className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <Button onClick={handleSendMessage} disabled={!currentMessage.trim() || isTyping}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Operations Panel */}
        <div className="space-y-3 flex flex-col min-h-0">
          {/* Quick Actions */}
          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-yellow-500" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {[
                {
                  label: 'Compensar Débitos',
                  command: 'compensar débitos pendentes',
                  icon: Calculator,
                },
                { label: 'Vender TCs', command: 'analisar marketplace TCs', icon: DollarSign },
                {
                  label: 'Comprar Créditos',
                  command: 'comprar créditos marketplace',
                  icon: ShoppingCart,
                },
                { label: 'Criar TC', command: 'criar novo título de crédito', icon: Plus },
                { label: 'Tokenizar', command: 'tokenizar títulos blockchain', icon: Network },
                {
                  label: 'Gerar Relatório',
                  command: 'gerar relatório fiscal completo',
                  icon: FileText,
                },
              ].map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start h-8 text-xs"
                  onClick={() => {
                    setCurrentMessage(action.command);
                    handleSendMessage();
                  }}
                >
                  <action.icon className="h-3 w-3 mr-2" />
                  {action.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Active Operations */}
          <Card className="flex-1 min-h-0">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4 text-green-500" />
                Operações Ativas
                {activeOperations.length > 0 && (
                  <Badge variant="default" className="ml-auto text-xs">
                    {activeOperations.filter(op => op.status === 'active').length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              {activeOperations.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <Cpu className="h-6 w-6 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Nenhuma operação ativa</p>
                </div>
              ) : (
                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {activeOperations.map(operation => (
                      <div key={operation.id} className="border rounded p-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1">
                            {getOperationIcon(operation.type)}
                            <span className="text-xs font-medium truncate">{operation.title}</span>
                          </div>
                          <Badge
                            className={`${getOperationColor(operation.type)} text-xs px-1 py-0`}
                          >
                            {operation.status === 'active'
                              ? 'Ativo'
                              : operation.status === 'completed'
                                ? 'OK'
                                : operation.status === 'error'
                                  ? 'Erro'
                                  : 'Wait'}
                          </Badge>
                        </div>

                        {operation.status === 'active' && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <span>Progresso</span>
                              <span>{Math.round(operation.progress)}%</span>
                            </div>
                            <Progress value={operation.progress} className="h-1" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Gauge className="h-4 w-4 text-blue-500" />
                Status do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: 'Receita Federal', status: 'online', latency: '120ms' },
                { label: 'Blockchain', status: 'online', latency: '45ms' },
                { label: 'Analytics', status: 'online', latency: '230ms' },
                { label: 'Database', status: 'online', latency: '15ms' },
              ].map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        service.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <span className="text-xs">{service.label}</span>
                  </div>
                  <span className="text-xs text-gray-500">{service.latency}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
