import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/globals.css';

console.log('main.tsx iniciado');

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    console.error('ErrorBoundary capturou erro:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('React Error:', error, errorInfo);
  }

  render() {
    if ((this.state as any).hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Something went wrong.</h1>
          <p>Error: {((this.state as any).error as any)?.message}</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }

    return (this.props as any).children;
  }
}

console.log('Procurando elemento root...');
const container = document.getElementById('root');

if (!container) {
  console.error('Elemento root não encontrado!');
  throw new Error('Failed to find the root element');
}

console.log('Elemento root encontrado, criando React root...');
const root = createRoot(container);

console.log('Renderizando App...');
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

console.log('main.tsx finalizado');
