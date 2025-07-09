import { supabase } from '../config';
import { Obrigacao } from '@/models/types';

export const obrigacaoController = {
  async getAll(): Promise<Obrigacao[]> {
    const { data, error } = await supabase
      .from('obrigacoes')
      .select('*')
      .order('data_vencimento', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getByEmpresa(empresaId: string): Promise<Obrigacao[]> {
    const { data, error } = await supabase
      .from('obrigacoes')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('data_vencimento', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getByPeriodo(dataInicio: string, dataFim: string): Promise<Obrigacao[]> {
    const { data, error } = await supabase
      .from('obrigacoes')
      .select('*')
      .gte('data_vencimento', dataInicio)
      .lte('data_vencimento', dataFim)
      .order('data_vencimento', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async create(obrigacao: Omit<Obrigacao, 'id' | 'created_at' | 'updated_at'>): Promise<Obrigacao> {
    const { data, error } = await supabase.from('obrigacoes').insert([obrigacao]).select().single();

    if (error) throw error;
    return data;
  },

  async update(id: string, obrigacao: Partial<Obrigacao>): Promise<Obrigacao> {
    const { data, error } = await supabase
      .from('obrigacoes')
      .update(obrigacao)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: Obrigacao['status']): Promise<void> {
    const { error } = await supabase.from('obrigacoes').update({ status }).eq('id', id);

    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('obrigacoes').delete().eq('id', id);

    if (error) throw error;
  },
};
