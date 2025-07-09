import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Usar variáveis de ambiente para maior segurança
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eqliefeonbjpyocnywfe.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxbGllZmVvbmJqcHlvY255d2ZlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDk2NDU0NCwiZXhwIjoyMDU2NTQwNTQ0fQ.imrIorRL0IsNJ1rA4jpSPKHzE3a-pEwGSEluXh32bBc';

// Criação do cliente Supabase com tipagem
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Funções auxiliares para autenticação
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  metadata?: { name?: string }
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });

  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/redefinir-senha`,
  });

  return { data, error };
};

export const getCurrentUser = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return { user: null, error };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { user, error: null };
};
