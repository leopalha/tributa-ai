import React from 'react';
import { useDemoUser } from '@/hooks/useDemoUser';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { DemoDashboard } from '@/components/dashboard/DemoDashboard';
import { MainDashboard } from '@/components/dashboard/MainDashboard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function DashboardPage() {
  const { currentUser, isLoading, isAdmin, isDemoUserActive } = useDemoUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h2>
          <p className="text-gray-600">Você precisa estar logado para acessar esta página.</p>
        </div>
      </div>
    );
  }

  // Renderizar dashboard específico baseado no perfil
  if (isAdmin) {
    return <AdminDashboard />;
  }

  if (isDemoUserActive) {
    return <DemoDashboard />;
  }

  return <MainDashboard />;
}
