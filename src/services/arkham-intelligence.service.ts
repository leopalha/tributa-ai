import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Entity {
  id: string;
  address: string;
  name?: string;
  type: 'wallet' | 'exchange' | 'defi' | 'contract' | 'unknown';
  tags: string[];
  labels: Label[];
  riskScore: number;
  balance: number;
  transactionCount: number;
  firstSeen: Date;
  lastActive: Date;
  profilePicture?: string;
}

export interface Label {
  id: string;
  name: string;
  category: 'exchange' | 'defi' | 'whale' | 'bot' | 'scam' | 'other';
  confidence: number;
  addedBy: string;
  addedAt: Date;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: number;
  gas: number;
  gasPrice: number;
  timestamp: Date;
  status: 'success' | 'failed' | 'pending';
  method?: string;
  tags?: string[];
}

export interface Alert {
  id: string;
  name: string;
  type: 'transaction' | 'balance' | 'pattern' | 'counterparty';
  conditions: any;
  active: boolean;
  createdAt: Date;
  lastTriggered?: Date;
  triggerCount: number;
}

export interface IntelligenceItem {
  id: string;
  title: string;
  description: string;
  category: 'analysis' | 'alert' | 'pattern' | 'discovery';
  author: string;
  price: number;
  purchases: number;
  rating: number;
  createdAt: Date;
  tags: string[];
}

export interface Bounty {
  id: string;
  title: string;
  description: string;
  reward: number;
  status: 'open' | 'claimed' | 'completed';
  createdBy: string;
  createdAt: Date;
  deadline: Date;
  submissions: number;
}

export interface PortfolioMetrics {
  totalValue: number;
  totalTransactions: number;
  uniqueCounterparties: number;
  riskScore: number;
  alerts: number;
  trackedEntities: number;
}

