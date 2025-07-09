import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Páginas básicas
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import RecuperarSenhaPage from '@/pages/RecuperarSenhaPage';
import RedefinirSenhaPage from '@/pages/RedefinirSenhaPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Páginas do Dashboard
import DashboardPageSimple from '@/pages/dashboard/DashboardPageSimple';
import RecuperacaoPage from '@/pages/dashboard/RecuperacaoPage';
import AnaliseObrigacoesPage from '@/pages/dashboard/recuperacao/AnaliseObrigacoesPage';
import ResultadosAnalisePage from '@/pages/dashboard/recuperacao/ResultadosAnalisePage';
import CompensacaoBilateralPage from '@/pages/dashboard/recuperacao/CompensacaoBilateralPage';
import CompensacaoMultilateralPage from '@/pages/dashboard/recuperacao/CompensacaoMultilateralPage';
import ProcessosRecuperacaoPage from '@/pages/dashboard/recuperacao/ProcessosRecuperacaoPage';
import RelatoriosRecuperacaoPage from '@/pages/dashboard/recuperacao/RelatoriosRecuperacaoPage';
import BlockchainPage from '@/pages/dashboard/BlockchainPage';
import BlockchainExplorerPage from '@/pages/dashboard/blockchain/BlockchainExplorerPage';
import BlockchainStatusPage from '@/pages/dashboard/blockchain/BlockchainStatusPage';
import TransactionMapPage from '@/pages/dashboard/blockchain/TransactionMapPage';
import ArkhamIntelligencePage from '@/pages/dashboard/blockchain/ArkhamIntelligencePage';
import EntityProfilerPage from '@/pages/dashboard/blockchain/EntityProfilerPage';
import IntelExchangePage from '@/pages/dashboard/blockchain/IntelExchangePage';
import RelatoriosPage from '@/pages/dashboard/RelatoriosPage';
import ConfiguracoesPage from '@/pages/dashboard/ConfiguracoesPage';
import RiskPage from '@/pages/dashboard/RiskPage';
import StatusSystemPage from '@/pages/dashboard/StatusSystemPage';

import TokenizacaoPage from '@/pages/dashboard/TokenizacaoPage';
import TokenizacaoAvancadaPage from '@/pages/dashboard/TokenizacaoAvancadaPage';
import GestaoRiscoPage from '@/pages/dashboard/GestaoRiscoPage';
import KYCPage from '@/pages/dashboard/KYCPage';

// Admin Pages
import AdminDashboardPage from '@/pages/dashboard/admin/AdminDashboardPage';
import BotControlPage from '@/pages/dashboard/admin/BotControlPage';
import SystemHealthPage from '@/pages/dashboard/admin/SystemHealthPage';
import NotificationsPage from '@/pages/dashboard/admin/NotificationsPage';

// Fonte de Dados
import FonteDadosPage from '@/pages/dashboard/fonte-dados/FonteDadosPage';

// Tokenização
import CriarTokenPage from '@/pages/dashboard/tokenizacao/CriarTokenPage';
import MeusTokensPage from '@/pages/dashboard/tokenizacao/MeusTokensPage';
import TokenizacaoWizardPage from '@/pages/dashboard/tokenizacao/TokenizacaoWizardPage';
import WalletPage from '@/pages/dashboard/WalletPage';

// TC Pages
import TCPage from '@/pages/dashboard/tc/TCPage';
import NovoTCPage from '@/pages/dashboard/tc/NovoTCPage';

// Débitos Pages
import DebitosFiscaisPage from '@/pages/dashboard/debitos/DebitosFiscaisPage';

// Simulador Pages
import SimuladorFiscalPage from '@/pages/dashboard/simulador/SimuladorFiscalPage';

// Compensação Pages
import HistoricoCompensacaoPage from '@/pages/dashboard/compensacao/HistoricoCompensacaoPage';

// Configurações Pages
import PerfilPage from '@/pages/dashboard/configuracoes/PerfilPage';
import EmpresaPage from '@/pages/dashboard/configuracoes/EmpresaPage';
import UsuariosPage from '@/pages/dashboard/configuracoes/UsuariosPage';

// Relatórios Pages
import CompensacoesPage from '@/pages/dashboard/relatorios/CompensacoesPage';
import AuditoriasPage from '@/pages/dashboard/relatorios/AuditoriasPage';

// Marketplace Pages adicionais
import MinhasOfertasPage from '@/pages/dashboard/marketplace/MinhasOfertasPage';
import CarteiraPage from '@/pages/dashboard/marketplace/CarteiraPage';

