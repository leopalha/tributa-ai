import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Obrigacao } from '@/types/obrigacao';

export const useObrigacao = () => {
  const [obrigacoes, setObrigacoes] = useState<Obrigacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchObrigacoes = async () => {
      try {
        const response = await api.get('/obrigacoes');
        setObrigacoes(response.data);
      } catch (err) {
        setError('Erro ao carregar obrigações');
        console.error(err);
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