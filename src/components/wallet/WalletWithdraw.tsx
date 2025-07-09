import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FormaPagamento } from '@/types/prisma';
import { PaymentDetails, WalletPaymentMethod } from '@/types/wallet';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Zap, CreditCard, Landmark, Wallet, AlertCircle, CheckCircle } from 'lucide-react';

// Esquema de validação
const withdrawFormSchema = z.object({
  amount: z
    .string()
    .min(1, 'Valor obrigatório')
    .refine(
      (val) => {
        const num = Number(val.replace(/[^\d]/g, '')) / 100;
        return !isNaN(num) && num >= 50;
      },
      { message: 'Valor mínimo de R$ 50,00' }
    ),
  paymentMethod: z.enum(['PIX', 'TRANSFERENCIA_BANCARIA', 'BLOCKCHAIN_TRANSFER']),
  pixKey: z.string().optional(),
  bankCode: z.string().optional(),
  agency: z.string().optional(),
  account: z.string().optional(),
  accountType: z.string().optional(),
  walletAddress: z.string().optional(),
});

type WithdrawFormValues = z.infer<typeof withdrawFormSchema>;

interface WalletWithdrawProps {
  onWithdraw: (
    amount: number,
    paymentMethod: FormaPagamento,
    paymentDetails: Partial<PaymentDetails>
  ) => Promise<{ transactionId: string }>;
  loading: boolean;
  balance: number;
  paymentMethods: WalletPaymentMethod[];
}

export function WalletWithdraw({
  onWithdraw,
  loading,
  balance,
  paymentMethods,
}: WalletWithdrawProps) {
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const form = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawFormSchema),
    defaultValues: {
      amount: '',
      paymentMethod: 'PIX',
      pixKey: '',
      bankCode: '',
      agency: '',
      account: '',
      accountType: 'corrente',
      walletAddress: '',
    },
  });

  const watchPaymentMethod = form.watch('paymentMethod');

  const handleSubmit = async (values: WithdrawFormValues) => {
    try {
      // Converter string para número
      const amountStr = values.amount.replace(/[^\d]/g, '');
      const amount = Number(amountStr) / 100;

      if (amount > balance) {
        form.setError('amount', {
          type: 'manual',
          message: 'Saldo insuficiente',
        });
        return;
      }

      // Preparar detalhes do pagamento com base no método
      const paymentDetails: Partial<PaymentDetails> = {};

      switch (values.paymentMethod) {
        case 'PIX':
          paymentDetails.pixCode = values.pixKey;
          break;
        case 'TRANSFERENCIA_BANCARIA':
          paymentDetails.bank = values.bankCode;
          paymentDetails.agency = values.agency;
          paymentDetails.account = values.account;
          break;
        case 'BLOCKCHAIN_TRANSFER':
          paymentDetails.blockchainTxHash = values.walletAddress;
          break;
      }

      const result = await onWithdraw(amount, values.paymentMethod as FormaPagamento, paymentDetails);
      setTransactionId(result.transactionId);
      setWithdrawSuccess(true);
    } catch (error) {
      console.error('Erro ao processar saque:', error);
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

  const renderPaymentMethodFields = () => {
    switch (watchPaymentMethod) {
      case 'PIX':
        return (
          <FormField
            control={form.control}
            name="pixKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chave PIX</FormLabel>
                <FormControl>
                  <Input
                    placeholder="CPF, e-mail, telefone ou chave aleatória"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormDescription>Informe a chave PIX para recebimento</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'TRANSFERENCIA_BANCARIA':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="bankCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banco</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o banco" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="001">001 - Banco do Brasil</SelectItem>
                      <SelectItem value="104">104 - Caixa Econômica Federal</SelectItem>
                      <SelectItem value="237">237 - Bradesco</SelectItem>
                      <SelectItem value="341">341 - Itaú</SelectItem>
                      <SelectItem value="033">033 - Santander</SelectItem>
                      <SelectItem value="260">260 - Nubank</SelectItem>
                      <SelectItem value="077">077 - Inter</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="agency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agência</FormLabel>
                    <FormControl>
                      <Input placeholder="Número da agência" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="account"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conta</FormLabel>
                    <FormControl>
                      <Input placeholder="Número da conta com dígito" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Conta</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de conta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="corrente">Conta Corrente</SelectItem>
                      <SelectItem value="poupanca">Conta Poupança</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 'BLOCKCHAIN_TRANSFER':
        return (
          <FormField
            control={form.control}
            name="walletAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço da Carteira</FormLabel>
                <FormControl>
                  <Input
                    placeholder="0x..."
                    {...field}
                    disabled={loading}
                    className="font-mono"
                  />
                </FormControl>
                <FormDescription>Endereço da carteira Ethereum para recebimento</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitar Saque</CardTitle>
        <CardDescription>
          Retire fundos da sua carteira para sua conta bancária ou carteira digital
        </CardDescription>
      </CardHeader>
      <CardContent>
        {withdrawSuccess ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Solicitação de Saque Enviada</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>
                Sua solicitação de saque foi recebida e está sendo processada. O valor será
                transferido em até 2 dias úteis.
              </p>
              <p className="text-sm mt-2">
                ID da Transação: <span className="font-mono">{transactionId}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Você receberá uma notificação quando o saque for concluído.
              </p>
            </AlertDescription>
          </Alert>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Saldo disponível para saque: <span className="font-semibold">{formatCurrency(balance)}</span>
                </p>
              </div>

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do Saque</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="R$ 0,00"
                        {...field}
                        onChange={formatInputAmount}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormDescription>Valor mínimo de R$ 50,00</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Método de Recebimento</FormLabel>
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

              {renderPaymentMethodFields()}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Spinner className="mr-2 h-4 w-4" /> : null}
                Solicitar Saque
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      {withdrawSuccess && (
        <CardFooter className="flex justify-center border-t px-6 py-4">
          <Button
            variant="outline"
            onClick={() => {
              setWithdrawSuccess(false);
              setTransactionId(null);
              form.reset();
            }}
          >
            Nova Solicitação
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}