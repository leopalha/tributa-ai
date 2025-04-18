import { supabase } from '../config';
import { Empresa } from '@/models/types';

export const empresaController = {
  async getAll(): Promise<Empresa[]> {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Empresa | null> {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(empresa: Omit<Empresa, 'id' | 'created_at' | 'updated_at'>): Promise<Empresa> {
    const { data, error } = await supabase
      .from('empresas')
      .insert([empresa])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, empresa: Partial<Empresa>): Promise<Empresa> {
    const { data, error } = await supabase
      .from('empresas')
      .update(empresa)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('empresas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}; 