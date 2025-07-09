import { toast as sonnerToast } from 'sonner';

type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

// Export a direct toast object for simpler imports
export const simpleToast = {
  default: (title: string, description?: string) => {
    sonnerToast(title, { description });
  },
  success: (title: string, description?: string) => {
    sonnerToast.success(title, { description });
  },
  error: (title: string, description?: string) => {
    sonnerToast.error(title, { description });
  },
  info: (title: string, description?: string) => {
    sonnerToast.info(title, { description });
  },
  warning: (title: string, description?: string) => {
    sonnerToast.warning(title, { description });
  },
};

export function useSimpleToast() {
  const toastFn = (props: ToastProps) => {
    const { title, description, variant } = props;

    if (variant === 'destructive') {
      sonnerToast.error(title || '', {
        description,
      });
    } else {
      sonnerToast(title || '', {
        description,
      });
    }
  };

  // Add success, error, and other utility methods
  toastFn.success = (title: string, description?: string) => {
    sonnerToast.success(title, { description });
  };

  toastFn.error = (title: string, description?: string) => {
    sonnerToast.error(title, { description });
  };

  toastFn.info = (title: string, description?: string) => {
    sonnerToast.info(title, { description });
  };

  toastFn.warning = (title: string, description?: string) => {
    sonnerToast.warning(title, { description });
  };

  return {
    toast: toastFn,
  };
}
