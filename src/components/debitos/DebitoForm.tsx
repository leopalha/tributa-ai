import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/services/api';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from '@/lib/toast-transition';
import { Loader2 } from 'lucide-react';
import { DebitoFiscal, DebitoStatus } from '@/types/prisma';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Schema Zod para o formulário (igual ao da API POST /api/debitos)
const debitoSchema = z.object({
  empresaId: z.string().cuid('ID da empresa inválido').optional(),
  tipoTributo: z.string().min(1, 'Tipo do tributo é obrigatório'),
  competencia: z.string().regex(/^\d{2}\/\d{4}$/, 'Competência inválida (MM/AAAA)'),
  valorOriginal: z.coerce.number().positive('Valor original deve ser positivo'),
  valorAtualizado: z.coerce.number().positive('Valor atualizado deve ser positivo').optional(),
  dataVencimento: z
    .string()
    .refine(date => !isNaN(Date.parse(date)), { message: 'Data de vencimento inválida' }),
  codigoReceita: z.string().optional(),
  documentoReferencia: z.string().optional(),
  descricao: z.string().max(500, 'Descrição muito longa').optional(),
});

type DebitoFormData = z.infer<typeof debitoSchema>;

// Tipo para prop de edição
type DebitoParaEdicao = DebitoFiscal;

interface DebitoFormProps {
  debitoParaEditar?: DebitoParaEdicao | null; // Prop para edição
  onSuccess?: (debitoId: string) => void;
}

interface EmpresaOption {
  id: string;
  razaoSocial: string;
}

export function DebitoForm({ debitoParaEditar, onSuccess }: DebitoFormProps) {
  const [loading, setLoading] = useState(false);
  const isEditMode = !!debitoParaEditar;
  const [empresasUsuario, setEmpresasUsuario] = useState<EmpresaOption[]>([]);
  const [loadingEmpresas, setLoadingEmpresas] = useState(true);

  useEffect(() => {
    setLoadingEmpresas(true);
    api
      .get<EmpresaOption[]>('/api/empresas')
      .then(data => setEmpresasUsuario(data))
      .catch(err => {
        console.error('Erro ao buscar empresas do usuário:', err);
        toast.error('Falha ao carregar lista de empresas.');
      })
      .finally(() => setLoadingEmpresas(false));
  }, []);

  const form = useForm<DebitoFormData>({
    resolver: zodResolver(debitoSchema),
    defaultValues: {
      empresaId: debitoParaEditar?.empresaId || '',
      tipoTributo: debitoParaEditar?.tipoTributo || '',
      competencia: debitoParaEditar?.competencia || '',
      valorOriginal: debitoParaEditar?.valorOriginal || 0,
      valorAtualizado: debitoParaEditar?.valorAtualizado,
      dataVencimento: debitoParaEditar
        ? new Date(debitoParaEditar.dataVencimento).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      codigoReceita: debitoParaEditar?.codigoReceita || '',
      documentoReferencia: debitoParaEditar?.documentoReferencia || '',
      descricao: debitoParaEditar?.descricao || '',
    },
  });

  useEffect(() => {
    if (isEditMode && debitoParaEditar) {
      form.reset({
        empresaId: debitoParaEditar.empresaId || undefined,
        tipoTributo: debitoParaEditar.tipoTributo,
        competencia: debitoParaEditar.competencia,
        valorOriginal: debitoParaEditar.valorOriginal,
        valorAtualizado: debitoParaEditar.valorAtualizado,
        dataVencimento: new Date(debitoParaEditar.dataVencimento).toISOString().split('T')[0],
        codigoReceita: debitoParaEditar.codigoReceita || undefined,
        documentoReferencia: debitoParaEditar.documentoReferencia || undefined,
        descricao: debitoParaEditar.descricao || undefined,
      });
    }
  }, [isEditMode, debitoParaEditar, form]);

  const onSubmit = async (data: DebitoFormData) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        empresaId: data.empresaId || undefined,
        valorAtualizado: data.valorAtualizado || undefined,
        codigoReceita: data.codigoReceita || undefined,
        documentoReferencia: data.documentoReferencia || undefined,
        descricao: data.descricao || undefined,
      };

      let response;
      if (isEditMode && debitoParaEditar) {
        console.log(`Atualizando Débito ${debitoParaEditar.id}:`, payload);
        delete (payload as any).userId;
        response = await api.put(`/api/debitos/${debitoParaEditar.id}`, payload);
        toast.success('Débito Fiscal atualizado com sucesso!');
      } else {
        console.log('Registrando novo Débito:', payload);
        response = await api.post('/api/debitos', payload);
        toast.success('Débito Fiscal registrado com sucesso!');
      }

      onSuccess?.(response.id);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error.message || 'Erro desconhecido';
      toast.error(`Falha ao ${isEditMode ? 'atualizar' : 'registrar'} débito: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? 'Editar Débito Fiscal' : 'Informações do Débito'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="empresaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa Associada (Opcional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loading || loadingEmpresas || isEditMode}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            loadingEmpresas ? 'Carregando...' : 'Nenhuma (Débito Pessoal)'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Nenhuma (Débito Pessoal)</SelectItem>
                      {empresasUsuario.map(emp => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.razaoSocial}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Selecione a empresa à qual este débito pertence.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="tipoTributo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo do Tributo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: ICMS, IRPJ, PIS"
                        {...field}
                        disabled={loading || isEditMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="competencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Competência (MM/AAAA)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: 08/2024"
                        {...field}
                        disabled={loading || isEditMode}
                        maxLength={7}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="valorOriginal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Original (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="1000.00"
                        {...field}
                        disabled={loading || isEditMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="valorAtualizado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Atualizado (R$) (Opc.)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="1050.00"
                        {...field}
                        disabled={loading || isEditMode}
                      />
                    </FormControl>
                    <FormDescription>Com juros/multa, se aplicável.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dataVencimento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Vencimento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={loading || isEditMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="codigoReceita"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código da Receita (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 1708" {...field} disabled={loading || isEditMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="documentoReferencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documento de Referência (Opc.)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Nº DARF, Guia"
                        {...field}
                        disabled={loading || isEditMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição / Observações (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detalhes adicionais..."
                      {...field}
                      disabled={loading || isEditMode}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isEditMode ? 'Salvar Alterações' : 'Registrar Débito'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
