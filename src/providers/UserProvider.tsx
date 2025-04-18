"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import { User } from '@/models/types';
import { userController } from '@/lib/supabase/controllers/userController';

interface UserContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateUser: (user: User) => void;
}

export const UserContext = createContext<UserContextData>({} as UserContextData);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const { 'tributa.ai.token': token } = parseCookies();

    if (token) {
      api.get<User>('/auth/me')
        .then(response => {
          setUser(response);
        })
        .catch(() => {
          signOut();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { token, refreshToken, user: userData } = response;

      setCookie(undefined, 'tributa.ai.token', token, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      setCookie(undefined, 'tributa.ai.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      setUser(userData);

      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      router.push('/dashboard');
    } catch (err) {
      throw err;
    }
  };

  const signOut = () => {
    destroyCookie(undefined, 'tributa.ai.token');
    destroyCookie(undefined, 'tributa.ai.refreshToken');
    setUser(null);
    router.push('/login');
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 