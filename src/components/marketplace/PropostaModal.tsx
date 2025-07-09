import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/lib/toast-transition';
import { MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface PropostaModalProps {
  isOpen: boolean;
  onClose: () => void;
  anuncio: {
    id: string;
    title: string;
    price: number;
    discount?: number;
    type: string;
    category: string;
  };
}

export function PropostaModal({ isOpen, onClose, anuncio }: PropostaModalProps) {
  const [valorProposta, setValorProposta] = useState(anuncio.price);
  const [quantidade, setQuantidade] = useState(1);
  const [mensagem, setMensagem] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'form' | 'success' | 'error'>('form');

  const percentualDesconto = ((anuncio.price - valorProposta) / anuncio.price) * 100;
  const valorTotal = valorProposta * quantidade;

  const handleSubmit = async () => {
    if (valorProposta <= 0) {
      toast.error('Valor inválido', 'O valor da proposta deve ser maior que zero');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/marketplace/propostas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          anuncioId: anuncio.id,
          valorProposta,
          quantidade,
          mensagem,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStep('success');
        toast.success('Proposta enviada!', 'O vendedor será notificado sobre sua proposta.');
      } else {
        setStep('error');
        toast.error('Erro ao enviar proposta', data.error || 'Tente novamente');
      }
    } catch (error) {
      setStep('error');
      toast.error('Erro ao enviar proposta', 'Falha na comunicação com o servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetModal = () => {
    setStep('form');
    setValorProposta(anuncio.price);
    setQuantidade(1);
    setMensagem('');
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Enviar Proposta
          </DialogTitle>
        </DialogHeader>

        {step === 'form' && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-sm text-gray-900 mb-2">{anuncio.title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{anuncio.category}</Badge>
                <Badge variant="outline">{anuncio.type}</Badge>
              </div>
              <div className="text-sm text-gray-600">
                Preço pedido: R$ {anuncio.price.toLocaleString('pt-BR')}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="valorProposta">Valor da Proposta (R$)</Label>
                <Input
                  id="valorProposta"
                  type="number"
                  value={valorProposta}
                  onChange={e => setValorProposta(Math.max(0, parseFloat(e.target.value) || 0))}
                  min="0"
                  step="0.01"
                  className="mt-1"
                />
                {percentualDesconto > 0 && (
                  <div className="text-xs text-orange-600 mt-1">
                    {percentualDesconto.toFixed(1)}% abaixo do preço pedido
                  </div>
                )}
                {percentualDesconto < 0 && (
                  <div className="text-xs text-green-600 mt-1">
                    {Math.abs(percentualDesconto).toFixed(1)}% acima do preço pedido
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input
                  id="quantidade"
                  type="number"
                  value={quantidade}
                  onChange={e => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="mensagem">Mensagem (opcional)</Label>
                <Textarea
                  id="mensagem"
                  value={mensagem}
                  onChange={e => setMensagem(e.target.value)}
                  placeholder="Adicione uma mensagem para o vendedor..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Valor unitário proposto:</span>
                  <span>R$ {valorProposta.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantidade:</span>
                  <span>{quantidade}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total da proposta:</span>
                  <span>R$ {valorTotal.toLocaleString('pt-BR')}</span>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-xs text-blue-800">
                    <p className="font-medium mb-1">Validade da Proposta</p>
                    <p>
                      Sua proposta será válida por 7 dias. O vendedor pode aceitar, rejeitar ou
                      fazer uma contraproposta.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || valorProposta <= 0}
                className="flex-1"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Proposta'}
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-green-900 mb-2">Proposta Enviada!</h3>
            <p className="text-sm text-gray-600 mb-6">
              Sua proposta foi enviada com sucesso. O vendedor será notificado e você receberá uma
              resposta em breve.
            </p>
            <Button onClick={handleClose} className="w-full">
              Fechar
            </Button>
          </div>
        )}

        {step === 'error' && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-red-900 mb-2">Erro ao Enviar</h3>
            <p className="text-sm text-gray-600 mb-6">
              Ocorreu um erro ao enviar sua proposta. Tente novamente.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={() => setStep('form')} className="flex-1">
                Tentar Novamente
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
