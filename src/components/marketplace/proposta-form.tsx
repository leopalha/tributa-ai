import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';

interface PropostaFormProps {
  anuncioId: string;
  anuncioTitle: string;
  anuncioValue: number;
  askingPrice?: number | null;
  onSuccess: () => void;
}

export default function PropostaForm({
  anuncioId,
  anuncioTitle,
  anuncioValue,
  askingPrice,
  onSuccess,
}: PropostaFormProps) {
  const [proposedValue, setProposedValue] = useState<number>(askingPrice || anuncioValue);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!proposedValue || proposedValue <= 0) {
      setError('Por favor, informe um valor válido para a proposta.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/marketplace/anuncios/${anuncioId}/propostas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          offerValue: proposedValue,
          message: message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao enviar proposta');
      }

      const data = await response.json();

      toast.success('Proposta enviada com sucesso!');
      onSuccess();
    } catch (err) {
      console.error('Erro ao enviar proposta:', err);
      setError((err as Error).message || 'Erro ao enviar sua proposta');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate discount percentage
  const calculateDiscount = () => {
    if (!askingPrice || !anuncioValue) return null;
    if (proposedValue >= askingPrice) return null;

    const originalValue = askingPrice;
    const discount = ((originalValue - proposedValue) / originalValue) * 100;
    return Math.round(discount * 10) / 10; // Round to 1 decimal place
  };

  const discount = calculateDiscount();

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Crédito</Label>
        <Input id="title" value={anuncioTitle} disabled className="bg-muted" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="value">Valor do Anúncio</Label>
        <Input
          id="value"
          value={formatCurrency(askingPrice || anuncioValue)}
          disabled
          className="bg-muted"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="proposedValue">Sua Oferta</Label>
        <Input
          id="proposedValue"
          type="number"
          value={proposedValue}
          onChange={e => setProposedValue(Number(e.target.value))}
          min={0}
          max={anuncioValue}
          required
          className="text-right"
        />
        {discount && (
          <p className="text-xs text-green-600 mt-1">{discount}% abaixo do valor pedido</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Mensagem ao Vendedor (opcional)</Label>
        <Textarea
          id="message"
          placeholder="Justifique sua oferta ou faça perguntas sobre o crédito..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            'Enviar Proposta'
          )}
        </Button>
      </div>
    </form>
  );
}
