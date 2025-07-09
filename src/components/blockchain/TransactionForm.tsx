import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Send, Loader2, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define the form schema
const formSchema = z.object({
  recipientAddress: z
    .string()
    .min(1, 'Endereço do destinatário é obrigatório')
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Endereço Ethereum inválido'),
  token: z.string().min(1, 'Token é obrigatório'),
  amount: z
    .string()
    .min(1, 'Quantidade é obrigatório')
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'A quantidade deve ser maior que zero',
    }),
  memo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Mock token data
const mockTokens = [
  {
    id: 'tcnj',
    name: 'Token Crédito NJ',
    symbol: 'TCNJ',
    balance: '10000',
  },
  {
    id: 'crfb',
    name: 'Crédito Fiscal Brasil',
    symbol: 'CRFB',
    balance: '5000',
  },
  {
    id: 'spcr',
    name: 'São Paulo Credit',
    symbol: 'SPCR',
    balance: '2000',
  },
];

interface TransactionFormProps {
  className?: string;
  onTransactionSubmit?: (values: FormValues) => Promise<void>;
  isWalletConnected?: boolean;
}

export function TransactionForm({
  className,
  onTransactionSubmit,
  isWalletConnected = false,
}: TransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientAddress: '',
      token: '',
      amount: '',
      memo: '',
    },
  });

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    if (!isWalletConnected) {
      toast.error('Conecte sua carteira para enviar transações');
      return;
    }

    setIsSubmitting(true);
    try {
      if (onTransactionSubmit) {
        await onTransactionSubmit(values);
      } else {
        // Default implementation if no custom handler provided
        // Simulate transaction processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        toast.success(
          `${values.amount} ${values.token} enviado com sucesso para ${values.recipientAddress.substring(0, 6)}...${values.recipientAddress.substring(values.recipientAddress.length - 4)}`
        );

        // Reset form
        form.reset();
      }
    } catch (error) {
      console.error('Transaction error:', error);
      toast.error('Erro ao processar transação');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the selected token's balance
  const getSelectedTokenBalance = () => {
    if (!selectedToken) return null;
    const token = mockTokens.find(t => t.id === selectedToken);
    return token ? token.balance : null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Enviar Tokens</CardTitle>
        <CardDescription>Transfira tokens para outro endereço na blockchain</CardDescription>
      </CardHeader>
      <CardContent>
        {!isWalletConnected ? (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>Conecte sua carteira para enviar tokens</AlertDescription>
          </Alert>
        ) : null}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="recipientAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço do Destinatário</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0x..."
                      {...field}
                      disabled={isSubmitting || !isWalletConnected}
                    />
                  </FormControl>
                  <FormDescription>Endereço da carteira do destinatário</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token</FormLabel>
                  <Select
                    onValueChange={value => {
                      field.onChange(value);
                      setSelectedToken(value);
                    }}
                    defaultValue={field.value}
                    disabled={isSubmitting || !isWalletConnected}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um token" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockTokens.map(token => (
                        <SelectItem key={token.id} value={token.id}>
                          <span className="font-medium">{token.symbol}</span>
                          <span className="ml-2 text-muted-foreground">
                            ({token.balance} disponível)
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        step="0.000001"
                        placeholder="0.0"
                        {...field}
                        disabled={isSubmitting || !isWalletConnected}
                      />
                      {selectedToken && (
                        <Button
                          type="button"
                          variant="ghost"
                          className="ml-2"
                          onClick={() => {
                            const balance = getSelectedTokenBalance();
                            if (balance) {
                              form.setValue('amount', balance);
                            }
                          }}
                          disabled={isSubmitting || !isWalletConnected}
                        >
                          Max
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  {selectedToken && (
                    <FormDescription>
                      Saldo disponível: {getSelectedTokenBalance() || '0'}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="memo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Memo (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Descrição da transação"
                      {...field}
                      disabled={isSubmitting || !isWalletConnected}
                    />
                  </FormControl>
                  <FormDescription>Uma nota ou descrição para esta transação</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={isSubmitting || !isWalletConnected}
          onClick={form.handleSubmit(onSubmit)}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Enviar Tokens
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
