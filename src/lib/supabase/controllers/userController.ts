import { supabase } from '../config';
import { User } from '@/models/types';

export const userController = {
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<User | null> {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();

    if (error) throw error;
    return data;
  },

  async getCurrentUser(): Promise<User | null> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) throw error;
    return data;
  },

  async login(email: string, password: string): Promise<User> {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user!.id)
      .single();

    if (error) throw error;
    return data;
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async register(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: 'temporary-password', // This would normally come from the registration form
      options: {
        data: {
          nome: userData.nome,
          telefone: userData.telefone,
          cargo: userData.cargo,
        },
      },
    });

    if (authError) throw authError;

    // Create user record in the users table
    const newUser = {
      id: authData.user!.id,
      ...userData,
    };

    const { data, error } = await supabase.from('users').insert([newUser]).select().single();

    if (error) throw error;
    return data;
  },

  async update(id: string, userData: Partial<User>): Promise<User> {
    // If email is being updated, update auth record
    if (userData.email) {
      const { error: authError } = await supabase.auth.updateUser({
        email: userData.email,
      });

      if (authError) throw authError;
    }

    // Update user profile data
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
