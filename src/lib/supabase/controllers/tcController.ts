import { supabase } from '../config';
import { TC, Transaction } from '@/models/types';

export const tcController = {
  async getAll(): Promise<TC[]> {
    const { data, error } = await supabase
      .from('tcs')
      .select('*, transacoes:transactions(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<TC | null> {
    const { data, error } = await supabase
      .from('tcs')
      .select('*, transacoes:transactions(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getByEmpresa(empresaId: string): Promise<TC[]> {
    const { data, error } = await supabase
      .from('tcs')
      .select('*, transacoes:transactions(*)')
      .eq('empresa_id', empresaId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getByPeriodo(dataInicio: string, dataFim: string): Promise<TC[]> {
    const { data, error } = await supabase
      .from('tcs')
      .select('*, transacoes:transactions(*)')
      .gte('data_emissao', dataInicio)
      .lte('data_emissao', dataFim)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(tc: Omit<TC, 'id' | 'created_at' | 'updated_at'>): Promise<TC> {
    const { data, error } = await supabase.from('tcs').insert([tc]).select().single();

    if (error) throw error;
    return data;
  },

  async update(id: string, tc: Partial<TC>): Promise<TC> {
    const { data, error } = await supabase.from('tcs').update(tc).eq('id', id).select().single();

    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: TC['status']): Promise<TC> {
    const { data, error } = await supabase
      .from('tcs')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('tcs').delete().eq('id', id);

    if (error) throw error;
  },

  async addTransaction(
    tcId: string,
    transaction: Omit<Transaction, 'id' | 'created_at'>
  ): Promise<Transaction> {
    const transactionWithTcId = {
      ...transaction,
      tc_id: tcId,
    };

    const { data, error } = await supabase
      .from('transactions')
      .insert([transactionWithTcId])
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