// Trading Pages
import TradingPage from '@/pages/dashboard/TradingPage';
import TradingPageProfessional from '@/pages/dashboard/TradingPageProfessional';

// Marketplace Pages
import MarketplacePage from '@/pages/dashboard/MarketplacePage';
import ExplorarCreditosPage from '@/pages/dashboard/marketplace/ExplorarCreditosPage';
import NegociacoesPage from '@/pages/dashboard/marketplace/NegociacoesPage';
import ComprasPage from '@/pages/dashboard/marketplace/ComprasPage';
import VendasPage from '@/pages/dashboard/marketplace/VendasPage';
import AnunciosPage from '@/pages/dashboard/marketplace/AnunciosPage';
import DesejosPage from '@/pages/dashboard/marketplace/DesejosPage';
import MensagensPage from '@/pages/dashboard/marketplace/MensagensPage';
import AnalyticsMarketplacePage from '@/pages/dashboard/marketplace/AnalyticsPage';
import ConfiguracoesMarketplacePage from '@/pages/dashboard/marketplace/ConfiguracoesPage';

// Funcionalidades Avançadas
import { AdvancedTokenizationWizard } from '@/components/tokenization/AdvancedTokenizationWizard';
import { MultilateralCompensationEngine } from '@/components/compensation/MultilateralCompensationEngine';

// Providers
import { SessionProvider } from '@/providers/SessionProvider';
import { EmpresaProvider } from '@/providers/EmpresaProvider';
import { MarketplaceProvider } from '@/providers/MarketplaceProvider';
import { TCProvider } from '@/providers/TCProvider';
import { ToastProvider } from '@/providers/ToastProvider';

// Componentes de Onboarding
import { AdvancedKYCSystem } from '@/components/onboarding/AdvancedKYCSystem';

// Configurações
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

