import { toast as hotToast } from 'react-hot-toast';
import { toast as shadcnToast } from '@/components/ui/use-toast';
import toast from './toast-transition';

jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

describe('Toast Transition Helper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call both hot-toast and shadcn/ui toast when success is called', () => {
    const message = 'Success message';
    toast.success(message);

    expect(hotToast.success).toHaveBeenCalledWith(message);
    expect(shadcnToast).toHaveBeenCalledWith({
      title: 'Sucesso',
      description: message,
    });
  });

  it('should call both hot-toast and shadcn/ui toast when error is called', () => {
    const message = 'Error message';
    toast.error(message);

    expect(hotToast.error).toHaveBeenCalledWith(message);
    expect(shadcnToast).toHaveBeenCalledWith({
      title: 'Erro',
      description: message,
      variant: 'destructive',
    });
  });

  it('should pass through custom toast calls directly to shadcn/ui toast', () => {
    const customToastOptions = {
      title: 'Custom Title',
      description: 'Custom description',
      variant: 'default' as const,
    };

    toast.custom(customToastOptions);
    expect(shadcnToast).toHaveBeenCalledWith(customToastOptions);
  });
});
