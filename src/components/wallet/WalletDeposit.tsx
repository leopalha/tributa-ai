import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FormaPagamento } from '@/types/prisma';
import { PaymentDetails } from '@/types/wallet';
import { formatCurrency } from '@/utils/format';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/spinner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Zap, CreditCard, Landmark, Wallet, AlertCircle } from 'lucide-react';

// Esquema de validação
const depositFormSchema = z.object({
  amount: z
    .string()
    .min(1, 'Valor obrigatório')
    .refine(
      (val) => {
        const num = Number(val.replace(/[^\d]/g, '')) / 100;
        return !isNaN(num) && num >= 10;
      },
      { message: 'Valor mínimo de R$ 10,00' }
    ),
  paymentMethod: z.enum(['PIX', 'BOLETO', 'TRANSFERENCIA_BANCARIA', 'BLOCKCHAIN_TRANSFER']),
});

type DepositFormValues = z.infer<typeof depositFormSchema>;

interface WalletDepositProps {
  onDeposit: (amount: number, paymentMethod: FormaPagamento) => Promise<{
    paymentDetails: PaymentDetails;
    transactionId: string;
  }>;
  loading: boolean;
}

export function WalletDeposit({ onDeposit, loading }: WalletDepositProps) {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const form = useForm<DepositFormValues>({
    resolver: zodResolver(depositFormSchema),
    defaultValues: {
      amount: '',
      paymentMethod: 'PIX',
    },
  });

  const handleSubmit = async (values: DepositFormValues) => {
    try {
      // Converter string para número
      const amountStr = values.amount.replace(/[^\d]/g, '');
      const amount = Number(amountStr) / 100;

      const result = await onDeposit(amount, values.paymentMethod as FormaPagamento);
      setPaymentDetails(result.paymentDetails);
      setTransactionId(result.transactionId);
    } catch (error) {
      console.error('Erro ao processar depósito:', error);
    }
  };

  const formatInputAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, '');
    if (value) {
      value = (parseInt(value) / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    } else {
      value = '';
    }
    form.setValue('amount', value);
  };

  // Renderizar detalhes de pagamento
  const renderPaymentDetails = () => {
    if (!paymentDetails || !transactionId) return null;

    const paymentMethod = form.getValues('paymentMethod');

    switch (paymentMethod) {
      case 'PIX':
        return (
          <Alert className="mt-4">
            <Zap className="h-4 w-4" />
            <AlertTitle>PIX Gerado</AlertTitle>
            <AlertDescription className="space-y-4">
              <p>Escaneie o QR Code abaixo ou copie o código PIX:</p>
              {paymentDetails.pixCode && (
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white p-4 rounded-lg border">
                    {/* Simulação de QR Code */}
                    <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                      QR Code PIX
                    </div>
                  </div>
                  <div className="w-full">
                    <Input
                      readOnly
                      value={paymentDetails.pixCode}
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => navigator.clipboard.writeText(paymentDetails.pixCode || '')}
                    >
                      Copiar Código
                    </Button>
                  </div>
                </div>
              )}
              <p className="text-sm">
                ID da Transação: <span className="font-mono">{transactionId}</span>
              </p>
            </AlertDescription>
          </Alert>
        );

      case 'BOLETO':
        return (
          <Alert className="mt-4">
            <CreditCard className="h-4 w-4" />
            <AlertTitle>Boleto Gerado</AlertTitle>
            <AlertDescription className="space-y-4">
              <p>Utilize o código de barras abaixo para pagar seu boleto:</p>
              {paymentDetails.boletoCode && (
                <div className="flex flex-col gap-2">
                  <Input
                    readOnly
                    value={paymentDetails.boletoCode}
                    className="font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(paymentDetails.boletoCode || '')}
                  >
                    Copiar Código de Barras
                  </Button>
                  {paymentDetails.boletoUrl && (
                    <Button variant="secondary" className="mt-2">
                      Baixar Boleto
                    </Button>
                  )}
                </div>
              )}
              <p className="text-sm">
                ID da Transação: <span className="font-mono">{transactionId}</span>
              </p>
            </AlertDescription>
          </Alert>
        );

      case 'TRANSFERENCIA_BANCARIA':
        return (
          <Alert className="mt-4">
            <Landmark className="h-4 w-4" />
            <AlertTitle>Dados Bancários</AlertTitle>
            <AlertDescription className="space-y-4">
              <p>Realize uma transferência com os dados abaixo:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-semibold">Banco:</span> 260 - Nu Pagamentos S.A.
                </div>
                <div>
                  <span className="font-semibold">Agência:</span> 0001
                </div>
                <div>
                  <span className="font-semibold">Conta:</span> 9234567-8
                </div>
                <div>
                  <span className="font-semibold">Tipo:</span> Conta Corrente
                </div>
                <div>
                  <span className="font-semibold">CNPJ:</span> 12.345.678/0001-99
                </div>
                <div>
                  <span className="font-semibold">Nome:</span> Tributa.AI Tecnologia Ltda
                </div>
              </div>
              <p className="text-sm mt-2">
                <AlertCircle className="h-4 w-4 inline mr-1" />
                Importante: Inclua o ID da transação no comentário da transferência.
              </p>
              <p className="text-sm">
                ID da Transação: <span className="font-mono">{transactionId}</span>
              </p>
            </AlertDescription>
          </Alert>
        );

      case 'BLOCKCHAIN_TRANSFER':
        return (
          <Alert className="mt-4">
            <Wallet className="h-4 w-4" />
            <AlertTitle>Transferência Blockchain</AlertTitle>
            <AlertDescription className="space-y-4">
              <p>Envie o valor para o endereço da carteira abaixo:</p>
              <div className="flex flex-col gap-2">
                <Input
                  readOnly
                  value="0x1234567890abcdef1234567890abcdef12345678"
                  className="font-mono text-xs"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigator.clipboard.writeText('0x1234567890abcdef1234567890abcdef12345678')
                  }
                >
                  Copiar Endereço
                </Button>
              </div>
              <p className="text-sm mt-2">
                <AlertCircle className="h-4 w-4 inline mr-1" />
                Importante: Utilize apenas a rede Ethereum para esta transferência.
              </p>
              <p className="text-sm">
                ID da Transação: <span className="font-mono">{transactionId}</span>
              </p>
            </AlertDescription>
          </Alert>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Depositar Fundos</CardTitle>
        <CardDescription>
          Adicione fundos à sua carteira para pagar taxas ou comprar títulos
        </CardDescription>
      </CardHeader>
      <CardContent>
        {paymentDetails ? (
          renderPaymentDetails()
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do Depósito</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="R$ 0,00"
                        {...field}
                        onChange={formatInputAmount}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormDescription>Valor mínimo de R$ 10,00</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Método de Pagamento</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-3"
                        disabled={loading}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="PIX" />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center gap-2">
                            <Zap className="h-4 w-4 text-blue-600" />
                            PIX (Instantâneo)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="BOLETO" />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-gray-600" />
                            Boleto Bancário (1-3 dias úteis)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="TRANSFERENCIA_BANCARIA" />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center gap-2">
                            <Landmark className="h-4 w-4 text-green-600" />
                            Transferência Bancária (1-2 dias úteis)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="BLOCKCHAIN_TRANSFER" />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-purple-600" />
                            Transferência Blockchain (Ethereum)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Spinner className="mr-2 h-4 w-4" /> : null}
                Gerar Instruções de Pagamento
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      {paymentDetails && (
        <CardFooter className="flex justify-center border-t px-6 py-4">
          <Button
            variant="outline"
            onClick={() => {
              setPaymentDetails(null);
              setTransactionId(null);
              form.reset();
            }}
          >
            Novo Depósito
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}