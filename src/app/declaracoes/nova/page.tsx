"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Check, ChevronDown, Building2, FileText } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import * as SelectPrimitive from "@radix-ui/react-select"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

const declaracaoFormSchema = z.object({
  tipo: z.string({
    required_error: "Selecione o tipo de declaração",
  }),
  empresaId: z.string({
    required_error: "Selecione a empresa",
  }),
  competencia: z.string({
    required_error: "Informe a competência",
  }),
  prazo: z.string({
    required_error: "Informe o prazo",
  }),
  responsavel: z.string({
    required_error: "Informe o responsável",
  }),
  prioridade: z.enum(["baixa", "media", "alta"], {
    required_error: "Selecione a prioridade",
  }),
  observacoes: z.string().optional(),
  notificar: z.boolean(),
  lembrete: z.string().optional(),
})

type DeclaracaoFormValues = z.infer<typeof declaracaoFormSchema>

const defaultValues: Partial<DeclaracaoFormValues> = {
  notificar: true,
  observacoes: "",
}

const tiposDeclaracao = {
  DCTF: {
    id: "DCTF",
    nome: "DCTF - Declaração de Débitos e Créditos Tributários Federais",
    descricao: "Declaração mensal de débitos e créditos tributários federais.",
    prazoSugerido: (competencia: Date) => {
      const prazo = new Date(competencia)
      prazo.setMonth(prazo.getMonth() + 2)
      prazo.setDate(15)
      return prazo
    }
  },
  EFD_ICMS_IPI: {
    id: "EFD_ICMS_IPI",
    nome: "EFD ICMS/IPI",
    descricao: "Escrituração Fiscal Digital para ICMS e IPI.",
    prazoSugerido: (competencia: Date) => {
      const prazo = new Date(competencia)
      prazo.setMonth(prazo.getMonth() + 1)
      prazo.setDate(20)
      return prazo
    }
  },
  EFD_CONTRIBUICOES: {
    id: "EFD_CONTRIBUICOES",
    nome: "EFD Contribuições",
    descricao: "Escrituração Fiscal Digital para PIS/COFINS.",
    prazoSugerido: (competencia: Date) => {
      const prazo = new Date(competencia)
      prazo.setMonth(prazo.getMonth() + 2)
      prazo.setDate(10)
      return prazo
    }
  },
  SPED_CONTABIL: {
    id: "SPED_CONTABIL",
    nome: "SPED Contábil",
    descricao: "Sistema Público de Escrituração Digital Contábil.",
    prazoSugerido: (competencia: Date) => {
      const prazo = new Date(competencia)
      prazo.setFullYear(prazo.getFullYear() + 1)
      prazo.setMonth(4)
      prazo.setDate(31)
      return prazo
    }
  }
}

const empresas = [
  {
    id: "1",
    razaoSocial: "Empresa ABC LTDA",
    cnpj: "12.345.678/0001-90",
    regimeTributario: "Simples Nacional"
  },
  {
    id: "2",
    razaoSocial: "XYZ Comércio S.A.",
    cnpj: "98.765.432/0001-10",
    regimeTributario: "Lucro Real"
  }
]

