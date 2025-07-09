import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FormaPagamento } from '@/types/prisma';
import { WalletPaymentMethod } from '@/types/wallet';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Zap, CreditCard, Landmark, Wallet, AlertCircle, Trash2, Plus } from 'lucide-react';

// Esquema de validação
const paymentMethodSchema = z.object({
  type: z.enum(['PIX', 'BOLETO', 'TRANSFERENCIA_BANCARIA', 'BLOCKCHAIN_TRANSFER']),
  isDefault: z.boolean().default(false),
  details: z.object({
    pixKey: z.string().optional(),
    pixKeyType: z.enum(['CPF', 'EMAIL', 'TELEFONE', 'ALEATORIA']).optional(),
    bankCode: z.string().optional(),
    agency: z.string().optional(),
    account: z.string().optional(),
    accountType: z.enum(['CORRENTE', 'POUPANCA']).optional(),
    cardNumber: z.string().optional(),
    cardName: z.string().optional(),
    cardExpiry: z.string().optional(),
    walletAddress: z.string().optional(),
    walletNetwork: z.string().optional(),
  }).optional(),
});

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

interface WalletPaymentMethodsProps {
  paymentMethods: WalletPaymentMethod[];
  onAddPaymentMethod: (
    type: FormaPagamento,
    details: any,
    isDefault: boolean
  ) => Promise<WalletPaymentMethod>;
  loading: boolean;
}

