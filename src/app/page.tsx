import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

export const metadata = {
  title: 'Tribut.AI - Gestão Digital de Créditos Tributários',
  description: 'Plataforma de tokenização e marketplace para créditos tributários.',
};

export default async function Home() {
  // Verifica se o usuário está autenticado
  const session = await getServerSession(authOptions);

  // Se estiver logado, redireciona para o dashboard
  if (session) {
    redirect('/dashboard');
  }

  // Caso contrário, exibe a landing page
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="font-bold text-xl bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              Tribut.AI
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium">
              Login
            </Link>
            <Button asChild>
              <Link href="/registrar">Registre-se</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-24 px-4 md:px-6 bg-gradient-to-b from-background to-muted/50">
          <div className="container mx-auto flex flex-col items-center text-center space-y-8">
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                Gestão Digital de Créditos Tributários
              </h1>
              <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
                Tokenize, negocie e compense créditos tributários com segurança e eficiência.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button size="lg" asChild>
                  <Link href="/registrar">
                    Comece agora <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">Acessar plataforma</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 md:px-6">
          <div className="container mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Soluções para gestão tributária</h2>
              <p className="text-muted-foreground max-w-[800px] mx-auto">
                Nossa plataforma integra tecnologia blockchain e inteligência artificial para
                transformar a gestão de créditos tributários.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border rounded-lg p-6 bg-card">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold">Compensações Multilaterais</h3>
                  <p className="text-muted-foreground">
                    Realize compensações entre múltiplas empresas com validação automática.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Operações automáticas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Verificação em blockchain</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Confirmação em tempo real</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border rounded-lg p-6 bg-card">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold">Precificação Dinâmica</h3>
                  <p className="text-muted-foreground">
                    Calcule o valor ideal para seus créditos com base em análises de mercado.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Análise de dados históricos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>IA para sugestão de preços</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Otimização de lucros</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border rounded-lg p-6 bg-card">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold">Validações Avançadas</h3>
                  <p className="text-muted-foreground">
                    Integração com sistemas fiscais para validação oficial dos créditos.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Verificação de autenticidade</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Checagem de elegibilidade</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Auditoria permanente</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-muted py-6 px-4 md:px-6 border-t">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Tribut.AI. Todos os direitos reservados.
          </div>
          <div className="flex gap-4">
            <Link href="/termos" className="text-sm text-muted-foreground hover:text-foreground">
              Termos de Uso
            </Link>
            <Link
              href="/privacidade"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
