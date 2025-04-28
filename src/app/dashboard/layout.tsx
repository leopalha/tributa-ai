import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Sidebar } from '@/components/layout/Sidebar';
import { SiteHeader } from '@/components/site-header';

export const metadata = {
  title: 'Dashboard - Tribut.AI',
  description: 'Painel de controle da plataforma Tribut.AI',
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Verificar se o usuário está autenticado
  if (!session) {
    redirect('/login?callbackUrl=/dashboard');
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <SiteHeader />
        <main className="flex-1 p-6 md:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
