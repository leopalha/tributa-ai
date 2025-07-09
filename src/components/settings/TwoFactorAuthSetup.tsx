import React, { useState } from 'react';
import Image from '@/components/ui/custom-image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertCircle, CheckCircle, ClipboardCopy, Eye, EyeOff, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Spinner } from '@/components/spinner';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

interface TwoFactorAuthSetupProps {
  isTwoFactorEnabled: boolean;
  onStatusChange?: (isEnabled: boolean) => void;
}

interface SetupData {
  qrCodeUrl: string;
  manualSetupKey: string;
  tempSecret: string; // Apenas para simulação
}

const verifySchema = z.object({
  token: z
    .string()
    .length(6, { message: 'O código deve ter 6 dígitos.' })
    .regex(/^\d+$/, { message: 'Digite apenas números.' }),
});
type VerifyFormValues = z.infer<typeof verifySchema>;

export function TwoFactorAuthSetup({
  isTwoFactorEnabled,
  onStatusChange,
}: TwoFactorAuthSetupProps) {
  const { toast } = useToast();
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [isLoadingGenerate, setIsLoadingGenerate] = useState(false);
  const [isLoadingVerify, setIsLoadingVerify] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: { token: '' },
  });

  const handleGenerate = async () => {
    setIsLoadingGenerate(true);
    setError(null);
    setSetupData(null);
    setRecoveryCodes(null);
    form.reset();

    try {
      const response = await fetch('/api/auth/2fa/generate', { method: 'POST' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao gerar código 2FA.');
      }

      setSetupData({
        qrCodeUrl: data.qrCodeUrl,
        manualSetupKey: data.manualSetupKey,
        tempSecret: data._tempSecretForSimulation, // Apenas para simulação
      });
    } catch (err: any) {
      console.error('Erro ao gerar 2FA:', err);
      setError(err.message || 'Ocorreu um erro.');
      toast({ variant: 'destructive', title: 'Erro', description: err.message });
    } finally {
      setIsLoadingGenerate(false);
    }
  };

  const handleVerify: SubmitHandler<VerifyFormValues> = async values => {
    if (!setupData?.tempSecret) {
      setError('Erro interno: Segredo temporário não encontrado para verificação.');
      return;
    }

    setIsLoadingVerify(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: values.token,
          _tempSecretForSimulation: setupData.tempSecret,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Código de verificação inválido ou expirado.');
      }

      setRecoveryCodes(data.recoveryCodes || []);
      setSetupData(null);
      form.reset();
      toast({ title: 'Sucesso', description: data.message });
      onStatusChange?.(true);
    } catch (err: any) {
      console.error('Erro ao verificar 2FA:', err);
      setError(err.message || 'Ocorreu um erro na verificação.');
      form.setError('token', { type: 'manual', message: err.message });
    } finally {
      setIsLoadingVerify(false);
    }
  };

  const handleCopyCodes = () => {
    if (recoveryCodes) {
      navigator.clipboard
        .writeText(recoveryCodes.join('\n'))
        .then(() => {
          toast({ description: 'Códigos de recuperação copiados!' });
        })
        .catch(err => {
          console.error('Falha ao copiar códigos:', err);
          toast({ variant: 'destructive', description: 'Falha ao copiar códigos.' });
        });
    }
  };

  const handleDisable = async () => {
    console.warn('Função Desativar 2FA não implementada.');
    toast({
      variant: 'destructive',
      title: 'Não implementado',
      description: 'A desativação de 2FA precisa ser implementada.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Autenticação de Dois Fatores (2FA)</CardTitle>
        <CardDescription>
          {isTwoFactorEnabled
            ? 'Sua conta está protegida com autenticação de dois fatores.'
            : 'Aumente a segurança da sua conta ativando a autenticação de dois fatores (recomendado).'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isTwoFactorEnabled ? (
          <div className="flex items-center space-x-4 p-4 border rounded-md bg-green-50 border-green-200">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <p className="text-sm font-medium text-green-800">2FA está Ativo</p>
            <Button variant="destructive" size="sm" onClick={handleDisable} className="ml-auto">
              Desativar
            </Button>
          </div>
        ) : (
          <>
            {!setupData && !recoveryCodes && (
              <Button onClick={handleGenerate} disabled={isLoadingGenerate}>
                {isLoadingGenerate && <Spinner className="mr-2 h-4 w-4" />}
                Ativar 2FA
              </Button>
            )}

            {setupData && (
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Escaneie o código QR abaixo com seu aplicativo autenticador (Google Authenticator,
                  Authy, etc.) ou insira a chave de configuração manualmente.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="p-2 border rounded-md bg-white">
                    <Image src={setupData.qrCodeUrl} alt="QR Code 2FA" width={160} height={160} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manualSetupKey">Chave Manual</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="manualSetupKey"
                        readOnly
                        value={setupData.manualSetupKey}
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(setupData.manualSetupKey)}
                      >
                        <ClipboardCopy className="h-3 w-3" />
                        <span className="sr-only">Copiar Chave</span>
                      </Button>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Importante</AlertTitle>
                  <AlertDescription>
                    Após escanear ou inserir a chave, insira o código de 6 dígitos gerado pelo seu
                    aplicativo para verificar a configuração.
                  </AlertDescription>
                </Alert>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleVerify)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="token"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código de Verificação (6 dígitos)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="000000"
                              maxLength={6}
                              className="w-full sm:w-40 font-mono text-center text-lg tracking-widest"
                              autoComplete="off"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoadingVerify}>
                      {isLoadingVerify && <Spinner className="mr-2 h-4 w-4" />}
                      Verificar e Ativar
                    </Button>
                  </form>
                </Form>
              </div>
            )}

            {recoveryCodes && (
              <div className="space-y-4">
                <Alert
                  className={cn(
                    'border-green-200 bg-green-50 text-green-800',
                    '[&>svg]:text-green-600'
                  )}
                >
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle className="text-green-900">2FA Ativado com Sucesso!</AlertTitle>
                  <AlertDescription>
                    Salve estes códigos de recuperação em um local seguro. Eles podem ser usados
                    para acessar sua conta caso você perca acesso ao seu aplicativo autenticador.
                  </AlertDescription>
                </Alert>

                <Card className="bg-muted/50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">Códigos de Recuperação</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowRecoveryCodes(!showRecoveryCodes)}
                    >
                      {showRecoveryCodes ? (
                        <EyeOff className="h-4 w-4 mr-1" />
                      ) : (
                        <Eye className="h-4 w-4 mr-1" />
                      )}
                      {showRecoveryCodes ? 'Ocultar' : 'Mostrar'}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {showRecoveryCodes ? (
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 font-mono text-sm tracking-wider">
                        {recoveryCodes.map(code => (
                          <p key={code}>{code}</p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        Códigos ocultos por segurança. Clique em "Mostrar" para visualizá-los.
                      </p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" onClick={handleCopyCodes} className="w-full">
                      <ClipboardCopy className="h-4 w-4 mr-2" />
                      Copiar Códigos
                    </Button>
                  </CardFooter>
                </Card>
                <p className="text-xs text-center text-muted-foreground">
                  Guarde esses códigos em um gerenciador de senhas ou local seguro. Eles não serão
                  mostrados novamente.
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
