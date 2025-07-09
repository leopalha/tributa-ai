import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Tipos básicos para empresa
interface Empresa {
  id: string;
  nome: string;
  cnpj: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  ativa: boolean;
  createdAt: Date;
}

interface EmpresaContextType {
  empresas: Empresa[];
  empresaAtual: Empresa | null;
  loading: boolean;
  error: string | null;
  setEmpresaAtual: (empresa: Empresa) => void;
  adicionarEmpresa: (empresa: Omit<Empresa, 'id' | 'createdAt'>) => void;
  atualizarEmpresa: (id: string, dados: Partial<Empresa>) => void;
  removerEmpresa: (id: string) => void;
  carregarEmpresas: () => Promise<void>;
}

const EmpresaContext = createContext<EmpresaContextType | undefined>(undefined);

// Export do contexto para uso em hooks
export { EmpresaContext };

export function EmpresaProvider({ children }: { children: ReactNode }) {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaAtual, setEmpresaAtual] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Carregar dados mock iniciais
    const mockEmpresas: Empresa[] = [
      {
        id: '1',
        nome: 'Empresa Demo LTDA',
        cnpj: '12.345.678/0001-90',
        email: 'contato@demo.com',
        telefone: '(11) 99999-9999',
        endereco: 'Rua Demo, 123',
        ativa: true,
        createdAt: new Date(),
      },
    ];

    setEmpresas(mockEmpresas);
    if (mockEmpresas.length > 0 && !empresaAtual) {
      setEmpresaAtual(mockEmpresas[0]);
    }
  }, []);

  const carregarEmpresas = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulação - posteriormente conectar com API real
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockEmpresas: Empresa[] = [
        {
          id: '1',
          nome: 'Empresa Demo LTDA',
          cnpj: '12.345.678/0001-90',
          email: 'contato@demo.com',
          telefone: '(11) 99999-9999',
          endereco: 'Rua Demo, 123',
          ativa: true,
          createdAt: new Date(),
        },
      ];

      setEmpresas(mockEmpresas);
      if (mockEmpresas.length > 0 && !empresaAtual) {
        setEmpresaAtual(mockEmpresas[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar empresas');
    } finally {
      setLoading(false);
    }
  };

  const adicionarEmpresa = (novaEmpresa: Omit<Empresa, 'id' | 'createdAt'>) => {
    const empresa: Empresa = {
      ...novaEmpresa,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setEmpresas(prev => [...prev, empresa]);
  };

  const atualizarEmpresa = (id: string, dados: Partial<Empresa>) => {
    setEmpresas(prev =>
      prev.map(empresa => (empresa.id === id ? { ...empresa, ...dados } : empresa))
    );

    if (empresaAtual?.id === id) {
      setEmpresaAtual(prev => (prev ? { ...prev, ...dados } : null));
    }
  };

  const removerEmpresa = (id: string) => {
    setEmpresas(prev => prev.filter(empresa => empresa.id !== id));
    if (empresaAtual?.id === id) {
      setEmpresaAtual(null);
    }
  };

  const contextValue: EmpresaContextType = {
    empresas,
    empresaAtual,
    loading,
    error,
    setEmpresaAtual,
    adicionarEmpresa,
    atualizarEmpresa,
    removerEmpresa,
    carregarEmpresas,
  };

  return <EmpresaContext.Provider value={contextValue}>{children}</EmpresaContext.Provider>;
}

export const useEmpresa = () => {
  const context = useContext(EmpresaContext);
  if (context === undefined) {
    throw new Error('useEmpresa must be used within an EmpresaProvider');
  }
  return context;
};

// Export do tipo para uso em outros lugares
export type { Empresa };