export function WalletPaymentMethods({
  paymentMethods,
  onAddPaymentMethod,
  loading,
}: WalletPaymentMethodsProps) {
  const [activeTab, setActiveTab] = useState<string>('saved');
  const [addingMethod, setAddingMethod] = useState<boolean>(false);

  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: 'PIX',
      isDefault: false,
      details: {
        pixKeyType: 'CPF',
      },
    },
  });

  const watchPaymentType = form.watch('type');

  const handleSubmit = async (values: PaymentMethodFormValues) => {
    try {
      // Preparar detalhes com base no tipo
      const details: any = {};
      
      switch (values.type) {
        case 'PIX':
          details.pixKey = values.details?.pixKey;
          details.pixKeyType = values.details?.pixKeyType;
          break;
        case 'TRANSFERENCIA_BANCARIA':
          details.bankCode = values.details?.bankCode;
          details.agency = values.details?.agency;
          details.account = values.details?.account;
          details.accountType = values.details?.accountType;
          break;
        case 'BLOCKCHAIN_TRANSFER':
          details.walletAddress = values.details?.walletAddress;
          details.walletNetwork = values.details?.walletNetwork;
          break;
      }

      await onAddPaymentMethod(values.type as FormaPagamento, details, values.isDefault);
      setAddingMethod(false);
      form.reset();
      setActiveTab('saved');
    } catch (error) {
      console.error('Erro ao adicionar método de pagamento:', error);
    }
  };

  const renderMethodTypeFields = () => {
    switch (watchPaymentType) {
      case 'PIX':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="details.pixKeyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Chave PIX</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de chave" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CPF">CPF</SelectItem>
                      <SelectItem value="EMAIL">E-mail</SelectItem>
                      <SelectItem value="TELEFONE">Telefone</SelectItem>
                      <SelectItem value="ALEATORIA">Chave Aleatória</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details.pixKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chave PIX</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite sua chave PIX"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 'TRANSFERENCIA_BANCARIA':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="details.bankCode"
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
                name="details.agency"
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
                name="details.account"
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
              name="details.accountType"
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
                      <SelectItem value="CORRENTE">Conta Corrente</SelectItem>
                      <SelectItem value="POUPANCA">Conta Poupança</SelectItem>
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
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="details.walletAddress"
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details.walletNetwork"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rede</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a rede blockchain" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ETHEREUM">Ethereum (ETH)</SelectItem>
                      <SelectItem value="BSC">Binance Smart Chain (BSC)</SelectItem>
                      <SelectItem value="POLYGON">Polygon (MATIC)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Função para renderizar ícone baseado no tipo de método de pagamento
  const getPaymentMethodIcon = (type: FormaPagamento) => {
    switch (type) {
      case 'PIX':
        return <Zap className="h-4 w-4 text-blue-500" />;
      case 'BOLETO':
        return <CreditCard className="h-4 w-4 text-gray-500" />;
      case 'TRANSFERENCIA_BANCARIA':
        return <Landmark className="h-4 w-4 text-green-500" />;
      case 'BLOCKCHAIN_TRANSFER':
        return <Wallet className="h-4 w-4 text-purple-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  // Função para formatar o tipo de método de pagamento
  const formatPaymentMethodType = (type: FormaPagamento) => {
    switch (type) {
      case 'PIX':
        return 'PIX';
      case 'BOLETO':
        return 'Boleto Bancário';
      case 'TRANSFERENCIA_BANCARIA':
        return 'Transferência Bancária';
      case 'BLOCKCHAIN_TRANSFER':
        return 'Carteira Blockchain';
      default:
        return 'Desconhecido';
    }
  };

  // Função para formatar os detalhes do método de pagamento
  const formatPaymentMethodDetails = (method: WalletPaymentMethod) => {
    switch (method.type) {
      case 'PIX':
        return (
          <div className="text-sm text-muted-foreground">
            <p>
              {method.details.pixKeyType}: {method.details.pixKey}
            </p>
          </div>
        );
      case 'TRANSFERENCIA_BANCARIA':
        return (
          <div className="text-sm text-muted-foreground">
            <p>
              Banco: {method.details.bankCode} • Agência: {method.details.agency} • Conta:{' '}
              {method.details.account}
            </p>
            <p>Tipo: {method.details.accountType === 'CORRENTE' ? 'Corrente' : 'Poupança'}</p>
          </div>
        );
      case 'BLOCKCHAIN_TRANSFER':
        return (
          <div className="text-sm text-muted-foreground">
            <p className="font-mono truncate">
              {method.details.walletAddress?.substring(0, 10)}...
              {method.details.walletAddress?.substring(
                method.details.walletAddress.length - 8
              )}
            </p>
            <p>Rede: {method.details.walletNetwork}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métodos de Pagamento</CardTitle>
        <CardDescription>
          Gerencie seus métodos de pagamento para depósitos e saques
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="saved">Métodos Salvos</TabsTrigger>
            {!addingMethod && <TabsTrigger value="add">Adicionar Novo</TabsTrigger>}
          </TabsList>

          <TabsContent value="saved" className="space-y-4">
            {paymentMethods.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum método de pagamento cadastrado.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setAddingMethod(true);
                    setActiveTab('add');
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Método de Pagamento
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <Card key={method.id} className="overflow-hidden">
                    <div className="flex items-center p-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(method.type)}
                          <span className="font-medium">
                            {formatPaymentMethodType(method.type)}
                          </span>
                          {method.isDefault && (
                            <Badge variant="secondary" className="ml-2">
                              Padrão
                            </Badge>
                          )}
                        </div>
                        <div className="mt-1">{formatPaymentMethodDetails(method)}</div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="add">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Tipo de Método de Pagamento</FormLabel>
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
                              PIX
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="TRANSFERENCIA_BANCARIA" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center gap-2">
                              <Landmark className="h-4 w-4 text-green-600" />
                              Conta Bancária
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="BLOCKCHAIN_TRANSFER" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center gap-2">
                              <Wallet className="h-4 w-4 text-purple-600" />
                              Carteira Blockchain
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {renderMethodTypeFields()}

                <FormField
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={loading}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Definir como método padrão</FormLabel>
                        <FormDescription>
                          Este método será usado automaticamente em depósitos e saques
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? <Spinner className="mr-2 h-4 w-4" /> : null}
                    Salvar Método de Pagamento
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setAddingMethod(false);
                      setActiveTab('saved');
                      form.reset();
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}