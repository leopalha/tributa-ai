'use client';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Obrigacao } from '@/types/obrigacao';

// Mock data
const mockObrigacoes: Obrigacao[] = [
  {
    id: '1',
    descricao: 'Declaração de Débitos e Créditos Tributários Federais',
    status: 'obrigacao_pendente',
    dataVencimento: '2024-05-15',
    empresaId: '1',
    tipo: 'ICMS',
    valor: 1500.0,
    dataCriacao: '2024-05-01',
    dataAtualizacao: '2024-05-01',
    anexos: [],
    historico: [],
  },
  {
    id: '2',
    descricao: 'Escrituração Fiscal Digital ICMS/IPI',
    status: 'obrigacao_em_andamento',
    dataVencimento: '2024-05-20',
    empresaId: '1',
    tipo: 'IPI',
    valor: 2500.0,
    dataCriacao: '2024-05-01',
    dataAtualizacao: '2024-05-01',
    anexos: [],
    historico: [],
  },
  {
    id: '3',
    descricao: 'Escrituração Fiscal Digital de Contribuições',
    status: 'obrigacao_atrasada',
    dataVencimento: '2024-04-25',
    empresaId: '1',
    tipo: 'PIS',
    valor: 800.0,
    dataCriacao: '2024-04-01',
    dataAtualizacao: '2024-04-25',
    anexos: [],
    historico: [],
  },
];

export const useObrigacao = () => {
  const [obrigacoes, setObrigacoes] = useState<Obrigacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchObrigacoes = async () => {
      try {
        setLoading(true);
        const response = await api.get('/obrigacoes');
        setObrigacoes(response.data || mockObrigacoes);
      } catch (err) {
        console.error('Erro ao carregar obrigações, usando dados mock:', err);
        setObrigacoes(mockObrigacoes);
        setError('Erro ao carregar obrigações');
      } finally {
        setLoading(false);
      }
    };

    fetchObrigacoes();
  }, []);

  return {
    obrigacoes,
    loading,
    error,
  };
};
