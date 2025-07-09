import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  AlertTriangle,
  TrendingUp,
  Shield,
  Eye,
  Bell,
  Users,
  Activity,
  DollarSign,
  BarChart3,
  Target,
  Zap,
} from 'lucide-react';
import {
  arkhamIntelligenceService,
  Entity,
  Alert,
  PortfolioMetrics,
} from '@/services/arkham-intelligence.service';
import { Alert as UIAlert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

const ArkhamIntelligence: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Entity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [alertsData, metricsData] = await Promise.all([
        arkhamIntelligenceService.getAlerts().toPromise(),
        arkhamIntelligenceService.getPortfolioMetrics().toPromise(),
      ]);
      
      setAlerts(alertsData || []);
      setMetrics(metricsData || null);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await arkhamIntelligenceService.searchEntities(searchQuery).toPromise();
      setSearchResults(results || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleEntityClick = async (entity: Entity) => {
    setSelectedEntity(entity);
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-500';
    if (score < 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getEntityTypeIcon = (type: Entity['type']) => {
    switch (type) {
      case 'wallet':
        return <Users className="h-4 w-4" />;
      case 'exchange':
        return <Activity className="h-4 w-4" />;
      case 'defi':
        return <Zap className="h-4 w-4" />;
      case 'contract':
        return <Target className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Arkham Intelligence</h1>
          <p className="text-muted-foreground">
            Advanced blockchain analytics and entity profiling
          </p>
        </div>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Entity Search</CardTitle>
          <CardDescription>
            Search for addresses, entities, or tags
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter address, name, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Overview */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">
                    ${metrics?.totalValue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                  <p className="text-2xl font-bold">
                    {metrics?.totalTransactions.toLocaleString()}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Counterparties</p>
                  <p className="text-2xl font-bold">
                    {metrics?.uniqueCounterparties.toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Risk Score</p>
                  <p className={`text-2xl font-bold ${getRiskColor(metrics?.riskScore || 0)}`}>
                    {metrics?.riskScore}%
                  </p>
                </div>
                <Shield className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                  <p className="text-2xl font-bold">{metrics?.alerts}</p>
                </div>
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tracked</p>
                  <p className="text-2xl font-bold">{metrics?.trackedEntities}</p>
                </div>
                <Eye className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Results / Entity List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {searchResults.length > 0 ? 'Search Results' : 'Tracked Entities'}
              </CardTitle>
              <CardDescription>
                {searchResults.length > 0
                  ? `Found ${searchResults.length} entities`
                  : 'Your monitored addresses and entities'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {searchResults.length > 0 ? (
                    searchResults.map((entity) => (
                      <Card
                        key={entity.id}
                        className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => handleEntityClick(entity)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getEntityTypeIcon(entity.type)}
                                <h4 className="font-semibold">
                                  {entity.name || entity.address.slice(0, 10) + '...'}
                                </h4>
                                <Badge variant="outline">{entity.type}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground font-mono">
                                {entity.address}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {entity.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-4 mt-3 text-sm">
                                <span>
                                  Balance: ${entity.balance.toLocaleString()}
                                </span>
                                <span>Txns: {entity.transactionCount}</span>
                                <span className={getRiskColor(entity.riskScore)}>
                                  Risk: {entity.riskScore}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      {isSearching ? (
                        <div className="space-y-2">
                          <Skeleton className="h-20 w-full" />
                          <Skeleton className="h-20 w-full" />
                          <Skeleton className="h-20 w-full" />
                        </div>
                      ) : (
                        'Search for entities to begin tracking'
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Panel */}
        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Alerts</CardTitle>
                <Button size="sm" variant="outline">
                  Create Alert
                </Button>
              </div>
              <CardDescription>
                Real-time notifications for tracked entities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {alerts
                    .filter((alert) => alert.active)
                    .map((alert) => (
                      <UIAlert key={alert.id}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold">{alert.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Type: {alert.type}
                              </p>
                              {alert.lastTriggered && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Last triggered:{' '}
                                  {alert.lastTriggered.toLocaleString()}
                                </p>
                              )}
                            </div>
                            <Badge variant="outline">
                              {alert.triggerCount} triggers
                            </Badge>
                          </div>
                        </AlertDescription>
                      </UIAlert>
                    ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Selected Entity Details */}
      {selectedEntity && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getEntityTypeIcon(selectedEntity.type)}
                <CardTitle>
                  {selectedEntity.name || 'Unknown Entity'}
                </CardTitle>
              </div>
              <div className="flex gap-2">
                <Button size="sm">View Full Profile</Button>
                <Button size="sm" variant="outline">
                  Track Entity
                </Button>
              </div>
            </div>
            <CardDescription className="font-mono">
              {selectedEntity.address}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Risk Score</p>
                <div className="flex items-center gap-2">
                  <Progress
                    value={selectedEntity.riskScore}
                    className="flex-1"
                  />
                  <span className={`font-bold ${getRiskColor(selectedEntity.riskScore)}`}>
                    {selectedEntity.riskScore}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">First Seen</p>
                <p className="font-semibold">
                  {selectedEntity.firstSeen.toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Active</p>
                <p className="font-semibold">
                  {selectedEntity.lastActive.toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ArkhamIntelligence;