export class ArkhamIntelligenceService {
  // Mock data generators
  private generateMockEntity(address: string): Entity {
    const types: Entity['type'][] = ['wallet', 'exchange', 'defi', 'contract'];
    const tags = ['Active Trader', 'DeFi User', 'NFT Collector', 'Whale', 'Smart Money'];
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      address,
      name: Math.random() > 0.5 ? `Entity ${address.slice(0, 6)}` : undefined,
      type: types[Math.floor(Math.random() * types.length)],
      tags: tags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1),
      labels: this.generateMockLabels(),
      riskScore: Math.floor(Math.random() * 100),
      balance: Math.floor(Math.random() * 1000000),
      transactionCount: Math.floor(Math.random() * 10000),
      firstSeen: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    };
  }

  private generateMockLabels(): Label[] {
    const categories: Label['category'][] = ['exchange', 'defi', 'whale', 'bot', 'scam'];
    const names = ['Binance', 'Uniswap', 'Aave', 'Compound', 'SushiSwap'];
    
    return Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({
      id: Math.random().toString(36).substr(2, 9),
      name: names[Math.floor(Math.random() * names.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      confidence: Math.floor(Math.random() * 30) + 70,
      addedBy: 'System',
      addedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    }));
  }

  private generateMockTransactions(count: number): Transaction[] {
    return Array.from({ length: count }, () => ({
      hash: '0x' + Math.random().toString(16).substr(2, 64),
      from: '0x' + Math.random().toString(16).substr(2, 40),
      to: '0x' + Math.random().toString(16).substr(2, 40),
      value: Math.random() * 100,
      gas: Math.floor(Math.random() * 100000) + 21000,
      gasPrice: Math.floor(Math.random() * 100) + 10,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      status: Math.random() > 0.1 ? 'success' : 'failed',
      method: Math.random() > 0.5 ? 'transfer' : 'swap',
    }));
  }

  // Entity Analysis
  searchEntities(query: string): Observable<Entity[]> {
    const mockResults = Array.from({ length: 10 }, () => 
      this.generateMockEntity('0x' + Math.random().toString(16).substr(2, 40))
    );
    
    return of(mockResults.filter(e => 
      e.address.includes(query) || 
      e.name?.toLowerCase().includes(query.toLowerCase()) ||
      e.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
    )).pipe(delay(500));
  }

  getEntityProfile(address: string): Observable<Entity> {
    return of(this.generateMockEntity(address)).pipe(delay(300));
  }

  getEntityTransactions(address: string, limit: number = 50): Observable<Transaction[]> {
    return of(this.generateMockTransactions(limit)).pipe(delay(500));
  }

  getCounterparties(address: string): Observable<{ entity: Entity; transactionCount: number; volume: number }[]> {
    const counterparties = Array.from({ length: 10 }, () => ({
      entity: this.generateMockEntity('0x' + Math.random().toString(16).substr(2, 40)),
      transactionCount: Math.floor(Math.random() * 100),
      volume: Math.floor(Math.random() * 100000),
    }));
    
    return of(counterparties).pipe(delay(400));
  }

  // Tags and Labels
  addLabel(address: string, label: Omit<Label, 'id' | 'addedAt'>): Observable<Label> {
    const newLabel: Label = {
      ...label,
      id: Math.random().toString(36).substr(2, 9),
      addedAt: new Date(),
    };
    
    return of(newLabel).pipe(delay(200));
  }

  removeLabel(address: string, labelId: string): Observable<boolean> {
    return of(true).pipe(delay(200));
  }

  // Pattern Detection
  detectPatterns(address: string): Observable<{ pattern: string; confidence: number; description: string }[]> {
    const patterns = [
      { pattern: 'DeFi Farmer', confidence: 85, description: 'Frequently interacts with DeFi protocols' },
      { pattern: 'Arbitrage Bot', confidence: 72, description: 'Executes similar transactions across multiple DEXs' },
      { pattern: 'NFT Trader', confidence: 68, description: 'Regular NFT marketplace interactions' },
      { pattern: 'Whale Alert', confidence: 91, description: 'Large balance holder with significant market impact' },
    ];
    
    return of(patterns.slice(0, Math.floor(Math.random() * 3) + 1)).pipe(delay(600));
  }

  // Alerts
  getAlerts(): Observable<Alert[]> {
    const alerts = Array.from({ length: 5 }, (_, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: `Alert ${i + 1}`,
      type: ['transaction', 'balance', 'pattern', 'counterparty'][Math.floor(Math.random() * 4)] as Alert['type'],
      conditions: {},
      active: Math.random() > 0.3,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      lastTriggered: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) : undefined,
      triggerCount: Math.floor(Math.random() * 50),
    }));
    
    return of(alerts).pipe(delay(300));
  }

  createAlert(alert: Omit<Alert, 'id' | 'createdAt' | 'triggerCount'>): Observable<Alert> {
    const newAlert: Alert = {
      ...alert,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      triggerCount: 0,
    };
    
    return of(newAlert).pipe(delay(200));
  }

  // Intelligence Exchange
  getIntelligenceItems(category?: string): Observable<IntelligenceItem[]> {
    const items = Array.from({ length: 20 }, (_, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      title: `Intelligence Report ${i + 1}`,
      description: 'Detailed analysis of on-chain activities and patterns',
      category: ['analysis', 'alert', 'pattern', 'discovery'][Math.floor(Math.random() * 4)] as IntelligenceItem['category'],
      author: `Analyst${Math.floor(Math.random() * 100)}`,
      price: Math.floor(Math.random() * 100) * 10,
      purchases: Math.floor(Math.random() * 1000),
      rating: Math.floor(Math.random() * 2) + 3,
      createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
      tags: ['DeFi', 'Whale', 'Trading', 'Security'].sort(() => 0.5 - Math.random()).slice(0, 2),
    }));
    
    return of(category ? items.filter(i => i.category === category) : items).pipe(delay(400));
  }

  getBounties(status?: string): Observable<Bounty[]> {
    const bounties = Array.from({ length: 10 }, (_, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      title: `Bounty ${i + 1}: Find ${['whale wallets', 'DeFi exploits', 'new protocols', 'trading patterns'][Math.floor(Math.random() * 4)]}`,
      description: 'Detailed investigation required for specific on-chain activities',
      reward: Math.floor(Math.random() * 5000) + 500,
      status: ['open', 'claimed', 'completed'][Math.floor(Math.random() * 3)] as Bounty['status'],
      createdBy: `User${Math.floor(Math.random() * 100)}`,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      deadline: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
      submissions: Math.floor(Math.random() * 20),
    }));
    
    return of(status ? bounties.filter(b => b.status === status) : bounties).pipe(delay(300));
  }

  // Portfolio Metrics
  getPortfolioMetrics(): Observable<PortfolioMetrics> {
    return of({
      totalValue: Math.floor(Math.random() * 10000000),
      totalTransactions: Math.floor(Math.random() * 50000),
      uniqueCounterparties: Math.floor(Math.random() * 1000),
      riskScore: Math.floor(Math.random() * 100),
      alerts: Math.floor(Math.random() * 20),
      trackedEntities: Math.floor(Math.random() * 100),
    }).pipe(delay(200));
  }

  // Risk Analysis
  calculateRiskScore(address: string): Observable<{ score: number; factors: { factor: string; impact: number }[] }> {
    const factors = [
      { factor: 'Transaction Volume', impact: Math.floor(Math.random() * 30) },
      { factor: 'Counterparty Risk', impact: Math.floor(Math.random() * 25) },
      { factor: 'Contract Interactions', impact: Math.floor(Math.random() * 20) },
      { factor: 'Account Age', impact: Math.floor(Math.random() * 15) },
      { factor: 'Pattern Anomalies', impact: Math.floor(Math.random() * 10) },
    ];
    
    const score = factors.reduce((sum, f) => sum + f.impact, 0);
    
    return of({ score, factors }).pipe(delay(500));
  }
}

export const arkhamIntelligenceService = new ArkhamIntelligenceService();