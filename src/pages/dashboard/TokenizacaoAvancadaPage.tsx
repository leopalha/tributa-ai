import React from 'react';
import { AdvancedTokenizationWizard } from '@/components/tokenization/AdvancedTokenizationWizard';

export default function TokenizacaoAvancadaPage() {
  const handleComplete = (data: any) => {
    console.log('Tokenização concluída:', data);
    // Aqui você pode redirecionar ou mostrar uma mensagem de sucesso
  };

  const handleCancel = () => {
    // Voltar para a página anterior ou dashboard
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <AdvancedTokenizationWizard onComplete={handleComplete} onCancel={handleCancel} />
    </div>
  );
}
