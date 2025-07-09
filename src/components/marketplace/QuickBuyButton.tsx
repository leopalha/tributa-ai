import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingCart, Loader2, CheckCircle, QrCode, Copy, Smartphone, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Image from '@/components/ui/custom-image';

interface QuickBuyButtonProps {
  anuncioId: string;
  titulo: string;
  valor: number;
  onSuccess?: () => void;
}

export function QuickBuyButton({ anuncioId, titulo, valor, onSuccess }: QuickBuyButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'confirm' | 'pix' | 'processing' | 'success'>('confirm');
  const [pixCode, setPixCode] = useState('');
  const { toast } = useToast();

  const handleComprar = async () => {
    setStep('pix');
    // Gerar código PIX fake
    const code = `00020126580014BR.GOV.BCB.PIX0136${Date.now()}520400005303986540${valor.toFixed(2)}5802BR6009TRIBUTA.AI62070503***6304${Math.random().toString(16).substr(2, 4).toUpperCase()}`;
    setPixCode(code);
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    setStep('processing');

    try {
      // Simular verificação de pagamento
      await new Promise(resolve => setTimeout(resolve, 3000));

      const response = await fetch('/api/marketplace/comprar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          anuncioId,
          quantidade: 1,
          valorTotal: valor,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar compra');
      }

      setStep('success');

      setTimeout(() => {
        setOpen(false);
        toast({
          title: 'Compra realizada com sucesso!',
          description: `O crédito "${titulo}" foi adicionado à sua carteira.`,
        });
        onSuccess?.();
      }, 2000);
    } catch (error) {
      console.error('Erro na compra:', error);
      toast({
        title: 'Erro na compra',
        description: error instanceof Error ? error.message : 'Erro ao processar pagamento',
        variant: 'destructive',
      });
      setStep('confirm');
    } finally {
      setLoading(false);
    }
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    toast({
      title: 'Código copiado!',
      description: 'Cole no seu app de pagamento',
    });
  };

  const resetModal = () => {
    setStep('confirm');
    setPixCode('');
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} size="lg" className="w-full">
        <ShoppingCart className="mr-2 h-4 w-4" />
        Comprar Agora
      </Button>

      <Dialog
        open={open}
        onOpenChange={open => {
          setOpen(open);
          if (!open) resetModal();
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          {step === 'confirm' && (
            <>
              <DialogHeader>
                <DialogTitle>Confirmar Compra</DialogTitle>
                <DialogDescription>
                  Você está prestes a adquirir este crédito tributário
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">{titulo}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Valor Total</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(valor)}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>• Transferência instantânea após confirmação</p>
                  <p>• Documento fiscal será emitido automaticamente</p>
                  <p>• Crédito disponível em até 5 minutos</p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleComprar}>Prosseguir com PIX</Button>
              </DialogFooter>
            </>
          )}

          {step === 'pix' && (
            <>
              <DialogHeader>
                <DialogTitle>Pagamento via PIX</DialogTitle>
                <DialogDescription>
                  Escaneie o QR Code ou copie o código para pagar
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* QR Code Placeholder */}
                <div className="flex justify-center">
                  <div className="w-48 h-48 bg-black/5 rounded-lg flex items-center justify-center">
                    <QrCode className="h-32 w-32 text-black/20" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Valor:</span>
                    <span className="font-bold">{formatCurrency(valor)}</span>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Código PIX:</span>
                      <Button size="sm" variant="ghost" onClick={copyPixCode}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs font-mono break-all">{pixCode.substring(0, 50)}...</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Aguardando pagamento...</span>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setStep('confirm')}>
                  Voltar
                </Button>
                <Button onClick={handleConfirmPayment} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <Smartphone className="mr-2 h-4 w-4" />
                      Já paguei
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}

          {step === 'processing' && (
            <div className="py-8 text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Processando pagamento...</h3>
              <p className="text-sm text-muted-foreground">
                Verificando transação PIX e transferindo o crédito
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Compra realizada!</h3>
              <p className="text-sm text-muted-foreground">
                O crédito foi transferido para sua carteira
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
