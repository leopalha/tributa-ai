import React, { createContext, useContext, ReactNode } from 'react';
import { Toaster } from 'sonner';
import toast from '@/lib/toast-transition';

interface ToastContextType {
  success: (message: string, description?: string) => void;
  error: (message: string, description?: string) => void;
  info: (message: string, description?: string) => void;
  warning: (message: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const toastMethods = {
    success: (message: string, description?: string) => {
      toast.success(message, description);
    },
    error: (message: string, description?: string) => {
      toast.error(message, description);
    },
    info: (message: string, description?: string) => {
      toast.info(message, description);
    },
    warning: (message: string, description?: string) => {
      toast.warning(message, description);
    },
  };

  return (
    <ToastContext.Provider value={toastMethods}>
      {children}
      <Toaster position="top-right" expand={false} richColors />
    </ToastContext.Provider>
  );
}
