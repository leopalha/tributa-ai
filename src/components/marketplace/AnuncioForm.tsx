import { useState, useEffect } from 'react';
import { useRouter } from '@/lib/router-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { api } from '@/services/api'; // Usar a instância do Axios configurada
import { TipoNegociacao, Anuncio } from '@/types/prisma'; // Importar tipos Prisma
import toast from '@/lib/toast-transition'; // Para feedback ao usuário
import { HelpCircle, Loader2 } from 'lucide-react'; // Importar ícones
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; // Importar Tooltip
import { formatCurrency } from '@/lib/utils'; // Importar formatCurrency

// Schema Zod unificado para criação e edição
// Tornar IDs opcionais, pois não são enviados na edição
const anuncioFormSchema = z.object({
  description: z.string().min(10).max(500),
  askingPrice: z.coerce.number().positive(),
  minimumBid: z.coerce.number().positive().optional().nullable(), // Manter nullable para edição
  buyNowPrice: z.coerce.number().positive().optional().nullable(), // Manter nullable para edição
  type: z.nativeEnum(TipoNegociacao),
  status: z.string().optional(), // Permitir edição de status?
  expiresAt: z
    .string()
    .refine(date => !date || !isNaN(Date.parse(date)), {
      // Permitir string vazia ou data válida
      message: 'Data de expiração inválida',
    })
    .optional()
    .nullable(), // Manter nullable para edição
  // IDs necessários apenas para criação
  creditTitleId: z.string().cuid().optional(),
  sellerId: z.string().cuid().optional(),
});

type AnuncioFormData = z.infer<typeof anuncioFormSchema>;

// Tipo para os dados recebidos para edição (pode ser simplificado)
type AnuncioParaEdicao = Pick<
  Anuncio,
  | 'id'
  | 'description'
  | 'askingPrice'
  | 'minimumBid'
  | 'buyNowPrice'
  | 'type'
  | 'status'
  | 'expiresAt'
  | 'creditTitleId'
  | 'sellerId'
>;

interface PriceSuggestion {
  precoSugerido: number;
  faixaPreco: { min: number; max: number };
  fatoresConsiderados?: any;
}

interface AnuncioFormProps {
  // Para criação
  creditTitleId: string;
  sellerId: string;
  // Para edição
  anuncioParaEditar?: AnuncioParaEdicao | null;
  onSuccess?: () => void;
}

