import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Clock,
  Copy,
  DollarSign,
  ExternalLink,
  Info,
  Shield,
  Tag,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  Zap,
} from 'lucide-react';
import {
  arkhamIntelligenceService,
  Entity,
  Transaction,
  Label,
} from '@/services/arkham-intelligence.service';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface EntityProfilerProps {
  address?: string;
}

const EntityProfiler: React.FC<EntityProfilerProps> = ({ address }) => {
  const [entity, setEntity] = useState<Entity | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [counterparties, setCounterparties] = useState<any[]>([]);
  const [patterns, setPatterns] = useState<any[]>([]);
  const [riskAnalysis, setRiskAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    if (address) {
      loadEntityData(address);
    }
  }, [address]);

  const loadEntityData = async (addr: string) => {
    setIsLoading(true);
    try {
      const [entityData, txData, counterpartyData, patternData, riskData] = await Promise.all([
        arkhamIntelligenceService.getEntityProfile(addr).toPromise(),
        arkhamIntelligenceService.getEntityTransactions(addr, 100).toPromise(),
        arkhamIntelligenceService.getCounterparties(addr).toPromise(),
        arkhamIntelligenceService.detectPatterns(addr).toPromise(),
        arkhamIntelligenceService.calculateRiskScore(addr).toPromise(),
      ]);

      setEntity(entityData || null);
      setTransactions(txData || []);
      setCounterparties(counterpartyData || []);
      setPatterns(patternData || []);
      setRiskAnalysis(riskData || null);
    } catch (error) {
      console.error('Error loading entity data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyAddress = () => {
    if (entity?.address) {
      navigator.clipboard.writeText(entity.address);
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-500';
    if (score < 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getTransactionTypeIcon = (tx: Transaction) => {
    return tx.from === entity?.address ? (
      <ArrowUpRight className="h-4 w-4 text-red-500" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-green-500" />
    );
  };

  // Mock data for charts
  const activityData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    transactions: Math.floor(Math.random() * 50) + 10,
    volume: Math.floor(Math.random() * 100000) + 1000,
  }));

  const labelDistribution = entity?.labels.reduce((acc, label) => {
    const existing = acc.find(item => item.category === label.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ category: label.category, value: 1 });
    }
    return acc;
  }, [] as { category: string; value: number }[]) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (!address || !entity) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Select an entity to view detailed profile
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <User className="h-6 w-6" />
                <CardTitle className="text-2xl">
                  {entity.name || 'Unknown Entity'}
                </CardTitle>
                <Badge variant="outline" className="text-lg">
                  {entity.type}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <CardDescription className="font-mono text-sm">
                  {entity.address}
                </CardDescription>
                <Button size="icon" variant="ghost" onClick={copyAddress}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Risk Score</p>
              <p className={`text-3xl font-bold ${getRiskColor(entity.riskScore)}`}>
                {entity.riskScore}%
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Balance</p>
              <p className="text-xl font-semibold">
                ${entity.balance.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="text-xl font-semibold">
                {entity.transactionCount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">First Seen</p>
              <p className="text-xl font-semibold">
                {entity.firstSeen.toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Active</p>
              <p className="text-xl font-semibold">
                {entity.lastActive.toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {entity.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detected Patterns Alert */}
      {patterns.length > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-2">Detected Patterns:</p>
            <div className="space-y-1">
              {patterns.map((pattern, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span>{pattern.pattern}: {pattern.description}</span>
                  <Badge variant="outline">{pattern.confidence}% confidence</Badge>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="counterparties">Counterparties</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Over Time</CardTitle>
                <CardDescription>
                  Transaction count and volume trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Area
                      type="monotone"
                      dataKey="transactions"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Labels Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Label Distribution</CardTitle>
                <CardDescription>
                  Entity classification breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={labelDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ category, value }) => `${category}: ${value}`}
                    >
                      {labelDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Labels List */}
          <Card>
            <CardHeader>
              <CardTitle>Entity Labels</CardTitle>
              <CardDescription>
                Community and system-assigned labels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {entity.labels.map((label) => (
                  <div key={label.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={label.category === 'scam' ? 'destructive' : 'default'}>
                        {label.category}
                      </Badge>
                      <div>
                        <p className="font-semibold">{label.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Added by {label.addedBy} on {label.addedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={label.confidence} className="w-20" />
                      <span className="text-sm font-medium">{label.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    Recent transactions for this entity
                  </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 Hours</SelectItem>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Hash</TableHead>
                      <TableHead>From/To</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Gas</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.hash}>
                        <TableCell>{getTransactionTypeIcon(tx)}</TableCell>
                        <TableCell className="font-mono text-sm">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                {tx.hash.slice(0, 10)}...
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{tx.hash}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {tx.from === entity?.address
                            ? tx.to.slice(0, 10) + '...'
                            : tx.from.slice(0, 10) + '...'}
                        </TableCell>
                        <TableCell>${tx.value.toFixed(2)}</TableCell>
                        <TableCell>{tx.gas.toLocaleString()}</TableCell>
                        <TableCell>
                          {tx.timestamp.toLocaleTimeString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={tx.status === 'success' ? 'default' : 'destructive'}
                          >
                            {tx.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Counterparties Tab */}
        <TabsContent value="counterparties">
          <Card>
            <CardHeader>
              <CardTitle>Top Counterparties</CardTitle>
              <CardDescription>
                Most frequently interacted addresses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {counterparties.map((cp, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="h-4 w-4" />
                              <h4 className="font-semibold">
                                {cp.entity.name || cp.entity.address.slice(0, 10) + '...'}
                              </h4>
                              <Badge variant="outline">{cp.entity.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground font-mono">
                              {cp.entity.address}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span>
                                <Activity className="h-3 w-3 inline mr-1" />
                                {cp.transactionCount} transactions
                              </span>
                              <span>
                                <DollarSign className="h-3 w-3 inline mr-1" />
                                ${cp.volume.toLocaleString()} volume
                              </span>
                              <span className={getRiskColor(cp.entity.riskScore)}>
                                <Shield className="h-3 w-3 inline mr-1" />
                                Risk: {cp.entity.riskScore}%
                              </span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            View Profile
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Behavior Tab */}
        <TabsContent value="behavior" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Patterns</CardTitle>
                <CardDescription>
                  Behavioral analysis over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Daily Transactions</span>
                    <span className="font-semibold">
                      {Math.floor(entity.transactionCount / 30)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Most Active Time</span>
                    <span className="font-semibold">14:00 - 18:00 UTC</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Preferred Gas Price</span>
                    <span className="font-semibold">45-60 Gwei</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Transaction Success Rate</span>
                    <span className="font-semibold">96.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Protocol Interactions</CardTitle>
                <CardDescription>
                  Most used DeFi protocols and contracts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Uniswap V3', 'Aave', 'Compound', 'SushiSwap'].map((protocol) => (
                    <div key={protocol} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        <span className="text-sm">{protocol}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={Math.random() * 100} className="w-20" />
                        <span className="text-sm font-medium">
                          {Math.floor(Math.random() * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detected Patterns Detail */}
          <Card>
            <CardHeader>
              <CardTitle>Behavioral Insights</CardTitle>
              <CardDescription>
                AI-detected patterns and anomalies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patterns.map((pattern, index) => (
                  <Alert key={index}>
                    <BarChart3 className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{pattern.pattern}</p>
                          <p className="text-sm mt-1">{pattern.description}</p>
                        </div>
                        <Badge>{pattern.confidence}% confidence</Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Analysis Tab */}
        <TabsContent value="risk">
          <Card>
            <CardHeader>
              <CardTitle>Risk Analysis</CardTitle>
              <CardDescription>
                Comprehensive risk assessment for this entity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Overall Risk Score */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Overall Risk Score
                  </p>
                  <p className={`text-6xl font-bold ${getRiskColor(riskAnalysis?.score || 0)}`}>
                    {riskAnalysis?.score || 0}%
                  </p>
                  <Progress
                    value={riskAnalysis?.score || 0}
                    className="w-full max-w-md mx-auto mt-4"
                  />
                </div>

                <Separator />

                {/* Risk Factors */}
                <div>
                  <h3 className="font-semibold mb-4">Risk Factors</h3>
                  <div className="space-y-3">
                    {riskAnalysis?.factors.map((factor: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle
                            className={`h-4 w-4 ${
                              factor.impact > 20
                                ? 'text-red-500'
                                : factor.impact > 10
                                ? 'text-yellow-500'
                                : 'text-green-500'
                            }`}
                          />
                          <span>{factor.factor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={factor.impact * 3.33} className="w-32" />
                          <span className="text-sm font-medium w-16 text-right">
                            {factor.impact}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Recommendations */}
                <div>
                  <h3 className="font-semibold mb-4">Recommendations</h3>
                  <div className="space-y-2">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        {riskAnalysis?.score > 70
                          ? 'High risk detected. Exercise extreme caution when interacting with this entity.'
                          : riskAnalysis?.score > 30
                          ? 'Moderate risk detected. Verify transactions carefully before proceeding.'
                          : 'Low risk profile. Standard precautions recommended.'}
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EntityProfiler;