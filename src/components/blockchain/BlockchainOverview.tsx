import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Server, 
  Database, 
  Search, 
  TrendingUp, 
  Shield, 
  Users, 
  Target,
  Eye,
  ExternalLink,
  BarChart3,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { StatusConexao } from './StatusConexao';
import { arkhamIntelligenceService, PortfolioMetrics } from '@/services/arkham-intelligence.service';
import { useNavigate } from 'react-router-dom';

export function BlockchainOverview() {
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const data = await arkhamIntelligenceService.getPortfolioMetrics().toPromise();
      setMetrics(data || null);
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToArkham = () => {
    navigate('/blockchain/arkham-intelligence');
  };

  const handleNavigateToEntityProfiler = () => {
    navigate('/blockchain/entity-profiler');
  };

  const handleNavigateToIntelExchange = () => {
    navigate('/blockchain/intel-exchange');
  };

  return (
    <div className="space-y-6">
      {/* Main Overview Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Server className="h-5 w-5 mr-2 text-primary" />
            Blockchain Intelligence Platform
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <StatusConexao />

            {/* Real-time Metrics */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 bg-muted rounded-md animate-pulse">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-md">
                  <div className="flex items-center mb-2">
                    <Activity className="h-5 w-5 mr-2 text-blue-500" />
                    <h3 className="font-medium">Total Transactions</h3>
                  </div>
                  <p className="text-2xl font-bold">
                    {metrics?.totalTransactions.toLocaleString() || '0'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Across tracked entities
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-md">
                  <div className="flex items-center mb-2">
                    <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                    <h3 className="font-medium">Total Value</h3>
                  </div>
                  <p className="text-2xl font-bold">
                    ${metrics?.totalValue.toLocaleString() || '0'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Portfolio valuation
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-md">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 mr-2 text-purple-500" />
                    <h3 className="font-medium">Tracked Entities</h3>
                  </div>
                  <p className="text-2xl font-bold">
                    {metrics?.trackedEntities || '0'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Addresses monitored
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Intelligence Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Arkham Intelligence */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleNavigateToArkham}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold">Arkham Intelligence</h3>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Advanced entity search, tracking, and real-time alerts for blockchain addresses
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="secondary" className="text-xs">Search</Badge>
                  <Badge variant="secondary" className="text-xs">Alerts</Badge>
                  <Badge variant="secondary" className="text-xs">Tracking</Badge>
                </div>
                <Button size="sm" className="w-full">
                  Launch Dashboard
                </Button>
              </CardContent>
            </Card>

            {/* Entity Profiler */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleNavigateToEntityProfiler}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold">Entity Profiler</h3>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Deep analysis of wallet behavior, transaction patterns, and risk assessment
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="secondary" className="text-xs">Profiling</Badge>
                  <Badge variant="secondary" className="text-xs">Risk Analysis</Badge>
                  <Badge variant="secondary" className="text-xs">Patterns</Badge>
                </div>
                <Button size="sm" className="w-full">
                  Profile Entity
                </Button>
              </CardContent>
            </Card>

            {/* Intel Exchange */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleNavigateToIntelExchange}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    <h3 className="font-semibold">Intel Exchange</h3>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Marketplace for intelligence trading and research bounty system
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="secondary" className="text-xs">Marketplace</Badge>
                  <Badge variant="secondary" className="text-xs">Bounties</Badge>
                  <Badge variant="secondary" className="text-xs">Research</Badge>
                </div>
                <Button size="sm" className="w-full">
                  Explore Market
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Alert Summary */}
      {metrics && metrics.alerts > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-800">
                  Active Alerts
                </h3>
                <p className="text-sm text-orange-700">
                  You have {metrics.alerts} active alerts that require attention
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={handleNavigateToArkham}>
                View Alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Overview */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Portfolio Risk Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Risk Score</p>
                <p className={`text-2xl font-bold ${
                  metrics.riskScore < 30 ? 'text-green-500' : 
                  metrics.riskScore < 70 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {metrics.riskScore}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Counterparties</p>
                <p className="text-2xl font-bold">{metrics.uniqueCounterparties}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold">{metrics.alerts}</p>
              </div>
              <div className="text-center">
                <Button size="sm" onClick={handleNavigateToEntityProfiler}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analyze Risk
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
