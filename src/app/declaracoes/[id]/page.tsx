"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ArrowLeft, Building2, Calendar, FileText, Loader2, Pencil, Trash2, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CommentsSection } from "@/components/declaracao/comments-section"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface Declaracao {
  id: string
  tipo: string
  empresa: {
    id: string
    razaoSocial: string
    cnpj: string
  }
  competencia: string
  prazo: string
  responsavel: string
  prioridade: "baixa" | "media" | "alta"
  status: "pendente" | "em_andamento" | "concluida" | "atrasada"
  observacoes?: string
  anexos: Array<{
    id: string
    nome: string
    tamanho: string
    tipo: string
    dataUpload: Date
  }>
  notificar: boolean
  lembrete?: Date
  createdAt: Date
  updatedAt: Date
}

interface PageProps {
  params: {
    id: string
  }
}

const mockUser = {
  name: "João Silva",
  avatar: "https://github.com/shadcn.png"
}

const mockComments = [
  {
    id: "1",
    content: "Precisamos verificar os documentos anexados antes de prosseguir.",
    author: {
      name: "Maria Santos",
      avatar: "https://github.com/shadcn.png"
    },
    createdAt: new Date(2024, 2, 15, 10, 30)
  }
]

export default function DeclaracaoDetalhes({ params }: PageProps) {
  const router = useRouter()
  const [declaracao, setDeclaracao] = useState<Declaracao | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchDeclaracao = async () => {
      try {
        // Simular chamada à API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockDeclaracao: Declaracao = {
          id: params.id,
          tipo: "DCTF",
          empresa: {
            id: "1",
            razaoSocial: "Empresa ABC LTDA",
            cnpj: "12.345.678/0001-90"
          },
          competencia: "2024-02",
          prazo: "2024-03-20",
          responsavel: "João Silva",
          prioridade: "alta",
          status: "em_andamento",
          observacoes: "Necessário verificar os últimos lançamentos contábeis.",
          anexos: [
            {
              id: "1",
              nome: "balancete.pdf",
              tamanho: "2.5 MB",
              tipo: "application/pdf",
              dataUpload: new Date(2024, 2, 10)
            }
          ],
          notificar: true,
          lembrete: new Date(2024, 3, 15),
          createdAt: new Date(2024, 2, 1),
          updatedAt: new Date(2024, 2, 15)
        }

        setDeclaracao(mockDeclaracao)
      } catch (error) {
        toast.error("Erro ao carregar os detalhes da declaração")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDeclaracao()
  }, [params.id])

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      // Simular chamada à API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Declaração excluída com sucesso!")
      router.push("/declaracoes")
    } catch (error) {
      toast.error("Erro ao excluir declaração")
      setIsDeleting(false)
    }
  }

  const getPrioridadeColor = (prioridade: string) => {
    const colors = {
      baixa: "bg-green-500/10 text-green-500",
      media: "bg-yellow-500/10 text-yellow-500",
      alta: "bg-red-500/10 text-red-500"
    }
    return colors[prioridade as keyof typeof colors]
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pendente: "bg-yellow-500/10 text-yellow-500",
      em_andamento: "bg-blue-500/10 text-blue-500",
      concluida: "bg-green-500/10 text-green-500",
      atrasada: "bg-red-500/10 text-red-500"
    }
    return colors[status as keyof typeof colors]
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!declaracao) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-muted-foreground">Declaração não encontrada</p>
        <Button asChild>
          <Link href="/declaracoes">Voltar para lista</Link>
        </Button>
      </div>
    )
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
          <h1 className="text-2xl font-bold">Detalhes da Declaração</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/declaracoes/${params.id}/editar`}>
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir declaração</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir esta declaração? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Excluindo...
                    </>
                  ) : (
                    "Sim, excluir"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Informações Gerais</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tipo de Declaração</p>
                  <p className="font-medium">{declaracao.tipo}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Building2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Empresa</p>
                  <p className="font-medium">{declaracao.empresa.razaoSocial}</p>
                  <p className="text-sm text-muted-foreground">{declaracao.empresa.cnpj}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Competência</p>
                  <p className="font-medium">
                    {format(new Date(declaracao.competencia), "MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Prazo</p>
                  <p className="font-medium">
                    {format(new Date(declaracao.prazo), "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <User className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Responsável</p>
                  <p className="font-medium">{declaracao.responsavel}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-semibold mb-4">Status</h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className={getPrioridadeColor(declaracao.prioridade)}>
                  Prioridade {declaracao.prioridade}
                </Badge>
                <Badge className={getStatusColor(declaracao.status)}>
                  {declaracao.status.replace("_", " ")}
                </Badge>
              </div>
              {declaracao.observacoes && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">{declaracao.observacoes}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-semibold mb-4">Anexos</h2>
            {declaracao.anexos.length > 0 ? (
              <div className="space-y-2">
                {declaracao.anexos.map((anexo) => (
                  <div
                    key={anexo.id}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{anexo.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          {anexo.tamanho} • {format(anexo.dataUpload, "dd/MM/yyyy HH:mm")}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum anexo disponível</p>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Notificações</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Notificações por e-mail</p>
                <Badge variant={declaracao.notificar ? "default" : "secondary"}>
                  {declaracao.notificar ? "Ativadas" : "Desativadas"}
                </Badge>
              </div>
              {declaracao.lembrete && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Próximo lembrete</p>
                  <p className="text-sm">
                    {format(declaracao.lembrete, "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <CommentsSection
              declaracaoId={params.id}
              currentUser={mockUser}
              initialComments={mockComments}
            />
          </Card>
        </div>
      </div>
    </div>
  )
} 