// Error Boundary simples
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('ErrorBoundary capturou erro:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1> Erro detectado!</h1>
          <p>Erro: {this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Recarregar Página</button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  console.log(' App completo com marketplace organizado - Tributa.AI funcionando!');

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <SessionProvider>
          <EmpresaProvider>
            <MarketplaceProvider>
              <TCProvider>
                <ToastProvider>
                  <Router>
                    <div className="min-h-screen bg-gray-50">
                      <Routes>
                        {/* Rotas públicas */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
                        <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />

                        {/* Rotas do Dashboard */}
                        <Route path="/dashboard" element={<DashboardLayout />}>
                          <Route index element={<DashboardPageSimple />} />

                          {/* Sistema de Recuperação */}
                          <Route path="recuperacao" element={<RecuperacaoPage />} />
                          <Route path="recuperacao/analise" element={<AnaliseObrigacoesPage />} />
                          <Route
                            path="recuperacao/creditos"
                            element={<Navigate to="/dashboard/recuperacao/resultados" replace />}
                          />
                          <Route
                            path="recuperacao/resultados"
                            element={<ResultadosAnalisePage />}
                          />
                          <Route
                            path="recuperacao/compensacao-bilateral"
                            element={<CompensacaoBilateralPage />}
                          />
                          <Route
                            path="recuperacao/compensacao-multilateral"
                            element={<CompensacaoMultilateralPage />}
                          />
                          <Route
                            path="recuperacao/processos"
                            element={<ProcessosRecuperacaoPage />}
                          />
                          <Route
                            path="recuperacao/relatorios"
                            element={<RelatoriosRecuperacaoPage />}
                          />

                          {/* Marketplace Routes */}
                          <Route path="marketplace" element={<ExplorarCreditosPage />} />
                          <Route path="marketplace/minhas-ofertas" element={<MinhasOfertasPage />} />
                          <Route path="marketplace/carteira" element={<CarteiraPage />} />
                          <Route path="marketplace/negociacoes" element={<NegociacoesPage />} />
                          <Route path="marketplace/compras" element={<ComprasPage />} />
                          <Route path="marketplace/vendas" element={<VendasPage />} />
                          <Route path="marketplace/anuncios" element={<AnunciosPage />} />
                          <Route path="marketplace/desejos" element={<DesejosPage />} />
                          <Route path="marketplace/mensagens" element={<MensagensPage />} />
                          <Route
                            path="marketplace/analytics"
                            element={<AnalyticsMarketplacePage />}
                          />
                          <Route
                            path="marketplace/configuracoes"
                            element={<ConfiguracoesMarketplacePage />}
                          />

                          {/* Páginas principais */}
                          <Route path="blockchain" element={<BlockchainPage />} />
                          <Route path="blockchain/explorer" element={<BlockchainExplorerPage />} />
                          <Route path="blockchain/status" element={<BlockchainStatusPage />} />
                          <Route path="blockchain/transaction-map" element={<TransactionMapPage />} />
                          <Route path="blockchain/arkham-intelligence" element={<ArkhamIntelligencePage />} />
                          <Route path="blockchain/entity-profiler" element={<EntityProfilerPage />} />
                          <Route path="blockchain/intel-exchange" element={<IntelExchangePage />} />
                          {/* Relatórios Routes */}
                          <Route path="relatorios" element={<RelatoriosPage />} />
                          <Route path="relatorios/compensacoes" element={<CompensacoesPage />} />
                          <Route path="relatorios/auditorias" element={<AuditoriasPage />} />

                          {/* Configurações Routes */}
                          <Route path="configuracoes" element={<ConfiguracoesPage />} />
                          <Route path="configuracoes/perfil" element={<PerfilPage />} />
                          <Route path="configuracoes/empresa" element={<EmpresaPage />} />
                          <Route path="configuracoes/usuario" element={<UsuariosPage />} />
                          <Route path="risk" element={<RiskPage />} />
                          <Route path="status" element={<StatusSystemPage />} />

                          {/* TC Routes */}
                          <Route path="tc" element={<TCPage />} />
                          <Route path="tc/novo" element={<NovoTCPage />} />

                          {/* Débitos Routes */}
                          <Route path="debitos" element={<DebitosFiscaisPage />} />

                          {/* Simulador Routes */}
                          <Route path="simulador" element={<SimuladorFiscalPage />} />

                          {/* Compensação Routes */}
                          <Route path="compensacao/historico" element={<HistoricoCompensacaoPage />} />

                          {/* Tokenização Routes */}
                          <Route path="tokenizacao" element={<TokenizacaoPage />} />
                          <Route path="tokenizacao/criar" element={<CriarTokenPage />} />
                          <Route path="tokenizacao/meus-tokens" element={<MeusTokensPage />} />
                          <Route path="tokenizacao/wizard" element={<TokenizacaoWizardPage />} />
                          <Route
                            path="tokenizacao-avancada"
                            element={<TokenizacaoAvancadaPage />}
                          />
                          <Route path="gestao-risco" element={<GestaoRiscoPage />} />
                          <Route path="kyc" element={<KYCPage />} />
                          <Route path="wallet" element={<WalletPage />} />

                          {/* Trading Routes */}
                          <Route path="trading" element={<TradingPage />} />
                          <Route path="trading-pro" element={<TradingPageProfessional />} />

                          {/* Fonte de Dados */}
                          <Route path="fonte-dados" element={<FonteDadosPage />} />

                          {/* Admin Routes */}
                          <Route path="admin" element={<AdminDashboardPage />} />
                          <Route path="admin/bots" element={<BotControlPage />} />
                          <Route path="admin/system-health" element={<SystemHealthPage />} />
                          <Route path="admin/notifications" element={<NotificationsPage />} />
                        </Route>

                        {/* Rotas adicionais fora do layout */}
                        <Route
                          path="/onboarding"
                          element={
                            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                              <AdvancedKYCSystem
                                userId="new-user"
                                onComplete={profile => {
                                  console.log('Onboarding concluído:', profile);
                                  window.location.href = '/dashboard';
                                }}
                                onCancel={() => {
                                  window.location.href = '/';
                                }}
                              />
                            </div>
                          }
                        />

                        {/* Rotas para demos úteis */}
                        <Route
                          path="/demo/tokenizacao"
                          element={
                            <div className="min-h-screen bg-gray-50 p-4">
                              <AdvancedTokenizationWizard
                                onComplete={data => console.log('Demo tokenização:', data)}
                                onCancel={() => window.history.back()}
                              />
                            </div>
                          }
                        />

                        <Route
                          path="/demo/compensacao"
                          element={
                            <div className="min-h-screen bg-gray-50 p-4">
                              <MultilateralCompensationEngine />
                            </div>
                          }
                        />

                        <Route
                          path="/demo/kyc"
                          element={
                            <div className="min-h-screen bg-gray-50 p-4">
                              <AdvancedKYCSystem
                                userId="demo"
                                onComplete={profile => console.log('Demo KYC:', profile)}
                                onCancel={() => window.history.back()}
                              />
                            </div>
                          }
                        />

                        {/* Fallback */}
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </div>
                  </Router>
                </ToastProvider>
              </TCProvider>
            </MarketplaceProvider>
          </EmpresaProvider>
        </SessionProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