export default function NovaDeclaracao() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)

  const form = useForm<DeclaracaoFormValues>({
    resolver: zodResolver(declaracaoFormSchema),
    defaultValues,
  })

  const watchTipo = form.watch("tipo")
  const watchCompetencia = form.watch("competencia")

  useEffect(() => {
    if (watchTipo && watchCompetencia) {
      const tipo = tiposDeclaracao[watchTipo as keyof typeof tiposDeclaracao]
      if (tipo) {
        const competencia = new Date(watchCompetencia + "-01")
        const prazoSugerido = tipo.prazoSugerido(competencia)
        form.setValue("prazo", format(prazoSugerido, "yyyy-MM-dd"))
      }
    }
  }, [watchTipo, watchCompetencia, form])

  const onSubmit = async (data: DeclaracaoFormValues) => {
    setIsSubmitting(true)
    try {
      // Simular chamada à API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      console.log("Dados do formulário:", data)
      toast.success("Declaração criada com sucesso!")
      router.push("/declaracoes")
    } catch (error) {
      toast.error("Erro ao criar declaração. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTipoDeclaracao = (id: string) => {
    return tiposDeclaracao[id as keyof typeof tiposDeclaracao]
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/declaracoes">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Nova Declaração</h1>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <Label>Tipo de Declaração</Label>
              <SelectPrimitive.Root
                onValueChange={(value) => form.setValue("tipo", value)}
                value={form.watch("tipo")}
              >
                <SelectPrimitive.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <SelectPrimitive.Value placeholder="Selecione o tipo" />
                  <SelectPrimitive.Icon>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </SelectPrimitive.Icon>
                </SelectPrimitive.Trigger>
                <SelectPrimitive.Portal>
                  <SelectPrimitive.Content className="relative z-50 min-w-[200px] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80">
                    <SelectPrimitive.Viewport className="p-1">
                      {Object.values(tiposDeclaracao).map((tipo) => (
                        <SelectPrimitive.Item
                          key={tipo.id}
                          value={tipo.id}
                          className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                        >
                          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                            <SelectPrimitive.ItemIndicator>
                              <Check className="h-4 w-4" />
                            </SelectPrimitive.ItemIndicator>
                          </span>
                          <div className="flex flex-col">
                            <SelectPrimitive.ItemText>{tipo.nome}</SelectPrimitive.ItemText>
                            <span className="text-xs text-muted-foreground">{tipo.descricao}</span>
                          </div>
                        </SelectPrimitive.Item>
                      ))}
                    </SelectPrimitive.Viewport>
                  </SelectPrimitive.Content>
                </SelectPrimitive.Portal>
              </SelectPrimitive.Root>
              {form.formState.errors.tipo && (
                <p className="text-sm text-destructive">{form.formState.errors.tipo.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <Label>Empresa</Label>
              <SelectPrimitive.Root
                onValueChange={(value) => form.setValue("empresaId", value)}
                value={form.watch("empresaId")}
              >
                <SelectPrimitive.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <SelectPrimitive.Value placeholder="Selecione a empresa" />
                  <SelectPrimitive.Icon>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </SelectPrimitive.Icon>
                </SelectPrimitive.Trigger>
                <SelectPrimitive.Portal>
                  <SelectPrimitive.Content className="relative z-50 min-w-[200px] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80">
                    <SelectPrimitive.Viewport className="p-1">
                      {empresas.map((empresa) => (
                        <SelectPrimitive.Item
                          key={empresa.id}
                          value={empresa.id}
                          className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                        >
                          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                            <SelectPrimitive.ItemIndicator>
                              <Check className="h-4 w-4" />
                            </SelectPrimitive.ItemIndicator>
                          </span>
                          <div className="flex flex-col">
                            <SelectPrimitive.ItemText>{empresa.razaoSocial}</SelectPrimitive.ItemText>
                            <span className="text-xs text-muted-foreground">
                              {empresa.cnpj} • {empresa.regimeTributario}
                            </span>
                          </div>
                        </SelectPrimitive.Item>
                      ))}
                    </SelectPrimitive.Viewport>
                  </SelectPrimitive.Content>
                </SelectPrimitive.Portal>
              </SelectPrimitive.Root>
              {form.formState.errors.empresaId && (
                <p className="text-sm text-destructive">{form.formState.errors.empresaId.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <Label>Competência</Label>
              <Input
                type="month"
                {...form.register("competencia")}
                className="h-10"
              />
              {form.formState.errors.competencia && (
                <p className="text-sm text-destructive">{form.formState.errors.competencia.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <Label>Prazo de Entrega</Label>
              <Input
                type="date"
                {...form.register("prazo")}
                className="h-10"
              />
              {form.formState.errors.prazo && (
                <p className="text-sm text-destructive">{form.formState.errors.prazo.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <Label>Responsável</Label>
              <Input
                type="text"
                {...form.register("responsavel")}
                placeholder="Nome do responsável"
              />
              {form.formState.errors.responsavel && (
                <p className="text-sm text-destructive">{form.formState.errors.responsavel.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <Label>Prioridade</Label>
              <SelectPrimitive.Root
                onValueChange={(value) => form.setValue("prioridade", value as "baixa" | "media" | "alta")}
                value={form.watch("prioridade")}
              >
                <SelectPrimitive.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <SelectPrimitive.Value placeholder="Selecione a prioridade" />
                  <SelectPrimitive.Icon>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </SelectPrimitive.Icon>
                </SelectPrimitive.Trigger>
                <SelectPrimitive.Portal>
                  <SelectPrimitive.Content className="relative z-50 min-w-[200px] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80">
                    <SelectPrimitive.Viewport className="p-1">
                      {[
                        { value: "baixa", label: "Baixa", description: "Pode ser feito quando houver tempo" },
                        { value: "media", label: "Média", description: "Deve ser feito em breve" },
                        { value: "alta", label: "Alta", description: "Precisa ser feito urgentemente" }
                      ].map((option) => (
                        <SelectPrimitive.Item
                          key={option.value}
                          value={option.value}
                          className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                        >
                          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                            <SelectPrimitive.ItemIndicator>
                              <Check className="h-4 w-4" />
                            </SelectPrimitive.ItemIndicator>
                          </span>
                          <div className="flex flex-col">
                            <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                            <span className="text-xs text-muted-foreground">{option.description}</span>
                          </div>
                        </SelectPrimitive.Item>
                      ))}
                    </SelectPrimitive.Viewport>
                  </SelectPrimitive.Content>
                </SelectPrimitive.Portal>
              </SelectPrimitive.Root>
              {form.formState.errors.prioridade && (
                <p className="text-sm text-destructive">{form.formState.errors.prioridade.message}</p>
              )}
            </div>
          </div>

          <Separator className="my-8" />

          <div className="space-y-4">
            <Label>Observações</Label>
            <Textarea
              {...form.register("observacoes")}
              placeholder="Adicione observações relevantes sobre a declaração..."
              className="min-h-[100px]"
            />
          </div>
        </Card>

        <div className="flex items-center justify-end gap-4">
          <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Descartar alterações</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja descartar as alterações? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Continuar editando</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => router.push("/declaracoes")}
                >
                  Sim, descartar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar declaração"}
          </Button>
        </div>
      </form>
    </div>
  )
} 