import { useState } from 'react';
// TODO: Replace with custom auth
// import { useSession } from 'next-auth/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { MailWarning, Send, Loader2, CheckCircle } from 'lucide-react';
import { api } from '@/services/api';
import toast from '@/lib/toast-transition';

export function VerifyEmailBanner() {
  const { data: session, status, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResendVerification = async () => {
    setLoading(true);
    setEmailSent(false);
    try {
      await api.post('/api/auth/request-verification');
      toast.success('Email de verificação reenviado!');
      setEmailSent(true);
      // Opcional: Esconder o banner após envio ou após um tempo
      // setTimeout(() => setEmailSent(false), 60000); // Ex: Resetar após 1 min
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'Erro desconhecido';
      // Não mostrar erro se o email já estiver verificado (a API retorna 400 com mensagem)
      if (errorMessage !== 'Email já verificado.') {
        toast.error(`Falha ao reenviar email: ${errorMessage}`);
      } else {
        // Se já verificado, atualizar a sessão para remover o banner
        update();
      }
    } finally {
      setLoading(false);
    }
  };

  // Não mostrar nada se carregando, não autenticado, ou email já verificado
  if (status === 'loading' || status === 'unauthenticated' || session?.user?.emailVerified) {
    return null;
  }

  // Se chegou aqui, está autenticado e não verificado
  return (
    <Alert variant="default" className="mb-6 border-yellow-500 bg-yellow-50 text-yellow-800">
      <MailWarning className="h-5 w-5 text-yellow-600" />
      <AlertTitle className="font-semibold text-yellow-900">Verifique seu Email</AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span>Por favor, verifique seu endereço de email para ativar completamente sua conta.</span>
        {!emailSent ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleResendVerification}
            disabled={loading}
            className="mt-2 sm:mt-0 bg-yellow-100 hover:bg-yellow-200 border-yellow-600 text-yellow-800"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Enviando...' : 'Reenviar Email de Verificação'}
          </Button>
        ) : (
          <div className="flex items-center text-green-600 text-sm mt-2 sm:mt-0">
            <CheckCircle className="h-4 w-4 mr-1" /> Email enviado!
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
