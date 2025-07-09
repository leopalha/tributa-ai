import { ThemeProvider } from '../providers/ThemeProvider';
import { EmpresaProvider } from '../providers/EmpresaProvider';
import { SessionProvider } from '../providers/SessionProvider';
import ErrorBoundary from './ErrorBoundary';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary componentName="RootLayout">
      <SessionProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <EmpresaProvider>{children}</EmpresaProvider>
        </ThemeProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}
