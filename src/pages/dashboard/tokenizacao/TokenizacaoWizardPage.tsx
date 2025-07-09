import React from 'react';
import { AdvancedTokenizationWizard } from '@/components/tokenization/AdvancedTokenizationWizard';
import { useNavigate } from 'react-router-dom';

export default function TokenizacaoWizardPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <AdvancedTokenizationWizard
        onComplete={(data) => {
          console.log('Tokenização concluída:', data);
          navigate('/dashboard/tokenizacao/meus-tokens');
        }}
        onCancel={() => {
          navigate('/dashboard/tc');
        }}
      />
    </div>
  );
}