import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminDashboard } from './AdminDashboard';
import { SimulationCenter } from './SimulationCenter';
import {
  Search,
  Filter,
  Heart,
  Bell,
  Clock,
  TrendingUp,
  Users,
  Gavel,
  ShoppingCart,
  MessageSquare,
  Star,
  MapPin,
  Verified,
  Bot,
  DollarSign,
  BarChart3,
  Activity,
  Eye,
  Play,
  Pause,
  RefreshCw,
  Grid3X3,
  List,
  SlidersHorizontal,
  Shield,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { MarketplaceBotSystem } from './MarketplaceBotSystem';
import { NotificationCenter } from './NotificationCenter';
import { ProofViewer } from './ProofViewer';
import { CreditDetailsModal } from './CreditDetailsModal';
import { PurchaseModal } from './PurchaseModal';
import { BidModal } from './BidModal';
import { NegotiationModal } from './NegotiationModal';
import { DigitalCessionModal } from './DigitalCessionModal';
import { marketplaceTransactionService } from '@/services/marketplace-transaction.service';
import { CessionContract } from '@/services/digital-cession-contract.service';

interface CreditTitle {
  id: string;
  title: string;
  description: string;
  creditType:
    | 'ICMS'
    | 'PIS/COFINS'
    | 'IPI'
    | 'ISS'
    | 'IRPJ/CSLL'
    | 'Precatório'
    | 'Rural'
    | 'Comercial';
  creditValue: number;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  minBid: number;
  bidIncrement: number;
  timeRemaining: number;
  totalBids: number;
  participants: number;
  seller: {
    name: string;
    rating: number;
    verified: boolean;
    location: string;
    avatar: string;
    totalSales: number;
    memberSince: string;
    responseTime: string;
  };
  status: 'active' | 'ending_soon' | 'ended' | 'buy_now';
  category: 'auction' | 'buy_now' | 'negotiable';
  auctionType: 'traditional' | 'reverse' | 'dutch';
  startDate: string;
  endDate: string;
  tags: string[];
  documentation: {
    complete: boolean;
    verified: boolean;
    items: string[];
  };
  riskLevel: 'low' | 'medium' | 'high';
  liquidityScore: number;
  images: string[];
  botGenerated?: boolean;
  botId?: string;
  tokenId?: string;
  blockchain?: string;
  guarantees: string[];
  legalProcedures: {
    transferType: string;
    requiredDocs: string[];
    processingTime: string;
    governmentApproval: boolean;
  };
  marketHistory: {
    priceHistory: { date: string; price: number }[];
    volumeHistory: { date: string; volume: number }[];
    similarCredits: number;
  };
  bidHistory?: {
    id: string;
    amount: number;
    bidder: string;
    timestamp: Date;
    isWinning: boolean;
  }[];
}

interface BotActivity {
  id: string;
  botId: string;
  botName: string;
  action: 'bid' | 'buy' | 'negotiate' | 'create_listing' | 'cancel_bid';
  creditId: string;
  creditTitle: string;
  amount?: number;
  timestamp: Date;
  success: boolean;
  details: string;
}

interface MarketplaceStats {
  totalVolume: number;
  totalTransactions: number;
  activeListings: number;
  totalUsers: number;
  averageDiscount: number;
  topCreditType: string;
  dailyGrowth: number;
  botTransactions: number;
  humanTransactions: number;
  revenue: number;
}

export function AdvancedMarketplacePlatform() {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [filterType, setFilterType] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [favoriteCredits, setFavoriteCredits] = useState<Set<string>>(new Set());
  const [watchedCredits, setWatchedCredits] = useState<Set<string>>(new Set());
  const [botsActive, setBotsActive] = useState(true);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true); // Simular usuário admin
  
  // Modal states
  const [selectedCredit, setSelectedCredit] = useState<CreditTitle | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [showCessionModal, setShowCessionModal] = useState(false);
  const [purchaseData, setPurchaseData] = useState<any>(null);

  const [credits, setCredits] = useState<CreditTitle[]>([]);
  const [botActivities, setBotActivities] = useState<BotActivity[]>([]);
  const [marketplaceStats, setMarketplaceStats] = useState<MarketplaceStats>({
    totalVolume: 0,
    totalTransactions: 0,
    activeListings: 0,
    totalUsers: 0,
    averageDiscount: 0,
    topCreditType: 'ICMS',
    dailyGrowth: 0,
    botTransactions: 0,
    humanTransactions: 0,
    revenue: 0,
  });

  // Simular dados iniciais
  useEffect(() => {
    loadInitialData();
    if (realTimeUpdates) {
      const interval = setInterval(() => {
        updateRealTimeData();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [realTimeUpdates]);

  const loadInitialData = () => {
    const initialCredits: CreditTitle[] = [
      {
        id: '1',
        title: 'ICMS - Exportação Agronegócio',
        description:
          'Título de crédito ICMS de exportação do agronegócio, com documentação completa e auditada.',
        creditType: 'ICMS',
        creditValue: 850000,
        currentPrice: 765000,
        originalPrice: 850000,
        discount: 10,
        minBid: 770000,
        bidIncrement: 5000,
        timeRemaining: 7200,
        totalBids: 23,
        participants: 8,
        seller: {
          name: 'AgroExport Brasil Ltda',
          rating: 4.8,
          verified: true,
          location: 'Mato Grosso',
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AEB',
          totalSales: 45,
          memberSince: '2020',
          responseTime: '2 horas',
        },
        status: 'active',
        category: 'auction',
        auctionType: 'traditional',
        startDate: '2024-01-15T10:00:00',
        endDate: '2024-01-15T18:00:00',
        tags: ['agronegocio', 'exportacao', 'blockchain'],
        documentation: {
          complete: true,
          verified: true,
          items: ['NFe', 'Declaração de Exportação', 'Certificado Digital'],
        },
        riskLevel: 'low',
        liquidityScore: 95,
        images: ['https://via.placeholder.com/400x200?text=ICMS+Exportacao'],
        tokenId: 'TKN-ICMS-001',
        blockchain: 'Ethereum',
        guarantees: ['Seguro de Crédito', 'Auditoria Externa', 'Documentação Completa'],
        legalProcedures: {
          transferType: 'Cessão de Direitos Creditórios',
          requiredDocs: ['RG/CPF', 'Comprovante de Endereço', 'Contrato Social'],
          processingTime: '3-5 dias úteis',
          governmentApproval: true,
        },
        marketHistory: {
          priceHistory: [
            { date: '2024-01-10', price: 850000 },
            { date: '2024-01-12', price: 820000 },
            { date: '2024-01-14', price: 780000 },
            { date: '2024-01-15', price: 765000 },
          ],
          volumeHistory: [
            { date: '2024-01-10', volume: 2 },
            { date: '2024-01-12', volume: 5 },
            { date: '2024-01-14', volume: 8 },
            { date: '2024-01-15', volume: 12 },
          ],
          similarCredits: 15,
        },
        bidHistory: [
          { id: '1', amount: 765000, bidder: 'Usuário Premium', timestamp: new Date('2024-01-15T14:30:00'), isWinning: true },
          { id: '2', amount: 760000, bidder: 'InvestCorp', timestamp: new Date('2024-01-15T14:15:00'), isWinning: false },
          { id: '3', amount: 755000, bidder: 'AutoBot Alpha', timestamp: new Date('2024-01-15T14:00:00'), isWinning: false },
        ],
      },
      {
        id: '2',
        title: 'PIS/COFINS - Indústria Química',
        description:
          'Créditos PIS/COFINS de indústria química, valores auditados e documentação completa com certificação ISO.',
        creditType: 'PIS/COFINS',
        creditValue: 420000,
        currentPrice: 378000,
        originalPrice: 420000,
        discount: 10,
        minBid: 381000,
        bidIncrement: 3000,
        timeRemaining: 3600,
        totalBids: 15,
        participants: 5,
        seller: {
          name: 'Química Industrial SP',
          rating: 4.6,
          verified: true,
          location: 'São Paulo',
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=QIS',
          totalSales: 32,
          memberSince: '2019',
          responseTime: '1 hora',
        },
        status: 'ending_soon',
        category: 'auction',
        auctionType: 'traditional',
        startDate: '2024-01-14T14:00:00',
        endDate: '2024-01-15T15:00:00',
        tags: ['industria', 'quimica', 'auditado', 'iso'],
        documentation: {
          complete: true,
          verified: true,
          items: ['Nota Fiscal', 'Certificação ISO', 'Auditoria'],
        },
        riskLevel: 'low',
        liquidityScore: 88,
        images: ['https://via.placeholder.com/400x200?text=PIS+COFINS'],
        tokenId: 'TKN-PIS-002',
        blockchain: 'Polygon',
        guarantees: ['Certificação ISO', 'Auditoria Big4', 'Seguro Garantia'],
        legalProcedures: {
          transferType: 'Transferência Eletrônica de Créditos',
          requiredDocs: ['CPF/CNPJ', 'Contrato de Cessão', 'Declaração de Veracidade'],
          processingTime: '2-3 dias úteis',
          governmentApproval: false,
        },
        marketHistory: {
          priceHistory: [
            { date: '2024-01-14', price: 420000 },
            { date: '2024-01-14', price: 400000 },
            { date: '2024-01-15', price: 378000 },
          ],
          volumeHistory: [
            { date: '2024-01-14', volume: 3 },
            { date: '2024-01-15', volume: 7 },
          ],
          similarCredits: 8,
        },
      },
      {
        id: '3',
        title: 'Precatório Judicial Tokenizado - TJSP',
        description:
          'Precatório judicial do TJSP tokenizado em blockchain, com garantia estatal e liquidez assegurada.',
        creditType: 'Precatório',
        creditValue: 1200000,
        currentPrice: 960000,
        originalPrice: 1200000,
        discount: 20,
        minBid: 0,
        bidIncrement: 0,
        timeRemaining: 0,
        totalBids: 0,
        participants: 0,
        seller: {
          name: 'Escritório Jurídico Silva & Associados',
          rating: 4.9,
          verified: true,
          location: 'São Paulo',
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=EJS',
          totalSales: 28,
          memberSince: '2018',
          responseTime: '30 minutos',
        },
        status: 'active',
        category: 'buy_now',
        auctionType: 'traditional',
        startDate: '2024-01-10T09:00:00',
        endDate: '2024-02-10T17:00:00',
        tags: ['tokenizado', 'precatorio', 'tjsp', 'garantia-estatal'],
        documentation: {
          complete: true,
          verified: true,
          items: ['Ofício Judicial', 'Certidão de Trânsito', 'Cálculo Atualizado', 'Token ERC-721'],
        },
        riskLevel: 'low',
        liquidityScore: 92,
        images: ['https://via.placeholder.com/400x200?text=Precatorio+Tokenizado'],
        tokenId: 'TKN-PREC-003',
        blockchain: 'Ethereum',
        guarantees: ['Garantia Estatal', 'Trânsito em Julgado', 'Cálculo Atualizado'],
        legalProcedures: {
          transferType: 'Cessão de Precatório Judicial',
          requiredDocs: ['RG/CPF', 'Contrato de Cessão', 'Procuração', 'Certidão Judicial'],
          processingTime: '5-10 dias úteis',
          governmentApproval: true,
        },
        marketHistory: {
          priceHistory: [
            { date: '2024-01-10', price: 1200000 },
            { date: '2024-01-12', price: 1000000 },
            { date: '2024-01-15', price: 960000 },
          ],
          volumeHistory: [
            { date: '2024-01-10', volume: 1 },
            { date: '2024-01-12', volume: 2 },
            { date: '2024-01-15', volume: 4 },
          ],
          similarCredits: 22,
        },
      },
      {
        id: '4',
        title: 'IPI - Manufatura Eletrônicos',
        description:
          'Crédito de IPI de empresa de manufatura de eletrônicos, com smart contract auditado.',
        creditType: 'IPI',
        creditValue: 320000,
        currentPrice: 288000,
        originalPrice: 320000,
        discount: 10,
        minBid: 290000,
        bidIncrement: 2000,
        timeRemaining: 5400,
        totalBids: 8,
        participants: 4,
        seller: {
          name: 'TechManufatura Ltda',
          rating: 4.7,
          verified: true,
          location: 'Santa Catarina',
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TML',
          totalSales: 19,
          memberSince: '2021',
          responseTime: '4 horas',
        },
        status: 'active',
        category: 'auction',
        auctionType: 'traditional',
        startDate: '2024-01-15T08:00:00',
        endDate: '2024-01-15T20:00:00',
        tags: ['ipi', 'eletronicos', 'smart-contract'],
        documentation: {
          complete: true,
          verified: true,
          items: ['SPED Fiscal', 'Livro de Registro', 'Auditoria Externa'],
        },
        riskLevel: 'medium',
        liquidityScore: 85,
        images: ['https://via.placeholder.com/400x200?text=IPI'],
        tokenId: 'TKN-IPI-004',
        blockchain: 'BSC',
        guarantees: ['Smart Contract Auditado', 'Seguro de Inadimplência'],
        legalProcedures: {
          transferType: 'Cessão Eletrônica via Smart Contract',
          requiredDocs: ['CNPJ', 'Contrato Digital', 'Assinatura Eletrônica'],
          processingTime: '1-2 dias úteis',
          governmentApproval: false,
        },
        marketHistory: {
          priceHistory: [
            { date: '2024-01-15', price: 320000 },
            { date: '2024-01-15', price: 295000 },
            { date: '2024-01-15', price: 288000 },
          ],
          volumeHistory: [
            { date: '2024-01-15', volume: 5 },
          ],
          similarCredits: 12,
        },
      },
      {
        id: '5',
        title: 'IRPJ/CSLL - Serviços Financeiros Tokenizado',
        description:
          'Créditos IRPJ/CSLL de empresa de serviços financeiros, tokenizado com garantias bancárias.',
        creditType: 'IRPJ/CSLL',
        creditValue: 680000,
        currentPrice: 612000,
        originalPrice: 680000,
        discount: 10,
        minBid: 0,
        bidIncrement: 0,
        timeRemaining: 0,
        totalBids: 0,
        participants: 0,
        seller: {
          name: 'FinServ Capital S.A.',
          rating: 4.5,
          verified: true,
          location: 'Rio de Janeiro',
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=FSC',
          totalSales: 41,
          memberSince: '2017',
          responseTime: '1 hora',
        },
        status: 'active',
        category: 'negotiable',
        auctionType: 'traditional',
        startDate: '2024-01-12T10:00:00',
        endDate: '2024-02-12T18:00:00',
        tags: ['tokenizado', 'irpj', 'csll', 'servicos-financeiros'],
        documentation: {
          complete: true,
          verified: true,
          items: ['Declaração IR', 'Balanço Auditado', 'Garantia Bancária', 'Token ERC-20'],
        },
        riskLevel: 'low',
        liquidityScore: 90,
        images: ['https://via.placeholder.com/400x200?text=IRPJ+CSLL+Tokenizado'],
        tokenId: 'TKN-IRPJ-005',
        blockchain: 'Ethereum',
        guarantees: ['Garantias Bancárias', 'Auditoria Independente', 'Seguro Crédito'],
        legalProcedures: {
          transferType: 'Cessão de Créditos Financeiros',
          requiredDocs: ['CNPJ', 'Demonstrações Financeiras', 'Garantia Bancária'],
          processingTime: '2-4 dias úteis',
          governmentApproval: false,
        },
        marketHistory: {
          priceHistory: [
            { date: '2024-01-12', price: 680000 },
            { date: '2024-01-14', price: 650000 },
            { date: '2024-01-15', price: 612000 },
          ],
          volumeHistory: [
            { date: '2024-01-12', volume: 2 },
            { date: '2024-01-14', volume: 4 },
            { date: '2024-01-15', volume: 6 },
          ],
          similarCredits: 18,
        },
      },
      {
        id: '6',
        title: 'ISS - Prestação de Serviços',
        description:
          'Crédito de ISS de empresa de prestação de serviços tecnológicos, com validação municipal.',
        creditType: 'ISS',
        creditValue: 180000,
        currentPrice: 162000,
        originalPrice: 180000,
        discount: 10,
        minBid: 164000,
        bidIncrement: 1000,
        timeRemaining: 1800,
        totalBids: 12,
        participants: 6,
        seller: {
          name: 'TechServices Inovação',
          rating: 4.4,
          verified: true,
          location: 'Brasília',
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TSI',
          totalSales: 15,
          memberSince: '2022',
          responseTime: '6 horas',
        },
        status: 'ending_soon',
        category: 'auction',
        auctionType: 'traditional',
        startDate: '2024-01-15T13:00:00',
        endDate: '2024-01-15T16:30:00',
        tags: ['iss', 'servicos', 'tecnologia'],
        documentation: {
          complete: true,
          verified: true,
          items: ['RPS', 'Certidão Municipal', 'Contrato de Prestação'],
        },
        riskLevel: 'medium',
        liquidityScore: 82,
        images: ['https://via.placeholder.com/400x200?text=ISS'],
        tokenId: 'TKN-ISS-006',
        blockchain: 'Polygon',
        guarantees: ['Certificação Municipal', 'Contrato de Prestação'],
        legalProcedures: {
          transferType: 'Cessão de Créditos Municipais',
          requiredDocs: ['CNPJ', 'Inscrição Municipal', 'RPS Originais'],
          processingTime: '3-5 dias úteis',
          governmentApproval: true,
        },
        marketHistory: {
          priceHistory: [
            { date: '2024-01-15', price: 180000 },
            { date: '2024-01-15', price: 170000 },
            { date: '2024-01-15', price: 162000 },
          ],
          volumeHistory: [
            { date: '2024-01-15', volume: 8 },
          ],
          similarCredits: 5,
        },
      },
      {
        id: '7',
        title: 'Crédito Rural Tokenizado - Financiamento Agrícola',
        description:
          'Título de crédito rural tokenizado, financiamento para produção agrícola com garantia real.',
        creditType: 'Rural',
        creditValue: 950000,
        currentPrice: 855000,
        originalPrice: 950000,
        discount: 10,
        minBid: 0,
        bidIncrement: 0,
        timeRemaining: 0,
        totalBids: 0,
        participants: 0,
        seller: {
          name: 'AgroFinance Cooperativa',
          rating: 4.8,
          verified: true,
          location: 'Goiás',
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AFC',
          totalSales: 38,
          memberSince: '2019',
          responseTime: '3 horas',
        },
        status: 'active',
        category: 'buy_now',
        auctionType: 'traditional',
        startDate: '2024-01-08T08:00:00',
        endDate: '2024-02-08T18:00:00',
        tags: ['tokenizado', 'rural', 'agricola', 'garantia-real'],
        documentation: {
          complete: true,
          verified: true,
          items: ['CPR', 'Escritura de Garantia', 'Seguro Rural', 'Token ERC-721'],
        },
        riskLevel: 'medium',
        liquidityScore: 87,
        images: ['https://via.placeholder.com/400x200?text=Rural+Tokenizado'],
        tokenId: 'TKN-RURAL-007',
        blockchain: 'Ethereum',
        guarantees: ['Garantia Real', 'Seguro Rural', 'CPR Registrada'],
        legalProcedures: {
          transferType: 'Cessão de CPR (Cédula de Produto Rural)',
          requiredDocs: ['CPF/CNPJ', 'Escritura de Garantia', 'CPR Original'],
          processingTime: '5-7 dias úteis',
          governmentApproval: true,
        },
        marketHistory: {
          priceHistory: [
            { date: '2024-01-08', price: 950000 },
            { date: '2024-01-12', price: 890000 },
            { date: '2024-01-15', price: 855000 },
          ],
          volumeHistory: [
            { date: '2024-01-08', volume: 1 },
            { date: '2024-01-12', volume: 3 },
            { date: '2024-01-15', volume: 5 },
          ],
          similarCredits: 11,
        },
      },
      {
        id: '8',
        title: 'Duplicata Comercial Tokenizada - Varejo',
        description:
          'Duplicata comercial de grande rede de varejo tokenizada, com histórico de pagamento exemplar.',
        creditType: 'Comercial',
        creditValue: 450000,
        currentPrice: 405000,
        originalPrice: 450000,
        discount: 10,
        minBid: 408000,
        bidIncrement: 2500,
        timeRemaining: 4200,
        totalBids: 18,
        participants: 7,
        seller: {
          name: 'VarejoMax Distribuidora',
          rating: 4.6,
          verified: true,
          location: 'Minas Gerais',
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=VMD',
          totalSales: 52,
          memberSince: '2020',
          responseTime: '2 horas',
        },
        status: 'active',
        category: 'auction',
        auctionType: 'traditional',
        startDate: '2024-01-15T11:00:00',
        endDate: '2024-01-15T21:00:00',
        tags: ['tokenizado', 'duplicata', 'varejo', 'historico-exemplar'],
        documentation: {
          complete: true,
          verified: true,
          items: ['Duplicata', 'Nota Fiscal', 'Histórico de Pagamento', 'Token ERC-1155'],
        },
        riskLevel: 'low',
        liquidityScore: 91,
        images: ['https://via.placeholder.com/400x200?text=Duplicata+Tokenizada'],
        tokenId: 'TKN-DUP-008',
        blockchain: 'Ethereum',
        guarantees: ['Histórico de Pagamento Exemplar', 'Seguro Sacado', 'Nota Fiscal'],
        legalProcedures: {
          transferType: 'Endosso de Duplicata Mercantil',
          requiredDocs: ['CNPJ', 'Duplicata Original', 'Nota Fiscal'],
          processingTime: '1-3 dias úteis',
          governmentApproval: false,
        },
        marketHistory: {
          priceHistory: [
            { date: '2024-01-15', price: 450000 },
            { date: '2024-01-15', price: 425000 },
            { date: '2024-01-15', price: 405000 },
          ],
          volumeHistory: [
            { date: '2024-01-15', volume: 10 },
          ],
          similarCredits: 25,
        },
      },
    ];

    setCredits(initialCredits);
    updateStats(initialCredits);
  };

  const updateRealTimeData = () => {
    if (botsActive) {
      // Simular atividade dos bots
      simulateBotActivity();
    }

    // Atualizar contadores de tempo
    setCredits(prev =>
      prev.map(credit => ({
        ...credit,
        timeRemaining: Math.max(0, credit.timeRemaining - 3),
        status:
          credit.timeRemaining <= 3600 && credit.timeRemaining > 0
            ? 'ending_soon'
            : credit.timeRemaining <= 0 && credit.category === 'auction'
              ? 'ended'
              : credit.status,
      }))
    );
  };

  const simulateBotActivity = () => {
    const botNames = [
      'TradingBot Alpha',
      'SmartBidder Pro',
      'AutoInvestor',
      'CreditHunter',
      'MarketMaker',
    ];
    const actions = ['bid', 'buy', 'negotiate', 'create_listing'] as const;

    if (Math.random() < 0.3) {
      // 30% chance de atividade
      const randomCredit = credits[Math.floor(Math.random() * credits.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const randomBot = botNames[Math.floor(Math.random() * botNames.length)];

      const activity: BotActivity = {
        id: `bot-activity-${Date.now()}`,
        botId: `bot-${Math.floor(Math.random() * 100)}`,
        botName: randomBot,
        action: randomAction,
        creditId: randomCredit.id,
        creditTitle: randomCredit.title,
        amount:
          randomAction === 'bid'
            ? randomCredit.currentPrice + randomCredit.bidIncrement
            : randomCredit.currentPrice,
        timestamp: new Date(),
        success: Math.random() > 0.1, // 90% success rate
        details: `${randomBot} executou ${randomAction} em ${randomCredit.title}`,
      };

      setBotActivities(prev => [activity, ...prev.slice(0, 49)]); // Keep last 50 activities

      // Atualizar o título se foi um lance
      if (randomAction === 'bid' && activity.success) {
        setCredits(prev =>
          prev.map(credit =>
            credit.id === randomCredit.id
              ? {
                  ...credit,
                  currentPrice: activity.amount!,
                  totalBids: credit.totalBids + 1,
                  participants: credit.participants + (Math.random() > 0.7 ? 1 : 0),
                }
              : credit
          )
        );
      }
    }
  };

  const updateStats = (creditList: CreditTitle[]) => {
    const stats: MarketplaceStats = {
      totalVolume: creditList.reduce((sum, c) => sum + c.creditValue, 0),
      totalTransactions: creditList.reduce((sum, c) => sum + c.totalBids, 0),
      activeListings: creditList.filter(c => c.status === 'active' || c.status === 'ending_soon')
        .length,
      totalUsers: 1247, // Simulated
      averageDiscount: creditList.reduce((sum, c) => sum + c.discount, 0) / creditList.length,
      topCreditType: 'ICMS',
      dailyGrowth: 12.5,
      botTransactions: botActivities.filter(a => a.success).length,
      humanTransactions: Math.floor(Math.random() * 50) + 20,
      revenue: creditList.reduce((sum, c) => sum + c.creditValue * 0.03, 0), // 3% commission
    };
    setMarketplaceStats(stats);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatTimeRemaining = (seconds: number): string => {
    if (seconds <= 0) return 'Encerrado';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const handleToggleFavorite = (creditId: string) => {
    setFavoriteCredits(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(creditId)) {
        newFavorites.delete(creditId);
        toast.info('Removido dos favoritos');
      } else {
        newFavorites.add(creditId);
        toast.success('Adicionado aos favoritos');
      }
      return newFavorites;
    });
  };

  const handleShowDetails = (credit: CreditTitle) => {
    setSelectedCredit(credit);
    setShowDetailsModal(true);
  };

  const handleBuyNow = (credit: CreditTitle) => {
    setSelectedCredit(credit);
    setShowPurchaseModal(true);
  };

  const handlePlaceBid = (credit: CreditTitle) => {
    setSelectedCredit(credit);
    setShowBidModal(true);
  };

  const handleNegotiate = (credit: CreditTitle) => {
    setSelectedCredit(credit);
    setShowNegotiationModal(true);
  };

  const handlePurchaseConfirm = async (purchaseData: any) => {
    try {
      const transaction = await marketplaceTransactionService.processPurchase({
        creditId: purchaseData.creditId,
        amount: purchaseData.amount,
        paymentMethod: purchaseData.paymentMethod,
        terms: purchaseData.terms
      });
      
      if (transaction.status === 'completed') {
        toast.success(`Pagamento processado! Total: ${formatCurrency(purchaseData.totalAmount)}`);
        toast.info('Iniciando processo de cessão digital...');
        
        // Store purchase data and open cession modal
        setPurchaseData(purchaseData);
        setShowPurchaseModal(false);
        setShowCessionModal(true);
      } else {
        toast.warning('Compra processada, aguardando confirmação...');
        setShowPurchaseModal(false);
        setSelectedCredit(null);
      }
    } catch (error) {
      toast.error('Erro ao processar compra');
      throw error;
    }
  };

  const handleCessionComplete = (cessionContract: CessionContract) => {
    toast.success('Cessão de crédito concluída com sucesso!');
    toast.info(`Contrato: ${cessionContract.contractNumber}`);
    toast.info(`Blockchain: ${cessionContract.blockchainRecord.transactionHash}`);
    
    // Remove the credit from the list (now it's officially transferred)
    setCredits(prev => prev.filter(credit => credit.id !== selectedCredit?.id));
    
    setShowCessionModal(false);
    setSelectedCredit(null);
    setPurchaseData(null);
  };

  const handleBidConfirm = async (bidData: any) => {
    try {
      const transaction = await marketplaceTransactionService.processBid({
        creditId: bidData.creditId,
        bidAmount: bidData.bidAmount,
        maxBid: bidData.maxBid,
        autoincrement: bidData.autoincrement,
        terms: bidData.terms
      });
      
      if (transaction.status === 'completed') {
        // Atualizar o crédito com o novo lance
        setCredits(prev => prev.map(credit => 
          credit.id === bidData.creditId 
            ? {
                ...credit,
                currentPrice: bidData.bidAmount,
                totalBids: credit.totalBids + 1,
                participants: credit.participants + (Math.random() > 0.5 ? 1 : 0)
              }
            : credit
        ));
        
        toast.success(`Lance de ${formatCurrency(bidData.bidAmount)} realizado com sucesso!`);
        
        if (bidData.autoincrement) {
          toast.info(`Lance automático ativo até ${formatCurrency(bidData.maxBid)}`);
        }
      } else {
        toast.warning('Lance processado, aguardando confirmação...');
      }
      
      setShowBidModal(false);
      setSelectedCredit(null);
    } catch (error) {
      toast.error('Erro ao processar lance');
      throw error;
    }
  };

  const handleNegotiationConfirm = async (negotiationData: any) => {
    try {
      const transaction = await marketplaceTransactionService.processNegotiation({
        creditId: negotiationData.creditId,
        negotiationType: negotiationData.negotiationType,
        proposedPrice: negotiationData.proposedPrice,
        message: negotiationData.message,
        paymentTerms: negotiationData.paymentTerms,
        deliveryTerms: negotiationData.deliveryTerms,
        validityDays: negotiationData.validityDays,
        terms: negotiationData.terms
      });
      
      if (transaction.status === 'completed') {
        toast.success('Proposta enviada com sucesso! O vendedor será notificado.');
        
        if (negotiationData.proposedPrice) {
          toast.info(`Proposta: ${formatCurrency(negotiationData.proposedPrice)} + taxa ${formatCurrency(negotiationData.platformFee)}`);
        }
      } else {
        toast.warning('Proposta processada, aguardando confirmação...');
      }
      
      setShowNegotiationModal(false);
      setSelectedCredit(null);
    } catch (error) {
      toast.error('Erro ao enviar proposta');
      throw error;
    }
  };

  const filteredCredits = credits.filter(credit => {
    const matchesSearch =
      credit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credit.seller.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'todos' || credit.creditType === filterType;
    const matchesStatus = filterStatus === 'todos' || credit.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Header com controles */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Marketplace Avançado</h1>
            <p className="text-gray-600">
              Plataforma completa com bots automatizados e análises em tempo real
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={botsActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => setBotsActive(!botsActive)}
              >
                <Bot className="w-4 h-4 mr-2" />
                Bots {botsActive ? 'Ativos' : 'Inativos'}
              </Button>
              <Button
                variant={realTimeUpdates ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRealTimeUpdates(!realTimeUpdates)}
              >
                <Zap className="w-4 h-4 mr-2" />
                Tempo Real
              </Button>
            </div>
          </div>
        </div>

        {/* Estatísticas em tempo real */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Volume Total</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(marketplaceStats.totalVolume)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Transações</p>
                  <p className="text-2xl font-bold">{marketplaceStats.totalTransactions}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Usuários Ativos</p>
                  <p className="text-2xl font-bold">{marketplaceStats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Bots Ativos</p>
                  <p className="text-2xl font-bold">{botsActive ? '5' : '0'}</p>
                </div>
                <Bot className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Receita</p>
                  <p className="text-2xl font-bold">{formatCurrency(marketplaceStats.revenue)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Crescimento</p>
                  <p className="text-2xl font-bold">+{marketplaceStats.dailyGrowth}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs principais */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="bots">Sistema de Bots</TabsTrigger>
            <TabsTrigger value="admin">Administração</TabsTrigger>
            <TabsTrigger value="simulation">Simulações</TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-6">
            {/* Filtros e busca */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar por título, descrição ou vendedor..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevância</SelectItem>
                    <SelectItem value="price_asc">Menor Preço</SelectItem>
                    <SelectItem value="price_desc">Maior Preço</SelectItem>
                    <SelectItem value="ending_soon">Terminando Logo</SelectItem>
                    <SelectItem value="newest">Mais Recentes</SelectItem>
                    <SelectItem value="most_bids">Mais Lances</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filtros
                </Button>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Filtros avançados */}
            {showAdvancedFilters && (
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de Crédito" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os Tipos</SelectItem>
                        <SelectItem value="ICMS">ICMS</SelectItem>
                        <SelectItem value="PIS/COFINS">PIS/COFINS</SelectItem>
                        <SelectItem value="IPI">IPI</SelectItem>
                        <SelectItem value="ISS">ISS</SelectItem>
                        <SelectItem value="IRPJ/CSLL">IRPJ/CSLL</SelectItem>
                        <SelectItem value="Precatório">Precatório</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos Status</SelectItem>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="ending_soon">Terminando</SelectItem>
                        <SelectItem value="buy_now">Compra Direta</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setFilterType('todos');
                        setFilterStatus('todos');
                        setSearchTerm('');
                      }}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Limpar Filtros
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lista de créditos */}
            <div
              className={
                viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'
              }
            >
              {filteredCredits.map(credit => (
                <Card key={credit.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg line-clamp-2">{credit.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {credit.creditType}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {credit.category === 'auction' ? (
                              <>
                                <Gavel className="w-3 h-3 mr-1" />
                                Leilão
                              </>
                            ) : credit.category === 'buy_now' ? (
                              <>
                                <ShoppingCart className="w-3 h-3 mr-1" />
                                Comprar Agora
                              </>
                            ) : (
                              <>
                                <Users className="w-3 h-3 mr-1" />
                                Negociável
                              </>
                            )}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge
                          className={
                            credit.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : credit.status === 'ending_soon'
                                ? 'bg-red-100 text-red-800'
                                : credit.status === 'buy_now'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {credit.status === 'active'
                            ? 'Ativo'
                            : credit.status === 'ending_soon'
                              ? 'Terminando'
                              : credit.status === 'buy_now'
                                ? 'Compre Agora'
                                : 'Encerrado'}
                        </Badge>
                        {credit.botGenerated && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            <Bot className="w-3 h-3 mr-1" />
                            Bot
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleToggleFavorite(credit.id)}
                        >
                          <Heart
                            className={`w-4 h-4 ${favoriteCredits.has(credit.id) ? 'fill-red-500 text-red-500' : ''}`}
                          />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{credit.description}</p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Valor do Título</span>
                        <span className="font-semibold">{formatCurrency(credit.creditValue)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Preço Atual</span>
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(credit.currentPrice)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Desconto</span>
                        <span className="text-sm font-medium text-green-600">
                          {credit.discount}% OFF
                        </span>
                      </div>
                    </div>

                    {credit.category === 'auction' && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span
                            className={
                              credit.status === 'ending_soon'
                                ? 'text-red-600 font-medium'
                                : 'text-gray-600'
                            }
                          >
                            {formatTimeRemaining(credit.timeRemaining)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Gavel className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{credit.totalBids}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{credit.participants}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={credit.seller.avatar}
                            alt={credit.seller.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{credit.seller.rating}</span>
                          </div>
                          {credit.seller.verified && (
                            <Badge variant="outline" className="text-xs">
                              Verificado
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {credit.seller.location}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{credit.seller.name}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => handleShowDetails(credit)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Detalhes
                      </Button>

                      {credit.category === 'auction' && credit.status === 'active' && (
                        <Button className="flex-1" onClick={() => handlePlaceBid(credit)}>
                          <Gavel className="w-4 h-4 mr-2" />
                          Dar Lance
                        </Button>
                      )}

                      {credit.category === 'buy_now' && (
                        <Button className="flex-1" onClick={() => handleBuyNow(credit)}>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Comprar
                        </Button>
                      )}

                      {credit.category === 'negotiable' && (
                        <Button className="flex-1" onClick={() => handleNegotiate(credit)}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Negociar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bots" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Sistema de Bots
                </CardTitle>
                <p className="text-sm text-gray-600">Automatize suas operações no marketplace</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Controles Simples de Bots */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${botsActive ? 'bg-green-500' : 'bg-gray-400'}`}
                        />
                        <div>
                          <p className="font-medium">Trading Automatizado</p>
                          <p className="text-sm text-gray-600">
                            {botsActive ? 'Bots ativos operando no marketplace' : 'Bots pausados'}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          setBotsActive(!botsActive);
                          toast.success(botsActive ? 'Bots pausados' : 'Bots ativados');
                        }}
                        variant={botsActive ? 'destructive' : 'default'}
                        size="sm"
                      >
                        {botsActive ? (
                          <>
                            <Pause className="w-4 h-4 mr-2" />
                            Pausar Trading
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Ativar Trading
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <RefreshCw className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium">Controle de Sistema</p>
                          <p className="text-sm text-gray-600">
                            Reiniciar ou resetar sistema de bots
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          // Reiniciar sistema de bots
                          setBotActivities([]);
                          toast.success('Sistema de bots reiniciado');
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reiniciar
                      </Button>
                    </div>

                    {/* Status Simples */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-blue-600">{botsActive ? '5' : '0'}</p>
                        <p className="text-sm text-gray-600">Bots Ativos</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {botsActive ? 'Operando' : 'Pausado'}
                        </p>
                        <p className="text-sm text-gray-600">Status</p>
                      </div>
                    </div>
                  </div>

                  {/* Aviso para Administradores */}
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-yellow-600" />
                      <p className="font-medium text-yellow-800">Acesso Administrativo</p>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Para configurações avançadas, métricas detalhadas e controle completo dos
                      bots, acesse o <strong>Painel de Controle de Bots</strong> na área
                      administrativa.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <AdminDashboard
              stats={marketplaceStats}
              botActivities={botActivities}
              credits={credits}
              isAdmin={isAdmin}
            />
          </TabsContent>

          <TabsContent value="simulation">
            <SimulationCenter
              currentStats={marketplaceStats}
              onRunSimulation={results => {
                toast.success('Simulação executada com sucesso!');
                console.log('Simulation results:', results);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <CreditDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedCredit(null);
        }}
        credit={selectedCredit}
        onBuy={handleBuyNow}
        onBid={handlePlaceBid}
        onNegotiate={handleNegotiate}
      />

      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => {
          setShowPurchaseModal(false);
          setSelectedCredit(null);
        }}
        credit={selectedCredit}
        onConfirm={handlePurchaseConfirm}
      />

      <BidModal
        isOpen={showBidModal}
        onClose={() => {
          setShowBidModal(false);
          setSelectedCredit(null);
        }}
        credit={selectedCredit}
        onConfirm={handleBidConfirm}
      />

      <NegotiationModal
        isOpen={showNegotiationModal}
        onClose={() => {
          setShowNegotiationModal(false);
          setSelectedCredit(null);
        }}
        credit={selectedCredit}
        onConfirm={handleNegotiationConfirm}
      />

      <DigitalCessionModal
        isOpen={showCessionModal}
        onClose={() => {
          setShowCessionModal(false);
          setSelectedCredit(null);
          setPurchaseData(null);
        }}
        credit={selectedCredit}
        purchaseData={purchaseData}
        onComplete={handleCessionComplete}
      />
    </div>
  );
}
