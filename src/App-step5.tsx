import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Páginas básicas
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Layout
import DashboardLayout from '@/components/layout/DashboardLayout';

// Providers
import { ToastProvider } from '@/providers/ToastProvider';
import { SessionProvider } from '@/providers/SessionProvider';
import { EmpresaProvider } from '@/providers/EmpresaProvider';

// Importar o useEmpresa para teste
import { useEmpresa } from '@/providers/EmpresaProvider';

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
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
          <h1>🚨 Erro detectado!</h1>
          <p>Erro: {this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Recarregar Página</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Componente Dashboard que usa hooks dos providers
const DashboardComHooks = () => {
  console.log('🔌 Testando hooks dos providers...');

  try {
    const { empresas, empresaAtual, loading } = useEmpresa();

    return (
      <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ color: '#1e40af' }}>🎯 Dashboard Principal - Hooks Funcionando!</h1>
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            marginTop: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          <p>
            <strong>Step 5:</strong> Hooks dos providers funcionando!
          </p>

          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '20px' }}>
            <li style={{ marginBottom: '5px' }}>✅ React funcionando</li>
            <li style={{ marginBottom: '5px' }}>✅ ToastProvider ativo</li>
            <li style={{ marginBottom: '5px' }}>✅ SessionProvider ativo</li>
            <li style={{ marginBottom: '5px' }}>✅ EmpresaProvider ativo</li>
            <li style={{ marginBottom: '5px' }}>✅ useEmpresa hook funcionando</li>
            <li style={{ marginBottom: '5px' }}>✅ DashboardLayout ativo</li>
          </ul>

          <div
            style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '5px',
              marginTop: '15px',
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', color: '#2d3748' }}>📊 Dados do EmpresaProvider:</h3>
            <p>
              <strong>Loading:</strong> {loading ? 'Sim' : 'Não'}
            </p>
            <p>
              <strong>Total de empresas:</strong> {empresas.length}
            </p>
            <p>
              <strong>Empresa atual:</strong> {empresaAtual?.nome || 'Nenhuma'}
            </p>
            {empresaAtual && (
              <div style={{ marginTop: '10px' }}>
                <p>
                  <strong>CNPJ:</strong> {empresaAtual.cnpj}
                </p>
                <p>
                  <strong>Email:</strong> {empresaAtual.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ color: '#dc2626' }}>❌ Erro nos hooks</h1>
        <p>Erro: {(error as Error).message}</p>
      </div>
    );
  }
};

// Componente de placeholder para outras páginas
const DashboardPlaceholder = ({ title }: { title: string }) => (
  <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
    <h1 style={{ color: '#1e40af' }}>🚧 {title}</h1>
    <div
      style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}
    >
      <p>
        <strong>Step 5:</strong> Providers funcionando, hooks testados!
      </p>
      <p style={{ marginTop: '15px', fontSize: '0.9rem', color: '#6b7280' }}>
        Página atual: <strong>{title}</strong>
      </p>
    </div>
  </div>
);

function App() {
  console.log('🔧 App Step 5: Testando hooks dos providers');

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <SessionProvider>
          <EmpresaProvider>
            <ToastProvider>
              <Router>
                <Routes>
                  {/* Rotas públicas */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />

                  {/* Rotas do dashboard com layout */}
                  <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<DashboardComHooks />} />
                    <Route
                      path="blockchain"
                      element={<DashboardPlaceholder title="Blockchain" />}
                    />
                    <Route
                      path="compensacao"
                      element={<DashboardPlaceholder title="Compensação" />}
                    />
                    <Route
                      path="obrigacoes"
                      element={<DashboardPlaceholder title="Obrigações" />}
                    />
                    <Route
                      path="relatorios"
                      element={<DashboardPlaceholder title="Relatórios" />}
                    />
                    <Route
                      path="configuracoes"
                      element={<DashboardPlaceholder title="Configurações" />}
                    />
                    <Route
                      path="risco"
                      element={<DashboardPlaceholder title="Gestão de Risco" />}
                    />
                    <Route
                      path="marketplace"
                      element={<DashboardPlaceholder title="Marketplace" />}
                    />
                    <Route path="titulos" element={<DashboardPlaceholder title="Títulos" />} />
                    <Route path="empresas" element={<DashboardPlaceholder title="Empresas" />} />
                    <Route
                      path="declaracoes"
                      element={<DashboardPlaceholder title="Declarações" />}
                    />
                  </Route>

                  {/* 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Router>
            </ToastProvider>
          </EmpresaProvider>
        </SessionProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
