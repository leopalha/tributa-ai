'use client';

import { useContext } from 'react';
import { EmpresaContext } from '@/providers/EmpresaProvider';

export function useEmpresa() {
  const context = useContext(EmpresaContext);

  if (!context) {
    throw new Error('useEmpresa must be used within an EmpresaProvider');
  }

  // Retornar o contexto com compatibilidade
  return context;
}
