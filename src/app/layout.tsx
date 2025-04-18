import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers/theme-provider';
import { UserProvider } from '@/providers/user-provider';
import { EmpresaProvider } from '@/providers/empresa-provider';
import { SiteHeader } from '@/components/site-header';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tributa.AI',
  description: 'Plataforma de Gestão de Créditos Tributários',
  keywords: ['créditos tributários', 'tributação', 'automação fiscal', 'gestão fiscal'],
  authors: [{ name: 'Tributa.AI' }],
  creator: 'Tributa.AI',
  publisher: 'Tributa.AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <EmpresaProvider>
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1">
                  <div className="container relative">
                    {children}
                  </div>
                </main>
              </div>
              <Toaster />
            </EmpresaProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 