export function AnuncioForm({
  creditTitleId,
  sellerId,
  anuncioParaEditar,
  onSuccess,
}: AnuncioFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!anuncioParaEditar;
  const [priceSuggestion, setPriceSuggestion] = useState<PriceSuggestion | null>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  const form = useForm<AnuncioFormData>({
    resolver: zodResolver(anuncioFormSchema),
    // Default values são sobrescritos pelo useEffect no modo de edição
    defaultValues: {
      description: '',
      askingPrice: 0,
      minimumBid: null, // Usar null como padrão para opcionais
      buyNowPrice: null,
      type: TipoNegociacao.VENDA_DIRETA,
      status: 'ACTIVE',
      expiresAt: null, // Padrão null
      creditTitleId: creditTitleId, // Para criação
      sellerId: sellerId, // Para criação
      ...(anuncioParaEditar && {
        // Preencher se for edição (sobrescrito pelo useEffect)
        description: anuncioParaEditar.description ?? '',
        askingPrice: anuncioParaEditar.askingPrice ?? 0,
        minimumBid: anuncioParaEditar.minimumBid,
        buyNowPrice: anuncioParaEditar.buyNowPrice,
        type: anuncioParaEditar.type,
        status: anuncioParaEditar.status ?? 'ACTIVE',
        expiresAt: anuncioParaEditar.expiresAt
          ? new Date(anuncioParaEditar.expiresAt).toISOString().split('T')[0]
          : null,
        creditTitleId: undefined, // Não editar IDs
        sellerId: undefined,
      }),
    },
  });

  // Preencher o formulário quando em modo de edição
  useEffect(() => {
    if (isEditMode && anuncioParaEditar) {
      form.reset({
        description: anuncioParaEditar.description ?? '',
        askingPrice: anuncioParaEditar.askingPrice ?? 0,
        minimumBid: anuncioParaEditar.minimumBid,
        buyNowPrice: anuncioParaEditar.buyNowPrice,
        type: anuncioParaEditar.type,
        status: anuncioParaEditar.status ?? 'ACTIVE',
        // Formatar data para input type="date"
        expiresAt: anuncioParaEditar.expiresAt
          ? new Date(anuncioParaEditar.expiresAt).toISOString().split('T')[0]
          : null,
        creditTitleId: undefined, // Não resetar/editar IDs
        sellerId: undefined,
      });
    }
  }, [isEditMode, anuncioParaEditar, form.reset]);

  // Buscar sugestão de preço quando creditTitleId mudar (apenas na criação)
  useEffect(() => {
    if (!isEditMode && creditTitleId) {
      setLoadingSuggestion(true);
      setPriceSuggestion(null);
      api
        .get<PriceSuggestion>(`/api/pricing/suggestion?tcId=${creditTitleId}`)
        .then(data => {
          setPriceSuggestion(data);
          // Pré-preencher askingPrice com a sugestão?
          if (data.precoSugerido) {
            form.setValue('askingPrice', data.precoSugerido, { shouldValidate: true });
          }
        })
        .catch(err => {
          console.error('Erro ao buscar sugestão de preço:', err);
          // Não mostrar erro crítico, apenas logar talvez
        })
        .finally(() => setLoadingSuggestion(false));
    }
  }, [creditTitleId, isEditMode, form.setValue]); // Adicionar form.setValue à dependência

  const onSubmit = async (data: AnuncioFormData) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        // Garantir que opcionais sejam null se vazios/zero no form, ou o valor numérico
        minimumBid: data.minimumBid ? Number(data.minimumBid) : null,
        buyNowPrice: data.buyNowPrice ? Number(data.buyNowPrice) : null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : null,
        // Remover IDs do payload de edição
        creditTitleId: undefined,
        sellerId: undefined,
      };

      if (isEditMode && anuncioParaEditar) {
        console.log(`Atualizando anúncio ${anuncioParaEditar.id}:`, payload);
        await api.put(`/api/marketplace/anuncios/${anuncioParaEditar.id}`, payload);
        toast.success('Anúncio atualizado com sucesso!');
      } else {
        // Lógica de criação (precisa dos IDs)
        if (!creditTitleId || !sellerId) {
          throw new Error('IDs de Título de Crédito e Vendedor são necessários para criar.');
        }
        const createPayload = { ...payload, creditTitleId, sellerId };
        console.log('Criando novo anúncio:', createPayload);
        await api.post('/api/marketplace', createPayload);
        toast.success('Anúncio criado com sucesso!');
      }

      onSuccess?.();
      // Redirecionar para detalhes (edição) ou marketplace (criação)
      router.push(isEditMode ? `/marketplace/anuncios/${anuncioParaEditar.id}` : '/marketplace');
      router.refresh();
    } catch (error: any) {
      console.error(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} anúncio:`, error);
      const errorMessage = error?.response?.data?.error || error.message || 'Erro desconhecido';
      toast.error(`Falha ao ${isEditMode ? 'atualizar' : 'criar'} anúncio: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        {/* Título dinâmico */}
        <CardTitle>{isEditMode ? 'Editar Anúncio' : 'Novo Anúncio'}</CardTitle>
        <CardDescription>
          {isEditMode
            ? `Atualize as informações do anúncio ID: ${anuncioParaEditar.id}`
            : 'Preencha as informações para criar um novo anúncio no marketplace.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Campos ocultos para criação */}
            {!isEditMode && (
              <>
                <FormField
                  control={form.control}
                  name="creditTitleId"
                  render={({ field }) => <input type="hidden" {...field} />}
                />
                <FormField
                  control={form.control}
                  name="sellerId"
                  render={({ field }) => <input type="hidden" {...field} />}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Detalhes sobre o título de crédito e a negociação..."
                      disabled={loading}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Negociação</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={loading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(TipoNegociacao).map(tipo => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo} {/* Exibe o nome do enum */}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="askingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Preço Sugerido (R$)
                      {/* Tooltip com sugestão de preço */}
                      {!isEditMode && (
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 ml-1"
                                disabled={loadingSuggestion}
                              >
                                {loadingSuggestion ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <HelpCircle className="h-3 w-3 text-muted-foreground" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-xs" side="top">
                              {loadingSuggestion ? (
                                'Calculando sugestão...'
                              ) : priceSuggestion ? (
                                <p>
                                  Preço Sugerido: {formatCurrency(priceSuggestion.precoSugerido)}{' '}
                                  <br /> Faixa: {formatCurrency(priceSuggestion.faixaPreco.min)} -{' '}
                                  {formatCurrency(priceSuggestion.faixaPreco.max)}
                                </p>
                              ) : (
                                'Não foi possível obter sugestão.'
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="10000.00"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minimumBid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lance Mínimo (R$) (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="8000.00"
                        {...field}
                        value={field.value ?? ''} // Garantir que não seja null/undefined
                        disabled={loading || form.watch('type') !== TipoNegociacao.LEILAO}
                      />
                    </FormControl>
                    <FormDescription>Relevante para Leilões</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="buyNowPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço &quot;Compre Agora&quot; (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Valor para compra imediata"
                        {...field}
                        onChange={e =>
                          field.onChange(e.target.value === '' ? null : e.target.valueAsNumber)
                        }
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Expiração (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      // Lidar com valor null
                      value={field.value ? field.value.split('T')[0] : ''}
                      onChange={e => field.onChange(e.target.value || null)} // Enviar null se vazio
                      disabled={loading}
                    />
                  </FormControl>
                  <FormDescription>Deixe em branco para não expirar.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()} // Voltar para detalhes ou marketplace
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? isEditMode
                    ? 'Salvando Alterações...'
                    : 'Criando Anúncio...'
                  : isEditMode
                    ? 'Salvar Alterações'
                    : 'Criar Anúncio'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
