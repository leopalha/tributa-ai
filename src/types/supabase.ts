export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          name: string | null;
          role: string;
          avatar_url: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          email: string;
          name?: string | null;
          role?: string;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          email?: string;
          name?: string | null;
          role?: string;
          avatar_url?: string | null;
        };
      };
      empresas: {
        Row: {
          id: string;
          created_at: string;
          razao_social: string;
          nome_fantasia: string | null;
          cnpj: string;
          setor_atividade: string;
          status: string;
          data_abertura: string | null;
          user_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          razao_social: string;
          nome_fantasia?: string | null;
          cnpj: string;
          setor_atividade: string;
          status?: string;
          data_abertura?: string | null;
          user_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          razao_social?: string;
          nome_fantasia?: string | null;
          cnpj?: string;
          setor_atividade?: string;
          status?: string;
          data_abertura?: string | null;
          user_id?: string;
        };
      };
      obrigacoes: {
        Row: {
          id: string;
          created_at: string;
          nome: string;
          descricao: string | null;
          tipo: string;
          status: string;
          data_vencimento: string;
          empresa_id: string;
          periodicidade: string | null;
          periodo_referencia: string | null;
          complexidade: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          nome: string;
          descricao?: string | null;
          tipo: string;
          status?: string;
          data_vencimento: string;
          empresa_id: string;
          periodicidade?: string | null;
          periodo_referencia?: string | null;
          complexidade?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          nome?: string;
          descricao?: string | null;
          tipo?: string;
          status?: string;
          data_vencimento?: string;
          empresa_id?: string;
          periodicidade?: string | null;
          periodo_referencia?: string | null;
          complexidade?: string | null;
        };
      };
      titulos_credito: {
        Row: {
          id: string;
          created_at: string;
          numero: string;
          valor: number;
          data_emissao: string;
          data_vencimento: string;
          status: string;
          empresa_id: string;
          tipo: string;
          descricao: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          numero: string;
          valor: number;
          data_emissao: string;
          data_vencimento: string;
          status?: string;
          empresa_id: string;
          tipo: string;
          descricao?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          numero?: string;
          valor?: number;
          data_emissao?: string;
          data_vencimento?: string;
          status?: string;
          empresa_id?: string;
          tipo?: string;
          descricao?: string | null;
        };
      };
      transacoes: {
        Row: {
          id: string;
          created_at: string;
          titulo_id: string;
          valor: number;
          tipo: string;
          data: string;
          descricao: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          titulo_id: string;
          valor: number;
          tipo: string;
          data: string;
          descricao?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          titulo_id?: string;
          valor?: number;
          tipo?: string;
          data?: string;
          descricao?: string | null;
        };
      };
      produtos_marketplace: {
        Row: {
          id: string;
          created_at: string;
          nome: string;
          descricao: string | null;
          preco: number;
          categoria: string;
          status: string;
          vendedor_id: string;
          imagem_url: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          nome: string;
          descricao?: string | null;
          preco: number;
          categoria: string;
          status?: string;
          vendedor_id: string;
          imagem_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          nome?: string;
          descricao?: string | null;
          preco?: number;
          categoria?: string;
          status?: string;
          vendedor_id?: string;
          imagem_url?: string | null;
        };
      };
      notificacoes: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          titulo: string;
          mensagem: string;
          lida: boolean;
          tipo: string;
          link: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          titulo: string;
          mensagem: string;
          lida?: boolean;
          tipo: string;
          link?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          titulo?: string;
          mensagem?: string;
          lida?: boolean;
          tipo?: string;
          link?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
