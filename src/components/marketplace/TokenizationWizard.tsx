import React, { useState, useEffect } from 'react';
import { useRouter } from '@/lib/router-utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileText,
  HelpCircle,
  Info,
  LucideIcon,
  Share2,
  Shield,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { Spinner } from '@/components/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CreditTitle, CreditCategory } from '@prisma/client';

// Esquema de validação para formulário
const tokenizationSchema = z.object({
  creditId: z.string().min(1, 'Selecione um crédito a ser tokenizado'),
  tokenType: z.enum(['ERC-721', 'FABRIC', 'HYPERLEDGER']),
  tokenName: z.string().min(3, 'Forneça um nome para o token'),
  tokenSymbol: z
    .string()
    .min(2, 'Forneça um símbolo para o token')
    .max(8, 'Máximo de 8 caracteres'),
  description: z.string().min(10, 'Forneça uma descrição de pelo menos 10 caracteres'),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'Você precisa aceitar os termos para continuar',
  }),
});

type TokenizationFormValues = z.infer<typeof tokenizationSchema>;

interface TokenizationWizardProps {
  availableCreditTitles: CreditTitle[];
  onTokenizationComplete?: (tokenInfo: any) => void;
}

interface StepProps {
  title: string;
  description: string;
  icon: LucideIcon;
  isActive: boolean;
  isCompleted: boolean;
}

