import { toast as sonnerToast } from 'sonner';

// Sistema de toast unificado usando apenas sonner
export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, { description });
  },

  error: (message: string, description?: string) => {
    sonnerToast.error(message, { description });
  },

  info: (message: string, description?: string) => {
    sonnerToast.info(message, { description });
  },

  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, { description });
  },

  promise: <T>(promise: Promise<T>, msgs: { loading: string; success: string; error: string }) => {
    return sonnerToast.promise(promise, msgs);
  },

  // Acesso direto ao sonner
  custom: sonnerToast,
};

export default toast;
