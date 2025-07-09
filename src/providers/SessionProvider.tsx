import React, { createContext, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface Session {
  user: User | null;
  isLoading: boolean;
}

interface SessionContextType {
  session: Session;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const mockSession: Session = {
    user: {
      id: 'demo-user',
      email: 'admin@tributa.ai',
      name: 'Administrador Demo',
    },
    isLoading: false,
  };

  const signIn = async (email: string, password: string) => {
    console.log('Mock sign in:', email);
  };

  const signOut = async () => {
    console.log('Mock sign out');
  };

  return (
    <SessionContext.Provider value={{ session: mockSession, signIn, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}
