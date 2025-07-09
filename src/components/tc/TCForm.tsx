import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/services/api';
import { CreditCategory, CreditStatus, CreditTitle } from '@/types/prisma';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from '@/lib/toast-transition';
import { Loader2 } from 'lucide-react';

// Schema Zod unificado
const tcFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Título muito curto')
    .max(100, 'Título muito longo')
    .optional()
    .nullable(),
  description: z.string().max(1000, 'Descrição muito longa').optional().nullable(),
  category: z.nativeEnum(CreditCategory),
  subtype: z.string().min(1, 'Subtipo é obrigatório').max(50),
  status: z.nativeEnum(CreditStatus),
  value: z.coerce.number().positive('Valor deve ser positivo'),
  issueDate: z.string().refine(date => !isNaN(Date.parse(date)), { message: 'Data inválida' }),
  dueDate: z
    .string()
    .refine(date => !date || !isNaN(Date.parse(date)), { message: 'Data inválida' })
    .optional()
    .nullable(),
  issuerName: z.string().min(2, 'Nome do emissor muito curto').max(100),
  debtorName: z.string().max(100).optional().nullable(),
  originalCreditorName: z.string().max(100).optional().nullable(),
  registrationNumber: z.string().max(50).optional().nullable(),
});

type TCFormData = z.infer<typeof tcFormSchema>;

// Usar tipo do Prisma Client
type TCParaEdicao = CreditTitle;

interface TCFormProps {
  tcParaEditar?: TCParaEdicao | null;
  onSuccess?: (tc: CreditTitle) => void;
}

export function TCForm({ tcParaEditar, onSuccess }: TCFormProps) {
  const [loading, setLoading] = useState(false);
  const isEditMode = !!tcParaEditar;

  const form = useForm<TCFormData>({
    resolver: zodResolver(tcFormSchema),
    defaultValues: {
      title: tcParaEditar?.title ?? '',
      description: tcParaEditar?.description,
      category: tcParaEditar?.category || CreditCategory.TRIBUTARIO,
      subtype: tcParaEditar?.subtype || '',
      status: tcParaEditar?.status || CreditStatus.DRAFT,
      value: tcParaEditar?.value || 0,
      issueDate: tcParaEditar
        ? new Date(tcParaEditar.issueDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      dueDate: tcParaEditar?.dueDate
        ? new Date(tcParaEditar.dueDate).toISOString().split('T')[0]
        : null,
      issuerName: tcParaEditar?.issuerName || '',
      debtorName: tcParaEditar?.debtorName,
      originalCreditorName: tcParaEditar?.originalCreditorName,
      registrationNumber: tcParaEditar?.registrationNumber,
    },
  });

  useEffect(() => {
    if (isEditMode && tcParaEditar) {
      form.reset({
        title: tcParaEditar.title ?? '',
        description: tcParaEditar.description,
        category: tcParaEditar.category,
        subtype: tcParaEditar.subtype,
        status: tcParaEditar.status,
        value: tcParaEditar.value,
        issueDate: new Date(tcParaEditar.issueDate).toISOString().split('T')[0],
        dueDate: tcParaEditar.dueDate
          ? new Date(tcParaEditar.dueDate).toISOString().split('T')[0]
          : null,
        issuerName: tcParaEditar.issuerName,
        debtorName: tcParaEditar.debtorName,
        originalCreditorName: tcParaEditar.originalCreditorName,
        registrationNumber: tcParaEditar.registrationNumber,
      });
    }
  }, [isEditMode, tcParaEditar, form]);

  const onSubmit = async (data: TCFormData) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        dueDate: data.dueDate || null,
      };

      let response: CreditTitle;
      if (isEditMode && tcParaEditar) {
        delete (payload as Partial<TCFormData>).issueDate;
        delete (payload as Partial<TCFormData>).status;

        console.log(`Atualizando TC ${tcParaEditar.id}:`, payload);
        response = await api.put<CreditTitle>(`/api/tcs/${tcParaEditar.id}`, payload);
        toast.success('Título de Crédito atualizado com sucesso!');
      } else {
        console.log('Criando novo TC:', payload);
        response = await api.post<CreditTitle>('/api/tcs', payload);
        toast.success('Título de Crédito criado com sucesso!');
      }

      onSuccess?.(response);
    } catch (error) {
      const err = error as Error & { response?: { data?: { error?: string; details?: unknown } } };
      const errorMessage = err.response?.data?.error || err.message || 'Erro desconhecido';
      toast.error(`Falha ao ${isEditMode ? 'atualizar' : 'criar'} TC: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditMode ? 'Editar Título de Crédito' : 'Adicionar Novo Título de Crédito'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Precatório XPTO" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
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
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detalhes sobre o crédito..."
                      {...field}
                      disabled={loading}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(CreditCategory).map(cat => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
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
                name="subtype"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtipo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: ICMS, PIS/COFINS, Precatório"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormDescription>Tipo específico do crédito.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Inicial</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={CreditStatus.DRAFT}>{CreditStatus.DRAFT}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Emissão</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={loading || isEditMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Vencimento (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value || ''}
                        onChange={e => field.onChange(e.target.value || null)}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Registro (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 12345/2023" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="issuerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Emissor</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: União Federal, Estado de SP"
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
                name="debtorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Devedor (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Receita Federal" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="originalCreditorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credor Original (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome da empresa/pessoa original"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* TODO: Adicionar campos para Documentos, Garantias, Histórico, Tokenização? */}
            {/* Poderiam ser seções separadas ou upload de arquivos */}

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isEditMode ? 'Salvar Alterações' : 'Salvar Título de Crédito'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