const Step: React.FC<StepProps> = ({ title, description, icon: Icon, isActive, isCompleted }) => {
  return (
    <div
      className={`relative flex items-center gap-4 px-4 py-3 rounded-lg transition-colors
      ${isActive ? 'bg-blue-50 dark:bg-blue-900/20' : ''} 
      ${isCompleted ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'}`}
    >
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-full border 
        ${isActive ? 'border-blue-500 bg-blue-100 dark:bg-blue-800/30 text-blue-700 dark:text-blue-300' : ''}
        ${isCompleted ? 'bg-green-100 dark:bg-green-800/30 border-green-500 text-green-700 dark:text-green-300' : ''}`}
      >
        {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
      </div>
      <div>
        <h3
          className={`font-medium text-base ${isActive ? 'text-blue-700 dark:text-blue-300' : ''} ${isCompleted ? 'text-green-700 dark:text-green-300' : ''}`}
        >
          {title}
        </h3>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
};

export function TokenizationWizard({
  availableCreditTitles = [],
  onTokenizationComplete,
}: TokenizationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCredit, setSelectedCredit] = useState<CreditTitle | null>(null);
  const [tokenPreview, setTokenPreview] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tokenizationProgress, setTokenizationProgress] = useState(0);
  const [tokenizationResult, setTokenizationResult] = useState<'success' | 'error' | null>(null);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const router = useRouter();

  const form = useForm<TokenizationFormValues>({
    resolver: zodResolver(tokenizationSchema),
    defaultValues: {
      creditId: '',
      tokenType: 'FABRIC',
      tokenName: '',
      tokenSymbol: '',
      description: '',
      termsAccepted: false,
    },
  });

  // Observar mudanças nos campos de formulário para gerar preview
  useEffect(() => {
    if (form.watch('creditId') && selectedCredit) {
      const tokenSymbol = form.watch('tokenSymbol') || 'TKN';
      const tokenName = form.watch('tokenName') || `Token ${selectedCredit.title || 'Sem título'}`;

      setTokenPreview({
        type: form.watch('tokenType') || 'FABRIC',
        name: tokenName,
        symbol: tokenSymbol,
        totalSupply: 1,
        creditValue: selectedCredit.value,
        description: form.watch('description') || '',
        creditTitle: selectedCredit,
      });
    }
  }, [
    form.watch(['creditId', 'tokenName', 'tokenSymbol', 'tokenType', 'description']),
    selectedCredit,
  ]);

  // Atualizar o crédito selecionado quando o ID mudar
  useEffect(() => {
    const creditId = form.watch('creditId');
    if (creditId) {
      const credit = availableCreditTitles.find(c => c.id === creditId);
      setSelectedCredit(credit || null);

      // Preencher automaticamente os campos baseados no crédito selecionado
      if (credit) {
        form.setValue('tokenName', credit.title || `Token TC-${credit.id.substring(0, 8)}`);
        form.setValue('tokenSymbol', `TC-${credit.id.substring(0, 4)}`);
        form.setValue(
          'description',
          credit.description ||
            `Token representando crédito ${credit.category} no valor de ${credit.value}`
        );
      }
    }
  }, [form.watch('creditId'), availableCreditTitles, form]);

  // Funções para simular o processo de tokenização
  const simulateTokenization = async () => {
    setIsProcessing(true);
    setTokenizationProgress(0);

    try {
      // Simular validação jurídica
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTokenizationProgress(30);

      // Simular chamada à API de token
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTokenizationProgress(60);

      // Simular registro em blockchain
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTokenizationProgress(90);

      // Simular finalização
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTokenizationProgress(100);

      // Gerar resultado da tokenização
      const tokenData = {
        id: `token-${Date.now().toString(36)}`,
        creditId: selectedCredit?.id,
        tokenType: form.getValues().tokenType,
        tokenName: form.getValues().tokenName,
        tokenSymbol: form.getValues().tokenSymbol,
        blockchain: 'Fabric Testnet',
        transactionHash: `0x${Array(40)
          .fill(0)
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join('')}`,
        tokenAddress: `0x${Array(40)
          .fill(0)
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join('')}`,
        createdAt: new Date().toISOString(),
      };

      setTokenInfo(tokenData);
      setTokenizationResult('success');

      // Notificar concluído
      if (onTokenizationComplete) {
        onTokenizationComplete(tokenData);
      }
    } catch (error) {
      console.error('Erro na tokenização:', error);
      setTokenizationResult('error');
      toast.error('Ocorreu um erro durante o processo de tokenização');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTokenize = form.handleSubmit(async data => {
    setCurrentStep(3);
    await simulateTokenization();
  });

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    if (tokenizationResult === 'success' && selectedCredit) {
      router.push(`/dashboard/marketplace?success=tokenizado&id=${selectedCredit.id}`);
    } else {
      router.push(`/dashboard/marketplace`);
    }
  };

  // Renderizar o conteúdo de cada etapa
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Form {...form}>
              <form className="space-y-6">
                <FormField
                  control={form.control}
                  name="creditId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crédito a Tokenizar</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um crédito" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableCreditTitles.length === 0 ? (
                            <SelectItem value="sem-creditos" disabled>
                              Nenhum crédito disponível para tokenização
                            </SelectItem>
                          ) : (
                            availableCreditTitles.map(credit => (
                              <SelectItem key={credit.id} value={credit.id}>
                                {credit.title || `Crédito #${credit.id.substring(0, 8)}`} -
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                }).format(credit.value)}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Escolha o crédito que deseja tokenizar. Apenas créditos validados podem ser
                        tokenizados.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedCredit && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                      Informações do Crédito Selecionado
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        Título:{' '}
                        <span className="font-medium">
                          {selectedCredit.title || 'Não definido'}
                        </span>
                      </div>
                      <div>
                        Categoria: <span className="font-medium">{selectedCredit.category}</span>
                      </div>
                      <div>
                        Valor:{' '}
                        <span className="font-medium">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(selectedCredit.value)}
                        </span>
                      </div>
                      <div>
                        Status: <span className="font-medium">{selectedCredit.status}</span>
                      </div>
                      <div className="col-span-2">
                        Emissor: <span className="font-medium">{selectedCredit.issuerName}</span>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Form {...form}>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="tokenType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Token</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="FABRIC">Hyperledger Fabric</SelectItem>
                            <SelectItem value="ERC-721">ERC-721 (NFT)</SelectItem>
                            <SelectItem value="HYPERLEDGER">Hyperledger Besu</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tokenSymbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Símbolo do Token</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: TCRED" maxLength={8} />
                        </FormControl>
                        <FormDescription>Máximo de 8 caracteres, sem espaços.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="tokenName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Token</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Crédito Tributário 2023" />
                      </FormControl>
                      <FormDescription>
                        Nome completo que identifica o token e seu propósito.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição do Token</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Descreva as características e finalidade deste token..."
                          rows={4}
                        />
                      </FormControl>
                      <FormDescription>
                        Esta descrição ficará registrada permanentemente na blockchain.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="mt-1"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Concordo com os termos e condições de tokenização</FormLabel>
                        <FormDescription>
                          Ao tokenizar este crédito, você concorda que está em conformidade com
                          todas as regulamentações aplicáveis.
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            {tokenPreview && (
              <Card className="mt-6 border-dashed border-blue-300">
                <CardHeader>
                  <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center">
                    <Info className="h-5 w-5 mr-2" /> Pré-visualização do Token
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-muted-foreground">Nome do Token</Label>
                      <p className="font-medium">{tokenPreview.name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Símbolo</Label>
                      <p className="font-medium">{tokenPreview.symbol}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Tipo</Label>
                      <p className="font-medium">{tokenPreview.type}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Valor Representado</Label>
                      <p className="font-medium">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(tokenPreview.creditValue)}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-muted-foreground">Descrição</Label>
                      <p>{tokenPreview.description || 'Sem descrição'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {isProcessing ? (
              <div className="space-y-8 py-8">
                <div className="text-center space-y-2">
                  <Spinner className="h-12 w-12 mx-auto text-blue-600" />
                  <h3 className="text-xl font-medium mt-4">Processando Tokenização</h3>
                  <p className="text-muted-foreground">
                    Por favor, aguarde enquanto processamos seu pedido de tokenização...
                  </p>
                </div>

                <Progress value={tokenizationProgress} className="h-2 w-full" />

                <div className="space-y-3 max-w-md mx-auto">
                  <div
                    className={`flex items-center ${tokenizationProgress >= 30 ? 'text-green-600' : ''}`}
                  >
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    <span>Validação jurídica do crédito</span>
                  </div>
                  <div
                    className={`flex items-center ${tokenizationProgress >= 60 ? 'text-green-600' : ''}`}
                  >
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    <span>Geração de token e registro em sistema</span>
                  </div>
                  <div
                    className={`flex items-center ${tokenizationProgress >= 90 ? 'text-green-600' : ''}`}
                  >
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    <span>Registro do token em blockchain</span>
                  </div>
                  <div
                    className={`flex items-center ${tokenizationProgress >= 100 ? 'text-green-600' : ''}`}
                  >
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    <span>Finalização e validação</span>
                  </div>
                </div>
              </div>
            ) : tokenizationResult === 'success' ? (
              <div className="space-y-6 py-4">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mt-4">Tokenização Concluída com Sucesso!</h3>
                  <p className="text-muted-foreground">
                    Seu crédito foi tokenizado e está pronto para ser listado no marketplace.
                  </p>
                </div>

                <Card className="border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="text-green-700 dark:text-green-400">
                      Informações do Token
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Token ID</Label>
                        <p className="font-medium font-mono">{tokenInfo?.id}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Nome</Label>
                        <p className="font-medium">{tokenInfo?.tokenName}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Símbolo</Label>
                        <p className="font-medium">{tokenInfo?.tokenSymbol}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Blockchain</Label>
                        <p className="font-medium">{tokenInfo?.blockchain}</p>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-muted-foreground">Endereço do Token</Label>
                        <p className="font-mono text-xs break-all">{tokenInfo?.tokenAddress}</p>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-muted-foreground">Hash da Transação</Label>
                        <p className="font-mono text-xs break-all">{tokenInfo?.transactionHash}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center space-y-4 pt-4">
                  <p className="text-muted-foreground">
                    Você pode agora listar este token no marketplace para venda ou compensação.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={handleFinish}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Concluir Processo
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <a href={`/dashboard/marketplace/anuncios/novo?tokenId=${tokenInfo?.id}`}>
                        <Share2 className="h-5 w-5 mr-2" />
                        Criar Anúncio
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ) : tokenizationResult === 'error' ? (
              <div className="space-y-6 py-4">
                <Alert
                  variant="destructive"
                  className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
                >
                  <X className="h-5 w-5" />
                  <AlertTitle>Erro na Tokenização</AlertTitle>
                  <AlertDescription>
                    Ocorreu um erro durante o processo de tokenização. Por favor, tente novamente
                    mais tarde ou entre em contato com o suporte.
                  </AlertDescription>
                </Alert>

                <div className="text-center pt-4">
                  <Button onClick={() => setCurrentStep(1)} variant="outline">
                    Voltar ao Início
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Info className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <h3 className="text-xl font-medium">Pronto para Tokenizar?</h3>
                <p className="text-muted-foreground mt-2 mb-6">
                  Ao clicar em "Iniciar Tokenização", o processo será iniciado e não poderá ser
                  interrompido.
                </p>
                <Button
                  onClick={handleTokenize}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Iniciar Tokenização
                </Button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold">Assistente de Tokenização</h1>
        <p className="text-muted-foreground">
          Tokenize seus créditos de forma segura e prepare-os para negociação no marketplace.
        </p>
      </div>

      {/* Etapas do wizard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Step
          title="Selecionar Crédito"
          description="Escolha o crédito a ser tokenizado"
          icon={FileText}
          isActive={currentStep === 1}
          isCompleted={currentStep > 1}
        />
        <Step
          title="Detalhes do Token"
          description="Configure as informações do token"
          icon={CreditCard}
          isActive={currentStep === 2}
          isCompleted={currentStep > 2}
        />
        <Step
          title="Tokenização"
          description="Processo de tokenização e confirmação"
          icon={Shield}
          isActive={currentStep === 3}
          isCompleted={tokenizationResult === 'success'}
        />
      </div>

      {/* Conteúdo da etapa atual */}
      <Card className="border shadow-sm">
        <CardContent className="pt-6">{renderStepContent()}</CardContent>

        {(currentStep < 3 || (currentStep === 3 && !isProcessing && !tokenizationResult)) && (
          <CardFooter className="flex justify-between border-t bg-muted/50 py-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || isProcessing}
            >
              Voltar
            </Button>

            {currentStep < 3 && (
              <Button
                onClick={currentStep === 2 ? handleTokenize : nextStep}
                disabled={
                  (currentStep === 1 && !form.getValues().creditId) ||
                  (currentStep === 2 && !form.formState.isValid) ||
                  isProcessing
                }
              >
                {currentStep === 2 ? 'Tokenizar' : 'Próximo'}
                {currentStep < 3 && <ChevronRight className="ml-2 h-4 w-4" />}
              </Button>
            )}
          </CardFooter>
        )}
      </Card>

      {/* Informação de ajuda */}
      <div className="mt-6 flex items-start space-x-3 text-sm text-muted-foreground">
        <HelpCircle className="h-5 w-5 flex-shrink-0" />
        <p>
          A tokenização é o processo de representar seu crédito como um ativo digital em blockchain,
          permitindo sua negociação segura no marketplace. Todos os dados são permanentemente
          registrados e não podem ser alterados após a tokenização.
        </p>
      </div>
    </div>
  );
}
