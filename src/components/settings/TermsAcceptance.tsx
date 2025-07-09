import React, { useState } from 'react';
import Link from '@/components/ui/custom-link';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Spinner } from '@/components/spinner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns'; // Para formatar a data (instalar depois)
import { ptBR } from 'date-fns/locale'; // Para locale pt-BR

interface TermsAcceptanceProps {
  userId: string;
  // Data em que os termos foram aceitos (ou null se não aceitos)
  // Viria dos dados do usuário buscados na página pai
  initialTermsAcceptedAt: Date | string | null;
}

export function TermsAcceptance({ userId, initialTermsAcceptedAt }: TermsAcceptanceProps) {
  const { toast } = useToast();
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Armazena localmente a data de aceite após a confirmação
  const [termsAcceptedAt, setTermsAcceptedAt] = useState<Date | null>(
    initialTermsAcceptedAt ? new Date(initialTermsAcceptedAt) : null
  );

  const hasAccepted = termsAcceptedAt !== null;

  const handleSubmit = async () => {
    if (!isChecked || hasAccepted) return;

    setIsLoading(true);
    try {
      // Assume que a API precisa apenas do usuário autenticado (que enviou o request)
      // Se precisar enviar userId no corpo, ajuste a API e adicione aqui.
      const response = await fetch('/api/users/accept-terms', {
        method: 'POST',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao registrar aceite dos termos.');
      }

      const acceptedDate = new Date();
      setTermsAcceptedAt(acceptedDate); // Atualiza o estado local
      toast({ title: 'Sucesso', description: 'Aceite dos termos registrado.' });
    } catch (error: any) {
      console.error('Erro ao aceitar termos:', error);
      toast({ variant: 'destructive', title: 'Erro', description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <h3 className="text-lg font-medium">Termos e Condições</h3>
      {hasAccepted ? (
        <p className="text-sm text-green-700 bg-green-50 p-3 rounded-md border border-green-200">
          Você aceitou os Termos de Uso e a Política de Privacidade em:{' '}
          {format(termsAcceptedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}.
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Para continuar utilizando a plataforma, por favor, leia e aceite nossos documentos
            legais:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>
              <Link href="/termos-de-uso" target="_blank" className="text-primary hover:underline">
                Termos de Uso
              </Link>
            </li>
            <li>
              <Link
                href="/politica-de-privacidade"
                target="_blank"
                className="text-primary hover:underline"
              >
                Política de Privacidade
              </Link>
            </li>
          </ul>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="terms-acceptance-checkbox"
              checked={isChecked}
              onCheckedChange={checked => setIsChecked(checked as boolean)}
              disabled={isLoading || hasAccepted}
            />
            <Label
              htmlFor="terms-acceptance-checkbox"
              className={cn(
                'text-sm font-medium leading-none',
                (isLoading || hasAccepted) && 'cursor-not-allowed opacity-70'
              )}
            >
              Li e aceito os Termos de Uso e a Política de Privacidade.
            </Label>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!isChecked || isLoading || hasAccepted}
            className="w-full sm:w-auto"
          >
            {isLoading && <Spinner className="mr-2 h-4 w-4" />}
            Confirmar Aceite
          </Button>
        </>
      )}
    </div>
  );
}
