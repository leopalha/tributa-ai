import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Card,
  CardContent,
  CardDescription,
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
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { marketplaceService } from '@/services/marketplace.service';
import { tcService } from '@/services/tc.service';
import { TC } from '@/types/tc';
import { TipoNegociacao } from '@/types/marketplace';
import { formatCurrency } from '@/lib/utils';

const anuncioSchema = z.object({
  tcId: z.string().min(1, 'Selecione um TC'),
  titulo: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  descricao: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  tipoNegociacao: z.enum(['venda_direta', 'leilao', 'proposta']),
  valorMinimo: z.number().min(0, 'Valor mínimo deve ser maior que zero'),
  valorSugerido: z.number().min(0, 'Valor sugerido deve ser maior que zero'),
  restricoes: z.object({
    setoresPermitidos: z.array(z.string()).optional(),
    regioesPermitidas: z.array(z.string()).optional(),
    faturamentoMinimo: z.number().optional(),
  }),
  documentosNecessarios: z.array(z.string()).optional(),
});

type AnuncioFormData = z.infer<typeof anuncioSchema>;

interface AnuncioFormProps {
  anuncioId?: string;
  onSuccess?: () => void;
}

export function AnuncioForm({ anuncioId, onSuccess }: AnuncioFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tcsDisponiveis, setTcsDisponiveis] = useState<TC[]>([]);
  const [tcSelecionado, setTcSelecionado] = useState<TC | null>(null);
  const [recomendacoes, setRecomendacoes] = useState<{
    valorSugerido: number;
    descontoSugerido: number;
    tempoEstimadoVenda: number;
  } | null>(null);

  const form = useForm<AnuncioFormData>({
    resolver: zodResolver(anuncioSchema),
    defaultValues: {
      titulo: '',
      descricao: '',
      tipoNegociacao: 'venda_direta',
      valorMinimo: 0,
      valorSugerido: 0,
      restricoes: {},
      documentosNecessarios: [],
    },
  });

  useEffect(() => {
    carregarTCs();
    if (anuncioId) {
      carregarAnuncio();
    }
  }, [anuncioId]);

  const carregarTCs = async () => {
    try {
      const response = await tcService.listar({
        status: 'ativo',
        valorDisponivel_gt: 0,
      });
      setTcsDisponiveis(response.items);
    } catch (error) {
      console.error('Erro ao carregar TCs:', error);
    }
  };

  const carregarAnuncio = async () => {
    try {
      setLoading(true);
      const anuncio = await marketplaceService.obterAnuncio(anuncioId!);
      form.reset({
        tcId: anuncio.tcId,
        titulo: anuncio.titulo,
        descricao: anuncio.descricao,
        tipoNegociacao: anuncio.tipoNegociacao,
        valorMinimo: anuncio.valorMinimo,
        valorSugerido: anuncio.valorSugerido,
        restricoes: anuncio.restricoes,
        documentosNecessarios: anuncio.documentosNecessarios,
      });
      setTcSelecionado(anuncio.tc);
    } catch (error) {
      console.error('Erro ao carregar anúncio:', error);
    } finally {
      setLoading(false);
    }
  };

  const obterRecomendacoes = async (tcId: string) => {
    try {
      const recomendacoes = await marketplaceService.obterRecomendacoes(tcId);
      setRecomendacoes(recomendacoes);
      form.setValue('valorSugerido', recomendacoes.valorSugerido);
    } catch (error) {
      console.error('Erro ao obter recomendações:', error);
    }
  };

  const handleTcChange = async (tcId: string) => {
    const tc = tcsDisponiveis.find(tc => tc.id === tcId);
    if (tc) {
      setTcSelecionado(tc);
      form.setValue('tcId', tcId);
      form.setValue('titulo', `TC ${tc.numero} - ${tc.tipo}`);
      await obterRecomendacoes(tcId);
    }
  };

  const onSubmit = async (data: AnuncioFormData) => {
    try {
      setLoading(true);
      if (anuncioId) {
        await marketplaceService.atualizarAnuncio(anuncioId, data);
      } else {
        await marketplaceService.criarAnuncio(data);
      }
      onSuccess?.();
      router.push('/marketplace');
    } catch (error) {
      console.error('Erro ao salvar anúncio:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{anuncioId ? 'Editar Anúncio' : 'Novo Anúncio'}</CardTitle>
        <CardDescription>
          {anuncioId ? 'Atualize as informações do anúncio' : 'Crie um novo anúncio para negociar seu TC'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="tcId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título de Crédito</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={handleTcChange}
                      disabled={loading || !!anuncioId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um TC" />
                      </SelectTrigger>
                      <SelectContent>
                        {tcsDisponiveis.map((tc) => (
                          <SelectItem key={tc.id} value={tc.id}>
                            TC {tc.numero} - {formatCurrency(tc.valorDisponivel)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Selecione o TC que deseja negociar
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipoNegociacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Negociação</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="venda_direta">Venda Direta</SelectItem>
                        <SelectItem value="leilao">Leilão</SelectItem>
                        <SelectItem value="proposta">Proposta</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Como você deseja negociar este TC
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Anúncio</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={loading} />
                  </FormControl>
                  <FormDescription>
                    Um título claro e objetivo para seu anúncio
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={loading}
                      rows={4}
                    />
                  </FormControl>
                  <FormDescription>
                    Descreva detalhes importantes sobre o TC e condições de negociação
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="valorMinimo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Mínimo</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormDescription>
                      Valor mínimo que você aceita receber
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valorSugerido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Sugerido</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormDescription>
                      Valor sugerido para negociação
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {recomendacoes && (
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Recomendações</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Valor Sugerido</p>
                    <p className="font-medium">{formatCurrency(recomendacoes.valorSugerido)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Desconto Sugerido</p>
                    <p className="font-medium">{recomendacoes.descontoSugerido}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tempo Estimado</p>
                    <p className="font-medium">{recomendacoes.tempoEstimadoVenda} dias</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 