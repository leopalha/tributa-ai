import { useState, useEffect } from 'react';
import { BotProfile, BotTransaction, BotMetrics, BotControlPanel } from '@/types/bots';

// Importar o motor real de bots
let botEngine: any = null;

// Lazy loading do bot engine para evitar problemas de SSR
const getBotEngine = async () => {
  if (!botEngine) {
    const { botEngine: engine } = await import('@/services/bot-engine.service');
    botEngine = engine;
  }
  return botEngine;
};

export function useBotSystem() {
  const [bots, setBots] = useState<BotProfile[]>([]);
  const [transactions, setTransactions] = useState<BotTransaction[]>([]);
  const [metrics, setMetrics] = useState<BotMetrics | null>(null);
  const [controlPanel, setControlPanel] = useState<BotControlPanel | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar dados iniciais
  useEffect(() => {
    loadBotData();

    // Atualizar dados a cada 5 segundos
    const interval = setInterval(loadBotData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadBotData = async () => {
    try {
      const engine = await getBotEngine();

      setBots(engine.getBots());
      setTransactions(engine.getTransactions());
      setMetrics(engine.getMetrics());
      setControlPanel(engine.getControlPanel());

      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados dos bots:', error);
      setLoading(false);
    }
  };

  const startSystem = async () => {
    try {
      const engine = await getBotEngine();
      engine.startBotSystem();
      await loadBotData();
    } catch (error) {
      console.error('Erro ao iniciar sistema:', error);
    }
  };

  const stopSystem = async () => {
    try {
      const engine = await getBotEngine();
      engine.stopBotSystem();
      await loadBotData();
    } catch (error) {
      console.error('Erro ao parar sistema:', error);
    }
  };

  const pauseSystem = async () => {
    try {
      const engine = await getBotEngine();
      engine.pauseBotSystem();
      await loadBotData();
    } catch (error) {
      console.error('Erro ao pausar sistema:', error);
    }
  };

  const resumeSystem = async () => {
    try {
      const engine = await getBotEngine();
      engine.resumeBotSystem();
      await loadBotData();
    } catch (error) {
      console.error('Erro ao retomar sistema:', error);
    }
  };

  const toggleBot = async (botId: string) => {
    try {
      const engine = await getBotEngine();
      const bot = engine.getBot(botId);
      if (bot) {
        engine.updateBotConfig(botId, { ativo: !bot.ativo });
        await loadBotData();
      }
    } catch (error) {
      console.error('Erro ao alternar bot:', error);
    }
  };

  const updateBotConfig = async (botId: string, config: Partial<BotProfile>) => {
    try {
      const engine = await getBotEngine();
      engine.updateBotConfig(botId, config);
      await loadBotData();
    } catch (error) {
      console.error('Erro ao atualizar configuração do bot:', error);
    }
  };

  const updateControlConfig = async (config: Partial<BotControlPanel['configuracoes']>) => {
    try {
      const engine = await getBotEngine();
      engine.updateControlConfig(config);
      await loadBotData();
    } catch (error) {
      console.error('Erro ao atualizar configuração do controle:', error);
    }
  };

  const trainBot = async (botId: string) => {
    try {
      const engine = await getBotEngine();
      await engine.trainBot(botId);
      await loadBotData();
    } catch (error) {
      console.error('Erro ao treinar bot:', error);
    }
  };

  const trainAllBots = async () => {
    try {
      const engine = await getBotEngine();
      await engine.trainAllBots();
      await loadBotData();
    } catch (error) {
      console.error('Erro ao treinar todos os bots:', error);
    }
  };

  const getTitulos = async () => {
    try {
      const engine = await getBotEngine();
      return engine.getTitulos();
    } catch (error) {
      console.error('Erro ao obter títulos:', error);
      return [];
    }
  };

  const refreshData = async () => {
    await loadBotData();
  };

  return {
    // Data
    bots,
    transactions,
    metrics,
    controlPanel,
    loading,

    // Actions
    startSystem,
    stopSystem,
    pauseSystem,
    resumeSystem,
    toggleBot,
    updateBotConfig,
    updateControlConfig,
    trainBot,
    trainAllBots,
    getTitulos,
    refreshData,

    // Computed values
    isRunning: controlPanel?.status === 'ativo',
    isPaused: controlPanel?.status === 'pausado',
    isStopped: controlPanel?.status === 'parado',
    activeBots: bots.filter(bot => bot.ativo),
    totalVolume: transactions.reduce((sum, t) => sum + t.valor, 0),
    totalTransactions: transactions.length,

    // Utilities
    formatCurrency: (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    },

    formatNumber: (value: number) => {
      return new Intl.NumberFormat('pt-BR').format(value);
    },
  };
}
