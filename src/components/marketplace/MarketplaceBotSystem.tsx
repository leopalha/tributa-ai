import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Play, Pause, Settings, Activity, TrendingUp, DollarSign, Target } from 'lucide-react';
import { toast } from 'sonner';

interface BotActivity {
  id: string;
  botId: string;
  botName: string;
  action: string;
  creditId: string;
  creditTitle: string;
  amount?: number;
  timestamp: Date;
  success: boolean;
  details: string;
}

interface MarketplaceBotSystemProps {
  botActivities: BotActivity[];
  onToggleBots: (active: boolean) => void;
  botsActive: boolean;
  credits: any[];
  onUpdateCredits: (credits: any[]) => void;
}

export function MarketplaceBotSystem({
  botActivities,
  onToggleBots,
  botsActive,
}: MarketplaceBotSystemProps) {
  const [bots] = useState([
    {
      id: '1',
      name: 'TradingBot Alpha',
      type: 'trading',
      status: 'active',
      performance: { totalTransactions: 156, successRate: 87.5, totalProfit: 245000 },
    },
    {
      id: '2',
      name: 'CreditHunter Pro',
      type: 'credit_recovery',
      status: 'active',
      performance: { totalTransactions: 89, successRate: 92.1, totalProfit: 380000 },
    },
  ]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sistema de Bots</h2>
          <p className="text-gray-600">Automatize suas operações no marketplace</p>
        </div>
        <Button
          variant={botsActive ? 'destructive' : 'default'}
          onClick={() => onToggleBots(!botsActive)}
        >
          {botsActive ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Pausar Todos
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Ativar Todos
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bots.map(bot => (
          <Card key={bot.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  <CardTitle>{bot.name}</CardTitle>
                </div>
                <Badge
                  className={
                    bot.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }
                >
                  {bot.status === 'active' ? 'Ativo' : 'Parado'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Transações:</span>
                  <span>{bot.performance.totalTransactions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de Sucesso:</span>
                  <span>{bot.performance.successRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Lucro Total:</span>
                  <span className="text-green-600">
                    {formatCurrency(bot.performance.totalProfit)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
